#!/usr/bin/env node
var express = require("../index");
var makeRoute = require('../lib/route');
var inject = require("../lib/injector");
var app = express();
app = express();
app.use("/foo",function(req,res) {
    res.redirect("/baz"); // default is 302
});
app.use("/bar",function(req,res) {
    res.redirect(301,"/baz");
});
app.listen(4000);