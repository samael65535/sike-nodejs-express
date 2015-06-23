#!/usr/bin/env node
var express = require("../index");
var app = express();
app.use("/foo",function(req,res,next) {
    throw "boom!"
});

app.use("/foo/a",function(err,req,res,next) {
    res.end("error handled /foo/a");
});

app.use("/foo/b",function(err,req,res,next) {
    res.end("error handled /foo/b");
});
app.listen(4000);

