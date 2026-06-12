const React = require('react');

const definitions = [];

function defineUIViewController(definition) {
  definitions.push(definition);
  return function NativeScriptUIViewController({ children }) {
    return React.createElement(React.Fragment, null, children);
  };
}

function defineUIKitContainer(definition) {
  definitions.push(definition);
  return function NativeScriptUIKitContainer({ children }) {
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

function refreshUIKitHostView() {
  return true;
}

function eventBridge(fn) {
  return fn;
}

module.exports = {
  __esModule: true,
  default: {
    defineUIKitContainer,
    defineUIViewController,
    eventBridge,
    refreshUIKitHostView,
    __getDefinitions,
    __resetDefinitions,
    runOnUI,
  },
  __getDefinitions,
  __resetDefinitions,
  defineUIKitContainer,
  defineUIViewController,
  eventBridge,
  refreshUIKitHostView,
  runOnUI,
};
