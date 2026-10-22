(function (){
  'use strict';

  var express   = require("express")
    , request   = require("request")
    , endpoints = require("../endpoints")
    , helpers   = require("../../helpers")
    , app       = express()

  app.get("/catalogue/images*", function (req, res, next) {
    var url = endpoints.catalogueUrl + req.url.toString();
    request.get(url)
        .on('error', function(e) { next(e); })
        .pipe(res);
  });

  /* The /catalogue* wildcard below would match this path, but simpleHttpRequest
   * always answers 200. The stock route must pass the catalogue's status
   * (e.g. 404) through so the product page can tell "no data" from a count. */
  app.get("/catalogue/:id/stock", function (req, res, next) {
    request.get(endpoints.catalogueUrl + req.url.toString(), function (error, response, body) {
      if (error) return next(error);
      if (response.headers["content-type"]) {
        res.set("Content-Type", response.headers["content-type"]);
      }
      res.status(response.statusCode).send(body);
    });
  });

  app.get("/catalogue*", function (req, res, next) {
    helpers.simpleHttpRequest(endpoints.catalogueUrl + req.url.toString(), res, next);
  });

  app.get("/tags", function(req, res, next) {
    helpers.simpleHttpRequest(endpoints.tagsUrl, res, next);
  });

  module.exports = app;
}());
