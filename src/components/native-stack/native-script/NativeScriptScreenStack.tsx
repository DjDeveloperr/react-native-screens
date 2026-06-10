import type * as React from 'react';
import type { View } from 'react-native';

import type { ScreenProps, ScreenStackProps } from '../../../types';

export const NativeScriptScreenStack = null as unknown as React.ComponentType<
  ScreenStackProps
>;

export const NativeScriptScreenStackItem =
  null as unknown as React.ForwardRefExoticComponent<
    React.PropsWithoutRef<
      Omit<ScreenProps, 'enabled' | 'isNativeStack' | 'hasLargeHeader'> & {
        contentStyle?: ScreenProps['style'];
        headerConfig?: unknown;
        screenId: string;
      }
    > &
      React.RefAttributes<View>
  >;
