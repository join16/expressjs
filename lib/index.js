
'use strict';

module.exports = (function() {
  function isInt(input) {
    return input % 1 === 0;
  }

  function parseId(idStrings, req, res) {
    if (!Array.isArray(idStrings)) {
      throw new Error('idStrings must be an array');
    }

    var ids = {};
    var validations = [];
    idStrings.forEach(function (idString) {
      if (!isInt(req.param(idString))) {
        validations.push('Validation id failed: ' + idString);
      } else {
        ids[idString] = parseInt(req.param(idString));
      }
    });

    if (validations.length > 0) {
      return validations;
    }
    return ids;
  }

  return {
    parseId: parseId
  };
})();