const Suite = require('../src/suite');
const Test = require('../src/test');
const { adaptPromise } = require('../src/utils');

module.exports = function (context, root) {
  const suites = [root]
  context.describe = context.context = function (title, callback) {
    const cur = suites[0];
    const suite = new Suite(cur, title);
    suites.unshift(suite);
    callback.call(suite);
    suites.shift();
  }
  context.it = context.specify = function (title, fn) {
    const cur = suites[0];
    const test = new Test(title, adaptPromise(fn));
    cur.tests.push(test);
  }
  context.before = function (fn) {
    const cur = suites[0];
    cur._beforeAll.push(adaptPromise(fn));
  }
  context.after = function (fn) {
    const cur = suites[0];
    cur._afterAll.push(adaptPromise(fn));
  }
  context.beforeEach = function (fn) {
    const cur = suites[0];
    cur._beforeEach.push(adaptPromise(fn));
  }
  context.afterEach = function (fn) {
    const cur = suites[0];
    cur._afterEach.push(adaptPromise(fn));
  }
}