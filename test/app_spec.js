/**
 * Created by samael on 15-6-20.
 */
var express = require('..');
var request = require('supertest');
var http = require('http');
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
});