var http = require('http');

var proto =  function(req, res) {
    res.writeHead(404);
    res.end("hello")
};
proto.stack = [];
module.exports = function() {
    return proto;
};

proto.listen = function() {
    var server = http.createServer(this);
    server.listen.apply(server, arguments)
    return server
};

proto.use = function(fn) {
    this.stack.push(fn);
};
