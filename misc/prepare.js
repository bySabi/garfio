const fs = require('fs-extra');
const files = require('./files');

//files.forEach(p => fs.removeSync(__dirname + '/' + p.dst));
files.forEach(p => {
  fs.copy(__dirname + '/' + p.src, __dirname + '/' + p.dst).then(() =>
    console.log('Copied static dir succesfully')
  );
});
