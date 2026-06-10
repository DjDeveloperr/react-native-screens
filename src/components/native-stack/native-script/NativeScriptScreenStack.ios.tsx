import * as NativeScriptRuntime from '@nativescript/react-native';
import * as React from 'react';
import {
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import type {
  ScreenProps,
  ScreenStackProps,
  ScreenStackHeaderConfigProps,
} from '../../../types';

const REGISTRY_KEY = '__rnsNativeScriptStackRegistry';
const RECONCILE_STACK_KEY = '__rnsNativeScriptReconcileStack';
const MOUNT_VIEW_TAG = 82734091;
const BACK_BUTTON_TAG = 82734092;
const MODAL_VIEW_TAG = 82734093;
const TRANSITION_COORDINATOR_COMPLETION_BLOCK = 'v@?@';
const SCREEN_ID_SEPARATOR = '\u001f';

let nextStackId = 0;

type NativeScriptStackRegistry = {
  stacks: Record<string, any>;
  screens: Record<string, any>;
  stackActiveScreenIds: Record<string, string[]>;
  stackContexts: Record<string, any>;
  stackNativeKeys: Record<string, string | undefined>;
  stackNativeCounts: Record<string, number | undefined>;
  stackTransitioning: Record<string, boolean | undefined>;
  stackTransitionClosing: Record<string, boolean | undefined>;
  stackTransitionNativeDriven: Record<string, boolean | undefined>;
  stackTransitionRequestedFromJS: Record<string, boolean | undefined>;
  stackTransitionScreenIds: Record<string, string | undefined>;
  stackTransitionTokens: Record<string, number | undefined>;
  stackPendingReconcileKeys: Record<string, string | undefined>;
  stackInteractionLocks: Record<string, boolean | undefined>;
  stackUpdatesScheduled: Record<string, boolean | undefined>;
  stackModalNavigationControllers: Record<string, any>;
  stackModalKeys: Record<string, string | undefined>;
  stackModalPresentedModally: Record<string, boolean | undefined>;
  stackModalDismissRequestedFromJS: Record<string, boolean | undefined>;
  stackModalDismissPanControllers: Record<string, any>;
  screenContentReady: Record<string, boolean | undefined>;
  screenHeaderConfigs: Record<string, ScreenStackHeaderConfigProps | undefined>;
  screenContexts: Record<string, any>;
  screenControllerHashes: Record<string, number | string | undefined>;
  screenParents: Record<string, string | undefined>;
  screenProps: Record<string, NativeScriptScreenStackItemProps | undefined>;
};

type NativeStackChangeEvent = {
  nativeEvent: {
    screenIds: string[];
  };
};

type NativeStackTransitionEvent = {
  nativeEvent: {
    cancelled?: boolean;
    phase: 'start' | 'end';
    closing: boolean;
    screenId: string;
  };
};

type NativeScriptScreenStackProps = ScreenStackProps & {
  children?: React.ReactNode;
  onNativeStackChange?: (event: NativeStackChangeEvent) => void;
  onNativeStackTransition?: (event: NativeStackTransitionEvent) => void;
  style?: StyleProp<ViewStyle>;
};

type NativeScriptScreenStackItemProps = Omit<
  ScreenProps,
  'enabled' | 'isNativeStack' | 'hasLargeHeader'
> &
  ViewProps & {
    contentStyle?: StyleProp<ViewStyle>;
    headerConfig?: ScreenStackHeaderConfigProps | undefined;
    parentId?: string | undefined;
    screenId: string;
  };

type RegisteredStackItem = {
  active: boolean;
  order: number;
  props: NativeScriptScreenStackItemProps;
};

type NativeScriptScreenStackContextValue = {
  stackId: string;
  registerScreen: (
    screenId: string,
    props: NativeScriptScreenStackItemProps,
    active: boolean
  ) => void;
  unregisterScreen: (screenId: string) => void;
};

const NativeScriptScreenStackContext =
  React.createContext<NativeScriptScreenStackContextValue | null>(null);

function ensureRegistryShape(registry: Record<string, any>) {
  'worklet';
  const keys = [
    'stacks',
    'screens',
    'stackActiveScreenIds',
    'stackContexts',
    'stackNativeKeys',
    'stackNativeCounts',
    'stackTransitioning',
    'stackTransitionClosing',
    'stackTransitionNativeDriven',
    'stackTransitionRequestedFromJS',
    'stackTransitionScreenIds',
    'stackTransitionTokens',
    'stackPendingReconcileKeys',
    'stackInteractionLocks',
    'stackUpdatesScheduled',
    'stackModalNavigationControllers',
    'stackModalKeys',
    'stackModalPresentedModally',
    'stackModalDismissRequestedFromJS',
    'stackModalDismissPanControllers',
    'screenContentReady',
    'screenHeaderConfigs',
    'screenContexts',
    'screenControllerHashes',
    'screenParents',
    'screenProps',
  ];

  for (const key of keys) {
    if (!registry[key]) {
      registry[key] = {};
    }
  }
}

function getRegistry(
  globalObject: Record<string, any>
): NativeScriptStackRegistry {
  'worklet';
  const existing = globalObject[REGISTRY_KEY];

  if (existing) {
    ensureRegistryShape(existing);
    return existing;
  }

  const registry = {
    stacks: {},
    screens: {},
    stackActiveScreenIds: {},
    stackContexts: {},
    stackNativeKeys: {},
    stackNativeCounts: {},
    stackTransitioning: {},
    stackTransitionClosing: {},
    stackTransitionNativeDriven: {},
    stackTransitionRequestedFromJS: {},
    stackTransitionScreenIds: {},
    stackTransitionTokens: {},
    stackPendingReconcileKeys: {},
    stackInteractionLocks: {},
    stackUpdatesScheduled: {},
    stackModalNavigationControllers: {},
    stackModalKeys: {},
    stackModalPresentedModally: {},
    stackModalDismissRequestedFromJS: {},
    stackModalDismissPanControllers: {},
    screenContentReady: {},
    screenHeaderConfigs: {},
    screenContexts: {},
    screenControllerHashes: {},
    screenParents: {},
    screenProps: {},
  };

  globalObject[REGISTRY_KEY] = registry;
  ensureRegistryShape(registry);

  return registry;
}

function nativeValue(name: string) {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const api = globalObject.__nativeScriptNativeApi;

  return api?.[name] ?? globalObject[name];
}

function nativeColor(value: unknown, fallbackName: string) {
  'worklet';
  const UIColor = nativeValue('UIColor');

  if (!UIColor) {
    return null;
  }

  if (typeof value === 'string') {
    if (value === 'transparent') {
      return UIColor.clearColor;
    }

    if (value[0] === '#') {
      const hex = value.slice(1);
      const normalized =
        hex.length === 3
          ? hex
              .split('')
              .map((part) => part + part)
              .join('')
          : hex.length === 4
            ? hex
                .slice(0, 3)
                .split('')
                .map((part) => part + part)
                .join('') +
              hex[3] +
              hex[3]
            : hex;
      const hasAlpha = normalized.length === 8;
      const integer = Number.parseInt(normalized, 16);

      if (!Number.isNaN(integer)) {
        const red = ((integer >> (hasAlpha ? 24 : 16)) & 255) / 255;
        const green = ((integer >> (hasAlpha ? 16 : 8)) & 255) / 255;
        const blue = ((integer >> (hasAlpha ? 8 : 0)) & 255) / 255;
        const alpha = hasAlpha ? (integer & 255) / 255 : 1;

        if (typeof UIColor.colorWithRedGreenBlueAlpha === 'function') {
          return UIColor.colorWithRedGreenBlueAlpha(red, green, blue, alpha);
        }
      }
    }
  }

  return UIColor[fallbackName] ?? null;
}

function rectEdgeAll() {
  'worklet';
  const edge = nativeValue('UIRectEdge');

  return edge?.All ?? edge?.all ?? 15;
}

function backButtonDisplayMode(mode: unknown) {
  'worklet';
  const enumValue = nativeValue('UINavigationItemBackButtonDisplayMode');

  if (mode === 'generic') {
    return enumValue?.Generic ?? enumValue?.generic ?? 1;
  }

  if (mode === 'minimal') {
    return enumValue?.Minimal ?? enumValue?.minimal ?? 2;
  }

  return enumValue?.Default ?? enumValue?.default ?? 0;
}

function largeTitleDisplayMode(enabled: boolean) {
  'worklet';
  const enumValue = nativeValue('UINavigationItemLargeTitleDisplayMode');

  return enabled
    ? (enumValue?.Always ?? enumValue?.always ?? 1)
    : (enumValue?.Never ?? enumValue?.never ?? 2);
}

function plainBarButtonStyle() {
  'worklet';
  const style = nativeValue('UIBarButtonItemStyle');

  return style?.Plain ?? style?.plain ?? 0;
}

function modalPresentationStyle(presentation: unknown) {
  'worklet';
  const style = nativeValue('UIModalPresentationStyle');

  if (presentation === 'modal') {
    return style?.Automatic ?? style?.automatic ?? -2;
  }

  if (presentation === 'fullScreenModal') {
    return style?.FullScreen ?? style?.fullScreen ?? 0;
  }

  if (presentation === 'pageSheet') {
    return style?.PageSheet ?? style?.pageSheet ?? 1;
  }

  if (presentation === 'transparentModal') {
    return style?.OverFullScreen ?? style?.overFullScreen ?? 5;
  }

  if (presentation === 'containedTransparentModal') {
    return style?.OverCurrentContext ?? style?.overCurrentContext ?? 6;
  }

  if (presentation === 'containedModal') {
    return style?.CurrentContext ?? style?.currentContext ?? 3;
  }

  if (presentation === 'formSheet') {
    return style?.FormSheet ?? style?.formSheet ?? 2;
  }

  return style?.Automatic ?? style?.automatic ?? -2;
}

function modalTransitionStyle() {
  'worklet';
  const style = nativeValue('UIModalTransitionStyle');

  return style?.CoverVertical ?? style?.coverVertical ?? 0;
}

function isModalPresentation(presentation: unknown) {
  'worklet';

  return Boolean(
    presentation && presentation !== 'push' && presentation !== 'card'
  );
}

function configureExtendedLayout(controller: any) {
  'worklet';

  if (!controller) {
    return;
  }

  controller.edgesForExtendedLayout = rectEdgeAll();
  controller.extendedLayoutIncludesOpaqueBars = true;
}

function createArray(values: any[]) {
  'worklet';
  const NSArray = nativeValue('NSArray');

  if (NSArray && typeof NSArray.arrayWithArray === 'function') {
    return NSArray.arrayWithArray(values);
  }

  return values;
}

function arrayCount(value: any) {
  'worklet';

  if (!value) {
    return 0;
  }

  if (typeof value.count === 'number') {
    return value.count;
  }

  if (typeof value.length === 'number') {
    return value.length;
  }

  return 0;
}

function arrayItem(value: any, index: number) {
  'worklet';

  if (!value) {
    return null;
  }

  const count = arrayCount(value);

  if (index < 0 || index >= count) {
    return null;
  }

  if (typeof value.objectAtIndex === 'function') {
    return value.objectAtIndex(index);
  }

  return value[index] ?? null;
}

function removeTaggedSubviews(rootView: any, tag: number) {
  'worklet';

  if (!rootView) {
    return;
  }

  const subviews = rootView.subviews;
  const count = arrayCount(subviews);

  for (let index = count - 1; index >= 0; index -= 1) {
    const subview = arrayItem(subviews, index);

    if (!subview) {
      continue;
    }

    removeTaggedSubviews(subview, tag);

    if (
      subview.tag === tag &&
      typeof subview.removeFromSuperview === 'function'
    ) {
      subview.userInteractionEnabled = false;
      subview.hidden = true;
      subview.removeFromSuperview();
    }
  }
}

function lockStackInteractions(
  stackId: string,
  registry: NativeScriptStackRegistry
) {
  'worklet';

  if (registry.stackInteractionLocks[stackId] === true) {
    return;
  }

  registry.stackInteractionLocks[stackId] = true;
  const navigationController = registry.stacks[stackId];

  if (navigationController?.view) {
    navigationController.view.userInteractionEnabled = false;
  }
}

function unlockStackInteractions(
  stackId: string,
  registry: NativeScriptStackRegistry
) {
  'worklet';

  if (registry.stackInteractionLocks[stackId] !== true) {
    return;
  }

  registry.stackInteractionLocks[stackId] = undefined;
  const navigationController = registry.stacks[stackId];

  if (navigationController?.view) {
    navigationController.view.userInteractionEnabled = true;
  }
}

function flexibleSizeMask() {
  'worklet';

  return 18;
}

function isNativeScrollView(view: any) {
  'worklet';
  const UIScrollView = nativeValue('UIScrollView');

  return Boolean(
    UIScrollView &&
    view &&
    typeof view.isKindOfClass === 'function' &&
    view.isKindOfClass(UIScrollView)
  );
}

function shouldFillHostedSubview(rootView: any, subview: any) {
  'worklet';
  const parentBounds = rootView?.bounds ?? rootView?.frame;
  const frame = subview?.frame;
  const parentWidth = parentBounds?.size?.width ?? 0;
  const childWidth = frame?.size?.width ?? 0;
  const originX = frame?.origin?.x ?? 0;
  const originY = frame?.origin?.y ?? 0;

  if (parentWidth <= 0) {
    return false;
  }

  return (
    Math.abs(originX) < 1 &&
    Math.abs(originY) < 1 &&
    (childWidth <= 0 || Math.abs(childWidth - parentWidth) < 2)
  );
}

function layoutHostedSubviewChain(rootView: any, depth: number) {
  'worklet';

  if (!rootView || depth > 8 || isNativeScrollView(rootView)) {
    return;
  }

  const subviews = rootView.subviews;
  const count = arrayCount(subviews);

  for (let index = 0; index < count; index += 1) {
    const subview = arrayItem(subviews, index);

    if (!subview || !shouldFillHostedSubview(rootView, subview)) {
      continue;
    }

    subview.frame = rootView.bounds;
    subview.autoresizingMask = flexibleSizeMask();

    layoutHostedSubviewChain(subview, depth + 1);
  }
}

function layoutHostedReactSubviews(controller: any) {
  'worklet';
  const rootView = controller?.view;

  if (!rootView) {
    return;
  }

  rootView.userInteractionEnabled = true;

  const subviews = rootView.subviews;
  const count = arrayCount(subviews);

  for (let index = 0; index < count; index += 1) {
    const subview = arrayItem(subviews, index);

    if (!subview) {
      continue;
    }

    subview.frame = rootView.bounds;
    subview.autoresizingMask = flexibleSizeMask();
    layoutHostedSubviewChain(subview, 0);
  }

  NativeScriptRuntime.refreshUIKitHostView(rootView);
}

function layoutNavigationStackViews(navigationController: any) {
  'worklet';

  if (!navigationController?.view) {
    return;
  }

  const parentBounds =
    navigationController.tabBarController?.view?.bounds ??
    navigationController.view.superview?.bounds;

  if (parentBounds) {
    navigationController.view.frame = parentBounds;
  }

  navigationController.view.autoresizingMask = flexibleSizeMask();

  const viewControllers = navigationController.viewControllers;
  const count = arrayCount(viewControllers);

  for (let index = 0; index < count; index += 1) {
    const controller = arrayItem(viewControllers, index);

    if (!controller?.view) {
      continue;
    }

    controller.view.frame = navigationController.view.bounds;
    controller.view.autoresizingMask = flexibleSizeMask();
    layoutHostedReactSubviews(controller);
  }
}

function configureHeaderBackButton(
  controller: any,
  props: Readonly<NativeScriptScreenStackItemProps>,
  isTopScreen: boolean,
  canGoBack: boolean
) {
  'worklet';
  const navigationItem = controller?.navigationItem;

  if (!navigationItem) {
    return;
  }

  const existingItem = navigationItem.leftBarButtonItem;
  const existingButton = existingItem?.customView;
  const hasNativeScriptBackButton = existingButton?.tag === BACK_BUTTON_TAG;
  const shouldShowBackButton =
    canGoBack && isTopScreen && props.headerConfig?.hideBackButton !== true;

  if (hasNativeScriptBackButton) {
    navigationItem.leftBarButtonItem = null;
  }

  navigationItem.hidesBackButton = !shouldShowBackButton;
}

function configureSourceBackButton(
  navigationItem: any,
  headerConfig?: ScreenStackHeaderConfigProps
) {
  'worklet';

  if (!navigationItem) {
    return;
  }

  const displayMode =
    headerConfig?.backTitleVisible === false
      ? 'minimal'
      : headerConfig?.backButtonDisplayMode;
  const title =
    headerConfig?.backTitleVisible === false || displayMode === 'minimal'
      ? ''
      : headerConfig?.backTitle;

  navigationItem.backButtonDisplayMode = backButtonDisplayMode(displayMode);
  navigationItem.backButtonTitle = title ?? '';

  const existingItem = navigationItem.backBarButtonItem;

  if (existingItem?.accessibilityLabel === 'Back') {
    existingItem.title = title ?? '';
    existingItem.style = plainBarButtonStyle();
    return;
  }

  const UIBarButtonItem = nativeValue('UIBarButtonItem');

  if (!UIBarButtonItem || typeof UIBarButtonItem.alloc !== 'function') {
    return;
  }

  const allocatedItem = UIBarButtonItem.alloc();
  const item =
    allocatedItem &&
    typeof allocatedItem.initWithTitleStyleTargetAction === 'function'
      ? allocatedItem.initWithTitleStyleTargetAction(
          '',
          plainBarButtonStyle(),
          null,
          null
        )
      : allocatedItem;

  if (item) {
    item.title = title ?? '';
    item.style = plainBarButtonStyle();
    item.accessibilityLabel = 'Back';
    navigationItem.backBarButtonItem = item;
  }
}

function measuredHeaderHeight(navigationController: any, fallback: number) {
  'worklet';
  const navigationBar = navigationController?.navigationBar;
  const frame = navigationBar?.frame;
  const originY = frame?.origin?.y ?? 0;
  const height = frame?.size?.height ?? 0;

  if (height > 0) {
    return originY + height;
  }

  const insets =
    navigationController?.view?.safeAreaInsets ??
    navigationController?.topViewController?.view?.safeAreaInsets;
  const topInset = insets?.top ?? 0;

  return topInset + fallback;
}

function emitHeaderHeightChange(
  controller: any,
  props: Readonly<NativeScriptScreenStackItemProps>,
  ctx?: any
) {
  'worklet';

  if (
    !ctx ||
    props.headerConfig?.hidden === true ||
    typeof props.onHeaderHeightChange !== 'function'
  ) {
    return;
  }

  ctx.emit('onHeaderHeightChange', {
    nativeEvent: {
      headerHeight: measuredHeaderHeight(
        controller?.navigationController,
        isModalPresentation(props.stackPresentation) ? 56 : 44
      ),
    },
  });
}

function clearScreenRecord(
  registry: NativeScriptStackRegistry,
  screenId: string
) {
  'worklet';

  registry.screens[screenId] = undefined;
  registry.screenHeaderConfigs[screenId] = undefined;
  registry.screenContexts[screenId] = undefined;
  registry.screenControllerHashes[screenId] = undefined;
  registry.screenContentReady[screenId] = undefined;
  registry.screenParents[screenId] = undefined;
  registry.screenProps[screenId] = undefined;
}

function controllerHash(controller: any) {
  'worklet';

  const hash = controller?.hash;

  return typeof hash === 'number' || typeof hash === 'string'
    ? hash
    : undefined;
}

function setScreenControllerIdentity(controller: any, screenId: string) {
  'worklet';

  if (!controller) {
    return;
  }

  controller.__nativeScriptScreenId = screenId;
  controller.restorationIdentifier = screenId;

  if (controller.view) {
    controller.view.accessibilityIdentifier = screenId;
  }
}

function screenIdForController(
  controller: any,
  registry: NativeScriptStackRegistry
) {
  'worklet';

  const taggedScreenId =
    controller?.__nativeScriptScreenId ??
    controller?.restorationIdentifier ??
    controller?.view?.accessibilityIdentifier;

  if (typeof taggedScreenId === 'string' && registry.screens[taggedScreenId]) {
    return taggedScreenId;
  }

  const hash = controllerHash(controller);

  if (hash != null) {
    for (const screenId in registry.screenControllerHashes) {
      if (registry.screenControllerHashes[screenId] === hash) {
        return screenId;
      }
    }
  }

  for (const screenId in registry.screens) {
    if (registry.screens[screenId] === controller) {
      return screenId;
    }
  }

  return undefined;
}

function navigationControllerContainsController(
  navigationController: any,
  controller: any
) {
  'worklet';

  if (!navigationController || !controller) {
    return false;
  }

  const viewControllers = navigationController.viewControllers;
  const count = arrayCount(viewControllers);

  for (let index = 0; index < count; index += 1) {
    if (arrayItem(viewControllers, index) === controller) {
      return true;
    }
  }

  return false;
}

function screenIdInList(screenId: string, ids: string[]) {
  'worklet';

  for (const id of ids) {
    if (id === screenId) {
      return true;
    }
  }

  return false;
}

function screenControllerIsVisibleInNativeStack(
  stackId: string,
  controller: any,
  registry: NativeScriptStackRegistry
) {
  'worklet';

  return (
    navigationControllerContainsController(
      registry.stacks[stackId],
      controller
    ) ||
    navigationControllerContainsController(
      registry.stackModalNavigationControllers[stackId],
      controller
    )
  );
}

function cleanupDetachedScreens(
  stackId: string,
  registry: NativeScriptStackRegistry
) {
  'worklet';

  const activeIds = registry.stackActiveScreenIds[stackId] ?? [];

  for (const screenId in registry.screens) {
    if (registry.screenParents[screenId] !== stackId) {
      continue;
    }

    if (screenIdInList(screenId, activeIds)) {
      continue;
    }

    if (
      screenControllerIsVisibleInNativeStack(
        stackId,
        registry.screens[screenId],
        registry
      )
    ) {
      continue;
    }

    clearScreenRecord(registry, screenId);
  }
}

function navigationControllerScreenIds(
  navigationController: any,
  registry: NativeScriptStackRegistry
) {
  'worklet';
  const ids: string[] = [];
  const viewControllers = navigationController?.viewControllers;
  const count = arrayCount(viewControllers);

  for (let index = 0; index < count; index += 1) {
    const screenId = screenIdForController(
      arrayItem(viewControllers, index),
      registry
    );

    if (screenId) {
      ids.push(screenId);
    }
  }

  return ids;
}

function stackVisibleScreenIds(
  stackId: string,
  registry: NativeScriptStackRegistry
) {
  'worklet';
  const navigationController = registry.stacks[stackId];
  const ids = navigationControllerScreenIds(navigationController, registry);
  const modalNavigationController =
    registry.stackModalNavigationControllers[stackId];

  if (modalNavigationController) {
    const modalIds = navigationControllerScreenIds(
      modalNavigationController,
      registry
    );

    for (const modalId of modalIds) {
      ids.push(modalId);
    }
  }

  return ids;
}

function firstModalIndex(ids: string[], registry: NativeScriptStackRegistry) {
  'worklet';

  for (let index = 1; index < ids.length; index += 1) {
    if (
      isModalPresentation(registry.screenProps[ids[index]]?.stackPresentation)
    ) {
      return index;
    }
  }

  return -1;
}

function idsEqual(left: string[], right: string[]) {
  'worklet';

  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      return false;
    }
  }

  return true;
}

function shouldEmitNativeStackChange(shownIds: string[], activeIds: string[]) {
  'worklet';

  if (shownIds.length === 0 || shownIds.length >= activeIds.length) {
    return false;
  }

  for (let index = 0; index < shownIds.length; index += 1) {
    if (shownIds[index] !== activeIds[index]) {
      return false;
    }
  }

  return true;
}

function idsFromKey(key: string | undefined) {
  'worklet';

  if (!key) {
    return [];
  }

  return key.split(SCREEN_ID_SEPARATOR);
}

function idsKey(ids: string[]) {
  'worklet';

  return ids.join(SCREEN_ID_SEPARATOR);
}

function controllersForIds(ids: string[], registry: NativeScriptStackRegistry) {
  'worklet';
  const controllers: any[] = [];
  const availableIds: string[] = [];

  for (const id of ids) {
    const controller = registry.screens[id];

    if (controller) {
      controllers.push(controller);
      availableIds.push(id);
    }
  }

  return { availableIds, controllers };
}

function viewControllersEqual(viewControllers: any, controllers: any[]) {
  'worklet';
  const count = arrayCount(viewControllers);

  if (count !== controllers.length) {
    return false;
  }

  for (let index = 0; index < count; index += 1) {
    if (arrayItem(viewControllers, index) !== controllers[index]) {
      return false;
    }
  }

  return true;
}

function viewControllersMatchPrefix(viewControllers: any, controllers: any[]) {
  'worklet';
  const count = arrayCount(viewControllers);

  if (count > controllers.length) {
    return false;
  }

  for (let index = 0; index < count; index += 1) {
    if (arrayItem(viewControllers, index) !== controllers[index]) {
      return false;
    }
  }

  return true;
}

function rectWithY(rect: any, y: number) {
  'worklet';
  const origin = rect?.origin;
  const size = rect?.size;
  const CGRectMake = nativeValue('CGRectMake');
  const x = origin?.x ?? 0;
  const width = size?.width ?? 0;
  const height = size?.height ?? 0;

  if (typeof CGRectMake === 'function') {
    return CGRectMake(x, y, width, height);
  }

  return {
    origin: { x, y },
    size: { height, width },
  };
}

function animateWithDuration(
  duration: number,
  animations: () => void,
  completion: () => void
) {
  'worklet';
  const UIView = nativeValue('UIView');

  if (
    UIView &&
    typeof UIView.animateWithDurationAnimationsCompletion === 'function'
  ) {
    UIView.animateWithDurationAnimationsCompletion(
      duration,
      animations,
      completion
    );
    return;
  }

  animations();
  completion();
}

function updateNativeBackGesture(navigationController: any) {
  'worklet';
  const gesture = navigationController?.interactivePopGestureRecognizer;

  if (!gesture) {
    return;
  }

  const count = arrayCount(navigationController.viewControllers);

  gesture.enabled = count > 1;
}

function installNativeBackGestureDelegate(navigationController: any, ctx: any) {
  'worklet';
  const gesture = navigationController?.interactivePopGestureRecognizer;

  if (!gesture || !ctx) {
    return;
  }

  const delegateProtocol =
    nativeValue('UIGestureRecognizerDelegate') ?? 'UIGestureRecognizerDelegate';

  const delegate = ctx.delegate(gesture, delegateProtocol, {
    gestureRecognizerShouldBegin() {
      'worklet';

      return arrayCount(navigationController.viewControllers) > 1;
    },
    gestureRecognizerShouldRecognizeSimultaneouslyWithGestureRecognizer() {
      'worklet';

      return true;
    },
  });
  gesture.delegate = delegate;

  updateNativeBackGesture(navigationController);
}

function configureNavigationAppearance(
  navigationController: any,
  headerConfig?: ScreenStackHeaderConfigProps
) {
  'worklet';

  if (!navigationController) {
    return;
  }

  configureExtendedLayout(navigationController);
  updateNativeBackGesture(navigationController);
  layoutNavigationStackViews(navigationController);

  const viewControllers = navigationController.viewControllers;
  const count = arrayCount(viewControllers);

  if (count >= 2) {
    const previousController = arrayItem(viewControllers, count - 2);
    const navigationItem = previousController?.navigationItem;

    configureSourceBackButton(navigationItem, headerConfig);
  } else if (count === 1) {
    const rootController = arrayItem(viewControllers, 0);
    const navigationItem = rootController?.navigationItem;

    if (navigationItem) {
      navigationItem.backBarButtonItem = null;
      navigationItem.backButtonTitle = '';
      navigationItem.hidesBackButton = true;
    }
  }

  const navigationBar = navigationController.navigationBar;

  if (!navigationBar) {
    return;
  }

  const hidden = headerConfig?.hidden === true;

  if (
    typeof navigationController.setNavigationBarHiddenAnimated === 'function'
  ) {
    navigationController.setNavigationBarHiddenAnimated(hidden, false);
  }

  navigationController.navigationBarHidden = hidden;
  navigationBar.hidden = hidden;
  navigationBar.prefersLargeTitles = headerConfig?.largeTitle === true;
  navigationBar.translucent = headerConfig?.translucent !== false;

  const tintColor = nativeColor(headerConfig?.color, 'labelColor');

  if (tintColor) {
    navigationBar.tintColor = tintColor;
  }

  const clearColor = nativeColor('transparent', 'clearColor');
  const backgroundColor = nativeColor(
    headerConfig?.backgroundColor,
    'systemBackgroundColor'
  );
  const shouldUseTransparentBackground =
    headerConfig?.translucent === true ||
    headerConfig?.backgroundColor === 'transparent';
  const UINavigationBarAppearance = nativeValue('UINavigationBarAppearance');

  if (
    UINavigationBarAppearance &&
    typeof UINavigationBarAppearance.alloc === 'function'
  ) {
    const allocated = UINavigationBarAppearance.alloc();
    const appearance =
      allocated && typeof allocated.init === 'function'
        ? allocated.init()
        : allocated;

    if (
      shouldUseTransparentBackground &&
      typeof appearance.configureWithTransparentBackground === 'function'
    ) {
      appearance.configureWithTransparentBackground();
    } else if (
      typeof appearance.configureWithDefaultBackground === 'function'
    ) {
      appearance.configureWithDefaultBackground();
    }

    if (backgroundColor) {
      appearance.backgroundColor = backgroundColor;
    }

    if (clearColor && headerConfig?.hideShadow === true) {
      appearance.shadowColor = clearColor;
    }

    navigationBar.standardAppearance = appearance;
    navigationBar.scrollEdgeAppearance = appearance;
    navigationBar.compactAppearance = appearance;
  } else if (backgroundColor) {
    navigationBar.backgroundColor = backgroundColor;
  }
}

function configureScreenController(
  controller: any,
  props: Readonly<NativeScriptScreenStackItemProps>,
  ctx?: any,
  isTopScreen = false,
  canGoBack = false
) {
  'worklet';

  setScreenControllerIdentity(controller, props.screenId);
  configureExtendedLayout(controller);

  const headerConfig = props.headerConfig;
  const navigationItem = controller?.navigationItem;

  controller.title = headerConfig?.title ?? '';

  if (controller.view) {
    controller.view.autoresizingMask = flexibleSizeMask();
    controller.view.backgroundColor = nativeColor(
      headerConfig?.backgroundColor,
      'systemBackgroundColor'
    );
    layoutHostedReactSubviews(controller);
  }

  if (navigationItem) {
    navigationItem.title = headerConfig?.title ?? '';
    configureSourceBackButton(navigationItem, headerConfig);
    navigationItem.hidesBackButton = headerConfig?.hideBackButton === true;
    navigationItem.backButtonDisplayMode = backButtonDisplayMode(
      headerConfig?.backTitleVisible === false
        ? 'minimal'
        : headerConfig?.backButtonDisplayMode
    );
    navigationItem.largeTitleDisplayMode = largeTitleDisplayMode(
      headerConfig?.largeTitle === true
    );
  }

  const navigationController = controller.navigationController;

  if (navigationController) {
    configureNavigationAppearance(navigationController, headerConfig);
    layoutNavigationStackViews(navigationController);
  }

  configureHeaderBackButton(controller, props, isTopScreen, canGoBack);
  emitHeaderHeightChange(controller, props, ctx);
}

function configureStackControllers(
  ids: string[],
  registry: NativeScriptStackRegistry
) {
  'worklet';

  for (let index = 0; index < ids.length; index += 1) {
    const id = ids[index];
    const controller = registry.screens[id];
    const props = registry.screenProps[id];

    if (!controller || !props) {
      continue;
    }

    configureScreenController(
      controller,
      props,
      registry.screenContexts[id],
      index === ids.length - 1,
      index > 0
    );
  }
}

function emitStackChangeForIds(ctx: any, screenIds: string[]) {
  'worklet';

  if (!ctx?.props?.stackId) {
    return;
  }

  ctx.emit('onNativeStackChange', {
    nativeEvent: {
      screenIds,
    },
  });
}

function emitStackChange(ctx: any) {
  'worklet';

  if (!ctx?.props?.stackId) {
    return;
  }

  const registry = getRegistry(globalThis as Record<string, any>);
  const screenIds = stackVisibleScreenIds(ctx.props.stackId, registry);

  emitStackChangeForIds(ctx, screenIds);
}

function scheduleStackChange(ctx: any) {
  'worklet';

  emitStackChange(ctx);

  if (typeof setTimeout !== 'function') {
    return;
  }

  const emit = () => {
    'worklet';
    emitStackChange(ctx);
  };

  setTimeout(emit, 0);
  setTimeout(emit, 64);
  setTimeout(emit, 160);
}

function emitTransition(
  ctx: any,
  phase: 'start' | 'end',
  closing: boolean,
  screenId: string | undefined,
  cancelled = false
) {
  'worklet';

  if (!ctx || !screenId) {
    return;
  }

  ctx.emit('onNativeStackTransition', {
    nativeEvent: {
      cancelled,
      closing,
      phase,
      screenId,
    },
  });
}

function emitScreenDismissed(
  registry: NativeScriptStackRegistry,
  screenId: string | undefined,
  dismissCount: number
) {
  'worklet';

  if (!screenId) {
    return;
  }

  registry.screenContexts[screenId]?.emit?.('onDismissed', {
    nativeEvent: {
      dismissCount,
    },
  });
}

function emitGestureCancel(
  registry: NativeScriptStackRegistry,
  screenId: string | undefined
) {
  'worklet';

  if (!screenId) {
    return;
  }

  registry.screenContexts[screenId]?.emit?.('onGestureCancel', {
    nativeEvent: {},
  });
}

function emitNativeDismissCancelled(
  registry: NativeScriptStackRegistry,
  screenId: string | undefined,
  dismissCount: number
) {
  'worklet';

  if (!screenId) {
    return;
  }

  registry.screenContexts[screenId]?.emit?.('onNativeDismissCancelled', {
    nativeEvent: {
      dismissCount,
    },
  });
}

function markTransition(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  closing: boolean,
  screenId: string | undefined,
  nativeDriven = false,
  requestedFromJS = true
) {
  'worklet';
  const token = (registry.stackTransitionTokens[stackId] ?? 0) + 1;

  registry.stackTransitionTokens[stackId] = token;
  registry.stackTransitioning[stackId] = true;
  registry.stackTransitionClosing[stackId] = closing;
  registry.stackTransitionNativeDriven[stackId] = nativeDriven;
  registry.stackTransitionRequestedFromJS[stackId] = requestedFromJS;
  registry.stackTransitionScreenIds[stackId] = screenId;
  if (!nativeDriven) {
    lockStackInteractions(stackId, registry);
  }
  emitTransition(ctx, 'start', closing, screenId);

  return token;
}

function animateStackPush(parent: any, controllers: any[], controller: any) {
  'worklet';

  if (!controller || typeof parent?.pushViewControllerAnimated !== 'function') {
    return false;
  }

  if (typeof parent.setViewControllersAnimated === 'function') {
    const controllersBeforePush = controllers.slice(0, -1);

    if (
      controllersBeforePush.length > 0 &&
      !viewControllersEqual(parent.viewControllers, controllersBeforePush)
    ) {
      parent.setViewControllersAnimated(
        createArray(controllersBeforePush),
        false
      );
    }
  }

  parent.pushViewControllerAnimated(controller, true);

  return true;
}

function animateStackPop(
  parent: any,
  controllers: any[],
  targetController: any,
  nextCount: number,
  previousCount: number
) {
  'worklet';

  if (!parent) {
    return false;
  }

  if (
    nextCount === previousCount - 1 &&
    typeof parent.popViewControllerAnimated === 'function'
  ) {
    parent.popViewControllerAnimated(true);

    return true;
  }

  if (
    nextCount === 1 &&
    previousCount > 1 &&
    typeof parent.popToRootViewControllerAnimated === 'function'
  ) {
    parent.popToRootViewControllerAnimated(true);

    return true;
  }

  if (
    targetController &&
    typeof parent.popToViewControllerAnimated === 'function'
  ) {
    parent.popToViewControllerAnimated(targetController, true);

    return true;
  }

  if (
    controllers.length > 0 &&
    typeof parent.setViewControllersAnimated === 'function'
  ) {
    parent.setViewControllersAnimated(createArray(controllers), true);

    return true;
  }

  if (typeof parent.popViewControllerAnimated === 'function') {
    const nativeControllers = parent.viewControllers;
    const topController =
      parent.topViewController ??
      arrayItem(nativeControllers, arrayCount(nativeControllers) - 1);

    if (
      topController &&
      typeof parent.setViewControllersAnimated === 'function'
    ) {
      parent.setViewControllersAnimated(
        createArray([...controllers, topController]),
        false
      );
      parent.popViewControllerAnimated(true);

      return true;
    }
  }

  return false;
}

function setNavigationControllerViewControllers(
  navigationController: any,
  controllers: any[],
  animated: boolean
) {
  'worklet';
  const nativeControllers = createArray(controllers);

  if (navigationController && !animated) {
    const currentViewControllers = navigationController.viewControllers;
    const currentCount = arrayCount(currentViewControllers);

    if (viewControllersEqual(currentViewControllers, controllers)) {
      return;
    }

    if (
      controllers.length > currentCount &&
      currentCount > 0 &&
      viewControllersMatchPrefix(currentViewControllers, controllers) &&
      typeof navigationController.pushViewControllerAnimated === 'function'
    ) {
      for (let index = 1; index < controllers.length; index += 1) {
        const controller = controllers[index];

        if (
          controller &&
          !navigationControllerContainsController(
            navigationController,
            controller
          )
        ) {
          navigationController.pushViewControllerAnimated(controller, false);
        }
      }

      return;
    }

    if (controllers.length > 0 && controllers.length < currentCount) {
      const targetController = controllers[controllers.length - 1];

      if (
        controllers.length === 1 &&
        typeof navigationController.popToRootViewControllerAnimated ===
          'function'
      ) {
        navigationController.popToRootViewControllerAnimated(false);
      } else if (
        targetController &&
        typeof navigationController.popToViewControllerAnimated === 'function'
      ) {
        navigationController.popToViewControllerAnimated(
          targetController,
          false
        );
      }
    }
  }

  if (
    navigationController &&
    typeof navigationController.setViewControllersAnimated === 'function'
  ) {
    navigationController.setViewControllersAnimated(
      nativeControllers,
      animated
    );
  }

  if (navigationController && !animated) {
    navigationController.viewControllers = nativeControllers;
  } else if (
    navigationController &&
    typeof navigationController.setViewControllersAnimated !== 'function'
  ) {
    navigationController.viewControllers = nativeControllers;
  }
}

function finishTransition(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  closing: boolean,
  screenId: string | undefined,
  emitStackChange = false,
  cancelled = false
) {
  'worklet';
  const shouldRunPendingReconcile =
    !cancelled &&
    registry.stackPendingReconcileKeys[stackId] != null &&
    (registry.stackTransitionRequestedFromJS[stackId] === true ||
      registry.stackTransitionNativeDriven[stackId] !== true);

  unlockStackInteractions(stackId, registry);
  emitTransition(ctx, 'end', closing, screenId, cancelled);
  registry.stackTransitioning[stackId] = false;
  registry.stackTransitionClosing[stackId] = undefined;
  registry.stackTransitionNativeDriven[stackId] = undefined;
  registry.stackTransitionRequestedFromJS[stackId] = undefined;
  registry.stackTransitionScreenIds[stackId] = undefined;
  registry.stackPendingReconcileKeys[stackId] = undefined;
  registry.stackUpdatesScheduled[stackId] = undefined;
  registry.stackTransitionTokens[stackId] =
    (registry.stackTransitionTokens[stackId] ?? 0) + 1;

  if (emitStackChange) {
    scheduleStackChange(ctx);
  }

  cleanupDetachedScreens(stackId, registry);

  if (shouldRunPendingReconcile) {
    const reconcile = () => {
      'worklet';
      const reconcileStackFromRegistry = (globalThis as Record<string, any>)[
        RECONCILE_STACK_KEY
      ];

      if (typeof reconcileStackFromRegistry === 'function') {
        reconcileStackFromRegistry(stackId, registry, ctx, true);
      }
    };

    if (typeof setTimeout === 'function') {
      setTimeout(reconcile, 0);
    } else {
      reconcile();
    }
  }
}

function scheduleTransitionFallback(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  token: number,
  closing: boolean,
  screenId: string | undefined,
  targetIds: string[],
  navigationController: any,
  emitStackChange: boolean
) {
  'worklet';

  if (typeof setTimeout !== 'function') {
    return;
  }

  const complete = () => {
    'worklet';
    const currentToken = registry.stackTransitionTokens[stackId];

    if (currentToken !== token && currentToken !== token + 1) {
      return;
    }

    const target = controllersForIds(targetIds, registry);

    if (
      navigationController &&
      target.availableIds.length > 0 &&
      target.availableIds.length === targetIds.length
    ) {
      const currentIds = navigationControllerScreenIds(
        navigationController,
        registry
      );

      if (!idsEqual(currentIds, target.availableIds)) {
        setNavigationControllerViewControllers(
          navigationController,
          target.controllers,
          false
        );
      }

      registry.stackNativeKeys[stackId] = idsKey(target.availableIds);
      registry.stackNativeCounts[stackId] = target.availableIds.length;
      layoutNavigationStackViews(navigationController);
      configureStackControllers(target.availableIds, registry);
      configureNavigationAppearance(
        navigationController,
        registry.screenHeaderConfigs[
          target.availableIds[target.availableIds.length - 1]
        ]
      );
      updateNativeBackGesture(navigationController);
    }

    if (registry.stackTransitioning[stackId] === true) {
      finishTransition(
        stackId,
        registry,
        ctx,
        closing,
        screenId,
        emitStackChange
      );
    }
  };

  setTimeout(complete, 420);
}

function scheduledReconcileStack(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  animated: boolean
) {
  'worklet';
  const reconcile = (globalThis as Record<string, any>)[RECONCILE_STACK_KEY];

  if (typeof reconcile === 'function') {
    reconcile(stackId, registry, ctx, animated);
  }
}

function scheduleReconcileAfterNativeTransition(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  navigationController: any
) {
  'worklet';
  const coordinator = navigationController?.transitionCoordinator;

  if (
    !coordinator ||
    typeof coordinator.animateAlongsideTransitionCompletion !== 'function'
  ) {
    return false;
  }

  if (registry.stackUpdatesScheduled[stackId] === true) {
    return true;
  }

  registry.stackUpdatesScheduled[stackId] = true;

  const complete = () => {
    'worklet';

    registry.stackUpdatesScheduled[stackId] = undefined;
    scheduledReconcileStack(stackId, registry, ctx, true);
  };
  const InteropBlock = (globalThis as Record<string, any>).interop?.Block;

  if (typeof InteropBlock !== 'function') {
    throw new Error('NativeScript interop.Block is required for UIKit callbacks');
  }

  if (
    coordinator.animateAlongsideTransitionCompletion(
      null,
      InteropBlock(
        TRANSITION_COORDINATOR_COMPLETION_BLOCK,
        NativeScriptRuntime.runtimeInvoker(complete)
      )
    )
  ) {
    return true;
  }

  registry.stackUpdatesScheduled[stackId] = undefined;
  return false;
}

function configureModalNavigationController(
  navigationController: any,
  presentation: unknown
) {
  'worklet';

  if (!navigationController) {
    return;
  }

  configureExtendedLayout(navigationController);
  navigationController.modalPresentationStyle =
    modalPresentationStyle(presentation);
  navigationController.modalTransitionStyle = modalTransitionStyle();
  navigationController.modalInPresentation = false;

  const sheetPresentationController =
    navigationController.sheetPresentationController;

  if (presentation === 'modal' && sheetPresentationController) {
    if ('prefersPageSizing' in sheetPresentationController) {
      sheetPresentationController.prefersPageSizing = true;
    }

    if (
      'prefersScrollingExpandsWhenScrolledToEdge' in sheetPresentationController
    ) {
      sheetPresentationController.prefersScrollingExpandsWhenScrolledToEdge = false;
    }
  }
}

function createNavigationController(controllers: any[]) {
  'worklet';
  const UINavigationController = nativeValue('UINavigationController');

  if (
    !UINavigationController ||
    typeof UINavigationController.alloc !== 'function'
  ) {
    return null;
  }

  const allocated = UINavigationController.alloc();
  const navigationController =
    allocated && typeof allocated.init === 'function'
      ? allocated.init()
      : allocated;

  setNavigationControllerViewControllers(
    navigationController,
    controllers,
    false
  );

  return navigationController;
}

function completeModalStackDismissal(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  modalNavigationController: any,
  wasPresentedModally: boolean,
  closingScreenId: string | undefined,
  dismissCount: number,
  shouldEmitDismissed: boolean,
  finalFrame?: any,
  height = 0,
  detachPresentedView = true
) {
  'worklet';
  const parentView = modalNavigationController.view?.superview;

  if (
    wasPresentedModally &&
    detachPresentedView &&
    modalNavigationController.view
  ) {
    modalNavigationController.view.userInteractionEnabled = false;
    modalNavigationController.view.hidden = true;

    if (
      typeof modalNavigationController.view.removeFromSuperview === 'function'
    ) {
      modalNavigationController.view.removeFromSuperview();
    }
  }

  if (!wasPresentedModally) {
    if (
      typeof modalNavigationController.willMoveToParentViewController ===
      'function'
    ) {
      modalNavigationController.willMoveToParentViewController(null);
    }

    if (modalNavigationController.view) {
      modalNavigationController.view.userInteractionEnabled = false;
      modalNavigationController.view.hidden = true;

      if (finalFrame) {
        modalNavigationController.view.frame = rectWithY(finalFrame, height);
      }

      if (
        typeof modalNavigationController.view.removeFromSuperview === 'function'
      ) {
        modalNavigationController.view.removeFromSuperview();
      }
    }

    if (
      typeof modalNavigationController.removeFromParentViewController ===
      'function'
    ) {
      modalNavigationController.removeFromParentViewController();
    }
  }

  const cleanupTaggedModalViews = () => {
    'worklet';
    removeTaggedSubviews(parentView, MODAL_VIEW_TAG);
    removeTaggedSubviews(
      registry.stacks[stackId]?.view?.window,
      MODAL_VIEW_TAG
    );
  };

  if (detachPresentedView) {
    cleanupTaggedModalViews();
  }
  if (detachPresentedView && typeof setTimeout === 'function') {
    setTimeout(cleanupTaggedModalViews, 0);
    setTimeout(cleanupTaggedModalViews, 64);
    setTimeout(cleanupTaggedModalViews, 250);
  }
  registry.stackModalNavigationControllers[stackId] = undefined;
  registry.stackModalKeys[stackId] = undefined;
  registry.stackModalPresentedModally[stackId] = undefined;
  registry.stackModalDismissRequestedFromJS[stackId] = undefined;
  registry.stackModalDismissPanControllers[stackId] = undefined;

  const baseScreenIds = (registry.stackActiveScreenIds[stackId] ?? []).filter(
    (screenId) =>
      !isModalPresentation(registry.screenProps[screenId]?.stackPresentation)
  );
  const base = controllersForIds(baseScreenIds, registry);
  const baseNavigationController = registry.stacks[stackId];

  if (baseNavigationController && base.availableIds.length > 0) {
    const hostController =
      baseNavigationController.tabBarController ?? baseNavigationController;

    if (hostController?.view) {
      hostController.view.hidden = false;
      hostController.view.alpha = 1;
      hostController.view.userInteractionEnabled = true;
    }

    if (baseNavigationController.view) {
      baseNavigationController.view.hidden = false;
      baseNavigationController.view.alpha = 1;
      baseNavigationController.view.userInteractionEnabled = true;
    }

    setNavigationControllerViewControllers(
      baseNavigationController,
      base.controllers,
      false
    );
    registry.stackNativeKeys[stackId] = idsKey(base.availableIds);
    registry.stackNativeCounts[stackId] = base.availableIds.length;
    layoutNavigationStackViews(baseNavigationController);
    if (
      baseNavigationController.view &&
      typeof baseNavigationController.view.setNeedsLayout === 'function'
    ) {
      baseNavigationController.view.setNeedsLayout();
    }
    if (
      baseNavigationController.view &&
      typeof baseNavigationController.view.layoutIfNeeded === 'function'
    ) {
      baseNavigationController.view.layoutIfNeeded();
    }
    configureStackControllers(base.availableIds, registry);
    configureNavigationAppearance(
      baseNavigationController,
      registry.screenHeaderConfigs[
        base.availableIds[base.availableIds.length - 1]
      ]
    );
    updateNativeBackGesture(baseNavigationController);
  }

  emitTransition(ctx, 'start', true, closingScreenId);
  if (shouldEmitDismissed) {
    emitScreenDismissed(registry, closingScreenId, dismissCount);
  }
  unlockStackInteractions(stackId, registry);
  emitTransition(ctx, 'end', true, closingScreenId);
  cleanupDetachedScreens(stackId, registry);
}

function installModalPresentationDelegate(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  modalNavigationController: any
) {
  'worklet';
  const presentationController =
    modalNavigationController?.presentationController;

  if (!presentationController || !ctx) {
    return;
  }

  const delegateProtocol =
    nativeValue('UIAdaptivePresentationControllerDelegate') ??
    'UIAdaptivePresentationControllerDelegate';

  ctx.delegate(presentationController, delegateProtocol, {
    presentationControllerShouldDismiss() {
      'worklet';
      const modalIds = idsFromKey(registry.stackModalKeys[stackId]);
      const topScreenId = modalIds[modalIds.length - 1];
      const props = registry.screenProps[topScreenId];

      if (props?.preventNativeDismiss === true) {
        return false;
      }

      return props?.gestureEnabled !== false;
    },
    presentationControllerDidAttemptToDismiss() {
      'worklet';
      const modalIds = idsFromKey(registry.stackModalKeys[stackId]);
      const topScreenId = modalIds[modalIds.length - 1];
      const props = registry.screenProps[topScreenId];

      unlockStackInteractions(stackId, registry);
      emitGestureCancel(registry, topScreenId);

      if (props?.preventNativeDismiss === true) {
        emitNativeDismissCancelled(registry, topScreenId, 1);
      }
    },
    presentationControllerDidDismiss() {
      'worklet';
      const currentController =
        registry.stackModalNavigationControllers[stackId];

      if (!currentController) {
        return;
      }

      const modalIds = idsFromKey(registry.stackModalKeys[stackId]);
      const closingScreenId = modalIds[modalIds.length - 1];
      const dismissCount = Math.max(
        1,
        arrayCount(currentController.viewControllers)
      );
      const shouldEmitDismissed =
        registry.stackModalDismissRequestedFromJS[stackId] !== true;

      completeModalStackDismissal(
        stackId,
        registry,
        ctx,
        currentController,
        true,
        closingScreenId,
        dismissCount,
        shouldEmitDismissed,
        undefined,
        0,
        false
      );
    },
  });
}

function dismissModalStack(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  animated: boolean,
  closingScreenId: string | undefined
) {
  'worklet';
  const modalNavigationController =
    registry.stackModalNavigationControllers[stackId];

  if (!modalNavigationController) {
    return false;
  }

  const dismissCount = Math.max(
    1,
    arrayCount(modalNavigationController.viewControllers)
  );
  const wasPresentedModally =
    registry.stackModalPresentedModally[stackId] === true;
  let didCompleteDismissal = false;
  const complete = () => {
    'worklet';
    if (
      didCompleteDismissal ||
      registry.stackModalNavigationControllers[stackId] !==
        modalNavigationController
    ) {
      return;
    }

    didCompleteDismissal = true;

    const shouldEmitDismissed =
      registry.stackModalDismissRequestedFromJS[stackId] !== true;

    completeModalStackDismissal(
      stackId,
      registry,
      ctx,
      modalNavigationController,
      wasPresentedModally,
      closingScreenId,
      dismissCount,
      shouldEmitDismissed,
      finalFrame,
      height,
      !wasPresentedModally
    );
  };

  const parentView = modalNavigationController.view?.superview;
  const finalFrame =
    parentView?.bounds ?? modalNavigationController.view?.frame;
  const height = finalFrame?.size?.height ?? 0;

  if (
    wasPresentedModally &&
    typeof modalNavigationController.dismissViewControllerAnimatedCompletion ===
      'function'
  ) {
    modalNavigationController.dismissViewControllerAnimatedCompletion(
      animated,
      complete
    );

    if (typeof setTimeout === 'function') {
      setTimeout(complete, animated ? 420 : 0);
      setTimeout(complete, 700);
    }

    return true;
  }

  animateWithDuration(
    animated ? 0.28 : 0,
    () => {
      'worklet';
      if (modalNavigationController.view && finalFrame) {
        modalNavigationController.view.frame = rectWithY(finalFrame, height);
      }
    },
    complete
  );

  return true;
}

function gestureRecognizerState(name: string, fallback: number) {
  'worklet';
  const state = nativeValue('UIGestureRecognizerState');

  return state?.[name] ?? state?.[name.toLowerCase()] ?? fallback;
}

function modalTopScreenId(
  stackId: string,
  registry: NativeScriptStackRegistry
) {
  'worklet';
  const modalIds = idsFromKey(registry.stackModalKeys[stackId]);

  return modalIds[modalIds.length - 1];
}

function modalDismissGestureEnabled(
  stackId: string,
  registry: NativeScriptStackRegistry
) {
  'worklet';
  const topScreenId = modalTopScreenId(stackId, registry);
  const props = registry.screenProps[topScreenId];

  return (
    props?.preventNativeDismiss !== true && props?.gestureEnabled !== false
  );
}

function installModalDismissPanGesture(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  modalNavigationController: any
) {
  'worklet';
  const UIPanGestureRecognizer = nativeValue('UIPanGestureRecognizer');
  const modalView = modalNavigationController?.view;

  if (!UIPanGestureRecognizer || !modalView || !ctx) {
    return;
  }

  if (
    registry.stackModalDismissPanControllers[stackId] ===
    modalNavigationController
  ) {
    return;
  }

  if (typeof ctx.gestureAction !== 'function') {
    throw new Error(
      '@nativescript/react-native is missing UIKit gestureAction support'
    );
  }

  const allocated = UIPanGestureRecognizer.alloc();
  const pan =
    allocated && typeof allocated.init === 'function'
      ? allocated.init()
      : allocated;

  if (!pan) {
    return;
  }

  pan.cancelsTouchesInView = false;
  pan.delaysTouchesBegan = false;
  pan.delaysTouchesEnded = false;
  pan.maximumNumberOfTouches = 1;

  const endedState = gestureRecognizerState('Ended', 3);
  const recognizedState = gestureRecognizerState('Recognized', 3);
  const topDismissRegion = 280;
  const minimumTranslation = 72;
  const minimumVelocity = 760;

  const delegateProtocol =
    nativeValue('UIGestureRecognizerDelegate') ?? 'UIGestureRecognizerDelegate';
  const delegate = ctx.delegate(pan, delegateProtocol, {
    gestureRecognizerShouldBegin(gesture: any) {
      'worklet';

      if (!modalDismissGestureEnabled(stackId, registry)) {
        return false;
      }

      const location =
        typeof gesture?.locationInView === 'function'
          ? gesture.locationInView(modalView)
          : { x: 0, y: 0 };
      const translation =
        typeof gesture?.translationInView === 'function'
          ? gesture.translationInView(modalView)
          : { x: 0, y: 0 };
      const velocity =
        typeof gesture?.velocityInView === 'function'
          ? gesture.velocityInView(modalView)
          : { x: 0, y: 0 };
      const verticalDelta =
        Math.abs(velocity?.y ?? 0) > Math.abs(translation?.y ?? 0)
          ? (velocity?.y ?? 0)
          : (translation?.y ?? 0);
      const horizontalDelta =
        Math.abs(velocity?.x ?? 0) > Math.abs(translation?.x ?? 0)
          ? (velocity?.x ?? 0)
          : (translation?.x ?? 0);

      return (
        (location?.y ?? 0) <= topDismissRegion &&
        verticalDelta > 0 &&
        Math.abs(verticalDelta) >= Math.abs(horizontalDelta)
      );
    },
    gestureRecognizerShouldRecognizeSimultaneouslyWithGestureRecognizer() {
      'worklet';

      return true;
    },
  });

  pan.delegate = delegate;
  ctx.gestureAction(pan, (gesture: any) => {
    'worklet';
    const state = gesture?.state;

    if (state !== endedState && state !== recognizedState) {
      return;
    }

    if (!modalDismissGestureEnabled(stackId, registry)) {
      return;
    }

    const translation =
      typeof gesture?.translationInView === 'function'
        ? gesture.translationInView(modalView)
        : { x: 0, y: 0 };
    const velocity =
      typeof gesture?.velocityInView === 'function'
        ? gesture.velocityInView(modalView)
        : { x: 0, y: 0 };
    const translationY = translation?.y ?? 0;
    const translationX = translation?.x ?? 0;
    const velocityY = velocity?.y ?? 0;

    if (translationY < minimumTranslation && velocityY < minimumVelocity) {
      return;
    }

    if (translationY < Math.abs(translationX)) {
      return;
    }

    dismissModalStack(
      stackId,
      registry,
      ctx,
      true,
      modalTopScreenId(stackId, registry)
    );
  });

  if (typeof modalView.addGestureRecognizer === 'function') {
    modalView.addGestureRecognizer(pan);
  }
  registry.stackModalDismissPanControllers[stackId] = modalNavigationController;

  ctx.dispose(() => {
    'worklet';
    if (typeof modalView.removeGestureRecognizer === 'function') {
      modalView.removeGestureRecognizer(pan);
    }
    if (
      registry.stackModalDismissPanControllers[stackId] ===
      modalNavigationController
    ) {
      registry.stackModalDismissPanControllers[stackId] = undefined;
    }
  });
}

function presentModalStack(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  parentNavigationController: any,
  modalIds: string[],
  modalControllers: any[],
  animated: boolean
) {
  'worklet';
  const modalNavigationController =
    createNavigationController(modalControllers);
  const rootScreenId = modalIds[0];
  const rootProps = registry.screenProps[rootScreenId];

  if (
    !modalNavigationController ||
    !parentNavigationController?.view ||
    typeof parentNavigationController.addChildViewController !== 'function'
  ) {
    return false;
  }

  configureModalNavigationController(
    modalNavigationController,
    rootProps?.stackPresentation
  );
  installModalPresentationDelegate(
    stackId,
    registry,
    ctx,
    modalNavigationController
  );
  installNativeBackGestureDelegate(modalNavigationController, ctx);
  registry.stackModalNavigationControllers[stackId] = modalNavigationController;
  registry.stackModalKeys[stackId] = idsKey(modalIds);

  const hostController =
    parentNavigationController.tabBarController ?? parentNavigationController;
  const hostView = hostController.view;
  const finalFrame = hostView.bounds;
  const height = finalFrame?.size?.height ?? 0;
  modalNavigationController.view.tag = MODAL_VIEW_TAG;
  modalNavigationController.view.autoresizingMask = flexibleSizeMask();

  configureStackControllers(modalIds, registry);
  configureNavigationAppearance(
    modalNavigationController,
    registry.screenHeaderConfigs[modalIds[modalIds.length - 1]]
  );
  markTransition(stackId, registry, ctx, false, rootScreenId);

  const complete = () => {
    'worklet';
    layoutNavigationStackViews(modalNavigationController);
    configureStackControllers(modalIds, registry);
    configureNavigationAppearance(
      modalNavigationController,
      registry.screenHeaderConfigs[modalIds[modalIds.length - 1]]
    );
    finishTransition(stackId, registry, ctx, false, rootScreenId);
  };

  const alreadyPresentedController = hostController.presentedViewController;

  if (alreadyPresentedController) {
    registry.stackModalNavigationControllers[stackId] =
      alreadyPresentedController;
    registry.stackModalPresentedModally[stackId] = true;
    registry.stackModalKeys[stackId] = idsKey(modalIds);
    installModalPresentationDelegate(
      stackId,
      registry,
      ctx,
      alreadyPresentedController
    );

    if (
      typeof alreadyPresentedController.setViewControllersAnimated ===
      'function'
    ) {
      setNavigationControllerViewControllers(
        alreadyPresentedController,
        modalControllers,
        false
      );
    }

    layoutNavigationStackViews(alreadyPresentedController);
    configureStackControllers(modalIds, registry);
    configureNavigationAppearance(
      alreadyPresentedController,
      registry.screenHeaderConfigs[modalIds[modalIds.length - 1]]
    );
    finishTransition(stackId, registry, ctx, false, rootScreenId);

    return true;
  }

  if (
    typeof hostController.presentViewControllerAnimatedCompletion === 'function'
  ) {
    registry.stackModalPresentedModally[stackId] = true;
    hostController.presentViewControllerAnimatedCompletion(
      modalNavigationController,
      animated,
      complete
    );

    return true;
  }

  registry.stackModalPresentedModally[stackId] = false;
  modalNavigationController.view.tag = MODAL_VIEW_TAG;
  modalNavigationController.view.frame = animated
    ? rectWithY(finalFrame, height)
    : finalFrame;
  modalNavigationController.view.autoresizingMask = flexibleSizeMask();
  hostController.addChildViewController(modalNavigationController);
  hostView.addSubview(modalNavigationController.view);
  if (typeof hostView.bringSubviewToFront === 'function') {
    hostView.bringSubviewToFront(modalNavigationController.view);
  }
  if (
    typeof modalNavigationController.didMoveToParentViewController ===
    'function'
  ) {
    modalNavigationController.didMoveToParentViewController(hostController);
  }
  installModalDismissPanGesture(
    stackId,
    registry,
    ctx,
    modalNavigationController
  );

  animateWithDuration(
    animated ? 0.32 : 0,
    () => {
      'worklet';
      modalNavigationController.view.frame = finalFrame;
    },
    complete
  );

  return true;
}

function screenContentIsReady(
  screenId: string | undefined,
  registry: NativeScriptStackRegistry
) {
  'worklet';

  return !!(screenId && registry.screenContentReady[screenId]);
}

function refreshScreenContentReady(
  screenId: string | undefined,
  controller: any,
  registry: NativeScriptStackRegistry
) {
  'worklet';

  if (!screenId) {
    return false;
  }

  if (screenContentIsReady(screenId, registry)) {
    return true;
  }

  if (
    controller?.view &&
    NativeScriptRuntime.refreshUIKitHostView(controller.view)
  ) {
    registry.screenContentReady[screenId] = true;
    return true;
  }

  return false;
}

function reconcilePresentedModalStack(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  availableIds: string[],
  modalIndex: number,
  animated: boolean
) {
  'worklet';
  const navigationController = registry.stacks[stackId];
  const baseIds = availableIds.slice(0, modalIndex);
  const modalIds = availableIds.slice(modalIndex);
  const base = controllersForIds(baseIds, registry);
  const modal = controllersForIds(modalIds, registry);

  if (
    !navigationController ||
    base.availableIds.length !== baseIds.length ||
    modal.availableIds.length !== modalIds.length
  ) {
    return false;
  }

  const baseNativeIds = navigationControllerScreenIds(
    navigationController,
    registry
  );

  if (!idsEqual(baseNativeIds, baseIds)) {
    setNavigationControllerViewControllers(
      navigationController,
      base.controllers,
      false
    );
  }

  layoutNavigationStackViews(navigationController);
  configureStackControllers(baseIds, registry);
  configureNavigationAppearance(
    navigationController,
    registry.screenHeaderConfigs[baseIds[baseIds.length - 1]]
  );

  const modalKey = idsKey(modalIds);
  const modalNavigationController =
    registry.stackModalNavigationControllers[stackId];

  if (!modalNavigationController) {
    refreshScreenContentReady(
      modal.availableIds[0],
      modal.controllers[0],
      registry
    );

    const didPresent = presentModalStack(
      stackId,
      registry,
      ctx,
      navigationController,
      modalIds,
      modal.controllers,
      animated
    );

    if (didPresent) {
      registry.stackNativeKeys[stackId] = idsKey(availableIds);
      registry.stackNativeCounts[stackId] = availableIds.length;
    }

    return didPresent;
  }

  const modalNativeIds = navigationControllerScreenIds(
    modalNavigationController,
    registry
  );

  if (!idsEqual(modalNativeIds, modalIds)) {
    setNavigationControllerViewControllers(
      modalNavigationController,
      modal.controllers,
      animated
    );
  }

  registry.stackModalKeys[stackId] = modalKey;
  registry.stackNativeKeys[stackId] = idsKey(availableIds);
  registry.stackNativeCounts[stackId] = availableIds.length;
  layoutNavigationStackViews(modalNavigationController);
  configureStackControllers(modalIds, registry);
  configureNavigationAppearance(
    modalNavigationController,
    registry.screenHeaderConfigs[modalIds[modalIds.length - 1]]
  );
  scheduleStackChange(ctx);

  return true;
}

function markNativeScriptScreenContentReady(
  screenId: string,
  parentId: string | undefined
) {
  return (NativeScriptRuntime as any).runOnUI(
    (readyScreenId: string, stackId: string | undefined) => {
      'worklet';
      const registry = getRegistry(globalThis as Record<string, any>);

      registry.screenContentReady[readyScreenId] = true;

      if (!stackId) {
        return;
      }

      const ctx = registry.stackContexts[stackId];
      if (!ctx) {
        return;
      }

      scheduledReconcileStack(stackId, registry, ctx, true);
    },
    screenId,
    parentId
  );
}

function reconcileStack(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  animated: boolean
) {
  'worklet';
  (globalThis as Record<string, any>)[RECONCILE_STACK_KEY] = reconcileStack;

  const navigationController = registry.stacks[stackId];
  const requestedIds = registry.stackActiveScreenIds[stackId] ?? [];
  const { availableIds, controllers } = controllersForIds(
    requestedIds,
    registry
  );
  const nextCount = controllers.length;

  if (!navigationController || nextCount === 0) {
    return;
  }

  if (registry.stackTransitioning[stackId]) {
    if (
      registry.stackTransitionRequestedFromJS[stackId] === true ||
      registry.stackTransitionNativeDriven[stackId] !== true
    ) {
      registry.stackPendingReconcileKeys[stackId] = idsKey(availableIds);
    }

    updateNativeBackGesture(navigationController);
    return;
  }

  if (
    scheduleReconcileAfterNativeTransition(
      stackId,
      registry,
      ctx,
      navigationController
    )
  ) {
    updateNativeBackGesture(navigationController);
    return;
  }

  const previousKey = registry.stackNativeKeys[stackId];
  const previousIds = idsFromKey(previousKey);
  const previousCount = registry.stackNativeCounts[stackId] ?? 0;
  const nextKey = idsKey(availableIds);
  const didChange = previousKey !== nextKey;
  const nativeIds = navigationControllerScreenIds(
    navigationController,
    registry
  );
  const modalIndex = firstModalIndex(availableIds, registry);

  const canAnimateNativeChange =
    animated && navigationController?.view?.window != null;

  if (modalIndex > 0) {
    if (
      reconcilePresentedModalStack(
        stackId,
        registry,
        ctx,
        availableIds,
        modalIndex,
        canAnimateNativeChange
      )
    ) {
      return;
    }
  }

  if (registry.stackModalNavigationControllers[stackId]) {
    const modalIds = idsFromKey(registry.stackModalKeys[stackId]);
    const closingScreenId =
      modalIds[modalIds.length - 1] ?? previousIds[previousIds.length - 1];

    if (
      dismissModalStack(
        stackId,
        registry,
        ctx,
        canAnimateNativeChange,
        closingScreenId
      )
    ) {
      if (didChange) {
        registry.stackNativeKeys[stackId] = nextKey;
        registry.stackNativeCounts[stackId] = nextCount;
      }

      layoutNavigationStackViews(navigationController);
      configureStackControllers(availableIds, registry);
      configureNavigationAppearance(
        navigationController,
        registry.screenHeaderConfigs[availableIds[nextCount - 1]]
      );
      updateNativeBackGesture(navigationController);

      return;
    }
  }

  if (!didChange && idsEqual(nativeIds, availableIds)) {
    updateNativeBackGesture(navigationController);
    layoutNavigationStackViews(navigationController);
    configureStackControllers(availableIds, registry);
    configureNavigationAppearance(
      navigationController,
      registry.screenHeaderConfigs[availableIds[nextCount - 1]]
    );
    return;
  }

  if (canAnimateNativeChange && previousKey != null && previousCount > 0) {
    const isPush =
      nextCount === previousCount + 1 &&
      idsEqual(previousIds, availableIds.slice(0, previousCount));
    const isPushFromNativeStack =
      nativeIds.length > 0 &&
      nextCount === nativeIds.length + 1 &&
      idsEqual(nativeIds, availableIds.slice(0, nativeIds.length));
    const isPop =
      nextCount < previousCount &&
      idsEqual(availableIds, previousIds.slice(0, nextCount));

    if (
      (isPush || isPushFromNativeStack) &&
      nativeIds.length <= previousCount
    ) {
      const pushedScreenId = availableIds[nextCount - 1];
      const pushedController = controllers[nextCount - 1];

      refreshScreenContentReady(pushedScreenId, pushedController, registry);

      const token = markTransition(
        stackId,
        registry,
        ctx,
        false,
        pushedScreenId
      );
      configureScreenController(
        pushedController,
        registry.screenProps[pushedScreenId]!,
        registry.screenContexts[pushedScreenId],
        true,
        nextCount > 1
      );
      if (nextCount > 1) {
        configureSourceBackButton(
          controllers[nextCount - 2]?.navigationItem,
          registry.screenHeaderConfigs[pushedScreenId]
        );
      }

      if (
        animateStackPush(navigationController, controllers, pushedController)
      ) {
        registry.stackNativeKeys[stackId] = nextKey;
        registry.stackNativeCounts[stackId] = nextCount;
        updateNativeBackGesture(navigationController);
        scheduleTransitionFallback(
          stackId,
          registry,
          ctx,
          token,
          false,
          pushedScreenId,
          availableIds,
          navigationController,
          false
        );

        return;
      }

      unlockStackInteractions(stackId, registry);
      registry.stackTransitioning[stackId] = false;
      registry.stackTransitionClosing[stackId] = undefined;
      registry.stackTransitionNativeDriven[stackId] = undefined;
      registry.stackTransitionRequestedFromJS[stackId] = undefined;
      registry.stackTransitionScreenIds[stackId] = undefined;
      registry.stackPendingReconcileKeys[stackId] = undefined;
    }

    if (isPop && nativeIds.length > nextCount) {
      const poppedScreenId = previousIds[nextCount];

      const token = markTransition(
        stackId,
        registry,
        ctx,
        true,
        poppedScreenId
      );
      if (
        animateStackPop(
          navigationController,
          controllers,
          controllers[nextCount - 1],
          nextCount,
          previousCount
        )
      ) {
        registry.stackNativeKeys[stackId] = nextKey;
        registry.stackNativeCounts[stackId] = nextCount;
        updateNativeBackGesture(navigationController);
        scheduleTransitionFallback(
          stackId,
          registry,
          ctx,
          token,
          true,
          poppedScreenId,
          availableIds,
          navigationController,
          true
        );

        return;
      }

      unlockStackInteractions(stackId, registry);
      registry.stackTransitioning[stackId] = false;
      registry.stackTransitionClosing[stackId] = undefined;
      registry.stackTransitionNativeDriven[stackId] = undefined;
      registry.stackTransitionRequestedFromJS[stackId] = undefined;
      registry.stackTransitionScreenIds[stackId] = undefined;
      registry.stackPendingReconcileKeys[stackId] = undefined;
    }
  }

  setNavigationControllerViewControllers(
    navigationController,
    controllers,
    false
  );
  registry.stackNativeKeys[stackId] = nextKey;
  registry.stackNativeCounts[stackId] = nextCount;

  layoutNavigationStackViews(navigationController);
  configureStackControllers(availableIds, registry);
  configureNavigationAppearance(
    navigationController,
    registry.screenHeaderConfigs[availableIds[nextCount - 1]]
  );
  updateNativeBackGesture(navigationController);
  cleanupDetachedScreens(stackId, registry);
}

const NativeScriptStackController = NativeScriptRuntime.defineUIViewController<
  {
    activeScreenIds: string[];
    contentRevision: number;
    onNativeStackChange?: (event: NativeStackChangeEvent) => void;
    onNativeStackTransition?: (event: NativeStackTransitionEvent) => void;
    stackId: string;
    style?: unknown;
  },
  any
>({
  debugName: 'RNSScreenStack.NativeScript',
  layout: { sizing: 'fill' },
  createController(ctx: any) {
    'worklet';
    const UIViewController = nativeValue('UIViewController');
    const UINavigationController = nativeValue('UINavigationController');

    if (!UIViewController || typeof UIViewController.alloc !== 'function') {
      throw new Error('UIViewController is not available in the UI runtime');
    }

    if (
      !UINavigationController ||
      typeof UINavigationController.alloc !== 'function'
    ) {
      throw new Error(
        'UINavigationController is not available in the UI runtime'
      );
    }

    const placeholderAllocated = UIViewController.alloc();
    const placeholder =
      placeholderAllocated && typeof placeholderAllocated.init === 'function'
        ? placeholderAllocated.init()
        : placeholderAllocated;
    const allocated = UINavigationController.alloc();
    const controller =
      allocated && typeof allocated.init === 'function'
        ? allocated.init()
        : allocated;
    const UIView = nativeValue('UIView');

    if (placeholder.view) {
      placeholder.view.backgroundColor = nativeColor(
        undefined,
        'systemBackgroundColor'
      );
    }

    configureExtendedLayout(placeholder);
    configureExtendedLayout(controller);
    configureNavigationAppearance(controller, undefined);

    if (UIView && typeof UIView.alloc === 'function') {
      const mountViewAllocated = UIView.alloc();
      const mountView =
        mountViewAllocated && typeof mountViewAllocated.init === 'function'
          ? mountViewAllocated.init()
          : mountViewAllocated;

      mountView.tag = MOUNT_VIEW_TAG;
      mountView.hidden = true;
      mountView.userInteractionEnabled = false;
      mountView.frame = controller.view.bounds;
      mountView.autoresizingMask = 18;
      controller.view.addSubview(mountView);
    }

    controller.viewControllers = createArray([placeholder]);
    installNativeBackGestureDelegate(controller, ctx);

    const delegateProtocol =
      nativeValue('UINavigationControllerDelegate') ??
      'UINavigationControllerDelegate';

    controller.delegate = ctx.delegate(controller, delegateProtocol, {
      navigationControllerWillShowViewControllerAnimated(
        navigationController: any,
        viewController: any
      ) {
        'worklet';
        const registry = getRegistry(globalThis as Record<string, any>);
        const currentIds = navigationControllerScreenIds(
          navigationController,
          registry
        );
        const nextScreenId = screenIdForController(viewController, registry);
        const nextIndex = nextScreenId ? currentIds.indexOf(nextScreenId) : -1;
        const activeIds =
          registry.stackActiveScreenIds[ctx.props.stackId] ?? [];
        const nativeStackIsAlreadyShorter = shouldEmitNativeStackChange(
          currentIds,
          activeIds
        );
        const closing =
          nativeStackIsAlreadyShorter ||
          (nextIndex >= 0 && nextIndex < Math.max(0, currentIds.length - 1));
        const affectedScreenId = closing
          ? (activeIds[activeIds.length - 1] ??
            currentIds[currentIds.length - 1])
          : (nextScreenId ?? activeIds[activeIds.length - 1]);

        if (!nextScreenId) {
          return;
        }

        if (registry.stackTransitioning[ctx.props.stackId]) {
          return;
        }

        markTransition(
          ctx.props.stackId,
          registry,
          ctx,
          closing,
          affectedScreenId,
          true,
          false
        );
      },
      navigationControllerDidShowViewControllerAnimated(
        navigationController: any,
        viewController: any
      ) {
        'worklet';
        const registry = getRegistry(globalThis as Record<string, any>);
        const screenId = screenIdForController(viewController, registry);
        const shownScreenIds = navigationControllerScreenIds(
          navigationController,
          registry
        );

        if (!screenId) {
          layoutNavigationStackViews(navigationController);
          updateNativeBackGesture(navigationController);

          const activeIds =
            registry.stackActiveScreenIds[ctx.props.stackId] ?? [];
          const previousIds = idsFromKey(
            registry.stackNativeKeys[ctx.props.stackId]
          );
          const nativeCount = arrayCount(navigationController?.viewControllers);
          const isClosing =
            registry.stackTransitionClosing[ctx.props.stackId] === true;
          const fallbackScreenIds = !isClosing
            ? activeIds
            : shownScreenIds.length > 0
              ? shownScreenIds
              : nativeCount > 0 && nativeCount < activeIds.length
                ? activeIds.slice(0, nativeCount)
                : previousIds.length > 1
                  ? previousIds.slice(0, previousIds.length - 1)
                  : activeIds;
          const shouldEmitStackChange =
            shouldEmitNativeStackChange(fallbackScreenIds, activeIds) &&
            isClosing;
          const fallbackDismissCount =
            activeIds.length - fallbackScreenIds.length;

          if (shouldEmitStackChange) {
            const applyFallbackControllers = () => {
              'worklet';
              const fallback = controllersForIds(fallbackScreenIds, registry);

              if (
                fallback.availableIds.length === 0 ||
                fallback.availableIds.length !== fallbackScreenIds.length
              ) {
                return;
              }

              setNavigationControllerViewControllers(
                navigationController,
                fallback.controllers,
                false
              );
              layoutNavigationStackViews(navigationController);
              configureStackControllers(fallback.availableIds, registry);
              configureNavigationAppearance(
                navigationController,
                registry.screenHeaderConfigs[
                  fallback.availableIds[fallback.availableIds.length - 1]
                ]
              );
              updateNativeBackGesture(navigationController);
            };

            applyFallbackControllers();

            if (typeof setTimeout === 'function') {
              setTimeout(applyFallbackControllers, 0);
              setTimeout(applyFallbackControllers, 64);
              setTimeout(applyFallbackControllers, 250);
            }
          }

          if (shouldEmitStackChange) {
            emitScreenDismissed(
              registry,
              activeIds[fallbackScreenIds.length],
              fallbackDismissCount
            );
          }

          if (registry.stackTransitioning[ctx.props.stackId] === true) {
            if (fallbackScreenIds.length > 0) {
              registry.stackNativeKeys[ctx.props.stackId] =
                idsKey(fallbackScreenIds);
              registry.stackNativeCounts[ctx.props.stackId] =
                fallbackScreenIds.length;
            }

            finishTransition(
              ctx.props.stackId,
              registry,
              ctx,
              isClosing,
              registry.stackTransitionScreenIds[ctx.props.stackId],
              registry.stackTransitionNativeDriven[ctx.props.stackId] ===
                true || shouldEmitStackChange
            );
          } else if (fallbackScreenIds.length > 0) {
            registry.stackNativeKeys[ctx.props.stackId] =
              idsKey(fallbackScreenIds);
            registry.stackNativeCounts[ctx.props.stackId] =
              fallbackScreenIds.length;
          }

          if (shouldEmitStackChange) {
            emitStackChangeForIds(ctx, fallbackScreenIds);
          }

          return;
        }

        layoutNavigationStackViews(navigationController);
        configureStackControllers(shownScreenIds, registry);
        updateNativeBackGesture(navigationController);
        configureNavigationAppearance(
          navigationController,
          registry.screenHeaderConfigs[screenId]
        );
        registry.stackNativeKeys[ctx.props.stackId] = idsKey(shownScreenIds);
        registry.stackNativeCounts[ctx.props.stackId] = shownScreenIds.length;
        const isTransitioning =
          registry.stackTransitioning[ctx.props.stackId] === true;
        const wasClosing =
          registry.stackTransitionClosing[ctx.props.stackId] === true;
        const wasRequestedFromJS =
          registry.stackTransitionRequestedFromJS[ctx.props.stackId] === true;
        const transitionScreenId =
          registry.stackTransitionScreenIds[ctx.props.stackId] ?? screenId;
        const activeIds =
          registry.stackActiveScreenIds[ctx.props.stackId] ?? [];
        const didNativeStackDismiss =
          wasClosing &&
          !wasRequestedFromJS &&
          shouldEmitNativeStackChange(shownScreenIds, activeIds);
        const didCancelNativeDismiss =
          isTransitioning &&
          wasClosing &&
          !wasRequestedFromJS &&
          !didNativeStackDismiss &&
          idsEqual(shownScreenIds, activeIds);
        const shouldEmitStackChange =
          !didCancelNativeDismiss &&
          !wasRequestedFromJS &&
          (registry.stackTransitionNativeDriven[ctx.props.stackId] === true ||
            shouldEmitNativeStackChange(shownScreenIds, activeIds));
        const dismissCount = activeIds.length - shownScreenIds.length;
        const shouldEmitDismissed =
          shouldEmitStackChange &&
          dismissCount > 0 &&
          didNativeStackDismiss;

        if (shouldEmitDismissed) {
          emitScreenDismissed(
            registry,
            activeIds[shownScreenIds.length],
            dismissCount
          );
        }

        if (isTransitioning) {
          finishTransition(
            ctx.props.stackId,
            registry,
            ctx,
            wasClosing,
            transitionScreenId,
            shouldEmitStackChange,
            didCancelNativeDismiss
          );
        } else if (shouldEmitStackChange) {
          scheduleStackChange(ctx);
        }

        if (isTransitioning && !wasClosing) {
          reconcileStack(ctx.props.stackId, registry, ctx, true);
        } else if (isTransitioning && !shouldEmitStackChange) {
          if (!idsEqual(shownScreenIds, activeIds)) {
            reconcileStack(ctx.props.stackId, registry, ctx, true);
          }
        }
      },
    });

    return controller;
  },
  childrenView(controller) {
    'worklet';
    const existingMountView =
      controller.view && typeof controller.view.viewWithTag === 'function'
        ? controller.view.viewWithTag(MOUNT_VIEW_TAG)
        : null;

    if (existingMountView) {
      return existingMountView;
    }

    return controller.view;
  },
  mounted(controller, props, ctx) {
    'worklet';
    const registry = getRegistry(globalThis as Record<string, any>);

    registry.stacks[props.stackId] = controller;
    registry.stackContexts[props.stackId] = ctx;
    registry.stackActiveScreenIds[props.stackId] = props.activeScreenIds;
    reconcileStack(props.stackId, registry, ctx, false);
  },
  update(controller, props, _previousProps, ctx) {
    'worklet';
    const registry = getRegistry(globalThis as Record<string, any>);

    registry.stacks[props.stackId] = controller;
    registry.stackContexts[props.stackId] = ctx;
    registry.stackActiveScreenIds[props.stackId] = props.activeScreenIds;
    reconcileStack(props.stackId, registry, ctx, true);
  },
  dispose(_controller, props) {
    'worklet';
    const registry = (globalThis as Record<string, any>)[REGISTRY_KEY];

    if (!registry) {
      return;
    }

    ensureRegistryShape(registry);
    unlockStackInteractions(props.stackId, registry);
    registry.stacks[props.stackId] = undefined;
    registry.stackContexts[props.stackId] = undefined;
    registry.stackActiveScreenIds[props.stackId] = undefined;
    registry.stackNativeKeys[props.stackId] = undefined;
    registry.stackNativeCounts[props.stackId] = undefined;
    registry.stackTransitioning[props.stackId] = undefined;
    registry.stackTransitionClosing[props.stackId] = undefined;
    registry.stackTransitionNativeDriven[props.stackId] = undefined;
    registry.stackTransitionRequestedFromJS[props.stackId] = undefined;
    registry.stackTransitionScreenIds[props.stackId] = undefined;
    registry.stackTransitionTokens[props.stackId] = undefined;
    registry.stackPendingReconcileKeys[props.stackId] = undefined;
    registry.stackUpdatesScheduled[props.stackId] = undefined;
    registry.stackModalNavigationControllers[props.stackId] = undefined;
    registry.stackModalKeys[props.stackId] = undefined;
    registry.stackModalPresentedModally[props.stackId] = undefined;
    registry.stackModalDismissRequestedFromJS[props.stackId] = undefined;
    registry.stackModalDismissPanControllers[props.stackId] = undefined;
  },
});

const NativeScriptScreenController = NativeScriptRuntime.defineUIViewController<
  NativeScriptScreenStackItemProps,
  any
>({
  debugName: 'RNSScreen.NativeScript',
  layout: { sizing: 'fill' },
  createController(props) {
    'worklet';
    const UIViewController = nativeValue('UIViewController');

    if (!UIViewController || typeof UIViewController.alloc !== 'function') {
      throw new Error('UIViewController is not available in the UI runtime');
    }

    const allocated = UIViewController.alloc();
    const controller =
      allocated && typeof allocated.init === 'function'
        ? allocated.init()
        : allocated;

    configureScreenController(controller, props);

    return controller;
  },
  childrenView(controller) {
    'worklet';

    return controller.view;
  },
  mounted(controller, props, ctx) {
    'worklet';
    const registry = getRegistry(globalThis as Record<string, any>);

    registry.screens[props.screenId] = controller;
    registry.screenControllerHashes[props.screenId] =
      controllerHash(controller);
    registry.screenHeaderConfigs[props.screenId] = props.headerConfig;
    registry.screenContexts[props.screenId] = ctx;
    registry.screenParents[props.screenId] = props.parentId;
    registry.screenProps[props.screenId] = props;
    configureScreenController(controller, props, ctx);

    if (props.parentId) {
      const shouldAnimate = registry.stackNativeKeys[props.parentId] != null;

      reconcileStack(
        props.parentId,
        registry,
        registry.stackContexts[props.parentId],
        shouldAnimate
      );
    }
  },
  update(controller, props, _previousProps, ctx) {
    'worklet';
    const registry = getRegistry(globalThis as Record<string, any>);

    registry.screens[props.screenId] = controller;
    registry.screenControllerHashes[props.screenId] =
      controllerHash(controller);
    registry.screenHeaderConfigs[props.screenId] = props.headerConfig;
    registry.screenContexts[props.screenId] = ctx;
    registry.screenParents[props.screenId] = props.parentId;
    registry.screenProps[props.screenId] = props;
    configureScreenController(controller, props, ctx);

    if (props.parentId) {
      reconcileStack(
        props.parentId,
        registry,
        registry.stackContexts[props.parentId],
        true
      );
    }
  },
  dispose(controller, props) {
    'worklet';
    const registry = (globalThis as Record<string, any>)[REGISTRY_KEY];

    if (!registry) {
      return;
    }

    const shouldRetainForNativePop =
      props.parentId &&
      screenControllerIsVisibleInNativeStack(
        props.parentId,
        controller,
        registry
      );

    if (shouldRetainForNativePop) {
      registry.screens[props.screenId] = controller;
      registry.screenControllerHashes[props.screenId] =
        controllerHash(controller);
      registry.screenHeaderConfigs[props.screenId] = props.headerConfig;
      registry.screenParents[props.screenId] = props.parentId;
      registry.screenProps[props.screenId] = props;
    } else {
      clearScreenRecord(registry, props.screenId);
    }

    if (props.parentId) {
      reconcileStack(
        props.parentId,
        registry,
        registry.stackContexts[props.parentId],
        Boolean(shouldRetainForNativePop)
      );
    }
  },
});

export function NativeScriptScreenStack({
  children,
  onFinishTransitioning,
  onNativeStackChange,
  onNativeStackTransition,
  style,
}: NativeScriptScreenStackProps) {
  const stackId = React.useRef<string | null>(null);
  const itemPropsByScreenIdRef = React.useRef<
    Map<string, NativeScriptScreenStackItemProps>
  >(new Map());
  const registeredItemsRef = React.useRef<Map<string, RegisteredStackItem>>(
    new Map()
  );
  const nextItemOrderRef = React.useRef(0);
  const activeScreenIdsRef = React.useRef<string[]>([]);
  const [contentRevision, forceVersion] = React.useReducer(
    (value: number) => value + 1,
    0
  );

  if (stackId.current === null) {
    nextStackId += 1;
    stackId.current = `rn-ns-stack-${nextStackId}`;
  }

  const registerScreen = React.useCallback(
    (
      screenId: string,
      props: NativeScriptScreenStackItemProps,
      active: boolean
    ) => {
      const existing = registeredItemsRef.current.get(screenId);
      const order = existing?.order ?? nextItemOrderRef.current++;
      const shouldUpdate =
        !existing ||
        existing.active !== active ||
        existing.props.parentId !== props.parentId ||
        existing.props.headerConfig !== props.headerConfig;

      registeredItemsRef.current.set(screenId, {
        active,
        order,
        props,
      });
      itemPropsByScreenIdRef.current.set(screenId, props);

      if (shouldUpdate) {
        forceVersion();
      }
    },
    []
  );

  const unregisterScreen = React.useCallback((screenId: string) => {
    const didDelete = registeredItemsRef.current.delete(screenId);
    itemPropsByScreenIdRef.current.delete(screenId);

    if (didDelete) {
      forceVersion();
    }
  }, []);

  const contextValue = React.useMemo(
    () => ({
      registerScreen,
      stackId: stackId.current!,
      unregisterScreen,
    }),
    [registerScreen, unregisterScreen]
  );

  const activeScreenIds = Array.from(registeredItemsRef.current.entries())
    .filter(([, item]) => item.active)
    .sort((left, right) => left[1].order - right[1].order)
    .map(([screenId]) => screenId);

  activeScreenIdsRef.current = activeScreenIds;

  const handleNativeStackChange = React.useCallback(
    (event: NativeStackChangeEvent) => {
      onNativeStackChange?.(event);

      const nativeScreenIds = event.nativeEvent.screenIds;
      const activeIds = activeScreenIdsRef.current;

      if (nativeScreenIds.length === 0) {
        return;
      }

      if (nativeScreenIds.length >= activeIds.length) {
        return;
      }

      for (let index = 0; index < nativeScreenIds.length; index += 1) {
        if (nativeScreenIds[index] !== activeIds[index]) {
          return;
        }
      }

      const dismissedScreenId = activeIds[nativeScreenIds.length];
      const dismissedProps =
        itemPropsByScreenIdRef.current.get(dismissedScreenId);

      dismissedProps?.onDismissed?.({
        nativeEvent: {
          dismissCount: activeIds.length - nativeScreenIds.length,
        },
      } as Parameters<NonNullable<ScreenProps['onDismissed']>>[0]);
    },
    [onNativeStackChange]
  );

  const handleNativeTransition = React.useCallback(
    (event: NativeStackTransitionEvent) => {
      onNativeStackTransition?.(event);

      const { cancelled, closing, phase, screenId } = event.nativeEvent;

      const itemProps = itemPropsByScreenIdRef.current.get(screenId);

      if (phase === 'end') {
        onFinishTransitioning?.({
          nativeEvent: {},
        } as Parameters<NonNullable<ScreenStackProps['onFinishTransitioning']>>[0]);
      }

      if (!itemProps) {
        return;
      }

      if (phase === 'end' && cancelled) {
        itemProps.onGestureCancel?.(({
          nativeEvent: null,
        } as unknown) as Parameters<
          NonNullable<ScreenProps['onGestureCancel']>
        >[0]);
        return;
      }

      if (phase === 'start') {
        if (closing) {
          itemProps.onWillDisappear?.({ nativeEvent: {} } as Parameters<
            NonNullable<ScreenProps['onWillDisappear']>
          >[0]);
        } else {
          itemProps.onWillAppear?.({ nativeEvent: {} } as Parameters<
            NonNullable<ScreenProps['onWillAppear']>
          >[0]);
        }
      } else if (closing) {
        itemProps.onDisappear?.({ nativeEvent: {} } as Parameters<
          NonNullable<ScreenProps['onDisappear']>
        >[0]);
      } else {
        itemProps.onAppear?.({ nativeEvent: {} } as Parameters<
          NonNullable<ScreenProps['onAppear']>
        >[0]);
      }
    },
    [onFinishTransitioning, onNativeStackTransition]
  );

  return (
    <NativeScriptScreenStackContext.Provider value={contextValue}>
      <NativeScriptStackController
        activeScreenIds={activeScreenIds}
        attachController
        contentRevision={contentRevision}
        onNativeStackChange={handleNativeStackChange}
        onNativeStackTransition={handleNativeTransition}
        stackId={stackId.current}
        style={style}
      >
        {children}
      </NativeScriptStackController>
    </NativeScriptScreenStackContext.Provider>
  );
}

export const NativeScriptScreenStackItem = React.forwardRef<
  View,
  NativeScriptScreenStackItemProps
>(function NativeScriptScreenStackItem(
  {
    children,
    contentStyle,
    headerConfig,
    onHeaderHeightChange,
    parentId,
    screenId,
    stackPresentation,
    style,
    ...rest
  },
  ref
) {
  const stackContext = React.useContext(NativeScriptScreenStackContext);
  const resolvedParentId = parentId ?? stackContext?.stackId;
  const active = rest.activityState !== 0;
  const registeredPropsRef =
    React.useRef<NativeScriptScreenStackItemProps | null>(null);
  const onLayoutProp = rest.onLayout;
  const shouldAttachControllerView =
    stackPresentation != null && stackPresentation !== 'push';

  registeredPropsRef.current = {
    ...rest,
    contentStyle,
    headerConfig,
    onHeaderHeightChange,
    parentId: resolvedParentId,
    screenId,
    stackPresentation,
    style,
  } as NativeScriptScreenStackItemProps;

  const content = (
    <View
      ref={ref}
      accessibilityElementsHidden={rest['aria-hidden'] === true}
      aria-hidden={rest['aria-hidden']}
      pointerEvents={rest.pointerEvents}
      importantForAccessibility={
        rest['aria-hidden'] === true ? 'no-hide-descendants' : 'auto'
      }
      onLayout={onLayoutProp}
      style={[styles.content, contentStyle]}
    >
      {children}
    </View>
  );

  React.useLayoutEffect(() => {
    if (!stackContext) {
      return;
    }

    return () => {
      stackContext.unregisterScreen(screenId);
    };
  }, [screenId, stackContext]);

  React.useLayoutEffect(() => {
    if (!stackContext) {
      return;
    }

    stackContext.registerScreen(screenId, registeredPropsRef.current!, active);
  });

  const handleHostReady = React.useCallback(
    (event: { nativeEvent?: { hasChildren?: boolean } }) => {
      if (event.nativeEvent?.hasChildren !== true) {
        return;
      }

      markNativeScriptScreenContentReady(screenId, resolvedParentId).catch(
        () => {
          // Runtime failures surface through the host view; this callback is
          // only the native content-ready signal for hosted layout refreshes.
        }
      );
    },
    [resolvedParentId, screenId]
  );

  return (
    <NativeScriptScreenController
      {...rest}
      attachController={false}
      attachControllerView={shouldAttachControllerView}
      attachNativeView={false}
      contentStyle={contentStyle}
      headerConfig={headerConfig}
      onHeaderHeightChange={onHeaderHeightChange}
      onHostReady={handleHostReady}
      parentId={resolvedParentId}
      screenId={screenId}
      stackPresentation={stackPresentation}
      style={[styles.screen, style]}
    >
      {content}
    </NativeScriptScreenController>
  );
});

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  screen: {
    ...StyleSheet.absoluteFill,
  },
});
