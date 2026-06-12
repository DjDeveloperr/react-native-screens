'use client';

import { Platform, View } from 'react-native';
import React from 'react';
import { ScreenContainerProps } from '../types';
import { isNativePlatformSupported, screensEnabled } from '../core';

// Native components
import ScreenContainerNativeComponent from '../fabric/ScreenContainerNativeComponent';
import { NativeScriptScreenContainer } from './native-stack/native-script/NativeScriptScreenStack';

function ScreenContainer(props: ScreenContainerProps) {
  const { enabled = screensEnabled(), hasTwoStates, ...rest } = props;

  if (enabled && isNativePlatformSupported) {
    if (Platform.OS === 'ios') {
      return (
        <NativeScriptScreenContainer hasTwoStates={hasTwoStates} {...rest} />
      );
    }

    if (hasTwoStates) {
      const ScreenNavigationContainer = ScreenContainerNativeComponent;
      return <ScreenNavigationContainer {...rest} />;
    }
    return <ScreenContainerNativeComponent {...rest} />;
  }
  return <View {...rest} />;
}

export default ScreenContainer;
