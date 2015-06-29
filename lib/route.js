/**
 * Created by samael on 15-6-25.
 */
var merge = require('utils-merge');
var methods = require('methods');
var proto = {};

module.exports = function() {
    function route(req, res, next) {
        route.handle(req, res, next);
    }
    route.stack = [];
    merge(route, proto);
    return route;
};

proto.use = function(verb, handle) {
    this.stack.push({
        verb: verb,
        handler: function(req,res,next) {
            if (verb == req.method.toLowerCase()) {
                handle(req, res, next);
            } else {
                next();
            }
        }
    });
};
methods.forEach(function(m) {
    proto[m] = function(handler) {
        this.use(m, handler);
        return this;
    }
});

proto['all'] = function(handler) {
    this.use('get', handler);
    return this;
};

proto.handle = function(req, res, next2) {
    var index = 0;
    var stack = this.stack;
    var next = function() {
        try {
            var r = stack[index++];
            if (index > stack.length) {
                next2();
            }
            r.handler(req, res, next);
        } catch(e) {
            if (index >= stack.length) {
                next2(e)
            }
        }
    };
    next();
};