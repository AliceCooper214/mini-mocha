const assert = require('assert');
const { getTag } = require('../index');

describe('检查：getTag函数执行', function () {
  before(function () {
    console.log('😁before钩子触发');
  });
  describe('测试：正常流', function () {
    it('类型返回： [object JSON]', function (done) {
      setTimeout(() => {
        assert.equal(getTag(JSON), '[object JSON]');
        done();
      }, 1000);
    });
    it('类型返回： [object Number]', function () {
      assert.equal(getTag(1), '[object Number]');
    });
  });
  describe('测试：异常流', function () {
    it('类型返回： [object Undefined]', function () {
      assert.equal(getTag(undefined), '[object Undefined]');
    });
    it('类型返回： [object Object]', function () {
      assert.equal(getTag([]), '[object Object]');
    });
  });
  after(function () {
    console.log('😭after钩子触发');
  });
});