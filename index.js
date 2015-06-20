var http = require('http');
module.exports = function() {
    var server = http.createServer(function(req, res) {
        res.writeHead(404);
        res.end("hello")
    });
    return server
};