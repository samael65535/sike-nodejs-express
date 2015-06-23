#!/usr/bin/env node
var express = require("../index");
var Layer = require('../lib/layer')
var app = express();
var middle = function(req, res, next) {

};
var layer = new Layer('/food', middle);
console.log(layer.match('/food/mashroom'));
console.log(layer.handle === middle);
//app.listen(4000);

