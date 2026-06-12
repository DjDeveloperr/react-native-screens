import fs from 'fs';
import path from 'path';

const safeAreaIOSSource = fs.readFileSync(
  path.resolve(__dirname, './SafeAreaView.ios.tsx'),
  'utf8',
);
const safeAreaDefaultSource = fs.readFileSync(
  path.resolve(__dirname, './SafeAreaView.tsx'),
  'utf8',
);
const stackSource = fs.readFileSync(
  path.resolve(
    __dirname,
    '../native-stack/native-script/NativeScriptScreenStack.ios.tsx',
  ),
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
    layoutSubviews: jest.fn(),
    safeAreaInsets: { bottom: 0, left: 0, right: 0, top: 0 },
    subviews: children,
    super: {
      didMoveToWindow: jest.fn(),
      layoutSubviews: jest.fn(),
    },
    superview: null,
    userInteractionEnabled: false,
  };
  return view;
}

function installMethods(target: any, methods: Record<string, unknown>) {
  Object.defineProperties(target, Object.getOwnPropertyDescriptors(methods));
  return target;
}

describe('NativeScript SafeAreaView port', () => {
  beforeEach(() => {
    jest.resetModules();
    (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
    (global as Record<string, unknown>).__rnsSafeAreaViewNativeScriptClass =
      undefined;
    (global as Record<string, unknown>).__rnsNativeScriptScreenViewClass =
      undefined;
    (global as Record<string, unknown>).NativeClass = undefined;
  });

  it('routes iOS SafeAreaView through NativeScript instead of the previous plain View bypass', () => {
    expect(safeAreaDefaultSource).not.toContain("Platform.OS === 'ios'");
    expect(safeAreaDefaultSource).not.toContain('<View');
    expect(safeAreaIOSSource).toContain(
      'NativeScriptRuntime.defineUIKitContainer',
    );
    expect(safeAreaIOSSource).toContain(
      "debugName: 'RNSSafeAreaView.NativeScript'",
    );
    expect(safeAreaIOSSource).toContain(
      'NativeScript cannot mutate that Fabric C++ shadow state',
    );
    expect(safeAreaIOSSource).toContain('__rnsNativeScriptSafeAreaContentView');
    expect(safeAreaIOSSource).toContain('findNearestSafeAreaProvider');
    expect(safeAreaIOSSource).toContain('RNSSafeAreaDidChange');
    expect(safeAreaIOSSource).toContain('didMoveToWindow()');
    expect(safeAreaIOSSource).toContain(
      'this.__rnsSafeAreaNeedsHostRefresh = true;',
    );
    expect(safeAreaIOSSource).toContain('safeAreaProviderInsetsDidChange:');
    expect(stackSource).toContain('RNSScreenNativeScriptView');
    expect(stackSource).toContain('providerSafeAreaInsets');
    expect(stackSource).toContain('RNSSafeAreaDidChange');
    expect(stackSource).toContain('safeAreaInsetsDidChange()');
  });

  it('lays out hosted children inside selected provider safe-area edges', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();
    const refreshSpy = jest.spyOn(NativeScriptRuntime, 'refreshUIKitHostView');
    refreshSpy.mockClear();

    const UIView = function UIView() {};
    Object.assign(UIView, {
      alloc: () => ({
        init: () => makeView(),
      }),
      extend: (methods: Record<string, unknown>) => ({
        alloc: () => ({
          init: () => installMethods(makeView(), methods),
        }),
      }),
    });

    (global as Record<string, unknown>).NativeClass = jest.fn();
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      CGRectMake: (x: number, y: number, width: number, height: number) => ({
        origin: { x, y },
        size: { height, width },
      }),
      UIColor: {
        clearColor: 'clear',
      },
      UIView,
      UIViewAutoresizing: {
        FlexibleHeight: 16,
        FlexibleWidth: 2,
      },
    };

    jest.requireActual('./SafeAreaView.ios');

    const definition = NativeScriptRuntime.__getDefinitions().find(
      (candidate: { debugName?: string }) =>
        candidate.debugName === 'RNSSafeAreaView.NativeScript',
    );
    const host = definition.create({
      edges: { bottom: true, left: false, right: true, top: true },
    });

    host.rootView.bounds = makeFrame(320, 640);
    host.rootView.superview = {
      providerSafeAreaInsets: () => ({
        bottom: 34,
        left: 9,
        right: 5,
        top: 47,
      }),
    };

    definition.mounted(host, {
      edges: { bottom: true, left: false, right: true, top: true },
    });

    expect(host.childrenView.__rnsNativeScriptSafeAreaContentView).toBe(true);
    expect(host.childrenView.frame).toEqual({
      origin: { x: 0, y: 47 },
      size: { height: 559, width: 315 },
    });
    expect(host.childrenView.autoresizingMask).toBe(18);
    expect(refreshSpy).toHaveBeenCalledTimes(1);

    host.rootView.layoutSubviews();

    expect(refreshSpy).toHaveBeenCalledTimes(1);

    host.rootView.window = {};
    host.rootView.didMoveToWindow();

    expect(refreshSpy).toHaveBeenCalledTimes(2);

    host.rootView.safeAreaProviderInsetsDidChange({});

    expect(refreshSpy).toHaveBeenCalledTimes(3);

    host.rootView.bounds = makeFrame(400, 800);
    host.rootView.layoutSubviews();

    expect(host.childrenView.frame).toEqual({
      origin: { x: 0, y: 47 },
      size: { height: 719, width: 395 },
    });
    expect(refreshSpy).toHaveBeenCalledTimes(4);
  });
});
