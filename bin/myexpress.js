#!/usr/bin/env node
var express = require("../index");
var makeRoute = require('../lib/route');
var inject = require("../lib/injector");
var app = express();
app.use("/buffer",function(req,res) {
    res.send(new Buffer("binary data"));
    // Content-Type: application/octet-stream
});
app.use("/string",function(req,res) {
    res.send("string data");
    // Content-Type: text/html
});
app.use("/json",function(req,res) {
    res.type("json");
    res.send("[1,2,3]");
    // Content-Type: application/json
});
app.listen(4000);