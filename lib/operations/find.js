module.exports = {
    find: find
};

function find(parsed, res) {
    switch(parsed.kind) {
        case "whisky": findWhisky(parsed.ast, res); break;
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
            return "((coalesce(tn.nose,'')+coalesce(tn.palate,'')+coalesce(tn.finish,'')+coalesce(tn.overall,'')) =~ '(?i).*" + ast.input + ".*')";
    }
}
