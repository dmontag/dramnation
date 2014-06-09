var fs      = require("fs");
var neo4j   = require("neo4j");
var handler = require("../../lib/handler");

var db = new neo4j.GraphDatabase("http://localhost:7474");

module.exports = {
    handleLine: handleLine,
    unwrap: unwrap,
    findItem: findItem,
    loadTestScript: loadTestScript
};

function readFile(path, lineFunc, closeFunc) {
    require('readline').createInterface({
            input: fs.createReadStream(path),
            terminal: false
        })
        .on('line', lineFunc)
        .on('close', closeFunc);
}

function updateVariables(result, key, variables) {
    switch(key[0]) {
        case "w": variables[key] = result.result[0].result.item._data.data.id; break;
        case "t": variables[key] = result.result[0].result.item._data.data.id; break;
        case "b": variables[key] = result.result[0].result.item._data.data.bottle; break;
    }
}

function loadNextLine(lines, variables, done) {
    var line = lines.shift();
    if (line) {
        var saveToVariable;
        var match = line.match(/^%([a-z0-9]+)% (.*)$/);
        if (match) {
            saveToVariable = match[1];
            line = match[2];
        }
        for(var v in variables) {
            line = line.replace("%"+v+"%", variables[v]);
        }

        var last = lines.length == 0;
        var req = { body: {query: line} };
        var res = { send: function(result) {
            if (saveToVariable) updateVariables(result, saveToVariable, variables);
            if (last) {
                done();
            } else {
                loadNextLine(lines, variables, done);
            }
        }};

        handler.handleRequest(req, res);
    }
}

function loadTestScript(path, done) {
    var variables = {};
    db.query("MATCH (n) OPTIONAL MATCH (n)-[r]->() " +
            "DELETE n, r WITH count(*) AS foo " + 
            "CREATE (:User{name:'test1'}), (:User{name:'test2'}), (:User{name:'test3'})", 
            {}, function(err, res) {
        var lines = [];
        readFile(path, 
            // Load lines into lines variables
            function(line) {
                line = line.trim();
                if (line.length == 0) return;
                lines.push(line);
            }, 
            // When all lines are loaded, recursively work them off one by one, 
            // processing the next only when each line finishes
            function() {
                var running = 0;
                loadNextLine(lines, variables, done);
            });
    });
    return variables;
}

function handleLine(line, callback, done) {
    var req = { body: {query: line} };
    var res = { send: function(result) {
        callback(result.result || []);
        done();
    }};
    handler.handleRequest(req, res);
}

function unwrap(node) {
    return node._data.data;
}

function findItem(result, key, value) {
    return result.filter(function(d) {return unwrap(d.result.item)[key] == value})[0];
}
