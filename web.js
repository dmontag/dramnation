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
        case "listAll": listAllOfKind(parsed.kind, res); break;
        case "add": add(parsed, res); break;
        case "remove": remove(parsed, res); break;
    }
}

function listAllOfKind(kind, res) {
    queryResponse("MATCH (n:" + kind.capitalize() + ") RETURN n, labels(n) ORDER BY n.name", {}, res);
}

function add(parsed, res) {
    switch (parsed.kind) {
        case "distillery": addDistillery(parsed.name, res); break;
        case "whisky": addWhisky(parsed.definition, res); break;
    }
}

function addDistillery(name, res) {
    queryResponse( 
        "MERGE (n:Distillery {name: {name}}) ON CREATE SET n.displayName = {displayName} RETURN n, labels(n)", 
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

    var params = {distillery: def.distillery.toLowerCase(), whisky: properties};
    
    queryResponse(
        "MATCH (d:Distillery {name:{distillery}}) " + 
            "CREATE (n:Whisky {whisky}) " +
            "MERGE (n)-[:DISTILLERY]->(d) " +
            "RETURN n, labels(n)",
        params,
        res);
}

function getWhiskyName(def) {
    return def.distillery + (def.specialName ? (" " + def.specialName) : "") +
        (def.modifiers.caskingBottling ? " " + def.modifiers.caskingBottling[0] + "/" + def.modifiers.caskingBottling[1] : "") + 
        (def.modifiers.year ? " " + def.modifiers.year : "") + 
        (def.modifiers.age ? " " + def.modifiers.age + "yo" : "");
}

function remove(parsed, res) {
    switch (parsed.kind) {
        case "whisky": removeWhisky(parsed.id, res); break;
        case "distillery": removeDistillery(parsed.name, res); break;
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
        "MATCH (d:Distillery {name:{name}}) WHERE NOT((d)--()) DELETE d", 
        {name: name.toLowerCase()},
        res);
}

function queryResponse(query, params, res) {
    db.query(query, params, function(err, data) {
        if (err) {
            console.log("Query failed: " + err);
            res.send({error:err});
        } else {
            res.send({result:data});
        }
    });
}

// function vlist(args) {
//     var type = args[0];
//     var owner = args[1];
//     switch (type) {
//         case "owner":
//             return [
//                 "MATCH (n:Whisky)-[:OWNER]->(o:Owner), (n)-[:DISTILLERY]->(d:Distillery) WHERE o.name = {owner} RETURN [d.displayName, n] AS result", 
//                 {"owner":owner.toLowerCase()}
//             ];
//         case "distillery":
//             return [
//                 "MATCH (n:Whisky)-[:DISTILLERY]->(o:Distillery) WHERE o.name = {owner} RETURN [o.displayName, n] AS result", 
//                 {"owner":owner.toLowerCase()}
//             ];
//         case "bottler":
//             return [
//                 "MATCH (n:Whisky)-[:BOTTLER]->(o:Bottler), (n)-[:Distillery]->(o:Distillery) WHERE o.name = {owner} RETURN [d.displayName, n] AS result", 
//                 {"owner":owner.toLowerCase()}
//             ];
//     }
// }

// function vadd(args) {
//     var type = args[0];
//     var owner = args[1];
//     switch (type) {
//         case "owner":
//         case "distillery":
//         case "bottler":
//             return [
//                 "MERGE (n:" + args[0].capitalize() + " {name: {name}}) ON CREATE SET n.displayName = {displayName} RETURN count(*)", 
//                 {"name":owner.toLowerCase(), "displayName": owner}
//             ];
//         case "whisky":
//             console.log("adding whisky");
//             var spec = args[2];
//             console.log(spec);

//             var params = {};
//             spec.mods.forEach(function(d) {
//                 console.log(d);
//                 params[d[0]] = d[1];
//             });
//             params["owner"] = owner.toLowerCase();
//             params["distillery"] = spec.distillery.toLowerCase();
//             console.log(params);

//             var properties = [];
//             if (spec.name != null) {
//                 properties.push("name:{name}");
//                 properties.push("displayName:{displayName}");
//                 params["name"] = spec.name.toLowerCase();
//                 params["displayName"] = spec.name;
//             }
//             if (params["cask strength"]) {
//                 properties.push("caskStrength:{caskStrength}");
//             }
//             if (params["single cask"]) {
//                 properties.push("singleCask:{singleCask}");
//             }
//             if (params["age"]) {
//                 properties.push("age:{age}");
//             }
//             if (params["year"]) {
//                 properties.push("year:{year}");
//             }
//             if (params["percentage"]) {
//                 properties.push("percentage:{percentage}");
//             }
//             console.log(properties);

//             var query = "MATCH (d:Distillery {name:{distillery}}) MATCH (o:Owner {name:{owner}}) MERGE (w:Whisky {" + properties.join(",") + "}) MERGE (w)-[:DISTILLERY]->(d) MERGE (w)-[:OWNER]->(o) RETURN count(*)";
//             console.log(query);

//             return [query, params];
//     }
//     console.log("shouldn't get here");
// }

// function vupdate(args) {

// }

// function vremove(args) {

// }

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

