import * as React from 'react';
import {
  Platform,
  type StyleProp,
  StyleSheet,
  type View,
  type ViewStyle,
} from 'react-native';
import warnOnce from 'warn-once';

import DebugContainer from './DebugContainer';
import {
  HeaderBarButtonItemWithMenu,
  ScreenProps,
  ScreenStackHeaderConfigProps,
  StackPresentationTypes,
} from '../types';
import {
  ScreenStackHeaderConfig,
  countNativeScriptHeaderSubviewChildren,
} from './ScreenStackHeaderConfig';
import { prepareHeaderBarButtonItems } from './helpers/prepareHeaderBarButtonItems';
import Screen from './Screen';
import ScreenStack from './ScreenStack';
import {
  NativeScriptScreenStack,
  NativeScriptScreenStackItem,
} from './native-stack/native-script/NativeScriptScreenStack';
import { RNSScreensRefContext } from '../contexts';
import { FooterComponent } from './ScreenFooter';
import { SafeAreaViewProps } from './safe-area/SafeAreaView.types';
import { SafeAreaView } from './safe-area/SafeAreaView';
import { featureFlags } from '../flags';
import { isIOS26OrHigher } from './helpers/PlatformUtils';
import {
  TopInsetApplicationContext,
  useTopInsetApplication,
} from './contexts/TopInsetApplicationContext';
import { isHeaderBarButtonsAvailableForCurrentPlatform } from '../utils';

type Props = Omit<
  ScreenProps,
  'enabled' | 'isNativeStack' | 'hasLargeHeader'
> & {
  screenId: string;
  headerConfig?: ScreenStackHeaderConfigProps | undefined;
  contentStyle?: StyleProp<ViewStyle> | undefined;
};

type HeaderButtonPressEvent = { nativeEvent: { buttonId: string } };
type HeaderMenuPressEvent = { nativeEvent: { menuId: string } };
type PreparedHeaderBarButtonItem = ReturnType<
  typeof prepareHeaderBarButtonItems
>[number];

function collectHeaderButtonActions(
  items: Array<PreparedHeaderBarButtonItem> | undefined,
  actions: Map<string, () => void>,
) {
  if (!items) {
    return;
  }

  for (const item of items) {
    if (
      item &&
      item.type === 'button' &&
      'buttonId' in item &&
      typeof item.buttonId === 'string' &&
      typeof item.onPress === 'function'
    ) {
      actions.set(item.buttonId, item.onPress);
    }
  }
}

function collectHeaderMenuActions(
  menu: HeaderBarButtonItemWithMenu['menu'],
  actions: Map<string, () => void>,
) {
  for (const item of menu.items) {
    if ('items' in item) {
      collectHeaderMenuActions(item, actions);
    } else if (
      'menuId' in item &&
      typeof item.menuId === 'string' &&
      typeof item.onPress === 'function'
    ) {
      actions.set(item.menuId, item.onPress);
    }
  }
}

function collectHeaderBarMenuActions(
  items: Array<PreparedHeaderBarButtonItem> | undefined,
  actions: Map<string, () => void>,
) {
  if (!items) {
    return;
  }

  for (const item of items) {
    if (item && item.type === 'menu' && item.menu) {
      collectHeaderMenuActions(item.menu, actions);
    }
  }
}

function ScreenStackItem(
  {
    children,
    headerConfig,
    activityState,
    shouldFreeze,
    stackPresentation,
    sheetAllowedDetents,
    contentStyle,
    style,
    screenId,
    onHeaderHeightChange,
    scrollEdgeEffects,
    // eslint-disable-next-line camelcase
    unstable_sheetFooter,
    ...rest
  }: Props,
  ref: React.ForwardedRef<View>,
) {
  const headerVisible = !headerConfig?.hidden;
  const headerTopInsetDisabled =
    headerConfig?.disableTopInsetApplication ?? false;
  const { nextContextValue } = useTopInsetApplication(
    headerVisible,
    headerTopInsetDisabled,
  );

  const currentScreenRef = React.useRef<View | null>(null);
  const screenRefs = React.useContext(RNSScreensRefContext);

  React.useImperativeHandle(ref, () => currentScreenRef.current!);

  const setCurrentScreenRef = React.useCallback(
    (node: View | null) => {
      currentScreenRef.current = node;

      if (screenRefs === null) {
        console.warn(
          'Looks like RNSScreensRefContext is missing. Make sure the ScreenStack component is wrapped in it',
        );
        return;
      }

      const currentRefs = screenRefs.current;

      if (node === null) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete currentRefs[screenId];
      } else {
        currentRefs[screenId] = { current: node };
      }
    },
    [screenId, screenRefs],
  );

  const stackPresentationWithDefault = stackPresentation ?? 'push';
  const headerConfigHiddenWithDefault = headerConfig?.hidden ?? false;

  const isHeaderInModal =
    Platform.OS === 'android'
      ? false
      : stackPresentationWithDefault !== 'push' &&
        headerConfigHiddenWithDefault === false;

  const headerHiddenPreviousRef = React.useRef(headerConfigHiddenWithDefault);

  React.useEffect(() => {
    warnOnce(
      Platform.OS !== 'android' &&
        stackPresentationWithDefault !== 'push' &&
        headerHiddenPreviousRef.current !== headerConfigHiddenWithDefault,
      `Dynamically changing header's visibility in modals will result in remounting the screen and losing all local state.`,
    );

    headerHiddenPreviousRef.current = headerConfigHiddenWithDefault;
  }, [headerConfigHiddenWithDefault, stackPresentationWithDefault]);

  const hasEdgeEffects =
    scrollEdgeEffects === undefined ||
    Object.values(scrollEdgeEffects).some(propValue => propValue !== 'hidden');
  const hasBlurEffect =
    headerConfig?.blurEffect !== undefined &&
    headerConfig.blurEffect !== 'none';
  const shouldUseNativeScriptStack = Platform.OS === 'ios';
  const nativeScriptHeaderLeftBarButtonItems = React.useMemo(
    () =>
      shouldUseNativeScriptStack &&
      headerConfig?.headerLeftBarButtonItems &&
      isHeaderBarButtonsAvailableForCurrentPlatform
        ? prepareHeaderBarButtonItems(
            headerConfig.headerLeftBarButtonItems,
            'left',
          )
        : undefined,
    [headerConfig?.headerLeftBarButtonItems, shouldUseNativeScriptStack],
  );
  const nativeScriptHeaderRightBarButtonItems = React.useMemo(
    () =>
      shouldUseNativeScriptStack &&
      headerConfig?.headerRightBarButtonItems &&
      isHeaderBarButtonsAvailableForCurrentPlatform
        ? prepareHeaderBarButtonItems(
            headerConfig.headerRightBarButtonItems,
            'right',
          )
        : undefined,
    [headerConfig?.headerRightBarButtonItems, shouldUseNativeScriptStack],
  );
  const hasNativeScriptHeaderBarButtonItems =
    isHeaderBarButtonsAvailableForCurrentPlatform &&
    ((nativeScriptHeaderLeftBarButtonItems?.length ?? 0) > 0 ||
      (nativeScriptHeaderRightBarButtonItems?.length ?? 0) > 0);
  const nativeScriptHeaderConfig = React.useMemo(
    () =>
      hasNativeScriptHeaderBarButtonItems && headerConfig
        ? {
            ...headerConfig,
            headerLeftBarButtonItems: nativeScriptHeaderLeftBarButtonItems,
            headerRightBarButtonItems: nativeScriptHeaderRightBarButtonItems,
          }
        : headerConfig,
    [
      hasNativeScriptHeaderBarButtonItems,
      headerConfig,
      nativeScriptHeaderLeftBarButtonItems,
      nativeScriptHeaderRightBarButtonItems,
    ],
  );
  const nativeScriptHeaderButtonActionMap = React.useMemo(() => {
    if (!hasNativeScriptHeaderBarButtonItems) {
      return undefined;
    }

    const actions = new Map<string, () => void>();
    collectHeaderButtonActions(nativeScriptHeaderLeftBarButtonItems, actions);
    collectHeaderButtonActions(nativeScriptHeaderRightBarButtonItems, actions);
    return actions;
  }, [
    hasNativeScriptHeaderBarButtonItems,
    nativeScriptHeaderLeftBarButtonItems,
    nativeScriptHeaderRightBarButtonItems,
  ]);
  const nativeScriptHeaderMenuActionMap = React.useMemo(() => {
    if (!hasNativeScriptHeaderBarButtonItems) {
      return undefined;
    }

    const actions = new Map<string, () => void>();
    collectHeaderBarMenuActions(nativeScriptHeaderLeftBarButtonItems, actions);
    collectHeaderBarMenuActions(nativeScriptHeaderRightBarButtonItems, actions);
    return actions;
  }, [
    hasNativeScriptHeaderBarButtonItems,
    nativeScriptHeaderLeftBarButtonItems,
    nativeScriptHeaderRightBarButtonItems,
  ]);
  const onNativeScriptHeaderButtonPress = React.useCallback(
    (event: HeaderButtonPressEvent) => {
      nativeScriptHeaderButtonActionMap?.get(event.nativeEvent.buttonId)?.();
    },
    [nativeScriptHeaderButtonActionMap],
  );
  const onNativeScriptHeaderMenuItemPress = React.useCallback(
    (event: HeaderMenuPressEvent) => {
      nativeScriptHeaderMenuActionMap?.get(event.nativeEvent.menuId)?.();
    },
    [nativeScriptHeaderMenuActionMap],
  );

  warnOnce(
    hasEdgeEffects && hasBlurEffect && isIOS26OrHigher,
    '[RNScreens] Using both `blurEffect` and `scrollEdgeEffects` simultaneously may cause overlapping effects.',
  );

  const debugContainerStyle = getPositioningStyle(
    sheetAllowedDetents,
    stackPresentationWithDefault,
  );

  // For iOS, we need to extract background color and apply it to Screen
  // due to the safe area inset or native presentation area below ScreenContentWrapper.
  let internalScreenStyle;
  const shouldExtractScreenBackground =
    Platform.OS === 'ios' &&
    (stackPresentationWithDefault === 'formSheet' ||
      (shouldUseNativeScriptStack && stackPresentationWithDefault !== 'push'));
  const shouldCopyNativeScriptScreenBackground =
    Platform.OS === 'ios' &&
    shouldUseNativeScriptStack &&
    stackPresentationWithDefault !== 'push';

  if (shouldExtractScreenBackground && contentStyle) {
    const { screenStyles, contentWrapperStyles } =
      extractScreenStyles(contentStyle);
    internalScreenStyle = screenStyles;
    if (!shouldCopyNativeScriptScreenBackground) {
      contentStyle = contentWrapperStyles;
    }
  }

  const shouldUseSafeAreaView = isIOS26OrHigher;

  const content = (
    <>
      <TopInsetApplicationContext.Provider value={nextContextValue}>
        <DebugContainer
          contentStyle={contentStyle}
          style={debugContainerStyle}
          stackPresentation={stackPresentationWithDefault}>
          {shouldUseSafeAreaView ? (
            <SafeAreaView
              edges={getSafeAreaEdges(headerConfig, isHeaderInModal)}>
              {children}
            </SafeAreaView>
          ) : (
            children
          )}
        </DebugContainer>
      </TopInsetApplicationContext.Provider>
      {/**
       * `HeaderConfig` needs to be the direct child of `Screen` without any intermediate `View`
       * We don't render it conditionally based on visibility to make it possible to dynamically render a custom `header`
       * Otherwise dynamically rendering a custom `header` leaves the native header visible
       *
       * https://github.com/software-mansion/react-native-screens/blob/main/guides/GUIDE_FOR_LIBRARY_AUTHORS.md#screenstackheaderconfig
       *
       * HeaderConfig must not be first child of a Screen.
       * See https://github.com/software-mansion/react-native-screens/pull/1825
       * for detailed explanation.
       */}
      <ScreenStackHeaderConfig {...headerConfig} />
      {/* eslint-disable-next-line camelcase */}
      {stackPresentationWithDefault === 'formSheet' && unstable_sheetFooter && (
        <FooterComponent>{unstable_sheetFooter()}</FooterComponent>
      )}
    </>
  );

  const nativeScriptHeaderSubviewCount =
    Platform.OS === 'ios'
      ? countNativeScriptHeaderSubviewChildren(nativeScriptHeaderConfig?.children)
      : 0;

  if (shouldUseNativeScriptStack) {
    if (isHeaderInModal) {
      // NATIVESCRIPT_PORT_DEVIATION: upstream's inner modal Screen does not need
      // an explicit JS screenId because the native RNSScreen instance owns its
      // identity. The NativeScript host registry needs a stable key for every
      // TS-created controller, so derive one from the outer route while keeping
      // the outer-presented-screen plus inner-stack UIKit shape intact.
      const modalHeaderScreenId = `${screenId}:modal-header`;

      return (
        <NativeScriptScreenStackItem
          ref={setCurrentScreenRef}
          activityState={activityState}
          headerConfig={undefined}
          onHeaderHeightChange={undefined}
          nativeScriptScreenBackgroundColor={internalScreenStyle?.backgroundColor}
          screenId={screenId}
          scrollEdgeEffects={undefined}
          shouldFreeze={shouldFreeze}
          sheetAllowedDetents={sheetAllowedDetents}
          stackPresentation={stackPresentationWithDefault}
          style={[style, internalScreenStyle]}
          {...rest}>
          <NativeScriptScreenStack
            modalContentParentScreenId={screenId}
            style={styles.container}>
            <NativeScriptScreenStackItem
              activityState={activityState}
              headerConfig={nativeScriptHeaderConfig}
              onNativeScriptHeaderButtonPress={
                hasNativeScriptHeaderBarButtonItems
                  ? onNativeScriptHeaderButtonPress
                  : undefined
              }
              onNativeScriptHeaderMenuItemPress={
                hasNativeScriptHeaderBarButtonItems
                  ? onNativeScriptHeaderMenuItemPress
                  : undefined
              }
              onHeaderHeightChange={onHeaderHeightChange}
              nativeScriptHeaderSubviewCount={nativeScriptHeaderSubviewCount}
              nativeScriptScreenBackgroundColor={
                internalScreenStyle?.backgroundColor
              }
              screenId={modalHeaderScreenId}
              scrollEdgeEffects={scrollEdgeEffects}
              shouldFreeze={shouldFreeze}
              stackPresentation="push"
              style={[StyleSheet.absoluteFill, internalScreenStyle]}>
              {content}
            </NativeScriptScreenStackItem>
          </NativeScriptScreenStack>
        </NativeScriptScreenStackItem>
      );
    }

    return (
      <NativeScriptScreenStackItem
        ref={setCurrentScreenRef}
        activityState={activityState}
        contentStyle={contentStyle}
        headerConfig={nativeScriptHeaderConfig}
        onNativeScriptHeaderButtonPress={
          hasNativeScriptHeaderBarButtonItems
            ? onNativeScriptHeaderButtonPress
            : undefined
        }
        onNativeScriptHeaderMenuItemPress={
          hasNativeScriptHeaderBarButtonItems
            ? onNativeScriptHeaderMenuItemPress
            : undefined
        }
        scrollEdgeEffects={isHeaderInModal ? undefined : scrollEdgeEffects}
        onHeaderHeightChange={
          isHeaderInModal ? undefined : onHeaderHeightChange
        }
        nativeScriptHeaderSubviewCount={nativeScriptHeaderSubviewCount}
        nativeScriptScreenBackgroundColor={internalScreenStyle?.backgroundColor}
        screenId={screenId}
        shouldFreeze={shouldFreeze}
        sheetAllowedDetents={sheetAllowedDetents}
        stackPresentation={stackPresentationWithDefault}
        style={[style, internalScreenStyle]}
        {...rest}>
        {content}
      </NativeScriptScreenStackItem>
    );
  }

  return (
    <Screen
      ref={setCurrentScreenRef}
      enabled
      isNativeStack
      activityState={activityState}
      shouldFreeze={shouldFreeze}
      screenId={screenId}
      stackPresentation={stackPresentationWithDefault}
      hasLargeHeader={headerConfig?.largeTitle ?? false}
      sheetAllowedDetents={sheetAllowedDetents}
      style={[style, internalScreenStyle]}
      scrollEdgeEffects={isHeaderInModal ? undefined : scrollEdgeEffects}
      onHeaderHeightChange={isHeaderInModal ? undefined : onHeaderHeightChange}
      {...rest}>
      {isHeaderInModal ? (
        <ScreenStack style={styles.container}>
          <Screen
            enabled
            isNativeStack
            activityState={activityState}
            shouldFreeze={shouldFreeze}
            hasLargeHeader={headerConfig?.largeTitle ?? false}
            scrollEdgeEffects={scrollEdgeEffects}
            style={StyleSheet.absoluteFill}
            onHeaderHeightChange={onHeaderHeightChange}>
            {content}
          </Screen>
        </ScreenStack>
      ) : (
        content
      )}
    </Screen>
  );
}

export default React.forwardRef(ScreenStackItem);

function getPositioningStyle(
  allowedDetents: ScreenProps['sheetAllowedDetents'],
  presentation: StackPresentationTypes,
) {
  const isIOS = Platform.OS === 'ios';

  if (presentation !== 'formSheet') {
    return styles.container;
  }

  if (isIOS) {
    if (
      allowedDetents !== 'fitToContents' &&
      featureFlags.experiment.synchronousScreenUpdatesEnabled
    ) {
      return styles.container;
    } else {
      return styles.absoluteWithNoBottom;
    }
  }

  /**
   * Note: `bottom: 0` is intentionally excluded from these styles for two reasons:
   *
   * 1. Omitting the bottom constraint ensures the Yoga layout engine does not dynamically
   * recalculate the Screen and content size during animations.
   *
   * 2. Including `bottom: 0` with 'position: absolute' would force
   * the component to anchor itself to an ancestor's bottom edge. This creates
   * a dependency on the ancestor's size, whereas 'fitToContents' requires the
   * FormSheet's dimensions to be derived strictly from its children.
   *
   * It was tested reliably only on Android.
   */
  if (allowedDetents === 'fitToContents') {
    return styles.absoluteWithNoBottom;
  }

  return styles.container;
}

type SplitStyleResult = {
  screenStyles: {
    backgroundColor?: ViewStyle['backgroundColor'] | undefined;
  };
  contentWrapperStyles: StyleProp<ViewStyle>;
};

// TODO: figure out whether other styles, like borders, filters, etc.
// shouldn't be applied on the Screen level on iOS due to the inset.
function extractScreenStyles(style: StyleProp<ViewStyle>): SplitStyleResult {
  const flatStyle = StyleSheet.flatten(style);

  const { backgroundColor, ...contentWrapperStyles } = flatStyle as ViewStyle;

  const screenStyles = {
    backgroundColor,
  };

  return {
    screenStyles,
    contentWrapperStyles,
  };
}

function getSafeAreaEdges(
  headerConfig?: ScreenStackHeaderConfigProps,
  isHeaderInModal = false,
): SafeAreaViewProps['edges'] {
  if (Platform.OS !== 'ios' || parseInt(Platform.Version, 10) < 26) {
    return {};
  }

  if (isHeaderInModal) {
    return {};
  }

  let defaultEdges: SafeAreaViewProps['edges'];
  if (headerConfig?.translucent || headerConfig?.hidden) {
    defaultEdges = {};
  } else {
    defaultEdges = {
      top: true,
    };
  }

  return defaultEdges;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  absoluteWithNoBottom: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
  },
});
