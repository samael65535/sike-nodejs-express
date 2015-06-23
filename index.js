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

proto.use = function(routerOrMiddleware, middleware) {
    if (middleware) {
        this.stack.push(new Layer(routerOrMiddleware, middleware));
    } else {
        this.stack.push(new Layer('/', middleware));
    }


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

function call(layer, err, req, res, next) {
    var handle = layer.handle;
    try {
        if (err) {
            console.log(layer.match(req.url));
            if (handle.length === 4 && layer.match(req.url)) {
                handle.call(layer, err, req, res, next);
            } else {
                next(err);
            }
        } else {
            if (handle.length === 4 || !layer.match(req.url)) {
                next();
            } else {
                handle.call(layer, req, res, next);
            }
        }
    } catch(e) {
        res.writeHead(500);
        res.end();
    }
}