
'use strict';
var db = require('../models');

db.sequelize.sync({force: true})
  .then(function() {
    console.log('DB is synchronized successfully')
  })
  .catch(function(error) {
    console.error('DB sync failed', error);
  });