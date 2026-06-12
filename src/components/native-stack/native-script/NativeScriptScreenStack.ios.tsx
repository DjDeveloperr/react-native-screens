import * as NativeScriptRuntime from '@nativescript/react-native';
import * as React from 'react';
import {
  Animated,
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import TransitionProgressContext from '../../../TransitionProgressContext';
import type {
  SearchBarPlacement,
  ScreenContainerProps,
  ScreenProps,
  ScreenStackProps,
  ScreenStackHeaderConfigProps,
} from '../../../types';

const REGISTRY_KEY = '__rnsNativeScriptStackRegistry';
const RECONCILE_STACK_KEY = '__rnsNativeScriptReconcileStack';
const HEADER_SUBVIEW_REGISTRY_KEY = '__rnsNativeScriptHeaderSubviewRegistry';
const HEADER_SUBVIEW_UPDATE_KEY = '__rnsNativeScriptHeaderSubviewDidUpdate';
const MOUNT_VIEW_TAG = 82734091;
const BACK_BUTTON_TAG = 82734092;
const TRANSITION_COORDINATOR_COMPLETION_BLOCK = 'v@?@';
const UI_ACTION_HANDLER_BLOCK = 'v@?@';
const SHEET_ANIMATE_CHANGES_BLOCK = 'v@?';
const SHEET_DETENT_RESOLVER_BLOCK = 'd@?@';
const RNS_DEFAULT_TRANSITION_DURATION_SECONDS = 0.5;
const RNS_TRANSITION_DURATION_FOR_PROPORTION_SECONDS = 0.35;
const RNS_SLIDE_OPEN_TRANSITION_DURATION_PROPORTION = 1;
const RNS_FADE_OPEN_TRANSITION_DURATION_PROPORTION =
  0.2 / RNS_TRANSITION_DURATION_FOR_PROPORTION_SECONDS;
const RNS_SLIDE_CLOSE_TRANSITION_DURATION_PROPORTION =
  0.25 / RNS_TRANSITION_DURATION_FOR_PROPORTION_SECONDS;
const RNS_FADE_CLOSE_TRANSITION_DURATION_PROPORTION =
  0.15 / RNS_TRANSITION_DURATION_FOR_PROPORTION_SECONDS;
const RNS_FADE_CLOSE_DELAY_TRANSITION_DURATION_PROPORTION =
  0.1 / RNS_TRANSITION_DURATION_FOR_PROPORTION_SECONDS;
const RNS_SHADOW_VIEW_MAX_ALPHA = 0.1;
const NAVIGATION_OPERATION_PUSH = 1;
const NAVIGATION_OPERATION_POP = 2;
const RETAINED_SCREEN_RELEASE_TIMEOUT_MS = 700;
const SCREEN_ID_SEPARATOR = '\u001f';
const SHEET_FIT_TO_CONTENTS = -1;
const SHEET_LARGEST_UNDIMMED_DETENT_NONE = -1;
const SCREEN_CONTROLLER_CLASS_KEY = '__rnsNativeScriptScreenControllerClass';
const SCREEN_CONTAINER_CONTROLLER_CLASS_KEY =
  '__rnsNativeScriptScreenContainerControllerClass';
const NAVIGATION_CONTROLLER_CLASS_KEY =
  '__rnsNativeScriptNavigationControllerClass';
const STACK_CONTAINER_VIEW_CLASS_KEY =
  '__rnsNativeScriptStackContainerViewClass';
const SCREEN_STACK_ANIMATOR_CLASS_KEY =
  '__rnsNativeScriptScreenStackAnimatorClass';
const PERCENT_DRIVEN_INTERACTIVE_TRANSITION_CLASS_KEY =
  '__rnsNativeScriptPercentDrivenInteractiveTransitionClass';
const BACK_BAR_BUTTON_ITEM_CLASS_KEY =
  '__rnsNativeScriptBackBarButtonItemClass';
const COMPLETE_NATIVE_PRESENTED_MODAL_DISMISSAL_KEY =
  '__rnsNativeScriptCompleteNativePresentedModalDismissal';

let nextStackId = 0;
let nextContainerId = 0;
let nextScreenId = 0;

type NativeScriptStackRegistry = {
  containers: Record<string, any>;
  containerActiveScreenIds: Record<string, string[]>;
  containerContexts: Record<string, any>;
  containerHasTwoStates: Record<string, boolean | undefined>;
  containerNativeKeys: Record<string, string | undefined>;
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
  stackTransitionSettling: Record<string, boolean | undefined>;
  stackTransitionTokens: Record<string, number | undefined>;
  stackPendingReconcileKeys: Record<string, string | undefined>;
  stackPropRevisions: Record<string, number | undefined>;
  stackInteractionControllers: Record<string, any>;
  stackPendingDismissCancels: Record<
    string,
    | {
        fromController: any;
        toController: any;
      }
    | undefined
  >;
  stackFullWidthSwipingWithPanGesture: Record<string, boolean | undefined>;
  stackCustomAnimationOnSwipe: Record<string, boolean | undefined>;
  stackSwipeGesturesInstalled: Record<string, boolean | undefined>;
  stackUpdatesScheduled: Record<string, boolean | undefined>;
  stackPresentedModalKeys: Record<string, string | undefined>;
  stackUpdatingModals: Record<string, boolean | undefined>;
  stackScheduledModalUpdates: Record<string, boolean | undefined>;
  screenContentReady: Record<string, boolean | undefined>;
  screenHeaderConfigs: Record<string, ScreenStackHeaderConfigProps | undefined>;
  screenContexts: Record<string, any>;
  screenControllerHashes: Record<string, number | string | undefined>;
  screenContentWrapperViews: Record<string, any>;
  screenParents: Record<string, string | undefined>;
  screenProps: Record<string, NativeScriptScreenStackItemProps | undefined>;
  screenSheetContentHeights: Record<string, number | undefined>;
  screenSheetInitialDetentsSet: Record<string, boolean | undefined>;
};

type NativeStackTransitionEvent = {
  nativeEvent: {
    cancelled?: boolean;
    phase: 'start' | 'end';
    closing: boolean;
    nativeDriven?: boolean;
    requestedFromJS?: boolean;
    screenId: string;
  };
};

type NativeScriptHeaderBarButtonItem = NonNullable<
  ScreenStackHeaderConfigProps['headerRightBarButtonItems']
>[number];
type NativeScriptHeaderConfiguredBarButtonItem = Exclude<
  NativeScriptHeaderBarButtonItem,
  { type: 'spacing' }
>;
type NativeScriptHeaderMenuBarButtonItem = Extract<
  NativeScriptHeaderBarButtonItem,
  { type: 'menu' }
>;
type NativeScriptHeaderMenuItem = NonNullable<
  NativeScriptHeaderMenuBarButtonItem['menu']
>['items'][number];
type NativeScriptHeaderMenuActionItem = Extract<
  NativeScriptHeaderMenuItem,
  { type: 'action' }
>;
type NativeScriptHeaderMenuConfig =
  | NativeScriptHeaderMenuBarButtonItem['menu']
  | Extract<NativeScriptHeaderMenuItem, { type: 'submenu' }>;

export type NativeScriptHeaderSubviewType =
  | 'back'
  | 'left'
  | 'right'
  | 'title'
  | 'center'
  | 'searchBar';

export type NativeScriptHeaderSubviewRegistration = {
  allowToolbarIntegration?: boolean;
  backImageIsTemplate?: boolean;
  backImageSource?: unknown;
  hidesSharedBackground?: boolean;
  hideWhenScrolling?: boolean;
  order: number;
  placement?: SearchBarPlacement;
  screenId: string;
  searchController?: any;
  subviewId: string;
  type: NativeScriptHeaderSubviewType;
};

type NativeScriptHeaderSubviewRecord = NativeScriptHeaderSubviewRegistration & {
  nativeView: any;
};

type NativeScriptScreenStackProps = ScreenStackProps & {
  children?: React.ReactNode;
  onNativeStackTransition?: (event: NativeStackTransitionEvent) => void;
  style?: StyleProp<ViewStyle>;
};

type NativeScriptScreenContainerProps = ScreenContainerProps & {
  children?: React.ReactNode;
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
    retainedByStack?: boolean | undefined;
    screenId: string;
  };

type RegisteredStackItem = {
  active: boolean;
  order: number;
  props: NativeScriptScreenStackItemProps;
};

type NativeScriptStackChildRecord = {
  element: React.ReactElement;
  order: number;
};

type NativeScriptScreenStackContextValue = {
  isScreenRetained: (screenId: string) => boolean;
  stackId: string;
  registerScreen: (
    screenId: string,
    props: NativeScriptScreenStackItemProps,
    active: boolean,
  ) => void;
  unregisterScreen: (screenId: string) => void;
};

const NativeScriptScreenStackContext =
  React.createContext<NativeScriptScreenStackContextValue | null>(null);

type NativeScriptScreenContainerContextValue = {
  containerId: string;
  hasTwoStates: boolean;
  registerScreen: (
    screenId: string,
    props: NativeScriptScreenStackItemProps,
    active: boolean,
  ) => void;
  unregisterScreen: (screenId: string) => void;
};

const NativeScriptScreenContainerContext =
  React.createContext<NativeScriptScreenContainerContextValue | null>(null);

export const NativeScriptScreenHeaderSubviewContext = React.createContext<{
  screenId: string;
} | null>(null);

export const NativeScriptScreenHeaderSearchBarContext = React.createContext<{
  order: number;
} | null>(null);

function ensureRegistryShape(registry: Record<string, any>) {
  'worklet';
  const keys = [
    'containers',
    'containerActiveScreenIds',
    'containerContexts',
    'containerHasTwoStates',
    'containerNativeKeys',
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
    'stackTransitionSettling',
    'stackTransitionTokens',
    'stackPendingReconcileKeys',
    'stackPropRevisions',
    'stackInteractionControllers',
    'stackPendingDismissCancels',
    'stackFullWidthSwipingWithPanGesture',
    'stackCustomAnimationOnSwipe',
    'stackSwipeGesturesInstalled',
    'stackUpdatesScheduled',
    'stackPresentedModalKeys',
    'stackUpdatingModals',
    'stackScheduledModalUpdates',
    'screenContentReady',
    'screenHeaderConfigs',
    'screenContexts',
    'screenControllerHashes',
    'screenContentWrapperViews',
    'screenParents',
    'screenProps',
    'screenSheetContentHeights',
    'screenSheetInitialDetentsSet',
  ];

  for (const key of keys) {
    if (!registry[key]) {
      registry[key] = {};
    }
  }
}

function getRegistry(
  globalObject: Record<string, any>,
): NativeScriptStackRegistry {
  'worklet';
  const existing = globalObject[REGISTRY_KEY];

  if (existing) {
    ensureRegistryShape(existing);
    return existing;
  }

  const registry = {
    containers: {},
    containerActiveScreenIds: {},
    containerContexts: {},
    containerHasTwoStates: {},
    containerNativeKeys: {},
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
    stackTransitionSettling: {},
    stackTransitionTokens: {},
    stackPendingReconcileKeys: {},
    stackPropRevisions: {},
    stackInteractionControllers: {},
    stackPendingDismissCancels: {},
    stackFullWidthSwipingWithPanGesture: {},
    stackCustomAnimationOnSwipe: {},
    stackSwipeGesturesInstalled: {},
    stackUpdatesScheduled: {},
    stackPresentedModalKeys: {},
    stackUpdatingModals: {},
    stackScheduledModalUpdates: {},
    screenContentReady: {},
    screenHeaderConfigs: {},
    screenContexts: {},
    screenControllerHashes: {},
    screenContentWrapperViews: {},
    screenParents: {},
    screenProps: {},
    screenSheetContentHeights: {},
    screenSheetInitialDetentsSet: {},
  };

  globalObject[REGISTRY_KEY] = registry;
  ensureRegistryShape(registry);

  return registry;
}

function headerSubviewRegistry(globalObject: Record<string, any>) {
  'worklet';
  const existing = globalObject[HEADER_SUBVIEW_REGISTRY_KEY];

  if (existing && typeof existing === 'object') {
    return existing as Record<
      string,
      Record<string, NativeScriptHeaderSubviewRecord>
    >;
  }

  const registry: Record<
    string,
    Record<string, NativeScriptHeaderSubviewRecord>
  > = {};
  globalObject[HEADER_SUBVIEW_REGISTRY_KEY] = registry;
  return registry;
}

function headerSubviewRecordsForScreen(screenId: string) {
  'worklet';
  const registry = headerSubviewRegistry(globalThis as Record<string, any>);
  const records = Object.values(registry[screenId] ?? {});

  return records.sort((left, right) => left.order - right.order);
}

export function registerNativeScriptHeaderSubview(
  registration: NativeScriptHeaderSubviewRegistration,
  nativeView: any,
) {
  'worklet';
  const registry = headerSubviewRegistry(globalThis as Record<string, any>);
  const screenRecords = registry[registration.screenId] ?? {};

  screenRecords[registration.subviewId] = {
    ...registration,
    nativeView,
  };
  registry[registration.screenId] = screenRecords;
}

export function unregisterNativeScriptHeaderSubview(
  screenId: string,
  subviewId: string,
) {
  'worklet';
  const registry = headerSubviewRegistry(globalThis as Record<string, any>);
  const screenRecords = registry[screenId];

  if (!screenRecords) {
    return;
  }

  const nextScreenRecords: Record<string, NativeScriptHeaderSubviewRecord> = {};
  const subviewIds = Object.keys(screenRecords);
  for (const nextSubviewId of subviewIds) {
    if (nextSubviewId !== subviewId) {
      nextScreenRecords[nextSubviewId] = screenRecords[nextSubviewId];
    }
  }

  if (Object.keys(nextScreenRecords).length === 0) {
    const nextRegistry: Record<
      string,
      Record<string, NativeScriptHeaderSubviewRecord>
    > = {};
    const screenIds = Object.keys(registry);
    for (const nextScreenId of screenIds) {
      if (nextScreenId !== screenId) {
        nextRegistry[nextScreenId] = registry[nextScreenId];
      }
    }
    (globalThis as Record<string, any>)[HEADER_SUBVIEW_REGISTRY_KEY] =
      nextRegistry;
  } else {
    registry[screenId] = nextScreenRecords;
  }
}

export function notifyNativeScriptHeaderSubviewChanged(screenId: string) {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const notify = globalObject[HEADER_SUBVIEW_UPDATE_KEY];

  if (typeof notify === 'function') {
    notify(screenId);
  }
}

export const __nativeScriptRegisterHeaderSubviewForTests =
  registerNativeScriptHeaderSubview;
export const __nativeScriptUnregisterHeaderSubviewForTests =
  unregisterNativeScriptHeaderSubview;

function nativeValue(name: string) {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const api = globalObject.__nativeScriptNativeApi;

  return api?.[name] ?? globalObject[name];
}

function nativeProtocol(name: string) {
  'worklet';
  const globalObject = globalThis as Record<string, any>;

  return (
    nativeValue(name) ??
    globalObject.NativeScript?.getProtocol?.(name) ??
    globalObject.__nativeScriptNativeApi?.getProtocol?.(name)
  );
}

function nativeBool(receiver: any, name: string, fallback = false) {
  'worklet';
  const value = receiver?.[name];

  if (typeof value === 'function') {
    return receiver[name]() === true;
  }

  if (value == null) {
    return fallback;
  }

  return value === true;
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
              .map(part => part + part)
              .join('')
          : hex.length === 4
          ? hex
              .slice(0, 3)
              .split('')
              .map(part => part + part)
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

function userInterfaceStyleForHeaderConfig(
  headerConfig?: ScreenStackHeaderConfigProps,
) {
  'worklet';
  const style = nativeValue('UIUserInterfaceStyle');

  if (headerConfig?.experimental_userInterfaceStyle === 'light') {
    return style?.Light ?? style?.light ?? 1;
  }

  if (headerConfig?.experimental_userInterfaceStyle === 'dark') {
    return style?.Dark ?? style?.dark ?? 2;
  }

  return style?.Unspecified ?? style?.unspecified ?? 0;
}

function semanticContentAttributeForDirection(direction: unknown) {
  'worklet';
  const attribute = nativeValue('UISemanticContentAttribute');

  if (direction === 'rtl') {
    return (
      attribute?.ForceRightToLeft ??
      attribute?.forceRightToLeft ??
      attribute?.forceRTL ??
      4
    );
  }

  if (direction === 'ltr') {
    return (
      attribute?.ForceLeftToRight ??
      attribute?.forceLeftToRight ??
      attribute?.forceLTR ??
      3
    );
  }

  return null;
}

function headerFontWeight(weight: unknown, boldDefault: boolean) {
  'worklet';
  const UIFontWeight = nativeValue('UIFontWeight');

  switch (weight) {
    case '100':
    case 'ultralight':
      return UIFontWeight?.UltraLight ?? UIFontWeight?.ultraLight ?? -0.8;
    case '200':
    case 'thin':
      return UIFontWeight?.Thin ?? UIFontWeight?.thin ?? -0.6;
    case '300':
    case 'light':
      return UIFontWeight?.Light ?? UIFontWeight?.light ?? -0.4;
    case '500':
    case 'medium':
      return UIFontWeight?.Medium ?? UIFontWeight?.medium ?? 0.23;
    case '600':
    case 'semibold':
      return UIFontWeight?.Semibold ?? UIFontWeight?.semibold ?? 0.3;
    case '700':
    case 'bold':
      return UIFontWeight?.Bold ?? UIFontWeight?.bold ?? 0.4;
    case '800':
    case 'heavy':
      return UIFontWeight?.Heavy ?? UIFontWeight?.heavy ?? 0.56;
    case '900':
    case 'black':
      return UIFontWeight?.Black ?? UIFontWeight?.black ?? 0.62;
    case '400':
    case 'normal':
    case 'regular':
      return UIFontWeight?.Regular ?? UIFontWeight?.regular ?? 0;
    default:
      return boldDefault
        ? UIFontWeight?.Bold ?? UIFontWeight?.bold ?? 0.4
        : UIFontWeight?.Regular ?? UIFontWeight?.regular ?? 0;
  }
}

function headerFont(
  family: unknown,
  size: number,
  weight: unknown,
  boldDefault: boolean,
) {
  'worklet';
  const UIFont = nativeValue('UIFont');
  const familyName = typeof family === 'string' ? family : undefined;

  if (
    familyName &&
    familyName !== 'System' &&
    typeof UIFont?.fontWithNameSize === 'function'
  ) {
    const familyFont = UIFont.fontWithNameSize(familyName, size);

    if (familyFont) {
      return familyFont;
    }
  }

  if (typeof UIFont?.systemFontOfSizeWeight === 'function') {
    return UIFont.systemFontOfSizeWeight(
      size,
      headerFontWeight(weight, boldDefault),
    );
  }

  if (boldDefault && typeof UIFont?.boldSystemFontOfSize === 'function') {
    return UIFont.boldSystemFontOfSize(size);
  }

  return typeof UIFont?.systemFontOfSize === 'function'
    ? UIFont.systemFontOfSize(size)
    : null;
}

function textAttributes(values: {
  boldDefault: boolean;
  color?: unknown;
  family?: unknown;
  size?: unknown;
  weight?: unknown;
}) {
  'worklet';
  const NSMutableDictionary = nativeValue('NSMutableDictionary');
  const attributes =
    NSMutableDictionary && typeof NSMutableDictionary.dictionary === 'function'
      ? NSMutableDictionary.dictionary()
      : {};
  const foregroundColorKey =
    nativeValue('NSForegroundColorAttributeName') ?? 'NSColor';
  const fontKey = nativeValue('NSFontAttributeName') ?? 'NSFont';
  const color =
    values.color == null ? null : nativeColor(values.color, 'labelColor');
  const hasFont =
    values.family != null || values.size != null || values.weight != null;
  const size =
    typeof values.size === 'number'
      ? values.size
      : values.boldDefault
      ? 34
      : 17;
  const font = hasFont
    ? headerFont(values.family, size, values.weight, values.boldDefault)
    : null;
  let count = 0;

  if (color) {
    if (typeof attributes.setObjectForKey === 'function') {
      attributes.setObjectForKey(color, foregroundColorKey);
    } else {
      attributes[foregroundColorKey] = color;
    }
    count += 1;
  }

  if (font) {
    if (typeof attributes.setObjectForKey === 'function') {
      attributes.setObjectForKey(font, fontKey);
    } else {
      attributes[fontKey] = font;
    }
    count += 1;
  }

  return count > 0 ? attributes : null;
}

function blurEffectStyle(blurEffect: unknown) {
  'worklet';
  const style = nativeValue('UIBlurEffectStyle');
  const styles: Record<string, number> = {
    extraLight: style?.ExtraLight ?? style?.extraLight ?? 0,
    light: style?.Light ?? style?.light ?? 1,
    dark: style?.Dark ?? style?.dark ?? 2,
    regular: style?.Regular ?? style?.regular ?? 4,
    prominent: style?.Prominent ?? style?.prominent ?? 5,
    systemUltraThinMaterial:
      style?.SystemUltraThinMaterial ?? style?.systemUltraThinMaterial ?? 6,
    systemThinMaterial:
      style?.SystemThinMaterial ?? style?.systemThinMaterial ?? 7,
    systemMaterial: style?.SystemMaterial ?? style?.systemMaterial ?? 8,
    systemThickMaterial:
      style?.SystemThickMaterial ?? style?.systemThickMaterial ?? 9,
    systemChromeMaterial:
      style?.SystemChromeMaterial ?? style?.systemChromeMaterial ?? 10,
    systemUltraThinMaterialLight:
      style?.SystemUltraThinMaterialLight ??
      style?.systemUltraThinMaterialLight ??
      11,
    systemThinMaterialLight:
      style?.SystemThinMaterialLight ?? style?.systemThinMaterialLight ?? 12,
    systemMaterialLight:
      style?.SystemMaterialLight ?? style?.systemMaterialLight ?? 13,
    systemThickMaterialLight:
      style?.SystemThickMaterialLight ?? style?.systemThickMaterialLight ?? 14,
    systemChromeMaterialLight:
      style?.SystemChromeMaterialLight ??
      style?.systemChromeMaterialLight ??
      15,
    systemUltraThinMaterialDark:
      style?.SystemUltraThinMaterialDark ??
      style?.systemUltraThinMaterialDark ??
      16,
    systemThinMaterialDark:
      style?.SystemThinMaterialDark ?? style?.systemThinMaterialDark ?? 17,
    systemMaterialDark:
      style?.SystemMaterialDark ?? style?.systemMaterialDark ?? 18,
    systemThickMaterialDark:
      style?.SystemThickMaterialDark ?? style?.systemThickMaterialDark ?? 19,
    systemChromeMaterialDark:
      style?.SystemChromeMaterialDark ?? style?.systemChromeMaterialDark ?? 20,
  };

  return typeof blurEffect === 'string' ? styles[blurEffect] : undefined;
}

function blurEffectForHeaderConfig(
  headerConfig?: ScreenStackHeaderConfigProps,
) {
  'worklet';
  const UIBlurEffect = nativeValue('UIBlurEffect');
  const effectStyle = blurEffectStyle(headerConfig?.blurEffect);

  if (
    effectStyle == null ||
    headerConfig?.blurEffect === 'none' ||
    typeof UIBlurEffect?.effectWithStyle !== 'function'
  ) {
    return null;
  }

  return UIBlurEffect.effectWithStyle(effectStyle);
}

function configureNavigationSemanticContentAttribute(
  navigationController: any,
  headerConfig?: ScreenStackHeaderConfigProps,
) {
  'worklet';
  const semanticContentAttribute = semanticContentAttributeForDirection(
    headerConfig?.direction,
  );

  if (semanticContentAttribute == null) {
    return;
  }

  if (navigationController?.view) {
    navigationController.view.semanticContentAttribute =
      semanticContentAttribute;
  }

  if (navigationController?.navigationBar) {
    navigationController.navigationBar.semanticContentAttribute =
      semanticContentAttribute;
  }
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
    ? enumValue?.Always ?? enumValue?.always ?? 1
    : enumValue?.Never ?? enumValue?.never ?? 2;
}

function plainBarButtonStyle() {
  'worklet';
  const style = nativeValue('UIBarButtonItemStyle');

  return style?.Plain ?? style?.plain ?? 0;
}

function barButtonItemStyleForVariant(variant: unknown) {
  'worklet';
  const style = nativeValue('UIBarButtonItemStyle');

  if (variant === 'done') {
    return style?.Done ?? style?.done ?? 2;
  }

  if (variant === 'prominent') {
    return style?.Prominent ?? style?.prominent ?? plainBarButtonStyle();
  }

  return plainBarButtonStyle();
}

function controlState(name: string, fallback: number) {
  'worklet';
  const state = nativeValue('UIControlState');

  return state?.[name] ?? state?.[name.toLowerCase()] ?? fallback;
}

function currentIOSMajorVersion() {
  'worklet';
  const UIDevice = nativeValue('UIDevice');
  const version = String(UIDevice?.currentDevice?.systemVersion ?? '0');
  const major = Number.parseInt(version.split('.')[0] ?? '0', 10);

  return Number.isFinite(major) ? major : 0;
}

function layoutPriorityDefaultHigh() {
  'worklet';
  const priority = nativeValue('UILayoutPriority');

  return priority?.DefaultHigh ?? priority?.defaultHigh ?? 750;
}

function layoutPriorityRequired() {
  'worklet';
  const priority = nativeValue('UILayoutPriority');

  return priority?.Required ?? priority?.required ?? 1000;
}

function layoutConstraintAxisHorizontal() {
  'worklet';
  const axis = nativeValue('UILayoutConstraintAxis');

  return axis?.Horizontal ?? axis?.horizontal ?? 0;
}

function layoutConstraintAxisVertical() {
  'worklet';
  const axis = nativeValue('UILayoutConstraintAxis');

  return axis?.Vertical ?? axis?.vertical ?? 1;
}

function activateConstraint(constraint: any) {
  'worklet';

  if (constraint) {
    constraint.active = true;
  }
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

function modalPresentationStyleNone() {
  'worklet';
  const style = nativeValue('UIModalPresentationStyle');

  return style?.None ?? style?.none ?? -1;
}

function modalTransitionStyle() {
  'worklet';
  const style = nativeValue('UIModalTransitionStyle');

  return style?.CoverVertical ?? style?.coverVertical ?? 0;
}

function statusBarStyleForProps(
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';
  const style = nativeValue('UIStatusBarStyle');
  const traitCollection = nativeValue('UITraitCollection');
  const userInterfaceStyle = nativeValue('UIUserInterfaceStyle');
  const currentStyle =
    traitCollection?.currentTraitCollection?.userInterfaceStyle ?? 0;
  const darkStyle = userInterfaceStyle?.Dark ?? userInterfaceStyle?.dark ?? 2;
  const lightContent = style?.LightContent ?? style?.lightContent ?? 1;
  const darkContent = style?.DarkContent ?? style?.darkContent ?? 3;

  switch (props?.statusBarStyle) {
    case 'dark':
      return darkContent;
    case 'light':
      return lightContent;
    case 'inverted':
      return currentStyle === darkStyle ? darkContent : lightContent;
    case 'auto':
    default:
      return currentStyle === darkStyle ? lightContent : darkContent;
  }
}

function statusBarAnimationForProps(
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';
  const animation = nativeValue('UIStatusBarAnimation');

  if (props?.statusBarAnimation === 'none') {
    return animation?.None ?? animation?.none ?? 0;
  }

  if (props?.statusBarAnimation === 'slide') {
    return animation?.Slide ?? animation?.slide ?? 2;
  }

  return animation?.Fade ?? animation?.fade ?? 1;
}

function interfaceOrientationMaskForProps(
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';
  const mask = nativeValue('UIInterfaceOrientationMask');
  const UIDevice = nativeValue('UIDevice');
  const userInterfaceIdiom = nativeValue('UIUserInterfaceIdiom');
  const padIdiom = userInterfaceIdiom?.Pad ?? userInterfaceIdiom?.pad ?? 1;
  const defaultMask =
    UIDevice?.currentDevice?.userInterfaceIdiom === padIdiom
      ? mask?.All ?? mask?.all ?? 30
      : mask?.AllButUpsideDown ?? mask?.allButUpsideDown ?? 26;

  switch (props?.screenOrientation) {
    case 'all':
      return mask?.All ?? mask?.all ?? 30;
    case 'portrait':
      return (
        (mask?.Portrait ?? mask?.portrait ?? 2) |
        (mask?.PortraitUpsideDown ?? mask?.portraitUpsideDown ?? 4)
      );
    case 'portrait_up':
      return mask?.Portrait ?? mask?.portrait ?? 2;
    case 'portrait_down':
      return mask?.PortraitUpsideDown ?? mask?.portraitUpsideDown ?? 4;
    case 'landscape':
      return mask?.Landscape ?? mask?.landscape ?? 24;
    case 'landscape_left':
      return mask?.LandscapeLeft ?? mask?.landscapeLeft ?? 16;
    case 'landscape_right':
      return mask?.LandscapeRight ?? mask?.landscapeRight ?? 8;
    case 'default':
    default:
      return defaultMask;
  }
}

function rootViewController() {
  'worklet';
  const UIApplication = nativeValue('UIApplication');
  const application = UIApplication?.sharedApplication;
  const keyWindow = application?.keyWindow;

  if (keyWindow?.rootViewController) {
    return keyWindow.rootViewController;
  }

  const windows = application?.windows;
  const count = arrayCount(windows);

  for (let index = 0; index < count; index += 1) {
    const window = arrayItem(windows, index);

    if (window?.isKeyWindow && window.rootViewController) {
      return window.rootViewController;
    }
  }

  return null;
}

function reactSuperviewForView(view: any) {
  'worklet';
  const reactSuperviewValue = view?.reactSuperview;

  return typeof reactSuperviewValue === 'function'
    ? view.reactSuperview()
    : reactSuperviewValue;
}

function reactSuperviewViewControllerForController(controller: any) {
  'worklet';
  const reactSuperview = reactSuperviewForView(controller?.view);
  const reactViewControllerValue = reactSuperview?.reactViewController;

  return typeof reactViewControllerValue === 'function'
    ? reactSuperview.reactViewController()
    : reactViewControllerValue ?? null;
}

function presentationCoordinatorControllerForController(controller: any) {
  'worklet';

  return (
    reactSuperviewViewControllerForController(controller) ??
    rootViewController()
  );
}

export const __nativeScriptPresentationCoordinatorControllerForTests =
  presentationCoordinatorControllerForController;

function topMostPresentedViewControllerFrom(controller: any) {
  'worklet';
  let topMost = controller;
  let next = controller?.presentedViewController;

  while (next) {
    topMost = next;
    next = next.presentedViewController;
  }

  return topMost;
}

function updateWindowTraits(controller: any) {
  'worklet';
  const rootController = rootViewController();
  const UIViewController = nativeValue('UIViewController');
  let topController = rootController ?? controller;

  if (typeof rootController?.setNeedsStatusBarAppearanceUpdate === 'function') {
    rootController.setNeedsStatusBarAppearanceUpdate();
  } else if (
    typeof controller?.setNeedsStatusBarAppearanceUpdate === 'function'
  ) {
    controller.setNeedsStatusBarAppearanceUpdate();
  }

  if (
    typeof rootController?.setNeedsUpdateOfHomeIndicatorAutoHidden ===
    'function'
  ) {
    rootController.setNeedsUpdateOfHomeIndicatorAutoHidden();
  } else if (
    typeof controller?.setNeedsUpdateOfHomeIndicatorAutoHidden === 'function'
  ) {
    controller.setNeedsUpdateOfHomeIndicatorAutoHidden();
  }

  while (topController?.presentedViewController) {
    topController = topController.presentedViewController;
  }

  if (
    typeof topController?.setNeedsUpdateOfSupportedInterfaceOrientations ===
    'function'
  ) {
    topController.setNeedsUpdateOfSupportedInterfaceOrientations();
  } else if (
    typeof UIViewController?.attemptRotationToDeviceOrientation === 'function'
  ) {
    UIViewController.attemptRotationToDeviceOrientation();
  }
}

function notifyFinishTransitioningForScreen(
  registry: NativeScriptStackRegistry,
  screenId: string | undefined,
) {
  'worklet';
  const controller = screenId ? registry.screens[screenId] : null;

  if (!controller) {
    return;
  }

  if (typeof controller.notifyFinishTransitioning === 'function') {
    controller.notifyFinishTransitioning();
  } else {
    updateWindowTraits(controller);
  }
}

function stackAnimationForProps(
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';

  if (props?.swipeDirection === 'vertical' && props.stackAnimation == null) {
    return 'slide_from_bottom';
  }

  return props?.stackAnimation ?? 'default';
}

function modalTransitionStyleForProps(
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';
  const style = nativeValue('UIModalTransitionStyle');
  const animation = stackAnimationForProps(props);

  if (animation === 'fade') {
    return style?.CrossDissolve ?? style?.crossDissolve ?? 1;
  }

  if (animation === 'flip') {
    return style?.FlipHorizontal ?? style?.flipHorizontal ?? 2;
  }

  return modalTransitionStyle();
}

function navigationOperationValue(name: string, fallback: number) {
  'worklet';
  const operation = nativeValue('UINavigationControllerOperation');

  return operation?.[name] ?? operation?.[name.toLowerCase()] ?? fallback;
}

function isPushOperation(operation: number) {
  'worklet';

  return (
    operation === navigationOperationValue('Push', NAVIGATION_OPERATION_PUSH)
  );
}

function isPopOperation(operation: number) {
  'worklet';

  return (
    operation === navigationOperationValue('Pop', NAVIGATION_OPERATION_POP)
  );
}

function transitionDurationForProps(
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';

  if (stackAnimationForProps(props) === 'none') {
    return 0;
  }

  const duration = props?.transitionDuration;

  if (typeof duration === 'number' && duration >= 0) {
    return duration / 1000;
  }

  return RNS_DEFAULT_TRANSITION_DURATION_SECONDS;
}

function isCustomStackAnimation(animation: unknown) {
  'worklet';

  return (
    animation !== 'default' &&
    animation !== 'flip' &&
    animation !== 'slide_from_right' &&
    animation !== 'ios_from_right' &&
    animation !== 'ios_from_left'
  );
}

function isModalPresentation(presentation: unknown) {
  'worklet';

  return Boolean(
    presentation && presentation !== 'push' && presentation !== 'card',
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

function createPlaceholderViewController() {
  'worklet';
  const UIViewController = nativeValue('UIViewController');

  if (!UIViewController || typeof UIViewController.alloc !== 'function') {
    return null;
  }

  const allocated = UIViewController.alloc();
  const placeholder =
    allocated && typeof allocated.init === 'function'
      ? allocated.init()
      : allocated;

  if (placeholder?.view) {
    placeholder.view.backgroundColor = nativeColor(
      undefined,
      'systemBackgroundColor',
    );
  }

  configureExtendedLayout(placeholder);
  return placeholder;
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

function arrayIndexOf(value: any, item: any) {
  'worklet';
  const count = arrayCount(value);

  if (!value || count === 0) {
    return -1;
  }

  if (typeof value.indexOfObject === 'function') {
    const index = value.indexOfObject(item);

    return typeof index === 'number' && index >= 0 && index < count
      ? index
      : -1;
  }

  for (let index = 0; index < count; index += 1) {
    if (arrayItem(value, index) === item) {
      return index;
    }
  }

  return -1;
}

function findFirstResponder(view: any): any {
  'worklet';

  if (!view) {
    return null;
  }

  const isFirstResponder =
    typeof view.isFirstResponder === 'function'
      ? view.isFirstResponder()
      : view.isFirstResponder === true;

  if (isFirstResponder) {
    return view;
  }

  const subviews = view.subviews;
  const count = arrayCount(subviews);

  for (let index = 0; index < count; index += 1) {
    const responder = findFirstResponder(arrayItem(subviews, index));

    if (responder) {
      return responder;
    }
  }

  return null;
}

function resolvedSheetAllowedDetents(
  props: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';
  const allowedDetents = props.sheetAllowedDetents;

  if (Array.isArray(allowedDetents)) {
    return allowedDetents;
  }

  if (allowedDetents === 'fitToContents') {
    return [SHEET_FIT_TO_CONTENTS];
  }

  if (allowedDetents === 'medium') {
    return [0.5];
  }

  if (allowedDetents === 'all') {
    return [0.5, 1.0];
  }

  return [1.0];
}

function resolvedSheetInitialDetentIndex(
  props: Readonly<NativeScriptScreenStackItemProps>,
  lastDetentIndex: number,
) {
  'worklet';
  const value = props.sheetInitialDetentIndex;

  if (value === 'last') {
    return lastDetentIndex;
  }

  if (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= lastDetentIndex
  ) {
    return value;
  }

  return 0;
}

function resolvedSheetLargestUndimmedDetentIndex(
  props: Readonly<NativeScriptScreenStackItemProps>,
  lastDetentIndex: number,
) {
  'worklet';
  const value = props.sheetLargestUndimmedDetentIndex;

  if (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= SHEET_LARGEST_UNDIMMED_DETENT_NONE &&
    value <= lastDetentIndex
  ) {
    return value;
  }

  if (value === 'last') {
    return lastDetentIndex;
  }

  if (value === 'medium') {
    return 0;
  }

  if (value === 'large') {
    return 1;
  }

  return SHEET_LARGEST_UNDIMMED_DETENT_NONE;
}

function sheetDetentClass() {
  'worklet';

  return nativeValue('UISheetPresentationControllerDetent');
}

function sheetDetentIdentifier(name: 'Medium' | 'Large') {
  'worklet';

  return (
    nativeValue(`UISheetPresentationControllerDetentIdentifier${name}`) ??
    name.toLowerCase()
  );
}

function sheetDetentIdentifierText(identifier: any) {
  'worklet';

  if (identifier == null) {
    return '';
  }

  const value =
    typeof identifier.toString === 'function'
      ? identifier.toString()
      : identifier.description ?? identifier;

  return String(value);
}

function sheetDetentIndexFromIdentifier(identifier: any) {
  'worklet';
  const text = sheetDetentIdentifierText(identifier);
  const mediumText = sheetDetentIdentifierText(sheetDetentIdentifier('Medium'));
  const largeText = sheetDetentIdentifierText(sheetDetentIdentifier('Large'));

  if (
    identifier === sheetDetentIdentifier('Medium') ||
    text === mediumText ||
    text === 'medium' ||
    text.endsWith('.medium')
  ) {
    return 0;
  }

  if (
    identifier === sheetDetentIdentifier('Large') ||
    text === largeText ||
    text === 'large' ||
    text.endsWith('.large')
  ) {
    return 1;
  }

  const numericIndex = Number.parseInt(text, 10);

  return Number.isFinite(numericIndex) ? numericIndex : 0;
}

function callSheetDetentFactory(name: 'mediumDetent' | 'largeDetent') {
  'worklet';
  const Detent = sheetDetentClass();
  const factory = Detent?.[name];

  if (typeof factory === 'function') {
    return Detent[name]();
  }

  return factory ?? null;
}

function sheetMediumDetent() {
  'worklet';

  return callSheetDetentFactory('mediumDetent');
}

function sheetLargeDetent() {
  'worklet';

  return callSheetDetentFactory('largeDetent');
}

function interopBlock(signature: string, callback: (...args: any[]) => any) {
  'worklet';
  const InteropBlock = (globalThis as Record<string, any>).interop?.Block;

  if (typeof InteropBlock !== 'function') {
    throw new Error(
      'NativeScript interop.Block is required for UIKit callbacks',
    );
  }

  return InteropBlock(signature, NativeScriptRuntime.runtimeInvoker(callback));
}

function createSheetDetentsFromValues(
  values: number[],
  mode: 'fraction' | 'height',
) {
  'worklet';
  const Detent = sheetDetentClass();

  if (
    !Detent ||
    typeof Detent.customDetentWithIdentifierResolver !== 'function'
  ) {
    return createArray([]);
  }

  return createArray(
    values.map((value, index) => {
      const resolver = (context: any) => {
        'worklet';
        const maximumDetentValue = context?.maximumDetentValue ?? 0;
        const height = mode === 'fraction' ? maximumDetentValue * value : value;

        return Math.min(maximumDetentValue, height);
      };

      return Detent.customDetentWithIdentifierResolver(
        String(index),
        interopBlock(SHEET_DETENT_RESOLVER_BLOCK, resolver),
      );
    }),
  );
}

function detentsFromMaxHeightFractions(fractions: number[]) {
  'worklet';

  return createSheetDetentsFromValues(fractions, 'fraction');
}

function detentsFromMaxHeights(maxHeights: number[]) {
  'worklet';

  return createSheetDetentsFromValues(maxHeights, 'height');
}

function setSheetProperty(sheet: any, update: () => void, animate: boolean) {
  'worklet';

  if (animate && typeof sheet?.animateChanges === 'function') {
    sheet.animateChanges(interopBlock(SHEET_ANIMATE_CHANGES_BLOCK, update));
    return;
  }

  update();
}

function setAllowedDetentsForSheet(sheet: any, detents: any, animate: boolean) {
  'worklet';

  setSheetProperty(
    sheet,
    () => {
      'worklet';
      sheet.detents = detents;
    },
    animate,
  );
}

function setSelectedDetentForSheet(
  sheet: any,
  detentIdentifier: any,
  animate: boolean,
) {
  'worklet';

  if (sheet?.selectedDetentIdentifier === detentIdentifier) {
    return;
  }

  setSheetProperty(
    sheet,
    () => {
      'worklet';
      sheet.selectedDetentIdentifier = detentIdentifier;
    },
    animate,
  );
}

function setCornerRadiusForSheet(sheet: any, radius: number, animate: boolean) {
  'worklet';
  const automaticDimension =
    nativeValue('UISheetPresentationControllerAutomaticDimension') ?? -1;
  const nextRadius = radius < 0 ? automaticDimension : radius;

  if (sheet?.preferredCornerRadius === nextRadius) {
    return;
  }

  setSheetProperty(
    sheet,
    () => {
      'worklet';
      sheet.preferredCornerRadius = nextRadius;
    },
    animate,
  );
}

function setGrabberVisibleForSheet(
  sheet: any,
  visible: boolean,
  animate: boolean,
) {
  'worklet';

  if (sheet?.prefersGrabberVisible === visible) {
    return;
  }

  setSheetProperty(
    sheet,
    () => {
      'worklet';
      sheet.prefersGrabberVisible = visible;
    },
    animate,
  );
}

function setLargestUndimmedDetentForSheet(
  sheet: any,
  detentIdentifier: any,
  animate: boolean,
) {
  'worklet';

  if (sheet?.largestUndimmedDetentIdentifier === detentIdentifier) {
    return;
  }

  setSheetProperty(
    sheet,
    () => {
      'worklet';
      sheet.largestUndimmedDetentIdentifier = detentIdentifier;
    },
    animate,
  );
}

function updateFitToContentsDetent(
  controller: any,
  props: Readonly<NativeScriptScreenStackItemProps>,
  registry: NativeScriptStackRegistry,
  animate: boolean,
) {
  'worklet';
  const sheet = controller?.sheetPresentationController;
  const contentHeight = registry.screenSheetContentHeights[props.screenId] ?? 0;
  const navigationBar = controller?.navigationBar;
  const contentHeightErrata =
    navigationBar && navigationBar.hidden !== true
      ? navigationBar.frame?.size?.height ?? 0
      : 0;

  if (props.stackPresentation !== 'formSheet' || contentHeight <= 0 || !sheet) {
    return;
  }

  const allowedDetents = resolvedSheetAllowedDetents(props);

  if (
    allowedDetents.length === 1 &&
    allowedDetents[0] === SHEET_FIT_TO_CONTENTS
  ) {
    setAllowedDetentsForSheet(
      sheet,
      detentsFromMaxHeights([contentHeight + contentHeightErrata]),
      animate,
    );
  }
}

function updateFormSheetPresentationStyle(
  controller: any,
  props: Readonly<NativeScriptScreenStackItemProps>,
  registry: NativeScriptStackRegistry,
  animate = true,
) {
  'worklet';

  if (props.stackPresentation !== 'formSheet') {
    return;
  }

  const sheet = controller?.sheetPresentationController;

  if (!sheet) {
    return;
  }

  const allowedDetents = resolvedSheetAllowedDetents(props);
  const lastDetentIndex = Math.max(allowedDetents.length - 1, 0);
  const firstDimmedDetentIndex = allowedDetents.length;
  let systemDetentsInUse = false;

  sheet.delegate = controller;

  if (allowedDetents.length > 0) {
    if (
      allowedDetents.length === 1 &&
      allowedDetents[0] === SHEET_FIT_TO_CONTENTS
    ) {
      updateFitToContentsDetent(controller, props, registry, animate);
    } else {
      setAllowedDetentsForSheet(
        sheet,
        detentsFromMaxHeightFractions(allowedDetents),
        false,
      );
    }
  } else {
    systemDetentsInUse = true;
    setAllowedDetentsForSheet(
      sheet,
      createArray([sheetMediumDetent(), sheetLargeDetent()].filter(Boolean)),
      animate,
    );
  }

  if (registry.screenSheetInitialDetentsSet[props.screenId] !== true) {
    const initialDetent = resolvedSheetInitialDetentIndex(
      props,
      lastDetentIndex,
    );

    if (initialDetent > 0 && initialDetent < allowedDetents.length) {
      const detent = arrayItem(sheet.detents, initialDetent);

      setSelectedDetentForSheet(
        sheet,
        detent?.identifier ?? String(initialDetent),
        animate,
      );
    }

    registry.screenSheetInitialDetentsSet[props.screenId] = true;
  }

  sheet.prefersScrollingExpandsWhenScrolledToEdge =
    props.sheetExpandsWhenScrolledToEdge ?? true;
  setGrabberVisibleForSheet(sheet, props.sheetGrabberVisible === true, animate);
  setCornerRadiusForSheet(sheet, props.sheetCornerRadius ?? -1, animate);

  let largestUndimmedDetent = resolvedSheetLargestUndimmedDetentIndex(
    props,
    lastDetentIndex,
  );
  largestUndimmedDetent =
    largestUndimmedDetent >= firstDimmedDetentIndex
      ? firstDimmedDetentIndex - 1
      : largestUndimmedDetent;

  if (largestUndimmedDetent === SHEET_LARGEST_UNDIMMED_DETENT_NONE) {
    setLargestUndimmedDetentForSheet(sheet, null, animate);
  } else if (largestUndimmedDetent >= 0) {
    const identifier = systemDetentsInUse
      ? firstDimmedDetentIndex === 0 ||
        (firstDimmedDetentIndex === 1 && allowedDetents[0] < 1.0)
        ? sheetDetentIdentifier('Medium')
        : sheetDetentIdentifier('Large')
      : String(largestUndimmedDetent);

    setLargestUndimmedDetentForSheet(sheet, identifier, animate);
  }
}

export function notifyNativeScriptScreenContentWrapperFrame(
  screenId: string | undefined,
  frame: any,
  contentWrapperView?: any,
) {
  'worklet';

  if (!screenId) {
    return;
  }

  const height = frame?.size?.height ?? 0;

  if (height <= 0) {
    return;
  }

  const registry = getRegistry(globalThis as Record<string, any>);
  const previousHeight = registry.screenSheetContentHeights[screenId];
  const controller = registry.screens[screenId];
  const props = registry.screenProps[screenId];
  const targetController = controller;
  const wasContentReady = registry.screenContentReady[screenId] === true;
  const stackId = registry.screenParents[screenId];
  const stackCtx = stackId ? registry.stackContexts[stackId] : undefined;

  registry.screenSheetContentHeights[screenId] = height;
  registry.screenContentWrapperViews[screenId] = contentWrapperView;
  registry.screenContentReady[screenId] = true;

  if (!wasContentReady && stackId && stackCtx) {
    const reconcileStackFromRegistry = (globalThis as Record<string, any>)[
      RECONCILE_STACK_KEY
    ];

    if (typeof reconcileStackFromRegistry === 'function') {
      reconcileStackFromRegistry(stackId, registry, stackCtx, true);
    }
  }

  if (!targetController || !props) {
    return;
  }

  if (props.stackPresentation === 'formSheet' && contentWrapperView) {
    coerceContentWrapperChildScrollViewFrame(
      contentWrapperView,
      targetController.view?.frame?.size ?? frame?.size,
    );
  }

  if (previousHeight === height) {
    return;
  }

  // Upstream RNSScreenContentWrapper reports React layout frame changes to
  // RNSScreen so formSheet `fitToContents` can update allowed detents.
  updateFitToContentsDetent(targetController, props, registry, true);
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
      view.isKindOfClass(UIScrollView),
  );
}

function contentWrapperChildScrollViewAndContainer(contentWrapperView: any) {
  'worklet';
  const subviews = contentWrapperView?.subviews;
  const count = arrayCount(subviews);

  for (let index = 0; index < count; index += 1) {
    const subview = arrayItem(subviews, index);

    if (isNativeScrollView(subview)) {
      return {
        contentContainerView: contentWrapperView,
        scrollViewComponent: subview,
      };
    }
  }

  // Upstream RNSScreenContentWrapper has an iOS 26 fallback for the extra
  // RNSSafeAreaViewComponentView layer. The TS port cannot reliably class-test
  // that Fabric view, so it mirrors the same first-child search shape.
  const maybeSafeAreaView = arrayItem(subviews, 0);
  const safeAreaSubviews = maybeSafeAreaView?.subviews;
  const safeAreaCount = arrayCount(safeAreaSubviews);

  for (let index = 0; index < safeAreaCount; index += 1) {
    const subview = arrayItem(safeAreaSubviews, index);

    if (isNativeScrollView(subview)) {
      return {
        contentContainerView: maybeSafeAreaView,
        scrollViewComponent: subview,
      };
    }
  }

  return {
    contentContainerView: null,
    scrollViewComponent: null,
  };
}

function rectWithOriginAndSize(
  x: number,
  y: number,
  width: number,
  height: number,
) {
  'worklet';
  const CGRectMake = nativeValue('CGRectMake');

  if (typeof CGRectMake === 'function') {
    return CGRectMake(x, y, width, height);
  }

  return {
    origin: { x, y },
    size: { height, width },
  };
}

function CGRectContainsPoint(rect: any, point: any) {
  'worklet';
  const nativeCGRectContainsPoint = nativeValue('CGRectContainsPoint');

  if (typeof nativeCGRectContainsPoint === 'function') {
    return nativeCGRectContainsPoint(rect, point);
  }

  const originX = rect?.origin?.x ?? 0;
  const originY = rect?.origin?.y ?? 0;
  const width = rect?.size?.width ?? 0;
  const height = rect?.size?.height ?? 0;
  const pointX = point?.x ?? 0;
  const pointY = point?.y ?? 0;

  return (
    pointX >= originX &&
    pointX <= originX + width &&
    pointY >= originY &&
    pointY <= originY + height
  );
}

function coerceContentWrapperChildScrollViewFrame(
  contentWrapperView: any,
  size: any,
) {
  'worklet';
  const { contentContainerView, scrollViewComponent } =
    contentWrapperChildScrollViewAndContainer(contentWrapperView);

  if (!scrollViewComponent || !contentContainerView) {
    return false;
  }

  const subviews = contentContainerView.subviews;
  const count = arrayCount(subviews);

  if (count > 2) {
    console.warn(
      `[RNScreens] FormSheet with ScrollView expects at most 2 subviews. Got ${count} for container: ${contentContainerView}. This might result in incorrect layout. If you want to display header alongside the scrollView, make sure to apply \`collapsable: false\` on your header component view.`,
    );
  }

  const scrollViewIndex = arrayIndexOf(subviews, scrollViewComponent);
  const width = size?.width ?? 0;
  const height = size?.height ?? 0;
  const frame = scrollViewComponent.frame;
  const originX = frame?.origin?.x ?? 0;
  const originY = frame?.origin?.y ?? 0;

  if (scrollViewIndex === 0) {
    scrollViewComponent.frame = rectWithOriginAndSize(
      originX,
      originY,
      width,
      height,
    );
    return true;
  }

  if (scrollViewIndex === 1) {
    const headerView = arrayItem(subviews, 0);
    const headerHeight = headerView?.frame?.size?.height ?? 0;
    scrollViewComponent.frame = rectWithOriginAndSize(
      originX,
      originY === 0 ? headerHeight : originY,
      width,
      height - headerHeight,
    );
    return true;
  }

  return false;
}

export const __nativeScriptCoerceContentWrapperChildScrollViewFrameForTests =
  coerceContentWrapperChildScrollViewFrame;

function findScrollViewInFirstDescendantChainFrom(view: any) {
  'worklet';
  let currentView = view;

  while (currentView != null) {
    if (isNativeScrollView(currentView)) {
      return currentView;
    }

    const subviews = currentView.subviews;

    if (arrayCount(subviews) <= 0) {
      break;
    }

    currentView = arrayItem(subviews, 0);
  }

  return null;
}

function contentInsetAdjustmentBehaviorValue(name: string, fallback: number) {
  'worklet';
  const behavior = nativeValue('UIScrollViewContentInsetAdjustmentBehavior');

  return (
    behavior?.[name] ??
    behavior?.[`${name.charAt(0).toLowerCase()}${name.slice(1)}`] ??
    nativeValue(`UIScrollViewContentInsetAdjustment${name}`) ??
    fallback
  );
}

function shouldOverrideScrollViewContentInsetAdjustmentBehavior(view: any) {
  'worklet';
  let parent = reactSuperviewForView(view);

  while (parent != null) {
    const provider =
      parent.shouldOverrideScrollViewContentInsetAdjustmentBehavior;

    if (typeof provider === 'function') {
      return (
        parent.shouldOverrideScrollViewContentInsetAdjustmentBehavior() === true
      );
    }

    if (typeof provider === 'boolean') {
      return provider === true;
    }

    parent = reactSuperviewForView(parent);
  }

  return false;
}

function overrideScrollViewBehaviorInFirstDescendantChainFrom(view: any) {
  'worklet';
  const scrollView = findScrollViewInFirstDescendantChainFrom(view);

  if (!scrollView) {
    return;
  }

  const never = contentInsetAdjustmentBehaviorValue('Never', 2);

  if (scrollView.contentInsetAdjustmentBehavior === never) {
    scrollView.contentInsetAdjustmentBehavior =
      contentInsetAdjustmentBehaviorValue('Automatic', 0);
  }
}

function overrideScrollViewBehaviorInFirstDescendantChainIfNeeded(
  controller: any,
) {
  'worklet';
  const view = controller?.view;

  if (shouldOverrideScrollViewContentInsetAdjustmentBehavior(view)) {
    // Direct port of RNSScreenView's RNSScrollViewBehaviorOverriding path:
    // RNSScreen asks React superviews for an opt-in provider, then restores
    // UIKit's automatic inset adjustment on the first descendant UIScrollView.
    overrideScrollViewBehaviorInFirstDescendantChainFrom(view);
  }
}

export const __nativeScriptShouldOverrideScrollViewContentInsetAdjustmentBehaviorForTests =
  shouldOverrideScrollViewContentInsetAdjustmentBehavior;
export const __nativeScriptOverrideScrollViewBehaviorInFirstDescendantChainForTests =
  overrideScrollViewBehaviorInFirstDescendantChainFrom;

function scrollEdgeEffectStyle(effect: unknown) {
  'worklet';
  const style = nativeValue('UIScrollEdgeEffectStyle');

  if (effect === 'hard') {
    return style?.hardStyle ?? style?.HardStyle ?? style?.Hard ?? 1;
  }

  if (effect === 'soft') {
    return style?.softStyle ?? style?.SoftStyle ?? style?.Soft ?? 2;
  }

  return (
    style?.automaticStyle ??
    style?.AutomaticStyle ??
    style?.Automatic ??
    style?.automatic ??
    0
  );
}

function configureScrollEdgeEffect(edgeEffect: any, effect: unknown) {
  'worklet';

  if (!edgeEffect) {
    return;
  }

  const resolvedEffect = effect ?? 'automatic';
  const hidden = resolvedEffect === 'hidden';

  edgeEffect.hidden = hidden;
  edgeEffect.style = scrollEdgeEffectStyle(
    hidden ? 'automatic' : resolvedEffect,
  );
}

function applyScrollEdgeEffectsToScrollView(scrollView: any, effects: unknown) {
  'worklet';

  if (!scrollView || currentIOSMajorVersion() < 26) {
    return;
  }

  const edgeEffects = effects as ScreenProps['scrollEdgeEffects'] | undefined;

  configureScrollEdgeEffect(scrollView.bottomEdgeEffect, edgeEffects?.bottom);
  configureScrollEdgeEffect(scrollView.leftEdgeEffect, edgeEffects?.left);
  configureScrollEdgeEffect(scrollView.rightEdgeEffect, edgeEffects?.right);
  configureScrollEdgeEffect(scrollView.topEdgeEffect, edgeEffects?.top);
}

function scrollEdgeEffectsKey(effects: unknown) {
  'worklet';

  const edgeEffects = effects as ScreenProps['scrollEdgeEffects'] | undefined;

  return [
    edgeEffects?.bottom ?? 'automatic',
    edgeEffects?.left ?? 'automatic',
    edgeEffects?.right ?? 'automatic',
    edgeEffects?.top ?? 'automatic',
  ].join('|');
}

function updateContentScrollViewEdgeEffectsIfExists(
  controller: any,
  props?: Readonly<NativeScriptScreenStackItemProps>,
  force = false,
) {
  'worklet';

  // Direct port of RNSScrollViewFinder + RNSScrollEdgeEffectApplicator:
  // RNSScreen applies iOS 26 edge effects to the first descendant UIScrollView.
  // Mirror RNSScreen.mm's `_shouldUpdateScrollEdgeEffects` guard for prop
  // updates, but force a reapply from willMoveToParentViewController because
  // upstream does the same when UIKit attaches the controller.
  if (props?.scrollEdgeEffects == null) {
    // NATIVESCRIPT_PORT_DEVIATION: generated ObjC props carry default
    // `automatic` edge values, but the TS port sees `undefined` when JS did not
    // explicitly ask for edge effects. Leaving UIKit's default automatic style
    // alone avoids an ancestor stack becoming the scroll-edge observer for a
    // descendant scroll view that is actually owned by a nested navigation
    // controller, e.g. modal screens with their own native header stack.
    return;
  }

  const key = scrollEdgeEffectsKey(props?.scrollEdgeEffects);

  if (!force && controller?.__nativeScriptScrollEdgeEffectsKey === key) {
    return;
  }

  controller.__nativeScriptScrollEdgeEffectsKey = key;
  applyScrollEdgeEffectsToScrollView(
    findScrollViewInFirstDescendantChainFrom(controller?.view),
    props?.scrollEdgeEffects,
  );
}

function rectWithWidth(rect: any, width: number) {
  'worklet';
  const origin = rect?.origin;
  const size = rect?.size;
  const CGRectMake = nativeValue('CGRectMake');
  const x = origin?.x ?? 0;
  const y = origin?.y ?? 0;
  const height = size?.height ?? 0;

  if (typeof CGRectMake === 'function') {
    return CGRectMake(x, y, width, height);
  }

  return {
    origin: { x, y },
    size: { height, width },
  };
}

function sizeWithWidth(size: any, width: number) {
  'worklet';
  const CGSizeMake = nativeValue('CGSizeMake');
  const height = size?.height ?? 0;

  if (typeof CGSizeMake === 'function') {
    return CGSizeMake(width, height);
  }

  return { height, width };
}

function shouldFillHostedSubview(rootView: any, subview: any, depth: number) {
  'worklet';
  const parentBounds = rootView?.bounds ?? rootView?.frame;
  const frame = subview?.frame;
  const parentWidth = parentBounds?.size?.width ?? 0;
  const childWidth = frame?.size?.width ?? 0;
  const contentWidth = subview?.contentSize?.width ?? 0;
  const hasChildSubviews = arrayCount(subview?.subviews) > 0;
  const originX = frame?.origin?.x ?? 0;
  const originY = frame?.origin?.y ?? 0;

  if (parentWidth <= 0) {
    return false;
  }

  return (
    Math.abs(originX) < 1 &&
    Math.abs(originY) < 1 &&
    // The first wrapper levels belong to the NativeScript/RN host. UIKit can
    // present a modal before those wrappers receive their final width. Deeper
    // RN host wrappers expose the intended content width while keeping a stale
    // frame, so repair those without touching offset or leaf user layout.
    (depth <= 1 ||
      childWidth <= 0 ||
      Math.abs(childWidth - parentWidth) < 2 ||
      (hasChildSubviews &&
        contentWidth >= parentWidth - 2 &&
        childWidth < parentWidth - 2))
  );
}

function layoutHostedSubviewChain(rootView: any, depth: number) {
  'worklet';

  if (!rootView || depth > 8) {
    return;
  }

  const isScrollView = isNativeScrollView(rootView);
  const scrollWidth = isScrollView ? rootView.bounds?.size?.width ?? 0 : 0;
  const scrollContentWidth = isScrollView
    ? rootView.contentSize?.width ?? 0
    : 0;

  if (
    isScrollView &&
    (scrollWidth <= 0 || scrollContentWidth > scrollWidth + 2)
  ) {
    return;
  }

  const subviews = rootView.subviews;
  const count = arrayCount(subviews);

  for (let index = 0; index < count; index += 1) {
    const subview = arrayItem(subviews, index);

    if (isScrollView) {
      const frame = subview?.frame;
      const originX = frame?.origin?.x ?? 0;
      const childWidth = frame?.size?.width ?? 0;

      if (!subview || Math.abs(originX) >= 1 || childWidth > scrollWidth + 2) {
        continue;
      }

      subview.frame = rectWithWidth(frame, scrollWidth);
      subview.autoresizingMask = flexibleSizeMask();
      layoutHostedSubviewChain(subview, 0);
      continue;
    }

    if (!subview || !shouldFillHostedSubview(rootView, subview, depth)) {
      continue;
    }

    subview.frame = rootView.bounds;
    subview.autoresizingMask = flexibleSizeMask();

    layoutHostedSubviewChain(subview, depth + 1);
  }

  if (
    isScrollView &&
    scrollContentWidth > 0 &&
    scrollContentWidth < scrollWidth - 2
  ) {
    rootView.contentSize = sizeWithWidth(rootView.contentSize, scrollWidth);
  }
}

function layoutHostedReactSubviews(controller: any) {
  'worklet';
  const rootView = controller?.view;

  if (!rootView) {
    return;
  }

  rootView.userInteractionEnabled = true;
  NativeScriptRuntime.refreshUIKitHostView(rootView);

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
}

function refreshNavigationControllerHostedViews(navigationController: any) {
  'worklet';

  if (!navigationController?.view) {
    return;
  }

  navigationController.view.userInteractionEnabled = true;
  NativeScriptRuntime.refreshUIKitHostView(navigationController.view);

  const viewControllers = navigationController.viewControllers;
  const count = arrayCount(viewControllers);

  for (let index = 0; index < count; index += 1) {
    const controller = arrayItem(viewControllers, index);

    if (!controller?.view) {
      continue;
    }

    controller.view.userInteractionEnabled = true;
    layoutHostedReactSubviews(controller);
  }
}

function hostViewForController(controller: any) {
  'worklet';

  return controller?.__nativeScriptStackContainerView ?? controller?.view;
}

function stackHostViewForNavigationController(navigationController: any) {
  'worklet';

  return hostViewForController(navigationController);
}

function layoutNavigationStackViews(navigationController: any) {
  'worklet';

  if (!navigationController?.view) {
    return;
  }

  const stackHostView =
    stackHostViewForNavigationController(navigationController);
  const isModalNavigationController =
    navigationController.presentingViewController != null;
  const parentBounds = isModalNavigationController
    ? navigationController.presentationController?.containerView?.bounds ??
      stackHostView?.superview?.bounds ??
      navigationController.view.bounds
    : navigationController.tabBarController?.view?.bounds ??
      stackHostView?.superview?.bounds;

  if (parentBounds) {
    if (stackHostView) {
      stackHostView.frame = parentBounds;
      stackHostView.autoresizingMask = flexibleSizeMask();
    }
    navigationController.view.frame = stackHostView?.bounds ?? parentBounds;
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

  refreshNavigationControllerHostedViews(navigationController);
}

function layoutPresentedModalControllers(
  stackId: string,
  registry: NativeScriptStackRegistry,
) {
  'worklet';
  const presentedModalKey = registry.stackPresentedModalKeys[stackId];
  const modalIds =
    typeof presentedModalKey === 'string'
      ? presentedModalKey.split(SCREEN_ID_SEPARATOR)
      : [];
  const navigationController = registry.stacks[stackId];
  const fallbackBounds =
    navigationController?.view?.superview?.bounds ??
    navigationController?.view?.bounds;

  for (const modalId of modalIds) {
    const controller = registry.screens[modalId];

    if (!controller?.view || nativeBool(controller, 'isBeingDismissed')) {
      continue;
    }

    const correctFrame = controller.view.superview?.frame ?? fallbackBounds;

    if (correctFrame) {
      controller.view.frame = correctFrame;
    }

    controller.view.autoresizingMask = flexibleSizeMask();
    layoutHostedReactSubviews(controller);
  }
}

function configureHeaderBackButton(
  controller: any,
  props: Readonly<NativeScriptScreenStackItemProps>,
  isTopScreen: boolean,
  canGoBack: boolean,
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

function isBlankOrNull(value: unknown) {
  'worklet';

  return typeof value !== 'string' || value.trim().length === 0;
}

function nativeScriptBackBarButtonItemClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[BACK_BAR_BUTTON_ITEM_CLASS_KEY];

  if (existing) {
    return existing;
  }

  const UIBarButtonItem = nativeValue('UIBarButtonItem');
  const NativeClassFunction = globalObject.NativeClass;

  if (!UIBarButtonItem || typeof NativeClassFunction !== 'function') {
    return UIBarButtonItem;
  }

  class RNSBackBarButtonItem extends UIBarButtonItem {
    setMenu(menu: any) {
      'worklet';

      if (this.__nativeScriptBackButtonMenuHidden === true) {
        return;
      }

      callNativeScriptControllerSuper(this, 'setMenu', true, menu);
    }

    setMenuHidden(menuHidden: boolean) {
      'worklet';

      this.__nativeScriptBackButtonMenuHidden = menuHidden === true;
    }
  }

  const interopTypes = globalObject.interop?.types;
  (RNSBackBarButtonItem as any).ObjCExposedMethods = {
    'setMenu:': {
      params: nativeValue('UIMenu') ? [nativeValue('UIMenu')] : [],
      returns: interopTypes?.void,
    },
    'setMenuHidden:': {
      params: interopTypes?.bool ? [interopTypes.bool] : [],
      returns: interopTypes?.void,
    },
  };

  NativeClassFunction(RNSBackBarButtonItem);
  globalObject[BACK_BAR_BUTTON_ITEM_CLASS_KEY] = RNSBackBarButtonItem;
  return RNSBackBarButtonItem;
}

function configureSourceBackButton(
  navigationItem: any,
  headerConfig?: ScreenStackHeaderConfigProps,
  sourceHeaderConfig?: ScreenStackHeaderConfigProps,
) {
  'worklet';

  if (!navigationItem) {
    return;
  }

  const displayMode =
    headerConfig?.backTitleVisible === false
      ? 'minimal'
      : headerConfig?.backButtonDisplayMode;
  let resolvedBackTitle = isBlankOrNull(headerConfig?.backTitle)
    ? navigationItem.title
    : headerConfig?.backTitle;

  // Upstream recovers this from the previous RNSScreen when UIKit recreated
  // its controller and the UINavigationItem lost the title.
  if (resolvedBackTitle == null) {
    resolvedBackTitle = sourceHeaderConfig?.title;
  }

  navigationItem.backButtonDisplayMode = backButtonDisplayMode(displayMode);
  navigationItem.backButtonTitle = resolvedBackTitle ?? '';

  const existingItem = navigationItem.backBarButtonItem;
  const backTitleVisible = headerConfig?.backTitleVisible !== false;
  const customFontFamily =
    typeof headerConfig?.backTitleFontFamily === 'string' &&
    headerConfig.backTitleFontFamily !== 'System';
  const customFontSize = typeof headerConfig?.backTitleFontSize === 'number';
  const shouldUseCustomBackBarButtonItem =
    backTitleVisible &&
    (headerConfig?.disableBackButtonMenu === true ||
      customFontFamily ||
      customFontSize);

  if (!shouldUseCustomBackBarButtonItem) {
    if (existingItem?.__nativeScriptBackBarButtonItem === true) {
      // NATIVESCRIPT_PORT_DEVIATION: upstream just skips assigning a custom
      // item. The TS port clears only the item it owns so prop updates can
      // return to UIKit's automatic back-title shortening without touching
      // native/user-provided items.
      navigationItem.backBarButtonItem = null;
    }
    return;
  }

  if (existingItem?.__nativeScriptBackBarButtonItem === true) {
    existingItem.title = resolvedBackTitle ?? '';
    existingItem.style = plainBarButtonStyle();
    if (typeof existingItem.setMenuHidden === 'function') {
      existingItem.setMenuHidden(headerConfig?.disableBackButtonMenu === true);
    }
    return;
  }

  const UIBarButtonItem = nativeScriptBackBarButtonItemClass();

  if (!UIBarButtonItem || typeof UIBarButtonItem.alloc !== 'function') {
    return;
  }

  const allocatedItem = UIBarButtonItem.alloc();
  const item =
    allocatedItem &&
    typeof allocatedItem.initWithTitleStyleTargetAction === 'function'
      ? allocatedItem.initWithTitleStyleTargetAction(
          resolvedBackTitle ?? '',
          plainBarButtonStyle(),
          null,
          null,
        )
      : allocatedItem;

  if (item) {
    item.title = resolvedBackTitle ?? '';
    item.style = plainBarButtonStyle();
    item.__nativeScriptBackBarButtonItem = true;
    if (typeof item.setMenuHidden === 'function') {
      item.setMenuHidden(headerConfig?.disableBackButtonMenu === true);
    }
    if (customFontFamily || customFontSize) {
      const attributes = textAttributes({
        boldDefault: true,
        family: headerConfig?.backTitleFontFamily,
        size: headerConfig?.backTitleFontSize ?? 17,
      });

      if (
        attributes &&
        typeof item.setTitleTextAttributesForState === 'function'
      ) {
        for (const state of [
          controlState('Normal', 0),
          controlState('Highlighted', 1),
          controlState('Disabled', 2),
          controlState('Selected', 4),
          controlState('Focused', 8),
        ]) {
          item.setTitleTextAttributesForState(attributes, state);
        }
      }
    }
    navigationItem.backBarButtonItem = item;
  }
}

export const __nativeScriptConfigureSourceBackButtonForTests =
  configureSourceBackButton;

function imageWithRenderingMode(
  image: any,
  modeName: string,
  fallback: number,
) {
  'worklet';

  if (!image || typeof image.imageWithRenderingMode !== 'function') {
    return image;
  }

  const UIImageRenderingMode = nativeValue('UIImageRenderingMode');
  const mode =
    UIImageRenderingMode?.[modeName] ??
    UIImageRenderingMode?.[
      `${modeName.charAt(0).toLowerCase()}${modeName.slice(1)}`
    ] ??
    fallback;

  return image.imageWithRenderingMode(mode);
}

function imageFromResolvedHeaderSource(source: unknown, isTemplate: boolean) {
  'worklet';
  const UIImage = nativeValue('UIImage');
  const resolved = source as { uri?: string } | string | null | undefined;
  const uri = typeof resolved === 'string' ? resolved : resolved?.uri;

  if (!UIImage || typeof uri !== 'string') {
    return null;
  }

  let image = null;

  if (typeof UIImage.imageNamed === 'function') {
    image = UIImage.imageNamed(uri);
  }

  if (!image && typeof UIImage.imageWithContentsOfFile === 'function') {
    const filePath = uri.startsWith('file://') ? uri.slice(7) : uri;
    image = UIImage.imageWithContentsOfFile(filePath);
  }

  if (!image) {
    return null;
  }

  return imageWithRenderingMode(
    image,
    isTemplate ? 'AlwaysTemplate' : 'AlwaysOriginal',
    isTemplate ? 2 : 1,
  );
}

function loadResolvedHeaderImage(
  source: unknown,
  isTemplate: boolean,
  ctx: any,
  callback: (image: any) => void,
) {
  'worklet';

  const image = imageFromResolvedHeaderSource(source, isTemplate);
  if (image) {
    return image;
  }

  // Mirrors upstream RNSImageLoadingHelper: local resolved assets are available
  // immediately, while URI/packager-backed sources complete through the generic
  // React Native image loader and mutate the already-created UIKit item.
  ctx?.loadImage?.(source, { template: isTemplate }, (loadedImage: any) => {
    'worklet';
    if (loadedImage) {
      callback(loadedImage);
    }
  });

  return null;
}

function emptyUIImage() {
  'worklet';
  const UIImage = nativeValue('UIImage');

  if (!UIImage) {
    return null;
  }

  if (typeof UIImage.new === 'function') {
    return UIImage.new();
  }

  const allocated =
    typeof UIImage.alloc === 'function' ? UIImage.alloc() : null;

  return allocated && typeof allocated.init === 'function'
    ? allocated.init()
    : allocated;
}

function setBackIndicatorImageOnAppearance(appearance: any, image: any) {
  'worklet';

  if (!appearance) {
    return;
  }

  if (
    typeof appearance.setBackIndicatorImageTransitionMaskImage === 'function'
  ) {
    appearance.setBackIndicatorImageTransitionMaskImage(image, image);
  } else {
    appearance.backIndicatorImage = image;
    appearance.backIndicatorTransitionMaskImage = image;
  }
}

function backButtonImageForScreen(
  screenId: string | undefined,
  ctx: any,
  callback: (image: any) => void,
) {
  'worklet';

  if (!screenId) {
    return null;
  }

  for (const record of headerSubviewRecordsForScreen(screenId)) {
    if (record.type !== 'back') {
      continue;
    }

    const nativeImage = record.nativeView?.image;

    if (nativeImage) {
      return nativeImage;
    }

    if (record.backImageSource) {
      const image = loadResolvedHeaderImage(
        record.backImageSource,
        record.backImageIsTemplate === true,
        ctx,
        callback,
      );

      return image ?? emptyUIImage();
    }
  }

  return null;
}

function imageForHeaderBarButtonItem(
  item: unknown,
  ctx?: any,
  callback?: (image: any) => void,
) {
  'worklet';
  const UIImage = nativeValue('UIImage');
  const config = item as
    | {
        icon?: {
          type?: string;
          name?: string;
          imageSource?: unknown;
          templateSource?: unknown;
        };
        sfSymbolName?: string;
        xcassetName?: string;
        imageSource?: unknown;
        templateSource?: unknown;
      }
    | undefined;
  const icon = config?.icon;
  const sfSymbolName =
    typeof config?.sfSymbolName === 'string'
      ? config.sfSymbolName
      : icon?.type === 'sfSymbol'
      ? icon.name
      : undefined;
  const xcassetName =
    typeof config?.xcassetName === 'string'
      ? config.xcassetName
      : icon?.type === 'xcasset'
      ? icon.name
      : undefined;

  if (!UIImage) {
    return null;
  }

  if (
    typeof sfSymbolName === 'string' &&
    typeof UIImage.systemImageNamed === 'function'
  ) {
    return UIImage.systemImageNamed(sfSymbolName);
  }

  if (
    typeof xcassetName === 'string' &&
    typeof UIImage.imageNamed === 'function'
  ) {
    return UIImage.imageNamed(xcassetName);
  }

  const imageSource =
    config?.imageSource ?? (icon?.type === 'imageSource' && icon.imageSource);

  if (imageSource) {
    return loadResolvedHeaderImage(imageSource, false, ctx, image => {
      'worklet';
      callback?.(image);
    });
  }

  const templateSource =
    config?.templateSource ??
    (icon?.type === 'templateSource' && icon.templateSource);

  if (templateSource) {
    return loadResolvedHeaderImage(templateSource, true, ctx, image => {
      'worklet';
      callback?.(image);
    });
  }

  return null;
}

function menuElementState(state: unknown) {
  'worklet';
  const enumValue = nativeValue('UIMenuElementState');

  if (state === 'on') {
    return enumValue?.On ?? enumValue?.on ?? 1;
  }

  if (state === 'mixed') {
    return enumValue?.Mixed ?? enumValue?.mixed ?? 2;
  }

  return enumValue?.Off ?? enumValue?.off ?? 0;
}

function menuElementAttributes(item: NativeScriptHeaderMenuActionItem) {
  'worklet';
  const attributes = nativeValue('UIMenuElementAttributes');
  let value = 0;

  if (item.disabled === true) {
    value |= attributes?.Disabled ?? attributes?.disabled ?? 1;
  }

  if (item.destructive === true) {
    value |= attributes?.Destructive ?? attributes?.destructive ?? 2;
  }

  if (item.hidden === true) {
    value |= attributes?.Hidden ?? attributes?.hidden ?? 4;
  }

  if (item.keepsMenuPresented === true) {
    value |=
      attributes?.KeepsMenuPresented ?? attributes?.keepsMenuPresented ?? 8;
  }

  return value;
}

function menuOptionsFromConfig(config: NativeScriptHeaderMenuConfig) {
  'worklet';
  const options = nativeValue('UIMenuOptions');
  const submenuConfig = config as Partial<
    Extract<NativeScriptHeaderMenuItem, { type: 'submenu' }>
  >;
  let value = 0;

  if (submenuConfig.displayInline === true) {
    value |= options?.DisplayInline ?? options?.displayInline ?? 1;
  }

  if (submenuConfig.destructive === true) {
    value |= options?.Destructive ?? options?.destructive ?? 2;
  }

  if (config?.singleSelection === true) {
    value |= options?.SingleSelection ?? options?.singleSelection ?? 32;
  }

  if (config?.displayAsPalette === true) {
    value |= options?.DisplayAsPalette ?? options?.displayAsPalette ?? 128;
  }

  return value;
}

function setTitleTextAttributesForAllStates(barItem: any, attributes: any) {
  'worklet';

  if (
    !barItem ||
    !attributes ||
    typeof barItem.setTitleTextAttributesForState !== 'function'
  ) {
    return;
  }

  for (const state of [
    controlState('Normal', 0),
    controlState('Highlighted', 1),
    controlState('Disabled', 2),
    controlState('Focused', 8),
  ]) {
    barItem.setTitleTextAttributesForState(attributes, state);
  }
}

function applyHeaderBarButtonTitleStyle(
  barItem: any,
  titleStyle: NativeScriptHeaderConfiguredBarButtonItem['titleStyle'],
) {
  'worklet';

  if (!titleStyle) {
    return;
  }

  const attributes = textAttributes({
    boldDefault: false,
    color: titleStyle.color,
    family: titleStyle.fontFamily,
    size: titleStyle.fontSize,
    weight: titleStyle.fontWeight,
  });

  setTitleTextAttributesForAllStates(barItem, attributes);
}

function applyHeaderBarButtonBadge(
  barItem: any,
  badgeConfig: NativeScriptHeaderConfiguredBarButtonItem['badge'],
) {
  'worklet';
  const UIBarButtonItemBadge = nativeValue('UIBarButtonItemBadge');

  if (
    currentIOSMajorVersion() < 26 ||
    !barItem ||
    !badgeConfig ||
    !UIBarButtonItemBadge ||
    typeof UIBarButtonItemBadge.badgeWithString !== 'function'
  ) {
    return;
  }

  const badge = UIBarButtonItemBadge.badgeWithString(badgeConfig.value);
  const style = badgeConfig.style;

  if (style?.color != null) {
    const color = nativeColor(style.color, 'labelColor');
    if (color) {
      badge.foregroundColor = color;
    }
  }

  if (style?.backgroundColor != null) {
    const backgroundColor = nativeColor(
      style.backgroundColor,
      'systemBackgroundColor',
    );
    if (backgroundColor) {
      badge.backgroundColor = backgroundColor;
    }
  }

  if (style) {
    const font = headerFont(
      style.fontFamily,
      style.fontSize ?? 17,
      style.fontWeight,
      false,
    );

    if (font) {
      badge.font = font;
    }
  }

  barItem.badge = badge;
}

function configureHeaderBarButtonItem(
  barItem: any,
  item: NativeScriptHeaderConfiguredBarButtonItem,
  ctx?: any,
) {
  'worklet';

  if (!barItem) {
    return;
  }

  const image = imageForHeaderBarButtonItem(item, ctx, loadedImage => {
    'worklet';
    barItem.image = loadedImage;
  });

  if (typeof item.title === 'string') {
    barItem.title = item.title;
  }

  if (image) {
    barItem.image = image;
  }

  if (item.variant) {
    barItem.style = barButtonItemStyleForVariant(item.variant);
  }

  if (item.tintColor != null) {
    const tintColor = nativeColor(item.tintColor, 'systemBlueColor');
    if (tintColor) {
      barItem.tintColor = tintColor;
    }
  }

  if ('selected' in item && item.selected != null) {
    barItem.selected = item.selected === true;
  }

  if (item.disabled != null) {
    barItem.enabled = item.disabled !== true;
  }

  if (typeof item.width === 'number') {
    barItem.width = item.width;
  }

  if (
    'changesSelectionAsPrimaryAction' in barItem &&
    'changesSelectionAsPrimaryAction' in item &&
    item.changesSelectionAsPrimaryAction != null
  ) {
    barItem.changesSelectionAsPrimaryAction =
      item.changesSelectionAsPrimaryAction === true;
  }

  if (
    'hidesSharedBackground' in barItem &&
    item.hidesSharedBackground != null
  ) {
    barItem.hidesSharedBackground = item.hidesSharedBackground === true;
  }

  if ('sharesBackground' in barItem && item.sharesBackground != null) {
    barItem.sharesBackground = item.sharesBackground === true;
  }

  if ('identifier' in barItem && typeof item.identifier === 'string') {
    barItem.identifier = item.identifier;
  }

  applyHeaderBarButtonBadge(barItem, item.badge);
  applyHeaderBarButtonTitleStyle(barItem, item.titleStyle);
}

function headerBarButtonAccessibilityLabel(
  item: NativeScriptHeaderConfiguredBarButtonItem,
) {
  'worklet';

  return typeof item.accessibilityLabel === 'string'
    ? item.accessibilityLabel
    : typeof item.title === 'string'
    ? item.title
    : undefined;
}

function applyAccessibilityToNativeObject(
  object: any,
  label: string | undefined,
  hint: string | undefined,
) {
  'worklet';

  if (!object || !label) {
    return;
  }

  object.accessibilityLabel = label;
  object.accessibilityIdentifier = label;

  if (typeof object.setAccessibilityLabel === 'function') {
    object.setAccessibilityLabel(label);
  }

  if (typeof object.setAccessibilityIdentifier === 'function') {
    object.setAccessibilityIdentifier(label);
  }

  if (hint) {
    object.accessibilityHint = hint;

    if (typeof object.setAccessibilityHint === 'function') {
      object.setAccessibilityHint(hint);
    }
  }

  if ('isAccessibilityElement' in object) {
    object.isAccessibilityElement = true;
  }

  if (typeof object.setIsAccessibilityElement === 'function') {
    object.setIsAccessibilityElement(true);
  }
}

function applyHeaderBarButtonAccessibility(
  barItem: any,
  item: NativeScriptHeaderConfiguredBarButtonItem,
) {
  'worklet';
  const label = headerBarButtonAccessibilityLabel(item);
  const hint =
    typeof item.accessibilityHint === 'string'
      ? item.accessibilityHint
      : undefined;

  applyAccessibilityToNativeObject(barItem, label, hint);

  const backingView =
    typeof barItem?.valueForKey === 'function'
      ? barItem.valueForKey('view')
      : barItem?.view;

  applyAccessibilityToNativeObject(backingView, label, hint);
}

function createHeaderMenuAction(
  item: NativeScriptHeaderMenuActionItem,
  ctx?: any,
) {
  'worklet';
  const UIAction = nativeValue('UIAction');

  if (
    !UIAction ||
    typeof UIAction.actionWithTitleImageIdentifierHandler !== 'function'
  ) {
    return null;
  }

  if (
    typeof item.onPress !== 'function' ||
    typeof ctx?.actionTarget !== 'function'
  ) {
    return null;
  }

  const actionTarget = ctx.actionTarget(
    NativeScriptRuntime.eventBridge(item.onPress, 'js'),
  );
  const block = interopBlock(UI_ACTION_HANDLER_BLOCK, action => {
    'worklet';

    actionTarget.target?.nativeScriptHandleAction?.(action);
  });
  const actionRef: { current: any } = { current: null };
  const image = imageForHeaderBarButtonItem(item, ctx, loadedImage => {
    'worklet';
    if (actionRef.current) {
      try {
        actionRef.current.image = loadedImage;
      } catch {}
    }
  });
  const action = UIAction.actionWithTitleImageIdentifierHandler(
    item.title ?? '',
    image,
    null,
    block,
  );
  actionRef.current = action;

  if (typeof item.discoverabilityLabel === 'string') {
    action.discoverabilityTitle = item.discoverabilityLabel;
  }

  action.state = menuElementState(item.state);
  action.attributes = menuElementAttributes(item);

  if (typeof item.subtitle === 'string') {
    action.subtitle = item.subtitle;
  }

  ctx.retain?.(block);
  ctx.retain?.(action);

  return action;
}

function createHeaderMenu(
  menu: NativeScriptHeaderMenuConfig | null | undefined,
  ctx?: any,
) {
  'worklet';
  const UIMenu = nativeValue('UIMenu');

  if (
    !menu ||
    !UIMenu ||
    typeof UIMenu.menuWithTitleImageIdentifierOptionsChildren !== 'function'
  ) {
    return null;
  }

  const children: any[] = [];
  const menuItems = Array.isArray(menu.items) ? menu.items : [];

  for (const item of menuItems) {
    const child =
      item.type === 'action'
        ? createHeaderMenuAction(item, ctx)
        : createHeaderMenu(item, ctx);

    if (child) {
      children.push(child);
    }
  }

  const nativeMenuRef: { current: any } = { current: null };
  const image = imageForHeaderBarButtonItem(menu, ctx, loadedImage => {
    'worklet';
    if (nativeMenuRef.current) {
      try {
        nativeMenuRef.current.image = loadedImage;
      } catch {}
    }
  });
  const nativeMenu = UIMenu.menuWithTitleImageIdentifierOptionsChildren(
    menu.title ?? '',
    image,
    null,
    menuOptionsFromConfig(menu),
    createArray(children),
  );
  nativeMenuRef.current = nativeMenu;

  ctx?.retain?.(nativeMenu);

  return nativeMenu;
}

function createHeaderBarButtonItem(
  item: NativeScriptHeaderBarButtonItem | null | undefined,
  ctx?: any,
) {
  'worklet';
  const UIBarButtonItem = nativeValue('UIBarButtonItem');

  if (
    !item ||
    !UIBarButtonItem ||
    typeof UIBarButtonItem.alloc !== 'function'
  ) {
    return null;
  }

  if (item.type === 'spacing') {
    const systemItem = nativeValue('UIBarButtonSystemItem');
    const allocated = UIBarButtonItem.alloc();
    const barItem =
      typeof allocated.initWithBarButtonSystemItemTargetAction === 'function'
        ? allocated.initWithBarButtonSystemItemTargetAction(
            systemItem?.FixedSpace ?? systemItem?.fixedSpace ?? 6,
            null,
            null,
          )
        : allocated.init?.() ?? allocated;

    if (typeof item.spacing === 'number') {
      barItem.width = item.spacing;
    }

    return barItem;
  }

  const allocated = UIBarButtonItem.alloc();
  let target: unknown = null;
  let action: string | null = null;

  if (item.type === 'button') {
    if (
      typeof item.onPress !== 'function' ||
      typeof ctx?.actionTarget !== 'function'
    ) {
      return null;
    }

    const actionTarget = ctx.actionTarget(
      NativeScriptRuntime.eventBridge(item.onPress, 'js'),
    );
    target = actionTarget.target;
    action = actionTarget.action;
  }

  const barItem =
    typeof allocated.initWithTitleStyleTargetAction === 'function'
      ? allocated.initWithTitleStyleTargetAction(
          item.title ?? '',
          barButtonItemStyleForVariant(item.variant),
          target,
          action,
        )
      : allocated.init?.() ?? allocated;

  if (!barItem) {
    return null;
  }

  configureHeaderBarButtonItem(barItem, item, ctx);

  if (item.type === 'menu') {
    const menu = createHeaderMenu(item.menu, ctx);

    if (menu) {
      barItem.menu = menu;
    }
  }

  ctx?.retain?.(barItem);

  return barItem;
}

function insertHeaderBarButtonItem(
  items: any[],
  barItem: any,
  config: NativeScriptHeaderBarButtonItem,
) {
  'worklet';
  const indexedConfig = config as { index?: number };
  const requestedIndex =
    typeof indexedConfig.index === 'number' ? indexedConfig.index : 0;

  if (requestedIndex < items.length) {
    items.splice(Math.max(0, requestedIndex), 0, barItem);
  } else {
    items.push(barItem);
  }
}

function createHeaderBarButtonItems(
  items: ScreenStackHeaderConfigProps['headerRightBarButtonItems'],
  currentItems?: any,
  ctx?: any,
) {
  'worklet';

  const barButtonItems: any[] = [];
  const currentCount = arrayCount(currentItems);

  for (let index = 0; index < currentCount; index += 1) {
    const currentItem = arrayItem(currentItems, index);

    if (currentItem) {
      barButtonItems.push(currentItem);
    }
  }

  if (!items || !Array.isArray(items)) {
    return barButtonItems.length > 0 ? createArray(barButtonItems) : null;
  }

  for (const item of items) {
    const barButtonItem = createHeaderBarButtonItem(item, ctx);

    if (barButtonItem) {
      if (item.type !== 'spacing') {
        applyHeaderBarButtonAccessibility(barButtonItem, item);
      }

      insertHeaderBarButtonItem(barButtonItems, barButtonItem, item);
    }
  }

  return barButtonItems.length > 0 ? createArray(barButtonItems) : null;
}

export const __nativeScriptCreateHeaderBarButtonItemsForTests =
  createHeaderBarButtonItems;

function headerSubviewBarButtonCustomView(
  record: NativeScriptHeaderSubviewRecord,
) {
  'worklet';
  const nativeView = record?.nativeView;

  if (!nativeView || currentIOSMajorVersion() < 26) {
    return nativeView;
  }

  const UIView = nativeValue('UIView');
  const wrapper =
    UIView && typeof UIView.alloc === 'function' ? UIView.alloc().init() : null;

  if (!wrapper || typeof wrapper.addSubview !== 'function') {
    return nativeView;
  }

  // Upstream RNSScreenStackHeaderSubview wraps left/right custom views on iOS
  // 26 so Liquid Glass can stretch the bar button container without stretching
  // the React-measured header content itself.
  wrapper.translatesAutoresizingMaskIntoConstraints = false;
  nativeView.translatesAutoresizingMaskIntoConstraints = false;
  wrapper.frame = nativeView.bounds;
  wrapper.addSubview(nativeView);

  const widthEqual =
    wrapper.widthAnchor &&
    nativeView.widthAnchor &&
    typeof wrapper.widthAnchor.constraintEqualToAnchor === 'function'
      ? wrapper.widthAnchor.constraintEqualToAnchor(nativeView.widthAnchor)
      : null;
  const heightEqual =
    wrapper.heightAnchor &&
    nativeView.heightAnchor &&
    typeof wrapper.heightAnchor.constraintEqualToAnchor === 'function'
      ? wrapper.heightAnchor.constraintEqualToAnchor(nativeView.heightAnchor)
      : null;

  if (widthEqual) {
    widthEqual.priority = layoutPriorityDefaultHigh();
  }
  if (heightEqual) {
    heightEqual.priority = layoutPriorityDefaultHigh();
  }

  activateConstraint(
    nativeView.centerXAnchor &&
      wrapper.centerXAnchor &&
      typeof nativeView.centerXAnchor.constraintEqualToAnchor === 'function'
      ? nativeView.centerXAnchor.constraintEqualToAnchor(wrapper.centerXAnchor)
      : null,
  );
  activateConstraint(
    nativeView.centerYAnchor &&
      wrapper.centerYAnchor &&
      typeof nativeView.centerYAnchor.constraintEqualToAnchor === 'function'
      ? nativeView.centerYAnchor.constraintEqualToAnchor(wrapper.centerYAnchor)
      : null,
  );
  activateConstraint(widthEqual);
  activateConstraint(heightEqual);

  if (typeof nativeView.setContentHuggingPriorityForAxis === 'function') {
    nativeView.setContentHuggingPriorityForAxis(
      layoutPriorityRequired(),
      layoutConstraintAxisHorizontal(),
    );
    nativeView.setContentHuggingPriorityForAxis(
      layoutPriorityRequired(),
      layoutConstraintAxisVertical(),
    );
  }
  if (
    typeof nativeView.setContentCompressionResistancePriorityForAxis ===
    'function'
  ) {
    nativeView.setContentCompressionResistancePriorityForAxis(
      layoutPriorityRequired(),
      layoutConstraintAxisHorizontal(),
    );
    nativeView.setContentCompressionResistancePriorityForAxis(
      layoutPriorityRequired(),
      layoutConstraintAxisVertical(),
    );
  }

  return wrapper;
}

function createHeaderSubviewBarButtonItem(
  record: NativeScriptHeaderSubviewRecord,
) {
  'worklet';
  const UIBarButtonItem = nativeValue('UIBarButtonItem');
  const customView = headerSubviewBarButtonCustomView(record);

  if (
    !customView ||
    !UIBarButtonItem ||
    typeof UIBarButtonItem.alloc !== 'function'
  ) {
    return null;
  }

  const allocated = UIBarButtonItem.alloc();
  const barItem =
    typeof allocated.initWithCustomView === 'function'
      ? allocated.initWithCustomView(customView)
      : null;

  if (!barItem) {
    return null;
  }

  if ('hidesSharedBackground' in barItem) {
    barItem.hidesSharedBackground = record.hidesSharedBackground === true;
  }

  return barItem;
}

function appendHeaderBarButtonItem(currentItems: any, barItem: any) {
  'worklet';
  const barButtonItems: any[] = [];
  const currentCount = arrayCount(currentItems);

  for (let index = 0; index < currentCount; index += 1) {
    const currentItem = arrayItem(currentItems, index);

    if (currentItem) {
      barButtonItems.push(currentItem);
    }
  }

  if (barItem) {
    barButtonItems.push(barItem);
  }

  return barButtonItems.length > 0 ? createArray(barButtonItems) : null;
}

function searchBarPlacementValue(placement: SearchBarPlacement | undefined) {
  'worklet';
  const values = nativeValue('UINavigationItemSearchBarPlacement');
  const inline = values?.Inline ?? values?.inline ?? 1;
  const iosMajor = currentIOSMajorVersion();

  switch (placement) {
    case 'stacked':
      return values?.Stacked ?? values?.stacked ?? 2;
    case 'inline':
      return inline;
    case 'integrated':
      return iosMajor >= 26
        ? values?.Integrated ?? values?.integrated ?? 3
        : inline;
    case 'integratedButton':
      return iosMajor >= 26
        ? values?.IntegratedButton ?? values?.integratedButton ?? 4
        : inline;
    case 'integratedCentered':
      return iosMajor >= 26
        ? values?.IntegratedCentered ?? values?.integratedCentered ?? 5
        : inline;
    case 'automatic':
    default:
      return values?.Automatic ?? values?.automatic ?? 0;
  }
}

function configureHeaderSubviewViews(
  navigationItem: any,
  props: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';

  if (!navigationItem) {
    return;
  }

  navigationItem.titleView = null;
  navigationItem.leftBarButtonItems = null;
  navigationItem.rightBarButtonItems = null;
  let searchBarPresent = false;

  for (const record of headerSubviewRecordsForScreen(props.screenId)) {
    if (record.type === 'left') {
      const barItem = createHeaderSubviewBarButtonItem(record);
      navigationItem.leftBarButtonItems = appendHeaderBarButtonItem(
        navigationItem.leftBarButtonItems,
        barItem,
      );
    } else if (record.type === 'right') {
      const barItem = createHeaderSubviewBarButtonItem(record);
      navigationItem.rightBarButtonItems = appendHeaderBarButtonItem(
        navigationItem.rightBarButtonItems,
        barItem,
      );
    } else if (record.type === 'center' || record.type === 'title') {
      navigationItem.titleView = record.nativeView;
    } else if (record.type === 'searchBar') {
      if (record.searchController) {
        searchBarPresent = true;
        navigationItem.searchController = record.searchController;
        navigationItem.hidesSearchBarWhenScrolling =
          record.hideWhenScrolling !== false;

        if (currentIOSMajorVersion() >= 16) {
          navigationItem.preferredSearchBarPlacement = searchBarPlacementValue(
            record.placement,
          );
        }

        if (currentIOSMajorVersion() >= 26) {
          const searchBarPlacement = searchBarPlacementValue(record.placement);
          const stackedPlacement = searchBarPlacementValue('stacked');
          navigationItem.searchBarPlacementAllowsToolbarIntegration =
            searchBarPlacement !== stackedPlacement &&
            record.allowToolbarIntegration !== false;
        }
      }
    }
  }

  if (!searchBarPresent && 'searchController' in navigationItem) {
    navigationItem.searchController = null;
  }
}

export const __nativeScriptConfigureHeaderSubviewViewsForTests =
  configureHeaderSubviewViews;

function hitTestHeaderSubviewForPoint(
  stackView: any,
  navigationController: any,
  point: any,
  event: any,
) {
  'worklet';
  const navigationBar = navigationController?.navigationBar;

  if (
    !navigationBar?.frame ||
    !CGRectContainsPoint(navigationBar.frame, point)
  ) {
    return null;
  }

  const registry = getRegistry(globalThis as Record<string, any>);
  const topController =
    navigationController?.topViewController ??
    arrayItem(
      navigationController?.viewControllers,
      Math.max(0, arrayCount(navigationController?.viewControllers) - 1),
    );
  const topScreenId = screenIdForController(topController, registry);

  if (!topScreenId) {
    return null;
  }

  for (const record of headerSubviewRecordsForScreen(topScreenId)) {
    if (record.type !== 'left' && record.type !== 'right') {
      continue;
    }

    if (record.nativeView?.window == null) {
      continue;
    }

    const convertedPoint = stackView.convertPointToView(
      point,
      record.nativeView,
    );
    const headerHitTestResult =
      typeof record.nativeView.hitTestWithEvent === 'function'
        ? record.nativeView.hitTestWithEvent(convertedPoint, event)
        : record.nativeView.hitTest?.(convertedPoint, event);

    if (headerHitTestResult) {
      return headerHitTestResult;
    }
  }

  return null;
}

function configureHeaderBarButtonItems(
  navigationItem: any,
  headerConfig?: ScreenStackHeaderConfigProps,
  ctx?: any,
) {
  'worklet';

  if (!navigationItem) {
    return;
  }

  const leftBarButtonItems = createHeaderBarButtonItems(
    headerConfig?.headerLeftBarButtonItems,
    navigationItem.leftBarButtonItems,
    ctx,
  );
  const rightBarButtonItems = createHeaderBarButtonItems(
    headerConfig?.headerRightBarButtonItems,
    navigationItem.rightBarButtonItems,
    ctx,
  );

  navigationItem.leftBarButtonItems = leftBarButtonItems;
  navigationItem.rightBarButtonItems = rightBarButtonItems;
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
  ctx?: any,
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
        isModalPresentation(props.stackPresentation) ? 56 : 44,
      ),
    },
  });
}

function screenControllerHasNestedNavigationStack(controller: any) {
  'worklet';
  const childControllers = controller?.childViewControllers;
  const count = arrayCount(childControllers);

  for (let index = 0; index < count; index += 1) {
    const child = arrayItem(childControllers, index);

    if (child?.topViewController || child?.viewControllers) {
      return true;
    }
  }

  return false;
}

function shouldEmitHeaderHeightAfterNavigationLayout(controller: any) {
  'worklet';
  const presentedController = controller?.presentedViewController;

  if (!presentedController) {
    return true;
  }

  const UISearchController = nativeValue('UISearchController');
  const isSearchController =
    UISearchController &&
    typeof presentedController.isKindOfClass === 'function' &&
    presentedController.isKindOfClass(UISearchController);
  const isBeingDismissed =
    typeof presentedController.isBeingDismissed === 'function'
      ? presentedController.isBeingDismissed()
      : presentedController.isBeingDismissed === true;

  return isSearchController || !isBeingDismissed;
}

function emitTopScreenHeaderHeightAfterNavigationLayout(
  navigationController: any,
) {
  'worklet';
  const topController = navigationController?.topViewController;

  if (!topController) {
    return;
  }

  layoutHostedReactSubviews(topController);

  if (
    screenControllerHasNestedNavigationStack(topController) ||
    !shouldEmitHeaderHeightAfterNavigationLayout(topController)
  ) {
    return;
  }

  const registry = getRegistry(globalThis as Record<string, any>);
  const screenId = screenIdForController(topController, registry);
  const props = screenId ? registry.screenProps[screenId] : undefined;

  if (!screenId || !props) {
    return;
  }

  // NATIVESCRIPT_PORT_DEVIATION: upstream also mirrors UINavigationBar layout
  // into RNSScreenStackHeaderConfig's shadow tree. The TS port's header
  // subviews are NativeScript UIKit containers, so header layout state is
  // refreshed through hosted UIKit layout plus the public header-height event.
  emitHeaderHeightChange(
    topController,
    props,
    registry.screenContexts[screenId],
  );
}

function screenControllerIsPresentedAsNativeModal(
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';

  return isModalPresentation(props?.stackPresentation);
}

function screenControllerShouldUpdateBoundsAfterLayout(
  controller: any,
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';
  const parentController = controller?.parentViewController;
  const isDisplayedWithinNavigationController =
    parentController?.topViewController === controller ||
    navigationControllerContainsController(parentController, controller);
  const isTabScreen =
    parentController?.selectedViewController === controller ||
    parentController?.tabBar != null;

  return (
    isDisplayedWithinNavigationController ||
    isTabScreen ||
    screenControllerIsPresentedAsNativeModal(props)
  );
}

function updateScreenBoundsAfterLayout(controller: any) {
  'worklet';
  const props = screenPropsForController(controller);
  const registry = getRegistry(globalThis as Record<string, any>);
  const screenId = screenIdForController(controller, registry);

  if (screenControllerIsPresentedAsNativeModal(props) && screenId) {
    emitHeaderHeightChange(
      controller,
      props!,
      registry.screenContexts[screenId],
    );
  }

  if (props?.stackPresentation === 'formSheet' && screenId) {
    coerceContentWrapperChildScrollViewFrame(
      registry.screenContentWrapperViews[screenId],
      controller?.view?.frame?.size,
    );
  }

  if (screenControllerShouldUpdateBoundsAfterLayout(controller, props)) {
    layoutHostedReactSubviews(controller);
  }
}

function clearScreenRecord(
  registry: NativeScriptStackRegistry,
  screenId: string,
) {
  'worklet';

  registry.screens[screenId] = undefined;
  registry.screenHeaderConfigs[screenId] = undefined;
  registry.screenContexts[screenId] = undefined;
  registry.screenControllerHashes[screenId] = undefined;
  registry.screenContentReady[screenId] = undefined;
  registry.screenContentWrapperViews[screenId] = undefined;
  registry.screenParents[screenId] = undefined;
  registry.screenProps[screenId] = undefined;
  registry.screenSheetContentHeights[screenId] = undefined;
  registry.screenSheetInitialDetentsSet[screenId] = undefined;
}

function controllerHash(controller: any) {
  'worklet';

  const hash = controller?.hash;

  return typeof hash === 'number' || typeof hash === 'string'
    ? hash
    : undefined;
}

function controllerScreenId(controller: any) {
  'worklet';

  const screenId =
    controller?.__nativeScriptScreenId ??
    controller?.restorationIdentifier ??
    controller?.view?.accessibilityIdentifier;

  return typeof screenId === 'string' ? screenId : undefined;
}

function controllersEqual(left: any, right: any) {
  'worklet';

  if (!left || !right) {
    return false;
  }

  if (left === right) {
    return true;
  }

  const leftScreenId = controllerScreenId(left);
  const rightScreenId = controllerScreenId(right);

  if (leftScreenId != null && leftScreenId === rightScreenId) {
    return true;
  }

  const leftHash = controllerHash(left);
  const rightHash = controllerHash(right);

  return leftHash != null && leftHash === rightHash;
}

function nativeObjectsEqual(left: any, right: any) {
  'worklet';

  if (!left || !right) {
    return false;
  }

  if (left === right) {
    return true;
  }

  if (typeof left.isEqual === 'function' && left.isEqual(right)) {
    return true;
  }

  return typeof right.isEqual === 'function' && right.isEqual(left);
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

function ensureScreenControllerView(controller: any) {
  'worklet';

  if (controller?.view) {
    return controller.view;
  }

  const UIView = nativeValue('UIView');
  const allocated =
    UIView && typeof UIView.alloc === 'function' ? UIView.alloc() : null;
  const view =
    allocated && typeof allocated.init === 'function'
      ? allocated.init()
      : allocated;

  if (view) {
    // RNSScreen's native initWithView: makes the screen controller own the
    // screen view. The TypeScript port mirrors that so UIKit can lay the screen
    // out before React children are attached.
    controller.view = view;
  }

  return controller?.view;
}

function screenIdForController(
  controller: any,
  registry: NativeScriptStackRegistry,
) {
  'worklet';

  const taggedScreenId = controllerScreenId(controller);

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
    if (controllersEqual(registry.screens[screenId], controller)) {
      return screenId;
    }
  }

  return undefined;
}

function screenPropsForController(controller: any) {
  'worklet';
  const registry = getRegistry(globalThis as Record<string, any>);
  const screenId = screenIdForController(controller, registry);

  return screenId ? registry.screenProps[screenId] : undefined;
}

function controllerHasTrait(controller: any, propName: string) {
  'worklet';
  const props = screenPropsForController(controller);

  return props?.[propName as keyof NativeScriptScreenStackItemProps] != null;
}

function childControllerForTrait(
  controller: any,
  propName: string,
  includingModals: boolean,
): any {
  'worklet';
  const childControllers = controller?.childViewControllers;
  const lastChild = arrayItem(
    childControllers,
    arrayCount(childControllers) - 1,
  );
  const presentedController = controller?.presentedViewController;
  let childController = lastChild;

  if (presentedController && screenPropsForController(presentedController)) {
    childController = presentedController;

    if (!includingModals) {
      return null;
    }

    const modalChild: any = childControllerForTrait(
      presentedController,
      propName,
      includingModals,
    );

    if (modalChild) {
      return modalChild;
    }
  }

  const selfOrNil = controllerHasTrait(controller, propName)
    ? controller
    : null;

  if (!childController) {
    return selfOrNil;
  }

  const childSearch: any =
    typeof childController.childControllerForNativeScriptWindowTrait ===
    'function'
      ? childController.childControllerForNativeScriptWindowTrait(
          propName,
          includingModals,
        )
      : screenPropsForController(childController)
      ? childControllerForTrait(childController, propName, includingModals)
      : null;

  return childSearch ?? selfOrNil;
}

function hideHeaderIfNecessary(controller: any) {
  'worklet';
  const navigationController = controller?.navigationController;
  const viewControllers = navigationController?.viewControllers;
  const currentIndex = arrayIndexOf(viewControllers, controller);
  const props = screenPropsForController(controller);
  const headerConfig = props?.headerConfig;

  if (currentIndex <= 0 || headerConfig?.hidden !== true) {
    return;
  }

  const previousController = arrayItem(viewControllers, currentIndex - 1);
  const navigationItem = previousController?.navigationItem;
  const searchController = navigationItem?.searchController;
  const wasSearchBarActive =
    typeof searchController?.active === 'function'
      ? searchController.active()
      : searchController?.active === true;

  if (!wasSearchBarActive) {
    return;
  }

  const hideHeader = () => {
    'worklet';

    if (
      typeof navigationController.setNavigationBarHiddenAnimated === 'function'
    ) {
      navigationController.setNavigationBarHiddenAnimated(true, false);
    }

    navigationController.navigationBarHidden = true;

    if (navigationController.navigationBar) {
      navigationController.navigationBar.hidden = true;
    }
  };

  if (typeof setTimeout === 'function') {
    setTimeout(hideHeader, 0);
  } else {
    hideHeader();
  }
}

function transitionCoordinatorForController(controller: any) {
  'worklet';

  if (typeof controller?.invoke === 'function') {
    return controller.invoke('transitionCoordinator');
  }

  const coordinator = controller?.transitionCoordinator;

  return typeof coordinator === 'function'
    ? controller.transitionCoordinator()
    : coordinator;
}

function transitionCoordinatorPresentationStyle(coordinator: any) {
  'worklet';
  const presentationStyle = coordinator?.presentationStyle;

  return typeof presentationStyle === 'function'
    ? coordinator.presentationStyle()
    : presentationStyle;
}

function runAfterTransitionCoordinator(
  controller: any,
  completion: () => void,
) {
  'worklet';
  const coordinator = transitionCoordinatorForController(controller);

  if (
    !coordinator ||
    typeof coordinator.animateAlongsideTransitionCompletion !== 'function'
  ) {
    return false;
  }

  const InteropBlock = (globalThis as Record<string, any>).interop?.Block;

  if (typeof InteropBlock !== 'function') {
    throw new Error(
      'NativeScript interop.Block is required for UIKit callbacks',
    );
  }

  return Boolean(
    coordinator.animateAlongsideTransitionCompletion(
      null,
      InteropBlock(
        TRANSITION_COORDINATOR_COMPLETION_BLOCK,
        NativeScriptRuntime.runtimeInvoker(completion),
      ),
    ),
  );
}

function dismissCountForController(controller: any) {
  'worklet';

  const navigationController = controller?.navigationController;

  if (
    nativeBool(
      transitionCoordinatorForController(controller),
      'isInteractive',
    ) ||
    !navigationController
  ) {
    return 1;
  }

  const registry = getRegistry(globalThis as Record<string, any>);
  const screenId = screenIdForController(controller, registry);
  const stackId = screenId ? registry.screenParents[screenId] : undefined;
  const activeIds = stackId ? registry.stackActiveScreenIds[stackId] ?? [] : [];
  const topScreenId = screenIdForController(
    navigationController.topViewController,
    registry,
  );
  const selfIndex = screenId ? activeIds.indexOf(screenId) : -1;
  const targetIndex = topScreenId ? activeIds.indexOf(topScreenId) : -1;
  const dismissCount = selfIndex - targetIndex;

  return dismissCount > 0 ? dismissCount : 1;
}

function callNativeScriptControllerSuper(
  controller: any,
  methodName: string,
  hasArgument = false,
  argument?: any,
) {
  'worklet';

  // `UIViewController.extend` materializes a native subclass from copied JS
  // methods, so lexical `super` no longer resolves to UIKit's implementation.
  // NativeScript exposes the generic objc_msgSendSuper bridge as `this.super`.
  const superObject = controller?.super;
  const method = superObject?.[methodName];

  if (typeof method !== 'function') {
    return;
  }

  if (hasArgument) {
    superObject[methodName](argument);
  } else {
    superObject[methodName]();
  }
}

function emitTransitionProgress(
  registry: NativeScriptStackRegistry,
  screenId: string | undefined,
  progress: number,
  closing: boolean,
  goingForward: boolean,
) {
  'worklet';

  if (!screenId) {
    return;
  }

  const props = registry.screenProps[screenId];
  const ctx = registry.screenContexts[screenId];

  if (!ctx || typeof props?.onTransitionProgress !== 'function') {
    return;
  }

  ctx.emit('onTransitionProgress', {
    nativeEvent: {
      progress,
      closing: closing ? 1 : 0,
      goingForward: goingForward ? 1 : 0,
    },
  });
}

function emitTransitionProgressForController(
  controller: any,
  progress: number,
  closing: boolean,
  goingForward: boolean,
) {
  'worklet';
  const registry = getRegistry(globalThis as Record<string, any>);

  emitTransitionProgress(
    registry,
    screenIdForController(controller, registry),
    progress,
    closing,
    goingForward,
  );
}

function emitScreenLifecycleEventForController(
  controller: any,
  eventName: string,
  event: Record<string, any> = { nativeEvent: {} },
) {
  'worklet';
  const registry = getRegistry(globalThis as Record<string, any>);
  const screenId = screenIdForController(controller, registry);

  if (!screenId) {
    return;
  }

  registry.screenContexts[screenId]?.emit?.(eventName, event);
}

function emitScreenDismissed(
  registry: NativeScriptStackRegistry,
  screenId: string | undefined,
  dismissCount: number,
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

function emitScreenDismissedForController(
  controller: any,
  dismissCount: number,
) {
  'worklet';
  if (controller?.__nativeScriptDismissEventEmitted === true) {
    return;
  }

  if (controller) {
    controller.__nativeScriptDismissEventEmitted = true;
  }

  const registry = getRegistry(globalThis as Record<string, any>);

  emitScreenDismissed(
    registry,
    screenIdForController(controller, registry),
    dismissCount,
  );
}

function emitNativeDismissCancelled(
  registry: NativeScriptStackRegistry,
  screenId: string | undefined,
  dismissCount: number,
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

function emitNativeDismissCancelledForController(
  controller: any,
  dismissCount: number,
) {
  'worklet';
  if (controller?.__nativeScriptDismissEventEmitted === true) {
    return;
  }

  if (controller) {
    controller.__nativeScriptDismissEventEmitted = true;
  }

  const registry = getRegistry(globalThis as Record<string, any>);

  emitNativeDismissCancelled(
    registry,
    screenIdForController(controller, registry),
    dismissCount,
  );
}

function restorePreventedNativeDismissForController(controller: any) {
  'worklet';
  const registry = getRegistry(globalThis as Record<string, any>);
  const screenId = screenIdForController(controller, registry);
  const stackId = screenId ? registry.screenParents[screenId] : undefined;
  const ctx = stackId ? registry.stackContexts[stackId] : undefined;
  const reconcile = (globalThis as Record<string, any>)[RECONCILE_STACK_KEY];

  if (!stackId || !ctx || typeof reconcile !== 'function') {
    return;
  }

  // NATIVESCRIPT_PORT_DEVIATION: upstream calls
  // screenView.reactSuperview.updateContainer() from RNSScreen.mm here. The
  // TS controller is not itself an RN UIView child, so it reaches the same
  // stack reconciliation entrypoint through the registry instead.
  reconcile(stackId, registry, ctx, true);
}

function emitSheetDetentChangedForController(
  controller: any,
  index: number,
  isStable: boolean,
) {
  'worklet';
  const registry = getRegistry(globalThis as Record<string, any>);
  const screenId = screenIdForController(controller, registry);

  if (!screenId) {
    return;
  }

  const props = registry.screenProps[screenId];
  const ctx = registry.screenContexts[screenId];

  if (!ctx || typeof props?.onSheetDetentChanged !== 'function') {
    return;
  }

  ctx.emit('onSheetDetentChanged', {
    nativeEvent: {
      index,
      isStable,
    },
  });
}

function transitionContextContainerView(transitionContext: any) {
  'worklet';

  return (
    transitionContext?.containerView ??
    transitionContext?.valueForKey?.('containerView')
  );
}

function stopTransitionProgressNotification(controller: any) {
  'worklet';
  const displayLink = controller?.__nativeScriptTransitionProgressDisplayLink;

  if (displayLink) {
    displayLink.paused = true;

    if (typeof displayLink.invalidate === 'function') {
      displayLink.invalidate();
    }
  }

  const fakeView = controller?.__nativeScriptTransitionProgressFakeView;

  if (typeof fakeView?.removeFromSuperview === 'function') {
    fakeView.removeFromSuperview();
  }

  if (controller) {
    controller.__nativeScriptTransitionProgressDisplayLink = null;
    controller.__nativeScriptTransitionProgressCurrentAlpha = undefined;
  }
}

function setupTransitionProgressNotification(
  controller: any,
  closing: boolean,
  goingForward: boolean,
) {
  'worklet';
  const coordinator = transitionCoordinatorForController(controller);

  if (
    !controller ||
    !coordinator ||
    typeof coordinator.animateAlongsideTransitionCompletion !== 'function' ||
    nativeBool(coordinator, 'isAnimated', true) !== true
  ) {
    return;
  }

  const UIView = nativeValue('UIView');
  const CADisplayLink = nativeValue('CADisplayLink');
  const NSRunLoop = nativeValue('NSRunLoop');
  const NSDefaultRunLoopMode = nativeValue('NSDefaultRunLoopMode');

  if (!UIView || !CADisplayLink || !NSRunLoop || !NSDefaultRunLoopMode) {
    return;
  }

  stopTransitionProgressNotification(controller);

  // Upstream keeps _fakeView and _animationTimer ivars; these expando fields
  // are the NativeScript equivalents owned by this UIViewController instance.
  const allocated = typeof UIView.alloc === 'function' ? UIView.alloc() : null;
  const fakeView =
    controller.__nativeScriptTransitionProgressFakeView ??
    (typeof UIView.new === 'function'
      ? UIView.new()
      : allocated && typeof allocated.init === 'function'
      ? allocated.init()
      : allocated);

  if (!fakeView) {
    return;
  }

  fakeView.alpha = 0;
  controller.__nativeScriptTransitionProgressFakeView = fakeView;
  controller.__nativeScriptTransitionProgressClosing = closing;
  controller.__nativeScriptTransitionProgressGoingForward = goingForward;

  const animate = (context: any) => {
    'worklet';
    transitionContextContainerView(context)?.addSubview?.(fakeView);
    fakeView.alpha = 1;

    const displayLink = CADisplayLink.displayLinkWithTargetSelector(
      controller,
      'handleAnimation:',
    );

    controller.__nativeScriptTransitionProgressDisplayLink = displayLink;
    displayLink.addToRunLoopForMode(
      NSRunLoop.currentRunLoop,
      NSDefaultRunLoopMode,
    );
  };

  const complete = () => {
    'worklet';
    stopTransitionProgressNotification(controller);
  };

  const didSchedule = coordinator.animateAlongsideTransitionCompletion(
    interopBlock(TRANSITION_COORDINATOR_COMPLETION_BLOCK, animate),
    interopBlock(TRANSITION_COORDINATOR_COMPLETION_BLOCK, complete),
  );

  if (didSchedule !== true) {
    stopTransitionProgressNotification(controller);
  }
}

function shouldInstallBackdropTapGestureForPresentation(presentation: unknown) {
  'worklet';

  return (
    presentation === 'modal' ||
    presentation === 'pageSheet' ||
    presentation === 'formSheet'
  );
}

export const __nativeScriptShouldInstallBackdropTapGestureForTests =
  shouldInstallBackdropTapGestureForPresentation;

function shouldReceiveBackdropTapTouch(
  controller: any,
  touch: any,
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';

  if (props?.preventNativeDismiss !== true) {
    return false;
  }

  const presentedView = controller?.presentationController?.presentedView;
  const touchView = touch?.view;

  if (
    presentedView &&
    touchView &&
    typeof touchView.isDescendantOfView === 'function' &&
    touchView.isDescendantOfView(presentedView)
  ) {
    return false;
  }

  return true;
}

export const __nativeScriptShouldReceiveBackdropTapTouchForTests =
  shouldReceiveBackdropTapTouch;

function setupBackdropTapGestureRecognizer(
  controller: any,
  props?: Readonly<NativeScriptScreenStackItemProps>,
  ctx?: any,
) {
  'worklet';

  if (
    !controller ||
    !shouldInstallBackdropTapGestureForPresentation(props?.stackPresentation)
  ) {
    return;
  }

  const presentationController = controller.presentationController;
  const host = presentationController?.containerView;
  const existingGesture = controller.__nativeScriptBackdropTapGestureRecognizer;

  if (!host || typeof host.addGestureRecognizer !== 'function') {
    return;
  }

  if (existingGesture) {
    if (
      !nativeObjectsEqual(
        controller.__nativeScriptBackdropTapGestureRecognizerHost,
        host,
      )
    ) {
      controller.__nativeScriptBackdropTapGestureRecognizerHost?.removeGestureRecognizer?.(
        existingGesture,
      );
      host.addGestureRecognizer(existingGesture);
      controller.__nativeScriptBackdropTapGestureRecognizerHost = host;
    }
    return;
  }

  const UITapGestureRecognizer = nativeValue('UITapGestureRecognizer');

  if (
    !UITapGestureRecognizer ||
    typeof UITapGestureRecognizer.alloc !== 'function' ||
    typeof ctx?.gestureAction !== 'function' ||
    typeof ctx?.delegate !== 'function'
  ) {
    return;
  }

  const allocated = UITapGestureRecognizer.alloc();
  const tap =
    allocated && typeof allocated.init === 'function'
      ? allocated.init()
      : allocated;

  if (!tap) {
    return;
  }

  tap.cancelsTouchesInView = false;
  tap.delaysTouchesBegan = false;
  tap.delaysTouchesEnded = false;

  const delegateProtocol =
    nativeValue('UIGestureRecognizerDelegate') ?? 'UIGestureRecognizerDelegate';
  const delegate = ctx.delegate(tap, delegateProtocol, {
    gestureRecognizerShouldReceiveTouch(_gesture: any, touch: any) {
      'worklet';

      return shouldReceiveBackdropTapTouch(
        controller,
        touch,
        screenPropsForController(controller),
      );
    },
    gestureRecognizerShouldRecognizeSimultaneouslyWithGestureRecognizer() {
      'worklet';

      return true;
    },
  });
  tap.delegate = delegate;

  const state = nativeValue('UIGestureRecognizerState');
  const endedState = state?.Ended ?? state?.ended ?? 3;
  const recognizedState = state?.Recognized ?? state?.recognized ?? 3;

  ctx.gestureAction(tap, (gesture: any) => {
    'worklet';
    const gestureState = gesture?.state;

    if (gestureState !== endedState && gestureState !== recognizedState) {
      return;
    }

    if (screenPropsForController(controller)?.preventNativeDismiss === true) {
      emitNativeDismissCancelledForController(controller, 1);
    }
  });

  controller.__nativeScriptBackdropTapGestureRecognizer = tap;
  controller.__nativeScriptBackdropTapGestureRecognizerHost = host;
  host.addGestureRecognizer(tap);
}

function nativeScriptStackContainerViewClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[STACK_CONTAINER_VIEW_CLASS_KEY];

  if (existing) {
    return existing;
  }

  const UIView = nativeValue('UIView');
  const NativeClassFunction = globalObject.NativeClass;

  if (!UIView || typeof NativeClassFunction !== 'function') {
    return UIView;
  }

  class RNSScreenStackNativeScriptView extends UIView {
    layoutSubviews() {
      'worklet';

      this.super?.layoutSubviews?.();
      const navigationView = this.__nativeScriptEmbeddedNavigationView;

      if (navigationView) {
        navigationView.frame = this.bounds;
        navigationView.autoresizingMask = flexibleSizeMask();
      }
    }

    hitTestWithEvent(point: any, event: any) {
      'worklet';
      const headerHitTestResult = hitTestHeaderSubviewForPoint(
        this,
        this.__nativeScriptNavigationController,
        point,
        event,
      );

      if (headerHitTestResult) {
        return headerHitTestResult;
      }

      const superObject = this.super;

      if (typeof superObject?.hitTestWithEvent === 'function') {
        return superObject.hitTestWithEvent(point, event);
      }

      if (typeof superObject?.['hitTest:withEvent:'] === 'function') {
        return superObject['hitTest:withEvent:'](point, event);
      }

      return null;
    }

    'hitTest:withEvent:'(point: any, event: any) {
      'worklet';

      return this.hitTestWithEvent(point, event);
    }
  }

  const interopTypes = globalObject.interop?.types;
  const idType = interopTypes?.id ?? nativeValue('NSObject') ?? UIView;
  const CGPoint = nativeValue('CGPoint');
  const UIEvent = nativeValue('UIEvent');
  const exposedMethods = {
    layoutSubviews: {
      params: [],
      returns: interopTypes?.void,
    },
    'hitTest:withEvent:': {
      params: [CGPoint ?? idType, UIEvent ?? idType],
      returns: UIView,
    },
  };

  (RNSScreenStackNativeScriptView as any).ObjCExposedMethods = exposedMethods;

  if (typeof UIView.extend === 'function') {
    const methods: Record<string, unknown> = {};
    const methodNames = Object.getOwnPropertyNames(
      RNSScreenStackNativeScriptView.prototype,
    );

    for (const methodName of methodNames) {
      if (methodName === 'constructor') {
        continue;
      }

      const descriptor = Object.getOwnPropertyDescriptor(
        RNSScreenStackNativeScriptView.prototype,
        methodName,
      );

      if (descriptor) {
        Object.defineProperty(methods, methodName, descriptor);
      }
    }

    const StackContainerViewClass = UIView.extend(methods, {
      exposedMethods,
      name: 'RNSScreenStackNativeScriptView',
    });

    globalObject[STACK_CONTAINER_VIEW_CLASS_KEY] = StackContainerViewClass;
    return StackContainerViewClass;
  }

  NativeClassFunction(RNSScreenStackNativeScriptView);
  globalObject[STACK_CONTAINER_VIEW_CLASS_KEY] = RNSScreenStackNativeScriptView;
  return RNSScreenStackNativeScriptView;
}

function nativeScriptScreenControllerClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[SCREEN_CONTROLLER_CLASS_KEY];

  if (existing) {
    return existing;
  }

  const UIViewController = nativeValue('UIViewController');
  const NativeClassFunction = globalObject.NativeClass;

  if (!UIViewController || typeof NativeClassFunction !== 'function') {
    return UIViewController;
  }

  class RNSScreenNativeScriptController extends UIViewController {
    viewWillAppear(animated: boolean) {
      'worklet';

      callNativeScriptControllerSuper(this, 'viewWillAppear', true, animated);
      const transitionCoordinator = transitionCoordinatorForController(this);

      if (this.__nativeScriptScreenIsSwiping !== true) {
        setupBackdropTapGestureRecognizer(
          this,
          screenPropsForController(this),
          this.__nativeScriptScreenContext,
        );
        emitScreenLifecycleEventForController(this, 'onWillAppear');

        if (nativeBool(transitionCoordinator, 'isInteractive')) {
          this.__nativeScriptScreenIsSwiping = true;
        }
      } else {
        this.__nativeScriptScreenShouldNotify = false;
      }

      hideHeaderIfNecessary(this);
      const goingForward =
        nativeBool(this, 'isBeingPresented') ||
        nativeBool(this, 'isMovingToParentViewController');

      this.__nativeScriptTransitionProgressGoingForward = goingForward;

      updateWindowTraits(this);

      if (this.__nativeScriptScreenShouldNotify !== false) {
        emitTransitionProgressForController(this, 0, false, goingForward);
        setupTransitionProgressNotification(this, false, goingForward);
      }
    }

    'viewWillAppear:'(animated: boolean) {
      'worklet';

      this.viewWillAppear(animated);
    }

    viewWillDisappear(animated: boolean) {
      'worklet';

      callNativeScriptControllerSuper(
        this,
        'viewWillDisappear',
        true,
        animated,
      );
      const transitionCoordinator = transitionCoordinatorForController(this);

      this.__nativeScriptDismissCount = dismissCountForController(this);

      if (this.__nativeScriptScreenIsSwiping !== true) {
        emitScreenLifecycleEventForController(this, 'onWillDisappear');

        if (nativeBool(transitionCoordinator, 'isInteractive')) {
          this.__nativeScriptScreenIsSwiping = true;
        }
      } else {
        this.__nativeScriptScreenShouldNotify = false;
      }

      const goingForward = !(
        nativeBool(this, 'isBeingDismissed') ||
        nativeBool(this, 'isMovingFromParentViewController')
      );

      this.__nativeScriptTransitionProgressGoingForward = goingForward;

      if (this.__nativeScriptScreenShouldNotify !== false) {
        emitTransitionProgressForController(this, 0, true, goingForward);
        setupTransitionProgressNotification(this, true, goingForward);
      }
    }

    'viewWillDisappear:'(animated: boolean) {
      'worklet';

      this.viewWillDisappear(animated);
    }

    viewDidAppear(animated: boolean) {
      'worklet';

      callNativeScriptControllerSuper(this, 'viewDidAppear', true, animated);
      this.view?.superview?.bringSubviewToFront?.(this.view);
      layoutHostedReactSubviews(this);

      if (
        this.__nativeScriptScreenIsSwiping !== true ||
        this.__nativeScriptScreenShouldNotify !== false
      ) {
        emitScreenLifecycleEventForController(this, 'onAppear');
        emitTransitionProgressForController(
          this,
          1,
          false,
          this.__nativeScriptTransitionProgressGoingForward === true,
        );
      } else {
        emitScreenLifecycleEventForController(this, 'onGestureCancel', {
          nativeEvent: null,
        });
      }

      this.__nativeScriptScreenIsSwiping = false;
      this.__nativeScriptScreenShouldNotify = true;
      const previousFirstResponder = this.__nativeScriptPreviousFirstResponder;

      if (
        previousFirstResponder &&
        typeof previousFirstResponder.becomeFirstResponder === 'function'
      ) {
        previousFirstResponder.becomeFirstResponder();
      }

      this.__nativeScriptPreviousFirstResponder = null;
      updateWindowTraits(this);
    }

    'viewDidAppear:'(animated: boolean) {
      'worklet';

      this.viewDidAppear(animated);
    }

    viewDidDisappear(animated: boolean) {
      'worklet';

      callNativeScriptControllerSuper(this, 'viewDidDisappear', true, animated);

      if (
        (this.parentViewController == null &&
          this.presentingViewController == null) ||
        this.__nativeScriptIsRemovedFromParent === true
      ) {
        const dismissCount = this.__nativeScriptDismissCount ?? 1;

        if (screenPropsForController(this)?.preventNativeDismiss === true) {
          restorePreventedNativeDismissForController(this);
          emitNativeDismissCancelledForController(this, dismissCount);
        } else {
          emitScreenDismissedForController(this, dismissCount);
        }
      }

      if (
        this.__nativeScriptScreenIsSwiping !== true ||
        this.__nativeScriptScreenShouldNotify !== false
      ) {
        emitScreenLifecycleEventForController(this, 'onDisappear');
        emitTransitionProgressForController(
          this,
          1,
          true,
          this.__nativeScriptTransitionProgressGoingForward === true,
        );
      }

      this.__nativeScriptScreenIsSwiping = false;
      this.__nativeScriptScreenShouldNotify = true;
    }

    'viewDidDisappear:'(animated: boolean) {
      'worklet';

      this.viewDidDisappear(animated);
    }

    viewDidLayoutSubviews() {
      'worklet';

      callNativeScriptControllerSuper(this, 'viewDidLayoutSubviews');
      updateScreenBoundsAfterLayout(this);
    }

    notifyFinishTransitioning() {
      'worklet';

      const previousFirstResponder = this.__nativeScriptPreviousFirstResponder;

      if (
        previousFirstResponder &&
        typeof previousFirstResponder.becomeFirstResponder === 'function'
      ) {
        previousFirstResponder.becomeFirstResponder();
      }

      this.__nativeScriptPreviousFirstResponder = null;
      stopTransitionProgressNotification(this);
      updateWindowTraits(this);
    }

    'handleAnimation:'(_displayLink: any) {
      'worklet';

      const fakeView = this.__nativeScriptTransitionProgressFakeView;

      if (!fakeView?.layer) {
        return;
      }

      const presentationLayer = fakeView.layer.presentationLayer;

      if (!presentationLayer) {
        return;
      }

      const opacity = Number(presentationLayer.opacity ?? 0);

      if (!Number.isFinite(opacity)) {
        return;
      }

      const currentAlpha = Math.max(0, Math.min(1, opacity));

      if (this.__nativeScriptTransitionProgressCurrentAlpha === currentAlpha) {
        return;
      }

      this.__nativeScriptTransitionProgressCurrentAlpha = currentAlpha;
      emitTransitionProgressForController(
        this,
        currentAlpha,
        this.__nativeScriptTransitionProgressClosing === true,
        this.__nativeScriptTransitionProgressGoingForward === true,
      );
    }

    sheetPresentationControllerDidChangeSelectedDetentIdentifier(
      sheetPresentationController: any,
    ) {
      'worklet';
      const identifier = sheetPresentationController?.selectedDetentIdentifier;

      // Direct port of RNSScreen.mm's
      // -sheetPresentationControllerDidChangeSelectedDetentIdentifier:, which
      // maps UIKit's selected detent identifier back to the JS detent index.
      emitSheetDetentChangedForController(
        this,
        sheetDetentIndexFromIdentifier(identifier),
        true,
      );
    }

    'sheetPresentationControllerDidChangeSelectedDetentIdentifier:'(
      sheetPresentationController: any,
    ) {
      'worklet';

      this.sheetPresentationControllerDidChangeSelectedDetentIdentifier(
        sheetPresentationController,
      );
    }

    willMoveToParentViewController(parent: any) {
      'worklet';

      callNativeScriptControllerSuper(
        this,
        'willMoveToParentViewController',
        true,
        parent,
      );

      if (parent == null) {
        const previousFirstResponder = findFirstResponder(this.view);

        if (previousFirstResponder) {
          this.__nativeScriptPreviousFirstResponder = previousFirstResponder;
        }
      } else {
        // Direct port of RNSScreen.mm's willMoveToParentViewController:
        // RNSScreen reapplies first-descendant scroll-view behavior and edge
        // effects when UIKit attaches the controller, because configuration may
        // have run before the hosted RN scroll view was in its final descendant
        // chain.
        overrideScrollViewBehaviorInFirstDescendantChainIfNeeded(this);
        updateContentScrollViewEdgeEffectsIfExists(
          this,
          screenPropsForController(this),
          true,
        );
      }
    }

    'willMoveToParentViewController:'(parent: any) {
      'worklet';

      this.willMoveToParentViewController(parent);
    }

    didMoveToParentViewController(parent: any) {
      'worklet';

      this.__nativeScriptIsRemovedFromParent = parent == null;
      callNativeScriptControllerSuper(
        this,
        'didMoveToParentViewController',
        true,
        parent,
      );
    }

    'didMoveToParentViewController:'(parent: any) {
      'worklet';

      this.didMoveToParentViewController(parent);
    }

    isRemovedFromParent() {
      'worklet';

      return this.__nativeScriptIsRemovedFromParent === true;
    }

    notifyPresentedControllerDismissed() {
      'worklet';

      this.__nativeScriptIsRemovedFromParent = true;
    }

    presentationControllerShouldDismiss(_presentationController: any) {
      'worklet';
      const props = screenPropsForController(this);

      if (props?.preventNativeDismiss === true) {
        return false;
      }

      return props?.gestureEnabled !== false;
    }

    'presentationControllerShouldDismiss:'(presentationController: any) {
      'worklet';

      return this.presentationControllerShouldDismiss(presentationController);
    }

    presentationControllerDidAttemptToDismiss(_presentationController: any) {
      'worklet';
      const props = screenPropsForController(this);

      emitScreenLifecycleEventForController(this, 'onGestureCancel', {
        nativeEvent: {},
      });

      if (props?.preventNativeDismiss === true) {
        emitNativeDismissCancelledForController(this, 1);
      }
    }

    'presentationControllerDidAttemptToDismiss:'(presentationController: any) {
      'worklet';

      this.presentationControllerDidAttemptToDismiss(presentationController);
    }

    presentationControllerDidDismiss(_presentationController: any) {
      'worklet';

      this.notifyPresentedControllerDismissed();
      const completeDismissal = (globalThis as Record<string, any>)[
        COMPLETE_NATIVE_PRESENTED_MODAL_DISMISSAL_KEY
      ];

      if (typeof completeDismissal === 'function') {
        completeDismissal(this);
      }
    }

    'presentationControllerDidDismiss:'(presentationController: any) {
      'worklet';

      this.presentationControllerDidDismiss(presentationController);
    }

    presentViewControllerAnimatedCompletion(
      viewControllerToPresent: any,
      animated: boolean,
      completion: any,
    ) {
      'worklet';

      const present = () => {
        'worklet';
        this.super?.presentViewControllerAnimatedCompletion?.(
          viewControllerToPresent,
          animated,
          completion,
        );
      };

      // Direct port of RNSScreen.mm's -presentViewController:animated:
      // completion: override. External UIKit presenters, such as RN Modal,
      // are delayed through the local React superview controller's transition
      // coordinator when this screen is detached; rootViewController is only a
      // generic fallback if the RN UIView category methods are unavailable.
      const coordinatorController =
        presentationCoordinatorControllerForController(this);

      if (
        this.parentViewController == null &&
        runAfterTransitionCoordinator(coordinatorController, present)
      ) {
        return;
      }

      present();
    }

    setViewToSnapshot() {
      'worklet';
      const view = this.view;
      const superView = view?.superview;

      if (
        !view ||
        !superView ||
        view.window == null ||
        typeof view.snapshotViewAfterScreenUpdates !== 'function'
      ) {
        return;
      }

      const props = screenPropsForController(this) as
        | { snapshotAfterUpdates?: boolean }
        | undefined;
      const snapshot = view.snapshotViewAfterScreenUpdates(
        props?.snapshotAfterUpdates === true,
      );

      if (!snapshot) {
        return;
      }

      snapshot.frame = view.frame;
      view.removeFromSuperview?.();
      this.view = snapshot;
      superView.addSubview?.(snapshot);
    }

    childControllerForNativeScriptWindowTrait(
      propName: string,
      includingModals = false,
    ) {
      'worklet';

      return childControllerForTrait(this, propName, includingModals);
    }

    childViewControllerForStatusBarHidden() {
      'worklet';
      const child = childControllerForTrait(this, 'statusBarHidden', false);

      return child === this ? null : child;
    }

    prefersStatusBarHidden() {
      'worklet';

      return screenPropsForController(this)?.statusBarHidden === true;
    }

    childViewControllerForStatusBarStyle() {
      'worklet';
      const child = childControllerForTrait(this, 'statusBarStyle', false);

      return child === this ? null : child;
    }

    preferredStatusBarStyle() {
      'worklet';

      return statusBarStyleForProps(screenPropsForController(this));
    }

    preferredStatusBarUpdateAnimation() {
      'worklet';
      const child = childControllerForTrait(this, 'statusBarAnimation', false);

      return statusBarAnimationForProps(screenPropsForController(child));
    }

    supportedInterfaceOrientations() {
      'worklet';
      const child = childControllerForTrait(this, 'screenOrientation', true);

      return interfaceOrientationMaskForProps(screenPropsForController(child));
    }

    childViewControllerForHomeIndicatorAutoHidden() {
      'worklet';
      const child = childControllerForTrait(this, 'homeIndicatorHidden', true);

      return child === this ? null : child;
    }

    prefersHomeIndicatorAutoHidden() {
      'worklet';

      return screenPropsForController(this)?.homeIndicatorHidden === true;
    }
  }

  const CADisplayLink = nativeValue('CADisplayLink');
  const UIPresentationController = nativeValue('UIPresentationController');
  const UIAdaptivePresentationControllerDelegate = nativeProtocol(
    'UIAdaptivePresentationControllerDelegate',
  );
  const UISheetPresentationControllerDelegate = nativeProtocol(
    'UISheetPresentationControllerDelegate',
  );
  const UISheetPresentationController = nativeValue(
    'UISheetPresentationController',
  );
  const interopTypes = globalObject.interop?.types;
  const boolType = interopTypes?.bool;

  // NativeScript's exposedMethods option is the generic selector bridge
  // equivalent of RNSScreen exposing -handleAnimation to CADisplayLink and
  // UIKit calling UIViewController lifecycle selectors.
  const exposedMethods = {
    'viewWillAppear:': {
      params: boolType ? [boolType] : [],
      returns: interopTypes?.void,
    },
    'viewWillDisappear:': {
      params: boolType ? [boolType] : [],
      returns: interopTypes?.void,
    },
    'viewDidAppear:': {
      params: boolType ? [boolType] : [],
      returns: interopTypes?.void,
    },
    'viewDidDisappear:': {
      params: boolType ? [boolType] : [],
      returns: interopTypes?.void,
    },
    'willMoveToParentViewController:': {
      params: UIViewController ? [UIViewController] : [],
      returns: interopTypes?.void,
    },
    'didMoveToParentViewController:': {
      params: UIViewController ? [UIViewController] : [],
      returns: interopTypes?.void,
    },
    'handleAnimation:': {
      params: CADisplayLink ? [CADisplayLink] : [],
      returns: interopTypes?.void,
    },
    'sheetPresentationControllerDidChangeSelectedDetentIdentifier:': {
      params: UISheetPresentationController
        ? [UISheetPresentationController]
        : [],
      returns: interopTypes?.void,
    },
    'presentationControllerShouldDismiss:': {
      params: UIPresentationController ? [UIPresentationController] : [],
      returns: boolType,
    },
    'presentationControllerDidAttemptToDismiss:': {
      params: UIPresentationController ? [UIPresentationController] : [],
      returns: interopTypes?.void,
    },
    'presentationControllerDidDismiss:': {
      params: UIPresentationController ? [UIPresentationController] : [],
      returns: interopTypes?.void,
    },
    setViewToSnapshot: {
      params: [],
      returns: interopTypes?.void,
    },
  };

  (RNSScreenNativeScriptController as any).ObjCExposedMethods = exposedMethods;
  const screenControllerProtocols = [];
  if (UIAdaptivePresentationControllerDelegate) {
    screenControllerProtocols.push(UIAdaptivePresentationControllerDelegate);
  }
  if (UISheetPresentationControllerDelegate) {
    screenControllerProtocols.push(UISheetPresentationControllerDelegate);
  }
  if (screenControllerProtocols.length > 0) {
    (RNSScreenNativeScriptController as any).ObjCProtocols =
      screenControllerProtocols;
  }

  if (typeof UIViewController.extend === 'function') {
    const methods: Record<string, unknown> = {};
    const methodNames = Object.getOwnPropertyNames(
      RNSScreenNativeScriptController.prototype,
    );

    for (const methodName of methodNames) {
      if (methodName === 'constructor') {
        continue;
      }

      const descriptor = Object.getOwnPropertyDescriptor(
        RNSScreenNativeScriptController.prototype,
        methodName,
      );

      if (descriptor) {
        Object.defineProperty(methods, methodName, descriptor);
      }
    }

    const ScreenControllerClass = UIViewController.extend(methods, {
      exposedMethods,
      name: 'RNSScreenNativeScriptController',
      ...(screenControllerProtocols.length > 0
        ? { protocols: screenControllerProtocols }
        : {}),
    });

    globalObject[SCREEN_CONTROLLER_CLASS_KEY] = ScreenControllerClass;
    return ScreenControllerClass;
  }

  NativeClassFunction(RNSScreenNativeScriptController);
  globalObject[SCREEN_CONTROLLER_CLASS_KEY] = RNSScreenNativeScriptController;
  return RNSScreenNativeScriptController;
}

function nativeScriptNavigationControllerClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[NAVIGATION_CONTROLLER_CLASS_KEY];

  if (existing) {
    return existing;
  }

  const UINavigationController = nativeValue('UINavigationController');
  const NativeClassFunction = globalObject.NativeClass;

  if (!UINavigationController || typeof NativeClassFunction !== 'function') {
    return UINavigationController;
  }

  class RNSNavigationNativeScriptController extends UINavigationController {
    viewDidLayoutSubviews() {
      'worklet';

      super.viewDidLayoutSubviews();
      emitTopScreenHeaderHeightAfterNavigationLayout(this);
    }

    childViewControllerForStatusBarStyle() {
      'worklet';

      return this.topViewController ?? null;
    }

    childViewControllerForStatusBarHidden() {
      'worklet';

      return this.topViewController ?? null;
    }

    preferredStatusBarUpdateAnimation() {
      'worklet';

      return typeof this.topViewController
        ?.preferredStatusBarUpdateAnimation === 'function'
        ? this.topViewController.preferredStatusBarUpdateAnimation()
        : statusBarAnimationForProps(
            screenPropsForController(this.topViewController),
          );
    }

    supportedInterfaceOrientations() {
      'worklet';

      return typeof this.topViewController?.supportedInterfaceOrientations ===
        'function'
        ? this.topViewController.supportedInterfaceOrientations()
        : interfaceOrientationMaskForProps(
            screenPropsForController(this.topViewController),
          );
    }

    childViewControllerForHomeIndicatorAutoHidden() {
      'worklet';

      return this.topViewController ?? null;
    }
  }

  NativeClassFunction(RNSNavigationNativeScriptController);
  globalObject[NAVIGATION_CONTROLLER_CLASS_KEY] =
    RNSNavigationNativeScriptController;
  return RNSNavigationNativeScriptController;
}

function navigationControllerContainsController(
  navigationController: any,
  controller: any,
) {
  'worklet';

  if (!navigationController || !controller) {
    return false;
  }

  const viewControllers = navigationController.viewControllers;
  const count = arrayCount(viewControllers);

  for (let index = 0; index < count; index += 1) {
    if (controllersEqual(arrayItem(viewControllers, index), controller)) {
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

function screenControllerWasRemovedFromParent(controller: any) {
  'worklet';

  if (typeof controller?.isRemovedFromParent === 'function') {
    return controller.isRemovedFromParent() === true;
  }

  return controller?.__nativeScriptIsRemovedFromParent === true;
}

function screenControllerIsVisibleInNativeStack(
  stackId: string,
  controller: any,
  registry: NativeScriptStackRegistry,
) {
  'worklet';

  const screenId = screenIdForController(controller, registry);
  const presentedModalKey = registry.stackPresentedModalKeys[stackId];
  const presentedModalIds =
    typeof presentedModalKey === 'string'
      ? presentedModalKey.split(SCREEN_ID_SEPARATOR)
      : [];

  if (screenControllerWasRemovedFromParent(controller)) {
    return false;
  }

  return (
    navigationControllerContainsController(
      registry.stacks[stackId],
      controller,
    ) ||
    (screenId != null && screenIdInList(screenId, presentedModalIds))
  );
}

function screenPropsForTransitionController(
  controller: any,
  registry: NativeScriptStackRegistry,
) {
  'worklet';
  const screenId = screenIdForController(controller, registry);

  return screenId ? registry.screenProps[screenId] : undefined;
}

function shouldCancelDismissFromControllerToController(
  stackId: string,
  registry: NativeScriptStackRegistry,
  fromController: any,
  toController: any,
) {
  'worklet';
  const fromScreenId = screenIdForController(fromController, registry);
  const toScreenId = screenIdForController(toController, registry);
  const activeIds = registry.stackActiveScreenIds[stackId] ?? [];
  const fromIndex = fromScreenId ? activeIds.indexOf(fromScreenId) : -1;
  const toIndex = toScreenId ? activeIds.indexOf(toScreenId) : -1;

  if (fromIndex < 0 || toIndex < 0 || fromIndex <= toIndex) {
    return false;
  }

  for (let index = fromIndex; index > toIndex; index -= 1) {
    if (registry.screenProps[activeIds[index]]?.preventNativeDismiss === true) {
      return true;
    }
  }

  return false;
}

function dismissCountFromControllerToController(
  stackId: string,
  registry: NativeScriptStackRegistry,
  fromController: any,
  toController: any,
) {
  'worklet';
  const fromScreenId = screenIdForController(fromController, registry);
  const toScreenId = screenIdForController(toController, registry);
  const activeIds = registry.stackActiveScreenIds[stackId] ?? [];
  const fromIndex = fromScreenId ? activeIds.indexOf(fromScreenId) : -1;
  const toIndex = toScreenId ? activeIds.indexOf(toScreenId) : -1;
  const dismissCount = fromIndex - toIndex;

  return dismissCount > 0 ? dismissCount : 1;
}

function cleanupDetachedScreens(
  stackId: string,
  registry: NativeScriptStackRegistry,
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
        registry,
      )
    ) {
      continue;
    }

    clearScreenRecord(registry, screenId);
  }
}

function navigationControllerScreenIds(
  navigationController: any,
  registry: NativeScriptStackRegistry,
) {
  'worklet';
  const ids: string[] = [];
  const viewControllers = navigationController?.viewControllers;
  const count = arrayCount(viewControllers);

  for (let index = 0; index < count; index += 1) {
    const screenId = screenIdForController(
      arrayItem(viewControllers, index),
      registry,
    );

    if (screenId) {
      ids.push(screenId);
    }
  }

  return ids;
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

function presentedModalIdsForStack(
  stackId: string,
  registry: NativeScriptStackRegistry,
) {
  'worklet';

  return idsFromKey(registry.stackPresentedModalKeys[stackId]);
}

function setPresentedModalIdsForStack(
  stackId: string,
  registry: NativeScriptStackRegistry,
  modalIds: string[],
) {
  'worklet';

  registry.stackPresentedModalKeys[stackId] =
    modalIds.length > 0 ? idsKey(modalIds) : undefined;
}

function presentedModalCommonRootIndex(
  stackId: string,
  registry: NativeScriptStackRegistry,
  nextModalIds: string[],
) {
  'worklet';
  const previousModalIds = presentedModalIdsForStack(stackId, registry);
  const count = Math.min(previousModalIds.length, nextModalIds.length);

  for (let index = 0; index < count; index += 1) {
    if (previousModalIds[index] !== nextModalIds[index]) {
      return index;
    }
  }

  return count;
}

function hasPresentedModalReshuffleAfterCommonRoot(
  stackId: string,
  registry: NativeScriptStackRegistry,
  nextModalIds: string[],
  commonRootIndex: number,
) {
  'worklet';
  const previousModalIds = presentedModalIdsForStack(stackId, registry);

  for (let index = commonRootIndex; index < nextModalIds.length; index += 1) {
    if (previousModalIds.includes(nextModalIds[index])) {
      return true;
    }
  }

  return false;
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

function controllersForStackUIKitModelIds(
  ids: string[],
  registry: NativeScriptStackRegistry,
) {
  'worklet';
  const controllers: any[] = [];
  const availableIds: string[] = [];

  for (const id of ids) {
    const controller = registry.screens[id];

    if (!controller) {
      continue;
    }

    const props = registry.screenProps[id];
    const removedFromParent = screenControllerWasRemovedFromParent(controller);

    if (controllers.length === 0) {
      // Direct port of RNSScreenStackView.updateContainer: the first active
      // screen is always placed into the push controller model, regardless of
      // stackPresentation.
      controllers.push(controller);
      availableIds.push(id);
      continue;
    }

    if (isModalPresentation(props?.stackPresentation)) {
      if (removedFromParent) {
        // Direct port of the modal branch in updateContainer. Once UIKit has
        // removed a modal controller, stale asynchronous JS state must not
        // present it again or reshuffle the presented controller chain.
        continue;
      }
    } else if (removedFromParent && props?.preventNativeDismiss !== true) {
      // Direct port of the push branch in updateContainer. Native-dismissed
      // pushed screens are filtered out after UIKit removes them, except for
      // preventNativeDismiss, which upstream intentionally reattaches so the
      // cancellation callback can restore JS state.
      continue;
    }

    controllers.push(controller);
    availableIds.push(id);
  }

  return { availableIds, controllers };
}

export const __nativeScriptControllersForStackUIKitModelIdsForTests =
  controllersForStackUIKitModelIds;

function viewControllersEqual(viewControllers: any, controllers: any[]) {
  'worklet';
  const count = arrayCount(viewControllers);

  if (count !== controllers.length) {
    return false;
  }

  for (let index = 0; index < count; index += 1) {
    if (
      !controllersEqual(arrayItem(viewControllers, index), controllers[index])
    ) {
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
    if (
      !controllersEqual(arrayItem(viewControllers, index), controllers[index])
    ) {
      return false;
    }
  }

  return true;
}

function animateWithDuration(
  duration: number,
  animations: () => void,
  completion: () => void,
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
      completion,
    );
    return;
  }

  animations();
  completion();
}

function animateWithDurationOnly(duration: number, animations: () => void) {
  'worklet';
  animateWithDuration(duration, animations, () => {
    'worklet';
  });
}

function viewAnimationCurve(name: string, fallback: number) {
  'worklet';
  const curve = nativeValue('UIViewAnimationCurve');

  return curve?.[name] ?? curve?.[name.toLowerCase()] ?? fallback;
}

function defaultSpringTimingParametersApprox() {
  'worklet';
  const UISpringTimingParameters = nativeValue('UISpringTimingParameters');

  if (
    !UISpringTimingParameters ||
    typeof UISpringTimingParameters.alloc !== 'function'
  ) {
    return null;
  }

  const allocated = UISpringTimingParameters.alloc();

  if (allocated && typeof allocated.initWithDampingRatio === 'function') {
    return allocated.initWithDampingRatio(4.56);
  }

  return allocated?.init?.() ?? allocated;
}

function transitionContextIsInteractive(transitionContext: any) {
  'worklet';

  if (typeof transitionContext?.isInteractive === 'function') {
    return Boolean(transitionContext.isInteractive());
  }

  return transitionContext?.isInteractive === true;
}

function createPropertyAnimator(
  duration: number,
  animations: () => void,
  completion: () => void,
  options?: {
    curve?: number;
    interactive?: boolean;
    timingParameters?: any;
  },
) {
  'worklet';
  const UIViewPropertyAnimator = nativeValue('UIViewPropertyAnimator');

  if (
    UIViewPropertyAnimator &&
    typeof UIViewPropertyAnimator.alloc === 'function'
  ) {
    const allocated = UIViewPropertyAnimator.alloc();
    let animator: any = null;

    if (
      options?.timingParameters &&
      typeof allocated?.initWithDurationTimingParameters === 'function'
    ) {
      animator = allocated.initWithDurationTimingParameters(
        duration,
        options.timingParameters,
      );
      animator?.addAnimations?.(animations);
    } else if (
      typeof allocated?.initWithDurationCurveAnimations === 'function'
    ) {
      animator = allocated.initWithDurationCurveAnimations(
        duration,
        options?.curve ?? viewAnimationCurve('EaseInOut', 0),
        animations,
      );
    }

    if (animator) {
      animator.addCompletion?.(() => {
        'worklet';
        completion();
      });

      if (!options?.interactive) {
        animator.startAnimation?.();
      } else {
        animator.userInteractionEnabled = true;
      }

      return animator;
    }
  }

  throw new Error(
    'UIViewPropertyAnimator is required for RNSScreenStackAnimator parity',
  );
}

function runTransitionAnimation(
  owner: any,
  duration: number,
  transitionContext: any,
  operation: number,
  animations: () => void,
  completion: () => void,
  options?: {
    curve?: number;
    timingParameters?: any;
  },
) {
  'worklet';
  const interactive =
    isPopOperation(operation) &&
    transitionContextIsInteractive(transitionContext);
  const animator = createPropertyAnimator(duration, animations, completion, {
    ...options,
    interactive,
  });

  if (owner) {
    owner.inFlightAnimator = animator;
  }

  return animator;
}

function transitionContextViewController(
  transitionContext: any,
  keyName: string,
) {
  'worklet';
  const key = nativeValue(keyName) ?? keyName;

  if (typeof transitionContext?.viewControllerForKey === 'function') {
    return transitionContext.viewControllerForKey(key);
  }

  if (typeof transitionContext?.valueForKey === 'function') {
    return transitionContext.valueForKey(keyName);
  }

  return null;
}

function transitionContextFinalFrame(transitionContext: any, controller: any) {
  'worklet';

  if (
    controller &&
    typeof transitionContext?.finalFrameForViewController === 'function'
  ) {
    return transitionContext.finalFrameForViewController(controller);
  }

  return controller?.view?.frame;
}

function transitionContextWasCancelled(transitionContext: any) {
  'worklet';
  const cancelled = transitionContext?.transitionWasCancelled;

  return typeof cancelled === 'function'
    ? transitionContext.transitionWasCancelled()
    : cancelled === true;
}

function completeTransition(transitionContext: any) {
  'worklet';

  if (typeof transitionContext?.completeTransition === 'function') {
    transitionContext.completeTransition(
      !transitionContextWasCancelled(transitionContext),
    );
  }
}

function identityTransform() {
  'worklet';

  return (
    nativeValue('CGAffineTransformIdentity') ?? {
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      tx: 0,
      ty: 0,
    }
  );
}

function translationTransform(x: number, y: number) {
  'worklet';
  const makeTranslation = nativeValue('CGAffineTransformMakeTranslation');

  if (typeof makeTranslation === 'function') {
    return makeTranslation(x, y);
  }

  return {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    tx: x,
    ty: y,
  };
}

function viewIsRTL(view: any) {
  'worklet';
  const semantic = nativeValue('UISemanticContentAttribute');
  const forceRTL =
    semantic?.ForceRightToLeft ?? semantic?.forceRightToLeft ?? 4;

  return view?.semanticContentAttribute === forceRTL;
}

function navigationControllerIsRTL(navigationController: any) {
  'worklet';

  return viewIsRTL(navigationController?.view);
}

function resetTransitionViews(toViewController: any, fromViewController: any) {
  'worklet';
  const identity = identityTransform();

  if (fromViewController?.view) {
    fromViewController.view.transform = identity;
    fromViewController.view.alpha = 1;
  }

  if (toViewController?.view) {
    toViewController.view.transform = identity;
    toViewController.view.alpha = 1;
  }
}

function makeTransitionShadowView(frame: any) {
  'worklet';
  const UIView = nativeValue('UIView');
  const UIColor = nativeValue('UIColor');

  if (!UIView || typeof UIView.alloc !== 'function') {
    return null;
  }

  const allocated = UIView.alloc();
  const view =
    allocated && typeof allocated.initWithFrame === 'function'
      ? allocated.initWithFrame(frame)
      : allocated?.init?.() ?? allocated;

  if (view) {
    view.frame = frame;
    view.backgroundColor = UIColor?.blackColor ?? null;
  }

  return view;
}

function finishCustomTransition(
  transitionContext: any,
  toViewController: any,
  fromViewController: any,
  shadowView?: any,
) {
  'worklet';

  if (shadowView && typeof shadowView.removeFromSuperview === 'function') {
    shadowView.removeFromSuperview();
  }

  resetTransitionViews(toViewController, fromViewController);
  completeTransition(transitionContext);
}

function animateSimplePushTransition(
  owner: any,
  operation: number,
  transitionContext: any,
  toViewController: any,
  fromViewController: any,
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';
  const containerView = transitionContextContainerView(transitionContext);
  const containerWidth = containerView?.bounds?.size?.width ?? 0;
  const belowViewWidth = containerWidth * 0.3;
  let rightTransform = translationTransform(containerWidth, 0);
  let leftTransform = translationTransform(-belowViewWidth, 0);

  if (navigationControllerIsRTL(toViewController?.navigationController)) {
    rightTransform = translationTransform(-containerWidth, 0);
    leftTransform = translationTransform(belowViewWidth, 0);
  }

  const duration = transitionDurationForProps(props);
  const shadowEnabled = props?.fullScreenSwipeShadowEnabled !== false;
  const shadowView = shadowEnabled
    ? makeTransitionShadowView(fromViewController?.view?.frame)
    : null;

  if (isPushOperation(operation)) {
    toViewController.view.transform = rightTransform;
    containerView?.addSubview?.(toViewController.view);

    if (shadowView) {
      containerView?.insertSubviewBelowSubview?.(
        shadowView,
        toViewController.view,
      );
      shadowView.alpha = 0;
    }

    runTransitionAnimation(
      owner,
      duration,
      transitionContext,
      operation,
      () => {
        'worklet';
        fromViewController.view.transform = leftTransform;
        toViewController.view.transform = identityTransform();
        if (shadowView) {
          shadowView.alpha = RNS_SHADOW_VIEW_MAX_ALPHA;
        }
      },
      () => {
        'worklet';
        finishCustomTransition(
          transitionContext,
          toViewController,
          fromViewController,
          shadowView,
        );
      },
    );
    return;
  }

  if (isPopOperation(operation)) {
    toViewController.view.transform = leftTransform;
    containerView?.insertSubviewBelowSubview?.(
      toViewController.view,
      fromViewController.view,
    );

    if (shadowView) {
      containerView?.insertSubviewBelowSubview?.(
        shadowView,
        fromViewController.view,
      );
      shadowView.alpha = RNS_SHADOW_VIEW_MAX_ALPHA;
    }

    runTransitionAnimation(
      owner,
      duration,
      transitionContext,
      operation,
      () => {
        'worklet';
        toViewController.view.transform = identityTransform();
        fromViewController.view.transform = rightTransform;
        if (shadowView) {
          shadowView.alpha = 0;
        }
      },
      () => {
        'worklet';
        finishCustomTransition(
          transitionContext,
          toViewController,
          fromViewController,
          shadowView,
        );
      },
    );
  }
}

function animateSlideFromLeftTransition(
  owner: any,
  operation: number,
  transitionContext: any,
  toViewController: any,
  fromViewController: any,
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';
  const containerView = transitionContextContainerView(transitionContext);
  const containerWidth = containerView?.bounds?.size?.width ?? 0;
  const belowViewWidth = containerWidth * 0.3;
  let rightTransform = translationTransform(-containerWidth, 0);
  let leftTransform = translationTransform(belowViewWidth, 0);

  if (navigationControllerIsRTL(toViewController?.navigationController)) {
    rightTransform = translationTransform(containerWidth, 0);
    leftTransform = translationTransform(-belowViewWidth, 0);
  }

  if (isPushOperation(operation)) {
    toViewController.view.transform = rightTransform;
    containerView?.addSubview?.(toViewController.view);
  } else if (isPopOperation(operation)) {
    toViewController.view.transform = leftTransform;
    containerView?.insertSubviewBelowSubview?.(
      toViewController.view,
      fromViewController.view,
    );
  }

  runTransitionAnimation(
    owner,
    transitionDurationForProps(props),
    transitionContext,
    operation,
    () => {
      'worklet';
      toViewController.view.transform = identityTransform();
      fromViewController.view.transform = isPushOperation(operation)
        ? leftTransform
        : rightTransform;
    },
    () => {
      'worklet';
      finishCustomTransition(
        transitionContext,
        toViewController,
        fromViewController,
      );
    },
  );
}

function animateFadeTransition(
  owner: any,
  operation: number,
  transitionContext: any,
  toViewController: any,
  fromViewController: any,
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';
  const containerView = transitionContextContainerView(transitionContext);

  if (isPushOperation(operation)) {
    containerView?.addSubview?.(toViewController.view);
    toViewController.view.alpha = 0;
  } else if (isPopOperation(operation)) {
    containerView?.insertSubviewBelowSubview?.(
      toViewController.view,
      fromViewController.view,
    );
  }

  runTransitionAnimation(
    owner,
    transitionDurationForProps(props),
    transitionContext,
    operation,
    () => {
      'worklet';
      if (isPushOperation(operation)) {
        toViewController.view.alpha = 1;
      } else {
        fromViewController.view.alpha = 0;
      }
    },
    () => {
      'worklet';
      finishCustomTransition(
        transitionContext,
        toViewController,
        fromViewController,
      );
    },
  );
}

function animateSlideFromBottomTransition(
  owner: any,
  operation: number,
  transitionContext: any,
  toViewController: any,
  fromViewController: any,
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';
  const containerView = transitionContextContainerView(transitionContext);
  const height = containerView?.bounds?.size?.height ?? 0;
  const bottomTransform = translationTransform(0, height);

  if (isPushOperation(operation)) {
    toViewController.view.transform = bottomTransform;
    containerView?.addSubview?.(toViewController.view);
  } else if (isPopOperation(operation)) {
    toViewController.view.transform = identityTransform();
    containerView?.insertSubviewBelowSubview?.(
      toViewController.view,
      fromViewController.view,
    );
  }

  runTransitionAnimation(
    owner,
    transitionDurationForProps(props),
    transitionContext,
    operation,
    () => {
      'worklet';
      toViewController.view.transform = identityTransform();
      fromViewController.view.transform = isPopOperation(operation)
        ? bottomTransform
        : identityTransform();
    },
    () => {
      'worklet';
      finishCustomTransition(
        transitionContext,
        toViewController,
        fromViewController,
      );
    },
  );
}

function animateFadeFromBottomTransition(
  owner: any,
  operation: number,
  transitionContext: any,
  toViewController: any,
  fromViewController: any,
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';
  const containerView = transitionContextContainerView(transitionContext);
  const height = containerView?.bounds?.size?.height ?? 0;
  const bottomTransform = translationTransform(0, 0.08 * height);
  const baseDuration = transitionDurationForProps(props);

  if (isPushOperation(operation)) {
    toViewController.view.transform = bottomTransform;
    toViewController.view.alpha = 0;
    containerView?.addSubview?.(toViewController.view);

    animateWithDurationOnly(
      baseDuration * RNS_FADE_OPEN_TRANSITION_DURATION_PROPORTION,
      () => {
        'worklet';
        toViewController.view.alpha = 1;
      },
    );
    runTransitionAnimation(
      owner,
      baseDuration * RNS_SLIDE_OPEN_TRANSITION_DURATION_PROPORTION,
      transitionContext,
      operation,
      () => {
        'worklet';
        toViewController.view.transform = identityTransform();
      },
      () => {
        'worklet';
        finishCustomTransition(
          transitionContext,
          toViewController,
          fromViewController,
        );
      },
    );
    return;
  }

  if (isPopOperation(operation)) {
    containerView?.insertSubviewBelowSubview?.(
      toViewController.view,
      fromViewController.view,
    );

    const runFade = () => {
      'worklet';
      animateWithDurationOnly(
        baseDuration * RNS_FADE_CLOSE_TRANSITION_DURATION_PROPORTION,
        () => {
          'worklet';
          fromViewController.view.alpha = 0;
        },
      );
    };

    if (typeof setTimeout === 'function') {
      setTimeout(
        runFade,
        baseDuration *
          RNS_FADE_CLOSE_DELAY_TRANSITION_DURATION_PROPORTION *
          1000,
      );
    } else {
      runFade();
    }

    runTransitionAnimation(
      owner,
      baseDuration * RNS_SLIDE_CLOSE_TRANSITION_DURATION_PROPORTION,
      transitionContext,
      operation,
      () => {
        'worklet';
        fromViewController.view.transform = bottomTransform;
      },
      () => {
        'worklet';
        finishCustomTransition(
          transitionContext,
          toViewController,
          fromViewController,
        );
      },
    );
  }
}

function animateNoneTransition(
  owner: any,
  operation: number,
  transitionContext: any,
  toViewController: any,
  fromViewController: any,
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';

  animateFadeTransition(
    owner,
    operation,
    transitionContext,
    toViewController,
    fromViewController,
    props,
  );
}

function animateTransitionWithStackAnimation(
  owner: any,
  operation: number,
  animation: unknown,
  transitionContext: any,
  toViewController: any,
  fromViewController: any,
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';

  switch (animation) {
    case 'slide_from_left':
      animateSlideFromLeftTransition(
        owner,
        operation,
        transitionContext,
        toViewController,
        fromViewController,
        props,
      );
      return;
    case 'fade':
      animateFadeTransition(
        owner,
        operation,
        transitionContext,
        toViewController,
        fromViewController,
        props,
      );
      return;
    case 'slide_from_bottom':
      animateSlideFromBottomTransition(
        owner,
        operation,
        transitionContext,
        toViewController,
        fromViewController,
        props,
      );
      return;
    case 'fade_from_bottom':
      animateFadeFromBottomTransition(
        owner,
        operation,
        transitionContext,
        toViewController,
        fromViewController,
        props,
      );
      return;
    case 'none':
      animateNoneTransition(
        owner,
        operation,
        transitionContext,
        toViewController,
        fromViewController,
        props,
      );
      return;
    case 'simple_push':
    default:
      animateSimplePushTransition(
        owner,
        operation,
        transitionContext,
        toViewController,
        fromViewController,
        props,
      );
  }
}

function screenStackAnimatorClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[SCREEN_STACK_ANIMATOR_CLASS_KEY];

  if (existing) {
    return existing;
  }

  const NSObject = nativeValue('NSObject');
  const protocol = nativeProtocol('UIViewControllerAnimatedTransitioning');

  if (!NSObject || typeof NSObject.extend !== 'function' || !protocol) {
    throw new Error(
      'NSObject.extend with UIViewControllerAnimatedTransitioning is required for RNSScreenStackAnimator parity',
    );
  }

  const AnimatorClass = NSObject.extend(
    {
      init() {
        'worklet';
        this.super.init();
        this.inFlightAnimator = null;
        return this;
      },
      transitionDuration(_transitionContext: any) {
        'worklet';

        return transitionDurationForProps(this.props);
      },
      animateTransition(transitionContext: any) {
        'worklet';
        const toViewController = transitionContextViewController(
          transitionContext,
          'UITransitionContextToViewControllerKey',
        );
        const fromViewController = transitionContextViewController(
          transitionContext,
          'UITransitionContextFromViewControllerKey',
        );
        const finalFrame = transitionContextFinalFrame(
          transitionContext,
          toViewController,
        );

        if (!toViewController?.view || !fromViewController?.view) {
          completeTransition(transitionContext);
          return;
        }

        if (finalFrame) {
          toViewController.view.frame = finalFrame;
        }

        animateTransitionWithStackAnimation(
          this,
          this.operation,
          stackAnimationForProps(this.props),
          transitionContext,
          toViewController,
          fromViewController,
          this.props,
        );
      },
      animationEnded() {
        'worklet';

        this.inFlightAnimator = null;
        this.__nativeScriptRetainer?.release?.(this);
      },
      timingParamsForAnimationCompletion() {
        'worklet';

        return defaultSpringTimingParametersApprox();
      },
    },
    {
      name: 'RNSScreenStackAnimator',
      protocols: [protocol],
    },
  );

  globalObject[SCREEN_STACK_ANIMATOR_CLASS_KEY] = AnimatorClass;
  return AnimatorClass;
}

function createScreenStackAnimator(
  ctx: any,
  operation: number,
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';
  const AnimatorClass = screenStackAnimatorClass();
  const allocated = AnimatorClass.alloc();
  const animator =
    allocated && typeof allocated.init === 'function'
      ? allocated.init()
      : allocated;

  animator.inFlightAnimator = null;
  animator.operation = operation;
  animator.props = props;
  animator.__nativeScriptRetainer = ctx;
  ctx.retain(animator);

  return animator;
}

function finalizeInteractiveTransition(
  interactionController: any,
  cancelled: boolean,
) {
  'worklet';
  const animationController = interactionController?.animationController;
  const animator = animationController?.inFlightAnimator;

  if (!animator) {
    return;
  }

  const timingParams =
    typeof animationController.timingParamsForAnimationCompletion === 'function'
      ? animationController.timingParamsForAnimationCompletion()
      : null;

  animator.pauseAnimation?.();

  if (typeof animator.setReversed === 'function') {
    animator.setReversed(cancelled);
  } else {
    animator.reversed = cancelled;
  }

  const fractionComplete =
    typeof animator.fractionComplete === 'number'
      ? animator.fractionComplete
      : 0;
  const durationFactor = Math.max(0, 1 - fractionComplete);

  if (
    typeof animator.continueAnimationWithTimingParametersDurationFactor ===
    'function'
  ) {
    animator.continueAnimationWithTimingParametersDurationFactor(
      timingParams,
      durationFactor,
    );
  } else {
    animator.startAnimation?.();
  }

  interactionController.animationController = null;
}

function percentDrivenInteractiveTransitionClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing =
    globalObject[PERCENT_DRIVEN_INTERACTIVE_TRANSITION_CLASS_KEY];

  if (existing) {
    return existing;
  }

  const UIPercentDrivenInteractiveTransition = nativeValue(
    'UIPercentDrivenInteractiveTransition',
  );

  if (
    !UIPercentDrivenInteractiveTransition ||
    typeof UIPercentDrivenInteractiveTransition.extend !== 'function'
  ) {
    return null;
  }

  const InteractionClass = UIPercentDrivenInteractiveTransition.extend(
    {
      init() {
        'worklet';
        this.super.init();
        this.animationController = null;
        return this;
      },
      startInteractiveTransition(transitionContext: any) {
        'worklet';
        this.super.startInteractiveTransition(transitionContext);
      },
      updateInteractiveTransition(percentComplete: number) {
        'worklet';
        const animator = this.animationController?.inFlightAnimator;

        if (animator) {
          if (typeof animator.setFractionComplete === 'function') {
            animator.setFractionComplete(percentComplete);
          } else {
            animator.fractionComplete = percentComplete;
          }
        }

        this.super.updateInteractiveTransition(percentComplete);
      },
      finishInteractiveTransition() {
        'worklet';
        finalizeInteractiveTransition(this, false);
        this.super.finishInteractiveTransition();
      },
      cancelInteractiveTransition() {
        'worklet';
        finalizeInteractiveTransition(this, true);
        this.super.cancelInteractiveTransition();
      },
      setAnimationController(animationController: any) {
        'worklet';
        this.animationController = animationController;
      },
      getAnimationController() {
        'worklet';

        return this.animationController;
      },
    },
    {
      name: 'RNSPercentDrivenInteractiveTransition',
    },
  );

  globalObject[PERCENT_DRIVEN_INTERACTIVE_TRANSITION_CLASS_KEY] =
    InteractionClass;
  return InteractionClass;
}

function createPercentDrivenInteractiveTransition(ctx: any) {
  'worklet';
  const InteractionClass = percentDrivenInteractiveTransitionClass();

  if (!InteractionClass) {
    return null;
  }

  const allocated = InteractionClass.alloc();
  const interactionController =
    allocated && typeof allocated.init === 'function'
      ? allocated.init()
      : allocated;

  ctx.retain(interactionController);

  return interactionController;
}

function updateNativeBackGesture(navigationController: any) {
  'worklet';
  const count = arrayCount(navigationController.viewControllers);
  const enabled = count > 1;
  const popGesture = navigationController?.interactivePopGestureRecognizer;
  const contentGesture =
    navigationController?.interactiveContentPopGestureRecognizer;

  if (popGesture) {
    popGesture.enabled = enabled;
  }

  if (contentGesture && !nativeObjectsEqual(contentGesture, popGesture)) {
    contentGesture.enabled = enabled;
  }
}

function resetNavigationControllerToPlaceholder(navigationController: any) {
  'worklet';
  const placeholder = createPlaceholderViewController();

  if (!placeholder) {
    return;
  }

  const viewControllers = createArray([placeholder]);

  if (typeof navigationController?.setViewControllersAnimated === 'function') {
    navigationController.setViewControllersAnimated(viewControllers, false);
  } else if (navigationController) {
    navigationController.viewControllers = viewControllers;
  }
}

function prepareStackControllerForRecycle(navigationController: any) {
  'worklet';

  if (!navigationController) {
    return;
  }

  // Direct port of RNSScreenStackView.prepareForRecycle: dismiss any
  // presented chain, detach the UINavigationController containment, and reset
  // the model to the initial placeholder. This matters for nested stacks
  // because UIKit can otherwise keep the old UINavigationController registered
  // as the scroll-edge observer for a reused React scroll view after a
  // modal/header stack is dismissed.
  if (
    navigationController.presentedViewController &&
    typeof navigationController.dismissViewControllerAnimatedCompletion ===
      'function'
  ) {
    navigationController.dismissViewControllerAnimatedCompletion(false, null);
  }

  if (
    typeof navigationController.willMoveToParentViewController === 'function'
  ) {
    navigationController.willMoveToParentViewController(null);
  }

  navigationController.__nativeScriptEmbeddedNavigationView?.removeFromSuperview?.();
  navigationController.view?.removeFromSuperview?.();

  if (
    typeof navigationController.removeFromParentViewController === 'function'
  ) {
    navigationController.removeFromParentViewController();
  }

  resetNavigationControllerToPlaceholder(navigationController);
  navigationController.delegate = null;
}

function nativeScriptScreenContainerControllerClass() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const existing = globalObject[SCREEN_CONTAINER_CONTROLLER_CLASS_KEY];

  if (existing) {
    return existing;
  }

  const UIViewController = nativeValue('UIViewController');
  const NativeClassFunction = globalObject.NativeClass;

  if (!UIViewController || typeof NativeClassFunction !== 'function') {
    return UIViewController;
  }

  class RNSScreenContainerNativeScriptController extends UIViewController {
    findActiveChildVC() {
      'worklet';
      const registry = getRegistry(globalThis as Record<string, any>);
      const activeIds =
        registry.containerActiveScreenIds[this.__nativeScriptContainerId] ?? [];

      for (const screenId of activeIds) {
        const child = registry.screens[screenId];

        if (registry.screenProps[screenId]?.activityState === 2 && child) {
          return child;
        }
      }

      for (let index = activeIds.length - 1; index >= 0; index -= 1) {
        const child = registry.screens[activeIds[index]];

        if (child) {
          return child;
        }
      }

      const children = this.childViewControllers;
      const count = arrayCount(children);

      return count > 0 ? arrayItem(children, count - 1) : null;
    }

    childViewControllerForStatusBarStyle() {
      'worklet';

      return this.findActiveChildVC();
    }

    preferredStatusBarUpdateAnimation() {
      'worklet';
      const child = this.findActiveChildVC();

      return statusBarAnimationForProps(screenPropsForController(child));
    }

    childViewControllerForStatusBarHidden() {
      'worklet';

      return this.findActiveChildVC();
    }

    supportedInterfaceOrientations() {
      'worklet';
      const child = this.findActiveChildVC();

      return interfaceOrientationMaskForProps(screenPropsForController(child));
    }

    childViewControllerForHomeIndicatorAutoHidden() {
      'worklet';

      return this.findActiveChildVC();
    }
  }

  NativeClassFunction(RNSScreenContainerNativeScriptController);
  globalObject[SCREEN_CONTAINER_CONTROLLER_CLASS_KEY] =
    RNSScreenContainerNativeScriptController;
  return RNSScreenContainerNativeScriptController;
}

function containerScreenIsAttached(
  parentController: any,
  screenController: any,
) {
  'worklet';
  const childControllers = parentController?.childViewControllers;
  const count = arrayCount(childControllers);

  for (let index = 0; index < count; index += 1) {
    if (
      controllersEqual(arrayItem(childControllers, index), screenController)
    ) {
      return true;
    }
  }

  return false;
}

function layoutContainerScreen(parentController: any, screenController: any) {
  'worklet';
  const parentView = parentController?.view;
  const screenView = screenController?.view;

  if (!parentView || !screenView) {
    return;
  }

  screenView.frame = parentView.bounds;
  screenView.autoresizingMask = flexibleSizeMask();
  layoutHostedReactSubviews(screenController);
}

function attachContainerScreen(
  parentController: any,
  screenController: any,
  index: number,
) {
  'worklet';

  if (!parentController || !screenController) {
    return;
  }

  if (!containerScreenIsAttached(parentController, screenController)) {
    parentController.addChildViewController?.(screenController);
  }

  layoutContainerScreen(parentController, screenController);
  const parentView = parentController.view;
  const screenView = screenController.view;

  if (parentView && screenView?.superview !== parentView) {
    if (typeof parentView.insertSubviewAtIndex === 'function') {
      parentView.insertSubviewAtIndex(screenView, index);
    } else {
      parentView.addSubview?.(screenView);
    }
  }

  screenController.didMoveToParentViewController?.(parentController);
}

function detachContainerScreen(screenController: any) {
  'worklet';

  if (!screenController) {
    return;
  }

  screenController.willMoveToParentViewController?.(null);
  screenController.view?.removeFromSuperview?.();
  screenController.removeFromParentViewController?.();
}

function reconcilePlainScreenContainer(
  containerId: string,
  registry: NativeScriptStackRegistry,
) {
  'worklet';
  const parentController = registry.containers[containerId];
  const activeIds = registry.containerActiveScreenIds[containerId] ?? [];

  if (!parentController) {
    return;
  }

  const activeSet: Record<string, boolean> = {};

  for (let index = 0; index < activeIds.length; index += 1) {
    const screenId = activeIds[index];
    const screenController = registry.screens[screenId];
    activeSet[screenId] = true;

    if (!screenController) {
      continue;
    }

    attachContainerScreen(parentController, screenController, index);

    if (registry.screenProps[screenId]?.activityState === 2) {
      notifyFinishTransitioningForScreen(registry, screenId);
    }
  }

  for (const screenId in registry.screens) {
    if (
      registry.screenParents[screenId] !== containerId ||
      activeSet[screenId]
    ) {
      continue;
    }

    detachContainerScreen(registry.screens[screenId]);
  }

  parentController.setNeedsStatusBarAppearanceUpdate?.();
  updateWindowTraits(parentController);
}

function reconcileNavigationScreenContainer(
  containerId: string,
  registry: NativeScriptStackRegistry,
) {
  'worklet';
  const navigationController = registry.containers[containerId];
  const activeIds = registry.containerActiveScreenIds[containerId] ?? [];

  if (!navigationController) {
    return;
  }

  const topId =
    activeIds.find(
      screenId => registry.screenProps[screenId]?.activityState === 2,
    ) ?? activeIds[activeIds.length - 1];
  const topController = topId ? registry.screens[topId] : null;
  const nextControllers = topController ? [topController] : [];
  const nextKey = topId ?? '';

  if (registry.containerNativeKeys[containerId] !== nextKey) {
    setNavigationControllerViewControllers(
      navigationController,
      nextControllers.length > 0
        ? nextControllers
        : [createPlaceholderViewController()].filter(Boolean),
      false,
    );
    registry.containerNativeKeys[containerId] = nextKey;
  }

  if (topId) {
    layoutContainerScreen(navigationController, topController);
    notifyFinishTransitioningForScreen(registry, topId);
  }

  navigationController.setNeedsStatusBarAppearanceUpdate?.();
  updateWindowTraits(navigationController);
}

function reconcileScreenContainer(
  containerId: string,
  registry: NativeScriptStackRegistry,
) {
  'worklet';

  if (registry.containerHasTwoStates[containerId] === true) {
    reconcileNavigationScreenContainer(containerId, registry);
  } else {
    reconcilePlainScreenContainer(containerId, registry);
  }
}

function prepareScreenContainerForRecycle(
  containerId: string,
  controller: any,
  registry: NativeScriptStackRegistry,
) {
  'worklet';
  const activeIds = registry.containerActiveScreenIds[containerId] ?? [];

  for (const activeId of activeIds) {
    detachContainerScreen(registry.screens[activeId]);
  }

  if (
    registry.containerHasTwoStates[containerId] === true &&
    controller?.viewControllers
  ) {
    setNavigationControllerViewControllers(
      controller,
      [createPlaceholderViewController()].filter(Boolean),
      false,
    );
  }

  controller?.view?.removeFromSuperview?.();
  controller?.willMoveToParentViewController?.(null);
  controller?.removeFromParentViewController?.();
}

function topActiveScreenId(
  stackId: string,
  registry: NativeScriptStackRegistry,
) {
  'worklet';
  const ids = registry.stackActiveScreenIds[stackId] ?? [];

  return ids[ids.length - 1];
}

function topActiveScreenProps(
  stackId: string,
  registry: NativeScriptStackRegistry,
) {
  'worklet';

  return registry.screenProps[topActiveScreenId(stackId, registry)];
}

type NativeScriptStackBackGestureKind =
  | 'custom-edge'
  | 'custom-pan'
  | 'native-content-pop'
  | 'native-pop';

function isFullScreenSwipeEffectivelyEnabled(
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';

  return props?.fullScreenSwipeEnabled !== false;
}

function topScreenUsesCustomSwipeAnimation(
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';

  return Boolean(
    props?.customAnimationOnSwipe === true &&
      isCustomStackAnimation(stackAnimationForProps(props)),
  );
}

function shouldReceiveStackBackGesture(
  props: Readonly<NativeScriptScreenStackItemProps> | undefined,
  viewControllerCount: number,
  gestureKind: NativeScriptStackBackGestureKind,
) {
  'worklet';

  if (
    !props ||
    props.gestureEnabled === false ||
    viewControllerCount < 2 ||
    isModalPresentation(props.stackPresentation)
  ) {
    return false;
  }

  const usesCustomSwipeAnimation = topScreenUsesCustomSwipeAnimation(props);

  if (gestureKind === 'custom-pan') {
    return (
      usesCustomSwipeAnimation && isFullScreenSwipeEffectivelyEnabled(props)
    );
  }

  if (gestureKind === 'native-content-pop') {
    return (
      !usesCustomSwipeAnimation && isFullScreenSwipeEffectivelyEnabled(props)
    );
  }

  return true;
}

export const __shouldReceiveNativeScriptStackBackGestureForTests =
  shouldReceiveStackBackGesture;

function shouldUseCustomSwipeGestureForTopScreen(
  stackId: string,
  registry: NativeScriptStackRegistry,
) {
  'worklet';
  const props = topActiveScreenProps(stackId, registry);

  return Boolean(
    props?.gestureEnabled !== false && topScreenUsesCustomSwipeAnimation(props),
  );
}

function gestureResponseDistanceAllows(
  gesture: any,
  view: any,
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';
  const distance = props?.gestureResponseDistance;

  if (!distance || typeof gesture?.locationInView !== 'function') {
    return true;
  }

  const location = gesture.locationInView(view);
  let x = location?.x ?? 0;
  const y = location?.y ?? 0;
  const width = view?.frame?.size?.width ?? view?.bounds?.size?.width ?? 0;

  if (viewIsRTL(view)) {
    x = width - x;
  }

  const start = distance.start ?? -1;
  const end = distance.end ?? -1;
  const top = distance.top ?? -1;
  const bottom = distance.bottom ?? -1;

  return !(
    (start !== -1 && x < start) ||
    (end !== -1 && x > end) ||
    (top !== -1 && y < top) ||
    (bottom !== -1 && y > bottom)
  );
}

export const __nativeScriptStackGestureResponseDistanceAllowsForTests =
  gestureResponseDistanceAllows;

function cancelTouchesInParent(view: any) {
  'worklet';

  // Upstream RNSScreenStackView calls UIView+RNSUtility here. NativeScript can
  // invoke the same Objective-C category selector dynamically, so this stays a
  // generic UIKit interop call instead of a package-specific TurboModule API.
  const touchHandler =
    typeof view?.rnscreens_findTouchHandlerInAncestorChain === 'function'
      ? view.rnscreens_findTouchHandlerInAncestorChain()
      : null;

  if (typeof touchHandler?.rnscreens_cancelTouches !== 'function') {
    return false;
  }

  touchHandler.rnscreens_cancelTouches();
  return true;
}

export const __nativeScriptStackCancelTouchesInParentForTests =
  cancelTouchesInParent;

function isScrollViewPanGestureRecognizer(gesture: any) {
  'worklet';
  const view = gesture?.view;

  return Boolean(
    isNativeScrollView(view) &&
      view?.panGestureRecognizer &&
      nativeObjectsEqual(view.panGestureRecognizer, gesture),
  );
}

function scrollViewHasHorizontalPart(scrollView: any) {
  'worklet';
  const contentWidth = scrollView?.contentSize?.width ?? 0;
  const frameWidth =
    scrollView?.frame?.size?.width ?? scrollView?.bounds?.size?.width ?? 0;

  return contentWidth > frameWidth;
}

function isScreenEdgePanGestureRecognizer(
  gesture: any,
  gestureKind: NativeScriptStackBackGestureKind,
) {
  'worklet';
  const UIScreenEdgePanGestureRecognizer = nativeValue(
    'UIScreenEdgePanGestureRecognizer',
  );

  if (
    UIScreenEdgePanGestureRecognizer &&
    typeof gesture?.isKindOfClass === 'function'
  ) {
    return gesture.isKindOfClass(UIScreenEdgePanGestureRecognizer);
  }

  return gestureKind === 'custom-edge' || gestureKind === 'native-pop';
}

function gestureRecognizerState(name: string, fallback: number) {
  'worklet';
  const state = nativeValue('UIGestureRecognizerState');

  return state?.[name] ?? state?.[name.toLowerCase()] ?? fallback;
}

function shouldRecognizeStackBackGestureSimultaneously(
  gestureKind: NativeScriptStackBackGestureKind,
  gesture: any,
  otherGesture: any,
  viewControllerCount: number,
) {
  'worklet';

  if (
    gestureKind !== 'custom-pan' ||
    !isScrollViewPanGestureRecognizer(otherGesture)
  ) {
    return false;
  }

  const translation =
    typeof gesture?.translationInView === 'function'
      ? gesture.translationInView(gesture?.view)
      : { x: 0 };
  const isBackGesture = (translation?.x ?? 0) > 0 && viewControllerCount > 1;
  const beganState = gestureRecognizerState('Began', 1);

  if (
    otherGesture?.state === beganState ||
    gesture?.state === beganState ||
    isBackGesture
  ) {
    return false;
  }

  return true;
}

function shouldStackBackGestureRequireFailure(
  gestureKind: NativeScriptStackBackGestureKind,
  otherGesture: any,
) {
  'worklet';

  return Boolean(
    gestureKind === 'native-content-pop' &&
      isScrollViewPanGestureRecognizer(otherGesture) &&
      scrollViewHasHorizontalPart(otherGesture?.view),
  );
}

function shouldStackBackGestureBeRequiredToFail(
  gestureKind: NativeScriptStackBackGestureKind,
  gesture: any,
  otherGesture: any,
) {
  'worklet';

  if (
    gestureKind === 'native-content-pop' ||
    !isScrollViewPanGestureRecognizer(otherGesture)
  ) {
    return false;
  }

  return isScreenEdgePanGestureRecognizer(gesture, gestureKind);
}

function stackBackGestureUsesCorrectEdge(
  gesture: any,
  view: any,
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';
  const rectEdge = nativeValue('UIRectEdge');
  const left = rectEdge?.Left ?? rectEdge?.left ?? 2;
  const right = rectEdge?.Right ?? rectEdge?.right ?? 8;
  const edges = gesture?.edges;
  const isRTL = viewIsRTL(view);
  const isSlideFromLeft = stackAnimationForProps(props) === 'slide_from_left';

  return (
    (isRTL && edges === right) ||
    (!isRTL && isSlideFromLeft && edges === right) ||
    (isRTL && isSlideFromLeft && edges === left) ||
    (!isRTL && edges === left)
  );
}

export const __nativeScriptStackGestureDelegateDecisionForTests = {
  shouldBeRequiredToFail: shouldStackBackGestureBeRequiredToFail,
  shouldRecognizeSimultaneously: shouldRecognizeStackBackGestureSimultaneously,
  shouldRequireFailure: shouldStackBackGestureRequireFailure,
  usesCorrectEdge: stackBackGestureUsesCorrectEdge,
};

function installNativeBackGestureDelegateForRecognizer(
  navigationController: any,
  gesture: any,
  ctx: any,
  gestureKind: NativeScriptStackBackGestureKind,
) {
  'worklet';

  if (!gesture || !ctx) {
    return;
  }

  gesture.cancelsTouchesInView = false;
  gesture.delaysTouchesBegan = false;
  gesture.delaysTouchesEnded = false;

  const delegateProtocol =
    nativeValue('UIGestureRecognizerDelegate') ?? 'UIGestureRecognizerDelegate';

  const delegate = ctx.delegate(gesture, delegateProtocol, {
    gestureRecognizerShouldReceivePress() {
      'worklet';
      const registry = getRegistry(globalThis as Record<string, any>);

      return shouldReceiveStackBackGesture(
        topActiveScreenProps(ctx.props.stackId, registry),
        arrayCount(navigationController.viewControllers),
        gestureKind,
      );
    },
    gestureRecognizerShouldReceiveTouch() {
      'worklet';
      const registry = getRegistry(globalThis as Record<string, any>);

      return shouldReceiveStackBackGesture(
        topActiveScreenProps(ctx.props.stackId, registry),
        arrayCount(navigationController.viewControllers),
        gestureKind,
      );
    },
    gestureRecognizerShouldBegin(candidate: any) {
      'worklet';
      const registry = getRegistry(globalThis as Record<string, any>);
      const props = topActiveScreenProps(ctx.props.stackId, registry);
      const viewControllerCount = arrayCount(
        navigationController.viewControllers,
      );

      if (
        !shouldReceiveStackBackGesture(props, viewControllerCount, gestureKind)
      ) {
        return false;
      }

      if (
        shouldUseCustomSwipeGestureForTopScreen(ctx.props.stackId, registry)
      ) {
        return false;
      }

      if (
        gestureKind === 'native-content-pop' &&
        !gestureResponseDistanceAllows(
          candidate,
          navigationController.view,
          props,
        )
      ) {
        return false;
      }

      cancelTouchesInParent(navigationController.view);
      return true;
    },
    gestureRecognizerShouldRecognizeSimultaneouslyWithGestureRecognizer(
      candidate: any,
      otherGesture: any,
    ) {
      'worklet';

      return shouldRecognizeStackBackGestureSimultaneously(
        gestureKind,
        candidate ?? gesture,
        otherGesture,
        arrayCount(navigationController.viewControllers),
      );
    },
    gestureRecognizerShouldRequireFailureOfGestureRecognizer(
      _candidate: any,
      otherGesture: any,
    ) {
      'worklet';

      return shouldStackBackGestureRequireFailure(gestureKind, otherGesture);
    },
    gestureRecognizerShouldBeRequiredToFailByGestureRecognizer(
      candidate: any,
      otherGesture: any,
    ) {
      'worklet';

      return shouldStackBackGestureBeRequiredToFail(
        gestureKind,
        candidate ?? gesture,
        otherGesture,
      );
    },
  });
  gesture.delegate = delegate;
}

function installNativeBackGestureDelegate(navigationController: any, ctx: any) {
  'worklet';
  const popGesture = navigationController?.interactivePopGestureRecognizer;
  const contentGesture =
    navigationController?.interactiveContentPopGestureRecognizer;

  installNativeBackGestureDelegateForRecognizer(
    navigationController,
    popGesture,
    ctx,
    'native-pop',
  );

  // Upstream delegates interactiveContentPopGestureRecognizer on iOS 26.
  // NativeScript probes the property dynamically because SDK metadata can be
  // generated from older iOS runtimes, but when UIKit exposes it we must wire
  // the same delegate path as the ObjC implementation.
  if (contentGesture && !nativeObjectsEqual(contentGesture, popGesture)) {
    installNativeBackGestureDelegateForRecognizer(
      navigationController,
      contentGesture,
      ctx,
      'native-content-pop',
    );
  }

  updateNativeBackGesture(navigationController);
}

function releaseStackInteractionController(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
) {
  'worklet';
  const interactionController = registry.stackInteractionControllers[stackId];

  if (interactionController) {
    ctx?.release?.(interactionController);
  }

  registry.stackInteractionControllers[stackId] = undefined;
  registry.stackCustomAnimationOnSwipe[stackId] = undefined;
  registry.stackFullWidthSwipingWithPanGesture[stackId] = undefined;
}

function scheduleNativeDismissCancel(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  fromController: any,
  toController: any,
) {
  'worklet';

  const cancel = () => {
    'worklet';

    const pending = registry.stackPendingDismissCancels[stackId];

    if (
      !pending ||
      !controllersEqual(pending.fromController, fromController) ||
      !controllersEqual(pending.toController, toController)
    ) {
      return;
    }

    const interactionController = registry.stackInteractionControllers[stackId];
    const dismissCount = dismissCountFromControllerToController(
      stackId,
      registry,
      fromController,
      toController,
    );

    interactionController?.cancelInteractiveTransition?.();
    releaseStackInteractionController(stackId, registry, ctx);
    registry.stackPendingDismissCancels[stackId] = undefined;

    reconcileStack(stackId, registry, ctx, true);
    emitNativeDismissCancelledForController(fromController, dismissCount);
  };

  if (typeof setTimeout === 'function') {
    setTimeout(cancel, 10);
    return;
  }

  cancel();
}

function stackSwipeMetric(
  gesture: any,
  view: any,
  props?: Readonly<NativeScriptScreenStackItemProps>,
) {
  'worklet';
  const translation =
    typeof gesture?.translationInView === 'function'
      ? gesture.translationInView(view)
      : { x: 0, y: 0 };
  const velocity =
    typeof gesture?.velocityInView === 'function'
      ? gesture.velocityInView(view)
      : { x: 0, y: 0 };
  const vertical = props?.swipeDirection === 'vertical';
  const distance = vertical
    ? view?.bounds?.size?.height ?? 1
    : view?.bounds?.size?.width ?? 1;
  let delta = vertical ? translation?.y ?? 0 : translation?.x ?? 0;
  let speed = vertical ? velocity?.y ?? 0 : velocity?.x ?? 0;

  if (!vertical && viewIsRTL(view)) {
    delta = -delta;
    speed = -speed;
  }

  const inverted = stackAnimationForProps(props) === 'slide_from_left';
  const adjustedDelta = inverted ? -delta : delta;
  const adjustedVelocity = inverted ? -speed : speed;
  const progress = distance > 0 ? adjustedDelta / distance : 0;
  const gestureDistance = adjustedDelta + adjustedVelocity * 0.3;

  return {
    gestureDistance,
    progress: Math.max(0, Math.min(1, progress)),
    shouldFinish: gestureDistance > distance / 2,
  };
}

export const __nativeScriptStackSwipeMetricForTests = stackSwipeMetric;

function addStackSwipeGesture(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  navigationController: any,
  GestureClass: any,
  configureGesture: ((gesture: any) => void) | undefined,
  fullWidth: boolean,
) {
  'worklet';
  const view = navigationController?.view;

  if (!GestureClass || !view || typeof ctx?.gestureAction !== 'function') {
    return;
  }

  const allocated = GestureClass.alloc();
  const gesture =
    allocated && typeof allocated.init === 'function'
      ? allocated.init()
      : allocated;

  if (!gesture) {
    return;
  }

  configureGesture?.(gesture);
  gesture.cancelsTouchesInView = false;
  gesture.delaysTouchesBegan = false;
  gesture.delaysTouchesEnded = false;

  const delegateProtocol =
    nativeValue('UIGestureRecognizerDelegate') ?? 'UIGestureRecognizerDelegate';
  const gestureKind = fullWidth ? 'custom-pan' : 'custom-edge';
  const delegate = ctx.delegate(gesture, delegateProtocol, {
    gestureRecognizerShouldReceivePress() {
      'worklet';

      return shouldReceiveStackBackGesture(
        topActiveScreenProps(stackId, registry),
        arrayCount(navigationController.viewControllers),
        gestureKind,
      );
    },
    gestureRecognizerShouldReceiveTouch() {
      'worklet';

      return shouldReceiveStackBackGesture(
        topActiveScreenProps(stackId, registry),
        arrayCount(navigationController.viewControllers),
        gestureKind,
      );
    },
    gestureRecognizerShouldBegin(candidate: any) {
      'worklet';
      const props = topActiveScreenProps(stackId, registry);
      const viewControllerCount = arrayCount(
        navigationController.viewControllers,
      );

      if (
        !shouldReceiveStackBackGesture(props, viewControllerCount, gestureKind)
      ) {
        return false;
      }

      if (!shouldUseCustomSwipeGestureForTopScreen(stackId, registry)) {
        return false;
      }

      if (fullWidth && !isFullScreenSwipeEffectivelyEnabled(props)) {
        return false;
      }

      if (viewControllerCount < 2) {
        return false;
      }

      if (fullWidth && !gestureResponseDistanceAllows(candidate, view, props)) {
        return false;
      }

      if (
        !fullWidth &&
        !stackBackGestureUsesCorrectEdge(candidate, view, props)
      ) {
        return false;
      }

      cancelTouchesInParent(view);
      return true;
    },
    gestureRecognizerShouldRecognizeSimultaneouslyWithGestureRecognizer(
      candidate: any,
      otherGesture: any,
    ) {
      'worklet';

      return shouldRecognizeStackBackGestureSimultaneously(
        gestureKind,
        candidate ?? gesture,
        otherGesture,
        arrayCount(navigationController.viewControllers),
      );
    },
    gestureRecognizerShouldRequireFailureOfGestureRecognizer(
      _candidate: any,
      otherGesture: any,
    ) {
      'worklet';

      return shouldStackBackGestureRequireFailure(gestureKind, otherGesture);
    },
    gestureRecognizerShouldBeRequiredToFailByGestureRecognizer(
      candidate: any,
      otherGesture: any,
    ) {
      'worklet';

      return shouldStackBackGestureBeRequiredToFail(
        gestureKind,
        candidate ?? gesture,
        otherGesture,
      );
    },
  });
  gesture.delegate = delegate;

  const state = nativeValue('UIGestureRecognizerState');
  const beganState = state?.Began ?? state?.began ?? 1;
  const changedState = state?.Changed ?? state?.changed ?? 2;
  const endedState = state?.Ended ?? state?.ended ?? 3;
  const cancelledState = state?.Cancelled ?? state?.cancelled ?? 4;
  const failedState = state?.Failed ?? state?.failed ?? 5;

  ctx.gestureAction(gesture, (candidate: any) => {
    'worklet';
    const props = topActiveScreenProps(stackId, registry);

    if (!props || !shouldUseCustomSwipeGestureForTopScreen(stackId, registry)) {
      return;
    }

    const metric = stackSwipeMetric(candidate, view, props);
    const state = candidate?.state;
    const interactionController = registry.stackInteractionControllers[stackId];

    if (state === beganState) {
      const nextInteractionController =
        createPercentDrivenInteractiveTransition(ctx);

      if (!nextInteractionController) {
        return;
      }

      registry.stackInteractionControllers[stackId] = nextInteractionController;
      registry.stackCustomAnimationOnSwipe[stackId] = true;
      registry.stackFullWidthSwipingWithPanGesture[stackId] = fullWidth;
      navigationController.popViewControllerAnimated?.(true);
      return;
    }

    if (!interactionController) {
      return;
    }

    if (state === changedState) {
      interactionController.updateInteractiveTransition?.(metric.progress);
      return;
    }

    if (state === endedState) {
      if (metric.shouldFinish) {
        interactionController.finishInteractiveTransition?.();
      } else {
        interactionController.cancelInteractiveTransition?.();
      }
      releaseStackInteractionController(stackId, registry, ctx);
      return;
    }

    if (state === cancelledState || state === failedState) {
      interactionController.cancelInteractiveTransition?.();
      releaseStackInteractionController(stackId, registry, ctx);
    }
  });

  view.addGestureRecognizer?.(gesture);
  ctx.dispose(() => {
    'worklet';
    view.removeGestureRecognizer?.(gesture);
  });
}

function installStackSwipeGestures(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  navigationController: any,
) {
  'worklet';
  const UIScreenEdgePanGestureRecognizer = nativeValue(
    'UIScreenEdgePanGestureRecognizer',
  );
  const UIPanGestureRecognizer = nativeValue('UIPanGestureRecognizer');
  const rectEdge = nativeValue('UIRectEdge');

  if (
    registry.stackSwipeGesturesInstalled[stackId] === true ||
    !navigationController?.view
  ) {
    return;
  }

  registry.stackSwipeGesturesInstalled[stackId] = true;

  addStackSwipeGesture(
    stackId,
    registry,
    ctx,
    navigationController,
    UIScreenEdgePanGestureRecognizer,
    gesture => {
      'worklet';
      gesture.edges = rectEdge?.Left ?? rectEdge?.left ?? 2;
    },
    false,
  );
  addStackSwipeGesture(
    stackId,
    registry,
    ctx,
    navigationController,
    UIScreenEdgePanGestureRecognizer,
    gesture => {
      'worklet';
      gesture.edges = rectEdge?.Right ?? rectEdge?.right ?? 8;
    },
    false,
  );
  addStackSwipeGesture(
    stackId,
    registry,
    ctx,
    navigationController,
    UIPanGestureRecognizer,
    undefined,
    true,
  );
}

function applyNavigationAppearance(
  navigationController: any,
  headerConfig?: ScreenStackHeaderConfigProps,
  ctx?: any,
  registry?: NativeScriptStackRegistry,
) {
  'worklet';

  if (!navigationController) {
    return;
  }

  configureExtendedLayout(navigationController);
  updateNativeBackGesture(navigationController);
  layoutNavigationStackViews(navigationController);
  configureNavigationSemanticContentAttribute(
    navigationController,
    headerConfig,
  );

  const viewControllers = navigationController.viewControllers;
  const count = arrayCount(viewControllers);
  const topController =
    count > 0 ? arrayItem(viewControllers, count - 1) : null;
  const topNavigationItem = topController?.navigationItem;
  const sourceRegistry =
    registry ?? (globalThis as Record<string, any>)[REGISTRY_KEY];

  if (count >= 2) {
    const previousController = arrayItem(viewControllers, count - 2);
    const navigationItem = previousController?.navigationItem;
    const previousScreenId =
      sourceRegistry && previousController
        ? screenIdForController(previousController, sourceRegistry)
        : undefined;

    configureSourceBackButton(
      navigationItem,
      headerConfig,
      previousScreenId
        ? sourceRegistry?.screenHeaderConfigs[previousScreenId]
        : undefined,
    );
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
  navigationBar.overrideUserInterfaceStyle =
    userInterfaceStyleForHeaderConfig(headerConfig);

  const tintColor = nativeColor(headerConfig?.color, 'labelColor');

  if (tintColor) {
    navigationBar.tintColor = tintColor;
  }

  const clearColor = nativeColor('transparent', 'clearColor');
  const backgroundColor = nativeColor(
    headerConfig?.backgroundColor,
    'systemBackgroundColor',
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
    } else if (typeof appearance.configureWithOpaqueBackground === 'function') {
      appearance.configureWithOpaqueBackground();
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

    const backgroundEffect = blurEffectForHeaderConfig(headerConfig);

    if (backgroundEffect || headerConfig?.blurEffect === 'none') {
      appearance.backgroundEffect = backgroundEffect;
    }

    const titleAttributes = textAttributes({
      boldDefault: true,
      color: headerConfig?.titleColor,
      family: headerConfig?.titleFontFamily,
      size: headerConfig?.titleFontSize,
      weight: headerConfig?.titleFontWeight,
    });

    if (titleAttributes) {
      appearance.titleTextAttributes = titleAttributes;
    }

    const largeTitleAttributes = textAttributes({
      boldDefault: true,
      color: headerConfig?.largeTitleColor ?? headerConfig?.titleColor,
      family: headerConfig?.largeTitleFontFamily,
      size: headerConfig?.largeTitleFontSize,
      weight: headerConfig?.largeTitleFontWeight,
    });

    if (largeTitleAttributes) {
      appearance.largeTitleTextAttributes = largeTitleAttributes;
    }

    const topScreenId = controllerScreenId(topController);
    const backIndicatorImage = backButtonImageForScreen(
      topScreenId,
      ctx,
      loadedImage => {
        'worklet';
        setBackIndicatorImageOnAppearance(
          navigationBar.standardAppearance,
          loadedImage,
        );
        setBackIndicatorImageOnAppearance(
          navigationBar.compactAppearance,
          loadedImage,
        );
        setBackIndicatorImageOnAppearance(
          navigationBar.scrollEdgeAppearance,
          loadedImage,
        );
      },
    );
    setBackIndicatorImageOnAppearance(appearance, backIndicatorImage);

    let scrollEdgeAppearance = appearance;
    const scrollEdgeAllocated = UINavigationBarAppearance.alloc();

    if (
      scrollEdgeAllocated &&
      typeof scrollEdgeAllocated.initWithBarAppearance === 'function'
    ) {
      scrollEdgeAppearance =
        scrollEdgeAllocated.initWithBarAppearance(appearance);
    }

    if (headerConfig?.largeTitleBackgroundColor === 'transparent') {
      if (
        typeof scrollEdgeAppearance.configureWithTransparentBackground ===
        'function'
      ) {
        scrollEdgeAppearance.configureWithTransparentBackground();
      }
      scrollEdgeAppearance.backgroundColor = null;
    } else if (headerConfig?.largeTitleBackgroundColor != null) {
      const largeTitleBackgroundColor = nativeColor(
        headerConfig.largeTitleBackgroundColor,
        'systemBackgroundColor',
      );

      if (largeTitleBackgroundColor) {
        scrollEdgeAppearance.backgroundColor = largeTitleBackgroundColor;
      }
    }

    if (headerConfig?.largeTitleHideShadow === true) {
      scrollEdgeAppearance.shadowColor = clearColor ?? null;
    }

    setBackIndicatorImageOnAppearance(scrollEdgeAppearance, backIndicatorImage);

    navigationBar.standardAppearance = appearance;
    navigationBar.scrollEdgeAppearance = scrollEdgeAppearance;
    navigationBar.compactAppearance = appearance;
    if (topNavigationItem) {
      topNavigationItem.standardAppearance = appearance;
      topNavigationItem.compactAppearance = appearance;
      topNavigationItem.scrollEdgeAppearance = scrollEdgeAppearance;
      topNavigationItem.leftItemsSupplementBackButton =
        headerConfig?.backButtonInCustomView === true;
    }
  } else if (backgroundColor) {
    navigationBar.backgroundColor = backgroundColor;
  }
}

function configureNavigationAppearance(
  navigationController: any,
  headerConfig?: ScreenStackHeaderConfigProps,
  ctx?: any,
  registry?: NativeScriptStackRegistry,
) {
  'worklet';

  if (!navigationController) {
    return;
  }

  const wasHidden = nativeBool(navigationController, 'navigationBarHidden');
  const viewControllers = navigationController.viewControllers;
  const count = arrayCount(viewControllers);
  const topController =
    count > 0 ? arrayItem(viewControllers, count - 1) : null;

  applyNavigationAppearance(navigationController, headerConfig, ctx, registry);

  const coordinator = transitionCoordinatorForController(topController);
  const presentationStyle = transitionCoordinatorPresentationStyle(coordinator);

  if (
    !navigationController.navigationBar ||
    !coordinator ||
    typeof coordinator.animateAlongsideTransitionCompletion !== 'function' ||
    nativeBool(coordinator, 'isAnimated', true) !== true ||
    (presentationStyle != null &&
      presentationStyle !== modalPresentationStyleNone()) ||
    wasHidden
  ) {
    return;
  }

  const token =
    (navigationController.__nativeScriptHeaderAppearanceToken ?? 0) + 1;
  const sourceRegistry =
    registry ?? (globalThis as Record<string, any>)[REGISTRY_KEY];

  navigationController.__nativeScriptHeaderAppearanceToken = token;

  const complete = (transitionContext?: any) => {
    'worklet';

    if (navigationController.__nativeScriptHeaderAppearanceToken !== token) {
      return;
    }

    const currentViewControllers = navigationController.viewControllers;
    const currentCount = arrayCount(currentViewControllers);
    const currentTopController =
      currentCount > 0
        ? arrayItem(currentViewControllers, currentCount - 1)
        : null;
    const cancelled = nativeBool(transitionContext, 'isCancelled');
    const appearanceController = cancelled
      ? transitionContextViewController(
          transitionContext,
          'UITransitionContextFromViewControllerKey',
        ) ?? currentTopController
      : currentTopController;
    const appearanceScreenId =
      sourceRegistry && appearanceController
        ? screenIdForController(appearanceController, sourceRegistry)
        : undefined;
    const appearanceHeaderConfig = appearanceScreenId
      ? sourceRegistry?.screenHeaderConfigs[appearanceScreenId] ?? headerConfig
      : headerConfig;
    const appearanceContext = appearanceScreenId
      ? sourceRegistry?.screenContexts[appearanceScreenId] ?? ctx
      : ctx;

    // NATIVESCRIPT_PORT_DEVIATION: upstream mutates the shared
    // UINavigationBar inside the transition coordinator animation block, then
    // re-applies the fromVC config if the transition is cancelled. NativeScript
    // can use the same generic UIKit callback via interop.Block, but resolving
    // the controller/config at completion is more reliable than holding ObjC
    // header-config view identity across JS proxy boundaries.
    applyNavigationAppearance(
      navigationController,
      appearanceHeaderConfig,
      appearanceContext,
      sourceRegistry,
    );
  };

  const didSchedule = coordinator.animateAlongsideTransitionCompletion(
    null,
    interopBlock(TRANSITION_COORDINATOR_COMPLETION_BLOCK, complete),
  );

  if (
    didSchedule !== true &&
    navigationController.__nativeScriptHeaderAppearanceToken === token
  ) {
    navigationController.__nativeScriptHeaderAppearanceToken = undefined;
  }
}

export const __nativeScriptConfigureNavigationAppearanceForTests =
  configureNavigationAppearance;

function configureModalScreenController(
  controller: any,
  props: Readonly<NativeScriptScreenStackItemProps>,
  registry: NativeScriptStackRegistry,
  ctx?: any,
) {
  'worklet';

  if (!isModalPresentation(props.stackPresentation)) {
    return;
  }

  // Direct port of RNSScreenView's stackPresentation/stackAnimation/
  // gestureEnabled setters: the presented RNSScreen controller owns UIKit
  // presentation state, not the surrounding stack.
  controller.modalPresentationStyle = modalPresentationStyle(
    props.stackPresentation,
  );
  controller.modalTransitionStyle = modalTransitionStyleForProps(props);
  controller.modalInPresentation = props.gestureEnabled === false;

  const presentationController = controller.presentationController;

  if (presentationController) {
    presentationController.delegate = controller;
  }

  const sheetPresentationController = controller.sheetPresentationController;

  if (
    props.stackPresentation === 'modal' &&
    sheetPresentationController &&
    'prefersPageSizing' in sheetPresentationController
  ) {
    sheetPresentationController.prefersPageSizing = true;
  }

  updateFormSheetPresentationStyle(controller, props, registry, true);
  setupBackdropTapGestureRecognizer(controller, props, ctx);
}

function configureScreenController(
  controller: any,
  props: Readonly<NativeScriptScreenStackItemProps>,
  ctx?: any,
  isTopScreen = false,
  canGoBack = false,
) {
  'worklet';

  ensureScreenControllerView(controller);
  setScreenControllerIdentity(controller, props.screenId);
  controller.__nativeScriptScreenContext = ctx;
  configureExtendedLayout(controller);

  const headerConfig = props.headerConfig;
  const navigationItem = controller?.navigationItem;

  controller.title = headerConfig?.title ?? '';

  if (controller.view) {
    controller.view.autoresizingMask = flexibleSizeMask();
    controller.view.backgroundColor = nativeColor(
      headerConfig?.backgroundColor,
      'systemBackgroundColor',
    );
    layoutHostedReactSubviews(controller);
    updateContentScrollViewEdgeEffectsIfExists(controller, props);
  }

  if (navigationItem) {
    configureSourceBackButton(navigationItem, headerConfig, headerConfig);
    navigationItem.hidesBackButton = headerConfig?.hideBackButton === true;
    navigationItem.backButtonDisplayMode = backButtonDisplayMode(
      headerConfig?.backTitleVisible === false
        ? 'minimal'
        : headerConfig?.backButtonDisplayMode,
    );
    navigationItem.largeTitleDisplayMode = largeTitleDisplayMode(
      headerConfig?.largeTitle === true,
    );
    configureHeaderSubviewViews(navigationItem, props);
    // Upstream assigns the title after titleView because assigning it earlier
    // trips a UIKit titleView/title invalidation bug on iOS 16.
    navigationItem.title = headerConfig?.title ?? '';
    configureHeaderBarButtonItems(navigationItem, headerConfig, ctx);
  }

  const navigationController = controller.navigationController;

  if (navigationController) {
    configureNavigationAppearance(navigationController, headerConfig, ctx);
    layoutNavigationStackViews(navigationController);
  }

  configureHeaderBackButton(controller, props, isTopScreen, canGoBack);
  configureModalScreenController(
    controller,
    props,
    getRegistry(globalThis as Record<string, any>),
    ctx,
  );
  updateWindowTraits(controller);
  emitHeaderHeightChange(controller, props, ctx);
}

function configureStackControllers(
  ids: string[],
  registry: NativeScriptStackRegistry,
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
      index > 0,
    );
  }
}

function installHeaderSubviewUpdateHandler() {
  'worklet';
  const globalObject = globalThis as Record<string, any>;

  globalObject[HEADER_SUBVIEW_UPDATE_KEY] = (screenId: string) => {
    'worklet';
    const registry = getRegistry(globalThis as Record<string, any>);
    const controller = registry.screens[screenId];
    const props = registry.screenProps[screenId];
    const stackId = registry.screenParents[screenId];
    const ctx = stackId ? registry.stackContexts[stackId] : undefined;

    if (!controller || !props) {
      return;
    }

    const activeIds = stackId
      ? registry.stackActiveScreenIds[stackId] ?? []
      : [];
    const activeIndex = activeIds.indexOf(screenId);

    configureScreenController(
      controller,
      props,
      ctx,
      activeIndex === activeIds.length - 1,
      activeIndex > 0,
    );
  };
}

function emitTransition(
  ctx: any,
  phase: 'start' | 'end',
  closing: boolean,
  screenId: string | undefined,
  cancelled = false,
  nativeDriven = false,
  requestedFromJS = true,
) {
  'worklet';

  if (!ctx || !screenId) {
    return;
  }

  ctx.emit('onNativeStackTransition', {
    nativeEvent: {
      cancelled,
      closing,
      nativeDriven,
      phase,
      requestedFromJS,
      screenId,
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
  requestedFromJS = true,
) {
  'worklet';
  const token = (registry.stackTransitionTokens[stackId] ?? 0) + 1;

  registry.stackTransitionTokens[stackId] = token;
  registry.stackTransitioning[stackId] = true;
  registry.stackTransitionClosing[stackId] = closing;
  registry.stackTransitionNativeDriven[stackId] = nativeDriven;
  registry.stackTransitionRequestedFromJS[stackId] = requestedFromJS;
  registry.stackTransitionScreenIds[stackId] = screenId;
  emitTransition(
    ctx,
    'start',
    closing,
    screenId,
    false,
    nativeDriven,
    requestedFromJS,
  );

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
        false,
      );
    }
  }

  parent.pushViewControllerAnimated(controller, true);

  return true;
}

function animateStackPop(
  parent: any,
  controllers: any[],
  previousTopController: any,
  nextCount: number,
  previousCount: number,
) {
  'worklet';

  if (
    !parent ||
    !previousTopController ||
    nextCount <= 0 ||
    nextCount >= previousCount ||
    typeof parent.setViewControllersAnimated !== 'function' ||
    typeof parent.popViewControllerAnimated !== 'function'
  ) {
    return false;
  }

  parent.setViewControllersAnimated(
    createArray([...controllers, previousTopController]),
    false,
  );
  parent.popViewControllerAnimated(true);

  return true;
}

function setNavigationControllerViewControllers(
  navigationController: any,
  controllers: any[],
  animated: boolean,
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
            controller,
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
          false,
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
      animated,
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

function scheduledReconcileStack(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  animated: boolean,
) {
  'worklet';
  const reconcile = (globalThis as Record<string, any>)[RECONCILE_STACK_KEY];

  if (typeof reconcile === 'function') {
    reconcile(stackId, registry, ctx, animated);
  }
}

function shouldQueueReconcileWhileTransitioning(
  stackId: string,
  registry: NativeScriptStackRegistry,
  availableIds: string[],
) {
  'worklet';

  if (
    registry.stackTransitionRequestedFromJS[stackId] === true ||
    registry.stackTransitionNativeDriven[stackId] !== true
  ) {
    return true;
  }

  const transitionScreenId = registry.stackTransitionScreenIds[stackId];

  if (!transitionScreenId) {
    return true;
  }

  // Native-driven pops briefly race React Navigation's state update. Ignore
  // the stale state while it still contains the popped screen, but queue any
  // later JS navigation once React has removed that transition screen.
  return !screenIdInList(transitionScreenId, availableIds);
}

function schedulePostTransitionSettle(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
) {
  'worklet';

  if (typeof setTimeout !== 'function') {
    return;
  }

  // NATIVESCRIPT_PORT_DEVIATION: upstream queues updateContainer after RN
  // child layout with dispatch_async from didUpdateReactSubviews /
  // mountingTransactionDidMount. In this TS port, UIKit has already completed
  // the controller transition but hosted NativeScript/RN children can still be
  // publishing final frames through onHostReady. Hold reconciles for one short
  // host-layout settle window; this path must never rewrite viewControllers.
  const token = registry.stackTransitionTokens[stackId];
  registry.stackTransitionSettling[stackId] = true;

  const settle = () => {
    'worklet';

    if (registry.stackTransitionTokens[stackId] !== token) {
      return;
    }

    registry.stackTransitionSettling[stackId] = undefined;
    scheduledReconcileStack(stackId, registry, ctx, true);
  };

  setTimeout(settle, 80);
}

function finishTransition(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  closing: boolean,
  screenId: string | undefined,
  cancelled = false,
) {
  'worklet';
  const nativeDriven = registry.stackTransitionNativeDriven[stackId] === true;
  const requestedFromJS =
    registry.stackTransitionRequestedFromJS[stackId] !== false;
  const shouldRunPendingReconcile =
    !cancelled &&
    registry.stackPendingReconcileKeys[stackId] != null &&
    (registry.stackTransitionRequestedFromJS[stackId] === true ||
      registry.stackTransitionNativeDriven[stackId] !== true);

  emitTransition(
    ctx,
    'end',
    closing,
    screenId,
    cancelled,
    nativeDriven,
    requestedFromJS,
  );
  notifyFinishTransitioningForScreen(registry, screenId);
  registry.stackTransitioning[stackId] = false;
  registry.stackTransitionClosing[stackId] = undefined;
  registry.stackTransitionNativeDriven[stackId] = undefined;
  registry.stackTransitionRequestedFromJS[stackId] = undefined;
  registry.stackTransitionScreenIds[stackId] = undefined;
  registry.stackPendingReconcileKeys[stackId] = undefined;
  registry.stackUpdatesScheduled[stackId] = undefined;
  registry.stackTransitionTokens[stackId] =
    (registry.stackTransitionTokens[stackId] ?? 0) + 1;
  schedulePostTransitionSettle(stackId, registry, ctx);

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
) {
  'worklet';

  const complete = () => {
    'worklet';

    if (
      registry.stackTransitionTokens[stackId] !== token ||
      registry.stackTransitioning[stackId] !== true
    ) {
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
        registry,
      );

      if (!idsEqual(currentIds, target.availableIds)) {
        setNavigationControllerViewControllers(
          navigationController,
          target.controllers,
          false,
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
        ],
        ctx,
        registry,
      );
      updateNativeBackGesture(navigationController);
    }

    finishTransition(stackId, registry, ctx, closing, screenId);
  };

  if (runAfterTransitionCoordinator(navigationController, complete)) {
    return;
  }

  if (typeof setTimeout !== 'function') {
    return;
  }

  // NATIVESCRIPT_PORT_DEVIATION: upstream finishes stack transitions from
  // UINavigationControllerDelegate didShow. NativeScript can miss that callback
  // for some proxy/placeholder controllers, so this timeout is only a watchdog
  // after the generic transition coordinator path is unavailable. The token and
  // stackTransitioning checks above prevent post-didShow controller rewrites.
  setTimeout(complete, 420);
}

function shouldApplyStackPropsRevision(
  stackId: string,
  registry: NativeScriptStackRegistry,
  revision: number | undefined,
) {
  'worklet';

  if (typeof revision !== 'number') {
    return true;
  }

  const previousRevision = registry.stackPropRevisions[stackId];

  if (typeof previousRevision === 'number' && revision < previousRevision) {
    return false;
  }

  registry.stackPropRevisions[stackId] = revision;
  return true;
}

function scheduleReconcileAfterNativeTransition(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  navigationController: any,
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
    throw new Error(
      'NativeScript interop.Block is required for UIKit callbacks',
    );
  }

  if (
    coordinator.animateAlongsideTransitionCompletion(
      null,
      InteropBlock(
        TRANSITION_COORDINATOR_COMPLETION_BLOCK,
        NativeScriptRuntime.runtimeInvoker(complete),
      ),
    )
  ) {
    return true;
  }

  registry.stackUpdatesScheduled[stackId] = undefined;
  return false;
}

function configurePresentedModalControllers(
  ids: string[],
  registry: NativeScriptStackRegistry,
) {
  'worklet';

  configureStackControllers(ids, registry);

  for (const id of ids) {
    const controller = registry.screens[id];
    const props = registry.screenProps[id];

    if (!controller || !props) {
      continue;
    }

    configureModalScreenController(controller, props, registry);
  }
}

function controllerAllowsModalDismiss(controller: any) {
  'worklet';

  if (!controller) {
    return true;
  }

  const isDismissible = controller.isDismissible;

  if (typeof isDismissible === 'function') {
    return controller.isDismissible() !== false;
  }

  return isDismissible !== false;
}

function controllerPrefersModalAnimation(
  controller: any,
  registry: NativeScriptStackRegistry,
) {
  'worklet';
  const props = screenPropsForController(controller) ?? undefined;
  const screenId = screenIdForController(controller, registry);

  return (
    stackAnimationForProps(props ?? registry.screenProps[screenId ?? '']) !==
    'none'
  );
}

function completeModalTransitionTransaction(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  closing: boolean,
  screenId: string | undefined,
) {
  'worklet';

  registry.stackUpdatingModals[stackId] = undefined;

  if (registry.stackTransitioning[stackId] === true) {
    finishTransition(stackId, registry, ctx, closing, screenId);
  } else {
    cleanupDetachedScreens(stackId, registry);
  }

  if (registry.stackScheduledModalUpdates[stackId] === true) {
    registry.stackScheduledModalUpdates[stackId] = undefined;
    scheduledReconcileStack(stackId, registry, ctx, true);
  }

  updateWindowTraits(registry.stacks[stackId]);
}

function completeNativePresentedModalDismissalForController(controller: any) {
  'worklet';
  const registry = getRegistry(globalThis as Record<string, any>);
  const screenId = screenIdForController(controller, registry);
  const stackId = screenId ? registry.screenParents[screenId] : undefined;

  if (!screenId || !stackId) {
    return;
  }

  const modalIds = presentedModalIdsForStack(stackId, registry);
  const dismissedIndex = modalIds.indexOf(screenId);

  if (dismissedIndex >= 0) {
    setPresentedModalIdsForStack(
      stackId,
      registry,
      modalIds.slice(0, dismissedIndex),
    );
  }

  registry.stackUpdatingModals[stackId] = undefined;
  updateWindowTraits(controller);

  const ctx = registry.stackContexts[stackId];

  emitTransition(ctx, 'start', true, screenId, false, true, false);
  emitTransition(ctx, 'end', true, screenId, false, true, false);
  cleanupDetachedScreens(stackId, registry);

  if (registry.stackScheduledModalUpdates[stackId] === true) {
    registry.stackScheduledModalUpdates[stackId] = undefined;
    scheduledReconcileStack(stackId, registry, ctx, true);
  }
}

(globalThis as Record<string, any>)[
  COMPLETE_NATIVE_PRESENTED_MODAL_DISMISSAL_KEY
] = completeNativePresentedModalDismissalForController;

function setModalViewControllers(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  controllers: any[],
  controllerIds: string[],
  animated: boolean,
) {
  'worklet';
  const navigationController = registry.stacks[stackId];

  if (!navigationController) {
    return false;
  }

  if (registry.stackUpdatingModals[stackId] === true) {
    registry.stackScheduledModalUpdates[stackId] = true;
    return true;
  }

  const previousIds = presentedModalIdsForStack(stackId, registry);

  if (idsEqual(previousIds, controllerIds)) {
    return true;
  }

  const previous = controllersForIds(previousIds, registry).controllers;
  const previousLastController = previous[previous.length - 1];
  const navigationHostView = hostViewForController(navigationController);
  const previousLastHostView = hostViewForController(previousLastController);

  if (
    navigationHostView?.window == null &&
    previousLastHostView?.window == null
  ) {
    return false;
  }

  registry.stackUpdatingModals[stackId] = true;

  let changeRootController = navigationController;
  let changeRootIndex = 0;
  const commonCount = Math.min(previousIds.length, controllerIds.length);

  for (let index = 0; index < commonCount; index += 1) {
    if (
      previousIds[index] === controllerIds[index] &&
      controllersEqual(previous[index], controllers[index])
    ) {
      changeRootController = controllers[index];
      changeRootIndex = index + 1;
    } else {
      break;
    }
  }

  for (let index = changeRootIndex; index < controllerIds.length; index += 1) {
    if (previousIds.includes(controllerIds[index])) {
      throw new Error(
        'Modally presented controllers are being reshuffled, this is not allowed',
      );
    }
  }

  const closing = previousIds.length > changeRootIndex;
  const transitionScreenId = closing
    ? previousIds[previousIds.length - 1]
    : controllerIds[controllerIds.length - 1];

  markTransition(stackId, registry, ctx, closing, transitionScreenId);
  configurePresentedModalControllers(controllerIds, registry);

  const finish = () => {
    'worklet';

    setPresentedModalIdsForStack(
      stackId,
      registry,
      previousIds.slice(0, changeRootIndex),
    );

    const changeRootHostView = hostViewForController(changeRootController);
    const isAttached =
      changeRootHostView?.window != null ||
      changeRootController.parentViewController != null ||
      changeRootController.presentingViewController != null;

    if (!isAttached || changeRootIndex >= controllers.length) {
      completeModalTransitionTransaction(
        stackId,
        registry,
        ctx,
        closing,
        transitionScreenId,
      );
      return;
    }

    let previousController = changeRootController;

    for (let index = changeRootIndex; index < controllers.length; index += 1) {
      const nextController = controllers[index];
      const nextScreenId = controllerIds[index];
      const nextProps = registry.screenProps[nextScreenId];
      const lastModal = index === controllers.length - 1;

      if (!nextController || !nextProps) {
        throw new Error(
          'Cannot present a modal screen without registered props',
        );
      }

      configureModalScreenController(nextController, nextProps, registry);

      if (nativeBool(previousController, 'isBeingDismissed')) {
        return;
      }

      const shouldAnimate =
        animated && lastModal && stackAnimationForProps(nextProps) !== 'none';

      if (
        typeof previousController.presentViewControllerAnimatedCompletion !==
        'function'
      ) {
        throw new Error(
          'presenting modals requires presentViewControllerAnimatedCompletion',
        );
      }

      previousController.presentViewControllerAnimatedCompletion(
        nextController,
        shouldAnimate,
        () => {
          'worklet';
          setPresentedModalIdsForStack(
            stackId,
            registry,
            controllerIds.slice(0, index + 1),
          );
          layoutPresentedModalControllers(stackId, registry);

          if (lastModal) {
            completeModalTransitionTransaction(
              stackId,
              registry,
              ctx,
              false,
              nextScreenId,
            );
          }
        },
      );
      previousController = nextController;
    }
  };

  const firstModalToBeDismissed = changeRootController.presentedViewController;

  if (controllerAllowsModalDismiss(firstModalToBeDismissed)) {
    if (firstModalToBeDismissed) {
      const firstDismissedScreenId = screenIdForController(
        firstModalToBeDismissed,
        registry,
      );
      const firstModalToBeDismissedIsOwned = firstDismissedScreenId != null;
      const firstModalToBeDismissedIsOwnedByThisStack =
        firstDismissedScreenId != null &&
        previousIds.includes(firstDismissedScreenId);

      if (
        firstModalToBeDismissedIsOwnedByThisStack ||
        !firstModalToBeDismissedIsOwned
      ) {
        if (!nativeBool(firstModalToBeDismissed, 'isBeingDismissed')) {
          if (
            typeof changeRootController.dismissViewControllerAnimatedCompletion !==
            'function'
          ) {
            throw new Error(
              'presented modal dismissal requires dismissViewControllerAnimatedCompletion',
            );
          }

          changeRootController.dismissViewControllerAnimatedCompletion(
            animated &&
              (!firstModalToBeDismissedIsOwned ||
                controllerPrefersModalAnimation(
                  firstModalToBeDismissed,
                  registry,
                )),
            finish,
          );
        } else if (
          !runAfterTransitionCoordinator(firstModalToBeDismissed, finish)
        ) {
          finish();
        }

        return true;
      }
    }

    const reactRootController = rootViewController();
    const topMostController =
      topMostPresentedViewControllerFrom(reactRootController);

    if (reactRootController && topMostController !== reactRootController) {
      changeRootController = topMostController;

      const topMostScreenId = screenIdForController(
        topMostController,
        registry,
      );

      if (
        topMostScreenId != null &&
        previousIds.includes(topMostScreenId) &&
        !controllerIds.includes(topMostScreenId)
      ) {
        if (
          typeof changeRootController.dismissViewControllerAnimatedCompletion !==
          'function'
        ) {
          throw new Error(
            'presented modal dismissal requires dismissViewControllerAnimatedCompletion',
          );
        }

        changeRootController.dismissViewControllerAnimatedCompletion(
          animated,
          finish,
        );
        return true;
      }
    }
  }

  finish();
  return true;
}

function screenContentIsReady(
  screenId: string | undefined,
  registry: NativeScriptStackRegistry,
) {
  'worklet';

  return !!(screenId && registry.screenContentReady[screenId]);
}

function refreshScreenContentReady(
  screenId: string | undefined,
  controller: any,
  registry: NativeScriptStackRegistry,
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
    layoutHostedReactSubviews(controller);
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
  animated: boolean,
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
    registry,
  );

  if (!idsEqual(baseNativeIds, baseIds)) {
    setNavigationControllerViewControllers(
      navigationController,
      base.controllers,
      false,
    );
  }

  layoutNavigationStackViews(navigationController);
  configureStackControllers(baseIds, registry);
  configureNavigationAppearance(
    navigationController,
    registry.screenHeaderConfigs[baseIds[baseIds.length - 1]],
    ctx,
    registry,
  );

  const modalCommonRootIndex = presentedModalCommonRootIndex(
    stackId,
    registry,
    modalIds,
  );
  if (
    hasPresentedModalReshuffleAfterCommonRoot(
      stackId,
      registry,
      modalIds,
      modalCommonRootIndex,
    )
  ) {
    throw new Error(
      'Modally presented controllers are being reshuffled, this is not allowed',
    );
  }

  // UIKit attaches the first modal view during presentation. Upstream
  // RNSScreenStack.mm therefore gates on the stack view's window, not the new
  // modal screen's window; waiting for the modal host here deadlocks first
  // presentation because the host cannot receive a window until UIKit presents it.

  const didUpdateModals = setModalViewControllers(
    stackId,
    registry,
    ctx,
    modal.controllers,
    modalIds,
    animated,
  );

  if (didUpdateModals) {
    registry.stackNativeKeys[stackId] = idsKey(availableIds);
    registry.stackNativeCounts[stackId] = availableIds.length;
    layoutPresentedModalControllers(stackId, registry);
  }

  return didUpdateModals;
}

function markNativeScriptScreenContentReady(
  screenId: string,
  parentId: string | undefined,
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
    parentId,
  );
}

function screenIdFromStackChild(child: React.ReactNode) {
  if (!React.isValidElement(child)) {
    return undefined;
  }

  const props = child.props as {
    descriptor?: { route?: { key?: unknown } };
    screenId?: unknown;
  };

  if (typeof props.screenId === 'string') {
    return props.screenId;
  }

  return typeof props.descriptor?.route?.key === 'string'
    ? props.descriptor.route.key
    : undefined;
}

function collectStackChildRecords(children: React.ReactNode) {
  const records: NativeScriptStackChildRecord[] = [];
  const recordsByScreenId = new Map<string, NativeScriptStackChildRecord>();
  const childArray = React.Children.toArray(children);

  childArray.forEach((child, order) => {
    if (!React.isValidElement(child)) {
      return;
    }

    const screenId = screenIdFromStackChild(child);

    if (!screenId) {
      return;
    }

    const record = {
      element: child,
      order,
    };

    records.push(record);
    recordsByScreenId.set(screenId, record);
  });

  return { records, recordsByScreenId };
}

function inactiveRetainedStackChild(record: NativeScriptStackChildRecord) {
  const props = record.element.props as {
    descriptor?: { route?: { key?: unknown } };
    screenId?: unknown;
  };

  if (typeof props.screenId !== 'string') {
    return record;
  }

  return {
    element: React.cloneElement(record.element, {
      'aria-hidden': true,
      activityState: 0,
      pointerEvents: 'none',
    } as Partial<NativeScriptScreenStackItemProps>),
    order: record.order,
  };
}

function stackScreenParticipatesInUIKitModel(
  retainedByStack: boolean,
  activityState: unknown,
) {
  return !retainedByStack && activityState !== 0;
}

export const __nativeScriptStackScreenParticipatesInUIKitModelForTests =
  stackScreenParticipatesInUIKitModel;

function mergeNativeScriptStackChildren(
  children: React.ReactNode,
  previousChildrenByScreenId: Map<string, NativeScriptStackChildRecord>,
  retainedChildrenByScreenId: Map<string, NativeScriptStackChildRecord>,
  previouslyActiveScreenIds: string[],
  nativeDismissedScreenIds: Set<string>,
) {
  // NATIVESCRIPT_PORT_DEVIATION: React owns child element lifetime in the TS
  // port, so JS-driven removes still retain the previous React element as an
  // inactive owner until UIKit finishes closing. Native-owned unmounts do call
  // the upstream setViewToSnapshot selector in the controller dispose path.
  const { records, recordsByScreenId } = collectStackChildRecords(children);

  for (const screenId of previouslyActiveScreenIds) {
    if (recordsByScreenId.has(screenId)) {
      retainedChildrenByScreenId.delete(screenId);
      nativeDismissedScreenIds.delete(screenId);
      continue;
    }

    if (nativeDismissedScreenIds.has(screenId)) {
      retainedChildrenByScreenId.delete(screenId);
      continue;
    }

    const previousRecord = previousChildrenByScreenId.get(screenId);

    if (previousRecord) {
      retainedChildrenByScreenId.set(
        screenId,
        inactiveRetainedStackChild(previousRecord),
      );
    }
  }

  const mergedRecords = [...records];

  for (const [screenId, retainedRecord] of retainedChildrenByScreenId) {
    if (!recordsByScreenId.has(screenId)) {
      mergedRecords.push(retainedRecord);
    }
  }

  mergedRecords.sort((left, right) => left.order - right.order);

  return mergedRecords.map(record => record.element);
}

export const __mergeNativeScriptStackChildrenForTests =
  mergeNativeScriptStackChildren;

function reconcileStack(
  stackId: string,
  registry: NativeScriptStackRegistry,
  ctx: any,
  animated: boolean,
) {
  'worklet';
  (globalThis as Record<string, any>)[RECONCILE_STACK_KEY] = reconcileStack;

  const navigationController = registry.stacks[stackId];
  const requestedIds = registry.stackActiveScreenIds[stackId] ?? [];
  const { availableIds, controllers } = controllersForStackUIKitModelIds(
    requestedIds,
    registry,
  );
  const nextCount = controllers.length;

  if (!navigationController || nextCount === 0) {
    return;
  }

  if (registry.stackTransitioning[stackId]) {
    if (
      shouldQueueReconcileWhileTransitioning(stackId, registry, availableIds)
    ) {
      registry.stackPendingReconcileKeys[stackId] = idsKey(availableIds);
    }

    updateNativeBackGesture(navigationController);
    return;
  }

  if (registry.stackTransitionSettling[stackId]) {
    registry.stackPendingReconcileKeys[stackId] = idsKey(availableIds);
    updateNativeBackGesture(navigationController);
    return;
  }

  if (
    scheduleReconcileAfterNativeTransition(
      stackId,
      registry,
      ctx,
      navigationController,
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
    registry,
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
        canAnimateNativeChange,
      )
    ) {
      return;
    }
  }

  if (presentedModalIdsForStack(stackId, registry).length > 0) {
    if (
      setModalViewControllers(
        stackId,
        registry,
        ctx,
        [],
        [],
        canAnimateNativeChange,
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
        registry.screenHeaderConfigs[availableIds[nextCount - 1]],
        ctx,
        registry,
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
      registry.screenHeaderConfigs[availableIds[nextCount - 1]],
      ctx,
      registry,
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
        pushedScreenId,
      );
      configureScreenController(
        pushedController,
        registry.screenProps[pushedScreenId]!,
        registry.screenContexts[pushedScreenId],
        true,
        nextCount > 1,
      );
      if (nextCount > 1) {
        configureSourceBackButton(
          controllers[nextCount - 2]?.navigationItem,
          registry.screenHeaderConfigs[pushedScreenId],
          registry.screenHeaderConfigs[availableIds[nextCount - 2]],
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
        );

        return;
      }

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
        poppedScreenId,
      );
      if (
        animateStackPop(
          navigationController,
          controllers,
          registry.screens[previousIds[previousCount - 1]],
          nextCount,
          previousCount,
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
        );

        return;
      }

      registry.stackTransitioning[stackId] = false;
      registry.stackTransitionClosing[stackId] = undefined;
      registry.stackTransitionNativeDriven[stackId] = undefined;
      registry.stackTransitionRequestedFromJS[stackId] = undefined;
      registry.stackTransitionScreenIds[stackId] = undefined;
      registry.stackPendingReconcileKeys[stackId] = undefined;
    }

    const previousTopScreenId = previousIds[previousCount - 1];
    const nextTopScreenId = availableIds[nextCount - 1];
    const isReplace =
      nextCount === previousCount &&
      previousTopScreenId !== nextTopScreenId &&
      !screenIdInList(previousTopScreenId, availableIds);

    if (isReplace && nextTopScreenId) {
      const previousTopController = registry.screens[previousTopScreenId];
      const replaceProps = registry.screenProps[nextTopScreenId];
      const replaceAnimation = replaceProps?.replaceAnimation ?? 'pop';
      const closing = replaceAnimation !== 'push';
      const transitionScreenId = closing
        ? previousTopScreenId
        : nextTopScreenId;

      const token = markTransition(
        stackId,
        registry,
        ctx,
        closing,
        transitionScreenId,
      );

      configureStackControllers(availableIds, registry);
      configureNavigationAppearance(
        navigationController,
        registry.screenHeaderConfigs[nextTopScreenId],
        ctx,
        registry,
      );

      let didStartReplaceAnimation = false;

      if (
        replaceAnimation === 'push' &&
        typeof navigationController.setViewControllersAnimated === 'function'
      ) {
        navigationController.setViewControllersAnimated(
          createArray(controllers),
          true,
        );
        didStartReplaceAnimation = true;
      } else if (
        previousTopController &&
        typeof navigationController.setViewControllersAnimated === 'function' &&
        typeof navigationController.popViewControllerAnimated === 'function'
      ) {
        navigationController.setViewControllersAnimated(
          createArray([...controllers, previousTopController]),
          false,
        );
        navigationController.popViewControllerAnimated(true);
        didStartReplaceAnimation = true;
      } else {
        setNavigationControllerViewControllers(
          navigationController,
          controllers,
          false,
        );
        registry.stackTransitioning[stackId] = false;
        registry.stackTransitionClosing[stackId] = undefined;
        registry.stackTransitionNativeDriven[stackId] = undefined;
        registry.stackTransitionRequestedFromJS[stackId] = undefined;
        registry.stackTransitionScreenIds[stackId] = undefined;
        registry.stackPendingReconcileKeys[stackId] = undefined;
      }

      registry.stackNativeKeys[stackId] = nextKey;
      registry.stackNativeCounts[stackId] = nextCount;
      updateNativeBackGesture(navigationController);

      if (!didStartReplaceAnimation) {
        layoutNavigationStackViews(navigationController);
        cleanupDetachedScreens(stackId, registry);
        return;
      }

      scheduleTransitionFallback(
        stackId,
        registry,
        ctx,
        token,
        closing,
        transitionScreenId,
        availableIds,
        navigationController,
      );

      return;
    }
  }

  setNavigationControllerViewControllers(
    navigationController,
    controllers,
    false,
  );
  registry.stackNativeKeys[stackId] = nextKey;
  registry.stackNativeCounts[stackId] = nextCount;

  layoutNavigationStackViews(navigationController);
  configureStackControllers(availableIds, registry);
  configureNavigationAppearance(
    navigationController,
    registry.screenHeaderConfigs[availableIds[nextCount - 1]],
    ctx,
    registry,
  );
  updateNativeBackGesture(navigationController);
  cleanupDetachedScreens(stackId, registry);
}

const NativeScriptStackController = NativeScriptRuntime.defineUIViewController<
  {
    activeScreenIds: string[];
    contentRevision: number;
    onNativeStackTransition?: (event: NativeStackTransitionEvent) => void;
    renderRevision: number;
    stackId: string;
    style?: unknown;
  },
  any
>({
  debugName: 'RNSScreenStack.NativeScript',
  layout: { sizing: 'fill' },
  createController(ctx: any) {
    'worklet';
    installHeaderSubviewUpdateHandler();

    const UIViewController = nativeValue('UIViewController');
    const StackContainerView = nativeScriptStackContainerViewClass();
    const UINavigationController = nativeScriptNavigationControllerClass();

    if (!UIViewController || typeof UIViewController.alloc !== 'function') {
      throw new Error('UIViewController is not available in the UI runtime');
    }

    if (
      !UINavigationController ||
      typeof UINavigationController.alloc !== 'function'
    ) {
      throw new Error(
        'UINavigationController is not available in the UI runtime',
      );
    }

    const placeholder = createPlaceholderViewController();
    const allocated = UINavigationController.alloc();
    const controller =
      allocated && typeof allocated.init === 'function'
        ? allocated.init()
        : allocated;
    const UIView = nativeValue('UIView');
    const navigationView = controller.view;
    const containerViewAllocated =
      StackContainerView && typeof StackContainerView.alloc === 'function'
        ? StackContainerView.alloc()
        : null;
    const containerView =
      containerViewAllocated &&
      typeof containerViewAllocated.init === 'function'
        ? containerViewAllocated.init()
        : containerViewAllocated;

    if (containerView && navigationView) {
      containerView.backgroundColor = nativeColor(
        undefined,
        'systemBackgroundColor',
      );
      containerView.autoresizingMask = flexibleSizeMask();
      containerView.userInteractionEnabled = true;
      containerView.__nativeScriptNavigationController = controller;
      containerView.__nativeScriptEmbeddedNavigationView = navigationView;
      navigationView.frame = containerView.bounds;
      navigationView.autoresizingMask = flexibleSizeMask();
      containerView.addSubview(navigationView);
      controller.__nativeScriptStackContainerView = containerView;
      controller.__nativeScriptEmbeddedNavigationView = navigationView;
    }

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

    if (placeholder) {
      controller.viewControllers = createArray([placeholder]);
    }
    const registry = getRegistry(globalThis as Record<string, any>);

    installNativeBackGestureDelegate(controller, ctx);
    installStackSwipeGestures(ctx.props.stackId, registry, ctx, controller);

    const delegateProtocol =
      nativeValue('UINavigationControllerDelegate') ??
      'UINavigationControllerDelegate';

    controller.delegate = ctx.delegate(controller, delegateProtocol, {
      navigationControllerAnimationControllerForOperationFromViewControllerToViewController(
        _navigationController: any,
        operation: number,
        fromViewController: any,
        toViewController: any,
      ) {
        'worklet';
        const registry = getRegistry(globalThis as Record<string, any>);
        const props = isPushOperation(operation)
          ? screenPropsForTransitionController(toViewController, registry)
          : screenPropsForTransitionController(fromViewController, registry);
        const animation = stackAnimationForProps(props);
        const shouldCancelDismiss =
          isPopOperation(operation) &&
          shouldCancelDismissFromControllerToController(
            ctx.props.stackId,
            registry,
            fromViewController,
            toViewController,
          );
        // NATIVESCRIPT_PORT_DEVIATION: upstream re-reads from/to views from
        // transitionCoordinator in interactionControllerForAnimationController.
        // NativeScript already receives stable UIViewControllers in this
        // animation delegate, while the coordinator viewForKey selector can be
        // hidden behind untyped proxies. Cache this pair for the next delegate
        // callback, then run the same percent-driven cancellation sequence.
        registry.stackPendingDismissCancels[ctx.props.stackId] =
          shouldCancelDismiss
            ? {
                fromController: fromViewController,
                toController: toViewController,
              }
            : undefined;
        const gestureDrivenPop =
          registry.stackCustomAnimationOnSwipe[ctx.props.stackId] === true ||
          registry.stackFullWidthSwipingWithPanGesture[ctx.props.stackId] ===
            true;

        if (
          !shouldCancelDismiss &&
          !gestureDrivenPop &&
          !isCustomStackAnimation(animation)
        ) {
          return null;
        }

        return createScreenStackAnimator(ctx, operation, props);
      },
      navigationControllerInteractionControllerForAnimationController(
        _navigationController: any,
        animationController: any,
      ) {
        'worklet';
        const registry = getRegistry(globalThis as Record<string, any>);
        const stackId = ctx.props.stackId;
        let interactionController =
          registry.stackInteractionControllers[stackId];
        const pendingDismissCancel =
          registry.stackPendingDismissCancels[stackId];

        if (!interactionController && pendingDismissCancel) {
          interactionController = createPercentDrivenInteractiveTransition(ctx);

          if (interactionController) {
            registry.stackInteractionControllers[stackId] =
              interactionController;
            scheduleNativeDismissCancel(
              stackId,
              registry,
              ctx,
              pendingDismissCancel.fromController,
              pendingDismissCancel.toController,
            );
          } else {
            registry.stackPendingDismissCancels[stackId] = undefined;
          }
        }

        if (interactionController) {
          if (
            typeof interactionController.setAnimationController === 'function'
          ) {
            interactionController.setAnimationController(animationController);
          } else {
            interactionController.animationController = animationController;
          }
        }

        return interactionController ?? null;
      },
      navigationControllerWillShowViewControllerAnimated(
        navigationController: any,
        viewController: any,
      ) {
        'worklet';
        const registry = getRegistry(globalThis as Record<string, any>);
        const currentIds = navigationControllerScreenIds(
          navigationController,
          registry,
        );
        const nextScreenId = screenIdForController(viewController, registry);
        const nextIndex = nextScreenId ? currentIds.indexOf(nextScreenId) : -1;
        const activeIds =
          registry.stackActiveScreenIds[ctx.props.stackId] ?? [];
        const nativeStackIsAlreadyShorter = shouldEmitNativeStackChange(
          currentIds,
          activeIds,
        );
        const closing =
          nativeStackIsAlreadyShorter ||
          (nextIndex >= 0 && nextIndex < Math.max(0, currentIds.length - 1));
        const affectedScreenId = closing
          ? activeIds[activeIds.length - 1] ?? currentIds[currentIds.length - 1]
          : nextScreenId ?? activeIds[activeIds.length - 1];

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
          false,
        );
      },
      navigationControllerDidShowViewControllerAnimated(
        navigationController: any,
        viewController: any,
      ) {
        'worklet';
        const registry = getRegistry(globalThis as Record<string, any>);
        releaseStackInteractionController(ctx.props.stackId, registry, ctx);

        const screenId = screenIdForController(viewController, registry);
        const shownScreenIds = navigationControllerScreenIds(
          navigationController,
          registry,
        );

        if (!screenId) {
          layoutNavigationStackViews(navigationController);
          updateNativeBackGesture(navigationController);

          const activeIds =
            registry.stackActiveScreenIds[ctx.props.stackId] ?? [];
          const previousIds = idsFromKey(
            registry.stackNativeKeys[ctx.props.stackId],
          );
          const nativeCount = arrayCount(navigationController?.viewControllers);
          const isClosing =
            registry.stackTransitionClosing[ctx.props.stackId] === true;
          // NATIVESCRIPT_PORT_DEVIATION: upstream receives the exact
          // RNSScreen controller in didShow and can use ObjC object identity.
          // NativeScript may hand this delegate a proxy/placeholder whose JS
          // identity cannot be resolved during the callback. Keep only the
          // native route key/count bookkeeping here so React reconciliation
          // does not replay the same push; do not reapply viewControllers from
          // inferred ids.
          const resolvedScreenIds = !isClosing
            ? activeIds
            : shownScreenIds.length > 0
            ? shownScreenIds
            : nativeCount > 0 && nativeCount < activeIds.length
            ? activeIds.slice(0, nativeCount)
            : previousIds.length > 1
            ? previousIds.slice(0, previousIds.length - 1)
            : activeIds;
          if (registry.stackTransitioning[ctx.props.stackId] === true) {
            if (resolvedScreenIds.length > 0) {
              registry.stackNativeKeys[ctx.props.stackId] =
                idsKey(resolvedScreenIds);
              registry.stackNativeCounts[ctx.props.stackId] =
                resolvedScreenIds.length;
            }

            finishTransition(
              ctx.props.stackId,
              registry,
              ctx,
              isClosing,
              registry.stackTransitionScreenIds[ctx.props.stackId],
            );
          } else if (resolvedScreenIds.length > 0) {
            registry.stackNativeKeys[ctx.props.stackId] =
              idsKey(resolvedScreenIds);
            registry.stackNativeCounts[ctx.props.stackId] =
              resolvedScreenIds.length;
          }

          return;
        }

        layoutNavigationStackViews(navigationController);
        configureStackControllers(shownScreenIds, registry);
        updateNativeBackGesture(navigationController);
        configureNavigationAppearance(
          navigationController,
          registry.screenHeaderConfigs[screenId],
          ctx,
          registry,
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
        const didNativeStackOwnChange =
          !didCancelNativeDismiss &&
          !wasRequestedFromJS &&
          (registry.stackTransitionNativeDriven[ctx.props.stackId] === true ||
            shouldEmitNativeStackChange(shownScreenIds, activeIds));

        if (isTransitioning) {
          finishTransition(
            ctx.props.stackId,
            registry,
            ctx,
            wasClosing,
            transitionScreenId,
            didCancelNativeDismiss,
          );
        }

        if (isTransitioning && !wasClosing) {
          reconcileStack(ctx.props.stackId, registry, ctx, true);
        } else if (isTransitioning && !didNativeStackOwnChange) {
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
  hostView(controller) {
    'worklet';

    return controller.__nativeScriptStackContainerView ?? controller.view;
  },
  mounted(controller, props, ctx) {
    'worklet';
    const registry = getRegistry(globalThis as Record<string, any>);

    if (
      !shouldApplyStackPropsRevision(
        props.stackId,
        registry,
        props.renderRevision,
      )
    ) {
      return;
    }

    registry.stacks[props.stackId] = controller;
    registry.stackContexts[props.stackId] = ctx;
    registry.stackActiveScreenIds[props.stackId] = props.activeScreenIds;
    reconcileStack(props.stackId, registry, ctx, false);
  },
  update(controller, props, _previousProps, ctx) {
    'worklet';
    const registry = getRegistry(globalThis as Record<string, any>);

    if (
      !shouldApplyStackPropsRevision(
        props.stackId,
        registry,
        props.renderRevision,
      )
    ) {
      return;
    }

    registry.stacks[props.stackId] = controller;
    registry.stackContexts[props.stackId] = ctx;
    registry.stackActiveScreenIds[props.stackId] = props.activeScreenIds;
    reconcileStack(props.stackId, registry, ctx, true);
  },
  dispose(controller, props) {
    'worklet';
    const registry = (globalThis as Record<string, any>)[REGISTRY_KEY];

    if (!registry) {
      return;
    }

    ensureRegistryShape(registry);
    const stackContext = registry.stackContexts[props.stackId];

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
    registry.stackTransitionSettling[props.stackId] = undefined;
    registry.stackTransitionTokens[props.stackId] = undefined;
    registry.stackPendingReconcileKeys[props.stackId] = undefined;
    registry.stackPropRevisions[props.stackId] = undefined;
    releaseStackInteractionController(props.stackId, registry, stackContext);
    registry.stackPendingDismissCancels[props.stackId] = undefined;
    registry.stackSwipeGesturesInstalled[props.stackId] = undefined;
    registry.stackUpdatesScheduled[props.stackId] = undefined;
    registry.stackPresentedModalKeys[props.stackId] = undefined;
    registry.stackUpdatingModals[props.stackId] = undefined;
    registry.stackScheduledModalUpdates[props.stackId] = undefined;
    prepareStackControllerForRecycle(controller);
  },
});

const NativeScriptScreenContainerHost =
  NativeScriptRuntime.defineUIViewController<
    {
      activeScreenIds: string[];
      containerId: string;
      hasTwoStates: boolean;
      renderRevision: number;
      style?: unknown;
    },
    any
  >({
    debugName: 'RNSScreenContainer.NativeScript',
    layout: { sizing: 'fill' },
    createController(ctx: any) {
      'worklet';
      const UIView = nativeValue('UIView');
      const ControllerClass = ctx.props.hasTwoStates
        ? nativeScriptNavigationControllerClass()
        : nativeScriptScreenContainerControllerClass();

      if (!ControllerClass || typeof ControllerClass.alloc !== 'function') {
        throw new Error('UIViewController is not available in the UI runtime');
      }

      const allocated = ControllerClass.alloc();
      const controller =
        allocated && typeof allocated.init === 'function'
          ? allocated.init()
          : allocated;

      controller.__nativeScriptContainerId = ctx.props.containerId;
      configureExtendedLayout(controller);

      if (ctx.props.hasTwoStates) {
        if (typeof controller.setNavigationBarHiddenAnimated === 'function') {
          controller.setNavigationBarHiddenAnimated(true, false);
        } else {
          controller.navigationBarHidden = true;
        }

        setNavigationControllerViewControllers(
          controller,
          [createPlaceholderViewController()].filter(Boolean),
          false,
        );
      }

      if (UIView && typeof UIView.alloc === 'function' && controller.view) {
        const mountViewAllocated = UIView.alloc();
        const mountView =
          mountViewAllocated && typeof mountViewAllocated.init === 'function'
            ? mountViewAllocated.init()
            : mountViewAllocated;

        mountView.tag = MOUNT_VIEW_TAG;
        mountView.hidden = true;
        mountView.userInteractionEnabled = false;
        mountView.frame = controller.view.bounds;
        mountView.autoresizingMask = flexibleSizeMask();
        controller.view.addSubview(mountView);
      }

      return controller;
    },
    childrenView(controller) {
      'worklet';
      const existingMountView =
        controller.view && typeof controller.view.viewWithTag === 'function'
          ? controller.view.viewWithTag(MOUNT_VIEW_TAG)
          : null;

      return existingMountView ?? controller.view;
    },
    mounted(controller, props, ctx) {
      'worklet';
      const registry = getRegistry(globalThis as Record<string, any>);

      registry.containers[props.containerId] = controller;
      registry.containerContexts[props.containerId] = ctx;
      registry.containerActiveScreenIds[props.containerId] =
        props.activeScreenIds;
      registry.containerHasTwoStates[props.containerId] = props.hasTwoStates;
      reconcileScreenContainer(props.containerId, registry);
    },
    update(controller, props, _previousProps, ctx) {
      'worklet';
      const registry = getRegistry(globalThis as Record<string, any>);

      registry.containers[props.containerId] = controller;
      registry.containerContexts[props.containerId] = ctx;
      registry.containerActiveScreenIds[props.containerId] =
        props.activeScreenIds;
      registry.containerHasTwoStates[props.containerId] = props.hasTwoStates;
      reconcileScreenContainer(props.containerId, registry);
    },
    dispose(controller, props) {
      'worklet';
      const registry = (globalThis as Record<string, any>)[REGISTRY_KEY];

      if (!registry) {
        return;
      }

      ensureRegistryShape(registry);
      prepareScreenContainerForRecycle(props.containerId, controller, registry);
      registry.containers[props.containerId] = undefined;
      registry.containerContexts[props.containerId] = undefined;
      registry.containerActiveScreenIds[props.containerId] = undefined;
      registry.containerHasTwoStates[props.containerId] = undefined;
      registry.containerNativeKeys[props.containerId] = undefined;
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
    const UIViewController = nativeScriptScreenControllerClass();

    if (!UIViewController || typeof UIViewController.alloc !== 'function') {
      throw new Error('UIViewController is not available in the UI runtime');
    }

    const allocated = UIViewController.alloc();
    const controller =
      allocated && typeof allocated.init === 'function'
        ? allocated.init()
        : allocated;

    ensureScreenControllerView(controller);
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

    if (
      props.parentId &&
      registry.containerContexts[props.parentId] &&
      props.retainedByStack !== true
    ) {
      reconcileScreenContainer(props.parentId, registry);
    } else if (props.parentId && props.retainedByStack !== true) {
      const shouldAnimate = registry.stackNativeKeys[props.parentId] != null;

      reconcileStack(
        props.parentId,
        registry,
        registry.stackContexts[props.parentId],
        shouldAnimate,
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

    if (
      props.parentId &&
      registry.containerContexts[props.parentId] &&
      props.retainedByStack !== true
    ) {
      reconcileScreenContainer(props.parentId, registry);
    } else if (props.parentId && props.retainedByStack !== true) {
      reconcileStack(
        props.parentId,
        registry,
        registry.stackContexts[props.parentId],
        true,
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
        registry,
      );
    if (shouldRetainForNativePop) {
      controller.setViewToSnapshot?.();
      registry.screens[props.screenId] = controller;
      registry.screenControllerHashes[props.screenId] =
        controllerHash(controller);
      registry.screenHeaderConfigs[props.screenId] = props.headerConfig;
      registry.screenParents[props.screenId] = props.parentId;
      registry.screenProps[props.screenId] = props;
    } else {
      clearScreenRecord(registry, props.screenId);
    }

    if (
      props.parentId &&
      registry.containerContexts[props.parentId] &&
      props.retainedByStack !== true &&
      !shouldRetainForNativePop
    ) {
      reconcileScreenContainer(props.parentId, registry);
    } else if (
      props.parentId &&
      props.retainedByStack !== true &&
      !shouldRetainForNativePop
    ) {
      reconcileStack(
        props.parentId,
        registry,
        registry.stackContexts[props.parentId],
        Boolean(shouldRetainForNativePop),
      );
    }

    if (shouldRetainForNativePop) {
      return { removeHostView: false };
    }
  },
});

function containerScreenParticipatesInUIKitModel(
  hasTwoStates: boolean,
  activityState: unknown,
) {
  if (hasTwoStates) {
    return activityState === 2;
  }

  return activityState !== 0;
}

export function NativeScriptScreenContainer({
  children,
  hasTwoStates = false,
  style,
}: NativeScriptScreenContainerProps) {
  const containerId = React.useRef<string | null>(null);
  const registeredItemsRef = React.useRef<Map<string, RegisteredStackItem>>(
    new Map(),
  );
  const nextItemOrderRef = React.useRef(0);
  const [contentRevision, forceVersion] = React.useReducer(
    (value: number) => value + 1,
    0,
  );

  if (containerId.current === null) {
    nextContainerId += 1;
    containerId.current = `rn-ns-container-${nextContainerId}`;
  }

  const registerScreen = React.useCallback(
    (
      screenId: string,
      props: NativeScriptScreenStackItemProps,
      active: boolean,
    ) => {
      const existing = registeredItemsRef.current.get(screenId);
      const order = existing?.order ?? nextItemOrderRef.current++;
      const shouldUpdate =
        !existing ||
        existing.active !== active ||
        existing.props.activityState !== props.activityState;

      registeredItemsRef.current.set(screenId, {
        active,
        order,
        props,
      });

      if (shouldUpdate) {
        forceVersion();
      }
    },
    [],
  );

  const unregisterScreen = React.useCallback((screenId: string) => {
    const didDelete = registeredItemsRef.current.delete(screenId);

    if (didDelete) {
      forceVersion();
    }
  }, []);

  const contextValue = React.useMemo(
    () => ({
      containerId: containerId.current!,
      hasTwoStates,
      registerScreen,
      unregisterScreen,
    }),
    [hasTwoStates, registerScreen, unregisterScreen],
  );

  const activeScreenIds = Array.from(registeredItemsRef.current.entries())
    .filter(([, item]) => item.active)
    .sort((left, right) => left[1].order - right[1].order)
    .map(([screenId]) => screenId);

  return (
    <NativeScriptScreenContainerContext.Provider value={contextValue}>
      <NativeScriptScreenContainerHost
        activeScreenIds={activeScreenIds}
        containerId={containerId.current}
        hasTwoStates={hasTwoStates}
        renderRevision={contentRevision}
        style={style}>
        {children}
      </NativeScriptScreenContainerHost>
    </NativeScriptScreenContainerContext.Provider>
  );
}

export const NativeScriptScreen = React.forwardRef<View, ScreenProps>(
  function NativeScriptScreen(
    { active, activityState, children, onLayout, screenId, style, ...rest },
    ref,
  ) {
    const containerContext = React.useContext(
      NativeScriptScreenContainerContext,
    );
    const generatedScreenIdRef = React.useRef<string | null>(null);

    if (generatedScreenIdRef.current === null) {
      nextScreenId += 1;
      generatedScreenIdRef.current = `rn-ns-screen-${nextScreenId}`;
    }

    const resolvedActivityState =
      activityState ?? (active !== undefined ? (active !== 0 ? 2 : 0) : 2);
    const resolvedScreenId =
      screenId && screenId.length > 0 ? screenId : generatedScreenIdRef.current;
    const resolvedParentId = containerContext?.containerId;
    const containerOwnsNativeAttachment = containerContext != null;
    const activeInContainer = containerScreenParticipatesInUIKitModel(
      containerContext?.hasTwoStates === true,
      resolvedActivityState,
    );
    const registeredPropsRef =
      React.useRef<NativeScriptScreenStackItemProps | null>(null);

    registeredPropsRef.current = {
      ...rest,
      activityState: resolvedActivityState,
      parentId: resolvedParentId,
      screenId: resolvedScreenId,
      style,
    } as NativeScriptScreenStackItemProps;

    React.useLayoutEffect(() => {
      if (!containerContext) {
        return;
      }

      return () => {
        containerContext.unregisterScreen(resolvedScreenId);
      };
    }, [containerContext, resolvedScreenId]);

    React.useLayoutEffect(() => {
      if (!containerContext) {
        return;
      }

      containerContext.registerScreen(
        resolvedScreenId,
        registeredPropsRef.current!,
        activeInContainer,
      );
    });

    return (
      <NativeScriptScreenController
        {...rest}
        activityState={resolvedActivityState}
        attachController={!containerOwnsNativeAttachment}
        attachNativeView={!containerOwnsNativeAttachment}
        parentId={resolvedParentId}
        screenId={resolvedScreenId}
        style={[styles.screen, style]}>
        <View ref={ref} onLayout={onLayout} style={[styles.content, style]}>
          {children}
        </View>
      </NativeScriptScreenController>
    );
  },
);

export function NativeScriptScreenStack({
  children,
  onFinishTransitioning,
  onNativeStackTransition,
  style,
}: NativeScriptScreenStackProps) {
  const stackId = React.useRef<string | null>(null);
  const registeredItemsRef = React.useRef<Map<string, RegisteredStackItem>>(
    new Map(),
  );
  const previousChildrenByScreenIdRef = React.useRef<
    Map<string, NativeScriptStackChildRecord>
  >(new Map());
  const retainedChildrenByScreenIdRef = React.useRef<
    Map<string, NativeScriptStackChildRecord>
  >(new Map());
  const nativeDismissedScreenIdsRef = React.useRef<Set<string>>(new Set());
  const retainedReleaseTimersRef = React.useRef<
    Map<string, ReturnType<typeof setTimeout>>
  >(new Map());
  const renderRevisionRef = React.useRef(0);
  const nextItemOrderRef = React.useRef(0);
  const [contentRevision, forceVersion] = React.useReducer(
    (value: number) => value + 1,
    0,
  );

  if (stackId.current === null) {
    nextStackId += 1;
    stackId.current = `rn-ns-stack-${nextStackId}`;
  }

  const registerScreen = React.useCallback(
    (
      screenId: string,
      props: NativeScriptScreenStackItemProps,
      active: boolean,
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

      if (shouldUpdate) {
        forceVersion();
      }
    },
    [],
  );

  const unregisterScreen = React.useCallback((screenId: string) => {
    const didDelete = registeredItemsRef.current.delete(screenId);
    nativeDismissedScreenIdsRef.current.delete(screenId);

    if (didDelete) {
      forceVersion();
    }
  }, []);

  const isScreenRetained = React.useCallback((screenId: string) => {
    return retainedChildrenByScreenIdRef.current.has(screenId);
  }, []);

  const contextValue = React.useMemo(
    () => ({
      isScreenRetained,
      registerScreen,
      stackId: stackId.current!,
      unregisterScreen,
    }),
    [isScreenRetained, registerScreen, unregisterScreen],
  );

  const releaseRetainedScreen = React.useCallback((screenId: string) => {
    const timer = retainedReleaseTimersRef.current.get(screenId);

    if (timer) {
      clearTimeout(timer);
      retainedReleaseTimersRef.current.delete(screenId);
    }

    nativeDismissedScreenIdsRef.current.add(screenId);

    if (retainedChildrenByScreenIdRef.current.delete(screenId)) {
      forceVersion();
    }
  }, []);

  const previouslyActiveScreenIds = Array.from(
    registeredItemsRef.current.entries(),
  )
    .filter(([, item]) => item.active)
    .sort((left, right) => left[1].order - right[1].order)
    .map(([screenId]) => screenId);
  const renderedChildren = mergeNativeScriptStackChildren(
    children,
    previousChildrenByScreenIdRef.current,
    retainedChildrenByScreenIdRef.current,
    previouslyActiveScreenIds,
    nativeDismissedScreenIdsRef.current,
  );
  const renderedChildRecords = collectStackChildRecords(renderedChildren);
  const retainedScreenIds = new Set(
    retainedChildrenByScreenIdRef.current.keys(),
  );
  const retainedScreenIdsKey =
    Array.from(retainedScreenIds).join(SCREEN_ID_SEPARATOR);
  const activeScreenIds = Array.from(registeredItemsRef.current.entries())
    .filter(
      ([screenId, item]) =>
        item.active &&
        !retainedScreenIds.has(screenId) &&
        !nativeDismissedScreenIdsRef.current.has(screenId),
    )
    .sort((left, right) => left[1].order - right[1].order)
    .map(([screenId]) => screenId);

  previousChildrenByScreenIdRef.current =
    renderedChildRecords.recordsByScreenId;
  renderRevisionRef.current += 1;
  const renderRevision = renderRevisionRef.current;

  React.useEffect(() => {
    for (const screenId of retainedScreenIds) {
      if (retainedReleaseTimersRef.current.has(screenId)) {
        continue;
      }

      const timer = setTimeout(() => {
        releaseRetainedScreen(screenId);
      }, RETAINED_SCREEN_RELEASE_TIMEOUT_MS);

      retainedReleaseTimersRef.current.set(screenId, timer);
    }

    for (const [screenId, timer] of retainedReleaseTimersRef.current) {
      if (retainedScreenIds.has(screenId)) {
        continue;
      }

      clearTimeout(timer);
      retainedReleaseTimersRef.current.delete(screenId);
    }
  }, [releaseRetainedScreen, retainedScreenIds, retainedScreenIdsKey]);

  React.useEffect(() => {
    const timers = retainedReleaseTimersRef.current;

    return () => {
      for (const timer of timers.values()) {
        clearTimeout(timer);
      }

      timers.clear();
    };
  }, []);

  const handleNativeTransition = React.useCallback(
    (event: NativeStackTransitionEvent) => {
      onNativeStackTransition?.(event);

      const {
        cancelled,
        closing,
        nativeDriven,
        phase,
        requestedFromJS,
        screenId,
      } = event.nativeEvent;

      if (phase === 'end' && closing && !cancelled) {
        if (nativeDriven === true && requestedFromJS === false) {
          nativeDismissedScreenIdsRef.current.add(screenId);
        } else {
          releaseRetainedScreen(screenId);
        }
      }

      if (phase === 'end') {
        onFinishTransitioning?.({
          nativeEvent: {},
        } as Parameters<NonNullable<ScreenStackProps['onFinishTransitioning']>>[0]);
      }
    },
    [onFinishTransitioning, onNativeStackTransition, releaseRetainedScreen],
  );

  return (
    <NativeScriptScreenStackContext.Provider value={contextValue}>
      <NativeScriptStackController
        activeScreenIds={activeScreenIds}
        attachController
        contentRevision={contentRevision}
        onNativeStackTransition={handleNativeTransition}
        renderRevision={renderRevision}
        stackId={stackId.current}
        style={style}>
        {renderedChildren}
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
  ref,
) {
  const stackContext = React.useContext(NativeScriptScreenStackContext);
  const resolvedParentId = parentId ?? stackContext?.stackId;
  const retainedByStack = stackContext?.isScreenRetained(screenId) === true;
  // Direct port of RNSScreenStackView.updateContainer's
  // `activityState != RNSActivityStateInactive` guard: inactive/preloaded
  // screens remain mounted in React, but they must not enter the UIKit
  // UINavigationController/presentation-controller model or become the top
  // screen for native gesture/header decisions.
  const active = stackScreenParticipatesInUIKitModel(
    retainedByStack,
    rest.activityState,
  );
  const registeredPropsRef =
    React.useRef<NativeScriptScreenStackItemProps | null>(null);
  const closing = React.useRef(new Animated.Value(0)).current;
  const progress = React.useRef(new Animated.Value(0)).current;
  const goingForward = React.useRef(new Animated.Value(0)).current;
  const onLayoutProp = rest.onLayout;
  const shouldAttachControllerView =
    stackPresentation != null && stackPresentation !== 'push';
  const transitionProgressEvent = Animated.event(
    [
      {
        nativeEvent: {
          progress,
          closing,
          goingForward,
        },
      },
    ],
    { useNativeDriver: true },
  );

  registeredPropsRef.current = {
    ...rest,
    contentStyle,
    headerConfig,
    onHeaderHeightChange,
    onTransitionProgress: transitionProgressEvent,
    parentId: resolvedParentId,
    screenId,
    stackPresentation,
    style,
  } as NativeScriptScreenStackItemProps;

  const content = (
    <NativeScriptScreenHeaderSubviewContext.Provider value={{ screenId }}>
      <View
        ref={ref}
        accessibilityElementsHidden={
          retainedByStack || rest['aria-hidden'] === true
        }
        aria-hidden={retainedByStack || rest['aria-hidden']}
        pointerEvents={retainedByStack ? 'none' : rest.pointerEvents}
        importantForAccessibility={
          retainedByStack || rest['aria-hidden'] === true
            ? 'no-hide-descendants'
            : 'auto'
        }
        onLayout={onLayoutProp}
        style={[styles.content, contentStyle]}>
        <TransitionProgressContext.Provider
          value={{
            progress,
            closing,
            goingForward,
          }}>
          {children}
        </TransitionProgressContext.Provider>
      </View>
    </NativeScriptScreenHeaderSubviewContext.Provider>
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
        },
      );
    },
    [resolvedParentId, screenId],
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
      onTransitionProgress={transitionProgressEvent}
      parentId={resolvedParentId}
      retainedByStack={retainedByStack}
      screenId={screenId}
      stackPresentation={stackPresentation}
      style={[styles.screen, style]}>
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
