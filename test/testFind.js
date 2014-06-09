var expect  = require("chai").expect;

var common = require("./helpers/helpers");
var unwrap = common.unwrap;
var findItem = common.findItem;

describe("Find entities", function() {
    var variables;
    before(function(done) {variables = common.loadTestScript("./test/test_input.txt", done);});

    it("should find cask strength whisky", function(done) {
        common.handleLine("find whisky where cask strength", function(result) {
            expect(result.length).to.equal(1);
            expect(unwrap(findItem(result, "id", variables["w5"]).result.item)).to.deep.equal({
                id: variables["w5"],
                name: "talisker 30yo",
                displayName: "Talisker 30yo",
                age: 30,
                percentage: 57.3,
                caskType: "sherryBourbon",
                caskStrength: true,
                peated: true,
                originalBottling: true,
                bottledYear: 2010
            });
        }, done);
    });

    it("should find strong and non-peated whisky", function(done) {
        common.handleLine("find whisky where >50% and not peated", function(result) {
            expect(result.length).to.equal(1);
            expect(findItem(result, "id", variables["w6"])).to.be.an('object');
        }, done);
    });

    it("should find whisky with vanilla note", function(done) {
        common.handleLine("find whisky where note contains \"vanilla\"", function(result) {
            expect(result.length).to.equal(1);
            expect(findItem(result, "id", variables["w4"])).to.be.an('object');
        }, done);
    });



    it("should find distilleries with whisky with vanilla note", function(done) {
        common.handleLine("find distillery with whisky where note contains \"vanilla\"", function(result) {
            expect(result.length).to.equal(1);
            expect(findItem(result, "name", "ben nevis")).to.be.an('object');
        }, done);
    });

    it("should find distilleries with weak whisky", function(done) {
        common.handleLine("find distillery with whisky where not owned", function(result) {
            expect(result.length).to.equal(6);
            expect(findItem(result, "name", "lagavulin")).to.be.an('object');
        }, done);
    });



    it("should find tasting notes with vanilla", function(done) {
        common.handleLine("find tasting note containing \"vanilla\"", function(result) {
            expect(result.length).to.equal(1);
            expect(findItem(result, "id", variables["w4"])).to.be.an('object');
        }, done);
    });


})