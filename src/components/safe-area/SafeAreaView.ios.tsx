// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/blob/v5.6.1/src/SafeAreaView.tsx
'use client';

import React from 'react';
import * as NativeScriptRuntime from '@nativescript/react-native';
import { StyleSheet, type ViewProps } from 'react-native';
import type { NativeProps as SafeAreaViewNativeComponentProps } from '../../fabric/safe-area/SafeAreaViewNativeComponent';
import type { SafeAreaViewProps } from './SafeAreaView.types';

type NativeSafeAreaEdges = NonNullable<
  SafeAreaViewNativeComponentProps['edges']
>;

type NativeScriptSafeAreaViewProps = SafeAreaViewProps & {
  edges: NativeSafeAreaEdges;
  style?: ViewProps['style'];
};

type NativeScriptSafeAreaHostView = {
  childrenView: any;
  rootView: any;
};

const SAFE_AREA_VIEW_CLASS_KEY = '__rnsSafeAreaViewNativeScriptClass';

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

function rectWithOriginAndSize(
  x: number,
  y: number,
  width: number,
  height: number,
) {
  'worklet';
  const CGRectMake = nativeValue('CGRectMake');

  if (typeof CGRectMake === 'function') {
    return CGRectMake(x, y, width, height);
  }

  return {
    origin: { x, y },
    size: { height, width },
  };
}

function edgeInsetsValue(
  insets: any,
  edge: 'top' | 'left' | 'right' | 'bottom',
) {
  'worklet';
  const value = insets?.[edge];

  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function frameNumber(frame: any, key: 'x' | 'y' | 'width' | 'height') {
  'worklet';

  if (key === 'x') {
    return frame?.origin?.x;
  }
  if (key === 'y') {
    return frame?.origin?.y;
  }
  if (key === 'width') {
    return frame?.size?.width;
  }

  return frame?.size?.height;
}

function numbersNearlyEqual(left: unknown, right: number) {
  'worklet';

  return typeof left === 'number' && Math.abs(left - right) < 0.5;
}

function childFrameMatches(
  childrenView: any,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  'worklet';
  const frame = childrenView?.frame;

  return (
    childrenView?.__rnsSafeAreaDidLayout === true &&
    numbersNearlyEqual(frameNumber(frame, 'x'), x) &&
    numbersNearlyEqual(frameNumber(frame, 'y'), y) &&
    numbersNearlyEqual(frameNumber(frame, 'width'), width) &&
    numbersNearlyEqual(frameNumber(frame, 'height'), height)
  );
}

function zeroEdgeInsets() {
  'worklet';

  return { bottom: 0, left: 0, right: 0, top: 0 };
}

function findNearestSafeAreaProvider(rootView: any) {
  'worklet';
  let current = rootView?.superview;

  while (current) {
    if (typeof current.providerSafeAreaInsets === 'function') {
      return current;
    }

    current = current.superview;
  }

  return null;
}

function notificationCenter() {
  'worklet';
  const NSNotificationCenter = nativeValue('NSNotificationCenter');
  const defaultCenter = NSNotificationCenter?.defaultCenter;

  return typeof defaultCenter === 'function' ? defaultCenter() : defaultCenter;
}

function removeSafeAreaProviderObserver(rootView: any, provider: any) {
  'worklet';
  const center = notificationCenter();

  if (!center || !rootView || !provider) {
    return;
  }

  if (typeof center.removeObserverNameObject === 'function') {
    center.removeObserverNameObject(rootView, 'RNSSafeAreaDidChange', provider);
  } else if (typeof center.removeObserver === 'function') {
    center.removeObserver(rootView);
  }
}

function updateSafeAreaProviderObservation(rootView: any) {
  'worklet';
  const provider = rootView?.window
    ? findNearestSafeAreaProvider(rootView)
    : null;
  const previousProvider = rootView?.__rnsSafeAreaProviderView;

  if (previousProvider === provider) {
    return false;
  }

  removeSafeAreaProviderObserver(rootView, previousProvider);
  rootView.__rnsSafeAreaProviderView = provider;
  rootView.__rnsSafeAreaNeedsHostRefresh = true;

  const center = notificationCenter();

  if (
    center &&
    provider &&
    typeof center.addObserverSelectorNameObject === 'function'
  ) {
    center.addObserverSelectorNameObject(
      rootView,
      'safeAreaProviderInsetsDidChange:',
      'RNSSafeAreaDidChange',
      provider,
    );
  }

  return true;
}

function safeAreaInsetsForRoot(rootView: any) {
  'worklet';
  const provider = findNearestSafeAreaProvider(rootView);

  if (provider) {
    return provider.providerSafeAreaInsets() ?? zeroEdgeInsets();
  }

  return rootView?.safeAreaInsets ?? zeroEdgeInsets();
}

function applyNativeScriptSafeAreaLayout(
  hostView: NativeScriptSafeAreaHostView,
  props: Readonly<NativeScriptSafeAreaViewProps>,
) {
  'worklet';
  const rootView = hostView.rootView;
  const childrenView = hostView.childrenView;

  if (!rootView || !childrenView) {
    return;
  }

  const insets = safeAreaInsetsForRoot(rootView);
  const edges = props.edges;
  const top = edges.top ? edgeInsetsValue(insets, 'top') : 0;
  const left = edges.left ? edgeInsetsValue(insets, 'left') : 0;
  const right = edges.right ? edgeInsetsValue(insets, 'right') : 0;
  const bottom = edges.bottom ? edgeInsetsValue(insets, 'bottom') : 0;
  const bounds = rootView.bounds ?? zeroEdgeInsets();
  const width = Math.max(0, (bounds.size?.width ?? 0) - left - right);
  const height = Math.max(0, (bounds.size?.height ?? 0) - top - bottom);

  rootView.userInteractionEnabled = true;
  rootView.__rnsSafeAreaProps = props;
  childrenView.userInteractionEnabled = true;
  childrenView.autoresizingMask = flexibleSizeMask();

  if (
    childFrameMatches(childrenView, left, top, width, height) &&
    rootView.__rnsSafeAreaNeedsHostRefresh !== true
  ) {
    return;
  }

  if (!childFrameMatches(childrenView, left, top, width, height)) {
    childrenView.frame = rectWithOriginAndSize(left, top, width, height);
  }
  childrenView.__rnsSafeAreaDidLayout = true;
  rootView.__rnsSafeAreaNeedsHostRefresh = false;

  // NATIVESCRIPT_PORT_DEVIATION: upstream RNSSafeAreaViewComponentView writes
  // provider insets into RNSSafeAreaViewShadowNode state so Yoga adjusts the
  // wrapper margins. NativeScript cannot mutate that Fabric C++ shadow state
  // from TypeScript, so this port applies the same selected edge insets to the
  // hosted child view's UIKit frame and refreshes that host view after every
  // provider/layout update.
  NativeScriptRuntime.refreshUIKitHostView(childrenView);
}

function nativeScriptSafeAreaViewClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[SAFE_AREA_VIEW_CLASS_KEY];

  if (existing) {
    return existing;
  }

  const UIView = nativeValue('UIView');
  const NativeClassFunction = globalObject.NativeClass;

  if (!UIView || typeof NativeClassFunction !== 'function') {
    return UIView;
  }

  class RNSSafeAreaViewNativeScript extends UIView {
    didMoveToWindow() {
      'worklet';

      this.super?.didMoveToWindow?.();
      this.__rnsSafeAreaNeedsHostRefresh = true;
      updateSafeAreaProviderObservation(this);
      applyNativeScriptSafeAreaLayout(
        {
          childrenView: this.__rnsSafeAreaChildrenView,
          rootView: this,
        },
        this.__rnsSafeAreaProps,
      );
    }

    layoutSubviews() {
      'worklet';

      this.super?.layoutSubviews?.();
      applyNativeScriptSafeAreaLayout(
        {
          childrenView: this.__rnsSafeAreaChildrenView,
          rootView: this,
        },
        this.__rnsSafeAreaProps,
      );
    }

    safeAreaProviderInsetsDidChange(_notification: any) {
      'worklet';

      this.__rnsSafeAreaNeedsHostRefresh = true;
      applyNativeScriptSafeAreaLayout(
        {
          childrenView: this.__rnsSafeAreaChildrenView,
          rootView: this,
        },
        this.__rnsSafeAreaProps,
      );
    }

    'safeAreaProviderInsetsDidChange:'(notification: any) {
      'worklet';

      this.safeAreaProviderInsetsDidChange(notification);
    }
  }

  const interopTypes = globalObject.interop?.types;
  const NSNotification = nativeValue('NSNotification');
  const exposedMethods = {
    didMoveToWindow: {
      params: [],
      returns: interopTypes?.void,
    },
    layoutSubviews: {
      params: [],
      returns: interopTypes?.void,
    },
    'safeAreaProviderInsetsDidChange:': {
      params: NSNotification ? [NSNotification] : [],
      returns: interopTypes?.void,
    },
  };

  (RNSSafeAreaViewNativeScript as any).ObjCExposedMethods = exposedMethods;

  if (typeof UIView.extend === 'function') {
    const methods: Record<string, unknown> = {};
    const methodNames = Object.getOwnPropertyNames(
      RNSSafeAreaViewNativeScript.prototype,
    );

    for (const methodName of methodNames) {
      if (methodName === 'constructor') {
        continue;
      }

      const descriptor = Object.getOwnPropertyDescriptor(
        RNSSafeAreaViewNativeScript.prototype,
        methodName,
      );

      if (descriptor) {
        Object.defineProperty(methods, methodName, descriptor);
      }
    }

    const SafeAreaViewClass = UIView.extend(methods, {
      exposedMethods,
      name: 'RNSSafeAreaViewNativeScript',
    });

    globalObject[SAFE_AREA_VIEW_CLASS_KEY] = SafeAreaViewClass;
    return SafeAreaViewClass;
  }

  NativeClassFunction(RNSSafeAreaViewNativeScript);
  globalObject[SAFE_AREA_VIEW_CLASS_KEY] = RNSSafeAreaViewNativeScript;
  return RNSSafeAreaViewNativeScript;
}

const NativeScriptSafeAreaViewHost = NativeScriptRuntime.defineUIKitContainer<
  NativeScriptSafeAreaViewProps,
  any,
  any
>({
  debugName: 'RNSSafeAreaView.NativeScript',
  layout: { sizing: 'fill' },
  create(props) {
    'worklet';
    const SafeAreaViewClass = nativeScriptSafeAreaViewClass();
    const UIView = nativeValue('UIView');
    const UIColor = nativeValue('UIColor');

    if (!SafeAreaViewClass || typeof SafeAreaViewClass.alloc !== 'function') {
      throw new Error('UIView is not available in the UI runtime');
    }
    if (!UIView || typeof UIView.alloc !== 'function') {
      throw new Error('UIView is not available in the UI runtime');
    }

    const rootAllocated = SafeAreaViewClass.alloc();
    const rootView =
      rootAllocated && typeof rootAllocated.init === 'function'
        ? rootAllocated.init()
        : rootAllocated;
    const childrenAllocated = UIView.alloc();
    const childrenView =
      childrenAllocated && typeof childrenAllocated.init === 'function'
        ? childrenAllocated.init()
        : childrenAllocated;

    rootView.backgroundColor = UIColor?.clearColor ?? null;
    rootView.userInteractionEnabled = true;
    rootView.__rnsSafeAreaProps = props;
    rootView.__rnsSafeAreaChildrenView = childrenView;
    childrenView.backgroundColor = UIColor?.clearColor ?? null;
    childrenView.userInteractionEnabled = true;
    childrenView.__rnsNativeScriptSafeAreaContentView = true;
    rootView.addSubview(childrenView);

    return { childrenView, rootView };
  },
  mounted(view, props) {
    'worklet';

    applyNativeScriptSafeAreaLayout(view, props);
  },
  update(view, props) {
    'worklet';

    applyNativeScriptSafeAreaLayout(view, props);
  },
  dispose(view) {
    'worklet';

    removeSafeAreaProviderObserver(
      view.rootView,
      view.rootView.__rnsSafeAreaProviderView,
    );
    view.rootView.__rnsSafeAreaProviderView = null;
  },
});

function getNativeEdgesProp(
  edges: SafeAreaViewProps['edges'],
): NativeSafeAreaEdges {
  return {
    top: false,
    bottom: false,
    left: false,
    right: false,
    ...edges,
  };
}

export function SafeAreaView(props: SafeAreaViewProps) {
  return (
    <NativeScriptSafeAreaViewHost
      {...props}
      attachNativeView
      collapsable={false}
      edges={getNativeEdgesProp(props.edges)}
      style={[styles.flex, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
