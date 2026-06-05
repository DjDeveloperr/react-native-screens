const React = require('react');

const makeSharedValue = (value) => ({value});
const passthrough = (Component) => Component;
const noop = () => {};

const Reanimated = {
  createAnimatedComponent: passthrough,
  finishScreenTransition: noop,
  makeMutable: makeSharedValue,
  measure: () => ({width: 0, height: 0, x: 0, y: 0, pageX: 0, pageY: 0}),
  runOnJS: (fn) => fn,
  runOnUI: (fn) => (...args) => fn(...args),
  startScreenTransition: noop,
  useAnimatedRef: () => React.useRef(null),
  useAnimatedStyle: () => ({}),
  useDerivedValue: (fn) => makeSharedValue(fn()),
  useEvent: (handler) => handler,
  useSharedValue: makeSharedValue,
  withTiming: (value) => value,
};

module.exports = {
  __esModule: true,
  ...Reanimated,
  default: Reanimated,
  ScreenTransition: {
    Horizontal: 'horizontal',
    SwipeDown: 'swipeDown',
    SwipeLeft: 'swipeLeft',
    SwipeRight: 'swipeRight',
    SwipeUp: 'swipeUp',
    TwoDimensional: 'twoDimensional',
    Vertical: 'vertical',
  },
};
