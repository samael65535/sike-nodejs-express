#!/usr/bin/env node
var express = require("../index");
var makeRoute = require('../lib/route');
var inject = require("../lib/injector");
var app = express();
app = express();
app.use(function(req,res) {
    res.format({
    });
});
app.listen(4000);