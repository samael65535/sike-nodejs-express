/**
 * Created by samael on 15-6-23.
 */
module.exports = function(router, handle) {
    this.router = router;
    this.handle = handle;
    this.match = function(r) {
        if (this.router.slice(0, r.length) == r) {
            return {path: r};
        }
        return;
    };
};



