/**
 * Created by samael on 15-6-25.
 */

module.exports = function(verb, handle) {
    return function(req,res,next) {
        if (verb == req.method) {
            handle(req, res);
        } else {
            next();
        }
    }
};