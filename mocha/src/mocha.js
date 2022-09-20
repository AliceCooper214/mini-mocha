const path = require('path');
const interfaces = require('../interfaces');
const Suite = require('./suite');
const utils = require('./utils');
const Runner = require('./runner');
const sped = require('../reporters/sped');

class Mocha {
  constructor() {
    this.rootSuite = new Suite(null, '')
    interfaces['bdd'](global, this.rootSuite, "'bdd'")

    const spec = path.resolve(__dirname, '../../test')
    const files = utils.findCaseFile(spec)
    files.forEach(file => require(file))
  }
  run() {
    const runner = new Runner();
    runner.run(this.rootSuite);
    sped(runner);
  }
}
module.exports = Mocha;