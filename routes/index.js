'use strict';

var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var lstat = fs.lstatSync;

function exploreDirs(dir) {
  fs
    .readdirSync(dir)
    .filter(function(child) {
      var currentName = child.split('.');
      if (currentName.length === 2) {
        if (currentName[0] === 'index' && dir == __dirname) {
          return false;
        }
        return (currentName[1] === 'js') && (currentName[0] !== 'sample');
      }
      return true;
    })
    .map(function(child) {
      var childPath = path.join(dir, child);
      if (lstat(childPath).isDirectory()) {
        // files in folder will be treated as another namespace
        exploreDirs(childPath);
      } else {
        var routes = require(path.join(dir, child));
        var routesPath = routes.path || dir.replace(__dirname, '');
        var file = child.split('.')[0];
        routesPath += (file !== 'index') ?
          '/' + file :
          '';
        router.use(routesPath, routes);
      }
    });
}
exploreDirs(__dirname);
module.exports = router;