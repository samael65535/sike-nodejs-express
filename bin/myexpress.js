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
var subapp = express();
var _app, _subapp;
subapp.use(function(req,res,next) {
    _subapp = req.app; // => subapp
    console.log(subapp === _subapp);
    next();
});
app.use(subapp);
app.use(function(req,res) {
    _app = req.app;
    console.log(app === _app);
    console.log(_app === subapp);
    res.end("ok");
});

//app.use(function(req,res) {
//    res.end(req.isExpress + "," + res.isExpress);
//});
app.listen(4000);