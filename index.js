var http = require('http');
var merge = require('utils-merge');
var Layer = require('./lib/layer');
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
    this.stack.push(fn);
    return this;
};

proto.handle = function(req, res, next2) {
    var index = 0;
    var stack = this.stack;
    var next = function(err) {
        var layer = stack[index++];
        if (index > stack.length) {
            next2(err);
        } else {
            if (layer) {
                call(layer, err, req, res, next);
            } else {
                if (err) {
                    res.writeHead(500);
                    res.end();
                } else {
                    res.writeHead(404);
                    res.end();
                }
            }
        }
    };
    next();
};

function call(handle, err, req, res, next) {
    try {
        if (err) {
            if (handle.length === 4) {
                handle.call(this, err, req, res, next);
            } else {
                next(err);
            }
        } else {
            if (handle.length === 4) {
                next();
            } else {
                handle.call(this, req, res, next);
            }
        }
    } catch(e) {
        res.writeHead(500);
        res.end();
    }
}