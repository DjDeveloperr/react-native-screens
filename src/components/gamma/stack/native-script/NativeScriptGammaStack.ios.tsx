/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/prefer-for-of */
import React from 'react';
import { StyleSheet, type ViewProps } from 'react-native';
import NativeScriptRuntime from '@nativescript/react-native';
import type { StackHostProps } from '../host/StackHost.types';
import type { StackScreenProps } from '../screen/StackScreen.types';

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

const GammaStackRuntimeContext =
  React.createContext<GammaStackRuntimeContextValue | null>(null);

const GAMMA_STACK_MOUNT_VIEW_TAG = 83912042;
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

  const UINavigationController = nativeValue('UINavigationController');
  const NativeClassFunction = globalObject.NativeClass;
  if (!UINavigationController || typeof NativeClassFunction !== 'function') {
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

  (RNSGammaStackNavigationController as any).ObjCExposedMethods =
    exposedMethods;

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

  const UIViewController = nativeValue('UIViewController');
  const NativeClassFunction = globalObject.NativeClass;
  if (!UIViewController || typeof NativeClassFunction !== 'function') {
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

  (RNSGammaStackScreenController as any).ObjCExposedMethods = exposedMethods;

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
  const UIView = nativeValue('UIView');
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
    hosts: {},
    screens: {},
  };
  registry.hosts = registry.hosts ?? {};
  registry.screens = registry.screens ?? {};
  globalObject.__rnsNativeScriptGammaStackRegistry = registry;
  return registry;
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
  }

  host.pendingPopScreenKeys = [];
  host.pendingPushScreenKeys = [];

  // NATIVESCRIPT_PORT_DEVIATION: upstream executes the queued operations from
  // RCTMountingTransactionObserving after a Fabric transaction mounts. The TS
  // port receives host/screen records through separate NativeScript component
  // callbacks, so it executes the same ordered push/pop queue at the end of
  // each host/screen update and once more on a token-coalesced zero-delay tick.
}

function scheduleGammaStackCommit(hostId: string) {
  'worklet';
  const host = getGammaStackHostRecord(hostId);
  if (!host) {
    return;
  }

  commitGammaStackOperations(host);

  if (typeof setTimeout !== 'function') {
    return;
  }

  const token = (host.commitToken ?? 0) + 1;
  host.commitToken = token;
  setTimeout(
    (targetHostId: string, targetToken: number) => {
      'worklet';
      const targetHost = getGammaStackHostRecord(targetHostId);
      if (!targetHost || targetHost.commitToken !== targetToken) {
        return;
      }
      commitGammaStackOperations(targetHost);
    },
    0,
    hostId,
    token,
  );
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
    const UIView = nativeValue('UIView');
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
  const { onDismiss, onNativeDismiss, screenKey, ...nativeScriptProps } = props;

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
    <GammaStackScreenController
      {...nativeScriptProps}
      hostId={context.hostId}
      screenKey={screenKey}
      attachController
      attachControllerView={false}
      attachNativeView={false}
      onDismiss={onDismissWrapper}
      style={StyleSheet.absoluteFill}
    />
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
