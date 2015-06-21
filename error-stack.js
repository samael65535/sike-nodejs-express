/**
 * Created by samael on 15-6-20.
 */

var app = require('express')();

app.use(function(req, res, next) {
    var error = new Error("an error");
    next(error);
});

app.use(function(req, res, next) {
    console.log('second middleware');
    next();
});

app.use(function(error, req, res, next) {
    console.log("first error, handler");
    next(error);
});

app.use(function(error, req, res, next) {
    console.log("second error handler");
    res.end("hello from second error handler");
});

app.listen(4000);