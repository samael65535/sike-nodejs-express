#!/usr/bin/env node
var express = require("../index");
var Layer = require('../lib/layer');
var p2re = require("path-to-regexp");

app = express();
app.get("/foo",function(req,res) {
    res.end("foo");
});
app.listen(4000);