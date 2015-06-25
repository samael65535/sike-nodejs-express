#!/usr/bin/env node
var express = require("../index");
var Layer = require('../lib/layer');
var p2re = require("path-to-regexp");
var app = express();
//var layer = new Layer("/", function(req, res, next) {
//
//});
//console.log(layer.match("/foo"));
//console.log(layer.match("/"));
//
var layer = new Layer("/foo/:a/:b/");

console.log(layer.match("/foo"));
console.log(layer.match("/foo/"));
console.log(layer.match("/foo/aa"));
console.log(layer.match("/foo/aa/bb"));
console.log(layer.match("/foo/aa/bb/cc"));
console.log(layer.match("/foo/aa/bb/c   c"));
app.listen(4000);
