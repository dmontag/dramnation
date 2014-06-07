
module.exports = {
    everything: listEverything,
    allOfKind: listAllOfKind
};

function listEverything(res) {
    res.queryResponse("MATCH (n) " + 
        "OPTIONAL MATCH (n)-[:BOTTLER]->(b:Bottler) " +
        "OPTIONAL MATCH (n)-[:REGION]->(r:Region) " + 
        "RETURN {item:n, region:r, bottler:b, kind:head(labels(n))} AS result ORDER BY n.name", {});
}

function listAllOfKind(kind, res) {
    switch (kind) {
        case "whisky": res.queryResponse(
            "MATCH (n:Whisky) " + 
                "OPTIONAL MATCH (n)-[:BOTTLER]->(b:Bottler) " +
                "OPTIONAL MATCH (n)<-[o:OWNS]-(u:User) " +
                "RETURN {item:n, bottler:b, numBottles:count(o), numOwners:count(distinct u), kind:head(labels(n))} AS result ORDER BY n.name", {}, res); break;
        case "distillery": res.queryResponse(
            "MATCH (d:Distillery) OPTIONAL MATCH (d)-[:REGION]->(r:Region) RETURN {item:d, region:r, kind:head(labels(d))} AS result ORDER BY d.name, r.name", 
            {}); break;
        case "tasting": res.queryResponse(
            "MATCH (t:Tasting) " + 
                "OPTIONAL MATCH (t)-[:INCLUDES]->(tw:TastingWhisky)-[:WHISKY]->(w:Whisky) " +
                "OPTIONAL MATCH (w)-[:BOTTLER]->(b:Bottler) " +
                "OPTIONAL MATCH (w)<-[o:OWNS]-(u:User) " +
                "WITH t, tw, w, b, count(o) as numBottles, count(distinct u) as numOwners ORDER BY t.date DESC, tw.order " +
                "RETURN {item:t, includedWhisky:collect({item:w, order:tw.order, bottler:b, numBottles:numBottles, numOwners:numOwners, kind:head(labels(w))}), kind:head(labels(t))} AS result",
            {}); break;
        case "tastingNote": res.queryResponse(
            "MATCH (tn:TastingNote)-[:NOTE_FOR]->(tw:TastingWhisky)-[:WHISKY]->(w:Whisky), (t:Tasting)-[:INCLUDES]->(tw) " + 
                "OPTIONAL MATCH (w)-[:BOTTLER]->(b:Bottler) " +
                "OPTIONAL MATCH (tn)-[:NOTE_BY]->(u:User) " +
                "WITH w, b, t, collect({item:tn, user:u, kind:head(labels(tn))}) AS notes " +
                "WITH w, b, collect({item:t, notes:notes, kind:head(labels(t))}) AS tastings " +
                "OPTIONAL MATCH (w)<-[o:OWNS]-(u:User) " +
                "RETURN {item:w, bottler:b, numBottles:count(o), numOwners:count(distinct u), tastings:tastings, kind:'TastingNoteSplat'} AS result ORDER BY w.name",
            {}); break;
        case "user": res.queryResponse(
            "MATCH (u:User) " +
            "RETURN {item:u, kind:head(labels(u))} AS result",
            {}); break;
        case "bottle":  res.queryResponse(
            "MATCH (u:User)-[o:OWNS]->(w:Whisky) " +
            "OPTIONAL MATCH (w)-[:BOTTLER]->(b:Bottler) " +
            "WITH u, o, w, b ORDER BY u.name, w.name " +
            "RETURN {item:u, bottles:collect({item:o, whisky:{item:w, bottler:b, kind:head(labels(w))}}), kind:'OWNSByUser'} AS result",
            {}); break;
        default: res.queryResponse("MATCH (n:" + kind.capitalize() + ") RETURN {item:n, kind:head(labels(n))} AS result ORDER BY n.name", {}, res); break;
    }
}