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
    var errs = [];
    var that = this;
    params.forEach(function(name) {
        that.app._factories[name].call(null, null,  null, function(err, v) {
            values.push(v);
            errs.push(err);
        });
    });
    return function(fn) {
        fn(errs, values);
    };
};