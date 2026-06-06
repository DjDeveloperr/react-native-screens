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
        }
    >
  >;

  export function getClass<T = unknown>(name: string): T | null;
  export function runOnUI<Args extends unknown[], ReturnValue>(
    callback: (...args: Args) => ReturnValue,
    ...args: Args
  ): Promise<ReturnValue>;

  const NativeScript: {
    defineUIViewController: typeof defineUIViewController;
    getClass: typeof getClass;
    runOnUI: typeof runOnUI;
  };

  export default NativeScript;
}
