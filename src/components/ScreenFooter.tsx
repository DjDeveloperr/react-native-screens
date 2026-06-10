import React from 'react';
import { Platform, View, type ViewProps } from 'react-native';
import ScreenFooterNativeComponent from '../fabric/ScreenFooterNativeComponent';

/**
 * Unstable API
 */
function ScreenFooter(props: ViewProps) {
  if (Platform.OS === 'ios') {
    return <View {...props} />;
  }

  return <ScreenFooterNativeComponent {...props} />;
}

type FooterProps = {
  children?: React.ReactNode | undefined;
};

export function FooterComponent({ children }: FooterProps) {
  return <ScreenFooter collapsable={false}>{children}</ScreenFooter>;
}

export default ScreenFooter;
