/**
 * Created by samael on 15-7-4.
 */

// proto.__proto__ = ???
module.exports = function(req, app) {
    var proto = {};
    proto.isExpress = true;
    proto.app = app;
    proto.__proto__ = req.__proto__;
    return proto;
};