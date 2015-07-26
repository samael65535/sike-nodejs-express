#!/usr/bin/env node
var express = require("../index");
var makeRoute = require('../lib/route');
var inject = require("../lib/injector");
var app = express();
var fs = require('fs');
app.use(function(req,res) {
    res.sendfile(path,options);
});
app.listen(4000);