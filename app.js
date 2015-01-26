var debug = require('debug')('app');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

// middleware extensions of req, res
var requestExt = require('./lib/requestExt'); // striping blank attributes
var requestValidator = require('./lib/request-validator'); //middleware for validator
var responseExt = require('./lib/responseExt'); // extend functions for res
var ReturnError = require('./lib/return-error');

var app = express();

/****** add additional require statements here ******/

/***********************   **************************/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(requestValidator);
app.use(requestExt);
app.use(responseExt);

app.use('/api', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development' || app.get('env') === 'dev_server') {
    app.use(function(err, req, res, next) {
        if (err instanceof ReturnError) {
            if (err.status === STATUS_CODE.INTERNAL) {
                debug(err.stack);
            }
            res.status(err.status).json(err.toObject(true));
        } else {
            if (err instanceof Error) {
                debug(err.stack);
            }
            var status = err.status || 500;
            res.status(status).json({});
        }
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    if (err instanceof ReturnError) {
        if (err.status == STATUS_CODE.INTERNAL) {
            debug(err.stack);
        }
        res.status(err.status).json(err.toObject(false));
    } else {
        debug(err);
        res.status(500).json({});
    }
});
module.exports = app;
