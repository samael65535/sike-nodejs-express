#!/usr/bin/env node
var express = require("../index");
var makeRoute = require('../lib/route');
var app = express();
var route = makeRoute();
app.use(route);
app.listen(4000);