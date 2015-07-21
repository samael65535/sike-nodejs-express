#!/usr/bin/env node
var express = require("../index");
var makeRoute = require('../lib/route');
var inject = require("../lib/injector");
var app = express();
app.use("/plumless",function(req,res) {
    res.send("plumless");
});
app.use("/",function(req,res) {
    res.setHeader("Etag","foo-v1")
    res.send("foo-v1");
});
app.listen(4000);