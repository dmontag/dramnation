var list = require("./operations/list");
var add = require("./operations/add");
var set = require("./operations/set");
var unset = require("./operations/unset");
var remove = require("./operations/remove");
var find = require("./operations/find");
var common = require("./common");

module.exports = {
    interpret: interpret
};

function interpret(parsed, res, db) {
    var newRes = {
        queryResponse: function(query, params) { common.queryResponse(query, params, this.res, this.db); },
        res: res,
        db: db
    };
    switch(parsed.operation) {
        case "listEverything": list.everything(newRes); break;
        case "listAll": list.allOfKind(parsed.kind, newRes); break;
        case "add": add.add(parsed, newRes); break;
        case "set": set.set(parsed, newRes); break;
        case "unset": unset.unset(parsed, newRes); break;
        case "remove": remove.remove(parsed, newRes); break;
        case "find": find.find(parsed, newRes); break;
    }
}
