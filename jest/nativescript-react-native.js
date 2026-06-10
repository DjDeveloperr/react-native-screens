const React = require('react');

const definitions = [];

function defineUIViewController(definition) {
  definitions.push(definition);
  return function NativeScriptUIViewController({children}) {
    return React.createElement(React.Fragment, null, children);
  };
}

function __getDefinitions() {
  return definitions;
}

function __resetDefinitions() {
  definitions.length = 0;
}

function runOnUI(fn, ...args) {
  return Promise.resolve(fn(...args));
}

module.exports = {
  __esModule: true,
  default: {
    defineUIViewController,
    __getDefinitions,
    __resetDefinitions,
    runOnUI,
  },
  __getDefinitions,
  __resetDefinitions,
  defineUIViewController,
  runOnUI,
};
