/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/prefer-for-of */
import React from 'react';
import { StyleSheet, type NativeSyntheticEvent, type ViewProps } from 'react-native';
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

const TabsRuntimeContext = React.createContext<TabsRuntimeContextValue | null>(null);

function nativeValue(name: string): any {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const api = globalObject.__nativeScriptNativeApi;
  return api?.[name] ?? globalObject[name];
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

function makeTabBarItem(props: any): any {
  'worklet';
  const UITabBarItem = nativeValue('UITabBarItem');
  if (!UITabBarItem || typeof UITabBarItem.alloc !== 'function') {
    throw new Error(`UITabBarItem is not allocatable in the UI runtime: ${typeof UITabBarItem}`);
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
      itemAllocated && typeof itemAllocated.initWithTabBarSystemItemTag === 'function'
        ? itemAllocated.initWithTabBarSystemItemTag(mappedSystemItem, props.__nativeScriptTabsIndex ?? 0)
        : itemAllocated.init();
    if (title != null) {
      item.title = title;
    }
  } else {
    item =
      itemAllocated && typeof itemAllocated.initWithTitleImageSelectedImage === 'function'
        ? itemAllocated.initWithTitleImageSelectedImage(title, icon, selectedIcon)
        : itemAllocated.init();
    item.title = title;
    if (icon) {
      item.image = icon;
    }
    if (selectedIcon) {
      item.selectedImage = selectedIcon;
    }
  }
  if (props.badgeValue != null) {
    item.badgeValue = '' + props.badgeValue;
  }
  if (props.tabBarItemTestID != null) {
    item.accessibilityIdentifier = '' + props.tabBarItemTestID;
  }
  if (props.tabBarItemAccessibilityLabel != null) {
    item.accessibilityLabel = '' + props.tabBarItemAccessibilityLabel;
  }
  return item;
}

function configureTabBarController(controller: any, props: any) {
  'worklet';
  const backgroundColor = nativeColor(props.backgroundColor, 'systemBackgroundColor');
  const tintColor = nativeColor(props.tintColor, 'systemBlueColor');
  if (backgroundColor) {
    controller.view.backgroundColor = backgroundColor;
  }
  if (tintColor) {
    controller.tabBar.tintColor = tintColor;
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
  return typeof array.count === 'number' ? array.count : (array.length ?? 0);
}

function flexibleSizeMask(): number {
  'worklet';
  const autoresizing = nativeValue('UIViewAutoresizing');
  return (autoresizing?.FlexibleWidth ?? 2) + (autoresizing?.FlexibleHeight ?? 16);
}

function flexibleWidthTopMarginMask(): number {
  'worklet';
  const autoresizing = nativeValue('UIViewAutoresizing');
  return (autoresizing?.FlexibleWidth ?? 2) + (autoresizing?.FlexibleTopMargin ?? 32);
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
      ? tabController.view.viewWithTag(83912041)
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
  const hostFrame = hostView.bounds ?? hostView.frame;
  const width = hostFrame?.size?.width ?? hostView.frame?.size?.width ?? 0;
  const hostHeight = hostFrame?.size?.height ?? hostView.frame?.size?.height ?? 0;
  if (width > 0 && hostHeight > 0) {
    const safeBottom = hostView.safeAreaInsets?.bottom ?? 0;
    const tabBarHeight = 49 + safeBottom;
    const CGRectMake = nativeValue('CGRectMake');
    tabBar.frame =
      typeof CGRectMake === 'function'
        ? CGRectMake(0, hostHeight - tabBarHeight, width, tabBarHeight)
        : {origin: {x: 0, y: hostHeight - tabBarHeight}, size: {width, height: tabBarHeight}};
    tabBar.autoresizingMask = flexibleWidthTopMarginMask();
  }
  if (typeof tabBar.setNeedsLayout === 'function') {
    tabBar.setNeedsLayout();
  }
  if (typeof tabBar.layoutIfNeeded === 'function') {
    tabBar.layoutIfNeeded();
  }
  if (tabBar.layer) {
    tabBar.layer.zPosition = 1000;
  }
  let frontView = tabBar;
  for (let depth = 0; depth < 3; depth++) {
    const parent = frontView?.superview;
    if (!parent || typeof parent.bringSubviewToFront !== 'function') {
      return;
    }
    if (frontView.layer) {
      frontView.layer.zPosition = 1000;
    }
    parent.bringSubviewToFront(frontView);
    frontView = parent;
  }
}

function scheduleTabBarVisible(tabController: any) {
  'worklet';
  if (typeof setTimeout !== 'function') {
    return;
  }
  const keepVisible = () => {
    'worklet';
    try {
      keepTabBarVisible(tabController);
    } catch {
      // The scheduled tab bar pass is best-effort; the controller can be stale
      // after a fast tab/stack transition.
    }
  };
  setTimeout(keepVisible, 0);
  setTimeout(keepVisible, 32);
  setTimeout(keepVisible, 120);
}

function reconcileSelectedTabControllerView(tabController: any, explicitSelectedController?: any) {
  'worklet';
  const selectedController = explicitSelectedController ?? tabController?.selectedViewController;
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
  const width = hostFrame?.size?.width ?? tabController.view.frame?.size?.width ?? 0;
  const hostHeight = hostFrame?.size?.height ?? tabController.view.frame?.size?.height ?? 0;

  const CGRectMake = nativeValue('CGRectMake');
  selectedController.view.frame =
    typeof CGRectMake === 'function'
      ? CGRectMake(0, 0, width, hostHeight)
      : {origin: {x: 0, y: 0}, size: {width, height: hostHeight}};
  selectedController.view.autoresizingMask = flexibleSizeMask();
  selectedController.view.clipsToBounds = true;
  layoutHostedReactSubviews(selectedController);
  keepTabBarVisible(tabController);
  scheduleTabBarVisible(tabController);
}

const TabsHostController =
  NativeScriptRuntime.defineUIViewController<{
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
  }, any>({
    debugName: 'RNSTabsHostIOS.NativeScript',
    layout: {sizing: 'fill'},
    createController(ctx: any) {
      'worklet';
      const api = (globalThis as Record<string, any>).__nativeScriptNativeApi;
      const globals = globalThis as Record<string, any>;
      const UITabBarController = api?.UITabBarController ?? globals.UITabBarController;
      if (!UITabBarController || typeof UITabBarController.alloc !== 'function') {
        throw new Error(
          `UITabBarController is not allocatable in the UI runtime: ${typeof UITabBarController}`,
        );
      }
      const allocated = UITabBarController.alloc();
      const controller = allocated && typeof allocated.init === 'function' ? allocated.init() : allocated;
      configureTabBarController(controller, ctx);
      const UIView = api?.UIView ?? globals.UIView;
      if (UIView && typeof UIView.alloc === 'function') {
        const mountViewAllocated = UIView.alloc();
        const mountView =
          mountViewAllocated && typeof mountViewAllocated.init === 'function'
            ? mountViewAllocated.init()
            : mountViewAllocated;
        mountView.tag = 83912041;
        mountView.hidden = true;
        mountView.userInteractionEnabled = false;
        mountView.frame = controller.view.bounds;
        mountView.autoresizingMask = flexibleSizeMask();
        controller.view.addSubview(mountView);
      }
      const delegateProtocol = api?.UITabBarControllerDelegate ?? globals.UITabBarControllerDelegate;
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
      const emitSelection = (host: any, selectedController: any, repeated: boolean) => {
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
      const emitObservedSelection = (selectedController: any) => {
        'worklet';
        const key = '__rnsNativeScriptTabsRegistry';
        const globalObject = globalThis as Record<string, any>;
        const registry = globalObject[key];
        const host = registry?.hosts?.[ctx.hostId];
        if (!host || !selectedController) {
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
        tabBarControllerDidSelectTabPreviousTab(_tabController: any, selectedTab: any) {
          'worklet';
          const key = '__rnsNativeScriptTabsRegistry';
          const globalObject = globalThis as Record<string, any>;
          const registry = globalObject[key];
          const host = registry?.hosts?.[ctx.hostId];
          if (!host) {
            return;
          }
          const selectedController = selectedTab?.viewController;
          const screen = screenForController(host, selectedController);
          if (!screen) {
            return;
          }
          emitSelection(host, selectedController, host.selectedScreenKey === screen.screenKey);
          reconcileSelectedTabControllerView(_tabController, selectedController);
        },
        tabBarControllerShouldSelectViewController(_tabController: any, selectedController: any) {
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
        tabBarControllerDidSelectViewController(_tabController: any, selectedController: any) {
          'worklet';
          const key = '__rnsNativeScriptTabsRegistry';
          const globalObject = globalThis as Record<string, any>;
          const registry = globalObject[key];
          const host = registry?.hosts?.[ctx.hostId];
          if (!host) {
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
          emitSelection(host, selectedController, host.selectedScreenKey === screen.screenKey);
          reconcileSelectedTabControllerView(_tabController);
        },
      });
      ctx.observe(controller, 'selectedViewController', (selectedController: any) => {
        'worklet';
        emitObservedSelection(selectedController);
      });
      ctx.observe(controller, 'selectedIndex', () => {
        'worklet';
        emitObservedSelection(controller.selectedViewController);
      });
      return controller;
    },
    childrenView(controller: any) {
      'worklet';
      const existingMountView =
        controller.view && typeof controller.view.viewWithTag === 'function'
          ? controller.view.viewWithTag(83912041)
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
        mountView.tag = 83912041;
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
      const api = globalObject.__nativeScriptNativeApi;
      const registry = globalObject[key] ?? {hosts: {}};
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
      const controllers: any[] = [];
      let selectedIndex = -1;
      let maxIndex = -1;
      phase = 'max-index';
      for (let index = 0; index < host.screens.length; index++) {
        const screen = host.screens[index];
        if (screen.index > maxIndex) {
          maxIndex = screen.index;
        }
      }
      phase = 'controllers';
      for (let slot = 0; slot <= maxIndex; slot++) {
        for (let index = 0; index < host.screens.length; index++) {
          const screen = host.screens[index];
          if (screen.index === slot) {
            if (screen.screenKey === host.selectedScreenKey) {
              selectedIndex = controllers.length;
            }
            const parent = screen.controller.parentViewController;
            if (parent && parent !== host.controller) {
              screen.controller.willMoveToParentViewController(null);
              screen.controller.removeFromParentViewController();
            }
            controllers[controllers.length] = screen.controller;
          }
        }
      }
      phase = 'view-controllers';
      const NSArray = api?.NSArray ?? globalObject.NSArray;
      const nativeControllers =
        NSArray && typeof NSArray.arrayWithArray === 'function'
          ? NSArray.arrayWithArray(controllers)
          : controllers;
      if (typeof host.controller.setViewControllersAnimated === 'function') {
        host.controller.setViewControllersAnimated(nativeControllers, false);
      } else {
        host.controller.viewControllers = nativeControllers;
      }
      if (selectedIndex >= 0 && host.controller.selectedIndex !== selectedIndex) {
        phase = 'selected-index';
        host.controller.selectedIndex = selectedIndex;
      }
      if (selectedIndex >= 0 && controllers[selectedIndex]) {
        host.controller.selectedViewController = controllers[selectedIndex];
      }
      host.controller.view.setNeedsLayout();
      host.controller.view.layoutIfNeeded();
      reconcileSelectedTabControllerView(host.controller);
      } catch (error) {
        throw new Error('RNSTabsHost update failed at ' + phase + ': ' + error);
      }
    },
    mounted(controller: any, props: any) {
      'worklet';
      const key = '__rnsNativeScriptTabsRegistry';
      const globalObject = globalThis as Record<string, any>;
      const registry = globalObject[key] ?? {hosts: {}};
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
      const controllers: any[] = [];
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
            const parent = screen.controller.parentViewController;
            if (parent && parent !== host.controller) {
              screen.controller.willMoveToParentViewController(null);
              screen.controller.removeFromParentViewController();
            }
            controllers[controllers.length] = screen.controller;
          }
        }
      }
      const api = (globalThis as Record<string, any>).__nativeScriptNativeApi;
      const NSArray = api?.NSArray ?? globalObject.NSArray;
      const nativeControllers =
        NSArray && typeof NSArray.arrayWithArray === 'function'
          ? NSArray.arrayWithArray(controllers)
          : controllers;
      if (typeof host.controller.setViewControllersAnimated === 'function') {
        host.controller.setViewControllersAnimated(nativeControllers, false);
      } else {
        host.controller.viewControllers = nativeControllers;
      }
      if (selectedIndex >= 0 && host.controller.selectedIndex !== selectedIndex) {
        host.controller.selectedIndex = selectedIndex;
      }
      if (selectedIndex >= 0 && controllers[selectedIndex]) {
        host.controller.selectedViewController = controllers[selectedIndex];
      }
      host.controller.view.setNeedsLayout();
      host.controller.view.layoutIfNeeded();
      reconcileSelectedTabControllerView(host.controller);
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

const TabsScreenController =
  NativeScriptRuntime.defineUIViewController<TabsScreenNativeScriptProps & {hostId: string; style?: unknown}, any>({
    debugName: 'RNSTabsScreenIOS.NativeScript',
    layout: {sizing: 'fill'},
    createController(props: any) {
      'worklet';
      const api = (globalThis as Record<string, any>).__nativeScriptNativeApi;
      const globals = globalThis as Record<string, any>;
      const UIViewController = api?.UIViewController ?? globals.UIViewController;
      if (!UIViewController || typeof UIViewController.alloc !== 'function') {
        throw new Error(`UIViewController is not allocatable in the UI runtime: ${typeof UIViewController}`);
      }
      const allocated = UIViewController.alloc();
      const controller = allocated && typeof allocated.init === 'function' ? allocated.init() : allocated;
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
      const api = (globalThis as Record<string, any>).__nativeScriptNativeApi;
      controller.title = props.title ?? props.screenKey;
      controller.tabBarItem = makeTabBarItem(props);

      const key = '__rnsNativeScriptTabsRegistry';
      const globalObject = globalThis as Record<string, any>;
      const registry = globalObject[key] ?? {hosts: {}};
      globalObject[key] = registry;
      const host =
        registry.hosts[props.hostId] ??
        {screens: [], selectedScreenKey: props.screenKey, provenance: 0};
      registry.hosts[props.hostId] = host;
      let existingIndex = -1;
      for (let index = 0; index < host.screens.length; index++) {
        if (host.screens[index].screenKey === props.screenKey || host.screens[index].controller === controller) {
          existingIndex = index;
          break;
        }
      }
      const screenRecord = {
        screenKey: props.screenKey,
        controller,
        index: props.__nativeScriptTabsIndex ?? 0,
        preventNativeSelection: props.preventNativeSelection === true,
      };
      if (existingIndex >= 0) {
        host.screens[existingIndex] = screenRecord;
      } else {
        host.screens[host.screens.length] = screenRecord;
      }
      const controllers: any[] = [];
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
            const parent = screen.controller.parentViewController;
            if (parent && parent !== host.controller) {
              screen.controller.willMoveToParentViewController(null);
              screen.controller.removeFromParentViewController();
            }
            controllers[controllers.length] = screen.controller;
          }
        }
      }
      if (host.controller) {
        const NSArray = api?.NSArray ?? globalObject.NSArray;
        const nativeControllers =
          NSArray && typeof NSArray.arrayWithArray === 'function'
            ? NSArray.arrayWithArray(controllers)
            : controllers;
        if (typeof host.controller.setViewControllersAnimated === 'function') {
          host.controller.setViewControllersAnimated(nativeControllers, false);
        } else {
          host.controller.viewControllers = nativeControllers;
        }
        if (selectedIndex >= 0 && host.controller.selectedIndex !== selectedIndex) {
          host.controller.selectedIndex = selectedIndex;
        }
        if (selectedIndex >= 0 && controllers[selectedIndex]) {
          host.controller.selectedViewController = controllers[selectedIndex];
        }
        host.controller.view.setNeedsLayout();
        host.controller.view.layoutIfNeeded();
        reconcileSelectedTabControllerView(host.controller);
      }
    },
    mounted(controller: any, props: any, ctx: any) {
      'worklet';
      const key = '__rnsNativeScriptTabsRegistry';
      const globalObject = globalThis as Record<string, any>;
      const registry = globalObject[key] ?? {hosts: {}};
      globalObject[key] = registry;
      const host =
        registry.hosts[props.hostId] ??
        {screens: [], selectedScreenKey: props.screenKey, provenance: 0};
      registry.hosts[props.hostId] = host;
      {
        let existingIndex = -1;
        for (let index = 0; index < host.screens.length; index++) {
          if (host.screens[index].screenKey === props.screenKey || host.screens[index].controller === controller) {
            existingIndex = index;
            break;
          }
        }
        const screenRecord = {
          screenKey: props.screenKey,
          controller,
          index: props.__nativeScriptTabsIndex ?? 0,
          preventNativeSelection: props.preventNativeSelection === true,
        };
        if (existingIndex >= 0) {
          host.screens[existingIndex] = screenRecord;
        } else {
          host.screens[host.screens.length] = screenRecord;
        }
        const controllers: any[] = [];
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
              const parent = screen.controller.parentViewController;
              if (parent && parent !== host.controller) {
                screen.controller.willMoveToParentViewController(null);
                screen.controller.removeFromParentViewController();
              }
              controllers[controllers.length] = screen.controller;
            }
          }
        }
        if (host.controller) {
          const api = (globalThis as Record<string, any>).__nativeScriptNativeApi;
          const NSArray = api?.NSArray ?? globalObject.NSArray;
          const nativeControllers =
            NSArray && typeof NSArray.arrayWithArray === 'function'
              ? NSArray.arrayWithArray(controllers)
              : controllers;
          if (typeof host.controller.setViewControllersAnimated === 'function') {
            host.controller.setViewControllersAnimated(nativeControllers, false);
          } else {
            host.controller.viewControllers = nativeControllers;
          }
          if (selectedIndex >= 0 && host.controller.selectedIndex !== selectedIndex) {
            host.controller.selectedIndex = selectedIndex;
          }
          if (selectedIndex >= 0 && controllers[selectedIndex]) {
            host.controller.selectedViewController = controllers[selectedIndex];
          }
          host.controller.view.setNeedsLayout();
          host.controller.view.layoutIfNeeded();
          reconcileSelectedTabControllerView(host.controller);
        }
      }
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
        for (let index = host.screens.length - 1; index >= 0; index--) {
          if (host.screens[index].screenKey === props.screenKey || host.screens[index].controller === controller) {
            for (let moveIndex = index; moveIndex < host.screens.length - 1; moveIndex++) {
              host.screens[moveIndex] = host.screens[moveIndex + 1];
            }
            host.screens.length = host.screens.length - 1;
          }
        }
        const controllers: any[] = [];
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
              const parent = screen.controller.parentViewController;
              if (parent && parent !== host.controller) {
                screen.controller.willMoveToParentViewController(null);
                screen.controller.removeFromParentViewController();
              }
              controllers[controllers.length] = screen.controller;
            }
          }
        }
        const api = (globalThis as Record<string, any>).__nativeScriptNativeApi;
        const NSArray = api?.NSArray ?? globalObject.NSArray;
        const nativeControllers =
          NSArray && typeof NSArray.arrayWithArray === 'function'
            ? NSArray.arrayWithArray(controllers)
            : controllers;
        if (typeof host.controller.setViewControllersAnimated === 'function') {
          host.controller.setViewControllersAnimated(nativeControllers, false);
        } else {
          host.controller.viewControllers = nativeControllers;
        }
        if (selectedIndex >= 0 && host.controller.selectedIndex !== selectedIndex) {
          host.controller.selectedIndex = selectedIndex;
        }
        if (selectedIndex >= 0 && controllers[selectedIndex]) {
          host.controller.selectedViewController = controllers[selectedIndex];
        }
        host.controller.view.setNeedsLayout();
        host.controller.view.layoutIfNeeded();
        reconcileSelectedTabControllerView(host.controller);
      }
      ctx?.emit('onWillDisappear', {});
      ctx?.emit('onDidDisappear', {});
    },
  });

export function NativeScriptTabsHost(props: TabsHostProps) {
  const hostId = React.useId();
  const {onTabSelected} = props;
  const [nativeSelectionTick, setNativeSelectionTick] = React.useState(0);
  const restoreTabBarWrapper = React.useCallback(() => {
    NativeScriptRuntime.runOnUI((targetHostId: string) => {
      'worklet';
      const registry = (globalThis as Record<string, any>).__rnsNativeScriptTabsRegistry;
      const controller = registry?.hosts?.[targetHostId]?.controller;
      const tabBar = controller?.tabBar;
      const wrapper = tabBar?.superview?.superview;
      const wrapperParent = wrapper?.superview;
      if (!tabBar || !wrapper || !wrapperParent || typeof wrapperParent.bringSubviewToFront !== 'function') {
        return;
      }
      tabBar.hidden = false;
      tabBar.alpha = 1;
      tabBar.userInteractionEnabled = true;
      if (tabBar.layer) {
        tabBar.layer.zPosition = 10000;
      }
      if (wrapper.layer) {
        wrapper.layer.zPosition = 10000;
      }
      wrapperParent.bringSubviewToFront(wrapper);
    }, hostId).catch(() => undefined);
  }, [hostId]);
  const handleTabSelected = React.useCallback(
    (event: NativeSyntheticEvent<TabSelectedEvent>) => {
      setNativeSelectionTick((value) => (value + 1) % 1000000);
      restoreTabBarWrapper();
      setTimeout(restoreTabBarWrapper, 0);
      setTimeout(restoreTabBarWrapper, 250);
      setTimeout(restoreTabBarWrapper, 1000);
      setTimeout(restoreTabBarWrapper, 2000);
      onTabSelected?.(event);
    },
    [onTabSelected, restoreTabBarWrapper],
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
    style: {flex: 1},
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
    hostControllerProps.backgroundColor = props.nativeContainerStyle.backgroundColor;
  }
  if (props.ios?.tabBarControllerMode !== undefined) {
    hostControllerProps.tabBarControllerMode = props.ios.tabBarControllerMode;
  }
  if (props.ios?.tabBarMinimizeBehavior !== undefined) {
    hostControllerProps.tabBarMinimizeBehavior = props.ios.tabBarMinimizeBehavior;
  }

  React.useEffect(() => {
    const applyTabBarLayout = () => {
      NativeScriptRuntime.runOnUI((targetHostId: string) => {
        'worklet';
        const globalObject = globalThis as Record<string, any>;
        const registry = globalObject.__rnsNativeScriptTabsRegistry;
        const host = registry?.hosts?.[targetHostId];
        const controller = host?.controller;
        if (!controller) {
          return;
        }
        reconcileSelectedTabControllerView(controller);
      }, hostId).catch(() => undefined);
    };
    applyTabBarLayout();
    const timeouts = [
      setTimeout(applyTabBarLayout, 0),
      setTimeout(applyTabBarLayout, 32),
      setTimeout(applyTabBarLayout, 120),
      setTimeout(applyTabBarLayout, 250),
    ];
    return () => {
      for (const timeout of timeouts) {
        clearTimeout(timeout);
      }
    };
  }, [hostId, nativeSelectionTick, props.navStateRequest.baseProvenance, props.navStateRequest.selectedScreenKey]);

  React.useEffect(() => {
    restoreTabBarWrapper();
    const interval = setInterval(restoreTabBarWrapper, 250);
    return () => {
      clearInterval(interval);
    };
  }, [restoreTabBarWrapper]);

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
