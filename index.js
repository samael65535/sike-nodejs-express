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
            if (err) {
                if (layer.length === 4) {
                    layer.call(null, err, req, res, next);
                } else {
                    next(err);
                }
            } else {
                layer.call(null, req, res, next);
            }
        } else {
            if (err) {
                res.writeHead(500);
                res.end();
            } else {
                res.writeHead(404);
                res.end();
            }
        }
    };

    try {
        next();
    } catch(e) {
        res.writeHead(500);
        res.end();
    }
};