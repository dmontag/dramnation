var PEG        = require("pegjs");
var parser     = require("./grammar/parser.js");
var neo4j      = require("neo4j");
var router     = require('./router');

module.exports = {
    handleRequest: handleRequest
};

var db = new neo4j.GraphDatabase("http://localhost:7474");

function handleRequest(req, res) {
    var parsed;
    try {
        parsed = parser.parse(req.body.query);
        try {
            router.interpret(parsed, res, db);
        } catch (e) {
            console.log("Operation failed: " + e);
            res.send({error:e});
        }
    } catch (e) {
        console.log("Parsing failed: " + e);
        res.send({error:e});
    }

}
