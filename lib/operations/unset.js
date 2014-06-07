module.exports = {
    unset: unset
};

function unset(parsed, res) {
    switch (parsed.kind) {
        case "whisky": unsetWhisky(parsed, res); break;
        case "tasting": unsetTasting(parsed, res); break;
        case "user": unsetUser(parsed, res); break;
    }
}

function unsetWhisky(parsed, res) {
    var key = parsed.modifier[0];
    if (key != "bottler") {
        res.queryResponse("MATCH (n:Whisky {id:{id}, " + key + ": {value}}) REMOVE n." + key + " RETURN {item:n, kind:head(labels(n))} AS result",
            {id: parsed.id, value: parsed.modifier[1]});
    }
}

function unsetTasting(parsed, res) {
    var name = parsed.name.toLowerCase();
    var whisky = parsed.whisky;
    res.queryResponse("MATCH (n:Tasting {name:{name}}), (w:Whisky {id:{whisky}}) " +
            "MATCH (n)-[r1:INCLUDES]->(tw:TastingWhisky)-[r2:WHISKY]->(w) " +
            "WHERE NOT((tw)<-[:NOTE_FOR]-()) " +
            "DELETE r1, r2, tw",
        {name:name, whisky:whisky});
}

function unsetUser(parsed, res) {
    var params = {
        user: parsed.user.toLowerCase(),
        bottle: parsed.bottle
    };
    res.queryResponse("MATCH (u:User {name:{user}})-[o:OWNS {bottle:{bottle}}]->() DELETE o", 
        params);
}
