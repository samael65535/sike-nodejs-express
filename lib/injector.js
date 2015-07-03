/**
 * Created by samael on 15-6-30.
 */
var merge = require('utils-merge');
var proto = {};

module.exports = function(handler, app) {
    function injector(req, res, next) {
        var loader = injector.dependencies_loader(req,res, next);
        loader(injector.handler);
    }
    merge(injector, proto);
    injector.handler = handler;
    injector.app = app;
    return injector;
};

proto.extract_params = function() {
    var strFn = this.handler.toString();
    var FN_ARG         =  /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
    var result = strFn.match(FN_ARG)[1];
    return result.length == 0  ? [] : result.split(',');
};

proto.dependencies_loader = function (req, res, next) {
    var params = this.extract_params();
    var values = {'req': req, 'res': res, 'next': next}
    var err;
    var that = this;
    params.forEach(function(name) {
        if (name !== 'req' || name !== 'res') {

            try {
                if (that.app._factories[name]) {
                    that.app._factories[name].call(null, req, res, function (e, v) {
                        //values.push(v);
                        values[name] = v;
                        err = e;
                    });
                   // that.app._factories[name].call(null, req, res, that.handler);
                } else {
                    throw new Error('Factory not defined: ' + name);
                }
            } catch (e) {
                err = e;
            }
        }
    });
    return function(fn) {
        if (err) {
            return next(err)
        }
        var p = [];
        params.forEach(function(name) {
            p.push(values[name]);
        });
        return fn.apply(null, p);
    };
};