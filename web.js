var express = require("express");
var logfmt = require("logfmt");
var neo4j = require("neo4j");
var fs = require("fs");
var shortid = require("shortid");
var bodyParser = require('body-parser')

var PEG = require("pegjs");
var parser = require("./parser.js");

var db = new neo4j.GraphDatabase("http://localhost:7474");

var app = express();
app.use(bodyParser());
app.use(logfmt.requestLogger());

app.use(express.static("./public"));

app.post('/app', function(req, res) {
    var parsed;
    try {
        parsed = parser.parse(req.body.query);
    } catch (e) {
        console.log("Parsing failed: " + e);
        res.send({error:e});
    }

    try {
        interpret(parsed, res);
    } catch (e) {
        console.log("Operation failed: " + e);
        res.send({error:e});
    }
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});

function interpret(parsed, res) {
    switch(parsed.operation) {
        case "listEverything": listEverything(res); break;
        case "listAll": listAllOfKind(parsed.kind, res); break;
        case "add": add(parsed, res); break;
        case "set": set(parsed, res); break;
        case "unset": unset(parsed, res); break;
        case "remove": remove(parsed, res); break;
    }
}

function listEverything(res) {
    queryResponse("MATCH (n) " + 
        "OPTIONAL MATCH (n)-[:BOTTLER]->(b:Bottler) " +
        "OPTIONAL MATCH (n)-[:REGION]->(r:Region) " + 
        "RETURN {item:n, region:r, bottler:b, kind:head(labels(n))} AS result ORDER BY n.name", {}, res);
}

function listAllOfKind(kind, res) {
    switch (kind) {
        case "whisky": queryResponse(
            "MATCH (n:Whisky) " + 
                "OPTIONAL MATCH (n)-[:BOTTLER]->(b:Bottler) " +
                "RETURN {item:n, bottler:b, kind:head(labels(n))} AS result ORDER BY n.name", {}, res); break;
        case "distillery": queryResponse(
            "MATCH (d:Distillery) OPTIONAL MATCH (d)-[:REGION]->(r:Region) RETURN {item:d, region:r, kind:head(labels(d))} AS result ORDER BY d.name, r.name", 
            {}, res); break;
        case "tasting": queryResponse(
            "MATCH (t:Tasting) " + 
                "OPTIONAL MATCH (t)-[:INCLUDES]->(tw:TastingWhisky)-[:WHISKY]->(w:Whisky) " +
                "OPTIONAL MATCH (w)-[:BOTTLER]->(b:Bottler) " +
                "RETURN {item:t, includedWhisky:collect({item:w, bottler:b, kind:head(labels(w))}), kind:head(labels(t))} AS result ORDER BY t.date",
            {}, res); break;
        case "tastingNote": queryResponse(
            "MATCH (tn:TastingNote)-[:NOTE_FOR]->(tw:TastingWhisky)-[:WHISKY]->(w:Whisky), (t:Tasting)-[:INCLUDES]->(tw) " + 
                "OPTIONAL MATCH (w)-[:BOTTLER]->(b:Bottler) " +
                "WITH w, b, collect({item:tn, kind:head(labels(tn))}) AS notes, t " +
                "RETURN {item:w, bottler:b, tastings:collect({item:t, notes:notes, kind:head(labels(t))}), kind:'TastingNoteSplat'} AS result",
            {}, res); break;
        default: queryResponse("MATCH (n:" + kind.capitalize() + ") RETURN {item:n, kind:head(labels(n))} AS result ORDER BY n.name", {}, res); break;
    }
}

function add(parsed, res) {
    switch (parsed.kind) {
        case "region": addRegion(parsed.name, res); break;
        case "distillery": addDistillery(parsed.name, res); break;
        case "bottler": addBottler(parsed.name, res); break;
        case "whisky": addWhisky(parsed.definition, res); break;
        case "tasting": addTasting(parsed.name, parsed.date, res); break;
        case "tastingNote": addTastingNote(parsed.tasting, parsed.whisky, parsed.modifiers, res); break;
    }
}

function addRegion(name, res) {
    queryResponse( 
        "MERGE (n:Region {name: {name}}) ON CREATE SET n.displayName = {displayName} RETURN {item:n, kind:head(labels(n))} AS result", 
        {"name":name.toLowerCase(), "displayName": name},
        res);
}

function addDistillery(name, res) {
    queryResponse( 
        "MERGE (n:Distillery {name: {name}}) ON CREATE SET n.displayName = {displayName} RETURN {item:n, kind:head(labels(n))} AS result", 
        {"name":name.toLowerCase(), "displayName": name},
        res);
}

function addBottler(name, res) {
    queryResponse( 
        "MERGE (n:Bottler {name: {name}}) ON CREATE SET n.displayName = {displayName} RETURN {item:n, kind:head(labels(n))} AS result", 
        {"name":name.toLowerCase(), "displayName": name},
        res);
}

function addWhisky(def, res) {
    console.log(def);
    var name = getWhiskyName(def);
    var properties = {
        name: name.toLowerCase(),
        displayName: name,
        distillery: def.distillery,
        specialName: def.specialName,
        id: shortid.generate()
    };
    for (var mod in def.modifiers) properties[mod] = def.modifiers[mod];
    for (var key in properties) if (!properties[key]) delete properties[key];
    delete properties.bottler;

    var bottler = def.modifiers.bottler ? def.modifiers.bottler.toLowerCase() : null;
    var params = {distillery: def.distillery.toLowerCase(), whisky: properties, bottler: bottler};
    
    var query =
        "MATCH (d:Distillery {name:{distillery}}) " + 
        (bottler ? "MATCH (b:Bottler {name:{bottler}}) " : "" ) + 
        "CREATE (n:Whisky {whisky}) " +
        "MERGE (n)-[:DISTILLERY]->(d) " +
        (bottler ? "MERGE (n)-[:BOTTLER]->(b) " : "" ) + 
        (bottler ? "RETURN {item:n, bottler: b, kind:head(labels(n))} AS result" : "RETURN {item:n, kind:head(labels(n))} AS result" );
    
    queryResponse(
        query,
        params,
        res);
}

function addTasting(name, date, res) {
    queryResponse(
        "MERGE (n:Tasting {name: {name}}) ON CREATE SET n.displayName = {displayName}, n.date = {date} RETURN {item:n, kind:head(labels(n))} AS result", 
        {"name":name.toLowerCase(), "displayName":name, date:date},
        res);
}

function addTastingNote(tasting, whisky, modifiers, res) {
    var note = {id:shortid.generate()};

    var nose = modifiers["nose"];
    var palate = modifiers["palate"];
    var finish = modifiers["finish"];
    var overall = modifiers["overall"];
    var points = modifiers["points"];

    if (nose) {
        note.nose = nose[0];
        if (nose[1]) note.nosePoints = nose[1];
    }
    if (palate) {
        note.palate = palate[0];
        if (palate[1]) note.palatePoints = palate[1];
    }
    if (finish) {
        note.finish = finish[0];
        if (finish[1]) note.finishPoints = finish[1];
    }
    if (overall) {
        note.overall = overall[0];
        if (overall[1]) note.overallPoints = overall[1];
    }
    if (points) {
        note.points = points;
    }

    queryResponse(
        "MATCH (t:Tasting {name:{tasting}})-[:INCLUDES]->(tw:TastingWhisky)-[:WHISKY]->(w:Whisky {id:{whisky}}) " +
            "CREATE (tn:TastingNote {note}) " +
            "MERGE (tn)-[:NOTE_FOR]->(tw) " +
            "RETURN {item:tn, kind:head(labels(tn))} AS result",
        {tasting:tasting.toLowerCase(), whisky:whisky, note:note}, 
        res);
}

function getWhiskyName(def) {
    return def.distillery + (def.specialName ? (" " + def.specialName) : "") +
        (def.modifiers.caskingBottling ? " " + def.modifiers.caskingBottling[0] + "/" + def.modifiers.caskingBottling[1] : "") + 
        (def.modifiers.year ? " " + def.modifiers.year : "") + 
        (def.modifiers.age ? " " + def.modifiers.age + "yo" : "");
}

/////////// SET ///////////

function set(parsed, res) {
    switch (parsed.kind) {
        case "whisky": setWhisky(parsed, res); break;
        case "distillery": setDistillery(parsed, res); break;
        case "tasting": setTasting(parsed, res); break;
    }
}

function setWhisky(parsed, res) {
    var key = parsed.modifier[0];
    if (key != "bottler") {
        queryResponse("MATCH (n:Whisky {id:{id}}) SET n." + key + " = {value} RETURN {item:n, kind:head(labels(n))} AS result",
            {id: parsed.id, value: parsed.modifier[1]},
            res);
    }
}

function setDistillery(parsed, res) {
    var name = parsed.name.toLowerCase();
    var key = parsed.modifier[0];
    var value = parsed.modifier[1];
    switch (key) {
        case "closed": queryResponse("MATCH (n:Distillery {name:{name}}) " +
                "OPTIONAL MATCH (n)-[:REGION]->(r:Region) SET n.closed = true " +
                "RETURN {item:n, region:r, kind:head(labels(n))} AS result",
            {name: name}, res); break;
        case "region": queryResponse(
            "MATCH (n:Distillery {name:{distillery}}), (newRegion:Region {name:{region}}) " +
                "OPTIONAL MATCH (n)-[rel:REGION]->(:Region) " +
                "WITH n, newRegion, collect(rel) AS rels " + 
                "FOREACH(rel IN rels | DELETE rel) " + 
                "MERGE (n)-[:REGION]->(newRegion) " + 
                "RETURN {item:n, region:newRegion, kind:head(labels(n))} AS result",
            {distillery: name, region:value.toLowerCase()}, res); break;
    }
}

function setTasting(parsed, res) {
    var name = parsed.name.toLowerCase();
    var date = parsed.date;
    var whisky = parsed.whisky;

    if (date) {
        queryResponse("MATCH (n:Tasting {name:{name}}) SET n.date = {date} RETURN {item:n, kind:head(labels(n))} AS result",
            {name:name, date:date}, res);
    } else if (whisky) {
        queryResponse("MATCH (n:Tasting {name:{name}}), (w:Whisky {id:{whisky}}) " +
                "MERGE (n)-[:INCLUDES]->(tw:TastingWhisky)-[:WHISKY]->(w) RETURN {item:n, kind:head(labels(n))} AS result",
            {name:name, whisky:whisky}, res);
    }
}

//////////// UNSET /////////////

function unset(parsed, res) {
    switch (parsed.kind) {
        case "whisky": unsetWhisky(parsed, res); break;
        case "tasting": unsetTasting(parsed, res); break;
    }
}

function unsetWhisky(parsed, res) {
    var key = parsed.modifier[0];
    if (key != "bottler") {
        queryResponse("MATCH (n:Whisky {id:{id}, " + key + ": {value}}) REMOVE n." + key + " RETURN {item:n, kind:head(labels(n))} AS result",
            {id: parsed.id, value: parsed.modifier[1]},
            res);
    }
}

function unsetTasting(parsed, res) {
    var name = parsed.name.toLowerCase();
    var whisky = parsed.whisky;
    queryResponse("MATCH (n:Tasting {name:{name}}), (w:Whisky {id:{whisky}}) " +
            "MATCH (n)-[r1:INCLUDES]->(tw:TastingWhisky)-[r2:WHISKY]->(w) " +
            "WHERE NOT((tw)<-[:NOTE_FOR]-()) " +
            "DELETE r1, r2, tw",
        {name:name, whisky:whisky}, res);
}

/////////// REMOVE ////////////

function remove(parsed, res) {
    switch (parsed.kind) {
        case "whisky": removeWhisky(parsed.id, res); break;
        case "distillery": removeDistillery(parsed.name, res); break;
        case "region": removeRegion(parsed.name, res); break;
        case "bottler": removeBottler(parsed.name, res); break;
        case "tasting": removeTasting(parsed.name, res); break;
        case "tastingNote": removeTastingNote(parsed.id, res); break;
    }
}

function removeWhisky(id, res) {
    queryResponse(
        "MATCH (w:Whisky {id:{id}}) " +
        "OPTIONAL MATCH (w)-[r]-() " +
        "DELETE w, r",
        {id: id},
        res);
}

function removeDistillery(name, res) {
    queryResponse(
        "MATCH (n:Distillery {name:{name}}) WHERE NOT((n)--()) DELETE n", 
        {name: name.toLowerCase()},
        res);
}

function removeRegion(name, res) {
    queryResponse(
        "MATCH (n:Region {name:{name}}) WHERE NOT((n)--()) DELETE n", 
        {name: name.toLowerCase()},
        res);
}

function removeBottler(name, res) {
    queryResponse(
        "MATCH (n:Bottler {name:{name}}) WHERE NOT((n)--()) DELETE n", 
        {name: name.toLowerCase()},
        res);
}

function removeTasting(name, res) {
    queryResponse(
        "MATCH (n:Tasting {name:{name}}) WHERE NOT((n)--()) DELETE n", 
        {name: name.toLowerCase()},
        res);
}

function removeTastingNote(id, res) {
    queryResponse(
        "MATCH (tn:TastingNote {id:{id}}) " +
        "OPTIONAL MATCH (tn)-[r]-() " +
        "DELETE tn, r",
        {id: id},
        res);
}

function queryResponse(query, params, res) {
    db.query(query, params, function(err, data) {
        if (err) {
            console.log("Query failed: " + err);
            res.send({error:err});
        }
        else {
            res.send({result:data});
        }
    });
}

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

