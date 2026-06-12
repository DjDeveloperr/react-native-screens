import React from 'react';
import * as NativeScriptRuntime from '@nativescript/react-native';
import { Platform, View, type ViewProps } from 'react-native';
import ScreenContentWrapperNativeComponent from '../fabric/ScreenContentWrapperNativeComponent';
import {
  NativeScriptScreenHeaderSubviewContext,
  notifyNativeScriptScreenContentWrapperFrame,
  notifyNativeScriptScreenContentWrapperHostReady,
} from './native-stack/native-script/NativeScriptScreenStack';

type NativeScriptScreenContentWrapperHostProps = ViewProps & {
  screenId?: string | undefined;
};

type NativeScriptScreenContentWrapperHostView = {
  childrenView: any;
  rootView: any;
};

function nativeValue(name: string) {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const api = globalObject.__nativeScriptNativeApi;

  return api?.[name] ?? globalObject[name];
}

function flexibleSizeMask() {
  'worklet';
  const autoresizing = nativeValue('UIViewAutoresizing');

  return (
    (autoresizing?.FlexibleWidth ?? autoresizing?.flexibleWidth ?? 2) |
    (autoresizing?.FlexibleHeight ?? autoresizing?.flexibleHeight ?? 16)
  );
}

function layoutNativeScriptScreenContentWrapper(
  view: NativeScriptScreenContentWrapperHostView,
  props: Readonly<NativeScriptScreenContentWrapperHostProps>,
) {
  'worklet';
  const rootView = view.rootView;
  const childrenView = view.childrenView;

  if (!rootView || !childrenView) {
    return;
  }

  const refresh = () => {
    'worklet';
    rootView.userInteractionEnabled = true;
    childrenView.userInteractionEnabled = true;
    if (childrenView !== rootView) {
      childrenView.frame = rootView.bounds;
      childrenView.autoresizingMask = flexibleSizeMask();
    }
    NativeScriptRuntime.refreshUIKitHostView(childrenView);
    if (childrenView !== rootView) {
      NativeScriptRuntime.refreshUIKitHostView(rootView);
    }
    notifyNativeScriptScreenContentWrapperFrame(
      props.screenId,
      rootView.frame,
      childrenView,
    );
  };

  refresh();
}

const NativeScriptScreenContentWrapperHost =
  NativeScriptRuntime.defineUIKitContainer<
    NativeScriptScreenContentWrapperHostProps,
    any,
    any
  >({
    debugName: 'RNSScreenContentWrapper.NativeScript',
    layout: { sizing: 'fill' },
    create() {
      'worklet';
      // NATIVESCRIPT_PORT_DEVIATION: upstream RNSScreenContentWrapper is a
      // native component view that reports its frame directly to RNSScreen.
      // The TS port hosts React children in a NativeScript UIKit container and
      // sends the same frame signal through the stack registry after layout.
      const UIView = nativeValue('UIView');
      const UIColor = nativeValue('UIColor');

      if (!UIView || typeof UIView.alloc !== 'function') {
        throw new Error('UIView is not available in the UI runtime');
      }

      const rootView = UIView.alloc().init();
      const childrenView = rootView;

      rootView.backgroundColor = UIColor?.clearColor ?? null;
      rootView.userInteractionEnabled = true;

      return { childrenView, rootView };
    },
    mounted(view, props) {
      'worklet';
      layoutNativeScriptScreenContentWrapper(view, props);
    },
    update(view, props) {
      'worklet';
      layoutNativeScriptScreenContentWrapper(view, props);
    },
  });

const ScreenContentWrapper = React.forwardRef<View, ViewProps>(
  function ScreenContentWrapper(props, ref) {
    const screenContext = React.useContext(
      NativeScriptScreenHeaderSubviewContext,
    );
    const screenId = screenContext?.screenId;
    const handleHostReady = React.useCallback(
      (event: {
        nativeEvent?: {
          childrenViewHandle?: string | undefined;
          hasChildren?: boolean | undefined;
        };
      }) => {
        if (event.nativeEvent?.hasChildren !== true) {
          return;
        }

        notifyNativeScriptScreenContentWrapperHostReady(
          screenId,
          event.nativeEvent.childrenViewHandle,
        ).catch(() => undefined);
      },
      [screenId],
    );

    if (Platform.OS === 'ios') {
      return (
        <NativeScriptScreenContentWrapperHost
          {...props}
          ref={ref as any}
          attachController={false}
          attachNativeView
          collapsable={false}
          onHostReady={handleHostReady}
          screenId={screenId}
        />
      );
    }

    return (
      <ScreenContentWrapperNativeComponent
        ref={ref}
        collapsable={false}
        {...props}
      />
    );
  },
);

export default ScreenContentWrapper;
