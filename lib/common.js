module.exports = {
    queryResponse: function(query, params, res, db) {
        db.query(query, params, function(err, data) {
            if (err) {
                console.log("Query failed: " + err);
                res.send({error:err});
            }
            else {
                res.send({result:data});
            }
        });
    }
}

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};
