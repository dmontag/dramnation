var expect  = require("chai").expect;

var common = require("./helpers/helpers");
var unwrap = common.unwrap;
var findItem = common.findItem;

describe("List entities", function() {
    var variables;
    before(function(done) {variables = common.loadTestScript("./test/test_input.txt", done);});

    it("should list whiskies", function(done) {
        common.handleLine("list whisky", function(result) {
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
        common.handleLine("list distilleries", function(result) {
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
        common.handleLine("list regions", function(result) {
            expect(result.length).to.equal(4);
            expect(unwrap(findItem(result, "name", "islay").result.item)).to.deep.equal({
                name: "islay",
                displayName: "Islay"
            });
        }, done);
    });

    it("should list bottlers", function(done) {
        common.handleLine("list bottlers", function(result) {
            expect(result.length).to.equal(2);
            expect(unwrap(findItem(result, "name", "cadenhead").result.item)).to.deep.equal({
                name: "cadenhead",
                displayName: "Cadenhead"
            });
        }, done);
    });

    it("should list users", function(done) {
        common.handleLine("list users", function(result) {
            expect(result.length).to.equal(3);
            expect(unwrap(findItem(result, "name", "test1").result.item)).to.deep.equal({
                name: "test1"
            });
        }, done);
    });

    it("should list tastings", function(done) {
        common.handleLine("list tastings", function(result) {
            expect(result.length).to.equal(1);
            expect(unwrap(findItem(result, "name", "tasting 1").result.item)).to.deep.equal({
                name: "tasting 1",
                displayName: "Tasting 1",
                date: "2014-05-25"
            });
        }, done);
    });

    it("should list tasting notes", function(done) {
        common.handleLine("list tasting notes", function(result) {
            expect(result.length).to.equal(1);
            expect(unwrap(findItem(result, "id", variables["w4"]).result.item).id).to.equal(variables["w4"]);
            var notesForTastings = findItem(result, "id", variables["w4"]).result.tastings.map(function(d) {return d.notes;});
            var tastingNotes = notesForTastings[0];
            var user = unwrap(tastingNotes[0].user);
            var note = unwrap(tastingNotes[0].item);
            expect(note).to.deep.equal({
                id: variables["t1"],
                nose: "Floral, vanilla.",
                nosePoints: 21,
                palate: "great",
                finish: "good",
                finishPoints: 20,
                overall: "good allround",
                overallPoints: 22,
                points: 90
            });
            expect(user.name).to.equal("test3");
        }, done);
    });
})

