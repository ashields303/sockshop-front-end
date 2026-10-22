(function (){
  'use strict';

  var expect = require("chai").expect
    , stock  = require("../public/js/stock")

  describe("stock", function() {
    describe("LOW_STOCK_THRESHOLD", function() {
      it("is 5", function() {
        expect(stock.LOW_STOCK_THRESHOLD).to.equal(5);
      });
    });

    describe("#shouldShowLowStock", function() {
      it("shows the badge when stock is 0", function() {
        expect(stock.shouldShowLowStock(0)).to.be.true;
      });

      it("shows the badge when stock is 4", function() {
        expect(stock.shouldShowLowStock(4)).to.be.true;
      });

      it("hides the badge when stock is 5", function() {
        expect(stock.shouldShowLowStock(5)).to.be.false;
      });

      it("hides the badge when stock is 10", function() {
        expect(stock.shouldShowLowStock(10)).to.be.false;
      });

      it("hides the badge when stock is undefined", function() {
        expect(stock.shouldShowLowStock(undefined)).to.be.false;
      });

      it("hides the badge when stock is not a number", function() {
        expect(stock.shouldShowLowStock(null)).to.be.false;
        expect(stock.shouldShowLowStock("3")).to.be.false;
        expect(stock.shouldShowLowStock(NaN)).to.be.false;
      });
    });
  });
}());
