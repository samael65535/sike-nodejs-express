#!/usr/bin/env node
var express = require("../index");
var makeRoute = require('../lib/route');
var app = express();
var route = makeRoute();
app.use(route);
route.use("get",function(req,res,next) {
    next('route');
});
route.use("get",function() {
    throw new Error("boom");
});

app.use(function(req,res) {
    res.end("middleware");
});
app.listen(4000);