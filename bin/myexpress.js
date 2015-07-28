#!/usr/bin/env node
var express = require("../index");
var makeRoute = require('../lib/route');
var inject = require("../lib/injector");
var app = express();
var fs = require('fs');
var request = require("supertest");
function get(path,options) {
    app.use(function(req,res) {
        res.sendfile(__dirname + "/../verify/fixtures/data.txt",options);
    });
    return request(app).get("/");
}
get(__dirname);

app.listen(4000);