declare module '@nativescript/react-native' {
  import * as React from 'react';
  import type { ViewProps } from 'react-native';

  export type UIKitLayoutOptions = {
    sizing?: 'fill' | 'intrinsic' | 'sizeThatFits' | 'autoLayout';
    defaultSize?: { width?: number; height?: number };
    minSize?: { width?: number; height?: number };
    maxSize?: { width?: number; height?: number };
  };

  export type NativeScriptImageLoadOptions = {
    template?: boolean;
  };

  export type NativeScriptImageLoadCallback = (
    image: unknown | null,
    error: Error | null,
  ) => void;
  export type NativeAssociationPolicy =
    | 'assign'
    | 'retain'
    | 'retainNonatomic'
    | 'strong'
    | 'strongNonatomic'
    | 'copy'
    | 'copyNonatomic'
    | number;

  export type UIKitViewRef<NativeView = unknown> = {
    readonly nativeView: NativeView | null;
    runOnUI<ReturnValue>(
      callback: (view: NativeView) => ReturnValue,
    ): Promise<ReturnValue>;
    measureNative(): Promise<{ width: number; height: number }>;
    invalidateNativeLayout(): void;
  };

  export type UIKitHostReadyEvent = {
    nativeEvent: {
      hostReadyId: string;
      hostId: string;
      componentViewHandle: string;
      nativeViewHandle: string;
      childrenViewHandle: string;
      controllerHandle: string;
      hasChildren: boolean;
      visibleDescendantCount: number;
      windowAttached: boolean;
    };
  };

  export type UIKitHostNativeHandles = {
    nativeViewHandle?: string;
    childrenViewHandle?: string;
    controllerHandle?: string;
  };

  export type UIKitFabricTransaction = {
    readonly children: readonly UIKitFabricMountedChild[];
    readonly hasModifiedChildren: boolean;
    readonly hasModifiedProps: boolean;
  };

  export type UIKitFabricMountedChild = {
    readonly index: number;
    readonly componentView: unknown | null;
    readonly componentViewHandle: string;
    readonly containerView: unknown | null;
    readonly containerViewHandle: string;
    readonly nativeView: unknown | null;
    readonly nativeViewHandle: string;
    readonly childrenView: unknown | null;
    readonly childrenViewHandle: string;
    readonly controller: unknown | null;
    readonly controllerHandle: string;
  };

  export type ReactNativeFabricViewLayoutTraits = {
    isFabricComponentView: boolean;
    hasYogaStyle: boolean;
    hasLayoutMetrics: boolean;
    flex: number | null;
    flexGrow: number | null;
    flexShrink: number | null;
    frameX?: number;
    frameY?: number;
    frameWidth?: number;
    frameHeight?: number;
    layoutMetricsFrameX?: number;
    layoutMetricsFrameY?: number;
    layoutMetricsFrameWidth?: number;
    layoutMetricsFrameHeight?: number;
    layoutMetricsContentFrameX?: number;
    layoutMetricsContentFrameY?: number;
    layoutMetricsContentFrameWidth?: number;
    layoutMetricsContentFrameHeight?: number;
  };

  export type UIViewControllerDefinition<
    Props extends object,
    Controller = unknown,
  > = {
    debugName?: string;
    layout?: UIKitLayoutOptions;
    createController: (props: Readonly<Props>) => Controller;
    hostView?: (controller: Controller) => unknown;
    childrenView?: (controller: Controller) => unknown;
    update?: (
      controller: Controller,
      props: Readonly<Props>,
      previousProps?: Readonly<Props>,
      ctx?: Record<string, unknown>,
    ) => void;
    refresh?: (
      controller: Controller,
      props: Readonly<Props>,
      previousProps?: Readonly<Props>,
      ctx?: Record<string, unknown>,
    ) => void;
    transactionCommitted?: (
      controller: Controller,
      props: Readonly<Props>,
      previousProps?: Readonly<Props>,
      ctx?: Record<string, unknown>,
    ) => void;
    mountingTransactionWillMount?: (
      controller: Controller,
      props: Readonly<Props>,
      previousProps?: Readonly<Props>,
      ctx?: Record<string, unknown>,
    ) => void;
    mountingTransactionDidMount?: (
      controller: Controller,
      props: Readonly<Props>,
      previousProps?: Readonly<Props>,
      ctx?: Record<string, unknown>,
    ) => void;
    mountChild?: (
      controller: Controller,
      child: UIKitFabricMountedChild,
      props: Readonly<Props>,
      previousProps?: Readonly<Props>,
      ctx?: Record<string, unknown>,
    ) => void;
    unmountChild?: (
      controller: Controller,
      child: UIKitFabricMountedChild,
      props: Readonly<Props>,
      previousProps?: Readonly<Props>,
      ctx?: Record<string, unknown>,
    ) => void;
    hostReady?: (
      controller: Controller,
      props: Readonly<Props>,
      event: UIKitHostReadyEvent,
      previousProps?: Readonly<Props>,
      ctx?: Record<string, unknown>,
    ) => void;
    mounted?: (
      controller: Controller,
      props: Readonly<Props>,
      ctx?: Record<string, unknown>,
    ) => void;
    dispose?: (
      controller: Controller,
      props: Readonly<Props>,
      ctx?: Record<string, unknown>,
    ) => void;
  };

  export type UIKitContainerDefinition<
    Props extends object,
    RootView = unknown,
    ChildrenView = unknown,
  > = {
    debugName?: string;
    layout?: UIKitLayoutOptions;
    create: (props: Readonly<Props & ViewProps>) => {
      rootView: RootView;
      childrenView: ChildrenView;
    };
    update?: (
      view: {
        rootView: RootView;
        childrenView: ChildrenView;
      },
      props: Readonly<Props & ViewProps>,
      previousProps?: Readonly<Props & ViewProps>,
      ctx?: Record<string, unknown>,
    ) => void;
    refresh?: (
      view: {
        rootView: RootView;
        childrenView: ChildrenView;
      },
      props: Readonly<Props & ViewProps>,
      previousProps?: Readonly<Props & ViewProps>,
      ctx?: Record<string, unknown>,
    ) => void;
    transactionCommitted?: (
      view: {
        rootView: RootView;
        childrenView: ChildrenView;
      },
      props: Readonly<Props & ViewProps>,
      previousProps?: Readonly<Props & ViewProps>,
      ctx?: Record<string, unknown>,
    ) => void;
    hostReady?: (
      view: {
        rootView: RootView;
        childrenView: ChildrenView;
      },
      props: Readonly<Props & ViewProps>,
      event: UIKitHostReadyEvent,
      previousProps?: Readonly<Props & ViewProps>,
      ctx?: Record<string, unknown>,
    ) => void;
    mounted?: (
      view: {
        rootView: RootView;
        childrenView: ChildrenView;
      },
      props: Readonly<Props & ViewProps>,
      ctx?: Record<string, unknown>,
    ) => void;
    dispose?: (
      view: {
        rootView: RootView;
        childrenView: ChildrenView;
      },
      props: Readonly<Props & ViewProps>,
      ctx?: Record<string, unknown>,
    ) => void;
  };

  export function defineUIViewController<
    Props extends object,
    Controller = unknown,
  >(
    definition: UIViewControllerDefinition<Props, Controller>,
  ): React.ComponentType<
    React.PropsWithChildren<
      Props &
        ViewProps & {
          attachController?: boolean;
          attachControllerToParent?: boolean;
          attachControllerView?: boolean;
          attachNativeView?: boolean;
          collectChildren?: boolean;
          detachControllerFromParent?: boolean;
          disableUIKitHostWindowAttachRefresh?: boolean;
          emitOffWindowHostReady?: boolean;
          ignoreHostReadyWindowAttachment?: boolean;
          immediateTransactionCommit?: boolean;
          pinNativeViewToHost?: boolean;
          disableDetachedChildrenTouchHandler?: boolean;
          externalDetachedChildrenOwner?: boolean;
          fabricLifecycleCallbacks?: boolean;
          preserveDetachedChildrenLayout?: boolean;
          onHostReady?: (event: {
          nativeEvent: {
            hostReadyId: string;
            hostId: string;
            componentViewHandle: string;
            nativeViewHandle: string;
            childrenViewHandle: string;
            controllerHandle: string;
              hasChildren: boolean;
              visibleDescendantCount: number;
              windowAttached: boolean;
            };
          }) => void;
        }
    >
  >;

  export function defineUIKitContainer<
    Props extends object,
    RootView = unknown,
    ChildrenView = unknown,
  >(
    definition: UIKitContainerDefinition<Props, RootView, ChildrenView>,
  ): React.ForwardRefExoticComponent<
    React.PropsWithoutRef<
      Props &
        ViewProps & {
          children?: React.ReactNode;
          attachController?: boolean;
          attachControllerToParent?: boolean;
          attachControllerView?: boolean;
          attachNativeView?: boolean;
          collectChildren?: boolean;
          detachControllerFromParent?: boolean;
          disableUIKitHostWindowAttachRefresh?: boolean;
          emitOffWindowHostReady?: boolean;
          ignoreHostReadyWindowAttachment?: boolean;
          immediateTransactionCommit?: boolean;
          pinNativeViewToHost?: boolean;
          disableDetachedChildrenTouchHandler?: boolean;
          externalDetachedChildrenOwner?: boolean;
          preserveDetachedChildrenLayout?: boolean;
          onHostReady?: (event: {
          nativeEvent: {
            hostReadyId: string;
            hostId: string;
            componentViewHandle: string;
            nativeViewHandle: string;
            childrenViewHandle: string;
            controllerHandle: string;
              hasChildren: boolean;
              visibleDescendantCount: number;
              windowAttached: boolean;
            };
          }) => void;
        }
    > &
      React.RefAttributes<
        UIKitViewRef<{ rootView: RootView; childrenView: ChildrenView }>
      >
  >;

  export function getClass<T = unknown>(name: string): T | null;
  export function nativeHandleForObject(value: unknown): string | undefined;
  export function nativeObjectFromHandle<T = unknown>(
    handle: string | number | null | undefined,
  ): T | null;
  export function nativeArrayLength(value: unknown): number;
  export function nativeArrayItem<T = unknown>(
    value: unknown,
    index: number,
  ): T | null;
  export function nativeSubviews<T = unknown>(view: unknown): T[];
  export function collectedUIKitHostChildren<T = unknown>(view: unknown): T[];
  export function uikitHostHandlesForView(
    view: unknown,
  ): UIKitHostNativeHandles | null;
  export function setAssociatedNativeObject(
    target: unknown,
    key: string,
    value: unknown,
    policy?: NativeAssociationPolicy,
  ): boolean;
  export function getAssociatedNativeObject<T = unknown>(
    target: unknown,
    key: string,
  ): T | null;
  export function refreshUIKitHostView(view: unknown): boolean;
  export function refreshUIKitHostViewHandle(viewHandle: string): boolean;
  export function refreshUIKitHostViewOwner(view: unknown): boolean;
  export function refreshUIKitHostViewOwnerHandle(viewHandle: string): boolean;
  export function refreshUIKitHostViewDirectOwner(view: unknown): boolean;
  export function refreshUIKitHostViewDirectOwnerHandle(
    viewHandle: string,
  ): boolean;
  export function invalidateUIKitHostReadyOwner(view: unknown): boolean;
  export function invalidateUIKitHostReadyOwnerHandle(
    viewHandle: string,
  ): boolean;
  export function notifyUIKitAccessibilityLayoutChanged(view: unknown): boolean;
  export function notifyUIKitAccessibilityLayoutChangedHandle(
    viewHandle: string,
  ): boolean;
  export function flushUIKitHostView(view: unknown): boolean;
  export function flushUIKitHostViewHandle(viewHandle: string): boolean;
  export function flushUIKitHostViewOwner(view: unknown): boolean;
  export function flushUIKitHostViewOwnerHandle(viewHandle: string): boolean;
  export function reactNativeFabricViewLayoutTraits(
    view: unknown,
  ): ReactNativeFabricViewLayoutTraits | null;
  export function reactNativeFabricViewLayoutTraitsForHandle(
    viewHandle: string,
  ): ReactNativeFabricViewLayoutTraits | null;
  export function attachViewControllerToNearestParent(
    controller: unknown,
    view: unknown,
    options?: { allowRootParent?: boolean },
  ): boolean;
  export function attachViewControllerToNearestParentHandle(
    controllerHandle: string,
    viewHandle: string,
    options?: { allowRootParent?: boolean },
  ): boolean;
  export function loadImage(
    source: unknown,
    options: NativeScriptImageLoadOptions,
    callback: NativeScriptImageLoadCallback,
  ): boolean;
  export function runtimeInvoker<T extends (...args: any[]) => any>(
    callback: T,
  ): T;
  export type NativeScriptMethodCallbackPolicy = {
    callSuper?: 'before';
    callSuperBeforeCallback?: boolean;
    skipCallbackIfAssociatedObjectTruthy?: string | string[];
    skipCallbackIfAllAssociatedObjectConditions?:
      | NativeScriptMethodPolicyAssociatedObjectCondition
      | NativeScriptMethodPolicyAssociatedObjectCondition[];
    setAssociatedObjectsBeforeSkip?:
      | NativeScriptMethodPolicyAssociatedObjectAssignment
      | NativeScriptMethodPolicyAssociatedObjectAssignment[];
    setKeyPathValuesBeforeSkip?:
      | NativeScriptMethodPolicyKeyPathAssignment
      | NativeScriptMethodPolicyKeyPathAssignment[];
    returnValueIfSkipped?: boolean | number;
  };
  export type NativeScriptMethodPolicyTarget = {
    target?: 'receiver' | 'argument' | 'arg';
    argumentIndex?: number;
    index?: number;
  };
  export type NativeScriptMethodPolicyAssociatedObjectCondition =
    NativeScriptMethodPolicyTarget & {
      key: string;
      truthy?: boolean;
      falsy?: boolean;
      equalsAssociatedObject?: NativeScriptMethodPolicyTarget & { key: string };
      notEqualsAssociatedObject?: NativeScriptMethodPolicyTarget & {
        key: string;
      };
    };
  export type NativeScriptMethodPolicyAssociatedObjectAssignment =
    NativeScriptMethodPolicyTarget & {
      key: string;
      value?: string | number | boolean | null;
      policy?: NativeAssociationPolicy;
    };
  export type NativeScriptMethodPolicyKeyPathAssignment =
    NativeScriptMethodPolicyTarget & {
      keyPath: string;
      value?: string | number | boolean | null;
    };
  export function nativeMethodPolicy<T extends (...args: any[]) => any>(
    callback: T,
    policy: NativeScriptMethodCallbackPolicy,
  ): T;
  export function eventBridge<T extends (...args: any[]) => any>(
    callback: T,
    thread?: 'js' | 'runtime' | 'caller',
  ): T;
  export function invokeOnJS<T extends (...args: any[]) => any>(
    callback: T,
    ...args: Parameters<T>
  ): void;
  export type NativeActionTarget = {
    action: string;
    dispose(): void;
    target: unknown;
  };
  export function canCreateNativeActionTarget(): boolean;
  export function createNativeActionTarget(
    callback: (...args: any[]) => any,
  ): NativeActionTarget;
  export function invokeNativeActionTarget(
    actionTarget: NativeActionTarget,
    sender?: unknown,
  ): boolean;
  export function runOnUI<Args extends unknown[], ReturnValue>(
    callback: (...args: Args) => ReturnValue,
    ...args: Args
  ): Promise<ReturnValue>;

  const NativeScript: {
    canCreateNativeActionTarget: typeof canCreateNativeActionTarget;
    createNativeActionTarget: typeof createNativeActionTarget;
    defineUIKitContainer: typeof defineUIKitContainer;
    defineUIViewController: typeof defineUIViewController;
    getAssociatedNativeObject: typeof getAssociatedNativeObject;
    getClass: typeof getClass;
    invokeNativeActionTarget: typeof invokeNativeActionTarget;
    invokeOnJS: typeof invokeOnJS;
    loadImage: typeof loadImage;
    nativeArrayItem: typeof nativeArrayItem;
    nativeArrayLength: typeof nativeArrayLength;
    collectedUIKitHostChildren: typeof collectedUIKitHostChildren;
    nativeHandleForObject: typeof nativeHandleForObject;
    nativeObjectFromHandle: typeof nativeObjectFromHandle;
    nativeSubviews: typeof nativeSubviews;
    uikitHostHandlesForView: typeof uikitHostHandlesForView;
    refreshUIKitHostView: typeof refreshUIKitHostView;
    refreshUIKitHostViewHandle: typeof refreshUIKitHostViewHandle;
    refreshUIKitHostViewOwner: typeof refreshUIKitHostViewOwner;
    refreshUIKitHostViewOwnerHandle: typeof refreshUIKitHostViewOwnerHandle;
    refreshUIKitHostViewDirectOwner: typeof refreshUIKitHostViewDirectOwner;
    refreshUIKitHostViewDirectOwnerHandle: typeof refreshUIKitHostViewDirectOwnerHandle;
    invalidateUIKitHostReadyOwner: typeof invalidateUIKitHostReadyOwner;
    invalidateUIKitHostReadyOwnerHandle: typeof invalidateUIKitHostReadyOwnerHandle;
    notifyUIKitAccessibilityLayoutChanged: typeof notifyUIKitAccessibilityLayoutChanged;
    notifyUIKitAccessibilityLayoutChangedHandle: typeof notifyUIKitAccessibilityLayoutChangedHandle;
    flushUIKitHostView: typeof flushUIKitHostView;
    flushUIKitHostViewHandle: typeof flushUIKitHostViewHandle;
    flushUIKitHostViewOwner: typeof flushUIKitHostViewOwner;
    flushUIKitHostViewOwnerHandle: typeof flushUIKitHostViewOwnerHandle;
    reactNativeFabricViewLayoutTraits: typeof reactNativeFabricViewLayoutTraits;
    reactNativeFabricViewLayoutTraitsForHandle: typeof reactNativeFabricViewLayoutTraitsForHandle;
    setAssociatedNativeObject: typeof setAssociatedNativeObject;
    attachViewControllerToNearestParent: typeof attachViewControllerToNearestParent;
    attachViewControllerToNearestParentHandle: typeof attachViewControllerToNearestParentHandle;
    eventBridge: typeof eventBridge;
    nativeMethodPolicy: typeof nativeMethodPolicy;
    runtimeInvoker: typeof runtimeInvoker;
    runOnUI: typeof runOnUI;
  };

  export default NativeScript;
}

declare global {
  namespace interop {
    type AssociationPolicy =
      | 'assign'
      | 'retain'
      | 'retainNonatomic'
      | 'strong'
      | 'strongNonatomic'
      | 'copy'
      | 'copyNonatomic'
      | number;

    function Block<T extends (...args: any[]) => any>(
      encoding: string,
      callback: T,
    ): T;
    function setAssociatedObject(
      target: unknown,
      key: string,
      value: unknown,
      policy?: AssociationPolicy,
    ): void;
    function getAssociatedObject<T = unknown>(
      target: unknown,
      key: string,
    ): T | null;
  }
}
