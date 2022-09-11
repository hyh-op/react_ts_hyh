const path = require('path');
const { ModuleResolutionKind } = require('typescript');
const ISDEV = process.env.NODE_ENV !== 'production';

const PROJECT_PATH = path.resolve(__dirname, '../');
const PROJECT_DIRNAME = path.parse(PROJECT_PATH).name;
const SERVER_HOST = '127.0.0.1';
const SERVER_PORT = 5000; // 默认3000，不与本地服务冲突
module.exports = {
  PROJECT_DIRNAME,
  PROJECT_PATH,
  SERVER_HOST,
  SERVER_PORT,
  ISDEV,
};
