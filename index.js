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
            next2(err);
        } else {
            if (layer) {
                try {
                    call(layer, err, req, res, next);
                } catch(e) {
                    if (index >= stack.length) {
                        console.log(e);
                        res.writeHead(500);
                        res.end();
                    } else {
                        next(e)
                    }
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
        }
    };
    next();
};

function call(layer, err, req, res, next) {
    var handle = layer.handle;
    var match;
    if (handle.hasOwnProperty('use')) {
        req.parent_url = layer.path;
        if (err) {
            if (handle.length === 4) {
                handle(err, req, res, next);
            } else {
                next(err);
            }
        } else {
            if (handle.length === 4) {
                next();
            } else {
                handle(req, res, next);
            }
        }
    } else {
        var url;
        if (req.parent_url == req.url)
            url = req.url;
        else
            url = req.url.slice(req.parent_url.length, req.url.length);
        match = layer.match(url);
        req.url = url;
        if (err) {
            if (handle.length === 4 && match) {
                req.params = match.params;
                handle(err, req, res, next);
            } else {
                next(err);
            }
        } else {
            if (handle.length === 4 || !match) {
                next();
            } else {
                req.params = match.params;
                handle(req, res, next);
            }
        }
    }

}