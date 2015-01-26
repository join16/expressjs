
'use strict';

var ReturnError = require('./return-error');

module.exports = function(req, res, next) {

    function toJSONFromData(data) {
        if (!data) return {};
        if (typeof data === 'function' && typeof data.toJSON === 'function') {
            return data.toJSON();
        } else if (Array.isArray(data)) {
            return data.map(function(d) {
                return toJSONFromData(d);
            });
        } else {
            return data;
        }
    }

    res.returnOk = function(t, data) {
        if (arguments.length === 2) {
            // transaction has been passed.
            t.commit();
        } else {
            // transaction has not been passed.
            data = t;
        }
        res.json(toJSONFromData(data));
    };

    res.returnError = function(t, error) {
        if (arguments.length === 2) {
            t.rollback();
        } else {
            error = t;
        }
        if (error instanceof ReturnError) {
            next(error);
        } else {
            next(ReturnError.createErrorFromError(error))
        }
    };

    res.returnValidationErrors = function(error) {
        next(ReturnError.createInvalidError(error));
    };
    res.returnConflictErrors = function(table) {
        if (typeof table === 'string') {
            return next(ReturnError.createConflictError(table));
        } else {
            return next(ReturnError.createConflictError());
        }
    };
    res.returnServerErrors = function() {
        return next(ReturnError.createServerError());
    };
    next();
};