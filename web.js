var express = require("express");
var logfmt = require("logfmt");
var neo4j = require("neo4j");
var fs = require("fs");
var bodyParser = require('body-parser')

var PEG = require("pegjs");
var parser = require("./parser.js");

var db = new neo4j.GraphDatabase("http://localhost:7474");

var app = express();
app.use(bodyParser());
app.use(logfmt.requestLogger());

app.use(express.static("./public"));

app.post('/app', function(req, res) {
  try {
    var result = parser.parse(req.body.query);
    interpret(result, res);
  } catch (e) {
    res.send(e);
  }
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});

function interpret(parsed, res) {
    var verb = parsed.shift();
    var query = "none";
    switch (verb) {
        case "list": query = vlist(parsed); break;
        case "add": query = vadd(parsed); break;
        case "update": query = vupdate(parsed); break;
        case "remove": query = vremove(parsed); break;
    }
    query.push(function(err,data) {
        res.send(data);
    })
    db.query.apply(db, query);
}

function vlist(args) {
    var type = args[0];
    var owner = args[1];
    switch (type) {
        case "owner":
            return [
                "MATCH (n:Whisky)-[:OWNER]->(o:Owner), (n)-[:DISTILLERY]->(d:Distillery) WHERE o.name = {owner} RETURN [d.displayName, n] AS result", 
                {"owner":owner.toLowerCase()}
            ];
        case "distillery":
            return [
                "MATCH (n:Whisky)-[:DISTILLERY]->(o:Distillery) WHERE o.name = {owner} RETURN [o.displayName, n] AS result", 
                {"owner":owner.toLowerCase()}
            ];
        case "bottler":
            return [
                "MATCH (n:Whisky)-[:BOTTLER]->(o:Bottler), (n)-[:Distillery]->(o:Distillery) WHERE o.name = {owner} RETURN [d.displayName, n] AS result", 
                {"owner":owner.toLowerCase()}
            ];
    }
}

function vadd(args) {
    var type = args[0];
    var owner = args[1];
    switch (type) {
        case "owner":
        case "distillery":
        case "bottler":
            return [
                "MERGE (n:" + args[0].capitalize() + " {name: {name}}) ON CREATE SET n.displayName = {displayName} RETURN count(*)", 
                {"name":owner.toLowerCase(), "displayName": owner}
            ];
        case "whisky":
            console.log("adding whisky");
            var spec = args[2];
            console.log(spec);

            var params = {};
            spec.mods.forEach(function(d) {
                console.log(d);
                params[d[0]] = d[1];
            });
            params["owner"] = owner.toLowerCase();
            params["distillery"] = spec.distillery.toLowerCase();
            console.log(params);

            var properties = [];
            if (spec.name != null) {
                properties.push("name:{name}");
                properties.push("displayName:{displayName}");
                params["name"] = spec.name.toLowerCase();
                params["displayName"] = spec.name;
            }
            if (params["cask strength"]) {
                properties.push("caskStrength:{caskStrength}");
            }
            if (params["single cask"]) {
                properties.push("singleCask:{singleCask}");
            }
            if (params["age"]) {
                properties.push("age:{age}");
            }
            if (params["year"]) {
                properties.push("year:{year}");
            }
            if (params["percentage"]) {
                properties.push("percentage:{percentage}");
            }
            console.log(properties);

            var query = "MATCH (d:Distillery {name:{distillery}}) MATCH (o:Owner {name:{owner}}) MERGE (w:Whisky {" + properties.join(",") + "}) MERGE (w)-[:DISTILLERY]->(d) MERGE (w)-[:OWNER]->(o) RETURN count(*)";
            console.log(query);

            return [query, params];
    }
    console.log("shouldn't get here");
}

function vupdate(args) {

}

function vremove(args) {

}

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

