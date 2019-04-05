const fs = require('fs-extra');
const files = require('./files');

files.forEach(p => fs.removeSync(__dirname + '/' + p.dst));
