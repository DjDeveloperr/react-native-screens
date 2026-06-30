/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/prefer-for-of */
import React from 'react';
import {
  StyleSheet,
  type NativeSyntheticEvent,
  type ViewProps,
} from 'react-native';
import NativeScriptRuntime from '@nativescript/react-native';
import type {
  TabsHostProps,
  TabSelectedEvent,
  TabSelectionPreventedEvent,
  TabSelectionRejectedEvent,
} from '../host/TabsHost.types';
import type { MoreTabSelectedEvent } from '../host/TabsHost.ios.types';
import type { TabsScreenProps } from '../screen/TabsScreen.types';
import type { TabsBottomAccessoryProps } from '../bottom-accessory/TabsBottomAccessory.types';
import type { TabsBottomAccessoryContentProps } from '../bottom-accessory/TabsBottomAccessoryContent.types';
import { isIOS26OrHigher } from '../../helpers/PlatformUtils';

type TabsRuntimeContextValue = {
  hostId: string;
  selectedScreenKey: string;
  baseProvenance: number;
};

type TabsBottomAccessoryRuntimeContextValue = {
  accessoryId: string;
};

type TabsActionOrigin =
  | 'user'
  | 'programmatic-js'
  | 'programmatic-native'
  | 'implicit';

type TabsScreenNativeScriptProps = Omit<TabsScreenProps, 'style'> & {
  __nativeScriptTabsIndex?: number;
  style?: ViewProps['style'];
};

type TabsBottomAccessoryNativeScriptProps = TabsBottomAccessoryProps & {
  accessoryId: string;
  hostId: string;
  children?: React.ReactNode;
  style?: ViewProps['style'];
};

type TabsBottomAccessoryContentNativeScriptProps =
  TabsBottomAccessoryContentProps & {
    accessoryId: string;
    children?: React.ReactNode;
    style?: ViewProps['style'];
  };

const TabsRuntimeContext = React.createContext<TabsRuntimeContextValue | null>(
  null,
);
const TabsBottomAccessoryRuntimeContext =
  React.createContext<TabsBottomAccessoryRuntimeContextValue | null>(null);

const TABS_HOST_CONTROLLER_CLASS_KEY =
  '__RNSTabsHostNativeScriptControllerClass';
const TABS_SCREEN_VIEW_CLASS_KEY = '__RNSTabsScreenNativeScriptViewClass';
const TABS_SCREEN_CONTROLLER_CLASS_KEY =
  '__RNSTabsScreenNativeScriptControllerClass';
const TABS_BOTTOM_ACCESSORY_VIEW_CLASS_KEY =
  '__RNSTabsBottomAccessoryNativeScriptViewClass';
const TABS_BOTTOM_ACCESSORY_CONTENT_VIEW_CLASS_KEY =
  '__RNSTabsBottomAccessoryContentNativeScriptViewClass';
const RECONCILE_SELECTED_TAB_CONTROLLER_VIEW_KEY =
  '__rnsNativeScriptReconcileSelectedTabControllerView';
const PUBLISH_SELECTED_TAB_ACCESSIBILITY_KEY =
  '__rnsNativeScriptPublishSelectedTabAccessibility';
const RECONCILE_STACK_FROM_EXTERNAL_HOST_KEY =
  '__rnsNativeScriptReconcileStackFromExternalHost';
const REFRESH_VISIBLE_STACK_CONTENT_KEY =
  '__rnsNativeScriptRefreshVisibleStackContent';
const REFRESH_VISIBLE_STACK_TOUCH_SURFACES_KEY =
  '__rnsNativeScriptRefreshVisibleStackTouchSurfaces';
const REFRESH_VISIBLE_STACK_TOUCH_SURFACES_FOR_HOST_KEY =
  '__rnsNativeScriptRefreshVisibleStackTouchSurfacesForHostView';
const STACK_HAS_STABLE_READY_CONTENT_KEY =
  '__rnsNativeScriptStackHasStableReadyContent';
const STACK_NAVIGATION_CONTROLLER_RECORD_FOR_HOST_KEY =
  '__rnsNativeScriptStackNavigationControllerRecordForHostView';
const REPAIR_DESCENDANT_STACK_CONTAINMENT_FOR_HOST_KEY =
  '__rnsNativeScriptRepairDescendantStackContainmentForHostView';
const ASSOCIATED_HANDLE_SUFFIX = '.NativeScriptHandle';
const ASSOCIATED_VALUE_SUFFIX = '.NativeScriptValue';
const ROOT_CONTAINED_PARENT_ASSOCIATION_KEY =
  'react-native-screens.NativeScriptRootContainedParentViewController';
const OWNING_VIEW_CONTROLLER_ASSOCIATION_KEY =
  'react-native-screens.NativeScriptOwningViewController';
const TABS_CONTROLLER_ASSOCIATION_KEY =
  'react-native-screens.NativeScriptTabsController';
const TABS_SELECTED_CONTROLLER_ASSOCIATION_KEY =
  'react-native-screens.NativeScriptTabsSelectedController';
const TABS_VIEW_ASSOCIATION_KEY = 'react-native-screens.NativeScriptTabsView';
const TABS_HOST_ID_ASSOCIATION_KEY =
  'react-native-screens.NativeScriptTabsHostId';
const TABS_LAST_SELECTED_RECONCILE_KEY_ASSOCIATION_KEY =
  'react-native-screens.NativeScriptTabsLastSelectedReconcileKey';
const TABS_LAST_SELECTED_FAST_RECONCILE_KEY_ASSOCIATION_KEY =
  'react-native-screens.NativeScriptTabsLastSelectedFastReconcileKey';
const TABS_LAST_SELECTED_PREPARED_FAST_RECONCILE_KEY_ASSOCIATION_KEY =
  'react-native-screens.NativeScriptTabsLastSelectedPreparedFastReconcileKey';
const TABS_EMBEDDED_NAVIGATION_LOOKUP_DIRTY_ASSOCIATION_KEY =
  'react-native-screens.NativeScriptTabsEmbeddedNavigationLookupDirty';
const TABS_EMBEDDED_NAVIGATION_NEGATIVE_LOOKUP_KEY_ASSOCIATION_KEY =
  'react-native-screens.NativeScriptTabsEmbeddedNavigationNegativeLookupKey';
const TABS_SUPPRESS_SELECTION_OBSERVATION_FLAG =
  '__rnsNativeScriptSuppressSelectionObservation';
const TABS_HANDLING_EXPLICIT_SELECTION_FLAG =
  '__rnsNativeScriptIsHandlingExplicitSelectionUpdate';
const TABS_ASSOCIATED_TRUE = '1';
const STACK_NAVIGATION_CONTROLLER_ASSOCIATION_KEY =
  'react-native-screens.NativeScriptStackNavigationController';
const STACK_CONTAINER_VIEW_ASSOCIATION_KEY =
  'react-native-screens.NativeScriptStackContainerView';
const STACK_EMBEDDED_NAVIGATION_VIEW_ASSOCIATION_KEY =
  'react-native-screens.NativeScriptStackEmbeddedNavigationView';
const TRACE_TABS_WORKLETS = false;

type EmbeddedNavigationControllerRecord = {
  containerView: any;
  navigationController: any;
  navigationView: any;
};

type SelectedTabContentCounts = {
  interactive: number;
  visible: number;
};

function shouldTraceTabsWorklets() {
  'worklet';

  return (
    TRACE_TABS_WORKLETS ||
    (globalThis as Record<string, any>).__NSRNS_TRACE_TABS_WORKLETS === true
  );
}

function tabsTraceTimestamp() {
  'worklet';

  if (!shouldTraceTabsWorklets()) {
    return 0;
  }

  const performanceObject = (globalThis as Record<string, any>).performance;

  if (typeof performanceObject?.now === 'function') {
    return performanceObject.now();
  }

  if (typeof Date?.now === 'function') {
    return Date.now();
  }

  return 0;
}

function traceTabsEvent(label: string, details = '') {
  'worklet';

  if (!shouldTraceTabsWorklets()) {
    return;
  }

  const message = `[NSTABS_TRACE ${Math.round(tabsTraceTimestamp())}] ${label}${
    details ? ` ${details}` : ''
  }`;
  const globalObject = globalThis as Record<string, any>;
  if (typeof globalObject.TNSLog === 'function') {
    globalObject.TNSLog(message);
  } else if (typeof globalObject.NSLog === 'function') {
    try {
      globalObject.NSLog(message);
    } catch (_error) {
      console.warn(message);
    }
  } else {
    console.warn(message);
  }
}

function traceTabsSlow(label: string, startedAt: number, details = '') {
  'worklet';

  if (!shouldTraceTabsWorklets()) {
    return;
  }

  const duration = tabsTraceTimestamp() - startedAt;

  if (duration < 16) {
    return;
  }

  traceTabsEvent(
    label,
    `${Math.round(duration)}ms${details ? ` ${details}` : ''}`,
  );
}

function callTabsWorkletFunction(
  callback: any,
  first?: any,
  second?: any,
  third?: any,
  fourth?: any,
) {
  'worklet';

  if (typeof callback !== 'function') {
    return undefined;
  }

  if (typeof callback.call === 'function') {
    return callback.call(callback, first, second, third, fourth);
  }

  return callback(first, second, third, fourth);
}

function nativeValue(name: string): any {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const api = globalObject.__nativeScriptNativeApi;
  return api?.[name] ?? globalObject[name];
}

function nativeClassValue(name: string): any {
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

function invokeNativeSelector(
  target: any,
  methodName: string,
  selectorName: string,
  ...args: any[]
) {
  'worklet';

  if (!target) {
    return undefined;
  }

  const method = target[methodName];
  if (typeof method === 'function') {
    return method.apply(target, args);
  }

  const invoke = target.invoke;
  if (typeof invoke === 'function') {
    try {
      return invoke.apply(target, [selectorName, ...args]);
    } catch (error) {
      const message = String((error as Error)?.message ?? error ?? '');
      if (
        message.indexOf('selector is not available') === -1 &&
        message.indexOf('selector is not supported') === -1 &&
        message.indexOf('does not respond to selector') === -1
      ) {
        throw error;
      }
    }
  }

  const invokeObjCSelector = (NativeScriptRuntime as Record<string, any>)
    .invokeObjCSelector;
  if (typeof invokeObjCSelector === 'function') {
    return invokeObjCSelector(target, selectorName, args);
  }

  return undefined;
}

function canInvokeNativeSelector(
  target: any,
  methodName: string,
  selectorName: string,
) {
  'worklet';

  if (!target || !selectorName) {
    return false;
  }

  return (
    typeof target[methodName] === 'function' ||
    typeof target.invoke === 'function' ||
    typeof (NativeScriptRuntime as Record<string, any>).invokeObjCSelector ===
      'function'
  );
}

function initAllocatedUIKitObject(allocated: any) {
  'worklet';

  if (!allocated) {
    return null;
  }

  if (typeof allocated.init !== 'function') {
    return allocated;
  }

  // ObjC UIKit constructors return `self`. Some NativeScript interop paths can
  // expose a nullish JS return while still leaving the allocated object valid,
  // so keep the same UIKit ownership assumption instead of dropping the view.
  return invokeNativeSelector(allocated, 'init', 'init') ?? allocated;
}

function createNativeClassInstance(nativeClass: any) {
  'worklet';

  if (!nativeClass) {
    return null;
  }

  if (typeof nativeClass.new === 'function') {
    return nativeClass.new();
  }

  if (typeof nativeClass.alloc !== 'function') {
    return null;
  }

  return initAllocatedUIKitObject(nativeClass.alloc());
}

function makePlainUIView() {
  'worklet';
  const UIView = nativeClassValue('UIView');

  return createNativeClassInstance(UIView);
}

function postSafeAreaDidChangeNotification(view: any) {
  'worklet';
  const NSNotificationCenter = nativeValue('NSNotificationCenter');
  const defaultCenter = NSNotificationCenter?.defaultCenter;
  const center =
    typeof defaultCenter === 'function' ? defaultCenter() : defaultCenter;

  if (typeof center?.postNotificationNameObjectUserInfo === 'function') {
    center.postNotificationNameObjectUserInfo(
      'RNSSafeAreaDidChange',
      view,
      null,
    );
  } else if (typeof center?.postNotificationNameObject === 'function') {
    center.postNotificationNameObject('RNSSafeAreaDidChange', view);
  }
}

function currentIOSMajorVersion(): number {
  'worklet';
  const UIDevice = nativeValue('UIDevice');
  const version = String(UIDevice?.currentDevice?.systemVersion ?? '0');
  const major = Number.parseInt(version.split('.')[0] ?? '0', 10);

  return Number.isFinite(major) ? major : 0;
}

function nativeColor(value: unknown, fallback: string): any {
  'worklet';
  const UIColor = nativeValue('UIColor');
  if (!UIColor) {
    return null;
  }
  if (typeof value === 'string' && value[0] === '#' && value.length === 7) {
    const red = parseInt(value.slice(1, 3), 16) / 255;
    const green = parseInt(value.slice(3, 5), 16) / 255;
    const blue = parseInt(value.slice(5, 7), 16) / 255;
    if (
      Number.isFinite(red) &&
      Number.isFinite(green) &&
      Number.isFinite(blue) &&
      typeof UIColor.colorWithRedGreenBlueAlpha === 'function'
    ) {
      return UIColor.colorWithRedGreenBlueAlpha(red, green, blue, 1);
    }
  }
  if (value && typeof value === 'object') {
    return value;
  }
  return UIColor[fallback] ?? null;
}

function tabBarSystemItemValue(systemItem: string | undefined): number | null {
  'worklet';
  const values: Record<string, number> = {
    more: 0,
    favorites: 1,
    featured: 2,
    topRated: 3,
    recents: 4,
    contacts: 5,
    history: 6,
    bookmarks: 7,
    search: 8,
    downloads: 9,
    mostRecent: 10,
    mostViewed: 11,
  };
  return systemItem ? values[systemItem] ?? null : null;
}

function tabBarControllerModeValue(mode: string | undefined): number | null {
  'worklet';
  const values = nativeValue('UITabBarControllerMode');
  if (mode === 'tabBar') {
    return (
      values?.TabBar ??
      values?.tabBar ??
      nativeValue('UITabBarControllerModeTabBar') ??
      1
    );
  }
  if (mode === 'tabSidebar') {
    return (
      values?.TabSidebar ??
      values?.tabSidebar ??
      nativeValue('UITabBarControllerModeTabSidebar') ??
      2
    );
  }
  if (mode === 'automatic') {
    return (
      values?.Automatic ??
      values?.automatic ??
      nativeValue('UITabBarControllerModeAutomatic') ??
      0
    );
  }
  return null;
}

function tabBarMinimizeBehaviorValue(
  behavior: string | undefined,
): number | null {
  'worklet';
  const values = nativeValue('UITabBarMinimizeBehavior');
  if (behavior === 'never') {
    return (
      values?.Never ??
      values?.never ??
      nativeValue('UITabBarMinimizeBehaviorNever') ??
      1
    );
  }
  if (behavior === 'onScrollDown') {
    return (
      values?.OnScrollDown ??
      values?.onScrollDown ??
      nativeValue('UITabBarMinimizeBehaviorOnScrollDown') ??
      2
    );
  }
  if (behavior === 'onScrollUp') {
    return (
      values?.OnScrollUp ??
      values?.onScrollUp ??
      nativeValue('UITabBarMinimizeBehaviorOnScrollUp') ??
      3
    );
  }
  if (behavior === 'automatic') {
    return (
      values?.Automatic ??
      values?.automatic ??
      nativeValue('UITabBarMinimizeBehaviorAutomatic') ??
      0
    );
  }
  return null;
}

function tabBarLayoutDirectionValue(direction: string | undefined): number {
  'worklet';
  const values = nativeValue('UITraitEnvironmentLayoutDirection');
  if (direction === 'ltr') {
    return (
      values?.LeftToRight ??
      values?.leftToRight ??
      nativeValue('UITraitEnvironmentLayoutDirectionLeftToRight') ??
      1
    );
  }
  if (direction === 'rtl') {
    return (
      values?.RightToLeft ??
      values?.rightToLeft ??
      nativeValue('UITraitEnvironmentLayoutDirectionRightToLeft') ??
      2
    );
  }
  return (
    values?.Unspecified ??
    values?.unspecified ??
    nativeValue('UITraitEnvironmentLayoutDirectionUnspecified') ??
    0
  );
}

function imageWithRenderingMode(
  image: any,
  modeName: string,
  fallback: number,
) {
  'worklet';

  if (!image || typeof image.imageWithRenderingMode !== 'function') {
    return image;
  }

  const UIImageRenderingMode = nativeValue('UIImageRenderingMode');
  const mode =
    UIImageRenderingMode?.[modeName] ??
    UIImageRenderingMode?.[
      `${modeName.charAt(0).toLowerCase()}${modeName.slice(1)}`
    ] ??
    fallback;

  return image.imageWithRenderingMode(mode);
}

function arrayItem(array: any, index: number): any {
  'worklet';
  if (!array) {
    return null;
  }
  let count = 0;
  if (typeof array.count === 'number') {
    count = array.count;
  } else if (typeof array.length === 'number') {
    count = array.length ?? 0;
  }
  if (index < 0 || index >= count) {
    return null;
  }
  if (typeof array.objectAtIndex === 'function') {
    return array.objectAtIndex(index);
  }
  return array[index];
}

function arrayCount(array: any): number {
  'worklet';
  if (!array) {
    return 0;
  }
  return typeof array.count === 'number' ? array.count : array.length ?? 0;
}

function isNativeScrollView(view: any): boolean {
  'worklet';
  const UIScrollView = nativeValue('UIScrollView');
  if (!view || !UIScrollView || typeof view.isKindOfClass !== 'function') {
    return false;
  }
  try {
    return view.isKindOfClass(UIScrollView) === true;
  } catch {
    return false;
  }
}

function findScrollViewInFirstDescendantChainFrom(view: any) {
  'worklet';
  let currentView = view;

  while (currentView != null) {
    if (isNativeScrollView(currentView)) {
      return currentView;
    }

    const subviews = currentView.subviews;

    if (arrayCount(subviews) <= 0) {
      break;
    }

    currentView = arrayItem(subviews, 0);
  }

  return null;
}

function contentInsetAdjustmentBehaviorValue(name: string, fallback: number) {
  'worklet';
  const behavior = nativeValue('UIScrollViewContentInsetAdjustmentBehavior');

  return (
    behavior?.[name] ??
    behavior?.[`${name.charAt(0).toLowerCase()}${name.slice(1)}`] ??
    nativeValue(`UIScrollViewContentInsetAdjustment${name}`) ??
    fallback
  );
}

function overrideScrollViewBehaviorInFirstDescendantChainFrom(view: any) {
  'worklet';
  const scrollView = findScrollViewInFirstDescendantChainFrom(view);

  if (!scrollView) {
    return;
  }

  const never = contentInsetAdjustmentBehaviorValue('Never', 2);

  if (scrollView.contentInsetAdjustmentBehavior === never) {
    scrollView.contentInsetAdjustmentBehavior =
      contentInsetAdjustmentBehaviorValue('Automatic', 0);
  }
}

function tabsScreenShouldOverrideScrollViewContentInsetAdjustmentBehavior(
  view: any,
) {
  'worklet';

  return (
    view?.__rnsNativeScriptOverrideScrollViewContentInsetAdjustmentBehavior ===
    true
  );
}

function overrideTabsScreenScrollViewBehaviorInFirstDescendantChainIfNeeded(
  view: any,
) {
  'worklet';

  if (tabsScreenShouldOverrideScrollViewContentInsetAdjustmentBehavior(view)) {
    // Direct port of RNSTabsScreenComponentView's
    // RNSScrollViewBehaviorOverriding implementation: when the tab screen opts
    // in, restore UIKit's automatic inset adjustment on the first descendant
    // UIScrollView whose React Native default is still `never`.
    overrideScrollViewBehaviorInFirstDescendantChainFrom(view);
  }
}

function configureTabsScreenScrollViewBehaviorProvider(view: any, props: any) {
  'worklet';

  if (!view) {
    return;
  }

  view.__rnsNativeScriptOverrideScrollViewContentInsetAdjustmentBehavior =
    props?.ios?.overrideScrollViewContentInsetAdjustmentBehavior !== false;
  view.__rnsNativeScriptIsOverrideScrollViewContentInsetAdjustmentBehaviorSet =
    true;

  if (
    typeof view.shouldOverrideScrollViewContentInsetAdjustmentBehavior !==
    'function'
  ) {
    view.shouldOverrideScrollViewContentInsetAdjustmentBehavior = () => {
      'worklet';
      return tabsScreenShouldOverrideScrollViewContentInsetAdjustmentBehavior(
        view,
      );
    };
  }

  if (
    typeof view.overrideScrollViewBehaviorInFirstDescendantChainIfNeeded !==
    'function'
  ) {
    view.overrideScrollViewBehaviorInFirstDescendantChainIfNeeded = () => {
      'worklet';
      overrideTabsScreenScrollViewBehaviorInFirstDescendantChainIfNeeded(view);
    };
  }

  if (view.__rnsNativeScriptNeedsScrollViewBehaviorOverride === true) {
    overrideTabsScreenScrollViewBehaviorInFirstDescendantChainIfNeeded(view);
    view.__rnsNativeScriptNeedsScrollViewBehaviorOverride = false;
  }
}

function scrollViewToTop(scrollView: any) {
  'worklet';

  if (!scrollView) {
    return false;
  }

  const topOffset = -(scrollView.adjustedContentInset?.top ?? 0);
  const currentOffset = scrollView.contentOffset?.y ?? 0;

  if (currentOffset === topOffset) {
    return false;
  }

  const CGPointMake = nativeValue('CGPointMake');
  const target =
    typeof CGPointMake === 'function'
      ? CGPointMake(0, topOffset)
      : { x: 0, y: topOffset };

  if (typeof scrollView.setContentOffsetAnimated === 'function') {
    scrollView.setContentOffsetAnimated(target, true);
  } else if (typeof scrollView['setContentOffset:animated:'] === 'function') {
    scrollView['setContentOffset:animated:'](target, true);
  } else {
    scrollView.contentOffset = target;
  }

  return true;
}

function imageFromResolvedTabSource(source: unknown, isTemplate: boolean): any {
  'worklet';
  const UIImage = nativeValue('UIImage');
  const resolved = source as { uri?: string } | string | null | undefined;
  const uri = typeof resolved === 'string' ? resolved : resolved?.uri;

  if (!UIImage || typeof uri !== 'string') {
    return null;
  }

  let image = null;

  if (typeof UIImage.imageNamed === 'function') {
    image = UIImage.imageNamed(uri);
  }

  if (!image && typeof UIImage.imageWithContentsOfFile === 'function') {
    const filePath = uri.startsWith('file://') ? uri.slice(7) : uri;
    image = UIImage.imageWithContentsOfFile(filePath);
  }

  if (!image) {
    return null;
  }

  return imageWithRenderingMode(
    image,
    isTemplate ? 'AlwaysTemplate' : 'AlwaysOriginal',
    isTemplate ? 2 : 1,
  );
}

function loadResolvedTabImage(
  source: unknown,
  isTemplate: boolean,
  ctx: any,
  callback: (image: any) => void,
) {
  'worklet';

  const image = imageFromResolvedTabSource(source, isTemplate);
  if (image) {
    return image;
  }

  // Mirrors upstream RNSTabBarAppearanceCoordinator + RNSImageLoadingHelper:
  // prepared local assets resolve synchronously, while URI/packager-backed
  // sources load through React Native's generic image loader and update the
  // existing UITabBarItem when completion arrives.
  ctx?.loadImage?.(source, { template: isTemplate }, (loadedImage: any) => {
    'worklet';
    if (loadedImage) {
      callback(loadedImage);
    }
  });

  return null;
}

function imageForTabIcon(
  icon: any,
  ctx?: any,
  callback?: (image: any) => void,
): any {
  'worklet';
  const UIImage = nativeValue('UIImage');
  if (!UIImage || !icon) {
    return null;
  }
  if (
    icon.type === 'sfSymbol' &&
    typeof icon.name === 'string' &&
    typeof UIImage.systemImageNamed === 'function'
  ) {
    return UIImage.systemImageNamed(icon.name);
  }
  if (
    icon.type === 'xcasset' &&
    typeof icon.name === 'string' &&
    typeof UIImage.imageNamed === 'function'
  ) {
    return UIImage.imageNamed(icon.name);
  }
  if (icon.imageSource) {
    return loadResolvedTabImage(icon.imageSource, false, ctx, image => {
      'worklet';
      callback?.(image);
    });
  }
  if (icon.templateSource) {
    return loadResolvedTabImage(icon.templateSource, true, ctx, image => {
      'worklet';
      callback?.(image);
    });
  }
  return null;
}

function makeOffset(value: any): any {
  'worklet';
  if (!value) {
    return null;
  }
  const UIOffsetMake = nativeValue('UIOffsetMake');
  const horizontal = value.horizontal ?? 0;
  const vertical = value.vertical ?? 0;
  if (typeof UIOffsetMake === 'function') {
    return UIOffsetMake(horizontal, vertical);
  }
  return { horizontal, vertical };
}

function makeTitleTextAttributes(value: any): any {
  'worklet';
  const color = nativeColor(value?.tabBarItemTitleFontColor, 'labelColor');
  if (!color) {
    return null;
  }
  const NSDictionary = nativeValue('NSDictionary');
  const foregroundColorKey =
    nativeValue('NSForegroundColorAttributeName') ?? 'NSColor';
  if (
    NSDictionary &&
    typeof NSDictionary.dictionaryWithObjectForKey === 'function'
  ) {
    return NSDictionary.dictionaryWithObjectForKey(color, foregroundColorKey);
  }
  return {
    [foregroundColorKey]: color,
  };
}

function configureTabBarItemStateAppearance(stateAppearance: any, props: any) {
  'worklet';
  if (!stateAppearance || !props) {
    return;
  }
  const titleTextAttributes = makeTitleTextAttributes(props);
  const badgeBackgroundColor = nativeColor(
    props.tabBarItemBadgeBackgroundColor,
    'systemBlueColor',
  );
  const iconColor = nativeColor(props.tabBarItemIconColor, 'labelColor');
  const titlePositionAdjustment = makeOffset(
    props.tabBarItemTitlePositionAdjustment,
  );
  if (titleTextAttributes) {
    stateAppearance.titleTextAttributes = titleTextAttributes;
  }
  if (badgeBackgroundColor) {
    stateAppearance.badgeBackgroundColor = badgeBackgroundColor;
  }
  if (iconColor) {
    stateAppearance.iconColor = iconColor;
  }
  if (titlePositionAdjustment) {
    stateAppearance.titlePositionAdjustment = titlePositionAdjustment;
  }
}

function configureTabBarItemAppearance(itemAppearance: any, props: any) {
  'worklet';
  if (!itemAppearance || !props) {
    return;
  }
  configureTabBarItemStateAppearance(itemAppearance.normal, props.normal);
  configureTabBarItemStateAppearance(itemAppearance.selected, props.selected);
  configureTabBarItemStateAppearance(itemAppearance.focused, props.focused);
  configureTabBarItemStateAppearance(itemAppearance.disabled, props.disabled);
}

function hasTabBarItemStateAppearanceValues(props: any): boolean {
  'worklet';
  return (
    props?.tabBarItemBadgeBackgroundColor != null ||
    props?.tabBarItemIconColor != null ||
    props?.tabBarItemTitleFontColor != null ||
    props?.tabBarItemTitleFontFamily != null ||
    props?.tabBarItemTitleFontSize != null ||
    props?.tabBarItemTitleFontStyle != null ||
    props?.tabBarItemTitleFontWeight != null ||
    props?.tabBarItemTitlePositionAdjustment != null
  );
}

function hasTabBarItemAppearanceValues(props: any): boolean {
  'worklet';
  return (
    hasTabBarItemStateAppearanceValues(props?.normal) ||
    hasTabBarItemStateAppearanceValues(props?.selected) ||
    hasTabBarItemStateAppearanceValues(props?.focused) ||
    hasTabBarItemStateAppearanceValues(props?.disabled)
  );
}

function hasTabBarAppearanceValues(props: any): boolean {
  'worklet';
  return (
    props?.tabBarBackgroundColor != null ||
    props?.tabBarShadowColor != null ||
    hasTabBarItemAppearanceValues(props?.stacked) ||
    hasTabBarItemAppearanceValues(props?.inline) ||
    hasTabBarItemAppearanceValues(props?.compactInline)
  );
}

function makeTabBarAppearance(props: any): any {
  'worklet';
  if (props == null || !hasTabBarAppearanceValues(props)) {
    return null;
  }
  const UITabBarAppearance = nativeValue('UITabBarAppearance');
  if (!UITabBarAppearance || typeof UITabBarAppearance.alloc !== 'function') {
    return null;
  }
  const allocated = UITabBarAppearance.alloc();
  const appearance =
    allocated && typeof allocated.init === 'function'
      ? allocated.init()
      : allocated;
  if (typeof appearance.configureWithDefaultBackground === 'function') {
    appearance.configureWithDefaultBackground();
  }
  const backgroundColor = nativeColor(
    props.tabBarBackgroundColor,
    'systemBackgroundColor',
  );
  const shadowColor = nativeColor(props.tabBarShadowColor, 'separatorColor');
  if (backgroundColor) {
    appearance.backgroundColor = backgroundColor;
  }
  if (shadowColor) {
    appearance.shadowColor = shadowColor;
  }
  configureTabBarItemAppearance(
    appearance.stackedLayoutAppearance,
    props.stacked,
  );
  configureTabBarItemAppearance(
    appearance.inlineLayoutAppearance,
    props.inline,
  );
  configureTabBarItemAppearance(
    appearance.compactInlineLayoutAppearance,
    props.compactInline,
  );
  return appearance;
}

function configureTabBarItem(item: any, props: any, ctx?: any) {
  'worklet';
  if (!item) {
    return;
  }
  const title = props.title ?? props.screenKey;
  const icon = imageForTabIcon(props.ios?.icon, ctx, image => {
    'worklet';
    item.image = image;
  });
  const selectedIcon =
    imageForTabIcon(props.ios?.selectedIcon, ctx, image => {
      'worklet';
      item.selectedImage = image;
    }) ?? icon;
  item.title = title;
  if (icon) {
    item.image = icon;
  }
  if (selectedIcon) {
    item.selectedImage = selectedIcon;
  }
  item.badgeValue = props.badgeValue != null ? '' + props.badgeValue : null;
  item.accessibilityIdentifier =
    props.tabBarItemTestID != null ? '' + props.tabBarItemTestID : null;
  item.accessibilityLabel =
    props.tabBarItemAccessibilityLabel != null
      ? '' + props.tabBarItemAccessibilityLabel
      : title != null
      ? '' + title
      : null;
  const standardAppearance = makeTabBarAppearance(
    props.ios?.standardAppearance,
  );
  const scrollEdgeAppearance = makeTabBarAppearance(
    props.ios?.scrollEdgeAppearance,
  );
  if (standardAppearance) {
    item.standardAppearance = standardAppearance;
  }
  if (props.ios?.scrollEdgeAppearance !== undefined) {
    item.scrollEdgeAppearance = scrollEdgeAppearance;
  }
}

function makeTabBarItem(props: any, ctx?: any): any {
  'worklet';
  const UITabBarItem = nativeValue('UITabBarItem');
  if (!UITabBarItem || typeof UITabBarItem.alloc !== 'function') {
    throw new Error(
      `UITabBarItem is not allocatable in the UI runtime: ${typeof UITabBarItem}`,
    );
  }
  const title = props.title ?? props.screenKey;
  let item: any;
  const icon = imageForTabIcon(props.ios?.icon, ctx, image => {
    'worklet';
    if (item) {
      item.image = image;
    }
  });
  const selectedIcon =
    imageForTabIcon(props.ios?.selectedIcon, ctx, image => {
      'worklet';
      if (item) {
        item.selectedImage = image;
      }
    }) ?? icon;
  const systemItem = props.ios?.systemItem;
  const itemAllocated = UITabBarItem.alloc();
  const mappedSystemItem = tabBarSystemItemValue(systemItem);
  if (!icon && mappedSystemItem != null && systemItem !== 'none') {
    item =
      itemAllocated &&
      typeof itemAllocated.initWithTabBarSystemItemTag === 'function'
        ? itemAllocated.initWithTabBarSystemItemTag(
            mappedSystemItem,
            props.__nativeScriptTabsIndex ?? 0,
          )
        : itemAllocated.init();
    if (title != null) {
      item.title = title;
    }
  } else {
    item =
      itemAllocated &&
      typeof itemAllocated.initWithTitleImageSelectedImage === 'function'
        ? itemAllocated.initWithTitleImageSelectedImage(
            title,
            icon,
            selectedIcon,
          )
        : itemAllocated.init();
    item.title = title;
    if (icon) {
      item.image = icon;
    }
    if (selectedIcon) {
      item.selectedImage = selectedIcon;
    }
  }
  configureTabBarItem(item, props, ctx);
  return item;
}

function configureTabBarController(controller: any, props: any) {
  'worklet';
  const backgroundColor = nativeColor(
    props.backgroundColor,
    'systemBackgroundColor',
  );
  const tintColor = nativeColor(props.tintColor, 'systemBlueColor');
  const controllerMode = tabBarControllerModeValue(props.tabBarControllerMode);
  const minimizeBehavior = tabBarMinimizeBehaviorValue(
    props.tabBarMinimizeBehavior,
  );
  const layoutDirection = tabBarLayoutDirectionValue(props.layoutDirection);
  if (backgroundColor) {
    controller.view.backgroundColor = backgroundColor;
  }
  if (tintColor) {
    controller.tabBar.tintColor = tintColor;
  }
  if (controllerMode != null) {
    controller.mode = controllerMode;
  }
  if (minimizeBehavior != null) {
    controller.tabBarMinimizeBehavior = minimizeBehavior;
  }
  // Direct port of RNSTabsHostComponentView.setLayoutDirection: upstream
  // applies layoutDirection through UITabBarController trait overrides so
  // UIKit owns tab item mirroring for ltr/rtl/inherit.
  if (controller.traitOverrides) {
    controller.traitOverrides.layoutDirection = layoutDirection;
  } else if (controller.parentViewController) {
    const UITraitCollection = nativeValue('UITraitCollection');
    const traitCollection =
      UITraitCollection &&
      typeof UITraitCollection.traitCollectionWithLayoutDirection === 'function'
        ? UITraitCollection.traitCollectionWithLayoutDirection(layoutDirection)
        : null;
    if (
      traitCollection &&
      typeof controller.parentViewController
        .setOverrideTraitCollectionForChildViewController === 'function'
    ) {
      controller.parentViewController.setOverrideTraitCollectionForChildViewController(
        traitCollection,
        controller,
      );
    }
  }
}

function nativeArrayFromArray(items: any[]): any {
  'worklet';
  const NSArray = nativeValue('NSArray');
  return NSArray && typeof NSArray.arrayWithArray === 'function'
    ? NSArray.arrayWithArray(items)
    : items;
}

function nativeObjectStableHandle(object: any): string {
  'worklet';

  if (!object) {
    return '';
  }

  try {
    const handle =
      typeof NativeScriptRuntime.nativeHandleForObject === 'function'
        ? NativeScriptRuntime.nativeHandleForObject(object)
        : undefined;

    if (typeof handle === 'string' && handle.length > 0) {
      return handle;
    }
  } catch (_error) {
    // Fall through to UIKit hash/proxy identity below.
  }

  try {
    const interopObject = (globalThis as Record<string, any>).interop;
    const handleOf = interopObject?.handleof;
    const pointer = typeof handleOf === 'function' ? handleOf(object) : null;

    if (pointer) {
      if (typeof pointer.toHexString === 'function') {
        const handle = pointer.toHexString();
        return typeof handle === 'string' ? handle : '';
      }
      if (typeof pointer.address === 'string') {
        return pointer.address;
      }
      if (typeof pointer.address === 'number') {
        return '' + pointer.address;
      }
      if (typeof pointer.toNumber === 'function') {
        return '' + pointer.toNumber();
      }
    }
  } catch (_error) {
    // Fall through to hash/nativeID below.
  }

  const hash = object.hash;
  if (typeof hash === 'string' || typeof hash === 'number') {
    return '' + hash;
  }

  const nativeID = object.nativeID;
  return typeof nativeID === 'string' || typeof nativeID === 'number'
    ? '' + nativeID
    : '';
}

function nativeObjectsEqual(left: any, right: any): boolean {
  'worklet';
  if (left === right) {
    return true;
  }
  if (!left || !right) {
    return false;
  }

  const leftHandle = nativeObjectStableHandle(left);
  const rightHandle = nativeObjectStableHandle(right);
  if (
    leftHandle.length > 0 &&
    rightHandle.length > 0 &&
    leftHandle === rightHandle
  ) {
    return true;
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
    } catch {
      // Fall through to the inverse check; NativeScript proxies can differ by SDK.
    }
  }
  if (typeof right.isEqual === 'function') {
    try {
      return right.isEqual(left) === true;
    } catch {
      return false;
    }
  }
  return false;
}

function associatedObjectForKey(object: any, key: string) {
  'worklet';

  const interopObject = (globalThis as Record<string, any>).interop;
  if (!object || typeof interopObject?.getAssociatedObject !== 'function') {
    return null;
  }

  try {
    const handle = interopObject.getAssociatedObject(
      object,
      key + ASSOCIATED_HANDLE_SUFFIX,
    );
    if (
      typeof handle === 'string' &&
      handle.length > 0 &&
      typeof NativeScriptRuntime.nativeObjectFromHandle === 'function'
    ) {
      return NativeScriptRuntime.nativeObjectFromHandle(handle);
    }

    return (
      interopObject.getAssociatedObject(
        object,
        key + ASSOCIATED_VALUE_SUFFIX,
      ) ?? null
    );
  } catch (_error) {
    return null;
  }
}

function setAssociatedObjectForKey(
  object: any,
  key: string,
  value: any,
  _policy = 'assign',
) {
  'worklet';

  const interopObject = (globalThis as Record<string, any>).interop;
  if (!object || typeof interopObject?.setAssociatedObject !== 'function') {
    return false;
  }

  try {
    if (value == null) {
      interopObject.setAssociatedObject(
        object,
        key + ASSOCIATED_HANDLE_SUFFIX,
        null,
        'assign',
      );
      interopObject.setAssociatedObject(
        object,
        key + ASSOCIATED_VALUE_SUFFIX,
        null,
        'assign',
      );
      return true;
    }

    if (typeof value === 'string') {
      interopObject.setAssociatedObject(
        object,
        key + ASSOCIATED_VALUE_SUFFIX,
        value,
        'copyNonatomic',
      );
      interopObject.setAssociatedObject(
        object,
        key + ASSOCIATED_HANDLE_SUFFIX,
        null,
        'assign',
      );
      return true;
    }

    const handle =
      typeof NativeScriptRuntime.nativeHandleForObject === 'function'
        ? NativeScriptRuntime.nativeHandleForObject(value)
        : undefined;
    if (typeof handle !== 'string' || handle.length === 0) {
      return false;
    }

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
    return true;
  } catch (_error) {
    return false;
  }
}

function associatedValuePolicyKey(key: string) {
  'worklet';

  return key + ASSOCIATED_VALUE_SUFFIX;
}

function tabsControllerFlag(tabController: any, key: string) {
  'worklet';

  return (
    tabController?.[key] === true ||
    associatedObjectForKey(tabController, key) != null
  );
}

function setTabsControllerFlag(
  tabController: any,
  key: string,
  enabled: boolean,
) {
  'worklet';

  if (!tabController) {
    return;
  }

  tabController[key] = enabled === true;
  setAssociatedObjectForKey(
    tabController,
    key,
    enabled === true ? TABS_ASSOCIATED_TRUE : null,
  );
}

function tabsSelectionObservationSuppressed(tabController: any) {
  'worklet';

  return tabsControllerFlag(
    tabController,
    TABS_SUPPRESS_SELECTION_OBSERVATION_FLAG,
  );
}

function tabsHandlingExplicitSelection(tabController: any) {
  'worklet';

  return tabsControllerFlag(
    tabController,
    TABS_HANDLING_EXPLICIT_SELECTION_FLAG,
  );
}

function setTabsSelectionObservationSuppressed(
  tabController: any,
  enabled: boolean,
) {
  'worklet';

  setTabsControllerFlag(
    tabController,
    TABS_SUPPRESS_SELECTION_OBSERVATION_FLAG,
    enabled,
  );
}

function setTabsHandlingExplicitSelection(
  tabController: any,
  enabled: boolean,
) {
  'worklet';

  setTabsControllerFlag(
    tabController,
    TABS_HANDLING_EXPLICIT_SELECTION_FLAG,
    enabled,
  );
}

function clearPublishedSelectedTabAccessibilityElements(tabController: any) {
  'worklet';

  const tabView = tabController?.view;
  if (!tabView) {
    return;
  }

  try {
    tabView.accessibilityElements = null;
  } catch (_error) {
    // Leave UIKit's default accessibility traversal in charge if the bridge
    // rejects clearing the custom list for this host.
  }
}

function nextResponderForObject(object: any) {
  'worklet';

  if (!object) {
    return null;
  }

  if (typeof object.nextResponder === 'function') {
    try {
      return object.nextResponder();
    } catch (_error) {
      return null;
    }
  }

  return object.nextResponder ?? null;
}

function setKnownRootContainedParent(controller: any, parent: any) {
  'worklet';

  if (!controller) {
    return;
  }

  controller.__nativeScriptRootContainedParentViewController = parent ?? null;
  setAssociatedObjectForKey(
    controller,
    ROOT_CONTAINED_PARENT_ASSOCIATION_KEY,
    parent ?? null,
  );
}

function knownRootContainedParentForController(controller: any) {
  'worklet';

  return (
    controller?.__nativeScriptRootContainedParentViewController ??
    associatedObjectForKey(controller, ROOT_CONTAINED_PARENT_ASSOCIATION_KEY)
  );
}

function parentViewControllerForController(controller: any) {
  'worklet';

  const directParent = controller?.parentViewController;
  if (directParent) {
    return directParent;
  }

  if (typeof controller?.valueForKey === 'function') {
    try {
      const kvcParent = controller.valueForKey('parentViewController');
      if (kvcParent) {
        return kvcParent;
      }
    } catch (_error) {
      // Fall through to performSelector.
    }
  }

  if (typeof controller?.performSelector === 'function') {
    try {
      const selectorParent = controller.performSelector('parentViewController');
      if (selectorParent) {
        return selectorParent;
      }
    } catch (_error) {
      return (
        directParent ??
        knownRootContainedParentForController(controller) ??
        null
      );
    }
  }

  return (
    directParent ?? knownRootContainedParentForController(controller) ?? null
  );
}

function nativeControllerBool(controller: any, propertyName: string) {
  'worklet';

  const value = controller?.[propertyName];

  if (typeof value === 'function') {
    return value.call(controller) === true;
  }

  return value === true;
}

function callNativeScriptTabsControllerSuper(
  controller: any,
  methodName: string,
  ...args: any[]
) {
  'worklet';

  const superObject = controller?.super;
  const method = superObject?.[methodName];

  if (typeof method === 'function') {
    superObject[methodName](...args);
  }
}

function selectedTabControllerForTabsScreenController(controller: any) {
  'worklet';

  const tabController = controller?.tabBarController;

  return tabController?.selectedViewController;
}

function shouldSkipTabsScreenLifecycleEvent(
  controller: any,
  eventName: string,
) {
  'worklet';

  if (!controller) {
    return false;
  }

  const selectedController =
    selectedTabControllerForTabsScreenController(controller);
  const isSelectedController =
    selectedController && nativeObjectsEqual(selectedController, controller);

  if (
    eventName === 'onWillDisappear' &&
    isSelectedController &&
    !nativeControllerBool(controller, 'isMovingFromParentViewController')
  ) {
    return true;
  }

  const lastLifecycleEvent = controller.__rnsNativeScriptTabsLastLifecycleEvent;
  if (
    eventName === 'onWillAppear' &&
    isSelectedController &&
    lastLifecycleEvent === 'onWillAppear'
  ) {
    return true;
  }

  return false;
}

function tabsScreenLifecycleRecordForController(controller: any) {
  'worklet';

  const directRecord = controller?.__rnsNativeScriptTabsScreenRecord;
  if (directRecord) {
    return directRecord;
  }

  const view = controller?.__rnsNativeScriptTabsView ?? controller?.view;
  const viewRecord = view?.__rnsNativeScriptTabsScreenRecord;
  if (viewRecord) {
    return viewRecord;
  }

  const tabController = controller?.tabBarController;
  const key = '__rnsNativeScriptTabsRegistry';
  const registry = (globalThis as Record<string, any>)[key];
  const hostId =
    tabController?.__rnsNativeScriptTabsHostId ??
    associatedObjectForKey(tabController, TABS_HOST_ID_ASSOCIATION_KEY);
  const tabControllerHandle = nativeObjectStableHandle(tabController);
  const handleHostId =
    tabControllerHandle.length > 0
      ? registry?.hostControllerHandles?.[tabControllerHandle]
      : undefined;
  const host =
    tabController?.__rnsNativeScriptTabsHostRecord ??
    (hostId ? registry?.hosts?.[hostId] : null) ??
    (handleHostId ? registry?.hosts?.[handleHostId] : null);
  const screens = host?.registeredScreens ?? host?.screens ?? [];
  const controllerHandle = nativeObjectStableHandle(controller);

  for (let index = 0; index < screens.length; index += 1) {
    const screen = screens[index];
    const screenControllerHandle =
      screen?.controllerHandle ?? nativeObjectStableHandle(screen?.controller);

    if (
      nativeObjectsEqual(screen?.controller, controller) ||
      (controllerHandle.length > 0 &&
        screenControllerHandle.length > 0 &&
        controllerHandle === screenControllerHandle)
    ) {
      return screen;
    }
  }

  return null;
}

function emitTabsScreenLifecycleEventForController(
  controller: any,
  eventName: string,
) {
  'worklet';

  const screenRecord = tabsScreenLifecycleRecordForController(controller);

  if (shouldSkipTabsScreenLifecycleEvent(controller, eventName)) {
    traceTabsEvent(
      'tabs-screen-lifecycle-skip-transient-selected',
      `screen=${screenRecord?.screenKey ?? ''} ` +
        `event=${eventName}`,
    );
    return;
  }

  traceTabsEvent(
    'tabs-screen-lifecycle-emit',
    `screen=${screenRecord?.screenKey ?? ''} ` +
      `event=${eventName} parent=${
        nativeObjectStableHandle(parentViewControllerForController(controller)) ??
        ''
      } viewWindow=${controller?.view?.window ? 1 : 0} movingTo=${
        nativeControllerBool(controller, 'isMovingToParentViewController') ? 1 : 0
      } movingFrom=${
        nativeControllerBool(controller, 'isMovingFromParentViewController') ? 1 : 0
      }`,
  );
  // NATIVESCRIPT_PORT_DEVIATION: upstream stores an
  // RNSTabsScreenEventEmitter on the component view; this TS port stores the
  // React event context on the native controller so UIKit appearance callbacks
  // can emit through it without a native component-view instance.
  controller.__rnsNativeScriptTabsLastLifecycleEvent = eventName;
  controller?.__rnsNativeScriptTabsEventContext?.emit?.(eventName, {});
}

function embeddedNavigationControllerRecordOnView(
  view: any,
): EmbeddedNavigationControllerRecord | null {
  'worklet';

  if (!view) {
    return null;
  }

  const navigationController =
    view.__nativeScriptNavigationController ??
    associatedObjectForKey(view, STACK_NAVIGATION_CONTROLLER_ASSOCIATION_KEY);
  if (
    navigationController &&
    typeof navigationController.popToRootViewControllerAnimated === 'function'
  ) {
    const containerView =
      view.__nativeScriptStackContainerView ??
      associatedObjectForKey(view, STACK_CONTAINER_VIEW_ASSOCIATION_KEY) ??
      view;
    const navigationView =
      view.__nativeScriptEmbeddedNavigationView ??
      associatedObjectForKey(
        view,
        STACK_EMBEDDED_NAVIGATION_VIEW_ASSOCIATION_KEY,
      ) ??
      navigationController.view;

    return {
      containerView,
      navigationController,
      navigationView,
    };
  }

  const responder = nextResponderForObject(view);
  if (
    responder &&
    typeof responder.popToRootViewControllerAnimated === 'function'
  ) {
    return {
      containerView: view,
      navigationController: responder,
      navigationView: responder.view,
    };
  }

  return null;
}

function tabsScreenControllerView(controller: any) {
  'worklet';

  return (
    controller?.__rnsNativeScriptTabsView ??
    associatedObjectForKey(controller, TABS_VIEW_ASSOCIATION_KEY) ??
    controller?.view
  );
}

function childNavigationControllerForTabScreenController(
  tabScreenController: any,
  depth = 0,
): any {
  'worklet';

  if (depth > 8) {
    return null;
  }

  if (
    tabScreenController &&
    typeof tabScreenController.popToRootViewControllerAnimated === 'function'
  ) {
    return tabScreenController;
  }

  const children = tabScreenController?.childViewControllers;
  const count = arrayCount(children);

  for (let index = 0; index < count; index++) {
    const child = arrayItem(children, index);

    if (typeof child?.popToRootViewControllerAnimated === 'function') {
      return child;
    }

    const nestedNavigationController =
      childNavigationControllerForTabScreenController(child, depth + 1);
    if (nestedNavigationController) {
      return nestedNavigationController;
    }
  }

  return null;
}

function embeddedNavigationControllerRecordInSubviewTree(
  view: any,
  depth = 0,
): EmbeddedNavigationControllerRecord | null {
  'worklet';

  if (!view || depth > 8) {
    return null;
  }

  const subviews =
    typeof NativeScriptRuntime.nativeSubviews === 'function'
      ? NativeScriptRuntime.nativeSubviews(view)
      : view.subviews;
  const count = Array.isArray(subviews) ? subviews.length : arrayCount(subviews);

  for (let index = 0; index < count; index += 1) {
    const subview = Array.isArray(subviews)
      ? subviews[index]
      : arrayItem(subviews, index);

    if (!subview || nativeObjectsEqual(subview, view)) {
      continue;
    }

    const directRecord = embeddedNavigationControllerRecordOnView(subview);
    if (directRecord) {
      return directRecord;
    }

    const nestedRecord = embeddedNavigationControllerRecordInSubviewTree(
      subview,
      depth + 1,
    );
    if (nestedRecord) {
      return nestedRecord;
    }
  }

  return null;
}

function clearSelectedTabEmbeddedNavigationLookupDirty(view: any) {
  'worklet';

  if (!view) {
    return;
  }

  view.__rnsNativeScriptEmbeddedNavigationLookupDirty = false;
  setAssociatedObjectForKey(
    view,
    TABS_EMBEDDED_NAVIGATION_LOOKUP_DIRTY_ASSOCIATION_KEY,
    null,
  );
}

function clearSelectedTabEmbeddedNavigationNegativeLookupKey(view: any) {
  'worklet';

  if (!view) {
    return;
  }

  view.__rnsNativeScriptEmbeddedNavigationNegativeLookupKey = undefined;
  setAssociatedObjectForKey(
    view,
    TABS_EMBEDDED_NAVIGATION_NEGATIVE_LOOKUP_KEY_ASSOCIATION_KEY,
    null,
  );
}

function setSelectedTabEmbeddedNavigationNegativeLookupKey(
  view: any,
  key: string,
) {
  'worklet';

  if (!view || key.length === 0) {
    return;
  }

  view.__rnsNativeScriptEmbeddedNavigationNegativeLookupKey = key;
  setAssociatedObjectForKey(
    view,
    TABS_EMBEDDED_NAVIGATION_NEGATIVE_LOOKUP_KEY_ASSOCIATION_KEY,
    key,
  );
}

function selectedTabEmbeddedNavigationLookupIsDirty(view: any) {
  'worklet';

  return (
    view?.__rnsNativeScriptEmbeddedNavigationLookupDirty === true ||
    associatedObjectForKey(
      view,
      TABS_EMBEDDED_NAVIGATION_LOOKUP_DIRTY_ASSOCIATION_KEY,
    ) === TABS_ASSOCIATED_TRUE
  );
}

function selectedTabControllerChildShapeKey(controller: any, depth = 0): string {
  'worklet';

  if (!controller || depth > 8) {
    return '';
  }

  const children = controller.childViewControllers;
  const count = arrayCount(children);
  let key = `${nativeObjectStableHandle(controller)}:${count}`;

  for (let index = 0; index < count; index += 1) {
    const child = arrayItem(children, index);
    key += `>${nativeObjectStableHandle(child)}:${
      typeof child?.popToRootViewControllerAnimated === 'function' ? 'nav' : 'vc'
    }[${selectedTabControllerChildShapeKey(child, depth + 1)}]`;
  }

  return key;
}

function selectedTabViewSubviewShapeKey(view: any): string {
  'worklet';

  if (!view) {
    return '';
  }

  const subviews =
    typeof NativeScriptRuntime.nativeSubviews === 'function'
      ? NativeScriptRuntime.nativeSubviews(view)
      : view.subviews;
  const count = Array.isArray(subviews) ? subviews.length : arrayCount(subviews);

  return [
    nativeObjectStableHandle(view),
    String(count),
    nativeObjectStableHandle(
      count > 0
        ? Array.isArray(subviews)
          ? subviews[0]
          : arrayItem(subviews, 0)
        : null,
    ),
    nativeObjectStableHandle(
      count > 1
        ? Array.isArray(subviews)
          ? subviews[count - 1]
          : arrayItem(subviews, count - 1)
        : null,
    ),
  ].join(':');
}

function selectedTabEmbeddedNavigationLookupKey(
  selectedController: any,
  selectedView: any,
) {
  'worklet';

  return [
    nativeObjectStableHandle(selectedController),
    nativeObjectStableHandle(selectedView),
    nativeObjectStableHandle(selectedView?.window),
    selectedTabControllerChildShapeKey(selectedController),
    selectedTabViewSubviewShapeKey(selectedView),
  ].join('|');
}

function selectedTabEmbeddedNavigationNegativeLookupKeyMatches(
  selectedView: any,
  lookupKey: string,
) {
  'worklet';

  if (!selectedView || lookupKey.length === 0) {
    return false;
  }

  const storedKey =
    selectedView.__rnsNativeScriptEmbeddedNavigationNegativeLookupKey ??
    associatedObjectForKey(
      selectedView,
      TABS_EMBEDDED_NAVIGATION_NEGATIVE_LOOKUP_KEY_ASSOCIATION_KEY,
    );

  return storedKey === lookupKey;
}

function rememberSelectedTabEmbeddedNavigationControllerRecord(
  selectedView: any,
  record: EmbeddedNavigationControllerRecord | null,
) {
  'worklet';

  const navigationController = record?.navigationController;
  if (!selectedView || !navigationController) {
    return record;
  }

  const containerView = record.containerView ?? selectedView;
  const navigationView = record.navigationView ?? navigationController.view;

  selectedView.__nativeScriptNavigationController = navigationController;
  selectedView.__nativeScriptStackContainerView = containerView;
  selectedView.__nativeScriptEmbeddedNavigationView = navigationView;
  setAssociatedObjectForKey(
    selectedView,
    STACK_NAVIGATION_CONTROLLER_ASSOCIATION_KEY,
    navigationController,
  );
  setAssociatedObjectForKey(
    selectedView,
    STACK_CONTAINER_VIEW_ASSOCIATION_KEY,
    containerView,
  );
  clearSelectedTabEmbeddedNavigationLookupDirty(selectedView);
  clearSelectedTabEmbeddedNavigationNegativeLookupKey(selectedView);
  if (navigationView) {
    setAssociatedObjectForKey(
      selectedView,
      STACK_EMBEDDED_NAVIGATION_VIEW_ASSOCIATION_KEY,
      navigationView,
    );
  }

  return {
    containerView,
    navigationController,
    navigationView,
  };
}

function rememberSelectedTabOwnershipOnObject(
  object: any,
  tabController: any,
  selectedController: any,
) {
  'worklet';

  if (!object) {
    return;
  }

  object.__rnsNativeScriptTabsController = tabController;
  object.__rnsNativeScriptTabsSelectedController = selectedController;
  setAssociatedObjectForKey(
    object,
    TABS_CONTROLLER_ASSOCIATION_KEY,
    tabController,
  );
  setAssociatedObjectForKey(
    object,
    TABS_SELECTED_CONTROLLER_ASSOCIATION_KEY,
    selectedController,
  );
}

function rememberSelectedTabEmbeddedStackOwnership(
  tabController: any,
  selectedController: any,
  selectedView: any,
  record?: EmbeddedNavigationControllerRecord | null,
) {
  'worklet';

  rememberSelectedTabOwnershipOnObject(
    selectedView,
    tabController,
    selectedController,
  );
  rememberSelectedTabOwnershipOnObject(
    record?.navigationController,
    tabController,
    selectedController,
  );
  rememberSelectedTabOwnershipOnObject(
    record?.containerView,
    tabController,
    selectedController,
  );
  rememberSelectedTabOwnershipOnObject(
    record?.navigationView ?? record?.navigationController?.view,
    tabController,
    selectedController,
  );
}

function selectedTabEmbeddedNavigationControllerRecord(
  selectedController: any,
  selectedView: any,
): EmbeddedNavigationControllerRecord | null {
  'worklet';

  const directRecord = embeddedNavigationControllerRecordOnView(selectedView);
  if (directRecord) {
    return rememberSelectedTabEmbeddedNavigationControllerRecord(
      selectedView,
      directRecord,
    );
  }

  const lookupKey = selectedTabEmbeddedNavigationLookupKey(
    selectedController,
    selectedView,
  );

  if (
    !selectedTabEmbeddedNavigationLookupIsDirty(selectedView) &&
    selectedTabEmbeddedNavigationNegativeLookupKeyMatches(
      selectedView,
      lookupKey,
    )
  ) {
    traceTabsEvent('selectedTabEmbeddedNavigationControllerRecord-cache-miss');
    return null;
  }

  const childNavigationController =
    childNavigationControllerForTabScreenController(selectedController);

  if (
    childNavigationController &&
    typeof childNavigationController.popToRootViewControllerAnimated ===
      'function'
  ) {
    const containerView =
      selectedView?.__nativeScriptStackContainerView ??
      associatedObjectForKey(
        selectedView,
        STACK_CONTAINER_VIEW_ASSOCIATION_KEY,
      ) ??
      childNavigationController.__nativeScriptStackContainerView ??
      associatedObjectForKey(
        childNavigationController,
        STACK_CONTAINER_VIEW_ASSOCIATION_KEY,
      ) ??
      selectedView;
    const navigationView =
      selectedView?.__nativeScriptEmbeddedNavigationView ??
      associatedObjectForKey(
        selectedView,
        STACK_EMBEDDED_NAVIGATION_VIEW_ASSOCIATION_KEY,
      ) ??
      childNavigationController.__nativeScriptEmbeddedNavigationView ??
      associatedObjectForKey(
        childNavigationController,
        STACK_EMBEDDED_NAVIGATION_VIEW_ASSOCIATION_KEY,
      ) ??
      childNavigationController.view;

    return rememberSelectedTabEmbeddedNavigationControllerRecord(selectedView, {
      containerView,
      navigationController: childNavigationController,
      navigationView,
    });
  }

  const shouldSearchDescendants =
    selectedTabEmbeddedNavigationLookupIsDirty(selectedView);

  if (!shouldSearchDescendants) {
    setSelectedTabEmbeddedNavigationNegativeLookupKey(
      selectedView,
      lookupKey,
    );
    return null;
  }

  const descendantRecord =
    embeddedNavigationControllerRecordInSubviewTree(selectedView);
  clearSelectedTabEmbeddedNavigationLookupDirty(selectedView);
  if (descendantRecord) {
    return rememberSelectedTabEmbeddedNavigationControllerRecord(
      selectedView,
      descendantRecord,
    );
  }

  setSelectedTabEmbeddedNavigationNegativeLookupKey(selectedView, lookupKey);
  return null;
}

function installTabsScreenLifecycleMethodsOnController(controller: any) {
  'worklet';

  if (
    !controller ||
    controller.__rnsNativeScriptTabsLifecycleFallbackInstalled === true
  ) {
    return;
  }

  controller.__rnsNativeScriptTabsLifecycleFallbackInstalled = true;

  if (typeof controller.viewWillAppear !== 'function') {
    controller.viewWillAppear = function viewWillAppear(animated: boolean) {
      'worklet';
      callNativeScriptTabsControllerSuper(this, 'viewWillAppear', animated);
      emitTabsScreenLifecycleEventForController(this, 'onWillAppear');
    };
  }

  if (typeof controller.viewDidAppear !== 'function') {
    controller.viewDidAppear = function viewDidAppear(animated: boolean) {
      'worklet';
      callNativeScriptTabsControllerSuper(this, 'viewDidAppear', animated);
      emitTabsScreenLifecycleEventForController(this, 'onDidAppear');
    };
  }

  if (typeof controller.viewWillDisappear !== 'function') {
    controller.viewWillDisappear = function viewWillDisappear(
      animated: boolean,
    ) {
      'worklet';
      callNativeScriptTabsControllerSuper(this, 'viewWillDisappear', animated);
      emitTabsScreenLifecycleEventForController(this, 'onWillDisappear');
    };
  }

  if (typeof controller.viewDidDisappear !== 'function') {
    controller.viewDidDisappear = function viewDidDisappear(animated: boolean) {
      'worklet';
      callNativeScriptTabsControllerSuper(this, 'viewDidDisappear', animated);
      emitTabsScreenLifecycleEventForController(this, 'onDidDisappear');
    };
  }
}

function tabsScreenControllerViewWillAppearSelector(
  controller: any,
  animated: boolean,
) {
  'worklet';

  // Direct port of RNSTabsScreenViewController.mm: lifecycle events are
  // emitted from UIKit appearance selectors, so tab switches follow the
  // same ordering as the ObjC implementation.
  callNativeScriptTabsControllerSuper(controller, 'viewWillAppear', animated);
  emitTabsScreenLifecycleEventForController(controller, 'onWillAppear');
}

function tabsScreenControllerViewDidAppearSelector(
  controller: any,
  animated: boolean,
) {
  'worklet';

  callNativeScriptTabsControllerSuper(controller, 'viewDidAppear', animated);
  emitTabsScreenLifecycleEventForController(controller, 'onDidAppear');
}

function tabsScreenControllerViewWillDisappearSelector(
  controller: any,
  animated: boolean,
) {
  'worklet';

  callNativeScriptTabsControllerSuper(
    controller,
    'viewWillDisappear',
    animated,
  );
  emitTabsScreenLifecycleEventForController(controller, 'onWillDisappear');
}

function tabsScreenControllerViewDidDisappearSelector(
  controller: any,
  animated: boolean,
) {
  'worklet';

  callNativeScriptTabsControllerSuper(controller, 'viewDidDisappear', animated);
  emitTabsScreenLifecycleEventForController(controller, 'onDidDisappear');
}

function tabsScreenControllerClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[TABS_SCREEN_CONTROLLER_CLASS_KEY];

  if (existing) {
    return existing;
  }

  const UIViewController = nativeClassValue('UIViewController');
  const NativeClassFunction = globalObject.NativeClass;

  if (
    !UIViewController ||
    (typeof NativeClassFunction !== 'function' &&
      typeof UIViewController.extend !== 'function')
  ) {
    return UIViewController;
  }

  class RNSTabsScreenNativeScriptController extends UIViewController {
    viewWillAppear(animated: boolean) {
      'worklet';

      // Direct port of RNSTabsScreenViewController.mm: lifecycle events are
      // emitted from UIKit appearance selectors, so tab switches follow the
      // same ordering as the ObjC implementation.
      callNativeScriptTabsControllerSuper(this, 'viewWillAppear', animated);
      emitTabsScreenLifecycleEventForController(this, 'onWillAppear');
    }

    'viewWillAppear:'(animated: boolean) {
      'worklet';

      tabsScreenControllerViewWillAppearSelector(this, animated);
    }

    viewDidAppear(animated: boolean) {
      'worklet';

      callNativeScriptTabsControllerSuper(this, 'viewDidAppear', animated);
      emitTabsScreenLifecycleEventForController(this, 'onDidAppear');
    }

    'viewDidAppear:'(animated: boolean) {
      'worklet';

      tabsScreenControllerViewDidAppearSelector(this, animated);
    }

    viewWillDisappear(animated: boolean) {
      'worklet';

      callNativeScriptTabsControllerSuper(this, 'viewWillDisappear', animated);
      emitTabsScreenLifecycleEventForController(this, 'onWillDisappear');
    }

    'viewWillDisappear:'(animated: boolean) {
      'worklet';

      tabsScreenControllerViewWillDisappearSelector(this, animated);
    }

    viewDidDisappear(animated: boolean) {
      'worklet';

      callNativeScriptTabsControllerSuper(this, 'viewDidDisappear', animated);
      emitTabsScreenLifecycleEventForController(this, 'onDidDisappear');
    }

    'viewDidDisappear:'(animated: boolean) {
      'worklet';

      tabsScreenControllerViewDidDisappearSelector(this, animated);
    }
  }

  const interopTypes = globalObject.interop?.types;
  const boolType = interopTypes?.bool;
  const exposedMethods = {
    'viewWillAppear:': {
      params: boolType ? [boolType] : [],
      returns: interopTypes?.void,
    },
    'viewDidAppear:': {
      params: boolType ? [boolType] : [],
      returns: interopTypes?.void,
    },
    'viewWillDisappear:': {
      params: boolType ? [boolType] : [],
      returns: interopTypes?.void,
    },
    'viewDidDisappear:': {
      params: boolType ? [boolType] : [],
      returns: interopTypes?.void,
    },
  };

  defineObjCExposedMethods(RNSTabsScreenNativeScriptController, exposedMethods);

  if (typeof UIViewController.extend === 'function') {
    const methods: Record<string, any> = {};
    const methodNames = Object.getOwnPropertyNames(
      RNSTabsScreenNativeScriptController.prototype,
    );

    for (const methodName of methodNames) {
      if (methodName === 'constructor') {
        continue;
      }

      const descriptor = Object.getOwnPropertyDescriptor(
        RNSTabsScreenNativeScriptController.prototype,
        methodName,
      );

      if (descriptor) {
        Object.defineProperty(methods, methodName, descriptor);
      }
    }

    const TabsScreenControllerClass = UIViewController.extend(methods, {
      exposedMethods,
      name: 'RNSTabsScreenNativeScriptController',
    });
    globalObject[TABS_SCREEN_CONTROLLER_CLASS_KEY] = TabsScreenControllerClass;
    return TabsScreenControllerClass;
  }

  NativeClassFunction(RNSTabsScreenNativeScriptController);
  globalObject[TABS_SCREEN_CONTROLLER_CLASS_KEY] =
    RNSTabsScreenNativeScriptController;
  return RNSTabsScreenNativeScriptController;
}

function viewIsDescendantOfView(view: any, ancestor: any) {
  'worklet';

  if (!view || !ancestor) {
    return false;
  }

  let current = view;
  let depth = 0;

  while (current && depth < 64) {
    if (current === ancestor || nativeObjectsEqual(current, ancestor)) {
      return true;
    }

    current = current.superview;
    depth += 1;
  }

  return false;
}

function flexibleSizeMask(): number {
  'worklet';
  const autoresizing = nativeValue('UIViewAutoresizing');
  return (
    (autoresizing?.FlexibleWidth ?? 2) + (autoresizing?.FlexibleHeight ?? 16)
  );
}

function rectComponent(value: unknown): number {
  'worklet';

  return typeof value === 'number' && Number.isFinite(value)
    ? Math.round(value * 100) / 100
    : 0;
}

function rectHasPositiveSize(rect: any): boolean {
  'worklet';

  return (
    rectComponent(rect?.size?.width) > 0 &&
    rectComponent(rect?.size?.height) > 0
  );
}

function rectKey(rect: any): string {
  'worklet';

  if (!rect) {
    return 'nil';
  }

  return [
    rectComponent(rect.origin?.x),
    rectComponent(rect.origin?.y),
    rectComponent(rect.size?.width),
    rectComponent(rect.size?.height),
  ].join(',');
}

function rectsApproximatelyEqual(left: any, right: any): boolean {
  'worklet';

  if (!left || !right) {
    return false;
  }

  return (
    Math.abs(rectComponent(left.origin?.x) - rectComponent(right.origin?.x)) <
      0.5 &&
    Math.abs(rectComponent(left.origin?.y) - rectComponent(right.origin?.y)) <
      0.5 &&
    Math.abs(
      rectComponent(left.size?.width) - rectComponent(right.size?.width),
    ) < 0.5 &&
    Math.abs(
      rectComponent(left.size?.height) - rectComponent(right.size?.height),
    ) < 0.5
  );
}

function rectWithZeroOrigin(rect: any) {
  'worklet';
  const width = rectComponent(rect?.size?.width);
  const height = rectComponent(rect?.size?.height);
  const CGRectMake = nativeValue('CGRectMake');

  return typeof CGRectMake === 'function'
    ? CGRectMake(0, 0, width, height)
    : {
        origin: { x: 0, y: 0 },
        size: { width, height },
      };
}

function setViewBoundsIfNeeded(view: any, bounds: any) {
  'worklet';

  if (!view || !bounds || rectsApproximatelyEqual(view.bounds, bounds)) {
    return false;
  }

  view.bounds = bounds;
  return true;
}

function normalizeSelectedTabHostedView(
  view: any,
  parentView?: any,
  refreshDetachedTouchHandler = true,
) {
  'worklet';

  if (!view) {
    return false;
  }
  const viewClassName =
    typeof view.className === 'string'
      ? view.className
      : typeof view.constructor?.name === 'string'
      ? view.constructor.name
      : '';
  if (viewClassName === 'NativeScriptDetachedChildrenTouchSentinel') {
    return false;
  }

  let didMutate = false;

  if (view.hidden === true) {
    view.hidden = false;
    didMutate = true;
  }
  if ((view.alpha ?? 1) !== 1) {
    view.alpha = 1;
    didMutate = true;
  }
  if (view.userInteractionEnabled !== true) {
    view.userInteractionEnabled = true;
    didMutate = true;
  }
  if (view.accessibilityElementsHidden === true) {
    view.accessibilityElementsHidden = false;
    didMutate = true;
  }

  const parentBounds = parentView?.bounds ?? parentView?.frame;
  if (
    parentBounds &&
    rectHasPositiveSize(parentBounds) &&
    view !== parentView
  ) {
    const nextFrame = {
      origin: { x: 0, y: 0 },
      size: {
        width: parentBounds.size?.width ?? 0,
        height: parentBounds.size?.height ?? 0,
      },
    };
    if (!rectsApproximatelyEqual(view.frame, nextFrame)) {
      view.frame = nextFrame;
      didMutate = true;
    }
    const flexibleMask = flexibleSizeMask();
    if (view.autoresizingMask !== flexibleMask) {
      view.autoresizingMask = flexibleMask;
      didMutate = true;
    }
  }

  if (didMutate && typeof view.setNeedsLayout === 'function') {
    view.setNeedsLayout();
  }
  if (
    refreshDetachedTouchHandler &&
    typeof view.attachDetachedChildrenTouchHandlerIfNeeded === 'function'
  ) {
    view.attachDetachedChildrenTouchHandlerIfNeeded();
  }
  if (
    refreshDetachedTouchHandler &&
    typeof view.updateDetachedChildrenTouchHandlerOrigin === 'function'
  ) {
    view.updateDetachedChildrenTouchHandlerOrigin();
  }

  return didMutate;
}

function markSelectedTabNavigationControllerNeedsLayout(
  navigationController: any,
) {
  'worklet';

  if (!navigationController) {
    return;
  }

  const navigationView = navigationController.view;
  navigationView?.setNeedsLayout?.();
  navigationView?.superview?.setNeedsLayout?.();
}

function flushSelectedTabDisplay(view: any) {
  'worklet';

  if (!view) {
    return false;
  }

  const flushHost = (NativeScriptRuntime as any).flushUIKitHostView;
  return typeof flushHost === 'function' && flushHost(view) === true;
}

function refreshTabsScreenHostView(view: any) {
  'worklet';

  if (!view) {
    return false;
  }

  const refreshHost = (NativeScriptRuntime as any).refreshUIKitHostView;
  return typeof refreshHost === 'function' && refreshHost(view) === true;
}

function layoutSelectedTabEmbeddedNavigationController(
  selectedView: any,
  embedded: EmbeddedNavigationControllerRecord | null,
) {
  'worklet';

  if (!selectedView || !embedded?.navigationController) {
    return false;
  }

  const stackView =
    embedded.containerView ?? embedded.navigationController.view;
  const navigationView =
    embedded.navigationView ?? embedded.navigationController.view;
  let didLayout = false;

  if (stackView && !nativeObjectsEqual(stackView, selectedView)) {
    if (!viewIsDescendantOfView(stackView, selectedView)) {
      if (typeof stackView.removeFromSuperview === 'function') {
        stackView.removeFromSuperview();
      }
      if (typeof selectedView.addSubview === 'function') {
        selectedView.addSubview(stackView);
      }
      didLayout = true;
    }

    didLayout =
      normalizeSelectedTabHostedView(stackView, selectedView, false) ||
      didLayout;
    didLayout =
      setViewBoundsIfNeeded(
        stackView,
        rectWithZeroOrigin(selectedView.bounds ?? selectedView.frame),
      ) || didLayout;
  }

  if (
    navigationView &&
    stackView &&
    !nativeObjectsEqual(navigationView, stackView)
  ) {
    if (
      !viewIsDescendantOfView(navigationView, stackView) &&
      !viewIsDescendantOfView(stackView, navigationView)
    ) {
      if (typeof navigationView.removeFromSuperview === 'function') {
        navigationView.removeFromSuperview();
      }
      if (typeof stackView.addSubview === 'function') {
        stackView.addSubview(navigationView);
      }
      didLayout = true;
    }

    didLayout =
      normalizeSelectedTabHostedView(navigationView, stackView, false) ||
      didLayout;
    didLayout =
      setViewBoundsIfNeeded(
        navigationView,
        rectWithZeroOrigin(stackView.bounds ?? stackView.frame),
      ) || didLayout;
  }

  if (didLayout) {
    markSelectedTabNavigationControllerNeedsLayout(
      embedded.navigationController,
    );
  }

  return didLayout;
}

function selectedTabHostStackNavigationControllerRecordForContainment(
  selectedView: any,
): EmbeddedNavigationControllerRecord | null {
  'worklet';

  if (!selectedView) {
    return null;
  }

  const navigationControllerRecordForHost = (
    globalThis as Record<string, any>
  )[STACK_NAVIGATION_CONTROLLER_RECORD_FOR_HOST_KEY];
  const record =
    typeof navigationControllerRecordForHost === 'function'
      ? callTabsWorkletFunction(navigationControllerRecordForHost, selectedView)
      : null;

  if (!record?.navigationController) {
    return null;
  }

  return rememberSelectedTabEmbeddedNavigationControllerRecord(selectedView, {
    containerView: record.containerView ?? selectedView,
    navigationController: record.navigationController,
    navigationView: record.navigationView ?? record.navigationController.view,
  });
}

function ensureSelectedTabChildNavigationControllerContainment(
  selectedController: any,
  selectedView: any,
) {
  'worklet';
  const startedAt = tabsTraceTimestamp();

  const embedded = selectedTabEmbeddedNavigationControllerRecord(
    selectedController,
    selectedView,
  ) ?? selectedTabHostStackNavigationControllerRecordForContainment(selectedView);
  const navigationController = embedded?.navigationController;
  traceTabsEvent(
    'ensureSelectedTabChildNavigationControllerContainment',
    `selected=${selectedController?.hash ?? ''} nav=${
      navigationController?.hash ?? ''
    }`,
  );

  if (
    !selectedController ||
    !navigationController ||
    nativeObjectsEqual(selectedController, navigationController) ||
    !canInvokeNativeSelector(
      selectedController,
      'addChildViewController',
      'addChildViewController:',
    )
  ) {
    return {
      embedded,
      navigationController,
      didLayoutNavigationController: false,
    };
  }

  const currentParent = parentViewControllerForController(navigationController);

  if (currentParent && nativeObjectsEqual(currentParent, selectedController)) {
    setKnownRootContainedParent(navigationController, selectedController);
    const didLayoutNavigationController =
      layoutSelectedTabEmbeddedNavigationController(selectedView, embedded);
    traceTabsEvent(
      'ensureSelectedTabChildNavigationControllerContainment-current',
      `selected=${selectedController?.hash ?? ''} didLayout=${
        didLayoutNavigationController ? 1 : 0
      }`,
    );
    traceTabsSlow(
      'ensureSelectedTabChildNavigationControllerContainment-current-total',
      startedAt,
    );
    return {
      embedded,
      navigationController,
      didLayoutNavigationController,
    };
  }

  if (currentParent) {
    invokeNativeSelector(
      navigationController,
      'willMoveToParentViewController',
      'willMoveToParentViewController:',
      null,
    );
    invokeNativeSelector(
      navigationController,
      'removeFromParentViewController',
      'removeFromParentViewController',
    );
  }

  invokeNativeSelector(
    selectedController,
    'addChildViewController',
    'addChildViewController:',
    navigationController,
  );
  invokeNativeSelector(
    navigationController,
    'didMoveToParentViewController',
    'didMoveToParentViewController:',
    selectedController,
  );
  // NATIVESCRIPT_PORT_DEVIATION: upstream UITabBarController owns child
  // controller containment in one ObjC hierarchy. The TS stack port may observe
  // proxy-distinct parent/root controllers, so mark the selected tab controller
  // as the root-contained parent proof for nested native-stack modal readiness.
  setKnownRootContainedParent(navigationController, selectedController);
  traceTabsEvent(
    'ensureSelectedTabChildNavigationControllerContainment-attached',
    `selected=${selectedController?.hash ?? ''}`,
  );
  layoutSelectedTabEmbeddedNavigationController(selectedView, embedded);
  markSelectedTabNavigationControllerNeedsLayout(navigationController);
  traceTabsSlow(
    'ensureSelectedTabChildNavigationControllerContainment-attached-total',
    startedAt,
  );

  return {
    embedded,
    navigationController,
    didLayoutNavigationController: true,
  };
}

function tabsScreenViewDidAddSubview(view: any, subview: any) {
  'worklet';

  view?.super?.didAddSubview?.(subview);
  clearSelectedTabEmbeddedNavigationNegativeLookupKey(view);
  const embeddedSubviewRecord = embeddedNavigationControllerRecordOnView(subview);
  if (embeddedSubviewRecord) {
    rememberSelectedTabEmbeddedNavigationControllerRecord(
      view,
      embeddedSubviewRecord,
    );
  }

  const firstSubview = arrayItem(view?.subviews, 0);
  if (!nativeObjectsEqual(firstSubview, subview)) {
    return;
  }

  if (
    view.__rnsNativeScriptIsOverrideScrollViewContentInsetAdjustmentBehaviorSet ===
    true
  ) {
    overrideTabsScreenScrollViewBehaviorInFirstDescendantChainIfNeeded(view);
  } else {
    view.__rnsNativeScriptNeedsScrollViewBehaviorOverride = true;
  }
}

function firstSubviewHandle(view: any): string {
  'worklet';

  const subviews = view?.subviews;
  const firstSubview = arrayItem(subviews, 0);

  return nativeObjectStableHandle(firstSubview);
}

function selectedTabPreparedFastReconcileKey(
  tabController: any,
  selectedController: any,
  selectedView: any,
) {
  'worklet';

  return [
    nativeObjectStableHandle(tabController),
    nativeObjectStableHandle(selectedController),
    nativeObjectStableHandle(selectedView),
    rectKey(selectedView?.frame),
    rectKey(selectedView?.bounds),
    String(arrayCount(selectedView?.subviews)),
    firstSubviewHandle(selectedView),
  ].join('|');
}

function selectedTabFastReconcileKey(
  tabController: any,
  selectedController: any,
  selectedView: any,
) {
  'worklet';

  return [
    selectedTabPreparedFastReconcileKey(
      tabController,
      selectedController,
      selectedView,
    ),
    nativeObjectStableHandle(selectedView?.window),
  ].join('|');
}

function lastSelectedTabFastReconcileKey(view: any) {
  'worklet';

  const storedKey =
    view?.__rnsNativeScriptLastSelectedTabFastReconcileKey ??
    associatedObjectForKey(
      view,
      TABS_LAST_SELECTED_FAST_RECONCILE_KEY_ASSOCIATION_KEY,
    );

  return storedKey == null ? '' : String(storedKey);
}

function lastSelectedTabPreparedFastReconcileKey(view: any) {
  'worklet';

  const storedKey =
    view?.__rnsNativeScriptLastSelectedTabPreparedFastReconcileKey ??
    associatedObjectForKey(
      view,
      TABS_LAST_SELECTED_PREPARED_FAST_RECONCILE_KEY_ASSOCIATION_KEY,
    );

  return storedKey == null ? '' : String(storedKey);
}

function setLastSelectedTabFastReconcileKey(view: any, key: string) {
  'worklet';

  if (!view) {
    return;
  }

  view.__rnsNativeScriptLastSelectedTabFastReconcileKey = key;
  setAssociatedObjectForKey(
    view,
    TABS_LAST_SELECTED_FAST_RECONCILE_KEY_ASSOCIATION_KEY,
    key,
  );
}

function setLastSelectedTabPreparedFastReconcileKey(view: any, key: string) {
  'worklet';

  if (!view) {
    return;
  }

  view.__rnsNativeScriptLastSelectedTabPreparedFastReconcileKey = key;
  setAssociatedObjectForKey(
    view,
    TABS_LAST_SELECTED_PREPARED_FAST_RECONCILE_KEY_ASSOCIATION_KEY,
    key,
  );
}

function selectedTabSubviewWindowIsCompatible(
  subview: any,
  rootWindow: any,
): boolean {
  'worklet';

  if (!rootWindow) {
    return true;
  }

  const subviewWindow = subview?.window;

  return (
    subviewWindow == null ||
    subviewWindow === rootWindow ||
    nativeObjectsEqual(subviewWindow, rootWindow)
  );
}

function attachedDescendantContentCounts(
  view: any,
  rootWindow: any,
  depth = 0,
): SelectedTabContentCounts {
  'worklet';

  if (!view || depth > 16) {
    return { interactive: 0, visible: 0 };
  }

  const subviews =
    typeof NativeScriptRuntime.nativeSubviews === 'function'
      ? NativeScriptRuntime.nativeSubviews(view)
      : view.subviews;
  const count = Array.isArray(subviews)
    ? subviews.length
    : arrayCount(subviews);
  let visibleCount = 0;
  let interactiveCount = 0;

  for (let index = 0; index < count; index += 1) {
    const subview = Array.isArray(subviews)
      ? subviews[index]
      : arrayItem(subviews, index);

    if (
      !subview ||
      subview.hidden === true ||
      (subview.alpha ?? 1) <= 0.01 ||
      !selectedTabSubviewWindowIsCompatible(subview, rootWindow)
    ) {
      continue;
    }

    const frame = subview.frame ?? subview.bounds;
    if (rectHasPositiveSize(frame)) {
      visibleCount += 1;
      if (
        subview.userInteractionEnabled !== false &&
        subview.accessibilityElementsHidden !== true
      ) {
        interactiveCount += 1;
      }
    }

    const childCounts = attachedDescendantContentCounts(
      subview,
      rootWindow,
      depth + 1,
    );
    visibleCount += childCounts.visible;
    interactiveCount += childCounts.interactive;
  }

  return { interactive: interactiveCount, visible: visibleCount };
}

function selectedTabAttachedContentCounts(view: any): SelectedTabContentCounts {
  'worklet';

  return attachedDescendantContentCounts(view, view?.window ?? null);
}

function selectedTabAttachedVisibleDescendantCount(view: any): number {
  'worklet';

  return selectedTabAttachedContentCounts(view).visible;
}

function selectedTabAttachedInteractiveDescendantCount(view: any): number {
  'worklet';

  return selectedTabAttachedContentCounts(view).interactive;
}

export const __nativeScriptSelectedTabAttachedVisibleDescendantCountForTests =
  selectedTabAttachedVisibleDescendantCount;
export const __nativeScriptSelectedTabAttachedInteractiveDescendantCountForTests =
  selectedTabAttachedInteractiveDescendantCount;

function selectedTabEmbeddedStackHasStableReadyContent(
  selectedController: any,
  selectedView: any,
  ignoreTransitionState = false,
) {
  'worklet';

  const embedded =
    selectedTabEmbeddedNavigationControllerRecord(
      selectedController,
      selectedView,
    ) ?? selectedTabHostStackNavigationControllerRecordForContainment(selectedView);
  const navigationController = embedded?.navigationController;

  if (!navigationController) {
    return true;
  }

  const stackHasStableReadyContent = (globalThis as Record<string, any>)[
    STACK_HAS_STABLE_READY_CONTENT_KEY
  ];

  return (
    typeof stackHasStableReadyContent === 'function' &&
    callTabsWorkletFunction(
      stackHasStableReadyContent,
      navigationController,
      ignoreTransitionState,
    ) === true
  );
}

function selectedTabHasCurrentVisibleContentProof(
  tabController: any,
  selectedController: any,
  selectedView: any,
  expectedFastReconcileKey?: string,
  contentCounts?: SelectedTabContentCounts,
) {
  'worklet';

  const resolvedContentCounts =
    contentCounts ?? selectedTabAttachedContentCounts(selectedView);

  let missReason = '';
  if (!selectedView) {
    missReason = 'no-view';
  } else if (selectedView.window == null) {
    missReason = 'offwindow';
  } else if (selectedView.hidden === true) {
    missReason = 'hidden';
  } else if (selectedView.userInteractionEnabled === false) {
    missReason = 'disabled';
  } else if (selectedView.accessibilityElementsHidden === true) {
    missReason = 'accessibility-hidden';
  } else if (selectedView.__rnsNativeScriptSelectedTabHasVisibleContent !== true) {
    missReason = 'no-visible-proof';
  } else if (resolvedContentCounts.visible <= 0) {
    missReason = 'no-visible-descendants';
  } else if (resolvedContentCounts.interactive <= 0) {
    missReason = 'no-interactive-descendants';
  } else if (
    !selectedTabEmbeddedStackHasStableReadyContent(
      selectedController,
      selectedView,
      false,
    )
  ) {
    missReason = 'embedded-stack-not-ready';
  }

  if (missReason) {
    if (shouldTraceTabsWorklets()) {
      traceTabsEvent(
        'selectedTabVisibleContentProof-miss',
        `reason=${missReason} visible=${resolvedContentCounts.visible} ` +
          `interactive=${resolvedContentCounts.interactive}`,
      );
    }
    return false;
  }

  const lastFastReconcileKey = lastSelectedTabFastReconcileKey(selectedView);
  const expectedKey =
    expectedFastReconcileKey ??
    selectedTabFastReconcileKey(tabController, selectedController, selectedView);
  const didMatch = lastFastReconcileKey === expectedKey;
  if (!didMatch && shouldTraceTabsWorklets()) {
    traceTabsEvent(
      'selectedTabVisibleContentProof-miss',
      `reason=key last=${lastFastReconcileKey.length} expected=${expectedKey.length}`,
    );
  }

  return didMatch;
}

function selectedTabHasPreparedVisibleContentProof(
  tabController: any,
  selectedController: any,
  selectedView: any,
  expectedPreparedFastReconcileKey?: string,
  contentCounts?: SelectedTabContentCounts,
) {
  'worklet';

  const resolvedContentCounts =
    contentCounts ?? selectedTabAttachedContentCounts(selectedView);

  let missReason = '';
  if (!selectedView) {
    missReason = 'no-view';
  } else if (selectedView.hidden === true) {
    missReason = 'hidden';
  } else if (selectedView.userInteractionEnabled === false) {
    missReason = 'disabled';
  } else if (selectedView.accessibilityElementsHidden === true) {
    missReason = 'accessibility-hidden';
  } else if (resolvedContentCounts.visible <= 0) {
    missReason = 'no-visible-descendants';
  } else if (resolvedContentCounts.interactive <= 0) {
    missReason = 'no-interactive-descendants';
  } else if (
    !selectedTabEmbeddedStackHasStableReadyContent(
      selectedController,
      selectedView,
      true,
    )
  ) {
    missReason = 'embedded-stack-not-ready';
  }

  if (missReason) {
    if (shouldTraceTabsWorklets()) {
      traceTabsEvent(
        'selectedTabPreparedContentProof-miss',
        `reason=${missReason} visible=${resolvedContentCounts.visible} ` +
          `interactive=${resolvedContentCounts.interactive}`,
      );
    }
    return false;
  }

  const lastPreparedFastReconcileKey =
    lastSelectedTabPreparedFastReconcileKey(selectedView);
  const expectedKey =
    expectedPreparedFastReconcileKey ??
    selectedTabPreparedFastReconcileKey(
      tabController,
      selectedController,
      selectedView,
    );
  const didMatch = lastPreparedFastReconcileKey === expectedKey;
  if (!didMatch && shouldTraceTabsWorklets()) {
    traceTabsEvent(
      'selectedTabPreparedContentProof-miss',
      `reason=key last=${lastPreparedFastReconcileKey.length} expected=${expectedKey.length}`,
    );
  }

  return didMatch;
}

function selectedTabViewAllowsCommitSkip(
  tabController: any,
  selectedController: any,
  selectedView: any,
) {
  'worklet';

  return (
    selectedTabHasCurrentVisibleContentProof(
      tabController,
      selectedController,
      selectedView,
    ) ||
    selectedTabHasPreparedVisibleContentProof(
      tabController,
      selectedController,
      selectedView,
    )
  );
}

function refreshSelectedTabHostedTouchHandlers(view: any) {
  'worklet';

  if (!view || view.hidden === true || (view.alpha ?? 1) <= 0.01) {
    return;
  }

  const viewClassName =
    typeof view.className === 'string'
      ? view.className
      : typeof view.constructor?.name === 'string'
      ? view.constructor.name
      : '';
  if (viewClassName === 'NativeScriptDetachedChildrenTouchSentinel') {
    return;
  }

  if (view.userInteractionEnabled !== true) {
    view.userInteractionEnabled = true;
  }
  if (view.accessibilityElementsHidden === true) {
    view.accessibilityElementsHidden = false;
  }
  if (typeof view.attachDetachedChildrenTouchHandlerIfNeeded === 'function') {
    view.attachDetachedChildrenTouchHandlerIfNeeded();
  }
  if (typeof view.updateDetachedChildrenTouchHandlerOrigin === 'function') {
    view.updateDetachedChildrenTouchHandlerOrigin();
  }
}

function refreshSelectedTabEmbeddedStackTouchSurfaces(
  navigationController: any,
  forceRefresh = true,
  restoreDescendantInteractivity = true,
) {
  'worklet';

  if (!navigationController) {
    return false;
  }

  const refreshVisibleStackTouchSurfaces = (globalThis as Record<string, any>)[
    REFRESH_VISIBLE_STACK_TOUCH_SURFACES_KEY
  ];

  return (
    typeof refreshVisibleStackTouchSurfaces === 'function' &&
    callTabsWorkletFunction(
      refreshVisibleStackTouchSurfaces,
      navigationController,
      forceRefresh,
      restoreDescendantInteractivity,
    ) === true
  );
}

function refreshSelectedTabHostStackTouchSurfaces(
  selectedView: any,
  forceRefresh = true,
  restoreDescendantInteractivity = true,
) {
  'worklet';

  if (!selectedView) {
    return false;
  }

  const refreshVisibleStackTouchSurfacesForHost = (
    globalThis as Record<string, any>
  )[REFRESH_VISIBLE_STACK_TOUCH_SURFACES_FOR_HOST_KEY];

  const didRefresh =
    typeof refreshVisibleStackTouchSurfacesForHost === 'function' &&
    callTabsWorkletFunction(
      refreshVisibleStackTouchSurfacesForHost,
      selectedView,
      forceRefresh,
      restoreDescendantInteractivity,
    ) === true;

  traceTabsEvent(
    'refreshSelectedTabHostStackTouchSurfaces',
    `did=${didRefresh ? 1 : 0} force=${forceRefresh ? 1 : 0} ` +
      `available=${typeof refreshVisibleStackTouchSurfacesForHost === 'function' ? 1 : 0}`,
  );

  return didRefresh;
}

function selectedTabHostStackNavigationControllerRecord(
  selectedView: any,
): EmbeddedNavigationControllerRecord | null {
  'worklet';

  return selectedTabHostStackNavigationControllerRecordForContainment(
    selectedView,
  );
}

function selectedTabEmbeddedStackCanRefreshTouchSurfaces(
  navigationController: any,
) {
  'worklet';

  return !!(
    navigationController?.view?.window ??
    navigationController?.topViewController?.view?.window
  );
}

function refreshSelectedTabControllerTouchSurfacesForFastPath(
  selectedController: any,
  selectedView: any,
  forceRefresh: boolean,
) {
  'worklet';

  const embedded = selectedTabEmbeddedNavigationControllerRecord(
    selectedController,
    selectedView,
  );
  const navigationController = embedded?.navigationController;

  if (
    navigationController &&
    selectedTabEmbeddedStackCanRefreshTouchSurfaces(navigationController)
  ) {
    return refreshSelectedTabEmbeddedStackTouchSurfaces(
      navigationController,
      forceRefresh,
      true,
    );
  }

  if (
    refreshSelectedTabHostStackTouchSurfaces(selectedView, forceRefresh, true)
  ) {
    return true;
  }

  refreshSelectedTabHostedTouchHandlers(selectedView);
  return false;
}

function pushAccessibilityElementIfVisible(elements: any[], nextElement: any) {
  'worklet';

  if (
    !nextElement ||
    nextElement.hidden === true ||
    (nextElement.alpha ?? 1) <= 0.01 ||
    nextElement.accessibilityElementsHidden === true
  ) {
    return false;
  }

  for (let index = 0; index < elements.length; index += 1) {
    if (nativeObjectsEqual(elements[index], nextElement)) {
      return false;
    }
  }

  elements.push(nextElement);
  return true;
}

function accessibilityElementHasContent(element: any): boolean {
  'worklet';

  if (!element) {
    return false;
  }

  const isAccessibilityElement = element.isAccessibilityElement;
  if (
    isAccessibilityElement === true ||
    (typeof isAccessibilityElement === 'function' &&
      isAccessibilityElement.call(element) === true)
  ) {
    return true;
  }

  const accessibilityLabel = element.accessibilityLabel;
  const accessibilityIdentifier = element.accessibilityIdentifier;
  const accessibilityValue = element.accessibilityValue;

  return (
    (accessibilityLabel != null && String(accessibilityLabel).length > 0) ||
    (accessibilityIdentifier != null &&
      String(accessibilityIdentifier).length > 0) ||
    (accessibilityValue != null && String(accessibilityValue).length > 0)
  );
}

function revealAccessibilityElementsForSelectedTabView(view: any) {
  'worklet';

  if (view?.accessibilityElementsHidden === true) {
    view.accessibilityElementsHidden = false;
    return true;
  }

  return false;
}

function appendViewAccessibilityElements(
  elements: any[],
  view: any,
  depth = 0,
): boolean {
  'worklet';

  if (
    !view ||
    depth > 24 ||
    view.hidden === true ||
    (view.alpha ?? 1) <= 0.01 ||
    view.accessibilityElementsHidden === true
  ) {
    return false;
  }

  let viewElements = null;
  try {
    viewElements =
      typeof view.accessibilityElements === 'function'
        ? view.accessibilityElements()
        : view.accessibilityElements;
  } catch (_error) {
    viewElements = null;
  }

  const count = arrayCount(viewElements);
  let didAppend = false;

  for (let index = 0; index < count; index += 1) {
    didAppend =
      pushAccessibilityElementIfVisible(
        elements,
        arrayItem(viewElements, index),
      ) || didAppend;
  }

  if (didAppend) {
    return true;
  }

  if (
    accessibilityElementHasContent(view) &&
    pushAccessibilityElementIfVisible(elements, view)
  ) {
    return true;
  }

  const subviews = view.subviews;
  const subviewCount = arrayCount(subviews);
  for (let index = 0; index < subviewCount; index += 1) {
    didAppend =
      appendViewAccessibilityElements(
        elements,
        arrayItem(subviews, index),
        depth + 1,
      ) || didAppend;
  }

  return didAppend;
}

function selectedTabTopViewController(navigationController: any) {
  'worklet';

  if (!navigationController) {
    return null;
  }

  const viewControllers = navigationController.viewControllers;
  const count = arrayCount(viewControllers);

  return (
    navigationController.topViewController ??
    (count > 0 ? arrayItem(viewControllers, count - 1) : null)
  );
}

function selectedTabActiveScreenView(
  selectedController: any,
  selectedView: any,
  navigationControllerOverride?: any,
) {
  'worklet';

  const navigationController =
    navigationControllerOverride ??
    selectedTabEmbeddedNavigationControllerRecord(
      selectedController,
      selectedView,
    )?.navigationController ??
    selectedTabHostStackNavigationControllerRecordForContainment(selectedView)
      ?.navigationController;
  const topController = selectedTabTopViewController(navigationController);

  return (
    topController?.__nativeScriptScreenView ??
    topController?.view ??
    navigationController?.topViewController?.view ??
    null
  );
}

function publishSelectedTabAccessibilityElements(
  tabController: any,
  selectedController: any,
  selectedView: any,
  navigationControllerOverride?: any,
) {
  'worklet';

  const tabView = tabController?.view;
  if (!tabView || !selectedView) {
    return;
  }

  const navigationController =
    navigationControllerOverride ??
    selectedTabEmbeddedNavigationControllerRecord(
      selectedController,
      selectedView,
    )?.navigationController ??
    selectedTabHostStackNavigationControllerRecordForContainment(selectedView)
      ?.navigationController;
  const activeScreenView = selectedTabActiveScreenView(
    selectedController,
    selectedView,
    navigationController,
  );
  const tabBar = tabController?.tabBar;

  revealAccessibilityElementsForSelectedTabView(tabView);
  revealAccessibilityElementsForSelectedTabView(selectedView);
  revealAccessibilityElementsForSelectedTabView(activeScreenView);
  revealAccessibilityElementsForSelectedTabView(tabBar);

  const elements: any[] = [];

  pushAccessibilityElementIfVisible(
    elements,
    navigationController?.navigationBar,
  );

  const didAppendActiveScreenElements = appendViewAccessibilityElements(
    elements,
    activeScreenView,
  );
  const didAppendSelectedViewElements =
    didAppendActiveScreenElements ||
    appendViewAccessibilityElements(elements, selectedView);

  if (!didAppendSelectedViewElements) {
    pushAccessibilityElementIfVisible(
      elements,
      activeScreenView ?? selectedView,
    );
  }

  pushAccessibilityElementIfVisible(elements, tabBar);

  if (shouldTraceTabsWorklets()) {
    traceTabsEvent(
      'publishSelectedTabAccessibilityElements',
      `nav=${nativeObjectStableHandle(navigationController)} top=${nativeObjectStableHandle(
        selectedTabTopViewController(navigationController),
      )} active=${nativeObjectStableHandle(activeScreenView)} activeSubviews=${arrayCount(
        activeScreenView?.subviews,
      )} appended=${didAppendSelectedViewElements ? 1 : 0} elements=${
        elements.length
      } selectedSubviews=${arrayCount(selectedView?.subviews)}`,
    );
  }

  try {
    tabView.accessibilityElements = null;
  } catch (_error) {
    // Leave UIKit's default traversal in charge if this host rejects clearing.
  }

  revealAccessibilityElementsForSelectedTabView(tabView);
  revealAccessibilityElementsForSelectedTabView(selectedView);
  revealAccessibilityElementsForSelectedTabView(activeScreenView);
  revealAccessibilityElementsForSelectedTabView(tabBar);
}

function finishTabsExplicitSelectionUpdate(
  tabController: any,
  selectedController?: any,
) {
  'worklet';

  const resolvedSelectedController =
    selectedController ?? tabController?.selectedViewController;
  const selectedView = tabsScreenControllerView(resolvedSelectedController);

  if (
    selectedView?.__rnsNativeScriptTabsNeedsPostSelectionTouchRefresh === true
  ) {
    const reconcileSelectedTab = (globalThis as Record<string, any>)[
      RECONCILE_SELECTED_TAB_CONTROLLER_VIEW_KEY
    ];
    if (typeof reconcileSelectedTab === 'function') {
      callTabsWorkletFunction(
        reconcileSelectedTab,
        tabController,
        resolvedSelectedController,
      );
    }
  }

  if (selectedView) {
    publishSelectedTabAccessibilityElements(
      tabController,
      resolvedSelectedController,
      selectedView,
    );
  } else {
    clearPublishedSelectedTabAccessibilityElements(tabController);
  }

  setTabsSelectionObservationSuppressed(tabController, false);
  setTabsHandlingExplicitSelection(tabController, false);
}

function notifySelectedTabAccessibilityLayoutChanged(
  tabController: any,
  selectedController: any,
  selectedView: any,
  navigationController?: any,
) {
  'worklet';

  publishSelectedTabAccessibilityElements(
    tabController,
    selectedController,
    selectedView,
    navigationController,
  );

  if (
    typeof (NativeScriptRuntime as any)
      .notifyUIKitAccessibilityLayoutChanged === 'function'
  ) {
    const notifiedTargets: any[] = [];
    const notifyTarget = (targetView: any) => {
      if (!targetView) {
        return;
      }
      for (let index = 0; index < notifiedTargets.length; index += 1) {
        if (nativeObjectsEqual(notifiedTargets[index], targetView)) {
          return;
        }
      }
      notifiedTargets.push(targetView);
      (NativeScriptRuntime as any).notifyUIKitAccessibilityLayoutChanged(
        targetView,
      );
    };
    notifyTarget(selectedView);
    notifyTarget(navigationController?.view);
    notifyTarget(tabController?.view);
  }
}

function clearSelectedTabNeedsPostSelectionTouchRefresh(selectedView: any) {
  'worklet';

  if (!selectedView) {
    return;
  }

  selectedView.__rnsNativeScriptTabsNeedsPostSelectionTouchRefresh = undefined;
}

function markSelectedTabLiveAfterPreparedWindowAttach(
  tabController: any,
  selectedController: any,
  selectedView: any,
) {
  'worklet';

  selectedView.__rnsNativeScriptSelectedTabHasVisibleContent = true;
  setLastSelectedTabFastReconcileKey(
    selectedView,
    selectedTabFastReconcileKey(tabController, selectedController, selectedView),
  );
  setLastSelectedTabPreparedFastReconcileKey(
    selectedView,
    selectedTabPreparedFastReconcileKey(
      tabController,
      selectedController,
      selectedView,
    ),
  );
}

function reconcileSelectedTabScreenViewAfterWindowAttach(view: any) {
  'worklet';

  if (!view?.window) {
    return;
  }

  const screen = view.__rnsNativeScriptTabsScreenRecord;
  const tabController =
    view.__rnsNativeScriptTabsController ??
    associatedObjectForKey(view, TABS_CONTROLLER_ASSOCIATION_KEY);
  const screenController =
    screen?.controller ??
    view.__rnsNativeScriptTabsSelectedController ??
    associatedObjectForKey(view, OWNING_VIEW_CONTROLLER_ASSOCIATION_KEY);
  const selectedController = tabController?.selectedViewController;

  if (
    !tabController ||
    !screenController ||
    !selectedController ||
    !nativeObjectsEqual(selectedController, screenController)
  ) {
    return;
  }

  const reconcileSelectedTabController = (globalThis as Record<string, any>)[
    RECONCILE_SELECTED_TAB_CONTROLLER_VIEW_KEY
  ];
  if (typeof reconcileSelectedTabController !== 'function') {
    return;
  }

  if (
    selectedTabHasCurrentVisibleContentProof(
      tabController,
      selectedController,
      view,
    )
  ) {
    if (view.__rnsNativeScriptTabsNeedsPostSelectionTouchRefresh === true) {
      refreshSelectedTabControllerTouchSurfacesForFastPath(
        screenController,
        view,
        true,
      );
      clearSelectedTabNeedsPostSelectionTouchRefresh(view);
      traceTabsEvent(
        'tabsScreenView-window-selected-touch-refresh',
        `screen=${screen?.screenKey ?? ''}`,
      );
    }
    notifySelectedTabAccessibilityLayoutChanged(
      tabController,
      selectedController,
      view,
    );
    return;
  }

  if (
    selectedTabHasPreparedVisibleContentProof(
      tabController,
      selectedController,
      view,
    )
  ) {
    if (view.__rnsNativeScriptTabsNeedsPostSelectionTouchRefresh === true) {
      refreshSelectedTabControllerTouchSurfacesForFastPath(
        screenController,
        view,
        true,
      );
      clearSelectedTabNeedsPostSelectionTouchRefresh(view);
      traceTabsEvent(
        'tabsScreenView-window-selected-prepared-touch-refresh',
        `screen=${screen?.screenKey ?? ''}`,
      );
    }
    markSelectedTabLiveAfterPreparedWindowAttach(
      tabController,
      selectedController,
      view,
    );
    notifySelectedTabAccessibilityLayoutChanged(
      tabController,
      selectedController,
      view,
    );
    return;
  }

  traceTabsEvent(
    'tabsScreenView-window-selected-reconcile',
    `screen=${screen?.screenKey ?? ''}`,
  );
  callTabsWorkletFunction(
    reconcileSelectedTabController,
    tabController,
    selectedController,
  );
}

function tabsScreenViewClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[TABS_SCREEN_VIEW_CLASS_KEY];

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

  class RNSTabsScreenNativeScriptView extends UIView {
    didMoveToWindow() {
      'worklet';

      this.super?.didMoveToWindow?.();
      const selectedController = this.__rnsNativeScriptTabsSelectedController;

      if (selectedController) {
        ensureSelectedTabChildNavigationControllerContainment(
          selectedController,
          this,
        );
      }
      reconcileSelectedTabScreenViewAfterWindowAttach(this);
      postSafeAreaDidChangeNotification(this);
    }

    layoutSubviews() {
      'worklet';

      this.super?.layoutSubviews?.();
      reconcileSelectedTabScreenViewAfterWindowAttach(this);
    }

    shouldOverrideScrollViewContentInsetAdjustmentBehavior() {
      'worklet';
      return tabsScreenShouldOverrideScrollViewContentInsetAdjustmentBehavior(
        this,
      );
    }

    overrideScrollViewBehaviorInFirstDescendantChainIfNeeded() {
      'worklet';
      overrideTabsScreenScrollViewBehaviorInFirstDescendantChainIfNeeded(this);
    }

    providerSafeAreaInsets() {
      'worklet';

      return this.safeAreaInsets;
    }

    dispatchSafeAreaDidChangeNotification() {
      'worklet';

      postSafeAreaDidChangeNotification(this);
    }

    safeAreaInsetsDidChange() {
      'worklet';

      this.super?.safeAreaInsetsDidChange?.();
      postSafeAreaDidChangeNotification(this);
    }

    didAddSubview(subview: any) {
      'worklet';
      tabsScreenViewDidAddSubview(this, subview);
    }

    'didAddSubview:'(subview: any) {
      'worklet';
      tabsScreenViewDidAddSubview(this, subview);
    }
  }

  const interopTypes = globalObject.interop?.types;
  const UIEdgeInsets = nativeValue('UIEdgeInsets');
  const exposedMethods = {
    didMoveToWindow: {
      params: [],
      returns: interopTypes?.void,
    },
    layoutSubviews: {
      params: [],
      returns: interopTypes?.void,
    },
    shouldOverrideScrollViewContentInsetAdjustmentBehavior: {
      params: [],
      returns: interopTypes?.bool,
    },
    overrideScrollViewBehaviorInFirstDescendantChainIfNeeded: {
      params: [],
      returns: interopTypes?.void,
    },
    providerSafeAreaInsets: {
      params: [],
      returns: UIEdgeInsets ?? interopTypes?.id,
    },
    dispatchSafeAreaDidChangeNotification: {
      params: [],
      returns: interopTypes?.void,
    },
    safeAreaInsetsDidChange: {
      params: [],
      returns: interopTypes?.void,
    },
    'didAddSubview:': {
      params: UIView ? [UIView] : [],
      returns: interopTypes?.void,
    },
  };

  defineObjCExposedMethods(RNSTabsScreenNativeScriptView, exposedMethods);

  if (typeof UIView.extend === 'function') {
    const methods: Record<string, any> = {};
    const methodNames = Object.getOwnPropertyNames(
      RNSTabsScreenNativeScriptView.prototype,
    );

    for (const methodName of methodNames) {
      if (methodName === 'constructor') {
        continue;
      }

      const descriptor = Object.getOwnPropertyDescriptor(
        RNSTabsScreenNativeScriptView.prototype,
        methodName,
      );

      if (descriptor) {
        Object.defineProperty(methods, methodName, descriptor);
      }
    }

    const TabsScreenViewClass = UIView.extend(methods, {
      exposedMethods,
      name: 'RNSTabsScreenNativeScriptView',
    });
    globalObject[TABS_SCREEN_VIEW_CLASS_KEY] = TabsScreenViewClass;
    return TabsScreenViewClass;
  }

  NativeClassFunction(RNSTabsScreenNativeScriptView);
  globalObject[TABS_SCREEN_VIEW_CLASS_KEY] = RNSTabsScreenNativeScriptView;
  return RNSTabsScreenNativeScriptView;
}

function createTabsScreenView(props: any) {
  'worklet';
  const UIView = tabsScreenViewClass();

  if (!UIView || typeof UIView.alloc !== 'function') {
    const fallbackView = makePlainUIView();
    configureTabsScreenScrollViewBehaviorProvider(fallbackView, props);
    return fallbackView;
  }

  const view = createNativeClassInstance(UIView) ?? makePlainUIView();

  configureTabsScreenScrollViewBehaviorProvider(view, props);
  return view;
}

function reconcileSelectedTabEmbeddedStackModel(navigationController: any) {
  'worklet';

  if (!navigationController) {
    return false;
  }

  const reconcileStackFromExternalHost = (globalThis as Record<string, any>)[
    RECONCILE_STACK_FROM_EXTERNAL_HOST_KEY
  ];

  return (
    typeof reconcileStackFromExternalHost === 'function' &&
    callTabsWorkletFunction(
      reconcileStackFromExternalHost,
      navigationController,
    ) === true
  );
}

function refreshSelectedTabEmbeddedStackContent(
  navigationController: any,
  forceRefresh = true,
) {
  'worklet';

  if (!navigationController) {
    return false;
  }

  const refreshVisibleStackContent = (globalThis as Record<string, any>)[
    REFRESH_VISIBLE_STACK_CONTENT_KEY
  ];

  return (
    typeof refreshVisibleStackContent === 'function' &&
    callTabsWorkletFunction(
      refreshVisibleStackContent,
      navigationController,
      forceRefresh,
    ) === true
  );
}

function disableUnselectedTabControllerViews(
  tabController: any,
  selectedController: any,
) {
  'worklet';

  const controllers = tabController?.viewControllers;
  const count = arrayCount(controllers);
  const selectedView = tabsScreenControllerView(selectedController);

  for (let index = 0; index < count; index += 1) {
    const controller = arrayItem(controllers, index);

    if (!controller || nativeObjectsEqual(controller, selectedController)) {
      continue;
    }

    const view = tabsScreenControllerView(controller);
    if (!view) {
      continue;
    }
    if (
      selectedView &&
      (view === selectedView || nativeObjectsEqual(view, selectedView))
    ) {
      continue;
    }

    if (view.hidden !== true) {
      view.hidden = true;
    }
    if (view.userInteractionEnabled !== false) {
      view.userInteractionEnabled = false;
    }
    if (view.accessibilityElementsHidden !== true) {
      view.accessibilityElementsHidden = true;
    }
  }
}

function revealSelectedTabControllerViewForUIKitSelection(
  selectedController: any,
) {
  'worklet';

  const selectedView = tabsScreenControllerView(selectedController);
  if (!selectedView) {
    return false;
  }

  let didMutate = false;

  if (selectedView.hidden === true) {
    selectedView.hidden = false;
    didMutate = true;
  }
  if (selectedView.userInteractionEnabled !== true) {
    selectedView.userInteractionEnabled = true;
    didMutate = true;
  }
  if (selectedView.accessibilityElementsHidden === true) {
    selectedView.accessibilityElementsHidden = false;
    didMutate = true;
  }

  if (didMutate && typeof selectedView.setNeedsLayout === 'function') {
    selectedView.setNeedsLayout();
  }

  return didMutate;
}

function nativeScriptTabsBottomAccessoryViewClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[TABS_BOTTOM_ACCESSORY_VIEW_CLASS_KEY];

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

  class RNSTabsBottomAccessoryNativeScriptView extends UIView {
    didMoveToWindow() {
      'worklet';
      this.super?.didMoveToWindow?.();

      if (this.window != null) {
        registerTabsBottomAccessoryFrameChanges(this);
        emitTabsBottomAccessoryEnvironmentChange(this);
        handleTabsBottomAccessoryContentVisibility(this);
      } else {
        unregisterTabsBottomAccessoryFrameChanges(this);
      }
    }

    traitCollectionDidChange(previousTraitCollection: any) {
      'worklet';

      tabsBottomAccessoryTraitCollectionDidChange(
        this,
        previousTraitCollection,
      );
    }

    'traitCollectionDidChange:'(previousTraitCollection: any) {
      'worklet';

      return tabsBottomAccessoryTraitCollectionDidChange(
        this,
        previousTraitCollection,
      );
    }

    observeValueForKeyPathOfObjectChangeContext(
      keyPath: string,
      object: any,
      change: any,
      context: any,
    ) {
      'worklet';

      return tabsBottomAccessoryObserveValueForKeyPathOfObjectChangeContext(
        this,
        keyPath,
        object,
        change,
        context,
      );
    }

    'observeValueForKeyPath:ofObject:change:context:'(
      keyPath: string,
      object: any,
      change: any,
      context: any,
    ) {
      'worklet';

      return tabsBottomAccessoryObserveValueForKeyPathOfObjectChangeContext(
        this,
        keyPath,
        object,
        change,
        context,
      );
    }
  }

  const interopTypes = globalObject.interop?.types;
  const exposedMethods = {
    didMoveToWindow: {
      params: [],
      returns: interopTypes?.void,
    },
    'traitCollectionDidChange:': {
      params: [],
      returns: interopTypes?.void,
    },
    'observeValueForKeyPath:ofObject:change:context:': {
      params: [],
      returns: interopTypes?.void,
    },
  };

  defineObjCExposedMethods(
    RNSTabsBottomAccessoryNativeScriptView,
    exposedMethods,
  );

  if (typeof UIView.extend === 'function') {
    const methods: Record<string, any> = {};
    const methodNames = Object.getOwnPropertyNames(
      RNSTabsBottomAccessoryNativeScriptView.prototype,
    );

    for (const methodName of methodNames) {
      if (methodName === 'constructor') {
        continue;
      }

      const descriptor = Object.getOwnPropertyDescriptor(
        RNSTabsBottomAccessoryNativeScriptView.prototype,
        methodName,
      );

      if (descriptor) {
        Object.defineProperty(methods, methodName, descriptor);
      }
    }

    const AccessoryViewClass = UIView.extend(methods, {
      exposedMethods,
      name: 'RNSTabsBottomAccessoryNativeScriptView',
    });
    globalObject[TABS_BOTTOM_ACCESSORY_VIEW_CLASS_KEY] = AccessoryViewClass;
    return AccessoryViewClass;
  }

  NativeClassFunction(RNSTabsBottomAccessoryNativeScriptView);
  globalObject[TABS_BOTTOM_ACCESSORY_VIEW_CLASS_KEY] =
    RNSTabsBottomAccessoryNativeScriptView;
  return RNSTabsBottomAccessoryNativeScriptView;
}

function nativeScriptTabsBottomAccessoryContentViewClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[TABS_BOTTOM_ACCESSORY_CONTENT_VIEW_CLASS_KEY];

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

  class RNSTabsBottomAccessoryContentNativeScriptView extends UIView {
    didMoveToWindow() {
      'worklet';
      this.super?.didMoveToWindow?.();
      registerTabsBottomAccessoryContentView(this);
    }

    traitCollectionDidChange(previousTraitCollection: any) {
      'worklet';

      tabsBottomAccessoryContentTraitCollectionDidChange(
        this,
        previousTraitCollection,
      );
    }

    'traitCollectionDidChange:'(previousTraitCollection: any) {
      'worklet';

      return tabsBottomAccessoryContentTraitCollectionDidChange(
        this,
        previousTraitCollection,
      );
    }
  }

  const interopTypes = globalObject.interop?.types;
  const exposedMethods = {
    didMoveToWindow: {
      params: [],
      returns: interopTypes?.void,
    },
    'traitCollectionDidChange:': {
      params: [],
      returns: interopTypes?.void,
    },
  };

  defineObjCExposedMethods(
    RNSTabsBottomAccessoryContentNativeScriptView,
    exposedMethods,
  );

  if (typeof UIView.extend === 'function') {
    const methods: Record<string, any> = {};
    const methodNames = Object.getOwnPropertyNames(
      RNSTabsBottomAccessoryContentNativeScriptView.prototype,
    );

    for (const methodName of methodNames) {
      if (methodName === 'constructor') {
        continue;
      }

      const descriptor = Object.getOwnPropertyDescriptor(
        RNSTabsBottomAccessoryContentNativeScriptView.prototype,
        methodName,
      );

      if (descriptor) {
        Object.defineProperty(methods, methodName, descriptor);
      }
    }

    const ContentViewClass = UIView.extend(methods, {
      exposedMethods,
      name: 'RNSTabsBottomAccessoryContentNativeScriptView',
    });
    globalObject[TABS_BOTTOM_ACCESSORY_CONTENT_VIEW_CLASS_KEY] =
      ContentViewClass;
    return ContentViewClass;
  }

  NativeClassFunction(RNSTabsBottomAccessoryContentNativeScriptView);
  globalObject[TABS_BOTTOM_ACCESSORY_CONTENT_VIEW_CLASS_KEY] =
    RNSTabsBottomAccessoryContentNativeScriptView;
  return RNSTabsBottomAccessoryContentNativeScriptView;
}

function tabsBottomAccessoryEnvironmentForView(
  accessoryView: any,
): 'regular' | 'inline' {
  'worklet';
  const environment = accessoryView?.traitCollection?.tabAccessoryEnvironment;
  const environmentValues = nativeValue('UITabAccessoryEnvironment');
  const inline =
    environmentValues?.Inline ??
    environmentValues?.inline ??
    nativeValue('UITabAccessoryEnvironmentInline') ??
    1;

  return environment === inline || environment === 'inline'
    ? 'inline'
    : 'regular';
}

function handleTabsBottomAccessoryContentVisibility(accessoryView: any) {
  'worklet';
  const regularContentView =
    accessoryView?.__rnsNativeScriptTabsBottomAccessoryRegularContentView;
  const inlineContentView =
    accessoryView?.__rnsNativeScriptTabsBottomAccessoryInlineContentView;

  if (!regularContentView || !inlineContentView) {
    return;
  }

  const environment = tabsBottomAccessoryEnvironmentForView(accessoryView);

  // Direct port of RNSTabsBottomAccessoryHelper's content-view switching
  // workaround: both environment trees stay mounted, and layer opacity chooses
  // the one that matches UITabAccessoryEnvironment.
  regularContentView.layer.opacity = environment === 'inline' ? 0 : 1;
  inlineContentView.layer.opacity = environment === 'inline' ? 1 : 0;
}

function emitTabsBottomAccessoryEnvironmentChange(accessoryView: any) {
  'worklet';
  const ctx = accessoryView?.__rnsNativeScriptTabsBottomAccessoryEventContext;

  if (!ctx || typeof ctx.emit !== 'function') {
    return;
  }

  ctx.emit('onEnvironmentChange', {
    nativeEvent: {
      environment: tabsBottomAccessoryEnvironmentForView(accessoryView),
    },
  });
}

function notifyTabsBottomAccessoryWrapperFrameChanged(accessoryView: any) {
  'worklet';
  const wrapperView =
    accessoryView?.__rnsNativeScriptTabsBottomAccessoryWrapperView;

  if (!wrapperView) {
    return;
  }

  accessoryView.__rnsNativeScriptTabsBottomAccessoryLastWrapperFrame =
    wrapperView.frame;

  // NATIVESCRIPT_PORT_DEVIATION: upstream RNSTabsBottomAccessoryShadowStateProxy
  // writes the UITabAccessory native wrapper frame into Fabric C++ state so Yoga
  // can adopt the native size. The TS port has no generic shadow-state handle,
  // so it records the frame and asks the generic NativeScript UIKit host to
  // refresh the same mounted view after KVO delivers wrapper movement.
  if (typeof NativeScriptRuntime.refreshUIKitHostView === 'function') {
    NativeScriptRuntime.refreshUIKitHostView(accessoryView);
  }
}

function tabsBottomAccessoryTraitCollectionDidChange(
  accessoryView: any,
  previousTraitCollection: any,
) {
  'worklet';
  accessoryView.super?.traitCollectionDidChange?.(previousTraitCollection);
  emitTabsBottomAccessoryEnvironmentChange(accessoryView);
  handleTabsBottomAccessoryContentVisibility(accessoryView);
}

function tabsBottomAccessoryObserveValueForKeyPathOfObjectChangeContext(
  accessoryView: any,
  keyPath: string,
  object: any,
  change: any,
  context: any,
) {
  'worklet';
  if (keyPath === 'center') {
    notifyTabsBottomAccessoryWrapperFrameChanged(accessoryView);
    return;
  }
  accessoryView.super?.observeValueForKeyPathOfObjectChangeContext?.(
    keyPath,
    object,
    change,
    context,
  );
}

function tabsBottomAccessoryContentTraitCollectionDidChange(
  contentView: any,
  previousTraitCollection: any,
) {
  'worklet';
  contentView.super?.traitCollectionDidChange?.(previousTraitCollection);
  const accessoryView = contentView.__rnsNativeScriptTabsBottomAccessoryView;
  if (accessoryView) {
    handleTabsBottomAccessoryContentVisibility(accessoryView);
  }
}

function unregisterTabsBottomAccessoryFrameChanges(accessoryView: any) {
  'worklet';
  const observedView =
    accessoryView?.__rnsNativeScriptTabsBottomAccessoryObservedWrapperView;

  if (!observedView) {
    return;
  }

  if (typeof observedView.removeObserverForKeyPathContext === 'function') {
    observedView.removeObserverForKeyPathContext(accessoryView, 'center', null);
  } else if (typeof observedView.removeObserverForKeyPath === 'function') {
    observedView.removeObserverForKeyPath(accessoryView, 'center');
  } else if (typeof observedView['removeObserver:forKeyPath:'] === 'function') {
    observedView['removeObserver:forKeyPath:'](accessoryView, 'center');
  }

  accessoryView.__rnsNativeScriptTabsBottomAccessoryObservedWrapperView = null;
}

function registerTabsBottomAccessoryFrameChanges(accessoryView: any) {
  'worklet';
  const wrapperView =
    accessoryView?.__rnsNativeScriptTabsBottomAccessoryWrapperView;

  if (
    !wrapperView ||
    nativeObjectsEqual(
      accessoryView.__rnsNativeScriptTabsBottomAccessoryObservedWrapperView,
      wrapperView,
    )
  ) {
    return;
  }

  unregisterTabsBottomAccessoryFrameChanges(accessoryView);

  const options =
    nativeValue('NSKeyValueObservingOptionInitial') ??
    nativeValue('NSKeyValueObservingOptions')?.Initial ??
    4;

  if (typeof wrapperView.addObserverForKeyPathOptionsContext === 'function') {
    wrapperView.addObserverForKeyPathOptionsContext(
      accessoryView,
      'center',
      options,
      null,
    );
    accessoryView.__rnsNativeScriptTabsBottomAccessoryObservedWrapperView =
      wrapperView;
  } else if (
    typeof wrapperView['addObserver:forKeyPath:options:context:'] === 'function'
  ) {
    wrapperView['addObserver:forKeyPath:options:context:'](
      accessoryView,
      'center',
      options,
      null,
    );
    accessoryView.__rnsNativeScriptTabsBottomAccessoryObservedWrapperView =
      wrapperView;
  }

  notifyTabsBottomAccessoryWrapperFrameChanged(accessoryView);
}

function installTabsBottomAccessoryTraitRegistration(accessoryView: any) {
  'worklet';

  if (
    accessoryView?.__rnsNativeScriptTabsBottomAccessoryTraitRegistration ||
    typeof accessoryView?.registerForTraitChangesWithHandler !== 'function'
  ) {
    return;
  }

  const UITraitTabAccessoryEnvironment = nativeValue(
    'UITraitTabAccessoryEnvironment',
  );
  const NSArray = nativeValue('NSArray');
  const traits =
    UITraitTabAccessoryEnvironment && NSArray?.arrayWithArray
      ? NSArray.arrayWithArray([UITraitTabAccessoryEnvironment])
      : UITraitTabAccessoryEnvironment
      ? [UITraitTabAccessoryEnvironment]
      : null;

  if (!traits) {
    return;
  }

  const registration = accessoryView.registerForTraitChangesWithHandler(
    traits,
    () => {
      'worklet';
      emitTabsBottomAccessoryEnvironmentChange(accessoryView);
      handleTabsBottomAccessoryContentVisibility(accessoryView);
    },
  );

  accessoryView.__rnsNativeScriptTabsBottomAccessoryTraitRegistration =
    registration;
}

function registerTabsBottomAccessoryContentView(contentView: any) {
  'worklet';
  const registry = (globalThis as Record<string, any>)
    .__rnsNativeScriptTabsRegistry;
  const accessoryId = contentView?.__rnsNativeScriptTabsBottomAccessoryId;
  const accessoryRecord = accessoryId
    ? registry?.bottomAccessories?.[accessoryId]
    : null;
  const accessoryView = accessoryRecord?.view;

  if (!contentView || !accessoryView) {
    return;
  }

  const currentAccessory = contentView.__rnsNativeScriptTabsBottomAccessoryView;
  const environment =
    contentView.__rnsNativeScriptTabsBottomAccessoryEnvironment === 'inline'
      ? 'inline'
      : 'regular';

  if (currentAccessory && currentAccessory !== accessoryView) {
    if (
      currentAccessory.__rnsNativeScriptTabsBottomAccessoryRegularContentView ===
      contentView
    ) {
      currentAccessory.__rnsNativeScriptTabsBottomAccessoryRegularContentView =
        null;
    }
    if (
      currentAccessory.__rnsNativeScriptTabsBottomAccessoryInlineContentView ===
      contentView
    ) {
      currentAccessory.__rnsNativeScriptTabsBottomAccessoryInlineContentView =
        null;
    }
  }

  contentView.__rnsNativeScriptTabsBottomAccessoryView = accessoryView;

  if (environment === 'inline') {
    accessoryView.__rnsNativeScriptTabsBottomAccessoryInlineContentView =
      contentView;
  } else {
    accessoryView.__rnsNativeScriptTabsBottomAccessoryRegularContentView =
      contentView;
  }

  handleTabsBottomAccessoryContentVisibility(accessoryView);
}

function attachExistingTabsBottomAccessoryToHost(
  registry: any,
  host: any,
  hostId: string,
) {
  'worklet';
  const accessories = registry?.bottomAccessories;

  if (!accessories || !host || host.bottomAccessory) {
    return;
  }

  for (const accessoryId in accessories) {
    const record = accessories[accessoryId];
    if (record?.hostId !== hostId) {
      continue;
    }
    host.bottomAccessory = record;
    host.bottomAccessoryId = accessoryId;
    return;
  }
}

function updateTabsBottomAccessoryContentRecord(view: any, props: any) {
  'worklet';
  const registry = (globalThis as Record<string, any>)
    .__rnsNativeScriptTabsRegistry ?? { hosts: {}, bottomAccessories: {} };
  (globalThis as Record<string, any>).__rnsNativeScriptTabsRegistry = registry;
  registry.hosts = registry.hosts ?? {};
  registry.bottomAccessories = registry.bottomAccessories ?? {};
  registry.bottomAccessoryContents = registry.bottomAccessoryContents ?? {};

  const contentView = view?.childrenView ?? view?.rootView;
  if (!contentView) {
    return;
  }

  contentView.__rnsNativeScriptTabsBottomAccessoryId = props.accessoryId;
  contentView.__rnsNativeScriptTabsBottomAccessoryEnvironment =
    props.environment === 'inline' ? 'inline' : 'regular';
  const contents =
    registry.bottomAccessoryContents[props.accessoryId] ??
    ({ regular: null, inline: null } as any);
  contents[
    contentView.__rnsNativeScriptTabsBottomAccessoryEnvironment === 'inline'
      ? 'inline'
      : 'regular'
  ] = contentView;
  registry.bottomAccessoryContents[props.accessoryId] = contents;
  registerTabsBottomAccessoryContentView(contentView);
}

function clearTabsBottomAccessoryContentRecord(view: any) {
  'worklet';
  const contentView = view?.childrenView ?? view?.rootView;
  const accessoryView =
    contentView?.__rnsNativeScriptTabsBottomAccessoryView ?? null;

  if (!contentView || !accessoryView) {
    return;
  }

  if (
    accessoryView.__rnsNativeScriptTabsBottomAccessoryRegularContentView ===
    contentView
  ) {
    accessoryView.__rnsNativeScriptTabsBottomAccessoryRegularContentView = null;
  }
  if (
    accessoryView.__rnsNativeScriptTabsBottomAccessoryInlineContentView ===
    contentView
  ) {
    accessoryView.__rnsNativeScriptTabsBottomAccessoryInlineContentView = null;
  }

  contentView.__rnsNativeScriptTabsBottomAccessoryView = null;
  const registry = (globalThis as Record<string, any>)
    .__rnsNativeScriptTabsRegistry;
  const accessoryId = contentView.__rnsNativeScriptTabsBottomAccessoryId;
  const environment =
    contentView.__rnsNativeScriptTabsBottomAccessoryEnvironment === 'inline'
      ? 'inline'
      : 'regular';
  if (accessoryId && registry?.bottomAccessoryContents?.[accessoryId]) {
    registry.bottomAccessoryContents[accessoryId][environment] = null;
  }
  handleTabsBottomAccessoryContentVisibility(accessoryView);
}

function makeTabsBottomAccessoryWrapperView(accessoryView: any) {
  'worklet';
  const UIView = nativeClassValue('UIView');
  if (!UIView || typeof UIView.alloc !== 'function') {
    return null;
  }

  const wrapperView = createNativeClassInstance(UIView);

  if (!wrapperView) {
    return null;
  }

  wrapperView.autoresizingMask = flexibleSizeMask();
  wrapperView.userInteractionEnabled = true;
  invokeNativeSelector(wrapperView, 'addSubview', 'addSubview:', accessoryView);
  accessoryView.frame = wrapperView.bounds;
  accessoryView.autoresizingMask = flexibleSizeMask();
  accessoryView.__rnsNativeScriptTabsBottomAccessoryWrapperView = wrapperView;

  return wrapperView;
}

function setTabControllerBottomAccessory(
  controller: any,
  accessory: any,
  animated: boolean,
) {
  'worklet';

  if (typeof controller?.setBottomAccessoryAnimated === 'function') {
    controller.setBottomAccessoryAnimated(accessory, animated);
  } else if (
    typeof controller?.['setBottomAccessory:animated:'] === 'function'
  ) {
    controller['setBottomAccessory:animated:'](accessory, animated);
  } else {
    controller.bottomAccessory = accessory;
  }
}

function configureTabsBottomAccessory(host: any) {
  'worklet';
  const controller = host?.controller;

  if (!controller) {
    return;
  }

  if (currentIOSMajorVersion() < 26) {
    return;
  }

  const accessoryRecord = host.bottomAccessory;
  const accessoryView = accessoryRecord?.view ?? null;

  if (!accessoryView) {
    if (controller.__rnsNativeScriptTabsBottomAccessoryView) {
      setTabControllerBottomAccessory(controller, null, true);
      controller.__rnsNativeScriptTabsBottomAccessoryView = null;
      controller.__rnsNativeScriptTabsBottomAccessoryWrapperView = null;
    }
    return;
  }

  if (
    nativeObjectsEqual(
      controller.__rnsNativeScriptTabsBottomAccessoryView,
      accessoryView,
    )
  ) {
    const wrapperView =
      controller.__rnsNativeScriptTabsBottomAccessoryWrapperView;
    if (wrapperView) {
      accessoryView.frame = wrapperView.bounds;
      accessoryView.autoresizingMask = flexibleSizeMask();
      notifyTabsBottomAccessoryWrapperFrameChanged(accessoryView);
      handleTabsBottomAccessoryContentVisibility(accessoryView);
    }
    return;
  }

  const UITabAccessory = nativeValue('UITabAccessory');
  if (!UITabAccessory || typeof UITabAccessory.alloc !== 'function') {
    return;
  }

  const wrapperView = makeTabsBottomAccessoryWrapperView(accessoryView);
  if (!wrapperView) {
    return;
  }

  const allocated = UITabAccessory.alloc();
  const bottomAccessory =
    allocated && typeof allocated.initWithContentView === 'function'
      ? allocated.initWithContentView(wrapperView)
      : allocated;

  // Direct port of RNSTabsHostComponentView.updateContainer: the host owns one
  // RNSTabsBottomAccessory child, wraps it in a plain UIView to preserve UIKit's
  // native corner radius, then installs that wrapper through UITabAccessory.
  setTabControllerBottomAccessory(controller, bottomAccessory, true);

  controller.__rnsNativeScriptTabsBottomAccessoryView = accessoryView;
  controller.__rnsNativeScriptTabsBottomAccessoryWrapperView = wrapperView;
  installTabsBottomAccessoryTraitRegistration(accessoryView);
  registerTabsBottomAccessoryFrameChanges(accessoryView);
  handleTabsBottomAccessoryContentVisibility(accessoryView);
}

function updateTabsBottomAccessoryRecord(view: any, props: any, ctx: any) {
  'worklet';
  const registry = (globalThis as Record<string, any>)
    .__rnsNativeScriptTabsRegistry ?? { hosts: {}, bottomAccessories: {} };
  (globalThis as Record<string, any>).__rnsNativeScriptTabsRegistry = registry;
  registry.hosts = registry.hosts ?? {};
  registry.bottomAccessories = registry.bottomAccessories ?? {};
  registry.bottomAccessoryContents = registry.bottomAccessoryContents ?? {};

  const accessoryView = view?.childrenView ?? view?.rootView;
  const record = registry.bottomAccessories[props.accessoryId] ?? {};
  record.accessoryId = props.accessoryId;
  record.hostId = props.hostId;
  record.view = accessoryView;
  registry.bottomAccessories[props.accessoryId] = record;

  if (accessoryView) {
    accessoryView.__rnsNativeScriptTabsBottomAccessoryId = props.accessoryId;
    accessoryView.__rnsNativeScriptTabsBottomAccessoryEventContext = ctx;
    installTabsBottomAccessoryTraitRegistration(accessoryView);
  }

  const host = registry.hosts[props.hostId];
  if (host) {
    host.bottomAccessory = record;
    host.bottomAccessoryId = props.accessoryId;
    configureTabsBottomAccessory(host);
  }

  registerTabsBottomAccessoryContentView(
    registry.bottomAccessoryContents[props.accessoryId]?.regular,
  );
  registerTabsBottomAccessoryContentView(
    registry.bottomAccessoryContents[props.accessoryId]?.inline,
  );
}

function clearTabsBottomAccessoryRecord(view: any, props: any) {
  'worklet';
  const registry = (globalThis as Record<string, any>)
    .__rnsNativeScriptTabsRegistry;
  const host = registry?.hosts?.[props.hostId];
  const accessoryView = view?.childrenView ?? view?.rootView;

  unregisterTabsBottomAccessoryFrameChanges(accessoryView);

  if (host?.bottomAccessoryId === props.accessoryId) {
    host.bottomAccessory = null;
    host.bottomAccessoryId = null;
    configureTabsBottomAccessory(host);
  }

  if (registry?.bottomAccessories) {
    registry.bottomAccessories[props.accessoryId] = undefined;
  }
  if (registry?.bottomAccessoryContents) {
    registry.bottomAccessoryContents[props.accessoryId] = undefined;
  }
}

function layoutHostedReactSubviews(controller: any, rootViewOverride?: any) {
  'worklet';
  const rootView = rootViewOverride ?? controller?.view;
  if (!rootView) {
    return;
  }
  if (typeof rootView.setNeedsLayout === 'function') {
    rootView.setNeedsLayout();
  }
}

function removeControllerFromParent(controller: any, expectedParent: any) {
  'worklet';

  if (!controller) {
    return;
  }

  let parent = parentViewControllerForController(controller);
  const parentHandle = nativeObjectStableHandle(parent);
  const expectedParentHandle = nativeObjectStableHandle(expectedParent);

  if (
    parent &&
    expectedParent &&
    (parent === expectedParent ||
      nativeObjectsEqual(parent, expectedParent) ||
      (parentHandle.length > 0 &&
        expectedParentHandle.length > 0 &&
        parentHandle === expectedParentHandle))
  ) {
    return;
  }

  const expectedParentControllers = expectedParent?.viewControllers;
  const expectedParentControllerCount = arrayCount(expectedParentControllers);
  const controllerHandle = nativeObjectStableHandle(controller);
  for (let index = 0; index < expectedParentControllerCount; index += 1) {
    const expectedController = arrayItem(expectedParentControllers, index);
    const expectedControllerHandle =
      nativeObjectStableHandle(expectedController);

    if (
      expectedController === controller ||
      nativeObjectsEqual(expectedController, controller) ||
      (controllerHandle.length > 0 &&
        expectedControllerHandle.length > 0 &&
        controllerHandle === expectedControllerHandle)
    ) {
      return;
    }
  }

  if (
    !parent ||
    parent === expectedParent ||
    nativeObjectsEqual(parent, expectedParent)
  ) {
    return;
  }

  const parentControllers = parent.viewControllers;
  const nextControllers: any[] = [];
  let didFindController = false;
  const count = arrayCount(parentControllers);

  for (let index = 0; index < count; index++) {
    const existingController = arrayItem(parentControllers, index);
    const existingControllerHandle =
      nativeObjectStableHandle(existingController);

    if (
      existingController === controller ||
      nativeObjectsEqual(existingController, controller) ||
      (controllerHandle.length > 0 &&
        existingControllerHandle.length > 0 &&
        controllerHandle === existingControllerHandle)
    ) {
      didFindController = true;
      continue;
    }

    nextControllers[nextControllers.length] = existingController;
  }

  if (didFindController) {
    const nativeControllers = nativeArrayFromArray(nextControllers);

    if (typeof parent.setViewControllersAnimated === 'function') {
      parent.setViewControllersAnimated(nativeControllers, false);
    } else if (typeof parent.setViewControllers === 'function') {
      parent.setViewControllers(nativeControllers);
    } else {
      parent.viewControllers = nativeControllers;
    }
  }

  parent = parentViewControllerForController(controller);

  if (
    didFindController ||
    (parent &&
      parent !== expectedParent &&
      !nativeObjectsEqual(parent, expectedParent))
  ) {
    if (typeof controller.willMoveToParentViewController === 'function') {
      controller.willMoveToParentViewController(null);
    }
    const controllerView = tabsScreenControllerView(controller);
    if (
      controllerView &&
      typeof controllerView.removeFromSuperview === 'function'
    ) {
      controllerView.removeFromSuperview();
    }
    if (typeof controller.removeFromParentViewController === 'function') {
      controller.removeFromParentViewController();
    }
  }
}

export const __nativeScriptRemoveControllerFromParentForTests =
  removeControllerFromParent;

export const __nativeScriptEnsureSelectedTabChildNavigationControllerContainmentForTests =
  ensureSelectedTabChildNavigationControllerContainment;

function selectedTabReconcileKey(
  _tabController: any,
  selectedController: any,
  selectedView: any,
  navigationController: any,
  embedded?: EmbeddedNavigationControllerRecord | null,
  contentCounts?: SelectedTabContentCounts,
) {
  'worklet';

  const navigationView = navigationController?.view;
  const stackView = navigationController
    ? embedded?.containerView ??
      navigationController.__nativeScriptStackContainerView ??
      associatedObjectForKey(
        navigationController,
        STACK_CONTAINER_VIEW_ASSOCIATION_KEY,
      ) ??
      navigationView
    : undefined;
  const resolvedContentCounts =
    contentCounts ?? selectedTabAttachedContentCounts(selectedView);

  return [
    nativeObjectStableHandle(selectedController),
    nativeObjectStableHandle(selectedView),
    nativeObjectStableHandle(navigationController),
    nativeObjectStableHandle(navigationView),
    nativeObjectStableHandle(stackView),
    rectKey(selectedView?.frame),
    rectKey(selectedView?.bounds),
    rectKey(navigationView?.frame),
    rectKey(navigationView?.bounds),
    String(arrayCount(selectedView?.subviews)),
    firstSubviewHandle(selectedView),
    nativeObjectStableHandle(selectedView?.window),
    String(resolvedContentCounts.visible),
    String(resolvedContentCounts.interactive),
    selectedView?.hidden === true ? 'hidden' : 'visible',
    selectedView?.userInteractionEnabled === false ? 'disabled' : 'enabled',
  ].join('|');
}

function lastSelectedTabReconcileKey(view: any) {
  'worklet';

  const storedKey =
    view?.__rnsNativeScriptLastSelectedTabReconcileKey ??
    associatedObjectForKey(
      view,
      TABS_LAST_SELECTED_RECONCILE_KEY_ASSOCIATION_KEY,
    );

  return storedKey == null ? '' : String(storedKey);
}

function setLastSelectedTabReconcileKey(view: any, key: string) {
  'worklet';

  if (!view) {
    return;
  }

  view.__rnsNativeScriptLastSelectedTabReconcileKey = key;
  setAssociatedObjectForKey(
    view,
    TABS_LAST_SELECTED_RECONCILE_KEY_ASSOCIATION_KEY,
    key,
  );
}

function reconcileSelectedTabControllerView(
  tabController: any,
  explicitSelectedController?: any,
) {
  'worklet';
  const startedAt = tabsTraceTimestamp();
  const selectedController =
    explicitSelectedController ?? tabController?.selectedViewController;
  const selectedView = tabsScreenControllerView(selectedController);
  if (!selectedView || !tabController?.view) {
    traceTabsEvent('reconcileSelectedTabControllerView-missing-view');
    return;
  }
  traceTabsEvent(
    'reconcileSelectedTabControllerView-enter',
    `explicit=${explicitSelectedController ? 1 : 0} selected=${
      selectedController?.hash ?? ''
    }`,
  );
  let stepStartedAt = tabsTraceTimestamp();
  rememberSelectedTabEmbeddedStackOwnership(
    tabController,
    selectedController,
    selectedView,
  );
  setAssociatedObjectForKey(
    selectedView,
    OWNING_VIEW_CONTROLLER_ASSOCIATION_KEY,
    selectedController,
  );
  setAssociatedObjectForKey(
    selectedController,
    TABS_VIEW_ASSOCIATION_KEY,
    selectedView,
  );
  traceTabsSlow('reconcileSelectedTabControllerView-associate', stepStartedAt);
  const fastReconcileKey = selectedTabFastReconcileKey(
    tabController,
    selectedController,
    selectedView,
  );
  const fastContentCounts = selectedTabAttachedContentCounts(selectedView);
  const canSkipFastSelectedTabReconcile =
    selectedTabHasCurrentVisibleContentProof(
      tabController,
      selectedController,
      selectedView,
      fastReconcileKey,
      fastContentCounts,
    );
  if (canSkipFastSelectedTabReconcile) {
    refreshSelectedTabControllerTouchSurfacesForFastPath(
      selectedController,
      selectedView,
      false,
    );
    clearSelectedTabNeedsPostSelectionTouchRefresh(selectedView);
    traceTabsEvent(
      'reconcileSelectedTabControllerView-fast-skip',
      `selected=${selectedController?.hash ?? ''}`,
    );
    notifySelectedTabAccessibilityLayoutChanged(
      tabController,
      selectedController,
      selectedView,
    );
    return;
  }
  stepStartedAt = tabsTraceTimestamp();
  const didRevealSelectedView =
    revealSelectedTabControllerViewForUIKitSelection(selectedController);
  traceTabsSlow('reconcileSelectedTabControllerView-reveal', stepStartedAt);
  if (didRevealSelectedView === true) {
    const afterRevealFastContentCounts =
      selectedTabAttachedContentCounts(selectedView);
    if (
      afterRevealFastContentCounts.visible > 0 &&
      afterRevealFastContentCounts.interactive > 0
    ) {
      selectedView.__rnsNativeScriptSelectedTabHasVisibleContent = true;
      setLastSelectedTabFastReconcileKey(selectedView, fastReconcileKey);
    }
    const canSkipAfterReveal =
      selectedTabHasCurrentVisibleContentProof(
        tabController,
        selectedController,
        selectedView,
        fastReconcileKey,
        afterRevealFastContentCounts,
      );

    if (canSkipAfterReveal) {
      disableUnselectedTabControllerViews(tabController, selectedController);
      refreshSelectedTabControllerTouchSurfacesForFastPath(
        selectedController,
        selectedView,
        false,
      );
      clearSelectedTabNeedsPostSelectionTouchRefresh(selectedView);
      traceTabsEvent(
        'reconcileSelectedTabControllerView-reveal-fast-skip',
        `selected=${selectedController?.hash ?? ''}`,
      );
      notifySelectedTabAccessibilityLayoutChanged(
        tabController,
        selectedController,
        selectedView,
      );
      return;
    }
  }
  stepStartedAt = tabsTraceTimestamp();
  removeControllerFromParent(selectedController, tabController);
  traceTabsSlow(
    'reconcileSelectedTabControllerView-removeParent',
    stepStartedAt,
  );
  const needsPostSelectionTouchRefresh =
    selectedView.__rnsNativeScriptTabsNeedsPostSelectionTouchRefresh === true;
  const preflightHostStackRecord =
    needsPostSelectionTouchRefresh &&
    !embeddedNavigationControllerRecordOnView(selectedView)
      ? selectedTabHostStackNavigationControllerRecord(selectedView)
      : null;
  const didPreflightHostStackAssociation = !!preflightHostStackRecord;
  stepStartedAt = tabsTraceTimestamp();
  const containment = ensureSelectedTabChildNavigationControllerContainment(
    selectedController,
    selectedView,
  );
  rememberSelectedTabEmbeddedStackOwnership(
    tabController,
    selectedController,
    selectedView,
    containment?.embedded,
  );
  traceTabsSlow(
    'reconcileSelectedTabControllerView-containmentStep',
    stepStartedAt,
  );
  const navigationController = containment?.navigationController;
  const hasEmbeddedStackNavigationController = !!navigationController;
  const didReconcileEmbeddedStackModel =
    hasEmbeddedStackNavigationController &&
    reconcileSelectedTabEmbeddedStackModel(navigationController);
  const embeddedStackWasStableReadyBeforeRefresh =
    !hasEmbeddedStackNavigationController ||
    selectedTabEmbeddedStackHasStableReadyContent(
      selectedController,
      selectedView,
      false,
    );
  const shouldRefreshEmbeddedStackContent =
    hasEmbeddedStackNavigationController &&
    (needsPostSelectionTouchRefresh || !embeddedStackWasStableReadyBeforeRefresh);
  const didRefreshEmbeddedStackContent =
    shouldRefreshEmbeddedStackContent &&
    refreshSelectedTabEmbeddedStackContent(navigationController, true);
  const beforeRefreshContentCounts =
    selectedTabAttachedContentCounts(selectedView);
  const currentReconcileKey = selectedTabReconcileKey(
    tabController,
    selectedController,
    selectedView,
    navigationController,
    containment?.embedded,
    beforeRefreshContentCounts,
  );
  const previousReconcileKey = lastSelectedTabReconcileKey(selectedView);
  const isCurrentReconcileKey = previousReconcileKey === currentReconcileKey;
  if (!isCurrentReconcileKey) {
    traceTabsEvent(
      'reconcileSelectedTabControllerView-key-miss',
      `previous=${previousReconcileKey ?? ''} current=${currentReconcileKey}`,
    );
  }
  const attachedVisibleBeforeRefresh = beforeRefreshContentCounts.visible;
  const didRefreshSelectedHost =
    (!isCurrentReconcileKey || attachedVisibleBeforeRefresh === 0) &&
    refreshTabsScreenHostView(selectedView);
  const afterRefreshContentCounts = didRefreshSelectedHost
    ? selectedTabAttachedContentCounts(selectedView)
    : beforeRefreshContentCounts;
  const attachedVisibleAfterRefresh = afterRefreshContentCounts.visible;
  const attachedInteractiveAfterRefresh = afterRefreshContentCounts.interactive;
  const embeddedStackHasStableReadyContent =
    embeddedStackWasStableReadyBeforeRefresh ||
    (hasEmbeddedStackNavigationController &&
      selectedTabEmbeddedStackHasStableReadyContent(
        selectedController,
        selectedView,
        false,
      ));
  selectedView.__rnsNativeScriptSelectedTabHasVisibleContent =
    attachedVisibleAfterRefresh > 0 &&
    attachedInteractiveAfterRefresh > 0 &&
    embeddedStackHasStableReadyContent;
  const canSkipCurrentReconcile =
    attachedVisibleAfterRefresh > 0 &&
    attachedInteractiveAfterRefresh > 0 &&
    embeddedStackHasStableReadyContent &&
    didRefreshSelectedHost !== true &&
    containment?.didLayoutNavigationController !== true &&
    didReconcileEmbeddedStackModel !== true &&
    didRefreshEmbeddedStackContent !== true &&
    isCurrentReconcileKey;
  traceTabsEvent(
    'reconcileSelectedTabControllerView-state',
    `reveal=${didRevealSelectedView ? 1 : 0} refreshHost=${
      didRefreshSelectedHost ? 1 : 0
    } layout=${containment?.didLayoutNavigationController === true ? 1 : 0} ` +
      `embeddedReconcile=${didReconcileEmbeddedStackModel ? 1 : 0} current=${
        isCurrentReconcileKey ? 1 : 0
      } stackReady=${embeddedStackHasStableReadyContent ? 1 : 0} ` +
      `stackRefresh=${didRefreshEmbeddedStackContent ? 1 : 0} ` +
      `attached=${attachedVisibleAfterRefresh} interactive=${attachedInteractiveAfterRefresh}`,
  );

  if (canSkipCurrentReconcile && didRevealSelectedView === true) {
    traceTabsEvent(
      'reconcileSelectedTabControllerView-reveal-current',
      `selected=${selectedController?.hash ?? ''} nav=${
        navigationController?.hash ?? ''
      }`,
    );
    // A hidden selected tab view can still have attached descendants. After
    // revealing it, run the normal layout/flush path so NativeScript's hosted
    // UIKit subtree becomes visible in the same frame as UIKit's tab switch.
  }

  if (didRevealSelectedView !== true && canSkipCurrentReconcile) {
    traceTabsEvent(
      'reconcileSelectedTabControllerView-skip-current',
      `selected=${selectedController?.hash ?? ''} nav=${
        navigationController?.hash ?? ''
      }`,
    );
    notifySelectedTabAccessibilityLayoutChanged(
      tabController,
      selectedController,
      selectedView,
      navigationController,
    );
    return;
  }
  traceTabsEvent(
    'reconcileSelectedTabControllerView-containment',
    `embedded=${hasEmbeddedStackNavigationController ? 1 : 0} nav=${
      navigationController?.hash ?? ''
    } didLayout=${containment?.didLayoutNavigationController === true ? 1 : 0}`,
  );
  disableUnselectedTabControllerViews(tabController, selectedController);
  if (typeof tabController.view.setNeedsLayout === 'function') {
    tabController.view.setNeedsLayout();
  }
  stepStartedAt = tabsTraceTimestamp();
  // Keep UIKit's selected tab root frame intact. The tab bar controller owns
  // this placement; we only normalize visibility/interactivity for the hosted
  // React view and size descendants inside that root.
  normalizeSelectedTabHostedView(
    selectedView,
    undefined,
    !hasEmbeddedStackNavigationController,
  );
  const canNormalizeSelectedSubviews = rectHasPositiveSize(selectedView.bounds);
  if (canNormalizeSelectedSubviews) {
    const selectedSubviews = selectedView.subviews;
    const selectedSubviewCount = arrayCount(selectedSubviews);
    for (let index = 0; index < selectedSubviewCount; index += 1) {
      normalizeSelectedTabHostedView(
        arrayItem(selectedSubviews, index),
        selectedView,
        !hasEmbeddedStackNavigationController,
      );
    }
  }
  if (!hasEmbeddedStackNavigationController) {
    refreshSelectedTabHostedTouchHandlers(selectedView);
  }
  const shouldForceSelectedStackTouchRefresh =
    containment?.didLayoutNavigationController === true ||
    didReconcileEmbeddedStackModel === true ||
    didRefreshEmbeddedStackContent === true ||
    needsPostSelectionTouchRefresh;
  const canRefreshSelectedTabEmbeddedStackTouchSurfaces =
    hasEmbeddedStackNavigationController &&
    selectedTabEmbeddedStackCanRefreshTouchSurfaces(navigationController);
  const shouldSkipSelectedStackTouchRefresh =
    didPreflightHostStackAssociation &&
    needsPostSelectionTouchRefresh &&
    containment?.didLayoutNavigationController !== true &&
    didReconcileEmbeddedStackModel !== true;
  const didRefreshEmbeddedStackTouchSurfaces =
    canRefreshSelectedTabEmbeddedStackTouchSurfaces &&
    !shouldSkipSelectedStackTouchRefresh &&
    refreshSelectedTabEmbeddedStackTouchSurfaces(
      navigationController,
      shouldForceSelectedStackTouchRefresh,
      true,
    );
  const shouldSkipSelectedHostStackTouchRefresh =
    needsPostSelectionTouchRefresh &&
    containment?.didLayoutNavigationController !== true &&
    didReconcileEmbeddedStackModel !== true;
  const didRefreshHostStackTouchSurfaces =
    !didPreflightHostStackAssociation &&
    !didRefreshEmbeddedStackTouchSurfaces &&
    !shouldSkipSelectedHostStackTouchRefresh &&
    refreshSelectedTabHostStackTouchSurfaces(
      selectedView,
      shouldForceSelectedStackTouchRefresh,
      true,
    );
  if (needsPostSelectionTouchRefresh) {
    clearSelectedTabNeedsPostSelectionTouchRefresh(selectedView);
  }
  if (
    didRefreshEmbeddedStackContent ||
    (!hasEmbeddedStackNavigationController &&
      !didRefreshHostStackTouchSurfaces) ||
    (canRefreshSelectedTabEmbeddedStackTouchSurfaces &&
      !didRefreshEmbeddedStackTouchSurfaces &&
      !didRefreshHostStackTouchSurfaces)
  ) {
    layoutHostedReactSubviews(selectedController, selectedView);
  }
  traceTabsSlow(
    'reconcileSelectedTabControllerView-layoutHosted',
    stepStartedAt,
    `embeddedTouch=${
      didRefreshEmbeddedStackTouchSurfaces ? 1 : 0
    } hostTouch=${didRefreshHostStackTouchSurfaces ? 1 : 0} ` +
      `embeddedReconcile=${didReconcileEmbeddedStackModel ? 1 : 0}`,
  );
  notifySelectedTabAccessibilityLayoutChanged(
    tabController,
    selectedController,
    selectedView,
    navigationController,
  );
  if (containment?.didLayoutNavigationController === true) {
    markSelectedTabNavigationControllerNeedsLayout(navigationController);
  }
  const shouldFlushSelectedTabDisplay =
    didRefreshSelectedHost === true ||
    containment?.didLayoutNavigationController === true ||
    didReconcileEmbeddedStackModel === true ||
    didRefreshEmbeddedStackContent === true ||
    !isCurrentReconcileKey;
  if (shouldFlushSelectedTabDisplay) {
    flushSelectedTabDisplay(navigationController?.view);
    flushSelectedTabDisplay(selectedView);
  }
  if (
    hasEmbeddedStackNavigationController &&
    canRefreshSelectedTabEmbeddedStackTouchSurfaces &&
    !didRefreshEmbeddedStackTouchSurfaces &&
    !shouldSkipSelectedStackTouchRefresh
  ) {
    refreshSelectedTabHostedTouchHandlers(selectedView);
    refreshSelectedTabEmbeddedStackTouchSurfaces(
      navigationController,
      shouldForceSelectedStackTouchRefresh,
      true,
    );
  }
  notifySelectedTabAccessibilityLayoutChanged(
    tabController,
    selectedController,
    selectedView,
    navigationController,
  );
  setLastSelectedTabReconcileKey(
    selectedView,
    selectedTabReconcileKey(
      tabController,
      selectedController,
      selectedView,
      navigationController,
      containment?.embedded,
      afterRefreshContentCounts,
    ),
  );
  setLastSelectedTabFastReconcileKey(
    selectedView,
    selectedTabFastReconcileKey(tabController, selectedController, selectedView),
  );
  setLastSelectedTabPreparedFastReconcileKey(
    selectedView,
    selectedTabPreparedFastReconcileKey(
      tabController,
      selectedController,
      selectedView,
    ),
  );
  traceTabsSlow('reconcileSelectedTabControllerView-total', startedAt);
}

function reconcileSelectedTabControllerNow(
  tabController: any,
  explicitSelectedController?: any,
) {
  'worklet';

  reconcileSelectedTabControllerView(tabController, explicitSelectedController);
}

(globalThis as Record<string, any>)[
  RECONCILE_SELECTED_TAB_CONTROLLER_VIEW_KEY
] = reconcileSelectedTabControllerNow;

function publishSelectedTabAccessibilityNow(
  tabController: any,
  explicitSelectedController?: any,
  navigationController?: any,
) {
  'worklet';

  const selectedController =
    explicitSelectedController ?? tabController?.selectedViewController;
  const selectedView = tabsScreenControllerView(selectedController);

  if (!tabController || !selectedController || !selectedView) {
    return false;
  }

  notifySelectedTabAccessibilityLayoutChanged(
    tabController,
    selectedController,
    selectedView,
    navigationController,
  );
  return true;
}

(globalThis as Record<string, any>)[
  PUBLISH_SELECTED_TAB_ACCESSIBILITY_KEY
] = publishSelectedTabAccessibilityNow;

function invalidateSelectedTabVisibleContentProof(selectedController: any) {
  'worklet';

  const selectedView = tabsScreenControllerView(selectedController);
  if (!selectedView) {
    return;
  }

  selectedView.__rnsNativeScriptSelectedTabHasVisibleContent = false;
  setLastSelectedTabReconcileKey(selectedView, '');
  setLastSelectedTabFastReconcileKey(selectedView, '');
  setLastSelectedTabPreparedFastReconcileKey(selectedView, '');
}

function markSelectedTabNeedsPostSelectionRepair(selectedController: any) {
  'worklet';

  const selectedView = tabsScreenControllerView(selectedController);
  if (!selectedView) {
    return;
  }

  selectedView.__rnsNativeScriptTabsNeedsPostSelectionTouchRefresh = true;
  invalidateSelectedTabVisibleContentProof(selectedController);
}

function refreshTabBarItemLayout(tabController: any) {
  'worklet';
  const tabBar = tabController?.tabBar;
  if (!tabBar) {
    return;
  }
  const items = tabBar.items;
  const count = arrayCount(items);
  for (let index = 0; index < count; index++) {
    const item = arrayItem(items, index);
    if (item?.title != null) {
      item.title = '' + item.title;
    }
  }
  if (typeof tabBar.setNeedsLayout === 'function') {
    tabBar.setNeedsLayout();
  }
  if (typeof tabBar.setNeedsUpdateConstraints === 'function') {
    tabBar.setNeedsUpdateConstraints();
  }
  if (typeof tabBar.invalidateIntrinsicContentSize === 'function') {
    tabBar.invalidateIntrinsicContentSize();
  }
}

function refreshVisibleTabBarItems(tabController: any, orderedScreens?: any[]) {
  'worklet';
  const items = tabController?.tabBar?.items;
  if (!items || !orderedScreens) {
    return;
  }
  const count = arrayCount(items);
  for (let index = 0; index < count && index < orderedScreens.length; index++) {
    const screen = orderedScreens[index];
    const controllerItem = screen?.controller?.tabBarItem;
    const item = arrayItem(items, index);
    const title = screen?.title ?? screen?.screenKey;
    const accessibilityLabel = screen?.tabBarItemAccessibilityLabel ?? title;
    if (title == null) {
      continue;
    }
    if (controllerItem) {
      controllerItem.title = '' + title;
      if (accessibilityLabel != null) {
        controllerItem.accessibilityLabel = '' + accessibilityLabel;
      }
    }
    if (item) {
      item.title = '' + title;
      if (accessibilityLabel != null) {
        item.accessibilityLabel = '' + accessibilityLabel;
      }
    }
  }
}

function applyScreenRecordTabItem(screen: any) {
  'worklet';
  const title = screen.title ?? screen.screenKey;
  const accessibilityLabel = screen.tabBarItemAccessibilityLabel ?? title;
  const controller = screen.controller;
  const item = controller?.tabBarItem;
  if (!controller || !item || title == null) {
    return;
  }
  controller.title = '' + title;
  item.title = '' + title;
  if (accessibilityLabel != null) {
    item.accessibilityLabel = '' + accessibilityLabel;
  }
}

function refreshScreenRecordTabBarItems(orderedScreens?: any[]) {
  'worklet';
  if (!orderedScreens) {
    return;
  }
  for (let index = 0; index < orderedScreens.length; index++) {
    applyScreenRecordTabItem(orderedScreens[index]);
  }
}

function finishTabControllerCommit(
  tabController: any,
  orderedScreens?: any[],
  options?: {
    reconcileSelectedController?: boolean;
  },
) {
  'worklet';
  if (!tabController?.view) {
    return;
  }
  refreshScreenRecordTabBarItems(orderedScreens);
  refreshVisibleTabBarItems(tabController, orderedScreens);
  refreshTabBarItemLayout(tabController);
  if (options?.reconcileSelectedController === false) {
    return;
  }
  tabController.view.setNeedsLayout();
  reconcileSelectedTabControllerView(tabController);
}

function applySelectedTabController(
  tabController: any,
  controllers: any[],
  selectedIndex: number,
) {
  'worklet';
  if (selectedIndex < 0) {
    return;
  }
  const selectedController = controllers[selectedIndex];
  if (selectedController) {
    if (
      nativeObjectsEqual(
        tabController?.selectedViewController,
        selectedController,
      )
    ) {
      traceTabsEvent(
        'applySelectedTabController-skip-current',
        `selected=${selectedController?.hash ?? ''}`,
      );
      return;
    }

    invalidateSelectedTabVisibleContentProof(selectedController);
    // Direct port of RNSTabBarController's updateSelectedViewControllerTo:
    // path: select the concrete child controller once and let UIKit derive the
    // selectedIndex. Assigning both properties can schedule duplicate
    // appearance transitions on UITabBarController.
    tabController.selectedViewController = selectedController;
  }
}

function registeredTabScreens(host: any): any[] {
  'worklet';

  return host?.registeredScreens ?? host?.screens ?? [];
}

function setRegisteredTabScreens(host: any, screens: any[]) {
  'worklet';

  if (!host) {
    return;
  }

  host.registeredScreens = screens;
  host.screens = screens;
}

function tabsScreenRecordForController(host: any, controller: any) {
  'worklet';

  if (!host || !controller) {
    return null;
  }

  const directRecord = controller.__rnsNativeScriptTabsScreenRecord;
  if (directRecord) {
    return directRecord;
  }

  const view = tabsScreenControllerView(controller);
  const viewRecord = view?.__rnsNativeScriptTabsScreenRecord;
  if (viewRecord) {
    return viewRecord;
  }

  const controllerHandle = nativeObjectStableHandle(controller);

  const orderedScreens = host.orderedScreens;
  const orderedScreenCount = arrayCount(orderedScreens);
  for (let index = 0; index < orderedScreenCount; index++) {
    const screen = arrayItem(orderedScreens, index);
    const screenControllerHandle =
      screen.controllerHandle ?? nativeObjectStableHandle(screen.controller);
    if (
      nativeObjectsEqual(screen.controller, controller) ||
      (controllerHandle.length > 0 &&
        screenControllerHandle.length > 0 &&
        controllerHandle === screenControllerHandle)
    ) {
      return screen;
    }
  }

  const screens = registeredTabScreens(host);
  for (let index = 0; index < screens.length; index++) {
    const screen = screens[index];
    const screenControllerHandle =
      screen.controllerHandle ?? nativeObjectStableHandle(screen.controller);
    if (
      nativeObjectsEqual(screen.controller, controller) ||
      (controllerHandle.length > 0 &&
        screenControllerHandle.length > 0 &&
        controllerHandle === screenControllerHandle)
    ) {
      return screen;
    }
  }

  return null;
}

function tabsScreenControllerFromHostCandidate(candidate: any) {
  'worklet';

  if (!candidate) {
    return null;
  }

  const associatedController =
    associatedObjectForKey(candidate, OWNING_VIEW_CONTROLLER_ASSOCIATION_KEY) ??
    candidate.__nativeScriptOwningViewController;
  if (associatedController) {
    return associatedController;
  }

  const getHostHandles = (NativeScriptRuntime as any).uikitHostHandlesForView;
  const handles =
    typeof getHostHandles === 'function' ? getHostHandles(candidate) : null;

  if (
    handles?.controllerHandle &&
    typeof NativeScriptRuntime.nativeObjectFromHandle === 'function'
  ) {
    const controller = NativeScriptRuntime.nativeObjectFromHandle(
      handles.controllerHandle,
    );
    if (controller) {
      return controller;
    }
  }

  if (
    handles?.childrenViewHandle &&
    typeof NativeScriptRuntime.nativeObjectFromHandle === 'function'
  ) {
    const childrenView = NativeScriptRuntime.nativeObjectFromHandle(
      handles.childrenViewHandle,
    );
    const childrenController =
      associatedObjectForKey(
        childrenView,
        OWNING_VIEW_CONTROLLER_ASSOCIATION_KEY,
      ) ?? (childrenView as any)?.__nativeScriptOwningViewController;
    if (childrenController) {
      return childrenController;
    }
  }

  return null;
}

function tabsScreenControllerFromCollectedChild(child: any) {
  'worklet';

  refreshTabsScreenHostView(child);

  const directController = tabsScreenControllerFromHostCandidate(child);
  if (directController) {
    return directController;
  }

  const contentController = tabsScreenControllerFromHostCandidate(
    child?.contentView,
  );
  if (contentController) {
    return contentController;
  }

  const subviews =
    typeof NativeScriptRuntime.nativeSubviews === 'function'
      ? NativeScriptRuntime.nativeSubviews(child)
      : [];
  for (let index = 0; index < subviews.length; index++) {
    const controller = tabsScreenControllerFromHostCandidate(subviews[index]);
    if (controller) {
      return controller;
    }
  }

  return null;
}

function collectedOrderedTabScreens(host: any) {
  'worklet';

  if (typeof NativeScriptRuntime.collectedUIKitHostChildren !== 'function') {
    return [];
  }

  const registeredScreens = registeredTabScreens(host);
  const collectedChildren = NativeScriptRuntime.collectedUIKitHostChildren(
    host.controller?.view,
  );
  traceTabsEvent(
    'collectedOrderedTabScreens',
    `collected=${collectedChildren.length} hostScreens=${registeredScreens.length}`,
  );
  const orderedScreens: any[] = [];

  for (let index = 0; index < collectedChildren.length; index++) {
    const controller = tabsScreenControllerFromCollectedChild(
      collectedChildren[index],
    );
    const screen = tabsScreenRecordForController(host, controller);

    if (!screen) {
      continue;
    }

    let alreadyAdded = false;
    for (
      let existingIndex = 0;
      existingIndex < orderedScreens.length;
      existingIndex++
    ) {
      if (
        nativeObjectsEqual(
          orderedScreens[existingIndex].controller,
          screen.controller,
        )
      ) {
        alreadyAdded = true;
        break;
      }
    }

    if (!alreadyAdded) {
      orderedScreens[orderedScreens.length] = {
        ...screen,
        index: orderedScreens.length,
      };
    }
  }

  return orderedScreens;
}

function tabScreenControllerFromFabricChild(child: any) {
  'worklet';

  const directController = child?.controller;
  if (directController) {
    return directController;
  }

  return tabsScreenControllerFromCollectedChild(
    child?.nativeView ??
      child?.childrenView ??
      child?.containerView ??
      child?.componentView,
  );
}

function fabricOrderedTabScreens(
  host: any,
  children: readonly any[] | undefined,
) {
  'worklet';

  if (!children || children.length === 0) {
    return [];
  }

  const registeredScreens = registeredTabScreens(host);
  traceTabsEvent(
    'fabricOrderedTabScreens',
    `children=${children.length} hostScreens=${registeredScreens.length}`,
  );
  const orderedScreens: any[] = [];

  for (let index = 0; index < children.length; index += 1) {
    const controller = tabScreenControllerFromFabricChild(children[index]);
    const screen = tabsScreenRecordForController(host, controller);

    if (!screen) {
      continue;
    }

    let alreadyAdded = false;
    for (
      let existingIndex = 0;
      existingIndex < orderedScreens.length;
      existingIndex += 1
    ) {
      if (
        nativeObjectsEqual(
          orderedScreens[existingIndex].controller,
          screen.controller,
        )
      ) {
        alreadyAdded = true;
        break;
      }
    }

    if (!alreadyAdded) {
      orderedScreens[orderedScreens.length] = {
        ...screen,
        index: orderedScreens.length,
      };
    }
  }

  return orderedScreens;
}

function withSuppressedTabsSelectionObservation(
  tabController: any,
  operation: () => void,
) {
  'worklet';

  if (!tabController) {
    operation();
    return;
  }

  const previousObservationSuppressed =
    tabsSelectionObservationSuppressed(tabController);
  const previousExplicitSelection =
    tabsHandlingExplicitSelection(tabController);
  setTabsSelectionObservationSuppressed(tabController, true);
  setTabsHandlingExplicitSelection(tabController, true);

  try {
    operation();
  } finally {
    setTabsSelectionObservationSuppressed(
      tabController,
      previousObservationSuppressed,
    );
    setTabsHandlingExplicitSelection(tabController, previousExplicitSelection);
  }
}

function shouldAnimateTabViewControllersCommit(): boolean {
  'worklet';
  return false;
}

function appendTabScreenForCommit(
  host: any,
  screen: any,
  controllers: any[],
  orderedScreens: any[],
  selectedIndex: number,
) {
  'worklet';

  if (!screen?.controller) {
    return selectedIndex;
  }

  for (let index = 0; index < orderedScreens.length; index++) {
    const existingScreen = orderedScreens[index];
    if (
      existingScreen.screenKey === screen.screenKey ||
      nativeObjectsEqual(existingScreen.controller, screen.controller)
    ) {
      return selectedIndex;
    }
  }

  if (screen.screenKey === host.selectedScreenKey) {
    selectedIndex = controllers.length;
  }
  removeControllerFromParent(screen.controller, host.controller);
  applyScreenRecordTabItem(screen);
  controllers[controllers.length] = screen.controller;
  orderedScreens[orderedScreens.length] = {
    ...screen,
    index: orderedScreens.length,
  };

  return selectedIndex;
}

function registeredOrderedTabScreens(host: any) {
  'worklet';

  const screens = registeredTabScreens(host);
  const orderedScreens: any[] = [];
  let maxIndex = -1;

  for (let index = 0; index < screens.length; index++) {
    const screen = screens[index];
    if (screen.index > maxIndex) {
      maxIndex = screen.index;
    }
  }

  for (let slot = 0; slot <= maxIndex; slot++) {
    for (let index = 0; index < screens.length; index++) {
      const screen = screens[index];
      if (screen.index === slot) {
        orderedScreens[orderedScreens.length] = screen;
      }
    }
  }

  return orderedScreens;
}

function repairDescendantStackContainmentForTabScreenController(
  controller: any,
) {
  'worklet';

  const view = tabsScreenControllerView(controller);
  if (!view) {
    return false;
  }

  const repairDescendantStackContainment = (
    globalThis as Record<string, any>
  )[REPAIR_DESCENDANT_STACK_CONTAINMENT_FOR_HOST_KEY];
  const didRepair =
    typeof repairDescendantStackContainment === 'function' &&
    callTabsWorkletFunction(repairDescendantStackContainment, view) === true;

  traceTabsEvent(
    'repairDescendantStackContainmentForTabScreen',
    `controller=${controller?.hash ?? ''} did=${didRepair ? 1 : 0}`,
  );

  return didRepair;
}

function prepareTabScreenControllerForNativeSelection(controller: any) {
  'worklet';

  const didRepair =
    repairDescendantStackContainmentForTabScreenController(controller);
  const didReveal =
    revealSelectedTabControllerViewForUIKitSelection(controller);
  const view = tabsScreenControllerView(controller);
  const containment = ensureSelectedTabChildNavigationControllerContainment(
    controller,
    view,
  );

  return didRepair || didReveal || containment.navigationController != null;
}

function associateTabsScreenRecordWithHost(host: any, screen: any) {
  'worklet';

  if (!host?.controller || !screen?.controller) {
    return;
  }

  const view = tabsScreenControllerView(screen.controller);
  if (!view) {
    return;
  }

  view.__rnsNativeScriptTabsController = host.controller;
  setAssociatedObjectForKey(
    view,
    TABS_CONTROLLER_ASSOCIATION_KEY,
    host.controller,
  );
  repairDescendantStackContainmentForTabScreenController(screen.controller);
}

function collectOrderedTabScreens(host: any, fabricChildren?: readonly any[]) {
  'worklet';
  const controllers: any[] = [];
  const orderedScreens: any[] = [];
  let selectedIndex = -1;
  const fabricScreens = fabricOrderedTabScreens(host, fabricChildren);
  const registeredScreens = registeredOrderedTabScreens(host);
  const registeredCount = registeredScreens.length;
  const shouldUseFabricScreens =
    fabricScreens.length > 0 &&
    (registeredCount === 0 || fabricScreens.length >= registeredCount);
  const collectedScreens = shouldUseFabricScreens
    ? []
    : collectedOrderedTabScreens(host);
  const orderedSourceScreens = shouldUseFabricScreens
    ? fabricScreens
    : collectedScreens.length > 0 &&
      (registeredCount === 0 || collectedScreens.length >= registeredCount)
    ? collectedScreens
    : registeredScreens;

  if (
    collectedScreens.length > 0 &&
    collectedScreens.length < registeredCount
  ) {
    traceTabsEvent(
      'collectOrderedTabScreens-partial-collected',
      `collected=${collectedScreens.length} hostScreens=${registeredCount}`,
    );
  }

  for (let index = 0; index < orderedSourceScreens.length; index++) {
    selectedIndex = appendTabScreenForCommit(
      host,
      orderedSourceScreens[index],
      controllers,
      orderedScreens,
      selectedIndex,
    );
  }

  host.orderedScreens = orderedScreens;
  setRegisteredTabScreens(host, registeredTabScreens(host));
  for (let index = 0; index < orderedScreens.length; index += 1) {
    associateTabsScreenRecordWithHost(host, orderedScreens[index]);
  }
  return { controllers, orderedScreens, selectedIndex };
}

function tabControllerViewControllersMatch(
  tabController: any,
  controllers: any[],
) {
  'worklet';

  const currentControllers = tabController?.viewControllers;
  if (arrayCount(currentControllers) !== controllers.length) {
    return false;
  }

  for (let index = 0; index < controllers.length; index += 1) {
    if (
      !nativeObjectsEqual(
        arrayItem(currentControllers, index),
        controllers[index],
      )
    ) {
      return false;
    }
  }

  return true;
}

function tabsScreenRecordKey(screen: any) {
  'worklet';

  const screenKey = screen ? screen.screenKey ?? '' : '';
  const controllerHandle =
    (screen ? screen.controllerHandle : undefined) ??
    nativeObjectStableHandle(screen ? screen.controller : null);
  const index = screen ? screen.index ?? 0 : 0;
  const preventNativeSelection =
    screen && screen.preventNativeSelection === true ? 'prevent' : 'select';
  const popToRoot =
    screen &&
    screen.shouldUseRepeatedTabSelectionPopToRootSpecialEffect === false
      ? 'no-pop'
      : 'pop';
  const scrollToTop =
    screen &&
    screen.shouldUseRepeatedTabSelectionScrollToTopSpecialEffect === false
      ? 'no-scroll'
      : 'scroll';
  const accessibilityLabel = screen
    ? screen.tabBarItemAccessibilityLabel ?? ''
    : '';
  const testID = screen ? screen.tabBarItemTestID ?? '' : '';
  const title = screen ? screen.title ?? '' : '';

  return (
    screenKey +
    '|' +
    controllerHandle +
    '|' +
    ('' + index) +
    '|' +
    preventNativeSelection +
    '|' +
    popToRoot +
    '|' +
    scrollToTop +
    '|' +
    accessibilityLabel +
    '|' +
    testID +
    '|' +
    title
  );
}

function tabsHostCommitModelKey(
  host: any,
  controllers: any[],
  orderedScreens: any[],
  selectedIndex: number,
) {
  'worklet';

  let screenKeys = '';
  for (let index = 0; index < orderedScreens.length; index += 1) {
    if (index > 0) {
      screenKeys += '\u001f';
    }
    screenKeys += tabsScreenRecordKey(orderedScreens[index]);
  }

  let controllerKeys = '';
  for (let index = 0; index < controllers.length; index += 1) {
    if (index > 0) {
      controllerKeys += '\u001f';
    }
    controllerKeys += nativeObjectStableHandle(controllers[index]);
  }

  return (
    (host?.selectedScreenKey ?? '') +
    '\u001e' +
    ('' + selectedIndex) +
    '\u001e' +
    screenKeys +
    '\u001e' +
    controllerKeys
  );
}

function tabsNavigationStatePayload(host: any) {
  'worklet';

  return {
    selectedScreenKey: host?.selectedScreenKey ?? '',
    provenance: host?.provenance ?? 0,
  };
}

function tabsHostRecordForId(hostId: string | undefined) {
  'worklet';

  if (!hostId) {
    return null;
  }

  const key = '__rnsNativeScriptTabsRegistry';
  const globalObject = globalThis as Record<string, any>;
  const registry = globalObject[key];

  return registry?.hosts?.[hostId] ?? null;
}

function canEmitTabsEvent(ctx: any) {
  'worklet';

  return !!ctx && typeof ctx.emit === 'function';
}

function emitTabsSelection(
  ctx: any,
  host: any,
  selectedScreenKey: string,
  options: {
    actionOrigin: TabsActionOrigin;
    hasTriggeredSpecialEffect?: boolean;
    isRepeated?: boolean;
  },
) {
  'worklet';

  if (!host || !selectedScreenKey) {
    return;
  }

  host.selectedScreenKey = selectedScreenKey;
  const wasInitialized = host.navigationStateInitialized === true;

  if (wasInitialized) {
    host.provenance += 1;
  } else {
    host.provenance = 0;
  }
  host.navigationStateInitialized = true;

  if (options.actionOrigin !== 'programmatic-js') {
    host.lastUINavigationStateProvenance = host.provenance;
  }

  if (!canEmitTabsEvent(ctx)) {
    return;
  }

  ctx.emit('onTabSelected', {
    nativeEvent: {
      selectedScreenKey,
      provenance: host.provenance,
      isRepeated: options.isRepeated === true,
      hasTriggeredSpecialEffect: options.hasTriggeredSpecialEffect === true,
      actionOrigin: options.actionOrigin,
    },
  });
}

function tabsHostRecordForController(tabController: any) {
  'worklet';

  const directRecord = tabController?.__rnsNativeScriptTabsHostRecord;
  if (directRecord) {
    return directRecord;
  }

  const key = '__rnsNativeScriptTabsRegistry';
  const globalObject = globalThis as Record<string, any>;
  const registry = globalObject[key];
  const hostId =
    tabController?.__rnsNativeScriptTabsHostId ??
    associatedObjectForKey(tabController, TABS_HOST_ID_ASSOCIATION_KEY);

  if (hostId) {
    return registry?.hosts?.[hostId] ?? null;
  }

  const controllerHandle = nativeObjectStableHandle(tabController);
  const handleHostId =
    controllerHandle.length > 0
      ? registry?.hostControllerHandles?.[controllerHandle]
      : undefined;

  return handleHostId ? registry?.hosts?.[handleHostId] ?? null : null;
}

function tabsControllerSelectedIsMoreNavigationController(
  tabController: any,
  selectedController: any,
) {
  'worklet';

  return (
    selectedController != null &&
    tabController?.moreNavigationController != null &&
    nativeObjectsEqual(
      selectedController,
      tabController.moreNavigationController,
    )
  );
}

function reconcileTabsNavigationStateWithUIKitState(tabController: any) {
  'worklet';

  const host = tabsHostRecordForController(tabController);
  const selectedController = tabController?.selectedViewController;

  traceTabsEvent(
    'reconcileTabsNavigationStateWithUIKitState',
    `hasHost=${!!host} selected=${host?.selectedScreenKey ?? '<none>'}`,
  );

  if (!host || !selectedController) {
    return;
  }

  if (
    tabsSelectionObservationSuppressed(tabController) ||
    tabsHandlingExplicitSelection(tabController)
  ) {
    return;
  }

  if (host.navigationStateInitialized !== true) {
    return;
  }

  if (
    tabsControllerSelectedIsMoreNavigationController(
      tabController,
      selectedController,
    )
  ) {
    return;
  }

  const screen = tabsScreenRecordForController(host, selectedController);
  if (!screen || screen.preventNativeSelection === true) {
    return;
  }

  if (host.selectedScreenKey === screen.screenKey) {
    reconcileSelectedTabControllerNow(tabController, selectedController);
    return;
  }

  // Direct port of RNSTabBarController.reconcileNavigationStateWithUIKitState:
  // setter-observed UIKit drift is an implicit native state update.
  emitTabsSelection(host.hostEventContext, host, screen.screenKey, {
    actionOrigin: 'implicit',
    isRepeated: false,
    hasTriggeredSpecialEffect: false,
  });
  reconcileSelectedTabControllerNow(tabController, selectedController);
}

function tabsHostControllerSetterUsesNativeMethodPolicy() {
  'worklet';

  return typeof NativeScriptRuntime.nativeMethodPolicy === 'function';
}

function tabsHostControllerSetterMethodPolicy() {
  'worklet';

  return {
    callSuperBeforeCallback: true,
    skipCallbackIfAssociatedObjectTruthy: [
      associatedValuePolicyKey(TABS_SUPPRESS_SELECTION_OBSERVATION_FLAG),
      associatedValuePolicyKey(TABS_HANDLING_EXPLICIT_SELECTION_FLAG),
    ],
  };
}

function tabsHostControllerMethodPolicies() {
  'worklet';

  const policy = tabsHostControllerSetterMethodPolicy();
  return {
    setSelectedIndex: policy,
    'setSelectedIndex:': policy,
    setSelectedViewController: policy,
    'setSelectedViewController:': policy,
  };
}

function afterTabsHostControllerSelectedSetter(
  tabController: any,
  methodName: string,
  value: any,
) {
  'worklet';

  if (!tabsHostControllerSetterUsesNativeMethodPolicy()) {
    callNativeScriptTabsControllerSuper(tabController, methodName, value);
  }
  if (
    tabsSelectionObservationSuppressed(tabController) ||
    tabsHandlingExplicitSelection(tabController)
  ) {
    return;
  }
  reconcileTabsNavigationStateWithUIKitState(tabController);
}

function markTabsHostControllerSetterPolicy(callback: any) {
  'worklet';

  if (
    typeof callback !== 'function' ||
    typeof NativeScriptRuntime.nativeMethodPolicy !== 'function'
  ) {
    return callback;
  }

  return NativeScriptRuntime.nativeMethodPolicy(
    callback,
    tabsHostControllerSetterMethodPolicy(),
  );
}

function tabsHostControllerClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[TABS_HOST_CONTROLLER_CLASS_KEY];

  if (existing) {
    return existing;
  }

  const UITabBarController = nativeClassValue('UITabBarController');
  const NativeClassFunction = globalObject.NativeClass;

  if (
    !UITabBarController ||
    (typeof NativeClassFunction !== 'function' &&
      typeof UITabBarController.extend !== 'function')
  ) {
    return UITabBarController;
  }

  class RNSTabsHostNativeScriptController extends UITabBarController {
    setSelectedIndex(selectedIndex: number) {
      'worklet';

      afterTabsHostControllerSelectedSetter(
        this,
        'setSelectedIndex',
        selectedIndex,
      );
    }

    'setSelectedIndex:'(selectedIndex: number) {
      'worklet';

      afterTabsHostControllerSelectedSetter(
        this,
        'setSelectedIndex',
        selectedIndex,
      );
    }

    setSelectedViewController(selectedViewController: any) {
      'worklet';

      afterTabsHostControllerSelectedSetter(
        this,
        'setSelectedViewController',
        selectedViewController,
      );
    }

    'setSelectedViewController:'(selectedViewController: any) {
      'worklet';

      afterTabsHostControllerSelectedSetter(
        this,
        'setSelectedViewController',
        selectedViewController,
      );
    }
  }

  const interopTypes = globalObject.interop?.types;
  const UIViewController = nativeClassValue('UIViewController');
  const NSUInteger =
    interopTypes?.NSUInteger ??
    interopTypes?.NSInteger ??
    interopTypes?.uint64 ??
    interopTypes?.int;
  const viewControllerType =
    UIViewController ?? interopTypes?.id ?? nativeClassValue('NSObject');
  const exposedMethods = {
    'setSelectedIndex:': {
      params: NSUInteger ? [NSUInteger] : [],
      returns: interopTypes?.void,
    },
    'setSelectedViewController:': {
      params: viewControllerType ? [viewControllerType] : [],
      returns: interopTypes?.void,
    },
  };

  defineObjCExposedMethods(RNSTabsHostNativeScriptController, exposedMethods);

  if (typeof UITabBarController.extend === 'function') {
    const methods: Record<string, any> = {};
    const methodNames = Object.getOwnPropertyNames(
      RNSTabsHostNativeScriptController.prototype,
    );

    for (const methodName of methodNames) {
      if (methodName === 'constructor') {
        continue;
      }

      const descriptor = Object.getOwnPropertyDescriptor(
        RNSTabsHostNativeScriptController.prototype,
        methodName,
      );

      if (descriptor) {
        Object.defineProperty(methods, methodName, descriptor);
        methods[methodName] = markTabsHostControllerSetterPolicy(
          methods[methodName],
        );
      }
    }

    const TabsHostControllerClass = UITabBarController.extend(methods, {
      exposedMethods,
      methodPolicies: tabsHostControllerMethodPolicies(),
      name: 'RNSTabsHostNativeScriptController',
    });
    globalObject[TABS_HOST_CONTROLLER_CLASS_KEY] = TabsHostControllerClass;
    return TabsHostControllerClass;
  }

  NativeClassFunction(RNSTabsHostNativeScriptController);
  globalObject[TABS_HOST_CONTROLLER_CLASS_KEY] =
    RNSTabsHostNativeScriptController;
  return RNSTabsHostNativeScriptController;
}

function repeatedTabSelectionPopToRootEnabled(screen: any) {
  'worklet';

  return screen?.shouldUseRepeatedTabSelectionPopToRootSpecialEffect !== false;
}

function repeatedTabSelectionScrollToTopEnabled(screen: any) {
  'worklet';

  return (
    screen?.shouldUseRepeatedTabSelectionScrollToTopSpecialEffect !== false
  );
}

function handleRepeatedTabSelectionSpecialEffect(
  screen: any,
  selectedController: any,
) {
  'worklet';

  // Direct port of RNSTabsScreenViewController +
  // RNSNavigationController repeated-tab special effects: pop-to-root has
  // priority, then the first descendant UIScrollView scrolls to top.
  const navigationController =
    childNavigationControllerForTabScreenController(selectedController);

  if (navigationController) {
    const viewControllers = navigationController.viewControllers;
    if (
      repeatedTabSelectionPopToRootEnabled(screen) &&
      arrayCount(viewControllers) > 1
    ) {
      const poppedControllers =
        navigationController.popToRootViewControllerAnimated(true);
      return arrayCount(poppedControllers) > 0;
    }

    if (repeatedTabSelectionScrollToTopEnabled(screen)) {
      return scrollViewToTop(
        findScrollViewInFirstDescendantChainFrom(
          navigationController.topViewController?.view,
        ),
      );
    }
  } else if (repeatedTabSelectionScrollToTopEnabled(screen)) {
    return scrollViewToTop(
      findScrollViewInFirstDescendantChainFrom(
        tabsScreenControllerView(selectedController),
      ),
    );
  }

  return false;
}

function emitTabsSelectionPrevented(
  ctx: any,
  host: any,
  preventedScreenKey: string | undefined,
) {
  'worklet';

  if (!host || !preventedScreenKey) {
    return;
  }

  const currentState = tabsNavigationStatePayload(host);

  if (!canEmitTabsEvent(ctx)) {
    return;
  }

  ctx.emit('onTabSelectionPrevented', {
    nativeEvent: {
      selectedScreenKey: currentState.selectedScreenKey,
      provenance: currentState.provenance,
      preventedScreenKey,
    },
  });
}

function emitTabsSelectionRejected(
  ctx: any,
  host: any,
  request: TabsHostProps['navStateRequest'],
  rejectionReason: 'stale' | 'repeated',
) {
  'worklet';

  if (!host || !request?.selectedScreenKey) {
    return;
  }

  const currentState = tabsNavigationStatePayload(host);

  if (!canEmitTabsEvent(ctx)) {
    return;
  }

  ctx.emit('onTabSelectionRejected', {
    nativeEvent: {
      selectedScreenKey: currentState.selectedScreenKey,
      provenance: currentState.provenance,
      rejectedScreenKey: request.selectedScreenKey,
      rejectedBaseProvenance: request.baseProvenance,
      rejectionReason,
    },
  });
}

function emitMoreTabSelected(ctx: any, host: any) {
  'worklet';

  if (!host) {
    return;
  }

  const currentState = tabsNavigationStatePayload(host);

  if (!canEmitTabsEvent(ctx)) {
    return;
  }

  ctx.emit('onMoreTabSelected', {
    nativeEvent: currentState,
  });
}

function isTabsNavigationRequestStale(host: any, request: any) {
  'worklet';

  if (!host || !request || host.lastUINavigationStateProvenance == null) {
    return false;
  }

  return request.baseProvenance < host.lastUINavigationStateProvenance;
}

function rememberTabsNavigationRequest(host: any, props: any, ctx?: any) {
  'worklet';
  const request = props.navStateRequest;

  if (!host || !request?.selectedScreenKey) {
    return;
  }

  const samePendingRequest =
    host.pendingNavStateRequest?.selectedScreenKey ===
      request.selectedScreenKey &&
    host.pendingNavStateRequest?.baseProvenance === request.baseProvenance;
  const sameProcessedRequest =
    host.lastNavStateRequestSelectedScreenKey === request.selectedScreenKey &&
    host.lastNavStateRequestBaseProvenance === request.baseProvenance;

  if (samePendingRequest || sameProcessedRequest) {
    return;
  }

  // Mirrors RNSTabsHostComponentView: prop updates only create a pending
  // request. RNSTabBarController applies it after child view controllers exist.
  host.pendingNavStateRequest = {
    selectedScreenKey: request.selectedScreenKey,
    baseProvenance: request.baseProvenance,
  };
  if (canEmitTabsEvent(ctx)) {
    host.hostEventContext = ctx;
  }
}

function markTabsNavigationRequestProcessed(host: any, request: any) {
  'worklet';

  host.lastNavStateRequestSelectedScreenKey = request.selectedScreenKey;
  host.lastNavStateRequestBaseProvenance = request.baseProvenance;
  host.pendingNavStateRequest = undefined;
}

function isPendingTabsNavigationRequestAlreadyCurrent(host: any, request: any) {
  'worklet';

  return (
    host?.navigationStateInitialized === true &&
    !!request?.selectedScreenKey &&
    host.selectedScreenKey === request.selectedScreenKey
  );
}

function applyPendingTabsNavigationRequest(
  host: any,
  controllers: any[],
  orderedScreens: any[],
  ctx: any,
): boolean {
  'worklet';

  const request = host?.pendingNavStateRequest;
  if (!host || !request?.selectedScreenKey) {
    return false;
  }

  let selectedIndex = -1;
  for (let index = 0; index < orderedScreens.length; index++) {
    if (orderedScreens[index].screenKey === request.selectedScreenKey) {
      selectedIndex = index;
      break;
    }
  }

  if (selectedIndex < 0 || selectedIndex >= controllers.length) {
    return false;
  }

  const nextSelectedController = controllers[selectedIndex];

  if (
    host.navigationStateInitialized === true &&
    host.rejectStaleNavStateUpdates === true &&
    isTabsNavigationRequestStale(host, request)
  ) {
    emitTabsSelectionRejected(ctx, host, request, 'stale');
    markTabsNavigationRequestProcessed(host, request);
    return false;
  }

  if (
    host.navigationStateInitialized === true &&
    (isPendingTabsNavigationRequestAlreadyCurrent(host, request) ||
      nativeObjectsEqual(
        host.controller?.selectedViewController,
        nextSelectedController,
      ))
  ) {
    emitTabsSelectionRejected(ctx, host, request, 'repeated');
    markTabsNavigationRequestProcessed(host, request);
    return false;
  }

  // Mirrors RNSTabBarController's programmatic-js request path: accepted JS
  // requests advance the native-owned navigation state and emit onTabSelected.
  applySelectedTabController(host.controller, controllers, selectedIndex);
  emitTabsSelection(ctx, host, request.selectedScreenKey, {
    actionOrigin: 'programmatic-js',
  });
  markTabsNavigationRequestProcessed(host, request);
  return true;
}

function updateTabsHostRecordFromProps(controller: any, props: any, ctx?: any) {
  'worklet';
  const key = '__rnsNativeScriptTabsRegistry';
  const globalObject = globalThis as Record<string, any>;
  const registry = globalObject[key] ?? {
    hostControllerHandles: {},
    hosts: {},
  };
  globalObject[key] = registry;
  registry.hostControllerHandles = registry.hostControllerHandles ?? {};
  const existing = registry.hosts[props.hostId];
  const controllerHandle = nativeObjectStableHandle(controller);
  const host =
    existing ??
    ({
      controller,
      controllerHandle,
      screens: [],
      registeredScreens: [],
      selectedScreenKey: props.navStateRequest.selectedScreenKey,
      provenance: props.navStateRequest.baseProvenance,
      navigationStateInitialized: false,
    } as any);

  controller.__rnsNativeScriptTabsHostId = props.hostId;
  setAssociatedObjectForKey(
    controller,
    TABS_HOST_ID_ASSOCIATION_KEY,
    props.hostId,
  );
  if (controllerHandle.length > 0) {
    registry.hostControllerHandles[controllerHandle] = props.hostId;
  }
  host.controller = controller;
  host.controllerHandle = controllerHandle;
  setRegisteredTabScreens(
    host,
    existing?.registeredScreens ?? existing?.screens ?? host.screens ?? [],
  );
  controller.__rnsNativeScriptTabsHostRecord = host;
  if (canEmitTabsEvent(ctx)) {
    host.hostEventContext = ctx;
  }
  registry.hosts[props.hostId] = host;
  attachExistingTabsBottomAccessoryToHost(registry, host, props.hostId);

  rememberTabsNavigationRequest(host, props, ctx);
  Object.assign(host, {
    controller,
    rejectStaleNavStateUpdates: props.rejectStaleNavStateUpdates === true,
  });

  controller.tabBar.hidden = props.tabBarHidden === true;
  configureTabBarController(controller, props);

  return { registry, host };
}

function commitTabsHost(host: any, ctx?: any) {
  'worklet';
  if (!host?.controller) {
    return;
  }

  const fabricChildren = (ctx as any)?.fabricTransaction?.children;
  traceTabsEvent(
    'commitTabsHost-fabric-children',
    `children=${fabricChildren?.length ?? -1}`,
  );
  const { controllers, orderedScreens, selectedIndex } =
    collectOrderedTabScreens(host, fabricChildren);

  configureTabsBottomAccessory(host);

  if (controllers.length === 0) {
    return;
  }

  const commitModelKey = tabsHostCommitModelKey(
    host,
    controllers,
    orderedScreens,
    selectedIndex,
  );
  const hasPendingRequest =
    host.pendingNavStateRequest?.selectedScreenKey != null;
  const sameCommitModel = host.lastTabsCommitModelKey === commitModelKey;
  const viewControllersMatch = tabControllerViewControllersMatch(
    host.controller,
    controllers,
  );
  const selectedControllerMatches = nativeObjectsEqual(
    host.controller.selectedViewController,
    controllers[selectedIndex],
  );
  const selectedControllerForCommit =
    host.controller.selectedViewController ?? controllers[selectedIndex];
  const selectedViewForCommit = tabsScreenControllerView(
    selectedControllerForCommit,
  );
  const selectedViewAllowsCommitSkip =
    selectedTabViewAllowsCommitSkip(
      host.controller,
      selectedControllerForCommit,
      selectedViewForCommit,
    );
  const hadCommittedTabsModel = host.lastTabsCommitModelKey != null;
  const pendingRequestAlreadyCurrent =
    hasPendingRequest === true &&
    isPendingTabsNavigationRequestAlreadyCurrent(
      host,
      host.pendingNavStateRequest,
    ) &&
    !(
      host.rejectStaleNavStateUpdates === true &&
      isTabsNavigationRequestStale(host, host.pendingNavStateRequest)
    );
  if (
    (!hasPendingRequest || pendingRequestAlreadyCurrent) &&
    viewControllersMatch &&
    selectedControllerMatches
  ) {
    traceTabsEvent(
      pendingRequestAlreadyCurrent
        ? 'commitTabsHost-skip-native-current-request'
        : sameCommitModel
        ? 'commitTabsHost-skip-current'
        : 'commitTabsHost-skip-native-current',
      `selected=${host.selectedScreenKey ?? ''} reconcile=${
        selectedViewAllowsCommitSkip ? 0 : 1
      }`,
    );
    if (pendingRequestAlreadyCurrent) {
      emitTabsSelectionRejected(
        ctx ?? host.hostEventContext,
        host,
        host.pendingNavStateRequest,
        'repeated',
      );
      markTabsNavigationRequestProcessed(host, host.pendingNavStateRequest);
    }
    host.lastTabsCommitModelKey = commitModelKey;
    finishTabControllerCommit(host.controller, orderedScreens, {
      reconcileSelectedController: !selectedViewAllowsCommitSkip,
    });
    return;
  }
  if (host.lastTabsCommitModelKey != null) {
    traceTabsEvent(
      'commitTabsHost-apply',
      `pending=${hasPendingRequest ? 1 : 0} same=${
        sameCommitModel ? 1 : 0
      } controllers=${viewControllersMatch ? 1 : 0} selected=${
        selectedControllerMatches ? 1 : 0
      }`,
    );
  }

  const nativeControllers = nativeArrayFromArray(controllers);

  let requestApplied: boolean | null = null;
  withSuppressedTabsSelectionObservation(host.controller, () => {
    'worklet';

    // Direct port of RNSTabBarController.performContainerUpdate's
    // _isHandlingExplicitSelectionUpdate guard: container commits own the
    // UIKit model update and should not let KVO/observation re-emit it.
    if (typeof host.controller.setViewControllersAnimated === 'function') {
      host.controller.setViewControllersAnimated(
        nativeControllers,
        shouldAnimateTabViewControllersCommit(),
      );
    } else {
      host.controller.viewControllers = nativeControllers;
    }
    requestApplied = applyPendingTabsNavigationRequest(
      host,
      controllers,
      orderedScreens,
      ctx ?? host.hostEventContext,
    );
    if (requestApplied !== true) {
      applySelectedTabController(host.controller, controllers, selectedIndex);
    }
  });
  const didApplyRequest = requestApplied === true;
  host.lastTabsCommitModelKey = tabsHostCommitModelKey(
    host,
    controllers,
    orderedScreens,
    selectedIndex,
  );
  const selectedControllerAfterCommit = host.controller.selectedViewController;
  const selectedViewAfterCommit = tabsScreenControllerView(
    selectedControllerAfterCommit,
  );
  const selectedCommitAlreadyHasCurrentContent =
    selectedTabHasCurrentVisibleContentProof(
      host.controller,
      selectedControllerAfterCommit,
      selectedViewAfterCommit,
    );
  const shouldReconcileSelectedController =
    !hadCommittedTabsModel ||
    !viewControllersMatch ||
    !selectedControllerMatches ||
    (didApplyRequest && !selectedCommitAlreadyHasCurrentContent) ||
    !selectedTabViewAllowsCommitSkip(
      host.controller,
      selectedControllerAfterCommit,
      selectedViewAfterCommit,
    );
  finishTabControllerCommit(host.controller, orderedScreens, {
    reconcileSelectedController: shouldReconcileSelectedController,
  });
}

function commitTabsHostAfterScreenRegistration(host: any, ctx?: any) {
  'worklet';

  if (!host?.controller) {
    return;
  }

  // Native RNSTabsHost receives the mounted tab screen component views during
  // one Fabric mounting transaction. The TS UIKit host can see the host commit
  // before child screen lifecycle worklets populate `host.screens`; when that
  // happens the first commit exits with zero controllers and the tab bar paints
  // empty until another unrelated update. Committing when a screen registers
  // preserves the same native model ownership without using a timer/retry.
  commitTabsHost(host, host.hostEventContext ?? ctx);
}

function upsertTabsScreenRecord(host: any, controller: any, props: any) {
  'worklet';
  const screens = registeredTabScreens(host);
  let existingIndex = -1;

  for (let index = 0; index < screens.length; index++) {
    if (
      screens[index].screenKey === props.screenKey ||
      nativeObjectsEqual(screens[index].controller, controller)
    ) {
      existingIndex = index;
      break;
    }
  }

  const previousRecord =
    existingIndex >= 0 ? screens[existingIndex] : undefined;
  const screenRecord = {
    screenKey: props.screenKey,
    controller,
    controllerHandle: nativeObjectStableHandle(controller),
    index: props.__nativeScriptTabsIndex ?? 0,
    preventNativeSelection: props.preventNativeSelection === true,
    shouldUseRepeatedTabSelectionPopToRootSpecialEffect:
      props.specialEffects?.repeatedTabSelection?.popToRoot !== false,
    shouldUseRepeatedTabSelectionScrollToTopSpecialEffect:
      props.specialEffects?.repeatedTabSelection?.scrollToTop !== false,
    tabBarItemAccessibilityLabel: props.tabBarItemAccessibilityLabel,
    tabBarItemTestID: props.tabBarItemTestID,
    title: props.title ?? props.screenKey,
  };
  const didChange =
    !previousRecord ||
    tabsScreenRecordKey(previousRecord) !== tabsScreenRecordKey(screenRecord);

  if (existingIndex >= 0) {
    screens[existingIndex] = screenRecord;
  } else {
    screens[screens.length] = screenRecord;
  }
  setRegisteredTabScreens(host, screens);

  controller.__rnsNativeScriptTabsScreenRecord = screenRecord;
  const view = tabsScreenControllerView(controller);
  if (view) {
    view.__rnsNativeScriptTabsScreenRecord = screenRecord;
  }

  return didChange;
}

function removeTabsScreenRecord(host: any, controller: any, props: any) {
  'worklet';
  const screens = registeredTabScreens(host);
  for (let index = screens.length - 1; index >= 0; index--) {
    if (
      screens[index].screenKey === props.screenKey ||
      nativeObjectsEqual(screens[index].controller, controller)
    ) {
      for (let moveIndex = index; moveIndex < screens.length - 1; moveIndex++) {
        screens[moveIndex] = screens[moveIndex + 1];
      }
      screens.length = screens.length - 1;
    }
    if (
      controller.__rnsNativeScriptTabsScreenRecord?.screenKey ===
      props.screenKey
    ) {
      controller.__rnsNativeScriptTabsScreenRecord = undefined;
    }
    const view = tabsScreenControllerView(controller);
    if (
      view?.__rnsNativeScriptTabsScreenRecord?.screenKey === props.screenKey
    ) {
      view.__rnsNativeScriptTabsScreenRecord = undefined;
    }
  }
  setRegisteredTabScreens(host, screens);
}

type TabsHostNativeScriptProps = {
  hostId: string;
  navStateRequest: TabsHostProps['navStateRequest'];
  onTabSelected?: (event: NativeSyntheticEvent<TabSelectedEvent>) => void;
  onTabSelectionPrevented?: (
    event: NativeSyntheticEvent<TabSelectionPreventedEvent>,
  ) => void;
  onTabSelectionRejected?: (
    event: NativeSyntheticEvent<TabSelectionRejectedEvent>,
  ) => void;
  onMoreTabSelected?: (
    event: NativeSyntheticEvent<MoreTabSelectedEvent>,
  ) => void;
  rejectStaleNavStateUpdates?: boolean;
  tabBarHidden?: boolean;
  tintColor?: unknown;
  backgroundColor?: unknown;
  layoutDirection?: string;
  tabBarControllerMode?: string;
  tabBarMinimizeBehavior?: string;
  style?: unknown;
  children?: React.ReactNode;
};

const TabsHostController = NativeScriptRuntime.defineUIViewController<
  TabsHostNativeScriptProps,
  any
>({
  debugName: 'RNSTabsHostIOS.NativeScript',
  layout: { sizing: 'fill' },
  createController(ctx: any) {
    'worklet';
    const api = (globalThis as Record<string, any>).__nativeScriptNativeApi;
    const globals = globalThis as Record<string, any>;
    const UITabBarController = tabsHostControllerClass();
    if (!UITabBarController || typeof UITabBarController.alloc !== 'function') {
      throw new Error(
        `UITabBarController is not allocatable in the UI runtime: ${typeof UITabBarController}`,
      );
    }
    const allocated = UITabBarController.alloc();
    const controller =
      allocated && typeof allocated.init === 'function'
        ? allocated.init()
        : allocated;
    controller.__rnsNativeScriptTabsHostId = ctx.hostId;
    configureTabBarController(controller, ctx);
    const delegateProtocol =
      api?.UITabBarControllerDelegate ?? globals.UITabBarControllerDelegate;
    const emitSelection = (
      host: any,
      selectedController: any,
      repeated: boolean,
      hasTriggeredSpecialEffect = false,
    ) => {
      'worklet';
      const screen = tabsScreenRecordForController(host, selectedController);
      if (!screen) {
        return null;
      }
      const selectedScreenKey = screen.screenKey;
      emitTabsSelection(ctx, host, selectedScreenKey, {
        actionOrigin: 'user',
        isRepeated: repeated,
        hasTriggeredSpecialEffect,
      });
      return selectedScreenKey;
    };
    ctx.delegate(
      controller,
      delegateProtocol,
      {
        tabBarControllerShouldSelectTab(_tabController: any, tab: any) {
          'worklet';
          traceTabsEvent('shouldSelectTab-enter');
          const host =
            tabsHostRecordForId(ctx.hostId) ??
            tabsHostRecordForController(_tabController);
          if (!host) {
            return true;
          }
          const nextController = tab?.viewController;
          const screen = tabsScreenRecordForController(host, nextController);
          traceTabsEvent(
            'shouldSelectTab-screen',
            `screen=${screen?.screenKey ?? '<none>'} selected=${
              host.selectedScreenKey
            }`,
          );
          if (!screen) {
            return true;
          }
          if (screen.preventNativeSelection === true) {
            emitTabsSelectionPrevented(ctx, host, screen.screenKey);
            return false;
          }
          if (host.selectedScreenKey === screen.screenKey) {
            emitSelection(
              host,
              nextController,
              true,
              handleRepeatedTabSelectionSpecialEffect(screen, nextController),
            );
            return false;
          }
          host.skipNextDidSelectScreenKey = undefined;
          prepareTabScreenControllerForNativeSelection(nextController);
          setTabsHandlingExplicitSelection(_tabController, true);
          return true;
        },
        tabBarControllerDidSelectTabPreviousTab(
          _tabController: any,
          selectedTab: any,
        ) {
          'worklet';
          traceTabsEvent('didSelectTab-enter');
          const selectedController = selectedTab?.viewController;
          const host =
            tabsHostRecordForId(ctx.hostId) ??
            tabsHostRecordForController(_tabController);
          if (!host) {
            finishTabsExplicitSelectionUpdate(_tabController, selectedController);
            return;
          }
          if (
            tabsControllerSelectedIsMoreNavigationController(
              _tabController,
              selectedController,
            )
          ) {
            emitMoreTabSelected(ctx, host);
            finishTabsExplicitSelectionUpdate(_tabController, selectedController);
            return;
          }
          const screen = tabsScreenRecordForController(
            host,
            selectedController,
          );
          traceTabsEvent(
            'didSelectTab-screen',
            `screen=${screen?.screenKey ?? '<none>'} selected=${
              host.selectedScreenKey
            }`,
          );
          if (!screen) {
            finishTabsExplicitSelectionUpdate(_tabController, selectedController);
            return;
          }
          if (host.skipNextDidSelectScreenKey === screen.screenKey) {
            host.skipNextDidSelectScreenKey = undefined;
            finishTabsExplicitSelectionUpdate(_tabController, selectedController);
            return;
          }
          const repeated = host.selectedScreenKey === screen.screenKey;
          emitSelection(
            host,
            selectedController,
            repeated,
            repeated
              ? handleRepeatedTabSelectionSpecialEffect(
                  screen,
                  selectedController,
                )
              : false,
          );
          if (!repeated) {
            markSelectedTabNeedsPostSelectionRepair(selectedController);
          }
          host.skipNextDidSelectScreenKey = screen.screenKey;
          finishTabsExplicitSelectionUpdate(_tabController, selectedController);
        },
        tabBarControllerShouldSelectViewController(
          _tabController: any,
          selectedController: any,
        ) {
          'worklet';
          traceTabsEvent('shouldSelectVC-enter');
          const host =
            tabsHostRecordForId(ctx.hostId) ??
            tabsHostRecordForController(_tabController);
          if (!host) {
            return true;
          }
          const screen = tabsScreenRecordForController(
            host,
            selectedController,
          );
          traceTabsEvent(
            'shouldSelectVC-screen',
            `screen=${screen?.screenKey ?? '<none>'} selected=${
              host.selectedScreenKey
            }`,
          );
          if (!screen) {
            return true;
          }
          if (screen.preventNativeSelection === true) {
            emitTabsSelectionPrevented(ctx, host, screen.screenKey);
            return false;
          }
          if (host.selectedScreenKey === screen.screenKey) {
            emitSelection(
              host,
              selectedController,
              true,
              handleRepeatedTabSelectionSpecialEffect(
                screen,
                selectedController,
              ),
            );
            return false;
          }
          host.skipNextDidSelectScreenKey = undefined;
          prepareTabScreenControllerForNativeSelection(selectedController);
          setTabsHandlingExplicitSelection(_tabController, true);
          return true;
        },
        tabBarControllerDidSelectViewController(
          _tabController: any,
          selectedController: any,
        ) {
          'worklet';
          traceTabsEvent('didSelectVC-enter');
          const host =
            tabsHostRecordForId(ctx.hostId) ??
            tabsHostRecordForController(_tabController);
          if (!host) {
            finishTabsExplicitSelectionUpdate(_tabController, selectedController);
            return;
          }
          if (
            tabsControllerSelectedIsMoreNavigationController(
              _tabController,
              selectedController,
            )
          ) {
            emitMoreTabSelected(ctx, host);
            finishTabsExplicitSelectionUpdate(_tabController, selectedController);
            return;
          }
          const screen = tabsScreenRecordForController(
            host,
            selectedController,
          );
          traceTabsEvent(
            'didSelectVC-screen',
            `screen=${screen?.screenKey ?? '<none>'} selected=${
              host.selectedScreenKey
            }`,
          );
          if (!screen) {
            finishTabsExplicitSelectionUpdate(_tabController, selectedController);
            return;
          }
          if (host.skipNextDidSelectScreenKey === screen.screenKey) {
            host.skipNextDidSelectScreenKey = undefined;
            finishTabsExplicitSelectionUpdate(_tabController, selectedController);
            return;
          }
          const repeated = host.selectedScreenKey === screen.screenKey;
          emitSelection(
            host,
            selectedController,
            repeated,
            repeated
              ? handleRepeatedTabSelectionSpecialEffect(
                  screen,
                  selectedController,
                )
              : false,
          );
          if (!repeated) {
            markSelectedTabNeedsPostSelectionRepair(selectedController);
          }
          host.skipNextDidSelectScreenKey = screen.screenKey;
          finishTabsExplicitSelectionUpdate(_tabController, selectedController);
        },
      },
      {
        thread: 'caller',
        assignTo: {
          object: controller,
          property: 'delegate',
        },
      },
    );
    return controller;
  },
  hostView(controller: any) {
    'worklet';
    return controller.view;
  },
  childrenView(controller: any) {
    'worklet';
    return controller.view;
  },
  update(controller: any, props: any, _previousProps: any, ctx: any) {
    'worklet';
    let phase = 'start';
    try {
      phase = 'host-record';
      updateTabsHostRecordFromProps(controller, props, ctx);
    } catch (error) {
      throw new Error('RNSTabsHost update failed at ' + phase + ': ' + error);
    }
  },
  mounted(controller: any, props: any, ctx: any) {
    'worklet';
    updateTabsHostRecordFromProps(controller, props, ctx);
  },
  refresh(controller: any, props: any, _previousProps: any, ctx: any) {
    'worklet';
    const { registry, host } = updateTabsHostRecordFromProps(
      controller,
      props,
      ctx,
    );
    if (!registry.hosts[props.hostId]) {
      return;
    }
    commitTabsHost(host, ctx);
  },
  transactionCommitted(
    controller: any,
    props: any,
    _previousProps: any,
    ctx: any,
  ) {
    'worklet';
    const { registry, host } = updateTabsHostRecordFromProps(
      controller,
      props,
      ctx,
    );
    if (!registry.hosts[props.hostId]) {
      return;
    }
    commitTabsHost(host, ctx);
  },
  dispose(_controller: any, props: any) {
    'worklet';
    const key = '__rnsNativeScriptTabsRegistry';
    const globalObject = globalThis as Record<string, any>;
    const registry = globalObject[key];
    if (registry?.hosts) {
      const host = registry.hosts[props.hostId];
      const controllerHandle = host?.controllerHandle;
      if (
        controllerHandle &&
        registry.hostControllerHandles?.[controllerHandle] === props.hostId
      ) {
        registry.hostControllerHandles[controllerHandle] = undefined;
      }
      registry.hosts[props.hostId] = undefined;
    }
  },
});

const TabsScreenController = NativeScriptRuntime.defineUIViewController<
  TabsScreenNativeScriptProps & { hostId: string; style?: unknown },
  any
>({
  debugName: 'RNSTabsScreenIOS.NativeScript',
  layout: { sizing: 'fill' },
  createController(props: any) {
    'worklet';
    const api = (globalThis as Record<string, any>).__nativeScriptNativeApi;
    const globals = globalThis as Record<string, any>;
    const UIViewController =
      tabsScreenControllerClass() ??
      api?.UIViewController ??
      globals.UIViewController;
    if (!UIViewController) {
      throw new Error(
        `UIViewController is not allocatable in the UI runtime: ${typeof UIViewController}`,
      );
    }
    const controller = createNativeClassInstance(UIViewController);
    if (!controller) {
      throw new Error('UIViewController allocation failed in the UI runtime');
    }
    installTabsScreenLifecycleMethodsOnController(controller);
    const view = createTabsScreenView(props);
    if (view) {
      // NativeScript's ObjC bridge can expose UIViewController.view as nullish
      // during lazy UIKit loading; keep the component-view equivalent on the
      // controller so children mount into the same UIView every commit.
      controller.__rnsNativeScriptTabsView = view;
      view.__nativeScriptOwningViewController = controller;
      setAssociatedObjectForKey(controller, TABS_VIEW_ASSOCIATION_KEY, view);
      setAssociatedObjectForKey(
        view,
        OWNING_VIEW_CONTROLLER_ASSOCIATION_KEY,
        controller,
      );
      controller.view = view;
    }
    const UIColor = api?.UIColor ?? globals.UIColor;
    const controllerView = tabsScreenControllerView(controller);
    if (controllerView && UIColor?.systemBackgroundColor) {
      controllerView.backgroundColor = UIColor.systemBackgroundColor;
    }

    controller.title = props.title ?? props.screenKey;
    controller.tabBarItem = makeTabBarItem(props, props);
    return controller;
  },
  childrenView(controller: any) {
    'worklet';
    return tabsScreenControllerView(controller);
  },
  update(controller: any, props: any, _previousProps: any, ctx: any) {
    'worklet';
    controller.__rnsNativeScriptTabsEventContext = ctx;
    configureTabsScreenScrollViewBehaviorProvider(
      tabsScreenControllerView(controller),
      props,
    );
    controller.title = props.title ?? props.screenKey;
    if (controller.tabBarItem) {
      configureTabBarItem(controller.tabBarItem, props, ctx);
    } else {
      controller.tabBarItem = makeTabBarItem(props, ctx);
    }

    const key = '__rnsNativeScriptTabsRegistry';
    const globalObject = globalThis as Record<string, any>;
    const registry = globalObject[key] ?? { hosts: {} };
    globalObject[key] = registry;
    const host = registry.hosts[props.hostId] ?? {
      screens: [],
      registeredScreens: [],
      selectedScreenKey: props.screenKey,
      provenance: 0,
    };
    registry.hosts[props.hostId] = host;
    const didChange = upsertTabsScreenRecord(host, controller, props);
    if (didChange || !host.controller?.viewControllers) {
      commitTabsHostAfterScreenRegistration(host, ctx);
    }
  },
  mounted(controller: any, props: any, ctx: any) {
    'worklet';
    controller.__rnsNativeScriptTabsEventContext = ctx;
    configureTabsScreenScrollViewBehaviorProvider(
      tabsScreenControllerView(controller),
      props,
    );
    const key = '__rnsNativeScriptTabsRegistry';
    const globalObject = globalThis as Record<string, any>;
    const registry = globalObject[key] ?? { hosts: {} };
    globalObject[key] = registry;
    const host = registry.hosts[props.hostId] ?? {
      screens: [],
      registeredScreens: [],
      selectedScreenKey: props.screenKey,
      provenance: 0,
    };
    registry.hosts[props.hostId] = host;
    const didChange = upsertTabsScreenRecord(host, controller, props);
    if (didChange || !host.controller?.viewControllers) {
      commitTabsHostAfterScreenRegistration(host, ctx);
    }
  },
  dispose(controller: any, props: any, ctx: any) {
    'worklet';
    const key = '__rnsNativeScriptTabsRegistry';
    const globalObject = globalThis as Record<string, any>;
    const registry = globalObject[key];
    const host = registry?.hosts?.[props.hostId];
    if (host) {
      removeTabsScreenRecord(host, controller, props);
    }
    if (controller.__rnsNativeScriptTabsEventContext === ctx) {
      controller.__rnsNativeScriptTabsEventContext = undefined;
    }
  },
});

const TabsBottomAccessoryContainer = NativeScriptRuntime.defineUIKitContainer<
  TabsBottomAccessoryNativeScriptProps,
  any,
  any
>({
  debugName: 'RNSTabsBottomAccessory.NativeScript',
  layout: { sizing: 'fill' },
  create() {
    'worklet';
    const AccessoryView = nativeScriptTabsBottomAccessoryViewClass();
    const UIColor = nativeValue('UIColor');

    if (!AccessoryView || typeof AccessoryView.alloc !== 'function') {
      throw new Error('RNSTabsBottomAccessory view is not available');
    }

    const allocated = AccessoryView.alloc();
    const accessoryView =
      allocated && typeof allocated.init === 'function'
        ? allocated.init()
        : allocated;

    accessoryView.backgroundColor = UIColor?.clearColor ?? null;
    accessoryView.clipsToBounds = false;
    accessoryView.userInteractionEnabled = true;
    accessoryView.autoresizingMask = flexibleSizeMask();

    return {
      childrenView: accessoryView,
      rootView: accessoryView,
    };
  },
  mounted(view, props, ctx) {
    'worklet';
    updateTabsBottomAccessoryRecord(view, props, ctx);
  },
  update(view, props, _previousProps, ctx) {
    'worklet';
    updateTabsBottomAccessoryRecord(view, props, ctx);
  },
  dispose(view, props) {
    'worklet';
    clearTabsBottomAccessoryRecord(view, props);
  },
});

const TabsBottomAccessoryContentContainer =
  NativeScriptRuntime.defineUIKitContainer<
    TabsBottomAccessoryContentNativeScriptProps,
    any,
    any
  >({
    debugName: 'RNSTabsBottomAccessoryContent.NativeScript',
    layout: { sizing: 'fill' },
    create() {
      'worklet';
      const ContentView = nativeScriptTabsBottomAccessoryContentViewClass();
      const UIColor = nativeValue('UIColor');

      if (!ContentView || typeof ContentView.alloc !== 'function') {
        throw new Error('RNSTabsBottomAccessoryContent view is not available');
      }

      const allocated = ContentView.alloc();
      const contentView =
        allocated && typeof allocated.init === 'function'
          ? allocated.init()
          : allocated;

      contentView.backgroundColor = UIColor?.clearColor ?? null;
      contentView.userInteractionEnabled = true;
      contentView.autoresizingMask = flexibleSizeMask();

      return {
        childrenView: contentView,
        rootView: contentView,
      };
    },
    mounted(view, props) {
      'worklet';
      updateTabsBottomAccessoryContentRecord(view, props);
    },
    update(view, props) {
      'worklet';
      updateTabsBottomAccessoryContentRecord(view, props);
    },
    dispose(view) {
      'worklet';
      clearTabsBottomAccessoryContentRecord(view);
    },
  });

export function NativeScriptTabsHost(props: TabsHostProps) {
  const hostId = React.useId();
  const { onTabSelected, onTabSelectionPrevented, onTabSelectionRejected } =
    props;
  const onMoreTabSelected = props.ios?.onMoreTabSelected;
  const handleTabSelected = React.useCallback(
    (event: NativeSyntheticEvent<TabSelectedEvent>) => {
      onTabSelected?.(event);
    },
    [onTabSelected],
  );
  const handleTabSelectionRejected = React.useCallback(
    (event: NativeSyntheticEvent<TabSelectionRejectedEvent>) => {
      onTabSelectionRejected?.(event);
    },
    [onTabSelectionRejected],
  );
  const handleTabSelectionPrevented = React.useCallback(
    (event: NativeSyntheticEvent<TabSelectionPreventedEvent>) => {
      onTabSelectionPrevented?.(event);
    },
    [onTabSelectionPrevented],
  );
  const handleMoreTabSelected = React.useCallback(
    (event: NativeSyntheticEvent<MoreTabSelectedEvent>) => {
      onMoreTabSelected?.(event);
    },
    [onMoreTabSelected],
  );
  const children = React.Children.map(props.children, (child, index) => {
    if (!React.isValidElement(child)) {
      return child;
    }
    return React.cloneElement(child as React.ReactElement<any>, {
      __nativeScriptTabsIndex: index,
    });
  });
  const bottomAccessory =
    props.ios?.bottomAccessory && isIOS26OrHigher ? (
      <NativeScriptTabsBottomAccessory>
        <NativeScriptTabsBottomAccessoryContent environment="regular">
          {props.ios.bottomAccessory('regular')}
        </NativeScriptTabsBottomAccessoryContent>
        <NativeScriptTabsBottomAccessoryContent environment="inline">
          {props.ios.bottomAccessory('inline')}
        </NativeScriptTabsBottomAccessoryContent>
      </NativeScriptTabsBottomAccessory>
    ) : null;

  const hostControllerProps: React.ComponentProps<typeof TabsHostController> = {
    hostId,
    navStateRequest: props.navStateRequest,
    style: { flex: 1 },
    children: (
      <>
        {children}
        {bottomAccessory}
      </>
    ),
    onTabSelected: handleTabSelected,
    onTabSelectionPrevented: handleTabSelectionPrevented,
    onTabSelectionRejected: handleTabSelectionRejected,
    onMoreTabSelected: handleMoreTabSelected,
  };
  if (props.rejectStaleNavStateUpdates !== undefined) {
    hostControllerProps.rejectStaleNavStateUpdates =
      props.rejectStaleNavStateUpdates;
  }
  if (props.tabBarHidden !== undefined) {
    hostControllerProps.tabBarHidden = props.tabBarHidden;
  }
  if (props.ios?.tabBarTintColor !== undefined) {
    hostControllerProps.tintColor = props.ios.tabBarTintColor;
  }
  if (props.nativeContainerStyle?.backgroundColor !== undefined) {
    hostControllerProps.backgroundColor =
      props.nativeContainerStyle.backgroundColor;
  }
  if (props.ios?.tabBarControllerMode !== undefined) {
    hostControllerProps.tabBarControllerMode = props.ios.tabBarControllerMode;
  }
  if (props.ios?.tabBarMinimizeBehavior !== undefined) {
    hostControllerProps.tabBarMinimizeBehavior =
      props.ios.tabBarMinimizeBehavior;
  }
  if (props.direction !== undefined) {
    hostControllerProps.layoutDirection = props.direction;
  }

  return (
    <TabsRuntimeContext.Provider
      value={{
        hostId,
        selectedScreenKey: props.navStateRequest.selectedScreenKey,
        baseProvenance: props.navStateRequest.baseProvenance,
      }}>
      <TabsHostController
        attachController
        collectChildren
        disableUIKitHostWindowAttachRefresh
        immediateTransactionCommit
        pinNativeViewToHost
        {...hostControllerProps}
      />
    </TabsRuntimeContext.Provider>
  );
}

export function NativeScriptTabsBottomAccessory(
  props: TabsBottomAccessoryProps,
) {
  const tabsContext = React.useContext(TabsRuntimeContext);
  const accessoryId = React.useId();

  if (!tabsContext) {
    return null;
  }

  return (
    <TabsBottomAccessoryRuntimeContext.Provider value={{ accessoryId }}>
      <TabsBottomAccessoryContainer
        {...props}
        accessoryId={accessoryId}
        collapsable={false}
        disableUIKitHostWindowAttachRefresh
        hostId={tabsContext.hostId}
        style={[props.style, StyleSheet.absoluteFill]}
      />
    </TabsBottomAccessoryRuntimeContext.Provider>
  );
}

export function NativeScriptTabsBottomAccessoryContent(
  props: TabsBottomAccessoryContentProps,
) {
  const accessoryContext = React.useContext(TabsBottomAccessoryRuntimeContext);

  if (!accessoryContext) {
    return null;
  }

  return (
    <TabsBottomAccessoryContentContainer
      {...props}
      accessoryId={accessoryContext.accessoryId}
      collapsable={false}
      disableUIKitHostWindowAttachRefresh
      style={[props.style, StyleSheet.absoluteFill]}
    />
  );
}

export function NativeScriptTabsScreen(props: TabsScreenNativeScriptProps) {
  const context = React.useContext(TabsRuntimeContext);
  if (!context) {
    return null;
  }
  return (
    <TabsScreenController
      {...props}
      attachController
      attachControllerToParent={false}
      attachControllerView={false}
      attachNativeView={false}
      disableDetachedChildrenTouchHandler
      disableUIKitHostWindowAttachRefresh
      externalDetachedChildrenOwner
      hostId={context.hostId}
      immediateTransactionCommit
      preserveDetachedChildrenLayout
      style={styles.fill}>
      {props.children}
    </TabsScreenController>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
