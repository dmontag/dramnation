module.exports = {
    find: find
};

function find(parsed, res) {
    switch(parsed.kind) {
        case "whisky": findWhisky(parsed.ast, res); break;
        case "tastingNote": findTastingNote(parsed.phrase, res); break;
        case "distillery": findDistillery(parsed.region, parsed.ast, res); break;
    }
}

function findWhisky(ast, res) {
    var params = {};

    var where = buildCypherWhereClause(ast);

    res.queryResponse(
        "MATCH (w:Whisky)-[:DISTILLERY]->(d:Distillery) " +
        "OPTIONAL MATCH (d)-[:REGION]->(r:Region) " +
        "OPTIONAL MATCH (w)-[:BOTTLER]->(b:Bottler) " +
        "OPTIONAL MATCH (w)<-[o:OWNS]-(u:User) " +
        "OPTIONAL MATCH (tn:TastingNote)-[:NOTE_FOR]->(tw:TastingWhisky)-[:WHISKY]->(w) " +
        "WITH w, d, r, b, o, u, tn " +
        "WHERE " + where + " " +
        "WITH distinct w, d, r, b, o, u " +
        "RETURN {item:w, bottler:b, numBottles:count(o), numOwners:count(distinct u), kind:head(labels(w))} AS result ORDER BY w.name",
        params);
}

function buildCypherWhereClause(ast) {
    var kind = ast.kind
    switch(kind) {
        case "and":
        case "or":
            var left = ast.input[0];
            var right = ast.input[1];
            return "(" + buildCypherWhereClause(left) + " " + kind.toUpperCase() + " " + buildCypherWhereClause(right) + ")";
        case "is":
            if (ast.input == "owned") return "(u IS NOT NULL)";
            return "(w." + ast.input + "=true)";
        case "=":
        case ">":
        case "<":
            return "(w." + ast.input[0] + kind + JSON.stringify(ast.input[1]) + ")";
        case "bottler":
            return "(b IS NOT NULL AND b.name = " + JSON.stringify(ast.input.toLowerCase()) + ")";
        case "distillery":
            return "(d." + ast.input[0] + " = " + JSON.stringify(ast.input[1]).toLowerCase() + ")";
        case "region":
            return "(r.name = " + JSON.stringify(ast.input.toLowerCase()) + ")";
        case "not":
            return "NOT(coalesce(" + buildCypherWhereClause(ast.input) + ", false))";
        case "note":
            return "((coalesce(tn.nose,'')+coalesce(tn.palate,'')+coalesce(tn.finish,'')+coalesce(tn.overall,'')) =~ '(?i).*" + ast.input.replace("'", "\\'") + ".*')";
    }
}

function findTastingNote(phrase, res) {
    // Duplicated from list.js
    res.queryResponse("MATCH (tn:TastingNote) " +
        "WHERE ((coalesce(tn.nose,'')+coalesce(tn.palate,'')+coalesce(tn.finish,'')+coalesce(tn.overall,'')) =~ {pattern}) " +
        "WITH tn " + 
        "MATCH (tn)-[:NOTE_FOR]->(tw:TastingWhisky)-[:WHISKY]->(w:Whisky), (t:Tasting)-[:INCLUDES]->(tw) " + 
        "OPTIONAL MATCH (w)-[:BOTTLER]->(b:Bottler) " +
        "OPTIONAL MATCH (tn)-[:NOTE_BY]->(u:User) " +
        "WITH w, b, t, collect({item:tn, user:u, kind:head(labels(tn))}) AS notes " +
        "WITH w, b, collect({item:t, notes:notes, kind:head(labels(t))}) AS tastings " +
        "OPTIONAL MATCH (w)<-[o:OWNS]-(u:User) " +
        "RETURN {item:w, bottler:b, numBottles:count(o), numOwners:count(distinct u), tastings:tastings, kind:'TastingNoteSplat'} AS result ORDER BY w.name",
        {pattern: "(?i).*" + phrase + ".*"});
}

function findDistillery(region, ast, res) {
    if (region) {
        ast = {kind:"and", input:[ast, {kind:"region", input:region}]};
    }
    var where = buildCypherWhereClause(ast);
    res.queryResponse(
        "MATCH (w:Whisky)-[:DISTILLERY]->(d:Distillery) " +
        "OPTIONAL MATCH (d)-[:REGION]->(r:Region) " +
        "OPTIONAL MATCH (w)-[:BOTTLER]->(b:Bottler) " +
        "OPTIONAL MATCH (w)<-[o:OWNS]-(u:User) " +
        "OPTIONAL MATCH (tn:TastingNote)-[:NOTE_FOR]->(tw:TastingWhisky)-[:WHISKY]->(w) " +
        "WITH w, d, r, b, o, u, tn " +
        "WHERE " + where + " " +
        "WITH distinct d, r " +
        "RETURN {item:d, region:r, kind:head(labels(d))} AS result ORDER BY d.name",
        {});
}