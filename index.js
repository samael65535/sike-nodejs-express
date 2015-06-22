var http = require('http');
var merge = require('utils-merge');
var proto = {};

module.exports = function() {
    function app(req, res, next) {
        app.handle(req, res, next);
    }
    merge(app, proto);
    app.stack = [];
    return app;
};

proto.listen = function() {
    var server = http.createServer(this);
    return server.listen.apply(server, arguments)
};

proto.use = function(fn) {
    this.stack.push(function(req, res, next) {
        return fn.call(null, req, res, next);
    });
    return this;
};

proto.handle = function(req, res, next) {
    var index = 0;
    var stack = this.stack;
    var next = function(err) {
        var layer = stack[index++];
        if (layer) {
            layer.call(null, req, res, next);
        } else {
            res.writeHead(404);
            res.end();
        }
    };
    next();
};