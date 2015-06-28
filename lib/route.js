/**
 * Created by samael on 15-6-25.
 */
var merge = require('utils-merge');
var proto = {};

module.exports = function() {
    function route() {
        ;
    }
    route.stack = [];
    merge(route, proto);
    return route;
};


proto.use = function(verb, handle) {
    this.stack.push({
        verb: verb,
        handler: handle
    });
    //return function(req,res,next) {
    //    if (verb == req.method.toLowerCase()) {
    //        handle(req, res);
        //} else {
        //    next();
        //}
    //}
};