/**
 * Created by samael on 15-6-30.
 */
var merge = require('utils-merge');
var proto = {};

module.exports = function(handler, app) {
    function injector() {
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

proto.dependencies_loader = function() {
    var params = this.extract_params();
    var values = [];
    console.log(this.handler);
    for (var i = 0; i < arguments.length; i++) {
        values.push(arguments[i]);
    }
    var err;
    var that = this;
    params.forEach(function(name) {
        try {
            if (that.app._factories[name]) {
                that.app._factories[name].call(null, null, null, function (e, v) {
                    values.push(v);
                    err = e;
                });
            } else {
                throw new Error('Factory not defined: ' + name);
            }
        } catch(e) {
            err = e;
        }
    });
    return function(fn) {
          return fn(err, values);
    };
};