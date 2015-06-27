#!/usr/bin/env node
var express = require("../index");
app = express();
app.route('/foo');
app.get(function(req, res) {
   res.end('hehe')
});
app.listen(4000);