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
app.factory("foo",function(res,req,cb) {
    cb(null,"hello from foo DI!");
})
app.use(app.inject(function (res,foo) {
    res.end(foo);
}));
app.listen(4000);