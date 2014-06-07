module.exports = {
    remove: remove
};

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
    res.queryResponse(
        "MATCH (w:Whisky {id:{id}}) " +
        "OPTIONAL MATCH (w)-[r]-() " +
        "DELETE w, r",
        {id: id});
}

function removeDistillery(name, res) {
    res.queryResponse(
        "MATCH (n:Distillery {name:{name}}) WHERE NOT((n)--()) DELETE n", 
        {name: name.toLowerCase()});
}

function removeRegion(name, res) {
    res.queryResponse(
        "MATCH (n:Region {name:{name}}) WHERE NOT((n)--()) DELETE n", 
        {name: name.toLowerCase()});
}

function removeBottler(name, res) {
    res.queryResponse(
        "MATCH (n:Bottler {name:{name}}) WHERE NOT((n)--()) DELETE n", 
        {name: name.toLowerCase()});
}

function removeTasting(name, res) {
    res.queryResponse(
        "MATCH (n:Tasting {name:{name}}) WHERE NOT((n)--()) DELETE n", 
        {name: name.toLowerCase()});
}

function removeTastingNote(id, res) {
    res.queryResponse(
        "MATCH (tn:TastingNote {id:{id}}) " +
        "OPTIONAL MATCH (tn)-[r]-() " +
        "DELETE tn, r",
        {id: id});
}
