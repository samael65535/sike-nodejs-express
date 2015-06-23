#!/usr/bin/env node
var express = require("../index");
var app = express();
var subApp = express();
var m1 = function(req,res,next) {
    console.log("m1");
    next();
}

var m2 = function(req,res,next) {
    // timeout
    console.log("m2");
    //res.end();
    next();
}

var m3 = function(req,res,next) {
    console.log("m3");
    next();
};

var m4 = function(req,res,next) {
    console.log("m4");
    next();
};

app.use(m1);
app.use(subApp);
app.use(m2);

subApp.use(m3);
subApp.use(m4);
app.listen(4000);

