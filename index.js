var http = require('http');

var proto =  function(req, res) {
    res.writeHead(404);
    res.end("hello")
};

proto.listen = function() {
    var server = http.createServer(this);
    server.listen.apply(server, arguments)
    return server
};

module.exports = function() {
    return proto;
};