#!/usr/bin/env node
var express = require("../index");
var Layer = require('../lib/layer');
var p2re = require("path-to-regexp");
var app = express();
var subapp = express();

subapp.use("/bar",function(req,res) {
    res.end("embedded app: "+req.url);
});

app.use("/foo",subapp);

app.use("/foo",function(req,res) {
    res.end("handler: "+req.url);
});
app.listen(4000);
