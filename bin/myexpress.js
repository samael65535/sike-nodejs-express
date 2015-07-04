#!/usr/bin/env node
var express = require("../index");
var makeRoute = require('../lib/route');
var inject = require("../lib/injector");
var app = express();

//var req = 1,
//    res = 2,
//    next = 3;
//function handler(res,foo) {
//    console.log(res, foo);
//}

//injector = inject(handler,app);
//injector(req,res,next);
app.use(function(req,res) {
    app.monkey_patch(req,res);
    res.end(req.isExpress + "," + res.isExpress);
});

//app.use(function(req,res) {
//    res.end(req.isExpress + "," + res.isExpress);
//});
app.listen(4000);