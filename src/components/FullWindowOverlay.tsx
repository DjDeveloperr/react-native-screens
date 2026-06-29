import * as NativeScriptRuntime from '@nativescript/react-native';
import React, { type ReactNode } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';

// Native components
import type { NativeProps } from '../fabric/FullWindowOverlayNativeComponent';

const FULL_WINDOW_OVERLAY_ROOT_VIEW_CLASS_KEY =
  '__rnsFullWindowOverlayNativeScriptRootViewClass';
const FULL_WINDOW_OVERLAY_CONTAINER_CLASS_KEY =
  '__rnsFullWindowOverlayNativeScriptContainerClass';

type FullWindowOverlayProps = {
  children: ReactNode;
  unstable_accessibilityContainerViewIsModal?: boolean | undefined;
};

type NativeScriptFullWindowOverlayHostProps = NativeProps & {
  children?: ReactNode;
};

type NativeScriptFullWindowOverlayHostView = {
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

function arrayCount(value: any) {
  'worklet';

  if (!value) {
    return 0;
  }

  if (typeof value.count === 'number') {
    return value.count;
  }

  if (typeof value.length === 'number') {
    return value.length;
  }

  return 0;
}

function arrayItem(value: any, index: number) {
  'worklet';

  if (!value) {
    return null;
  }

  const count = arrayCount(value);

  if (index < 0 || index >= count) {
    return null;
  }

  if (typeof value.objectAtIndex === 'function') {
    return value.objectAtIndex(index);
  }

  return value[index] ?? null;
}

function arrayContains(value: any, item: any) {
  'worklet';

  if (!value || !item) {
    return false;
  }

  if (typeof value.containsObject === 'function') {
    return value.containsObject(item);
  }

  const count = arrayCount(value);

  for (let index = 0; index < count; index += 1) {
    if (arrayItem(value, index) === item) {
      return true;
    }
  }

  return false;
}

function windowForFullWindowOverlay(rootView: any) {
  'worklet';

  if (rootView?.window) {
    return rootView.window;
  }

  const UIApplication = nativeValue('UIApplication');
  const application = UIApplication?.sharedApplication;
  const keyWindow = application?.keyWindow;

  if (keyWindow) {
    return keyWindow;
  }

  const windows = application?.windows;
  const count = arrayCount(windows);

  for (let index = 0; index < count; index += 1) {
    const window = arrayItem(windows, index);

    if (window?.isKeyWindow) {
      return window;
    }
  }

  return null;
}

function pointInsideView(view: any, point: any, event: any) {
  'worklet';

  if (!view) {
    return false;
  }

  if (typeof view.pointInsideWithEvent === 'function') {
    return view.pointInsideWithEvent(point, event);
  }

  if (typeof view.pointInside === 'function') {
    return view.pointInside(point, event);
  }

  return false;
}

function hitTestView(view: any, point: any, event: any) {
  'worklet';

  if (!view) {
    return null;
  }

  if (typeof view.hitTestWithEvent === 'function') {
    return view.hitTestWithEvent(point, event);
  }

  if (typeof view.hitTest === 'function') {
    return view.hitTest(point, event);
  }

  return null;
}

function layoutNativeScriptFullWindowOverlay(rootView: any, container: any) {
  'worklet';

  if (!rootView || !container) {
    return;
  }

  container.frame = rootView.bounds;
  container.autoresizingMask = flexibleSizeMask();
  NativeScriptRuntime.refreshUIKitHostView(container);
}

function showNativeScriptFullWindowOverlay(rootView: any, container: any) {
  'worklet';

  if (!rootView || !container) {
    return;
  }

  const window = windowForFullWindowOverlay(rootView);

  if (!window) {
    return;
  }

  layoutNativeScriptFullWindowOverlay(rootView, container);

  // NATIVESCRIPT_PORT_DEVIATION: upstream keeps every overlay in front with
  // `UIWindow+RNScreens.didAddSubview:`. NativeScript can expose UIKit
  // subclasses from TS today, but not ObjC categories on existing UIKit
  // classes through this React-facing API, so the port reasserts the same
  // ordering whenever the root or overlay container updates/re-attaches.
  if (!arrayContains(window.subviews, container)) {
    container.removeFromSuperview?.();
    window.addSubview?.(container);
  }

  window.bringSubviewToFront?.(container);
}

function postNativeScriptFullWindowOverlayAccessibilityChanged(container: any) {
  'worklet';
  const UIAccessibilityPostNotification = nativeValue(
    'UIAccessibilityPostNotification',
  );
  const UIAccessibilityLayoutChangedNotification = nativeValue(
    'UIAccessibilityLayoutChangedNotification',
  );

  if (typeof UIAccessibilityPostNotification === 'function') {
    UIAccessibilityPostNotification(
      UIAccessibilityLayoutChangedNotification,
      container,
    );
  }
}

function nativeScriptFullWindowOverlayContainerClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[FULL_WINDOW_OVERLAY_CONTAINER_CLASS_KEY];

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

  class RNSFullWindowOverlayNativeScriptContainer extends UIView {
    pointInsideWithEvent(point: any, event: any) {
      'worklet';
      const subviews = this.subviews;
      const count = arrayCount(subviews);

      for (let index = 0; index < count; index += 1) {
        const view = arrayItem(subviews, index);

        if (!view?.userInteractionEnabled) {
          continue;
        }

        const convertedPoint =
          typeof this.convertPointToView === 'function'
            ? this.convertPointToView(point, view)
            : point;

        if (pointInsideView(view, convertedPoint, event)) {
          return true;
        }
      }

      return false;
    }

    hitTestWithEvent(point: any, event: any) {
      'worklet';
      const canReceiveTouchEvents = this.userInteractionEnabled && !this.hidden;

      if (!canReceiveTouchEvents) {
        return null;
      }

      const isPointInside = this.pointInsideWithEvent(point, event);

      if (this.clipsToBounds && !isPointInside) {
        return null;
      }

      const sortedSubviews =
        typeof this.reactZIndexSortedSubviews === 'function'
          ? this.reactZIndexSortedSubviews()
          : this.subviews;
      const count = arrayCount(sortedSubviews);

      for (let index = count - 1; index >= 0; index -= 1) {
        const subview = arrayItem(sortedSubviews, index);
        const convertedPoint =
          typeof subview?.convertPointFromView === 'function'
            ? subview.convertPointFromView(point, this)
            : typeof this.convertPointToView === 'function'
            ? this.convertPointToView(point, subview)
            : point;
        const hitSubview = hitTestView(subview, convertedPoint, event);

        if (hitSubview) {
          return hitSubview;
        }
      }

      return null;
    }

    'pointInside:withEvent:'(point: any, event: any) {
      'worklet';

      return this.pointInsideWithEvent(point, event);
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
    'pointInside:withEvent:': {
      params: [CGPoint ?? idType, UIEvent ?? idType],
      returns: interopTypes?.bool,
    },
    'hitTest:withEvent:': {
      params: [CGPoint ?? idType, UIEvent ?? idType],
      returns: UIView,
    },
  };

  (RNSFullWindowOverlayNativeScriptContainer as any).ObjCExposedMethods =
    exposedMethods;

  if (typeof UIView.extend === 'function') {
    const methods: Record<string, unknown> = {};
    const methodNames = Object.getOwnPropertyNames(
      RNSFullWindowOverlayNativeScriptContainer.prototype,
    );

    for (const methodName of methodNames) {
      if (methodName === 'constructor') {
        continue;
      }

      const descriptor = Object.getOwnPropertyDescriptor(
        RNSFullWindowOverlayNativeScriptContainer.prototype,
        methodName,
      );

      if (descriptor) {
        Object.defineProperty(methods, methodName, descriptor);
      }
    }

    const ContainerClass = UIView.extend(methods, {
      exposedMethods,
      name: 'RNSFullWindowOverlayNativeScriptContainer',
    });

    globalObject[FULL_WINDOW_OVERLAY_CONTAINER_CLASS_KEY] = ContainerClass;
    return ContainerClass;
  }

  NativeClassFunction(RNSFullWindowOverlayNativeScriptContainer);
  globalObject[FULL_WINDOW_OVERLAY_CONTAINER_CLASS_KEY] =
    RNSFullWindowOverlayNativeScriptContainer;
  return RNSFullWindowOverlayNativeScriptContainer;
}

function nativeScriptFullWindowOverlayRootViewClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[FULL_WINDOW_OVERLAY_ROOT_VIEW_CLASS_KEY];

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

  class RNSFullWindowOverlayNativeScriptRootView extends UIView {
    didMoveToSuperview() {
      'worklet';
      this.super?.didMoveToSuperview?.();
      const container = this.__rnsFullWindowOverlayContainer;

      if (!container) {
        return;
      }

      if (!this.superview) {
        container.removeFromSuperview?.();
        return;
      }

      showNativeScriptFullWindowOverlay(this, container);
      postNativeScriptFullWindowOverlayAccessibilityChanged(container);
    }

    didMoveToWindow() {
      'worklet';
      this.super?.didMoveToWindow?.();

      if (this.window) {
        showNativeScriptFullWindowOverlay(
          this,
          this.__rnsFullWindowOverlayContainer,
        );
      }
    }

    layoutSubviews() {
      'worklet';
      this.super?.layoutSubviews?.();
      const container = this.__rnsFullWindowOverlayContainer;

      layoutNativeScriptFullWindowOverlay(this, container);
      showNativeScriptFullWindowOverlay(this, container);
    }
  }

  const interopTypes = globalObject.interop?.types;
  const exposedMethods = {
    didMoveToSuperview: {
      params: [],
      returns: interopTypes?.void,
    },
    didMoveToWindow: {
      params: [],
      returns: interopTypes?.void,
    },
    layoutSubviews: {
      params: [],
      returns: interopTypes?.void,
    },
  };

  (RNSFullWindowOverlayNativeScriptRootView as any).ObjCExposedMethods =
    exposedMethods;

  if (typeof UIView.extend === 'function') {
    const methods: Record<string, unknown> = {};
    const methodNames = Object.getOwnPropertyNames(
      RNSFullWindowOverlayNativeScriptRootView.prototype,
    );

    for (const methodName of methodNames) {
      if (methodName === 'constructor') {
        continue;
      }

      const descriptor = Object.getOwnPropertyDescriptor(
        RNSFullWindowOverlayNativeScriptRootView.prototype,
        methodName,
      );

      if (descriptor) {
        Object.defineProperty(methods, methodName, descriptor);
      }
    }

    const RootViewClass = UIView.extend(methods, {
      exposedMethods,
      name: 'RNSFullWindowOverlayNativeScriptRootView',
    });

    globalObject[FULL_WINDOW_OVERLAY_ROOT_VIEW_CLASS_KEY] = RootViewClass;
    return RootViewClass;
  }

  NativeClassFunction(RNSFullWindowOverlayNativeScriptRootView);
  globalObject[FULL_WINDOW_OVERLAY_ROOT_VIEW_CLASS_KEY] =
    RNSFullWindowOverlayNativeScriptRootView;
  return RNSFullWindowOverlayNativeScriptRootView;
}

function updateNativeScriptFullWindowOverlay(
  view: NativeScriptFullWindowOverlayHostView,
  props: Readonly<NativeScriptFullWindowOverlayHostProps>,
) {
  'worklet';
  const rootView = view.rootView;
  const container = view.childrenView;

  if (!rootView || !container) {
    return;
  }

  rootView.userInteractionEnabled = false;
  container.userInteractionEnabled = true;
  container.accessibilityViewIsModal =
    props.accessibilityContainerViewIsModal ?? true;

  layoutNativeScriptFullWindowOverlay(rootView, container);
  showNativeScriptFullWindowOverlay(rootView, container);
}

const NativeScriptFullWindowOverlay = NativeScriptRuntime.defineUIKitContainer<
  NativeScriptFullWindowOverlayHostProps,
  any,
  any
>({
  debugName: 'RNSFullWindowOverlay.NativeScript',
  layout: { sizing: 'fill' },
  create() {
    'worklet';
    const RootView = nativeScriptFullWindowOverlayRootViewClass();
    const ContainerView = nativeScriptFullWindowOverlayContainerClass();
    const UIColor = nativeValue('UIColor');

    if (!RootView || typeof RootView.alloc !== 'function') {
      throw new Error('UIView is not available in the UI runtime');
    }

    if (!ContainerView || typeof ContainerView.alloc !== 'function') {
      throw new Error('UIView is not available in the UI runtime');
    }

    const rootViewAllocated = RootView.alloc();
    const rootView =
      rootViewAllocated && typeof rootViewAllocated.init === 'function'
        ? rootViewAllocated.init()
        : rootViewAllocated;
    const containerAllocated = ContainerView.alloc();
    const childrenView =
      containerAllocated && typeof containerAllocated.init === 'function'
        ? containerAllocated.init()
        : containerAllocated;

    rootView.backgroundColor = UIColor?.clearColor ?? null;
    rootView.userInteractionEnabled = false;
    childrenView.backgroundColor = UIColor?.clearColor ?? null;
    childrenView.accessibilityViewIsModal = true;
    childrenView.userInteractionEnabled = true;
    childrenView.autoresizingMask = flexibleSizeMask();
    rootView.__rnsFullWindowOverlayContainer = childrenView;

    return { childrenView, rootView };
  },
  mounted(view, props) {
    'worklet';
    updateNativeScriptFullWindowOverlay(view, props);
  },
  update(view, props) {
    'worklet';
    updateNativeScriptFullWindowOverlay(view, props);
  },
  dispose(view) {
    'worklet';
    view.childrenView?.removeFromSuperview?.();
    view.rootView.__rnsFullWindowOverlayContainer = null;
  },
});

function FullWindowOverlay(props: FullWindowOverlayProps) {
  const { width, height } = useWindowDimensions();
  if (Platform.OS !== 'ios') {
    console.warn('Using FullWindowOverlay is only valid on iOS devices.');
    return <View {...props} />;
  }
  return (
    <NativeScriptFullWindowOverlay
      style={[StyleSheet.absoluteFill, { width, height }]}
      pointerEvents="box-none"
      accessibilityContainerViewIsModal={
        props.unstable_accessibilityContainerViewIsModal
      }>
      {props.children}
    </NativeScriptFullWindowOverlay>
  );
}

export default FullWindowOverlay;
