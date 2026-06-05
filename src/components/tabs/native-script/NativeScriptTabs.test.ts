describe('NativeScriptTabsHost', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('emits tab selections as NativeSyntheticEvent payloads', () => {
    const NativeScriptRuntime = jest.requireActual('@nativescript/react-native');
    NativeScriptRuntime.__resetDefinitions();

    const makeFrame = (width = 320, height = 640, y = 0) => ({
      origin: {x: 0, y},
      size: {width, height},
    });
    const makeView = () => ({
      addSubview: jest.fn(),
      bringSubviewToFront: jest.fn(),
      insertSubviewAtIndex: jest.fn(),
      insertSubviewBelowSubview: jest.fn(),
      frame: makeFrame(),
      layer: {},
      setNeedsLayout: jest.fn(),
      layoutIfNeeded: jest.fn(),
    });
    const selectedController = {view: makeView()};
    const tabController = {
      view: makeView(),
      tabBar: {
        ...makeView(),
        frame: makeFrame(320, 83, 557),
      },
      selectedViewController: selectedController,
    };
    const emitted: [string, unknown][] = [];

    (global as Record<string, unknown>).CGRectMake = (
      x: number,
      y: number,
      width: number,
      height: number,
    ) => ({
      origin: {x, y},
      size: {width, height},
    });
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      NSArray: {
        arrayWithArray: (items: unknown[]) => items,
      },
      UITabBarController: {
        alloc: () => ({
          init: () => tabController,
        }),
      },
      UIView: {
        alloc: () => ({
          init: () => makeView(),
        }),
      },
    };

    jest.requireActual('./NativeScriptTabs.ios');

    const hostDefinition = NativeScriptRuntime.__getDefinitions().find(
      (definition: {debugName?: string}) =>
        definition.debugName === 'RNSTabsHostIOS.NativeScript',
    );
    const controller = hostDefinition.createController({
      delegate: (_controller: unknown, _protocol: unknown, implementation: unknown) =>
        implementation,
      emit: (eventName: string, payload: unknown) => {
        emitted.push([eventName, payload]);
      },
      hostId: 'test-host',
    });
    const nextController = {view: makeView()};
    (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry = {
      hosts: {
        'test-host': {
          controller,
          provenance: 4,
          screens: [
            {controller: selectedController, screenKey: 'uikit'},
            {controller: nextController, screenKey: 'rnn'},
          ],
          selectedScreenKey: 'uikit',
        },
      },
    };

    controller.delegate.tabBarControllerDidSelectViewController(
      controller,
      nextController,
    );

    expect(emitted).toEqual([
      [
        'onTabSelected',
        {
          nativeEvent: {
            actionOrigin: 'user',
            hasTriggeredSpecialEffect: false,
            isRepeated: false,
            provenance: 5,
            selectedScreenKey: 'rnn',
          },
        },
      ],
    ]);
  });

  it('emits from shouldSelect and suppresses the matching didSelect echo', () => {
    const NativeScriptRuntime = jest.requireActual('@nativescript/react-native');
    NativeScriptRuntime.__resetDefinitions();

    const makeFrame = (width = 320, height = 640, y = 0) => ({
      origin: {x: 0, y},
      size: {width, height},
    });
    const makeView = () => ({
      addSubview: jest.fn(),
      bringSubviewToFront: jest.fn(),
      insertSubviewAtIndex: jest.fn(),
      insertSubviewBelowSubview: jest.fn(),
      frame: makeFrame(),
      layer: {},
      setNeedsLayout: jest.fn(),
      layoutIfNeeded: jest.fn(),
    });
    const selectedController = {view: makeView()};
    const tabController = {
      view: makeView(),
      tabBar: {
        ...makeView(),
        frame: makeFrame(320, 83, 557),
      },
      selectedViewController: selectedController,
    };
    const emitted: [string, unknown][] = [];

    (global as Record<string, unknown>).CGRectMake = (
      x: number,
      y: number,
      width: number,
      height: number,
    ) => ({
      origin: {x, y},
      size: {width, height},
    });
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      NSArray: {
        arrayWithArray: (items: unknown[]) => items,
      },
      UITabBarController: {
        alloc: () => ({
          init: () => tabController,
        }),
      },
      UIView: {
        alloc: () => ({
          init: () => makeView(),
        }),
      },
    };

    jest.requireActual('./NativeScriptTabs.ios');

    const hostDefinition = NativeScriptRuntime.__getDefinitions().find(
      (definition: {debugName?: string}) =>
        definition.debugName === 'RNSTabsHostIOS.NativeScript',
    );
    const controller = hostDefinition.createController({
      delegate: (_controller: unknown, _protocol: unknown, implementation: unknown) =>
        implementation,
      emit: (eventName: string, payload: unknown) => {
        emitted.push([eventName, payload]);
      },
      hostId: 'test-host',
    });
    const nextController = {view: makeView()};
    (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry = {
      hosts: {
        'test-host': {
          controller,
          provenance: 4,
          screens: [
            {controller: selectedController, screenKey: 'uikit'},
            {controller: nextController, screenKey: 'rnn'},
          ],
          selectedScreenKey: 'uikit',
        },
      },
    };

    expect(
      controller.delegate.tabBarControllerShouldSelectViewController(
        controller,
        nextController,
      ),
    ).toBe(true);
    controller.delegate.tabBarControllerDidSelectViewController(
      controller,
      nextController,
    );

    expect(emitted).toEqual([
      [
        'onTabSelected',
        {
          nativeEvent: {
            actionOrigin: 'user',
            hasTriggeredSpecialEffect: false,
            isRepeated: false,
            provenance: 5,
            selectedScreenKey: 'rnn',
          },
        },
      ],
    ]);
  });
});
