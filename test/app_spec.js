/**
 * Created by samael on 15-6-20.
 */
var express = require('..');
var request = require('supertest');
var expect = require('chai').expect;
var http = require('http');
var Layer = require('../lib/layer')
describe('app', function() {
    describe('create http server', function() {
        var app = express();
        it("responds to /foo with 404", function (done) {
            request(app).get("").expect(404).end(done)
        });
    });
    describe('#listen', function() {
        var app = express();
        before(function() {
            app.listen(7000);
        })
        it("responds to /foo with 404", function (done) {
            request("http://localhost:7000").get("").expect(404).end(done)
        });
    });

    describe("Implement app.use",function() {
        /// your own test
        var app = express()
        before(function() {
            app.use(function(){});
            app.use(function(){});
        });
        it('app stack', function() {

            expect(app.stack.length).to.eql(2);
        })
    });

    describe("calling middleware stack",function() {
        var app;
        beforeEach(function() {
            app = new express();
        });

        // test cases
        it("test stack call", function(done){
            var m1 = function(req, res, next) {
                console.log("hello m1");
                next()
            };
            var m2 = function(req, res) {
                res.end("hello m2");
            }
            app.use(m1);
            app.use(m2);
            request(app).get("/").expect('hello m2').end(done)
        });
    });

    describe('Implement Error Handling', function() {
        var app;
        beforeEach(function() {
            app = new express();
        });

        it('should return 500 for unhandled error', function(done) {
            var m1 = function(req, res, next) {
                console.log(next);
                next(new Error('boom!'));
            };
            app.use(m1);
            request(app).get('/').expect(500).end(done);
        })

        it('should return 500 for uncaught error', function(done) {
            var m1 = function(req, res, next) {
                throw new Error('boom!');
            }
            app.use(m1);
            request(app).get('/').expect(500).end(done);
        });


        it("should ignore error handlers when `next` is called without an error",function(done) {
            var m1 = function(req,res,next) {
                next();
            }

            var e1 = function(err,req,res,next) {
                // timeout
            }

            var m2 = function(req,res,next) {
                res.end("m2");
            }

            app.use(m1);
            app.use(e1); // should skip this
            app.use(m2);
            request(app).get("/").expect("m2").end(done);
        });
    })

});

describe('Layer class and the match method', function() {
    var layer, middleware;
    beforeEach(function() {
        var Layer = require("../lib/layer");
        middleware = function(req, res, next) {};
        layer = new Layer("/foo", middleware);
    });
    it('sets layer.handle to be the middleware', function() {
        expect(layer.handle).to.eql(middleware);
    });

    it("returns undefined if path doesn't match", function() {
        expect(layer.match('/bar')).to.be.undefined;
    });
    //it('returns matched path if layer matches the request path exactly', function(done) {
    //    var layer = new Layer('bar');
    //});
    //it("returns matched prefix if the layer matches the prefix of the request path", function(done) {
    //    var layer = new Layer('bar');
    //});
})