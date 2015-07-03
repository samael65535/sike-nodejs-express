#!/usr/bin/env node
var express = require("../index");
var makeRoute = require('../lib/route');
var inject = require("../lib/injector");
var app = express();
var req = 1,
    res = 2;
function next(err) {
    expect(err).to.be.instanceof(Error);
    expect(err.message).to.equal("Factory not defined: unknown_dep");
}

function handler(unknown_dep) {};
injector = inject(handler,app);
injector(req,res,next);
//app.listen(4000);