/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/prefer-for-of */
import React from 'react';
import { StyleSheet, type ViewProps } from 'react-native';
import NativeScriptRuntime from '@nativescript/react-native';
import type { StackHostProps } from '../host/StackHost.types';
import type { StackScreenProps } from '../screen/StackScreen.types';
import type {
  StackHeaderConfigProps,
  StackHeaderConfigPropsBase,
} from '../header/StackHeaderConfig.types';
import type {
  StackHeaderInlineCustomItemIOS,
  StackHeaderInlineItemIOS,
  StackHeaderSpacerItemIOS,
  StackHeaderTitleCustomItemIOS,
} from '../header/StackHeaderConfig.ios.types';
import type {
  StackHeaderItemPlacement,
  StackHeaderItemProps,
} from '../header/ios/StackHeaderItem.ios.types';
import type {
  StackHeaderItemSpacerPlacement,
  StackHeaderItemSpacerProps,
} from '../header/ios/StackHeaderItemSpacer.ios.types';

type NativeScriptGammaStackHostProps = {
  children?: React.ReactNode;
  hostId: string;
  style?: ViewProps['style'];
};

type NativeScriptGammaStackScreenProps = Omit<
  StackScreenProps,
  'onDismiss' | 'onNativeDismiss'
> & {
  __nativeScriptGammaStackIndex?: number;
  hostId: string;
  onDismiss?: (event: { nativeEvent: { isNativeDismiss: boolean } }) => void;
  style?: ViewProps['style'];
};

type GammaStackRuntimeContextValue = {
  hostId: string;
};

type GammaStackScreenRuntimeContextValue = {
  hostId: string;
  screenKey: string;
};

type NativeScriptGammaStackHeaderConfigProps = StackHeaderConfigPropsBase & {
  children?: React.ReactNode;
  configId: string;
  hostId: string;
  largeSubtitle?: string | undefined;
  largeTitle?: string | undefined;
  largeTitleEnabled?: boolean | undefined;
  screenKey: string;
  style?: ViewProps['style'];
};

type NativeScriptGammaStackHeaderItemProps = StackHeaderItemProps & {
  children?: React.ReactNode;
  configId?: string | undefined;
  hasCustomView?: boolean | undefined;
  itemId?: string | undefined;
  order?: number | undefined;
  style?: ViewProps['style'];
};

type NativeScriptGammaStackHeaderItemSpacerProps =
  StackHeaderItemSpacerProps & {
    configId?: string | undefined;
    itemId?: string | undefined;
    order?: number | undefined;
    style?: ViewProps['style'];
  };

const GammaStackRuntimeContext =
  React.createContext<GammaStackRuntimeContextValue | null>(null);

const GammaStackScreenRuntimeContext =
  React.createContext<GammaStackScreenRuntimeContextValue | null>(null);

const GAMMA_STACK_MOUNT_VIEW_TAG = 83912042;
const GAMMA_STACK_HEADER_STAGING_VIEW_TAG = 83912043;
const GAMMA_STACK_NAVIGATION_CONTROLLER_CLASS_KEY =
  '__rnsGammaStackNavigationControllerNativeScriptClass';
const GAMMA_STACK_SCREEN_CONTROLLER_CLASS_KEY =
  '__rnsGammaStackScreenControllerNativeScriptClass';

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

function flexibleSizeMask(): number {
  'worklet';
  const autoresizing = nativeValue('UIViewAutoresizing');
  return (
    (autoresizing?.FlexibleWidth ?? autoresizing?.flexibleWidth ?? 2) |
    (autoresizing?.FlexibleHeight ?? autoresizing?.flexibleHeight ?? 16)
  );
}

function arrayCount(array: any): number {
  'worklet';
  if (!array) {
    return 0;
  }
  return typeof array.count === 'number' ? array.count : array.length ?? 0;
}

function arrayItem(array: any, index: number): any {
  'worklet';
  if (!array) {
    return null;
  }
  if (typeof array.objectAtIndex === 'function') {
    return array.objectAtIndex(index);
  }
  return array[index] ?? null;
}

function nativeArrayFromArray(items: any[]): any {
  'worklet';
  const NSArray = nativeValue('NSArray');
  return NSArray && typeof NSArray.arrayWithArray === 'function'
    ? NSArray.arrayWithArray(items)
    : items;
}

function gammaStackLargeTitleDisplayMode(enabled: boolean) {
  'worklet';
  const enumValue = nativeValue('UINavigationItemLargeTitleDisplayMode');

  return enabled
    ? enumValue?.Always ?? enumValue?.always ?? 1
    : enumValue?.Never ?? enumValue?.never ?? 2;
}

function gammaStackPlainBarButtonStyle() {
  'worklet';
  const style = nativeValue('UIBarButtonItemStyle');

  return style?.Plain ?? style?.plain ?? 0;
}

function nilIfEmpty(value: unknown): string | null {
  'worklet';
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function createGammaStackUIView() {
  'worklet';
  const UIView = nativeClassValue('UIView');
  if (!UIView || typeof UIView.alloc !== 'function') {
    return null;
  }
  const allocated = UIView.alloc();
  return allocated && typeof allocated.init === 'function'
    ? allocated.init()
    : allocated;
}

function navigationControllerContainsController(
  navigationController: any,
  controller: any,
): boolean {
  'worklet';
  const viewControllers = navigationController?.viewControllers;
  const count = arrayCount(viewControllers);
  for (let index = 0; index < count; index += 1) {
    if (arrayItem(viewControllers, index) === controller) {
      return true;
    }
  }
  return false;
}

function topViewController(navigationController: any) {
  'worklet';
  return (
    navigationController?.topViewController ??
    arrayItem(
      navigationController?.viewControllers,
      arrayCount(navigationController?.viewControllers) - 1,
    )
  );
}

function emitGammaStackScreenEvent(
  controller: any,
  eventName: string,
  payload: any,
) {
  'worklet';
  controller?.__rnsGammaStackEventContext?.emit?.(eventName, payload);
}

function callGammaStackControllerSuper(
  controller: any,
  methodName: string,
  arg?: any,
) {
  'worklet';
  const superObject = controller?.super;
  const method = superObject?.[methodName];
  if (typeof method === 'function') {
    superObject[methodName](arg);
  }
}

function gammaStackScreenActivityMode(props: any): 'attached' | 'detached' {
  'worklet';
  return props?.activityMode === 'attached' ? 'attached' : 'detached';
}

function screenRecordForController(host: any, controller: any) {
  'worklet';
  if (!host || !controller) {
    return null;
  }
  for (let index = 0; index < host.screens.length; index += 1) {
    if (host.screens[index].controller === controller) {
      return host.screens[index];
    }
  }
  return null;
}

function emitGammaStackDismissIfNeeded(controller: any, parent: any) {
  'worklet';
  if (parent != null) {
    return;
  }

  const registry = (globalThis as Record<string, any>)
    .__rnsNativeScriptGammaStackRegistry;
  const host = registry?.hosts?.[controller.__rnsGammaStackHostId];
  const record =
    screenRecordForController(host, controller) ??
    registry?.screens?.[controller.__rnsGammaStackScreenKey];
  const isNativeDismiss = record?.activityMode !== 'detached';

  if (record && isNativeDismiss) {
    record.isNativelyDismissed = true;
  }

  // Direct port of RNSStackScreenController.didMoveToParentViewController:
  // a controller removed while its React activity mode is detached emits a JS
  // dismiss; removal while still attached is a native dismiss.
  emitGammaStackScreenEvent(controller, 'onDismiss', {
    nativeEvent: {
      isNativeDismiss,
    },
  });
}

function gammaStackNavigationControllerClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[GAMMA_STACK_NAVIGATION_CONTROLLER_CLASS_KEY];
  if (existing) {
    return existing;
  }

  const UINavigationController = nativeClassValue('UINavigationController');
  const NativeClassFunction = globalObject.NativeClass;
  if (
    !UINavigationController ||
    (typeof NativeClassFunction !== 'function' &&
      typeof UINavigationController.extend !== 'function')
  ) {
    return UINavigationController;
  }

  class RNSGammaStackNavigationController extends UINavigationController {
    viewDidLayoutSubviews() {
      'worklet';
      this.super?.viewDidLayoutSubviews?.();
    }
  }

  const interopTypes = globalObject.interop?.types;
  const exposedMethods = {
    viewDidLayoutSubviews: {
      params: [],
      returns: interopTypes?.void,
    },
  };

  defineObjCExposedMethods(
    RNSGammaStackNavigationController,
    exposedMethods,
  );

  if (typeof UINavigationController.extend === 'function') {
    const NavigationControllerClass = UINavigationController.extend(
      {
        viewDidLayoutSubviews:
          RNSGammaStackNavigationController.prototype.viewDidLayoutSubviews,
      },
      {
        exposedMethods,
        name: 'RNSGammaStackNavigationControllerNativeScript',
      },
    );
    globalObject[GAMMA_STACK_NAVIGATION_CONTROLLER_CLASS_KEY] =
      NavigationControllerClass;
    return NavigationControllerClass;
  }

  NativeClassFunction(RNSGammaStackNavigationController);
  globalObject[GAMMA_STACK_NAVIGATION_CONTROLLER_CLASS_KEY] =
    RNSGammaStackNavigationController;
  return RNSGammaStackNavigationController;
}

function gammaStackScreenControllerClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[GAMMA_STACK_SCREEN_CONTROLLER_CLASS_KEY];
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

  class RNSGammaStackScreenController extends UIViewController {
    viewWillAppear(animated: boolean) {
      'worklet';
      callGammaStackControllerSuper(this, 'viewWillAppear', animated);
      emitGammaStackScreenEvent(this, 'onWillAppear', {});
    }

    'viewWillAppear:'(animated: boolean) {
      'worklet';
      this.viewWillAppear(animated);
    }

    viewDidAppear(animated: boolean) {
      'worklet';
      callGammaStackControllerSuper(this, 'viewDidAppear', animated);
      emitGammaStackScreenEvent(this, 'onDidAppear', {});
    }

    'viewDidAppear:'(animated: boolean) {
      'worklet';
      this.viewDidAppear(animated);
    }

    viewWillDisappear(animated: boolean) {
      'worklet';
      callGammaStackControllerSuper(this, 'viewWillDisappear', animated);
      emitGammaStackScreenEvent(this, 'onWillDisappear', {});
    }

    'viewWillDisappear:'(animated: boolean) {
      'worklet';
      this.viewWillDisappear(animated);
    }

    viewDidDisappear(animated: boolean) {
      'worklet';
      callGammaStackControllerSuper(this, 'viewDidDisappear', animated);
      emitGammaStackScreenEvent(this, 'onDidDisappear', {});
    }

    'viewDidDisappear:'(animated: boolean) {
      'worklet';
      this.viewDidDisappear(animated);
    }

    didMoveToParentViewController(parent: any) {
      'worklet';
      callGammaStackControllerSuper(
        this,
        'didMoveToParentViewController',
        parent,
      );
      emitGammaStackDismissIfNeeded(this, parent);
    }

    'didMoveToParentViewController:'(parent: any) {
      'worklet';
      this.didMoveToParentViewController(parent);
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
    'didMoveToParentViewController:': {
      params: [],
      returns: interopTypes?.void,
    },
  };

  defineObjCExposedMethods(RNSGammaStackScreenController, exposedMethods);

  if (typeof UIViewController.extend === 'function') {
    const methods: Record<string, any> = {};
    const methodNames = Object.getOwnPropertyNames(
      RNSGammaStackScreenController.prototype,
    );
    for (const methodName of methodNames) {
      if (methodName === 'constructor') {
        continue;
      }
      const descriptor = Object.getOwnPropertyDescriptor(
        RNSGammaStackScreenController.prototype,
        methodName,
      );
      if (descriptor) {
        Object.defineProperty(methods, methodName, descriptor);
      }
    }
    const ScreenControllerClass = UIViewController.extend(methods, {
      exposedMethods,
      name: 'RNSGammaStackScreenControllerNativeScript',
    });
    globalObject[GAMMA_STACK_SCREEN_CONTROLLER_CLASS_KEY] =
      ScreenControllerClass;
    return ScreenControllerClass;
  }

  NativeClassFunction(RNSGammaStackScreenController);
  globalObject[GAMMA_STACK_SCREEN_CONTROLLER_CLASS_KEY] =
    RNSGammaStackScreenController;
  return RNSGammaStackScreenController;
}

function createGammaStackStagingMountView(controller: any) {
  'worklet';
  const UIView = nativeClassValue('UIView');
  if (!UIView || typeof UIView.alloc !== 'function') {
    return null;
  }
  const allocated = UIView.alloc();
  const mountView =
    allocated && typeof allocated.init === 'function'
      ? allocated.init()
      : allocated;
  mountView.tag = GAMMA_STACK_MOUNT_VIEW_TAG;
  mountView.hidden = true;
  mountView.userInteractionEnabled = false;
  mountView.frame = controller.view.bounds;
  mountView.autoresizingMask = flexibleSizeMask();
  controller.view.addSubview(mountView);
  return mountView;
}

function getGammaStackHostRecord(hostId: string) {
  'worklet';
  const registry = (globalThis as Record<string, any>)
    .__rnsNativeScriptGammaStackRegistry;
  return registry?.hosts?.[hostId];
}

function ensureGammaStackRegistry() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const registry = globalObject.__rnsNativeScriptGammaStackRegistry ?? {
    headerConfigs: {},
    headerItems: {},
    hosts: {},
    screens: {},
  };
  registry.headerConfigs = registry.headerConfigs ?? {};
  registry.headerItems = registry.headerItems ?? {};
  registry.hosts = registry.hosts ?? {};
  registry.screens = registry.screens ?? {};
  globalObject.__rnsNativeScriptGammaStackRegistry = registry;
  return registry;
}

function setGammaStackNativePropertyIfPresent(
  object: any,
  property: string,
  value: any,
) {
  'worklet';
  if (!object) {
    return;
  }

  try {
    if (property in object || value != null) {
      object[property] = value;
    }
  } catch {
    // Older iOS UINavigationItem instances do not expose the iOS 26 title
    // adjunct properties; upstream guards them with @available.
  }
}

function setGammaStackNavigationBarHidden(
  navigationController: any,
  hidden: boolean,
  animated: boolean,
) {
  'worklet';
  if (!navigationController) {
    return;
  }

  if (
    typeof navigationController.setNavigationBarHiddenAnimated === 'function'
  ) {
    navigationController.setNavigationBarHiddenAnimated(hidden, animated);
  } else if (
    typeof navigationController.setNavigationBarHidden === 'function'
  ) {
    navigationController.setNavigationBarHidden(hidden, animated);
  }

  navigationController.navigationBarHidden = hidden;
  if (navigationController.navigationBar) {
    navigationController.navigationBar.hidden = hidden;
  }
}

function setGammaStackBarButtonItems(
  navigationItem: any,
  side: 'left' | 'right',
  items: any[],
) {
  'worklet';
  const nativeItems = nativeArrayFromArray(items);
  if (
    side === 'left' &&
    typeof navigationItem.setLeftBarButtonItemsAnimated === 'function'
  ) {
    navigationItem.setLeftBarButtonItemsAnimated(nativeItems, true);
    return;
  }
  if (
    side === 'right' &&
    typeof navigationItem.setRightBarButtonItemsAnimated === 'function'
  ) {
    navigationItem.setRightBarButtonItemsAnimated(nativeItems, true);
    return;
  }

  if (side === 'left') {
    navigationItem.leftBarButtonItems = nativeItems;
  } else {
    navigationItem.rightBarButtonItems = nativeItems;
  }
}

function makeGammaStackHeaderWrappedView(record: any) {
  'worklet';
  const rootView = record?.rootView;
  if (!rootView) {
    return null;
  }

  const wrapper = createGammaStackUIView();
  if (!wrapper) {
    return rootView;
  }

  const UIColor = nativeValue('UIColor');
  wrapper.backgroundColor = UIColor?.clearColor ?? null;
  wrapper.userInteractionEnabled = true;
  wrapper.autoresizingMask = flexibleSizeMask();
  wrapper.__rnsGammaStackHeaderItemView = rootView;

  if (rootView.frame) {
    wrapper.frame = rootView.frame;
  }
  if (rootView.bounds) {
    wrapper.bounds = rootView.bounds;
  }

  rootView.hidden = false;
  rootView.userInteractionEnabled = true;
  rootView.autoresizingMask = flexibleSizeMask();
  if (typeof rootView.removeFromSuperview === 'function') {
    rootView.removeFromSuperview();
  }
  if (typeof wrapper.addSubview === 'function') {
    wrapper.addSubview(rootView);
  }

  return wrapper;
}

function makeGammaStackHeaderBarButtonItem(record: any) {
  'worklet';
  const UIBarButtonItem = nativeClassValue('UIBarButtonItem');
  if (!UIBarButtonItem) {
    return null;
  }

  if (record?.kind === 'spacer') {
    if (
      record.sizing === 'flexible' &&
      typeof UIBarButtonItem.flexibleSpaceItem === 'function'
    ) {
      return UIBarButtonItem.flexibleSpaceItem();
    }

    const width = typeof record.width === 'number' ? record.width : 0;
    if (typeof UIBarButtonItem.fixedSpaceItemOfWidth === 'function') {
      return UIBarButtonItem.fixedSpaceItemOfWidth(width);
    }

    if (typeof UIBarButtonItem.alloc !== 'function') {
      return null;
    }
    const allocated = UIBarButtonItem.alloc();
    const item =
      allocated && typeof allocated.init === 'function'
        ? allocated.init()
        : allocated;
    if (item) {
      item.width = width;
    }
    return item;
  }

  if (!record) {
    return null;
  }

  if (record.hasCustomView === true) {
    const wrapper = makeGammaStackHeaderWrappedView(record);
    if (!wrapper || typeof UIBarButtonItem.alloc !== 'function') {
      return null;
    }
    const allocated = UIBarButtonItem.alloc();
    const item =
      allocated && typeof allocated.initWithCustomView === 'function'
        ? allocated.initWithCustomView(wrapper)
        : allocated && typeof allocated.init === 'function'
        ? allocated.init()
        : allocated;
    if (item) {
      item.customView = wrapper;
    }
    return item;
  }

  if (typeof UIBarButtonItem.alloc !== 'function') {
    return null;
  }

  const allocated = UIBarButtonItem.alloc();
  const item =
    allocated && typeof allocated.initWithTitleStyleTargetAction === 'function'
      ? allocated.initWithTitleStyleTargetAction(
          record.label ?? '',
          gammaStackPlainBarButtonStyle(),
          null,
          null,
        )
      : allocated && typeof allocated.init === 'function'
      ? allocated.init()
      : allocated;

  if (item) {
    item.title = record.label ?? '';
    item.style = gammaStackPlainBarButtonStyle();
  }

  return item;
}

function makeGammaStackHeaderTitleView(record: any) {
  'worklet';
  return record?.kind === 'item' && record.hasCustomView === true
    ? makeGammaStackHeaderWrappedView(record)
    : null;
}

function orderedGammaStackHeaderChildren(config: any, registry: any) {
  'worklet';
  const records: any[] = [];
  const childIds = config?.childIds ?? [];
  for (let index = 0; index < childIds.length; index += 1) {
    const record = registry.headerItems?.[childIds[index]];
    if (record && record.configId === config.configId) {
      records[records.length] = record;
    }
  }

  records.sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
  return records;
}

function buildGammaStackHeaderData(config: any, registry: any) {
  'worklet';
  const leadingBarButtonItems: any[] = [];
  const trailingBarButtonItems: any[] = [];
  let titleView: any = null;
  let subtitleView: any = null;
  let largeSubtitleView: any = null;
  const children = orderedGammaStackHeaderChildren(config, registry);

  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];
    if (child.placement === 'leading') {
      const barItem = makeGammaStackHeaderBarButtonItem(child);
      if (barItem) {
        leadingBarButtonItems[leadingBarButtonItems.length] = barItem;
      }
    } else if (child.placement === 'trailing') {
      const barItem = makeGammaStackHeaderBarButtonItem(child);
      if (barItem) {
        trailingBarButtonItems[trailingBarButtonItems.length] = barItem;
      }
    } else if (child.placement === 'title') {
      titleView = makeGammaStackHeaderTitleView(child) ?? titleView;
    } else if (child.placement === 'subtitle') {
      subtitleView = makeGammaStackHeaderTitleView(child) ?? subtitleView;
    } else if (child.placement === 'largeSubtitle') {
      largeSubtitleView =
        makeGammaStackHeaderTitleView(child) ?? largeSubtitleView;
    }
  }

  return {
    hidden: config.hidden === true,
    largeSubtitle: nilIfEmpty(config.largeSubtitle),
    largeSubtitleView,
    largeTitle: nilIfEmpty(config.largeTitle),
    largeTitleEnabled: config.largeTitleEnabled === true,
    leadingBarButtonItems,
    subtitle: nilIfEmpty(config.subtitle),
    subtitleView,
    title: nilIfEmpty(config.title),
    titleView,
    trailingBarButtonItems,
  };
}

function applyGammaStackHeaderData(record: any, data: any, registry?: any) {
  'worklet';
  const controller = record?.controller;
  const navigationItem = controller?.navigationItem;
  if (!navigationItem) {
    return;
  }

  // Direct port of RNSStackNavigationItemCoordinator.applyToController:
  // the TS port writes the same UINavigationItem fields and keeps UIKit's
  // animated bar button updates.
  navigationItem.titleView = data.titleView ?? null;
  navigationItem.title = data.title ?? null;
  setGammaStackNativePropertyIfPresent(
    navigationItem,
    'largeTitle',
    data.largeTitle ?? null,
  );
  setGammaStackNativePropertyIfPresent(
    navigationItem,
    'subtitle',
    data.subtitle ?? null,
  );
  setGammaStackNativePropertyIfPresent(
    navigationItem,
    'largeSubtitle',
    data.largeSubtitle ?? null,
  );
  setGammaStackNativePropertyIfPresent(
    navigationItem,
    'subtitleView',
    data.subtitleView ?? null,
  );
  setGammaStackNativePropertyIfPresent(
    navigationItem,
    'largeSubtitleView',
    data.largeSubtitleView ?? null,
  );
  navigationItem.largeTitleDisplayMode = gammaStackLargeTitleDisplayMode(
    data.largeTitleEnabled === true,
  );
  navigationItem.leftItemsSupplementBackButton = true;
  setGammaStackBarButtonItems(
    navigationItem,
    'left',
    data.leadingBarButtonItems ?? [],
  );
  setGammaStackBarButtonItems(
    navigationItem,
    'right',
    data.trailingBarButtonItems ?? [],
  );

  const sourceRegistry =
    registry ??
    (globalThis as Record<string, any>).__rnsNativeScriptGammaStackRegistry;
  const navigationController =
    controller.navigationController ??
    sourceRegistry?.hosts?.[record.hostId]?.controller;
  setGammaStackNavigationBarHidden(
    navigationController,
    data.hidden === true,
    true,
  );
}

function submitGammaStackHeaderConfig(configId: string) {
  'worklet';
  const registry = (globalThis as Record<string, any>)
    .__rnsNativeScriptGammaStackRegistry;
  const config = registry?.headerConfigs?.[configId];
  const screen = config ? registry?.screens?.[config.screenKey] : null;
  if (!config || !screen) {
    return;
  }

  const data = buildGammaStackHeaderData(config, registry);
  screen.headerData = data;
  applyGammaStackHeaderData(screen, data, registry);
}

function scheduleGammaStackHeaderSubmit(configId: string | undefined) {
  'worklet';
  if (!configId) {
    return;
  }

  submitGammaStackHeaderConfig(configId);
}

function submitGammaStackHeaderConfigsForScreen(screenKey: string) {
  'worklet';
  const registry = (globalThis as Record<string, any>)
    .__rnsNativeScriptGammaStackRegistry;
  const configs = registry?.headerConfigs;
  if (!configs) {
    return;
  }

  const keys = Object.keys(configs);
  for (let index = 0; index < keys.length; index += 1) {
    const config = configs[keys[index]];
    if (config?.screenKey === screenKey) {
      scheduleGammaStackHeaderSubmit(config.configId);
    }
  }
}

function upsertGammaStackHeaderConfigRecord(view: any, props: any) {
  'worklet';
  const registry = ensureGammaStackRegistry();
  const existing = registry.headerConfigs[props.configId];
  const config =
    existing ??
    ({
      childIds: [],
      configId: props.configId,
    } as any);

  Object.assign(config, {
    hidden: props.hidden === true,
    hostId: props.hostId,
    largeSubtitle: props.largeSubtitle,
    largeTitle: props.largeTitle,
    largeTitleEnabled: props.largeTitleEnabled === true,
    rootView: view?.rootView ?? view,
    screenKey: props.screenKey,
    subtitle: props.subtitle,
    title: props.title,
  });

  registry.headerConfigs[props.configId] = config;
  scheduleGammaStackHeaderSubmit(props.configId);
}

function removeGammaStackHeaderConfigRecord(props: any) {
  'worklet';
  const registry = (globalThis as Record<string, any>)
    .__rnsNativeScriptGammaStackRegistry;
  const config = registry?.headerConfigs?.[props.configId];
  if (!config) {
    return;
  }

  const screen = registry?.screens?.[config.screenKey];
  if (screen) {
    const emptyData = buildGammaStackHeaderData(
      {
        childIds: [],
        hidden: false,
        largeTitleEnabled: false,
      },
      registry,
    );
    screen.headerData = undefined;
    applyGammaStackHeaderData(screen, emptyData, registry);
  }

  registry.headerConfigs[props.configId] = undefined;
}

function registerGammaStackHeaderChild(config: any, itemId: string) {
  'worklet';
  const childIds = config.childIds ?? [];
  for (let index = 0; index < childIds.length; index += 1) {
    if (childIds[index] === itemId) {
      config.childIds = childIds;
      return;
    }
  }
  childIds[childIds.length] = itemId;
  config.childIds = childIds;
}

function unregisterGammaStackHeaderChild(config: any, itemId: string) {
  'worklet';
  const childIds = config?.childIds ?? [];
  for (let index = childIds.length - 1; index >= 0; index -= 1) {
    if (childIds[index] === itemId) {
      for (
        let moveIndex = index;
        moveIndex < childIds.length - 1;
        moveIndex += 1
      ) {
        childIds[moveIndex] = childIds[moveIndex + 1];
      }
      childIds.length = childIds.length - 1;
    }
  }
  if (config) {
    config.childIds = childIds;
  }
}

function upsertGammaStackHeaderItemRecord(
  view: any,
  props: any,
  kind: 'item' | 'spacer',
) {
  'worklet';
  if (!props.configId || !props.itemId) {
    return;
  }

  const registry = ensureGammaStackRegistry();
  const config =
    registry.headerConfigs[props.configId] ??
    ({
      childIds: [],
      configId: props.configId,
    } as any);
  registry.headerConfigs[props.configId] = config;
  registerGammaStackHeaderChild(config, props.itemId);

  registry.headerItems[props.itemId] = {
    configId: props.configId,
    hasCustomView: props.hasCustomView === true,
    itemId: props.itemId,
    kind,
    label: props.label,
    order: props.order ?? 0,
    placement: props.placement,
    rootView: view?.rootView ?? view,
    sizing: props.sizing,
    width: props.width,
  };

  scheduleGammaStackHeaderSubmit(props.configId);
}

function removeGammaStackHeaderItemRecord(props: any) {
  'worklet';
  if (!props.configId || !props.itemId) {
    return;
  }

  const registry = (globalThis as Record<string, any>)
    .__rnsNativeScriptGammaStackRegistry;
  const config = registry?.headerConfigs?.[props.configId];
  unregisterGammaStackHeaderChild(config, props.itemId);
  if (registry?.headerItems) {
    registry.headerItems[props.itemId] = undefined;
  }
  scheduleGammaStackHeaderSubmit(props.configId);
}

function enqueueGammaStackOperation(
  host: any,
  kind: 'push' | 'pop',
  record: any,
) {
  'worklet';
  const key =
    kind === 'push' ? 'pendingPushScreenKeys' : 'pendingPopScreenKeys';
  const pending = host[key] ?? [];
  for (let index = 0; index < pending.length; index += 1) {
    if (pending[index] === record.screenKey) {
      host[key] = pending;
      return;
    }
  }
  pending[pending.length] = record.screenKey;
  host[key] = pending;
}

function upsertGammaStackScreenRecord(
  host: any,
  controller: any,
  props: any,
  ctx: any,
) {
  'worklet';
  let existingIndex = -1;
  for (let index = 0; index < host.screens.length; index += 1) {
    const screen = host.screens[index];
    if (
      screen.controller === controller ||
      screen.screenKey === props.screenKey
    ) {
      existingIndex = index;
      break;
    }
  }

  const activityMode = gammaStackScreenActivityMode(props);
  const previous = existingIndex >= 0 ? host.screens[existingIndex] : undefined;
  const record = {
    activityMode,
    controller,
    ctx,
    headerData: previous?.headerData,
    hostId: props.hostId,
    index: props.__nativeScriptGammaStackIndex ?? 0,
    isNativelyDismissed: previous?.isNativelyDismissed === true,
    preventNativeDismiss: props.preventNativeDismiss === true,
    screenKey: props.screenKey,
  };

  controller.__rnsGammaStackActivityMode = activityMode;
  controller.__rnsGammaStackEventContext = ctx;
  controller.__rnsGammaStackHostId = props.hostId;
  controller.__rnsGammaStackScreenKey = props.screenKey;

  if (existingIndex >= 0) {
    host.screens[existingIndex] = record;
  } else {
    host.screens[host.screens.length] = record;
  }

  if (record.headerData) {
    applyGammaStackHeaderData(record, record.headerData);
  }

  if (!previous && activityMode === 'attached') {
    enqueueGammaStackOperation(host, 'push', record);
  } else if (previous && previous.activityMode !== activityMode) {
    enqueueGammaStackOperation(
      host,
      activityMode === 'attached' ? 'push' : 'pop',
      record,
    );
  }

  return record;
}

function removeGammaStackScreenRecord(host: any, controller: any, props: any) {
  'worklet';
  for (let index = host.screens.length - 1; index >= 0; index -= 1) {
    const screen = host.screens[index];
    if (
      screen.controller === controller ||
      screen.screenKey === props.screenKey
    ) {
      if (
        screen.activityMode === 'attached' &&
        screen.isNativelyDismissed !== true
      ) {
        enqueueGammaStackOperation(host, 'pop', screen);
      }
      for (
        let moveIndex = index;
        moveIndex < host.screens.length - 1;
        moveIndex += 1
      ) {
        host.screens[moveIndex] = host.screens[moveIndex + 1];
      }
      host.screens.length = host.screens.length - 1;
    }
  }
}

function orderedGammaStackScreens(host: any) {
  'worklet';
  const ordered: any[] = [];
  let maxIndex = -1;
  for (let index = 0; index < host.screens.length; index += 1) {
    const screen = host.screens[index];
    if (screen.index > maxIndex) {
      maxIndex = screen.index;
    }
  }
  for (let slot = 0; slot <= maxIndex; slot += 1) {
    for (let index = 0; index < host.screens.length; index += 1) {
      const screen = host.screens[index];
      if (screen.index === slot) {
        ordered[ordered.length] = screen;
      }
    }
  }
  return ordered;
}

function orderedGammaStackRecordsForKeys(host: any, screenKeys: any[]) {
  'worklet';
  const orderedScreens = orderedGammaStackScreens(host);
  const records: any[] = [];
  for (let index = 0; index < orderedScreens.length; index += 1) {
    const screen = orderedScreens[index];
    for (let keyIndex = 0; keyIndex < screenKeys.length; keyIndex += 1) {
      if (screenKeys[keyIndex] === screen.screenKey) {
        records[records.length] = screen;
        break;
      }
    }
  }
  return records;
}

function commitGammaStackOperations(host: any) {
  'worklet';
  const navigationController = host?.controller;
  if (!navigationController) {
    return;
  }

  const popRecords = orderedGammaStackRecordsForKeys(
    host,
    host.pendingPopScreenKeys ?? [],
  );
  for (let index = popRecords.length - 1; index >= 0; index -= 1) {
    const record = popRecords[index];
    if (
      !navigationControllerContainsController(
        navigationController,
        record.controller,
      )
    ) {
      continue;
    }
    if (arrayCount(navigationController.viewControllers) <= 1) {
      continue;
    }
    if (topViewController(navigationController) !== record.controller) {
      continue;
    }
    record.controller.__rnsGammaStackActivityMode = record.activityMode;
    if (typeof navigationController.popViewControllerAnimated === 'function') {
      navigationController.popViewControllerAnimated(true);
    }
  }

  const pushRecords = orderedGammaStackRecordsForKeys(
    host,
    host.pendingPushScreenKeys ?? [],
  );
  for (let index = 0; index < pushRecords.length; index += 1) {
    const record = pushRecords[index];
    if (record.activityMode !== 'attached') {
      continue;
    }
    if (
      navigationControllerContainsController(
        navigationController,
        record.controller,
      )
    ) {
      continue;
    }
    record.controller.__rnsGammaStackActivityMode = record.activityMode;
    if (record.headerData) {
      applyGammaStackHeaderData(record, record.headerData);
    }
    if (typeof navigationController.pushViewControllerAnimated === 'function') {
      navigationController.pushViewControllerAnimated(record.controller, true);
    } else {
      const viewControllers = [];
      const existingCount = arrayCount(navigationController.viewControllers);
      for (let itemIndex = 0; itemIndex < existingCount; itemIndex += 1) {
        viewControllers[viewControllers.length] = arrayItem(
          navigationController.viewControllers,
          itemIndex,
        );
      }
      viewControllers[viewControllers.length] = record.controller;
      navigationController.viewControllers =
        nativeArrayFromArray(viewControllers);
    }
    if (record.headerData) {
      applyGammaStackHeaderData(record, record.headerData);
    }
  }

  host.pendingPopScreenKeys = [];
  host.pendingPushScreenKeys = [];

  // NATIVESCRIPT_PORT_DEVIATION: upstream executes the queued operations from
  // RCTMountingTransactionObserving after a Fabric transaction mounts. The TS
  // port receives host/screen records through separate NativeScript component
  // callbacks, so each host/screen registration synchronously drains the same
  // ordered push/pop queue after updating the shared registry.
}

function scheduleGammaStackCommit(hostId: string) {
  'worklet';
  const host = getGammaStackHostRecord(hostId);
  if (!host) {
    return;
  }

  commitGammaStackOperations(host);
}

function attachExistingGammaScreens(host: any) {
  'worklet';
  for (let index = 0; index < host.screens.length; index += 1) {
    const screen = host.screens[index];
    if (
      screen.activityMode === 'attached' &&
      !navigationControllerContainsController(
        host.controller,
        screen.controller,
      )
    ) {
      enqueueGammaStackOperation(host, 'push', screen);
    }
  }
}

const GammaStackHostController = NativeScriptRuntime.defineUIViewController<
  NativeScriptGammaStackHostProps,
  any
>({
  debugName: 'RNSStackHost.NativeScript',
  layout: { sizing: 'fill' },
  createController() {
    'worklet';
    const NavigationController = gammaStackNavigationControllerClass();
    if (
      !NavigationController ||
      typeof NavigationController.alloc !== 'function'
    ) {
      throw new Error('UINavigationController is not available');
    }

    const allocated = NavigationController.alloc();
    const controller =
      allocated && typeof allocated.init === 'function'
        ? allocated.init()
        : allocated;

    const navigationBar = controller.navigationBar;
    if (navigationBar) {
      navigationBar.prefersLargeTitles = true;
    }

    createGammaStackStagingMountView(controller);
    return controller;
  },
  childrenView(controller: any) {
    'worklet';
    const mountView =
      controller.view && typeof controller.view.viewWithTag === 'function'
        ? controller.view.viewWithTag(GAMMA_STACK_MOUNT_VIEW_TAG)
        : null;
    if (mountView) {
      mountView.frame = controller.view.bounds;
      mountView.autoresizingMask = flexibleSizeMask();
      return mountView;
    }
    return createGammaStackStagingMountView(controller) ?? controller.view;
  },
  mounted(controller: any, props: any) {
    'worklet';
    const registry = ensureGammaStackRegistry();
    const existing = registry.hosts[props.hostId];
    const host =
      existing ??
      ({
        controller,
        pendingPopScreenKeys: [],
        pendingPushScreenKeys: [],
        screens: [],
      } as any);
    host.controller = controller;
    host.screens = existing?.screens ?? host.screens ?? [];
    registry.hosts[props.hostId] = host;
    attachExistingGammaScreens(host);
    scheduleGammaStackCommit(props.hostId);
  },
  update(controller: any, props: any) {
    'worklet';
    const registry = ensureGammaStackRegistry();
    const existing = registry.hosts[props.hostId];
    const host =
      existing ??
      ({
        controller,
        pendingPopScreenKeys: [],
        pendingPushScreenKeys: [],
        screens: [],
      } as any);
    host.controller = controller;
    host.screens = existing?.screens ?? host.screens ?? [];
    registry.hosts[props.hostId] = host;
    attachExistingGammaScreens(host);
    scheduleGammaStackCommit(props.hostId);
  },
  dispose(_controller: any, props: any) {
    'worklet';
    const registry = (globalThis as Record<string, any>)
      .__rnsNativeScriptGammaStackRegistry;
    if (registry?.hosts) {
      registry.hosts[props.hostId] = undefined;
    }
  },
});

const GammaStackScreenController = NativeScriptRuntime.defineUIViewController<
  NativeScriptGammaStackScreenProps,
  any
>({
  debugName: 'RNSStackScreen.NativeScript',
  layout: { sizing: 'fill' },
  createController(props: any) {
    'worklet';
    const ScreenController = gammaStackScreenControllerClass();
    const UIView = nativeClassValue('UIView');
    const UIColor = nativeValue('UIColor');
    if (!ScreenController || typeof ScreenController.alloc !== 'function') {
      throw new Error('UIViewController is not available');
    }
    if (!UIView || typeof UIView.alloc !== 'function') {
      throw new Error('UIView is not available');
    }

    const allocated = ScreenController.alloc();
    const controller =
      allocated && typeof allocated.init === 'function'
        ? allocated.init()
        : allocated;
    const viewAllocated = UIView.alloc();
    const view =
      viewAllocated && typeof viewAllocated.init === 'function'
        ? viewAllocated.init()
        : viewAllocated;
    view.backgroundColor = UIColor?.systemBackgroundColor ?? null;
    view.autoresizingMask = flexibleSizeMask();
    controller.view = view;
    controller.__rnsGammaStackActivityMode =
      gammaStackScreenActivityMode(props);
    controller.__rnsGammaStackHostId = props.hostId;
    controller.__rnsGammaStackScreenKey = props.screenKey;
    return controller;
  },
  childrenView(controller: any) {
    'worklet';
    return controller.view;
  },
  mounted(controller: any, props: any, ctx: any) {
    'worklet';
    const registry = ensureGammaStackRegistry();
    const host = registry.hosts[props.hostId] ?? {
      controller: null,
      pendingPopScreenKeys: [],
      pendingPushScreenKeys: [],
      screens: [],
    };
    registry.hosts[props.hostId] = host;
    const record = upsertGammaStackScreenRecord(host, controller, props, ctx);
    registry.screens[props.screenKey] = record;
    submitGammaStackHeaderConfigsForScreen(props.screenKey);
    scheduleGammaStackCommit(props.hostId);
  },
  update(controller: any, props: any, _previousProps: any, ctx: any) {
    'worklet';
    const registry = ensureGammaStackRegistry();
    const host = registry.hosts[props.hostId] ?? {
      controller: null,
      pendingPopScreenKeys: [],
      pendingPushScreenKeys: [],
      screens: [],
    };
    registry.hosts[props.hostId] = host;
    const record = upsertGammaStackScreenRecord(host, controller, props, ctx);
    registry.screens[props.screenKey] = record;
    submitGammaStackHeaderConfigsForScreen(props.screenKey);
    scheduleGammaStackCommit(props.hostId);
  },
  dispose(controller: any, props: any) {
    'worklet';
    const registry = (globalThis as Record<string, any>)
      .__rnsNativeScriptGammaStackRegistry;
    const host = registry?.hosts?.[props.hostId];
    if (host) {
      removeGammaStackScreenRecord(host, controller, props);
      scheduleGammaStackCommit(props.hostId);
    }
    if (registry?.screens) {
      registry.screens[props.screenKey] = undefined;
    }
  },
});

const GammaStackHeaderConfigContainer =
  NativeScriptRuntime.defineUIKitContainer<
    NativeScriptGammaStackHeaderConfigProps,
    any,
    any
  >({
    debugName: 'RNSStackHeaderConfigIOS.NativeScript',
    layout: { sizing: 'fill' },
    create() {
      'worklet';
      const rootView = createGammaStackUIView();
      if (!rootView) {
        throw new Error('UIView is not available');
      }

      rootView.tag = GAMMA_STACK_HEADER_STAGING_VIEW_TAG;
      rootView.hidden = true;
      rootView.userInteractionEnabled = false;
      rootView.autoresizingMask = flexibleSizeMask();

      // NATIVESCRIPT_PORT_DEVIATION: upstream RNSStackHeaderConfig keeps
      // header item component views as Fabric children without inserting them
      // into a visible hierarchy. NativeScript still needs a native mount
      // parent for React children before UIKit wraps custom item views into
      // UIBarButtonItem customView instances, so this hidden staging view is
      // runtime plumbing only.
      return {
        childrenView: rootView,
        rootView,
      };
    },
    mounted(view: any, props: any) {
      'worklet';
      upsertGammaStackHeaderConfigRecord(view, props);
    },
    update(view: any, props: any) {
      'worklet';
      upsertGammaStackHeaderConfigRecord(view, props);
    },
    dispose(_view: any, props: any) {
      'worklet';
      removeGammaStackHeaderConfigRecord(props);
    },
  });

const GammaStackHeaderItemContainer = NativeScriptRuntime.defineUIKitContainer<
  NativeScriptGammaStackHeaderItemProps,
  any,
  any
>({
  debugName: 'RNSStackHeaderItemIOS.NativeScript',
  layout: { sizing: 'intrinsic' },
  create() {
    'worklet';
    const rootView = createGammaStackUIView();
    if (!rootView) {
      throw new Error('UIView is not available');
    }

    rootView.userInteractionEnabled = true;
    rootView.autoresizingMask = flexibleSizeMask();

    return {
      childrenView: rootView,
      rootView,
    };
  },
  mounted(view: any, props: any) {
    'worklet';
    upsertGammaStackHeaderItemRecord(view, props, 'item');
  },
  update(view: any, props: any) {
    'worklet';
    upsertGammaStackHeaderItemRecord(view, props, 'item');
  },
  dispose(_view: any, props: any) {
    'worklet';
    removeGammaStackHeaderItemRecord(props);
  },
});

const GammaStackHeaderItemSpacerContainer =
  NativeScriptRuntime.defineUIKitContainer<
    NativeScriptGammaStackHeaderItemSpacerProps,
    any,
    any
  >({
    debugName: 'RNSStackHeaderItemSpacerIOS.NativeScript',
    layout: { sizing: 'intrinsic' },
    create() {
      'worklet';
      const rootView = createGammaStackUIView();
      if (!rootView) {
        throw new Error('UIView is not available');
      }

      rootView.hidden = true;
      rootView.userInteractionEnabled = false;

      return {
        childrenView: rootView,
        rootView,
      };
    },
    mounted(view: any, props: any) {
      'worklet';
      upsertGammaStackHeaderItemRecord(view, props, 'spacer');
    },
    update(view: any, props: any) {
      'worklet';
      upsertGammaStackHeaderItemRecord(view, props, 'spacer');
    },
    dispose(_view: any, props: any) {
      'worklet';
      removeGammaStackHeaderItemRecord(props);
    },
  });

function gammaStackHeaderChildId(
  configId: string,
  placement: StackHeaderItemPlacement,
  key: string | undefined,
  order: number,
) {
  return `${configId}:${placement}:${key ?? order}`;
}

function makeGammaStackHeaderItemView(
  item:
    | StackHeaderInlineItemIOS
    | StackHeaderInlineCustomItemIOS
    | StackHeaderTitleCustomItemIOS
    | StackHeaderSpacerItemIOS,
  placement: StackHeaderItemPlacement,
  configId: string,
  order: number,
) {
  if ('type' in item && item.type === 'spacer') {
    let spacerPlacement: StackHeaderItemSpacerPlacement = 'trailing';
    if (placement === 'leading' || placement === 'trailing') {
      spacerPlacement = placement;
    } else {
      console.warn(
        `[Stack] Invalid placement for spacer: "${placement}", defaulting to "trailing"`,
      );
    }

    return (
      <NativeScriptGammaStackHeaderItemSpacer
        key={item.key}
        configId={configId}
        itemId={gammaStackHeaderChildId(
          configId,
          spacerPlacement,
          item.key,
          order,
        )}
        order={order}
        placement={spacerPlacement}
        sizing={item.sizing}
        width={'width' in item ? item.width : undefined}
      />
    );
  }

  const hasCustomView = 'render' in item;

  return (
    <NativeScriptGammaStackHeaderItem
      key={item.key}
      configId={configId}
      hasCustomView={hasCustomView}
      itemId={gammaStackHeaderChildId(configId, placement, item.key, order)}
      label={'label' in item ? item.label : undefined}
      order={order}
      placement={placement}
      render={hasCustomView ? item.render : undefined}
    />
  );
}

export function NativeScriptGammaStackHeaderConfig(
  props: StackHeaderConfigProps,
) {
  const screenContext = React.useContext(GammaStackScreenRuntimeContext);
  const configId = React.useId();

  if (!screenContext) {
    return null;
  }

  const { ios } = props;
  const restProps = {
    backButtonHidden: props.backButtonHidden,
    hidden: props.hidden,
    subtitle: props.subtitle,
    title: props.title,
    transparent: props.transparent,
  };
  const {
    leadingItems,
    trailingItems,
    titleItem,
    subtitleItem,
    largeSubtitleItem,
    largeTitle,
    largeSubtitle,
    largeTitleEnabled,
  } = ios ?? {};

  const children: React.ReactElement[] = [];
  let order = 0;

  for (const item of leadingItems ?? []) {
    children[children.length] = makeGammaStackHeaderItemView(
      item,
      'leading',
      configId,
      order,
    );
    order += 1;
  }
  if (titleItem) {
    children[children.length] = makeGammaStackHeaderItemView(
      titleItem,
      'title',
      configId,
      order,
    );
    order += 1;
  }
  if (subtitleItem) {
    children[children.length] = makeGammaStackHeaderItemView(
      subtitleItem,
      'subtitle',
      configId,
      order,
    );
    order += 1;
  }
  if (largeSubtitleItem) {
    children[children.length] = makeGammaStackHeaderItemView(
      largeSubtitleItem,
      'largeSubtitle',
      configId,
      order,
    );
    order += 1;
  }
  for (const item of trailingItems ?? []) {
    children[children.length] = makeGammaStackHeaderItemView(
      item,
      'trailing',
      configId,
      order,
    );
    order += 1;
  }

  return (
    <GammaStackHeaderConfigContainer
      {...restProps}
      configId={configId}
      hostId={screenContext.hostId}
      largeSubtitle={largeSubtitle}
      largeTitle={largeTitle}
      largeTitleEnabled={!!largeTitleEnabled}
      screenKey={screenContext.screenKey}
      style={styles.headerStaging}>
      {children}
    </GammaStackHeaderConfigContainer>
  );
}

export function NativeScriptGammaStackHeaderItem(
  props: NativeScriptGammaStackHeaderItemProps,
) {
  const generatedItemId = React.useId();
  const { children, configId, hasCustomView, itemId, render, ...restProps } =
    props;
  const renderedChildren = children ?? render?.();

  return (
    <GammaStackHeaderItemContainer
      {...restProps}
      configId={configId}
      hasCustomView={hasCustomView ?? renderedChildren != null}
      itemId={itemId ?? generatedItemId}
      style={styles.headerStaging}>
      {renderedChildren}
    </GammaStackHeaderItemContainer>
  );
}

export function NativeScriptGammaStackHeaderItemSpacer(
  props: NativeScriptGammaStackHeaderItemSpacerProps,
) {
  const generatedItemId = React.useId();
  return (
    <GammaStackHeaderItemSpacerContainer
      {...props}
      itemId={props.itemId ?? generatedItemId}
      style={styles.headerStaging}
    />
  );
}

export function NativeScriptGammaStackHost(props: StackHostProps) {
  const hostId = React.useId();
  const children = React.Children.map(props.children, (child, index) => {
    if (!React.isValidElement(child)) {
      return child;
    }
    return React.cloneElement(child as React.ReactElement<any>, {
      __nativeScriptGammaStackIndex: index,
    });
  });

  return (
    <GammaStackRuntimeContext.Provider value={{ hostId }}>
      <GammaStackHostController hostId={hostId} style={styles.fill}>
        {children}
      </GammaStackHostController>
    </GammaStackRuntimeContext.Provider>
  );
}

export function NativeScriptGammaStackScreen(props: StackScreenProps) {
  const context = React.useContext(GammaStackRuntimeContext);
  const {
    children,
    onDismiss,
    onNativeDismiss,
    screenKey,
    ...nativeScriptProps
  } = props;

  const onDismissWrapper = React.useCallback(
    (event: { nativeEvent: { isNativeDismiss: boolean } }) => {
      if (event.nativeEvent.isNativeDismiss) {
        onNativeDismiss?.(screenKey);
      } else {
        onDismiss?.(screenKey);
      }
    },
    [onDismiss, onNativeDismiss, screenKey],
  );

  if (!context) {
    return null;
  }

  return (
    <GammaStackScreenRuntimeContext.Provider
      value={{ hostId: context.hostId, screenKey }}>
      <GammaStackScreenController
        {...nativeScriptProps}
        hostId={context.hostId}
        screenKey={screenKey}
        attachController
        attachControllerView={false}
        attachNativeView={false}
        detachControllerFromParent
        onDismiss={onDismissWrapper}
        style={StyleSheet.absoluteFill}>
        {children}
      </GammaStackScreenController>
    </GammaStackScreenRuntimeContext.Provider>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  headerStaging: {
    left: 0,
    position: 'absolute',
    top: 0,
  },
});
