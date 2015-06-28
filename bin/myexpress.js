#!/usr/bin/env node
var express = require("../index");
app = express();
app.route('/foo');

app.listen(4000);