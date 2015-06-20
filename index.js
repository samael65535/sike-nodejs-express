
module.exports = function() {
    return function(req, res) {
        res.writeHead(404);
        res.end("hello")
    }
};