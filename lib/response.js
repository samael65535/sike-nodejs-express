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

    proto.send = function(code, data) {
        if(typeof code == 'number' && !data) {
            data = http.STATUS_CODES[code.toString()];
        }
        if (typeof code != 'number' && !data) {
            data = code;
            code = 200;
        }

        if (res.getHeader('ETag')) {
            proto.ETag = res.getHeader('ETag');
        } else {
            proto.ETag = crc32.unsigned(data);
        }
        var length = 0;
        var sendData = null;
        var type = 'html';

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
            res.writeHead(code, {
                'Content-Length': Buffer.byteLength(data, 'utf-8'),
                'Content-Type': proto._default_type,
                'ETag': proto.ETag
            });
        } else {
            res.statusCode = code;
            res.addTrailers({'Content-Length': length});
        }
        res.end(sendData);

    };
    return proto;
};
