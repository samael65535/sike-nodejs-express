#!/usr/bin/env node
var express = require("../index");
var app = express();

var m1 = function(req, res, next) {
    console.log("hello m1");
    //res.end("hello m1");
    next()
};
var m2 = function(req, res) {
    console.log("hello m2");

}
app.use(m1);
app.use(m2);
app.listen(4000);

