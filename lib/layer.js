/**
 * Created by samael on 15-6-23.
 */
var p2re = require("path-to-regexp");


module.exports = function(router, handle) {
    this.path = router;
    var length = this.path.length;
    if (this.path[length - 1] == '/') {
        this.path = this.path.slice(0,-1);
    }
    this.handle = handle;
    this.match = function (r, option) {
        var keys = [];
        option = option ? true : false;
        var re = p2re(this.path, keys, {end:option});
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
