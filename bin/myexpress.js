#!/usr/bin/env node
var express = require("../index");
var makeRoute = require('../lib/route');
var inject = require("../lib/injector");
var app = express();
app.use("/plumless",function(req,res) {
    res.send("plumless");
});
app.use("/buckeroo",function(req,res) {
    res.setHeader("Etag","buckeroo");
    res.send("buckeroo");
});
app.listen(4000);