#!/usr/bin/env node
var express = require("../index");


app = express();
app.connect("/foo",function(req,res) {
    res.end("foo");
});
app.listen(4000);