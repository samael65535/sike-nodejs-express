#!/usr/bin/env node
var express = require("../index");

var app = express();

var http = require("http");
var server = http.createServer(app);
server.listen(4000);

