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

const TABS_MOUNT_VIEW_TAG = 83912041;
const TABS_SCREEN_VIEW_CLASS_KEY = '__RNSTabsScreenNativeScriptViewClass';
const TABS_SCREEN_CONTROLLER_CLASS_KEY =
  '__RNSTabsScreenNativeScriptControllerClass';
const TABS_BOTTOM_ACCESSORY_VIEW_CLASS_KEY =
  '__RNSTabsBottomAccessoryNativeScriptViewClass';
const TABS_BOTTOM_ACCESSORY_CONTENT_VIEW_CLASS_KEY =
  '__RNSTabsBottomAccessoryContentNativeScriptViewClass';

function nativeValue(name: string): any {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const api = globalObject.__nativeScriptNativeApi;
  return api?.[name] ?? globalObject[name];
}

function currentIOSMajorVersion(): number {
  'worklet';
  const UIDevice = nativeValue('UIDevice');
  const version = String(UIDevice?.currentDevice?.systemVersion ?? '0');
  const major = Number.parseInt(version.split('.')[0] ?? '0', 10);

  return Number.isFinite(major) ? major : 0;
}

function gestureRecognizerState(name: string, fallback: number): number {
  'worklet';
  const values = nativeValue('UIGestureRecognizerState');
  return values?.[name] ?? values?.[name.toLowerCase()] ?? fallback;
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
}

function nativeArrayFromArray(items: any[]): any {
  'worklet';
  const NSArray = nativeValue('NSArray');
  return NSArray && typeof NSArray.arrayWithArray === 'function'
    ? NSArray.arrayWithArray(items)
    : items;
}

function nativeObjectsEqual(left: any, right: any): boolean {
  'worklet';
  if (left === right) {
    return true;
  }
  if (!left || !right) {
    return false;
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

function callNativeScriptTabsControllerSuper(
  controller: any,
  methodName: string,
  animated: boolean,
) {
  'worklet';

  const superObject = controller?.super;
  const method = superObject?.[methodName];

  if (typeof method === 'function') {
    superObject[methodName](animated);
  }
}

function emitTabsScreenLifecycleEventForController(
  controller: any,
  eventName: string,
) {
  'worklet';

  // NATIVESCRIPT_PORT_DEVIATION: upstream stores an
  // RNSTabsScreenEventEmitter on the component view; this TS port stores the
  // React event context on the native controller so UIKit appearance callbacks
  // can emit through it without a native component-view instance.
  controller?.__rnsNativeScriptTabsEventContext?.emit?.(eventName, {});
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

function tabsScreenControllerClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[TABS_SCREEN_CONTROLLER_CLASS_KEY];

  if (existing) {
    return existing;
  }

  const UIViewController = nativeValue('UIViewController');
  const NativeClassFunction = globalObject.NativeClass;

  if (!UIViewController || typeof NativeClassFunction !== 'function') {
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

      this.viewWillAppear(animated);
    }

    viewDidAppear(animated: boolean) {
      'worklet';

      callNativeScriptTabsControllerSuper(this, 'viewDidAppear', animated);
      emitTabsScreenLifecycleEventForController(this, 'onDidAppear');
    }

    'viewDidAppear:'(animated: boolean) {
      'worklet';

      this.viewDidAppear(animated);
    }

    viewWillDisappear(animated: boolean) {
      'worklet';

      callNativeScriptTabsControllerSuper(this, 'viewWillDisappear', animated);
      emitTabsScreenLifecycleEventForController(this, 'onWillDisappear');
    }

    'viewWillDisappear:'(animated: boolean) {
      'worklet';

      this.viewWillDisappear(animated);
    }

    viewDidDisappear(animated: boolean) {
      'worklet';

      callNativeScriptTabsControllerSuper(this, 'viewDidDisappear', animated);
      emitTabsScreenLifecycleEventForController(this, 'onDidDisappear');
    }

    'viewDidDisappear:'(animated: boolean) {
      'worklet';

      this.viewDidDisappear(animated);
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

  (RNSTabsScreenNativeScriptController as any).ObjCExposedMethods =
    exposedMethods;

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

function tabsScreenViewClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[TABS_SCREEN_VIEW_CLASS_KEY];

  if (existing) {
    return existing;
  }

  const UIView = nativeValue('UIView');
  const NativeClassFunction = globalObject.NativeClass;

  if (!UIView || typeof NativeClassFunction !== 'function') {
    return UIView;
  }

  class RNSTabsScreenNativeScriptView extends UIView {
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

    didAddSubview(subview: any) {
      'worklet';
      this.super?.didAddSubview?.(subview);

      const firstSubview = arrayItem(this.subviews, 0);
      if (!nativeObjectsEqual(firstSubview, subview)) {
        return;
      }

      if (
        this
          .__rnsNativeScriptIsOverrideScrollViewContentInsetAdjustmentBehaviorSet ===
        true
      ) {
        this.overrideScrollViewBehaviorInFirstDescendantChainIfNeeded();
      } else {
        this.__rnsNativeScriptNeedsScrollViewBehaviorOverride = true;
      }
    }

    'didAddSubview:'(subview: any) {
      'worklet';
      this.didAddSubview(subview);
    }
  }

  const interopTypes = globalObject.interop?.types;
  const exposedMethods = {
    shouldOverrideScrollViewContentInsetAdjustmentBehavior: {
      params: [],
      returns: interopTypes?.bool,
    },
    overrideScrollViewBehaviorInFirstDescendantChainIfNeeded: {
      params: [],
      returns: interopTypes?.void,
    },
    'didAddSubview:': {
      params: UIView ? [UIView] : [],
      returns: interopTypes?.void,
    },
  };

  (RNSTabsScreenNativeScriptView as any).ObjCExposedMethods = exposedMethods;

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
    return null;
  }

  const allocated = UIView.alloc();
  const view =
    allocated && typeof allocated.init === 'function'
      ? allocated.init()
      : allocated;

  configureTabsScreenScrollViewBehaviorProvider(view, props);
  return view;
}

function flexibleSizeMask(): number {
  'worklet';
  const autoresizing = nativeValue('UIViewAutoresizing');
  return (
    (autoresizing?.FlexibleWidth ?? 2) + (autoresizing?.FlexibleHeight ?? 16)
  );
}

function nativeScriptTabsBottomAccessoryViewClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[TABS_BOTTOM_ACCESSORY_VIEW_CLASS_KEY];

  if (existing) {
    return existing;
  }

  const UIView = nativeValue('UIView');
  const NativeClassFunction = globalObject.NativeClass;

  if (!UIView || typeof NativeClassFunction !== 'function') {
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
      this.super?.traitCollectionDidChange?.(previousTraitCollection);
      emitTabsBottomAccessoryEnvironmentChange(this);
      handleTabsBottomAccessoryContentVisibility(this);
    }

    'traitCollectionDidChange:'(previousTraitCollection: any) {
      'worklet';
      this.traitCollectionDidChange(previousTraitCollection);
    }

    observeValueForKeyPathOfObjectChangeContext(
      keyPath: string,
      object: any,
      change: any,
      context: any,
    ) {
      'worklet';
      if (keyPath === 'center') {
        notifyTabsBottomAccessoryWrapperFrameChanged(this);
        return;
      }
      this.super?.observeValueForKeyPathOfObjectChangeContext?.(
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
      this.observeValueForKeyPathOfObjectChangeContext(
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

  (RNSTabsBottomAccessoryNativeScriptView as any).ObjCExposedMethods =
    exposedMethods;

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

  const UIView = nativeValue('UIView');
  const NativeClassFunction = globalObject.NativeClass;

  if (!UIView || typeof NativeClassFunction !== 'function') {
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
      this.super?.traitCollectionDidChange?.(previousTraitCollection);
      const accessoryView = this.__rnsNativeScriptTabsBottomAccessoryView;
      if (accessoryView) {
        handleTabsBottomAccessoryContentVisibility(accessoryView);
      }
    }

    'traitCollectionDidChange:'(previousTraitCollection: any) {
      'worklet';
      this.traitCollectionDidChange(previousTraitCollection);
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

  (RNSTabsBottomAccessoryContentNativeScriptView as any).ObjCExposedMethods =
    exposedMethods;

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
  const UIView = nativeValue('UIView');
  if (!UIView || typeof UIView.alloc !== 'function') {
    return null;
  }

  const allocated = UIView.alloc();
  const wrapperView =
    allocated && typeof allocated.init === 'function'
      ? allocated.init()
      : allocated;

  wrapperView.autoresizingMask = flexibleSizeMask();
  wrapperView.userInteractionEnabled = true;
  wrapperView.addSubview(accessoryView);
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

function shouldFillHostedSubview(rootView: any, subview: any): boolean {
  'worklet';
  const parentBounds = rootView?.bounds ?? rootView?.frame;
  const frame = subview?.frame;
  const parentWidth = parentBounds?.size?.width ?? 0;
  const childWidth = frame?.size?.width ?? 0;
  const originX = frame?.origin?.x ?? 0;
  const originY = frame?.origin?.y ?? 0;
  if (parentWidth <= 0) {
    return false;
  }
  return (
    Math.abs(originX) < 1 &&
    Math.abs(originY) < 1 &&
    (childWidth <= 0 || Math.abs(childWidth - parentWidth) < 2)
  );
}

function layoutSingleHostedSubviewChain(rootView: any, depth: number) {
  'worklet';
  if (!rootView || depth > 8 || isNativeScrollView(rootView)) {
    return;
  }
  const subviews = rootView.subviews;
  const count = arrayCount(subviews);
  for (let index = 0; index < count; index++) {
    const subview = arrayItem(subviews, index);
    if (!subview || !shouldFillHostedSubview(rootView, subview)) {
      continue;
    }
    subview.frame = rootView.bounds;
    subview.autoresizingMask = flexibleSizeMask();
    if (typeof subview.setNeedsLayout === 'function') {
      subview.setNeedsLayout();
    }
    if (typeof subview.layoutIfNeeded === 'function') {
      subview.layoutIfNeeded();
    }
    layoutSingleHostedSubviewChain(subview, depth + 1);
  }
}

function layoutHostedReactSubviews(controller: any) {
  'worklet';
  const rootView = controller?.view;
  if (!rootView) {
    return;
  }
  const mask = flexibleSizeMask();
  const subviews = rootView.subviews;
  const count = arrayCount(subviews);
  for (let index = 0; index < count; index++) {
    const subview = arrayItem(subviews, index);
    if (subview) {
      subview.frame = rootView.bounds;
      subview.autoresizingMask = mask;
      layoutSingleHostedSubviewChain(subview, 0);
    }
  }
}

function layoutTabsMountView(tabController: any) {
  'worklet';
  const mountView =
    tabController?.view && typeof tabController.view.viewWithTag === 'function'
      ? tabController.view.viewWithTag(TABS_MOUNT_VIEW_TAG)
      : null;
  if (!mountView || !tabController?.view) {
    return;
  }
  mountView.frame = tabController.view.bounds;
  mountView.autoresizingMask = flexibleSizeMask();
}

function keepTabBarVisible(tabController: any) {
  'worklet';
  const tabBar = tabController?.tabBar;
  const hostView = tabController?.view;
  if (!tabBar || !hostView) {
    return;
  }
  tabBar.hidden = false;
  tabBar.alpha = 1;
  tabBar.userInteractionEnabled = true;
  if (typeof tabBar.setNeedsLayout === 'function') {
    tabBar.setNeedsLayout();
  }
  if (typeof tabBar.layoutIfNeeded === 'function') {
    tabBar.layoutIfNeeded();
  }
  if (tabBar.layer) {
    tabBar.layer.zPosition = 1000;
  }
  const parent = tabBar.superview;
  if (parent && typeof parent.bringSubviewToFront === 'function') {
    parent.bringSubviewToFront(tabBar);
  }
  if (
    typeof tabController.__rnsNativeScriptInstallTabBarTapRecognizer ===
    'function'
  ) {
    tabController.__rnsNativeScriptInstallTabBarTapRecognizer();
  }
}

function scheduleTabBarVisible(tabController: any) {
  'worklet';
  keepTabBarVisible(tabController);
}

function selectedTabsContentSuperview(
  tabController: any,
  selectedView: any,
): any {
  'worklet';
  const isStagingMountView = (view: any) => view?.tag === TABS_MOUNT_VIEW_TAG;

  if (selectedView?.superview && !isStagingMountView(selectedView.superview)) {
    return selectedView.superview;
  }

  const controllers = tabController?.viewControllers;
  const count = arrayCount(controllers);
  for (let index = 0; index < count; index++) {
    const controller = arrayItem(controllers, index);
    const superview = controller?.view?.superview;
    if (superview && !isStagingMountView(superview)) {
      return superview;
    }
  }

  return tabController?.view ?? null;
}

function attachSelectedTabControllerView(
  tabController: any,
  selectedController: any,
) {
  'worklet';
  const selectedView = selectedController?.view;
  const tabBar = tabController?.tabBar;
  const contentSuperview = selectedTabsContentSuperview(
    tabController,
    selectedView,
  );

  if (!selectedView || !contentSuperview) {
    return;
  }

  // NATIVESCRIPT_PORT_DEVIATION: upstream RNSTabsHostComponentView keeps
  // RNSTabsScreen views in Fabric's `_reactSubviews` list without mounting
  // them into a visible staging subtree. The TS port needs a hidden mount view
  // so NativeScript/RN can host child components, but that mount view must not
  // become the selected tab's UIKit content container. If UIKit has not yet
  // moved the selected controller view during first paint, move it into the
  // tab controller hierarchy below the tab bar as the closest TS equivalent of
  // UITabBarController owning the selected child view.
  selectedView.hidden = false;
  selectedView.alpha = 1;
  selectedView.userInteractionEnabled = true;

  if (selectedView.superview !== contentSuperview) {
    if (
      contentSuperview === tabController?.view &&
      tabBar &&
      tabBar.superview === contentSuperview &&
      typeof contentSuperview.insertSubviewBelowSubview === 'function'
    ) {
      contentSuperview.insertSubviewBelowSubview(selectedView, tabBar);
    } else if (typeof contentSuperview.addSubview === 'function') {
      contentSuperview.addSubview(selectedView);
    }
  }

  if (typeof contentSuperview.bringSubviewToFront === 'function') {
    contentSuperview.bringSubviewToFront(selectedView);
  }
  if (
    tabBar?.superview &&
    typeof tabBar.superview.bringSubviewToFront === 'function'
  ) {
    tabBar.superview.bringSubviewToFront(tabBar);
  }
}

function reconcileSelectedTabControllerView(
  tabController: any,
  explicitSelectedController?: any,
) {
  'worklet';
  const selectedController =
    explicitSelectedController ?? tabController?.selectedViewController;
  if (!selectedController?.view || !tabController?.view) {
    return;
  }
  attachSelectedTabControllerView(tabController, selectedController);
  if (typeof tabController.view.setNeedsLayout === 'function') {
    tabController.view.setNeedsLayout();
  }
  if (typeof tabController.view.layoutIfNeeded === 'function') {
    tabController.view.layoutIfNeeded();
  }
  layoutTabsMountView(tabController);
  keepTabBarVisible(tabController);

  const hostFrame = tabController.view.bounds ?? tabController.view.frame;
  const width =
    hostFrame?.size?.width ?? tabController.view.frame?.size?.width ?? 0;
  const hostHeight =
    hostFrame?.size?.height ?? tabController.view.frame?.size?.height ?? 0;

  const CGRectMake = nativeValue('CGRectMake');
  selectedController.view.frame =
    typeof CGRectMake === 'function'
      ? CGRectMake(0, 0, width, hostHeight)
      : { origin: { x: 0, y: 0 }, size: { width, height: hostHeight } };
  selectedController.view.autoresizingMask = flexibleSizeMask();
  selectedController.view.clipsToBounds = true;
  layoutHostedReactSubviews(selectedController);
  if (typeof NativeScriptRuntime.refreshUIKitHostView === 'function') {
    NativeScriptRuntime.refreshUIKitHostView(selectedController.view);
  }
  keepTabBarVisible(tabController);
  scheduleTabBarVisible(tabController);
}

function scheduleSelectedTabControllerReconcile(
  tabController: any,
  explicitSelectedController?: any,
) {
  'worklet';

  reconcileSelectedTabControllerView(tabController, explicitSelectedController);

  if (typeof setTimeout !== 'function' || !tabController) {
    return;
  }

  const token =
    (tabController.__rnsNativeScriptSelectedReconcileToken ?? 0) + 1;
  tabController.__rnsNativeScriptSelectedReconcileToken = token;

  const reconcile = () => {
    'worklet';

    if (tabController.__rnsNativeScriptSelectedReconcileToken !== token) {
      return;
    }

    reconcileSelectedTabControllerView(
      tabController,
      explicitSelectedController,
    );
  };

  // NATIVESCRIPT_PORT_DEVIATION: upstream tab selection and child mounting
  // happen inside the same native view hierarchy. This TS port receives the
  // selected UITabBarController event before NativeScript/RN hosted children
  // have always refreshed their hit-test tree, so repeat the same selected
  // view reconciliation across the next short UI ticks. This is package-local
  // UIKit scheduling, not a runtime/TurboModule navigation helper.
  setTimeout(reconcile, 0);
  setTimeout(reconcile, 16);
  setTimeout(reconcile, 64);
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
  if (typeof tabBar.updateConstraintsIfNeeded === 'function') {
    tabBar.updateConstraintsIfNeeded();
  }
  if (typeof tabBar.layoutIfNeeded === 'function') {
    tabBar.layoutIfNeeded();
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

function finishTabControllerCommit(tabController: any, orderedScreens?: any[]) {
  'worklet';
  if (!tabController?.view) {
    return;
  }
  refreshScreenRecordTabBarItems(orderedScreens);
  refreshVisibleTabBarItems(tabController, orderedScreens);
  refreshTabBarItemLayout(tabController);
  tabController.view.setNeedsLayout();
  tabController.view.layoutIfNeeded();
  reconcileSelectedTabControllerView(tabController);
  refreshVisibleTabBarItems(tabController, orderedScreens);
  refreshTabBarItemLayout(tabController);
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
    // Direct port of RNSTabBarController's updateSelectedViewControllerTo:
    // path: select the concrete child controller once and let UIKit derive the
    // selectedIndex. Assigning both properties can schedule duplicate
    // appearance transitions on UITabBarController.
    tabController.selectedViewController = selectedController;
  }
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

  const previous =
    tabController.__rnsNativeScriptSuppressSelectionObservation === true;
  tabController.__rnsNativeScriptSuppressSelectionObservation = true;

  try {
    operation();
  } finally {
    tabController.__rnsNativeScriptSuppressSelectionObservation = previous;
  }
}

function shouldAnimateTabViewControllersCommit(): boolean {
  'worklet';
  return false;
}

function removeControllerFromParent(controller: any, expectedParent: any) {
  'worklet';
  let parent = controller?.parentViewController;

  if (!controller || !parent || parent === expectedParent) {
    return;
  }

  const parentControllers = parent.viewControllers;
  const nextControllers: any[] = [];
  let didFindController = false;
  const count = arrayCount(parentControllers);

  for (let index = 0; index < count; index++) {
    const existingController = arrayItem(parentControllers, index);

    if (existingController === controller) {
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
  } else {
    return;
  }

  parent = controller.parentViewController;

  if (parent && parent !== expectedParent) {
    if (typeof controller.willMoveToParentViewController === 'function') {
      controller.willMoveToParentViewController(null);
    }
    if (
      controller.view &&
      typeof controller.view.removeFromSuperview === 'function'
    ) {
      controller.view.removeFromSuperview();
    }
    if (typeof controller.removeFromParentViewController === 'function') {
      controller.removeFromParentViewController();
    }
  }
}

function collectOrderedTabScreens(host: any) {
  'worklet';
  const controllers: any[] = [];
  const orderedScreens: any[] = [];
  let selectedIndex = -1;
  let maxIndex = -1;

  for (let index = 0; index < host.screens.length; index++) {
    const screen = host.screens[index];
    if (screen.index > maxIndex) {
      maxIndex = screen.index;
    }
  }

  for (let slot = 0; slot <= maxIndex; slot++) {
    for (let index = 0; index < host.screens.length; index++) {
      const screen = host.screens[index];
      if (screen.index === slot) {
        if (screen.screenKey === host.selectedScreenKey) {
          selectedIndex = controllers.length;
        }
        removeControllerFromParent(screen.controller, host.controller);
        applyScreenRecordTabItem(screen);
        controllers[controllers.length] = screen.controller;
        orderedScreens[orderedScreens.length] = screen;
      }
    }
  }

  return { controllers, orderedScreens, selectedIndex };
}

function tabsNavigationStatePayload(host: any) {
  'worklet';

  return {
    selectedScreenKey: host?.selectedScreenKey ?? '',
    provenance: host?.provenance ?? 0,
  };
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

function childNavigationControllerForTabScreenController(
  tabScreenController: any,
) {
  'worklet';

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
  }

  return null;
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
      findScrollViewInFirstDescendantChainFrom(selectedController?.view),
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
  const currentSelectedController = host.controller?.selectedViewController;

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
    currentSelectedController === nextSelectedController
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

function commitTabsHost(host: any, ctx?: any) {
  'worklet';
  if (!host?.controller) {
    return;
  }

  const { controllers, orderedScreens, selectedIndex } =
    collectOrderedTabScreens(host);

  configureTabsBottomAccessory(host);

  if (controllers.length === 0) {
    return;
  }

  const nativeControllers = nativeArrayFromArray(controllers);

  let requestApplied = false;
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
    if (!requestApplied) {
      applySelectedTabController(host.controller, controllers, selectedIndex);
    }
  });
  finishTabControllerCommit(host.controller, orderedScreens);
}

function runTabsHostCommit(hostId: string, token: number) {
  'worklet';
  const registry = (globalThis as Record<string, any>)
    .__rnsNativeScriptTabsRegistry;
  const host = registry?.hosts?.[hostId];

  if (!host || host.commitToken !== token) {
    return;
  }

  commitTabsHost(host, host.hostEventContext);
}

function scheduleTabsHostCommit(hostId: string) {
  'worklet';
  const registry = (globalThis as Record<string, any>)
    .__rnsNativeScriptTabsRegistry;
  const host = registry?.hosts?.[hostId];

  if (!host) {
    return;
  }

  const token = (host.commitToken ?? 0) + 1;
  host.commitToken = token;

  if (typeof setTimeout === 'function') {
    // NATIVESCRIPT_PORT_DEVIATION: upstream native tabs commit from one ObjC
    // view hierarchy, while the TS port receives the host and tab-screen
    // records from separate React/native host mounts. Keep this bounded and
    // token-coalesced so first-paint labels/items settle without a persistent
    // repair loop or stale commits.
    setTimeout(runTabsHostCommit, 0, hostId, token);
    setTimeout(runTabsHostCommit, 16, hostId, token);
    setTimeout(runTabsHostCommit, 64, hostId, token);
  } else {
    runTabsHostCommit(hostId, token);
  }
}

function upsertTabsScreenRecord(host: any, controller: any, props: any) {
  'worklet';
  let existingIndex = -1;

  for (let index = 0; index < host.screens.length; index++) {
    if (
      host.screens[index].screenKey === props.screenKey ||
      host.screens[index].controller === controller
    ) {
      existingIndex = index;
      break;
    }
  }

  const screenRecord = {
    screenKey: props.screenKey,
    controller,
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

  if (existingIndex >= 0) {
    host.screens[existingIndex] = screenRecord;
  } else {
    host.screens[host.screens.length] = screenRecord;
  }
}

function removeTabsScreenRecord(host: any, controller: any, props: any) {
  'worklet';
  for (let index = host.screens.length - 1; index >= 0; index--) {
    if (
      host.screens[index].screenKey === props.screenKey ||
      host.screens[index].controller === controller
    ) {
      for (
        let moveIndex = index;
        moveIndex < host.screens.length - 1;
        moveIndex++
      ) {
        host.screens[moveIndex] = host.screens[moveIndex + 1];
      }
      host.screens.length = host.screens.length - 1;
    }
  }
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
    const UITabBarController =
      api?.UITabBarController ?? globals.UITabBarController;
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
    configureTabBarController(controller, ctx);
    const UIView = api?.UIView ?? globals.UIView;
    if (UIView && typeof UIView.alloc === 'function') {
      const mountViewAllocated = UIView.alloc();
      const mountView =
        mountViewAllocated && typeof mountViewAllocated.init === 'function'
          ? mountViewAllocated.init()
          : mountViewAllocated;
      mountView.tag = TABS_MOUNT_VIEW_TAG;
      mountView.hidden = true;
      mountView.userInteractionEnabled = false;
      mountView.frame = controller.view.bounds;
      mountView.autoresizingMask = flexibleSizeMask();
      controller.view.addSubview(mountView);
    }
    const delegateProtocol =
      api?.UITabBarControllerDelegate ?? globals.UITabBarControllerDelegate;
    const screenForController = (host: any, selectedController: any) => {
      'worklet';
      for (let index = 0; index < host.screens.length; index++) {
        const screen = host.screens[index];
        if (screen.controller === selectedController) {
          return screen;
        }
      }
      return null;
    };
    const isMoreNavigationController = (
      tabController: any,
      selectedController: any,
    ) => {
      'worklet';

      return (
        selectedController != null &&
        tabController?.moreNavigationController != null &&
        selectedController === tabController.moreNavigationController
      );
    };
    const emitSelection = (
      host: any,
      selectedController: any,
      repeated: boolean,
      hasTriggeredSpecialEffect = false,
    ) => {
      'worklet';
      const screen = screenForController(host, selectedController);
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
    const installTabBarTapRecognizer = () => {
      'worklet';
      const UITapGestureRecognizer =
        api?.UITapGestureRecognizer ?? globals.UITapGestureRecognizer;
      const tabBar = controller?.tabBar;
      const recognizerHost =
        tabBar?.window ??
        controller?.view?.window ??
        tabBar?.superview ??
        controller?.view;
      const existingRecognizer =
        controller.__rnsNativeScriptTabBarTapRecognizer;
      if (existingRecognizer) {
        if (
          recognizerHost &&
          !nativeObjectsEqual(
            controller.__rnsNativeScriptTabBarTapRecognizerHost,
            recognizerHost,
          ) &&
          typeof recognizerHost.addGestureRecognizer === 'function'
        ) {
          const previousHost =
            controller.__rnsNativeScriptTabBarTapRecognizerHost;
          if (typeof previousHost?.removeGestureRecognizer === 'function') {
            previousHost.removeGestureRecognizer(existingRecognizer);
          }
          recognizerHost.addGestureRecognizer(existingRecognizer);
          controller.__rnsNativeScriptTabBarTapRecognizerHost = recognizerHost;
        }
        return;
      }
      if (
        !UITapGestureRecognizer ||
        typeof UITapGestureRecognizer.alloc !== 'function' ||
        typeof ctx.gestureAction !== 'function' ||
        typeof recognizerHost?.addGestureRecognizer !== 'function'
      ) {
        return;
      }

      const allocated = UITapGestureRecognizer.alloc();
      const tap =
        allocated && typeof allocated.init === 'function'
          ? allocated.init()
          : allocated;

      if (!tap) {
        return;
      }

      tap.cancelsTouchesInView = false;
      tap.delaysTouchesBegan = false;
      tap.delaysTouchesEnded = false;
      tap.numberOfTapsRequired = 1;
      controller.__rnsNativeScriptTabBarTapRecognizer = tap;

      const endedState = gestureRecognizerState('Ended', 3);
      const recognizedState = gestureRecognizerState('Recognized', 3);

      const tabIndexForTabBarPoint = (tabBarPoint: any): number => {
        'worklet';
        if (!tabBar || tabBar.hidden || tabBar.alpha <= 0.01) {
          return -1;
        }

        const bounds = tabBar.bounds ?? tabBar.frame;
        const width = bounds?.size?.width ?? 0;
        const height = bounds?.size?.height ?? 0;
        const x = tabBarPoint ? tabBarPoint.x ?? 0 : -1;
        const y = tabBarPoint ? tabBarPoint.y ?? 0 : -1;
        const verticalHitSlop = 28;
        const count = arrayCount(tabBar.items);

        if (width <= 0 || height <= 0 || count <= 0) {
          return -1;
        }
        if (
          x < 0 ||
          y < -verticalHitSlop ||
          x > width ||
          y > height + verticalHitSlop
        ) {
          return -1;
        }

        return Math.max(
          0,
          Math.min(count - 1, Math.floor((x / width) * count)),
        );
      };

      const tabBarPointFromSourcePoint = (
        sourcePoint: any,
        sourceView: any,
      ): any => {
        'worklet';
        if (!sourcePoint || !tabBar) {
          return null;
        }
        if (typeof tabBar.convertPointFromView === 'function') {
          return tabBar.convertPointFromView(sourcePoint, sourceView);
        }
        if (typeof sourceView?.convertPointToView === 'function') {
          return sourceView.convertPointToView(sourcePoint, tabBar);
        }
        const frame = tabBar.frame ?? tabBar.bounds;
        return {
          x: (sourcePoint.x ?? 0) - (frame?.origin?.x ?? 0),
          y: (sourcePoint.y ?? 0) - (frame?.origin?.y ?? 0),
        };
      };

      const tabIndexForGesture = (gesture: any): number => {
        'worklet';
        const sourceView =
          controller.__rnsNativeScriptTabBarTapRecognizerHost ??
          recognizerHost ??
          controller.view;
        const sourcePoint =
          typeof gesture?.locationInView === 'function'
            ? gesture.locationInView(sourceView)
            : null;
        return tabIndexForTabBarPoint(
          tabBarPointFromSourcePoint(sourcePoint, sourceView),
        );
      };

      const delegateProtocol =
        nativeValue('UIGestureRecognizerDelegate') ??
        'UIGestureRecognizerDelegate';
      const delegate = ctx.delegate(tap, delegateProtocol, {
        gestureRecognizerShouldReceiveTouch(_gesture: any, touch: any) {
          'worklet';
          const sourceView =
            controller.__rnsNativeScriptTabBarTapRecognizerHost ??
            recognizerHost ??
            controller.view;
          const sourcePoint =
            typeof touch?.locationInView === 'function'
              ? touch.locationInView(sourceView)
              : null;
          const tabBarPoint = tabBarPointFromSourcePoint(
            sourcePoint,
            sourceView,
          );
          const selectedIndex = tabIndexForTabBarPoint(tabBarPoint);
          return selectedIndex >= 0;
        },
        gestureRecognizerShouldBegin(gesture: any) {
          'worklet';
          const selectedIndex = tabIndexForGesture(gesture);
          return selectedIndex >= 0;
        },
      });
      tap.delegate = delegate;

      ctx.gestureAction(tap, (gesture: any) => {
        'worklet';
        const state = gesture?.state;
        if (state !== endedState && state !== recognizedState) {
          return;
        }

        const selectedIndex = tabIndexForGesture(gesture);
        if (selectedIndex < 0) {
          return;
        }
        const selectedController = arrayItem(
          controller.viewControllers,
          selectedIndex,
        );
        const key = '__rnsNativeScriptTabsRegistry';
        const registry = (globalThis as Record<string, any>)[key];
        const host = registry?.hosts?.[ctx.hostId];
        const screen = host
          ? screenForController(host, selectedController)
          : null;

        if (!host || !screen) {
          return;
        }

        if (screen.preventNativeSelection === true) {
          emitTabsSelectionPrevented(ctx, host, screen.screenKey);
          return;
        }

        const repeated = host.selectedScreenKey === screen.screenKey;
        if (!repeated) {
          host.skipNextDidSelectScreenKey = screen.screenKey;
          // Match UITabBarController's model update: selectedViewController is
          // the single source of truth; selectedIndex follows from UIKit.
          withSuppressedTabsSelectionObservation(controller, () => {
            'worklet';
            controller.selectedViewController = selectedController;
          });
          emitSelection(host, selectedController, false);
        } else {
          emitSelection(
            host,
            selectedController,
            true,
            handleRepeatedTabSelectionSpecialEffect(screen, selectedController),
          );
        }

        scheduleSelectedTabControllerReconcile(controller, selectedController);
      });

      recognizerHost.addGestureRecognizer(tap);
      controller.__rnsNativeScriptTabBarTapRecognizerHost = recognizerHost;
    };
    const emitObservedSelection = (selectedController: any) => {
      'worklet';
      const key = '__rnsNativeScriptTabsRegistry';
      const globalObject = globalThis as Record<string, any>;
      const registry = globalObject[key];
      const host = registry?.hosts?.[ctx.hostId];
      if (!host || !selectedController) {
        return;
      }
      if (
        host.controller?.__rnsNativeScriptSuppressSelectionObservation === true
      ) {
        return;
      }
      const screen = screenForController(host, selectedController);
      if (!screen || screen.preventNativeSelection === true) {
        return;
      }
      if (host.selectedScreenKey === screen.screenKey) {
        scheduleSelectedTabControllerReconcile(
          host.controller,
          selectedController,
        );
        return;
      }
      emitSelection(host, selectedController, false);
      scheduleSelectedTabControllerReconcile(
        host.controller,
        selectedController,
      );
    };
    controller.delegate = ctx.delegate(controller, delegateProtocol, {
      tabBarControllerShouldSelectTab(_tabController: any, tab: any) {
        'worklet';
        const key = '__rnsNativeScriptTabsRegistry';
        const globalObject = globalThis as Record<string, any>;
        const registry = globalObject[key];
        const host = registry?.hosts?.[ctx.hostId];
        if (!host) {
          return true;
        }
        const nextController = tab?.viewController;
        const screen = screenForController(host, nextController);
        if (!screen) {
          return true;
        }
        if (screen.preventNativeSelection === true) {
          emitTabsSelectionPrevented(ctx, host, screen.screenKey);
          return false;
        }
        if (_tabController.selectedViewController === nextController) {
          emitSelection(
            host,
            nextController,
            true,
            handleRepeatedTabSelectionSpecialEffect(screen, nextController),
          );
          scheduleSelectedTabControllerReconcile(
            _tabController,
            nextController,
          );
          return false;
        }
        _tabController.__rnsNativeScriptSuppressSelectionObservation = true;
        return true;
      },
      tabBarControllerDidSelectTabPreviousTab(
        _tabController: any,
        selectedTab: any,
      ) {
        'worklet';
        const key = '__rnsNativeScriptTabsRegistry';
        const globalObject = globalThis as Record<string, any>;
        const registry = globalObject[key];
        const host = registry?.hosts?.[ctx.hostId];
        if (!host) {
          _tabController.__rnsNativeScriptSuppressSelectionObservation = false;
          return;
        }
        const selectedController = selectedTab?.viewController;
        if (isMoreNavigationController(_tabController, selectedController)) {
          emitMoreTabSelected(ctx, host);
          _tabController.__rnsNativeScriptSuppressSelectionObservation = false;
          return;
        }
        const screen = screenForController(host, selectedController);
        if (!screen) {
          _tabController.__rnsNativeScriptSuppressSelectionObservation = false;
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
        scheduleSelectedTabControllerReconcile(
          _tabController,
          selectedController,
        );
        _tabController.__rnsNativeScriptSuppressSelectionObservation = false;
      },
      tabBarControllerShouldSelectViewController(
        _tabController: any,
        selectedController: any,
      ) {
        'worklet';
        const key = '__rnsNativeScriptTabsRegistry';
        const globalObject = globalThis as Record<string, any>;
        const registry = globalObject[key];
        const host = registry?.hosts?.[ctx.hostId];
        if (!host) {
          return true;
        }
        const screen = screenForController(host, selectedController);
        if (!screen) {
          return true;
        }
        if (screen.preventNativeSelection === true) {
          emitTabsSelectionPrevented(ctx, host, screen.screenKey);
          return false;
        }
        if (_tabController.selectedViewController === selectedController) {
          emitSelection(
            host,
            selectedController,
            true,
            handleRepeatedTabSelectionSpecialEffect(screen, selectedController),
          );
          scheduleSelectedTabControllerReconcile(
            _tabController,
            selectedController,
          );
          return false;
        }
        _tabController.__rnsNativeScriptSuppressSelectionObservation = true;
        return true;
      },
      tabBarControllerDidSelectViewController(
        _tabController: any,
        selectedController: any,
      ) {
        'worklet';
        const key = '__rnsNativeScriptTabsRegistry';
        const globalObject = globalThis as Record<string, any>;
        const registry = globalObject[key];
        const host = registry?.hosts?.[ctx.hostId];
        if (!host) {
          _tabController.__rnsNativeScriptSuppressSelectionObservation = false;
          return;
        }
        if (isMoreNavigationController(_tabController, selectedController)) {
          emitMoreTabSelected(ctx, host);
          _tabController.__rnsNativeScriptSuppressSelectionObservation = false;
          return;
        }
        const screen = screenForController(host, selectedController);
        if (!screen) {
          _tabController.__rnsNativeScriptSuppressSelectionObservation = false;
          return;
        }
        if (host.skipNextDidSelectScreenKey === screen.screenKey) {
          host.skipNextDidSelectScreenKey = undefined;
          scheduleSelectedTabControllerReconcile(_tabController);
          _tabController.__rnsNativeScriptSuppressSelectionObservation = false;
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
        scheduleSelectedTabControllerReconcile(_tabController);
        _tabController.__rnsNativeScriptSuppressSelectionObservation = false;
      },
    });
    ctx.observe(
      controller,
      'selectedViewController',
      (selectedController: any) => {
        'worklet';
        emitObservedSelection(selectedController);
      },
    );
    ctx.observe(controller, 'selectedIndex', () => {
      'worklet';
      emitObservedSelection(controller.selectedViewController);
    });
    installTabBarTapRecognizer();
    controller.__rnsNativeScriptInstallTabBarTapRecognizer =
      installTabBarTapRecognizer;
    return controller;
  },
  childrenView(controller: any) {
    'worklet';
    const existingMountView =
      controller.view && typeof controller.view.viewWithTag === 'function'
        ? controller.view.viewWithTag(TABS_MOUNT_VIEW_TAG)
        : null;
    if (existingMountView) {
      existingMountView.frame = controller.view.bounds;
      existingMountView.autoresizingMask = flexibleSizeMask();
      return existingMountView;
    }
    const api = (globalThis as Record<string, any>).__nativeScriptNativeApi;
    const globals = globalThis as Record<string, any>;
    const UIView = api?.UIView ?? globals.UIView;
    if (UIView && typeof UIView.alloc === 'function') {
      const mountViewAllocated = UIView.alloc();
      const mountView =
        mountViewAllocated && typeof mountViewAllocated.init === 'function'
          ? mountViewAllocated.init()
          : mountViewAllocated;
      mountView.tag = TABS_MOUNT_VIEW_TAG;
      mountView.hidden = true;
      mountView.userInteractionEnabled = false;
      mountView.frame = controller.view.bounds;
      mountView.autoresizingMask = flexibleSizeMask();
      controller.view.addSubview(mountView);
      return mountView;
    }
    return controller.view;
  },
  update(controller: any, props: any, _previousProps: any, ctx: any) {
    'worklet';
    let phase = 'start';
    try {
      phase = 'registry';
      const key = '__rnsNativeScriptTabsRegistry';
      const globalObject = globalThis as Record<string, any>;
      const registry = globalObject[key] ?? { hosts: {} };
      globalObject[key] = registry;
      const existing = registry.hosts[props.hostId];
      phase = 'host-write';
      const host =
        existing ??
        ({
          controller,
          screens: [],
          selectedScreenKey: props.navStateRequest.selectedScreenKey,
          provenance: props.navStateRequest.baseProvenance,
          navigationStateInitialized: false,
        } as any);
      host.controller = controller;
      host.screens = existing?.screens ?? host.screens ?? [];
      if (canEmitTabsEvent(ctx)) {
        host.hostEventContext = ctx;
      }
      registry.hosts[props.hostId] = host;
      attachExistingTabsBottomAccessoryToHost(registry, host, props.hostId);

      phase = 'request';
      rememberTabsNavigationRequest(host, props, ctx);

      phase = 'host-flags';
      Object.assign(host, {
        controller,
        rejectStaleNavStateUpdates: props.rejectStaleNavStateUpdates === true,
      });

      phase = 'tab-hidden';
      controller.tabBar.hidden = props.tabBarHidden === true;
      configureTabBarController(controller, props);

      phase = 'host-read';
      if (!registry.hosts[props.hostId]) {
        return;
      }
      phase = 'commit';
      commitTabsHost(host, ctx);
      scheduleTabsHostCommit(props.hostId);
    } catch (error) {
      throw new Error('RNSTabsHost update failed at ' + phase + ': ' + error);
    }
  },
  mounted(controller: any, props: any, ctx: any) {
    'worklet';
    const key = '__rnsNativeScriptTabsRegistry';
    const globalObject = globalThis as Record<string, any>;
    const registry = globalObject[key] ?? { hosts: {} };
    globalObject[key] = registry;
    const existing = registry.hosts[props.hostId];
    const host =
      existing ??
      ({
        controller,
        screens: [],
        selectedScreenKey: props.navStateRequest.selectedScreenKey,
        provenance: props.navStateRequest.baseProvenance,
        navigationStateInitialized: false,
      } as any);
    host.controller = controller;
    host.screens = existing?.screens ?? host.screens ?? [];
    if (canEmitTabsEvent(ctx)) {
      host.hostEventContext = ctx;
    }
    host.rejectStaleNavStateUpdates = props.rejectStaleNavStateUpdates === true;
    registry.hosts[props.hostId] = host;
    attachExistingTabsBottomAccessoryToHost(registry, host, props.hostId);

    rememberTabsNavigationRequest(host, props, ctx);

    Object.assign(host, {
      controller,
      rejectStaleNavStateUpdates: props.rejectStaleNavStateUpdates === true,
    });

    controller.tabBar.hidden = props.tabBarHidden === true;
    configureTabBarController(controller, props);

    if (!registry.hosts[props.hostId]) {
      return;
    }
    commitTabsHost(host, ctx);
    scheduleTabsHostCommit(props.hostId);
  },
  dispose(_controller: any, props: any) {
    'worklet';
    const key = '__rnsNativeScriptTabsRegistry';
    const globalObject = globalThis as Record<string, any>;
    const registry = globalObject[key];
    if (registry?.hosts) {
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
    if (!UIViewController || typeof UIViewController.alloc !== 'function') {
      throw new Error(
        `UIViewController is not allocatable in the UI runtime: ${typeof UIViewController}`,
      );
    }
    const allocated = UIViewController.alloc();
    const controller =
      allocated && typeof allocated.init === 'function'
        ? allocated.init()
        : allocated;
    installTabsScreenLifecycleMethodsOnController(controller);
    const view = createTabsScreenView(props);
    if (view) {
      controller.view = view;
    }
    const UIColor = api?.UIColor ?? globals.UIColor;
    controller.view.backgroundColor = UIColor.systemBackgroundColor;

    controller.title = props.title ?? props.screenKey;
    controller.tabBarItem = makeTabBarItem(props, props);
    return controller;
  },
  childrenView(controller: any) {
    'worklet';
    return controller.view;
  },
  update(controller: any, props: any, _previousProps: any, ctx: any) {
    'worklet';
    controller.__rnsNativeScriptTabsEventContext = ctx;
    configureTabsScreenScrollViewBehaviorProvider(controller.view, props);
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
      selectedScreenKey: props.screenKey,
      provenance: 0,
    };
    registry.hosts[props.hostId] = host;
    upsertTabsScreenRecord(host, controller, props);
    commitTabsHost(host, host.hostEventContext);
    scheduleTabsHostCommit(props.hostId);
  },
  mounted(controller: any, props: any, ctx: any) {
    'worklet';
    controller.__rnsNativeScriptTabsEventContext = ctx;
    configureTabsScreenScrollViewBehaviorProvider(controller.view, props);
    const key = '__rnsNativeScriptTabsRegistry';
    const globalObject = globalThis as Record<string, any>;
    const registry = globalObject[key] ?? { hosts: {} };
    globalObject[key] = registry;
    const host = registry.hosts[props.hostId] ?? {
      screens: [],
      selectedScreenKey: props.screenKey,
      provenance: 0,
    };
    registry.hosts[props.hostId] = host;
    upsertTabsScreenRecord(host, controller, props);
    commitTabsHost(host, host.hostEventContext);
    scheduleTabsHostCommit(props.hostId);
  },
  dispose(controller: any, props: any, ctx: any) {
    'worklet';
    const key = '__rnsNativeScriptTabsRegistry';
    const globalObject = globalThis as Record<string, any>;
    const registry = globalObject[key];
    const host = registry?.hosts?.[props.hostId];
    if (host) {
      removeTabsScreenRecord(host, controller, props);
      commitTabsHost(host, host.hostEventContext);
      scheduleTabsHostCommit(props.hostId);
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
  const reconcileTabsHost = React.useCallback(() => {
    NativeScriptRuntime.runOnUI((targetHostId: string) => {
      'worklet';
      const globalObject = globalThis as Record<string, any>;
      const registry = globalObject.__rnsNativeScriptTabsRegistry;
      const host = registry?.hosts?.[targetHostId];
      const controller = host?.controller;
      if (!controller) {
        return;
      }
      const orderedScreens: any[] = [];
      let maxIndex = -1;
      for (let index = 0; index < host.screens.length; index++) {
        const screen = host.screens[index];
        if (screen.index > maxIndex) {
          maxIndex = screen.index;
        }
      }
      for (let slot = 0; slot <= maxIndex; slot++) {
        for (let index = 0; index < host.screens.length; index++) {
          const screen = host.screens[index];
          if (screen.index === slot) {
            applyScreenRecordTabItem(screen);
            orderedScreens[orderedScreens.length] = screen;
          }
        }
      }
      refreshScreenRecordTabBarItems(orderedScreens);
      refreshVisibleTabBarItems(controller, orderedScreens);
      refreshTabBarItemLayout(controller);
      scheduleSelectedTabControllerReconcile(controller);
    }, hostId).catch(() => undefined);
  }, [hostId]);
  const handleTabSelected = React.useCallback(
    (event: NativeSyntheticEvent<TabSelectedEvent>) => {
      reconcileTabsHost();
      onTabSelected?.(event);
    },
    [onTabSelected, reconcileTabsHost],
  );
  const handleTabSelectionRejected = React.useCallback(
    (event: NativeSyntheticEvent<TabSelectionRejectedEvent>) => {
      reconcileTabsHost();
      onTabSelectionRejected?.(event);
    },
    [onTabSelectionRejected, reconcileTabsHost],
  );
  const handleTabSelectionPrevented = React.useCallback(
    (event: NativeSyntheticEvent<TabSelectionPreventedEvent>) => {
      reconcileTabsHost();
      onTabSelectionPrevented?.(event);
    },
    [onTabSelectionPrevented, reconcileTabsHost],
  );
  const handleMoreTabSelected = React.useCallback(
    (event: NativeSyntheticEvent<MoreTabSelectedEvent>) => {
      reconcileTabsHost();
      onMoreTabSelected?.(event);
    },
    [onMoreTabSelected, reconcileTabsHost],
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

  React.useEffect(() => {
    reconcileTabsHost();
    // Mirror the bounded native-side commit window above for React-only host
    // prop changes. This is a finite first-paint settle, not a tab bar restore
    // interval.
    const timeouts = [
      setTimeout(reconcileTabsHost, 0),
      setTimeout(reconcileTabsHost, 32),
      setTimeout(reconcileTabsHost, 120),
    ];
    return () => {
      for (const timeout of timeouts) {
        clearTimeout(timeout);
      }
    };
  }, [
    reconcileTabsHost,
    props.navStateRequest.baseProvenance,
    props.navStateRequest.selectedScreenKey,
    props.ios?.bottomAccessory,
    props.rejectStaleNavStateUpdates,
  ]);

  return (
    <TabsRuntimeContext.Provider
      value={{
        hostId,
        selectedScreenKey: props.navStateRequest.selectedScreenKey,
        baseProvenance: props.navStateRequest.baseProvenance,
      }}>
      <TabsHostController {...hostControllerProps} />
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
      attachControllerView={false}
      attachNativeView={false}
      hostId={context.hostId}
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
