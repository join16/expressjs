
'use strict';

module.exports = function(req, res, next) {
    // sanitizing empty inputs
    for (var key1 in req.body) {
        if (req.param(key1) !== undefined) {
            req.sanitize(key1).trim();
        }
        if (req.param(key1) === '') {
            req.body[key1] = undefined;
        }
    }
    for (var key2 in req.query) {
        if (req.param(key2) !== undefined) {
            req.sanitize(key2).trim();
        }
        if (req.param(key2) === '') {
            req.query[key2] = undefined;
        }
    }
    next();
};