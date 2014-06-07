var express    = require("express");
var logfmt     = require("logfmt");
var bodyParser = require('body-parser');
var handler    = require('./lib/handler');

var app = express();
app.use(bodyParser());
app.use(logfmt.requestLogger());
app.use(express.static("./public"));

app.post('/app', handler.handleRequest);

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});


