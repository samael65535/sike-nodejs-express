/**
 * Created by samael on 15-6-30.
 */
var merge = require('utils-merge');
var proto = {};

module.exports = function(handler) {
    function injector(handler) {


    }
    injector.handler = handler;
    merge(injector, proto);
    return injector;
};

proto.extract_params = function() {
    var strFn = this.handler.toString();
    var FN_ARG         =  /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
    var result = strFn.match(FN_ARG)[1];
    return result.length == 0  ? [] : result.split(',');
};