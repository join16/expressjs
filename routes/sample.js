
'use strict';
// required variables
var express = require('express');
var router = express.Router();
// frequently usesd modules
var Promise = require('promise');
var async = require('async');
// including models, Error generator, id parser
var db = require('../models');
var ReturnError = require('../lib/return-error');
var lib  = require('../lib');

// if you want to customize default routes of this file, use below line
// router.path = '/your/own/customized/path';

router.route('/')
  .get(function(req, res, next) {
  });


module.exports = router;