import * as React from 'react';
import type { View } from 'react-native';

import type {
  SearchBarPlacement,
  ScreenContainerProps,
  ScreenProps,
  ScreenStackProps,
} from '../../../types';

export const NativeScriptScreen =
  null as unknown as React.ForwardRefExoticComponent<
    React.PropsWithoutRef<ScreenProps> & React.RefAttributes<View>
  >;

export const NativeScriptScreenContainer =
  null as unknown as React.ComponentType<ScreenContainerProps>;

export const NativeScriptScreenStack =
  null as unknown as React.ComponentType<ScreenStackProps>;

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

export type NativeScriptHeaderSubviewType =
  | 'back'
  | 'left'
  | 'right'
  | 'title'
  | 'center'
  | 'searchBar';

export type NativeScriptHeaderSubviewRegistration = {
  allowToolbarIntegration?: boolean;
  backImageIsTemplate?: boolean;
  backImageSource?: unknown;
  hidesSharedBackground?: boolean;
  hideWhenScrolling?: boolean;
  order: number;
  placement?: SearchBarPlacement;
  screenId: string;
  searchController?: unknown;
  subviewId: string;
  type: NativeScriptHeaderSubviewType;
};

export const NativeScriptScreenHeaderSubviewContext = React.createContext<{
  screenId: string;
} | null>(null);

export const NativeScriptScreenHeaderSearchBarContext = React.createContext<{
  order: number;
} | null>(null);

export function registerNativeScriptHeaderSubview(
  _registration: NativeScriptHeaderSubviewRegistration,
  _nativeView: unknown,
) {
  return undefined;
}

export function unregisterNativeScriptHeaderSubview(
  _screenId: string,
  _subviewId: string,
) {
  return undefined;
}

export function notifyNativeScriptHeaderSubviewChanged(_screenId: string) {
  return undefined;
}

export function notifyNativeScriptScreenContentWrapperFrame(
  _screenId: string | undefined,
  _frame: unknown,
  _contentWrapperView?: unknown,
) {
  return undefined;
}

export function notifyNativeScriptScreenContentWrapperHostReady(
  _screenId: string | undefined,
  _contentWrapperViewHandle: string | undefined,
) {
  return Promise.resolve(false);
}
