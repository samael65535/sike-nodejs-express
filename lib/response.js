/**
 * Created by samael on 15-7-4.
 */
var mime = require('mime');
var accepts = require('accepts');
// proto.__proto__ = ???
module.exports = function(res, app) {
    var proto = {};
    proto.app = app;
    proto.isExpress = true;
    proto.__proto__ = res.__proto__;
    proto.redirect = function(codeOrUrl, url) {
        var code = codeOrUrl;
        if (url == undefined) {
            code = 302;
            url = codeOrUrl
        }
        res.writeHead(code, {
            'Location': url ? url : codeOrUrl,
            'Content-Length': 0
        });
        res.req.url = url;
        res.end();
    };

    proto.default_type = function(ext) {
        var type =  mime.lookup(ext);
        if (!proto._default_type) {
            proto._default_type = type
        }
        //res.writeHead(200, {
        //    'Content-Type': proto._default_type
        //});
    };

    proto.type = function(ext) {
        var type =  mime.lookup(ext);
        if (!ext) {
            type = 'text/html';
        }
        proto.default_type(ext);
        res.writeHead(200, {
            'Content-Type': type
        });
    };

    proto.format = function(json) {
        var arr = Object.keys(json);
        var accept = accepts(res.req);
        if (arr.length == 0) {
            var err = new Error("Not Acceptable");
            err.statusCode = 406;
            throw err;
        } else {
            var ext = accept.types(arr);
            proto.type(ext);
            json[ext]();
        }
    };

    proto.send = function(data) {
        if(typeof data == 'string') {
            if(!proto._default_type) {
                proto.default_type('html');
                res.writeHead(200, {
                    'Content-Length': Buffer.byteLength(data, 'utf-8'),
                    'Content-Type': proto._default_type
                });
            } else {
                res.addTrailers({'Content-Length': Buffer.byteLength(data, 'utf-8')});
            }
            res.end(data);
        } else if (data instanceof Buffer){
            if(!proto._default_type) {
                proto.default_type('data');
                res.writeHead(200, {
                    'Content-Type': proto._default_type,
                    'Content-Length': data.length
                });
            } else {
                res.addTrailers({'Content-Length': data.length});
            }

            res.end(data);
        }
    };
    return proto;
};
