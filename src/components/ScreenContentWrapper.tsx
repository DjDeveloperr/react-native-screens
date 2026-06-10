import React from 'react';
import { Platform, View, type ViewProps } from 'react-native';
import ScreenContentWrapperNativeComponent from '../fabric/ScreenContentWrapperNativeComponent';

function ScreenContentWrapper(props: ViewProps) {
  if (Platform.OS === 'ios') {
    return <View collapsable={false} {...props} />;
  }

  return <ScreenContentWrapperNativeComponent collapsable={false} {...props} />;
}

export default ScreenContentWrapper;
