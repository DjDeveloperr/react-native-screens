import fs from 'fs';
import path from 'path';

const stackSource = fs.readFileSync(
  path.resolve(__dirname, './NativeScriptGammaStack.ios.tsx'),
  'utf8',
);
const stackHostSource = fs.readFileSync(
  path.resolve(__dirname, '../host/StackHost.ios.tsx'),
  'utf8',
);
const stackScreenSource = fs.readFileSync(
  path.resolve(__dirname, '../screen/StackScreen.ios.tsx'),
  'utf8',
);
const stackHeaderConfigSource = fs.readFileSync(
  path.resolve(__dirname, '../header/StackHeaderConfig.ios.tsx'),
  'utf8',
);
const stackHeaderItemSource = fs.readFileSync(
  path.resolve(__dirname, '../header/ios/StackHeaderItem.ios.tsx'),
  'utf8',
);
const stackHeaderItemSpacerSource = fs.readFileSync(
  path.resolve(__dirname, '../header/ios/StackHeaderItemSpacer.ios.tsx'),
  'utf8',
);

function makeFrame(width = 320, height = 640) {
  return {
    origin: { x: 0, y: 0 },
    size: { width, height },
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
  view.removeFromSuperview = jest.fn(() => {
    const superview = view.superview;
    if (superview?.children) {
      const index = superview.children.indexOf(view);
      if (index >= 0) {
        superview.children.splice(index, 1);
      }
    }
    view.superview = null;
  });
  return view;
}

function makeNavigationItem() {
  const navigationItem: any = {
    setLeftBarButtonItemsAnimated: jest.fn((items: unknown[]) => {
      navigationItem.leftBarButtonItems = items;
    }),
    setRightBarButtonItemsAnimated: jest.fn((items: unknown[]) => {
      navigationItem.rightBarButtonItems = items;
    }),
  };
  return navigationItem;
}

function makeController() {
  const controller: any = {
    navigationItem: makeNavigationItem(),
    super: {
      didMoveToParentViewController: jest.fn(),
      viewDidAppear: jest.fn(),
      viewDidDisappear: jest.fn(),
      viewWillAppear: jest.fn(),
      viewWillDisappear: jest.fn(),
    },
    view: makeView(),
  };
  return controller;
}

describe('NativeScript gamma Stack port', () => {
  beforeEach(() => {
    jest.resetModules();
    (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
    (global as Record<string, unknown>).__rnsNativeScriptGammaStackRegistry =
      undefined;
    (
      global as Record<string, unknown>
    ).__rnsGammaStackNavigationControllerNativeScriptClass = undefined;
    (
      global as Record<string, unknown>
    ).__rnsGammaStackScreenControllerNativeScriptClass = undefined;
    (global as Record<string, unknown>).NativeClass = undefined;
  });

  it('routes the gamma StackHost and StackScreen iOS surfaces through NativeScript', () => {
    expect(stackHostSource).toContain(
      "import { NativeScriptGammaStackHost } from '../native-script/NativeScriptGammaStack.ios'",
    );
    expect(stackHostSource).toContain(
      'export default NativeScriptGammaStackHost',
    );
    expect(stackScreenSource).toContain(
      "import { NativeScriptGammaStackScreen } from '../native-script/NativeScriptGammaStack.ios'",
    );
    expect(stackScreenSource).toContain(
      'export default NativeScriptGammaStackScreen',
    );
    expect(stackHeaderConfigSource).toContain(
      "import { NativeScriptGammaStackHeaderConfig } from '../native-script/NativeScriptGammaStack.ios'",
    );
    expect(stackHeaderConfigSource).toContain(
      'export default NativeScriptGammaStackHeaderConfig',
    );
    expect(stackHeaderItemSource).toContain(
      "import { NativeScriptGammaStackHeaderItem } from '../../native-script/NativeScriptGammaStack.ios'",
    );
    expect(stackHeaderItemSource).toContain(
      'export default NativeScriptGammaStackHeaderItem',
    );
    expect(stackHeaderItemSpacerSource).toContain(
      "import { NativeScriptGammaStackHeaderItemSpacer } from '../../native-script/NativeScriptGammaStack.ios'",
    );
    expect(stackHeaderItemSpacerSource).toContain(
      'export default NativeScriptGammaStackHeaderItemSpacer',
    );
  });

  it('ports the gamma UIKit stack host/screen lifecycle and documents the scheduling deviation', () => {
    expect(stackSource).toContain("debugName: 'RNSStackHost.NativeScript'");
    expect(stackSource).toContain("debugName: 'RNSStackScreen.NativeScript'");
    expect(stackSource).toContain(
      "debugName: 'RNSStackHeaderConfigIOS.NativeScript'",
    );
    expect(stackSource).toContain(
      "debugName: 'RNSStackHeaderItemIOS.NativeScript'",
    );
    expect(stackSource).toContain(
      "debugName: 'RNSStackHeaderItemSpacerIOS.NativeScript'",
    );
    expect(stackSource).toContain("nativeValue('UINavigationController')");
    expect(stackSource).toContain("nativeValue('UIViewController')");
    expect(stackSource).toContain("nativeValue('UIBarButtonItem')");
    expect(stackSource).toContain('navigationBar.prefersLargeTitles = true');
    expect(stackSource).toContain(
      'pushViewControllerAnimated(record.controller, true)',
    );
    expect(stackSource).toContain('popViewControllerAnimated(true)');
    expect(stackSource).toContain("'viewWillAppear:'");
    expect(stackSource).toContain("'viewDidAppear:'");
    expect(stackSource).toContain("'viewWillDisappear:'");
    expect(stackSource).toContain("'viewDidDisappear:'");
    expect(stackSource).toContain("'didMoveToParentViewController:'");
    expect(stackSource).toContain(
      'Direct port of RNSStackScreenController.didMoveToParentViewController',
    );
    expect(stackSource).toContain(
      'NATIVESCRIPT_PORT_DEVIATION: upstream executes the queued operations',
    );
    expect(stackSource).toContain(
      'NATIVESCRIPT_PORT_DEVIATION: upstream RNSStackHeaderConfig keeps',
    );
    expect(stackSource).toContain(
      'Direct port of RNSStackNavigationItemCoordinator.applyToController',
    );
    expect(stackSource).not.toContain('NativeStackView');
    expect(stackSource).not.toContain('requireNativeComponent');
  });

  it('queues attached screens as animated UIKit pushes and detached top screens as animated UIKit pops', () => {
    jest.useFakeTimers();

    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    const controllers: any[] = [];
    const navigationController: any = {
      navigationBar: {},
      pushViewControllerAnimated: jest.fn(
        (controller: any, animated: boolean) => {
          navigationController.viewControllers.push(controller);
          navigationController.topViewController = controller;
          controller.parentViewController = navigationController;
          controller.viewWillAppear?.(animated);
          controller.viewDidAppear?.(animated);
        },
      ),
      popViewControllerAnimated: jest.fn((animated: boolean) => {
        const popped = navigationController.viewControllers.pop();
        navigationController.topViewController =
          navigationController.viewControllers[
            navigationController.viewControllers.length - 1
          ];
        popped?.viewWillDisappear?.(animated);
        popped?.viewDidDisappear?.(animated);
        popped?.didMoveToParentViewController?.(null);
        return popped;
      }),
      topViewController: null,
      view: makeView(),
      viewControllers: [],
    };

    const UINavigationController = function UINavigationController() {};
    Object.assign(UINavigationController, {
      alloc: () => ({
        init: () => navigationController,
      }),
      extend: () => ({
        alloc: () => ({
          init: () => navigationController,
        }),
      }),
    });
    const UIViewController = function UIViewController() {};
    Object.assign(UIViewController, {
      extend: (methods: Record<string, unknown>) => ({
        alloc: () => ({
          init: () => {
            const controller = makeController();
            Object.defineProperties(
              controller,
              Object.getOwnPropertyDescriptors(methods),
            );
            controllers.push(controller);
            return controller;
          },
        }),
      }),
    });

    (global as Record<string, unknown>).NativeClass = jest.fn();
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      NSArray: {
        arrayWithArray: (items: unknown[]) => items,
      },
      UIColor: {
        systemBackgroundColor: 'systemBackground',
      },
      UINavigationController,
      UIView: {
        alloc: () => ({
          init: () => makeView(),
        }),
      },
      UIViewController,
    };

    jest.requireActual('./NativeScriptGammaStack.ios');

    const definitions = NativeScriptRuntime.__getDefinitions();
    const hostDefinition = definitions.find(
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSStackHost.NativeScript',
    );
    const screenDefinition = definitions.find(
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSStackScreen.NativeScript',
    );
    const eventLog: [string, unknown][] = [];
    const eventContext = {
      emit: (eventName: string, payload: unknown) => {
        eventLog.push([eventName, payload]);
      },
    };

    const hostController = hostDefinition.createController();
    hostDefinition.mounted(hostController, { hostId: 'host' });

    const firstController = screenDefinition.createController({
      activityMode: 'attached',
      hostId: 'host',
      screenKey: 'first',
    });
    screenDefinition.mounted(
      firstController,
      {
        __nativeScriptGammaStackIndex: 0,
        activityMode: 'attached',
        hostId: 'host',
        screenKey: 'first',
      },
      eventContext,
    );

    const secondController = screenDefinition.createController({
      activityMode: 'attached',
      hostId: 'host',
      screenKey: 'second',
    });
    screenDefinition.mounted(
      secondController,
      {
        __nativeScriptGammaStackIndex: 1,
        activityMode: 'attached',
        hostId: 'host',
        screenKey: 'second',
      },
      eventContext,
    );

    expect(
      navigationController.pushViewControllerAnimated,
    ).toHaveBeenCalledTimes(2);
    expect(
      navigationController.pushViewControllerAnimated,
    ).toHaveBeenNthCalledWith(1, firstController, true);
    expect(
      navigationController.pushViewControllerAnimated,
    ).toHaveBeenNthCalledWith(2, secondController, true);
    expect(navigationController.viewControllers).toEqual([
      firstController,
      secondController,
    ]);

    screenDefinition.update(
      secondController,
      {
        __nativeScriptGammaStackIndex: 1,
        activityMode: 'detached',
        hostId: 'host',
        screenKey: 'second',
      },
      {
        __nativeScriptGammaStackIndex: 1,
        activityMode: 'attached',
        hostId: 'host',
        screenKey: 'second',
      },
      eventContext,
    );

    expect(navigationController.popViewControllerAnimated).toHaveBeenCalledWith(
      true,
    );
    expect(navigationController.viewControllers).toEqual([firstController]);
    expect(eventLog).toContainEqual([
      'onDismiss',
      {
        nativeEvent: {
          isNativeDismiss: false,
        },
      },
    ]);

    jest.runOnlyPendingTimers();
    expect(
      navigationController.pushViewControllerAnimated,
    ).toHaveBeenCalledTimes(2);
    expect(
      navigationController.popViewControllerAnimated,
    ).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it('applies gamma header configs to UINavigationItem through NativeScript UIKit objects', () => {
    jest.useFakeTimers();

    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    const controllers: any[] = [];
    const navigationController: any = {
      navigationBar: {},
      pushViewControllerAnimated: jest.fn(
        (controller: any, animated: boolean) => {
          navigationController.viewControllers.push(controller);
          navigationController.topViewController = controller;
          controller.navigationController = navigationController;
          controller.parentViewController = navigationController;
          controller.viewWillAppear?.(animated);
          controller.viewDidAppear?.(animated);
        },
      ),
      setNavigationBarHiddenAnimated: jest.fn(
        (hidden: boolean, _animated: boolean) => {
          navigationController.navigationBarHidden = hidden;
          navigationController.navigationBar.hidden = hidden;
        },
      ),
      topViewController: null,
      view: makeView(),
      viewControllers: [],
    };

    const UINavigationController = function UINavigationController() {};
    Object.assign(UINavigationController, {
      alloc: () => ({
        init: () => navigationController,
      }),
      extend: () => ({
        alloc: () => ({
          init: () => navigationController,
        }),
      }),
    });
    const UIViewController = function UIViewController() {};
    Object.assign(UIViewController, {
      extend: (methods: Record<string, unknown>) => ({
        alloc: () => ({
          init: () => {
            const controller = makeController();
            Object.defineProperties(
              controller,
              Object.getOwnPropertyDescriptors(methods),
            );
            controllers.push(controller);
            return controller;
          },
        }),
      }),
    });

    (global as Record<string, unknown>).NativeClass = jest.fn();
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      NSArray: {
        arrayWithArray: (items: unknown[]) => items,
      },
      UIBarButtonItem: {
        alloc: () => ({
          init: () => ({}),
          initWithCustomView: (customView: unknown) => ({ customView }),
          initWithTitleStyleTargetAction: (
            title: string,
            style: number,
            target: unknown,
            action: unknown,
          ) => ({ action, style, target, title }),
        }),
        fixedSpaceItemOfWidth: (width: number) => ({
          kind: 'fixed-space',
          width,
        }),
        flexibleSpaceItem: () => ({
          kind: 'flexible-space',
        }),
      },
      UIBarButtonItemStyle: {
        Plain: 0,
      },
      UIColor: {
        clearColor: 'clear',
        systemBackgroundColor: 'systemBackground',
      },
      UINavigationController,
      UINavigationItemLargeTitleDisplayMode: {
        Always: 1,
        Never: 2,
      },
      UIView: {
        alloc: () => ({
          init: () => makeView(),
        }),
      },
      UIViewController,
    };

    jest.requireActual('./NativeScriptGammaStack.ios');

    const definitions = NativeScriptRuntime.__getDefinitions();
    const hostDefinition = definitions.find(
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSStackHost.NativeScript',
    );
    const screenDefinition = definitions.find(
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSStackScreen.NativeScript',
    );
    const headerDefinition = definitions.find(
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSStackHeaderConfigIOS.NativeScript',
    );
    const itemDefinition = definitions.find(
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSStackHeaderItemIOS.NativeScript',
    );
    const spacerDefinition = definitions.find(
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSStackHeaderItemSpacerIOS.NativeScript',
    );

    const hostController = hostDefinition.createController();
    hostDefinition.mounted(hostController, { hostId: 'host' });

    const screenController = screenDefinition.createController({
      activityMode: 'attached',
      hostId: 'host',
      screenKey: 'first',
    });
    screenDefinition.mounted(
      screenController,
      {
        __nativeScriptGammaStackIndex: 0,
        activityMode: 'attached',
        hostId: 'host',
        screenKey: 'first',
      },
      { emit: jest.fn() },
    );
    expect(
      navigationController.pushViewControllerAnimated,
    ).toHaveBeenCalledWith(screenController, true);
    expect(screenController.navigationController).toBe(navigationController);

    const headerView = headerDefinition.create();
    const headerProps = {
      configId: 'header',
      hidden: false,
      hostId: 'host',
      largeSubtitle: 'Large detail',
      largeTitle: 'Large',
      largeTitleEnabled: true,
      screenKey: 'first',
      subtitle: 'Detail',
      title: 'Root',
    };
    headerDefinition.mounted(headerView, headerProps);

    const leadingItemView = itemDefinition.create();
    itemDefinition.mounted(leadingItemView, {
      configId: 'header',
      hasCustomView: false,
      itemId: 'leading',
      label: 'Edit',
      order: 0,
      placement: 'leading',
    });

    const titleItemView = itemDefinition.create();
    itemDefinition.mounted(titleItemView, {
      configId: 'header',
      hasCustomView: true,
      itemId: 'title',
      order: 1,
      placement: 'title',
    });

    const trailingSpacerView = spacerDefinition.create();
    spacerDefinition.mounted(trailingSpacerView, {
      configId: 'header',
      itemId: 'trailing-space',
      order: 2,
      placement: 'trailing',
      sizing: 'flexible',
    });

    jest.runOnlyPendingTimers();

    expect(screenController.navigationItem.title).toBe('Root');
    expect(screenController.navigationItem.subtitle).toBe('Detail');
    expect(screenController.navigationItem.largeTitle).toBe('Large');
    expect(screenController.navigationItem.largeSubtitle).toBe('Large detail');
    expect(screenController.navigationItem.largeTitleDisplayMode).toBe(1);
    expect(screenController.navigationItem.leftItemsSupplementBackButton).toBe(
      true,
    );
    expect(
      screenController.navigationItem.setLeftBarButtonItemsAnimated,
    ).toHaveBeenCalledWith(
      [
        {
          action: null,
          style: 0,
          target: null,
          title: 'Edit',
        },
      ],
      true,
    );
    expect(
      screenController.navigationItem.setRightBarButtonItemsAnimated,
    ).toHaveBeenCalledWith(
      [
        {
          kind: 'flexible-space',
        },
      ],
      true,
    );
    expect(
      screenController.navigationItem.titleView.__rnsGammaStackHeaderItemView,
    ).toBe(titleItemView.rootView);
    expect(
      navigationController.setNavigationBarHiddenAnimated,
    ).toHaveBeenLastCalledWith(false, true);

    headerDefinition.update(headerView, {
      ...headerProps,
      hidden: true,
      largeTitleEnabled: false,
      title: '',
    });
    jest.runOnlyPendingTimers();

    expect(screenController.navigationItem.title).toBeNull();
    expect(screenController.navigationItem.largeTitleDisplayMode).toBe(2);
    expect(
      navigationController.setNavigationBarHiddenAnimated,
    ).toHaveBeenLastCalledWith(true, true);

    headerDefinition.dispose(headerView, headerProps);
    jest.runOnlyPendingTimers();

    expect(screenController.navigationItem.title).toBeNull();
    expect(
      navigationController.setNavigationBarHiddenAnimated,
    ).toHaveBeenLastCalledWith(false, true);
    jest.useRealTimers();
  });
});
