/**
 * Created by samael on 15-6-23.
 */
module.exports = function(router, handle) {
    this.router = router;
    this.handle = handle;
    this.match = function(r) {
        if (r.slice(0, this.router.length) == this.router) {
            return {path: this.router};
        }
        return;
    };
};



