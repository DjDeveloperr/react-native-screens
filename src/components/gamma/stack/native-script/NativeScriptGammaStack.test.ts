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
  return view;
}

function makeController() {
  const controller: any = {
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
  });

  it('ports the gamma UIKit stack host/screen lifecycle and documents the scheduling deviation', () => {
    expect(stackSource).toContain("debugName: 'RNSStackHost.NativeScript'");
    expect(stackSource).toContain("debugName: 'RNSStackScreen.NativeScript'");
    expect(stackSource).toContain("nativeValue('UINavigationController')");
    expect(stackSource).toContain("nativeValue('UIViewController')");
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
});
