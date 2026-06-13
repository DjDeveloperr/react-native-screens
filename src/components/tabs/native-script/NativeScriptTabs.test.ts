/* eslint-disable @typescript-eslint/no-var-requires */
describe('NativeScriptTabsHost', () => {
  beforeEach(() => {
    jest.resetModules();
    (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry =
      undefined;
  });

  it('ports tab image loading through local UIKit resolution plus RN image-loader fallback', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.resolve(__dirname, './NativeScriptTabs.ios.tsx'),
      'utf8',
    );

    expect(source).toContain('function imageFromResolvedTabSource');
    expect(source).toContain('UIImage.imageWithContentsOfFile');
    expect(source).toContain('imageWithRenderingMode');
    expect(source).toContain('AlwaysTemplate');
    expect(source).toContain('AlwaysOriginal');
    expect(source).toContain('function loadResolvedTabImage');
    expect(source).toContain('ctx?.loadImage?.');
    expect(source).toContain('item.image = image');
    expect(source).toContain('item.selectedImage = image');
  });

  it('ports iOS 26 bottom accessory through the tabs host reconciliation path', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.resolve(__dirname, './NativeScriptTabs.ios.tsx'),
      'utf8',
    );

    expect(source).toContain('RNSTabsBottomAccessory.NativeScript');
    expect(source).toContain('RNSTabsBottomAccessoryContent.NativeScript');
    expect(source).toContain('RNSTabsBottomAccessoryNativeScriptView');
    expect(source).toContain('RNSTabsBottomAccessoryContentNativeScriptView');
    expect(source).toContain('nativeScriptTabsBottomAccessoryViewClass');
    expect(source).toContain('nativeScriptTabsBottomAccessoryContentViewClass');
    expect(source).toContain('function configureTabsBottomAccessory');
    expect(source).toContain('UITabAccessory');
    expect(source).toContain('initWithContentView(wrapperView)');
    expect(source).toContain('setTabControllerBottomAccessory');
    expect(source).toContain("bottomAccessory('regular')");
    expect(source).toContain("bottomAccessory('inline')");
    expect(source).toContain('StyleSheet.absoluteFill');
    expect(source).toContain(
      'Direct port of RNSTabsHostComponentView.updateContainer',
    );
    expect(source).toContain(
      'NATIVESCRIPT_PORT_DEVIATION: upstream RNSTabsBottomAccessoryShadowStateProxy',
    );
  });

  it('installs a UITabAccessory wrapper and switches regular/inline content opacity', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    const makeFrame = (width = 320, height = 64, y = 0) => ({
      origin: { x: 0, y },
      size: { width, height },
    });
    const makeView = () => {
      const view: any = {
        addObserverForKeyPathOptionsContext: jest.fn(),
        addSubview: jest.fn((child: any) => {
          child.superview = view;
        }),
        autoresizingMask: 0,
        backgroundColor: undefined,
        bounds: makeFrame(),
        frame: makeFrame(),
        layer: { opacity: 1 },
        removeObserverForKeyPathContext: jest.fn(),
        setNeedsLayout: jest.fn(),
        layoutIfNeeded: jest.fn(),
        traitCollection: {
          tabAccessoryEnvironment: 0,
        },
        userInteractionEnabled: false,
      };
      return view;
    };
    const tabController: any = {
      tabBar: makeView(),
      view: makeView(),
      setBottomAccessoryAnimated: jest.fn((accessory: unknown) => {
        tabController.bottomAccessory = accessory;
      }),
    };
    const emitted: [string, unknown][] = [];

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIDevice: {
        currentDevice: {
          systemVersion: '26.0',
        },
      },
      NSArray: {
        arrayWithArray: (items: unknown[]) => items,
      },
      NSKeyValueObservingOptionInitial: 4,
      UIColor: {
        clearColor: 'clear',
      },
      UITabAccessory: {
        alloc: () => ({
          initWithContentView: (contentView: unknown) => ({ contentView }),
        }),
      },
      UITabAccessoryEnvironment: {
        Inline: 1,
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

    const definitions = NativeScriptRuntime.__getDefinitions();
    const hostDefinition = definitions.find(
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSTabsHostIOS.NativeScript',
    );
    const accessoryDefinition = definitions.find(
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSTabsBottomAccessory.NativeScript',
    );
    const contentDefinition = definitions.find(
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSTabsBottomAccessoryContent.NativeScript',
    );
    const hostController = hostDefinition.createController({
      delegate: (
        _controller: unknown,
        _protocol: unknown,
        implementation: unknown,
      ) => implementation,
      emit: jest.fn(),
      hostId: 'test-host',
      observe: jest.fn(),
    });

    hostDefinition.update(
      hostController,
      {
        hostId: 'test-host',
        navStateRequest: {
          baseProvenance: 0,
          selectedScreenKey: 'index',
        },
      },
      {},
      { emit: jest.fn() },
    );

    const accessoryHost = accessoryDefinition.create({
      accessoryId: 'accessory-1',
      hostId: 'test-host',
    });
    accessoryDefinition.mounted(
      accessoryHost,
      {
        accessoryId: 'accessory-1',
        hostId: 'test-host',
      },
      {
        emit: (eventName: string, payload: unknown) => {
          emitted.push([eventName, payload]);
        },
      },
    );

    const accessoryWrapper = tabController.bottomAccessory.contentView;

    expect(tabController.setBottomAccessoryAnimated).toHaveBeenCalledWith(
      tabController.bottomAccessory,
      true,
    );
    expect(accessoryWrapper.addSubview).toHaveBeenCalledWith(
      accessoryHost.rootView,
    );
    expect(
      accessoryHost.rootView.__rnsNativeScriptTabsBottomAccessoryWrapperView,
    ).toBe(accessoryWrapper);
    expect(
      accessoryHost.rootView
        .__rnsNativeScriptTabsBottomAccessoryObservedWrapperView,
    ).toBe(accessoryWrapper);

    const regularHost = contentDefinition.create({
      accessoryId: 'accessory-1',
      environment: 'regular',
    });
    const inlineHost = contentDefinition.create({
      accessoryId: 'accessory-1',
      environment: 'inline',
    });

    contentDefinition.mounted(regularHost, {
      accessoryId: 'accessory-1',
      environment: 'regular',
    });
    contentDefinition.mounted(inlineHost, {
      accessoryId: 'accessory-1',
      environment: 'inline',
    });

    expect(regularHost.rootView.layer.opacity).toBe(1);
    expect(inlineHost.rootView.layer.opacity).toBe(0);

    accessoryHost.rootView.traitCollection.tabAccessoryEnvironment = 1;
    accessoryDefinition.update(
      accessoryHost,
      {
        accessoryId: 'accessory-1',
        hostId: 'test-host',
      },
      {},
      {
        emit: (eventName: string, payload: unknown) => {
          emitted.push([eventName, payload]);
        },
      },
    );

    expect(regularHost.rootView.layer.opacity).toBe(0);
    expect(inlineHost.rootView.layer.opacity).toBe(1);

    accessoryDefinition.dispose(accessoryHost, {
      accessoryId: 'accessory-1',
      hostId: 'test-host',
    });

    expect(tabController.setBottomAccessoryAnimated).toHaveBeenLastCalledWith(
      null,
      true,
    );
    expect(emitted).toEqual([]);
  });

  it('ports RNSTabsScreen scroll inset override provider', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.resolve(__dirname, './NativeScriptTabs.ios.tsx'),
      'utf8',
    );

    expect(source).toContain('RNSTabsScreenNativeScriptView');
    expect(source).toContain(
      'shouldOverrideScrollViewContentInsetAdjustmentBehavior',
    );
    expect(source).toContain(
      'overrideScrollViewBehaviorInFirstDescendantChainIfNeeded',
    );
    expect(source).toContain(
      'props?.ios?.overrideScrollViewContentInsetAdjustmentBehavior !== false',
    );
    expect(source).toContain("'didAddSubview:'");
    expect(source.indexOf('function arrayCount')).toBeLessThan(
      source.indexOf('function findScrollViewInFirstDescendantChainFrom'),
    );

    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    const makeView = () => ({
      backgroundColor: undefined,
      isKindOfClass: () => false,
      subviews: [],
    });
    const fallbackView = makeView();
    const controller = {
      tabBarItem: undefined,
      title: undefined,
      view: makeView(),
    };

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIColor: {
        systemBackgroundColor: '#fff',
      },
      UITabBarItem: {
        alloc: () => ({
          init: () => ({
            image: null,
            selectedImage: null,
            tag: 0,
            title: undefined,
          }),
        }),
      },
      UIView: {
        alloc: () => ({
          init: () => fallbackView,
        }),
      },
      UIViewController: {
        alloc: () => ({
          init: () => controller,
        }),
      },
    };

    jest.requireActual('./NativeScriptTabs.ios');

    const screenDefinition = NativeScriptRuntime.__getDefinitions().find(
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSTabsScreenIOS.NativeScript',
    );

    const created = screenDefinition.createController({
      hostId: 'test-host',
      screenKey: 'index',
      title: 'UIKit',
    });

    expect(
      created.view.shouldOverrideScrollViewContentInsetAdjustmentBehavior(),
    ).toBe(true);

    screenDefinition.update(
      created,
      {
        hostId: 'test-host',
        ios: {
          overrideScrollViewContentInsetAdjustmentBehavior: false,
        },
        screenKey: 'index',
        title: 'UIKit',
      },
      {},
      {},
    );

    expect(
      created.view.shouldOverrideScrollViewContentInsetAdjustmentBehavior(),
    ).toBe(false);
  });

  it('ports RNSTabsScreen lifecycle events through UIViewController appearance selectors', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.resolve(__dirname, './NativeScriptTabs.ios.tsx'),
      'utf8',
    );
    const controllerSource = source.slice(
      source.indexOf('class RNSTabsScreenNativeScriptController'),
      source.indexOf(
        'NativeClassFunction(RNSTabsScreenNativeScriptController)',
      ),
    );
    const screenDefinitionSource = source.slice(
      source.indexOf('const TabsScreenController ='),
      source.indexOf('export function NativeScriptTabsHost'),
    );
    const controllerIndex = source.indexOf(
      'class RNSTabsScreenNativeScriptController',
    );

    expect(source).toContain('function callNativeScriptTabsControllerSuper');
    expect(source).toContain(
      'function emitTabsScreenLifecycleEventForController',
    );
    expect(source).toContain('tabsScreenControllerClass()');
    expect(source).toContain('ObjCExposedMethods');
    expect(controllerSource).toContain('viewWillAppear(animated: boolean)');
    expect(controllerSource).toContain('viewDidAppear(animated: boolean)');
    expect(controllerSource).toContain('viewWillDisappear(animated: boolean)');
    expect(controllerSource).toContain('viewDidDisappear(animated: boolean)');
    expect(controllerSource).toContain("'viewWillAppear:'");
    expect(controllerSource).toContain("'viewDidAppear:'");
    expect(controllerSource).toContain("'viewWillDisappear:'");
    expect(controllerSource).toContain("'viewDidDisappear:'");
    expect(controllerSource).toContain(
      "emitTabsScreenLifecycleEventForController(this, 'onWillAppear')",
    );
    expect(controllerSource).toContain(
      "emitTabsScreenLifecycleEventForController(this, 'onDidAppear')",
    );
    expect(controllerSource).toContain(
      "emitTabsScreenLifecycleEventForController(this, 'onWillDisappear')",
    );
    expect(controllerSource).toContain(
      "emitTabsScreenLifecycleEventForController(this, 'onDidDisappear')",
    );
    expect(screenDefinitionSource).not.toContain("ctx?.emit('onWillAppear'");
    expect(screenDefinitionSource).not.toContain("ctx?.emit('onDidAppear'");
    expect(screenDefinitionSource).not.toContain("ctx?.emit('onWillDisappear'");
    expect(screenDefinitionSource).not.toContain("ctx?.emit('onDidDisappear'");

    for (const helperName of [
      'callNativeScriptTabsControllerSuper',
      'emitTabsScreenLifecycleEventForController',
      'installTabsScreenLifecycleMethodsOnController',
    ]) {
      expect(source.indexOf(`function ${helperName}`)).toBeLessThan(
        controllerIndex,
      );
    }

    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    const view = {
      backgroundColor: undefined,
      isKindOfClass: () => false,
      subviews: [],
    };
    const superObject = {
      viewDidAppear: jest.fn(),
      viewDidDisappear: jest.fn(),
      viewWillAppear: jest.fn(),
      viewWillDisappear: jest.fn(),
    };
    const controller = {
      super: superObject,
      tabBarItem: undefined,
      title: undefined,
      view,
    };
    const emitted: [string, unknown][] = [];

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIColor: {
        systemBackgroundColor: '#fff',
      },
      UITabBarItem: {
        alloc: () => ({
          init: () => ({
            image: null,
            selectedImage: null,
            tag: 0,
            title: undefined,
          }),
        }),
      },
      UIView: {
        alloc: () => ({
          init: () => view,
        }),
      },
      UIViewController: {
        alloc: () => ({
          init: () => controller,
        }),
      },
    };

    jest.requireActual('./NativeScriptTabs.ios');

    const screenDefinition = NativeScriptRuntime.__getDefinitions().find(
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSTabsScreenIOS.NativeScript',
    );
    const props = {
      __nativeScriptTabsIndex: 0,
      hostId: 'test-host',
      screenKey: 'index',
      title: 'UIKit',
    };
    const ctx = {
      emit: (eventName: string, payload: unknown) => {
        emitted.push([eventName, payload]);
      },
    };

    const created = screenDefinition.createController(props);
    screenDefinition.mounted(created, props, ctx);

    expect(emitted).toEqual([]);

    created.viewWillAppear(false);
    created.viewDidAppear(false);
    created.viewWillDisappear(true);
    created.viewDidDisappear(true);

    expect(superObject.viewWillAppear).toHaveBeenCalledWith(false);
    expect(superObject.viewDidAppear).toHaveBeenCalledWith(false);
    expect(superObject.viewWillDisappear).toHaveBeenCalledWith(true);
    expect(superObject.viewDidDisappear).toHaveBeenCalledWith(true);
    expect(emitted).toEqual([
      ['onWillAppear', {}],
      ['onDidAppear', {}],
      ['onWillDisappear', {}],
      ['onDidDisappear', {}],
    ]);

    screenDefinition.dispose(created, props, ctx);

    expect(emitted).toEqual([
      ['onWillAppear', {}],
      ['onDidAppear', {}],
      ['onWillDisappear', {}],
      ['onDidDisappear', {}],
    ]);
  });

  it('selects tab controllers through selectedViewController as the UIKit source of truth', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.resolve(__dirname, './NativeScriptTabs.ios.tsx'),
      'utf8',
    );
    const applySelectionSource = source.slice(
      source.indexOf('function applySelectedTabController'),
      source.indexOf('function shouldAnimateTabViewControllersCommit'),
    );
    const tapSelectionSource = source.slice(
      source.indexOf('if (!repeated) {'),
      source.indexOf('emitSelection(host, selectedController, false);'),
    );

    expect(applySelectionSource).toContain(
      'tabController.selectedViewController = selectedController',
    );
    expect(applySelectionSource).not.toContain(
      'tabController.selectedIndex = selectedIndex',
    );
    expect(tapSelectionSource).toContain(
      'controller.selectedViewController = selectedController',
    );
    expect(tapSelectionSource).not.toContain(
      'controller.selectedIndex = selectedIndex',
    );
    expect(source).toContain(
      "Direct port of RNSTabBarController's updateSelectedViewControllerTo:",
    );
    expect(source).toContain('function withSuppressedTabsSelectionObservation');
    expect(source).toContain(
      "Direct port of RNSTabBarController.performContainerUpdate's",
    );
  });

  it('emits tab selections as NativeSyntheticEvent payloads', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();
    (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry =
      undefined;

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
      traitOverrides: {},
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
          navigationStateInitialized: true,
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

  it('ports repeated tab selection pop-to-root through nested native stacks', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();
    (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry =
      undefined;

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
    const navigationController = {
      popToRootViewControllerAnimated: jest.fn(() => ['detail']),
      topViewController: { view: makeView() },
      viewControllers: ['root', 'detail'],
    };
    const selectedController = {
      childViewControllers: [navigationController],
      view: makeView(),
    };
    const tabController: any = {
      view: makeView(),
      tabBar: {
        ...makeView(),
        frame: makeFrame(320, 83, 557),
      },
      selectedViewController: selectedController,
    };
    const emitted: [string, unknown][] = [];

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
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
    (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry = {
      hosts: {
        'test-host': {
          controller,
          navigationStateInitialized: true,
          provenance: 4,
          screens: [
            {
              controller: selectedController,
              screenKey: 'uikit',
            },
          ],
          selectedScreenKey: 'uikit',
        },
      },
    };

    expect(
      controller.delegate.tabBarControllerShouldSelectViewController(
        controller,
        selectedController,
      ),
    ).toBe(false);
    expect(
      navigationController.popToRootViewControllerAnimated,
    ).toHaveBeenCalledWith(true);
    expect(emitted).toEqual([
      [
        'onTabSelected',
        {
          nativeEvent: {
            actionOrigin: 'user',
            hasTriggeredSpecialEffect: true,
            isRepeated: true,
            provenance: 5,
            selectedScreenKey: 'uikit',
          },
        },
      ],
    ]);
  });

  it('ports repeated tab selection scroll-to-top when no stack pop is available', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();
    (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry =
      undefined;

    const makeFrame = (width = 320, height = 640, y = 0) => ({
      origin: { x: 0, y },
      size: { width, height },
    });
    const scrollView = {
      adjustedContentInset: { top: 20 },
      contentOffset: { y: 80 },
      isKindOfClass: (klass: unknown) => klass === 'UIScrollView',
      setContentOffsetAnimated: jest.fn(),
      subviews: [],
    };
    const makeView = (subviews: unknown[] = []) => ({
      addSubview: jest.fn(),
      bringSubviewToFront: jest.fn(),
      frame: makeFrame(),
      insertSubviewAtIndex: jest.fn(),
      insertSubviewBelowSubview: jest.fn(),
      layer: {},
      layoutIfNeeded: jest.fn(),
      setNeedsLayout: jest.fn(),
      subviews,
    });
    const selectedController = {
      view: makeView([scrollView]),
    };
    const tabController: any = {
      view: makeView(),
      tabBar: {
        ...makeView(),
        frame: makeFrame(320, 83, 557),
      },
      selectedViewController: selectedController,
    };
    const emitted: [string, unknown][] = [];

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIScrollView: 'UIScrollView',
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
    (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry = {
      hosts: {
        'test-host': {
          controller,
          navigationStateInitialized: true,
          provenance: 4,
          screens: [
            {
              controller: selectedController,
              screenKey: 'uikit',
            },
          ],
          selectedScreenKey: 'uikit',
        },
      },
    };

    expect(
      controller.delegate.tabBarControllerShouldSelectViewController(
        controller,
        selectedController,
      ),
    ).toBe(false);
    expect(scrollView.setContentOffsetAnimated).toHaveBeenCalledWith(
      { x: 0, y: -20 },
      true,
    );
    expect(emitted).toEqual([
      [
        'onTabSelected',
        {
          nativeEvent: {
            actionOrigin: 'user',
            hasTriggeredSpecialEffect: true,
            isRepeated: true,
            provenance: 5,
            selectedScreenKey: 'uikit',
          },
        },
      ],
    ]);
  });

  it('reschedules selected tab host refresh after native selection', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    NativeScriptRuntime.__resetDefinitions();
    (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry =
      undefined;

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
    const nextController = { view: makeView() };
    const tabController: any = {
      view: makeView(),
      tabBar: {
        ...makeView(),
        frame: makeFrame(320, 83, 557),
      },
      selectedViewController: selectedController,
    };

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
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
          navigationStateInitialized: true,
          provenance: 4,
          screens: [
            { controller: selectedController, screenKey: 'uikit' },
            { controller: nextController, screenKey: 'rnn' },
          ],
          selectedScreenKey: 'uikit',
        },
      },
    };

    try {
      controller.delegate.tabBarControllerDidSelectViewController(
        controller,
        nextController,
      );

      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 0);
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 16);
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 64);
    } finally {
      setTimeoutSpy.mockRestore();
    }
  });

  it('starts tab navigation provenance at zero until native state is initialized', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();
    (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry =
      undefined;

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
    const nextController = { view: makeView() };
    const tabController: any = {
      view: makeView(),
      tabBar: {
        ...makeView(),
        frame: makeFrame(320, 83, 557),
      },
      selectedViewController: selectedController,
    };
    const emitted: [string, unknown][] = [];

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
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
    (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry = {
      hosts: {
        'test-host': {
          controller,
          provenance: 17,
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
            provenance: 0,
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
          navigationStateInitialized: true,
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
    expect(controller.__rnsNativeScriptSuppressSelectionObservation).toBe(true);
    controller.delegate.tabBarControllerDidSelectViewController(
      controller,
      nextController,
    );
    expect(controller.__rnsNativeScriptSuppressSelectionObservation).toBe(
      false,
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

  it('emits prevented, rejected, and More-tab selection events like RNSTabBarController', () => {
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
      insertSubviewBelowSubview: jest.fn(),
      layer: {},
      setNeedsLayout: jest.fn(),
      layoutIfNeeded: jest.fn(),
    });
    const selectedController = { view: makeView() };
    const preventedController = { view: makeView() };
    const nextController = { view: makeView() };
    const moreController = { view: makeView() };
    const tabController: any = {
      view: makeView(),
      tabBar: {
        ...makeView(),
        frame: makeFrame(320, 83, 557),
      },
      moreNavigationController: moreController,
      selectedViewController: selectedController,
      setViewControllersAnimated: jest.fn((controllers: unknown[]) => {
        tabController.viewControllers = controllers;
      }),
      viewControllers: [
        selectedController,
        preventedController,
        nextController,
      ],
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
    const host = {
      controller,
      lastUINavigationStateProvenance: 4,
      navigationStateInitialized: true,
      provenance: 4,
      screens: [
        { controller: selectedController, index: 0, screenKey: 'uikit' },
        {
          controller: preventedController,
          index: 1,
          preventNativeSelection: true,
          screenKey: 'settings',
        },
        { controller: nextController, index: 2, screenKey: 'rnn' },
      ],
      selectedScreenKey: 'uikit',
    };
    (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry = {
      hosts: {
        'test-host': host,
      },
    };

    expect(
      controller.delegate.tabBarControllerShouldSelectViewController(
        controller,
        preventedController,
      ),
    ).toBe(false);
    controller.delegate.tabBarControllerDidSelectViewController(
      controller,
      moreController,
    );
    hostDefinition.update(
      controller,
      {
        hostId: 'test-host',
        navStateRequest: {
          baseProvenance: 3,
          selectedScreenKey: 'rnn',
        },
        rejectStaleNavStateUpdates: true,
      },
      {},
      {
        emit: (eventName: string, payload: unknown) => {
          emitted.push([eventName, payload]);
        },
      },
    );
    hostDefinition.update(
      controller,
      {
        hostId: 'test-host',
        navStateRequest: {
          baseProvenance: 4,
          selectedScreenKey: 'uikit',
        },
      },
      {},
      {
        emit: (eventName: string, payload: unknown) => {
          emitted.push([eventName, payload]);
        },
      },
    );

    expect(emitted).toEqual([
      [
        'onTabSelectionPrevented',
        {
          nativeEvent: {
            preventedScreenKey: 'settings',
            provenance: 4,
            selectedScreenKey: 'uikit',
          },
        },
      ],
      [
        'onMoreTabSelected',
        {
          nativeEvent: {
            provenance: 4,
            selectedScreenKey: 'uikit',
          },
        },
      ],
      [
        'onTabSelectionRejected',
        {
          nativeEvent: {
            provenance: 4,
            rejectedBaseProvenance: 3,
            rejectedScreenKey: 'rnn',
            rejectionReason: 'stale',
            selectedScreenKey: 'uikit',
          },
        },
      ],
      [
        'onTabSelectionRejected',
        {
          nativeEvent: {
            provenance: 4,
            rejectedBaseProvenance: 4,
            rejectedScreenKey: 'uikit',
            rejectionReason: 'repeated',
            selectedScreenKey: 'uikit',
          },
        },
      ],
    ]);
  });

  it('keeps the first tab content selected when the host receives state before screens mount', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    const makeFrame = (width = 320, height = 640, y = 0) => ({
      origin: { x: 0, y },
      size: { width, height },
    });
    const makeView = () => ({
      addSubview: jest.fn((view: any) => {
        view.superview = tabController.view;
      }),
      bringSubviewToFront: jest.fn(),
      bounds: makeFrame(),
      frame: makeFrame(),
      insertSubviewBelowSubview: jest.fn(),
      layer: {},
      setNeedsLayout: jest.fn(),
      layoutIfNeeded: jest.fn(),
    });
    const screenController: any = { view: makeView() };
    const stagingMountView: any = {
      ...makeView(),
      tag: 83912041,
    };
    screenController.view.superview = stagingMountView;
    const tabController: any = {
      view: makeView(),
      tabBar: {
        ...makeView(),
        frame: makeFrame(320, 83, 557),
      },
      selectedViewController: undefined,
      setViewControllersAnimated: jest.fn((controllers: unknown[]) => {
        tabController.viewControllers = controllers;
      }),
      viewControllers: [],
    };
    Object.defineProperty(tabController, 'selectedViewController', {
      configurable: true,
      get() {
        return tabController.__selectedViewController;
      },
      set(controller: unknown) {
        tabController.__selectedViewController = controller;
        tabController.selectedIndex =
          tabController.viewControllers?.indexOf(controller) ?? -1;
      },
    });
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
      UIColor: {
        systemBackgroundColor: '#fff',
      },
      UITabBarController: {
        alloc: () => ({
          init: () => tabController,
        }),
      },
      UITabBarItem: {
        alloc: () => ({
          init: () => ({
            accessibilityLabel: undefined,
            image: null,
            selectedImage: null,
            tag: 0,
            title: undefined,
          }),
          initWithTabBarSystemItemTag: (_systemItem: unknown, tag: number) => ({
            accessibilityLabel: undefined,
            image: null,
            selectedImage: null,
            tag,
            title: undefined,
          }),
          initWithTitleImageTag: (
            title: string,
            image: unknown,
            tag: number,
          ) => ({
            accessibilityLabel: undefined,
            image,
            selectedImage: null,
            tag,
            title,
          }),
        }),
      },
      UIView: {
        alloc: () => ({
          init: () => makeView(),
        }),
      },
      UIViewController: {
        alloc: () => ({
          init: () => screenController,
        }),
      },
    };

    jest.requireActual('./NativeScriptTabs.ios');

    const definitions = NativeScriptRuntime.__getDefinitions();
    const hostDefinition = definitions.find(
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSTabsHostIOS.NativeScript',
    );
    const screenDefinition = definitions.find(
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSTabsScreenIOS.NativeScript',
    );
    const hostController = hostDefinition.createController({
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

    hostDefinition.update(
      hostController,
      {
        hostId: 'test-host',
        navStateRequest: {
          baseProvenance: 0,
          selectedScreenKey: 'index',
        },
      },
      {},
      {
        emit: (eventName: string, payload: unknown) => {
          emitted.push([eventName, payload]);
        },
      },
    );

    const createdScreenController = screenDefinition.createController({
      __nativeScriptTabsIndex: 0,
      hostId: 'test-host',
      screenKey: 'index',
      title: 'UIKit',
    });
    screenDefinition.mounted(
      createdScreenController,
      {
        __nativeScriptTabsIndex: 0,
        hostId: 'test-host',
        screenKey: 'index',
        title: 'UIKit',
      },
      {
        emit: jest.fn(),
      },
    );

    expect(tabController.setViewControllersAnimated).toHaveBeenCalledWith(
      [screenController],
      false,
    );
    expect(tabController.selectedIndex).toBe(0);
    expect(tabController.selectedViewController).toBe(screenController);
    expect(tabController.view.addSubview).toHaveBeenCalledWith(
      screenController.view,
    );
    expect(emitted).toEqual([
      [
        'onTabSelected',
        {
          nativeEvent: {
            actionOrigin: 'programmatic-js',
            hasTriggeredSpecialEffect: false,
            isRepeated: false,
            provenance: 0,
            selectedScreenKey: 'index',
          },
        },
      ],
    ]);
  });

  it('selects a tab from the window recognizer using converted tab bar coordinates', () => {
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
      insertSubviewBelowSubview: jest.fn(),
      layer: {},
      setNeedsLayout: jest.fn(),
      layoutIfNeeded: jest.fn(),
    });
    const firstController: any = { view: makeView() };
    const secondController: any = { view: makeView() };
    const contentView: any = makeView();
    const tabBarHost: any = makeView();
    const windowHost: any = makeView();
    firstController.view.superview = contentView;
    const tabController: any = {
      view: makeView(),
      tabBar: {
        ...makeView(),
        bounds: makeFrame(320, 83),
        convertPointFromView: jest.fn((point: { x: number; y: number }) => ({
          x: point.x,
          y: point.y - 560,
        })),
        frame: makeFrame(320, 83, 557),
        items: [{ title: 'UIKit' }, { title: 'React Nav' }],
        superview: tabBarHost,
        window: windowHost,
      },
      selectedViewController: firstController,
      viewControllers: [firstController, secondController],
    };
    Object.defineProperty(tabController, 'selectedViewController', {
      configurable: true,
      get() {
        return tabController.__selectedViewController;
      },
      set(controller: unknown) {
        tabController.__selectedViewController = controller;
        tabController.selectedIndex =
          tabController.viewControllers?.indexOf(controller) ?? -1;
      },
    });
    tabController.selectedViewController = firstController;
    const tapRecognizer: any = {
      cancelsTouchesInView: true,
      delaysTouchesBegan: true,
      delaysTouchesEnded: true,
      numberOfTapsRequired: 0,
    };
    const emitted: [string, unknown][] = [];
    let tapAction: ((gesture: unknown) => void) | undefined;
    let tapDelegate: any;

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
        nativeObject: unknown,
        _protocol: unknown,
        implementation: unknown,
      ) => {
        if (nativeObject === tapRecognizer) {
          tapDelegate = implementation;
        }
        return implementation;
      },
      emit: (eventName: string, payload: unknown) => {
        emitted.push([eventName, payload]);
      },
      gestureAction: (
        _gesture: unknown,
        action: (gesture: unknown) => void,
      ) => {
        tapAction = action;
      },
      hostId: 'test-host',
      observe: jest.fn(),
    });

    (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry = {
      hosts: {
        'test-host': {
          controller,
          navigationStateInitialized: true,
          provenance: 4,
          screens: [
            { controller: firstController, index: 0, screenKey: 'uikit' },
            { controller: secondController, index: 1, screenKey: 'rnn' },
          ],
          selectedScreenKey: 'uikit',
        },
      },
    };

    expect(windowHost.addGestureRecognizer).toHaveBeenCalledWith(tapRecognizer);
    expect(tapRecognizer.delegate).toBe(tapDelegate);
    expect(tabBarHost.addGestureRecognizer).not.toHaveBeenCalledWith(
      tapRecognizer,
    );
    expect(tabController.view.addGestureRecognizer).not.toHaveBeenCalledWith(
      tapRecognizer,
    );
    expect(tabController.tabBar.addGestureRecognizer).not.toHaveBeenCalledWith(
      tapRecognizer,
    );
    expect(
      tapDelegate.gestureRecognizerShouldBegin({
        locationInView: (view: unknown) =>
          view === windowHost ? { x: 240, y: 580 } : { x: 240, y: 20 },
      }),
    ).toBe(true);
    expect(tabController.tabBar.convertPointFromView).toHaveBeenCalledWith(
      { x: 240, y: 580 },
      windowHost,
    );
    expect(
      tapDelegate.gestureRecognizerShouldReceiveTouch(tapRecognizer, {
        locationInView: (view: unknown) =>
          view === windowHost ? { x: 240, y: 580 } : { x: 240, y: 20 },
      }),
    ).toBe(true);
    expect(
      tapDelegate.gestureRecognizerShouldBegin({
        locationInView: (view: unknown) =>
          view === windowHost ? { x: 240, y: 500 } : { x: 240, y: -40 },
      }),
    ).toBe(false);

    tapAction?.({
      locationInView: (view: unknown) =>
        view === windowHost ? { x: 240, y: 580 } : { x: 240, y: 20 },
      state: 3,
    });

    expect(tabController.selectedIndex).toBe(1);
    expect(tabController.selectedViewController).toBe(secondController);
    expect(contentView.addSubview).toHaveBeenCalledWith(secondController.view);
    expect(contentView.bringSubviewToFront).toHaveBeenCalledWith(
      secondController.view,
    );
    expect(secondController.view.hidden).toBe(false);
    expect(secondController.view.userInteractionEnabled).toBe(true);
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

    const equalWindowHost: any = {
      ...makeView(),
      isEqual: (other: unknown) => other === windowHost,
      removeGestureRecognizer: jest.fn(),
    };
    windowHost.isEqual = (other: unknown) => other === equalWindowHost;
    windowHost.removeGestureRecognizer = jest.fn();
    windowHost.addGestureRecognizer.mockClear();
    tabController.tabBar.window = equalWindowHost;

    controller.__rnsNativeScriptInstallTabBarTapRecognizer();

    expect(windowHost.removeGestureRecognizer).not.toHaveBeenCalled();
    expect(windowHost.addGestureRecognizer).not.toHaveBeenCalled();
    expect(equalWindowHost.addGestureRecognizer).not.toHaveBeenCalled();
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
      traitOverrides: {},
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
      UITraitEnvironmentLayoutDirection: {
        LeftToRight: 11,
        RightToLeft: 22,
        Unspecified: 0,
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
      layoutDirection: 'rtl',
      observe: jest.fn(),
      tabBarControllerMode: 'tabBar',
      tabBarMinimizeBehavior: 'never',
    });

    expect(tabController.mode).toBe(11);
    expect(tabController.tabBarMinimizeBehavior).toBe(33);
    expect(tabController.traitOverrides.layoutDirection).toBe(22);

    hostDefinition.update(
      controller,
      {
        hostId: 'test-host',
        layoutDirection: 'ltr',
        navStateRequest: {
          baseProvenance: 0,
          selectedScreenKey: 'index',
        },
      },
      {},
      { emit: jest.fn() },
    );

    expect(tabController.traitOverrides.layoutDirection).toBe(11);
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

  it('documents bounded first-paint tab host commit retries', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.resolve(__dirname, './NativeScriptTabs.ios.tsx'),
      'utf8',
    );

    expect(source).toContain(
      'NATIVESCRIPT_PORT_DEVIATION: upstream native tabs commit from one ObjC',
    );
    expect(source).toContain('setTimeout(runTabsHostCommit, 0, hostId, token)');
    expect(source).toContain(
      'setTimeout(runTabsHostCommit, 16, hostId, token)',
    );
    expect(source).toContain(
      'setTimeout(runTabsHostCommit, 64, hostId, token)',
    );
    expect(source).toContain(
      'finite first-paint settle, not a tab bar restore',
    );
    expect(source).not.toContain('setInterval');
  });

  it('documents every current mechanical deviation from upstream native tabs behavior', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.resolve(__dirname, './NativeScriptTabs.ios.tsx'),
      'utf8',
    );
    const expectedDeviationReasons = [
      'upstream stores an\n  // RNSTabsScreenEventEmitter on the component view',
      'upstream RNSTabsBottomAccessoryShadowStateProxy\n  // writes the UITabAccessory native wrapper frame',
      'upstream RNSTabsHostComponentView keeps\n  // RNSTabsScreen views in Fabric',
      'upstream tab selection and child mounting\n  // happen inside the same native view hierarchy',
      'upstream native tabs commit from one ObjC\n    // view hierarchy',
    ];

    expect(source.match(/NATIVESCRIPT_PORT_DEVIATION:/g) ?? []).toHaveLength(
      expectedDeviationReasons.length,
    );

    for (const reason of expectedDeviationReasons) {
      expect(source).toContain(`NATIVESCRIPT_PORT_DEVIATION: ${reason}`);
    }
  });
});
