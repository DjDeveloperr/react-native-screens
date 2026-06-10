/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/prefer-for-of */
import React from 'react';
import {
  StyleSheet,
  type NativeSyntheticEvent,
  type ViewProps,
} from 'react-native';
import NativeScriptRuntime from '@nativescript/react-native';
import type { TabsHostProps, TabSelectedEvent } from '../host/TabsHost.types';
import type { TabsScreenProps } from '../screen/TabsScreen.types';

type TabsRuntimeContextValue = {
  hostId: string;
  selectedScreenKey: string;
  baseProvenance: number;
};

type TabsScreenNativeScriptProps = Omit<TabsScreenProps, 'style'> & {
  __nativeScriptTabsIndex?: number;
  style?: ViewProps['style'];
};

const TabsRuntimeContext = React.createContext<TabsRuntimeContextValue | null>(
  null,
);

const TABS_MOUNT_VIEW_TAG = 83912041;

function nativeValue(name: string): any {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const api = globalObject.__nativeScriptNativeApi;
  return api?.[name] ?? globalObject[name];
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

function imageForTabIcon(icon: any): any {
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
  const source = icon.imageSource ?? icon.templateSource;
  const uri = typeof source === 'string' ? source : source?.uri;
  if (typeof uri === 'string' && typeof UIImage.imageNamed === 'function') {
    return UIImage.imageNamed(uri);
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

function configureTabBarItem(item: any, props: any) {
  'worklet';
  if (!item) {
    return;
  }
  const title = props.title ?? props.screenKey;
  const icon = imageForTabIcon(props.ios?.icon);
  const selectedIcon = imageForTabIcon(props.ios?.selectedIcon) ?? icon;
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

function makeTabBarItem(props: any): any {
  'worklet';
  const UITabBarItem = nativeValue('UITabBarItem');
  if (!UITabBarItem || typeof UITabBarItem.alloc !== 'function') {
    throw new Error(
      `UITabBarItem is not allocatable in the UI runtime: ${typeof UITabBarItem}`,
    );
  }
  const title = props.title ?? props.screenKey;
  const icon = imageForTabIcon(props.ios?.icon);
  const selectedIcon = imageForTabIcon(props.ios?.selectedIcon) ?? icon;
  const systemItem = props.ios?.systemItem;
  const itemAllocated = UITabBarItem.alloc();
  let item;
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
  configureTabBarItem(item, props);
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

function nativeArrayFromArray(items: any[]): any {
  'worklet';
  const NSArray = nativeValue('NSArray');
  return NSArray && typeof NSArray.arrayWithArray === 'function'
    ? NSArray.arrayWithArray(items)
    : items;
}

function flexibleSizeMask(): number {
  'worklet';
  const autoresizing = nativeValue('UIViewAutoresizing');
  return (
    (autoresizing?.FlexibleWidth ?? 2) + (autoresizing?.FlexibleHeight ?? 16)
  );
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
}

function scheduleTabBarVisible(tabController: any) {
  'worklet';
  keepTabBarVisible(tabController);
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
  keepTabBarVisible(tabController);
  scheduleTabBarVisible(tabController);
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
  tabController.selectedIndex = selectedIndex;
  if (selectedController) {
    tabController.selectedViewController = selectedController;
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

function commitTabsHost(host: any) {
  'worklet';
  if (!host?.controller) {
    return;
  }

  const { controllers, orderedScreens, selectedIndex } =
    collectOrderedTabScreens(host);

  if (controllers.length === 0) {
    return;
  }

  const nativeControllers = nativeArrayFromArray(controllers);

  if (typeof host.controller.setViewControllersAnimated === 'function') {
    host.controller.setViewControllersAnimated(
      nativeControllers,
      shouldAnimateTabViewControllersCommit(),
    );
  } else {
    host.controller.viewControllers = nativeControllers;
  }

  applySelectedTabController(host.controller, controllers, selectedIndex);
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

  commitTabsHost(host);
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

const TabsHostController = NativeScriptRuntime.defineUIViewController<
  {
    hostId: string;
    navStateRequest: TabsHostProps['navStateRequest'];
    onTabSelected?: (event: NativeSyntheticEvent<TabSelectedEvent>) => void;
    tabBarHidden?: boolean;
    tintColor?: unknown;
    backgroundColor?: unknown;
    tabBarControllerMode?: string;
    tabBarMinimizeBehavior?: string;
    style?: unknown;
    children?: React.ReactNode;
  },
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
    const emitSelection = (
      host: any,
      selectedController: any,
      repeated: boolean,
    ) => {
      'worklet';
      const screen = screenForController(host, selectedController);
      if (!screen) {
        return null;
      }
      const selectedScreenKey = screen.screenKey;
      host.selectedScreenKey = selectedScreenKey;
      host.provenance += 1;
      ctx.emit('onTabSelected', {
        nativeEvent: {
          selectedScreenKey,
          provenance: host.provenance,
          isRepeated: repeated,
          hasTriggeredSpecialEffect: false,
          actionOrigin: 'user',
        },
      });
      return selectedScreenKey;
    };
    const installTabBarTapRecognizer = () => {
      'worklet';
      const UITapGestureRecognizer =
        api?.UITapGestureRecognizer ?? globals.UITapGestureRecognizer;
      if (
        !UITapGestureRecognizer ||
        typeof UITapGestureRecognizer.alloc !== 'function' ||
        typeof ctx.gestureAction !== 'function' ||
        typeof controller?.view?.addGestureRecognizer !== 'function' ||
        controller.__rnsNativeScriptTabBarTapRecognizer
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

      ctx.gestureAction(tap, (gesture: any) => {
        'worklet';
        const state = gesture?.state;
        if (state !== endedState && state !== recognizedState) {
          return;
        }

        const tabBar = controller?.tabBar;
        if (!tabBar || tabBar.hidden || tabBar.alpha <= 0.01) {
          return;
        }

        const point =
          typeof gesture?.locationInView === 'function'
            ? gesture.locationInView(tabBar)
            : null;
        const rootPoint =
          typeof gesture?.locationInView === 'function'
            ? gesture.locationInView(controller.view)
            : null;
        const bounds = tabBar.bounds ?? tabBar.frame;
        const frame = tabBar.frame ?? bounds;
        const width = bounds?.size?.width ?? 0;
        const height = bounds?.size?.height ?? 0;
        const frameX = frame?.origin?.x ?? 0;
        const frameY = frame?.origin?.y ?? 0;
        const frameWidth = frame?.size?.width ?? width;
        const frameHeight = frame?.size?.height ?? height;
        const x =
          rootPoint && frameWidth > 0
            ? (rootPoint.x ?? 0) - frameX
            : (point?.x ?? 0);
        const y =
          rootPoint && frameHeight > 0
            ? (rootPoint.y ?? 0) - frameY
            : (point?.y ?? 0);
        const verticalHitSlop = 28;
        const items = tabBar.items;
        const count = arrayCount(items);

        if (width <= 0 || height <= 0 || count <= 0) {
          return;
        }
        if (
          x < 0 ||
          y < -verticalHitSlop ||
          x > width ||
          y > height + verticalHitSlop
        ) {
          return;
        }

        const selectedIndex = Math.max(
          0,
          Math.min(count - 1, Math.floor((x / width) * count)),
        );
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

        if (!host || !screen || screen.preventNativeSelection === true) {
          return;
        }

        const repeated = host.selectedScreenKey === screen.screenKey;
        if (!repeated) {
          host.skipNextDidSelectScreenKey = screen.screenKey;
          controller.selectedIndex = selectedIndex;
          controller.selectedViewController = selectedController;
          emitSelection(host, selectedController, false);
        }

        reconcileSelectedTabControllerView(controller, selectedController);
      });

      controller.view.addGestureRecognizer(tap);
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
        reconcileSelectedTabControllerView(host.controller, selectedController);
        return;
      }
      emitSelection(host, selectedController, false);
      reconcileSelectedTabControllerView(host.controller, selectedController);
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
        const screen = screenForController(host, tab?.viewController);
        if (!screen) {
          return true;
        }
        return screen.preventNativeSelection !== true;
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
          return;
        }
        if (
          _tabController.__rnsNativeScriptSuppressSelectionObservation === true
        ) {
          return;
        }
        const selectedController = selectedTab?.viewController;
        const screen = screenForController(host, selectedController);
        if (!screen) {
          return;
        }
        emitSelection(
          host,
          selectedController,
          host.selectedScreenKey === screen.screenKey,
        );
        reconcileSelectedTabControllerView(_tabController, selectedController);
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
          return false;
        }
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
          return;
        }
        if (
          _tabController.__rnsNativeScriptSuppressSelectionObservation === true
        ) {
          return;
        }
        const screen = screenForController(host, selectedController);
        if (!screen) {
          return;
        }
        if (host.skipNextDidSelectScreenKey === screen.screenKey) {
          host.skipNextDidSelectScreenKey = undefined;
          reconcileSelectedTabControllerView(_tabController);
          return;
        }
        emitSelection(
          host,
          selectedController,
          host.selectedScreenKey === screen.screenKey,
        );
        reconcileSelectedTabControllerView(_tabController);
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
  update(controller: any, props: any) {
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
      registry.hosts[props.hostId] = {
        controller,
        screens: existing?.screens ?? [],
        selectedScreenKey: props.navStateRequest.selectedScreenKey,
        provenance: props.navStateRequest.baseProvenance,
      };

      phase = 'tab-hidden';
      controller.tabBar.hidden = props.tabBarHidden === true;
      configureTabBarController(controller, props);

      phase = 'host-read';
      const host = registry.hosts[props.hostId];
      if (!host) {
        return;
      }
      phase = 'commit';
      commitTabsHost(host);
      scheduleTabsHostCommit(props.hostId);
    } catch (error) {
      throw new Error('RNSTabsHost update failed at ' + phase + ': ' + error);
    }
  },
  mounted(controller: any, props: any) {
    'worklet';
    const key = '__rnsNativeScriptTabsRegistry';
    const globalObject = globalThis as Record<string, any>;
    const registry = globalObject[key] ?? { hosts: {} };
    globalObject[key] = registry;
    const existing = registry.hosts[props.hostId];
    registry.hosts[props.hostId] = {
      controller,
      screens: existing?.screens ?? [],
      selectedScreenKey: props.navStateRequest.selectedScreenKey,
      provenance: props.navStateRequest.baseProvenance,
    };

    controller.tabBar.hidden = props.tabBarHidden === true;
    configureTabBarController(controller, props);

    const host = registry.hosts[props.hostId];
    if (!host) {
      return;
    }
    commitTabsHost(host);
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
    const UIViewController = api?.UIViewController ?? globals.UIViewController;
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
    const UIColor = api?.UIColor ?? globals.UIColor;
    controller.view.backgroundColor = UIColor.systemBackgroundColor;

    controller.title = props.title ?? props.screenKey;
    controller.tabBarItem = makeTabBarItem(props);
    return controller;
  },
  childrenView(controller: any) {
    'worklet';
    return controller.view;
  },
  update(controller: any, props: any) {
    'worklet';
    controller.title = props.title ?? props.screenKey;
    if (controller.tabBarItem) {
      configureTabBarItem(controller.tabBarItem, props);
    } else {
      controller.tabBarItem = makeTabBarItem(props);
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
    commitTabsHost(host);
    scheduleTabsHostCommit(props.hostId);
  },
  mounted(controller: any, props: any, ctx: any) {
    'worklet';
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
    commitTabsHost(host);
    scheduleTabsHostCommit(props.hostId);
    ctx?.emit('onWillAppear', {});
    ctx?.emit('onDidAppear', {});
  },
  dispose(controller: any, props: any, ctx: any) {
    'worklet';
    const key = '__rnsNativeScriptTabsRegistry';
    const globalObject = globalThis as Record<string, any>;
    const registry = globalObject[key];
    const host = registry?.hosts?.[props.hostId];
    if (host) {
      removeTabsScreenRecord(host, controller, props);
      commitTabsHost(host);
      scheduleTabsHostCommit(props.hostId);
    }
    ctx?.emit('onWillDisappear', {});
    ctx?.emit('onDidDisappear', {});
  },
});

export function NativeScriptTabsHost(props: TabsHostProps) {
  const hostId = React.useId();
  const { onTabSelected } = props;
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
      reconcileSelectedTabControllerView(controller);
    }, hostId).catch(() => undefined);
  }, [hostId]);
  const handleTabSelected = React.useCallback(
    (event: NativeSyntheticEvent<TabSelectedEvent>) => {
      reconcileTabsHost();
      onTabSelected?.(event);
    },
    [onTabSelected, reconcileTabsHost],
  );
  const children = React.Children.map(props.children, (child, index) => {
    if (!React.isValidElement(child)) {
      return child;
    }
    return React.cloneElement(child as React.ReactElement<any>, {
      __nativeScriptTabsIndex: index,
    });
  });

  const hostControllerProps: React.ComponentProps<typeof TabsHostController> = {
    hostId,
    navStateRequest: props.navStateRequest,
    style: { flex: 1 },
    children,
    onTabSelected: handleTabSelected,
  };
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
