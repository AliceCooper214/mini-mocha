const fs = require('fs');
const path = require('path');

module.exports.findCaseFile = function (filepath) {
  function readFileList(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach((item) => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        readFileList(fullPath, fileList);
      } else {
        fileList.push(fullPath);
      }
    })
    return fileList;
  }
  const fileList = [];
  try {
    const stat = fs.statSync(filepath);
    if (stat.isFile()) {
      fileList = [filepath];
      return fileList;
    }
    readFileList(filepath, fileList);
  } catch (error) {
    console.log(e);
  }

  return fileList;
}

module.exports.adaptPromise = function (fn) {
  return () => new Promise(resolve => {
    if (fn.length == 0) {
      try {
        const ret = fn();
        if (ret instanceof Promise) {
          return ret.then(resolve, resolve);
        } else {
          resolve();
        }
      } catch (error) {
        resolve(error)
      }
    } else {
      function done(error) {
        resolve(error)
      }
      fn(done)
    }
  })
}