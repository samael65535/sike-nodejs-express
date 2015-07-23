#!/usr/bin/env node
var express = require("../index");
var makeRoute = require('../lib/route');
var inject = require("../lib/injector");
var app = express();
var fs = require('fs');
app.use("/",function(req,res) {
    file = fs.createReadStream("../verify/fixtures/data.txt");
    res.stream(file);
});
app.listen(4000);