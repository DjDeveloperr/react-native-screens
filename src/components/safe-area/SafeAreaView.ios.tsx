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
const SAFE_AREA_CONTENT_VIEW_CLASS_KEY =
  '__rnsSafeAreaContentViewNativeScriptClass';

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

function nativeObjectsEqual(left: any, right: any) {
  'worklet';

  if (left === right) {
    return true;
  }

  if (!left || !right) {
    return false;
  }

  const leftHash = left.hash;
  const rightHash = right.hash;

  if (
    leftHash != null &&
    rightHash != null &&
    (typeof leftHash === 'number' || typeof leftHash === 'string') &&
    (typeof rightHash === 'number' || typeof rightHash === 'string') &&
    leftHash === rightHash
  ) {
    return true;
  }

  if (typeof left.isEqual === 'function') {
    try {
      if (left.isEqual(right) === true) {
        return true;
      }
    } catch (_error) {
      return false;
    }
  }

  if (typeof right.isEqual === 'function') {
    try {
      return right.isEqual(left) === true;
    } catch (_error) {
      return false;
    }
  }

  return false;
}

function nativeArrayCount(array: any) {
  'worklet';

  const count = array?.count;
  if (typeof count === 'number') {
    return count;
  }

  const length = array?.length;
  return typeof length === 'number' ? length : 0;
}

function nativeArrayItem<T = any>(array: any, index: number): T | null {
  'worklet';

  if (!array || index < 0) {
    return null;
  }

  if (typeof array.objectAtIndex === 'function') {
    return array.objectAtIndex(index) ?? null;
  }

  return array[index] ?? null;
}

function convertPointFromNativeView(
  point: any,
  targetView: any,
  sourceView: any,
) {
  'worklet';

  if (typeof targetView?.convertPointFromView === 'function') {
    return targetView.convertPointFromView(point, sourceView);
  }

  if (typeof targetView?.['convertPoint:fromView:'] === 'function') {
    return targetView['convertPoint:fromView:'](point, sourceView);
  }

  if (typeof sourceView?.convertPointToView === 'function') {
    return sourceView.convertPointToView(point, targetView);
  }

  if (typeof sourceView?.['convertPoint:toView:'] === 'function') {
    return sourceView['convertPoint:toView:'](point, targetView);
  }

  return point;
}

function nativeViewPointInside(view: any, point: any, event: any) {
  'worklet';

  if (typeof view?.pointInsideWithEvent === 'function') {
    return view.pointInsideWithEvent(point, event) !== false;
  }

  if (typeof view?.['pointInside:withEvent:'] === 'function') {
    return view['pointInside:withEvent:'](point, event) !== false;
  }

  if (typeof view?.pointInside === 'function') {
    return view.pointInside(point, event) !== false;
  }

  return true;
}

function nativeViewHitTest(view: any, point: any, event: any) {
  'worklet';

  if (typeof view?.hitTestWithEvent === 'function') {
    return view.hitTestWithEvent(point, event);
  }

  if (typeof view?.['hitTest:withEvent:'] === 'function') {
    return view['hitTest:withEvent:'](point, event);
  }

  if (typeof view?.hitTest === 'function') {
    return view.hitTest(point, event);
  }

  return null;
}

function nativeScriptSafeAreaDescendantHitTest(
  view: any,
  point: any,
  event: any,
  depth = 0,
): any {
  'worklet';

  if (
    !view ||
    depth > 32 ||
    view.hidden === true ||
    (typeof view.alpha === 'number' && view.alpha <= 0.01) ||
    nativeViewPointInside(view, point, event) === false
  ) {
    return null;
  }

  if (
    view.__rnsNativeScriptSafeAreaPassthroughView !== true &&
    view.userInteractionEnabled !== false
  ) {
    const directHit = nativeViewHitTest(view, point, event);

    if (directHit) {
      return directHit;
    }
  }

  const subviews = view.subviews;
  for (let index = nativeArrayCount(subviews) - 1; index >= 0; index -= 1) {
    const subview = nativeArrayItem(subviews, index);
    if (!subview) {
      continue;
    }

    const subviewPoint = convertPointFromNativeView(point, subview, view);
    const subviewHit = nativeScriptSafeAreaDescendantHitTest(
      subview,
      subviewPoint,
      event,
      depth + 1,
    );

    if (subviewHit) {
      return subviewHit;
    }
  }

  if (
    view.__rnsNativeScriptSafeAreaPassthroughView === true ||
    view.userInteractionEnabled === false
  ) {
    return null;
  }

  return view;
}

function nativeScriptSafeAreaContainerHitTest(
  containerView: any,
  point: any,
  event: any,
) {
  'worklet';

  if (
    !containerView ||
    containerView.hidden === true ||
    (typeof containerView.alpha === 'number' && containerView.alpha <= 0.01) ||
    nativeViewPointInside(containerView, point, event) === false
  ) {
    return null;
  }

  const subviews = containerView.subviews;
  for (let index = nativeArrayCount(subviews) - 1; index >= 0; index -= 1) {
    const subview = nativeArrayItem(subviews, index);
    if (!subview) {
      continue;
    }

    const subviewPoint = convertPointFromNativeView(
      point,
      subview,
      containerView,
    );
    const subviewHit = nativeScriptSafeAreaDescendantHitTest(
      subview,
      subviewPoint,
      event,
      0,
    );

    if (
      subviewHit &&
      !nativeObjectsEqual(subviewHit, containerView) &&
      subviewHit.__rnsNativeScriptSafeAreaPassthroughView !== true
    ) {
      return subviewHit;
    }
  }

  return null;
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
  refreshHostedChildren = false,
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

  const didFrameChange = !childFrameMatches(
    childrenView,
    left,
    top,
    width,
    height,
  );
  const needsHostRefresh = rootView.__rnsSafeAreaNeedsHostRefresh === true;

  if (!didFrameChange && (!refreshHostedChildren || !needsHostRefresh)) {
    return;
  }

  if (didFrameChange) {
    childrenView.frame = rectWithOriginAndSize(left, top, width, height);
  }
  childrenView.__rnsSafeAreaDidLayout = true;
  rootView.__rnsSafeAreaNeedsHostRefresh = false;

  // NATIVESCRIPT_PORT_DEVIATION: upstream RNSSafeAreaViewComponentView writes
  // provider insets into RNSSafeAreaViewShadowNode state so Yoga adjusts the
  // wrapper margins. NativeScript cannot mutate that Fabric C++ shadow state
  // from TypeScript, so this port applies the same selected edge insets to the
  // hosted child view's UIKit frame. Host refresh is restricted to Fabric-driven
  // mount/update paths so UIKit transition layout does not recursively re-enter
  // the React host while navigation and tab controllers are settling.
  if (refreshHostedChildren) {
    NativeScriptRuntime.refreshUIKitHostView(childrenView);
  }
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

  if (
    !UIView ||
    (typeof NativeClassFunction !== 'function' &&
      typeof UIView.extend !== 'function')
  ) {
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
        false,
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
        false,
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
        false,
      );
    }

    'safeAreaProviderInsetsDidChange:'(notification: any) {
      'worklet';

      this.safeAreaProviderInsetsDidChange(notification);
    }

    hitTestWithEvent(point: any, event: any) {
      'worklet';

      const hit = nativeScriptSafeAreaContainerHitTest(this, point, event);
      if (hit) {
        return hit;
      }

      const superObject = this.super;

      if (typeof superObject?.hitTestWithEvent === 'function') {
        const superHit = superObject.hitTestWithEvent(point, event);
        return nativeObjectsEqual(superHit, this) ? null : superHit;
      }

      if (typeof superObject?.['hitTest:withEvent:'] === 'function') {
        const superHit = superObject['hitTest:withEvent:'](point, event);
        return nativeObjectsEqual(superHit, this) ? null : superHit;
      }

      return null;
    }

    'hitTest:withEvent:'(point: any, event: any) {
      'worklet';

      return this.hitTestWithEvent(point, event);
    }
  }

  const interopTypes = globalObject.interop?.types;
  const idType = interopTypes?.id ?? nativeValue('NSObject') ?? UIView;
  const CGPoint = nativeValue('CGPoint');
  const UIEvent = nativeValue('UIEvent');
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
    'hitTest:withEvent:': {
      params: [CGPoint ?? idType, UIEvent ?? idType],
      returns: UIView,
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

function nativeScriptSafeAreaContentViewClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[SAFE_AREA_CONTENT_VIEW_CLASS_KEY];

  if (existing) {
    return existing;
  }

  const UIView = nativeValue('UIView');
  const NativeClassFunction = globalObject.NativeClass;

  if (
    !UIView ||
    (typeof NativeClassFunction !== 'function' &&
      typeof UIView.extend !== 'function')
  ) {
    return UIView;
  }

  class RNSSafeAreaContentViewNativeScript extends UIView {
    hitTestWithEvent(point: any, event: any) {
      'worklet';

      const hit = nativeScriptSafeAreaContainerHitTest(this, point, event);
      if (hit) {
        return hit;
      }

      const superObject = this.super;

      if (typeof superObject?.hitTestWithEvent === 'function') {
        const superHit = superObject.hitTestWithEvent(point, event);
        return nativeObjectsEqual(superHit, this) ? null : superHit;
      }

      if (typeof superObject?.['hitTest:withEvent:'] === 'function') {
        const superHit = superObject['hitTest:withEvent:'](point, event);
        return nativeObjectsEqual(superHit, this) ? null : superHit;
      }

      return null;
    }

    'hitTest:withEvent:'(point: any, event: any) {
      'worklet';

      return this.hitTestWithEvent(point, event);
    }
  }

  const interopTypes = globalObject.interop?.types;
  const idType = interopTypes?.id ?? nativeValue('NSObject') ?? UIView;
  const CGPoint = nativeValue('CGPoint');
  const UIEvent = nativeValue('UIEvent');
  const exposedMethods = {
    'hitTest:withEvent:': {
      params: [CGPoint ?? idType, UIEvent ?? idType],
      returns: UIView,
    },
  };

  (RNSSafeAreaContentViewNativeScript as any).ObjCExposedMethods =
    exposedMethods;

  if (typeof UIView.extend === 'function') {
    const methods: Record<string, unknown> = {};
    const methodNames = Object.getOwnPropertyNames(
      RNSSafeAreaContentViewNativeScript.prototype,
    );

    for (const methodName of methodNames) {
      if (methodName === 'constructor') {
        continue;
      }

      const descriptor = Object.getOwnPropertyDescriptor(
        RNSSafeAreaContentViewNativeScript.prototype,
        methodName,
      );

      if (descriptor) {
        Object.defineProperty(methods, methodName, descriptor);
      }
    }

    const SafeAreaContentViewClass = UIView.extend(methods, {
      exposedMethods,
      name: 'RNSSafeAreaContentViewNativeScript',
    });

    globalObject[SAFE_AREA_CONTENT_VIEW_CLASS_KEY] = SafeAreaContentViewClass;
    return SafeAreaContentViewClass;
  }

  NativeClassFunction(RNSSafeAreaContentViewNativeScript);
  globalObject[SAFE_AREA_CONTENT_VIEW_CLASS_KEY] =
    RNSSafeAreaContentViewNativeScript;
  return RNSSafeAreaContentViewNativeScript;
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
    const SafeAreaContentViewClass = nativeScriptSafeAreaContentViewClass();
    const UIColor = nativeValue('UIColor');

    if (!SafeAreaViewClass || typeof SafeAreaViewClass.alloc !== 'function') {
      throw new Error('UIView is not available in the UI runtime');
    }
    if (
      !SafeAreaContentViewClass ||
      typeof SafeAreaContentViewClass.alloc !== 'function'
    ) {
      throw new Error('UIView is not available in the UI runtime');
    }

    const rootAllocated = SafeAreaViewClass.alloc();
    const rootView =
      rootAllocated && typeof rootAllocated.init === 'function'
        ? rootAllocated.init()
        : rootAllocated;
    const childrenAllocated = SafeAreaContentViewClass.alloc();
    const childrenView =
      childrenAllocated && typeof childrenAllocated.init === 'function'
        ? childrenAllocated.init()
        : childrenAllocated;

    rootView.backgroundColor = UIColor?.clearColor ?? null;
    rootView.userInteractionEnabled = true;
    rootView.__rnsSafeAreaProps = props;
    rootView.__rnsSafeAreaChildrenView = childrenView;
    rootView.__rnsNativeScriptSafeAreaPassthroughView = true;
    childrenView.backgroundColor = UIColor?.clearColor ?? null;
    childrenView.userInteractionEnabled = true;
    childrenView.__rnsNativeScriptSafeAreaPassthroughView = true;
    childrenView.__rnsNativeScriptSafeAreaContentView = true;
    rootView.addSubview(childrenView);

    return { childrenView, rootView };
  },
  mounted(view, props) {
    'worklet';

    applyNativeScriptSafeAreaLayout(view, props, true);
  },
  update(view, props) {
    'worklet';

    applyNativeScriptSafeAreaLayout(view, props, true);
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
      disableDetachedChildrenTouchHandler
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
