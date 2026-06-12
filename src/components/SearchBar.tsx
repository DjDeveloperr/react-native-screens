'use client';

import React from 'react';
import * as NativeScriptRuntime from '@nativescript/react-native';
import { SearchBarCommands, SearchBarProps } from '../types';
import {
  parseBooleanToOptionalBooleanNativeProp,
  isSearchBarAvailableForCurrentPlatform,
} from '../utils';
import { Platform, processColor, View } from 'react-native';
import {
  NativeScriptScreenHeaderSearchBarContext,
  NativeScriptScreenHeaderSubviewContext,
  notifyNativeScriptHeaderSubviewChanged,
  registerNativeScriptHeaderSubview,
  unregisterNativeScriptHeaderSubview,
} from './native-stack/native-script/NativeScriptScreenStack';

// Native components
import SearchBarNativeComponent, {
  Commands as SearchBarNativeCommands,
  NativeProps as SearchBarNativeProps,
  SearchBarEvent,
  SearchButtonPressedEvent,
  ChangeTextEvent,
} from '../fabric/SearchBarNativeComponent';
import type { CodegenTypes as CT } from 'react-native';

const NativeSearchBar: React.ComponentType<
  SearchBarNativeProps & {
    ref?: React.RefObject<SearchBarCommands | null> | undefined;
  }
> &
  typeof NativeSearchBarCommands =
  SearchBarNativeComponent as unknown as React.ComponentType<SearchBarNativeProps> &
    SearchBarCommandsType;
const NativeSearchBarCommands: SearchBarCommandsType =
  SearchBarNativeCommands as SearchBarCommandsType;

type NativeSearchBarRef = React.ComponentRef<typeof NativeSearchBar>;

type SearchBarCommandsType = {
  blur: (viewRef: NativeSearchBarRef) => void;
  focus: (viewRef: NativeSearchBarRef) => void;
  clearText: (viewRef: NativeSearchBarRef) => void;
  toggleCancelButton: (viewRef: NativeSearchBarRef, flag: boolean) => void;
  setText: (viewRef: NativeSearchBarRef, text: string) => void;
  cancelSearch: (viewRef: NativeSearchBarRef) => void;
};

type NativeScriptSearchBarProps = SearchBarNativeProps & {
  nativeScriptHeaderSubviewOrder?: number | undefined;
  screenId?: string | undefined;
  subviewId?: string | undefined;
};

type NativeScriptSearchBarView = {
  allowToolbarIntegration: boolean;
  childrenView: any;
  hideWhenScrolling: boolean;
  isHideNavigationBarSet: boolean;
  isObscureBackgroundSet: boolean;
  lastHideNavigationBar: boolean | undefined;
  lastObscureBackground: boolean | undefined;
  placement: NativeScriptSearchBarProps['placement'];
  rootView: any;
  searchController: any;
  textColor: any;
};

function nativeValue(name: string) {
  'worklet';
  const globalObject = globalThis as Record<string, any>;
  const api = globalObject.__nativeScriptNativeApi;

  return api?.[name] ?? globalObject[name];
}

function nativeColor(value: unknown) {
  'worklet';
  const UIColor = nativeValue('UIColor');

  if (!UIColor || value == null) {
    return null;
  }

  if (typeof value === 'number') {
    const integer = value >>> 0;
    const alpha = ((integer >> 24) & 255) / 255;
    const red = ((integer >> 16) & 255) / 255;
    const green = ((integer >> 8) & 255) / 255;
    const blue = (integer & 255) / 255;

    if (typeof UIColor.colorWithRedGreenBlueAlpha === 'function') {
      return UIColor.colorWithRedGreenBlueAlpha(red, green, blue, alpha);
    }
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

      if (
        !Number.isNaN(integer) &&
        typeof UIColor.colorWithRedGreenBlueAlpha === 'function'
      ) {
        const red = ((integer >> (hasAlpha ? 24 : 16)) & 255) / 255;
        const green = ((integer >> (hasAlpha ? 16 : 8)) & 255) / 255;
        const blue = ((integer >> (hasAlpha ? 8 : 0)) & 255) / 255;
        const alpha = hasAlpha ? (integer & 255) / 255 : 1;

        return UIColor.colorWithRedGreenBlueAlpha(red, green, blue, alpha);
      }
    }
  }

  return null;
}

function textAutocapitalizationType(value: unknown) {
  'worklet';
  const type = nativeValue('UITextAutocapitalizationType');

  switch (value) {
    case 'none':
      return type?.None ?? type?.none ?? 0;
    case 'words':
      return type?.Words ?? type?.words ?? 1;
    case 'characters':
      return type?.AllCharacters ?? type?.allCharacters ?? 3;
    case 'sentences':
    case 'systemDefault':
    default:
      return type?.Sentences ?? type?.sentences ?? 2;
  }
}

function optionalBoolean(value: unknown) {
  'worklet';

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return undefined;
}

function searchBarText(searchBar: any) {
  'worklet';
  const text = searchBar?.text;

  if (typeof text === 'function') {
    return String(text() ?? '');
  }

  return String(text ?? '');
}

function controllerAutomaticallyShowsCancelButton(controller: any) {
  'worklet';
  const value = controller?.automaticallyShowsCancelButton;

  if (typeof value === 'function') {
    return value() === true;
  }

  return value === true;
}

function setSearchBarText(searchBar: any, text: string) {
  'worklet';

  if (typeof searchBar?.setText === 'function') {
    searchBar.setText(text);
  } else if (searchBar) {
    searchBar.text = text;
  }
}

function setSearchBarCancelButton(
  view: NativeScriptSearchBarView,
  flag: boolean,
) {
  'worklet';
  const searchBar = view.searchController?.searchBar;

  if (
    !controllerAutomaticallyShowsCancelButton(view.searchController) &&
    typeof searchBar?.setShowsCancelButton === 'function'
  ) {
    searchBar.setShowsCancelButton(flag, true);
  }
}

function toggleNativeScriptSearchBarCancelButton(
  view: NativeScriptSearchBarView,
  flag: boolean,
) {
  'worklet';
  const searchBar = view.searchController?.searchBar;

  if (typeof searchBar?.setShowsCancelButton === 'function') {
    searchBar.setShowsCancelButton(flag, true);
  }
}

function emitSearchBarEvent(ctx: any, eventName: string) {
  'worklet';
  ctx?.emit?.(eventName, { nativeEvent: {} });
}

function emitSearchBarTextEvent(ctx: any, eventName: string, text: string) {
  'worklet';
  ctx?.emit?.(eventName, { nativeEvent: { text } });
}

function applyNativeScriptSearchBarProps(
  view: NativeScriptSearchBarView,
  props: Readonly<NativeScriptSearchBarProps>,
) {
  'worklet';
  const controller = view.searchController;
  const searchBar = controller?.searchBar;

  if (!controller || !searchBar) {
    return;
  }

  const obscureBackground = optionalBoolean(props.obscureBackground);
  const previousObscureBackground = view.lastObscureBackground;
  if (obscureBackground !== undefined) {
    controller.obscuresBackgroundDuringPresentation = obscureBackground;
    view.isObscureBackgroundSet = true;
  } else if (previousObscureBackground !== undefined) {
    console.warn(
      '[RNScreens] Dynamically restoring obscureBackground to default native behavior is unsupported.',
    );
  }
  view.lastObscureBackground = obscureBackground;

  const hideNavigationBar = optionalBoolean(props.hideNavigationBar);
  const previousHideNavigationBar = view.lastHideNavigationBar;
  if (hideNavigationBar !== undefined) {
    controller.hidesNavigationBarDuringPresentation = hideNavigationBar;
    view.isHideNavigationBarSet = true;
  } else if (previousHideNavigationBar !== undefined) {
    console.warn(
      '[RNScreens] Dynamically restoring hideNavigationBar to default native behavior is unsupported.',
    );
  }
  view.lastHideNavigationBar = hideNavigationBar;

  view.hideWhenScrolling = props.hideWhenScrolling !== false;
  view.placement = props.placement ?? 'automatic';
  view.allowToolbarIntegration = props.allowToolbarIntegration !== false;

  if (typeof searchBar.setAutocapitalizationType === 'function') {
    searchBar.setAutocapitalizationType(
      textAutocapitalizationType(props.autoCapitalize),
    );
  } else {
    searchBar.autocapitalizationType = textAutocapitalizationType(
      props.autoCapitalize,
    );
  }

  if (typeof searchBar.setPlaceholder === 'function') {
    searchBar.setPlaceholder(props.placeholder ?? null);
  } else {
    searchBar.placeholder = props.placeholder ?? null;
  }

  const barTintColor = nativeColor(props.barTintColor);
  if (barTintColor && searchBar.searchTextField) {
    searchBar.searchTextField.backgroundColor = barTintColor;
  }

  const tintColor = nativeColor(props.tintColor);
  if (tintColor) {
    if (typeof searchBar.setTintColor === 'function') {
      searchBar.setTintColor(tintColor);
    } else {
      searchBar.tintColor = tintColor;
    }
  }

  const textColor = nativeColor(props.textColor);
  view.textColor = textColor;
  if (textColor && searchBar.searchTextField) {
    searchBar.searchTextField.textColor = textColor;
  }

  if (
    props.cancelButtonText !== undefined &&
    typeof searchBar.setValueForKey === 'function'
  ) {
    searchBar.setValueForKey(props.cancelButtonText, 'cancelButtonText');
  }

  if (props.screenId && props.subviewId) {
    registerNativeScriptHeaderSubview(
      {
        allowToolbarIntegration: view.allowToolbarIntegration,
        hideWhenScrolling: view.hideWhenScrolling,
        order: props.nativeScriptHeaderSubviewOrder ?? 0,
        placement: view.placement,
        screenId: props.screenId,
        searchController: view.searchController,
        subviewId: props.subviewId,
        type: 'searchBar',
      },
      view.rootView,
    );
    notifyNativeScriptHeaderSubviewChanged(props.screenId);
  }
}

function cancelNativeScriptSearchBar(
  view: NativeScriptSearchBarView,
  ctx: any,
) {
  'worklet';
  const searchBar = view.searchController?.searchBar;

  setSearchBarText(searchBar, '');
  searchBar?.resignFirstResponder?.();
  setSearchBarCancelButton(view, false);
  emitSearchBarEvent(ctx, 'onCancelButtonPress');
  emitSearchBarTextEvent(ctx, 'onChangeText', '');
}

function blurNativeScriptSearchBar(view: NativeScriptSearchBarView) {
  'worklet';
  view.searchController?.searchBar?.resignFirstResponder?.();
}

function focusNativeScriptSearchBar(view: NativeScriptSearchBarView) {
  'worklet';
  view.searchController?.searchBar?.becomeFirstResponder?.();
}

function clearNativeScriptSearchBarText(view: NativeScriptSearchBarView) {
  'worklet';
  setSearchBarText(view.searchController?.searchBar, '');
}

function setNativeScriptSearchBarText(
  view: NativeScriptSearchBarView,
  text: string,
) {
  'worklet';
  setSearchBarText(view.searchController?.searchBar, text);
}

function cancelNativeScriptSearchBarCommand(view: NativeScriptSearchBarView) {
  'worklet';
  cancelNativeScriptSearchBar(view, undefined);
  view.searchController.active = false;
}

const NativeScriptSearchBar =
  NativeScriptRuntime.defineUIKitContainer<NativeScriptSearchBarProps>({
    debugName: 'RNSSearchBar.NativeScript',
    layout: { sizing: 'intrinsic', defaultSize: { width: 0, height: 0 } },
    create(ctx) {
      'worklet';
      // NATIVESCRIPT_PORT_DEVIATION: upstream RNSSearchBar implements
      // `+shouldBeRecycled` as `NO` because recycled search bars disappear on
      // iOS 26+. The TS port has no ObjC component-view class method, so keep
      // UISearchController ownership local to this NativeScript host instance
      // and do not add module-level reuse/caching for search bars.
      const UIView = nativeValue('UIView');
      const UIColor = nativeValue('UIColor');
      const UISearchController = nativeValue('UISearchController');

      if (!UIView || !UISearchController) {
        throw new Error(
          'UISearchController is not available in the UI runtime',
        );
      }

      const rootView = UIView.alloc().init();
      const childrenView = UIView.alloc().init();
      const searchController =
        UISearchController.alloc().initWithSearchResultsController(null);

      rootView.backgroundColor = UIColor?.clearColor ?? null;
      rootView.userInteractionEnabled = false;
      childrenView.backgroundColor = UIColor?.clearColor ?? null;
      childrenView.userInteractionEnabled = false;
      rootView.addSubview?.(childrenView);

      const view = {
        allowToolbarIntegration: true,
        childrenView,
        hideWhenScrolling: true,
        isHideNavigationBarSet: false,
        isObscureBackgroundSet: false,
        lastHideNavigationBar: undefined,
        lastObscureBackground: undefined,
        placement: 'automatic',
        rootView,
        searchController,
        textColor: null,
      } as NativeScriptSearchBarView;

      const delegateProtocol =
        nativeValue('UISearchBarDelegate') ?? 'UISearchBarDelegate';
      (ctx as any).delegate(searchController.searchBar, delegateProtocol, {
        searchBarTextDidBeginEditing(searchBar: any) {
          'worklet';
          if (view.textColor && searchBar?.searchTextField) {
            searchBar.searchTextField.textColor = view.textColor;
          }
          setSearchBarCancelButton(view, true);
          searchBar?.becomeFirstResponder?.();
          emitSearchBarEvent(ctx, 'onSearchFocus');
        },
        searchBarTextDidEndEditing() {
          'worklet';
          emitSearchBarEvent(ctx, 'onSearchBlur');
          setSearchBarCancelButton(view, false);
        },
        searchBarTextDidChange(searchBar: any) {
          'worklet';
          emitSearchBarTextEvent(ctx, 'onChangeText', searchBarText(searchBar));
        },
        searchBarSearchButtonClicked(searchBar: any) {
          'worklet';
          emitSearchBarTextEvent(
            ctx,
            'onSearchButtonPress',
            searchBarText(searchBar),
          );
        },
        searchBarCancelButtonClicked() {
          'worklet';
          cancelNativeScriptSearchBar(view, ctx);
        },
      });

      return view as any;
    },
    update(view, props) {
      'worklet';
      applyNativeScriptSearchBarProps(
        view as unknown as NativeScriptSearchBarView,
        props,
      );
    },
    mounted(view, props) {
      'worklet';
      applyNativeScriptSearchBarProps(
        view as unknown as NativeScriptSearchBarView,
        props,
      );
    },
    dispose(_view, props) {
      'worklet';
      if (props.screenId && props.subviewId) {
        unregisterNativeScriptHeaderSubview(props.screenId, props.subviewId);
        notifyNativeScriptHeaderSubviewChanged(props.screenId);
      }
    },
  });

function SearchBar(
  props: SearchBarProps,
  forwardedRef: React.Ref<SearchBarCommands>,
) {
  const searchBarRef = React.useRef<any>(null);
  const headerSubviewContext = React.useContext(
    NativeScriptScreenHeaderSubviewContext,
  );
  const searchBarContext = React.useContext(
    NativeScriptScreenHeaderSearchBarContext,
  );
  const subviewId = React.useId();

  const _callMethodWithRef = React.useCallback(
    (method: (ref: any) => void) => {
      const ref = searchBarRef.current;
      if (ref) {
        method(ref);
      } else {
        console.warn(
          'Reference to native search bar component has not been updated yet',
        );
      }
    },
    [searchBarRef],
  );

  const _callNativeScriptMethodWithRef = React.useCallback(
    (method: (view: NativeScriptSearchBarView) => void) => {
      const ref = searchBarRef.current;
      if (ref && typeof ref.runOnUI === 'function') {
        ref.runOnUI(method).catch(() => undefined);
      } else {
        console.warn(
          'Reference to native search bar component has not been updated yet',
        );
      }
    },
    [searchBarRef],
  );

  React.useImperativeHandle(forwardedRef, () => ({
    blur: () => {
      if (Platform.OS === 'ios') {
        _callNativeScriptMethodWithRef(view => {
          'worklet';
          blurNativeScriptSearchBar(view);
        });
      } else {
        _callMethodWithRef(ref => NativeSearchBarCommands.blur(ref));
      }
    },
    focus: () => {
      if (Platform.OS === 'ios') {
        _callNativeScriptMethodWithRef(view => {
          'worklet';
          focusNativeScriptSearchBar(view);
        });
      } else {
        _callMethodWithRef(ref => NativeSearchBarCommands.focus(ref));
      }
    },
    toggleCancelButton: (flag: boolean) => {
      if (Platform.OS === 'ios') {
        _callNativeScriptMethodWithRef(view => {
          'worklet';
          toggleNativeScriptSearchBarCancelButton(view, flag);
        });
      } else {
        _callMethodWithRef(ref =>
          NativeSearchBarCommands.toggleCancelButton(ref, flag),
        );
      }
    },
    clearText: () => {
      if (Platform.OS === 'ios') {
        _callNativeScriptMethodWithRef(view => {
          'worklet';
          clearNativeScriptSearchBarText(view);
        });
      } else {
        _callMethodWithRef(ref => NativeSearchBarCommands.clearText(ref));
      }
    },
    setText: (text: string) => {
      if (Platform.OS === 'ios') {
        _callNativeScriptMethodWithRef(view => {
          'worklet';
          setNativeScriptSearchBarText(view, text);
        });
      } else {
        _callMethodWithRef(ref => NativeSearchBarCommands.setText(ref, text));
      }
    },
    cancelSearch: () => {
      if (Platform.OS === 'ios') {
        _callNativeScriptMethodWithRef(view => {
          'worklet';
          cancelNativeScriptSearchBarCommand(view);
        });
      } else {
        _callMethodWithRef(ref => NativeSearchBarCommands.cancelSearch(ref));
      }
    },
  }));

  if (!isSearchBarAvailableForCurrentPlatform) {
    console.warn(
      'Importing SearchBar is only valid on iOS and Android devices.',
    );
    return View as unknown as React.ReactNode;
  }

  const {
    obscureBackground,
    hideNavigationBar,
    onFocus,
    onBlur,
    onSearchButtonPress,
    onCancelButtonPress,
    onChangeText,
    ...rest
  } = props;

  const nativeSearchBarProps = {
    ...rest,
    obscureBackground:
      parseBooleanToOptionalBooleanNativeProp(obscureBackground),
    hideNavigationBar:
      parseBooleanToOptionalBooleanNativeProp(hideNavigationBar),
    onSearchFocus: onFocus as CT.DirectEventHandler<SearchBarEvent>,
    onSearchBlur: onBlur as CT.DirectEventHandler<SearchBarEvent>,
    onSearchButtonPress:
      onSearchButtonPress as CT.DirectEventHandler<SearchButtonPressedEvent>,
    onCancelButtonPress:
      onCancelButtonPress as CT.DirectEventHandler<SearchBarEvent>,
    onChangeText: onChangeText as CT.DirectEventHandler<ChangeTextEvent>,
  };

  if (Platform.OS === 'ios') {
    const nativeScriptSearchBarProps = {
      ...nativeSearchBarProps,
      barTintColor: (processColor(rest.barTintColor) ??
        undefined) as SearchBarNativeProps['barTintColor'],
      textColor: (processColor(rest.textColor) ??
        undefined) as SearchBarNativeProps['textColor'],
      tintColor: (processColor(rest.tintColor) ??
        undefined) as SearchBarNativeProps['tintColor'],
    };

    return (
      <NativeScriptSearchBar
        ref={searchBarRef}
        {...nativeScriptSearchBarProps}
        attachNativeView
        nativeScriptHeaderSubviewOrder={searchBarContext?.order ?? 0}
        screenId={headerSubviewContext?.screenId}
        subviewId={subviewId}
      />
    );
  }

  return <NativeSearchBar ref={searchBarRef} {...nativeSearchBarProps} />;
}

export default React.forwardRef<SearchBarCommands, SearchBarProps>(SearchBar);
