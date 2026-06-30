/* eslint-disable @typescript-eslint/no-var-requires */
describe('NativeScriptTabsHost', () => {
  beforeEach(() => {
    jest.resetModules();
    (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry =
      undefined;
    delete (global as Record<string, unknown>).NativeClass;
    delete (global as Record<string, unknown>)
      .__RNSTabsHostNativeScriptControllerClass;
    delete (global as Record<string, unknown>)
      .__RNSTabsScreenNativeScriptViewClass;
    delete (global as Record<string, unknown>)
      .__RNSTabsScreenNativeScriptControllerClass;
    delete (global as Record<string, unknown>)
      .__RNSTabsBottomAccessoryNativeScriptViewClass;
    delete (global as Record<string, unknown>)
      .__RNSTabsBottomAccessoryContentNativeScriptViewClass;
  });

  const assignDelegate = (
    object: unknown,
    _protocol: unknown,
    implementation: unknown,
    options?: { assignTo?: { object?: unknown; property?: string } },
  ) => {
    const target = options?.assignTo?.object ?? object;
    const property = options?.assignTo?.property ?? 'delegate';
    if (target && typeof target === 'object') {
      (target as Record<string, unknown>)[property] = implementation;
    }
    return implementation;
  };

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
    expect(source).toContain('disableUIKitHostWindowAttachRefresh');
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

  it('attaches the UITabBarController host while leaving tab screens UIKit-owned', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.resolve(__dirname, './NativeScriptTabs.ios.tsx'),
      'utf8',
    );
    const hostRenderSource = source.slice(
      source.indexOf('<TabsRuntimeContext.Provider'),
      source.indexOf('export function NativeScriptTabsBottomAccessory'),
    );
    const screenRenderSource = source.slice(
      source.indexOf('export function NativeScriptTabsScreen'),
      source.indexOf('const styles = StyleSheet.create'),
    );

    expect(hostRenderSource).toContain('collectChildren');
    expect(hostRenderSource).toContain('immediateTransactionCommit');
    expect(hostRenderSource).toContain('disableUIKitHostWindowAttachRefresh');
    expect(hostRenderSource).toContain('pinNativeViewToHost');
    expect(hostRenderSource).toContain('{...hostControllerProps}');
    expect(source).toContain('RNSTabsHostNativeScriptController');
    expect(source).toContain('function tabsHostControllerClass');
    expect(source).toContain(
      'setSelectedViewController(selectedViewController',
    );
    expect(source).toContain('setSelectedIndex(selectedIndex');
    expect(source).toContain('function markTabsHostControllerSetterPolicy');
    expect(source).toContain('function tabsHostControllerMethodPolicies');
    expect(source).toContain('NativeScriptRuntime.nativeMethodPolicy');
    expect(source).toContain('callSuperBeforeCallback: true');
    expect(source).toContain('skipCallbackIfAssociatedObjectTruthy');
    expect(source).toContain(
      'methodPolicies: tabsHostControllerMethodPolicies()',
    );
    expect(source).toContain('function setTabsHandlingExplicitSelection');
    expect(source).toContain('ctx.delegate(');
    expect(source).toContain('delegateProtocol');
    expect(source).toContain('fabricOrderedTabScreens');
    expect(source).toContain('(ctx as any)?.fabricTransaction?.children');
    expect(source).toContain('refresh(controller: any');
    expect(source).toContain('assignTo: {');
    expect(source).toContain("property: 'delegate'");
    expect(source).toContain('__rnsNativeScriptTabsHostRecord');
    expect(source).toContain(
      'const directRecord = controller.__rnsNativeScriptTabsScreenRecord',
    );
    expect(source).toContain(
      'function reconcileTabsNavigationStateWithUIKitState',
    );
    expect(source).not.toContain(
      "ctx.observe(\n      controller,\n      'selectedViewController'",
    );
    expect(source).not.toContain("ctx.observe(controller, 'selectedIndex'");
    expect(screenRenderSource).toContain('attachController');
    expect(screenRenderSource).toContain('attachControllerToParent={false}');
    expect(screenRenderSource).toContain('attachControllerView={false}');
    expect(screenRenderSource).toContain('attachNativeView={false}');
    expect(screenRenderSource).toContain('disableDetachedChildrenTouchHandler');
    expect(screenRenderSource).toContain('immediateTransactionCommit');
    expect(screenRenderSource).toContain('disableUIKitHostWindowAttachRefresh');
    expect(screenRenderSource).toContain('externalDetachedChildrenOwner');
    expect(screenRenderSource).toContain('preserveDetachedChildrenLayout');
    expect(screenRenderSource).not.toContain('detachControllerFromParent');
  });

  it('does not emit transient selected-tab lifecycle churn during UIKit attachment', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.resolve(__dirname, './NativeScriptTabs.ios.tsx'),
      'utf8',
    );
    const lifecycleSource = source.slice(
      source.indexOf('function selectedTabControllerForTabsScreenController'),
      source.indexOf('function embeddedNavigationControllerRecordOnView'),
    );

    expect(lifecycleSource).toContain(
      'function shouldSkipTabsScreenLifecycleEvent',
    );
    expect(lifecycleSource).toContain(
      'function tabsScreenLifecycleRecordForController',
    );
    expect(lifecycleSource).toContain(
      'const host =\n' +
        '    tabController?.__rnsNativeScriptTabsHostRecord ??',
    );
    expect(lifecycleSource).toContain(
      "const key = '__rnsNativeScriptTabsRegistry';",
    );
    expect(lifecycleSource).toContain(
      'registry?.hostControllerHandles?.[tabControllerHandle]',
    );
    expect(lifecycleSource).toContain(
      'hostId ? registry?.hosts?.[hostId] : null',
    );
    expect(lifecycleSource).toContain(
      'const screens = host?.registeredScreens ?? host?.screens ?? [];',
    );
    expect(lifecycleSource).toContain(
      'screen?.controllerHandle ?? nativeObjectStableHandle(screen?.controller)',
    );
    expect(lifecycleSource).toContain(
      'const screenRecord = tabsScreenLifecycleRecordForController(controller);',
    );
    expect(lifecycleSource).toContain(
      "eventName === 'onWillDisappear' &&",
    );
    expect(lifecycleSource).toContain(
      "!nativeControllerBool(controller, 'isMovingFromParentViewController')",
    );
    expect(lifecycleSource).toContain(
      "eventName === 'onWillAppear' &&",
    );
    expect(lifecycleSource).toContain(
      "lastLifecycleEvent === 'onWillAppear'",
    );
    expect(lifecycleSource).toContain(
      "'tabs-screen-lifecycle-skip-transient-selected'",
    );
    expect(lifecycleSource).toContain(
      'screen=${screenRecord?.screenKey ?? \'\'}',
    );
    expect(
      lifecycleSource.indexOf('shouldSkipTabsScreenLifecycleEvent'),
    ).toBeLessThan(lifecycleSource.indexOf("'tabs-screen-lifecycle-emit'"));
    expect(lifecycleSource).toContain(
      'controller.__rnsNativeScriptTabsLastLifecycleEvent = eventName;',
    );
  });

  it('uses visible descendants after selected-tab reveal as live proof', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.resolve(__dirname, './NativeScriptTabs.ios.tsx'),
      'utf8',
    );
    const reconcileSource = source.slice(
      source.indexOf('function reconcileSelectedTabControllerView'),
      source.indexOf('function reconcileSelectedTabControllerNow'),
    );

    expect(reconcileSource).toContain(
      'const afterRevealFastContentCounts =\n' +
        '      selectedTabAttachedContentCounts(selectedView);',
    );
    expect(reconcileSource).toContain(
      'afterRevealFastContentCounts.visible > 0 &&\n' +
        '      afterRevealFastContentCounts.interactive > 0',
    );
    expect(reconcileSource).toContain(
      'selectedView.__rnsNativeScriptSelectedTabHasVisibleContent = true;',
    );
    expect(reconcileSource).toContain(
      'setLastSelectedTabFastReconcileKey(selectedView, fastReconcileKey);',
    );
    const afterRevealProofIndex = reconcileSource.indexOf(
      'const canSkipAfterReveal =',
    );
    expect(
      reconcileSource.indexOf(
        'setLastSelectedTabFastReconcileKey(selectedView, fastReconcileKey);',
      ),
    ).toBeLessThan(afterRevealProofIndex);
  });

  it('does not duplicate tab bar item/layout refresh work in one commit', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.resolve(__dirname, './NativeScriptTabs.ios.tsx'),
      'utf8',
    );
    const finishCommitSource = source.slice(
      source.indexOf('function finishTabControllerCommit'),
      source.indexOf('function applySelectedTabController'),
    );

    expect(
      finishCommitSource.match(
        /refreshVisibleTabBarItems\(tabController, orderedScreens\)/g,
      ) ?? [],
    ).toHaveLength(1);
    expect(
      finishCommitSource.match(/refreshTabBarItemLayout\(tabController\)/g) ??
        [],
    ).toHaveLength(1);
    expect(finishCommitSource).toContain(
      'options?.reconcileSelectedController === false',
    );
    expect(finishCommitSource).toContain(
      'reconcileSelectedTabControllerView(tabController);',
    );
  });

  it('commits the tabs host when tab screens register after the host transaction', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.resolve(__dirname, './NativeScriptTabs.ios.tsx'),
      'utf8',
    );
    const screenLifecycleSource = source.slice(
      source.indexOf('const TabsScreenController'),
      source.indexOf('const TabsBottomAccessoryController'),
    );

    expect(source).toContain('function commitTabsHostAfterScreenRegistration');
    expect(source).toContain('function tabsScreenRecordKey');
    expect(source).toContain('function tabsHostCommitModelKey');
    expect(source.indexOf('function tabsScreenRecordKey')).toBeLessThan(
      source.indexOf('function tabsHostCommitModelKey'),
    );
    expect(source).toContain('function tabControllerViewControllersMatch');
    expect(source).toContain('commitTabsHost-skip-current');
    expect(source).toContain('const hadCommittedTabsModel');
    expect(source).toContain('const selectedControllerAfterCommit');
    expect(source).toContain('const didApplyRequest = requestApplied === true;');
    expect(source).toContain(
      'const selectedCommitAlreadyHasCurrentContent =',
    );
    expect(source).not.toContain('function markJustReconciledUIKitSelection');
    expect(source).not.toContain('function reconcileSelectedTabAfterUIKitSelection');
    expect(source).not.toContain('const didJustReconcileUIKitSelection =');
    expect(source).not.toContain('const justReconciledUIKitSelectionKey =');
    expect(source).not.toContain(
      'TABS_JUST_RECONCILED_UIKIT_SELECTION_KEY_ASSOCIATION_KEY',
    );
    expect(source).toContain('commitTabsHost-skip-native-current');
    expect(source).toContain('const shouldReconcileSelectedController');
    expect(source).toContain('!hadCommittedTabsModel ||');
    expect(source).toContain(
      '(didApplyRequest && !selectedCommitAlreadyHasCurrentContent)',
    );
    expect(source).toContain(
      '!selectedTabViewAllowsCommitSkip(',
    );
    const selectedTabCommitSkipSource = source.slice(
      source.indexOf('function selectedTabViewAllowsCommitSkip'),
      source.indexOf('function refreshSelectedTabHostedTouchHandlers'),
    );
    expect(selectedTabCommitSkipSource).not.toContain(
      'selectedView?.window == null',
    );
    expect(selectedTabCommitSkipSource).toContain(
      'selectedTabHasPreparedVisibleContentProof(',
    );
    expect(source).toContain(
      'reconcileSelectedController: shouldReconcileSelectedController',
    );
    const commitKeySource = source.slice(
      source.indexOf('function tabsHostCommitModelKey'),
      source.indexOf('function tabsNavigationStatePayload'),
    );
    expect(commitKeySource).toContain(
      'for (let index = 0; index < orderedScreens.length; index += 1)',
    );
    expect(commitKeySource).toContain(
      'for (let index = 0; index < controllers.length; index += 1)',
    );
    expect(commitKeySource).not.toContain('.map(');
    expect(commitKeySource).not.toContain('.join(');
    expect(commitKeySource).not.toContain('String(');
    const screenRecordKeySource = source.slice(
      source.indexOf('function tabsScreenRecordKey'),
      source.indexOf('function tabsHostCommitModelKey'),
    );
    expect(screenRecordKeySource).not.toContain('.join(');
    expect(screenRecordKeySource).not.toContain('NSTABS_DIAG');
    expect(screenRecordKeySource).not.toContain('screen?.');
    const stableHandleSource = source.slice(
      source.indexOf('function nativeObjectStableHandle'),
      source.indexOf('function associatedObjectForKey'),
    );
    const nativeObjectsEqualSource = source.slice(
      source.indexOf('function nativeObjectsEqual'),
      source.indexOf('function associatedObjectForKey'),
    );
    expect(stableHandleSource).toContain("typeof handleOf === 'function'");
    expect(stableHandleSource).not.toContain('handleof?.(');
    expect(stableHandleSource).not.toContain('String(object');
    expect(nativeObjectsEqualSource).toContain(
      'const leftHandle = nativeObjectStableHandle(left);',
    );
    expect(nativeObjectsEqualSource).toContain('leftHandle === rightHandle');
    expect(nativeObjectsEqualSource).toContain('leftHash === rightHash');
    expect(source).toContain(
      'The TS UIKit host can see the host commit\n' +
        '  // before child screen lifecycle worklets populate `host.screens`',
    );
    expect(screenLifecycleSource).toContain(
      'const didChange = upsertTabsScreenRecord(host, controller, props);\n' +
        '    if (didChange || !host.controller?.viewControllers) {\n' +
        '      commitTabsHostAfterScreenRegistration(host, ctx);\n' +
        '    }',
    );
  });

  it('guards bridged native array access before objectAtIndex', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.resolve(__dirname, './NativeScriptTabs.ios.tsx'),
      'utf8',
    );
    const arrayItemSource = source.slice(
      source.indexOf('function arrayItem'),
      source.indexOf('function isNativeScrollView'),
    );

    expect(arrayItemSource).toContain("typeof array.count === 'number'");
    expect(arrayItemSource).not.toContain('array.count()');
    expect(arrayItemSource).toContain('index < 0 || index >= count');
    expect(arrayItemSource.indexOf('index >= count')).toBeLessThan(
      arrayItemSource.indexOf('array.objectAtIndex(index)'),
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
      delegate: assignDelegate,
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
    expect(source).toContain('providerSafeAreaInsets');
    expect(source).toContain('didMoveToWindow()');
    expect(source).toContain('layoutSubviews()');
    expect(source).toContain('layoutSubviews: {\n      params: [],');
    expect(source).toContain('safeAreaInsetsDidChange');
    expect(source).toContain('RNSSafeAreaDidChange');
    expect(source).toContain('RECONCILE_SELECTED_TAB_CONTROLLER_VIEW_KEY');
    expect(source).toContain('PUBLISH_SELECTED_TAB_ACCESSIBILITY_KEY');
    expect(source).toContain('__rnsNativeScriptTabsController');
    expect(source).toContain('__rnsNativeScriptTabsSelectedController');
    const didMoveToWindowSource = source.slice(
      source.indexOf('didMoveToWindow()'),
      source.indexOf('layoutSubviews()'),
    );
    expect(didMoveToWindowSource).toContain(
      'ensureSelectedTabChildNavigationControllerContainment',
    );
    expect(
      didMoveToWindowSource.indexOf(
        'ensureSelectedTabChildNavigationControllerContainment',
      ),
    ).toBeLessThan(
      didMoveToWindowSource.indexOf('postSafeAreaDidChangeNotification(this)'),
    );
    expect(didMoveToWindowSource).toContain(
      'reconcileSelectedTabScreenViewAfterWindowAttach(this);',
    );
    expect(source).toContain(
      'function reconcileSelectedTabScreenViewAfterWindowAttach',
    );
    expect(source).toContain('RECONCILE_SELECTED_TAB_CONTROLLER_VIEW_KEY');
    expect(source).toContain('tabsScreenView-window-selected-reconcile');
    expect(source).toContain(
      'tabsScreenView-window-selected-touch-refresh',
    );
    expect(source).toContain(
      'function notifySelectedTabAccessibilityLayoutChanged',
    );
    expect(source).toContain(
      'function publishSelectedTabAccessibilityElements',
    );
    expect(source).toContain(
      'function clearPublishedSelectedTabAccessibilityElements',
    );
    expect(source).not.toContain(
      'function refreshPublishedSelectedTabAccessibilityElements',
    );
    expect(source).not.toContain(
      'function publishSelectedTabAccessibilityShellElements',
    );
    expect(source).toContain(
      'function revealAccessibilityElementsForSelectedTabView',
    );
    expect(source).toContain('function accessibilityElementHasContent');
    expect(
      source.indexOf('function publishSelectedTabAccessibilityElements'),
    ).toBeLessThan(
      source.indexOf('function finishTabsExplicitSelectionUpdate'),
    );
    expect(
      source.indexOf('function revealAccessibilityElementsForSelectedTabView'),
    ).toBeLessThan(
      source.indexOf('function finishTabsExplicitSelectionUpdate'),
    );
    const finishStart = source.indexOf(
      'function finishTabsExplicitSelectionUpdate',
    );
    const finishExplicitSelectionSource = source.slice(
      finishStart,
      source.indexOf('function notifySelectedTabAccessibilityLayoutChanged'),
    );
    expect(finishExplicitSelectionSource).toContain(
      'const resolvedSelectedController =\n' +
        '    selectedController ?? tabController?.selectedViewController;',
    );
    expect(finishExplicitSelectionSource).toContain(
      'const selectedView = tabsScreenControllerView(resolvedSelectedController);',
    );
    expect(finishExplicitSelectionSource).toContain(
      'RECONCILE_SELECTED_TAB_CONTROLLER_VIEW_KEY',
    );
    expect(
      finishExplicitSelectionSource.indexOf('callTabsWorkletFunction('),
    ).toBeLessThan(
      finishExplicitSelectionSource.indexOf(
        'publishSelectedTabAccessibilityElements(',
      ),
    );
    expect(finishExplicitSelectionSource).toContain(
      'publishSelectedTabAccessibilityElements(',
    );
    expect(finishExplicitSelectionSource).toContain(
      'clearPublishedSelectedTabAccessibilityElements(tabController);',
    );
    expect(
      finishExplicitSelectionSource.indexOf(
        'publishSelectedTabAccessibilityElements',
      ),
    ).toBeLessThan(
      finishExplicitSelectionSource.indexOf(
        'setTabsSelectionObservationSuppressed',
      ),
    );
    const clearAccessibilitySource = source.slice(
      source.indexOf('function clearPublishedSelectedTabAccessibilityElements'),
      source.indexOf('function finishTabsExplicitSelectionUpdate'),
    );
    expect(clearAccessibilitySource).toContain(
      'tabView.accessibilityElements = null;',
    );
    const publishAccessibilitySource = source.slice(
      source.indexOf('function publishSelectedTabAccessibilityElements'),
      source.indexOf('function finishTabsExplicitSelectionUpdate'),
    );
    expect(publishAccessibilitySource).toContain(
      'tabView.accessibilityElements = null;',
    );
    expect(publishAccessibilitySource).not.toContain(
      'tabView.accessibilityElements = nativeArrayFromArray(elements);',
    );
    expect(publishAccessibilitySource).toContain(
      'const activeScreenView = selectedTabActiveScreenView(',
    );
    expect(publishAccessibilitySource).toContain(
      'revealAccessibilityElementsForSelectedTabView(selectedView);',
    );
    expect(publishAccessibilitySource).toContain(
      'revealAccessibilityElementsForSelectedTabView(activeScreenView);',
    );
    expect(publishAccessibilitySource).toContain(
      'const didAppendActiveScreenElements = appendViewAccessibilityElements(',
    );
    expect(publishAccessibilitySource).toContain(
      'const didAppendSelectedViewElements =',
    );
    expect(publishAccessibilitySource).toContain(
      'appendViewAccessibilityElements(elements, selectedView)',
    );
    expect(publishAccessibilitySource).toContain(
      'pushAccessibilityElementIfVisible(elements, tabBar);',
    );
    expect(
      publishAccessibilitySource.indexOf(
        'const didAppendActiveScreenElements = appendViewAccessibilityElements(',
      ),
    ).toBeLessThan(
      publishAccessibilitySource.indexOf(
        'const didAppendSelectedViewElements =',
      ),
    );
    expect(
      publishAccessibilitySource.indexOf(
        'const didAppendSelectedViewElements =',
      ),
    ).toBeLessThan(
      publishAccessibilitySource.indexOf(
        'pushAccessibilityElementIfVisible(elements, tabBar);',
      ),
    );
    expect(
      publishAccessibilitySource.indexOf(
        'revealAccessibilityElementsForSelectedTabView(selectedView);',
      ),
    ).toBeLessThan(
      publishAccessibilitySource.indexOf(
        'const didAppendActiveScreenElements = appendViewAccessibilityElements(',
      ),
    );
    expect(
      publishAccessibilitySource.indexOf(
        'revealAccessibilityElementsForSelectedTabView(activeScreenView);',
      ),
    ).toBeLessThan(
      publishAccessibilitySource.indexOf(
        'const didAppendActiveScreenElements = appendViewAccessibilityElements(',
      ),
    );
    const appendAccessibilitySource = source.slice(
      source.indexOf('function appendViewAccessibilityElements'),
      source.indexOf('function selectedTabTopViewController'),
    );
    expect(appendAccessibilitySource).toContain('depth > 24');
    expect(appendAccessibilitySource).toContain(
      'accessibilityElementHasContent(view)',
    );
    expect(appendAccessibilitySource).toContain('const subviews = view.subviews');
    expect(appendAccessibilitySource).toContain(
      'appendViewAccessibilityElements(\n' +
        '        elements,\n' +
        '        arrayItem(subviews, index),\n' +
        '        depth + 1,\n' +
        '      )',
    );
    expect(source).toMatch(
      /tabsScreenView-window-selected-touch-refresh[\s\S]*notifySelectedTabAccessibilityLayoutChanged\(\s*tabController,\s*selectedController,\s*view,\s*\);\s*return;/,
    );
    expect(source).toMatch(
      /markSelectedTabLiveAfterPreparedWindowAttach\([\s\S]*notifySelectedTabAccessibilityLayoutChanged\(\s*tabController,\s*selectedController,\s*view,\s*\);\s*return;/,
    );
    expect(source).toContain(
      '__rnsNativeScriptTabsNeedsPostSelectionTouchRefresh',
    );
    const didAddSubviewSource = source.slice(
      source.indexOf('function tabsScreenViewDidAddSubview'),
      source.indexOf('function firstSubviewHandle'),
    );
    expect(didAddSubviewSource).toContain(
      'overrideTabsScreenScrollViewBehaviorInFirstDescendantChainIfNeeded(view)',
    );
    expect(didAddSubviewSource).not.toContain(
      'RECONCILE_SELECTED_TAB_CONTROLLER_VIEW_KEY',
    );
    expect(didAddSubviewSource).not.toContain('callTabsWorkletFunction(');
    const layoutSubviewsSource = source.slice(
      source.indexOf('layoutSubviews()'),
      source.indexOf(
        'shouldOverrideScrollViewContentInsetAdjustmentBehavior()',
      ),
    );
    expect(layoutSubviewsSource).toContain('this.super?.layoutSubviews?.();');
    expect(layoutSubviewsSource).not.toContain(
      'ensureSelectedTabChildNavigationControllerContainment(',
    );
    expect(layoutSubviewsSource).not.toContain(
      '__rnsNativeScriptTabsSelectedController',
    );
    expect(layoutSubviewsSource).not.toContain(
      'reconcileSelectedTabControllerView(',
    );
    expect(source.indexOf('function removeControllerFromParent')).toBeLessThan(
      source.indexOf('function reconcileSelectedTabControllerView'),
    );
    const removeParentSource = source.slice(
      source.indexOf('function removeControllerFromParent'),
      source.indexOf(
        'export const __nativeScriptRemoveControllerFromParentForTests',
      ),
    );
    expect(removeParentSource).toContain(
      'const expectedParentControllers = expectedParent?.viewControllers;',
    );
    expect(removeParentSource).toContain(
      'nativeObjectsEqual(expectedController, controller)',
    );
    expect(removeParentSource).toContain(
      'const parentHandle = nativeObjectStableHandle(parent);',
    );
    expect(removeParentSource).toContain(
      'parentHandle === expectedParentHandle',
    );
    expect(
      removeParentSource.indexOf('parentViewControllerForController'),
    ).toBeLessThan(removeParentSource.indexOf('expectedParentControllers'));
    const reconcileSource = source.slice(
      source.indexOf('function reconcileSelectedTabControllerView'),
      source.indexOf('function refreshVisibleTabBarItems'),
    );
    expect(reconcileSource).toContain(
      'removeControllerFromParent(selectedController, tabController);',
    );
    expect(reconcileSource).toContain(
      'ensureSelectedTabChildNavigationControllerContainment(',
    );
    expect(reconcileSource).toContain(
      'const navigationController = containment?.navigationController;',
    );
    expect(reconcileSource).toContain('containment?.embedded');
    expect(source).toContain('function disableUnselectedTabControllerViews');
    expect(source).not.toContain(
      'function prepareTabControllerForNativeSelection',
    );
    expect(source).toContain('view.accessibilityElementsHidden = true;');
    const disableUnselectedSource = source.slice(
      source.indexOf('function disableUnselectedTabControllerViews'),
      source.indexOf('function revealSelectedTabControllerViewForUIKitSelection'),
    );
    expect(disableUnselectedSource).toContain(
      'const selectedView = tabsScreenControllerView(selectedController);',
    );
    expect(disableUnselectedSource).toContain(
      'view === selectedView || nativeObjectsEqual(view, selectedView)',
    );
    expect(reconcileSource).toContain(
      'disableUnselectedTabControllerViews(tabController, selectedController);',
    );
    expect(
      reconcileSource.indexOf('disableUnselectedTabControllerViews'),
    ).toBeLessThan(reconcileSource.indexOf('normalizeSelectedTabHostedView'));
    expect(reconcileSource).toContain('normalizeSelectedTabHostedView');
    expect(
      (
        source.match(
          /viewClassName === 'NativeScriptDetachedChildrenTouchSentinel'/g,
        ) ?? []
      ).length,
    ).toBeGreaterThanOrEqual(2);
    expect(source).toContain('attachDetachedChildrenTouchHandlerIfNeeded');
    expect(source).toContain('updateDetachedChildrenTouchHandlerOrigin');
    const refreshSelectedTabHostedTouchHandlersSource = source.slice(
      source.indexOf('function refreshSelectedTabHostedTouchHandlers'),
      source.indexOf('function refreshSelectedTabEmbeddedStackTouchSurfaces'),
    );
    expect(refreshSelectedTabHostedTouchHandlersSource).not.toContain(
      'depth + 1',
    );
    expect(refreshSelectedTabHostedTouchHandlersSource).not.toContain(
      'arrayItem(subviews',
    );
    expect(source).toContain('function selectedTabReconcileKey');
    const selectedTabReconcileKeySource = source.slice(
      source.indexOf('function selectedTabReconcileKey'),
      source.indexOf('function lastSelectedTabReconcileKey'),
    );
    expect(selectedTabReconcileKeySource).toContain(
      'embedded?: EmbeddedNavigationControllerRecord | null',
    );
    expect(selectedTabReconcileKeySource).toContain('embedded?.containerView');
    expect(selectedTabReconcileKeySource).toContain(
      'navigationController.__nativeScriptStackContainerView',
    );
    expect(selectedTabReconcileKeySource).toContain('selectedView?.window');
    expect(selectedTabReconcileKeySource).toContain(
      'contentCounts ?? selectedTabAttachedContentCounts(selectedView)',
    );
    expect(selectedTabReconcileKeySource).toContain(
      'String(resolvedContentCounts.visible)',
    );
    expect(selectedTabReconcileKeySource).toContain(
      'String(resolvedContentCounts.interactive)',
    );
    expect(selectedTabReconcileKeySource).not.toContain(
      'navigationView?.window',
    );
    expect(selectedTabReconcileKeySource).not.toContain('stackView?.window');
    expect(selectedTabReconcileKeySource).not.toContain(
      'embeddedNavigationControllerRecordInView(selectedView)',
    );
    const selectedTabEmbeddedNavigationSource = source.slice(
      source.indexOf('function selectedTabEmbeddedNavigationControllerRecord'),
      source.indexOf('function installTabsScreenLifecycleMethodsOnController'),
    );
    expect(source).toContain(
      'function rememberSelectedTabEmbeddedNavigationControllerRecord',
    );
    expect(selectedTabEmbeddedNavigationSource).toContain(
      'childNavigationController.__nativeScriptStackContainerView',
    );
    expect(selectedTabEmbeddedNavigationSource).toContain(
      'childNavigationController.__nativeScriptEmbeddedNavigationView',
    );
    expect(selectedTabEmbeddedNavigationSource).toContain(
      'rememberSelectedTabEmbeddedNavigationControllerRecord(selectedView',
    );
    expect(selectedTabEmbeddedNavigationSource).not.toContain(
      'embeddedNavigationControllerRecordInView(selectedView)',
    );
    expect(source).not.toContain(
      'function embeddedNavigationControllerRecordInView',
    );
    expect(source).toContain(
      'TABS_LAST_SELECTED_RECONCILE_KEY_ASSOCIATION_KEY',
    );
    expect(source).toContain(
      'TABS_LAST_SELECTED_FAST_RECONCILE_KEY_ASSOCIATION_KEY',
    );
    expect(source).toContain(
      'TABS_EMBEDDED_NAVIGATION_LOOKUP_DIRTY_ASSOCIATION_KEY',
    );
    expect(source).toContain(
      'TABS_EMBEDDED_NAVIGATION_NEGATIVE_LOOKUP_KEY_ASSOCIATION_KEY',
    );
    expect(source).toContain(
      'function embeddedNavigationControllerRecordInSubviewTree',
    );
    expect(source).toContain(
      'function selectedTabEmbeddedNavigationLookupKey',
    );
    expect(source).toContain('function selectedTabViewSubviewShapeKey');
    const selectedTabViewSubviewShapeKeySource = source.slice(
      source.indexOf('function selectedTabViewSubviewShapeKey'),
      source.indexOf('function selectedTabEmbeddedNavigationLookupKey'),
    );
    expect(selectedTabViewSubviewShapeKeySource).not.toContain('depth + 1');
    expect(selectedTabViewSubviewShapeKeySource).toContain(
      'nativeObjectStableHandle(\n' +
        '      count > 1',
    );
    expect(selectedTabEmbeddedNavigationSource).toContain(
      'selectedTabEmbeddedNavigationNegativeLookupKeyMatches(',
    );
    expect(selectedTabEmbeddedNavigationSource).toContain(
      'selectedTabEmbeddedNavigationControllerRecord-cache-miss',
    );
    expect(selectedTabEmbeddedNavigationSource).toContain(
      'const shouldSearchDescendants =\n' +
        '    selectedTabEmbeddedNavigationLookupIsDirty(selectedView);',
    );
    expect(selectedTabEmbeddedNavigationSource).not.toContain(
      'selectedView?.__rnsNativeScriptTabsNeedsPostSelectionTouchRefresh === true',
    );
    expect(selectedTabEmbeddedNavigationSource).toContain(
      'if (!shouldSearchDescendants) {\n' +
        '    setSelectedTabEmbeddedNavigationNegativeLookupKey(\n' +
        '      selectedView,\n' +
        '      lookupKey,\n' +
        '    );\n' +
        '    return null;\n' +
        '  }',
    );
    expect(selectedTabEmbeddedNavigationSource).toContain(
      'embeddedNavigationControllerRecordInSubviewTree(selectedView)',
    );
    expect(selectedTabEmbeddedNavigationSource).toContain(
      'clearSelectedTabEmbeddedNavigationLookupDirty(selectedView);',
    );
    expect(selectedTabEmbeddedNavigationSource).toContain(
      'setSelectedTabEmbeddedNavigationNegativeLookupKey(selectedView, lookupKey);',
    );
    const tabsScreenDidAddSubviewSource = source.slice(
      source.indexOf('function tabsScreenViewDidAddSubview'),
      source.indexOf('function tabsScreenViewClass'),
    );
    expect(tabsScreenDidAddSubviewSource).toContain(
      'clearSelectedTabEmbeddedNavigationNegativeLookupKey(view);',
    );
    expect(tabsScreenDidAddSubviewSource).toContain(
      'const embeddedSubviewRecord = embeddedNavigationControllerRecordOnView(subview);',
    );
    expect(tabsScreenDidAddSubviewSource).toContain(
      'rememberSelectedTabEmbeddedNavigationControllerRecord(\n' +
        '      view,\n' +
        '      embeddedSubviewRecord,\n' +
        '    );',
    );
    expect(source).toContain('function lastSelectedTabReconcileKey');
    expect(source).toContain('function setLastSelectedTabReconcileKey');
    expect(source).toContain('function selectedTabFastReconcileKey');
    expect(source).toContain('function selectedTabPreparedFastReconcileKey');
    expect(source).toContain('function lastSelectedTabFastReconcileKey');
    expect(source).toContain(
      'function lastSelectedTabPreparedFastReconcileKey',
    );
    expect(source).toContain('function setLastSelectedTabFastReconcileKey');
    expect(source).toContain(
      'function setLastSelectedTabPreparedFastReconcileKey',
    );
    const fastKeySource = source.slice(
      source.indexOf('function selectedTabFastReconcileKey'),
      source.indexOf('function lastSelectedTabFastReconcileKey'),
    );
    expect(fastKeySource).not.toContain('selectedView?.hidden');
    expect(fastKeySource).not.toContain('accessibilityElementsHidden');
    expect(source).not.toContain(
      'TABS_NO_EMBEDDED_NAVIGATION_LOOKUP_KEY_ASSOCIATION_KEY',
    );
    expect(reconcileSource).toContain(
      'const previousReconcileKey = lastSelectedTabReconcileKey(selectedView);',
    );
    expect(source).toContain(
      'function selectedTabHasCurrentVisibleContentProof',
    );
    expect(source).toContain(
      'function selectedTabHasPreparedVisibleContentProof',
    );
    expect(source).toContain('function selectedTabAttachedContentCounts');
    expect(source).toContain(
      'selectedView.__rnsNativeScriptSelectedTabHasVisibleContent !== true',
    );
    expect(source).toContain(
      'resolvedContentCounts.visible <= 0',
    );
    expect(source).toContain(
      'selectedTabHasCurrentVisibleContentProof(\n' +
        '      tabController,\n' +
        '      selectedController,\n' +
        '      view,',
    );
    expect(reconcileSource).toContain(
      'const fastReconcileKey = selectedTabFastReconcileKey(',
    );
    expect(reconcileSource).toContain(
      'const canSkipFastSelectedTabReconcile =',
    );
    expect(reconcileSource).toContain(
      'reconcileSelectedTabControllerView-fast-skip',
    );
    expect(reconcileSource).toContain(
      'reconcileSelectedTabControllerView-reveal-fast-skip',
    );
    expect(reconcileSource).toMatch(
      /reconcileSelectedTabControllerView-fast-skip[\s\S]*notifySelectedTabAccessibilityLayoutChanged\(\s*tabController,\s*selectedController,\s*selectedView,\s*\);\s*return;/,
    );
    expect(reconcileSource).toMatch(
      /reconcileSelectedTabControllerView-reveal-fast-skip[\s\S]*notifySelectedTabAccessibilityLayoutChanged\(\s*tabController,\s*selectedController,\s*selectedView,\s*\);\s*return;/,
    );
    expect(reconcileSource).toMatch(
      /reconcileSelectedTabControllerView-skip-current[\s\S]*notifySelectedTabAccessibilityLayoutChanged\(\s*tabController,\s*selectedController,\s*selectedView,\s*navigationController,\s*\);\s*return;/,
    );
    expect(source).toContain(
      'function refreshSelectedTabControllerTouchSurfacesForFastPath',
    );
    expect(source).not.toContain(
      'function markSelectedTabNeedsPostSelectionTouchRefresh',
    );
    expect(reconcileSource).toContain(
      'selectedView.__rnsNativeScriptTabsNeedsPostSelectionTouchRefresh === true',
    );
    expect(reconcileSource).toContain(
      'refreshSelectedTabControllerTouchSurfacesForFastPath(\n' +
        '      selectedController,\n' +
        '      selectedView,\n' +
        '      false,\n' +
        '    );',
    );
    expect(reconcileSource).toContain(
      'refreshSelectedTabControllerTouchSurfacesForFastPath(\n' +
        '        selectedController,\n' +
        '        selectedView,\n' +
        '        false,\n' +
        '      );',
    );
    expect(reconcileSource).toContain('const canSkipAfterReveal =');
    expect(
      reconcileSource.indexOf('canSkipFastSelectedTabReconcile'),
    ).toBeLessThan(
      reconcileSource.indexOf(
        'removeControllerFromParent(selectedController, tabController);',
      ),
    );
    expect(
      reconcileSource.indexOf('canSkipAfterReveal'),
    ).toBeLessThan(
      reconcileSource.indexOf(
        'removeControllerFromParent(selectedController, tabController);',
      ),
    );
    expect(reconcileSource).toContain(
      'selectedView.__rnsNativeScriptSelectedTabHasVisibleContent =\n' +
        '    attachedVisibleAfterRefresh > 0 &&\n' +
        '    attachedInteractiveAfterRefresh > 0 &&\n' +
        '    embeddedStackHasStableReadyContent;',
    );
    expect(source).toContain(
      'function selectedTabEmbeddedStackHasStableReadyContent',
    );
    expect(source).toContain('STACK_HAS_STABLE_READY_CONTENT_KEY');
    expect(reconcileSource).toContain(
      'const didRefreshEmbeddedStackContent =',
    );
    expect(reconcileSource).toContain(
      'needsPostSelectionTouchRefresh || !embeddedStackWasStableReadyBeforeRefresh',
    );
    expect(source).toContain(
      'function selectedTabAttachedInteractiveDescendantCount',
    );
    expect(source).toContain('function selectedTabSubviewWindowIsCompatible');
    expect(source).toContain('nativeObjectsEqual(subviewWindow, rootWindow)');
    expect(source).toContain(
      'resolvedContentCounts.interactive <= 0',
    );
    expect(reconcileSource).toContain('setLastSelectedTabReconcileKey(');
    expect(reconcileSource).toContain('setLastSelectedTabFastReconcileKey(');
    expect(reconcileSource).toContain(
      'setLastSelectedTabPreparedFastReconcileKey(',
    );
    expect(reconcileSource).toContain(
      'selectedTabReconcileKey(\n' +
        '      tabController,\n' +
        '      selectedController,\n' +
        '      selectedView,',
    );
    expect(reconcileSource).toContain(
      'reconcileSelectedTabControllerView-skip-current',
    );
    expect(reconcileSource).toContain(
      'if (containment?.didLayoutNavigationController === true) {',
    );
    expect(reconcileSource).toContain(
      'markSelectedTabNavigationControllerNeedsLayout(navigationController);',
    );
    expect(source).not.toContain('LAYOUT_NAVIGATION_STACK_VIEWS_KEY');
    expect(reconcileSource).not.toContain('invalidateUIKitHostReadyOwner');
    expect(reconcileSource).toContain(
      'const didRefreshSelectedHost =\n' +
        '    (!isCurrentReconcileKey || attachedVisibleBeforeRefresh === 0) &&\n' +
        '    refreshTabsScreenHostView(selectedView);',
    );
    expect(reconcileSource).toContain('attachedVisibleAfterRefresh > 0');
    expect(reconcileSource).toContain('didRefreshSelectedHost !== true');
    expect(reconcileSource).toContain(
      'const shouldFlushSelectedTabDisplay =',
    );
    expect(reconcileSource).toContain(
      'didRefreshSelectedHost === true ||',
    );
    expect(reconcileSource).toContain(
      'containment?.didLayoutNavigationController === true ||',
    );
    expect(reconcileSource).toContain(
      'didReconcileEmbeddedStackModel === true ||',
    );
    expect(reconcileSource).toContain('!isCurrentReconcileKey');
    expect(reconcileSource).toContain(
      'if (shouldFlushSelectedTabDisplay) {\n' +
        '    flushSelectedTabDisplay(navigationController?.view);\n' +
        '    flushSelectedTabDisplay(selectedView);\n' +
        '  }',
    );
    const flushSelectedTabDisplaySource = source.slice(
      source.indexOf('function flushSelectedTabDisplay'),
      source.indexOf(
        'function ensureSelectedTabChildNavigationControllerContainment',
      ),
    );
    expect(source).not.toContain(
      'function shouldForwardSelectedTabChildNavigationAppearance',
    );
    expect(flushSelectedTabDisplaySource).toContain('flushUIKitHostView');
    expect(flushSelectedTabDisplaySource).not.toContain(
      'flushUIKitHostViewOwner',
    );
    const containmentSource = source.slice(
      source.indexOf(
        'function ensureSelectedTabChildNavigationControllerContainment',
      ),
      source.indexOf('function tabsScreenViewClass'),
    );
    expect(containmentSource).not.toContain(
      'shouldForwardSelectedTabChildNavigationAppearance(navigationController)',
    );
    expect(containmentSource).not.toContain(
      'navigationController.beginAppearanceTransitionAnimated(true, false);',
    );
    expect(containmentSource).not.toContain(
      'navigationController.endAppearanceTransition();',
    );
    expect(reconcileSource).toContain(
      'notifySelectedTabAccessibilityLayoutChanged(\n' +
        '    tabController,\n' +
        '    selectedController,\n' +
        '    selectedView,\n' +
        '    navigationController,\n' +
        '  );',
    );
    expect(reconcileSource).toContain(
      'function reconcileSelectedTabControllerNow',
    );
    expect(source).toContain('function publishSelectedTabAccessibilityNow');
    expect(source).toContain(
      'PUBLISH_SELECTED_TAB_ACCESSIBILITY_KEY\n' +
        '] = publishSelectedTabAccessibilityNow;',
    );
    expect(reconcileSource).not.toContain('setTimeout(');
    expect(reconcileSource.indexOf('removeControllerFromParent')).toBeLessThan(
      reconcileSource.indexOf(
        'ensureSelectedTabChildNavigationControllerContainment',
      ),
    );
    expect(reconcileSource).not.toContain('attachSelectedTabControllerView');
    expect(reconcileSource).not.toContain('selectedView.frame');
    expect(reconcileSource).not.toContain('keepTabBarVisible');
    expect(source).not.toContain('seedSelectedTabControllerSafeArea');
    expect(source).not.toContain('__rnsNativeScriptTabsInjectedSafeAreaTop');
    expect(
      source.indexOf(
        'function ensureSelectedTabChildNavigationControllerContainment',
      ),
    ).toBeLessThan(source.indexOf('function tabsScreenViewClass'));
    expect(source).toContain(
      'ensureSelectedTabChildNavigationControllerContainment(\n          selectedController,\n          this,\n        );',
    );
    expect(source).not.toContain('function commitSelectedTabControllerDisplay');
    expect(source).not.toContain('function commitUIKitViewDisplay');
    expect(source).not.toContain('layoutIfNeeded');
    expect(source).not.toContain('CATransaction.flush();');
    expect(source).not.toContain('layer.displayIfNeeded');
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

  it('counts selected tab descendants while UIKit is attaching descendant windows', () => {
    const {
      __nativeScriptSelectedTabAttachedInteractiveDescendantCountForTests,
      __nativeScriptSelectedTabAttachedVisibleDescendantCountForTests,
    } = jest.requireActual('./NativeScriptTabs.ios');
    const rootWindow = { hash: 'root-window' };
    const sameNativeWindowProxy = { hash: 'root-window' };
    const otherWindow = { hash: 'other-window' };
    const positiveFrame = {
      origin: { x: 0, y: 0 },
      size: { width: 100, height: 44 },
    };
    const makeSubview = (window: unknown) => ({
      alpha: 1,
      bounds: positiveFrame,
      frame: positiveFrame,
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
      window,
    });
    const selectedView = {
      subviews: [
        makeSubview(null),
        makeSubview(sameNativeWindowProxy),
        makeSubview(otherWindow),
      ],
      window: rootWindow,
    };

    expect(
      __nativeScriptSelectedTabAttachedVisibleDescendantCountForTests(
        selectedView,
      ),
    ).toBe(2);
    expect(
      __nativeScriptSelectedTabAttachedInteractiveDescendantCountForTests(
        selectedView,
      ),
    ).toBe(2);
  });

  it('repairs embedded stack containment under the selected tab screen controller', () => {
    const {
      __nativeScriptEnsureSelectedTabChildNavigationControllerContainmentForTests,
    } = jest.requireActual('./NativeScriptTabs.ios');
    const previousParent = {};
    const navigationController: any = {
      didMoveToParentViewController: jest.fn(),
      parentViewController: previousParent,
      popToRootViewControllerAnimated: jest.fn(),
      removeFromParentViewController: jest.fn(function removeFromParent() {
        navigationController.parentViewController = null;
      }),
      view: {
        setNeedsLayout: jest.fn(),
      },
      willMoveToParentViewController: jest.fn(),
    };
    const stackContainerView = {
      __nativeScriptNavigationController: navigationController,
      subviews: [],
    };
    const selectedView = {
      __nativeScriptNavigationController: navigationController,
      __nativeScriptStackContainerView: stackContainerView,
      subviews: [stackContainerView],
    };
    const selectedController = {
      addChildViewController: jest.fn(),
    };

    const containment =
      __nativeScriptEnsureSelectedTabChildNavigationControllerContainmentForTests(
        selectedController,
        selectedView,
      );
    expect(containment).toMatchObject({
      navigationController,
      didLayoutNavigationController: true,
    });
    expect(containment.embedded.containerView).toBe(stackContainerView);
    expect(containment.embedded.navigationView).toBe(navigationController.view);
    expect(
      navigationController.willMoveToParentViewController,
    ).toHaveBeenCalledWith(null);
    expect(
      navigationController.removeFromParentViewController,
    ).toHaveBeenCalled();
    expect(selectedController.addChildViewController).toHaveBeenCalledWith(
      navigationController,
    );
    expect(
      navigationController.didMoveToParentViewController,
    ).toHaveBeenCalledWith(selectedController);
    expect(
      navigationController.__nativeScriptRootContainedParentViewController,
    ).toBe(selectedController);
    expect(navigationController.view.setNeedsLayout).toHaveBeenCalled();
  });

  it('treats already-contained embedded stack navigation as a no-op', () => {
    const {
      __nativeScriptEnsureSelectedTabChildNavigationControllerContainmentForTests,
    } = jest.requireActual('./NativeScriptTabs.ios');
    const selectedController = {
      addChildViewController: jest.fn(),
    };
    const makeFrame = (width = 320, height = 640) => ({
      origin: { x: 0, y: 0 },
      size: { width, height },
    });
    const navigationView: any = {
      autoresizingMask: 18,
      frame: makeFrame(),
      bounds: makeFrame(),
      setNeedsLayout: jest.fn(),
      subviews: [],
      superview: null,
      userInteractionEnabled: true,
    };
    const navigationController: any = {
      didMoveToParentViewController: jest.fn(),
      parentViewController: selectedController,
      popToRootViewControllerAnimated: jest.fn(),
      removeFromParentViewController: jest.fn(),
      view: navigationView,
      willMoveToParentViewController: jest.fn(),
    };
    const stackContainerView: any = {
      __nativeScriptEmbeddedNavigationView: navigationView,
      __nativeScriptNavigationController: navigationController,
      autoresizingMask: 18,
      frame: makeFrame(),
      bounds: makeFrame(),
      setNeedsLayout: jest.fn(),
      subviews: [navigationView],
      userInteractionEnabled: true,
    };
    navigationView.superview = stackContainerView;
    const selectedView: any = {
      __nativeScriptEmbeddedNavigationView: navigationView,
      __nativeScriptNavigationController: navigationController,
      __nativeScriptStackContainerView: stackContainerView,
      bounds: makeFrame(),
      frame: makeFrame(),
      subviews: [stackContainerView],
    };
    stackContainerView.superview = selectedView;

    const containment =
      __nativeScriptEnsureSelectedTabChildNavigationControllerContainmentForTests(
        selectedController,
        selectedView,
      );
    expect(containment).toMatchObject({
      navigationController,
      didLayoutNavigationController: false,
    });
    expect(containment.embedded.containerView).toBe(stackContainerView);
    expect(containment.embedded.navigationView).toBe(navigationView);
    expect(selectedController.addChildViewController).not.toHaveBeenCalled();
    expect(
      navigationController.willMoveToParentViewController,
    ).not.toHaveBeenCalled();
    expect(
      navigationController.removeFromParentViewController,
    ).not.toHaveBeenCalled();
    expect(
      navigationController.didMoveToParentViewController,
    ).not.toHaveBeenCalled();
    expect(navigationController.view.setNeedsLayout).not.toHaveBeenCalled();
    expect(stackContainerView.setNeedsLayout).not.toHaveBeenCalled();
    expect(
      navigationController.__nativeScriptRootContainedParentViewController,
    ).toBe(selectedController);
  });

  it('lays out already-contained embedded stack navigation before the selected tab view attaches to a window', () => {
    const {
      __nativeScriptEnsureSelectedTabChildNavigationControllerContainmentForTests,
    } = jest.requireActual('./NativeScriptTabs.ios');
    const makeFrame = (width = 0, height = 0) => ({
      origin: { x: 0, y: 0 },
      size: { width, height },
    });
    const selectedController = {
      addChildViewController: jest.fn(),
    };
    const navigationView: any = {
      frame: makeFrame(),
      bounds: makeFrame(),
      setNeedsLayout: jest.fn(),
      subviews: [],
      userInteractionEnabled: false,
    };
    const navigationController: any = {
      didMoveToParentViewController: jest.fn(),
      parentViewController: selectedController,
      popToRootViewControllerAnimated: jest.fn(),
      removeFromParentViewController: jest.fn(),
      view: navigationView,
      willMoveToParentViewController: jest.fn(),
    };
    const stackContainerView: any = {
      __nativeScriptEmbeddedNavigationView: navigationView,
      __nativeScriptNavigationController: navigationController,
      frame: makeFrame(),
      bounds: makeFrame(),
      setNeedsLayout: jest.fn(),
      subviews: [navigationView],
      userInteractionEnabled: false,
    };
    navigationView.superview = stackContainerView;
    const selectedView: any = {
      __nativeScriptEmbeddedNavigationView: navigationView,
      __nativeScriptNavigationController: navigationController,
      __nativeScriptStackContainerView: stackContainerView,
      addSubview: jest.fn((view: any) => {
        view.superview = selectedView;
      }),
      bounds: makeFrame(320, 640),
      frame: makeFrame(320, 640),
      subviews: [stackContainerView],
    };
    stackContainerView.superview = selectedView;

    expect(
      __nativeScriptEnsureSelectedTabChildNavigationControllerContainmentForTests(
        selectedController,
        selectedView,
      ),
    ).toMatchObject({
      navigationController,
      didLayoutNavigationController: true,
    });
    expect(selectedController.addChildViewController).not.toHaveBeenCalled();
    expect(stackContainerView.frame).toEqual(makeFrame(320, 640));
    expect(navigationView.frame).toEqual(makeFrame(320, 640));
    expect(stackContainerView.userInteractionEnabled).toBe(true);
    expect(navigationView.userInteractionEnabled).toBe(true);
    expect(stackContainerView.setNeedsLayout).toHaveBeenCalled();
    expect(navigationView.setNeedsLayout).toHaveBeenCalled();
  });

  it('attaches a visible embedded stack controller without synthesizing appearance', () => {
    const {
      __nativeScriptEnsureSelectedTabChildNavigationControllerContainmentForTests,
    } = jest.requireActual('./NativeScriptTabs.ios');
    const navigationController: any = {
      beginAppearanceTransitionAnimated: jest.fn(),
      didMoveToParentViewController: jest.fn(),
      endAppearanceTransition: jest.fn(),
      parentViewController: null,
      popToRootViewControllerAnimated: jest.fn(),
      view: {
        setNeedsLayout: jest.fn(),
        window: {},
      },
    };
    const selectedView = {
      __nativeScriptNavigationController: navigationController,
      subviews: [
        {
          __nativeScriptNavigationController: navigationController,
          subviews: [],
        },
      ],
    };
    const selectedController = {
      addChildViewController: jest.fn(),
    };

    expect(
      __nativeScriptEnsureSelectedTabChildNavigationControllerContainmentForTests(
        selectedController,
        selectedView,
      ),
    ).toMatchObject({
      navigationController,
      didLayoutNavigationController: true,
    });

    expect(selectedController.addChildViewController).toHaveBeenCalledWith(
      navigationController,
    );
    expect(
      navigationController.didMoveToParentViewController,
    ).toHaveBeenCalledWith(selectedController);
    expect(
      navigationController.beginAppearanceTransitionAnimated,
    ).not.toHaveBeenCalled();
    expect(navigationController.endAppearanceTransition).not.toHaveBeenCalled();
    expect(
      selectedController.addChildViewController.mock.invocationCallOrder[0],
    ).toBeLessThan(
      navigationController.didMoveToParentViewController.mock
        .invocationCallOrder[0],
    );
  });

  it('detaches tab screen controllers from plain wrapper parents before UITabBarController owns them', () => {
    const { __nativeScriptRemoveControllerFromParentForTests } =
      jest.requireActual('./NativeScriptTabs.ios');
    const wrapperParent = {};
    const valueForKey = jest.fn(() => wrapperParent);
    const controller: any = {
      parentViewController: null,
      valueForKey,
      removeFromParentViewController: jest.fn(function removeFromParent() {
        controller.parentViewController = null;
        controller.valueForKey = jest.fn(() => null);
      }),
      view: {
        removeFromSuperview: jest.fn(),
      },
      willMoveToParentViewController: jest.fn(),
    };
    const tabController = {
      viewControllers: [],
    };

    __nativeScriptRemoveControllerFromParentForTests(controller, tabController);

    expect(valueForKey).toHaveBeenCalledWith('parentViewController');
    expect(controller.willMoveToParentViewController).toHaveBeenCalledWith(
      null,
    );
    expect(controller.view.removeFromSuperview).toHaveBeenCalled();
    expect(controller.removeFromParentViewController).toHaveBeenCalled();
  });

  it('keeps tab screen controllers when the parent proxy is the UITabBarController', () => {
    const { __nativeScriptRemoveControllerFromParentForTests } =
      jest.requireActual('./NativeScriptTabs.ios');
    const tabController = {};
    const parentProxy = {
      isEqual: jest.fn(other => other === tabController),
    };
    const controller: any = {
      parentViewController: parentProxy,
      removeFromParentViewController: jest.fn(),
      view: {
        removeFromSuperview: jest.fn(),
      },
      willMoveToParentViewController: jest.fn(),
    };

    __nativeScriptRemoveControllerFromParentForTests(controller, tabController);

    expect(parentProxy.isEqual).toHaveBeenCalledWith(tabController);
    expect(controller.willMoveToParentViewController).not.toHaveBeenCalled();
    expect(controller.view.removeFromSuperview).not.toHaveBeenCalled();
    expect(controller.removeFromParentViewController).not.toHaveBeenCalled();
  });

  it('directly detaches tab screen controllers after old tab model removal', () => {
    const { __nativeScriptRemoveControllerFromParentForTests } =
      jest.requireActual('./NativeScriptTabs.ios');
    const tabController = {};
    const oldParent = {
      setViewControllersAnimated: jest.fn(function removeOldChildren() {
        controller.parentViewController = null;
      }),
      viewControllers: null as unknown,
    };
    const controller: any = {
      parentViewController: oldParent,
      removeFromParentViewController: jest.fn(),
      view: {
        removeFromSuperview: jest.fn(),
      },
      willMoveToParentViewController: jest.fn(),
    };
    oldParent.viewControllers = [controller];

    __nativeScriptRemoveControllerFromParentForTests(controller, tabController);

    expect(oldParent.setViewControllersAnimated).toHaveBeenCalledWith(
      [],
      false,
    );
    expect(controller.willMoveToParentViewController).toHaveBeenCalledWith(
      null,
    );
    expect(controller.view.removeFromSuperview).toHaveBeenCalled();
    expect(controller.removeFromParentViewController).toHaveBeenCalled();
  });

  it('records embedded stack parent through generic associated-object interop', () => {
    const {
      __nativeScriptEnsureSelectedTabChildNavigationControllerContainmentForTests,
    } = jest.requireActual('./NativeScriptTabs.ios');
    const setAssociatedObject = jest.fn();
    const previousInterop = (global as Record<string, unknown>).interop;
    (global as Record<string, unknown>).interop = {
      setAssociatedObject,
    };

    const navigationController: any = {
      didMoveToParentViewController: jest.fn(),
      parentViewController: null,
      popToRootViewControllerAnimated: jest.fn(),
      view: {
        setNeedsLayout: jest.fn(),
      },
    };
    const selectedView = {
      __nativeScriptNavigationController: navigationController,
      subviews: [
        {
          __nativeScriptNavigationController: navigationController,
          subviews: [],
        },
      ],
    };
    const selectedController = {
      addChildViewController: jest.fn(),
    };

    try {
      expect(
        __nativeScriptEnsureSelectedTabChildNavigationControllerContainmentForTests(
          selectedController,
          selectedView,
        ),
      ).toMatchObject({
        navigationController,
        didLayoutNavigationController: true,
      });
    } finally {
      (global as Record<string, unknown>).interop = previousInterop;
    }

    expect(
      setAssociatedObject.mock.calls.map((call: unknown[]) => call[1]),
    ).not.toContain(
      'react-native-screens.NativeScriptTabsNoEmbeddedNavigationLookupKey.NativeScriptHandle',
    );
    expect(
      navigationController.__nativeScriptRootContainedParentViewController,
    ).toBe(selectedController);
  });

  it('preserves an allocated tabs screen view when interop init returns nullish', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    const allocatedTabsView: any = {
      backgroundColor: undefined,
      init: () => undefined,
      initWithFrame: () => allocatedTabsView,
      isKindOfClass: () => false,
      subviews: [],
    };
    const fallbackView = {
      backgroundColor: undefined,
      fallback: true,
      isKindOfClass: () => false,
      subviews: [],
    };
    const controller: any = {
      tabBarItem: undefined,
      title: undefined,
      view: undefined,
    };
    const UIView: any = function UIView() {};
    UIView.alloc = () => ({
      init: () => fallbackView,
    });
    UIView.extend = () => ({
      alloc: () => allocatedTabsView,
    });
    const UIViewController: any = function UIViewController() {};
    UIViewController.alloc = () => ({
      init: () => controller,
    });
    UIViewController.extend = () => UIViewController;

    (global as Record<string, unknown>).NativeClass = undefined;
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIColor: {
        systemBackgroundColor: 'system-background',
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
      UIView,
      UIViewController,
    };

    jest.requireActual('./NativeScriptTabs.ios');
    expect((global as Record<string, unknown>).NativeClass).toBeUndefined();

    const screenDefinition = NativeScriptRuntime.__getDefinitions().find(
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSTabsScreenIOS.NativeScript',
    );

    const created = screenDefinition.createController({
      hostId: 'test-host',
      screenKey: 'index',
      title: 'UIKit',
    });

    expect(created.view).toBe(allocatedTabsView);
    expect(created.__rnsNativeScriptTabsView).toBe(allocatedTabsView);
    expect(created.view.__nativeScriptOwningViewController).toBe(created);
    expect(created.view.backgroundColor).toBe('system-background');
    expect(created.view.fallback).toBeUndefined();
    expect(
      created.view.shouldOverrideScrollViewContentInsetAdjustmentBehavior(),
    ).toBe(true);

    created.view = undefined;
    expect(screenDefinition.childrenView(created)).toBe(allocatedTabsView);

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
      allocatedTabsView.shouldOverrideScrollViewContentInsetAdjustmentBehavior(),
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
    expect(source).not.toContain(
      'function beginTabsScreenChildNavigationAppearance',
    );
    expect(source).not.toContain(
      'function endTabsScreenChildNavigationAppearance',
    );
    expect(source).toContain('attachControllerToParent={false}');
    expect(source).not.toContain('detachControllerFromParent');
    expect(source).toContain('= reconcileSelectedTabControllerNow;');
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
    expect(controllerSource).not.toContain(
      'beginTabsScreenChildNavigationAppearance',
    );
    expect(controllerSource).not.toContain(
      'endTabsScreenChildNavigationAppearance',
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
    const navigationController = {
      beginAppearanceTransitionAnimated: jest.fn(),
      endAppearanceTransition: jest.fn(),
      popToRootViewControllerAnimated: jest.fn(),
      view: {},
    };
    const controller = {
      childViewControllers: [navigationController],
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
    expect(
      navigationController.beginAppearanceTransitionAnimated,
    ).not.toHaveBeenCalled();
    expect(
      navigationController.beginAppearanceTransitionAnimated,
    ).not.toHaveBeenCalled();
    expect(navigationController.endAppearanceTransition).not.toHaveBeenCalled();
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

    expect(applySelectionSource).toContain(
      'tabController.selectedViewController = selectedController',
    );
    expect(applySelectionSource).not.toContain(
      'reconcileSelectedTabControllerView(tabController, selectedController);',
    );
    expect(applySelectionSource).not.toContain(
      'tabController.selectedIndex = selectedIndex',
    );
    const shouldSelectSource = source.slice(
      source.indexOf('tabBarControllerShouldSelectViewController'),
      source.indexOf('tabBarControllerDidSelectViewController'),
    );
    expect(shouldSelectSource).toContain('return true;');
    expect(shouldSelectSource).not.toContain(
      'prepareTabControllerForNativeSelection(',
    );
    expect(shouldSelectSource).not.toContain(
      'ensureSelectedTabChildNavigationControllerContainment(',
    );
    expect(shouldSelectSource).not.toContain('normalizeSelectedTabHostedView');
    expect(shouldSelectSource).not.toContain(
      '_tabController.selectedViewController = selectedController;',
    );
    expect(shouldSelectSource).not.toContain(
      'emitSelection(host, selectedController, false);',
    );
    const didSelectStart = source.indexOf(
      'tabBarControllerDidSelectViewController',
    );
    const didSelectSource = source.slice(
      didSelectStart,
      source.indexOf('return controller;', didSelectStart),
    );
    expect(source).toContain(
      'function invalidateSelectedTabVisibleContentProof',
    );
    expect(source).not.toContain(
      'function reconcileSelectedTabAfterUIKitSelection',
    );
    expect(shouldSelectSource).not.toContain(
      'invalidateSelectedTabVisibleContentProof(selectedController);',
    );
    expect(shouldSelectSource).not.toContain(
      'revealSelectedTabControllerViewForUIKitSelection(selectedController);',
    );
    expect(didSelectSource).not.toContain(
      'reconcileSelectedTabAfterUIKitSelection(\n' +
        '            _tabController,\n' +
        '            selectedController,\n' +
        '            screen.screenKey,\n' +
        '          );',
    );
    expect(didSelectSource).toContain('if (!repeated) {');
    expect(didSelectSource).toContain(
      'markSelectedTabNeedsPostSelectionRepair(selectedController);',
    );
    expect(didSelectSource.indexOf('emitSelection(')).toBeLessThan(
      didSelectSource.indexOf('markSelectedTabNeedsPostSelectionRepair('),
    );
    expect(source).toContain(
      'function markSelectedTabNeedsPostSelectionRepair',
    );
    expect(source).toContain(
      'selectedView.__rnsNativeScriptTabsNeedsPostSelectionTouchRefresh = true;',
    );
    expect(didSelectSource).not.toContain('reconcileSelectedTabControllerView(');
    expect(source).toContain(
      'function reconcileTabsNavigationStateWithUIKitState',
    );
    expect(source).toContain("actionOrigin: 'implicit'");
    expect(source).toContain(
      'finishTabsExplicitSelectionUpdate(_tabController, selectedController)',
    );
    expect(source).toContain(
      'setTabsHandlingExplicitSelection(_tabController, true)',
    );
    expect(source).not.toContain(
      'this.setSelectedViewController(selectedViewController);',
    );
    expect(source).not.toContain('this.setSelectedIndex(selectedIndex);');
    expect(source).not.toContain('emitObservedSelection');
    expect(source).not.toContain("ctx.observe(controller, 'selectedIndex'");
    expect(source).not.toContain('__rnsNativeScriptLayoutNavigationStackViews');
    expect(source).not.toContain('UITapGestureRecognizer');
    expect(source).not.toContain('__rnsNativeScriptTabBarTapRecognizer');
    expect(source).toContain(
      "Direct port of RNSTabBarController's updateSelectedViewControllerTo:",
    );
    expect(source).toContain('function withSuppressedTabsSelectionObservation');
    expect(source).toContain(
      "Direct port of RNSTabBarController.performContainerUpdate's",
    );
    expect(source).toContain(
      'setTabsHandlingExplicitSelection(tabController, true)',
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
    const makeView = (): any => ({
      addSubview: jest.fn(),
      bringSubviewToFront: jest.fn(),
      hidden: true,
      insertSubviewAtIndex: jest.fn(),
      insertSubviewBelowSubview: jest.fn(),
      frame: makeFrame(),
      layer: {},
      setNeedsLayout: jest.fn(),
      layoutIfNeeded: jest.fn(),
      userInteractionEnabled: false,
    });
    const selectedController = { view: { ...makeView(), hidden: false } };
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
      delegate: assignDelegate,
      emit: (eventName: string, payload: unknown) => {
        emitted.push([eventName, payload]);
      },
      hostId: 'test-host',
      observe: jest.fn(),
    });
    const nextSubview = makeView();
    const nextController = {
      view: {
        ...makeView(),
        subviews: [nextSubview],
      },
    };
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

  it('matches tab records when UIKit delegate passes a proxy-distinct controller', () => {
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
    const makeView = (): any => ({
      accessibilityElementsHidden: false,
      addSubview: jest.fn(),
      bounds: makeFrame(),
      bringSubviewToFront: jest.fn(),
      frame: makeFrame(),
      hidden: false,
      insertSubviewAtIndex: jest.fn(),
      insertSubviewBelowSubview: jest.fn(),
      layer: {},
      layoutIfNeeded: jest.fn(),
      setNeedsLayout: jest.fn(),
      subviews: [],
      userInteractionEnabled: true,
    });
    const selectedController = {
      __nativeHandle: 'selected-controller',
      view: makeView(),
    };
    const nextView = makeView();
    const nextControllerRecord = {
      __nativeHandle: 'next-controller',
      view: nextView,
    };
    const nextControllerFromDelegate = {
      __nativeHandle: 'next-controller',
      view: nextView,
    };
    const tabController: any = {
      __nativeHandle: 'tab-controller',
      tabBar: {
        ...makeView(),
        frame: makeFrame(320, 83, 557),
      },
      selectedViewController: selectedController,
      view: makeView(),
      viewControllers: [selectedController, nextControllerRecord],
    };
    const tabControllerFromDelegate: any = {
      __nativeHandle: 'tab-controller',
      selectedViewController: nextControllerFromDelegate,
      tabBar: tabController.tabBar,
      view: tabController.view,
      viewControllers: tabController.viewControllers,
    };
    const emitted: [string, unknown][] = [];
    const nativeHandleForObject = jest.fn(
      (value: { __nativeHandle?: string } | null | undefined) =>
        value?.__nativeHandle,
    );

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
    (NativeScriptRuntime as any).nativeHandleForObject = nativeHandleForObject;
    (NativeScriptRuntime as any).default.nativeHandleForObject =
      nativeHandleForObject;

    try {
      jest.requireActual('./NativeScriptTabs.ios');

      const hostDefinition = NativeScriptRuntime.__getDefinitions().find(
        (definition: { debugName?: string }) =>
          definition.debugName === 'RNSTabsHostIOS.NativeScript',
      );
      const controller = hostDefinition.createController({
        delegate: assignDelegate,
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
            controllerHandle: 'tab-controller',
            navigationStateInitialized: true,
            provenance: 4,
            screens: [
              {
                controller: selectedController,
                controllerHandle: 'selected-controller',
                screenKey: 'uikit',
              },
              {
                controller: nextControllerRecord,
                controllerHandle: 'next-controller',
                screenKey: 'rnn',
              },
            ],
            selectedScreenKey: 'uikit',
          },
        },
        hostControllerHandles: {
          'tab-controller': 'test-host',
        },
      };

      controller.delegate.tabBarControllerDidSelectViewController(
        tabControllerFromDelegate,
        nextControllerFromDelegate,
      );

      expect(nativeHandleForObject).toHaveBeenCalledWith(
        nextControllerFromDelegate,
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
    } finally {
      delete (NativeScriptRuntime as any).nativeHandleForObject;
      delete (NativeScriptRuntime as any).default.nativeHandleForObject;
    }
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
      delegate: assignDelegate,
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
      delegate: assignDelegate,
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

  it('keeps UIKit tab selection on the caller thread and reveals the selected view immediately', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const setTimeoutSpy = jest
      .spyOn(global, 'setTimeout')
      .mockImplementation(() => 0 as any);
    NativeScriptRuntime.__resetDefinitions();
    (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry =
      undefined;

    const makeFrame = (width = 320, height = 640, y = 0) => ({
      origin: { x: 0, y },
      size: { width, height },
    });
    const makeView = (): any => ({
      addSubview: jest.fn(),
      bringSubviewToFront: jest.fn(),
      hidden: true,
      insertSubviewAtIndex: jest.fn(),
      insertSubviewBelowSubview: jest.fn(),
      frame: makeFrame(),
      layer: {},
      setNeedsLayout: jest.fn(),
      layoutIfNeeded: jest.fn(),
      userInteractionEnabled: false,
    });
    const selectedController = { view: { ...makeView(), hidden: false } };
    const nextSubview = makeView();
    const nextController = { view: { ...makeView(), subviews: [nextSubview] } };
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
      delegate: assignDelegate,
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

      expect(setTimeoutSpy).not.toHaveBeenCalled();
      expect(tabController.view.setNeedsLayout).toHaveBeenCalled();
      expect(nextController.view.hidden).toBe(false);
      expect(nextController.view.userInteractionEnabled).toBe(true);
      expect(nextController.view.setNeedsLayout).toHaveBeenCalled();
      expect(
        nextController.view.__rnsNativeScriptTabsNeedsPostSelectionTouchRefresh,
      ).toBeUndefined();
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
    const nextSubview = makeView();
    const nextController = { view: { ...makeView(), subviews: [nextSubview] } };
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
      delegate: assignDelegate,
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

  it('lets UIKit perform explicit tab selection before didSelect emits once', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    const makeFrame = (width = 320, height = 640, y = 0) => ({
      origin: { x: 0, y },
      size: { width, height },
    });
    const makeView = (): any => ({
      addSubview: jest.fn(),
      bringSubviewToFront: jest.fn(),
      hidden: true,
      insertSubviewAtIndex: jest.fn(),
      insertSubviewBelowSubview: jest.fn(),
      frame: makeFrame(),
      layer: {},
      setNeedsLayout: jest.fn(),
      layoutIfNeeded: jest.fn(),
      userInteractionEnabled: false,
    });
    const selectedController = { view: { ...makeView(), hidden: false } };
    const tabController: any = {
      view: makeView(),
      tabBar: {
        ...makeView(),
        frame: makeFrame(320, 83, 557),
      },
      selectedViewController: selectedController,
    };
    const emitted: [string, unknown][] = [];
    const observe = jest.fn();

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
      delegate: assignDelegate,
      emit: (eventName: string, payload: unknown) => {
        emitted.push([eventName, payload]);
      },
      hostId: 'test-host',
      observe,
    });
    const nextSubview = makeView();
    const nextController = { view: { ...makeView(), subviews: [nextSubview] } };
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
    expect(controller.selectedViewController).toBe(selectedController);
    expect(nextController.view.hidden).toBe(false);
    expect(nextController.view.userInteractionEnabled).toBe(true);
    expect(nextController.view.setNeedsLayout).toHaveBeenCalled();
    expect(nextSubview.setNeedsLayout).not.toHaveBeenCalled();
    expect(controller.__rnsNativeScriptIsHandlingExplicitSelectionUpdate).toBe(
      true,
    );
    expect(observe).not.toHaveBeenCalled();
    expect(emitted).toEqual([]);

    controller.selectedViewController = nextController;
    controller.delegate.tabBarControllerDidSelectViewController(
      controller,
      nextController,
    );
    expect(controller.__rnsNativeScriptSuppressSelectionObservation).toBe(
      false,
    );
    expect(controller.__rnsNativeScriptIsHandlingExplicitSelectionUpdate).toBe(
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

  it('suppresses paired UITab and UIViewController didSelect callbacks', () => {
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
      delegate: assignDelegate,
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
            { controller: selectedController, screenKey: 'uikit' },
            { controller: nextController, screenKey: 'rnn' },
          ],
          selectedScreenKey: 'uikit',
        },
      },
    };

    controller.delegate.tabBarControllerDidSelectTabPreviousTab(controller, {
      viewController: nextController,
    });
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
      delegate: assignDelegate,
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
    hostDefinition.transactionCommitted(
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
    const tabControllerCommitCountBeforeRepeatedEcho =
      tabController.setViewControllersAnimated.mock.calls.length;
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
    hostDefinition.transactionCommitted(
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

    expect(tabController.setViewControllersAnimated).toHaveBeenCalledTimes(
      tabControllerCommitCountBeforeRepeatedEcho,
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
      delegate: assignDelegate,
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
    hostDefinition.transactionCommitted(
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

    expect(tabController.setViewControllersAnimated).toHaveBeenCalledWith(
      [screenController],
      false,
    );
    expect(tabController.selectedIndex).toBe(0);
    expect(tabController.selectedViewController).toBe(screenController);
    expect(tabController.view.addSubview).not.toHaveBeenCalledWith(
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

  it('keeps all registered tab controllers when collected native children are partial', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    const makeFrame = (width = 320, height = 640, y = 0) => ({
      origin: { x: 0, y },
      size: { width, height },
    });
    const makeView = () => ({
      accessibilityElementsHidden: false,
      addSubview: jest.fn(),
      bounds: makeFrame(),
      bringSubviewToFront: jest.fn(),
      frame: makeFrame(),
      hidden: false,
      insertSubviewBelowSubview: jest.fn(),
      layer: {},
      layoutIfNeeded: jest.fn(),
      setNeedsLayout: jest.fn(),
      subviews: [],
      userInteractionEnabled: true,
    });
    const firstController: any = {
      tabBarItem: { title: 'stale-first' },
      view: makeView(),
    };
    const secondController: any = {
      tabBarItem: { title: 'stale-second' },
      view: makeView(),
    };
    const tabController: any = {
      tabBar: {
        ...makeView(),
        frame: makeFrame(320, 83, 557),
        items: [{ title: 'UIKit' }, { title: 'React Nav' }],
      },
      selectedViewController: firstController,
      setViewControllersAnimated: jest.fn((controllers: unknown[]) => {
        tabController.viewControllers = controllers;
      }),
      view: makeView(),
      viewControllers: [],
    };
    const collectedFirstChild = {
      __nativeScriptOwningViewController: firstController,
      subviews: [],
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
    (NativeScriptRuntime as any).collectedUIKitHostChildren = jest.fn(() => [
      collectedFirstChild,
    ]);
    (NativeScriptRuntime as any).default.collectedUIKitHostChildren = (
      NativeScriptRuntime as any
    ).collectedUIKitHostChildren;
    (NativeScriptRuntime as any).nativeSubviews = jest.fn(() => []);
    (NativeScriptRuntime as any).default.nativeSubviews = (
      NativeScriptRuntime as any
    ).nativeSubviews;

    try {
      jest.requireActual('./NativeScriptTabs.ios');

      const hostDefinition = NativeScriptRuntime.__getDefinitions().find(
        (definition: { debugName?: string }) =>
          definition.debugName === 'RNSTabsHostIOS.NativeScript',
      );
      const controller = hostDefinition.createController({
        delegate: assignDelegate,
        emit: jest.fn(),
        hostId: 'test-host',
        observe: jest.fn(),
      });
      const host = {
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
      };
      (global as Record<string, unknown>).__rnsNativeScriptTabsRegistry = {
        hosts: {
          'test-host': host,
        },
      };

      hostDefinition.transactionCommitted(controller, {
        hostId: 'test-host',
        navStateRequest: {
          baseProvenance: 0,
          selectedScreenKey: 'index',
        },
      });

      expect(
        (NativeScriptRuntime as any).collectedUIKitHostChildren,
      ).toHaveBeenCalledWith(controller.view);
      expect(tabController.setViewControllersAnimated).toHaveBeenCalledWith(
        [firstController, secondController],
        false,
      );
      expect(tabController.viewControllers).toEqual([
        firstController,
        secondController,
      ]);
      expect(host.screens.map((screen: any) => screen.screenKey)).toEqual([
        'index',
        'react-navigation',
      ]);
      expect(tabController.selectedViewController).toBe(firstController);
    } finally {
      delete (NativeScriptRuntime as any).collectedUIKitHostChildren;
      delete (NativeScriptRuntime as any).default.collectedUIKitHostChildren;
      delete (NativeScriptRuntime as any).nativeSubviews;
      delete (NativeScriptRuntime as any).default.nativeSubviews;
    }
  });

  it('does not install a custom tab bar tap recognizer', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.resolve(__dirname, './NativeScriptTabs.ios.tsx'),
      'utf8',
    );

    expect(source).not.toContain('UITapGestureRecognizer');
    expect(source).not.toContain('__rnsNativeScriptInstallTabBarTapRecognizer');
    expect(source).not.toContain('__rnsNativeScriptTabBarTapRecognizer');
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
      delegate: assignDelegate,
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
    const makeView = (frame = makeFrame()) => ({
      addSubview: jest.fn(),
      bringSubviewToFront: jest.fn(),
      frame,
      layer: {},
      setNeedsLayout: jest.fn(),
      layoutIfNeeded: jest.fn(),
    });
    const tabBarFrame = makeFrame(320, 83, 557);
    const selectedScreenFrame = makeFrame(320, 557, 0);
    const firstController = { view: makeView(selectedScreenFrame) };
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
      delegate: assignDelegate,
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
    expect(firstController.view.frame).toBe(selectedScreenFrame);
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
      delegate: assignDelegate,
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
    hostDefinition.transactionCommitted(controller, {
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

  it('documents Fabric transaction-driven tab host commits', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.resolve(__dirname, './NativeScriptTabs.ios.tsx'),
      'utf8',
    );

    expect(source).toContain('transactionCommitted(');
    expect(source).toContain('refresh(controller: any');
    expect(source).toContain('controller: any');
    expect(source).toContain('commitTabsHost(host, ctx);');
    expect(source).toContain('collectChildren');
    expect(source).toContain('collectedOrderedTabScreens(host)');
    expect(source).toContain('NativeScriptRuntime.collectedUIKitHostChildren');
    expect(source).toContain('refreshTabsScreenHostView(child);');
    expect(source).toContain('uikitHostHandlesForView');
    expect(source).toContain('__rnsNativeScriptTabsScreenRecord');
    expect(source).not.toContain('scheduleTabsHostCommit');
    expect(source).not.toContain('runTabsHostCommit');
    expect(source).not.toContain('setTimeout(runTabsHostCommit');
    expect(source).not.toContain('setTimeout(reconcile');
    expect(source).not.toContain('setInterval');
  });

  it('lets UITabBarController own selected tab content placement', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.resolve(__dirname, './NativeScriptTabs.ios.tsx'),
      'utf8',
    );

    expect(source).toContain('host.controller.setViewControllersAnimated');
    expect(source).toContain('pinNativeViewToHost');
    expect(source).toContain('attachControllerToParent={false}');
    expect(source).not.toContain('function directSubviewContainingDescendant');
    expect(source).not.toContain('insertSubviewBelowSubview');
    expect(source).not.toContain('bringSubviewToFront(tabBar');
    expect(source).not.toContain('tabBarLayerContainer');
  });

  it('does not recursively rewrite React-owned tab content layout', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.resolve(__dirname, './NativeScriptTabs.ios.tsx'),
      'utf8',
    );

    expect(source).not.toContain('layoutSingleHostedSubviewChain');
    expect(source).not.toContain('shouldFillHostedSubview(rootView');
    const helperStart = source.indexOf('function layoutHostedReactSubviews');
    const helperSource = source.slice(
      helperStart,
      source.indexOf('function removeControllerFromParent', helperStart),
    );
    expect(helperSource).not.toContain('subview.frame = rootView.bounds');
    expect(helperSource).not.toContain('layoutIfNeeded');
  });

  it('does not size selected tab children from zero UIKit bounds', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.resolve(__dirname, './NativeScriptTabs.ios.tsx'),
      'utf8',
    );

    const normalizeSource = source.slice(
      source.indexOf('function normalizeSelectedTabHostedView'),
      source.indexOf('function markSelectedTabNavigationControllerNeedsLayout'),
    );
    const reconcileSource = source.slice(
      source.indexOf('function reconcileSelectedTabControllerView'),
      source.indexOf('function reconcileSelectedTabControllerNow'),
    );

    expect(source).toContain('function rectHasPositiveSize');
    expect(normalizeSource).toContain('rectHasPositiveSize(parentBounds)');
    expect(reconcileSource).toContain('const canNormalizeSelectedSubviews');
    expect(reconcileSource).toContain('if (canNormalizeSelectedSubviews)');
  });

  it('keeps tab worklet tracing runtime-gated like the stack port', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.resolve(__dirname, './NativeScriptTabs.ios.tsx'),
      'utf8',
    );

    expect(source).toContain('function shouldTraceTabsWorklets()');
    expect(source).toContain('__NSRNS_TRACE_TABS_WORKLETS === true');
    expect(source).toContain('if (!shouldTraceTabsWorklets())');
  });

  it('keeps native tab selection preflight cheap and reconciles only the selected embedded stack after selection', () => {
    const fs = require('fs');
    const path = require('path');
    const source = fs.readFileSync(
      path.resolve(__dirname, './NativeScriptTabs.ios.tsx'),
      'utf8',
    );
    const reconcileStart = source.indexOf(
      'function reconcileSelectedTabControllerView',
    );
    const reconcileSource = source.slice(
      reconcileStart,
      source.indexOf(
        'function reconcileSelectedTabControllerNow',
        reconcileStart,
      ),
    );
    const shouldSelectSource = source.slice(
      source.indexOf('tabBarControllerShouldSelectViewController'),
      source.indexOf('tabBarControllerDidSelectViewController'),
    );
    const applySelectedSource = source.slice(
      source.indexOf('function applySelectedTabController'),
      source.indexOf('function registeredTabScreens'),
    );
    const touchRefreshSource = source.slice(
      source.indexOf('function refreshSelectedTabEmbeddedStackTouchSurfaces'),
      source.indexOf('function disableUnselectedTabControllerViews'),
    );

    expect(source).toContain('REFRESH_VISIBLE_STACK_TOUCH_SURFACES_KEY');
    expect(source).toContain(
      'REFRESH_VISIBLE_STACK_TOUCH_SURFACES_FOR_HOST_KEY',
    );
    expect(source).toContain(
      'STACK_NAVIGATION_CONTROLLER_RECORD_FOR_HOST_KEY',
    );
    expect(source).toContain('RECONCILE_STACK_FROM_EXTERNAL_HOST_KEY');
    expect(touchRefreshSource).toContain(
      '[\n    REFRESH_VISIBLE_STACK_TOUCH_SURFACES_KEY\n  ]',
    );
    expect(touchRefreshSource).toContain(
      '[REFRESH_VISIBLE_STACK_TOUCH_SURFACES_FOR_HOST_KEY]',
    );
    expect(source).toContain(
      '[STACK_NAVIGATION_CONTROLLER_RECORD_FOR_HOST_KEY]',
    );
    expect(touchRefreshSource).toContain(
      '[\n    RECONCILE_STACK_FROM_EXTERNAL_HOST_KEY\n  ]',
    );
    expect(source).toContain('function callTabsWorkletFunction');
    expect(touchRefreshSource).toContain(
      'callTabsWorkletFunction(\n' +
        '      refreshVisibleStackTouchSurfaces,\n' +
        '      navigationController,\n' +
        '      forceRefresh,\n' +
        '      restoreDescendantInteractivity,\n' +
        '    ) === true',
    );
    expect(touchRefreshSource).toContain(
      'callTabsWorkletFunction(\n' +
        '      reconcileStackFromExternalHost,\n' +
        '      navigationController,\n' +
        '    ) === true',
    );
    expect(touchRefreshSource).not.toContain(
      'refreshVisibleStackTouchSurfaces(navigationController, true)',
    );
    expect(touchRefreshSource).toContain(
      'refreshSelectedTabHostStackTouchSurfaces(selectedView, forceRefresh, true)',
    );
    expect(touchRefreshSource).not.toContain(
      'reconcileStackFromExternalHost(navigationController)',
    );
    expect(touchRefreshSource).not.toContain('layoutNavigationStackViews');
    expect(touchRefreshSource).not.toContain('refreshVisibleStackContent(');
    expect(reconcileSource).not.toContain('refreshVisibleStackContent(');
    expect(shouldSelectSource).not.toContain('refreshVisibleStackContent(');
    expect(shouldSelectSource).not.toContain(
      'ensureSelectedTabChildNavigationControllerContainment(',
    );
    expect(shouldSelectSource).not.toContain('normalizeSelectedTabHostedView');
    expect(shouldSelectSource).not.toContain(
      'invalidateSelectedTabVisibleContentProof',
    );
    expect(source).not.toContain('function reconcileSelectedTabAfterUIKitSelection');
    expect(source).not.toContain(
      'reconcileSelectedTabAfterUIKitSelection-offwindow-defer',
    );
    expect(shouldSelectSource).not.toContain(
      'revealSelectedTabControllerViewForUIKitSelection(selectedController);',
    );
    expect(reconcileSource).toContain(
      'selectedTabHasCurrentVisibleContentProof(',
    );
    expect(source).toContain(
      'selectedTabHasPreparedVisibleContentProof(',
    );
    expect(reconcileSource).toContain(
      'refreshSelectedTabControllerTouchSurfacesForFastPath(',
    );
    expect(applySelectedSource).toContain(
      'applySelectedTabController-skip-current',
    );
    expect(applySelectedSource).toContain(
      'nativeObjectsEqual(\n' +
        '        tabController?.selectedViewController,\n' +
        '        selectedController,',
    );
    expect(
      applySelectedSource.indexOf('nativeObjectsEqual('),
    ).toBeLessThan(
      applySelectedSource.indexOf(
        'invalidateSelectedTabVisibleContentProof(selectedController);',
      ),
    );
    expect(reconcileSource).toContain('const didReconcileEmbeddedStackModel =');
    expect(reconcileSource).toContain(
      'reconcileSelectedTabEmbeddedStackModel(navigationController);',
    );
    expect(reconcileSource).toContain(
      'const didRevealSelectedView =\n' +
        '    revealSelectedTabControllerViewForUIKitSelection(selectedController);',
    );
    expect(reconcileSource).toContain(
      'reconcileSelectedTabControllerView-reveal-fast-skip',
    );
    expect(reconcileSource).toContain('didRevealSelectedView !== true');
    expect(reconcileSource).toContain(
      'reconcileSelectedTabControllerView-reveal-current',
    );
    expect(reconcileSource).toContain('const canSkipCurrentReconcile =');
    const revealCurrentSource = reconcileSource.slice(
      reconcileSource.indexOf(
        'reconcileSelectedTabControllerView-reveal-current',
      ),
      reconcileSource.indexOf(
        'if (didRevealSelectedView !== true && canSkipCurrentReconcile)',
      ),
    );
    expect(revealCurrentSource).not.toContain(
      'refreshSelectedTabEmbeddedStackTouchSurfaces',
    );
    expect(revealCurrentSource).not.toContain('return;');
    const revealFastSkipSource = reconcileSource.slice(
      reconcileSource.indexOf('if (canSkipAfterReveal) {'),
      reconcileSource.indexOf(
        'removeControllerFromParent(selectedController, tabController);',
      ),
    );
    expect(revealFastSkipSource).not.toContain('flushSelectedTabDisplay');
    expect(reconcileSource).toContain('const shouldFlushSelectedTabDisplay =');
    expect(
      reconcileSource.indexOf('const didRevealSelectedView ='),
    ).toBeLessThan(
      reconcileSource.indexOf(
        'reconcileSelectedTabControllerView-skip-current',
      ),
    );
    expect(
      reconcileSource.indexOf('const didReconcileEmbeddedStackModel ='),
    ).toBeLessThan(
      reconcileSource.indexOf(
        'const currentReconcileKey = selectedTabReconcileKey',
      ),
    );
    expect(reconcileSource).toContain(
      'didReconcileEmbeddedStackModel !== true',
    );
    expect(reconcileSource).toContain(
      'const needsPostSelectionTouchRefresh =',
    );
    expect(reconcileSource).toContain(
      'const preflightHostStackRecord =',
    );
    expect(reconcileSource).toContain(
      '!embeddedNavigationControllerRecordOnView(selectedView)',
    );
    expect(reconcileSource).toContain(
      '? selectedTabHostStackNavigationControllerRecord(selectedView)',
    );
    expect(reconcileSource).toContain(
      'const didPreflightHostStackAssociation = !!preflightHostStackRecord;',
    );
    expect(reconcileSource).toContain(
      'const shouldForceSelectedStackTouchRefresh =',
    );
    const forceTouchRefreshSource = reconcileSource.slice(
      reconcileSource.indexOf('const shouldForceSelectedStackTouchRefresh ='),
      reconcileSource.indexOf(
        'const canRefreshSelectedTabEmbeddedStackTouchSurfaces =',
      ),
    );
    expect(forceTouchRefreshSource).not.toContain('!isCurrentReconcileKey');
    expect(reconcileSource).toContain('needsPostSelectionTouchRefresh');
    expect(source).toContain(
      'function selectedTabEmbeddedStackCanRefreshTouchSurfaces',
    );
    expect(source).toContain(
      'function selectedTabHostStackNavigationControllerRecord',
    );
    expect(reconcileSource).toContain(
      'const canRefreshSelectedTabEmbeddedStackTouchSurfaces =',
    );
    expect(reconcileSource).toContain(
      'selectedTabEmbeddedStackCanRefreshTouchSurfaces(navigationController)',
    );
    expect(reconcileSource).toContain(
      'refreshSelectedTabEmbeddedStackTouchSurfaces(\n' +
        '      navigationController,\n' +
        '      shouldForceSelectedStackTouchRefresh,\n' +
        '      true,\n' +
        '    );',
    );
    expect(reconcileSource).toContain(
      'const didRefreshEmbeddedStackTouchSurfaces =',
    );
    expect(reconcileSource).toContain(
      'const shouldSkipSelectedStackTouchRefresh =',
    );
    expect(reconcileSource).toContain(
      '!shouldSkipSelectedStackTouchRefresh &&',
    );
    expect(reconcileSource).toContain(
      '!didRefreshEmbeddedStackTouchSurfaces &&\n' +
        '    !shouldSkipSelectedStackTouchRefresh',
    );
    expect(reconcileSource).toContain(
      'const didRefreshHostStackTouchSurfaces =',
    );
    expect(reconcileSource).toContain(
      'const shouldSkipSelectedHostStackTouchRefresh =',
    );
    expect(reconcileSource).toContain(
      '!shouldSkipSelectedHostStackTouchRefresh &&',
    );
    expect(reconcileSource).toContain(
      '!didPreflightHostStackAssociation &&',
    );
    expect(reconcileSource).toContain(
      'refreshSelectedTabHostStackTouchSurfaces(\n' +
        '      selectedView,\n' +
        '      shouldForceSelectedStackTouchRefresh,\n' +
        '      true,\n' +
        '    );',
    );
    expect(reconcileSource).toContain(
      'clearSelectedTabNeedsPostSelectionTouchRefresh(selectedView);',
    );
    expect(reconcileSource).toContain(
      '(!hasEmbeddedStackNavigationController &&\n' +
        '      !didRefreshHostStackTouchSurfaces) ||',
    );
    expect(reconcileSource).toContain(
      'canRefreshSelectedTabEmbeddedStackTouchSurfaces &&\n' +
        '      !didRefreshEmbeddedStackTouchSurfaces &&\n' +
        '      !didRefreshHostStackTouchSurfaces',
    );
    expect(reconcileSource).toContain(
      ') {\n' +
        '    layoutHostedReactSubviews(selectedController, selectedView);\n' +
        '  }',
    );
    expect(reconcileSource).toContain('embeddedTouch=');
    expect(reconcileSource).toContain('hostTouch=');
    expect(reconcileSource).toContain('embeddedReconcile=');
    expect(shouldSelectSource).not.toContain(
      'refreshSelectedTabEmbeddedStackTouchSurfaces(',
    );
    expect(reconcileSource).toContain(
      'markSelectedTabNavigationControllerNeedsLayout(navigationController);',
    );
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
      'upstream UITabBarController owns child\n  // controller containment in one ObjC hierarchy',
    ];

    expect(source.match(/NATIVESCRIPT_PORT_DEVIATION:/g) ?? []).toHaveLength(
      expectedDeviationReasons.length,
    );

    for (const reason of expectedDeviationReasons) {
      expect(source).toContain(`NATIVESCRIPT_PORT_DEVIATION: ${reason}`);
    }
  });
});
