// Option 1: Single export
module.exports = require('./src/o3-xxx.js');

// Option 2: Multiple exports
const A = require('./src/a.js');
const B = require('./src/b.js');

module.exports = {
  A,
  B
};
