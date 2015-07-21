/**
 * Created by samael on 15-7-4.
 */
var mime = require('mime');
var accepts = require('accepts');
var http = require("http");
var crc32 = require('buffer-crc32');
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

        if (res.req.method == "GET" && data.length > 0) {
            if (res.getHeader('ETag')) {
                proto.ETag = res.getHeader('ETag');
            } else {
                proto.ETag = crc32.unsigned(data);
            }
            etag = typeof proto.ETag == 'number' ?
               '"' + proto.ETag.toString() + '"':
                proto.ETag.toString();

            if (proto.ETag == this.req.headers["if-none-match"]) {
                code = 304
            } else {
                code = 200
            }
        }

        if(typeof data == 'string') {
            type = 'html';
            sendData = data;
            length = Buffer.byteLength(sendData, 'utf-8');
        } else if (data instanceof Buffer){
            type = 'data';
            sendData = data;
            length = sendData.length;
        } else if (data instanceof Object) {
            type = 'json';
            sendData = JSON.stringify(data);
            length = sendData.length;
        }


        if(!proto._default_type) {
            proto.default_type(type);
        }

        var header = {
            'Content-Length': length,
            'Content-Type': proto._default_type
        };

        if (etag){
            header['ETag'] = etag.toString()
        }

        res.writeHead(code, header);

        res.end(sendData);

    };
    return proto;
};
