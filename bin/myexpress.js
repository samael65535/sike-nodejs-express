#!/usr/bin/env node
var express = require("../index");
var makeRoute = require('../lib/route');
var app = express();
var route = app.route("/foo")
    .get(function(req,res,next) {
        next();
    })
    .get(function(req,res) {
        res.end("foo");
    });
app.listen(4000);