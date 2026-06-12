/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/prefer-for-of */
import React from 'react';
import { StyleSheet, type ViewProps } from 'react-native';
import NativeScriptRuntime from '@nativescript/react-native';
import type {
  SplitBehavior,
  SplitDisplayMode,
  SplitDisplayModeButtonVisibility,
  SplitHostProps,
  SplitPrimaryBackgroundStyle,
  SplitPrimaryEdge,
} from '../SplitHost.types';
import type {
  SplitScreenColumnType,
  SplitScreenProps,
} from '../SplitScreen.types';

type NativeScriptSplitHostProps = Omit<SplitHostProps, 'ref'> & {
  columnsCount: number;
  hostId: string;
  inspectorsCount: number;
  style?: ViewProps['style'];
};

type NativeScriptSplitScreenProps = SplitScreenProps & {
  __nativeScriptSplitIndex?: number;
  columnType: SplitScreenColumnType;
  hostId: string;
  screenId: string;
  style?: ViewProps['style'];
};

type SplitRuntimeContextValue = {
  hostId: string;
};

const SplitRuntimeContext =
  React.createContext<SplitRuntimeContextValue | null>(null);

const SPLIT_MOUNT_VIEW_TAG = 83912044;
const SPLIT_HOST_CONTROLLER_CLASS_KEY =
  '__rnsSplitHostControllerNativeScriptClass';
const SPLIT_SCREEN_CONTROLLER_CLASS_KEY =
  '__rnsSplitScreenControllerNativeScriptClass';
const SPLIT_NAVIGATION_CONTROLLER_CLASS_KEY =
  '__rnsSplitNavigationControllerNativeScriptClass';

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

function nativeArrayFromArray(items: any[]): any {
  'worklet';
  const NSArray = nativeValue('NSArray');
  return NSArray && typeof NSArray.arrayWithArray === 'function'
    ? NSArray.arrayWithArray(items)
    : items;
}

function nativeEnumValue(
  enumName: string,
  preferredNames: string[],
  fallback: number,
) {
  'worklet';
  const enumObject = nativeValue(enumName);
  for (let index = 0; index < preferredNames.length; index += 1) {
    const name = preferredNames[index];
    if (enumObject?.[name] != null) {
      return enumObject[name];
    }
    const lowercaseName = name.charAt(0).toLowerCase() + name.slice(1);
    if (enumObject?.[lowercaseName] != null) {
      return enumObject[lowercaseName];
    }
    const globalValue = nativeValue(`${enumName}${name}`);
    if (globalValue != null) {
      return globalValue;
    }
  }
  return fallback;
}

function splitStyleForColumns(columnsCount: number) {
  'worklet';
  if (columnsCount === 3) {
    return nativeEnumValue('UISplitViewControllerStyle', ['TripleColumn'], 2);
  }
  if (columnsCount === 2) {
    return nativeEnumValue('UISplitViewControllerStyle', ['DoubleColumn'], 1);
  }
  return nativeEnumValue('UISplitViewControllerStyle', ['Unspecified'], 0);
}

function splitColumnValue(column: string) {
  'worklet';
  if (column === 'supplementary') {
    return nativeEnumValue('UISplitViewControllerColumn', ['Supplementary'], 1);
  }
  if (column === 'secondary') {
    return nativeEnumValue('UISplitViewControllerColumn', ['Secondary'], 2);
  }
  if (column === 'inspector') {
    return nativeEnumValue('UISplitViewControllerColumn', ['Inspector'], 4);
  }
  return nativeEnumValue('UISplitViewControllerColumn', ['Primary'], 0);
}

function splitBehaviorValue(behavior: SplitBehavior | undefined) {
  'worklet';
  if (behavior === 'displace') {
    return nativeEnumValue(
      'UISplitViewControllerSplitBehavior',
      ['Displace'],
      1,
    );
  }
  if (behavior === 'overlay') {
    return nativeEnumValue(
      'UISplitViewControllerSplitBehavior',
      ['Overlay'],
      2,
    );
  }
  if (behavior === 'tile') {
    return nativeEnumValue('UISplitViewControllerSplitBehavior', ['Tile'], 3);
  }
  return nativeEnumValue(
    'UISplitViewControllerSplitBehavior',
    ['Automatic'],
    0,
  );
}

function splitPrimaryEdgeValue(edge: SplitPrimaryEdge | undefined) {
  'worklet';
  if (edge === 'trailing') {
    return nativeEnumValue('UISplitViewControllerPrimaryEdge', ['Trailing'], 1);
  }
  return nativeEnumValue('UISplitViewControllerPrimaryEdge', ['Leading'], 0);
}

function splitDisplayModeValue(displayMode: SplitDisplayMode | undefined) {
  'worklet';
  if (displayMode === 'secondaryOnly') {
    return nativeEnumValue(
      'UISplitViewControllerDisplayMode',
      ['SecondaryOnly'],
      1,
    );
  }
  if (displayMode === 'oneBesideSecondary') {
    return nativeEnumValue(
      'UISplitViewControllerDisplayMode',
      ['OneBesideSecondary'],
      2,
    );
  }
  if (displayMode === 'oneOverSecondary') {
    return nativeEnumValue(
      'UISplitViewControllerDisplayMode',
      ['OneOverSecondary'],
      3,
    );
  }
  if (displayMode === 'twoBesideSecondary') {
    return nativeEnumValue(
      'UISplitViewControllerDisplayMode',
      ['TwoBesideSecondary'],
      4,
    );
  }
  if (displayMode === 'twoOverSecondary') {
    return nativeEnumValue(
      'UISplitViewControllerDisplayMode',
      ['TwoOverSecondary'],
      5,
    );
  }
  if (displayMode === 'twoDisplaceSecondary') {
    return nativeEnumValue(
      'UISplitViewControllerDisplayMode',
      ['TwoDisplaceSecondary'],
      6,
    );
  }
  return nativeEnumValue('UISplitViewControllerDisplayMode', ['Automatic'], 0);
}

function splitDisplayModeString(displayMode: any) {
  'worklet';
  const mapping = [
    ['secondaryOnly', splitDisplayModeValue('secondaryOnly')],
    ['oneBesideSecondary', splitDisplayModeValue('oneBesideSecondary')],
    ['oneOverSecondary', splitDisplayModeValue('oneOverSecondary')],
    ['twoBesideSecondary', splitDisplayModeValue('twoBesideSecondary')],
    ['twoOverSecondary', splitDisplayModeValue('twoOverSecondary')],
    ['twoDisplaceSecondary', splitDisplayModeValue('twoDisplaceSecondary')],
    ['automatic', splitDisplayModeValue('automatic')],
  ];
  for (let index = 0; index < mapping.length; index += 1) {
    if (mapping[index][1] === displayMode) {
      return mapping[index][0];
    }
  }
  return String(displayMode ?? 'automatic');
}

function splitDisplayModeButtonVisibilityValue(
  visibility: SplitDisplayModeButtonVisibility | undefined,
) {
  'worklet';
  if (visibility === 'always') {
    return nativeEnumValue(
      'UISplitViewControllerDisplayModeButtonVisibility',
      ['Always'],
      1,
    );
  }
  if (visibility === 'never') {
    return nativeEnumValue(
      'UISplitViewControllerDisplayModeButtonVisibility',
      ['Never'],
      2,
    );
  }
  return nativeEnumValue(
    'UISplitViewControllerDisplayModeButtonVisibility',
    ['Automatic'],
    0,
  );
}

function splitPrimaryBackgroundStyleValue(
  style: SplitPrimaryBackgroundStyle | undefined,
) {
  'worklet';
  if (style === 'none') {
    return nativeEnumValue('UISplitViewControllerBackgroundStyle', ['None'], 1);
  }
  if (style === 'sidebar') {
    return nativeEnumValue(
      'UISplitViewControllerBackgroundStyle',
      ['Sidebar'],
      2,
    );
  }
  return nativeEnumValue(
    'UISplitViewControllerBackgroundStyle',
    ['Default'],
    0,
  );
}

function userInterfaceStyleValue(colorScheme: unknown) {
  'worklet';
  if (colorScheme === 'light') {
    return nativeEnumValue('UIUserInterfaceStyle', ['Light'], 1);
  }
  if (colorScheme === 'dark') {
    return nativeEnumValue('UIUserInterfaceStyle', ['Dark'], 2);
  }
  return nativeEnumValue('UIUserInterfaceStyle', ['Unspecified'], 0);
}

function topColumnForCollapsingValue(value: unknown) {
  'worklet';
  if (
    value === 'primary' ||
    value === 'supplementary' ||
    value === 'secondary'
  ) {
    return splitColumnValue(value);
  }
  return null;
}

function createSplitUIView() {
  'worklet';
  const UIView = nativeValue('UIView');
  if (!UIView || typeof UIView.alloc !== 'function') {
    return null;
  }
  const allocated = UIView.alloc();
  return allocated && typeof allocated.init === 'function'
    ? allocated.init()
    : allocated;
}

function createSplitStagingMountView(controller: any) {
  'worklet';
  const mountView = createSplitUIView();
  if (!mountView) {
    return null;
  }
  mountView.tag = SPLIT_MOUNT_VIEW_TAG;
  mountView.hidden = true;
  mountView.userInteractionEnabled = false;
  mountView.frame = controller.view.bounds;
  mountView.autoresizingMask = flexibleSizeMask();
  controller.view.addSubview(mountView);
  return mountView;
}

function emitSplitScreenEvent(controller: any, eventName: string) {
  'worklet';
  controller?.__rnsSplitScreenEventContext?.emit?.(eventName, {});
}

function emitSplitHostEvent(controller: any, eventName: string, payload = {}) {
  'worklet';
  controller?.__rnsSplitHostEventContext?.emit?.(eventName, payload);
}

function callSplitControllerSuper(
  controller: any,
  methodName: string,
  arg?: any,
) {
  'worklet';
  const method = controller?.super?.[methodName];
  if (typeof method === 'function') {
    controller.super[methodName](arg);
  }
}

function splitHostControllerClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[SPLIT_HOST_CONTROLLER_CLASS_KEY];
  if (existing) {
    return existing;
  }

  const UISplitViewController = nativeValue('UISplitViewController');
  const NativeClassFunction = globalObject.NativeClass;
  if (!UISplitViewController || typeof NativeClassFunction !== 'function') {
    return UISplitViewController;
  }

  class RNSSplitHostControllerNativeScript extends UISplitViewController {
    splitViewControllerDidCollapse(_splitViewController: any) {
      'worklet';
      emitSplitHostEvent(this, 'onCollapse');
    }

    'splitViewControllerDidCollapse:'(_splitViewController: any) {
      'worklet';
      this.splitViewControllerDidCollapse(_splitViewController);
    }

    splitViewControllerDidExpand(_splitViewController: any) {
      'worklet';
      emitSplitHostEvent(this, 'onExpand');
    }

    'splitViewControllerDidExpand:'(_splitViewController: any) {
      'worklet';
      this.splitViewControllerDidExpand(_splitViewController);
    }

    splitViewControllerWillChangeToDisplayMode(
      _splitViewController: any,
      displayMode: any,
    ) {
      'worklet';
      if (this.displayMode !== displayMode) {
        emitSplitHostEvent(this, 'onDisplayModeWillChange', {
          nativeEvent: {
            currentDisplayMode: splitDisplayModeString(this.displayMode),
            nextDisplayMode: splitDisplayModeString(displayMode),
          },
        });
      }
    }

    'splitViewController:willChangeToDisplayMode:'(
      splitViewController: any,
      displayMode: any,
    ) {
      'worklet';
      this.splitViewControllerWillChangeToDisplayMode(
        splitViewController,
        displayMode,
      );
    }

    splitViewControllerTopColumnForCollapsingToProposedTopColumn(
      _splitViewController: any,
      proposedTopColumn: any,
    ) {
      'worklet';
      return this.__rnsSplitTopColumnForCollapsing ?? proposedTopColumn;
    }

    'splitViewController:topColumnForCollapsingToProposedTopColumn:'(
      splitViewController: any,
      proposedTopColumn: any,
    ) {
      'worklet';
      return this.splitViewControllerTopColumnForCollapsingToProposedTopColumn(
        splitViewController,
        proposedTopColumn,
      );
    }

    splitViewControllerDidHideColumn(_splitViewController: any, column: any) {
      'worklet';
      if (column === splitColumnValue('inspector')) {
        emitSplitHostEvent(this, 'onInspectorHide');
      }
    }

    'splitViewController:didHideColumn:'(
      splitViewController: any,
      column: any,
    ) {
      'worklet';
      this.splitViewControllerDidHideColumn(splitViewController, column);
    }

    showColumnNamed(columnName: string) {
      'worklet';
      showSplitColumn(this, columnName);
    }
  }

  const interopTypes = globalObject.interop?.types;
  const exposedMethods = {
    'splitViewControllerDidCollapse:': {
      params: [],
      returns: interopTypes?.void,
    },
    'splitViewControllerDidExpand:': {
      params: [],
      returns: interopTypes?.void,
    },
    'splitViewController:willChangeToDisplayMode:': {
      params: [],
      returns: interopTypes?.void,
    },
    'splitViewController:topColumnForCollapsingToProposedTopColumn:': {
      params: [],
      returns: interopTypes?.long,
    },
    'splitViewController:didHideColumn:': {
      params: [],
      returns: interopTypes?.void,
    },
  };

  (RNSSplitHostControllerNativeScript as any).ObjCExposedMethods =
    exposedMethods;

  if (typeof UISplitViewController.extend === 'function') {
    const HostControllerClass = UISplitViewController.extend(
      {
        'splitViewController:didHideColumn:':
          RNSSplitHostControllerNativeScript.prototype[
            'splitViewController:didHideColumn:'
          ],
        'splitViewController:topColumnForCollapsingToProposedTopColumn:':
          RNSSplitHostControllerNativeScript.prototype[
            'splitViewController:topColumnForCollapsingToProposedTopColumn:'
          ],
        'splitViewController:willChangeToDisplayMode:':
          RNSSplitHostControllerNativeScript.prototype[
            'splitViewController:willChangeToDisplayMode:'
          ],
        splitViewControllerWillChangeToDisplayMode:
          RNSSplitHostControllerNativeScript.prototype
            .splitViewControllerWillChangeToDisplayMode,
        splitViewControllerTopColumnForCollapsingToProposedTopColumn:
          RNSSplitHostControllerNativeScript.prototype
            .splitViewControllerTopColumnForCollapsingToProposedTopColumn,
        splitViewControllerDidHideColumn:
          RNSSplitHostControllerNativeScript.prototype
            .splitViewControllerDidHideColumn,
        splitViewControllerDidCollapse:
          RNSSplitHostControllerNativeScript.prototype
            .splitViewControllerDidCollapse,
        'splitViewControllerDidCollapse:':
          RNSSplitHostControllerNativeScript.prototype[
            'splitViewControllerDidCollapse:'
          ],
        splitViewControllerDidExpand:
          RNSSplitHostControllerNativeScript.prototype
            .splitViewControllerDidExpand,
        'splitViewControllerDidExpand:':
          RNSSplitHostControllerNativeScript.prototype[
            'splitViewControllerDidExpand:'
          ],
        showColumnNamed:
          RNSSplitHostControllerNativeScript.prototype.showColumnNamed,
      },
      {
        exposedMethods,
        name: 'RNSSplitHostControllerNativeScript',
      },
    );
    globalObject[SPLIT_HOST_CONTROLLER_CLASS_KEY] = HostControllerClass;
    return HostControllerClass;
  }

  NativeClassFunction(RNSSplitHostControllerNativeScript);
  globalObject[SPLIT_HOST_CONTROLLER_CLASS_KEY] =
    RNSSplitHostControllerNativeScript;
  return RNSSplitHostControllerNativeScript;
}

function splitScreenControllerClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[SPLIT_SCREEN_CONTROLLER_CLASS_KEY];
  if (existing) {
    return existing;
  }

  const UIViewController = nativeValue('UIViewController');
  const NativeClassFunction = globalObject.NativeClass;
  if (!UIViewController || typeof NativeClassFunction !== 'function') {
    return UIViewController;
  }

  class RNSSplitScreenControllerNativeScript extends UIViewController {
    viewWillAppear(animated: boolean) {
      'worklet';
      callSplitControllerSuper(this, 'viewWillAppear', animated);
      emitSplitScreenEvent(this, 'onWillAppear');
    }

    'viewWillAppear:'(animated: boolean) {
      'worklet';
      this.viewWillAppear(animated);
    }

    viewDidAppear(animated: boolean) {
      'worklet';
      callSplitControllerSuper(this, 'viewDidAppear', animated);
      emitSplitScreenEvent(this, 'onDidAppear');
    }

    'viewDidAppear:'(animated: boolean) {
      'worklet';
      this.viewDidAppear(animated);
    }

    viewWillDisappear(animated: boolean) {
      'worklet';
      callSplitControllerSuper(this, 'viewWillDisappear', animated);
      emitSplitScreenEvent(this, 'onWillDisappear');
    }

    'viewWillDisappear:'(animated: boolean) {
      'worklet';
      this.viewWillDisappear(animated);
    }

    viewDidDisappear(animated: boolean) {
      'worklet';
      callSplitControllerSuper(this, 'viewDidDisappear', animated);
      emitSplitScreenEvent(this, 'onDidDisappear');
    }

    'viewDidDisappear:'(animated: boolean) {
      'worklet';
      this.viewDidDisappear(animated);
    }

    viewDidLayoutSubviews() {
      'worklet';
      callSplitControllerSuper(this, 'viewDidLayoutSubviews');
      const record = getSplitScreenRecord(this.__rnsSplitScreenId);
      if (record?.rootView) {
        NativeScriptRuntime.refreshUIKitHostView(record.rootView);
      }
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
    viewDidLayoutSubviews: {
      params: [],
      returns: interopTypes?.void,
    },
  };

  (RNSSplitScreenControllerNativeScript as any).ObjCExposedMethods =
    exposedMethods;

  if (typeof UIViewController.extend === 'function') {
    const methods: Record<string, any> = {};
    const methodNames = Object.getOwnPropertyNames(
      RNSSplitScreenControllerNativeScript.prototype,
    );
    for (const methodName of methodNames) {
      if (methodName === 'constructor') {
        continue;
      }
      const descriptor = Object.getOwnPropertyDescriptor(
        RNSSplitScreenControllerNativeScript.prototype,
        methodName,
      );
      if (descriptor) {
        Object.defineProperty(methods, methodName, descriptor);
      }
    }
    const ScreenControllerClass = UIViewController.extend(methods, {
      exposedMethods,
      name: 'RNSSplitScreenControllerNativeScript',
    });
    globalObject[SPLIT_SCREEN_CONTROLLER_CLASS_KEY] = ScreenControllerClass;
    return ScreenControllerClass;
  }

  NativeClassFunction(RNSSplitScreenControllerNativeScript);
  globalObject[SPLIT_SCREEN_CONTROLLER_CLASS_KEY] =
    RNSSplitScreenControllerNativeScript;
  return RNSSplitScreenControllerNativeScript;
}

function splitNavigationControllerClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[SPLIT_NAVIGATION_CONTROLLER_CLASS_KEY];
  if (existing) {
    return existing;
  }

  const UINavigationController = nativeValue('UINavigationController');
  const NativeClassFunction = globalObject.NativeClass;
  if (!UINavigationController || typeof NativeClassFunction !== 'function') {
    return UINavigationController;
  }

  class RNSSplitNavigationControllerNativeScript extends UINavigationController {
    viewDidLayoutSubviews() {
      'worklet';
      this.super?.viewDidLayoutSubviews?.();
      const record = this.__rnsSplitScreenRecord;
      if (record?.rootView) {
        // NATIVESCRIPT_PORT_DEVIATION: upstream RNSSplitScreenShadowStateProxy
        // writes column frame/origin back to Fabric shadow state when the
        // wrapper navigation controller moves. The TS port cannot mutate that
        // C++ state directly, so it refreshes the generic NativeScript UIKit
        // host view after UIKit lays out the column.
        NativeScriptRuntime.refreshUIKitHostView(record.rootView);
      }
    }
  }

  const interopTypes = globalObject.interop?.types;
  const exposedMethods = {
    viewDidLayoutSubviews: {
      params: [],
      returns: interopTypes?.void,
    },
  };

  (RNSSplitNavigationControllerNativeScript as any).ObjCExposedMethods =
    exposedMethods;

  if (typeof UINavigationController.extend === 'function') {
    const NavigationControllerClass = UINavigationController.extend(
      {
        viewDidLayoutSubviews:
          RNSSplitNavigationControllerNativeScript.prototype
            .viewDidLayoutSubviews,
      },
      {
        exposedMethods,
        name: 'RNSSplitNavigationControllerNativeScript',
      },
    );
    globalObject[SPLIT_NAVIGATION_CONTROLLER_CLASS_KEY] =
      NavigationControllerClass;
    return NavigationControllerClass;
  }

  NativeClassFunction(RNSSplitNavigationControllerNativeScript);
  globalObject[SPLIT_NAVIGATION_CONTROLLER_CLASS_KEY] =
    RNSSplitNavigationControllerNativeScript;
  return RNSSplitNavigationControllerNativeScript;
}

function ensureSplitRegistry() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const registry = globalObject.__rnsNativeScriptSplitRegistry ?? {
    hosts: {},
    screens: {},
  };
  registry.hosts = registry.hosts ?? {};
  registry.screens = registry.screens ?? {};
  globalObject.__rnsNativeScriptSplitRegistry = registry;
  return registry;
}

function getSplitHostRecord(hostId: string) {
  'worklet';
  const registry = (globalThis as Record<string, any>)
    .__rnsNativeScriptSplitRegistry;
  return registry?.hosts?.[hostId];
}

function getSplitScreenRecord(screenId: string) {
  'worklet';
  const registry = (globalThis as Record<string, any>)
    .__rnsNativeScriptSplitRegistry;
  return registry?.screens?.[screenId];
}

function orderedSplitScreens(host: any) {
  'worklet';
  const ordered = [...(host?.screens ?? [])];
  ordered.sort((left, right) => (left.index ?? 0) - (right.index ?? 0));
  return ordered;
}

function splitScreensOfType(host: any, columnType: SplitScreenColumnType) {
  'worklet';
  const ordered = orderedSplitScreens(host);
  const filtered: any[] = [];
  for (let index = 0; index < ordered.length; index += 1) {
    if (ordered[index].columnType === columnType) {
      filtered[filtered.length] = ordered[index];
    }
  }
  return filtered;
}

function createSplitNavigationController(record: any) {
  'worklet';
  if (record.navigationController) {
    return record.navigationController;
  }

  const NavigationController = splitNavigationControllerClass();
  if (
    !NavigationController ||
    typeof NavigationController.alloc !== 'function'
  ) {
    return null;
  }
  const allocated = NavigationController.alloc();
  const navigationController =
    allocated && typeof allocated.initWithRootViewController === 'function'
      ? allocated.initWithRootViewController(record.controller)
      : allocated && typeof allocated.init === 'function'
      ? allocated.init()
      : allocated;

  if (navigationController) {
    navigationController.viewControllers = nativeArrayFromArray([
      record.controller,
    ]);
    navigationController.topViewController = record.controller;
    navigationController.__rnsSplitScreenRecord = record;
    record.navigationController = navigationController;
  }

  return navigationController;
}

function setSplitInspectorController(splitController: any, record: any) {
  'worklet';
  const inspectorController = record
    ? createSplitNavigationController(record)
    : null;
  const inspectorColumn = splitColumnValue('inspector');

  if (
    inspectorController &&
    typeof splitController.setViewControllerForColumn === 'function'
  ) {
    splitController.setViewControllerForColumn(
      inspectorController,
      inspectorColumn,
    );
  } else if (
    inspectorController &&
    typeof splitController.setViewController === 'function'
  ) {
    splitController.setViewController(inspectorController, inspectorColumn);
  }
}

function validateSplitColumns(host: any, columns: any[]) {
  'worklet';
  const fixedColumnsCount = host.fixedColumnsCount ?? columns.length;

  if (columns.length < fixedColumnsCount) {
    return false;
  }
  if (columns.length < 2 || columns.length > 3) {
    throw new Error('[RNScreens] Split can only have from 2 to 3 columns');
  }
  if (columns.length !== fixedColumnsCount) {
    throw new Error(
      "[RNScreens] Split number of columns shouldn't change dynamically",
    );
  }
  return true;
}

function validateSplitInspectors(inspectors: any[]) {
  'worklet';
  if (inspectors.length > 1) {
    throw new Error('[RNScreens] Split can only have 1 inspector');
  }
}

function commitSplitHost(host: any) {
  'worklet';
  const splitController = host?.controller;
  if (!splitController) {
    return;
  }

  const columns = splitScreensOfType(host, 'column');
  const inspectors = splitScreensOfType(host, 'inspector');

  if (!validateSplitColumns(host, columns)) {
    return;
  }
  validateSplitInspectors(inspectors);

  const columnKeys = columns.map(screen => screen.screenId).join('|');
  if (host.committedColumnKeys !== columnKeys) {
    const controllers: any[] = [];
    for (let index = 0; index < columns.length; index += 1) {
      const navigationController = createSplitNavigationController(
        columns[index],
      );
      if (navigationController) {
        controllers[controllers.length] = navigationController;
      }
    }
    splitController.viewControllers = nativeArrayFromArray(controllers);
    host.committedColumnKeys = columnKeys;
  }

  const inspectorRecord = inspectors[0];
  if (
    inspectorRecord &&
    host.committedInspectorKey !== inspectorRecord.screenId
  ) {
    setSplitInspectorController(splitController, inspectorRecord);
    host.committedInspectorKey = inspectorRecord.screenId;
  }

  applySplitHostProps(splitController, host.props, host.previousProps);
}

function scheduleSplitCommit(hostId: string) {
  'worklet';
  const host = getSplitHostRecord(hostId);
  if (!host) {
    return;
  }

  commitSplitHost(host);

  if (typeof setTimeout !== 'function') {
    return;
  }

  const token = (host.commitToken ?? 0) + 1;
  host.commitToken = token;
  setTimeout(
    (targetHostId: string, targetToken: number) => {
      'worklet';
      const targetHost = getSplitHostRecord(targetHostId);
      if (!targetHost || targetHost.commitToken !== targetToken) {
        return;
      }
      commitSplitHost(targetHost);
    },
    0,
    hostId,
    token,
  );
}

function applyColumnMetric(
  controller: any,
  metricName: string,
  value: unknown,
) {
  'worklet';
  if (typeof value === 'number' && value >= 0) {
    controller[metricName] = value;
  }
}

function applyPreferredColumnWidth(
  controller: any,
  widthName: string,
  fractionName: string,
  value: unknown,
) {
  'worklet';
  if (typeof value !== 'number' || value < 0) {
    return;
  }
  if (value < 1) {
    controller[fractionName] = value;
  } else {
    controller[widthName] = value;
  }
}

function applySplitHostProps(controller: any, props: any, previousProps?: any) {
  'worklet';
  if (!controller || !props) {
    return;
  }

  // Direct port of RNSSplitAppearanceApplicator.updateSplitViewConfiguration:
  // the TS port writes the same UISplitViewController appearance and behavior
  // properties directly through NativeScript/UIKit.
  controller.displayModeButtonVisibility =
    splitDisplayModeButtonVisibilityValue(props.displayModeButtonVisibility);
  controller.preferredSplitBehavior = splitBehaviorValue(
    props.preferredSplitBehavior,
  );
  controller.overrideUserInterfaceStyle = userInterfaceStyleValue(
    props.colorScheme,
  );
  controller.primaryBackgroundStyle = splitPrimaryBackgroundStyleValue(
    props.primaryBackgroundStyle,
  );
  controller.presentsWithGesture = props.presentsWithGesture !== false;
  controller.primaryEdge = splitPrimaryEdgeValue(props.primaryEdge);
  controller.showsSecondaryOnlyButton =
    props.showSecondaryToggleButton === true;

  const metrics = props.columnMetrics ?? {};
  applyColumnMetric(
    controller,
    'minimumPrimaryColumnWidth',
    metrics.minimumPrimaryColumnWidth,
  );
  applyColumnMetric(
    controller,
    'maximumPrimaryColumnWidth',
    metrics.maximumPrimaryColumnWidth,
  );
  applyPreferredColumnWidth(
    controller,
    'preferredPrimaryColumnWidth',
    'preferredPrimaryColumnWidthFraction',
    metrics.preferredPrimaryColumnWidthOrFraction,
  );
  applyColumnMetric(
    controller,
    'minimumSupplementaryColumnWidth',
    metrics.minimumSupplementaryColumnWidth,
  );
  applyColumnMetric(
    controller,
    'maximumSupplementaryColumnWidth',
    metrics.maximumSupplementaryColumnWidth,
  );
  applyPreferredColumnWidth(
    controller,
    'preferredSupplementaryColumnWidth',
    'preferredSupplementaryColumnWidthFraction',
    metrics.preferredSupplementaryColumnWidthOrFraction,
  );
  applyColumnMetric(
    controller,
    'minimumSecondaryColumnWidth',
    metrics.minimumSecondaryColumnWidth,
  );
  applyPreferredColumnWidth(
    controller,
    'preferredSecondaryColumnWidth',
    'preferredSecondaryColumnWidthFraction',
    metrics.preferredSecondaryColumnWidthOrFraction,
  );
  applyColumnMetric(
    controller,
    'minimumInspectorColumnWidth',
    metrics.minimumInspectorColumnWidth,
  );
  applyColumnMetric(
    controller,
    'maximumInspectorColumnWidth',
    metrics.maximumInspectorColumnWidth,
  );
  applyPreferredColumnWidth(
    controller,
    'preferredInspectorColumnWidth',
    'preferredInspectorColumnWidthFraction',
    metrics.preferredInspectorColumnWidthOrFraction,
  );

  if (
    !previousProps ||
    previousProps.preferredDisplayMode !== props.preferredDisplayMode
  ) {
    controller.preferredDisplayMode = splitDisplayModeValue(
      props.preferredDisplayMode,
    );
  }

  const topColumn = topColumnForCollapsingValue(props.topColumnForCollapsing);
  controller.__rnsSplitTopColumnForCollapsing = topColumn ?? undefined;

  if (props.showInspector === true && typeof controller.show === 'function') {
    controller.show(splitColumnValue('inspector'));
  } else if (
    props.showInspector === false &&
    typeof controller.hide === 'function'
  ) {
    controller.hide(splitColumnValue('inspector'));
  }

  // NATIVESCRIPT_PORT_DEVIATION: upstream also calls
  // RNSScreenWindowTraits.enforceDesiredDeviceOrientation when `orientation`
  // changes. That helper is not exposed as a generic NativeScript runtime API
  // yet, so this port stores the prop on the controller for any native parent
  // that can query it, but does not force device rotation from TS.
  controller.__rnsSplitOrientation = props.orientation ?? 'inherit';
}

function showSplitColumn(controller: any, columnName: string) {
  'worklet';
  const column = splitColumnValue(columnName);
  if (typeof controller?.show === 'function') {
    controller.show(column);
  }
}

function upsertSplitHostRecord(
  controller: any,
  props: any,
  previousProps: any,
  ctx: any,
) {
  'worklet';
  const registry = ensureSplitRegistry();
  const existing = registry.hosts[props.hostId];
  const host =
    existing ??
    ({
      screens: [],
    } as any);

  if (host.controller !== controller) {
    host.committedColumnKeys = undefined;
    host.committedInspectorKey = undefined;
    host.fixedColumnsCount = props.columnsCount;
  }

  host.controller = controller;
  host.fixedColumnsCount = host.fixedColumnsCount ?? props.columnsCount;
  host.hostId = props.hostId;
  host.previousProps = previousProps;
  host.props = props;
  if (ctx?.emit) {
    host.ctx = ctx;
    controller.__rnsSplitHostEventContext = ctx;
  }
  registry.hosts[props.hostId] = host;
  applySplitHostProps(controller, props, previousProps);
  scheduleSplitCommit(props.hostId);
}

function upsertSplitScreenRecord(
  controller: any,
  rootView: any,
  props: any,
  ctx: any,
) {
  'worklet';
  const registry = ensureSplitRegistry();
  const host = registry.hosts[props.hostId] ?? {
    fixedColumnsCount: 0,
    hostId: props.hostId,
    screens: [],
  };
  registry.hosts[props.hostId] = host;

  const previous = registry.screens[props.screenId];
  const record = {
    columnType: props.columnType,
    controller,
    ctx,
    hostId: props.hostId,
    index: props.__nativeScriptSplitIndex ?? 0,
    navigationController: previous?.navigationController,
    rootView,
    screenId: props.screenId,
  };

  controller.__rnsSplitHostId = props.hostId;
  controller.__rnsSplitScreenEventContext = ctx;
  controller.__rnsSplitScreenId = props.screenId;
  registry.screens[props.screenId] = record;

  let existingIndex = -1;
  for (let index = 0; index < host.screens.length; index += 1) {
    if (host.screens[index].screenId === props.screenId) {
      existingIndex = index;
      break;
    }
  }
  if (existingIndex >= 0) {
    host.screens[existingIndex] = record;
  } else {
    host.screens[host.screens.length] = record;
  }

  scheduleSplitCommit(props.hostId);
}

function removeSplitScreenRecord(props: any) {
  'worklet';
  const registry = (globalThis as Record<string, any>)
    .__rnsNativeScriptSplitRegistry;
  const host = registry?.hosts?.[props.hostId];
  if (host) {
    for (let index = host.screens.length - 1; index >= 0; index -= 1) {
      if (host.screens[index].screenId === props.screenId) {
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
    host.committedColumnKeys = undefined;
    host.committedInspectorKey = undefined;
    scheduleSplitCommit(props.hostId);
  }
  if (registry?.screens) {
    registry.screens[props.screenId] = undefined;
  }
}

const SplitHostController = NativeScriptRuntime.defineUIViewController<
  NativeScriptSplitHostProps,
  any
>({
  debugName: 'RNSSplitHost.NativeScript',
  layout: { sizing: 'fill' },
  createController(props: any) {
    'worklet';
    const SplitController = splitHostControllerClass();
    if (!SplitController || typeof SplitController.alloc !== 'function') {
      throw new Error('UISplitViewController is not available');
    }

    const allocated = SplitController.alloc();
    const style = splitStyleForColumns(props.columnsCount);
    const controller =
      allocated && typeof allocated.initWithStyle === 'function'
        ? allocated.initWithStyle(style)
        : allocated && typeof allocated.init === 'function'
        ? allocated.init()
        : allocated;

    controller.delegate = controller;
    controller.__rnsSplitFixedColumnsCount = props.columnsCount;
    controller.view.autoresizingMask = flexibleSizeMask();
    createSplitStagingMountView(controller);
    return controller;
  },
  childrenView(controller: any) {
    'worklet';
    const mountView =
      controller.view && typeof controller.view.viewWithTag === 'function'
        ? controller.view.viewWithTag(SPLIT_MOUNT_VIEW_TAG)
        : null;
    if (mountView) {
      mountView.frame = controller.view.bounds;
      mountView.autoresizingMask = flexibleSizeMask();
      return mountView;
    }
    return createSplitStagingMountView(controller) ?? controller.view;
  },
  mounted(controller: any, props: any, ctx: any) {
    'worklet';
    upsertSplitHostRecord(controller, props, undefined, ctx);
  },
  update(controller: any, props: any, previousProps: any, ctx: any) {
    'worklet';
    upsertSplitHostRecord(controller, props, previousProps, ctx);
  },
  dispose(_controller: any, props: any) {
    'worklet';
    const registry = (globalThis as Record<string, any>)
      .__rnsNativeScriptSplitRegistry;
    if (registry?.hosts) {
      registry.hosts[props.hostId] = undefined;
    }
  },
});

const SplitScreenController = NativeScriptRuntime.defineUIViewController<
  NativeScriptSplitScreenProps,
  any
>({
  debugName: 'RNSSplitScreen.NativeScript',
  layout: { sizing: 'fill' },
  createController(props: any) {
    'worklet';
    const ScreenController = splitScreenControllerClass();
    const UIColor = nativeValue('UIColor');
    if (!ScreenController || typeof ScreenController.alloc !== 'function') {
      throw new Error('UIViewController is not available');
    }

    const controllerAllocated = ScreenController.alloc();
    const controller =
      controllerAllocated && typeof controllerAllocated.init === 'function'
        ? controllerAllocated.init()
        : controllerAllocated;
    const view = createSplitUIView();
    if (!view) {
      throw new Error('UIView is not available');
    }
    view.backgroundColor = UIColor?.systemBackgroundColor ?? null;
    view.autoresizingMask = flexibleSizeMask();
    controller.view = view;
    controller.__rnsSplitHostId = props.hostId;
    controller.__rnsSplitScreenId = props.screenId;
    return controller;
  },
  childrenView(controller: any) {
    'worklet';
    return controller.view;
  },
  mounted(controller: any, props: any, ctx: any) {
    'worklet';
    upsertSplitScreenRecord(controller, controller.view, props, ctx);
  },
  update(controller: any, props: any, _previousProps: any, ctx: any) {
    'worklet';
    upsertSplitScreenRecord(controller, controller.view, props, ctx);
  },
  dispose(_controller: any, props: any) {
    'worklet';
    removeSplitScreenRecord(props);
  },
});

const displayModeForSplitCompatibilityMap: Record<
  SplitBehavior,
  SplitDisplayMode[]
> = {
  automatic: [],
  displace: ['secondaryOnly', 'oneBesideSecondary', 'twoDisplaceSecondary'],
  overlay: ['secondaryOnly', 'oneOverSecondary', 'twoOverSecondary'],
  tile: ['secondaryOnly', 'oneBesideSecondary', 'twoBesideSecondary'],
};

function isValidDisplayModeForSplitBehavior(
  displayMode: SplitDisplayMode,
  splitBehavior: SplitBehavior,
) {
  if (splitBehavior === 'automatic') {
    return true;
  }
  return displayModeForSplitCompatibilityMap[splitBehavior].includes(
    displayMode,
  );
}

function splitChildrenByType(children: React.ReactNode) {
  const childArray = React.Children.toArray(children);
  const columns = childArray.filter(
    child =>
      React.isValidElement(child) &&
      child.type === NativeScriptSplitScreen.Column,
  );
  const inspectors = childArray.filter(
    child =>
      React.isValidElement(child) &&
      child.type === NativeScriptSplitScreen.Inspector,
  );
  return { childArray, columns, inspectors };
}

export function NativeScriptSplitHost({ ref, ...props }: SplitHostProps) {
  const hostId = React.useId();
  const { preferredDisplayMode, preferredSplitBehavior } = props;
  const { childArray, columns, inspectors } = splitChildrenByType(
    props.children,
  );

  React.useImperativeHandle(
    ref,
    () => ({
      show: column => {
        NativeScriptRuntime.runOnUI(
          (targetHostId: string, targetColumn: string) => {
            'worklet';
            const host = getSplitHostRecord(targetHostId);
            if (host?.controller) {
              showSplitColumn(host.controller, targetColumn);
            }
          },
          hostId,
          column,
        );
      },
    }),
    [hostId],
  );

  React.useEffect(() => {
    if (preferredDisplayMode && preferredSplitBehavior) {
      const isValid = isValidDisplayModeForSplitBehavior(
        preferredDisplayMode,
        preferredSplitBehavior,
      );
      if (!isValid) {
        const validDisplayModes =
          displayModeForSplitCompatibilityMap[preferredSplitBehavior];
        console.warn(
          `Invalid display mode "${preferredDisplayMode}" for split behavior "${preferredSplitBehavior}".` +
            `\nValid modes for "${preferredSplitBehavior}" are: ${validDisplayModes.join(
              ', ',
            )}.`,
        );
      }
    }
  }, [preferredDisplayMode, preferredSplitBehavior]);

  const clonedChildren = childArray.map((child, index) => {
    if (!React.isValidElement(child)) {
      return child;
    }
    return React.cloneElement(child as React.ReactElement<any>, {
      __nativeScriptSplitIndex: index,
    });
  });

  return (
    <SplitRuntimeContext.Provider value={{ hostId }}>
      <SplitHostController
        {...props}
        columnsCount={columns.length}
        hostId={hostId}
        inspectorsCount={inspectors.length}
        key={`columns-${columns.length}-inspectors-${inspectors.length}`}
        style={styles.container}>
        {clonedChildren}
      </SplitHostController>
    </SplitRuntimeContext.Provider>
  );
}

function SplitScreenColumn(
  props: SplitScreenProps & { __nativeScriptSplitIndex?: number },
) {
  return <NativeScriptSplitScreenView columnType="column" {...props} />;
}

function SplitScreenInspector(
  props: SplitScreenProps & { __nativeScriptSplitIndex?: number },
) {
  return <NativeScriptSplitScreenView columnType="inspector" {...props} />;
}

function NativeScriptSplitScreenView(
  props: SplitScreenProps & {
    __nativeScriptSplitIndex?: number;
    columnType: SplitScreenColumnType;
  },
) {
  const context = React.useContext(SplitRuntimeContext);
  const screenId = React.useId();

  if (!context) {
    return null;
  }

  return (
    <SplitScreenController
      {...props}
      hostId={context.hostId}
      screenId={screenId}
      attachController
      attachControllerView={false}
      attachNativeView={false}
      style={StyleSheet.absoluteFill}
    />
  );
}

export const NativeScriptSplitScreen = {
  Column: SplitScreenColumn,
  Inspector: SplitScreenInspector,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
