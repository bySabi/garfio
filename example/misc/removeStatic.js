const fs = require('fs-extra');

const RM = [
  '.next',
  'out',
  '../_next',
  '../counter',
  '../counterNested',
  '../counters10x40',
  '../index.html',
];

RM.forEach(p => fs.removeSync(__dirname + '/../' + p));
