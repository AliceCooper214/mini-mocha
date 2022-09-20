const EventEmitter = require('events').EventEmitter;

const constants = {
  EVENT_RUN_BEGIN: 'EVENT_RUN_BEGIN',      // 执行流程开始
  EVENT_RUN_END: 'EVENT_RUN_END',          // 执行流程结束
  EVENT_SUITE_BEGIN: 'EVENT_SUITE_BEGIN',  // 执行suite开始
  EVENT_SUITE_END: 'EVENT_SUITE_END',      // 执行suite结束
  EVENT_FAIL: 'EVENT_FAIL',                // 执行用例失败
  EVENT_PASS: 'EVENT_PASS'                 // 执行用例成功
}
class Runner extends EventEmitter {
  constructor() {
    super()
    this.suites = []
  }
  async run(root) {
    this.emit(constants.EVENT_RUN_BEGIN);
    await this.runSuite(root);
    this.emit(constants.EVENT_RUN_END);
  }
  async runSuite(suite) {
    this.emit(constants.EVENT_SUITE_BEGIN, suite);

    if (suite._beforeAll.length) {
      for (const fn of suite._beforeAll) {
        const result = await fn();
        if (result instanceof Error) {
          this.emit(constants.EVENT_FAIL, `"before all" hook in ${suite.title}: ${result.message}`);
          this.emit(constants.EVENT_SUITE_END);
          return;
        }
      }
    }
    this.suites.unshift(suite);

    if (suite.tests.length) {
      for (const test of suite.tests) {
        await this.runTest(test);
      }
    }

    if (suite.suites.length) {
      for (const child of suite.suites) {
        await this.runSuite(child);
      }
    }
    this.suites.shift();

    if (suite._afterAll.length) {
      for (const fn of suite._afterAll) {
        const result = await fn();
        if (result instanceof Error) {
          this.emit(constants.EVENT_FAIL, `"after all" hook in ${suite.title}: ${result.message}`);
          this.emit(constants.EVENT_SUITE_END);
          return;
        }
      }
    }

    this.emit(constants.EVENT_SUITE_END);
  }

  async runTest(test) {
    // 1. 由suite根节点向当前suite节点，依次执行beforeEach钩子函数
    const _beforeEach = [].concat(this.suites).reverse().reduce((list, suite) => list.concat(suite._beforeEach), []);
    if (_beforeEach.length) {
      for (const fn of _beforeEach) {
        const result = await fn();
        if (result instanceof Error) {
          return this.emit(constants.EVENT_FAIL, `"before each" hook for ${test.title}: ${result.message}`)
        }
      }
    }

    // 2. 执行测试用例
    const result = await test.fn();
    if (result instanceof Error) {
      return this.emit(constants.EVENT_FAIL, `${test.title}`);
    } else {
      this.emit(constants.EVENT_PASS, `${test.title}`);
    }

    // 3. 由当前suite节点向suite根节点，依次执行afterEach钩子函数
    const _afterEach = [].concat(this.suites).reduce((list, suite) => list.concat(suite._afterEach), []);
    if (_afterEach.length) {
      for (const fn of _afterEach) {
        const result = await fn();
        if (result instanceof Error) {
          return this.emit(constants.EVENT_FAIL, `"after each" hook for ${test.title}: ${result.message}`)
        }
      }
    }
  }
}
Runner.constants = constants;
module.exports = Runner;