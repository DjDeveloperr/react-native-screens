const React = require('react');
const ReactNative = require('react-native');

const passthrough = ({children}) => children ?? React.createElement(ReactNative.View);
const chainableGesture = () => {
  const gesture = {};
  const methods = [
    'activeOffsetX',
    'activeOffsetY',
    'enabled',
    'hitSlop',
    'onEnd',
    'onFinalize',
    'onStart',
    'onUpdate',
    'runOnJS',
    'simultaneousWithExternalGesture',
  ];
  for (const method of methods) {
    gesture[method] = () => gesture;
  }
  return gesture;
};

module.exports = {
  __esModule: true,
  BaseButton: ReactNative.TouchableOpacity,
  BorderlessButton: ReactNative.TouchableOpacity,
  Directions: {},
  DrawerLayoutAndroid: ReactNative.View,
  FlatList: ReactNative.FlatList,
  FlingGestureHandler: ReactNative.View,
  ForceTouchGestureHandler: ReactNative.View,
  Gesture: {
    Fling: chainableGesture,
    Pan: chainableGesture,
  },
  GestureDetector: passthrough,
  GestureHandlerRootView: ReactNative.View,
  LongPressGestureHandler: ReactNative.View,
  NativeViewGestureHandler: ReactNative.View,
  PanGestureHandler: ReactNative.View,
  PinchGestureHandler: ReactNative.View,
  RawButton: ReactNative.TouchableOpacity,
  RectButton: ReactNative.TouchableOpacity,
  RotationGestureHandler: ReactNative.View,
  ScrollView: ReactNative.ScrollView,
  PointerType: {TOUCH: 0},
  State: {},
  Switch: ReactNative.Switch,
  TapGestureHandler: ReactNative.View,
  TextInput: ReactNative.TextInput,
  TouchableHighlight: ReactNative.TouchableHighlight,
  TouchableNativeFeedback: ReactNative.TouchableNativeFeedback,
  TouchableOpacity: ReactNative.TouchableOpacity,
  TouchableWithoutFeedback: ReactNative.TouchableWithoutFeedback,
};
