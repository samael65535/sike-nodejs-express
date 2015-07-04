var http = require('http');
var merge = require('utils-merge');
var Layer = require('./lib/layer');
var makeRoute = require('./lib/route');
var inject = require('./lib/injector');
var methods = require('methods');
var request = require('./lib/request');
var response = require('./lib/response');
var proto = {};

module.exports = function() {
    function app(req, res, next) {
        app.handle(req, res, next);
    }
    merge(app, proto);
    app.stack = [];
    app._factories = {};
    return app;
};

proto.listen = function() {
    var server = http.createServer(this);
    return server.listen.apply(server, arguments)
};

proto.factory = function(name, fn) {
    this._factories[name] = fn;
};

proto.route = function(path) {
    var r = makeRoute();
    this.stack.push(new Layer(path, r));
    return r;
};

methods.forEach(function(m) {
    proto[m] = function(path, fn) {
        var r = makeRoute();
        r.use(m, fn);
        this.stack.push(new Layer(path, r));
        return this;
    };
});

proto['all'] = function(path, handler) {
    return this['get'](path, handler);
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
            if (match) {
                req.params = match.params;
                if (handle.length >= 4) {
                    handle.call(layer, err, req, res, next);
                } else {
                    handle.call(layer,req, res);
                }
            } else {
                next(err);
            }
        } else {
            if (handle.length >= 4 || !match) {
                next();
            } else {
                req.params = match.params;
                handle.call(layer.handle, req, res, next);
            }
        }
    }
}

proto.inject = function(fn) {
    var injector = inject(fn,this);
    return injector;
};

proto.monkey_patch = function(req, res) {
    request.__proto__ = req;
    req.prototype = request;

    response.__proto__ = res;
    res.prototype = response;
};