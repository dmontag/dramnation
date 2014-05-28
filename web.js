var express = require("express");
var logfmt = require("logfmt");
var fs = require("fs");
var bodyParser = require('body-parser')

var PEG = require("pegjs");
var parser = require("./parser.js");

var app = express();
app.use(bodyParser());

app.use(logfmt.requestLogger());

app.use(express.static("./public"));

app.post('/app', function(req, res) {
  res.send(parser.parse(req.body.q));
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
