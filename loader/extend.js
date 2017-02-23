const path = require('path');
const helper = require('think-helper');
const assert = require('assert');

const allowExtends = ['think', 'context', 'request', 'response', 'controller', 'logic'];
/**
 * const modelExtend = require('think-model').extend;
 *  modelExtend = {
 *  think: {},
 *  context: {},
 *  request: {}
 * };
 * module.exports = [
 *  modelExtend,
 * ]
 */
function loader(appPath, isMultiModule, thinkPath){
  const thinkFilePath = path.join(thinkPath, 'lib/config/extend.js');
  let extend = require(thinkFilePath);
  const filepath = path.join(appPath, isMultiModule ? 'common/config/extend.js' : 'config/extend.js');
  if(helper.isFile(filepath)){
    extend = extend.concat(require(filepath));
  }
  let ret = {};
  function assign(type, ext){
    if(!ret[type]){
      ret[type] = {};
    }
    ret[type] = Object.assign(ret[type], ext);
  }
  //system extend
  allowExtends.forEach(type => {
    let filepath = path.join(thinkPath, `lib/extend/${type}.js`);
    if(!helper.isFile(filepath)){
      return;
    }
    assign(type, require(filepath));
  });
  extend.forEach(item => {
    for(let type in item){
      assert(allowExtends.indexOf(type) > -1, `extend type=${type} not allowed, allow types: ${allowExtends.join(', ')}`);
      assign(type, item[type]);
    }
  });
  //application extend
  allowExtends.forEach(type => {
    let filepath = path.join(appPath, isMultiModule ? `common/extend/${type}.js` : `extend/${type}.js`);
    if(!helper.isFile(filepath)){
      return;
    }
    assign(type, require(filepath));
  });
  return ret;
}

module.exports = loader;