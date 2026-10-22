(function (){
  'use strict';
  require("./config");

  // Seeded in catalogue-db: "Holy" has 1 unit in stock, "Nerd leg" has 115.
  var lowStockId  = "03fef6ac-1896-4ce8-bd69-b798f85c6e0b"
    , wellStockId = "a0a4f044-b040-410d-8ead-4de0446aec7e"

  casper.test.begin("User sees a low stock badge only for low stock products", 3, function(test) {
    casper.start("http://front-end:8080/detail.html?id=" + lowStockId, function() {
      this.waitForSelector("#price #lowStockBadge", function() {
        test.pass("low stock badge is shown next to the price");
        test.assertSelectorHasText("#lowStockBadge", "Low stock", "badge reads 'Low stock'");
      }, function() {
        test.fail("low stock badge was not shown");
      }, 3000);
    });

    casper.thenOpen("http://front-end:8080/detail.html?id=" + wellStockId, function() {
      this.waitForText("Nerd leg", function() {
        // Give the stock request time to complete before asserting absence.
        this.wait(1000, function() {
          test.assertDoesntExist("#lowStockBadge", "no badge for a product with plenty of stock");
        });
      }, function() {
        test.fail("product details did not load");
      }, 3000);
    });

    casper.run(function() {
      test.done();
    });
  });
}());
