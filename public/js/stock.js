/* Low stock badge for the product details page (detail.html).
 * Also loaded by Mocha via require(), so it must not touch the DOM at load time. */
var LOW_STOCK_THRESHOLD = 5;

/* Returns true when the badge should be shown: stock is a number strictly
 * below LOW_STOCK_THRESHOLD. Missing or non-numeric stock shows no badge. */
function shouldShowLowStock(stock) {
    return typeof stock === "number" && isFinite(stock) && stock < LOW_STOCK_THRESHOLD;
}

/* Fetches /catalogue/{id}/stock and, if stock is low, appends a badge to $price.
 * Any failure (non-2xx, timeout, bad JSON) leaves the page as it is. */
function showLowStockBadge(id, $price) {
    $.ajax({
        url: "/catalogue/" + encodeURIComponent(id) + "/stock",
        type: "GET",
        dataType: "json",
        timeout: 3000,
        success: function (data) {
            if (data && shouldShowLowStock(data.stock)) {
                $price.append(' <span id="lowStockBadge" class="label label-warning low-stock-badge">Low stock</span>');
            }
        },
        error: function (jqXHR, textStatus) {
            console.log("Stock unavailable for " + id + ": " + textStatus);
        }
    });
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        LOW_STOCK_THRESHOLD: LOW_STOCK_THRESHOLD,
        shouldShowLowStock: shouldShowLowStock
    };
}
