import fs from 'fs';
import path from 'path';

const stackSource = fs.readFileSync(
  path.resolve(__dirname, 'NativeScriptScreenStack.ios.tsx'),
  'utf8',
);
const screenStackSource = fs.readFileSync(
  path.resolve(__dirname, '../../ScreenStack.tsx'),
  'utf8',
);
const screenStackItemSource = fs.readFileSync(
  path.resolve(__dirname, '../../ScreenStackItem.tsx'),
  'utf8',
);
const screenContentWrapperSource = fs.readFileSync(
  path.resolve(__dirname, '../../ScreenContentWrapper.tsx'),
  'utf8',
);
const screenStackHeaderConfigSource = fs.readFileSync(
  path.resolve(__dirname, '../../ScreenStackHeaderConfig.tsx'),
  'utf8',
);
const safeAreaViewSource = fs.readFileSync(
  path.resolve(__dirname, '../../safe-area/SafeAreaView.tsx'),
  'utf8',
);
const screenFooterSource = fs.readFileSync(
  path.resolve(__dirname, '../../ScreenFooter.tsx'),
  'utf8',
);

describe('NativeScript ScreenStack port', () => {
  it('lives in react-native-screens rather than React Navigation', () => {
    expect(stackSource).toContain("debugName: 'RNSScreenStack.NativeScript'");
    expect(stackSource).toContain("debugName: 'RNSScreen.NativeScript'");
    expect(stackSource).toContain('__rnsNativeScriptStackRegistry');
    expect(stackSource).not.toContain('ReactNavigationNativeScript');
    expect(stackSource).not.toContain('__reactNavigationNativeScript');
    expect(stackSource).not.toContain('requestNativeScriptStackPop');
  });

  it('routes the public ScreenStack surface through the NativeScript implementation on iOS', () => {
    expect(screenStackSource).toContain(
      "import { NativeScriptScreenStack } from './native-stack/native-script/NativeScriptScreenStack'",
    );
    expect(screenStackSource).toContain("Platform.OS === 'ios'");
    expect(screenStackSource).toContain('<NativeScriptScreenStack');
  });

  it('routes ScreenStackItem through the NativeScript screen controller on iOS', () => {
    expect(screenStackItemSource).toContain(
      "import { NativeScriptScreenStackItem } from './native-stack/native-script/NativeScriptScreenStack'",
    );
    expect(screenStackItemSource).toContain("Platform.OS === 'ios'");
    expect(screenStackItemSource).toContain('<NativeScriptScreenStackItem');
    expect(screenStackItemSource).toContain('<DebugContainer');
    expect(screenStackItemSource).toContain('<ScreenStackHeaderConfig');
    expect(screenStackItemSource).toContain('<FooterComponent>');
    expect(screenStackItemSource).not.toContain('shouldUseNativeScriptStack ? (');
    expect(screenStackItemSource).not.toContain('<View\n            collapsable={false}');
    expect(screenStackItemSource).not.toContain(
      '{!shouldUseNativeScriptStack &&',
    );
  });

  it('ports the native child components that ScreenStackItem renders instead of bypassing them', () => {
    expect(screenContentWrapperSource).toContain("Platform.OS === 'ios'");
    expect(screenContentWrapperSource).toContain('<View');
    expect(screenStackHeaderConfigSource).toContain("Platform.OS === 'ios'");
    expect(screenStackHeaderConfigSource).toContain('<View');
    expect(safeAreaViewSource).toContain("Platform.OS === 'ios'");
    expect(safeAreaViewSource).toContain('<View');
    expect(screenFooterSource).toContain("Platform.OS === 'ios'");
    expect(screenFooterSource).toContain('<View');
  });

  it('matches react-native-screens native push/pop ownership', () => {
    expect(stackSource).toContain(
      'parent.pushViewControllerAnimated(controller, true)',
    );
    expect(stackSource).toContain(
      'parent.setViewControllersAnimated(\n        createArray(controllersBeforePush),\n        false',
    );
    expect(stackSource).toContain('parent.popViewControllerAnimated(true)');
    expect(stackSource).toContain('parent.popToRootViewControllerAnimated(true)');
    expect(stackSource).toContain('parent.popToViewControllerAnimated(');
  });

  it('defers reconciliation through UIKit transition coordinator without package-specific runtime helpers', () => {
    expect(stackSource).toContain('coordinator.animateAlongsideTransitionCompletion');
    expect(stackSource).toContain('InteropBlock(');
    expect(stackSource).toContain('NativeScriptRuntime.runtimeInvoker(complete)');
    expect(stackSource).not.toContain('afterUIKitTransition');
    expect(stackSource).not.toContain('coordinator.transitionDuration');
  });

  it('uses screens-style interaction gating without rewriting hosted React children', () => {
    expect(stackSource).toContain('function lockStackInteractions');
    expect(stackSource).toContain('function unlockStackInteractions');
    expect(stackSource).toContain(
      'navigationController.view.userInteractionEnabled = false',
    );
    expect(stackSource).not.toContain('function enableHostedInteraction');
    expect(stackSource).not.toContain('function setViewSubtreeInteraction');
  });

  it('keeps modal presentation as UIKit presentation-controller behavior', () => {
    expect(stackSource).toContain('UIAdaptivePresentationControllerDelegate');
    expect(stackSource).toContain('presentationControllerShouldDismiss()');
    expect(stackSource).toContain('presentationControllerDidAttemptToDismiss()');
    expect(stackSource).toContain('presentationControllerDidDismiss()');
    expect(stackSource).toContain('presentViewControllerAnimatedCompletion');
    expect(stackSource).toContain('dismissViewControllerAnimatedCompletion');
  });
});
