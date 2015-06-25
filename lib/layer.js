/**
 * Created by samael on 15-6-23.
 */
var p2re = require("path-to-regexp");


module.exports = function(router, handle) {
    this.router = router;
    var length = this.router.length;
    if (this.router[length - 1] == '/') {
        this.router = this.router.slice(0,-1);
    }
    this.handle = handle;
    this.match = function (r) {
        var keys = [];
        var re = p2re(this.router, keys, {end:false});
        r = decodeURIComponent(r);
        if (re.test(r)) {
            var obj = {
                path: null,
                params:{}
            };
            var match = re.exec(r);
            for (var i = 0; i < keys.length; i++) {
                obj.params[keys[i].name] = match[i + 1];
            }
            obj.path = match[0];
            return obj
        }
        return;
    };

};



