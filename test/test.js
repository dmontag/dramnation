var expect  = require("chai").expect;
var fs      = require("fs");
var handler = require("../lib/handler");
var neo4j = require("neo4j");

var db = new neo4j.GraphDatabase("http://localhost:7474");

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
        callback(result.result);
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

describe("List entities", function() {
    var variables;
    before(function(done) {variables = loadTestScript("./test/test_input.txt", done);});

    it("should list whiskies", function(done) {
        handleLine("list whisky", function(result) {
            expect(result.length).to.equal(7);
            expect(unwrap(findItem(result, "id", variables["w1"]).result.item)).to.deep.equal({
                id: variables["w1"],
                name: "ardbeg 10yo",
                displayName: "Ardbeg 10yo",
                bottleSize: 100,
                age: 10,
                percentage: 46,
                caskType: "bourbon",
                peated: true
            });
            expect(unwrap(findItem(result, "id", variables["w1"]).result.bottler)).to.deep.equal({
                name: "cadenhead",
                displayName: "Cadenhead"
            });
            expect(findItem(result, "id", variables["w1"]).result.numBottles).to.equal(1);
            expect(findItem(result, "id", variables["w1"]).result.numOwners).to.equal(1);
        }, done);
    });

    it("should list distilleries", function(done) {
        handleLine("list distilleries", function(result) {
            expect(result.length).to.equal(6);
            expect(unwrap(findItem(result, "name", "ardbeg").result.item)).to.deep.equal({
                name: "ardbeg",
                displayName: "Ardbeg",
                closed: true
            });
            expect(unwrap(findItem(result, "name", "ardbeg").result.region)).to.deep.equal({
                name: "islay",
                displayName: "Islay"
            });
        }, done);
    });

    it("should list regions", function(done) {
        handleLine("list regions", function(result) {
            expect(result.length).to.equal(4);
            expect(unwrap(findItem(result, "name", "islay").result.item)).to.deep.equal({
                name: "islay",
                displayName: "Islay"
            });
        }, done);
    });

    it("should list bottlers", function(done) {
        handleLine("list bottlers", function(result) {
            expect(result.length).to.equal(2);
            expect(unwrap(findItem(result, "name", "cadenhead").result.item)).to.deep.equal({
                name: "cadenhead",
                displayName: "Cadenhead"
            });
        }, done);
    });

    it("should list users", function(done) {
        handleLine("list users", function(result) {
            expect(result.length).to.equal(3);
            expect(unwrap(findItem(result, "name", "test1").result.item)).to.deep.equal({
                name: "test1"
            });
        }, done);
    });

    it("should list tastings", function(done) {
        handleLine("list tastings", function(result) {
            expect(result.length).to.equal(1);
            expect(unwrap(findItem(result, "name", "tasting 1").result.item)).to.deep.equal({
                name: "tasting 1",
                displayName: "Tasting 1",
                date: "2014-05-25"
            });
        }, done);
    });
})


describe("Find entities", function() {
    before(function(done) {loadTestScript("./test/test_input.txt", done);});

    it("should list correct number of tastings", function(done) {
        handleLine("find whisky where cask strength", function(result) {
            expect(result.length).to.equal(1);
        }, done);
    });
})