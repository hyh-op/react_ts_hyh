const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    //'airbnb',
    //'airbnb/hooks',
    'standard-with-typescript',
    'plugin:eslint-comments/recommended',
    'plugin:react/recommended',
    'plugin:unicorn/recommended',
    'plugin:promise/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    //ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'unicorn', 'promise', '@typescript-eslint'],
  //eslint-plugin-import 与 TypeScript 搭配存在 Bug，需要添加一条很重要的 rule，不然在 .ts 和 .tsx 模块文件中引入另一个模块会报错
  rules: {
    'import/extensions': [
      ERROR,
      'ignorePackage',
      {
        ts: 'never',
        tsx: 'never',
        json: 'never',
        js: 'never',
      },
    ],
  },
  settings: {
    'import/reslover': {
      node: {
        // 指定eslint-plugin-import解析的后缀名，出现频率高的文件类型放在前面
        extensions: ['.ts', '.tsx', '.js', '.json'],
      },
      // 配合eslint-import-resolver-typescript解决ts的import时的路径映射问题
      typescript: {},
    },
  },
};
