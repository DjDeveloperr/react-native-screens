const React = require('react');

const definitions = [];
let associatedObjects = new WeakMap();

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
  associatedObjects = new WeakMap();
}

function runOnUI(fn, ...args) {
  return Promise.resolve(fn(...args));
}

function refreshUIKitHostView() {
  return true;
}

function refreshUIKitHostViewHandle() {
  return true;
}

function refreshUIKitHostViewOwner() {
  return true;
}

function refreshUIKitHostViewOwnerHandle() {
  return true;
}

function refreshUIKitHostViewDirectOwner() {
  return true;
}

function refreshUIKitHostViewDirectOwnerHandle() {
  return true;
}

function invalidateUIKitHostReadyOwner() {
  return true;
}

function invalidateUIKitHostReadyOwnerHandle() {
  return true;
}

function notifyUIKitAccessibilityLayoutChanged() {
  return true;
}

function notifyUIKitAccessibilityLayoutChangedHandle() {
  return true;
}

function flushUIKitHostView() {
  return true;
}

function flushUIKitHostViewHandle() {
  return true;
}

function flushUIKitHostViewOwner() {
  return true;
}

function flushUIKitHostViewOwnerHandle() {
  return true;
}

function reactNativeFabricViewLayoutTraits(view) {
  return view?.__nativeScriptFabricViewLayoutTraits ?? null;
}

function reactNativeFabricViewLayoutTraitsForHandle() {
  return null;
}

function eventBridge(fn) {
  return fn;
}

function createNativeActionTarget(callback) {
  const target = {
    nativeScriptHandleAction(sender) {
      callback(sender);
    },
  };

  return {
    action: 'nativeScriptHandleAction:',
    dispose() {},
    target,
  };
}

function canCreateNativeActionTarget() {
  return true;
}

function setAssociatedNativeObject(target, key, value) {
  if ((typeof target !== 'object' && typeof target !== 'function') || !target) {
    return false;
  }

  let records = associatedObjects.get(target);
  if (!records) {
    records = new Map();
    associatedObjects.set(target, records);
  }

  if (value == null) {
    records.delete(key);
  } else {
    records.set(key, value);
  }

  return true;
}

function getAssociatedNativeObject(target, key) {
  if ((typeof target !== 'object' && typeof target !== 'function') || !target) {
    return null;
  }

  return associatedObjects.get(target)?.get(key) ?? null;
}

module.exports = {
  __esModule: true,
  default: {
    canCreateNativeActionTarget,
    createNativeActionTarget,
    defineUIKitContainer,
    defineUIViewController,
    eventBridge,
    getAssociatedNativeObject,
    reactNativeFabricViewLayoutTraits,
    reactNativeFabricViewLayoutTraitsForHandle,
    refreshUIKitHostView,
    refreshUIKitHostViewHandle,
    refreshUIKitHostViewOwner,
    refreshUIKitHostViewOwnerHandle,
    refreshUIKitHostViewDirectOwner,
    refreshUIKitHostViewDirectOwnerHandle,
    invalidateUIKitHostReadyOwner,
    invalidateUIKitHostReadyOwnerHandle,
    notifyUIKitAccessibilityLayoutChanged,
    notifyUIKitAccessibilityLayoutChangedHandle,
    flushUIKitHostView,
    flushUIKitHostViewHandle,
    flushUIKitHostViewOwner,
    flushUIKitHostViewOwnerHandle,
    setAssociatedNativeObject,
    __getDefinitions,
    __resetDefinitions,
    runOnUI,
  },
  __getDefinitions,
  __resetDefinitions,
  canCreateNativeActionTarget,
  createNativeActionTarget,
  defineUIKitContainer,
  defineUIViewController,
  eventBridge,
  getAssociatedNativeObject,
  reactNativeFabricViewLayoutTraits,
  reactNativeFabricViewLayoutTraitsForHandle,
  refreshUIKitHostView,
  refreshUIKitHostViewHandle,
  refreshUIKitHostViewOwner,
  refreshUIKitHostViewOwnerHandle,
  refreshUIKitHostViewDirectOwner,
  refreshUIKitHostViewDirectOwnerHandle,
  invalidateUIKitHostReadyOwner,
  invalidateUIKitHostReadyOwnerHandle,
  notifyUIKitAccessibilityLayoutChanged,
  notifyUIKitAccessibilityLayoutChangedHandle,
  flushUIKitHostView,
  flushUIKitHostViewHandle,
  flushUIKitHostViewOwner,
  flushUIKitHostViewOwnerHandle,
  setAssociatedNativeObject,
  runOnUI,
};
