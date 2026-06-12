'use client';

import React from 'react';
import * as NativeScriptRuntime from '@nativescript/react-native';
import {
  HeaderBarButtonItemMenuAction,
  HeaderBarButtonItemWithMenu,
  ScreenStackHeaderConfigProps,
  ScreenStackHeaderSubviewProps,
} from '../types';
import {
  Image,
  ImageProps,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import featureFlags from '../flags';

// Native components
import ScreenStackHeaderConfigNativeComponent from '../fabric/ScreenStackHeaderConfigNativeComponent';
import ScreenStackHeaderSubviewNativeComponent, {
  type HeaderSubviewTypes as NativeHeaderSubviewTypes,
  type NativeProps as ScreenStackHeaderSubviewNativeProps,
} from '../fabric/ScreenStackHeaderSubviewNativeComponent';
import { prepareHeaderBarButtonItems } from './helpers/prepareHeaderBarButtonItems';
import { isHeaderBarButtonsAvailableForCurrentPlatform } from '../utils';
import { useTopInsetApplication } from './contexts/TopInsetApplicationContext';
import {
  NativeScriptScreenHeaderSearchBarContext,
  NativeScriptScreenHeaderSubviewContext,
  notifyNativeScriptHeaderSubviewChanged,
  registerNativeScriptHeaderSubview,
  type NativeScriptHeaderSubviewRegistration,
  type NativeScriptHeaderSubviewType,
  unregisterNativeScriptHeaderSubview,
} from './native-stack/native-script/NativeScriptScreenStack';

type NativeScriptHeaderSubviewProps = ScreenStackHeaderSubviewNativeProps & {
  nativeScriptBackImageIsTemplate?: boolean | undefined;
  nativeScriptBackImageSource?: unknown;
  nativeScriptHeaderSubviewOrder?: number | undefined;
};

type NativeScriptHeaderSubviewOrderProp = {
  nativeScriptHeaderSubviewOrder?: number | undefined;
};

type NativeScriptHeaderSubviewHostProps = NativeScriptHeaderSubviewProps & {
  screenId: string;
  subviewId: string;
};

type NativeScriptHeaderSubviewHostView = {
  childrenView: any;
  rootView: any;
};

function nativeValue(name: string) {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const api = globalObject.__nativeScriptNativeApi;

  return api?.[name] ?? globalObject[name];
}

function flexibleSizeMask() {
  'worklet';
  const autoresizing = nativeValue('UIViewAutoresizing');

  return (
    (autoresizing?.FlexibleWidth ?? autoresizing?.flexibleWidth ?? 2) |
    (autoresizing?.FlexibleHeight ?? autoresizing?.flexibleHeight ?? 16)
  );
}

function layoutNativeScriptHeaderSubviewHost(
  view: NativeScriptHeaderSubviewHostView,
) {
  'worklet';
  const rootView = view.rootView;
  const childrenView = view.childrenView;

  if (!rootView || !childrenView) {
    return;
  }

  rootView.userInteractionEnabled = true;
  rootView.clipsToBounds = false;
  childrenView.userInteractionEnabled = true;
  childrenView.clipsToBounds = false;
  childrenView.frame = rootView.bounds;
  childrenView.autoresizingMask = flexibleSizeMask();
  NativeScriptRuntime.refreshUIKitHostView(rootView);
}

function headerSubviewRegistration(
  props: Readonly<NativeScriptHeaderSubviewHostProps>,
): NativeScriptHeaderSubviewRegistration {
  'worklet';

  const registration: NativeScriptHeaderSubviewRegistration = {
    order: props.nativeScriptHeaderSubviewOrder ?? 0,
    screenId: props.screenId,
    subviewId: props.subviewId,
    type: (props.type ?? 'left') as NativeScriptHeaderSubviewType,
  };

  if (props.hidesSharedBackground !== undefined) {
    registration.hidesSharedBackground = props.hidesSharedBackground;
  }

  if (props.nativeScriptBackImageSource !== undefined) {
    registration.backImageSource = props.nativeScriptBackImageSource;
    registration.backImageIsTemplate =
      props.nativeScriptBackImageIsTemplate === true;
  }

  return registration;
}

function syncNativeScriptHeaderSubview(
  view: NativeScriptHeaderSubviewHostView,
  props: Readonly<NativeScriptHeaderSubviewHostProps>,
) {
  'worklet';
  layoutNativeScriptHeaderSubviewHost(view);
  registerNativeScriptHeaderSubview(
    headerSubviewRegistration(props),
    view.rootView,
  );
  notifyNativeScriptHeaderSubviewChanged(props.screenId);
}

const NativeScriptHeaderSubviewHost = NativeScriptRuntime.defineUIKitContainer<
  NativeScriptHeaderSubviewHostProps,
  any,
  any
>({
  debugName: 'RNSScreenStackHeaderSubview.NativeScript',
  layout: { sizing: 'fill' },
  create() {
    'worklet';
    // NATIVESCRIPT_PORT_DEVIATION: upstream RNSScreenStackHeaderConfig owns
    // RNSScreenStackHeaderSubview native component views in `_reactSubviews`.
    // The TS port has no native component-view owner, so each header subview is
    // a NativeScript UIKit host registered by screen id and consumed by the
    // stack's UINavigationItem configuration pass.
    const UIView = nativeValue('UIView');
    const UIColor = nativeValue('UIColor');

    if (!UIView || typeof UIView.alloc !== 'function') {
      throw new Error('UIView is not available in the UI runtime');
    }

    const rootView = UIView.alloc().init();
    const childrenView = UIView.alloc().init();

    rootView.backgroundColor = UIColor?.clearColor ?? null;
    rootView.userInteractionEnabled = true;
    rootView.clipsToBounds = false;
    childrenView.backgroundColor = UIColor?.clearColor ?? null;
    childrenView.userInteractionEnabled = true;
    childrenView.clipsToBounds = false;
    rootView.addSubview(childrenView);

    return { childrenView, rootView };
  },
  update(view, props) {
    'worklet';
    syncNativeScriptHeaderSubview(view, props);
  },
  mounted(view, props) {
    'worklet';
    syncNativeScriptHeaderSubview(view, props);
  },
  dispose(_view, props) {
    'worklet';
    unregisterNativeScriptHeaderSubview(props.screenId, props.subviewId);
    notifyNativeScriptHeaderSubviewChanged(props.screenId);
  },
});

function withNativeScriptHeaderSubviewOrder(
  children: React.ReactNode,
  nextOrder: { current: number },
): React.ReactNode {
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) {
      return child;
    }

    if (child.type === React.Fragment) {
      return withNativeScriptHeaderSubviewOrder(
        (child.props as { children?: React.ReactNode }).children,
        nextOrder,
      );
    }

    const order = nextOrder.current;
    nextOrder.current += 1;

    return React.cloneElement(
      child as React.ReactElement<NativeScriptHeaderSubviewOrderProp>,
      {
        nativeScriptHeaderSubviewOrder: order,
      },
    );
  });
}

export const ScreenStackHeaderSubview: React.ComponentType<NativeScriptHeaderSubviewProps> =
  Platform.OS === 'ios'
    ? React.forwardRef<View, NativeScriptHeaderSubviewProps>(
        function NativeScriptScreenStackHeaderSubview(
          {
            nativeScriptHeaderSubviewOrder,
            synchronousShadowStateUpdatesEnabled:
              _synchronousShadowStateUpdatesEnabled,
            type,
            ...props
          },
          ref,
        ) {
          const headerSubviewContext = React.useContext(
            NativeScriptScreenHeaderSubviewContext,
          );
          const subviewId = React.useId();
          const screenId = headerSubviewContext?.screenId;
          const resolvedType: NativeHeaderSubviewTypes = type ?? 'left';
          const notifyReady = React.useCallback(() => {
            if (!screenId) {
              return;
            }

            NativeScriptRuntime.runOnUI((targetScreenId: string) => {
              'worklet';
              notifyNativeScriptHeaderSubviewChanged(targetScreenId);
            }, screenId).catch(() => undefined);
          }, [screenId]);

          if (!screenId) {
            return <View ref={ref} collapsable={false} {...props} />;
          }

          return (
            <NativeScriptHeaderSubviewHost
              {...props}
              ref={ref as any}
              attachController={false}
              attachNativeView
              nativeScriptHeaderSubviewOrder={nativeScriptHeaderSubviewOrder}
              onHostReady={notifyReady}
              screenId={screenId}
              subviewId={subviewId}
              type={resolvedType}
            />
          );
        },
      )
    : ScreenStackHeaderSubviewNativeComponent;

export const ScreenStackHeaderConfig = React.forwardRef<
  View,
  ScreenStackHeaderConfigProps
>((props, ref) => {
  const { appliesTopInset, useLegacyBehavior } = useTopInsetApplication(
    !props.hidden,
    props.disableTopInsetApplication ?? false,
  );

  const { headerLeftBarButtonItems, headerRightBarButtonItems } = props;

  const preparedHeaderLeftBarButtonItems =
    headerLeftBarButtonItems && isHeaderBarButtonsAvailableForCurrentPlatform
      ? prepareHeaderBarButtonItems(headerLeftBarButtonItems, 'left')
      : undefined;
  const preparedHeaderRightBarButtonItems =
    headerRightBarButtonItems && isHeaderBarButtonsAvailableForCurrentPlatform
      ? prepareHeaderBarButtonItems(headerRightBarButtonItems, 'right')
      : undefined;
  const hasHeaderBarButtonItems =
    isHeaderBarButtonsAvailableForCurrentPlatform &&
    (preparedHeaderLeftBarButtonItems?.length ||
      preparedHeaderRightBarButtonItems?.length);

  // Handle bar button item presses
  const onPressHeaderBarButtonItem = hasHeaderBarButtonItems
    ? (event: NativeSyntheticEvent<{ buttonId: string }>) => {
        const pressedItem = [
          ...(preparedHeaderLeftBarButtonItems ?? []),
          ...(preparedHeaderRightBarButtonItems ?? []),
        ].find(
          item =>
            item &&
            'buttonId' in item &&
            item.buttonId === event.nativeEvent.buttonId,
        );
        if (
          pressedItem &&
          pressedItem.type === 'button' &&
          pressedItem.onPress
        ) {
          pressedItem.onPress();
        }
      }
    : undefined;

  // Handle bar button menu item presses by deep-searching nested menus
  const onPressHeaderBarButtonMenuItem = hasHeaderBarButtonItems
    ? (event: NativeSyntheticEvent<{ menuId: string }>) => {
        // Recursively search menu tree
        const findInMenu = (
          menu: HeaderBarButtonItemWithMenu['menu'],
          menuId: string,
        ): HeaderBarButtonItemMenuAction | undefined => {
          for (const item of menu.items) {
            if ('items' in item) {
              // submenu: recurse
              const found = findInMenu(item, menuId);
              if (found) {
                return found;
              }
            } else if ('menuId' in item && item.menuId === menuId) {
              return item;
            }
          }
          return undefined;
        };

        // Check each bar-button item with a menu
        const allItems = [
          ...(preparedHeaderLeftBarButtonItems ?? []),
          ...(preparedHeaderRightBarButtonItems ?? []),
        ];
        for (const item of allItems) {
          if (item && item.type === 'menu' && item.menu) {
            const action = findInMenu(item.menu, event.nativeEvent.menuId);
            if (action) {
              action.onPress();
              return;
            }
          }
        }
      }
    : undefined;

  if (Platform.OS === 'ios') {
    const nativeScriptChildren = withNativeScriptHeaderSubviewOrder(
      props.children,
      { current: 0 },
    );

    return (
      <View
        ref={ref}
        style={styles.headerConfig}
        pointerEvents="box-none"
        collapsable={false}>
        {nativeScriptChildren}
      </View>
    );
  }

  return (
    <ScreenStackHeaderConfigNativeComponent
      {...props}
      userInterfaceStyle={props.experimental_userInterfaceStyle}
      headerLeftBarButtonItems={preparedHeaderLeftBarButtonItems}
      headerRightBarButtonItems={preparedHeaderRightBarButtonItems}
      onPressHeaderBarButtonItem={onPressHeaderBarButtonItem}
      onPressHeaderBarButtonMenuItem={onPressHeaderBarButtonMenuItem}
      ref={ref}
      style={styles.headerConfig}
      pointerEvents="box-none"
      synchronousShadowStateUpdatesEnabled={
        featureFlags.experiment.synchronousHeaderConfigUpdatesEnabled
      }
      consumeTopInset={appliesTopInset}
      legacyTopInsetBehavior={useLegacyBehavior}
    />
  );
});

ScreenStackHeaderConfig.displayName = 'ScreenStackHeaderConfig';

export const ScreenStackHeaderBackButtonImage = (
  props: ImageProps & NativeScriptHeaderSubviewOrderProp,
): React.JSX.Element => {
  const { nativeScriptHeaderSubviewOrder, ...imageProps } = props;
  const backImageSource =
    Platform.OS === 'ios' && imageProps.source != null
      ? Image.resolveAssetSource(imageProps.source)
      : undefined;

  return (
    <ScreenStackHeaderSubview
      nativeScriptBackImageSource={backImageSource}
      nativeScriptHeaderSubviewOrder={nativeScriptHeaderSubviewOrder}
      type="back"
      style={styles.headerSubview}
      synchronousShadowStateUpdatesEnabled={
        featureFlags.experiment.synchronousHeaderSubviewUpdatesEnabled
      }>
      <Image resizeMode="center" fadeDuration={0} {...imageProps} />
    </ScreenStackHeaderSubview>
  );
};

export const ScreenStackHeaderRightView = (
  props: ScreenStackHeaderSubviewProps &
    ViewProps &
    NativeScriptHeaderSubviewOrderProp,
): React.JSX.Element => {
  const { style, ...rest } = props;

  return (
    <ScreenStackHeaderSubview
      {...rest}
      type="right"
      synchronousShadowStateUpdatesEnabled={
        featureFlags.experiment.synchronousHeaderSubviewUpdatesEnabled
      }
      style={[styles.headerSubview, style]}
    />
  );
};

export const ScreenStackHeaderLeftView = (
  props: ScreenStackHeaderSubviewProps &
    ViewProps &
    NativeScriptHeaderSubviewOrderProp,
): React.JSX.Element => {
  const { style, ...rest } = props;

  return (
    <ScreenStackHeaderSubview
      {...rest}
      type="left"
      synchronousShadowStateUpdatesEnabled={
        featureFlags.experiment.synchronousHeaderSubviewUpdatesEnabled
      }
      style={[styles.headerSubview, style]}
    />
  );
};

export const ScreenStackHeaderCenterView = (
  props: ViewProps & NativeScriptHeaderSubviewOrderProp,
): React.JSX.Element => {
  const { style, ...rest } = props;

  return (
    <ScreenStackHeaderSubview
      {...rest}
      type="center"
      synchronousShadowStateUpdatesEnabled={
        featureFlags.experiment.synchronousHeaderSubviewUpdatesEnabled
      }
      style={[styles.headerSubviewCenter, style]}
    />
  );
};

export const ScreenStackHeaderSearchBarView = (
  props: ViewProps & NativeScriptHeaderSubviewOrderProp,
): React.JSX.Element => {
  const { nativeScriptHeaderSubviewOrder, style, ...rest } = props;

  if (Platform.OS === 'ios') {
    return (
      <NativeScriptScreenHeaderSearchBarContext.Provider
        value={{ order: nativeScriptHeaderSubviewOrder ?? 0 }}>
        <View
          {...rest}
          collapsable={false}
          pointerEvents="box-none"
          style={[styles.headerSubview, style]}
        />
      </NativeScriptScreenHeaderSearchBarContext.Provider>
    );
  }

  return (
    <ScreenStackHeaderSubview
      {...rest}
      nativeScriptHeaderSubviewOrder={nativeScriptHeaderSubviewOrder}
      type="searchBar"
      synchronousShadowStateUpdatesEnabled={
        featureFlags.experiment.synchronousHeaderSubviewUpdatesEnabled
      }
      style={[styles.headerSubview, style]}
    />
  );
};

const styles = StyleSheet.create({
  headerSubview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubviewCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
  },
  headerConfig: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // We only want to center align the subviews on iOS.
    // See https://github.com/software-mansion/react-native-screens/pull/2456
    alignItems: Platform.OS === 'ios' ? 'center' : undefined,
  },
});
