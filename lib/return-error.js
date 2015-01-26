
'use strict';

var STATUS_CODE = {
    INVALID: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOTFOUND: 404,
    CONFLICT: 409,

    INTERNAL: 500
};

Error.stackTraceLimit = Infinity;

/**************** Helpers *********************/

function messageFromCode(code) {
    switch (code) {
        case STATUS_CODE.INTERNAL: return 'Internal Server Error';
        case STATUS_CODE.INVALID: return 'Invalid Arguments';
        case STATUS_CODE.UNAUTHORIZED: return 'Not Logined';
        case STATUS_CODE.FORBIDDEN: return 'FORBIDDEN';
        case STATUS_CODE.NOTFOUND: return 'Not Found';
        case STATUS_CODE.CONFLICT: return 'conflict';
        default: return 'Unknown Error';
    }
}

function errorFromSqlError(error) {
    var options = {
        status: STATUS_CODE.INTERNAL
    };
    options.debug = {
        sql: error.sql,
        message: error.message
    };
    if (typeof error.code === 'string' && error.code.indexOf('ER_DUP') > -1) {
        options.status = STATUS_CODE.INVALID;
    }

    return new ReturnError(options);
}

function createReturnErrorWithStatus(status, debug) {
    return new ReturnError({
        status: status,
        debug: debug
    });
}

function isArray(arr) {
    return Array.isArray(arr);

}

/************ Return Error Definition ***************/

function ReturnError(options) {
    this.status = STATUS_CODE.INTERNAL;
    for (var key in STATUS_CODE) {
        if (STATUS_CODE[key] == options.status) {}
        this.status = options.status;
    }
    this.message = messageFromCode(this.status);
    this.debug = {
        occurredDate: new Date()
    };
    for (var key in options.debug) {
        if (options.debug.hasOwnProperty(key)) {
            this.debug[key] = options.debug[key];
        }
    }
}

ReturnError.prototype = new Error();

ReturnError.createErrorFromError = function(error) {
    if (error.sql) {
        return errorFromSqlError(error);
    } else if (isArray(error.name)) {
        return ReturnError.createInvalidError(error.name);
    }
};

ReturnError.createConflictError = function(table) {
    if (typeof table === 'string') {
        var debug = {
            message: 'conflict occurred in ' +table
        };
    }
    return createReturnErrorWithStatus(STATUS_CODE.CONFLICT, debug);
};

ReturnError.createNotFoundError = function(field) {
    if (typeof field === 'string') {
        var debug = {
            message: field + ' not found'
        };
    }
    return createReturnErrorWithStatus(STATUS_CODE.NOTFOUND, debug);
};

ReturnError.createInvalidError = function(validations) {
    if (Array.isArray(validations)) {
        var debug = {
            validations: validations
        };
    }
    return createReturnErrorWithStatus(STATUS_CODE.INVALID, debug);
};

ReturnError.createServerError = function(message) {
    var debug = {
        message: 'something wrong in server'
    };
    if (typeof message === 'string') {
        debug.message += ' at' + message;
    }
    return createReturnErrorWithStatus(STATUS_CODE.INTERNAL, debug);
};

ReturnError.prototype.toObject = function(debug) {
    var errorData = {
        message: this.message
    };
    if (debug) {
        errorData.debug = this.debug;
    }
    return errorData;
};

module.exports = ReturnError;