var shortid = require("shortid");

module.exports = {
    set: set
};

function set(parsed, res) {
    switch (parsed.kind) {
        case "whisky": setWhisky(parsed, res); break;
        case "distillery": setDistillery(parsed, res); break;
        case "tasting": setTasting(parsed, res); break;
        case "tastingNote": setTastingNote(parsed, res); break;
        case "user": setUser(parsed, res); break;
    }
}

function setWhisky(parsed, res) {
    var key = parsed.modifier[0];
    var value = parsed.modifier[1];
    if (key == "bottler") {
        res.queryResponse("MATCH (n:Whisky {id:{id}}), (newBottler:Bottler {name:{bottler}}) " +
            "OPTIONAL MATCH (n)-[rel:BOTTLER]->(:Bottler) " +
            "WITH n, newBottler, collect(rel) AS rels " + 
            "FOREACH(rel IN rels | DELETE rel) " + 
            "MERGE (n)-[:BOTTLER]->(newBottler) " + 
            "RETURN {item:n, bottler:newBottler, kind:head(labels(n))} AS result",
            {id: parsed.id, bottler: value.toLowerCase()});
    } else {
        res.queryResponse("MATCH (n:Whisky {id:{id}}) " +
            "SET n." + key + " = {value} " +
            "WITH n " +
            "OPTIONAL MATCH (n)<-[o:OWNS]-(u:User) " +
            "RETURN {item:n, numBottles:count(o), numOwners:count(distinct u), kind:head(labels(n))} AS result",
            {id: parsed.id, value: value});
    }
}

function setDistillery(parsed, res) {
    var name = parsed.name.toLowerCase();
    var key = parsed.modifier[0];
    var value = parsed.modifier[1];
    switch (key) {
        case "closed": res.queryResponse("MATCH (n:Distillery {name:{name}}) " +
                "OPTIONAL MATCH (n)-[:REGION]->(r:Region) SET n.closed = true " +
                "RETURN {item:n, region:r, kind:head(labels(n))} AS result",
            {name: name}); break;
        case "region": res.queryResponse(
            "MATCH (n:Distillery {name:{distillery}}), (newRegion:Region {name:{region}}) " +
                "OPTIONAL MATCH (n)-[rel:REGION]->(:Region) " +
                "WITH n, newRegion, collect(rel) AS rels " + 
                "FOREACH(rel IN rels | DELETE rel) " + 
                "MERGE (n)-[:REGION]->(newRegion) " + 
                "RETURN {item:n, region:newRegion, kind:head(labels(n))} AS result",
            {distillery: name, region:value.toLowerCase()}); break;
    }
}

function setTasting(parsed, res) {
    var name = parsed.name.toLowerCase();
    var date = parsed.date;
    var whisky = parsed.whisky;
    var order = parsed.order;

    if (order && whisky) {
        res.queryResponse("MATCH (n:Tasting {name:{name}})-[:INCLUDES]->(tw:TastingWhisky)-[:WHISKY]->(w:Whisky {id:{whisky}}) " +
                "SET tw.order = {order} " + 
                "RETURN {item:n, order:tw.order, kind:head(labels(n))} AS result",
            {name:name, whisky:whisky, order:order});
    } else if (date) {
        res.queryResponse("MATCH (n:Tasting {name:{name}}) SET n.date = {date} RETURN {item:n, kind:head(labels(n))} AS result",
            {name:name, date:date});
    } else if (whisky) {
        res.queryResponse("MATCH (n:Tasting {name:{name}}), (w:Whisky {id:{whisky}}) " +
                "MERGE (n)-[:INCLUDES]->(tw:TastingWhisky)-[:WHISKY]->(w) " +
                "RETURN {item:n, kind:head(labels(n))} AS result",
            {name:name, whisky:whisky});
    }
}

function setTastingNote(parsed, res) {
    var id = parsed.id;
    var user = parsed.user.toLowerCase();
    res.queryResponse("MATCH (tn:TastingNote {id:{id}}), (u:User {name:{user}}) " +
        "OPTIONAL MATCH (tn)-[r:NOTE_BY]->(:User) " +
        "WITH tn, u, collect(r) as rels " +
        "FOREACH (rel IN rels | DELETE rel) " +
        "MERGE (tn)-[:NOTE_BY]->(u) " +
        "RETURN {item:tn, user:u, kind:head(labels(tn))} AS result",
        {id:id, user:user});
}

function setUser(parsed, res) {
    var params = {
        user: parsed.user.toLowerCase(),
        whisky: parsed.whisky,
        bottle: shortid.generate()
    };
    res.queryResponse("MATCH (u:User {name:{user}}), (w:Whisky {id:{whisky}}) CREATE (u)-[o:OWNS {bottle:{bottle}}]->(w) " + 
        "RETURN {item:o, kind:type(o)} AS result",
        params);
}
