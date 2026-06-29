'use client';

import React from 'react';
import * as NativeScriptRuntime from '@nativescript/react-native';
import type { UIKitViewRef } from '@nativescript/react-native';
import {
  HeaderBarButtonItemWithMenu,
  ScreenStackHeaderConfigProps,
  ScreenStackHeaderSubviewProps,
} from '../types';
import {
  Image,
  ImageProps,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import featureFlags from '../flags';

// Native components
import ScreenStackHeaderConfigNativeComponent from '../fabric/ScreenStackHeaderConfigNativeComponent';
import ScreenStackHeaderSubviewNativeComponent, {
  type HeaderSubviewTypes as NativeHeaderSubviewTypes,
  type NativeProps as ScreenStackHeaderSubviewNativeProps,
} from '../fabric/ScreenStackHeaderSubviewNativeComponent';
import { prepareHeaderBarButtonItems } from './helpers/prepareHeaderBarButtonItems';
import { isHeaderBarButtonsAvailableForCurrentPlatform } from '../utils';
import { useTopInsetApplication } from './contexts/TopInsetApplicationContext';
import {
  NativeScriptScreenHeaderSearchBarContext,
  NativeScriptScreenHeaderSubviewContext,
  notifyNativeScriptHeaderSubviewChanged,
  registerNativeScriptHeaderSubview,
  setNativeScriptHeaderSubviewExpectedCount,
  type NativeScriptHeaderSubviewRegistration,
  type NativeScriptHeaderSubviewType,
  unregisterNativeScriptHeaderSubview,
} from './native-stack/native-script/NativeScriptScreenStack';

type NativeScriptHeaderSubviewProps = ScreenStackHeaderSubviewNativeProps & {
  nativeScriptBackImageIsTemplate?: boolean | undefined;
  nativeScriptBackImageSource?: unknown;
  nativeScriptHeaderSubviewOrder?: number | undefined;
};

type NativeScriptHeaderSubviewOrderProp = {
  nativeScriptHeaderSubviewOrder?: number | undefined;
};

type NativeScriptHeaderConfigHostProps = ViewProps & {
  nativeScriptHeaderSubviewCount?: number | undefined;
  screenId?: string | undefined;
};

type NativeScriptHeaderConfigHostView = {
  childrenView: any;
  rootView: any;
};

type NativeScriptHeaderSubviewHostProps = NativeScriptHeaderSubviewProps & {
  screenId: string;
  subviewId: string;
};

type NativeScriptHeaderSubviewHostView = {
  childrenView: any;
  rootView: any;
};

const HEADER_SUBVIEW_ROOT_VIEW_CLASS_KEY =
  '__rnsNativeScriptHeaderSubviewRootViewClass';
const HEADER_SUBVIEW_CUSTOM_VIEW_WRAPPER_KEY =
  '__rnsNativeScriptHeaderSubviewCustomViewWrapper';
const HEADER_SUBVIEW_LAYOUT_SIZE_KEY =
  '__rnsNativeScriptHeaderSubviewLayoutSize';
const HEADER_SUBVIEW_NAVIGATION_BAR_LAYOUTING_KEY =
  '__rnsNativeScriptHeaderSubviewNavigationBarLayouting';

type PreparedHeaderBarButtonItem = ReturnType<
  typeof prepareHeaderBarButtonItems
>[number];

function collectHeaderButtonActions(
  items: Array<PreparedHeaderBarButtonItem> | undefined,
  actions: Map<string, () => void>,
) {
  if (!items) {
    return;
  }

  for (const item of items) {
    if (
      item &&
      item.type === 'button' &&
      'buttonId' in item &&
      typeof item.buttonId === 'string' &&
      typeof item.onPress === 'function'
    ) {
      actions.set(item.buttonId, item.onPress);
    }
  }
}

function collectHeaderMenuActions(
  menu: HeaderBarButtonItemWithMenu['menu'],
  actions: Map<string, () => void>,
) {
  for (const item of menu.items) {
    if ('items' in item) {
      collectHeaderMenuActions(item, actions);
    } else if (
      'menuId' in item &&
      typeof item.menuId === 'string' &&
      typeof item.onPress === 'function'
    ) {
      actions.set(item.menuId, item.onPress);
    }
  }
}

function collectHeaderBarMenuActions(
  items: Array<PreparedHeaderBarButtonItem> | undefined,
  actions: Map<string, () => void>,
) {
  if (!items) {
    return;
  }

  for (const item of items) {
    if (item && item.type === 'menu' && item.menu) {
      collectHeaderMenuActions(item.menu, actions);
    }
  }
}
const NATIVE_SCRIPT_HEADER_CONFIG_HEIGHT = 54;

function nativeValue(name: string) {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const api = globalObject.__nativeScriptNativeApi;

  return api?.[name] ?? globalObject[name];
}

function makeNativeScriptHeaderSubviewSize(width: number, height: number) {
  'worklet';
  const CGSizeMake = nativeValue('CGSizeMake');

  if (typeof CGSizeMake === 'function') {
    return CGSizeMake(width, height);
  }

  return { width, height };
}

function makeNativeScriptHeaderSubviewRect(width: number, height: number) {
  'worklet';
  const CGRectMake = nativeValue('CGRectMake');

  if (typeof CGRectMake === 'function') {
    return CGRectMake(0, 0, width, height);
  }

  return {
    origin: { x: 0, y: 0 },
    size: { height, width },
  };
}

function makeNativeScriptHeaderSubviewRectWithOrigin(
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

function headerSubviewRectsEqual(left: any, right: any) {
  'worklet';
  const leftOrigin = left?.origin ?? {};
  const rightOrigin = right?.origin ?? {};
  const leftSize = left?.size ?? {};
  const rightSize = right?.size ?? {};

  return (
    Number(leftOrigin.x ?? 0) === Number(rightOrigin.x ?? 0) &&
    Number(leftOrigin.y ?? 0) === Number(rightOrigin.y ?? 0) &&
    Number(leftSize.width ?? 0) === Number(rightSize.width ?? 0) &&
    Number(leftSize.height ?? 0) === Number(rightSize.height ?? 0)
  );
}

function finiteHeaderSubviewDimension(value: unknown): number {
  'worklet';
  const numberValue = Number(value);

  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : 0;
}

function headerSubviewRectSize(rect: any) {
  'worklet';
  const size = rect?.size ?? rect;

  return {
    height: finiteHeaderSubviewDimension(size?.height),
    width: finiteHeaderSubviewDimension(size?.width),
  };
}

function headerSubviewSizesEqual(
  left: { height?: number; width?: number } | null | undefined,
  right: { height?: number; width?: number } | null | undefined,
) {
  'worklet';

  return (
    finiteHeaderSubviewDimension(left?.height) ===
      finiteHeaderSubviewDimension(right?.height) &&
    finiteHeaderSubviewDimension(left?.width) ===
      finiteHeaderSubviewDimension(right?.width)
  );
}

function headerSubviewNativeIntrinsicSize(view: any) {
  'worklet';
  let intrinsicSize: any = null;

  try {
    intrinsicSize =
      typeof view?.intrinsicContentSize === 'function'
        ? view.intrinsicContentSize()
        : view?.intrinsicContentSize;
  } catch {
    intrinsicSize = null;
  }

  const resolvedIntrinsicSize = headerSubviewRectSize(intrinsicSize);

  if (resolvedIntrinsicSize.width > 0 || resolvedIntrinsicSize.height > 0) {
    return resolvedIntrinsicSize;
  }

  if (typeof view?.sizeThatFits !== 'function') {
    return { height: 0, width: 0 };
  }

  try {
    return headerSubviewRectSize(
      view.sizeThatFits(
        makeNativeScriptHeaderSubviewSize(
          Number.MAX_SAFE_INTEGER,
          Number.MAX_SAFE_INTEGER,
        ),
      ),
    );
  } catch {
    return { height: 0, width: 0 };
  }
}

function headerSubviewFabricLayoutFrame(view: any) {
  'worklet';
  let traits =
    view && typeof view === 'object'
      ? view.__nativeScriptFabricViewLayoutTraits
      : null;

  if (!traits) {
    const nativeHandleForObject = (NativeScriptRuntime as any)
      .nativeHandleForObject;
    const readTraits = (globalThis as Record<string, any>)
      .__nativeScriptReactFabricViewLayoutTraits;

    if (
      typeof nativeHandleForObject === 'function' &&
      typeof readTraits === 'function'
    ) {
      try {
        const viewHandle = nativeHandleForObject(view);
        traits = viewHandle ? readTraits(viewHandle) : null;
      } catch {
        traits = null;
      }
    }
  }

  if (!traits) {
    return null;
  }

  const width = finiteHeaderSubviewDimension(traits.layoutMetricsFrameWidth);
  const height = finiteHeaderSubviewDimension(traits.layoutMetricsFrameHeight);

  if (width <= 0 && height <= 0) {
    return null;
  }

  return {
    origin: {
      x: Number(traits.layoutMetricsFrameX ?? 0),
      y: Number(traits.layoutMetricsFrameY ?? 0),
    },
    size: { height, width },
  };
}

function headerSubviewFabricLayoutSize(view: any) {
  'worklet';
  const frame = headerSubviewFabricLayoutFrame(view);

  return frame ? headerSubviewRectSize(frame) : { height: 0, width: 0 };
}

function headerSubviewTypeNeedsAutoLayout(
  type: NativeScriptHeaderSubviewType | undefined,
) {
  'worklet';
  return type === 'left' || type === 'right';
}

function headerSubviewViewNeedsAutoLayout(view: any) {
  'worklet';

  return headerSubviewTypeNeedsAutoLayout(
    view?.__rnsNativeScriptHeaderSubviewType,
  );
}

function headerSubviewTypePrefersIntrinsicContentSize(
  type: NativeScriptHeaderSubviewType | undefined,
) {
  'worklet';
  return type === 'center' || type === 'title';
}

function nativeArrayCount(value: any): number {
  'worklet';
  const nativeArrayLength = (NativeScriptRuntime as any).nativeArrayLength;

  if (typeof nativeArrayLength === 'function') {
    const count = nativeArrayLength(value);
    return Number.isFinite(count) ? count : 0;
  }

  const count = value?.count ?? value?.length ?? 0;
  return Number.isFinite(count) ? count : 0;
}

function nativeArrayItem(value: any, index: number): any {
  'worklet';
  const nativeArrayItemAtIndex = (NativeScriptRuntime as any).nativeArrayItem;

  if (typeof nativeArrayItemAtIndex === 'function') {
    return nativeArrayItemAtIndex(value, index);
  }

  if (typeof value?.objectAtIndex === 'function') {
    return value.objectAtIndex(index);
  }

  return value?.[index];
}

function activateNativeConstraint(constraint: any) {
  'worklet';

  if (!constraint) {
    return;
  }

  constraint.active = true;
}

function convertPointBetweenNativeViews(
  point: any,
  sourceView: any,
  targetView: any,
) {
  'worklet';

  if (typeof sourceView?.convertPointToView === 'function') {
    return sourceView.convertPointToView(point, targetView);
  }

  if (typeof sourceView?.['convertPoint:toView:'] === 'function') {
    return sourceView['convertPoint:toView:'](point, targetView);
  }

  if (typeof targetView?.convertPointFromView === 'function') {
    return targetView.convertPointFromView(point, sourceView);
  }

  if (typeof targetView?.['convertPoint:fromView:'] === 'function') {
    return targetView['convertPoint:fromView:'](point, sourceView);
  }

  return point;
}

function nativeViewHitTestWithEvent(view: any, point: any, event: any) {
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

function headerSubviewHitTestVisibleDescendantOutsideBounds(
  view: any,
  point: any,
  event: any,
  depth = 0,
): any {
  'worklet';

  if (
    !view ||
    depth > 16 ||
    view.hidden === true ||
    (view.alpha ?? 1) <= 0.01 ||
    view.userInteractionEnabled === false ||
    view.window == null
  ) {
    return null;
  }

  const subviews = view.subviews;
  const count = nativeArrayCount(subviews);

  for (let index = count - 1; index >= 0; index -= 1) {
    const subview = nativeArrayItem(subviews, index);

    if (
      !subview ||
      subview.hidden === true ||
      (subview.alpha ?? 1) <= 0.01 ||
      subview.userInteractionEnabled === false ||
      subview.window == null
    ) {
      continue;
    }

    const subviewPoint = convertPointBetweenNativeViews(point, view, subview);
    const hitView = nativeViewHitTestWithEvent(subview, subviewPoint, event);

    if (hitView) {
      return hitView;
    }

    const descendantHitView =
      headerSubviewHitTestVisibleDescendantOutsideBounds(
        subview,
        subviewPoint,
        event,
        depth + 1,
      );

    if (descendantHitView) {
      return descendantHitView;
    }
  }

  return null;
}

function headerSubviewMeasuredContentSize(
  view: any,
  depth = 0,
  ownerType?: NativeScriptHeaderSubviewType,
) {
  'worklet';

  if (!view || depth > 8) {
    return { height: 0, width: 0 };
  }

  const subviews = view.subviews;
  const count = nativeArrayCount(subviews);
  const prefersIntrinsicContentSize =
    headerSubviewTypePrefersIntrinsicContentSize(ownerType);

  if (count <= 0) {
    const fabricFrame = headerSubviewFabricLayoutFrame(view);
    const fabricSize = fabricFrame ? headerSubviewRectSize(fabricFrame) : null;

    if (
      !prefersIntrinsicContentSize &&
      fabricSize &&
      (fabricSize.width > 0 || fabricSize.height > 0)
    ) {
      return fabricSize;
    }

    return headerSubviewNativeIntrinsicSize(view);
  }

  let height = 0;
  let width = 0;

  for (let index = 0; index < count; index += 1) {
    const subview = nativeArrayItem(subviews, index);

    if (!subview || subview.hidden === true || (subview.alpha ?? 1) <= 0.01) {
      continue;
    }

    const fabricFrame = headerSubviewFabricLayoutFrame(subview);
    const frame = fabricFrame ?? subview.frame ?? subview.bounds;
    const originX = Number(frame?.origin?.x ?? frame?.x ?? 0);
    const originY = Number(frame?.origin?.y ?? frame?.y ?? 0);
    const frameSize = headerSubviewRectSize(frame);
    const intrinsicSize = headerSubviewNativeIntrinsicSize(subview);
    const nestedSize = headerSubviewMeasuredContentSize(
      subview,
      depth + 1,
      ownerType,
    );
    let contentWidth = frameSize.width;
    let contentHeight = frameSize.height;

    if (
      (!fabricFrame || prefersIntrinsicContentSize) &&
      intrinsicSize.width > 0 &&
      (contentWidth <= 0 || intrinsicSize.width < contentWidth)
    ) {
      contentWidth = intrinsicSize.width;
    } else if (
      (!fabricFrame || prefersIntrinsicContentSize) &&
      nestedSize.width > 0 &&
      (contentWidth <= 0 || nestedSize.width < contentWidth)
    ) {
      contentWidth = nestedSize.width;
    }

    if (
      (!fabricFrame || prefersIntrinsicContentSize) &&
      intrinsicSize.height > 0 &&
      (contentHeight <= 0 || intrinsicSize.height < contentHeight)
    ) {
      contentHeight = intrinsicSize.height;
    } else if (
      (!fabricFrame || prefersIntrinsicContentSize) &&
      nestedSize.height > 0 &&
      (contentHeight <= 0 || nestedSize.height < contentHeight)
    ) {
      contentHeight = nestedSize.height;
    }

    if (prefersIntrinsicContentSize) {
      width = Math.max(width, contentWidth);
      height = Math.max(height, contentHeight);
    } else {
      width = Math.max(
        width,
        (Number.isFinite(originX) ? Math.max(0, originX) : 0) + contentWidth,
      );
      height = Math.max(
        height,
        (Number.isFinite(originY) ? Math.max(0, originY) : 0) + contentHeight,
      );
    }
  }

  return { height, width };
}

function currentHeaderSubviewContentSize(
  view: NativeScriptHeaderSubviewHostView,
) {
  'worklet';
  const contentSize = headerSubviewMeasuredContentSize(
    view.childrenView ?? view.rootView,
    0,
    view.rootView?.__rnsNativeScriptHeaderSubviewType,
  );

  if (contentSize.width > 0 || contentSize.height > 0) {
    return contentSize;
  }

  return { height: 0, width: 0 };
}

function headerSubviewSizeIsValidForType(
  size: { height?: number; width?: number } | null | undefined,
  type: NativeScriptHeaderSubviewType | undefined,
) {
  'worklet';

  if (headerSubviewTypePrefersIntrinsicContentSize(type)) {
    return (size?.width ?? 0) > 0 && (size?.height ?? 0) > 0;
  }

  return (size?.width ?? 0) > 0 || (size?.height ?? 0) > 0;
}

function headerSubviewShouldUseCompactContentSize(
  type: NativeScriptHeaderSubviewType | undefined,
  fabricSize: { height?: number; width?: number } | null | undefined,
  contentSize: { height?: number; width?: number } | null | undefined,
) {
  'worklet';

  if (
    !headerSubviewTypeNeedsAutoLayout(type) &&
    !headerSubviewTypePrefersIntrinsicContentSize(type)
  ) {
    return false;
  }

  const contentWidth = finiteHeaderSubviewDimension(contentSize?.width);
  const contentHeight = finiteHeaderSubviewDimension(contentSize?.height);
  const fabricWidth = finiteHeaderSubviewDimension(fabricSize?.width);
  const fabricHeight = finiteHeaderSubviewDimension(fabricSize?.height);

  return (
    contentWidth > 0 &&
    contentHeight > 0 &&
    fabricWidth > contentWidth + 0.5 &&
    (fabricHeight <= 0 || contentHeight <= fabricHeight + 0.5)
  );
}

function headerSubviewShouldPreserveCompactIntrinsicSize(
  type: NativeScriptHeaderSubviewType | undefined,
  previousSize: { height?: number; width?: number } | null | undefined,
  nextSize: { height?: number; width?: number } | null | undefined,
  layoutSize: { height?: number; width?: number } | null | undefined,
  fabricSize: { height?: number; width?: number } | null | undefined,
) {
  'worklet';

  if (
    !headerSubviewTypePrefersIntrinsicContentSize(type) ||
    !headerSubviewSizeIsValidForType(previousSize, type) ||
    !headerSubviewSizeIsValidForType(nextSize, type)
  ) {
    return false;
  }

  const previousWidth = finiteHeaderSubviewDimension(previousSize?.width);
  const previousHeight = finiteHeaderSubviewDimension(previousSize?.height);
  const nextWidth = finiteHeaderSubviewDimension(nextSize?.width);
  const nextHeight = finiteHeaderSubviewDimension(nextSize?.height);
  const layoutWidth = finiteHeaderSubviewDimension(layoutSize?.width);
  const fabricWidth = finiteHeaderSubviewDimension(fabricSize?.width);
  const matchesExpandedLayout =
    headerSubviewSizesEqual(nextSize, layoutSize) ||
    headerSubviewSizesEqual(nextSize, fabricSize) ||
    (layoutWidth > previousWidth + 0.5 && nextWidth <= layoutWidth + 0.5) ||
    (fabricWidth > previousWidth + 0.5 && nextWidth <= fabricWidth + 0.5);

  return (
    nextWidth > previousWidth + 0.5 &&
    nextHeight <= previousHeight + 0.5 &&
    (matchesExpandedLayout || nextHeight > 0)
  );
}

function currentHeaderSubviewIntrinsicSize(rootView: any) {
  'worklet';
  const layoutSize = rootView?.[HEADER_SUBVIEW_LAYOUT_SIZE_KEY];
  const storedSize = rootView?.__rnsNativeScriptHeaderSubviewIntrinsicSize;
  const subviewType = rootView?.__rnsNativeScriptHeaderSubviewType;
  const contentSize = headerSubviewMeasuredContentSize(
    rootView,
    0,
    subviewType,
  );

  if (headerSubviewSizeIsValidForType(storedSize, subviewType)) {
    return storedSize;
  }

  if (
    headerSubviewShouldUseCompactContentSize(
      subviewType,
      layoutSize,
      contentSize,
    ) &&
    headerSubviewSizeIsValidForType(contentSize, subviewType)
  ) {
    return contentSize;
  }

  if (headerSubviewSizeIsValidForType(layoutSize, subviewType)) {
    return layoutSize;
  }

  const fabricSize = headerSubviewFabricLayoutSize(rootView);

  if (
    headerSubviewShouldUseCompactContentSize(
      subviewType,
      fabricSize,
      contentSize,
    ) &&
    headerSubviewSizeIsValidForType(contentSize, subviewType)
  ) {
    return contentSize;
  }

  if (headerSubviewSizeIsValidForType(fabricSize, subviewType)) {
    return fabricSize;
  }

  if (headerSubviewSizeIsValidForType(contentSize, subviewType)) {
    return contentSize;
  }

  if (headerSubviewViewNeedsAutoLayout(rootView)) {
    return { height: 0, width: 0 };
  }

  return headerSubviewRectSize(rootView?.bounds);
}

function flexibleSizeMask() {
  'worklet';
  const autoresizing = nativeValue('UIViewAutoresizing');

  return (
    (autoresizing?.FlexibleWidth ?? autoresizing?.flexibleWidth ?? 2) |
    (autoresizing?.FlexibleHeight ?? autoresizing?.flexibleHeight ?? 16)
  );
}

function headerSubviewHostedContentOrigin(view: any) {
  'worklet';

  const subviews = view?.subviews;
  const count = nativeArrayCount(subviews);
  let minX: number | undefined;
  let minY: number | undefined;

  for (let index = 0; index < count; index += 1) {
    const subview = nativeArrayItem(subviews, index);

    if (!subview || subview.hidden === true || (subview.alpha ?? 1) <= 0.01) {
      continue;
    }

    const frame = headerSubviewFabricLayoutFrame(subview) ?? subview.frame;
    const originX = Number(frame?.origin?.x ?? frame?.x ?? 0);
    const originY = Number(frame?.origin?.y ?? frame?.y ?? 0);

    if (Number.isFinite(originX)) {
      minX = minX === undefined ? originX : Math.min(minX, originX);
    }
    if (Number.isFinite(originY)) {
      minY = minY === undefined ? originY : Math.min(minY, originY);
    }
  }

  return { x: minX ?? 0, y: minY ?? 0 };
}

function layoutNativeScriptHeaderSubviewChildren(rootView: any) {
  'worklet';
  const childrenView = rootView?.__rnsNativeScriptHeaderSubviewChildrenView;

  if (!rootView || !childrenView) {
    return;
  }

  const subviewType = rootView.__rnsNativeScriptHeaderSubviewType;
  const rootSize = headerSubviewRectSize(rootView.bounds);
  const intrinsicSize = currentHeaderSubviewIntrinsicSize(rootView);
  const prefersIntrinsicContentSize =
    headerSubviewTypePrefersIntrinsicContentSize(subviewType);
  const shouldNormalizeHostedOrigin =
    prefersIntrinsicContentSize &&
    intrinsicSize.width > 0 &&
    intrinsicSize.height > 0 &&
    rootSize.width <= intrinsicSize.width + 0.5 &&
    rootSize.height <= intrinsicSize.height + 0.5;
  const shouldCenterHostedContent =
    prefersIntrinsicContentSize &&
    intrinsicSize.width > 0 &&
    intrinsicSize.height > 0 &&
    (rootSize.width > intrinsicSize.width + 0.5 ||
      rootSize.height > intrinsicSize.height + 0.5);
  const contentOrigin =
    prefersIntrinsicContentSize &&
    (shouldNormalizeHostedOrigin || shouldCenterHostedContent)
    ? headerSubviewHostedContentOrigin(childrenView)
    : { x: 0, y: 0 };
  const childrenWidth = shouldCenterHostedContent
    ? Math.min(rootSize.width, intrinsicSize.width)
    : rootView.bounds?.size?.width ?? 0;
  const childrenHeight = shouldCenterHostedContent
    ? Math.min(rootSize.height, intrinsicSize.height)
    : rootView.bounds?.size?.height ?? 0;
  const childrenOriginX = shouldCenterHostedContent
    ? Math.max(0, (rootSize.width - childrenWidth) / 2)
    : 0;
  const childrenOriginY = shouldCenterHostedContent
    ? Math.max(0, (rootSize.height - childrenHeight) / 2)
    : 0;

  childrenView.frame = makeNativeScriptHeaderSubviewRectWithOrigin(
    childrenOriginX,
    childrenOriginY,
    childrenWidth,
    childrenHeight,
  );
  childrenView.bounds = makeNativeScriptHeaderSubviewRectWithOrigin(
    contentOrigin.x,
    contentOrigin.y,
    childrenWidth,
    childrenHeight,
  );
  childrenView.autoresizingMask = flexibleSizeMask();
}

function applyNativeScriptHeaderSubviewLayoutSize(
  view: NativeScriptHeaderSubviewHostView,
  size: { height: number; width: number },
  layoutSize = size,
) {
  'worklet';
  const rootView = view.rootView;
  const childrenView = view.childrenView;
  const subviewType = rootView?.__rnsNativeScriptHeaderSubviewType;
  const prefersIntrinsicContentSize =
    headerSubviewTypePrefersIntrinsicContentSize(subviewType);
  const boundsSize =
    prefersIntrinsicContentSize &&
    headerSubviewSizeIsValidForType(size, subviewType)
      ? size
      : prefersIntrinsicContentSize &&
        headerSubviewSizeIsValidForType(layoutSize, subviewType)
      ? layoutSize
      : size;

  if (
    !rootView ||
    !childrenView ||
    !headerSubviewSizeIsValidForType(
      size,
      rootView.__rnsNativeScriptHeaderSubviewType,
    )
  ) {
    return;
  }

  // The header subview's UIKit geometry is owned by UINavigationItem titleView
  // or UIBarButtonItem customView wrappers. This host publishes intrinsic size;
  // mutating UIView geometry from the serialized mount worklet can race UIKit.
  if (!headerSubviewViewNeedsAutoLayout(rootView)) {
    const nextBounds = makeNativeScriptHeaderSubviewRect(
      boundsSize.width,
      boundsSize.height,
    );

    if (!headerSubviewRectsEqual(rootView.bounds, nextBounds)) {
      rootView.bounds = nextBounds;
    }
  }

  layoutNativeScriptHeaderSubviewChildren(rootView);
}

function nativeScriptHeaderSubviewNearestNavigationBar(view: any) {
  'worklet';
  const UINavigationBar = nativeValue('UINavigationBar');
  let current = view?.superview;
  let depth = 0;

  while (current && depth < 12) {
    if (
      UINavigationBar &&
      typeof current.isKindOfClass === 'function' &&
      current.isKindOfClass(UINavigationBar)
    ) {
      return current;
    }

    current = current.superview;
    depth += 1;
  }

  return null;
}

function layoutNativeScriptHeaderSubviewNavigationBar(rootView: any) {
  'worklet';
  const navigationBar =
    nativeScriptHeaderSubviewNearestNavigationBar(rootView);

  if (!navigationBar) {
    return false;
  }

  if (navigationBar[HEADER_SUBVIEW_NAVIGATION_BAR_LAYOUTING_KEY] === true) {
    return false;
  }

  navigationBar[HEADER_SUBVIEW_NAVIGATION_BAR_LAYOUTING_KEY] = true;
  try {
    navigationBar.setNeedsLayout?.();
    navigationBar.layoutIfNeeded?.();
    navigationBar.superview?.setNeedsLayout?.();
  } finally {
    navigationBar[HEADER_SUBVIEW_NAVIGATION_BAR_LAYOUTING_KEY] = false;
  }

  return true;
}

function invalidateNativeScriptHeaderSubviewUIKitLayout(rootView: any) {
  'worklet';
  const customViewWrapper = rootView?.[HEADER_SUBVIEW_CUSTOM_VIEW_WRAPPER_KEY];

  rootView?.invalidateIntrinsicContentSize?.();
  customViewWrapper?.invalidateIntrinsicContentSize?.();
  customViewWrapper?.setNeedsLayout?.();
  customViewWrapper?.superview?.setNeedsLayout?.();
  layoutNativeScriptHeaderSubviewNavigationBar(rootView);
}

function nativeScriptHeaderSubviewRootViewClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[HEADER_SUBVIEW_ROOT_VIEW_CLASS_KEY];

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

  class RNSScreenStackHeaderSubviewNativeScriptView extends UIView {
    didMoveToSuperview() {
      'worklet';
      super.didMoveToSuperview?.();
      layoutNativeScriptHeaderSubviewChildren(this);
      layoutNativeScriptHeaderSubviewNavigationBar(this);
    }

    didMoveToWindow() {
      'worklet';
      super.didMoveToWindow?.();
      layoutNativeScriptHeaderSubviewChildren(this);
      layoutNativeScriptHeaderSubviewNavigationBar(this);
    }

    layoutSubviews() {
      'worklet';
      super.layoutSubviews?.();
      layoutNativeScriptHeaderSubviewChildren(this);
    }

    intrinsicContentSize() {
      'worklet';
      const size = currentHeaderSubviewIntrinsicSize(this);

      return makeNativeScriptHeaderSubviewSize(size.width, size.height);
    }

    sizeThatFits(_size: any) {
      'worklet';

      return this.intrinsicContentSize();
    }

    'sizeThatFits:'(size: any) {
      'worklet';

      return this.sizeThatFits(size);
    }

    hitTestWithEvent(point: any, event: any) {
      'worklet';
      const childrenView = this.__rnsNativeScriptHeaderSubviewChildrenView;

      if (childrenView) {
        const childrenPoint = convertPointBetweenNativeViews(
          point,
          this,
          childrenView,
        );
        const hitView = headerSubviewHitTestVisibleDescendantOutsideBounds(
          childrenView,
          childrenPoint,
          event,
        );

        if (hitView) {
          return hitView;
        }
      }

      const superObject = this.super;

      if (typeof superObject?.hitTestWithEvent === 'function') {
        return superObject.hitTestWithEvent(point, event);
      }

      if (typeof superObject?.['hitTest:withEvent:'] === 'function') {
        return superObject['hitTest:withEvent:'](point, event);
      }

      return null;
    }

    'hitTest:withEvent:'(point: any, event: any) {
      'worklet';

      return this.hitTestWithEvent(point, event);
    }
  }

  const interopTypes = globalObject.interop?.types;
  const CGSize = nativeValue('CGSize');
  const CGPoint = nativeValue('CGPoint');
  const UIEvent = nativeValue('UIEvent');
  const sizeType = CGSize ?? interopTypes?.id;
  const exposedMethods = {
    intrinsicContentSize: {
      params: [],
      returns: sizeType,
    },
    'sizeThatFits:': {
      params: sizeType ? [sizeType] : [],
      returns: sizeType,
    },
    'hitTest:withEvent:': {
      params: [CGPoint ?? interopTypes?.id, UIEvent ?? interopTypes?.id],
      returns: UIView,
    },
    didMoveToSuperview: {
      params: [],
      returns: interopTypes?.void,
    },
    didMoveToWindow: {
      params: [],
      returns: interopTypes?.void,
    },
  };

  (RNSScreenStackHeaderSubviewNativeScriptView as any).ObjCExposedMethods =
    exposedMethods;

  if (typeof NativeClassFunction === 'function') {
    NativeClassFunction(RNSScreenStackHeaderSubviewNativeScriptView);
    globalObject[HEADER_SUBVIEW_ROOT_VIEW_CLASS_KEY] =
      RNSScreenStackHeaderSubviewNativeScriptView;
    return RNSScreenStackHeaderSubviewNativeScriptView;
  }

  if (typeof UIView.extend === 'function') {
    const methods: Record<string, unknown> = {};
    const methodNames = Object.getOwnPropertyNames(
      RNSScreenStackHeaderSubviewNativeScriptView.prototype,
    );

    for (const methodName of methodNames) {
      if (methodName === 'constructor') {
        continue;
      }

      const descriptor = Object.getOwnPropertyDescriptor(
        RNSScreenStackHeaderSubviewNativeScriptView.prototype,
        methodName,
      );

      if (descriptor) {
        Object.defineProperty(methods, methodName, descriptor);
      }
    }

    const HeaderSubviewRootViewClass = UIView.extend(methods, {
      exposedMethods,
      name: 'RNSScreenStackHeaderSubviewNativeScriptView',
    });

    globalObject[HEADER_SUBVIEW_ROOT_VIEW_CLASS_KEY] =
      HeaderSubviewRootViewClass;
    return HeaderSubviewRootViewClass;
  }

  return UIView;
}

function updateNativeScriptHeaderSubviewIntrinsicSizeFromLayout(
  view: NativeScriptHeaderSubviewHostView,
  width: number,
  height: number,
): boolean {
  'worklet';
  const rootView = view.rootView;

  if (!rootView) {
    return false;
  }

  const layoutSize = {
    height: finiteHeaderSubviewDimension(height),
    width: finiteHeaderSubviewDimension(width),
  };
  const fabricSize = headerSubviewFabricLayoutSize(rootView);
  const contentSize = currentHeaderSubviewContentSize(view);
  const needsAutoLayout = headerSubviewViewNeedsAutoLayout(rootView);
  const subviewType = rootView.__rnsNativeScriptHeaderSubviewType;
  const prefersIntrinsicContentSize =
    headerSubviewTypePrefersIntrinsicContentSize(subviewType);
  const fabricSizeIsValid = headerSubviewSizeIsValidForType(
    fabricSize,
    subviewType,
  );

  if (
    prefersIntrinsicContentSize &&
    !fabricSizeIsValid &&
    layoutSize.height <= 0 &&
    contentSize.height <= 0
  ) {
    return false;
  }

  const shouldUseCompactContentSize =
    headerSubviewShouldUseCompactContentSize(
      subviewType,
      fabricSize,
      contentSize,
    );
  const shouldUseFabricSize =
    fabricSizeIsValid && !shouldUseCompactContentSize;
  const layoutSizeIsValid = headerSubviewSizeIsValidForType(
    layoutSize,
    subviewType,
  );
  const layoutSizeMatchesExistingUIKitBounds =
    needsAutoLayout &&
    layoutSizeIsValid &&
    headerSubviewSizesEqual(headerSubviewRectSize(rootView.bounds), layoutSize);
  const shouldUseLayoutSize =
    layoutSizeIsValid && !layoutSizeMatchesExistingUIKitBounds;

  if (
    needsAutoLayout &&
    !shouldUseFabricSize &&
    !shouldUseLayoutSize &&
    contentSize.width <= 0 &&
    contentSize.height <= 0
  ) {
    return false;
  }

  const shouldUseContentWidth =
    shouldUseCompactContentSize ||
    (!shouldUseFabricSize &&
      ((needsAutoLayout && !shouldUseLayoutSize) || !needsAutoLayout) &&
      contentSize.width > 0 &&
      (layoutSize.width <= 0 || contentSize.width < layoutSize.width));
  const shouldUseContentHeight =
    shouldUseCompactContentSize ||
    (!shouldUseFabricSize &&
      ((needsAutoLayout && !shouldUseLayoutSize) || !needsAutoLayout) &&
      contentSize.height > 0 &&
      (layoutSize.height <= 0 || contentSize.height < layoutSize.height));
  const nextSize = {
    height: shouldUseFabricSize
      ? fabricSize.height
      : shouldUseContentHeight
      ? contentSize.height
      : layoutSize.height,
    width: shouldUseFabricSize
      ? fabricSize.width
      : shouldUseContentWidth
      ? contentSize.width
      : layoutSize.width,
  };

  if (
    !headerSubviewSizeIsValidForType(
      nextSize,
      subviewType,
    )
  ) {
    return false;
  }

  rootView[HEADER_SUBVIEW_LAYOUT_SIZE_KEY] = layoutSizeIsValid
    ? layoutSize
    : nextSize;
  const previousSize = rootView.__rnsNativeScriptHeaderSubviewIntrinsicSize;
  const resolvedNextSize = headerSubviewShouldPreserveCompactIntrinsicSize(
    subviewType,
    previousSize,
    nextSize,
    layoutSize,
    fabricSize,
  )
    ? previousSize
    : nextSize;

  if (
    previousSize?.width === resolvedNextSize.width &&
    previousSize?.height === resolvedNextSize.height
  ) {
    applyNativeScriptHeaderSubviewLayoutSize(
      view,
      resolvedNextSize,
      layoutSize,
    );
    return false;
  }

  rootView.__rnsNativeScriptHeaderSubviewIntrinsicSize = resolvedNextSize;
  applyNativeScriptHeaderSubviewLayoutSize(view, resolvedNextSize, layoutSize);
  invalidateNativeScriptHeaderSubviewUIKitLayout(rootView);
  return true;
}

function updateNativeScriptHeaderSubviewIntrinsicSize(
  view: NativeScriptHeaderSubviewHostView,
): boolean {
  'worklet';
  const rootView = view.rootView;

  if (!rootView) {
    return false;
  }

  const fabricSize = headerSubviewFabricLayoutSize(rootView);
  const contentSize = currentHeaderSubviewContentSize(view);
  const subviewType = rootView.__rnsNativeScriptHeaderSubviewType;
  const prefersIntrinsicContentSize =
    headerSubviewTypePrefersIntrinsicContentSize(subviewType);
  const fabricSizeIsValid = headerSubviewSizeIsValidForType(
    fabricSize,
    subviewType,
  );

  if (
    prefersIntrinsicContentSize &&
    !fabricSizeIsValid &&
    contentSize.height <= 0
  ) {
    return false;
  }

  const shouldUseCompactContentSize =
    headerSubviewShouldUseCompactContentSize(
      subviewType,
      fabricSize,
      contentSize,
    );
  const shouldUseFabricSize =
    fabricSizeIsValid && !shouldUseCompactContentSize;
  const nextSize = shouldUseFabricSize ? fabricSize : contentSize;

  if (
    !headerSubviewSizeIsValidForType(
      nextSize,
      subviewType,
    )
  ) {
    return false;
  }

  const previousSize = rootView.__rnsNativeScriptHeaderSubviewIntrinsicSize;
  const resolvedNextSize = headerSubviewShouldPreserveCompactIntrinsicSize(
    subviewType,
    previousSize,
    nextSize,
    fabricSize,
    fabricSize,
  )
    ? previousSize
    : nextSize;

  if (
    previousSize?.width === resolvedNextSize.width &&
    previousSize?.height === resolvedNextSize.height
  ) {
    applyNativeScriptHeaderSubviewLayoutSize(view, resolvedNextSize);
    return false;
  }

  rootView.__rnsNativeScriptHeaderSubviewIntrinsicSize = resolvedNextSize;
  applyNativeScriptHeaderSubviewLayoutSize(view, resolvedNextSize);
  invalidateNativeScriptHeaderSubviewUIKitLayout(rootView);
  return true;
}

function layoutNativeScriptHeaderSubviewHost(
  view: NativeScriptHeaderSubviewHostView,
): boolean {
  'worklet';
  const rootView = view.rootView;
  const childrenView = view.childrenView;

  if (!rootView || !childrenView) {
    return false;
  }

  rootView.userInteractionEnabled = true;
  rootView.clipsToBounds = false;
  childrenView.userInteractionEnabled = true;
  childrenView.clipsToBounds = false;
  applyNativeScriptHeaderSubviewLayoutSize(
    view,
    currentHeaderSubviewIntrinsicSize(rootView),
  );
  return updateNativeScriptHeaderSubviewIntrinsicSize(view);
}

function refreshNativeScriptHeaderSubviewHostDirectOwner(rootView: any) {
  'worklet';

  if (!rootView) {
    return false;
  }

  const refreshDirectOwner = (NativeScriptRuntime as any)
    .refreshUIKitHostViewDirectOwner;
  if (typeof refreshDirectOwner === 'function') {
    return refreshDirectOwner(rootView) === true;
  }

  NativeScriptRuntime.refreshUIKitHostView(rootView);
  return true;
}

function refreshNativeScriptHeaderSubviewHostIfContentInvalid(
  view: NativeScriptHeaderSubviewHostView,
) {
  'worklet';
  const rootView = view.rootView;

  if (!rootView) {
    return false;
  }

  const contentSize = currentHeaderSubviewContentSize(view);

  if (
    headerSubviewSizeIsValidForType(
      contentSize,
      rootView.__rnsNativeScriptHeaderSubviewType,
    )
  ) {
    return false;
  }

  return refreshNativeScriptHeaderSubviewHostDirectOwner(rootView);
}

function headerSubviewRegistration(
  props: Readonly<NativeScriptHeaderSubviewHostProps>,
): NativeScriptHeaderSubviewRegistration {
  'worklet';

  const registration: NativeScriptHeaderSubviewRegistration = {
    order: props.nativeScriptHeaderSubviewOrder ?? 0,
    screenId: props.screenId,
    subviewId: props.subviewId,
    type: (props.type ?? 'left') as NativeScriptHeaderSubviewType,
  };

  if (props.hidesSharedBackground !== undefined) {
    registration.hidesSharedBackground = props.hidesSharedBackground;
  }

  if (props.nativeScriptBackImageSource !== undefined) {
    registration.backImageSource = props.nativeScriptBackImageSource;
    registration.backImageIsTemplate =
      props.nativeScriptBackImageIsTemplate === true;
  }

  return registration;
}

function syncNativeScriptHeaderSubview(
  view: NativeScriptHeaderSubviewHostView,
  props: Readonly<NativeScriptHeaderSubviewHostProps>,
) {
  'worklet';
  if (view.rootView) {
    view.rootView.__rnsNativeScriptHeaderSubviewType = (props.type ??
      'left') as NativeScriptHeaderSubviewType;
  }

  refreshNativeScriptHeaderSubviewHostIfContentInvalid(view);

  const didLayoutChange = layoutNativeScriptHeaderSubviewHost(view);
  const didChange = registerNativeScriptHeaderSubview(
    headerSubviewRegistration(props),
    view.rootView,
  );

  if (didLayoutChange) {
    refreshNativeScriptHeaderSubviewHostDirectOwner(view.rootView);
  }

  if (didChange || didLayoutChange) {
    notifyNativeScriptHeaderSubviewChanged(props.screenId);
  }
}

export const __nativeScriptUpdateHeaderSubviewIntrinsicSizeForTests =
  updateNativeScriptHeaderSubviewIntrinsicSize;
export const __nativeScriptUpdateHeaderSubviewIntrinsicSizeFromLayoutForTests =
  updateNativeScriptHeaderSubviewIntrinsicSizeFromLayout;

function refreshCollectedNativeScriptHeaderSubviewHosts(rootView: any) {
  'worklet';
  const collectedUIKitHostChildren = (NativeScriptRuntime as any)
    .collectedUIKitHostChildren;
  const refreshDirectOwner = (NativeScriptRuntime as any)
    .refreshUIKitHostViewDirectOwner;
  const refreshHost = (NativeScriptRuntime as any).refreshUIKitHostView;

  if (!rootView || typeof collectedUIKitHostChildren !== 'function') {
    return false;
  }

  const collectedChildren = collectedUIKitHostChildren(rootView);
  let didRefresh = false;

  for (let index = 0; index < collectedChildren.length && index < 16; index++) {
    const child = collectedChildren[index];

    if (!child) {
      continue;
    }

    if (typeof refreshDirectOwner === 'function') {
      refreshDirectOwner(child);
      didRefresh = true;
    } else if (typeof refreshHost === 'function') {
      refreshHost(child);
      didRefresh = true;
    }
  }

  return didRefresh;
}

function layoutNativeScriptHeaderConfigHost(
  view: NativeScriptHeaderConfigHostView,
  props: Readonly<NativeScriptHeaderConfigHostProps>,
) {
  'worklet';
  const rootView = view.rootView;
  const childrenView = view.childrenView;

  if (!rootView || !childrenView) {
    return false;
  }

  rootView.userInteractionEnabled = false;
  rootView.hidden = true;
  rootView.clipsToBounds = false;
  childrenView.userInteractionEnabled = true;
  childrenView.clipsToBounds = false;

  if (childrenView !== rootView) {
    childrenView.frame = rootView.bounds;
    childrenView.autoresizingMask = flexibleSizeMask();
  }

  refreshCollectedNativeScriptHeaderSubviewHosts(rootView);
  return setNativeScriptHeaderSubviewExpectedCount(
    props.screenId,
    props.nativeScriptHeaderSubviewCount,
  );
}

const NativeScriptHeaderConfigHost = NativeScriptRuntime.defineUIKitContainer<
  NativeScriptHeaderConfigHostProps,
  any,
  any
>({
  debugName: 'RNSScreenStackHeaderConfig.NativeScript',
  layout: { sizing: 'fill' },
  create() {
    'worklet';
    const UIView = nativeValue('UIView');
    const UIColor = nativeValue('UIColor');

    if (!UIView || typeof UIView.alloc !== 'function') {
      throw new Error('UIView is not available in the UI runtime');
    }

    const rootView = UIView.alloc().init();
    const childrenView = rootView;

    rootView.backgroundColor = UIColor?.clearColor ?? null;
    rootView.userInteractionEnabled = false;
    rootView.hidden = true;
    rootView.clipsToBounds = false;

    return { childrenView, rootView };
  },
  mounted(view, props) {
    'worklet';
    layoutNativeScriptHeaderConfigHost(view, props);
  },
  update(view, props) {
    'worklet';
    layoutNativeScriptHeaderConfigHost(view, props);
  },
  refresh(view, props) {
    'worklet';
    layoutNativeScriptHeaderConfigHost(view, props);
  },
  transactionCommitted(view, props) {
    'worklet';
    layoutNativeScriptHeaderConfigHost(view, props);
  },
});

const NativeScriptHeaderSubviewHost = NativeScriptRuntime.defineUIKitContainer<
  NativeScriptHeaderSubviewHostProps,
  any,
  any
>({
  debugName: 'RNSScreenStackHeaderSubview.NativeScript',
  layout: { sizing: 'fill' },
  create() {
    'worklet';
    // NATIVESCRIPT_PORT_DEVIATION: upstream RNSScreenStackHeaderConfig owns
    // RNSScreenStackHeaderSubview native component views in `_reactSubviews`.
    // The TS port has no native component-view owner, so each header subview is
    // a NativeScript UIKit host registered by screen id and consumed by the
    // stack's UINavigationItem configuration pass.
    const HeaderSubviewRootViewClass = nativeScriptHeaderSubviewRootViewClass();
    const UIView = nativeValue('UIView');
    const UIColor = nativeValue('UIColor');

    if (
      !HeaderSubviewRootViewClass ||
      typeof HeaderSubviewRootViewClass.alloc !== 'function' ||
      !UIView ||
      typeof UIView.alloc !== 'function'
    ) {
      throw new Error('UIView is not available in the UI runtime');
    }

    const rootView = HeaderSubviewRootViewClass.alloc().init();
    const childrenView = UIView.alloc().init();

    rootView.backgroundColor = UIColor?.clearColor ?? null;
    rootView.userInteractionEnabled = true;
    rootView.clipsToBounds = false;
    childrenView.backgroundColor = UIColor?.clearColor ?? null;
    childrenView.userInteractionEnabled = true;
    childrenView.clipsToBounds = false;
    childrenView.translatesAutoresizingMaskIntoConstraints = false;
    rootView.__rnsNativeScriptHeaderSubviewChildrenView = childrenView;
    rootView.addSubview(childrenView);
    const fillConstraints = [
      childrenView.leadingAnchor &&
        rootView.leadingAnchor &&
        typeof childrenView.leadingAnchor.constraintEqualToAnchor === 'function'
        ? childrenView.leadingAnchor.constraintEqualToAnchor(
            rootView.leadingAnchor,
          )
        : null,
      childrenView.trailingAnchor &&
        rootView.trailingAnchor &&
        typeof childrenView.trailingAnchor.constraintEqualToAnchor ===
          'function'
        ? childrenView.trailingAnchor.constraintEqualToAnchor(
            rootView.trailingAnchor,
          )
        : null,
      childrenView.topAnchor &&
        rootView.topAnchor &&
        typeof childrenView.topAnchor.constraintEqualToAnchor === 'function'
        ? childrenView.topAnchor.constraintEqualToAnchor(rootView.topAnchor)
        : null,
      childrenView.bottomAnchor &&
        rootView.bottomAnchor &&
        typeof childrenView.bottomAnchor.constraintEqualToAnchor === 'function'
        ? childrenView.bottomAnchor.constraintEqualToAnchor(
            rootView.bottomAnchor,
          )
        : null,
    ];
    rootView.__rnsNativeScriptHeaderSubviewFillConstraints = fillConstraints;
    fillConstraints.forEach(activateNativeConstraint);

    return { childrenView, rootView };
  },
  update(view, props) {
    'worklet';
    syncNativeScriptHeaderSubview(view, props);
  },
  refresh(view, props) {
    'worklet';
    syncNativeScriptHeaderSubview(view, props);
  },
  mounted(view, props) {
    'worklet';
    syncNativeScriptHeaderSubview(view, props);
  },
  transactionCommitted(view, props) {
    'worklet';
    syncNativeScriptHeaderSubview(view, props);
  },
  dispose(_view, props) {
    'worklet';
    unregisterNativeScriptHeaderSubview(props.screenId, props.subviewId);
    notifyNativeScriptHeaderSubviewChanged(props.screenId);
  },
});

function withNativeScriptHeaderSubviewOrder(
  children: React.ReactNode,
  nextOrder: { current: number },
): React.ReactNode {
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) {
      return child;
    }

    if (child.type === React.Fragment) {
      return withNativeScriptHeaderSubviewOrder(
        (child.props as { children?: React.ReactNode }).children,
        nextOrder,
      );
    }

    const order = nextOrder.current;
    nextOrder.current += 1;

    return React.cloneElement(
      child as React.ReactElement<NativeScriptHeaderSubviewOrderProp>,
      {
        nativeScriptHeaderSubviewOrder: order,
      },
    );
  });
}

export function countNativeScriptHeaderSubviewChildren(
  children: React.ReactNode,
): number {
  let count = 0;

  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (child.type === React.Fragment) {
      count += countNativeScriptHeaderSubviewChildren(
        (child.props as { children?: React.ReactNode }).children,
      );
      return;
    }

    count += 1;
  });

  return count;
}

export const ScreenStackHeaderSubview: React.ComponentType<NativeScriptHeaderSubviewProps> =
  Platform.OS === 'ios'
    ? React.forwardRef<View, NativeScriptHeaderSubviewProps>(
        function NativeScriptScreenStackHeaderSubview(
          {
            nativeScriptHeaderSubviewOrder,
            synchronousShadowStateUpdatesEnabled:
              _synchronousShadowStateUpdatesEnabled,
            onLayout,
            type,
            ...props
          },
          ref,
        ) {
          const headerSubviewContext = React.useContext(
            NativeScriptScreenHeaderSubviewContext,
          );
          const subviewId = React.useId();
          const screenId = headerSubviewContext?.screenId;
          const resolvedType: NativeHeaderSubviewTypes = type ?? 'left';
          const nativeHostRef =
            React.useRef<UIKitViewRef<NativeScriptHeaderSubviewHostView> | null>(
              null,
            );
          const setNativeScriptHeaderSubviewRef = React.useCallback(
            (value: UIKitViewRef<NativeScriptHeaderSubviewHostView> | null) => {
              nativeHostRef.current = value;

              if (typeof ref === 'function') {
                ref(value as any);
              } else if (ref) {
                (ref as React.MutableRefObject<any>).current = value;
              }
            },
            [ref],
          );
          const notifyReady = React.useCallback(() => {
            if (!screenId) {
              return;
            }

            const hostRef = nativeHostRef.current;
            if (!hostRef) {
              NativeScriptRuntime.runOnUI((targetScreenId: string) => {
                'worklet';
                notifyNativeScriptHeaderSubviewChanged(targetScreenId);
              }, screenId).catch(() => undefined);
              return;
            }

            hostRef
              .runOnUI((hostView: NativeScriptHeaderSubviewHostView) => {
                'worklet';
                const didRefreshInvalidContent =
                  refreshNativeScriptHeaderSubviewHostIfContentInvalid(hostView);
                const didLayoutChange =
                  layoutNativeScriptHeaderSubviewHost(hostView);
                if (didLayoutChange) {
                  refreshNativeScriptHeaderSubviewHostDirectOwner(
                    hostView.rootView,
                  );
                }
                if (didRefreshInvalidContent || didLayoutChange) {
                  notifyNativeScriptHeaderSubviewChanged(screenId);
                }
                return didLayoutChange;
              })
              .then(didLayoutChange => {
                if (didLayoutChange) {
                  nativeHostRef.current?.invalidateNativeLayout?.();
                }
              })
              .catch(() => undefined);
          }, [screenId]);
          const handleNativeScriptHeaderSubviewLayout = React.useCallback(
            (event: LayoutChangeEvent) => {
              onLayout?.(event);

              if (!screenId) {
                return;
              }

              const { height, width } = event.nativeEvent.layout;
              nativeHostRef.current
                ?.runOnUI((hostView: NativeScriptHeaderSubviewHostView) => {
                  'worklet';
                  const didChange =
                    updateNativeScriptHeaderSubviewIntrinsicSizeFromLayout(
                      hostView,
                      width,
                      height,
                    );

                  if (!didChange) {
                    return false;
                  }

                  const refreshDirectOwner = (NativeScriptRuntime as any)
                    .refreshUIKitHostViewDirectOwner;
                  if (typeof refreshDirectOwner === 'function') {
                    refreshDirectOwner(hostView.rootView);
                  } else {
                    NativeScriptRuntime.refreshUIKitHostView(hostView.rootView);
                  }
                  notifyNativeScriptHeaderSubviewChanged(screenId);

                  return true;
                })
                .then(didChange => {
                  if (didChange) {
                    nativeHostRef.current?.invalidateNativeLayout?.();
                  }
                })
                .catch(() => undefined);
            },
            [onLayout, screenId],
          );

          if (!screenId) {
            return (
              <View
                ref={ref}
                collapsable={false}
                onLayout={onLayout}
                {...props}
              />
            );
          }

          return (
            <NativeScriptHeaderSubviewHost
              {...props}
              ref={setNativeScriptHeaderSubviewRef as any}
              attachController={false}
              attachNativeView={false}
              immediateTransactionCommit
              nativeScriptHeaderSubviewOrder={nativeScriptHeaderSubviewOrder}
              onLayout={handleNativeScriptHeaderSubviewLayout}
              onHostReady={notifyReady}
              preserveDetachedChildrenLayout
              screenId={screenId}
              subviewId={subviewId}
              type={resolvedType}
            />
          );
        },
      )
    : ScreenStackHeaderSubviewNativeComponent;

export const ScreenStackHeaderConfig = React.forwardRef<
  View,
  ScreenStackHeaderConfigProps
>((props, ref) => {
  const { appliesTopInset, useLegacyBehavior } = useTopInsetApplication(
    !props.hidden,
    props.disableTopInsetApplication ?? false,
  );
  const nativeScriptHeaderContext = React.useContext(
    NativeScriptScreenHeaderSubviewContext,
  );
  const nativeScriptScreenId = nativeScriptHeaderContext?.screenId;

  const { headerLeftBarButtonItems, headerRightBarButtonItems } = props;

  const preparedHeaderLeftBarButtonItems =
    headerLeftBarButtonItems && isHeaderBarButtonsAvailableForCurrentPlatform
      ? prepareHeaderBarButtonItems(headerLeftBarButtonItems, 'left')
      : undefined;
  const preparedHeaderRightBarButtonItems =
    headerRightBarButtonItems && isHeaderBarButtonsAvailableForCurrentPlatform
      ? prepareHeaderBarButtonItems(headerRightBarButtonItems, 'right')
      : undefined;
  const hasHeaderBarButtonItems =
    isHeaderBarButtonsAvailableForCurrentPlatform &&
    (preparedHeaderLeftBarButtonItems?.length ||
      preparedHeaderRightBarButtonItems?.length);
  const headerButtonActionMap = React.useMemo(() => {
    if (!hasHeaderBarButtonItems) {
      return undefined;
    }

    const actions = new Map<string, () => void>();
    collectHeaderButtonActions(preparedHeaderLeftBarButtonItems, actions);
    collectHeaderButtonActions(preparedHeaderRightBarButtonItems, actions);
    return actions;
  }, [
    hasHeaderBarButtonItems,
    preparedHeaderLeftBarButtonItems,
    preparedHeaderRightBarButtonItems,
  ]);
  const headerMenuActionMap = React.useMemo(() => {
    if (!hasHeaderBarButtonItems) {
      return undefined;
    }

    const actions = new Map<string, () => void>();
    collectHeaderBarMenuActions(preparedHeaderLeftBarButtonItems, actions);
    collectHeaderBarMenuActions(preparedHeaderRightBarButtonItems, actions);
    return actions;
  }, [
    hasHeaderBarButtonItems,
    preparedHeaderLeftBarButtonItems,
    preparedHeaderRightBarButtonItems,
  ]);

  // Handle bar button item presses
  const onPressHeaderBarButtonItem = hasHeaderBarButtonItems
    ? (event: NativeSyntheticEvent<{ buttonId: string }>) => {
        headerButtonActionMap?.get(event.nativeEvent.buttonId)?.();
      }
    : undefined;

  // Handle bar button menu item presses by deep-searching nested menus
  const onPressHeaderBarButtonMenuItem = hasHeaderBarButtonItems
    ? (event: NativeSyntheticEvent<{ menuId: string }>) => {
        headerMenuActionMap?.get(event.nativeEvent.menuId)?.();
      }
    : undefined;

  if (Platform.OS === 'ios') {
    const nativeScriptChildren = withNativeScriptHeaderSubviewOrder(
      props.children,
      { current: 0 },
    );
    const nativeScriptHeaderSubviewCount =
      countNativeScriptHeaderSubviewChildren(nativeScriptChildren);

    return (
      <NativeScriptHeaderConfigHost
        ref={ref as any}
        style={[styles.headerConfig, styles.nativeScriptHeaderConfig]}
        attachController={false}
        attachNativeView
        collectChildren
        immediateTransactionCommit
        pointerEvents="box-none"
        preserveDetachedChildrenLayout
        nativeScriptHeaderSubviewCount={nativeScriptHeaderSubviewCount}
        screenId={nativeScriptScreenId}
        collapsable={false}>
        {nativeScriptChildren}
      </NativeScriptHeaderConfigHost>
    );
  }

  return (
    <ScreenStackHeaderConfigNativeComponent
      {...props}
      userInterfaceStyle={props.experimental_userInterfaceStyle}
      headerLeftBarButtonItems={preparedHeaderLeftBarButtonItems}
      headerRightBarButtonItems={preparedHeaderRightBarButtonItems}
      onPressHeaderBarButtonItem={onPressHeaderBarButtonItem}
      onPressHeaderBarButtonMenuItem={onPressHeaderBarButtonMenuItem}
      ref={ref}
      style={styles.headerConfig}
      pointerEvents="box-none"
      synchronousShadowStateUpdatesEnabled={
        featureFlags.experiment.synchronousHeaderConfigUpdatesEnabled
      }
      consumeTopInset={appliesTopInset}
      legacyTopInsetBehavior={useLegacyBehavior}
    />
  );
});

ScreenStackHeaderConfig.displayName = 'ScreenStackHeaderConfig';

export const ScreenStackHeaderBackButtonImage = (
  props: ImageProps & NativeScriptHeaderSubviewOrderProp,
): React.JSX.Element => {
  const { nativeScriptHeaderSubviewOrder, ...imageProps } = props;
  const backImageSource =
    Platform.OS === 'ios' && imageProps.source != null
      ? Image.resolveAssetSource(imageProps.source)
      : undefined;

  return (
    <ScreenStackHeaderSubview
      nativeScriptBackImageSource={backImageSource}
      nativeScriptHeaderSubviewOrder={nativeScriptHeaderSubviewOrder}
      type="back"
      style={styles.headerSubview}
      synchronousShadowStateUpdatesEnabled={
        featureFlags.experiment.synchronousHeaderSubviewUpdatesEnabled
      }>
      <Image resizeMode="center" fadeDuration={0} {...imageProps} />
    </ScreenStackHeaderSubview>
  );
};

export const ScreenStackHeaderRightView = (
  props: ScreenStackHeaderSubviewProps &
    ViewProps &
    NativeScriptHeaderSubviewOrderProp,
): React.JSX.Element => {
  const { style, ...rest } = props;

  return (
    <ScreenStackHeaderSubview
      {...rest}
      type="right"
      synchronousShadowStateUpdatesEnabled={
        featureFlags.experiment.synchronousHeaderSubviewUpdatesEnabled
      }
      style={[styles.headerSubview, style]}
    />
  );
};

export const ScreenStackHeaderLeftView = (
  props: ScreenStackHeaderSubviewProps &
    ViewProps &
    NativeScriptHeaderSubviewOrderProp,
): React.JSX.Element => {
  const { style, ...rest } = props;

  return (
    <ScreenStackHeaderSubview
      {...rest}
      type="left"
      synchronousShadowStateUpdatesEnabled={
        featureFlags.experiment.synchronousHeaderSubviewUpdatesEnabled
      }
      style={[styles.headerSubview, style]}
    />
  );
};

export const ScreenStackHeaderCenterView = (
  props: ViewProps & NativeScriptHeaderSubviewOrderProp,
): React.JSX.Element => {
  const { style, ...rest } = props;

  return (
    <ScreenStackHeaderSubview
      {...rest}
      type="center"
      synchronousShadowStateUpdatesEnabled={
        featureFlags.experiment.synchronousHeaderSubviewUpdatesEnabled
      }
      style={[styles.headerSubviewCenter, style]}
    />
  );
};

export const ScreenStackHeaderSearchBarView = (
  props: ViewProps & NativeScriptHeaderSubviewOrderProp,
): React.JSX.Element => {
  const { nativeScriptHeaderSubviewOrder, style, ...rest } = props;

  if (Platform.OS === 'ios') {
    return (
      <NativeScriptScreenHeaderSearchBarContext.Provider
        value={{ order: nativeScriptHeaderSubviewOrder ?? 0 }}>
        <View
          {...rest}
          collapsable={false}
          pointerEvents="box-none"
          style={[styles.headerSubview, style]}
        />
      </NativeScriptScreenHeaderSearchBarContext.Provider>
    );
  }

  return (
    <ScreenStackHeaderSubview
      {...rest}
      nativeScriptHeaderSubviewOrder={nativeScriptHeaderSubviewOrder}
      type="searchBar"
      synchronousShadowStateUpdatesEnabled={
        featureFlags.experiment.synchronousHeaderSubviewUpdatesEnabled
      }
      style={[styles.headerSubview, style]}
    />
  );
};

const styles = StyleSheet.create({
  headerSubview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubviewCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
  },
  headerConfig: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // We only want to center align the subviews on iOS.
    // See https://github.com/software-mansion/react-native-screens/pull/2456
    alignItems: Platform.OS === 'ios' ? 'center' : undefined,
  },
  nativeScriptHeaderConfig: {
    height: NATIVE_SCRIPT_HEADER_CONFIG_HEIGHT,
    top: -NATIVE_SCRIPT_HEADER_CONFIG_HEIGHT,
  },
});
