(function (){
  'use strict';

  var express   = require("express")
    , request   = require("request")
    , chai      = require("chai")
    , chaiHttp  = require("chai-http")
    , sinon     = require("sinon")
    , expect    = chai.expect
    , endpoints = require("../../api/endpoints")
    , helpers   = require("../../helpers")
    , metrics   = require("../../api/metrics")
    , catalogue = require("../../api/catalogue")
    , app

  describe("catalogue", function() {
    before(function() {
      chai.use(chaiHttp);
    });

    beforeEach(function() {
      app = express();
      app.use(metrics);
      app.use(catalogue);
      app.use(helpers.errorHandler);
      sinon.stub(request, "get");
    });

    afterEach(function() {
      request.get.restore();
    });

    function stubCatalogue(statusCode, body) {
      request.get.yields(null, {
        statusCode: statusCode,
        headers:    { "content-type": "application/json; charset=utf-8" }
      }, body);
    }

    describe("GET /catalogue/:id/stock", function() {
      it("proxies to the catalogue service URL", function(done) {
        stubCatalogue(200, '{"id":"X","stock":3}');

        chai.request(app).
          get("/catalogue/X/stock").
          end(function(err, res) {
            expect(request.get.calledOnce).to.be.true;
            expect(request.get.firstCall.args[0]).to.equal(endpoints.catalogueUrl + "/catalogue/X/stock");
            done();
          });
      });

      it("passes a 200 response through unchanged", function(done) {
        stubCatalogue(200, '{"id":"X","stock":3}');

        chai.request(app).
          get("/catalogue/X/stock").
          end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.text).to.equal('{"id":"X","stock":3}');
            done();
          });
      });

      it("passes a 404 response through unchanged", function(done) {
        stubCatalogue(404, '{"error":"not found","status_code":404,"status_text":"Not Found"}');

        chai.request(app).
          get("/catalogue/Y/stock").
          end(function(err, res) {
            expect(res).to.have.status(404);
            expect(res).to.be.json;
            expect(res.text).to.equal('{"error":"not found","status_code":404,"status_text":"Not Found"}');
            done();
          });
      });

      it("passes a 500 response through unchanged", function(done) {
        stubCatalogue(500, '{"error":"database connection error"}');

        chai.request(app).
          get("/catalogue/X/stock").
          end(function(err, res) {
            expect(res).to.have.status(500);
            expect(res.text).to.equal('{"error":"database connection error"}');
            done();
          });
      });

      it("responds 500 when the catalogue service is unreachable", function(done) {
        request.get.yields(new Error("connect ECONNREFUSED"));

        chai.request(app).
          get("/catalogue/X/stock").
          end(function(err, res) {
            expect(res).to.have.status(500);
            done();
          });
      });

      it("records a front-end request duration sample", function(done) {
        stubCatalogue(200, '{"id":"X","stock":3}');

        chai.request(app).
          get("/catalogue/X/stock").
          end(function() {
            chai.request(app).
              get("/metrics").
              end(function(err, res) {
                expect(res.text).to.match(/http_request_duration_seconds_count\{[^}]*service="front-end"[^}]*path="catalogue"[^}]*status_code="200"[^}]*\} [1-9]/);
                done();
              });
          });
      });
    });

    describe("GET /catalogue/:id", function() {
      it("is still served by the wildcard proxy", function(done) {
        stubCatalogue(200, '{"id":"X"}');

        chai.request(app).
          get("/catalogue/X").
          end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res.text).to.equal('{"id":"X"}');
            expect(request.get.firstCall.args[0]).to.equal(endpoints.catalogueUrl + "/catalogue/X");
            done();
          });
      });
    });
  });
}());
