import fs from 'fs';
import path from 'path';
import * as React from 'react';
import {
  __nativeScriptCoerceContentWrapperChildScrollViewFrameForTests,
  __nativeScriptConfigureNavigationAppearanceForTests,
  __nativeScriptConfigureHeaderSubviewViewsForTests,
  __nativeScriptConfigureSourceBackButtonForTests,
  __nativeScriptCreateHeaderBarButtonItemsForTests,
  __nativeScriptOverrideScrollViewBehaviorInFirstDescendantChainForTests,
  __nativeScriptPresentationCoordinatorControllerForTests,
  __nativeScriptRegisterHeaderSubviewForTests,
  __nativeScriptShouldOverrideScrollViewContentInsetAdjustmentBehaviorForTests,
  __nativeScriptShouldInstallBackdropTapGestureForTests,
  __nativeScriptShouldReceiveBackdropTapTouchForTests,
  __nativeScriptStackCancelTouchesInParentForTests,
  __nativeScriptControllersForStackUIKitModelIdsForTests,
  __nativeScriptStackGestureResponseDistanceAllowsForTests,
  __nativeScriptStackGestureDelegateDecisionForTests,
  __nativeScriptStackScreenParticipatesInUIKitModelForTests,
  __nativeScriptStackSwipeMetricForTests,
  __nativeScriptUnregisterHeaderSubviewForTests,
  __mergeNativeScriptStackChildrenForTests,
  __shouldReceiveNativeScriptStackBackGestureForTests,
  NativeScriptScreenStackItem,
} from './NativeScriptScreenStack.ios';

const stackSource = fs.readFileSync(
  path.resolve(__dirname, 'NativeScriptScreenStack.ios.tsx'),
  'utf8',
);
const screenStackSource = fs.readFileSync(
  path.resolve(__dirname, '../../ScreenStack.tsx'),
  'utf8',
);
const screenSource = fs.readFileSync(
  path.resolve(__dirname, '../../Screen.tsx'),
  'utf8',
);
const screenContainerSource = fs.readFileSync(
  path.resolve(__dirname, '../../ScreenContainer.tsx'),
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
const searchBarSource = fs.readFileSync(
  path.resolve(__dirname, '../../SearchBar.tsx'),
  'utf8',
);
const safeAreaViewSource = fs.readFileSync(
  path.resolve(__dirname, '../../safe-area/SafeAreaView.tsx'),
  'utf8',
);
const fullWindowOverlaySource = fs.readFileSync(
  path.resolve(__dirname, '../../FullWindowOverlay.tsx'),
  'utf8',
);
const screenFooterSource = fs.readFileSync(
  path.resolve(__dirname, '../../ScreenFooter.tsx'),
  'utf8',
);
const scrollViewMarkerSource = fs.readFileSync(
  path.resolve(
    __dirname,
    '../../gamma/scroll-view-marker/ScrollViewMarker.tsx',
  ),
  'utf8',
);
const flagsSource = fs.readFileSync(
  path.resolve(__dirname, '../../../flags.ts'),
  'utf8',
);
const reactNativeConfigSource = fs.readFileSync(
  path.resolve(__dirname, '../../../../react-native.config.js'),
  'utf8',
);

type TestStackChildProps = {
  activityState?: number;
  screenId: string;
};

function testStackChildProps(child: React.ReactNode) {
  return (child as React.ReactElement<TestStackChildProps>).props;
}

describe('NativeScript ScreenStack port', () => {
  it('lives in react-native-screens rather than React Navigation', () => {
    expect(stackSource).toContain("debugName: 'RNSScreenStack.NativeScript'");
    expect(stackSource).toContain("debugName: 'RNSScreen.NativeScript'");
    expect(stackSource).toContain('__rnsNativeScriptStackRegistry');
    expect(stackSource).not.toContain('ReactNavigationNativeScript');
    expect(stackSource).not.toContain('__reactNavigationNativeScript');
    expect(stackSource).not.toContain('requestNativeScriptStackPop');
  });

  it('keeps the iOS fork pure TypeScript by disabling native iOS autolinking', () => {
    expect(reactNativeConfigSource).toContain('dependency');
    expect(reactNativeConfigSource).toContain('platforms');
    expect(reactNativeConfigSource).toContain('android');
    expect(reactNativeConfigSource).not.toContain('ios:');
    expect(reactNativeConfigSource).not.toContain('"ios"');
  });

  it('routes the public ScreenStack surface through the NativeScript implementation on iOS', () => {
    expect(screenStackSource).toContain(
      "import { NativeScriptScreenStack } from './native-stack/native-script/NativeScriptScreenStack'",
    );
    expect(screenStackSource).toContain("Platform.OS === 'ios'");
    expect(screenStackSource).toContain('<NativeScriptScreenStack');
  });

  it('routes the public ScreenContainer and Screen surfaces through NativeScript on iOS', () => {
    expect(screenContainerSource).toContain(
      "import { NativeScriptScreenContainer } from './native-stack/native-script/NativeScriptScreenStack'",
    );
    expect(screenContainerSource).toContain("Platform.OS === 'ios'");
    expect(screenContainerSource).toContain('<NativeScriptScreenContainer');
    expect(screenSource).toContain(
      "import { NativeScriptScreen } from './native-stack/native-script/NativeScriptScreenStack'",
    );
    expect(screenSource).toContain("Platform.OS === 'ios'");
    expect(screenSource).toContain('<NativeScriptScreen');
  });

  it('ports FullWindowOverlay as a NativeScript window-level UIKit container on iOS', () => {
    expect(fullWindowOverlaySource).toContain(
      "debugName: 'RNSFullWindowOverlay.NativeScript'",
    );
    expect(fullWindowOverlaySource).toContain(
      'NativeScriptRuntime.defineUIKitContainer',
    );
    expect(fullWindowOverlaySource).toContain(
      'nativeScriptFullWindowOverlayContainerClass',
    );
    expect(fullWindowOverlaySource).toContain(
      'RNSFullWindowOverlayNativeScriptContainer',
    );
    expect(fullWindowOverlaySource).toContain(
      'RNSFullWindowOverlayNativeScriptRootView',
    );
    expect(fullWindowOverlaySource).toContain("'pointInside:withEvent:'");
    expect(fullWindowOverlaySource).toContain("'hitTest:withEvent:'");
    expect(fullWindowOverlaySource).toContain('reactZIndexSortedSubviews');
    expect(fullWindowOverlaySource).toContain('window.addSubview?.(container)');
    expect(fullWindowOverlaySource).toContain(
      'window.bringSubviewToFront?.(container)',
    );
    expect(fullWindowOverlaySource).toContain(
      'container.accessibilityViewIsModal =\n    props.accessibilityContainerViewIsModal ?? true',
    );
    expect(fullWindowOverlaySource).toContain(
      'UIAccessibilityPostNotification',
    );
    expect(fullWindowOverlaySource).toContain(
      'NATIVESCRIPT_PORT_DEVIATION: upstream keeps every overlay in front',
    );
    expect(fullWindowOverlaySource).not.toContain('<NativeFullWindowOverlay');
  });

  it('ports gamma ScrollViewMarker through a NativeScript UIKit container on iOS', () => {
    expect(scrollViewMarkerSource).toContain(
      "debugName: 'RNSScrollViewMarker.NativeScript'",
    );
    expect(scrollViewMarkerSource).toContain(
      'NativeScriptRuntime.defineUIKitContainer',
    );
    expect(scrollViewMarkerSource).toContain(
      'RNSScrollViewMarkerNativeScriptView',
    );
    expect(scrollViewMarkerSource).toContain("'willMoveToWindow:'");
    expect(scrollViewMarkerSource).toContain(
      'function resolveNativeScrollViewFromChild',
    );
    expect(scrollViewMarkerSource).toContain('RCTScrollViewComponentView');
    expect(scrollViewMarkerSource).toContain(
      'function applyScrollEdgeEffectsToScrollView',
    );
    expect(scrollViewMarkerSource).toContain('UIScrollEdgeEffectStyle');
    expect(scrollViewMarkerSource).toContain('currentIOSMajorVersion() < 26');
    expect(scrollViewMarkerSource).toContain(
      'registerDescendantScrollView:fromMarker:',
    );
    expect(scrollViewMarkerSource).toContain(
      'registerDescendantScrollViewFromMarker',
    );
    expect(scrollViewMarkerSource).toContain(
      'NATIVESCRIPT_PORT_DEVIATION: NativeScriptUIView adds a hidden touch',
    );
    expect(scrollViewMarkerSource).toContain("Platform.OS === 'ios'");
    expect(scrollViewMarkerSource).toContain('<NativeScriptScrollViewMarker');
    expect(scrollViewMarkerSource).not.toContain('return <View {...rest} />');
  });

  it('routes ScreenStackItem through the NativeScript screen controller on iOS', () => {
    expect(screenStackItemSource).toContain(
      "from './native-stack/native-script/NativeScriptScreenStack'",
    );
    expect(screenStackItemSource).toContain('NativeScriptScreenStack,');
    expect(screenStackItemSource).toContain('NativeScriptScreenStackItem,');
    expect(screenStackItemSource).toContain("Platform.OS === 'ios'");
    expect(screenStackItemSource).toContain('<NativeScriptScreenStackItem');
    expect(screenStackItemSource).toContain('<DebugContainer');
    expect(screenStackItemSource).toContain('<ScreenStackHeaderConfig');
    expect(screenStackItemSource).toContain('<FooterComponent>');
    expect(screenStackItemSource).toContain(
      "NATIVESCRIPT_PORT_DEVIATION: upstream's inner modal Screen",
    );
    expect(screenStackItemSource).toMatch(
      /const modalHeaderScreenId = `\$\{screenId\}:modal-header`/,
    );
    expect(screenStackItemSource).toContain(
      '<NativeScriptScreenStack style={styles.container}>',
    );
    expect(screenStackItemSource).toContain(
      'scrollEdgeEffects={isHeaderInModal ? undefined : scrollEdgeEffects}',
    );
    expect(screenStackItemSource).not.toContain(
      'shouldUseNativeScriptStack ? (',
    );
    expect(screenStackItemSource).not.toContain(
      '<View\n            collapsable={false}',
    );
    expect(screenStackItemSource).not.toContain(
      '{!shouldUseNativeScriptStack &&',
    );
  });

  it('mirrors Screen transition-progress wiring for NativeScript native-stack screens', () => {
    expect(stackSource).toContain(
      "import TransitionProgressContext from '../../../TransitionProgressContext'",
    );
    expect(stackSource).toContain(
      'const closing = React.useRef(new Animated.Value(0)).current;',
    );
    expect(stackSource).toContain(
      'const progress = React.useRef(new Animated.Value(0)).current;',
    );
    expect(stackSource).toContain(
      'const goingForward = React.useRef(new Animated.Value(0)).current;',
    );
    expect(stackSource).toContain('Animated.event(');
    expect(stackSource).toContain('<TransitionProgressContext.Provider');
    expect(stackSource).toContain(
      'onTransitionProgress={transitionProgressEvent}',
    );
    expect(stackSource).toContain('function emitTransitionProgress');
    expect(stackSource).toContain(
      'function emitTransitionProgressForController',
    );
    expect(stackSource).toContain("ctx.emit('onTransitionProgress'");
  });

  it('ports RNSScreen transition-progress display-link sampling', () => {
    const screenControllerSource = stackSource.slice(
      stackSource.indexOf('class RNSScreenNativeScriptController'),
      stackSource.indexOf(
        'NativeClassFunction(RNSScreenNativeScriptController)',
      ),
    );

    expect(stackSource).toContain(
      'function setupTransitionProgressNotification',
    );
    expect(stackSource).toContain(
      'function emitTransitionProgressForController',
    );
    expect(screenControllerSource).toContain(
      'setupTransitionProgressNotification(this, false, goingForward)',
    );
    expect(screenControllerSource).toContain(
      'setupTransitionProgressNotification(this, true, goingForward)',
    );
    expect(screenControllerSource).toContain("'handleAnimation:'");
    expect(stackSource).toContain(
      'CADisplayLink.displayLinkWithTargetSelector',
    );
    expect(stackSource).toContain('displayLinkWithTargetSelector(');
    expect(stackSource).toContain("controller,\n      'handleAnimation:'");
    expect(stackSource).toContain('addToRunLoopForMode');
    expect(stackSource).toContain('NSRunLoop.currentRunLoop');
    expect(stackSource).toContain('NSDefaultRunLoopMode');
    expect(stackSource).toContain('fakeView.layer.presentationLayer');
    expect(stackSource).toContain('presentationLayer.opacity');
    expect(stackSource).toContain('InteropBlock(');
    expect(stackSource).toContain('TRANSITION_COORDINATOR_COMPLETION_BLOCK');
    expect(stackSource).toContain('ObjCExposedMethods');
  });

  it('keeps transition-progress ownership in the RNSScreen lifecycle selectors', () => {
    const screenControllerSource = stackSource.slice(
      stackSource.indexOf('class RNSScreenNativeScriptController'),
      stackSource.indexOf(
        'NativeClassFunction(RNSScreenNativeScriptController)',
      ),
    );
    const markTransitionSource = stackSource.slice(
      stackSource.indexOf('function markTransition'),
      stackSource.indexOf('function animateStackPush'),
    );
    const finishTransitionSource = stackSource.slice(
      stackSource.indexOf('function finishTransition'),
      stackSource.indexOf('function scheduleTransitionFallback'),
    );

    expect(screenControllerSource).toContain('__nativeScriptScreenIsSwiping');
    expect(screenControllerSource).toContain(
      '__nativeScriptScreenShouldNotify',
    );
    expect(screenControllerSource).toContain(
      "nativeBool(transitionCoordinator, 'isInteractive')",
    );
    expect(screenControllerSource).toContain(
      'viewDidAppear(animated: boolean)',
    );
    expect(screenControllerSource).toContain(
      'viewDidDisappear(animated: boolean)',
    );
    expect(screenControllerSource).toContain(
      'emitTransitionProgressForController(\n          this,\n          1,\n          false,',
    );
    expect(screenControllerSource).toContain(
      'emitTransitionProgressForController(\n          this,\n          1,\n          true,',
    );
    expect(markTransitionSource).not.toContain('emitTransitionProgress');
    expect(finishTransitionSource).not.toContain('emitTransitionProgress');
  });

  it('keeps route lifecycle events owned by RNSScreen lifecycle selectors', () => {
    const screenControllerSource = stackSource.slice(
      stackSource.indexOf('class RNSScreenNativeScriptController'),
      stackSource.indexOf(
        'NativeClassFunction(RNSScreenNativeScriptController)',
      ),
    );
    const handleNativeTransitionSource = stackSource.slice(
      stackSource.indexOf('const handleNativeTransition = React.useCallback'),
      stackSource.indexOf(
        'return (\n    <NativeScriptScreenStackContext.Provider',
      ),
    );

    expect(stackSource).toContain(
      'function emitScreenLifecycleEventForController',
    );
    expect(screenControllerSource).toContain(
      "emitScreenLifecycleEventForController(this, 'onWillAppear')",
    );
    expect(screenControllerSource).toContain(
      "emitScreenLifecycleEventForController(this, 'onWillDisappear')",
    );
    expect(screenControllerSource).toContain(
      "emitScreenLifecycleEventForController(this, 'onAppear')",
    );
    expect(screenControllerSource).toContain(
      "emitScreenLifecycleEventForController(this, 'onDisappear')",
    );
    expect(screenControllerSource).toContain(
      "emitScreenLifecycleEventForController(this, 'onGestureCancel'",
    );
    expect(handleNativeTransitionSource).not.toContain(
      'itemProps.onWillAppear',
    );
    expect(handleNativeTransitionSource).not.toContain('itemProps.onAppear');
    expect(handleNativeTransitionSource).not.toContain(
      'itemProps.onWillDisappear',
    );
    expect(handleNativeTransitionSource).not.toContain('itemProps.onDisappear');
    expect(handleNativeTransitionSource).not.toContain(
      'itemProps.onGestureCancel',
    );
  });

  it('ports RNSScreen dismiss-count calculation into viewWillDisappear', () => {
    const screenControllerSource = stackSource.slice(
      stackSource.indexOf('class RNSScreenNativeScriptController'),
      stackSource.indexOf(
        'NativeClassFunction(RNSScreenNativeScriptController)',
      ),
    );
    const dismissCountSource = stackSource.slice(
      stackSource.indexOf('function dismissCountForController'),
      stackSource.indexOf('function nativeScriptScreenControllerClass'),
    );

    expect(stackSource).toContain('function dismissCountForController');
    expect(screenControllerSource).toContain(
      'this.__nativeScriptDismissCount = dismissCountForController(this)',
    );
    expect(dismissCountSource).toContain('nativeBool(');
    expect(dismissCountSource).toContain(
      'transitionCoordinatorForController(controller)',
    );
    expect(dismissCountSource).toContain("'isInteractive'");
    expect(dismissCountSource).toContain('controller?.navigationController');
    expect(dismissCountSource).toContain(
      'registry.stackActiveScreenIds[stackId]',
    );
    expect(dismissCountSource).toContain('screenIdForController(');
    expect(dismissCountSource).toContain(
      'navigationController.topViewController',
    );
    expect(dismissCountSource).toContain('selfIndex - targetIndex');
  });

  it('keeps native dismiss events owned by RNSScreen presentation delegates', () => {
    const screenControllerSource = stackSource.slice(
      stackSource.indexOf('class RNSScreenNativeScriptController'),
      stackSource.indexOf(
        'NativeClassFunction(RNSScreenNativeScriptController)',
      ),
    );
    const didShowSource = stackSource.slice(
      stackSource.indexOf('navigationControllerDidShowViewControllerAnimated'),
      stackSource.indexOf('if (isTransitioning && !wasClosing)'),
    );
    const viewDidDisappearSource = screenControllerSource.slice(
      screenControllerSource.indexOf('viewDidDisappear(animated: boolean)'),
      screenControllerSource.indexOf("'viewDidDisappear:'"),
    );
    const modalDismissalSource = stackSource.slice(
      stackSource.indexOf(
        'function completeNativePresentedModalDismissalForController',
      ),
      stackSource.indexOf('function setModalViewControllers'),
    );

    expect(stackSource).toContain('function emitScreenDismissedForController');
    expect(stackSource).toContain(
      'function emitNativeDismissCancelledForController',
    );
    expect(screenControllerSource).toContain(
      'this.parentViewController == null',
    );
    expect(screenControllerSource).toContain(
      'this.presentingViewController == null',
    );
    expect(screenControllerSource).toContain(
      'this.__nativeScriptIsRemovedFromParent === true',
    );
    expect(screenControllerSource).toContain(
      'screenPropsForController(this)?.preventNativeDismiss === true',
    );
    expect(screenControllerSource).toContain(
      'this.__nativeScriptDismissCount ?? 1',
    );
    expect(screenControllerSource).toContain(
      'emitNativeDismissCancelledForController(this, dismissCount)',
    );
    expect(viewDidDisappearSource).toContain(
      'restorePreventedNativeDismissForController(this)',
    );
    expect(
      viewDidDisappearSource.indexOf(
        'restorePreventedNativeDismissForController(this)',
      ),
    ).toBeLessThan(
      viewDidDisappearSource.indexOf(
        'emitNativeDismissCancelledForController(this, dismissCount)',
      ),
    );
    expect(screenControllerSource).toContain(
      'emitScreenDismissedForController(this, dismissCount)',
    );
    expect(stackSource).not.toContain('onNativeStackChange');
    expect(stackSource).not.toContain('scheduleStackChange');
    expect(didShowSource).not.toContain('emitScreenDismissed(');
    expect(didShowSource).not.toContain('setTimeout(emit');
    expect(screenControllerSource).toContain(
      'presentationControllerDidDismiss(_presentationController: any)',
    );
    expect(screenControllerSource).toContain(
      'this.notifyPresentedControllerDismissed()',
    );
    expect(screenControllerSource).toContain(
      'COMPLETE_NATIVE_PRESENTED_MODAL_DISMISSAL_KEY',
    );
    expect(screenControllerSource).toContain(
      "typeof completeDismissal === 'function'",
    );
    expect(screenControllerSource).toContain('completeDismissal(this)');
    expect(modalDismissalSource).toContain(
      'COMPLETE_NATIVE_PRESENTED_MODAL_DISMISSAL_KEY',
    );
    expect(modalDismissalSource).toContain(
      '= completeNativePresentedModalDismissalForController',
    );
    expect(modalDismissalSource).toContain(
      "emitTransition(ctx, 'end', true, screenId, false, true, false)",
    );
    expect(stackSource).toContain('__nativeScriptDismissEventEmitted');
  });

  it('ports RNSScreenContainer and RNSScreenNavigationContainer containment through UIKit', () => {
    expect(stackSource).toContain(
      "debugName: 'RNSScreenContainer.NativeScript'",
    );
    expect(stackSource).toContain(
      'function nativeScriptScreenContainerControllerClass',
    );
    expect(stackSource).toContain('function reconcilePlainScreenContainer');
    expect(stackSource).toContain(
      'function reconcileNavigationScreenContainer',
    );
    expect(stackSource).toContain(
      'controller.setNavigationBarHiddenAnimated(true, false)',
    );
    expect(stackSource).toContain(
      'parentController.addChildViewController?.(screenController)',
    );
    expect(stackSource).toContain(
      'screenController.didMoveToParentViewController?.(parentController)',
    );
    expect(stackSource).toContain(
      'notifyFinishTransitioningForScreen(registry, topId)',
    );
    expect(stackSource).toContain(
      'const containerOwnsNativeAttachment = containerContext != null',
    );
    expect(stackSource).toContain(
      'attachController={!containerOwnsNativeAttachment}',
    );
  });

  it('ports the native child components that ScreenStackItem renders instead of bypassing them', () => {
    expect(screenContentWrapperSource).toContain("Platform.OS === 'ios'");
    expect(screenContentWrapperSource).toContain(
      'NativeScriptRuntime.defineUIKitContainer',
    );
    expect(screenContentWrapperSource).toContain(
      "debugName: 'RNSScreenContentWrapper.NativeScript'",
    );
    expect(screenContentWrapperSource).toContain('attachNativeView');
    expect(screenStackHeaderConfigSource).toContain("Platform.OS === 'ios'");
    expect(screenStackHeaderConfigSource).toContain('<View');
    expect(safeAreaViewSource).toContain("Platform.OS === 'ios'");
    expect(safeAreaViewSource).toContain('<View');
    expect(safeAreaViewSource).toContain(
      'NATIVESCRIPT_PORT_DEVIATION: upstream iOS uses ObjC/Fabric',
    );
    expect(safeAreaViewSource).toContain(
      'this fork disables that native implementation',
    );
    expect(safeAreaViewSource).toContain(
      'iOS 26 screen wrapper shape is still preserved',
    );
    expect(safeAreaViewSource).toContain(
      'would duplicate\n    // UIKit navigation-controller layout',
    );
    expect(screenFooterSource).toContain("Platform.OS === 'ios'");
    expect(screenFooterSource).toContain('<View');
  });

  it('ports iOS 26 content scroll-edge effects through UIKit interop', () => {
    expect(stackSource).toContain(
      'function findScrollViewInFirstDescendantChainFrom',
    );
    expect(stackSource).toContain('function configureScrollEdgeEffect');
    expect(stackSource).toContain(
      'function applyScrollEdgeEffectsToScrollView',
    );
    expect(stackSource).toContain(
      'Direct port of RNSScrollViewFinder + RNSScrollEdgeEffectApplicator',
    );
    expect(stackSource).toContain('function scrollEdgeEffectsKey');
    expect(stackSource).toContain(
      "Mirror RNSScreen.mm's `_shouldUpdateScrollEdgeEffects` guard",
    );
    expect(stackSource).toContain('props?.scrollEdgeEffects == null');
    expect(stackSource).toContain(
      'NATIVESCRIPT_PORT_DEVIATION: generated ObjC props carry default',
    );
    expect(stackSource).toContain(
      'controller?.__nativeScriptScrollEdgeEffectsKey === key',
    );
    expect(stackSource).toContain('UIScrollEdgeEffectStyle');
    expect(stackSource).toContain('currentIOSMajorVersion() < 26');
    expect(stackSource).toContain('scrollView.bottomEdgeEffect');
    expect(stackSource).toContain('scrollView.leftEdgeEffect');
    expect(stackSource).toContain('scrollView.rightEdgeEffect');
    expect(stackSource).toContain('scrollView.topEdgeEffect');
    expect(stackSource).toContain(
      'updateContentScrollViewEdgeEffectsIfExists(controller, props)',
    );
    expect(stackSource).toContain(
      "Direct port of RNSScreen.mm's willMoveToParentViewController:",
    );
    expect(stackSource).toContain(
      'updateContentScrollViewEdgeEffectsIfExists(\n          this,\n          screenPropsForController(this),\n          true',
    );
  });

  it('ports RNSScrollViewBehaviorOverriding through React superviews', () => {
    const ScrollViewClass = {};
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIScrollView: ScrollViewClass,
      UIScrollViewContentInsetAdjustmentBehavior: {
        Automatic: 0,
        Never: 2,
      },
    };

    const provider = {
      shouldOverrideScrollViewContentInsetAdjustmentBehavior: jest.fn(
        () => true,
      ),
    };
    const screenView = {
      reactSuperview: () => ({
        reactSuperview: () => provider,
      }),
    };

    expect(
      __nativeScriptShouldOverrideScrollViewContentInsetAdjustmentBehaviorForTests(
        screenView,
      ),
    ).toBe(true);
    expect(
      provider.shouldOverrideScrollViewContentInsetAdjustmentBehavior,
    ).toHaveBeenCalled();

    const scrollView = {
      contentInsetAdjustmentBehavior: 2,
      isKindOfClass: (klass: unknown) => klass === ScrollViewClass,
      subviews: [],
    };
    const root = {
      isKindOfClass: () => false,
      subviews: [
        {
          isKindOfClass: () => false,
          subviews: [scrollView],
        },
      ],
    };

    __nativeScriptOverrideScrollViewBehaviorInFirstDescendantChainForTests(
      root,
    );
    expect(scrollView.contentInsetAdjustmentBehavior).toBe(0);

    delete (global as Record<string, unknown>).__nativeScriptNativeApi;
  });

  it('ports formSheet detent configuration and content-wrapper sizing through UIKit', () => {
    expect(screenStackItemSource).toContain(
      'sheetAllowedDetents={sheetAllowedDetents}',
    );
    expect(screenContentWrapperSource).toContain(
      'NativeScriptScreenHeaderSubviewContext',
    );
    expect(screenContentWrapperSource).toContain(
      'notifyNativeScriptScreenContentWrapperFrame',
    );
    expect(screenContentWrapperSource).toContain('childrenView,\n  );');
    expect(screenContentWrapperSource).toContain(
      'screenId={screenContext?.screenId}',
    );
    expect(stackSource).toContain('const SHEET_FIT_TO_CONTENTS = -1');
    expect(stackSource).toContain('screenSheetContentHeights');
    expect(stackSource).toContain('screenContentWrapperViews');
    expect(stackSource).toContain('screenSheetInitialDetentsSet');
    expect(stackSource).toContain('function resolvedSheetAllowedDetents');
    expect(stackSource).toContain('function sheetDetentIndexFromIdentifier');
    expect(stackSource).toContain('function updateFormSheetPresentationStyle');
    expect(stackSource).toContain('function updateFitToContentsDetent');
    expect(stackSource).toContain(
      'function contentWrapperChildScrollViewAndContainer',
    );
    expect(stackSource).toContain(
      'function coerceContentWrapperChildScrollViewFrame',
    );
    expect(stackSource).toContain('coerceContentWrapperChildScrollViewFrame(');
    expect(stackSource).toContain('UISheetPresentationControllerDetent');
    expect(stackSource).toContain('customDetentWithIdentifierResolver');
    expect(stackSource).toContain('SHEET_DETENT_RESOLVER_BLOCK');
    expect(stackSource).toContain(
      'NativeScriptRuntime.runtimeInvoker(callback)',
    );
    expect(stackSource).toContain('contentHeight + contentHeightErrata');
    expect(stackSource).toContain('function configureModalScreenController');
    expect(stackSource).toContain(
      'controller.modalPresentationStyle = modalPresentationStyle',
    );
    expect(stackSource).toContain(
      'updateFormSheetPresentationStyle(controller, props, registry, true)',
    );
    expect(stackSource).toContain(
      'sheetPresentationControllerDidChangeSelectedDetentIdentifier',
    );
    expect(stackSource).toContain("ctx.emit('onSheetDetentChanged'");
    expect(stackSource).toContain('isStable');
    expect(stackSource).not.toContain('afterFormSheetDetent');
  });

  it('registers every RNSScreen presentation delegate protocol on the controller subclass', () => {
    const screenControllerClassSource = stackSource.slice(
      stackSource.indexOf('function nativeScriptScreenControllerClass'),
      stackSource.indexOf('function nativeScriptNavigationControllerClass'),
    );

    expect(screenControllerClassSource).toContain(
      'const UIAdaptivePresentationControllerDelegate = nativeProtocol(',
    );
    expect(screenControllerClassSource).toContain(
      "'UIAdaptivePresentationControllerDelegate'",
    );
    expect(screenControllerClassSource).toContain(
      'const UISheetPresentationControllerDelegate = nativeProtocol(',
    );
    expect(screenControllerClassSource).toContain(
      "'UISheetPresentationControllerDelegate'",
    );
    expect(screenControllerClassSource).toContain(
      'screenControllerProtocols.push(UIAdaptivePresentationControllerDelegate)',
    );
    expect(screenControllerClassSource).toContain(
      'screenControllerProtocols.push(UISheetPresentationControllerDelegate)',
    );
    expect(screenControllerClassSource).toContain(
      '(RNSScreenNativeScriptController as any).ObjCProtocols =\n      screenControllerProtocols',
    );
    expect(screenControllerClassSource).toContain(
      'protocols: screenControllerProtocols',
    );
    expect(screenControllerClassSource).toContain(
      "'sheetPresentationControllerDidChangeSelectedDetentIdentifier:'",
    );
  });

  it('ports RNSScreenContentWrapper formSheet scroll-view frame coercion', () => {
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIScrollView: 'UIScrollView',
    };
    const makeFrame = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { height, width },
    });
    const makeScrollView = () => ({
      frame: makeFrame(10, 10),
      isKindOfClass: (klass: unknown) => klass === 'UIScrollView',
    });

    const firstScrollView = makeScrollView();
    expect(
      __nativeScriptCoerceContentWrapperChildScrollViewFrameForTests(
        { subviews: [firstScrollView] },
        { width: 320, height: 640 },
      ),
    ).toBe(true);
    expect(firstScrollView.frame).toEqual(makeFrame(320, 640));

    const headerView = { frame: makeFrame(320, 72) };
    const secondScrollView = makeScrollView();
    expect(
      __nativeScriptCoerceContentWrapperChildScrollViewFrameForTests(
        { subviews: [headerView, secondScrollView] },
        { width: 320, height: 640 },
      ),
    ).toBe(true);
    expect(secondScrollView.frame).toEqual(makeFrame(320, 568, 0, 72));

    const safeAreaScrollView = makeScrollView();
    const safeAreaView = { subviews: [safeAreaScrollView] };
    expect(
      __nativeScriptCoerceContentWrapperChildScrollViewFrameForTests(
        { subviews: [safeAreaView] },
        { width: 390, height: 700 },
      ),
    ).toBe(true);
    expect(safeAreaScrollView.frame).toEqual(makeFrame(390, 700));

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    expect(
      __nativeScriptCoerceContentWrapperChildScrollViewFrameForTests(
        {
          subviews: [headerView, makeScrollView(), { frame: makeFrame(1, 1) }],
        },
        { width: 320, height: 640 },
      ),
    ).toBe(true);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'FormSheet with ScrollView expects at most 2 subviews',
      ),
    );
    warnSpy.mockRestore();
    (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
  });

  it('documents every current mechanical deviation in NativeScript wrapper components', () => {
    const wrapperSources = `${screenContentWrapperSource}\n${screenStackHeaderConfigSource}\n${searchBarSource}\n${safeAreaViewSource}\n${fullWindowOverlaySource}`;
    const expectedDeviationReasons = [
      'upstream RNSScreenContentWrapper is a\n      // native component view',
      'upstream RNSScreenStackHeaderConfig owns\n    // RNSScreenStackHeaderSubview native component views',
      'upstream RNSSearchBar implements\n      // `+shouldBeRecycled` as `NO`',
      'upstream iOS uses ObjC/Fabric\n    // RNSSafeAreaView',
      'upstream keeps every overlay in front with\n  // `UIWindow+RNScreens.didAddSubview:`',
    ];

    expect(
      wrapperSources.match(/NATIVESCRIPT_PORT_DEVIATION:/g) ?? [],
    ).toHaveLength(expectedDeviationReasons.length);

    for (const reason of expectedDeviationReasons) {
      expect(wrapperSources).toContain(
        `NATIVESCRIPT_PORT_DEVIATION: ${reason}`,
      );
    }
  });

  it('ports RNSScreen window traits through NativeScript UIKit subclasses', () => {
    expect(stackSource).toContain('const SCREEN_CONTROLLER_CLASS_KEY');
    expect(stackSource).toContain('const NAVIGATION_CONTROLLER_CLASS_KEY');
    expect(stackSource).toContain('function statusBarStyleForProps');
    expect(stackSource).toContain('function statusBarAnimationForProps');
    expect(stackSource).toContain('function interfaceOrientationMaskForProps');
    expect(stackSource).toContain('function updateWindowTraits');
    expect(stackSource).toContain('function nativeScriptScreenControllerClass');
    expect(stackSource).toContain(
      'class RNSScreenNativeScriptController extends UIViewController',
    );
    expect(stackSource).toContain(
      'NativeClassFunction(RNSScreenNativeScriptController)',
    );
    expect(stackSource).toContain('childViewControllerForStatusBarHidden');
    expect(stackSource).toContain('prefersStatusBarHidden');
    expect(stackSource).toContain('childViewControllerForStatusBarStyle');
    expect(stackSource).toContain('preferredStatusBarStyle');
    expect(stackSource).toContain('preferredStatusBarUpdateAnimation');
    expect(stackSource).toContain('supportedInterfaceOrientations');
    expect(stackSource).toContain(
      'childViewControllerForHomeIndicatorAutoHidden',
    );
    expect(stackSource).toContain('prefersHomeIndicatorAutoHidden');
    expect(stackSource).toContain(
      "childControllerForTrait(this, 'screenOrientation', true)",
    );
    expect(stackSource).toContain(
      "childControllerForTrait(this, 'homeIndicatorHidden', true)",
    );
    expect(stackSource).toContain(
      'function nativeScriptNavigationControllerClass',
    );
    expect(stackSource).toContain(
      'class RNSNavigationNativeScriptController extends UINavigationController',
    );
    expect(stackSource).toContain(
      'NativeClassFunction(RNSNavigationNativeScriptController)',
    );
    expect(stackSource).toContain(
      'const UINavigationController = nativeScriptNavigationControllerClass();',
    );
    expect(stackSource).toContain(
      'const UIViewController = nativeScriptScreenControllerClass();',
    );
    expect(stackSource).toContain('setNeedsStatusBarAppearanceUpdate');
    expect(stackSource).toContain('setNeedsUpdateOfHomeIndicatorAutoHidden');
    expect(stackSource).toContain(
      'setNeedsUpdateOfSupportedInterfaceOrientations',
    );
    expect(stackSource).toContain('UIUserInterfaceIdiom');
    expect(stackSource).toContain('attemptRotationToDeviceOrientation');
    expect(stackSource).not.toContain('setNativeScriptStatusBarForScreen');
    expect(stackSource).not.toContain('setReactNativeScreensWindowTraits');
  });

  it('ports RNSNavigationController layout lifecycle for header height updates', () => {
    expect(stackSource).toContain('viewDidLayoutSubviews()');
    expect(stackSource).toContain('super.viewDidLayoutSubviews()');
    expect(stackSource).toContain(
      'function screenControllerHasNestedNavigationStack',
    );
    expect(stackSource).toContain(
      'function shouldEmitHeaderHeightAfterNavigationLayout',
    );
    expect(stackSource).toContain(
      'function emitTopScreenHeaderHeightAfterNavigationLayout',
    );
    expect(stackSource).toContain(
      'emitTopScreenHeaderHeightAfterNavigationLayout(this)',
    );
    expect(stackSource).toContain('layoutHostedReactSubviews(topController)');
    expect(stackSource).toContain(
      'emitHeaderHeightChange(\n    topController,',
    );
    expect(stackSource).toContain(
      'NATIVESCRIPT_PORT_DEVIATION: upstream also mirrors UINavigationBar layout',
    );
  });

  it('ports RNSScreen parent-removal bookkeeping on the controller subclass', () => {
    expect(stackSource).toContain('__nativeScriptIsRemovedFromParent');
    expect(stackSource).toContain(
      'willMoveToParentViewController(parent: any)',
    );
    expect(stackSource).toContain(
      "callNativeScriptControllerSuper(\n        this,\n        'willMoveToParentViewController'",
    );
    expect(stackSource).toContain('didMoveToParentViewController(parent: any)');
    expect(stackSource).toContain(
      "callNativeScriptControllerSuper(\n        this,\n        'didMoveToParentViewController'",
    );
    expect(stackSource).toContain(
      'this.__nativeScriptIsRemovedFromParent = parent == null',
    );
    expect(stackSource).toContain('isRemovedFromParent()');
    expect(stackSource).toContain(
      'return this.__nativeScriptIsRemovedFromParent === true',
    );
    expect(stackSource).toContain('notifyPresentedControllerDismissed()');
    expect(stackSource).toContain(
      'this.__nativeScriptIsRemovedFromParent = true',
    );
    expect(stackSource).toContain(
      "Direct port of RNSScreen.mm's willMoveToParentViewController:",
    );
    expect(stackSource).toContain(
      'updateContentScrollViewEdgeEffectsIfExists(\n          this,\n          screenPropsForController(this),\n          true',
    );
    expect(stackSource).toContain(
      'function screenControllerWasRemovedFromParent',
    );
  });

  it('ports RNSScreen layout lifecycle for native modal bounds and header height', () => {
    const screenControllerSource = stackSource.slice(
      stackSource.indexOf('class RNSScreenNativeScriptController'),
      stackSource.indexOf(
        'NativeClassFunction(RNSScreenNativeScriptController)',
      ),
    );

    expect(screenControllerSource).toContain('viewDidLayoutSubviews()');
    expect(screenControllerSource).toContain(
      "callNativeScriptControllerSuper(this, 'viewDidLayoutSubviews')",
    );
    expect(stackSource).toContain(
      'function screenControllerIsPresentedAsNativeModal',
    );
    expect(stackSource).toContain(
      'function screenControllerShouldUpdateBoundsAfterLayout',
    );
    expect(stackSource).toContain('function updateScreenBoundsAfterLayout');
    expect(screenControllerSource).toContain(
      'updateScreenBoundsAfterLayout(this)',
    );
    expect(screenControllerSource).toContain(
      'this.view?.superview?.bringSubviewToFront?.(this.view)',
    );
    expect(screenControllerSource).toContain('layoutHostedReactSubviews(this)');
    expect(stackSource).toContain(
      'screenControllerIsPresentedAsNativeModal(props) && screenId',
    );
    expect(stackSource).toContain('emitHeaderHeightChange(');
  });

  it('refreshes window traits from RNSScreen appearance and transition completion', () => {
    const screenControllerSource = stackSource.slice(
      stackSource.indexOf('class RNSScreenNativeScriptController'),
      stackSource.indexOf(
        'NativeClassFunction(RNSScreenNativeScriptController)',
      ),
    );
    const finishTransitionSource = stackSource.slice(
      stackSource.indexOf('function finishTransition('),
      stackSource.indexOf('function scheduleTransitionFallback'),
    );

    expect(screenControllerSource).toContain(
      'viewWillAppear(animated: boolean)',
    );
    expect(screenControllerSource).toContain(
      "callNativeScriptControllerSuper(this, 'viewWillAppear', true, animated)",
    );
    expect(screenControllerSource).toContain('updateWindowTraits(this)');
    expect(finishTransitionSource).toContain(
      'notifyFinishTransitioningForScreen(registry, screenId)',
    );
    expect(stackSource).toContain(
      'function notifyFinishTransitioningForScreen',
    );
    expect(screenControllerSource).toContain('notifyFinishTransitioning()');
    expect(screenControllerSource).toContain(
      'const previousFirstResponder = this.__nativeScriptPreviousFirstResponder',
    );
    expect(screenControllerSource).toContain(
      'previousFirstResponder.becomeFirstResponder()',
    );
    expect(screenControllerSource).toContain(
      'this.__nativeScriptPreviousFirstResponder = null',
    );
    expect(screenControllerSource).toContain('updateWindowTraits(this)');
  });

  it('invokes NativeScript native method host functions directly', () => {
    expect(stackSource).toContain('function callNativeScriptControllerSuper');
    expect(stackSource).toContain('const superObject = controller?.super');
    expect(stackSource).toContain("controller.invoke('transitionCoordinator')");
    expect(stackSource).toContain('? controller.transitionCoordinator()');
    expect(stackSource).toContain('return receiver[name]() === true');
    expect(stackSource).not.toContain('.call(controller)');
    expect(stackSource).not.toContain('.call(receiver)');
    expect(stackSource).not.toContain('.call(transitionContext)');
    expect(stackSource).not.toContain('.call(Detent)');
  });

  it('declares native lifecycle worklet helpers before the screen controller class', () => {
    const controllerIndex = stackSource.indexOf(
      'class RNSScreenNativeScriptController',
    );

    for (const helperName of [
      'transitionCoordinatorForController',
      'emitScreenLifecycleEventForController',
      'emitTransitionProgressForController',
      'emitScreenDismissedForController',
      'emitNativeDismissCancelledForController',
      'hideHeaderIfNecessary',
      'setupTransitionProgressNotification',
      'stopTransitionProgressNotification',
    ]) {
      expect(stackSource.indexOf(`function ${helperName}`)).toBeGreaterThan(-1);
      expect(stackSource.indexOf(`function ${helperName}`)).toBeLessThan(
        controllerIndex,
      );
    }
  });

  it('ports RNSScreen first-responder restoration around parent removal', () => {
    const screenControllerSource = stackSource.slice(
      stackSource.indexOf('class RNSScreenNativeScriptController'),
      stackSource.indexOf(
        'NativeClassFunction(RNSScreenNativeScriptController)',
      ),
    );

    expect(stackSource).toContain('function findFirstResponder');
    expect(screenControllerSource).toContain(
      'this.__nativeScriptPreviousFirstResponder',
    );
    expect(screenControllerSource).toContain('findFirstResponder(this.view)');
    expect(screenControllerSource).toContain('becomeFirstResponder');
    expect(screenControllerSource).toContain(
      'this.__nativeScriptPreviousFirstResponder = null',
    );
  });

  it('ports RNSScreen hidden-header workaround after active search bars', () => {
    const screenControllerSource = stackSource.slice(
      stackSource.indexOf('class RNSScreenNativeScriptController'),
      stackSource.indexOf(
        'NativeClassFunction(RNSScreenNativeScriptController)',
      ),
    );

    expect(stackSource).toContain('function hideHeaderIfNecessary');
    expect(screenControllerSource).toContain('hideHeaderIfNecessary(this)');
    expect(stackSource).toContain('navigationItem?.searchController');
    expect(stackSource).toContain(
      'setNavigationBarHiddenAnimated(true, false)',
    );
    expect(stackSource).toContain('setTimeout(hideHeader, 0)');
  });

  it('ports iOS navigation-bar appearance props through UINavigationBarAppearance', () => {
    expect(stackSource).toContain('function textAttributes');
    expect(stackSource).toContain('function headerFont');
    expect(stackSource).toContain('function blurEffectForHeaderConfig');
    expect(stackSource).toContain(
      'function configureNavigationSemanticContentAttribute',
    );
    expect(stackSource).toContain('UISemanticContentAttribute');
    expect(stackSource).toContain('UIBlurEffect.effectWithStyle');
    expect(stackSource).toContain('appearance.backgroundEffect');
    expect(stackSource).toContain('appearance.titleTextAttributes');
    expect(stackSource).toContain('appearance.largeTitleTextAttributes');
    expect(stackSource).toContain('headerConfig?.largeTitleBackgroundColor');
    expect(stackSource).toContain('headerConfig?.largeTitleHideShadow');
    expect(stackSource).toContain('navigationBar.overrideUserInterfaceStyle');
    expect(stackSource).toContain('topNavigationItem.standardAppearance');
    expect(stackSource).toContain('topNavigationItem.scrollEdgeAppearance');
    expect(stackSource).toContain(
      'topNavigationItem.leftItemsSupplementBackButton',
    );
  });

  it('reapplies navigation-bar appearance through transition coordinator completion', () => {
    const configureSource = stackSource.slice(
      stackSource.indexOf('function configureNavigationAppearance'),
      stackSource.indexOf(
        'export const __nativeScriptConfigureNavigationAppearanceForTests',
      ),
    );

    expect(stackSource).toContain('function applyNavigationAppearance');
    expect(configureSource).toContain(
      'transitionCoordinatorForController(topController)',
    );
    expect(configureSource).toContain(
      'coordinator.animateAlongsideTransitionCompletion',
    );
    expect(configureSource).toContain(
      'applyNavigationAppearance(navigationController, headerConfig, ctx, registry)',
    );
    expect(configureSource).toContain(
      'navigationController.__nativeScriptHeaderAppearanceToken',
    );
    expect(configureSource).toContain('NATIVESCRIPT_PORT_DEVIATION');
  });

  it('matches upstream source back-button item ownership', () => {
    const createdItems: any[] = [];
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIBarButtonItem: {
        alloc: () => ({
          initWithTitleStyleTargetAction: (
            title: string,
            style: unknown,
            target: unknown,
            action: unknown,
          ) => {
            const item: any = {
              action,
              setTitleTextAttributesForState: jest.fn(),
              style,
              target,
              title,
            };
            createdItems.push(item);
            return item;
          },
        }),
      },
      UIBarButtonItemStyle: {
        Plain: 'plain',
      },
      UIControlState: {
        Disabled: 2,
        Focused: 8,
        Highlighted: 1,
        Normal: 0,
        Selected: 4,
      },
      UIFont: {
        fontWithNameSize: (family: string, size: number) => ({
          family,
          size,
        }),
      },
      UINavigationItemBackButtonDisplayMode: {
        Default: 'default',
        Minimal: 'minimal',
      },
    };

    const defaultItem: any = { title: 'Previous' };
    __nativeScriptConfigureSourceBackButtonForTests(defaultItem, {
      backTitle: 'Details',
    } as any);
    expect(defaultItem.backButtonTitle).toBe('Details');
    expect(defaultItem.backButtonDisplayMode).toBe('default');
    expect(defaultItem.backBarButtonItem).toBeUndefined();

    const minimalItem: any = { title: 'Previous' };
    __nativeScriptConfigureSourceBackButtonForTests(minimalItem, {
      backTitle: 'Menu title',
      backTitleVisible: false,
    } as any);
    expect(minimalItem.backButtonTitle).toBe('Menu title');
    expect(minimalItem.backButtonDisplayMode).toBe('minimal');
    expect(minimalItem.backBarButtonItem).toBeUndefined();

    const recreatedItem: any = {};
    __nativeScriptConfigureSourceBackButtonForTests(
      recreatedItem,
      {} as any,
      { title: 'Recovered title' } as any,
    );
    expect(recreatedItem.backButtonTitle).toBe('Recovered title');
    expect(recreatedItem.backButtonDisplayMode).toBe('default');
    expect(recreatedItem.backBarButtonItem).toBeUndefined();

    const disabledMenuItem: any = { title: 'Previous' };
    __nativeScriptConfigureSourceBackButtonForTests(disabledMenuItem, {
      backTitle: 'No menu',
      disableBackButtonMenu: true,
    } as any);
    expect(disabledMenuItem.backBarButtonItem).toBe(createdItems[0]);
    expect(disabledMenuItem.backBarButtonItem.title).toBe('No menu');
    expect(
      disabledMenuItem.backBarButtonItem.__nativeScriptBackBarButtonItem,
    ).toBe(true);

    const customFontItem: any = { title: 'Previous' };
    __nativeScriptConfigureSourceBackButtonForTests(customFontItem, {
      backTitle: 'Custom',
      backTitleFontFamily: 'Avenir',
      backTitleFontSize: 19,
    } as any);
    expect(customFontItem.backBarButtonItem).toBe(createdItems[1]);
    expect(
      customFontItem.backBarButtonItem.setTitleTextAttributesForState,
    ).toHaveBeenCalled();

    __nativeScriptConfigureSourceBackButtonForTests(customFontItem, {
      backTitle: 'System again',
    } as any);
    expect(customFontItem.backBarButtonItem).toBeNull();

    expect(stackSource).toContain(
      'function nativeScriptBackBarButtonItemClass',
    );
    expect(stackSource).toContain('class RNSBackBarButtonItem');
    expect(stackSource).toContain('setMenu(menu: any)');
    expect(stackSource).toContain(
      'Upstream recovers this from the previous RNSScreen',
    );
    expect(stackSource).toContain(
      'NATIVESCRIPT_PORT_DEVIATION: upstream just skips assigning a custom',
    );
    expect(stackSource).toContain(
      'this.__nativeScriptBackButtonMenuHidden === true',
    );
    expect(stackSource).toContain('headerConfig?.backTitleVisible === false');
    expect(stackSource).toContain("? 'minimal'");
    (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
  });

  it('ports iOS header bar-button item arrays through UIKit controls', () => {
    expect(stackSource).toContain('function configureHeaderBarButtonItems');
    expect(stackSource).toContain('function createHeaderBarButtonItem');
    expect(stackSource).toContain('headerConfig?.headerLeftBarButtonItems');
    expect(stackSource).toContain('headerConfig?.headerRightBarButtonItems');
    expect(stackSource).toContain('initWithTitleStyleTargetAction');
    expect(stackSource).toContain('ctx.actionTarget');
    expect(stackSource).toContain('UIImage.systemImageNamed');
    expect(stackSource).toContain('config?.sfSymbolName');
    expect(stackSource).toContain('config?.xcassetName');
    expect(stackSource).toContain('config?.imageSource');
    expect(stackSource).toContain('config?.templateSource');
    expect(stackSource).toContain('imageWithRenderingMode');
    expect(stackSource).toContain('AlwaysTemplate');
    expect(stackSource).toContain('AlwaysOriginal');
    expect(stackSource).toContain('loadResolvedHeaderImage');
    expect(stackSource).toContain('ctx?.loadImage?.');
    expect(stackSource).toContain('barItem.image = loadedImage');
    expect(stackSource).toContain(
      "NativeScriptRuntime.eventBridge(item.onPress, 'js')",
    );
    expect(stackSource).toContain('function createHeaderMenu');
    expect(stackSource).toContain('function createHeaderMenuAction');
    expect(stackSource).toContain(
      'UIAction.actionWithTitleImageIdentifierHandler',
    );
    expect(stackSource).toContain(
      'UIMenu.menuWithTitleImageIdentifierOptionsChildren',
    );
    expect(stackSource).toContain(
      'actionTarget.target?.nativeScriptHandleAction?.(action)',
    );
    expect(stackSource).toContain('applyHeaderBarButtonBadge');
    expect(stackSource).toContain('setTitleTextAttributesForState');
    const titleAttributesHelper = stackSource.slice(
      stackSource.indexOf('function setTitleTextAttributesForAllStates'),
      stackSource.indexOf('function applyHeaderBarButtonTitleStyle'),
    );
    expect(titleAttributesHelper).not.toContain("controlState('Selected', 4)");
  });

  it('inserts iOS header bar-button items by upstream index semantics', () => {
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIBarButtonItem: {
        alloc: () => ({
          initWithTitleStyleTargetAction: (
            title: string,
            _style: unknown,
            _target: unknown,
            _action: unknown,
          ) => ({
            kind: 'button',
            title,
          }),
        }),
      },
    };
    const ctx = {
      actionTarget: () => ({ action: 'nativeScriptHandleAction:', target: {} }),
      retain: jest.fn(),
    };
    const existingStart = { title: 'existing-start' };
    const existingEnd = { title: 'existing-end' };

    const items = __nativeScriptCreateHeaderBarButtonItemsForTests(
      [
        {
          index: 1,
          onPress: jest.fn(),
          title: 'inserted-middle',
          type: 'button',
        },
        {
          index: 99,
          onPress: jest.fn(),
          title: 'appended',
          type: 'button',
        },
        {
          onPress: jest.fn(),
          title: 'missing-index-inserts-at-zero',
          type: 'button',
        },
      ] as any,
      [existingStart, existingEnd],
      ctx,
    ) as { title: string }[];

    expect(items.map(item => item.title)).toEqual([
      'missing-index-inserts-at-zero',
      'existing-start',
      'inserted-middle',
      'existing-end',
      'appended',
    ]);
    expect(stackSource).toContain('insertHeaderBarButtonItem');
    (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
  });

  it('ports iOS header subviews into UINavigationItem custom views', () => {
    expect(screenStackHeaderConfigSource).toContain(
      'NativeScriptRuntime.defineUIKitContainer',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'registerNativeScriptHeaderSubview',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'notifyNativeScriptHeaderSubviewChanged',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'nativeScriptHeaderSubviewOrder',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'withNativeScriptHeaderSubviewOrder',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'nativeScriptBackImageSource={backImageSource}',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'onHostReady={notifyReady}',
    );
    expect(screenStackHeaderConfigSource).not.toContain(
      '{ type: _type, ...props }',
    );
    expect(stackSource).toContain('function configureHeaderSubviewViews');
    expect(stackSource).toContain(
      'navigationItem.titleView = record.nativeView',
    );
    expect(stackSource).toContain('initWithCustomView(customView)');
    expect(stackSource).toContain('function headerSubviewBarButtonCustomView');
    expect(stackSource).toContain('function backButtonImageForScreen');
    expect(stackSource).toContain('setBackIndicatorImageOnAppearance');
    expect(stackSource).toContain(
      'Upstream RNSScreenStackHeaderSubview wraps left/right custom views on iOS',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'NativeScriptScreenHeaderSearchBarContext.Provider',
    );
    expect(searchBarSource).toContain("debugName: 'RNSSearchBar.NativeScript'");
    expect(searchBarSource).toContain('UISearchController.alloc()');
    expect(searchBarSource).toContain(
      'NATIVESCRIPT_PORT_DEVIATION: upstream RNSSearchBar implements',
    );
    expect(searchBarSource).toContain('`+shouldBeRecycled` as `NO`');
    expect(searchBarSource).toContain(
      'do not add module-level reuse/caching for search bars',
    );
    expect(searchBarSource).toContain(
      '(ctx as any).delegate(searchController.searchBar',
    );
    expect(searchBarSource).toContain(
      'function toggleNativeScriptSearchBarCancelButton',
    );
    expect(searchBarSource).toContain(
      'toggleNativeScriptSearchBarCancelButton(view, flag)',
    );
    const toggleCancelButtonSource = searchBarSource.slice(
      searchBarSource.indexOf('toggleCancelButton: (flag: boolean) => {'),
      searchBarSource.indexOf('clearText: () => {'),
    );
    expect(toggleCancelButtonSource).not.toContain(
      'setSearchBarCancelButton(view, flag)',
    );
    expect(searchBarSource).toContain('registerNativeScriptHeaderSubview');
    expect(searchBarSource).toContain('cancelNativeScriptSearchBarCommand');
    expect(stackSource).toContain(
      'navigationItem.searchController = record.searchController',
    );
    expect(stackSource).toContain('navigationItem.hidesSearchBarWhenScrolling');
    expect(stackSource).toContain('preferredSearchBarPlacement');
    expect(stackSource).toContain('searchBarPlacementAllowsToolbarIntegration');
    expect(stackSource).toContain('navigationItem.searchController = null');
    expect(stackSource).not.toContain(
      'NATIVESCRIPT_PORT_DEVIATION: upstream attaches RNSSearchBar.controller',
    );

    const subviewIndex = stackSource.indexOf(
      'configureHeaderSubviewViews(navigationItem, props);',
    );
    const titleIndex = stackSource.indexOf(
      "navigationItem.title = headerConfig?.title ?? '';",
    );
    const barItemsIndex = stackSource.indexOf(
      'configureHeaderBarButtonItems(navigationItem, headerConfig, ctx);',
    );

    expect(subviewIndex).toBeGreaterThan(-1);
    expect(titleIndex).toBeGreaterThan(-1);
    expect(barItemsIndex).toBeGreaterThan(-1);
    expect(subviewIndex).toBeLessThan(titleIndex);
    expect(titleIndex).toBeLessThan(barItemsIndex);
    expect(
      stackSource.indexOf('function headerSubviewBarButtonCustomView'),
    ).toBeLessThan(
      stackSource.indexOf('function createHeaderSubviewBarButtonItem'),
    );
  });

  it('ports RNSScreenStackView header hit testing for oversized left/right subviews', () => {
    expect(stackSource).toContain('const STACK_CONTAINER_VIEW_CLASS_KEY');
    expect(stackSource).toContain(
      'class RNSScreenStackNativeScriptView extends UIView',
    );
    expect(stackSource).toContain('hitTestWithEvent(point: any, event: any)');
    expect(stackSource).toContain('hitTestHeaderSubviewForPoint');
    expect(stackSource).toContain(
      'CGRectContainsPoint(navigationBar.frame, point)',
    );
    expect(stackSource).toContain(
      'const convertedPoint = stackView.convertPointToView',
    );
    expect(stackSource).toContain(
      'record.nativeView.hitTestWithEvent(convertedPoint, event)',
    );
    expect(stackSource).toContain(
      'controller.__nativeScriptStackContainerView = containerView',
    );
    expect(stackSource).toContain('containerView.addSubview(navigationView)');
    expect(stackSource).toContain(
      'controller.__nativeScriptEmbeddedNavigationView = navigationView',
    );
    expect(stackSource).toContain('hostView(controller) {');
    expect(stackSource).toContain(
      'return controller.__nativeScriptStackContainerView',
    );
  });

  it('installs NativeScript search bars into UINavigationItem like RNSScreenStackHeaderConfig', () => {
    const nativeApi = ((
      global as Record<string, unknown>
    ).__nativeScriptNativeApi = {
      UIDevice: {
        currentDevice: {
          systemVersion: '26.5',
        },
      },
      UINavigationItemSearchBarPlacement: {
        Automatic: 'automatic',
        Inline: 'inline',
        Stacked: 'stacked',
        Integrated: 'integrated',
        IntegratedButton: 'integratedButton',
        IntegratedCentered: 'integratedCentered',
      },
    });

    (global as Record<string, unknown>).__rnsNativeScriptHeaderSubviewRegistry =
      undefined;

    const searchController = { id: 'search-controller' };
    const navigationItem: any = {
      hidesSearchBarWhenScrolling: undefined,
      preferredSearchBarPlacement: undefined,
      searchBarPlacementAllowsToolbarIntegration: undefined,
      searchController: { id: 'previous' },
    };

    __nativeScriptRegisterHeaderSubviewForTests(
      {
        allowToolbarIntegration: false,
        hideWhenScrolling: false,
        order: 0,
        placement: 'integratedButton',
        screenId: 'screen-a',
        searchController,
        subviewId: 'search',
        type: 'searchBar',
      },
      { id: 'host-view' },
    );

    __nativeScriptConfigureHeaderSubviewViewsForTests(navigationItem, {
      screenId: 'screen-a',
    } as any);

    expect(navigationItem.searchController).toBe(searchController);
    expect(navigationItem.hidesSearchBarWhenScrolling).toBe(false);
    expect(navigationItem.preferredSearchBarPlacement).toBe(
      nativeApi.UINavigationItemSearchBarPlacement.IntegratedButton,
    );
    expect(navigationItem.searchBarPlacementAllowsToolbarIntegration).toBe(
      false,
    );

    __nativeScriptRegisterHeaderSubviewForTests(
      {
        allowToolbarIntegration: true,
        hideWhenScrolling: true,
        order: 0,
        placement: 'stacked',
        screenId: 'screen-a',
        searchController,
        subviewId: 'search',
        type: 'searchBar',
      },
      { id: 'host-view' },
    );

    __nativeScriptConfigureHeaderSubviewViewsForTests(navigationItem, {
      screenId: 'screen-a',
    } as any);

    expect(navigationItem.hidesSearchBarWhenScrolling).toBe(true);
    expect(navigationItem.preferredSearchBarPlacement).toBe(
      nativeApi.UINavigationItemSearchBarPlacement.Stacked,
    );
    expect(navigationItem.searchBarPlacementAllowsToolbarIntegration).toBe(
      false,
    );

    __nativeScriptUnregisterHeaderSubviewForTests('screen-a', 'search');
    __nativeScriptConfigureHeaderSubviewViewsForTests(navigationItem, {
      screenId: 'screen-a',
    } as any);

    expect(navigationItem.searchController).toBe(null);

    (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
  });

  it('ports custom back button images into UINavigationBarAppearance', () => {
    (global as Record<string, unknown>).__rnsNativeScriptHeaderSubviewRegistry =
      undefined;

    const backImage = { id: 'back-image' };
    const appearanceRecords: any[] = [];
    const createAppearance = () => {
      const appearance: any = {
        configureWithOpaqueBackground: jest.fn(),
        setBackIndicatorImageTransitionMaskImage: jest.fn((image, mask) => {
          appearance.backIndicatorImage = image;
          appearance.backIndicatorTransitionMaskImage = mask;
        }),
      };
      appearanceRecords.push(appearance);
      return appearance;
    };

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      NSArray: {
        arrayWithArray: (items: unknown[]) => items,
      },
      UIImage: {
        imageNamed: (name: string) =>
          name === 'back-chevron' ? backImage : null,
      },
      UINavigationBarAppearance: {
        alloc: () => ({
          init: () => createAppearance(),
          initWithBarAppearance: (appearance: any) => {
            const copy = createAppearance();
            copy.copiedFrom = appearance;
            return copy;
          },
        }),
      },
      UIViewAutoresizing: {
        FlexibleHeight: 16,
        FlexibleWidth: 2,
      },
    };

    __nativeScriptRegisterHeaderSubviewForTests(
      {
        backImageSource: { uri: 'back-chevron' },
        order: 0,
        screenId: 'screen-a',
        subviewId: 'back',
        type: 'back',
      },
      { id: 'host-view' },
    );

    const navigationBar: any = {};
    const navigationController: any = {
      navigationBar,
      view: { autoresizingMask: 0 },
      viewControllers: [
        {
          __nativeScriptScreenId: 'screen-a',
          navigationItem: {},
          view: { autoresizingMask: 0 },
        },
      ],
    };

    __nativeScriptConfigureNavigationAppearanceForTests(
      navigationController,
      {},
      {},
    );

    expect(navigationBar.standardAppearance.backIndicatorImage).toBe(backImage);
    expect(
      navigationBar.standardAppearance.backIndicatorTransitionMaskImage,
    ).toBe(backImage);
    expect(
      navigationBar.standardAppearance.setBackIndicatorImageTransitionMaskImage,
    ).toHaveBeenCalledWith(backImage, backImage);
    expect(navigationBar.scrollEdgeAppearance.backIndicatorImage).toBe(
      backImage,
    );

    __nativeScriptUnregisterHeaderSubviewForTests('screen-a', 'back');
    __nativeScriptConfigureNavigationAppearanceForTests(
      navigationController,
      {},
      {},
    );

    expect(navigationBar.standardAppearance.backIndicatorImage).toBe(null);
    expect(
      navigationBar.standardAppearance.backIndicatorTransitionMaskImage,
    ).toBe(null);

    (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
  });

  it('ports RNSSearchBar as a NativeScript UISearchController owner', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();
    (global as Record<string, unknown>).__rnsNativeScriptHeaderSubviewRegistry =
      undefined;

    const searchBar: any = {
      becomeFirstResponder: jest.fn(),
      resignFirstResponder: jest.fn(),
      searchTextField: {},
      setAutocapitalizationType: jest.fn(value => {
        searchBar.autocapitalizationType = value;
      }),
      setPlaceholder: jest.fn(value => {
        searchBar.placeholder = value;
      }),
      setShowsCancelButton: jest.fn((flag, animated) => {
        searchBar.showsCancelButton = flag;
        searchBar.showsCancelButtonAnimated = animated;
      }),
      setText: jest.fn(value => {
        searchBar.text = value;
      }),
      setTintColor: jest.fn(value => {
        searchBar.tintColor = value;
      }),
      setValueForKey: jest.fn((value, key) => {
        searchBar[key] = value;
      }),
      text: 'initial',
    };
    const searchController: any = {
      active: true,
      automaticallyShowsCancelButton: false,
      searchBar,
    };

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UISearchBarDelegate: 'UISearchBarDelegate',
      UISearchController: {
        alloc: () => ({
          initWithSearchResultsController: () => searchController,
        }),
      },
      UITextAutocapitalizationType: {
        AllCharacters: 'characters',
        None: 'none',
        Sentences: 'sentences',
        Words: 'words',
      },
      UIColor: {
        clearColor: 'clear',
      },
      UIView: {
        alloc: () => ({
          init: () => ({
            addSubview: jest.fn(),
          }),
        }),
      },
    };

    jest.requireActual('../../SearchBar');
    const searchBarDefinition = NativeScriptRuntime.__getDefinitions().find(
      (definition: { debugName?: string }) =>
        definition.debugName === 'RNSSearchBar.NativeScript',
    );
    expect(searchBarDefinition).toBeTruthy();

    const emitted: [string, unknown][] = [];
    const disposed: (() => void)[] = [];
    const ctx = {
      delegate: (object: any, _protocol: unknown, implementation: any) => {
        object.delegate = implementation;
        return implementation;
      },
      dispose: (callback: () => void) => {
        disposed.push(callback);
      },
      emit: (eventName: string, payload: unknown) => {
        emitted.push([eventName, payload]);
      },
      retain: (value: unknown) => value,
      release: jest.fn(),
    };
    const view = searchBarDefinition.create(ctx);

    searchBarDefinition.mounted(
      view,
      {
        allowToolbarIntegration: false,
        autoCapitalize: 'words',
        cancelButtonText: 'Stop',
        hideNavigationBar: 'false',
        hideWhenScrolling: false,
        obscureBackground: 'true',
        placement: 'integrated',
        placeholder: 'Find',
        screenId: 'screen-a',
        subviewId: 'search',
      },
      ctx,
    );

    const registry = (global as any).__rnsNativeScriptHeaderSubviewRegistry;
    expect(view.searchController).toBe(searchController);
    expect(searchBar.delegate).toBeTruthy();
    expect(searchController.obscuresBackgroundDuringPresentation).toBe(true);
    expect(searchController.hidesNavigationBarDuringPresentation).toBe(false);
    expect(searchBar.autocapitalizationType).toBe('words');
    expect(searchBar.placeholder).toBe('Find');
    expect(searchBar.cancelButtonText).toBe('Stop');
    expect(registry['screen-a'].search.searchController).toBe(searchController);
    expect(registry['screen-a'].search.hideWhenScrolling).toBe(false);
    expect(registry['screen-a'].search.placement).toBe('integrated');
    expect(registry['screen-a'].search.allowToolbarIntegration).toBe(false);

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    searchBarDefinition.update(
      view,
      {
        screenId: 'screen-a',
        subviewId: 'search',
      },
      ctx,
    );
    expect(warnSpy).toHaveBeenCalledWith(
      '[RNScreens] Dynamically restoring obscureBackground to default native behavior is unsupported.',
    );
    expect(warnSpy).toHaveBeenCalledWith(
      '[RNScreens] Dynamically restoring hideNavigationBar to default native behavior is unsupported.',
    );
    warnSpy.mockClear();
    searchBarDefinition.update(
      view,
      {
        screenId: 'screen-a',
        subviewId: 'search',
      },
      ctx,
    );
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();

    searchBar.delegate.searchBarTextDidBeginEditing(searchBar);
    searchBar.text = 'needle';
    searchBar.delegate.searchBarSearchButtonClicked(searchBar);
    searchBar.delegate.searchBarCancelButtonClicked(searchBar);

    expect(emitted).toEqual([
      ['onSearchFocus', { nativeEvent: {} }],
      ['onSearchButtonPress', { nativeEvent: { text: 'needle' } }],
      ['onCancelButtonPress', { nativeEvent: {} }],
      ['onChangeText', { nativeEvent: { text: '' } }],
    ]);
    expect(searchBar.text).toBe('');

    disposed.forEach(callback => callback());
    searchBarDefinition.dispose(
      view,
      {
        screenId: 'screen-a',
        subviewId: 'search',
      },
      ctx,
    );
    expect(
      (global as any).__rnsNativeScriptHeaderSubviewRegistry?.['screen-a'],
    ).toBeUndefined();
    (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
  });

  it('matches react-native-screens native push/pop ownership', () => {
    const animatePopSource = stackSource.slice(
      stackSource.indexOf('function animateStackPop'),
      stackSource.indexOf('function setNavigationControllerViewControllers'),
    );

    expect(stackSource).toContain(
      'parent.pushViewControllerAnimated(controller, true)',
    );
    expect(stackSource).toContain(
      'parent.setViewControllersAnimated(\n        createArray(controllersBeforePush),\n        false',
    );
    expect(animatePopSource).toMatch(
      /parent\.setViewControllersAnimated\(\s*createArray\(\[\.\.\.controllers, previousTopController\]\),\s*false/,
    );
    expect(animatePopSource).toContain(
      'parent.popViewControllerAnimated(true)',
    );
    expect(animatePopSource).not.toContain('popToRootViewControllerAnimated');
    expect(animatePopSource).not.toContain('popToViewControllerAnimated');
  });

  it('ports RNSScreenStackAnimator through UIViewControllerAnimatedTransitioning', () => {
    expect(stackSource).toContain(
      'const RNS_DEFAULT_TRANSITION_DURATION_SECONDS = 0.5',
    );
    expect(stackSource).toContain('function stackAnimationForProps');
    expect(stackSource).toContain('function transitionDurationForProps');
    expect(stackSource).toContain('function isCustomStackAnimation');
    expect(stackSource).toContain('function screenStackAnimatorClass()');
    expect(stackSource).toContain('function createScreenStackAnimator(');
    expect(stackSource).toContain(
      'props?: Readonly<NativeScriptScreenStackItemProps>',
    );
    expect(stackSource).toContain('UIViewControllerAnimatedTransitioning');
    expect(stackSource).toContain("name: 'RNSScreenStackAnimator'");
    expect(stackSource).toContain('protocols: [protocol]');
    expect(stackSource).toContain(
      'NSObject.extend with UIViewControllerAnimatedTransitioning is required for RNSScreenStackAnimator parity',
    );
    expect(stackSource).toContain(
      'transitionDuration(_transitionContext: any)',
    );
    expect(stackSource).toContain('animateTransition(transitionContext: any)');
    expect(stackSource).toContain('animateSimplePushTransition');
    expect(stackSource).toContain('animateSlideFromLeftTransition');
    expect(stackSource).toContain('animateFadeTransition');
    expect(stackSource).toContain('animateSlideFromBottomTransition');
    expect(stackSource).toContain('animateFadeFromBottomTransition');
    expect(stackSource).toContain('animateNoneTransition');
    expect(stackSource).toContain(
      'navigationControllerAnimationControllerForOperationFromViewControllerToViewController',
    );
  });

  it('requires UIViewPropertyAnimator instead of silently falling back for custom stack animations', () => {
    expect(stackSource).toContain(
      'UIViewPropertyAnimator is required for RNSScreenStackAnimator parity',
    );
    expect(stackSource).not.toContain(
      'preserves transition completion semantics',
    );
    expect(stackSource).not.toContain('but cannot be interactively scrubbed');
  });

  it('ports RNSPercentDrivenInteractiveTransition for gesture-driven stack animations', () => {
    expect(stackSource).toContain(
      'function percentDrivenInteractiveTransitionClass()',
    );
    expect(stackSource).toContain(
      'function createPercentDrivenInteractiveTransition(',
    );
    expect(stackSource).toContain('UIPercentDrivenInteractiveTransition');
    expect(stackSource).toContain(
      "name: 'RNSPercentDrivenInteractiveTransition'",
    );
    expect(stackSource).toContain(
      'updateInteractiveTransition(percentComplete',
    );
    expect(stackSource).toContain('finishInteractiveTransition()');
    expect(stackSource).toContain('cancelInteractiveTransition()');
    expect(stackSource).toContain('setFractionComplete');
    expect(stackSource).toContain('setReversed');
    expect(stackSource).toContain(
      'continueAnimationWithTimingParametersDurationFactor',
    );
    expect(stackSource).toContain(
      'navigationControllerInteractionControllerForAnimationController',
    );
    expect(stackSource).toContain('registry.stackInteractionControllers');
    expect(stackSource).toContain('registry.stackCustomAnimationOnSwipe');
  });

  it('ports RNSScreen prevented native pop cancellation through the interaction controller delegate', () => {
    const interactionDelegateSource = stackSource.slice(
      stackSource.indexOf(
        'navigationControllerInteractionControllerForAnimationController',
      ),
      stackSource.indexOf('navigationControllerWillShowViewControllerAnimated'),
    );
    const animationDelegateSource = stackSource.slice(
      stackSource.indexOf(
        'navigationControllerAnimationControllerForOperationFromViewControllerToViewController',
      ),
      stackSource.indexOf(
        'navigationControllerInteractionControllerForAnimationController',
      ),
    );

    expect(stackSource).toContain('function scheduleNativeDismissCancel(');
    expect(stackSource).toContain('stackPendingDismissCancels');
    expect(animationDelegateSource).toContain(
      'registry.stackPendingDismissCancels[ctx.props.stackId]',
    );
    expect(interactionDelegateSource).toContain(
      'createPercentDrivenInteractiveTransition(ctx)',
    );
    expect(interactionDelegateSource).toContain('scheduleNativeDismissCancel(');
    expect(stackSource).toContain('cancelInteractiveTransition?.()');
    expect(stackSource).toContain('releaseStackInteractionController(');
    expect(stackSource).toContain(
      'reconcileStack(stackId, registry, ctx, true)',
    );
    expect(stackSource).toContain(
      'emitNativeDismissCancelledForController(fromController, dismissCount)',
    );
  });

  it('documents every current mechanical deviation from upstream native stack behavior', () => {
    const nativeStackSources = `${screenStackItemSource}\n${stackSource}`;
    const expectedDeviationReasons = [
      "upstream's inner modal Screen does not need\n      // an explicit JS screenId",
      'upstream just skips assigning a custom\n      // item. The TS port clears only the item it owns',
      'upstream also mirrors UINavigationBar layout\n  // into RNSScreenStackHeaderConfig',
      'upstream calls\n  // screenView.reactSuperview.updateContainer() from RNSScreen.mm here',
      'upstream mutates the shared\n    // UINavigationBar inside the transition coordinator animation block',
      'upstream queues updateContainer after RN\n  // child layout with dispatch_async',
      'upstream finishes stack transitions from\n  // UINavigationControllerDelegate didShow',
      'React owns child element lifetime in the TS\n  // port',
      'upstream re-reads from/to views from\n        // transitionCoordinator',
      'upstream receives the exact\n          // RNSScreen controller in didShow',
      'generated ObjC props carry default\n    // `automatic` edge values',
    ];

    expect(
      nativeStackSources.match(/NATIVESCRIPT_PORT_DEVIATION:/g) ?? [],
    ).toHaveLength(expectedDeviationReasons.length);

    for (const reason of expectedDeviationReasons) {
      expect(nativeStackSources).toContain(
        `NATIVESCRIPT_PORT_DEVIATION: ${reason}`,
      );
    }
  });

  it('delegates both UIKit back-swipe recognizers when iOS 26 exposes content pop', () => {
    expect(stackSource).toContain(
      'function installNativeBackGestureDelegateForRecognizer',
    );
    expect(stackSource).toContain(
      'navigationController?.interactivePopGestureRecognizer',
    );
    expect(stackSource).toContain(
      'navigationController?.interactiveContentPopGestureRecognizer',
    );
    expect(stackSource).toMatch(
      /installNativeBackGestureDelegateForRecognizer\(\s*navigationController,\s*popGesture,\s*ctx,\s*'native-pop',\s*\);/,
    );
    expect(stackSource).toMatch(
      /installNativeBackGestureDelegateForRecognizer\(\s*navigationController,\s*contentGesture,\s*ctx,\s*'native-content-pop',\s*\);/,
    );
  });

  it('matches upstream shouldReceiveTouch gating for stack back gestures', () => {
    const baseProps = {
      gestureEnabled: true,
      stackAnimation: 'default',
      stackPresentation: 'push',
    };
    const customProps = {
      ...baseProps,
      customAnimationOnSwipe: true,
      fullScreenSwipeEnabled: true,
      stackAnimation: 'fade',
    };

    expect(
      __shouldReceiveNativeScriptStackBackGestureForTests(
        baseProps as any,
        2,
        'native-pop',
      ),
    ).toBe(true);
    expect(
      __shouldReceiveNativeScriptStackBackGestureForTests(
        { ...baseProps, gestureEnabled: false } as any,
        2,
        'native-pop',
      ),
    ).toBe(false);
    expect(
      __shouldReceiveNativeScriptStackBackGestureForTests(
        { ...baseProps, stackPresentation: 'modal' } as any,
        2,
        'native-pop',
      ),
    ).toBe(false);
    expect(
      __shouldReceiveNativeScriptStackBackGestureForTests(
        baseProps as any,
        1,
        'native-pop',
      ),
    ).toBe(false);
    expect(
      __shouldReceiveNativeScriptStackBackGestureForTests(
        baseProps as any,
        2,
        'native-content-pop',
      ),
    ).toBe(true);
    expect(
      __shouldReceiveNativeScriptStackBackGestureForTests(
        { ...baseProps, fullScreenSwipeEnabled: true } as any,
        2,
        'native-content-pop',
      ),
    ).toBe(true);
    expect(
      __shouldReceiveNativeScriptStackBackGestureForTests(
        { ...baseProps, fullScreenSwipeEnabled: false } as any,
        2,
        'native-content-pop',
      ),
    ).toBe(false);
    expect(
      __shouldReceiveNativeScriptStackBackGestureForTests(
        {
          ...baseProps,
          fullScreenSwipeEnabled: false,
          swipeDirection: 'vertical',
        } as any,
        2,
        'native-content-pop',
      ),
    ).toBe(false);
    expect(
      __shouldReceiveNativeScriptStackBackGestureForTests(
        customProps as any,
        2,
        'native-content-pop',
      ),
    ).toBe(false);
    expect(
      __shouldReceiveNativeScriptStackBackGestureForTests(
        customProps as any,
        2,
        'custom-pan',
      ),
    ).toBe(true);
    expect(
      __shouldReceiveNativeScriptStackBackGestureForTests(
        { ...baseProps, fullScreenSwipeEnabled: true } as any,
        2,
        'custom-pan',
      ),
    ).toBe(false);
  });

  it('repairs stale hosted RN wrapper frames after UIKit modal presentation', () => {
    expect(stackSource).toContain('const isModalNavigationController');
    expect(stackSource).toContain(
      'navigationController.presentationController?.containerView?.bounds',
    );
    expect(stackSource).toContain(
      'function shouldFillHostedSubview(rootView: any, subview: any, depth: number)',
    );
    expect(stackSource).toContain(
      'RN host wrappers expose the intended content width while keeping a stale',
    );
    expect(stackSource).toContain('contentWidth >= parentWidth - 2');
    expect(stackSource).toContain('childWidth < parentWidth - 2');
    expect(stackSource).toContain(
      'const isScrollView = isNativeScrollView(rootView)',
    );
    expect(stackSource).toContain('scrollContentWidth > scrollWidth + 2');
    expect(stackSource).toContain(
      'rootView.contentSize = sizeWithWidth(rootView.contentSize, scrollWidth)',
    );
    expect(stackSource).toContain('layoutHostedSubviewChain(subview, 0)');
    expect(stackSource).toContain(
      'shouldFillHostedSubview(rootView, subview, depth)',
    );
    expect(stackSource).toContain('depth <= 1');
    expect(stackSource).toContain('childWidth <= 0');
    const layoutHostedReactSubviewsSource = stackSource.slice(
      stackSource.indexOf('function layoutHostedReactSubviews'),
      stackSource.indexOf('function refreshNavigationControllerHostedViews'),
    );
    expect(
      layoutHostedReactSubviewsSource.indexOf(
        'NativeScriptRuntime.refreshUIKitHostView(rootView);',
      ),
    ).toBeLessThan(
      layoutHostedReactSubviewsSource.indexOf(
        'subview.frame = rootView.bounds;',
      ),
    );
  });

  it('matches upstream scroll-view priority for stack back gesture delegates', () => {
    const UIScrollView = {};
    const UIScreenEdgePanGestureRecognizer = {};
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIGestureRecognizerState: {
        Began: 1,
      },
      UIScreenEdgePanGestureRecognizer,
      UIScrollView,
    };

    const makeScrollPan = (contentWidth: number, frameWidth = 100) => {
      const scrollView: any = {
        contentSize: { width: contentWidth },
        frame: { size: { width: frameWidth } },
        isKindOfClass: (klass: unknown) => klass === UIScrollView,
      };
      const panGesture: any = {
        state: 0,
        view: scrollView,
      };
      scrollView.panGestureRecognizer = panGesture;

      return panGesture;
    };
    const scrollPan = makeScrollPan(200);
    const verticalOnlyScrollPan = makeScrollPan(100);
    const customPan = {
      state: 0,
      translationInView: () => ({ x: 0 }),
      view: {},
    };
    const backCustomPan = {
      state: 0,
      translationInView: () => ({ x: 12 }),
      view: {},
    };
    const beganCustomPan = {
      state: 1,
      translationInView: () => ({ x: 0 }),
      view: {},
    };
    const edgeGesture = {
      isKindOfClass: (klass: unknown) =>
        klass === UIScreenEdgePanGestureRecognizer,
    };

    expect(
      __nativeScriptStackGestureDelegateDecisionForTests.shouldRecognizeSimultaneously(
        'custom-pan',
        customPan,
        scrollPan,
        2,
      ),
    ).toBe(true);
    expect(
      __nativeScriptStackGestureDelegateDecisionForTests.shouldRecognizeSimultaneously(
        'custom-pan',
        backCustomPan,
        scrollPan,
        2,
      ),
    ).toBe(false);
    expect(
      __nativeScriptStackGestureDelegateDecisionForTests.shouldRecognizeSimultaneously(
        'custom-pan',
        beganCustomPan,
        scrollPan,
        2,
      ),
    ).toBe(false);
    expect(
      __nativeScriptStackGestureDelegateDecisionForTests.shouldRecognizeSimultaneously(
        'native-content-pop',
        customPan,
        scrollPan,
        2,
      ),
    ).toBe(false);
    expect(
      __nativeScriptStackGestureDelegateDecisionForTests.shouldRequireFailure(
        'native-content-pop',
        scrollPan,
      ),
    ).toBe(true);
    expect(
      __nativeScriptStackGestureDelegateDecisionForTests.shouldRequireFailure(
        'native-content-pop',
        verticalOnlyScrollPan,
      ),
    ).toBe(false);
    expect(
      __nativeScriptStackGestureDelegateDecisionForTests.shouldRequireFailure(
        'custom-pan',
        scrollPan,
      ),
    ).toBe(false);
    expect(
      __nativeScriptStackGestureDelegateDecisionForTests.shouldBeRequiredToFail(
        'custom-edge',
        edgeGesture,
        scrollPan,
      ),
    ).toBe(true);
    expect(
      __nativeScriptStackGestureDelegateDecisionForTests.shouldBeRequiredToFail(
        'native-content-pop',
        edgeGesture,
        scrollPan,
      ),
    ).toBe(false);
  });

  it('cancels parent RN touches when UIKit back gestures begin', () => {
    let cancelCount = 0;
    const view = {
      rnscreens_findTouchHandlerInAncestorChain: () => ({
        rnscreens_cancelTouches: () => {
          cancelCount += 1;
        },
      }),
    };

    expect(__nativeScriptStackCancelTouchesInParentForTests(view)).toBe(true);
    expect(cancelCount).toBe(1);
    expect(__nativeScriptStackCancelTouchesInParentForTests({})).toBe(false);
    expect(stackSource).toContain('function cancelTouchesInParent');
    expect(stackSource).toContain(
      'cancelTouchesInParent(navigationController.view);',
    );
    expect(stackSource).toContain('cancelTouchesInParent(view);');
  });

  it('matches upstream custom edge selection for RTL and slide-from-left gestures', () => {
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIRectEdge: {
        Left: 2,
        Right: 8,
      },
      UISemanticContentAttribute: {
        ForceRightToLeft: 4,
      },
    };

    const leftEdge = { edges: 2 };
    const rightEdge = { edges: 8 };
    const ltrView = { semanticContentAttribute: 0 };
    const rtlView = { semanticContentAttribute: 4 };
    const defaultAnimation = { stackAnimation: 'default' };
    const slideFromLeft = { stackAnimation: 'slide_from_left' };
    const usesCorrectEdge =
      __nativeScriptStackGestureDelegateDecisionForTests.usesCorrectEdge;

    expect(usesCorrectEdge(leftEdge, ltrView, defaultAnimation as any)).toBe(
      true,
    );
    expect(usesCorrectEdge(rightEdge, ltrView, defaultAnimation as any)).toBe(
      false,
    );
    expect(usesCorrectEdge(leftEdge, rtlView, defaultAnimation as any)).toBe(
      false,
    );
    expect(usesCorrectEdge(rightEdge, rtlView, defaultAnimation as any)).toBe(
      true,
    );
    expect(usesCorrectEdge(leftEdge, ltrView, slideFromLeft as any)).toBe(true);
    expect(usesCorrectEdge(rightEdge, ltrView, slideFromLeft as any)).toBe(
      true,
    );
    expect(usesCorrectEdge(leftEdge, rtlView, slideFromLeft as any)).toBe(true);
    expect(usesCorrectEdge(rightEdge, rtlView, slideFromLeft as any)).toBe(
      true,
    );
  });

  it('matches upstream custom-edge begin gating without gesture response distance', () => {
    const addSwipeGestureSource = stackSource.slice(
      stackSource.indexOf('function addStackSwipeGesture'),
      stackSource.indexOf('ctx.gestureAction(gesture'),
    );

    expect(addSwipeGestureSource).toMatch(
      /fullWidth\s*&&\s*!gestureResponseDistanceAllows/,
    );
    expect(addSwipeGestureSource).toMatch(
      /!fullWidth\s*&&\s*!stackBackGestureUsesCorrectEdge/,
    );
    expect(addSwipeGestureSource).not.toMatch(
      /viewControllerCount < 2 \|\|\s*!gestureResponseDistanceAllows/,
    );
  });

  it('ports UIKit stack back gesture failure delegate methods', () => {
    expect(stackSource).toContain(
      'gestureRecognizerShouldRecognizeSimultaneouslyWithGestureRecognizer',
    );
    expect(stackSource).toContain(
      'gestureRecognizerShouldRequireFailureOfGestureRecognizer',
    );
    expect(stackSource).toContain(
      'gestureRecognizerShouldBeRequiredToFailByGestureRecognizer',
    );
    expect(stackSource).toContain('function isScrollViewPanGestureRecognizer');
    expect(stackSource).toContain('function scrollViewHasHorizontalPart');
  });

  it('matches upstream RTL mirroring for gesture response distance', () => {
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UISemanticContentAttribute: {
        ForceRightToLeft: 4,
      },
    };

    const props = {
      gestureResponseDistance: {
        bottom: -1,
        end: -1,
        start: 20,
        top: -1,
      },
    };
    const ltrView = {
      frame: { size: { width: 100 } },
      semanticContentAttribute: 0,
    };
    const rtlView = {
      frame: { size: { width: 100 } },
      semanticContentAttribute: 4,
    };
    const gestureAt = (x: number) => ({
      locationInView: () => ({ x, y: 0 }),
    });

    expect(
      __nativeScriptStackGestureResponseDistanceAllowsForTests(
        gestureAt(10),
        ltrView,
        props as any,
      ),
    ).toBe(false);
    expect(
      __nativeScriptStackGestureResponseDistanceAllowsForTests(
        gestureAt(30),
        ltrView,
        props as any,
      ),
    ).toBe(true);
    expect(
      __nativeScriptStackGestureResponseDistanceAllowsForTests(
        gestureAt(90),
        rtlView,
        props as any,
      ),
    ).toBe(false);
    expect(
      __nativeScriptStackGestureResponseDistanceAllowsForTests(
        gestureAt(60),
        rtlView,
        props as any,
      ),
    ).toBe(true);
  });

  it('matches upstream RTL mirroring for custom stack swipe metrics', () => {
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UISemanticContentAttribute: {
        ForceRightToLeft: 4,
      },
    };

    const ltrView = {
      bounds: { size: { width: 100 } },
      semanticContentAttribute: 0,
    };
    const rtlView = {
      bounds: { size: { width: 100 } },
      semanticContentAttribute: 4,
    };
    const gesture = (x: number) => ({
      translationInView: () => ({ x, y: 0 }),
      velocityInView: () => ({ x: 0, y: 0 }),
    });

    expect(
      __nativeScriptStackSwipeMetricForTests(gesture(60), ltrView, {
        stackAnimation: 'default',
      } as any),
    ).toMatchObject({
      gestureDistance: 60,
      progress: 0.6,
      shouldFinish: true,
    });
    expect(
      __nativeScriptStackSwipeMetricForTests(gesture(-60), rtlView, {
        stackAnimation: 'default',
      } as any),
    ).toMatchObject({
      gestureDistance: 60,
      progress: 0.6,
      shouldFinish: true,
    });
    expect(
      __nativeScriptStackSwipeMetricForTests(gesture(-60), ltrView, {
        stackAnimation: 'slide_from_left',
      } as any),
    ).toMatchObject({
      gestureDistance: 60,
      progress: 0.6,
      shouldFinish: true,
    });
    expect(
      __nativeScriptStackSwipeMetricForTests(gesture(60), rtlView, {
        stackAnimation: 'slide_from_left',
      } as any),
    ).toMatchObject({
      gestureDistance: 60,
      progress: 0.6,
      shouldFinish: true,
    });
  });

  it('defers reconciliation through UIKit transition coordinator without package-specific runtime helpers', () => {
    expect(stackSource).toContain(
      'coordinator.animateAlongsideTransitionCompletion',
    );
    expect(stackSource).toContain('InteropBlock(');
    expect(stackSource).toContain(
      'NativeScriptRuntime.runtimeInvoker(complete)',
    );
    expect(stackSource).not.toContain('afterUIKitTransition');
    expect(stackSource).not.toContain('coordinator.transitionDuration');
  });

  it('uses transition coordinator completion before timeout watchdogs', () => {
    const fallbackSource = stackSource.slice(
      stackSource.indexOf('function scheduleTransitionFallback'),
      stackSource.indexOf('function shouldApplyStackPropsRevision'),
    );

    expect(fallbackSource).toContain(
      'runAfterTransitionCoordinator(navigationController, complete)',
    );
    expect(fallbackSource).toContain(
      'registry.stackTransitionTokens[stackId] !== token',
    );
    expect(fallbackSource).toContain(
      'registry.stackTransitioning[stackId] !== true',
    );
    expect(fallbackSource).not.toContain('token + 1');
    expect(fallbackSource).toContain(
      'NATIVESCRIPT_PORT_DEVIATION: upstream finishes stack transitions from',
    );
  });

  it('declares worklet helpers before worklets that capture them', () => {
    expect(stackSource.indexOf('function stackAnimationForProps')).toBeLessThan(
      stackSource.indexOf('function modalTransitionStyleForProps'),
    );
    expect(
      stackSource.indexOf('function gestureResponseDistanceAllows'),
    ).toBeLessThan(
      stackSource.indexOf(
        'function installNativeBackGestureDelegateForRecognizer',
      ),
    );
    expect(
      stackSource.indexOf('function scheduledReconcileStack'),
    ).toBeLessThan(
      stackSource.indexOf('function schedulePostTransitionSettle'),
    );
  });

  it('keeps UIKit stack content interactive while transition state gates reconciliation', () => {
    expect(flagsSource).toContain('ios26AllowInteractionsDuringTransition');
    expect(flagsSource).toContain('return true;');
    expect(stackSource).not.toContain('function lockStackInteractions');
    expect(stackSource).not.toContain('function unlockStackInteractions');
    expect(stackSource).not.toContain('stackInteractionLocks');
    expect(stackSource).not.toContain(
      'navigationController.view.userInteractionEnabled = false',
    );
    expect(stackSource).toContain(
      'registry.stackTransitioning[stackId] = true',
    );
    expect(stackSource).toContain(
      'registry.stackPendingReconcileKeys[stackId] = idsKey(availableIds);',
    );
    expect(stackSource).toContain('gesture.cancelsTouchesInView = false');
    expect(stackSource).toContain('gesture.delaysTouchesBegan = false');
    expect(stackSource).toContain('gesture.delaysTouchesEnded = false');
    expect(stackSource).not.toContain('function enableHostedInteraction');
    expect(stackSource).not.toContain('function setViewSubtreeInteraction');
  });

  it('queues JS navigation after a native-driven pop once the popped screen left React state', () => {
    const queueSource = stackSource.slice(
      stackSource.indexOf('function shouldQueueReconcileWhileTransitioning'),
      stackSource.indexOf('function schedulePostTransitionSettle'),
    );
    const reconcileSource = stackSource.slice(
      stackSource.indexOf('function reconcileStack'),
      stackSource.indexOf('const previousKey = registry.stackNativeKeys'),
    );

    expect(queueSource).toContain(
      'registry.stackTransitionNativeDriven[stackId] !== true',
    );
    expect(queueSource).toContain(
      'registry.stackTransitionRequestedFromJS[stackId] === true',
    );
    expect(queueSource).toContain(
      '!screenIdInList(transitionScreenId, availableIds)',
    );
    expect(reconcileSource).toContain(
      'shouldQueueReconcileWhileTransitioning(stackId, registry, availableIds)',
    );
  });

  it('settles hosted views after UIKit stack transitions before applying queued reconciles', () => {
    const settleSource = stackSource.slice(
      stackSource.indexOf('function schedulePostTransitionSettle'),
      stackSource.indexOf('function finishTransition'),
    );

    expect(stackSource).toContain('stackTransitionSettling');
    expect(stackSource).toContain('function schedulePostTransitionSettle');
    expect(settleSource).toContain(
      'NATIVESCRIPT_PORT_DEVIATION: upstream queues updateContainer after RN',
    );
    expect(settleSource).toContain(
      'registry.stackTransitionSettling[stackId] = true',
    );
    expect(settleSource).toContain('setTimeout(settle, 80)');
    expect(settleSource).toContain(
      'registry.stackTransitionSettling[stackId] = undefined',
    );
    expect(settleSource).toContain(
      'scheduledReconcileStack(stackId, registry, ctx, true)',
    );
    expect(settleSource).not.toContain(
      'setNavigationControllerViewControllers',
    );
    expect(stackSource).toContain(
      'if (registry.stackTransitionSettling[stackId])',
    );
    expect(stackSource).toContain(
      'registry.stackPendingReconcileKeys[stackId] = idsKey(availableIds);',
    );
    expect(stackSource).toContain(
      'registry.stackTransitionSettling[props.stackId] = undefined',
    );
  });

  it('does not reapply view controller arrays from unknown UIKit didShow controllers', () => {
    expect(stackSource).toContain(
      'NATIVESCRIPT_PORT_DEVIATION: upstream receives the exact',
    );
    expect(stackSource).toContain('const resolvedScreenIds = !isClosing');
    expect(stackSource).toContain('finishTransition(');
    expect(stackSource).not.toContain('onNativeStackChange');
    expect(stackSource).not.toContain('scheduleStackChange');
    expect(stackSource).not.toContain('applyFallbackControllers');
    expect(stackSource).not.toContain('setTimeout(applyFallbackControllers');
  });

  it('drops stale native host updates that arrive after newer stack renders', () => {
    expect(stackSource).toContain('stackPropRevisions');
    expect(stackSource).toContain('shouldApplyStackPropsRevision');
    expect(stackSource).toContain('renderRevision={renderRevision}');
  });

  it('skips inactive React Navigation routes in the UIKit controller model', () => {
    expect(stackSource).toContain(
      'Direct port of RNSScreenStackView.updateContainer',
    );
    expect(stackSource).toContain(
      '`activityState != RNSActivityStateInactive` guard',
    );
    expect(stackSource).toContain('stackScreenParticipatesInUIKitModel');
    expect(
      __nativeScriptStackScreenParticipatesInUIKitModelForTests(false, 2),
    ).toBe(true);
    expect(
      __nativeScriptStackScreenParticipatesInUIKitModelForTests(false, 1),
    ).toBe(true);
    expect(
      __nativeScriptStackScreenParticipatesInUIKitModelForTests(false, 0),
    ).toBe(false);
    expect(
      __nativeScriptStackScreenParticipatesInUIKitModelForTests(true, 2),
    ).toBe(false);
    expect(
      __nativeScriptStackScreenParticipatesInUIKitModelForTests(true, 0),
    ).toBe(false);
    expect(
      __nativeScriptStackScreenParticipatesInUIKitModelForTests(
        false,
        undefined,
      ),
    ).toBe(true);
    expect(stackSource).toContain(
      'const active = stackScreenParticipatesInUIKitModel',
    );
  });

  it('filters native-removed controllers like RNSScreenStackView.updateContainer', () => {
    const rootController = {};
    const stalePushController = { isRemovedFromParent: () => true };
    const preventedPushController = { isRemovedFromParent: () => true };
    const staleModalController = { isRemovedFromParent: () => true };
    const liveModalController = { isRemovedFromParent: () => false };
    const registry = {
      screens: {
        root: rootController,
        stalePush: stalePushController,
        preventedPush: preventedPushController,
        staleModal: staleModalController,
        liveModal: liveModalController,
      },
      screenProps: {
        root: { stackPresentation: 'push' },
        stalePush: { stackPresentation: 'push' },
        preventedPush: {
          preventNativeDismiss: true,
          stackPresentation: 'push',
        },
        staleModal: { stackPresentation: 'modal' },
        liveModal: { stackPresentation: 'modal' },
      },
    };

    expect(stackSource).toContain('controllersForStackUIKitModelIds');
    expect(stackSource).toContain(
      'Direct port of the push branch in updateContainer',
    );
    expect(stackSource).toContain(
      'Direct port of the modal branch in updateContainer',
    );
    expect(
      __nativeScriptControllersForStackUIKitModelIdsForTests(
        ['root', 'stalePush', 'preventedPush', 'staleModal', 'liveModal'],
        registry as any,
      ),
    ).toEqual({
      availableIds: ['root', 'preventedPush', 'liveModal'],
      controllers: [
        rootController,
        preventedPushController,
        liveModalController,
      ],
    });
  });

  it('compares UIKit controllers by stable identity instead of JS proxy object identity', () => {
    expect(stackSource).toContain('function controllersEqual');
    expect(stackSource).toContain('function controllerScreenId');
    expect(stackSource).toContain(
      'controllersEqual(arrayItem(viewControllers, index), controller)',
    );
    expect(stackSource).toContain(
      '!controllersEqual(arrayItem(viewControllers, index), controllers[index])',
    );
  });

  it('keeps modal presentation as UIKit presentation-controller behavior', () => {
    expect(stackSource).toContain('UIAdaptivePresentationControllerDelegate');
    expect(stackSource).toContain('presentationControllerShouldDismiss(');
    expect(stackSource).toContain('presentationControllerDidAttemptToDismiss(');
    expect(stackSource).toContain('presentationControllerDidDismiss(');
    expect(stackSource).toContain('presentViewControllerAnimatedCompletion');
    expect(stackSource).toContain('dismissViewControllerAnimatedCompletion');
    expect(stackSource).toContain(
      'presenting modals requires presentViewControllerAnimatedCompletion',
    );
    expect(stackSource).toContain(
      'presented modal dismissal requires dismissViewControllerAnimatedCompletion',
    );
    expect(stackSource).toContain(
      "Direct port of RNSScreen.mm's -presentViewController:animated:",
    );
    expect(stackSource).toContain(
      'presentationCoordinatorControllerForController(this)',
    );
    expect(stackSource).not.toContain(
      'runAfterTransitionCoordinator(rootViewController(), present)',
    );
    expect(stackSource).not.toContain('installModalDismissPanGesture');
    expect(stackSource).not.toContain('stackModalDismissPanControllers');
  });

  it('delays detached-screen modal presentation on the local React superview controller', () => {
    const localCoordinatorController = { transitionCoordinator: {} };
    const rootController = { transitionCoordinator: {} };

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIApplication: {
        sharedApplication: {
          keyWindow: {
            rootViewController: rootController,
          },
        },
      },
    };

    expect(
      __nativeScriptPresentationCoordinatorControllerForTests({
        view: {
          reactSuperview: {
            reactViewController: localCoordinatorController,
          },
        },
      }),
    ).toBe(localCoordinatorController);
    expect(
      __nativeScriptPresentationCoordinatorControllerForTests({
        view: {
          reactSuperview: () => ({
            reactViewController: () => localCoordinatorController,
          }),
        },
      }),
    ).toBe(localCoordinatorController);
    expect(
      __nativeScriptPresentationCoordinatorControllerForTests({ view: {} }),
    ).toBe(rootController);
  });

  it('uses the attached NativeScript stack host view for modal presentation readiness', () => {
    const setModalSource = stackSource.slice(
      stackSource.indexOf('function setModalViewControllers'),
      stackSource.indexOf('function screenContentIsReady'),
    );

    expect(stackSource).toContain('function hostViewForController');
    expect(setModalSource).toContain(
      'const navigationHostView = hostViewForController(navigationController);',
    );
    expect(setModalSource).toContain('navigationHostView?.window == null');
    expect(setModalSource).toContain(
      'const changeRootHostView = hostViewForController(changeRootController);',
    );
    expect(setModalSource).toContain('changeRootHostView?.window != null');
  });

  it('ports RNSScreen backdrop tap cancellation for prevented modal dismissals', () => {
    expect(__nativeScriptShouldInstallBackdropTapGestureForTests('modal')).toBe(
      true,
    );
    expect(
      __nativeScriptShouldInstallBackdropTapGestureForTests('pageSheet'),
    ).toBe(true);
    expect(
      __nativeScriptShouldInstallBackdropTapGestureForTests('formSheet'),
    ).toBe(true);
    expect(
      __nativeScriptShouldInstallBackdropTapGestureForTests('transparentModal'),
    ).toBe(false);
    expect(__nativeScriptShouldInstallBackdropTapGestureForTests('push')).toBe(
      false,
    );

    const presentedView = {};
    const controller = {
      presentationController: {
        presentedView,
      },
    };
    const insideTouch = {
      view: {
        isDescendantOfView: jest.fn(candidate => candidate === presentedView),
      },
    };
    const outsideTouch = {
      view: {
        isDescendantOfView: jest.fn(() => false),
      },
    };

    expect(
      __nativeScriptShouldReceiveBackdropTapTouchForTests(
        controller,
        outsideTouch,
        { preventNativeDismiss: true } as any,
      ),
    ).toBe(true);
    expect(
      __nativeScriptShouldReceiveBackdropTapTouchForTests(
        controller,
        insideTouch,
        { preventNativeDismiss: true } as any,
      ),
    ).toBe(false);
    expect(
      __nativeScriptShouldReceiveBackdropTapTouchForTests(
        controller,
        outsideTouch,
        { preventNativeDismiss: false } as any,
      ),
    ).toBe(false);

    const screenControllerSource = stackSource.slice(
      stackSource.indexOf('class RNSScreenNativeScriptController'),
      stackSource.indexOf(
        'NativeClassFunction(RNSScreenNativeScriptController)',
      ),
    );

    expect(stackSource).toContain('function setupBackdropTapGestureRecognizer');
    expect(stackSource).toContain("presentation === 'modal'");
    expect(stackSource).toContain("presentation === 'pageSheet'");
    expect(stackSource).toContain("presentation === 'formSheet'");
    expect(screenControllerSource).toContain(
      'setupBackdropTapGestureRecognizer(',
    );
    expect(stackSource).toContain('UITapGestureRecognizer');
    expect(stackSource).toContain('tap.cancelsTouchesInView = false');
    expect(stackSource).toContain('ctx.gestureAction(tap');
    expect(stackSource).toContain(
      'emitNativeDismissCancelledForController(controller, 1)',
    );
    expect(stackSource).not.toContain('installBackdropTapTurboModuleHelper');
  });

  it('ports RNSScreenStack presented-modal common-root bookkeeping', () => {
    const reconcileModalSource = stackSource.slice(
      stackSource.indexOf('function reconcilePresentedModalStack'),
      stackSource.indexOf('function markNativeScriptScreenContentReady'),
    );
    const setModalSource = stackSource.slice(
      stackSource.indexOf('function setModalViewControllers'),
      stackSource.indexOf('function screenContentIsReady'),
    );

    expect(stackSource).toContain('stackPresentedModalKeys');
    expect(stackSource).toContain('function presentedModalIdsForStack');
    expect(stackSource).toContain('function setPresentedModalIdsForStack');
    expect(stackSource).toContain('function presentedModalCommonRootIndex');
    expect(stackSource).toContain(
      'function hasPresentedModalReshuffleAfterCommonRoot',
    );
    expect(reconcileModalSource).toContain(
      'const modalCommonRootIndex = presentedModalCommonRootIndex',
    );
    expect(reconcileModalSource).toContain(
      'hasPresentedModalReshuffleAfterCommonRoot',
    );
    expect(reconcileModalSource).toContain(
      'Modally presented controllers are being reshuffled, this is not allowed',
    );
    expect(reconcileModalSource).toContain('setModalViewControllers(');
    expect(setModalSource).toContain(
      'let changeRootController = navigationController',
    );
    expect(setModalSource).toContain('let changeRootIndex = 0');
    expect(setModalSource).toContain(
      'setPresentedModalIdsForStack(\n' +
        '      stackId,\n' +
        '      registry,\n' +
        '      previousIds.slice(0, changeRootIndex),\n' +
        '    )',
    );
  });

  it('does not deadlock UIKit modal presentation on the modal host window', () => {
    const refreshReadySource = stackSource.slice(
      stackSource.indexOf('function refreshScreenContentReady'),
      stackSource.indexOf('function reconcilePresentedModalStack'),
    );
    const reconcileModalSource = stackSource.slice(
      stackSource.indexOf('function reconcilePresentedModalStack'),
      stackSource.indexOf('function markNativeScriptScreenContentReady'),
    );
    const readinessGateIndex = reconcileModalSource.indexOf(
      '!screenContentIsReady(firstModalId, registry)',
    );
    const presentationIndex = reconcileModalSource.indexOf(
      'setModalViewControllers(',
    );

    expect(readinessGateIndex).toBe(-1);
    expect(presentationIndex).toBeGreaterThanOrEqual(0);
    expect(reconcileModalSource).toContain(
      'UIKit attaches the first modal view during presentation',
    );
    expect(reconcileModalSource).not.toContain(
      'if (!refreshScreenContentReady(firstModalId, firstModalController, registry))',
    );
    expect(refreshReadySource).toContain(
      'layoutHostedReactSubviews(controller);',
    );
  });

  it('uses content wrapper layout as a generic hosted-content ready signal', () => {
    const wrapperFrameSource = stackSource.slice(
      stackSource.indexOf(
        'export function notifyNativeScriptScreenContentWrapperFrame',
      ),
      stackSource.indexOf('function layoutHostedSubviewChain'),
    );

    expect(wrapperFrameSource).toContain(
      'registry.screenContentReady[screenId] = true;',
    );
    expect(wrapperFrameSource).toContain(
      'const stackId = registry.screenParents[screenId];',
    );
    expect(wrapperFrameSource).toContain(
      'reconcileStackFromRegistry(stackId, registry, stackCtx, true);',
    );
  });

  it('refreshes hosted UIKit views across modal and native gesture transitions', () => {
    expect(stackSource).toContain(
      'function refreshNavigationControllerHostedViews',
    );
    expect(stackSource).toContain('function layoutPresentedModalControllers');
    expect(stackSource).toContain(
      'layoutPresentedModalControllers(stackId, registry)',
    );
    expect(stackSource).toContain(
      'refreshNavigationControllerHostedViews(navigationController);',
    );
    expect(stackSource).toContain(
      'navigationController.view.userInteractionEnabled = true',
    );
    expect(stackSource).toContain('layoutHostedReactSubviews(controller);');
  });

  it('keeps a JS-removed screen mounted as inactive until UIKit finishes closing it', () => {
    const root = React.createElement(
      NativeScriptScreenStackItem,
      { activityState: 2, screenId: 'root' },
      'root',
    );
    const detail = React.createElement(
      NativeScriptScreenStackItem,
      { activityState: 2, screenId: 'detail' },
      'detail',
    );
    const previousChildren = new Map([
      ['root', { element: root, order: 0 }],
      ['detail', { element: detail, order: 1 }],
    ]);
    const retainedChildren = new Map();

    const renderedChildren = __mergeNativeScriptStackChildrenForTests(
      [root],
      previousChildren,
      retainedChildren,
      ['root', 'detail'],
      new Set(),
    );

    expect(renderedChildren).toHaveLength(2);
    expect(retainedChildren.has('detail')).toBe(true);
    expect(testStackChildProps(renderedChildren[0]).screenId).toBe('root');
    expect(testStackChildProps(renderedChildren[1]).screenId).toBe('detail');
    expect(testStackChildProps(renderedChildren[1]).activityState).toBe(0);
  });

  it('ports RNSScreen setViewToSnapshot for native-owned unmounts', () => {
    expect(stackSource).toContain('setViewToSnapshot()');
    expect(stackSource).toContain('snapshotViewAfterScreenUpdates');
    expect(stackSource).toContain('props?.snapshotAfterUpdates === true');
    expect(stackSource).toContain('this.view = snapshot');
    expect(stackSource).toContain('controller.setViewToSnapshot?.();');
  });

  it('does not retain a screen that was already removed by a native back gesture', () => {
    const root = React.createElement(
      NativeScriptScreenStackItem,
      { activityState: 2, screenId: 'root' },
      'root',
    );
    const detail = React.createElement(
      NativeScriptScreenStackItem,
      { activityState: 2, screenId: 'detail' },
      'detail',
    );
    const previousChildren = new Map([
      ['root', { element: root, order: 0 }],
      ['detail', { element: detail, order: 1 }],
    ]);
    const retainedChildren = new Map();
    const nativeDismissedScreenIds = new Set(['detail']);

    const renderedChildren = __mergeNativeScriptStackChildrenForTests(
      [root],
      previousChildren,
      retainedChildren,
      ['root', 'detail'],
      nativeDismissedScreenIds,
    );

    expect(renderedChildren).toHaveLength(1);
    expect(testStackChildProps(renderedChildren[0]).screenId).toBe('root');
    expect(retainedChildren.has('detail')).toBe(false);
    expect(nativeDismissedScreenIds.has('detail')).toBe(true);
  });

  it('ports RNSScreenStackView.prepareForRecycle teardown on stack dispose', () => {
    const recycleSource = stackSource.slice(
      stackSource.indexOf('function prepareStackControllerForRecycle'),
      stackSource.indexOf('function topActiveScreenId'),
    );
    const disposeSource = stackSource.slice(
      stackSource.indexOf('dispose(controller, props)'),
      stackSource.indexOf('const NativeScriptScreenController'),
    );

    expect(stackSource).toContain('function createPlaceholderViewController');
    expect(stackSource).toContain(
      'function resetNavigationControllerToPlaceholder',
    );
    expect(recycleSource).toContain(
      'Direct port of RNSScreenStackView.prepareForRecycle',
    );
    expect(recycleSource).toContain(
      'dismissViewControllerAnimatedCompletion(false, null)',
    );
    expect(recycleSource).toContain('willMoveToParentViewController(null)');
    expect(recycleSource).toContain('removeFromParentViewController()');
    expect(recycleSource).toContain(
      'resetNavigationControllerToPlaceholder(navigationController)',
    );
    expect(disposeSource).toContain(
      'prepareStackControllerForRecycle(controller)',
    );
  });

  it('retains React Navigation route wrapper children without changing scene state', () => {
    const RootScene = (_props: {
      descriptor: { route: { key: string } };
      focused: boolean;
      isInactive: boolean;
    }) => null;
    const root = React.createElement(RootScene, {
      descriptor: { route: { key: 'root' } },
      focused: true,
      isInactive: false,
    });
    const detail = React.createElement(RootScene, {
      descriptor: { route: { key: 'detail' } },
      focused: true,
      isInactive: false,
    });
    const previousChildren = new Map([
      ['root', { element: root, order: 0 }],
      ['detail', { element: detail, order: 1 }],
    ]);
    const retainedChildren = new Map();

    const renderedChildren = __mergeNativeScriptStackChildrenForTests(
      [root],
      previousChildren,
      retainedChildren,
      ['root', 'detail'],
      new Set(),
    );

    expect(renderedChildren).toHaveLength(2);
    expect(retainedChildren.has('detail')).toBe(true);
    expect(
      (
        renderedChildren[1] as React.ReactElement<{
          focused: boolean;
          isInactive: boolean;
        }>
      ).props,
    ).toMatchObject({
      focused: true,
      isInactive: false,
    });
  });
});
