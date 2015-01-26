'use strict';


var expressValidator = require('express-validator');

module.exports = expressValidator({
  customValidators: {
    gte: function (param, num) {
      return (param >= num);
    },
    lte: function (param, num) {
      return (param <= num);
    },
    isArray: function (param) {
      if (typeof param === 'object') {
        return Array.isArray(param);
      } else if (typeof param === 'string') {

        return Array.isArray(parsed);
      } else {
        return false;
      }
    },
    isString: function (param) {
      return (typeof param === 'string')
    }
  }
});