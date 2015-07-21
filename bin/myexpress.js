#!/usr/bin/env node
var express = require("../index");
var makeRoute = require('../lib/route');
var inject = require("../lib/injector");
var app = express();
app.use("/plumless",function(req,res) {
    res.send("plumless");
});
app.use("/",function(req,res) {
    res.setHeader("Last-Modified","Sun, 31 Jan 2010 16:00:00 GMT")
    res.send("bar-2010");
});
app.listen(4000);