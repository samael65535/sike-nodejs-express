var http = require('http');
var merge = require('utils-merge');
var Layer = require('./lib/layer');
var makeRoute = require('./lib/route')
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

proto.get = function(path, fn) {
    this.use(path, makeRoute('GET', fn))
};

proto.use = function(router, layer) {
    if (layer) {
        if (typeof layer.handle === "function") {
            var path = router;
            if (path[path.length - 1] == '/') {
                path = path.slice(0, -1);
            }
            this.stack.push(new Layer(path, layer));
        } else {
            var fn = layer;
            this.stack.push(new Layer(router, fn));
        }
    } else {
        var fn = router;
        this.stack.push(new Layer('/', fn));
    }
    return this;
};

proto.handle = function(req, res, next2) {
    var index = 0;
    var stack = this.stack;
    var next = function(err) {
        var layer = stack[index++];
        if (index > stack.length) {
            if (err) {
                next2(err);
            } else {
                next2();
            }
        } else {
            if (layer) {
                try {
                    call(layer, err, req, res, next);
                } catch(e) {
                    if (index >= stack.length) {
                        res.writeHead(404);
                        res.end();
                    } else {
                        next(e)
                    }
                }
            } else {
                if (err) {
                    res.writeHead(505);
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
    var match = layer.match(req.url, req.method == 'GET');
    if (handle.hasOwnProperty('use') && match) {
        if (req.url != layer.path) {
            req.url = req.url.slice(layer.path.length);
        }
        if (err) {
            if (handle.length === 4) {
                req.params = match.params
                handle.call(layer, err, req, res, next);
            } else {
                next(err);
            }
        } else {
            if (handle.length === 4) {
                next();
            } else {
                req.params = match.params;
                handle.call(layer, req, res, next);
            }
        }
    } else {
        if (err) {
            if (handle.length >= 4 && match) {
                req.params = match.params
                handle.call(layer, err, req, res, next);
            } else {
                next(err);
            }
        } else {
            if (handle.length >= 4 || !match) {
                next();
            } else {
                req.params = match.params
                handle.call(layer, req, res, next);
            }
        }
    }
}