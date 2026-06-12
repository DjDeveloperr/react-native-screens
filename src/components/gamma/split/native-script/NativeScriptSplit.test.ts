import fs from 'fs';
import path from 'path';

const splitSource = fs.readFileSync(
  path.resolve(__dirname, './NativeScriptSplit.ios.tsx'),
  'utf8',
);
const splitHostIOSSource = fs.readFileSync(
  path.resolve(__dirname, '../SplitHost.ios.tsx'),
  'utf8',
);
const splitScreenIOSSource = fs.readFileSync(
  path.resolve(__dirname, '../SplitScreen.ios.tsx'),
  'utf8',
);

function makeFrame(width = 320, height = 640) {
  return {
    origin: { x: 0, y: 0 },
    size: { height, width },
  };
}

function makeView() {
  const children: unknown[] = [];
  const view: any = {
    addSubview: jest.fn((child: any) => {
      children.push(child);
      child.superview = view;
    }),
    autoresizingMask: 0,
    backgroundColor: undefined,
    bounds: makeFrame(),
    children,
    frame: makeFrame(),
    hidden: false,
    tag: 0,
    userInteractionEnabled: true,
    viewWithTag: jest.fn(
      (tag: number) => children.find((child: any) => child.tag === tag) ?? null,
    ),
  };
  return view;
}

function makeController() {
  return {
    super: {
      viewDidAppear: jest.fn(),
      viewDidDisappear: jest.fn(),
      viewDidLayoutSubviews: jest.fn(),
      viewWillAppear: jest.fn(),
      viewWillDisappear: jest.fn(),
    },
    view: makeView(),
  } as any;
}

function installMethods(target: any, methods: Record<string, unknown>) {
  Object.defineProperties(target, Object.getOwnPropertyDescriptors(methods));
  return target;
}

describe('NativeScript gamma Split port', () => {
  beforeEach(() => {
    jest.resetModules();
    (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
    (global as Record<string, unknown>).__rnsNativeScriptSplitRegistry =
      undefined;
    (
      global as Record<string, unknown>
    ).__rnsSplitHostControllerNativeScriptClass = undefined;
    (
      global as Record<string, unknown>
    ).__rnsSplitScreenControllerNativeScriptClass = undefined;
    (
      global as Record<string, unknown>
    ).__rnsSplitNavigationControllerNativeScriptClass = undefined;
    (global as Record<string, unknown>).NativeClass = undefined;
  });

  it('routes gamma Split iOS surfaces through NativeScript', () => {
    expect(splitHostIOSSource).toContain(
      "import { NativeScriptSplitHost } from './native-script/NativeScriptSplit.ios'",
    );
    expect(splitHostIOSSource).toContain(
      'export default NativeScriptSplitHost',
    );
    expect(splitScreenIOSSource).toContain(
      "import { NativeScriptSplitScreen } from './native-script/NativeScriptSplit.ios'",
    );
    expect(splitScreenIOSSource).toContain(
      'export default NativeScriptSplitScreen',
    );
  });

  it('ports split host/screen UIKit structure and documents deviations', () => {
    expect(splitSource).toContain("debugName: 'RNSSplitHost.NativeScript'");
    expect(splitSource).toContain("debugName: 'RNSSplitScreen.NativeScript'");
    expect(splitSource).toContain("nativeValue('UISplitViewController')");
    expect(splitSource).toContain("nativeValue('UINavigationController')");
    expect(splitSource).toContain('initWithStyle(style)');
    expect(splitSource).toContain('initWithRootViewController');
    expect(splitSource).toContain('setViewControllerForColumn');
    expect(splitSource).toContain('showSplitColumn');
    expect(splitSource).toContain(
      'Direct port of RNSSplitAppearanceApplicator.updateSplitViewConfiguration',
    );
    expect(splitSource).toContain(
      'NATIVESCRIPT_PORT_DEVIATION: upstream RNSSplitScreenShadowStateProxy',
    );
    expect(splitSource).toContain(
      'NATIVESCRIPT_PORT_DEVIATION: upstream also calls',
    );
    expect(splitSource).not.toContain('SplitHostNativeComponent');
    expect(splitSource).not.toContain('SplitScreenNativeComponent');
  });

  it('mounts split columns through a UISplitViewController and emits UIKit lifecycle events', () => {
    jest.useFakeTimers();

    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    const splitControllers: any[] = [];
    const screenControllers: any[] = [];
    const navigationControllers: any[] = [];

    const UISplitViewController = function UISplitViewController() {};
    Object.assign(UISplitViewController, {
      alloc: () => ({
        init: () => installMethods(makeSplitController(), {}),
        initWithStyle: (style: number) =>
          installMethods(makeSplitController(style), {}),
      }),
      extend: (methods: Record<string, unknown>) => ({
        alloc: () => ({
          init: () => installMethods(makeSplitController(), methods),
          initWithStyle: (style: number) =>
            installMethods(makeSplitController(style), methods),
        }),
      }),
    });

    const UIViewController = function UIViewController() {};
    Object.assign(UIViewController, {
      extend: (methods: Record<string, unknown>) => ({
        alloc: () => ({
          init: () => {
            const controller = installMethods(makeController(), methods);
            screenControllers.push(controller);
            return controller;
          },
        }),
      }),
    });

    const UINavigationController = function UINavigationController() {};
    Object.assign(UINavigationController, {
      alloc: () => ({
        init: () => installMethods(makeNavigationController(null), {}),
        initWithRootViewController: (rootViewController: unknown) =>
          installMethods(makeNavigationController(rootViewController), {}),
      }),
      extend: (methods: Record<string, unknown>) => ({
        alloc: () => ({
          init: () => installMethods(makeNavigationController(null), methods),
          initWithRootViewController: (rootViewController: unknown) =>
            installMethods(
              makeNavigationController(rootViewController),
              methods,
            ),
        }),
      }),
    });

    function makeSplitController(style = 0) {
      const controller: any = {
        columnControllers: {},
        displayMode: 0,
        hide: jest.fn(),
        setViewControllerForColumn: jest.fn(
          (viewController: unknown, column: number) => {
            controller.columnControllers[column] = viewController;
          },
        ),
        show: jest.fn(),
        style,
        view: makeView(),
        viewControllers: [],
      };
      splitControllers.push(controller);
      return controller;
    }

    function makeNavigationController(rootViewController: unknown) {
      const controller = {
        rootViewController,
        topViewController: rootViewController,
        view: makeView(),
        viewControllers: rootViewController ? [rootViewController] : [],
      } as any;
      navigationControllers.push(controller);
      return controller;
    }

    (global as Record<string, unknown>).NativeClass = jest.fn();
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      NSArray: {
        arrayWithArray: (items: unknown[]) => items,
      },
      UIColor: {
        systemBackgroundColor: 'systemBackground',
      },
      UINavigationController,
      UISplitViewController,
      UISplitViewControllerBackgroundStyle: {
        Sidebar: 2,
      },
      UISplitViewControllerColumn: {
        Inspector: 4,
        Primary: 0,
        Secondary: 2,
        Supplementary: 1,
      },
      UISplitViewControllerDisplayMode: {
        OneBesideSecondary: 2,
        SecondaryOnly: 1,
      },
      UISplitViewControllerDisplayModeButtonVisibility: {
        Always: 1,
      },
      UISplitViewControllerPrimaryEdge: {
        Trailing: 1,
      },
      UISplitViewControllerSplitBehavior: {
        Tile: 3,
      },
      UISplitViewControllerStyle: {
        DoubleColumn: 1,
        TripleColumn: 2,
      },
      UIUserInterfaceStyle: {
        Dark: 2,
      },
      UIView: {
        alloc: () => ({
          init: () => makeView(),
        }),
      },
      UIViewController,
    };

    jest.requireActual('./NativeScriptSplit.ios');

    const definitions = NativeScriptRuntime.__getDefinitions();
    const hostDefinition = definitions.find(
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSSplitHost.NativeScript',
    );
    const screenDefinition = definitions.find(
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSSplitScreen.NativeScript',
    );
    const hostEvents: [string, unknown][] = [];
    const screenEvents: [string, unknown][] = [];

    const hostController = hostDefinition.createController({
      columnsCount: 2,
      hostId: 'host',
    });
    hostDefinition.mounted(
      hostController,
      {
        colorScheme: 'dark',
        columnMetrics: {
          maximumPrimaryColumnWidth: 300,
          minimumPrimaryColumnWidth: 200,
          preferredPrimaryColumnWidthOrFraction: 0.35,
        },
        columnsCount: 2,
        displayModeButtonVisibility: 'always',
        hostId: 'host',
        preferredDisplayMode: 'oneBesideSecondary',
        preferredSplitBehavior: 'tile',
        primaryBackgroundStyle: 'sidebar',
        primaryEdge: 'trailing',
        showInspector: true,
        showSecondaryToggleButton: true,
        topColumnForCollapsing: 'secondary',
      },
      {
        emit: (eventName: string, payload: unknown) => {
          hostEvents.push([eventName, payload]);
        },
      },
    );

    const primaryController = screenDefinition.createController({
      columnType: 'column',
      hostId: 'host',
      screenId: 'primary',
    });
    screenDefinition.mounted(
      primaryController,
      {
        __nativeScriptSplitIndex: 0,
        columnType: 'column',
        hostId: 'host',
        screenId: 'primary',
      },
      {
        emit: (eventName: string, payload: unknown) => {
          screenEvents.push([eventName, payload]);
        },
      },
    );

    const secondaryController = screenDefinition.createController({
      columnType: 'column',
      hostId: 'host',
      screenId: 'secondary',
    });
    screenDefinition.mounted(
      secondaryController,
      {
        __nativeScriptSplitIndex: 1,
        columnType: 'column',
        hostId: 'host',
        screenId: 'secondary',
      },
      {
        emit: (eventName: string, payload: unknown) => {
          screenEvents.push([eventName, payload]);
        },
      },
    );

    const inspectorController = screenDefinition.createController({
      columnType: 'inspector',
      hostId: 'host',
      screenId: 'inspector',
    });
    screenDefinition.mounted(
      inspectorController,
      {
        __nativeScriptSplitIndex: 2,
        columnType: 'inspector',
        hostId: 'host',
        screenId: 'inspector',
      },
      {
        emit: (eventName: string, payload: unknown) => {
          screenEvents.push([eventName, payload]);
        },
      },
    );

    jest.runOnlyPendingTimers();

    expect(hostController.style).toBe(1);
    expect(hostController.viewControllers).toHaveLength(2);
    expect(hostController.viewControllers[0].topViewController).toBe(
      primaryController,
    );
    expect(hostController.viewControllers[1].topViewController).toBe(
      secondaryController,
    );
    expect(hostController.setViewControllerForColumn).toHaveBeenCalledWith(
      expect.objectContaining({ topViewController: inspectorController }),
      4,
    );
    expect(hostController.displayModeButtonVisibility).toBe(1);
    expect(hostController.preferredSplitBehavior).toBe(3);
    expect(hostController.overrideUserInterfaceStyle).toBe(2);
    expect(hostController.primaryBackgroundStyle).toBe(2);
    expect(hostController.primaryEdge).toBe(1);
    expect(hostController.showsSecondaryOnlyButton).toBe(true);
    expect(hostController.minimumPrimaryColumnWidth).toBe(200);
    expect(hostController.maximumPrimaryColumnWidth).toBe(300);
    expect(hostController.preferredPrimaryColumnWidthFraction).toBe(0.35);
    expect(hostController.preferredDisplayMode).toBe(2);
    expect(hostController.show).toHaveBeenCalledWith(4);

    hostController.showColumnNamed('secondary');
    expect(hostController.show).toHaveBeenLastCalledWith(2);

    primaryController.viewWillAppear(true);
    primaryController.viewDidAppear(true);
    primaryController.viewWillDisappear(true);
    primaryController.viewDidDisappear(true);

    expect(screenEvents).toEqual([
      ['onWillAppear', {}],
      ['onDidAppear', {}],
      ['onWillDisappear', {}],
      ['onDidDisappear', {}],
    ]);

    hostController.splitViewControllerDidCollapse(hostController);
    hostController.splitViewControllerDidExpand(hostController);
    hostController.splitViewControllerWillChangeToDisplayMode(
      hostController,
      1,
    );
    hostController.splitViewControllerDidHideColumn(hostController, 4);

    expect(hostEvents).toContainEqual(['onCollapse', {}]);
    expect(hostEvents).toContainEqual(['onExpand', {}]);
    expect(hostEvents).toContainEqual([
      'onDisplayModeWillChange',
      {
        nativeEvent: {
          currentDisplayMode: 'automatic',
          nextDisplayMode: 'secondaryOnly',
        },
      },
    ]);
    expect(hostEvents).toContainEqual(['onInspectorHide', {}]);

    expect(screenControllers).toHaveLength(3);
    expect(navigationControllers.length).toBeGreaterThanOrEqual(3);
    jest.useRealTimers();
  });
});
