#!/usr/bin/env node
var express = require("../index");
var app = express();
var m1 = function(req,res,next) {
    next();
}

var e1 = function(err,req,res,next) {
    // timeout
    console.log("e1");
}

var m2 = function(req,res,next) {
    res.end("m2");
}

app.use(m1);
app.use(e1); // should skip this
app.use(m2);
app.listen(4000);

