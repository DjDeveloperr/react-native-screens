// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/blob/v5.6.1/src/SafeAreaView.tsx
'use client';

import React from 'react';
import { SafeAreaViewProps } from './SafeAreaView.types';
import SafeAreaViewNativeComponent, {
  NativeProps as SafeAreaViewNativeComponentProps,
} from '../../fabric/safe-area/SafeAreaViewNativeComponent';
import { Platform, StyleSheet, View } from 'react-native';

export function SafeAreaView(props: SafeAreaViewProps) {
  if (Platform.OS === 'ios') {
    // NATIVESCRIPT_PORT_DEVIATION: upstream iOS uses ObjC/Fabric
    // RNSSafeAreaView, while this fork disables that native implementation and
    // keeps iOS here as a normal React Native view.
    // The iOS 26 screen wrapper shape is still preserved for content-wrapper
    // scroll-view discovery; introducing native padding here would duplicate
    // UIKit navigation-controller layout and regress under-header content.
    return (
      <View {...props} style={[styles.flex, props.style]} collapsable={false} />
    );
  }

  return (
    <SafeAreaViewNativeComponent
      {...props}
      style={[styles.flex, props.style]}
      edges={getNativeEdgesProp(props.edges)}
    />
  );
}

function getNativeEdgesProp(
  edges: SafeAreaViewProps['edges'],
): SafeAreaViewNativeComponentProps['edges'] {
  return {
    top: false,
    bottom: false,
    left: false,
    right: false,
    ...edges,
  };
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
