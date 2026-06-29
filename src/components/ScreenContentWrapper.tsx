import React from 'react';
import * as NativeScriptRuntime from '@nativescript/react-native';
import { Platform, View, type ViewProps } from 'react-native';
import ScreenContentWrapperNativeComponent from '../fabric/ScreenContentWrapperNativeComponent';
import {
  NativeScriptScreenHeaderSubviewContext,
  nativeScriptScreenContentWrapperEffectiveFrameOnUI,
  nativeScriptScreenContentWrapperHostReadyOnUI,
  notifyNativeScriptScreenContentWrapperFrame,
} from './native-stack/native-script/NativeScriptScreenStack';

type NativeScriptScreenContentWrapperHostProps = ViewProps & {
  screenId?: string | undefined;
};

type NativeScriptScreenContentWrapperHostView = {
  childrenView: any;
  rootView: any;
};

const ASSOCIATED_HANDLE_SUFFIX = '.NativeScriptHandle';
const ASSOCIATED_VALUE_SUFFIX = '.NativeScriptValue';
const SCREEN_CONTENT_WRAPPER_ROOT_ASSOCIATION_KEY =
  'react-native-screens.NativeScriptScreenContentWrapperRootView';
const SCREEN_CONTENT_WRAPPER_CHILDREN_ASSOCIATION_KEY =
  'react-native-screens.NativeScriptScreenContentWrapperChildrenView';

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

function rectNumber(value: unknown) {
  'worklet';

  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function rectHasPositiveSize(rect: any) {
  'worklet';

  return (
    rectNumber(rect?.size?.width) > 0 && rectNumber(rect?.size?.height) > 0
  );
}

function rectWithZeroOrigin(rect: any) {
  'worklet';
  const size = rect?.size;
  const CGRectMake = nativeValue('CGRectMake');
  const width = rectNumber(size?.width);
  const height = rectNumber(size?.height);

  if (typeof CGRectMake === 'function') {
    return CGRectMake(0, 0, width, height);
  }

  return {
    origin: { x: 0, y: 0 },
    size: { height, width },
  };
}

function rectsApproximatelyEqual(left: any, right: any) {
  'worklet';

  return (
    Math.abs(rectNumber(left?.origin?.x) - rectNumber(right?.origin?.x)) < 0.5 &&
    Math.abs(rectNumber(left?.origin?.y) - rectNumber(right?.origin?.y)) < 0.5 &&
    Math.abs(rectNumber(left?.size?.width) - rectNumber(right?.size?.width)) < 0.5 &&
    Math.abs(rectNumber(left?.size?.height) - rectNumber(right?.size?.height)) < 0.5
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

function setNativeScriptAssociatedObjectForKey(
  object: any,
  key: string,
  value: any,
) {
  'worklet';

  if (!object) {
    return;
  }

  const interopObject = (globalThis as Record<string, any>).interop;
  if (typeof interopObject?.setAssociatedObject === 'function') {
    try {
      const nativeHandleForObject = (NativeScriptRuntime as any)
        .nativeHandleForObject;
      const handle =
        value && typeof nativeHandleForObject === 'function'
          ? nativeHandleForObject(value)
          : undefined;

      if (typeof handle === 'string' && handle.length > 0) {
        interopObject.setAssociatedObject(
          object,
          key + ASSOCIATED_HANDLE_SUFFIX,
          handle,
          'copyNonatomic',
        );
        interopObject.setAssociatedObject(
          object,
          key + ASSOCIATED_VALUE_SUFFIX,
          null,
          'assign',
        );
      } else {
        interopObject.setAssociatedObject(
          object,
          key + ASSOCIATED_VALUE_SUFFIX,
          value ?? null,
          'assign',
        );
        interopObject.setAssociatedObject(
          object,
          key + ASSOCIATED_HANDLE_SUFFIX,
          null,
          'assign',
        );
      }
    } catch (_error) {
      // The runtime association API below is the fallback when low-level
      // interop association is unavailable for this host callback.
    }
  }

  const setAssociatedNativeObject = (NativeScriptRuntime as any)
    .setAssociatedNativeObject;
  if (typeof setAssociatedNativeObject === 'function') {
    setAssociatedNativeObject(object, key, value ?? null, 'assign');
  }
}

function markNativeScriptScreenContentWrapperIdentity(
  rootView: any,
  childrenView: any,
) {
  'worklet';

  if (!rootView) {
    return;
  }

  const resolvedChildrenView = childrenView ?? rootView;

  rootView.__rnsNativeScriptScreenContentWrapperRootView = true;
  rootView.__rnsNativeScriptScreenContentWrapperChildrenView =
    resolvedChildrenView;
  setNativeScriptAssociatedObjectForKey(
    rootView,
    SCREEN_CONTENT_WRAPPER_ROOT_ASSOCIATION_KEY,
    rootView,
  );
  setNativeScriptAssociatedObjectForKey(
    rootView,
    SCREEN_CONTENT_WRAPPER_CHILDREN_ASSOCIATION_KEY,
    resolvedChildrenView,
  );

  if (
    resolvedChildrenView &&
    resolvedChildrenView !== rootView &&
    !nativeObjectsEqual(resolvedChildrenView, rootView)
  ) {
    resolvedChildrenView.__rnsNativeScriptScreenContentWrapperChildrenView =
      resolvedChildrenView;
    setNativeScriptAssociatedObjectForKey(
      resolvedChildrenView,
      SCREEN_CONTENT_WRAPPER_ROOT_ASSOCIATION_KEY,
      rootView,
    );
  }
}

function layoutNativeScriptScreenContentWrapper(
  view: NativeScriptScreenContentWrapperHostView,
  props: Readonly<NativeScriptScreenContentWrapperHostProps>,
  forceTouchRefresh = false,
  refreshHost = false,
  notifyFrame = true,
) {
  'worklet';
  const rootView = view.rootView;
  const childrenView = view.childrenView;

  if (!rootView || !childrenView) {
    return;
  }

  markNativeScriptScreenContentWrapperIdentity(rootView, childrenView);
  rootView.userInteractionEnabled = true;
  childrenView.userInteractionEnabled = true;
  const effectiveFrame = nativeScriptScreenContentWrapperEffectiveFrameOnUI(
    props.screenId,
    rootView.frame,
  );

  if (
    rectHasPositiveSize(effectiveFrame) &&
    !rectsApproximatelyEqual(rootView.frame, effectiveFrame)
  ) {
    rootView.frame = effectiveFrame;
  }
  if (rectHasPositiveSize(effectiveFrame)) {
    const effectiveBounds = rectWithZeroOrigin(effectiveFrame);

    if (!rectsApproximatelyEqual(rootView.bounds, effectiveBounds)) {
      rootView.bounds = effectiveBounds;
    }
  }
  const allowsTouchFallback =
    typeof props.screenId === 'string' &&
    props.screenId.endsWith(':modal-header');

  if (childrenView !== rootView) {
    const childrenSuperview = childrenView.superview;
    const nativeObjectsEqual = (NativeScriptRuntime as any).nativeObjectsEqual;
    const rootOwnsChildren =
      childrenSuperview === rootView ||
      (typeof nativeObjectsEqual === 'function' &&
        nativeObjectsEqual(childrenSuperview, rootView) === true);

    const childFrame = rectWithZeroOrigin(rootView.bounds ?? rootView.frame);
    if (!rectsApproximatelyEqual(childrenView.frame, childFrame)) {
      childrenView.frame = childFrame;
    }
    if (!rectsApproximatelyEqual(childrenView.bounds, childFrame)) {
      childrenView.bounds = childFrame;
    }
    childrenView.autoresizingMask = flexibleSizeMask();
    if (!rootOwnsChildren) {
      childrenView.removeFromSuperview?.();
      rootView.addSubview?.(childrenView);
    }
  }
  rootView.__rnsNativeScriptScreenContentWrapperAllowsTouchFallback =
    allowsTouchFallback;
  childrenView.__rnsNativeScriptScreenContentWrapperAllowsTouchFallback =
    allowsTouchFallback;

  if (refreshHost) {
    const refreshDirectOwner = (NativeScriptRuntime as any)
      .refreshUIKitHostViewDirectOwner;

    if (typeof refreshDirectOwner === 'function') {
      refreshDirectOwner(childrenView);
    } else {
      NativeScriptRuntime.refreshUIKitHostView(childrenView);
    }
  }

  if (notifyFrame) {
    notifyNativeScriptScreenContentWrapperFrame(
      props.screenId,
      rootView.frame,
      rootView,
      forceTouchRefresh,
    );
  }
}

function nativeScriptScreenContentWrapperHandle(
  view: NativeScriptScreenContentWrapperHostView,
) {
  'worklet';

  const nativeHandleForObject = (NativeScriptRuntime as any)
    .nativeHandleForObject;
  const rootView = view.rootView;

  return typeof nativeHandleForObject === 'function'
    ? nativeHandleForObject(rootView)
    : undefined;
}

function firstNonEmptyHandle(...handles: Array<string | undefined>) {
  'worklet';

  for (const handle of handles) {
    if (typeof handle === 'string' && handle.length > 0) {
      return handle;
    }
  }

  return undefined;
}

function nativeScriptScreenContentWrapperVisibleDescendantCount(
  view: NativeScriptScreenContentWrapperHostView,
) {
  'worklet';

  const nativeSubviews = (NativeScriptRuntime as any).nativeSubviews;
  const subviews =
    typeof nativeSubviews === 'function'
      ? nativeSubviews(view.childrenView)
      : view.childrenView?.subviews;
  const count =
    typeof subviews?.count === 'number'
      ? subviews.count
      : Array.isArray(subviews)
        ? subviews.length
        : 0;

  return count > 0 ? count : 0;
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
      // Mirror upstream RNSScreenContentWrapper as a single UIKit/Fabric
      // component view: the wrapper root is also where React children live.
      const UIView = nativeValue('UIView');
      const UIColor = nativeValue('UIColor');

      if (!UIView || typeof UIView.alloc !== 'function') {
        throw new Error('UIView is not available in the UI runtime');
      }

      const rootAllocated = UIView.alloc();
      const rootView =
        rootAllocated && typeof rootAllocated.init === 'function'
          ? rootAllocated.init()
          : rootAllocated;
      const childrenView = rootView;
      const mask = flexibleSizeMask();

      rootView.backgroundColor = UIColor?.clearColor ?? null;
      rootView.userInteractionEnabled = true;
      rootView.autoresizingMask = mask;
      markNativeScriptScreenContentWrapperIdentity(rootView, childrenView);

      return { childrenView, rootView };
    },
    mounted(view, props) {
      'worklet';
      layoutNativeScriptScreenContentWrapper(view, props, true);
    },
    update(view, props) {
      'worklet';
      layoutNativeScriptScreenContentWrapper(view, props);
    },
    refresh(view, props) {
      'worklet';
      layoutNativeScriptScreenContentWrapper(view, props, true, true);
    },
    transactionCommitted(view, props) {
      'worklet';
      layoutNativeScriptScreenContentWrapper(view, props, false, false, false);
      nativeScriptScreenContentWrapperHostReadyOnUI(
        props.screenId,
        nativeScriptScreenContentWrapperHandle(view),
        nativeScriptScreenContentWrapperVisibleDescendantCount(view),
        false,
      );
    },
    hostReady(view, props, event) {
      'worklet';
      const nativeEvent = event.nativeEvent;
      const contentWrapperViewHandle = firstNonEmptyHandle(
        nativeScriptScreenContentWrapperHandle(view),
        nativeEvent.nativeViewHandle,
        nativeEvent.childrenViewHandle,
        nativeEvent.componentViewHandle,
      );

      nativeScriptScreenContentWrapperHostReadyOnUI(
        props.screenId,
        contentWrapperViewHandle,
        nativeEvent.visibleDescendantCount,
        nativeEvent.windowAttached,
      );
      layoutNativeScriptScreenContentWrapper(view, props, false, false, false);
    },
  });

const ScreenContentWrapper = React.forwardRef<View, ViewProps>(
  function ScreenContentWrapper(props, ref) {
    const screenContext = React.useContext(
      NativeScriptScreenHeaderSubviewContext,
    );
    const screenId = screenContext?.screenId;
    const isModalHeader =
      typeof screenId === 'string' && screenId.endsWith(':modal-header');
    const ignoreHostReadyWindowAttachment = !isModalHeader;
    const handleLayout = React.useCallback(
      (event: Parameters<NonNullable<ViewProps['onLayout']>>[0]) => {
        props.onLayout?.(event);
      },
      [props],
    );

    if (Platform.OS === 'ios') {
      return (
        <NativeScriptScreenContentWrapperHost
          {...props}
          ref={ref as any}
          attachController={false}
          attachNativeView={false}
          collapsable={false}
          disableUIKitHostWindowAttachRefresh
          disableDetachedChildrenTouchHandler={!isModalHeader}
          emitOffWindowHostReady
          ignoreHostReadyWindowAttachment={ignoreHostReadyWindowAttachment}
          immediateTransactionCommit
          onLayout={handleLayout}
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
