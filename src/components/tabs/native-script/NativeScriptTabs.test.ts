describe('NativeScriptTabsHost', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('emits tab selections as NativeSyntheticEvent payloads', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    const makeFrame = (width = 320, height = 640, y = 0) => ({
      origin: { x: 0, y },
      size: { width, height },
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
    const selectedController = { view: makeView() };
    const tabController: any = {
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
      origin: { x, y },
      size: { width, height },
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
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSTabsHostIOS.NativeScript',
    );
    const controller = hostDefinition.createController({
      delegate: (
        _controller: unknown,
        _protocol: unknown,
        implementation: unknown,
      ) => implementation,
      emit: (eventName: string, payload: unknown) => {
        emitted.push([eventName, payload]);
      },
      hostId: 'test-host',
      observe: jest.fn(),
    });
    const nextController = { view: makeView() };
    (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry = {
      hosts: {
        'test-host': {
          controller,
          provenance: 4,
          screens: [
            { controller: selectedController, screenKey: 'uikit' },
            { controller: nextController, screenKey: 'rnn' },
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
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    const makeFrame = (width = 320, height = 640, y = 0) => ({
      origin: { x: 0, y },
      size: { width, height },
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
    const selectedController = { view: makeView() };
    const tabController: any = {
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
      origin: { x, y },
      size: { width, height },
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
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSTabsHostIOS.NativeScript',
    );
    const controller = hostDefinition.createController({
      delegate: (
        _controller: unknown,
        _protocol: unknown,
        implementation: unknown,
      ) => implementation,
      emit: (eventName: string, payload: unknown) => {
        emitted.push([eventName, payload]);
      },
      hostId: 'test-host',
      observe: jest.fn(),
    });
    const nextController = { view: makeView() };
    (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry = {
      hosts: {
        'test-host': {
          controller,
          provenance: 4,
          screens: [
            { controller: selectedController, screenKey: 'uikit' },
            { controller: nextController, screenKey: 'rnn' },
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

  it('selects a tab from the root tap recognizer when the tab bar gets first hit', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    const makeFrame = (width = 320, height = 640, y = 0) => ({
      origin: { x: 0, y },
      size: { width, height },
    });
    const makeView = () => ({
      addGestureRecognizer: jest.fn(),
      addSubview: jest.fn(),
      bringSubviewToFront: jest.fn(),
      frame: makeFrame(),
      layer: {},
      setNeedsLayout: jest.fn(),
      layoutIfNeeded: jest.fn(),
    });
    const firstController = { view: makeView() };
    const secondController = { view: makeView() };
    const tabController: any = {
      view: makeView(),
      tabBar: {
        ...makeView(),
        bounds: makeFrame(320, 83),
        frame: makeFrame(320, 83, 557),
        items: [{ title: 'UIKit' }, { title: 'React Nav' }],
      },
      selectedViewController: firstController,
      viewControllers: [firstController, secondController],
    };
    const tapRecognizer = {
      cancelsTouchesInView: true,
      delaysTouchesBegan: true,
      delaysTouchesEnded: true,
      numberOfTapsRequired: 0,
    };
    const emitted: [string, unknown][] = [];
    let tapAction: ((gesture: unknown) => void) | undefined;

    (global as Record<string, unknown>).CGRectMake = (
      x: number,
      y: number,
      width: number,
      height: number,
    ) => ({
      origin: { x, y },
      size: { width, height },
    });
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      NSArray: {
        arrayWithArray: (items: unknown[]) => items,
      },
      UIGestureRecognizerState: {
        Ended: 3,
        Recognized: 3,
      },
      UITabBarController: {
        alloc: () => ({
          init: () => tabController,
        }),
      },
      UITapGestureRecognizer: {
        alloc: () => ({
          init: () => tapRecognizer,
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
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSTabsHostIOS.NativeScript',
    );
    const controller = hostDefinition.createController({
      delegate: (
        _controller: unknown,
        _protocol: unknown,
        implementation: unknown,
      ) => implementation,
      emit: (eventName: string, payload: unknown) => {
        emitted.push([eventName, payload]);
      },
      gestureAction: (_gesture: unknown, action: (gesture: unknown) => void) => {
        tapAction = action;
      },
      hostId: 'test-host',
      observe: jest.fn(),
    });

    (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry = {
      hosts: {
        'test-host': {
          controller,
          provenance: 4,
          screens: [
            { controller: firstController, index: 0, screenKey: 'uikit' },
            { controller: secondController, index: 1, screenKey: 'rnn' },
          ],
          selectedScreenKey: 'uikit',
        },
      },
    };

    expect(tabController.view.addGestureRecognizer).toHaveBeenCalledWith(
      tapRecognizer,
    );

    tapAction?.({
      locationInView: (view: unknown) =>
        view === tabController.view ? { x: 240, y: 580 } : { x: 240, y: 20 },
      state: 3,
    });

    expect(tabController.selectedIndex).toBe(1);
    expect(tabController.selectedViewController).toBe(secondController);
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

  it('applies iOS tab bar controller display settings on first create', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    const makeFrame = (width = 320, height = 640, y = 0) => ({
      origin: { x: 0, y },
      size: { width, height },
    });
    const makeView = () => ({
      addSubview: jest.fn(),
      bringSubviewToFront: jest.fn(),
      frame: makeFrame(),
      layer: {},
      setNeedsLayout: jest.fn(),
      layoutIfNeeded: jest.fn(),
    });
    const tabController: any = {
      view: makeView(),
      tabBar: {
        ...makeView(),
        frame: makeFrame(320, 83, 557),
      },
    };

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UITabBarController: {
        alloc: () => ({
          init: () => tabController,
        }),
      },
      UITabBarControllerMode: {
        TabBar: 11,
      },
      UITabBarMinimizeBehavior: {
        Never: 33,
      },
      UIView: {
        alloc: () => ({
          init: () => makeView(),
        }),
      },
    };

    jest.requireActual('./NativeScriptTabs.ios');

    const hostDefinition = NativeScriptRuntime.__getDefinitions().find(
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSTabsHostIOS.NativeScript',
    );

    hostDefinition.createController({
      delegate: (
        _controller: unknown,
        _protocol: unknown,
        implementation: unknown,
      ) => implementation,
      emit: jest.fn(),
      hostId: 'test-host',
      observe: jest.fn(),
      tabBarControllerMode: 'tabBar',
      tabBarMinimizeBehavior: 'never',
    });

    expect(tabController.mode).toBe(11);
    expect(tabController.tabBarMinimizeBehavior).toBe(33);
  });

  it('lets UITabBarController own the native tab bar frame during layout', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    const makeFrame = (width = 320, height = 640, y = 0) => ({
      origin: { x: 0, y },
      size: { width, height },
    });
    const makeView = () => ({
      addSubview: jest.fn(),
      bringSubviewToFront: jest.fn(),
      frame: makeFrame(),
      layer: {},
      setNeedsLayout: jest.fn(),
      layoutIfNeeded: jest.fn(),
    });
    const tabBarFrame = makeFrame(320, 83, 557);
    const firstController = { view: makeView() };
    const secondController = { view: makeView() };
    const tabController: any = {
      view: makeView(),
      tabBar: {
        ...makeView(),
        frame: tabBarFrame,
        items: [{ title: 'UIKit' }, { title: 'React Nav' }],
      },
      selectedViewController: firstController,
      setViewControllersAnimated: jest.fn((controllers: unknown[]) => {
        tabController.viewControllers = controllers;
      }),
    };

    (global as Record<string, unknown>).CGRectMake = (
      x: number,
      y: number,
      width: number,
      height: number,
    ) => ({
      origin: { x, y },
      size: { width, height },
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
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSTabsHostIOS.NativeScript',
    );
    const controller = hostDefinition.createController({
      delegate: (
        _controller: unknown,
        _protocol: unknown,
        implementation: unknown,
      ) => implementation,
      emit: jest.fn(),
      hostId: 'test-host',
      observe: jest.fn(),
    });
    (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry = {
      hosts: {
        'test-host': {
          controller,
          provenance: 0,
          screens: [
            {
              controller: firstController,
              index: 0,
              screenKey: 'index',
              title: 'UIKit',
            },
            {
              controller: secondController,
              index: 1,
              screenKey: 'react-navigation',
              title: 'React Nav',
            },
          ],
          selectedScreenKey: 'index',
        },
      },
    };

    hostDefinition.update(controller, {
      hostId: 'test-host',
      navStateRequest: {
        baseProvenance: 0,
        selectedScreenKey: 'index',
      },
    });

    expect(tabController.tabBar.frame).toBe(tabBarFrame);
  });

  it('commits route titles onto visible UIKit tab bar items', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    const makeFrame = (width = 320, height = 640, y = 0) => ({
      origin: { x: 0, y },
      size: { width, height },
    });
    const makeView = () => ({
      addSubview: jest.fn(),
      bringSubviewToFront: jest.fn(),
      frame: makeFrame(),
      layer: {},
      setNeedsLayout: jest.fn(),
      layoutIfNeeded: jest.fn(),
    });
    const firstItem = { title: '...', accessibilityLabel: undefined };
    const secondItem = { title: '', accessibilityLabel: undefined };
    const firstController = {
      view: makeView(),
      tabBarItem: { title: 'stale-first', accessibilityLabel: undefined },
    };
    const secondController = {
      view: makeView(),
      tabBarItem: { title: 'stale-second', accessibilityLabel: undefined },
    };
    const tabController: any = {
      view: makeView(),
      tabBar: {
        ...makeView(),
        frame: makeFrame(320, 83, 557),
        items: [firstItem, secondItem],
        setItemsAnimated: jest.fn(),
      },
      selectedViewController: firstController,
      setViewControllersAnimated: jest.fn((controllers: unknown[]) => {
        tabController.viewControllers = controllers;
      }),
    };

    (global as Record<string, unknown>).CGRectMake = (
      x: number,
      y: number,
      width: number,
      height: number,
    ) => ({
      origin: { x, y },
      size: { width, height },
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
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSTabsHostIOS.NativeScript',
    );
    const controller = hostDefinition.createController({
      delegate: (
        _controller: unknown,
        _protocol: unknown,
        implementation: unknown,
      ) => implementation,
      emit: jest.fn(),
      hostId: 'test-host',
      observe: jest.fn(),
    });
    (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry = {
      hosts: {
        'test-host': {
          controller,
          provenance: 0,
          screens: [
            {
              controller: firstController,
              index: 0,
              screenKey: 'index',
              title: 'UIKit',
            },
            {
              controller: secondController,
              index: 1,
              screenKey: 'react-navigation',
              title: 'React Nav',
            },
          ],
          selectedScreenKey: 'index',
        },
      },
    };

    hostDefinition.update(controller, {
      hostId: 'test-host',
      navStateRequest: {
        baseProvenance: 0,
        selectedScreenKey: 'index',
      },
    });

    expect(tabController.tabBar.setItemsAnimated).not.toHaveBeenCalled();
    expect(tabController.tabBar.items).toEqual([
      {
        accessibilityLabel: 'UIKit',
        title: 'UIKit',
      },
      {
        accessibilityLabel: 'React Nav',
        title: 'React Nav',
      },
    ]);
    expect(firstItem).toEqual({
      accessibilityLabel: 'UIKit',
      title: 'UIKit',
    });
    expect(secondItem).toEqual({
      accessibilityLabel: 'React Nav',
      title: 'React Nav',
    });
    expect(firstController.tabBarItem).toEqual({
      accessibilityLabel: 'UIKit',
      title: 'UIKit',
    });
    expect(secondController.tabBarItem).toEqual({
      accessibilityLabel: 'React Nav',
      title: 'React Nav',
    });
  });

  it('mutates the existing screen tab bar item on update', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    const makeView = () => ({
      addSubview: jest.fn(),
      bringSubviewToFront: jest.fn(),
      frame: {
        origin: { x: 0, y: 0 },
        size: { width: 320, height: 640 },
      },
      layer: {},
      setNeedsLayout: jest.fn(),
      layoutIfNeeded: jest.fn(),
    });
    const existingItem = {
      accessibilityIdentifier: 'old-tab',
      accessibilityLabel: 'Old tab',
      badgeValue: '1',
      image: null,
      selectedImage: null,
      title: 'index-opaque-route-key',
    };
    const controller = {
      title: 'index',
      tabBarItem: existingItem,
      view: makeView(),
    };
    const icon = { name: 'square.grid.2x2' };
    const selectedIcon = { name: 'square.grid.2x2.fill' };

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIImage: {
        systemImageNamed: (name: string) =>
          name.endsWith('.fill') ? selectedIcon : icon,
      },
    };

    jest.requireActual('./NativeScriptTabs.ios');

    const screenDefinition = NativeScriptRuntime.__getDefinitions().find(
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSTabsScreenIOS.NativeScript',
    );

    screenDefinition.update(controller, {
      __nativeScriptTabsIndex: 0,
      badgeValue: '2',
      hostId: 'test-host',
      ios: {
        icon: { type: 'sfSymbol', name: 'square.grid.2x2' },
        selectedIcon: { type: 'sfSymbol', name: 'square.grid.2x2.fill' },
      },
      screenKey: 'index',
      tabBarItemAccessibilityLabel: 'UIKit tab',
      tabBarItemTestID: 'tab-uikit',
      title: 'UIKit',
    });

    expect(controller.tabBarItem).toBe(existingItem);
    expect(existingItem).toEqual({
      accessibilityIdentifier: 'tab-uikit',
      accessibilityLabel: 'UIKit tab',
      badgeValue: '2',
      image: icon,
      selectedImage: selectedIcon,
      title: 'UIKit',
    });
  });

  it('does not install a persistent tab bar restore interval', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();
    jest.useFakeTimers();
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    let renderer: { unmount: () => void } | undefined;

    try {
      const React = jest.requireActual('react');
      const TestRenderer = jest.requireActual('react-test-renderer');
      const { NativeScriptTabsHost } = jest.requireActual(
        './NativeScriptTabs.ios',
      );

      TestRenderer.act(() => {
        renderer = TestRenderer.create(
          React.createElement(NativeScriptTabsHost, {
            navStateRequest: {
              baseProvenance: 0,
              selectedScreenKey: 'index',
            },
          }),
        );
      });

      expect(setIntervalSpy).not.toHaveBeenCalled();
    } finally {
      if (renderer) {
        const TestRenderer = jest.requireActual('react-test-renderer');
        TestRenderer.act(() => {
          renderer?.unmount();
        });
      }
      setIntervalSpy.mockRestore();
      jest.useRealTimers();
    }
  });
});
