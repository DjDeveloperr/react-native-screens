import * as NativeScriptRuntime from '@nativescript/react-native';
import React from 'react';
import { Platform } from 'react-native';
import ScrollViewMarkerNativeComponent from '../../../fabric/gamma/ScrollViewMarkerNativeComponent';
import type { ScrollViewMarkerProps } from './ScrollViewMarker.types';

const SCROLL_VIEW_MARKER_VIEW_CLASS_KEY =
  '__rnsScrollViewMarkerNativeScriptViewClass';

type NativeScriptScrollViewMarkerHostView = {
  childrenView: any;
  rootView: any;
};

function nativeValue(name: string) {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const api = globalObject.__nativeScriptNativeApi;

  return api?.[name] ?? globalObject[name];
}

function nativeClassValue(name: string) {
  'worklet';
  const runtimeGetClass = (NativeScriptRuntime as any).getClass;
  const runtimeClass =
    typeof runtimeGetClass === 'function' ? runtimeGetClass(name) : null;

  if (runtimeClass) {
    return runtimeClass;
  }

  const globalObject = globalThis as Record<string, any>;
  const globalClass = globalObject[name];

  if (globalClass && typeof globalClass.alloc === 'function') {
    return globalClass;
  }

  const api = globalObject.__nativeScriptNativeApi;
  return api?.getClass?.(name) ?? api?.[name] ?? null;
}

function defineObjCExposedMethods(target: any, exposedMethods: any) {
  'worklet';

  Object.defineProperty(target, 'ObjCExposedMethods', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: exposedMethods,
  });
}

function flexibleSizeMask() {
  'worklet';
  const autoresizing = nativeValue('UIViewAutoresizing');

  return (
    (autoresizing?.FlexibleWidth ?? autoresizing?.flexibleWidth ?? 2) |
    (autoresizing?.FlexibleHeight ?? autoresizing?.flexibleHeight ?? 16)
  );
}

function currentIOSMajorVersion() {
  'worklet';
  const UIDevice = nativeValue('UIDevice');
  const version = String(UIDevice?.currentDevice?.systemVersion ?? '0');
  const major = Number.parseInt(version.split('.')[0] ?? '0', 10);

  return Number.isFinite(major) ? major : 0;
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

function scrollEdgeEffectStyle(effect: unknown) {
  'worklet';
  const style = nativeValue('UIScrollEdgeEffectStyle');

  if (effect === 'hard') {
    return style?.hardStyle ?? style?.HardStyle ?? style?.Hard ?? 1;
  }

  if (effect === 'soft') {
    return style?.softStyle ?? style?.SoftStyle ?? style?.Soft ?? 2;
  }

  return (
    style?.automaticStyle ??
    style?.AutomaticStyle ??
    style?.Automatic ??
    style?.automatic ??
    0
  );
}

function configureScrollEdgeEffect(edgeEffect: any, effect: unknown) {
  'worklet';

  if (!edgeEffect) {
    return;
  }

  const resolvedEffect = effect ?? 'automatic';
  const hidden = resolvedEffect === 'hidden';

  edgeEffect.hidden = hidden;
  edgeEffect.style = scrollEdgeEffectStyle(
    hidden ? 'automatic' : resolvedEffect,
  );
}

function resolveNativeScrollViewFromChild(childView: any) {
  'worklet';

  if (!childView) {
    return null;
  }

  const UIScrollView = nativeValue('UIScrollView');
  const RCTScrollViewComponentView = nativeValue('RCTScrollViewComponentView');

  if (
    UIScrollView &&
    typeof childView.isKindOfClass === 'function' &&
    childView.isKindOfClass(UIScrollView)
  ) {
    return childView;
  }

  if (
    RCTScrollViewComponentView &&
    typeof childView.isKindOfClass === 'function' &&
    childView.isKindOfClass(RCTScrollViewComponentView)
  ) {
    return childView.scrollView ?? null;
  }

  if (
    childView.scrollView &&
    UIScrollView &&
    typeof childView.scrollView.isKindOfClass === 'function' &&
    childView.scrollView.isKindOfClass(UIScrollView)
  ) {
    return childView.scrollView;
  }

  return null;
}

function firstVisibleReactSubview(view: any) {
  'worklet';
  const subviews = view?.subviews;
  const count = arrayCount(subviews);

  for (let index = 0; index < count; index += 1) {
    const subview = arrayItem(subviews, index);

    // NATIVESCRIPT_PORT_DEVIATION: NativeScriptUIView adds a hidden touch
    // sentinel to detached children hosts. Upstream RNSScrollViewMarker sees
    // only Fabric children, so ignore the generic runtime sentinel here before
    // enforcing the direct-child scroll-view contract.
    if (!subview || subview.hidden || subview.alpha === 0) {
      continue;
    }

    return subview;
  }

  return null;
}

function findScrollViewInMarker(markerView: any) {
  'worklet';
  const childView = firstVisibleReactSubview(markerView);

  return resolveNativeScrollViewFromChild(childView);
}

function applyScrollEdgeEffectsToScrollView(
  scrollView: any,
  effects: ScrollViewMarkerProps['scrollEdgeEffects'],
) {
  'worklet';

  if (!scrollView || currentIOSMajorVersion() < 26) {
    return;
  }

  configureScrollEdgeEffect(scrollView.bottomEdgeEffect, effects?.bottom);
  configureScrollEdgeEffect(scrollView.leftEdgeEffect, effects?.left);
  configureScrollEdgeEffect(scrollView.rightEdgeEffect, effects?.right);
  configureScrollEdgeEffect(scrollView.topEdgeEffect, effects?.top);
}

function findFirstSeekingAncestor(markerView: any) {
  'worklet';
  let superview = markerView?.superview;

  while (superview) {
    if (
      typeof superview.respondsToSelector === 'function' &&
      superview.respondsToSelector('registerDescendantScrollView:fromMarker:')
    ) {
      return superview;
    }

    if (
      typeof superview.registerDescendantScrollViewFromMarker === 'function' ||
      typeof superview['registerDescendantScrollView:fromMarker:'] ===
        'function'
    ) {
      return superview;
    }

    superview = superview.superview;
  }

  return null;
}

function registerMarkerWithSeekingAncestor(markerView: any) {
  'worklet';

  if (!markerView || markerView.__rnsScrollViewMarkerAttemptedRegistration) {
    return;
  }

  markerView.__rnsScrollViewMarkerAttemptedRegistration = true;
  const scrollView = findScrollViewInMarker(markerView);
  const ancestor = findFirstSeekingAncestor(markerView);

  if (!scrollView || !ancestor) {
    return;
  }

  if (typeof ancestor.registerDescendantScrollViewFromMarker === 'function') {
    ancestor.registerDescendantScrollViewFromMarker(scrollView, markerView);
    return;
  }

  ancestor['registerDescendantScrollView:fromMarker:']?.(
    scrollView,
    markerView,
  );
}

function updateNativeScriptScrollViewMarker(
  view: NativeScriptScrollViewMarkerHostView,
  props: Readonly<ScrollViewMarkerProps>,
) {
  'worklet';
  const markerView = view.childrenView;

  if (!markerView) {
    return;
  }

  markerView.frame = view.rootView?.bounds ?? markerView.frame;
  markerView.autoresizingMask = flexibleSizeMask();
  NativeScriptRuntime.refreshUIKitHostView(markerView);
  applyScrollEdgeEffectsToScrollView(
    findScrollViewInMarker(markerView),
    props.scrollEdgeEffects,
  );
  registerMarkerWithSeekingAncestor(markerView);
}

function nativeScriptScrollViewMarkerClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[SCROLL_VIEW_MARKER_VIEW_CLASS_KEY];

  if (existing) {
    return existing;
  }

  const UIView = nativeClassValue('UIView');
  const NativeClassFunction = globalObject.NativeClass;

  if (
    !UIView ||
    (typeof NativeClassFunction !== 'function' &&
      typeof UIView.extend !== 'function')
  ) {
    return UIView;
  }

  class RNSScrollViewMarkerNativeScriptView extends UIView {
    willMoveToWindow(newWindow: any) {
      'worklet';
      this.super?.willMoveToWindow?.(newWindow);
      registerMarkerWithSeekingAncestor(this);
    }

    'willMoveToWindow:'(newWindow: any) {
      'worklet';
      this.willMoveToWindow(newWindow);
    }

    layoutSubviews() {
      'worklet';
      this.super?.layoutSubviews?.();
      NativeScriptRuntime.refreshUIKitHostView(this);
    }
  }

  const interopTypes = globalObject.interop?.types;
  const UIWindow = nativeValue('UIWindow');
  const exposedMethods = {
    'willMoveToWindow:': {
      params: UIWindow ? [UIWindow] : [],
      returns: interopTypes?.void,
    },
    layoutSubviews: {
      params: [],
      returns: interopTypes?.void,
    },
  };

  defineObjCExposedMethods(
    RNSScrollViewMarkerNativeScriptView,
    exposedMethods,
  );

  if (typeof UIView.extend === 'function') {
    const methods: Record<string, unknown> = {};
    const methodNames = Object.getOwnPropertyNames(
      RNSScrollViewMarkerNativeScriptView.prototype,
    );

    for (const methodName of methodNames) {
      if (methodName === 'constructor') {
        continue;
      }

      const descriptor = Object.getOwnPropertyDescriptor(
        RNSScrollViewMarkerNativeScriptView.prototype,
        methodName,
      );

      if (descriptor) {
        Object.defineProperty(methods, methodName, descriptor);
      }
    }

    const MarkerViewClass = UIView.extend(methods, {
      exposedMethods,
      name: 'RNSScrollViewMarkerNativeScriptView',
    });

    globalObject[SCROLL_VIEW_MARKER_VIEW_CLASS_KEY] = MarkerViewClass;
    return MarkerViewClass;
  }

  NativeClassFunction(RNSScrollViewMarkerNativeScriptView);
  globalObject[SCROLL_VIEW_MARKER_VIEW_CLASS_KEY] =
    RNSScrollViewMarkerNativeScriptView;
  return RNSScrollViewMarkerNativeScriptView;
}

const NativeScriptScrollViewMarker = NativeScriptRuntime.defineUIKitContainer<
  ScrollViewMarkerProps,
  any,
  any
>({
  debugName: 'RNSScrollViewMarker.NativeScript',
  layout: { sizing: 'fill' },
  create() {
    'worklet';
    const UIView = nativeClassValue('UIView');
    const MarkerView = nativeScriptScrollViewMarkerClass();
    const UIColor = nativeValue('UIColor');

    if (!UIView || typeof UIView.alloc !== 'function') {
      throw new Error('UIView is not available in the UI runtime');
    }

    if (!MarkerView || typeof MarkerView.alloc !== 'function') {
      throw new Error('RNSScrollViewMarker view is not available');
    }

    const rootViewAllocated = UIView.alloc();
    const rootView =
      rootViewAllocated && typeof rootViewAllocated.init === 'function'
        ? rootViewAllocated.init()
        : rootViewAllocated;
    const markerViewAllocated = MarkerView.alloc();
    const childrenView =
      markerViewAllocated && typeof markerViewAllocated.init === 'function'
        ? markerViewAllocated.init()
        : markerViewAllocated;

    rootView.backgroundColor = UIColor?.clearColor ?? null;
    rootView.userInteractionEnabled = true;
    childrenView.backgroundColor = UIColor?.clearColor ?? null;
    childrenView.userInteractionEnabled = true;
    childrenView.frame = rootView.bounds;
    childrenView.autoresizingMask = flexibleSizeMask();
    rootView.addSubview(childrenView);

    return { childrenView, rootView };
  },
  mounted(view, props) {
    'worklet';
    updateNativeScriptScrollViewMarker(view, props);
  },
  update(view, props) {
    'worklet';
    updateNativeScriptScrollViewMarker(view, props);
  },
});

export function ScrollViewMarker(props: ScrollViewMarkerProps) {
  const { scrollEdgeEffects, ...rest } = props;

  if (Platform.OS === 'ios') {
    return (
      <NativeScriptScrollViewMarker
        {...props}
        collapsable={false}
        style={props.style}
      />
    );
  }

  return (
    <ScrollViewMarkerNativeComponent
      leftScrollEdgeEffect={scrollEdgeEffects?.left}
      topScrollEdgeEffect={scrollEdgeEffects?.top}
      rightScrollEdgeEffect={scrollEdgeEffects?.right}
      bottomScrollEdgeEffect={scrollEdgeEffects?.bottom}
      {...rest}
    />
  );
}
