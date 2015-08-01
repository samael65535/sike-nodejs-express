/**
 * Created by samael on 15-7-4.
 */
var mime = require('mime');
var accepts = require('accepts');
var http = require("http");
var crc32 = require('buffer-crc32');
var net = require("net");
var fs = require('fs');
var rparser = require("range-parser");
// proto.__proto__ = ???
module.exports = function(res, app) {
    var proto = {};
    proto.app = app;
    proto.isExpress = true;
    proto.__proto__ = res.__proto__;
    proto.ETag = null;
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

    proto.send = function(code, data) {
        if(typeof code == 'number' && !data) {
            data = http.STATUS_CODES[code.toString()];
        }
        if (typeof code != 'number' && !data) {
            data = code;
            code = 200;
        }


        var length = 0;
        var sendData = null;
        var type = 'html';
        var etag = null;

        if (res.req.method == "GET" && data.length > 0 && typeof code != 'number') {
            if (res.getHeader('ETag')) {
                proto.ETag = res.getHeader('ETag');
            } else {
                proto.ETag = crc32.unsigned(data);
            }
            etag = typeof proto.ETag == 'number' ?
               '"' + proto.ETag.toString() + '"':
                proto.ETag.toString();

            if (proto.ETag == res.req.headers["if-none-match"]) {
                code = 304
            } else {
                code = 200
            }
            var t1 = new Date(res.getHeader('Last-Modified')).getTime();
            var t2 = new Date(res.req.headers["if-modified-since"]).getTime()
            if (t1 <= t2) {
                code = 304
            } else {
                code = 200
            }
        }

        var header = {
            'Content-Type': proto._default_type
        };
        if(typeof data == 'string') {
            type = 'html';
            sendData = data;
            length = Buffer.byteLength(sendData, 'utf-8');
        } else if (data instanceof Buffer){
            type = 'data';
            sendData = data;

            var range = {};
            if (res.req.headers.range) {
                range = rparser(sendData.length, res.req.headers.range);
            }
            length = sendData.length;
            header['Accept-Range'] = "bytes";

            if (range.type == "bytes") {
                code = 206;
                header['Content-Range'] = range.type + " " + range[0].start + '-' + range[0].end + '/' + sendData.length;;
                sendData = sendData.toString('utf8', range[0].start, range[0].end + 1)
            } else
                code = 200;

            if (range == -1) {
                code = 416;
            }

        } else if (data instanceof Object) {
            type = 'json';
            sendData = JSON.stringify(data);
            length = sendData.length;
        }
        header['Content-Length'] = length;

        if(!proto._default_type) {
            proto.default_type(type);
        }
        if (etag){
            header['ETag'] = etag.toString()
        }
        res.writeHead(code, header);

        res.end(sendData);

    };

    proto.stream = function(stream) {
        stream.on("data",function(chunk) {
            proto.type(".txt");
            proto.send(200, chunk);
        });
    };

    proto.sendfile = function(dir, opt) {
        var root = "";
        if (opt) {
            root = opt.root;
        }
        var path = root + dir;

        if (path.indexOf("..") >= 0) {
            proto.send(403);
            return;
        }
        if (fs.existsSync(path)) {
            if (fs.statSync(path).isDirectory() ) {
                proto.send(403);
            } else {
                var stream = fs.createReadStream(root + dir);
                proto.stream(stream);
            }
        } else {
            proto.send(404);
        }
    };
    return proto;
};
