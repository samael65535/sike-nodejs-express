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
            var server = http.createServer(app);
            request(server).get("").expect(404).end(done)
        });
    });
});