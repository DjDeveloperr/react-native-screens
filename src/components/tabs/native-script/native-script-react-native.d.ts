declare module '@nativescript/react-native' {
  import * as React from 'react';
  import type { ViewProps } from 'react-native';

  export type UIKitLayoutOptions = {
    sizing?: 'fill' | 'intrinsic' | 'sizeThatFits' | 'autoLayout';
    defaultSize?: { width?: number; height?: number };
    minSize?: { width?: number; height?: number };
    maxSize?: { width?: number; height?: number };
  };

  export type UIViewControllerDefinition<
    Props extends object,
    Controller = unknown,
  > = {
    debugName?: string;
    layout?: UIKitLayoutOptions;
    createController: (props: Readonly<Props>) => Controller;
    childrenView?: (controller: Controller) => unknown;
    update?: (
      controller: Controller,
      props: Readonly<Props>,
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
          attachControllerView?: boolean;
          attachNativeView?: boolean;
          onHostReady?: (event: {
            nativeEvent: {
              hostReadyId: string;
              hostId: string;
              nativeViewHandle: string;
              childrenViewHandle: string;
              controllerHandle: string;
              hasChildren: boolean;
            };
          }) => void;
        }
    >
  >;

  export function getClass<T = unknown>(name: string): T | null;
  export function refreshUIKitHostView(view: unknown): boolean;
  export function runtimeInvoker<T extends (...args: any[]) => any>(
    callback: T,
  ): T;
  export function runOnUI<Args extends unknown[], ReturnValue>(
    callback: (...args: Args) => ReturnValue,
    ...args: Args
  ): Promise<ReturnValue>;

  const NativeScript: {
    defineUIViewController: typeof defineUIViewController;
    getClass: typeof getClass;
    refreshUIKitHostView: typeof refreshUIKitHostView;
    runtimeInvoker: typeof runtimeInvoker;
    runOnUI: typeof runOnUI;
  };

  export default NativeScript;
}

declare global {
  namespace interop {
    function Block<T extends (...args: any[]) => any>(
      encoding: string,
      callback: T,
    ): T;
  }
}
