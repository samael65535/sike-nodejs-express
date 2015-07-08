#!/usr/bin/env node
var express = require("../index");
var makeRoute = require('../lib/route');
var inject = require("../lib/injector");
var app = express();
app = express();
app.use(function(req,res) {
    res.format({
        text: function() {
            res.end("text hello");
        },

        html: function() {
            res.end("html <b>hello</b>");
        }
    });
});
app.listen(4000);