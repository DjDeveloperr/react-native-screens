import fs from 'fs';
import path from 'path';
import * as ts from 'typescript';
import * as React from 'react';
import * as NativeScriptRuntime from '@nativescript/react-native';
import {
  countNativeScriptHeaderSubviewChildren,
  __nativeScriptUpdateHeaderSubviewIntrinsicSizeForTests,
  __nativeScriptUpdateHeaderSubviewIntrinsicSizeFromLayoutForTests,
} from '../../ScreenStackHeaderConfig';
import {
  __nativeScriptCoerceContentWrapperChildScrollViewFrameForTests,
  __nativeScriptContentWrapperNeedsSurfaceTouchHandlerFallbackForTests,
  __nativeScriptControllerCanApplyScrollEdgeEffectsForTests,
  __nativeScriptConfigureNavigationAppearanceForTests,
  __nativeScriptConfigureHeaderSubviewViewsForTests,
  __nativeScriptActiveScreenIdsFromStackChildrenForTests,
  __nativeScriptApplyScreenTransitionInteractionDisabledForTests,
  __nativeScriptApplyStackSettledInteractivityForTests,
  __nativeScriptApplyStackTransitionInteractivityForTests,
  __nativeScriptConfigureSourceBackButtonForTests,
  __nativeScriptCreateHeaderBarButtonItemsForTests,
  __nativeScriptDetachedModalHeaderCanCompleteDismissalForTests,
  __nativeScriptDetachRedundantContentWrapperSurfaceTouchHandlerForTests,
  __nativeScriptDisableStaleEmptyScreenHitTargetDescendantsForTests,
  __nativeScriptDisableStaleEmptyScreenHitTargetSiblingsForTests,
  __nativeScriptDisableStaleUIKitWrapperSiblingsAboveActiveViewChainForTests,
  __nativeScriptDisableStaleUIKitWrapperSiblingsForTests,
  __nativeScriptHeaderSubviewCustomViewWrapperIntrinsicSizeForTests,
  __nativeScriptHitTestVisibleDescendantForTests,
  __nativeScriptDetachSurfaceTouchHandlerFromViewForTests,
  __nativeScriptDetachSurfaceTouchHandlersForTests,
  __nativeScriptHostedSubviewChildBoundsRepairHeightForTests,
  __nativeScriptLayoutHostedReactSubviewsForTests,
  __nativeScriptLayoutScreenHostedReactSubviewsForTests,
  __nativeScriptLayoutNavigationStackViewsForTests,
  __nativeScriptLayoutHostedSubviewChainForTests,
  __nativeScriptOverrideScrollViewBehaviorInFirstDescendantChainForTests,
  __nativeScriptMaybeAddStackControllerToParentAndUpdateContainerForTests,
  __nativeScriptModalScreenHasPreparedNestedContentForTests,
  __nativeScriptNavigationControllerCanApplyInitialOffwindowStackModelForTests,
  __nativeScriptNavigationControllerCanApplyStackModelForTests,
  __nativeScriptNestedModalStackCanSkipPresentationRefreshForTests,
  __nativeScriptNativeViewControllersFromArrayForTests,
  __nativeScriptStableNativeViewControllersFromArrayForTests,
  __nativeScriptRememberNestedModalPresentationGeometryForTests,
  __nativeScriptNormalizeScreenContentWrapperChildHostForTests,
  __nativeScriptPresentationCoordinatorControllerForTests,
  __nativeScriptPresentedModalControllerHasWindowAttachedViewForTests,
  __nativeScriptPrepareScreenHostedContentForNativeTransitionForTests,
  __nativeScriptReactAddControllerToClosestParentForTests,
  __nativeScriptPresentedModalContentCanStartPresentationForTests,
  __nativeScriptPresentedModalScreenCanStartPresentationForTests,
  __nativeScriptRegisterHeaderSubviewForTests,
  __nativeScriptRemoveControllerOwnedDescendantsOutsideAncestorForTests,
  __nativeScriptRefreshScreenContentReadyForTests,
  __nativeScriptRefreshScreenContentWrapperHostForTests,
  __nativeScriptReparentNavigationControllerForModalContentForTests,
  __nativeScriptRestoreActiveScreenContentAfterHeaderSubviewUpdateForTests,
  __nativeScriptRepairHostedSubviewHeightForTests,
  __nativeScriptRepairDescendantStackContainmentForTests,
  __nativeScriptResetPresentedModalNestedContentStacksForTests,
  __nativeScriptShouldOverrideScrollViewContentInsetAdjustmentBehaviorForTests,
  __nativeScriptShouldInstallBackdropTapGestureForTests,
  __nativeScriptShouldReceiveBackdropTapTouchForTests,
  __nativeScriptShouldIgnoreNoOpNativeWillShowForTests,
  __nativeScriptSetNavigationBarPrefersLargeTitlesForTests,
  __nativeScriptSetNavigationItemLargeTitleDisplayModeForTests,
  __nativeScriptSetNavigationItemLargeTitleTextForTests,
  __nativeScriptScreenControllerCoreNativePropsKeyForTests,
  __nativeScriptScreenControllerHeaderConfigKeyForTests,
  __nativeScriptScreenControllerNativePropsKeyForTests,
  __nativeScriptStablePresentedControllerBoundsForTests,
  __nativeScriptScreenHeaderSubviewsAreReadyForTests,
  __nativeScriptScreenHostReadyOnUIForTests,
  __nativeScriptScreenHostedViewNeedsRefreshForTests,
  __nativeScriptScreenRequiresOwnSurfaceTouchHandlerForTests,
  __nativeScriptScreenViewContentWrapperHitTestForTests,
  __nativeScriptScreenControllerLifecycleCanRunForTests,
  __nativeScriptScreenContentWrapperCanMountInScreenViewForTests,
  __nativeScriptScreenContentWrapperFabricViewForMountedViewForTests,
  __nativeScriptScreenHasStableReadyMountedContentForTests,
  __nativeScriptRememberScreenStableReadyExposureForTests,
  __nativeScriptShouldAttachSurfaceTouchHandlerForTests,
  __nativeScriptSyncNavigationBarSafeAreaInsetForTests,
  __nativeScriptSurfaceTouchHandlerAttachedToViewForTests,
  __nativeScriptSurfaceTouchHandlersForTests,
  __nativeScriptUpdateAncestorSurfaceTouchHandlerOriginsForTests,
  __nativeScriptUpdateScreenBoundsAfterLayoutForTests,
  __nativeScriptUpdateSurfaceTouchHandlerOriginsForTests,
  __nativeScriptStackCancelTouchesInParentForTests,
  __nativeScriptStackContainerEffectiveSafeAreaInsetsForTests,
  __nativeScriptStableReadyScreenHostHandleForTests,
  __nativeScriptScreenViewEffectiveSafeAreaInsetsForTests,
  __nativeScriptControllersForStackUIKitModelIdsForTests,
  __nativeScriptStackGestureResponseDistanceAllowsForTests,
  __nativeScriptStackGestureDelegateDecisionForTests,
  __nativeScriptStackScreenParticipatesInUIKitModelForTests,
  __nativeScriptStackSwipeMetricForTests,
  __nativeScriptLayoutNavigationBarWithinSafeAreaForTests,
  __nativeScriptSyncNavigationStackSafeAreaInsetsForTests,
  __nativeScriptTextAttributesForTests,
  __nativeScriptUnregisterHeaderSubviewForTests,
  __nativeScriptViewControllerIsAttachableScreensParentForTests,
  __nativeScriptViewControllerCanPresentModalForTests,
  __mergeNativeScriptStackChildrenForTests,
  __shouldReceiveNativeScriptStackBackGestureForTests,
  nativeScriptScreenContentWrapperHostReadyOnUI,
  NativeScriptScreenStackItem,
  notifyNativeScriptScreenContentWrapperFrame,
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
const tabsSource = fs.readFileSync(
  path.resolve(__dirname, '../../tabs/native-script/NativeScriptTabs.ios.tsx'),
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
const safeAreaViewIOSSource = fs.readFileSync(
  path.resolve(__dirname, '../../safe-area/SafeAreaView.ios.tsx'),
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
const nativeScriptReactNativeShimSource = fs.readFileSync(
  path.resolve(
    __dirname,
    '../../tabs/native-script/native-script-react-native.d.ts',
  ),
  'utf8',
);
const nativeScriptReactNativeMockSource = fs.readFileSync(
  path.resolve(__dirname, '../../../../jest/nativescript-react-native.js'),
  'utf8',
);

const normalizeSource = (source: string) =>
  source
    .replace(/\s+/g, ' ')
    .replace(/\s*([(),;{}[\]])\s*/g, '$1')
    .replace(/,\)/g, ')')
    .trim();
const expectSourceToContain = (source: string, snippet: string) => {
  expect(normalizeSource(source)).toContain(normalizeSource(snippet));
};

function topLevelWorkletDeclarationOrderHazards(
  fileName: string,
  sourceText: string,
) {
  const sourceFile = ts.createSourceFile(
    fileName,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    fileName.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const functions: ts.FunctionDeclaration[] = [];
  sourceFile.forEachChild(node => {
    if (ts.isFunctionDeclaration(node) && node.name && node.body) {
      functions.push(node);
    }
  });
  const order = new Map(
    functions.map((fn, index) => [fn.name!.text, index] as const),
  );
  const topLevelNames = new Set(order.keys());

  const hasWorkletDirective = (fn: ts.FunctionDeclaration) => {
    const firstStatement = fn.body?.statements[0];
    return (
      firstStatement != null &&
      ts.isExpressionStatement(firstStatement) &&
      ts.isStringLiteral(firstStatement.expression) &&
      firstStatement.expression.text === 'worklet'
    );
  };
  const localNamesForFunction = (fn: ts.FunctionDeclaration) => {
    const locals = new Set<string>();
    const visit = (node: ts.Node) => {
      if (ts.isFunctionDeclaration(node) && node.name) {
        locals.add(node.name.text);
      }
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
        locals.add(node.name.text);
      }
      if (ts.isParameter(node) && ts.isIdentifier(node.name)) {
        locals.add(node.name.text);
      }
      ts.forEachChild(node, visit);
    };

    for (const parameter of fn.parameters) {
      visit(parameter);
    }
    for (const statement of fn.body?.statements ?? []) {
      visit(statement);
    }
    if (fn.name) {
      locals.delete(fn.name.text);
    }

    return locals;
  };
  const topLevelReferencesForFunction = (fn: ts.FunctionDeclaration) => {
    const refs = new Set<string>();
    const locals = localNamesForFunction(fn);
    const visit = (node: ts.Node) => {
      if (ts.isFunctionLike(node) && node !== fn) {
        return;
      }
      if (
        ts.isIdentifier(node) &&
        topLevelNames.has(node.text) &&
        !locals.has(node.text)
      ) {
        const parent = node.parent;
        if (ts.isPropertyAccessExpression(parent) && parent.name === node) {
          return;
        }
        if (ts.isPropertyAssignment(parent) && parent.name === node) {
          return;
        }
        if (ts.isShorthandPropertyAssignment(parent)) {
          return;
        }
        refs.add(node.text);
      }
      ts.forEachChild(node, visit);
    };

    if (fn.body) {
      ts.forEachChild(fn.body, visit);
    }

    return refs;
  };

  const hazards: string[] = [];
  for (const fn of functions) {
    if (!fn.name || !hasWorkletDirective(fn)) {
      continue;
    }

    const fnOrder = order.get(fn.name.text)!;
    const fnLine =
      sourceFile.getLineAndCharacterOfPosition(fn.name.getStart(sourceFile))
        .line + 1;
    for (const ref of topLevelReferencesForFunction(fn)) {
      const refOrder = order.get(ref);
      if (refOrder == null || refOrder <= fnOrder) {
        continue;
      }

      const refFn = functions[refOrder];
      const refLine =
        sourceFile.getLineAndCharacterOfPosition(
          refFn.name!.getStart(sourceFile),
        ).line + 1;
      hazards.push(
        `${fileName}:${fnLine} ${fn.name.text} -> ${ref}@${refLine}`,
      );
    }
  }

  return hazards;
}

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

  it('keeps the NativeScript runtime shim aligned with host ownership APIs', () => {
    const expectedRuntimeApis = [
      'refreshUIKitHostView',
      'refreshUIKitHostViewHandle',
      'refreshUIKitHostViewOwner',
      'refreshUIKitHostViewOwnerHandle',
      'refreshUIKitHostViewDirectOwner',
      'refreshUIKitHostViewDirectOwnerHandle',
      'invalidateUIKitHostReadyOwner',
      'invalidateUIKitHostReadyOwnerHandle',
      'notifyUIKitAccessibilityLayoutChanged',
      'notifyUIKitAccessibilityLayoutChangedHandle',
      'flushUIKitHostView',
      'flushUIKitHostViewHandle',
      'flushUIKitHostViewOwner',
      'flushUIKitHostViewOwnerHandle',
      'reactNativeFabricViewLayoutTraits',
      'reactNativeFabricViewLayoutTraitsForHandle',
    ];

    expect(nativeScriptReactNativeShimSource).toContain(
      'export type ReactNativeFabricViewLayoutTraits',
    );
    for (const apiName of expectedRuntimeApis) {
      expect(nativeScriptReactNativeShimSource).toContain(
        `export function ${apiName}`,
      );
      expect(nativeScriptReactNativeShimSource).toContain(
        `${apiName}: typeof ${apiName}`,
      );
      expect(nativeScriptReactNativeMockSource).toContain(
        `function ${apiName}`,
      );
      expect(nativeScriptReactNativeMockSource).toContain(apiName);
    }
  });

  it('publishes visible stack accessibility from the active screen before detached fallbacks', () => {
    const notifySource = stackSource.slice(
      stackSource.indexOf('function notifyVisibleStackAccessibilityLayoutChanged'),
      stackSource.indexOf('function layoutNavigationStackViews'),
    );

    expect(notifySource).toContain(
      'const screenView = screenControllerView(controller);',
    );
    expect(notifySource).toContain('const notifiedTargets: any[] = [];');
    expect(notifySource).toContain(
      'nativeObjectsEqual(notifiedTargets[index], view)',
    );
    expect(notifySource).toContain('notifyLayoutChanged(screenView);');
    expect(notifySource).toContain('notifyLayoutChanged(contentWrapperView);');
    expect(notifySource).toContain('notifyLayoutChanged(stackContainerView);');
    expect(
      notifySource.indexOf('notifyLayoutChanged(screenView);'),
    ).toBeLessThan(
      notifySource.indexOf('notifyLayoutChanged(contentWrapperView);'),
    );
  });

  it('routes the public ScreenStack surface through the NativeScript implementation on iOS', () => {
    expect(screenStackSource).toContain(
      "import { NativeScriptScreenStack } from './native-stack/native-script/NativeScriptScreenStack'",
    );
    expect(screenStackSource).toContain("Platform.OS === 'ios'");
    expect(screenStackSource).toContain('<NativeScriptScreenStack');
  });

  it('reconciles the UIKit stack after Fabric transaction commits', () => {
    const stackHostSource = stackSource.slice(
      stackSource.indexOf('const NativeScriptStackController'),
      stackSource.indexOf('const NativeScriptScreenContainerHost'),
    );
    const stackUpdateSource = stackHostSource.slice(
      stackHostSource.indexOf('  update(controller, props'),
      stackHostSource.indexOf('  transactionCommitted(controller, props'),
    );
    const stackTransactionSource = stackHostSource.slice(
      stackHostSource.indexOf('  transactionCommitted(controller, props'),
      stackHostSource.indexOf('  refresh(controller, props'),
    );
    const stackRefreshSource = stackHostSource.slice(
      stackHostSource.indexOf('  refresh(controller, props'),
      stackHostSource.indexOf('  dispose(controller, props'),
    );
    const stackHostReadySource = stackHostSource.slice(
      stackHostSource.indexOf('  hostReady(controller, props'),
      stackHostSource.indexOf('  refresh(controller, props'),
    );
    const stackCanReconcileSource = stackSource.slice(
      stackSource.indexOf('function stackCanReconcileFromPropsUpdate'),
      stackSource.indexOf('function registerNativeScriptStackController'),
    );
    const screenControllerSource = stackSource.slice(
      stackSource.indexOf('const NativeScriptScreenController'),
      stackSource.indexOf('function containerScreenParticipatesInUIKitModel'),
    );
    const screenUpdateSource = screenControllerSource.slice(
      screenControllerSource.indexOf('  update(controller, props'),
      screenControllerSource.indexOf(
        '  transactionCommitted(controller, props',
      ),
    );
    const screenTransactionSource = screenControllerSource.slice(
      screenControllerSource.indexOf(
        '  transactionCommitted(controller, props',
      ),
      screenControllerSource.indexOf('  dispose(controller, props'),
    );
    const screenDisposeSource = screenControllerSource.slice(
      screenControllerSource.indexOf('  dispose(controller, props'),
    );
    const screenViewStart = stackSource.indexOf(
      'class RNSScreenNativeScriptView',
    );
    const screenViewSource = stackSource.slice(
      screenViewStart,
      stackSource.indexOf(
        'const interopTypes = globalObject.interop?.types;',
        screenViewStart,
      ),
    );

    expect(stackHostSource).toContain('transactionCommitted(controller, props');
    expect(stackHostSource).toContain('hostReady(controller, props, event');
    expect(stackHostSource).toContain('mountingTransactionWillMount(');
    expect(stackHostSource).toContain('mountChild(_controller, child, props)');
    expect(stackHostSource).toContain(
      'unmountChild(_controller, child, props)',
    );
    expect(stackHostSource).toContain('mountingTransactionDidMount(');
    expect(stackHostSource).toContain(
      'mountFabricStackChild(props.stackId, child, registry)',
    );
    expect(stackHostSource).toContain(
      'unmountFabricStackChild(props.stackId, child, registry)',
    );
    expect(stackHostSource).toContain(
      'reconcileStackAfterFabricChildrenMount(controller, props, ctx, registry)',
    );
    expect(stackHostSource).toContain(
      'syncMountedStackScreenIdsFromFabricTransactionChildren(',
    );
    expect(stackHostSource).toContain('transaction?.children?.length > 0');
    expectSourceToContain(
      stackUpdateSource,
      'const activeIds = stackActiveScreenIdsForUIKitModel(props.stackId, registry);',
    );
    expectSourceToContain(
      stackTransactionSource,
      'const hasPendingNativeModel =\n' +
        '      registry.stackPendingReconcileKeys[props.stackId] != null ||\n' +
        '      registry.stackNativeKeys[props.stackId] !== activeKey;',
    );
    expectSourceToContain(
      stackTransactionSource,
      'transaction?.hasModifiedChildren !== true &&\n' +
        '      !hasPendingNativeModel',
    );
    expectSourceToContain(
      stackTransactionSource,
      '!hasPendingNativeModel &&\n' +
        '      registry.stackTransitioning[props.stackId] === true',
    );
    expectSourceToContain(
      stackTransactionSource,
      'if (registry.stackUpdatingModals[props.stackId] === true) {\n' +
        '      return;\n' +
        '    }',
    );
    expect(
      stackTransactionSource.indexOf(
        'registry.stackTransitioning[props.stackId] === true',
      ),
    ).toBeLessThan(
      stackTransactionSource.indexOf('shouldApplyStackTransactionRevision('),
    );
    expect(stackHostSource).toContain(
      'registerNativeScriptStackController(controller, props, ctx, registry);',
    );
    expect(stackHostReadySource).toContain(
      'const windowAttached = event.nativeEvent.windowAttached === true;',
    );
    expectSourceToContain(
      stackHostReadySource,
      "traceWorkletEvent(\n      'stack-host-ready'",
    );
    expect(stackSource).toContain('function stackHasActiveModalTransaction');
    expect(stackSource).toContain(
      'const transitionScreenId = registry.stackTransitionScreenIds[stackId];',
    );
    expect(stackSource).toContain(
      'const transitionIsModal = isModalPresentation(',
    );
    expect(stackHostReadySource).toContain(
      'registry.stackPendingReconcileKeys[props.stackId] = activeKey;',
    );
    expect(stackHostReadySource).toContain(
      'stackHasActiveModalTransaction(props.stackId, registry) &&',
    );
    expect(stackHostReadySource).toContain(
      "'stack-host-ready-defer-active-modal-transaction'",
    );
    expect(
      stackHostReadySource.indexOf('stackHasActiveModalTransaction'),
    ).toBeLessThan(
      stackHostReadySource.indexOf('refreshStackContainmentFromLifecycle'),
    );
    expectSourceToContain(
      stackHostReadySource,
      'refreshStackContainmentFromLifecycle(\n' +
        '      props.stackId,\n' +
        '      registry,\n' +
        '      ctx,\n' +
        '      controller,\n' +
        '      true,\n' +
        '    );',
    );
    expectSourceToContain(
      stackHostReadySource,
      'navigationControllerCanApplyStackModel(\n' +
        '        controller,\n' +
        '        registry,\n' +
        '        activeIds,\n' +
        '      )',
    );
    expectSourceToContain(
      stackHostReadySource,
      '!stackCanReconcileFromPropsUpdate(\n' +
        '          props.stackId,\n' +
        '          registry,\n' +
        '          activeIds,\n' +
        '        )',
    );
    expect(stackRefreshSource).not.toContain(
      'refreshVisibleStackScreenContentReady(',
    );
    expect(stackRefreshSource).not.toContain(
      'refreshVisibleStackContentWrapperHosts(',
    );
    expect(stackRefreshSource).not.toContain(
      'const shouldForceContentRefresh = !stackTopContentIsReady(',
    );
    expectSourceToContain(
      stackRefreshSource,
      'const activeIds = stackActiveScreenIdsForUIKitModel(props.stackId, registry);',
    );
    expect(stackRefreshSource).toContain(
      'const activeKey = idsKey(activeIds);',
    );
    expectSourceToContain(
      stackRefreshSource,
      'const hasPendingNativeModel =\n' +
        '        registry.stackPendingReconcileKeys[props.stackId] != null ||\n' +
        '        registry.stackNativeKeys[props.stackId] !== activeKey;',
    );
    expect(stackHostReadySource).not.toContain(
      'refreshStableNavigationStackWithoutLayout(',
    );
    expect(stackHostReadySource).not.toContain(
      "layoutNavigationStackViews(controller, 'stack-controller-update-stable')",
    );
    expect(stackRefreshSource).not.toContain(
      'const didRefreshStableCurrentStack =',
    );
    expect(stackRefreshSource).not.toContain(
      'refreshStableNavigationStackWithoutLayout(',
    );
    expect(stackRefreshSource).not.toContain(
      "layoutNavigationStackViews(controller, 'stack-controller-refresh')",
    );
    expect(stackRefreshSource).not.toContain('shouldForceContentRefresh,');
    expect(stackRefreshSource).toContain(
      'registry.stackPendingReconcileKeys[props.stackId] != null',
    );
    expect(stackRefreshSource).toContain(
      'registry.stackNativeKeys[props.stackId] !==',
    );
    expect(stackRefreshSource).toContain('idsKey(activeIds)');
    expect(
      stackTransactionSource.indexOf('const hasPendingNativeModel'),
    ).toBeLessThan(
      stackTransactionSource.indexOf(
        'transaction?.hasModifiedChildren !== true',
      ),
    );
    expectSourceToContain(
      stackTransactionSource,
      '!hasPendingNativeModel &&\n' +
        '      !shouldApplyStackTransactionRevision(',
    );
    expectSourceToContain(
      stackTransactionSource,
      'hasPendingNativeModel &&\n' +
        '      !stackCanReconcileFromPropsUpdate(\n' +
        '        props.stackId,\n' +
        '        registry,\n' +
        '        activeIds,\n' +
        '      )',
    );
    expect(
      stackTransactionSource.indexOf('stackCanReconcileFromPropsUpdate('),
    ).toBeLessThan(stackTransactionSource.indexOf('reconcileStack('));
    expect(stackSource).toContain('function stackCanReconcileFromPropsUpdate');
    expect(stackCanReconcileSource).toContain('registry.screens[screenId]');
    expect(stackCanReconcileSource).not.toContain('readinessScreenIds');
    expect(stackCanReconcileSource).not.toContain('allowControllerHostStart');
    expect(stackCanReconcileSource).not.toContain(
      'stackTopScreenCanStartNativeUpdate(',
    );
    expect(stackCanReconcileSource).not.toContain('top-not-ready');
    expect(stackCanReconcileSource).not.toContain('allowHost=');
    expect(stackSource).toContain(
      'function stackTopScreenCanStartNativeUpdate',
    );
    const canStartNativeUpdateSource = stackSource.slice(
      stackSource.indexOf('function stackTopScreenCanStartNativeUpdate'),
      stackSource.indexOf('function scheduledReconcileStack'),
    );
    expect(canStartNativeUpdateSource).not.toContain(
      'screenHeaderSubviewsAreReady',
    );
    expect(canStartNativeUpdateSource).not.toContain(
      'refreshKnownUIKitHostView(',
    );
    expect(canStartNativeUpdateSource).not.toContain(
      'prepareScreenHostedContentForNativeTransition(',
    );
    expect(canStartNativeUpdateSource).toContain('const nativeModelCount =');
    expect(canStartNativeUpdateSource).toContain('const nativeModelIsEmpty =');
    expect(canStartNativeUpdateSource).not.toContain(
      'nativeModelIsForwardPush',
    );
    expect(canStartNativeUpdateSource).toContain(
      'const topHasCommittedContent = screenHasCommittedContentForNativeStack(\n' +
        '    topScreenId,\n' +
        '    registry,\n' +
        '    topControllerView,',
    );
    expect(canStartNativeUpdateSource).toContain(
      'const topCanStartFromControllerHost =',
    );
    expect(canStartNativeUpdateSource).toContain('allowControllerHostStart &&');
    expect(canStartNativeUpdateSource).toContain('!topRequiresContentWrapper');
    expect(canStartNativeUpdateSource).toContain(
      'const canUseNativeStackControllerView =\n' +
        '    screenCanUseNativeStackControllerViewForReady(\n' +
        '      topScreenId,\n' +
        '      registry,\n' +
        '      stackId,\n' +
        '    );',
    );
    expect(canStartNativeUpdateSource).toContain(
      '!canUseNativeStackControllerView &&\n' +
        '    !(topHostIsReady || topContentWrapperIsReady)',
    );
    expect(canStartNativeUpdateSource).toContain(
      'if (!topHasCommittedContent) {',
    );
    expect(canStartNativeUpdateSource).toContain(
      'topCanStartFromControllerHost || (nativeModelIsEmpty && topHostIsReady)',
    );
    expect(canStartNativeUpdateSource).toContain(
      'return topCanStartFromControllerHost || topContentIsReady;',
    );
    expect(canStartNativeUpdateSource).not.toContain(
      'canUseNativeStackControllerView ||',
    );
    expect(canStartNativeUpdateSource).toContain(
      '} controllerHost=${\n' +
        '        topCanStartFromControllerHost ? 1 : 0\n' +
        '      } requiresWrapper=${topRequiresContentWrapper ? 1 : 0}',
    );
    expect(stackSource).toContain(
      'rememberScreenHostHandleForView(\n' +
        '    props.screenId,\n' +
        '    registry,\n' +
        '    screenControllerView(controller),\n' +
        '  );',
    );
    expect(stackSource).toContain(
      'registry.screenHeaderSubviewExpectedCountResolved[screenId] !== true',
    );
    expect(stackSource).toContain('screenHostIsReady(topScreenId, registry)');
    expect(stackSource).toContain('screenHasCommittedContentForNativeStack(');
    expect(stackSource).toContain(
      'registry.screenContentReady[topScreenId] = true;',
    );
    expect(stackSource).toContain(
      'return topCanStartFromControllerHost || topContentIsReady;',
    );
    expect(stackSource).toContain(
      'const headerSubviewRecords = headerSubviewRecordsForScreen(screenId);',
    );
    expect(stackSource).toContain(
      'headerSubviewPublishedSizeIsReady(record)',
    );
    expect(stackSource).not.toContain('reconcileStack-push-header-not-ready');
    expect(stackSource).not.toContain(
      '!screenHeaderSubviewsAreReady(pushedScreenId, registry)',
    );
    expect(stackSource).toContain(
      '!hadScreenRecord &&\n' +
        '    registry.screenHeaderSubviewExpectedCountResolved[props.screenId] !== true',
    );
    expect(stackSource).not.toContain('reconcileStack-deferred-top-not-ready');
    expect(stackSource).not.toContain(
      'function refreshOwningStackAfterScreenWindowAttach',
    );
    expect(screenViewSource).not.toContain(
      'refreshVisibleStackContentFromExternalHost(stack, true);',
    );
    expect(screenViewSource).not.toContain(
      'refreshOwningStackAfterScreenWindowAttach(this);',
    );
    expect(stackSource).toContain(
      'function screenRequiresContentWrapperForReady',
    );
    expect(stackSource).toContain('isModalPresentation(');
    expect(stackSource).toContain(
      "const parentId = registry.screenParents?.[screenId ?? ''];",
    );
    expect(stackSource).toContain(
      '(parentId != null && registry.stackContexts[parentId] != null)',
    );
    expect(stackUpdateSource).toContain(
      'stack-host-update-pending-transaction',
    );
    expect(stackUpdateSource).toContain('stack-host-update-defer-transaction');
    expect(stackUpdateSource).toContain('stack-host-update-reconcile');
    expect(stackUpdateSource).toContain(
      'stackCanReconcileFromPropsUpdate(props.stackId, registry, activeIds)',
    );
    expect(stackUpdateSource).toContain('reconcileStack(');
    expect(stackTransactionSource).toContain('reconcileStack(');
    expect(stackUpdateSource).toContain(
      'registry.stackPendingReconcileKeys[props.stackId] = activeKey;',
    );
    expect(stackUpdateSource).not.toContain('scheduleStackContainmentRefresh');
    expect(screenControllerSource).toContain(
      'transactionCommitted(controller, props',
    );
    expect(screenUpdateSource).not.toContain('reconcileStack(');
    expect(screenTransactionSource).toContain(
      'const hasPendingParentNativeModel =',
    );
    expect(screenTransactionSource).toContain(
      'const hasModifiedScreenChildren =',
    );
    expect(screenTransactionSource).toContain(
      'syncMountedScreenContentFromFabricTransactionChildren(',
    );
    expect(screenTransactionSource).toContain(
      '(!hasModifiedScreenChildren && !hasPendingParentNativeModel)',
    );
    expect(
      screenTransactionSource.indexOf('const hasPendingParentNativeModel'),
    ).toBeLessThan(
      screenTransactionSource.indexOf(
        'registry.screenContentReady[props.screenId] = true;',
      ),
    );
    expect(screenTransactionSource).toContain(
      'registry.screenContentReady[props.screenId] = true;',
    );
    expect(screenTransactionSource).toContain(
      'rememberScreenHostedViewRefreshKey(',
    );
    expect(screenTransactionSource).toContain(
      'registry.stackTransitioning[parentId] === true',
    );
    expect(screenTransactionSource).toContain(
      'registry.stackPendingReconcileKeys[parentId] = activeKey;',
    );
    expectSourceToContain(
      screenTransactionSource,
      'stackCanReconcileFromPropsUpdate(\n' +
        '          parentId,\n' +
        '          registry,\n' +
        '          activeIds,\n' +
        '        )',
    );
    expect(
      screenTransactionSource.indexOf(
        'registry.screenContentReady[props.screenId] = true;',
      ),
    ).toBeLessThan(screenTransactionSource.indexOf('reconcileStack('));
    expect(
      screenTransactionSource.indexOf('stackCanReconcileFromPropsUpdate('),
    ).toBeLessThan(screenTransactionSource.indexOf('reconcileStack('));
    expect(screenDisposeSource).not.toContain('reconcileStack(');
  });

  it('resolves externally refreshed embedded stacks by native identity', () => {
    const stackIdResolverSource = stackSource.slice(
      stackSource.indexOf(
        'function nativeScriptStackIdForNavigationController',
      ),
      stackSource.indexOf(
        'function setNativeScriptStackModalContentParentController',
      ),
    );
    const externalRefreshSource = stackSource.slice(
      stackSource.indexOf(
        'function refreshVisibleStackContentFromExternalHost',
      ),
      stackSource.indexOf('function installRefreshVisibleStackContentHandler'),
    );
    const installRefreshSource = stackSource.slice(
      stackSource.indexOf('function installRefreshVisibleStackContentHandler'),
      stackSource.indexOf(
        'function reconcileParentStackAfterScreenRegistration',
      ),
    );

    expect(stackIdResolverSource).toContain(
      'nativeScriptStackId(navigationController)',
    );
    expect(stackIdResolverSource).toContain('Object.keys(registry.stacks)');
    expect(stackIdResolverSource).toContain(
      'nativeObjectsEqual(registeredController, navigationController)',
    );
    expect(stackIdResolverSource).toContain(
      'nativeObjectsEqual(registeredController?.view, navigationView)',
    );
    expect(stackIdResolverSource).toContain(
      'nativeScriptStackContainerViewForStackId(\n' +
        '      stackId,\n' +
        '      registeredController,\n' +
        '      registry,\n' +
        '    )',
    );
    expect(stackIdResolverSource).toContain(
      'setNativeScriptStackId(navigationController, stackId);',
    );
    expect(stackIdResolverSource).toContain(
      'setNativeScriptStackId(navigationView, stackId);',
    );
    expect(stackIdResolverSource).toContain(
      'setNativeScriptStackId(navigationContainer, stackId);',
    );
    expect(stackSource).toContain(
      'function stackContainerViewForNavigationController',
    );
    expectSourceToContain(
      stackSource,
      'const resolvedStackId =\n' +
        '    stackId ??\n' +
        '    nativeScriptStackIdForNavigationController(navigationController, registry);',
    );
    expect(stackSource).not.toContain(
      'registry: NativeScriptStackRegistry,\n' +
        '  stackId = nativeScriptStackId(navigationController),',
    );
    expect(externalRefreshSource).toContain(
      'nativeScriptStackIdForNavigationController(',
    );
    expect(externalRefreshSource).toContain('forceRefresh = false');
    expect(externalRefreshSource).toContain(
      'refreshVisibleStackContentWrapperHosts(\n' +
        '    stackId,\n' +
        '    registry,\n' +
        '    undefined,\n' +
        '    false,\n' +
        '    forceRefresh,\n' +
        '    forceRefresh,\n' +
        '    true,\n' +
        '    forceRefresh,\n' +
        '  );',
    );
    expect(externalRefreshSource).toContain(
      'stackCanReconcileFromPropsUpdate(\n' +
        '        stackId,\n' +
        '        registry,\n' +
        '        registry.stackActiveScreenIds[stackId] ?? [],\n' +
        '      )',
    );
    expect(externalRefreshSource).toContain(
      'if (!stackCanReconcileFromPropsUpdate(stackId, registry, activeIds))',
    );
    expect(installRefreshSource).toContain(
      '(globalThis as Record<string, any>)[RECONCILE_STACK_KEY] = reconcileStack;',
    );
  });

  it('keeps internal stack scheduling on a bound worklet entrypoint', () => {
    const scheduledSource = stackSource.slice(
      stackSource.indexOf('function scheduledReconcileStack'),
      stackSource.indexOf('function refreshScreenContentWrapperHost'),
    );

    expect(stackSource).toContain('function callWorkletFunction');
    expect(scheduledSource).toContain(
      'const reconcileFromExternalHost = (globalThis as Record<string, any>)[\n' +
        '    RECONCILE_STACK_FROM_EXTERNAL_HOST_KEY\n' +
        '  ];',
    );
    expect(scheduledSource).toContain(
      'callWorkletFunction(\n' +
        '      reconcileFromExternalHost,\n' +
        '      navigationController,\n' +
        '      animated,\n' +
        '    );',
    );
    expect(scheduledSource).not.toContain(
      'callWorkletFunction(reconcile, stackId, registry, ctx, animated);',
    );
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
    expect(screenStackItemSource).toContain('<NativeScriptScreenStack');
    expect(screenStackItemSource).toContain('style={styles.container}');
    expect(screenStackItemSource).toContain(
      'scrollEdgeEffects={isHeaderInModal ? undefined : scrollEdgeEffects}',
    );
    expect(screenStackItemSource).toContain(
      'getSafeAreaEdges(headerConfig, isHeaderInModal)',
    );
    expect(screenStackItemSource).toContain(
      'if (isHeaderInModal) {\n    return {};\n  }',
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

  it('does not insert a plain React view between NativeScript screens and their content', () => {
    const nativeScreenSource = stackSource.slice(
      stackSource.indexOf('export const NativeScriptScreen = React.forwardRef'),
      stackSource.indexOf('export function NativeScriptScreenStack'),
    );
    const stackItemSource = stackSource.slice(
      stackSource.indexOf('export const NativeScriptScreenStackItem'),
      stackSource.indexOf('const styles = StyleSheet.create'),
    );

    expect(nativeScreenSource).toContain('<NativeScriptScreenController');
    expect(nativeScreenSource).not.toContain('<View ref={ref}');
    expect(nativeScreenSource).not.toContain('style={[styles.content, style]}');
    expect(stackItemSource).toContain('<NativeScriptScreenController');
    expect(stackItemSource).toContain('<TransitionProgressContext.Provider');
    expect(stackItemSource).not.toContain('<View\n        ref={ref}');
    expect(stackItemSource).not.toContain(
      'style={[styles.content, contentStyle]}',
    );
  });

  it('ports RNSScreen transition-progress display-link sampling', () => {
    const screenControllerSource = stackSource.slice(
      stackSource.indexOf('class RNSScreenNativeScriptController'),
      stackSource.indexOf(
        'NativeClassFunction(RNSScreenNativeScriptController)',
      ),
    );
    const setupProgressSource = stackSource.slice(
      stackSource.indexOf('function setupTransitionProgressNotification'),
      stackSource.indexOf(
        'function shouldInstallBackdropTapGestureForPresentation',
      ),
    );

    expect(stackSource).toContain(
      'function setupTransitionProgressNotification',
    );
    expect(stackSource).toContain(
      'function invalidateStaleTransitionProgressDisplayLink',
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
    expect(stackSource).toContain(
      'controller.__nativeScriptTransitionProgressToken',
    );
    expect(setupProgressSource).not.toContain('setTimeout(');
    expect(stackSource).not.toContain('transitionProgressStopFallbackDelay');
    expect(stackSource).not.toContain('scheduleTransitionProgressStopFallback');
    expect(screenControllerSource).toContain(
      'invalidateStaleTransitionProgressDisplayLink(_displayLink)',
    );
    expect(stackSource).toContain('NSRunLoop.currentRunLoop');
    expect(stackSource).toContain('NSDefaultRunLoopMode');
    expect(stackSource).toContain('fakeView.layer.presentationLayer');
    expect(stackSource).toContain('presentationLayer.opacity');
    expect(stackSource).toContain('InteropBlock(');
    expect(stackSource).toContain('TRANSITION_COORDINATOR_COMPLETION_BLOCK');
    expect(stackSource).not.toContain('UIKIT_COMPLETION_BLOCK');
    expect(stackSource).toContain('ObjCExposedMethods');
  });

  it('stops NativeScript transition-progress display links at lifecycle terminal points', () => {
    const screenControllerSource = stackSource.slice(
      stackSource.indexOf('class RNSScreenNativeScriptController'),
      stackSource.indexOf(
        'NativeClassFunction(RNSScreenNativeScriptController)',
      ),
    );
    const viewDidAppearSource = screenControllerSource.slice(
      screenControllerSource.indexOf('viewDidAppear(animated: boolean)'),
      screenControllerSource.indexOf("'viewDidAppear:'"),
    );
    const viewDidDisappearSource = screenControllerSource.slice(
      screenControllerSource.indexOf('viewDidDisappear(animated: boolean)'),
      screenControllerSource.indexOf("'viewDidDisappear:'"),
    );
    const notifyFinishSource = screenControllerSource.slice(
      screenControllerSource.indexOf('notifyFinishTransitioning()'),
      screenControllerSource.indexOf("'handleAnimation:'"),
    );

    expect(viewDidAppearSource).toContain(
      'stopTransitionProgressNotification(this)',
    );
    expect(viewDidDisappearSource).toContain(
      'stopTransitionProgressNotification(this)',
    );
    expect(notifyFinishSource).toContain(
      'stopTransitionProgressNotification(this)',
    );
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

  it('coalesces duplicate RNSScreen lifecycle callbacks per UIKit stack transition', () => {
    const lifecycleSource = stackSource.slice(
      stackSource.indexOf('function emitScreenLifecycleEventForController'),
      stackSource.indexOf('function emitScreenDismissed'),
    );
    const clearSource = stackSource.slice(
      stackSource.indexOf('function clearScreenRecord'),
      stackSource.indexOf('function postSafeAreaDidChangeNotification'),
    );

    expect(stackSource).toContain('screenLastLifecycleEventKeys');
    expect(lifecycleSource).toContain('const isRouteLifecycleEvent =');
    expect(lifecycleSource).toContain(
      'screenHasActiveParentModalTransaction(screenId, registry)',
    );
    expect(lifecycleSource).toContain(
      "'screen-lifecycle-skip-parent-modal-transaction'",
    );
    expect(
      lifecycleSource.indexOf(
        'screenHasActiveParentModalTransaction(screenId, registry)',
      ),
    ).toBeLessThan(
      lifecycleSource.indexOf("'screen-lifecycle-emit'"),
    );
    expect(
      lifecycleSource.indexOf("'screen-lifecycle-skip-parent-modal-transaction'"),
    ).toBeLessThan(
      lifecycleSource.indexOf('registry.stackTransitioning[stackId] === true'),
    );
    expect(lifecycleSource).toContain(
      'registry.stackTransitioning[stackId] === true',
    );
    expect(lifecycleSource).toContain("eventName === 'onWillAppear'");
    expect(lifecycleSource).toContain("eventName === 'onAppear'");
    expect(lifecycleSource).toContain("eventName === 'onWillDisappear'");
    expect(lifecycleSource).toContain("eventName === 'onDisappear'");
    expect(lifecycleSource).toContain(
      'registry.stackTransitionTokens[stackId]',
    );
    expect(lifecycleSource).toContain(
      'registry.screenLastLifecycleEventKeys[screenId] === lifecycleEventKey',
    );
    expect(lifecycleSource).toContain('screen-lifecycle-skip-duplicate');
    expect(lifecycleSource).not.toContain('setTimeout(');
    expect(clearSource).toContain(
      'registry.screenLastLifecycleEventKeys[screenId] = undefined;',
    );
    expect(clearSource).toContain(
      'registry.screenStableReadyExposureKeys[screenId] = undefined;',
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
    const emitScreenDismissedForControllerSource = stackSource.slice(
      stackSource.indexOf('function emitScreenDismissedForController'),
      stackSource.indexOf('function emitScreenDismissedForScreenId'),
    );

    expect(stackSource).toContain('function emitScreenDismissedForController');
    expect(stackSource).toContain('function emitScreenDismissedForScreenId');
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
      'props?.preventNativeDismiss === true',
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
    expect(stackSource).toContain('function markModalDismissalRequestedFromJS');
    expect(stackSource).toContain('function modalDismissalWasRequestedFromJS');
    expect(stackSource).toContain(
      'function clearModalDismissalRequestedFromJS',
    );
    expect(viewDidDisappearSource).toContain(
      'const jsRequestedDismissal = modalDismissalWasRequestedFromJS(this);',
    );
    expect(viewDidDisappearSource).toContain(
      'if (jsRequestedDismissal) {\n' +
        '          completePresentedModalDismissalIfNeeded(this);\n' +
        '        } else if (props?.preventNativeDismiss === true) {',
    );
    expect(stackSource).not.toContain('onNativeStackChange');
    expect(stackSource).not.toContain('scheduleStackChange');
    expect(didShowSource).toContain('didNativeStackDismiss');
    expect(didShowSource).toContain('const dismissedCount = Math.max(');
    expectSourceToContain(
      didShowSource,
      'emitScreenDismissedForScreenId(\n' +
        '            registry,\n' +
        '            dismissedScreenId,\n' +
        '            dismissedCount,\n' +
        '          );',
    );
    expectSourceToContain(
      didShowSource,
      'restoreVisibleStackAfterNativeDismissal(\n' +
        '            ctx.props.stackId,\n' +
        '            registry,\n' +
        '            shownScreenIds,\n' +
        '          );',
    );
    expect(stackSource).toContain(
      'function restoreVisibleStackAfterNativeDismissal',
    );
    expect(didShowSource).not.toContain('setTimeout(emit');
    expect(screenControllerSource).toContain(
      'presentationControllerDidDismiss(presentationController: any)',
    );
    expect(stackSource).toContain(
      'function cleanupDismissedModalPresentationArtifacts',
    );
    const cleanupDismissedModalPresentationArtifactsSource = stackSource.slice(
      stackSource.indexOf(
        'function cleanupDismissedModalPresentationArtifacts',
      ),
      stackSource.indexOf('function completePresentedModalDismissalIfNeeded'),
    );
    expect(stackSource).toContain(
      'function completePresentedModalDismissalIfNeeded',
    );
    expect(stackSource).toContain(
      'COMPLETE_JS_REQUESTED_PRESENTED_MODAL_DISMISSAL_KEY',
    );
    expect(stackSource).toContain(
      'const completeJsRequestedDismissal = (globalThis as Record<string, any>)[\n' +
        '      COMPLETE_JS_REQUESTED_PRESENTED_MODAL_DISMISSAL_KEY\n' +
        '    ];',
    );
    expect(stackSource).toContain(
      'function completePresentedModalDismissalForDetachedHeaderIfNeeded',
    );
    const detachedHeaderDismissSource = stackSource.slice(
      stackSource.indexOf(
        'function completePresentedModalDismissalForDetachedHeaderIfNeeded',
      ),
      stackSource.indexOf('function refreshPresentedModalContentWrapperHosts'),
    );
    expect(detachedHeaderDismissSource).toContain(
      'registry.screenContexts[modalId]?.emit?.',
    );
    expect(detachedHeaderDismissSource).toContain(
      'COMPLETE_NATIVE_PRESENTED_MODAL_DISMISSAL_KEY',
    );
    expect(detachedHeaderDismissSource).not.toContain(
      'completePresentedModalDismissalIfNeeded(',
    );
    expect(stackSource).toContain(
      'const emit = registry.screenContexts[screenId]?.emit;',
    );
    expect(stackSource).toContain("if (typeof emit !== 'function')");
    expect(stackSource).toContain(
      'const didEmit = emitScreenDismissed(registry, screenId, dismissCount);',
    );
    expect(stackSource).toContain(
      'if (didEmit && controller) {\n    controller.__nativeScriptDismissEventEmitted = true;\n  }',
    );
    expect(emitScreenDismissedForControllerSource).not.toContain(
      'if (controller) {\n    controller.__nativeScriptDismissEventEmitted = true;\n  }\n\n  const registry = getRegistry(globalThis as Record<string, any>);',
    );
    expect(stackSource).toContain(
      'completePresentedModalDismissalForDetachedHeaderIfNeeded(',
    );
    expect(stackSource).toContain("'modal-header-offwindow-dismiss'");
    expect(stackSource).toContain(
      'function completePresentedModalDismissalForDetachedStackIfNeeded',
    );
    expect(stackSource).toContain(
      'resetScreenContentRefreshState(screenId, registry);',
    );
    expect(stackSource).toContain('fallbackModalId ??');
    expect(stackSource).toContain(
      'setControllerPresentedModalScreenId(this, modalScreenId);',
    );
    expect(stackSource).toContain('controllerPresentedModalScreenId(this)');
    expect(stackSource).toContain("'modal-stack-offwindow-dismiss'");
    expect(stackSource).toContain(
      'this.__nativeScriptWasWindowAttached === true',
    );
    expect(stackSource).toContain(
      "nativeBool(navigationController, 'isBeingDismissed')",
    );
    expect(screenControllerSource).toContain(
      'completePresentedModalDismissalIfNeeded(this);',
    );
    expect(screenControllerSource).toContain(
      'completePresentedModalDismissalIfNeeded(this, presentationController);',
    );
    const completePresentedModalDismissalSource = stackSource.slice(
      stackSource.indexOf('function completePresentedModalDismissalIfNeeded'),
      stackSource.indexOf(
        'function setupAdaptivePresentationControllerDelegate',
      ),
    );
    expect(completePresentedModalDismissalSource).not.toContain(
      'emitScreenDismissedForScreenId(registry, dismissedModalScreenId, 1);',
    );
    expect(completePresentedModalDismissalSource).toContain(
      'const dismissedModalScreenId =',
    );
    expect(completePresentedModalDismissalSource).toContain(
      'presentedModalScreenIdForDismissal(\n' +
        '    controller,\n' +
        '    presentationController,\n' +
        '    registry,\n' +
        '  );',
    );
    expect(completePresentedModalDismissalSource).toContain(
      'const dismissedModalScreenId = fallbackModalScreenId;',
    );
    expect(completePresentedModalDismissalSource).toContain(
      'const didCompleteDismissal =',
    );
    expect(completePresentedModalDismissalSource).toContain(
      'completeDismissal(\n' +
        '        controller,\n' +
        '        presentationController,\n' +
        '        dismissedModalScreenId,\n' +
        '        registry,\n' +
        '      ) !== false;',
    );
    expect(completePresentedModalDismissalSource).toContain(
      'presentedModalDismissalCompleted(\n' +
        '      controller,\n' +
        '      dismissedModalScreenId,\n' +
        '      registry,\n' +
        '    )',
    );
    expect(completePresentedModalDismissalSource).toContain(
      'markPresentedModalDismissalCompleted(',
    );
    expect(completePresentedModalDismissalSource).toContain(
      'resetPresentedModalDismissalCompleted(',
    );
    expect(completePresentedModalDismissalSource).not.toContain(
      'completeDismissal(modalControllerProps ? modalController : controller)',
    );
    expect(
      completePresentedModalDismissalSource.indexOf(
        'markPresentedModalDismissalCompleted(',
      ),
    ).toBeLessThan(
      completePresentedModalDismissalSource.indexOf(
        'cleanupDismissedModalPresentationArtifacts(',
        completePresentedModalDismissalSource.indexOf(
          'markPresentedModalDismissalCompleted(',
        ),
      ),
    );
    expect(
      completePresentedModalDismissalSource.indexOf(
        'controller.notifyPresentedControllerDismissed?.();',
      ),
    ).toBeLessThan(
      completePresentedModalDismissalSource.indexOf(
        'if (typeof completeDismissal ===',
      ),
    );
    expect(stackSource).toContain(
      'gestureHost.removeGestureRecognizer?.(gesture);',
    );
    expect(cleanupDismissedModalPresentationArtifactsSource).not.toContain(
      'controllerView?.removeFromSuperview?.();',
    );
    expect(cleanupDismissedModalPresentationArtifactsSource).toContain(
      'controller.__nativeScriptAdaptivePresentationControllerDelegate = undefined;',
    );
    expect(cleanupDismissedModalPresentationArtifactsSource).not.toContain(
      'presentationHost.userInteractionEnabled = false;',
    );
    expect(cleanupDismissedModalPresentationArtifactsSource).not.toContain(
      'presentationHost.accessibilityElementsHidden = true;',
    );
    expect(cleanupDismissedModalPresentationArtifactsSource).not.toContain(
      'presentationHost.removeFromSuperview?.();',
    );
    expect(stackSource).toContain(
      'controller.notifyPresentedControllerDismissed?.();',
    );
    expect(stackSource).toContain(
      'COMPLETE_NATIVE_PRESENTED_MODAL_DISMISSAL_KEY',
    );
    expect(stackSource).toContain("typeof completeDismissal === 'function'");
    expect(stackSource).toContain(
      'const modalController = controller.topViewController ?? controller;',
    );
    expect(stackSource).toContain(
      'const modalControllerProps = screenPropsForController(modalController);',
    );
    expect(stackSource).toContain(
      'function presentedModalScreenIdForDismissal',
    );
    expect(stackSource).toContain(
      'controllerPresentedModalScreenId(presentationController)',
    );
    expect(stackSource).toContain(
      'screenIdForController(presentedController, registry)',
    );
    expect(stackSource).toContain(
      'setControllerPresentedModalScreenId(presentationController, props.screenId);',
    );
    expect(stackSource).toContain(
      'registry.screenProps[fallbackModalScreenId]',
    );
    expect(stackSource).toMatch(/fallbackModalProps\s*\?\?\s*modalProps/);
    expect(stackSource).toContain('const didCompleteDismissal =');
    expect(stackSource).toContain('markPresentedModalDismissalCompleted(');
    expect(modalDismissalSource).toContain(
      'const dismissalWasAlreadyCompleted = presentedModalDismissalCompleted(',
    );
    expect(modalDismissalSource).toContain(
      'if (dismissalWasAlreadyCompleted && dismissedIndex < 0)',
    );
    expect(modalDismissalSource).toContain(
      'const modalController = controller?.topViewController ?? controller;',
    );
    expect(
      modalDismissalSource.indexOf('markPresentedModalDismissalCompleted('),
    ).toBeLessThan(
      modalDismissalSource.indexOf(
        'finishModalScreenDismissalTransition(controller, true);',
      ),
    );
    expect(stackSource).not.toContain(
      'completeDismissal(modalControllerProps ? modalController : controller)',
    );
    expect(modalDismissalSource).toContain(
      'COMPLETE_NATIVE_PRESENTED_MODAL_DISMISSAL_KEY',
    );
    expect(modalDismissalSource).toContain(
      'dismissedModalScreenId ??\n' + '    presentedModalScreenIdForDismissal(',
    );
    expect(modalDismissalSource).toContain('knownRegistry ??');
    expect(modalDismissalSource).toContain(
      '= completeNativePresentedModalDismissalForController',
    );
    expect(modalDismissalSource).toContain(
      'finishTransition(stackId, registry, ctx, true, screenId);',
    );
    expect(stackSource).toContain('__nativeScriptDismissEventEmitted');
  });

  it('ports RNSScreenContainer and RNSScreenNavigationContainer containment through UIKit', () => {
    const layoutContainerSource = stackSource.slice(
      stackSource.indexOf('function layoutContainerScreen'),
      stackSource.indexOf('function attachContainerScreen'),
    );

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
    expect(stackSource).toContain(
      'disableDetachedChildrenTouchHandler={containerOwnsNativeAttachment}',
    );
    expect(stackSource).toContain(
      'externalDetachedChildrenOwner={containerOwnsNativeAttachment}',
    );
    expect(layoutContainerSource).toContain(
      'const didSetFrame = setViewFrameIfNeeded(screenView, parentView.bounds);',
    );
    expect(layoutContainerSource).toContain(
      'screenHasStableReadyMountedContent(',
    );
    expect(layoutContainerSource).toContain(
      'screenViewHasVisibleHostedReactContent(screenView)',
    );
    expect(layoutContainerSource).toContain(
      'container-layout-skip-stable-hosted-repair',
    );
    expect(layoutContainerSource).toContain('container.layoutHosted');
  });

  it('ports the native child components that ScreenStackItem renders instead of bypassing them', () => {
    expect(screenContentWrapperSource).toContain("Platform.OS === 'ios'");
    expect(screenContentWrapperSource).toContain(
      'NativeScriptRuntime.defineUIKitContainer',
    );
    expect(screenContentWrapperSource).toContain(
      "debugName: 'RNSScreenContentWrapper.NativeScript'",
    );
    expect(screenContentWrapperSource).toContain(
      'rootView.__rnsNativeScriptScreenContentWrapperChildrenView =',
    );
    expect(screenContentWrapperSource).toContain(
      'const childrenView = rootView;',
    );
    expect(screenContentWrapperSource).toContain(
      'markNativeScriptScreenContentWrapperIdentity(rootView, childrenView);',
    );
    expect(screenContentWrapperSource).toContain(
      'SCREEN_CONTENT_WRAPPER_ROOT_ASSOCIATION_KEY',
    );
    expect(screenContentWrapperSource).toContain(
      'SCREEN_CONTENT_WRAPPER_CHILDREN_ASSOCIATION_KEY',
    );
    expect(screenContentWrapperSource).toContain(
      'setNativeScriptAssociatedObjectForKey(',
    );
    expect(screenContentWrapperSource).not.toContain(
      'const childrenAllocated = UIView.alloc();',
    );
    expect(screenContentWrapperSource).not.toContain(
      'childrenView.__rnsNativeScriptScreenContentWrapperChildHost = true;',
    );
    expect(screenContentWrapperSource).not.toContain(
      'rootView.addSubview(childrenView);',
    );
    expect(screenContentWrapperSource).toContain(
      'if (!rootOwnsChildren) {\n' +
        '      childrenView.removeFromSuperview?.();\n' +
        '      rootView.addSubview?.(childrenView);',
    );
    expect(screenContentWrapperSource).not.toContain(
      'const shouldAttachChildrenToRoot',
    );
    expect(screenContentWrapperSource).toContain(
      'const contentWrapperViewHandle = firstNonEmptyHandle(\n' +
        '        nativeScriptScreenContentWrapperHandle(view),\n' +
        '        nativeEvent.nativeViewHandle,\n' +
        '        nativeEvent.childrenViewHandle,\n' +
        '        nativeEvent.componentViewHandle,\n' +
        '      );',
    );
    expect(screenContentWrapperSource).not.toContain(
      'nativeEvent.nativeViewHandle ??',
    );
    expect(screenContentWrapperSource).toContain(
      'nativeScriptScreenContentWrapperHostReadyOnUI(',
    );
    expect(screenContentWrapperSource).toContain(
      'if (notifyFrame) {\n' +
        '    notifyNativeScriptScreenContentWrapperFrame(\n' +
        '      props.screenId,\n' +
        '      rootView.frame,\n' +
        '      rootView,',
    );
    expect(screenContentWrapperSource).toContain(
      'refreshUIKitHostViewDirectOwner',
    );
    expect(screenContentWrapperSource).toContain(
      'layoutNativeScriptScreenContentWrapper(view, props, true, true);',
    );
    expect(screenContentWrapperSource).toContain('notifyFrame = true');
    expect(screenContentWrapperSource).toContain(
      'layoutNativeScriptScreenContentWrapper(view, props, false, false, false);',
    );
    const screenContentWrapperHostReadySource =
      screenContentWrapperSource.slice(
        screenContentWrapperSource.indexOf('hostReady(view, props, event)'),
        screenContentWrapperSource.indexOf('},\n  });'),
      );
    expect(screenContentWrapperHostReadySource).not.toContain(
      'layoutNativeScriptScreenContentWrapper(view, props, true)',
    );
    expect(screenContentWrapperSource).not.toContain(
      'function syncCollectedNativeScriptScreenContentChildren',
    );
    expect(screenContentWrapperSource).not.toContain(
      'NativeScriptRuntime.collectedUIKitHostChildren',
    );
    expect(screenContentWrapperSource).not.toContain('collectChildren');
    expect(screenContentWrapperSource).toContain('immediateTransactionCommit');
    expect(screenContentWrapperSource).toContain(
      'disableUIKitHostWindowAttachRefresh',
    );
    expect(screenContentWrapperSource).toContain(
      "screenId.endsWith(':modal-header')",
    );
    expect(screenContentWrapperSource).toContain(
      'ignoreHostReadyWindowAttachment={ignoreHostReadyWindowAttachment}',
    );
    expect(screenContentWrapperSource).toContain('attachNativeView={false}');
    expect(screenContentWrapperSource).toContain(
      'disableDetachedChildrenTouchHandler={!isModalHeader}',
    );
    expect(screenContentWrapperSource).not.toContain(
      'externalDetachedChildrenOwner',
    );
    expect(screenContentWrapperSource).toContain(
      '__rnsNativeScriptScreenContentWrapperAllowsTouchFallback',
    );
    expect(screenContentWrapperSource).toContain('emitOffWindowHostReady');
    expect(screenContentWrapperSource).toContain(
      'transactionCommitted(view, props)',
    );
    expect(screenContentWrapperSource).toContain(
      'nativeScriptScreenContentWrapperHostReadyOnUI(\n' +
        '        props.screenId,\n' +
        '        nativeScriptScreenContentWrapperHandle(view),',
    );
    expect(screenContentWrapperSource).not.toContain(
      'preserveDetachedChildrenLayout',
    );
    expect(screenContentWrapperSource).not.toContain(
      'React.cloneElement(onlyChild',
    );
    expect(screenContentWrapperSource).not.toContain(
      'return <View ref={ref} collapsable={false} {...props} />;',
    );
    expect(screenContentWrapperSource).not.toContain('NativeClass');
    expect(screenContentWrapperSource).not.toContain('didMoveToWindow()');
    expect(screenContentWrapperSource).not.toContain(
      '__rnsNativeScriptScreenContentWrapperScreenId',
    );
    expect(screenContentWrapperSource).not.toContain('setTimeout(refresh');
    const stackItemContentSource = stackSource.slice(
      stackSource.indexOf('const content = ('),
      stackSource.indexOf('if (retainedByStack)'),
    );
    expect(stackItemContentSource).not.toContain(
      '<NativeScriptScreenContentWrapper',
    );
    expect(stackItemContentSource).toContain(
      '<NativeScriptScreenHeaderSubviewContext.Provider value={{ screenId }}>',
    );
    expect(stackItemContentSource).toContain(
      '<TransitionProgressContext.Provider',
    );
    expect(stackItemContentSource).not.toContain(
      'preserveDetachedChildrenLayout',
    );
    expect(stackSource).toContain(
      'nativeScriptScreenContentWrapperRootViewForView(contentWrapperView)',
    );
    expect(stackSource).toContain(
      'markNativeScriptScreenContentWrapperIdentity(wrapper, childrenView);',
    );
    expect(stackSource).toContain(
      'nativeScriptScreenHostReadyOnUI(\n' +
        '      props.screenId,\n' +
        '      props.parentId,\n' +
        '      screenViewHandle,',
    );
    expect(stackSource).toContain(
      'const registeredContentWrapperView =\n      registry.screenContentWrapperViews[screenId];',
    );
    expect(stackSource).toContain(
      'contentWrapperView = registeredContentWrapperView;',
    );
    expect(stackSource).toContain(
      'resolvedNativeScriptScreenContentWrapperView(contentWrapperView)',
    );
    expect(stackSource).toContain('collapsable={false}');
    expect(stackSource).toContain(
      'The NativeScript host must receive the controller handle',
    );
    expect(stackSource).toContain('attachController');
    expect(stackSource).toContain('attachControllerToParent={false}');
    expect(stackSource).toContain('attachControllerView={false}');
    expect(stackSource).toContain('attachNativeView={false}');
    expect(stackSource).toContain('disableDetachedChildrenTouchHandler');
    expect(stackSource).toContain('externalDetachedChildrenOwner');
    expect(stackSource).toContain('disable generic parent attachment');
    expect(stackSource).not.toContain(
      'detachControllersFromWrongNavigationParent',
    );
    expect(screenStackHeaderConfigSource).toContain("Platform.OS === 'ios'");
    expect(screenStackHeaderConfigSource).toContain(
      'const NativeScriptHeaderConfigHost = NativeScriptRuntime.defineUIKitContainer',
    );
    expect(screenStackHeaderConfigSource).toContain(
      "debugName: 'RNSScreenStackHeaderConfig.NativeScript'",
    );
    expect(screenStackHeaderConfigSource).toContain(
      'preserveDetachedChildrenLayout',
    );
    expect(screenStackHeaderConfigSource).toContain('collectChildren');
    expect(screenStackHeaderConfigSource).toContain('rootView.hidden = true');
    expect(screenStackHeaderConfigSource).toContain('attachController={false}');
    expect(screenStackHeaderConfigSource).toContain('attachNativeView');
    expect(safeAreaViewSource).not.toContain("Platform.OS === 'ios'");
    expect(safeAreaViewIOSSource).toContain(
      'NativeScriptRuntime.defineUIKitContainer',
    );
    expect(safeAreaViewIOSSource).toContain(
      "debugName: 'RNSSafeAreaView.NativeScript'",
    );
    expect(safeAreaViewIOSSource).toContain(
      '__rnsNativeScriptSafeAreaContentView',
    );
    expect(safeAreaViewIOSSource).toContain(
      'disableDetachedChildrenTouchHandler',
    );
    expect(safeAreaViewIOSSource).not.toContain(
      'preserveDetachedChildrenLayout',
    );
    expect(stackSource).toContain('providerSafeAreaInsets');
    expect(stackSource).toContain(
      'return screenViewEffectiveSafeAreaInsets(this);',
    );
    expect(stackSource).not.toContain('safeAreaInsets() {');
    expect(stackSource).not.toContain('safeAreaInsets: {');
    expect(stackSource).toContain('RNSSafeAreaDidChange');
    expect(stackSource).toContain('function nativeScriptScreenViewClass');
    expect(stackSource).toContain('function createNativeScriptScreenView');
    expect(stackSource).toContain('didMoveToSuperview()');
    expect(stackSource).toContain('refreshSurfaceTouchHandler()');
    expect(stackSource).toContain("nativeValue('RCTSurfaceTouchHandler')");
    expect(stackSource).toContain('attachToView?.(view)');
    expect(stackSource).toContain(
      'function refreshNativeScriptScreenViewSurfaceTouchHandler',
    );
    expect(stackSource).toContain('detachSurfaceTouchHandlerFromView');
    expect(stackSource).toContain('loadView()');
    expect(stackSource).toContain('this.view = view;');
    expect(safeAreaViewIOSSource).toContain(
      'NATIVESCRIPT_PORT_DEVIATION: upstream RNSSafeAreaViewComponentView',
    );
    expect(safeAreaViewIOSSource).toContain(
      'NativeScript cannot mutate that Fabric C++ shadow state',
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

  it('seeds missing UINavigationBar top safe area idempotently', () => {
    const controllerView = {
      dispatchSafeAreaDidChangeNotification: jest.fn(),
      layoutIfNeeded: jest.fn(),
      safeAreaInsets: { top: 59, left: 0, bottom: 0, right: 0 },
      setNeedsLayout: jest.fn(),
    };
    const controller: any = {
      additionalSafeAreaInsets: { top: 5, left: 1, bottom: 2, right: 3 },
      view: controllerView,
    };
    const navigationController = {
      navigationBar: {
        frame: { origin: { y: 0 }, size: { height: 96 } },
        hidden: false,
      },
    };

    __nativeScriptSyncNavigationBarSafeAreaInsetForTests(
      navigationController,
      controller,
    );

    expect(controller.__rnsNativeScriptNavigationBarSafeAreaTop).toBe(37);
    expect(controller.additionalSafeAreaInsets).toEqual({
      top: 42,
      left: 1,
      bottom: 2,
      right: 3,
    });
    expect(
      controllerView.dispatchSafeAreaDidChangeNotification,
    ).toHaveBeenCalledTimes(1);

    controllerView.safeAreaInsets = { top: 96, left: 0, bottom: 0, right: 0 };
    __nativeScriptSyncNavigationBarSafeAreaInsetForTests(
      navigationController,
      controller,
    );

    expect(controller.__rnsNativeScriptNavigationBarSafeAreaTop).toBe(37);
    expect(controller.additionalSafeAreaInsets.top).toBe(42);
    expect(
      controllerView.dispatchSafeAreaDidChangeNotification,
    ).toHaveBeenCalledTimes(1);

    navigationController.navigationBar.hidden = true;
    __nativeScriptSyncNavigationBarSafeAreaInsetForTests(
      navigationController,
      controller,
    );

    expect(controller.__rnsNativeScriptNavigationBarSafeAreaTop).toBe(0);
    expect(controller.additionalSafeAreaInsets).toEqual({
      top: 5,
      left: 1,
      bottom: 2,
      right: 3,
    });
    expect(
      controllerView.dispatchSafeAreaDidChangeNotification,
    ).toHaveBeenCalledTimes(2);
  });

  it('leaves UINavigationBar frame ownership to UIKit without invalidating layout', () => {
    const bringSubviewToFront = jest.fn();
    const navigationBar = {
      frame: { origin: { x: 0, y: 10 }, size: { width: 402, height: 54 } },
      superview: { bringSubviewToFront },
      transform: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 52 },
    };
    const setNeedsLayout = jest.fn();
    const navigationController: any = {
      __nativeScriptStackContainerView: {
        safeAreaInsets: { top: 0 },
        superview: {
          safeAreaInsets: { top: 62 },
        },
      },
      navigationBar,
      parentViewController: {
        view: { safeAreaInsets: { top: 0 } },
      },
      view: {
        safeAreaInsets: { top: 0 },
        setNeedsLayout,
        superview: { safeAreaInsets: { top: 0 } },
        window: { safeAreaInsets: { top: 0 } },
      },
    };

    __nativeScriptLayoutNavigationBarWithinSafeAreaForTests(
      navigationController,
    );

    expect(navigationBar.frame.origin.y).toBe(10);
    expect(navigationBar.transform).toEqual({
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      tx: 0,
      ty: 52,
    });
    expect(bringSubviewToFront).toHaveBeenCalledWith(navigationBar);
    expect(setNeedsLayout).not.toHaveBeenCalled();
  });

  it('refreshes child screen safe areas after UINavigationController layout updates the bar', () => {
    const controllerView = {
      dispatchSafeAreaDidChangeNotification: jest.fn(),
      layoutIfNeeded: jest.fn(),
      safeAreaInsets: { top: 10, left: 0, bottom: 0, right: 0 },
      setNeedsLayout: jest.fn(),
    };
    const controller: any = {
      additionalSafeAreaInsets: { top: 0, left: 0, bottom: 0, right: 0 },
      view: controllerView,
    };
    const navigationController: any = {
      navigationBar: {
        frame: { origin: { y: 62 }, size: { height: 54 } },
        hidden: false,
      },
      viewControllers: [controller],
    };

    __nativeScriptSyncNavigationStackSafeAreaInsetsForTests(
      navigationController,
    );

    expect(controller.__rnsNativeScriptNavigationBarSafeAreaTop).toBe(106);
    expect(controller.additionalSafeAreaInsets.top).toBe(106);
    expect(
      controllerView.dispatchSafeAreaDidChangeNotification,
    ).toHaveBeenCalledTimes(1);
  });

  it('preserves the missing transparent-header safe area after modal dismiss on parented stacks', () => {
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIEdgeInsetsMake: (
        top: number,
        left: number,
        bottom: number,
        right: number,
      ) => ({ top, left, bottom, right }),
    };
    delete (global as Record<string, unknown>).__rnsNativeScriptStackRegistry;

    const controllerView = {
      dispatchSafeAreaDidChangeNotification: jest.fn(),
      layoutIfNeeded: jest.fn(),
      safeAreaInsets: { top: 64, left: 0, bottom: 0, right: 0 },
      setNeedsLayout: jest.fn(),
      subviews: [],
    };
    const controller: any = {
      __nativeScriptScreenId: 'home',
      additionalSafeAreaInsets: { top: 0, left: 0, bottom: 0, right: 0 },
      view: controllerView,
    };
    const navigationController: any = {
      navigationBar: {
        frame: { origin: { y: 62 }, size: { height: 54 } },
        hidden: false,
      },
      parentViewController: {},
      view: {
        safeAreaInsets: { top: 62 },
        window: { safeAreaInsets: { top: 62 } },
      },
    };

    __nativeScriptSyncNavigationBarSafeAreaInsetForTests(
      navigationController,
      controller,
    );

    expect(controller.__rnsNativeScriptNavigationBarSafeAreaTop).toBe(52);
    expect(controller.additionalSafeAreaInsets.top).toBe(52);
    expect(
      controllerView.dispatchSafeAreaDidChangeNotification,
    ).toHaveBeenCalledTimes(1);

    controllerView.safeAreaInsets = { top: 168, left: 0, bottom: 0, right: 0 };
    __nativeScriptSyncNavigationBarSafeAreaInsetForTests(
      navigationController,
      controller,
    );

    expect(controller.__rnsNativeScriptNavigationBarSafeAreaTop).toBe(0);
    expect(controller.additionalSafeAreaInsets.top).toBe(0);
    expect(
      controllerView.dispatchSafeAreaDidChangeNotification,
    ).toHaveBeenCalledTimes(2);

    delete (global as Record<string, unknown>).__nativeScriptNativeApi;
    delete (global as Record<string, unknown>).__rnsNativeScriptStackRegistry;
  });

  it('uses safe-area injection without also mirroring transparent-header scroll insets', () => {
    const ScrollViewClass = function UIScrollView() {};
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      CGPointMake: (x: number, y: number) => ({ x, y }),
      UIEdgeInsetsMake: (
        top: number,
        left: number,
        bottom: number,
        right: number,
      ) => ({ top, left, bottom, right }),
      UIScrollView: ScrollViewClass,
    };
    delete (global as Record<string, unknown>).__rnsNativeScriptStackRegistry;

    const scrollView = {
      contentInset: { top: 0, left: 0, bottom: 0, right: 0 },
      contentOffset: { x: 0, y: 0 },
      isKindOfClass: (klass: unknown) => klass === ScrollViewClass,
      scrollIndicatorInsets: { top: 0, left: 0, bottom: 0, right: 0 },
      subviews: [],
    };
    const controllerView = {
      dispatchSafeAreaDidChangeNotification: jest.fn(),
      layoutIfNeeded: jest.fn(),
      safeAreaInsets: { top: 0, left: 0, bottom: 0, right: 0 },
      setNeedsLayout: jest.fn(),
      subviews: [{ subviews: [scrollView] }],
    };
    const controller: any = {
      __nativeScriptScreenId: 'home',
      additionalSafeAreaInsets: { top: 0, left: 0, bottom: 0, right: 0 },
      view: controllerView,
    };
    const navigationController = {
      navigationBar: {
        frame: { origin: { y: 10 }, size: { height: 54 } },
        hidden: false,
      },
      view: {
        safeAreaInsets: { top: 0 },
        window: { safeAreaInsets: { top: 62 } },
      },
    };

    __nativeScriptSyncNavigationBarSafeAreaInsetForTests(
      navigationController,
      controller,
    );

    expect(controller.__rnsNativeScriptNavigationBarSafeAreaTop).toBe(116);
    expect(controller.additionalSafeAreaInsets.top).toBe(116);
    expect(scrollView.contentInset.top).toBe(0);
    expect(scrollView.scrollIndicatorInsets.top).toBe(0);
    expect(scrollView.contentOffset).toEqual({ x: 0, y: 0 });

    __nativeScriptSyncNavigationBarSafeAreaInsetForTests(
      navigationController,
      controller,
    );
    expect(scrollView.contentOffset).toEqual({ x: 0, y: 0 });

    scrollView.contentInset = { top: 0, left: 0, bottom: 0, right: 0 };
    __nativeScriptSyncNavigationBarSafeAreaInsetForTests(
      navigationController,
      controller,
    );
    expect(scrollView.contentInset.top).toBe(0);
    expect(scrollView.contentOffset).toEqual({ x: 0, y: 0 });

    delete (global as Record<string, unknown>).__nativeScriptNativeApi;
    delete (global as Record<string, unknown>).__rnsNativeScriptStackRegistry;
  });

  it('does not mirror scroll insets when UIKit already propagated the navigation safe area', () => {
    const ScrollViewClass = function UIScrollView() {};
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIEdgeInsetsMake: (
        top: number,
        left: number,
        bottom: number,
        right: number,
      ) => ({ top, left, bottom, right }),
      UIScrollView: ScrollViewClass,
    };
    delete (global as Record<string, unknown>).__rnsNativeScriptStackRegistry;

    const scrollView = {
      contentInset: { top: 116, left: 0, bottom: 0, right: 0 },
      contentOffset: { x: 0, y: -232 },
      isKindOfClass: (klass: unknown) => klass === ScrollViewClass,
      scrollIndicatorInsets: { top: 116, left: 0, bottom: 0, right: 0 },
      subviews: [],
    };
    const controllerView = {
      dispatchSafeAreaDidChangeNotification: jest.fn(),
      layoutIfNeeded: jest.fn(),
      safeAreaInsets: { top: 116, left: 0, bottom: 0, right: 0 },
      setNeedsLayout: jest.fn(),
      subviews: [{ subviews: [scrollView] }],
    };
    const controller: any = {
      __nativeScriptScreenId: 'home',
      additionalSafeAreaInsets: { top: 0, left: 0, bottom: 0, right: 0 },
      view: controllerView,
    };
    const navigationController = {
      navigationBar: {
        frame: { origin: { y: 10 }, size: { height: 54 } },
        hidden: false,
      },
      parentViewController: {
        view: { safeAreaInsets: { top: 350 } },
      },
      view: {
        safeAreaInsets: { top: 0 },
        window: { safeAreaInsets: { top: 62 } },
      },
    };

    __nativeScriptSyncNavigationBarSafeAreaInsetForTests(
      navigationController,
      controller,
    );

    expect(
      controller.__rnsNativeScriptNavigationBarSafeAreaTop,
    ).toBeUndefined();
    expect(scrollView.contentInset.top).toBe(0);
    expect(scrollView.scrollIndicatorInsets.top).toBe(0);
    expect(scrollView.contentOffset).toEqual({ x: 0, y: -116 });

    delete (global as Record<string, unknown>).__nativeScriptNativeApi;
    delete (global as Record<string, unknown>).__rnsNativeScriptStackRegistry;
  });

  it('does not inject the underlying window safe area into presented modal stacks', () => {
    const ScrollViewClass = function UIScrollView() {};
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIEdgeInsetsMake: (
        top: number,
        left: number,
        bottom: number,
        right: number,
      ) => ({ top, left, bottom, right }),
      UIScrollView: ScrollViewClass,
    };
    delete (global as Record<string, unknown>).__rnsNativeScriptStackRegistry;

    const scrollView = {
      contentInset: { top: 0, left: 0, bottom: 0, right: 0 },
      contentOffset: { x: 0, y: -70 },
      isKindOfClass: (klass: unknown) => klass === ScrollViewClass,
      scrollIndicatorInsets: { top: 0, left: 0, bottom: 0, right: 0 },
      subviews: [],
    };
    const controllerView = {
      dispatchSafeAreaDidChangeNotification: jest.fn(),
      safeAreaInsets: { top: 70, left: 0, bottom: 0, right: 0 },
      setNeedsLayout: jest.fn(),
      subviews: [{ subviews: [scrollView] }],
    };
    const controller: any = {
      __nativeScriptScreenId: 'modal',
      additionalSafeAreaInsets: { top: 0, left: 0, bottom: 0, right: 0 },
      view: controllerView,
    };
    const navigationController: any = {
      navigationBar: {
        frame: { origin: { y: 16 }, size: { height: 54 } },
        hidden: false,
      },
      presentationController: {},
      view: {
        safeAreaInsets: { top: 0 },
        superview: { safeAreaInsets: { top: 62 } },
        window: { safeAreaInsets: { top: 62 } },
      },
    };

    __nativeScriptSyncNavigationBarSafeAreaInsetForTests(
      navigationController,
      controller,
    );

    expect(
      controller.__rnsNativeScriptNavigationBarSafeAreaTop,
    ).toBeUndefined();
    expect(controller.additionalSafeAreaInsets.top).toBe(0);
    expect(scrollView.contentInset.top).toBe(0);
    expect(scrollView.scrollIndicatorInsets.top).toBe(0);
    expect(scrollView.contentOffset).toEqual({ x: 0, y: -70 });
    expect(
      controllerView.dispatchSafeAreaDidChangeNotification,
    ).not.toHaveBeenCalled();

    delete (global as Record<string, unknown>).__nativeScriptNativeApi;
    delete (global as Record<string, unknown>).__rnsNativeScriptStackRegistry;
  });

  it('keeps presented modal stack containers from leaking root top safe area', () => {
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIEdgeInsetsMake: (
        top: number,
        left: number,
        bottom: number,
        right: number,
      ) => ({ top, left, bottom, right }),
    };

    const navigationController = {
      addChildViewController: jest.fn(),
      navigationBar: {},
      parentViewController: {
        view: {
          safeAreaInsets: { top: 0, left: 1, bottom: 34, right: 2 },
        },
      },
      presentationController: {},
      view: {
        safeAreaInsets: { top: 0, left: 3, bottom: 34, right: 4 },
      },
    };
    const stackContainer = {
      __nativeScriptNavigationController: navigationController,
      superview: {
        safeAreaInsets: { top: 62, left: 5, bottom: 20, right: 6 },
      },
      window: {
        safeAreaInsets: { top: 62, left: 7, bottom: 34, right: 8 },
      },
    };

    expect(
      __nativeScriptStackContainerEffectiveSafeAreaInsetsForTests(
        stackContainer,
      ),
    ).toEqual({ top: 0, left: 7, bottom: 34, right: 8 });

    expect(
      __nativeScriptStackContainerEffectiveSafeAreaInsetsForTests({
        subviews: [{ nextResponder: navigationController }],
        superview: {
          safeAreaInsets: { top: 62, left: 5, bottom: 20, right: 6 },
        },
        window: {
          safeAreaInsets: { top: 62, left: 7, bottom: 34, right: 8 },
        },
      }),
    ).toEqual({ top: 0, left: 7, bottom: 34, right: 8 });

    delete (global as Record<string, unknown>).__nativeScriptNativeApi;
  });

  it('derives screen view safe areas from the owning navigation controller like RNSScreenView', () => {
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIEdgeInsetsMake: (
        top: number,
        left: number,
        bottom: number,
        right: number,
      ) => ({ top, left, bottom, right }),
    };

    const modalRouteController: any = {
      addChildViewController: jest.fn(),
      view: null as unknown,
    };
    const modalRouteView = {
      nextResponder: modalRouteController,
      superview: { safeAreaInsets: { top: 0, left: 0, bottom: 34, right: 0 } },
      window: { safeAreaInsets: { top: 62, left: 0, bottom: 34, right: 0 } },
    };
    const modalNavigationController = {
      navigationBar: {
        frame: { origin: { y: 16 }, size: { height: 54 } },
        hidden: false,
      },
      view: {
        safeAreaInsets: { top: 0, left: 0, bottom: 34, right: 0 },
      },
      viewControllers: [modalRouteController],
    };
    modalRouteController.view = modalRouteView;
    modalRouteController.navigationController = modalNavigationController;

    expect(
      __nativeScriptScreenViewEffectiveSafeAreaInsetsForTests(modalRouteView),
    ).toEqual({ top: 70, left: 0, bottom: 34, right: 0 });

    const rootRouteController: any = {
      addChildViewController: jest.fn(),
      view: null as unknown,
    };
    const rootRouteView = {
      nextResponder: rootRouteController,
      superview: { safeAreaInsets: { top: 0, left: 0, bottom: 83, right: 0 } },
      window: { safeAreaInsets: { top: 62, left: 0, bottom: 83, right: 0 } },
    };
    const rootNavigationController = {
      navigationBar: {
        frame: { origin: { y: 62 }, size: { height: 54 } },
        hidden: false,
      },
      view: {
        safeAreaInsets: { top: 62, left: 0, bottom: 83, right: 0 },
      },
      viewControllers: [rootRouteController],
    };
    rootRouteController.view = rootRouteView;
    rootRouteController.navigationController = rootNavigationController;

    expect(
      __nativeScriptScreenViewEffectiveSafeAreaInsetsForTests(rootRouteView),
    ).toEqual({ top: 116, left: 0, bottom: 83, right: 0 });

    const proxiedRootRouteController: any = {
      addChildViewController: jest.fn(),
      hash: 4242,
      view: null as unknown,
    };
    const proxiedRootRouteView = {
      nextResponder: proxiedRootRouteController,
      superview: { safeAreaInsets: { top: 62, left: 0, bottom: 83, right: 0 } },
      window: { safeAreaInsets: { top: 62, left: 0, bottom: 83, right: 0 } },
    };
    const proxiedRootNavigationController = {
      navigationBar: {
        frame: { origin: { y: 62 }, size: { height: 54 } },
        hidden: false,
      },
      view: {
        safeAreaInsets: { top: 62, left: 0, bottom: 83, right: 0 },
      },
      viewControllers: [{ hash: 4242 }],
    };
    proxiedRootRouteController.view = proxiedRootRouteView;
    proxiedRootRouteController.navigationController =
      proxiedRootNavigationController;

    expect(
      __nativeScriptScreenViewEffectiveSafeAreaInsetsForTests(
        proxiedRootRouteView,
      ),
    ).toEqual({ top: 116, left: 0, bottom: 83, right: 0 });

    const modalContainerView = {
      superview: { safeAreaInsets: { top: 0, left: 1, bottom: 34, right: 2 } },
      window: { safeAreaInsets: { top: 62, left: 3, bottom: 34, right: 4 } },
    };

    expect(
      __nativeScriptScreenViewEffectiveSafeAreaInsetsForTests(
        modalContainerView,
      ),
    ).toEqual({ top: 0, left: 3, bottom: 34, right: 4 });

    delete (global as Record<string, unknown>).__nativeScriptNativeApi;
  });

  it('clears stale hosted scroll insets when safe area is already propagated before parent proxy settles', () => {
    const ScrollViewClass = function UIScrollView() {};
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIEdgeInsetsMake: (
        top: number,
        left: number,
        bottom: number,
        right: number,
      ) => ({ top, left, bottom, right }),
      UIScrollView: ScrollViewClass,
    };
    delete (global as Record<string, unknown>).__rnsNativeScriptStackRegistry;

    const scrollView = {
      contentInset: { top: 116, left: 0, bottom: 0, right: 0 },
      contentOffset: { x: 0, y: -232 },
      isKindOfClass: (klass: unknown) => klass === ScrollViewClass,
      scrollIndicatorInsets: { top: 116, left: 0, bottom: 0, right: 0 },
      subviews: [],
    };
    const controllerView = {
      dispatchSafeAreaDidChangeNotification: jest.fn(),
      layoutIfNeeded: jest.fn(),
      safeAreaInsets: { top: 116, left: 0, bottom: 0, right: 0 },
      setNeedsLayout: jest.fn(),
      subviews: [{ subviews: [scrollView] }],
    };
    const controller: any = {
      __nativeScriptScreenId: 'home',
      additionalSafeAreaInsets: { top: 0, left: 0, bottom: 0, right: 0 },
      view: controllerView,
    };
    const registry = ((
      global as Record<string, any>
    ).__rnsNativeScriptStackRegistry = {
      screenScrollInsetTops: { home: 116 },
    });
    const navigationController = {
      navigationBar: {
        frame: { origin: { y: 62 }, size: { height: 54 } },
        hidden: false,
      },
      view: {
        safeAreaInsets: { top: 0 },
        window: { safeAreaInsets: { top: 62 } },
      },
    };

    __nativeScriptSyncNavigationBarSafeAreaInsetForTests(
      navigationController,
      controller,
    );

    expect(registry.screenScrollInsetTops.home).toBe(0);
    expect(scrollView.contentInset.top).toBe(0);
    expect(scrollView.scrollIndicatorInsets.top).toBe(0);
    expect(scrollView.contentOffset).toEqual({ x: 0, y: -116 });

    delete (global as Record<string, unknown>).__nativeScriptNativeApi;
    delete (global as Record<string, unknown>).__rnsNativeScriptStackRegistry;
  });

  it('attaches nested stacks to the nearest host view controller', () => {
    const parentController = {
      __nativeScriptScreenId: 'parent-screen',
      addChildViewController: jest.fn(),
      view: null as unknown,
    };
    const controller = {
      didMoveToParentViewController: jest.fn(),
      view: {
        removeFromSuperview: jest.fn(),
      },
    };
    const stackView = {
      addSubview: jest.fn(),
      nextResponder: parentController,
      reactSuperview: jest.fn(() => null),
      window: {},
    };
    parentController.view = stackView;

    expect(
      __nativeScriptReactAddControllerToClosestParentForTests(
        stackView,
        controller,
      ),
    ).toBe(true);
    expect(parentController.addChildViewController).toHaveBeenCalledWith(
      controller,
    );
    expect(stackView.addSubview).toHaveBeenCalledWith(controller.view);
    expect(controller.didMoveToParentViewController).toHaveBeenCalledWith(
      parentController,
    );
  });

  it('waits instead of falling back to the app root before a host controller is reachable', () => {
    const controller = {
      didMoveToParentViewController: jest.fn(),
      view: {
        removeFromSuperview: jest.fn(),
      },
    };
    const stackView = {
      addSubview: jest.fn(),
      reactSuperview: jest.fn(() => null),
      window: {},
    };

    expect(
      __nativeScriptReactAddControllerToClosestParentForTests(
        stackView,
        controller,
      ),
    ).toBe(false);
    expect(stackView.addSubview).not.toHaveBeenCalled();
    expect(controller.didMoveToParentViewController).not.toHaveBeenCalled();
  });

  it('repairs stale stack containment when the real host controller becomes reachable', () => {
    const previousParent = {
      __nativeScriptScreenId: 'stale-parent',
      view: { window: {} },
    };
    const parentController = {
      __nativeScriptScreenId: 'parent-screen',
      addChildViewController: jest.fn(),
      view: null as unknown,
    };
    const controller = {
      didMoveToParentViewController: jest.fn(),
      parentViewController: previousParent as Record<string, unknown> | null,
      removeFromParentViewController: jest.fn(function removeFromParent() {
        controller.parentViewController = null;
      }),
      view: {
        removeFromSuperview: jest.fn(),
        superview: {},
      },
      willMoveToParentViewController: jest.fn(),
    };
    const stackView = {
      addSubview: jest.fn(),
      nextResponder: parentController,
      reactSuperview: jest.fn(() => null),
      window: {},
    };
    parentController.view = stackView;

    expect(
      __nativeScriptReactAddControllerToClosestParentForTests(
        stackView,
        controller,
      ),
    ).toBe(true);
    expect(controller.willMoveToParentViewController).toHaveBeenCalledWith(
      null,
    );
    expect(controller.removeFromParentViewController).toHaveBeenCalled();
    expect(parentController.addChildViewController).toHaveBeenCalledWith(
      controller,
    );
    expect(stackView.addSubview).toHaveBeenCalledWith(controller.view);
    expect(controller.didMoveToParentViewController).toHaveBeenCalledWith(
      parentController,
    );
  });

  it('does not report a containment mutation when the stack is already at its closest parent', () => {
    const parentController = {
      addChildViewController: jest.fn(),
      view: null as unknown,
    };
    const controllerView = {
      superview: null as unknown,
    };
    const stackView = {
      addSubview: jest.fn(),
      nextResponder: parentController,
      reactSuperview: jest.fn(() => null),
    };
    parentController.view = stackView;
    controllerView.superview = stackView;
    const controller = {
      didMoveToParentViewController: jest.fn(),
      parentViewController: parentController,
      view: controllerView,
    };

    expect(
      __nativeScriptReactAddControllerToClosestParentForTests(
        stackView,
        controller,
      ),
    ).toBe(false);
    expect(parentController.addChildViewController).not.toHaveBeenCalled();
    expect(stackView.addSubview).not.toHaveBeenCalled();
    expect(controller.didMoveToParentViewController).not.toHaveBeenCalled();
  });

  it('preserves a tab-installed parent while root containment is not window-provable yet', () => {
    const selectedTabController = {};
    const rootParentController = {
      addChildViewController: jest.fn(),
      view: null as unknown,
    };
    const controller = {
      didMoveToParentViewController: jest.fn(),
      parentViewController: null,
      removeFromParentViewController: jest.fn(),
      valueForKey: jest.fn((key: string) =>
        key === 'parentViewController' ? selectedTabController : null,
      ),
      view: {
        removeFromSuperview: jest.fn(),
        superview: {},
      },
      willMoveToParentViewController: jest.fn(),
    };
    const stackView = {
      addSubview: jest.fn(),
      nextResponder: rootParentController,
      reactSuperview: jest.fn(() => null),
      window: {},
    };
    rootParentController.view = stackView;
    const previousInterop = (global as Record<string, unknown>).interop;
    const getAssociatedObject = jest.fn(() => selectedTabController);
    (global as Record<string, unknown>).interop = {
      getAssociatedObject,
    };

    try {
      expect(
        __nativeScriptReactAddControllerToClosestParentForTests(
          stackView,
          controller,
        ),
      ).toBe(false);
    } finally {
      (global as Record<string, unknown>).interop = previousInterop;
    }
    expect(getAssociatedObject).toHaveBeenCalledWith(
      controller,
      'react-native-screens.NativeScriptRootContainedParentViewController.NativeScriptHandle',
    );
    expect(getAssociatedObject).toHaveBeenCalledWith(
      controller,
      'react-native-screens.NativeScriptRootContainedParentViewController.NativeScriptValue',
    );
    expect(controller.willMoveToParentViewController).not.toHaveBeenCalled();
    expect(controller.removeFromParentViewController).not.toHaveBeenCalled();
    expect(rootParentController.addChildViewController).not.toHaveBeenCalled();
    expect(stackView.addSubview).not.toHaveBeenCalled();
    expect(controller.didMoveToParentViewController).not.toHaveBeenCalled();
  });

  it('preserves an already-parented UIKit stack before associated proof exists', () => {
    const selectedTabController = {
      __rnsNativeScriptTabsEventContext: {},
      addChildViewController: jest.fn(),
      view: null as unknown,
    };
    const rootParentController = {
      addChildViewController: jest.fn(),
      view: null as unknown,
    };
    const setAssociatedObject = jest.fn();
    const previousInterop = (global as Record<string, unknown>).interop;
    (global as Record<string, unknown>).interop = {
      setAssociatedObject,
    };
    const controller = {
      didMoveToParentViewController: jest.fn(),
      parentViewController: null,
      removeFromParentViewController: jest.fn(),
      valueForKey: jest.fn((key: string) =>
        key === 'parentViewController' ? selectedTabController : null,
      ),
      view: {
        removeFromSuperview: jest.fn(),
        superview: null as unknown,
      },
      willMoveToParentViewController: jest.fn(),
    };
    const stackView = {
      addSubview: jest.fn(),
      nextResponder: rootParentController,
      reactSuperview: jest.fn(() => null),
      window: {},
    };
    rootParentController.view = stackView;
    selectedTabController.view = stackView;
    controller.view.superview = stackView;

    try {
      expect(
        __nativeScriptReactAddControllerToClosestParentForTests(
          stackView,
          controller,
        ),
      ).toBe(false);
    } finally {
      (global as Record<string, unknown>).interop = previousInterop;
    }

    expect(setAssociatedObject).toHaveBeenCalledWith(
      controller,
      'react-native-screens.NativeScriptRootContainedParentViewController.NativeScriptValue',
      selectedTabController,
      'assign',
    );
    expect(setAssociatedObject).toHaveBeenCalledWith(
      controller,
      'react-native-screens.NativeScriptRootContainedParentViewController.NativeScriptHandle',
      null,
      'assign',
    );
    expect(controller.valueForKey).toHaveBeenCalledWith('parentViewController');
    expect(controller.willMoveToParentViewController).not.toHaveBeenCalled();
    expect(controller.removeFromParentViewController).not.toHaveBeenCalled();
    expect(rootParentController.addChildViewController).not.toHaveBeenCalled();
    expect(stackView.addSubview).not.toHaveBeenCalled();
    expect(controller.didMoveToParentViewController).not.toHaveBeenCalled();
  });

  it('treats a visibly hosted stack controller as parented when parent proxy is nil', () => {
    const selectedTabController = {
      __rnsNativeScriptTabsEventContext: {},
      addChildViewController: jest.fn(),
      view: null as unknown,
    };
    const setAssociatedObject = jest.fn();
    const previousInterop = (global as Record<string, unknown>).interop;
    (global as Record<string, unknown>).interop = {
      setAssociatedObject,
    };
    const selectedTabView = {
      window: {},
    };
    const stackView = {
      __nativeScriptOwningViewController: selectedTabController,
      addSubview: jest.fn(),
      reactSuperview: jest.fn(() => null),
      superview: selectedTabView,
      window: {},
    };
    selectedTabController.view = selectedTabView;
    const controller = {
      didMoveToParentViewController: jest.fn(),
      parentViewController: null,
      performSelector: jest.fn(() => null),
      removeFromParentViewController: jest.fn(),
      valueForKey: jest.fn(() => null),
      view: {
        removeFromSuperview: jest.fn(),
        superview: stackView,
        window: {},
      },
      willMoveToParentViewController: jest.fn(),
    };

    try {
      expect(
        __nativeScriptReactAddControllerToClosestParentForTests(
          stackView,
          controller,
        ),
      ).toBe(false);
    } finally {
      (global as Record<string, unknown>).interop = previousInterop;
    }

    expect(selectedTabController.addChildViewController).not.toHaveBeenCalled();
    expect(controller.willMoveToParentViewController).not.toHaveBeenCalled();
    expect(controller.removeFromParentViewController).not.toHaveBeenCalled();
    expect(stackView.addSubview).not.toHaveBeenCalled();
    expect(controller.didMoveToParentViewController).not.toHaveBeenCalled();
    expect(setAssociatedObject).toHaveBeenCalledWith(
      controller,
      'react-native-screens.NativeScriptRootContainedParentViewController.NativeScriptValue',
      selectedTabController,
      'assign',
    );
  });

  it('treats UIKit already-parented addChild rejection as parent proof', () => {
    const rootParentController = {
      __nativeScriptScreenId: 'parent-screen',
      addChildViewController: jest.fn(() => {
        throw new Error(
          'child view controller:<UINavigationController> should have parent view controller:<RNSTabsScreenNativeScriptController> but requested parent is:<UIViewController>',
        );
      }),
      view: null as unknown,
    };
    const controller = {
      didMoveToParentViewController: jest.fn(),
      parentViewController: null,
      performSelector: jest.fn(() => null),
      removeFromParentViewController: jest.fn(),
      valueForKey: jest.fn(() => null),
      view: {
        removeFromSuperview: jest.fn(),
        superview: {},
      },
      willMoveToParentViewController: jest.fn(),
    };
    const stackView = {
      addSubview: jest.fn(),
      nextResponder: rootParentController,
      reactSuperview: jest.fn(() => null),
      window: {},
    };
    rootParentController.view = stackView;

    expect(
      __nativeScriptReactAddControllerToClosestParentForTests(
        stackView,
        controller,
      ),
    ).toBe(false);
    expect(rootParentController.addChildViewController).toHaveBeenCalledWith(
      controller,
    );
    expect(
      (controller as { __nativeScriptAlreadyParentedByUIKit?: boolean })
        .__nativeScriptAlreadyParentedByUIKit,
    ).toBe(true);
    expect(controller.didMoveToParentViewController).not.toHaveBeenCalled();
  });

  it('retries stack attachment after removing a stale UIKit parent', () => {
    const parentController = {
      __nativeScriptScreenId: 'parent-screen',
      addChildViewController: jest
        .fn()
        .mockImplementationOnce(() => {
          throw new Error(
            'child view controller:<UINavigationController> should have parent view controller:<RNSScreenNativeScriptController> but actual parent is:<UIViewController>',
          );
        })
        .mockImplementationOnce(() => undefined),
      view: null as unknown,
    };
    const navigationController = {
      didMoveToParentViewController: jest.fn(),
      parentViewController: null,
      removeFromParentViewController: jest.fn(),
      valueForKey: jest.fn(() => null),
      view: {
        removeFromSuperview: jest.fn(),
        superview: {},
      },
      willMoveToParentViewController: jest.fn(),
    };
    const stackView = {
      addSubview: jest.fn(),
      nextResponder: parentController,
      reactSuperview: jest.fn(() => null),
      window: {},
    };
    parentController.view = stackView;

    expect(
      __nativeScriptReactAddControllerToClosestParentForTests(
        stackView,
        navigationController,
      ),
    ).toBe(true);

    expect(parentController.addChildViewController).toHaveBeenCalledTimes(2);
    expect(
      navigationController.willMoveToParentViewController,
    ).toHaveBeenCalledWith(null);
    expect(
      navigationController.removeFromParentViewController,
    ).toHaveBeenCalled();
    expect(stackView.addSubview).toHaveBeenCalledWith(
      navigationController.view,
    );
    expect(
      navigationController.didMoveToParentViewController,
    ).toHaveBeenCalledWith(parentController);
  });

  it('rechecks stack containment even after an early stale parent attachment', () => {
    const staleParent = {};
    const parentController = {
      __nativeScriptScreenId: 'parent-screen',
      addChildViewController: jest.fn(),
      view: null as unknown,
    };
    const navigationController = {
      didMoveToParentViewController: jest.fn(),
      parentViewController: staleParent as Record<string, unknown> | null,
      removeFromParentViewController: jest.fn(function removeFromParent() {
        navigationController.parentViewController = null;
      }),
      view: {
        removeFromSuperview: jest.fn(),
        superview: {},
      },
      willMoveToParentViewController: jest.fn(),
    };
    const stackView = {
      addSubview: jest.fn(),
      nextResponder: parentController,
      reactSuperview: jest.fn(() => null),
      window: {},
    };
    parentController.view = stackView;

    expect(
      __nativeScriptMaybeAddStackControllerToParentAndUpdateContainerForTests(
        stackView,
        navigationController,
      ),
    ).toBe(true);
    expect(
      navigationController.willMoveToParentViewController,
    ).toHaveBeenCalledWith(null);
    expect(
      navigationController.removeFromParentViewController,
    ).toHaveBeenCalled();
    expect(parentController.addChildViewController).toHaveBeenCalledWith(
      navigationController,
    );
    expect(stackView.addSubview).toHaveBeenCalledWith(
      navigationController.view,
    );
    expect(
      navigationController.didMoveToParentViewController,
    ).toHaveBeenCalledWith(parentController);
  });

  it('moves nested stacks from plain root wrappers to the visible RNSScreen parent', () => {
    const rootController = {};
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIApplication: {
        sharedApplication: {
          keyWindow: {
            rootViewController: rootController,
          },
        },
      },
    };
    const plainWrapperParent = {
      parentViewController: rootController,
      view: { window: {} },
    };
    const parentController = {
      __nativeScriptScreenId: 'parent-screen',
      addChildViewController: jest.fn(),
      view: null as unknown,
    };
    const navigationController: any = {
      didMoveToParentViewController: jest.fn(),
      parentViewController: plainWrapperParent,
      removeFromParentViewController: jest.fn(function removeFromParent() {
        navigationController.parentViewController = null;
      }),
      view: {
        removeFromSuperview: jest.fn(),
        superview: null as unknown,
      },
      willMoveToParentViewController: jest.fn(),
    };
    const stackView = {
      __nativeScriptOwningViewController: parentController,
      addSubview: jest.fn(),
      reactSuperview: jest.fn(() => null),
      window: {},
    };
    parentController.view = stackView;
    navigationController.view.superview = stackView;

    try {
      expect(
        __nativeScriptReactAddControllerToClosestParentForTests(
          stackView,
          navigationController,
        ),
      ).toBe(true);
    } finally {
      delete (global as Record<string, unknown>).__nativeScriptNativeApi;
    }

    expect(
      navigationController.willMoveToParentViewController,
    ).toHaveBeenCalledWith(null);
    expect(
      navigationController.removeFromParentViewController,
    ).toHaveBeenCalled();
    expect(parentController.addChildViewController).toHaveBeenCalledWith(
      navigationController,
    );
    expect(
      navigationController.didMoveToParentViewController,
    ).toHaveBeenCalledWith(parentController);
  });

  it('does not attach a stack to a screen parent outside the stack view hierarchy', () => {
    const screenParentController = {
      __nativeScriptScreenId: 'parent-screen',
      addChildViewController: jest.fn(),
      view: { window: {} },
    };
    const navigationController: any = {
      didMoveToParentViewController: jest.fn(),
      parentViewController: null,
      performSelector: jest.fn(() => null),
      removeFromParentViewController: jest.fn(),
      valueForKey: jest.fn(() => null),
      view: {
        removeFromSuperview: jest.fn(),
        superview: {},
      },
      willMoveToParentViewController: jest.fn(),
    };
    const stackView = {
      addSubview: jest.fn(),
      nextResponder: screenParentController,
      reactSuperview: jest.fn(() => null),
      window: {},
    };

    expect(
      __nativeScriptReactAddControllerToClosestParentForTests(
        stackView,
        navigationController,
      ),
    ).toBe(false);

    expect(
      screenParentController.addChildViewController,
    ).not.toHaveBeenCalled();
    expect(
      navigationController.willMoveToParentViewController,
    ).not.toHaveBeenCalled();
    expect(
      navigationController.removeFromParentViewController,
    ).not.toHaveBeenCalled();
    expect(stackView.addSubview).not.toHaveBeenCalled();
    expect(
      navigationController.didMoveToParentViewController,
    ).not.toHaveBeenCalled();
  });

  it('repairs nested stack containment below a modal screen before dismissal', () => {
    const navigationController = {
      didMoveToParentViewController: jest.fn(),
      parentViewController: null,
      view: {
        removeFromSuperview: jest.fn(),
        superview: null as unknown,
      },
    };
    const stackView = {
      __nativeScriptNavigationController: navigationController,
      addSubview: jest.fn(),
      reactSuperview: jest.fn(() => null),
      subviews: [],
      superview: null as unknown,
      window: {},
    };
    const modalView = {
      __nativeScriptOwningViewController: null as unknown,
      subviews: [stackView],
      window: {},
    };
    const modalController = {
      __nativeScriptScreenId: 'modal-screen',
      addChildViewController: jest.fn(),
      didMoveToParentViewController: jest.fn(),
      view: modalView,
    };
    modalView.__nativeScriptOwningViewController = modalController;
    stackView.superview = modalView;
    navigationController.view.superview = stackView;

    expect(
      __nativeScriptRepairDescendantStackContainmentForTests(modalController),
    ).toBe(true);

    expect(modalController.addChildViewController).toHaveBeenCalledWith(
      navigationController,
    );
    expect(
      navigationController.didMoveToParentViewController,
    ).toHaveBeenCalledWith(modalController);
  });

  it('ports formSheet detent configuration and content-wrapper sizing through UIKit', () => {
    expect(screenStackItemSource).toContain(
      'sheetAllowedDetents={sheetAllowedDetents}',
    );
    expect(screenContentWrapperSource).toContain(
      'notifyNativeScriptScreenContentWrapperFrame',
    );
    expect(screenContentWrapperSource).toContain('rootView.frame');
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
      "thread: 'caller' | 'js' | 'runtime' = 'caller'",
    );
    expect(stackSource).toContain(
      'NativeScriptRuntime.eventBridge(callback, thread)',
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
      "defineObjCClassMetadata(\n      RNSScreenNativeScriptController,\n      'ObjCProtocols',\n      screenControllerProtocols",
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
    const wrapperSources = `${screenContentWrapperSource}\n${screenStackHeaderConfigSource}\n${searchBarSource}\n${safeAreaViewIOSSource}\n${fullWindowOverlaySource}`;
    const expectedDeviationReasons = [
      'upstream RNSScreenStackHeaderConfig owns\n    // RNSScreenStackHeaderSubview native component views',
      'upstream RNSSearchBar implements\n      // `+shouldBeRecycled` as `NO`',
      'upstream RNSSafeAreaViewComponentView writes\n  // provider insets',
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
    expect(stackSource).toContain(
      "callNativeScriptControllerSuper(this, 'viewDidLayoutSubviews')",
    );
    expect(stackSource).toContain(
      "name: 'RNSNavigationNativeScriptController'",
    );
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
    expect(stackSource).toContain(
      'function refreshNavigationControllerHostedViews',
    );
    expect(stackSource).not.toContain(
      'layoutHostedReactSubviewsForControllerHierarchy(topController)',
    );
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
    expect(screenControllerSource).not.toContain(
      'layoutHostedReactSubviewsForControllerHierarchy(this)',
    );
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
    expect(finishTransitionSource).toContain(
      'cleanupDetachedScreens(stackId, registry);',
    );
    expect(finishTransitionSource).not.toContain(
      'markNavigationStackNeedsLayout(registry.stacks[stackId]);',
    );
    expect(finishTransitionSource).toContain(
      'scheduleContainingTabControllerReconcile(\n' +
        '    nativeScriptStackContainerViewForStackId(\n' +
        '      stackId,\n' +
        '      registry.stacks[stackId],\n' +
        '      registry,\n' +
        '    ),\n' +
        '  );',
    );
    expect(
      finishTransitionSource.indexOf('refreshVisibleStackScreenContentReady'),
    ).toBeGreaterThan(-1);
    expect(
      finishTransitionSource.indexOf('refreshVisibleStackScreenContentReady'),
    ).toBeLessThan(
      finishTransitionSource.indexOf(
        'scheduleContainingTabControllerReconcile',
      ),
    );
    expect(
      finishTransitionSource.indexOf(
        'scheduleContainingTabControllerReconcile',
      ),
    ).toBeGreaterThan(
      finishTransitionSource.indexOf(
        'flushPendingHeaderSubviewUpdatesForStack',
      ),
    );
    expect(finishTransitionSource).not.toContain(
      'refreshRegisteredScreenContentWrapperHosts(registry);',
    );
    expect(finishTransitionSource).not.toContain(
      'refreshRegisteredScreenContentWrapperHosts',
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
    expect(stackSource).toContain('api?.getClass?.(name)');
    expect(stackSource).toContain(
      "'transitionCoordinator',\n    'transitionCoordinator'",
    );
    expect(stackSource).toContain('? controller.transitionCoordinator()');
    expect(stackSource).toContain('return receiver[name]() === true');
    expect(stackSource).not.toContain('.call(controller)');
    expect(stackSource).not.toContain('.call(receiver)');
    expect(stackSource).not.toContain('.call(transitionContext)');
    expect(stackSource).not.toContain('.call(Detent)');
  });

  it('resolves transitionCoordinator selectors before testing transition state', () => {
    const navigationTransitioningSource = stackSource.slice(
      stackSource.indexOf('function navigationControllerIsTransitioning'),
      stackSource.indexOf('function screenControllerIsTransitioning'),
    );
    const screenTransitioningSource = stackSource.slice(
      stackSource.indexOf('function screenControllerIsTransitioning'),
      stackSource.indexOf('function sizeWithDimensions'),
    );
    const transitionFallbackSource = stackSource.slice(
      stackSource.indexOf('function scheduleTransitionFallback'),
      stackSource.indexOf('function shouldApplyStackPropsRevision'),
    );

    expect(navigationTransitioningSource).toContain(
      'transitionCoordinatorForController(navigationController) != null',
    );
    expect(screenTransitioningSource).toContain(
      'transitionCoordinatorForController(controller) != null',
    );
    expect(transitionFallbackSource).toContain(
      'runAfterTransitionCoordinator(navigationController, complete, ctx)',
    );
    expect(transitionFallbackSource).toContain(
      'runAfterTransitionCoordinator(transitionController, complete, ctx)',
    );
    expect(navigationTransitioningSource).not.toContain(
      'navigationController.transitionCoordinator != null',
    );
    expect(screenTransitioningSource).not.toContain(
      'controller?.transitionCoordinator != null',
    );
    expect(transitionFallbackSource).not.toContain(
      'navigationController?.transitionCoordinator',
    );
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
      'invalidateStaleTransitionProgressDisplayLink',
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
    expect(stackSource).toContain('hideHeader();');
    expect(stackSource).not.toContain('setTimeout(hideHeader');
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
    expect(stackSource).toContain(
      "setNativeValueForKey(\n    navigationBar,\n    'overrideUserInterfaceStyle'",
    );
    expect(stackSource).not.toContain('topNavigationItem.standardAppearance');
    expect(stackSource).not.toContain('topNavigationItem.scrollEdgeAppearance');
    expect(stackSource).not.toContain('topNavigationItem.title =');
    expect(stackSource).not.toContain(
      'topNavigationItem.leftItemsSupplementBackButton',
    );
    expect(stackSource).toContain(
      'navigationItem.leftItemsSupplementBackButton',
    );
    expect(stackSource).not.toContain(
      'navigationController.navigationBar?.setNeedsLayout?.();',
    );
    expect(stackSource).not.toContain('navigationBar.topItem');
    expect(stackSource).toContain('setNavigationItemLargeTitleDisplayMode(');
  });

  it('uses upstream title font defaults for normal and large navigation titles', () => {
    const setObjectForKey = jest.fn(function setObjectForKey(
      this: Record<string, unknown>,
      value: unknown,
      key: string,
    ) {
      this[key] = value;
    });

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      NSMutableDictionary: {
        dictionary: () => ({ setObjectForKey }),
      },
      NSFontAttributeName: 'font',
      UIFont: {
        systemFontOfSizeWeight: (size: number, weight: number) => ({
          size,
          weight,
        }),
      },
      UIFontWeight: {
        Bold: 0.4,
        Heavy: 0.56,
      },
    };

    const normalTitleAttributes = __nativeScriptTextAttributesForTests({
      boldDefault: true,
      defaultSize: 17,
      weight: '700',
    }) as Record<string, { size: number; weight: number }>;
    const largeTitleAttributes = __nativeScriptTextAttributesForTests({
      boldDefault: true,
      defaultSize: 34,
      weight: '800',
    }) as Record<string, { size: number; weight: number }>;

    expect(normalTitleAttributes.font).toEqual({ size: 17, weight: 0.4 });
    expect(largeTitleAttributes.font).toEqual({ size: 34, weight: 0.56 });

    delete (global as Record<string, unknown>).__nativeScriptNativeApi;
  });

  it('forces large-title UIKit setters through generic KVC fallback', () => {
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UINavigationItemLargeTitleDisplayMode: {
        Always: 1,
        Never: 2,
      },
    };

    const setValueForKey = jest.fn(function setValueForKey(
      this: Record<string, unknown>,
      value: unknown,
      key: string,
    ) {
      this[key] = value;
    });
    const navigationItem: any = {
      largeTitle: 'React Navigation',
      setValueForKey,
    };
    const navigationBar: any = {
      setValueForKey: jest.fn(function setNavigationBarValueForKey(
        this: Record<string, unknown>,
        value: unknown,
        key: string,
      ) {
        this[key] = value;
      }),
    };

    __nativeScriptSetNavigationItemLargeTitleDisplayModeForTests(
      navigationItem,
      false,
    );
    __nativeScriptSetNavigationBarPrefersLargeTitlesForTests(
      navigationBar,
      false,
    );
    __nativeScriptSetNavigationItemLargeTitleTextForTests(
      navigationItem,
      'React Navigation',
      false,
    );

    expect(navigationItem.largeTitleDisplayMode).toBe(2);
    expect(navigationItem.setValueForKey).toHaveBeenCalledWith(
      2,
      'largeTitleDisplayMode',
    );
    expect(navigationItem.largeTitle).toBeNull();
    expect(navigationItem.setValueForKey).toHaveBeenCalledWith(
      null,
      'largeTitle',
    );
    expect(navigationBar.prefersLargeTitles).toBe(false);
    expect(navigationBar.setValueForKey).toHaveBeenCalledWith(
      false,
      'prefersLargeTitles',
    );

    __nativeScriptSetNavigationItemLargeTitleTextForTests(
      navigationItem,
      'React Navigation',
      true,
    );
    expect(navigationItem.largeTitle).toBe('React Navigation');

    delete (global as Record<string, unknown>).__nativeScriptNativeApi;
  });

  it('matches upstream extended-layout ownership for translucent and opaque headers', () => {
    const configureScreenSource = stackSource.slice(
      stackSource.indexOf('function configureScreenController'),
      stackSource.indexOf('function nativeScreenDismissCount'),
    );

    expect(stackSource).toContain('function rectEdgeAllExceptTop');
    expect(stackSource).toContain(
      'headerIsVisible && headerConfig?.translucent !== true',
    );
    expect(stackSource).toContain('rectEdgeAllExceptTop()');
    expect(stackSource).toContain(
      'configureExtendedLayout(controller, headerConfig)',
    );
    expect(
      configureScreenSource.indexOf('const headerConfig = props.headerConfig'),
    ).toBeLessThan(
      configureScreenSource.indexOf(
        'configureExtendedLayout(controller, headerConfig)',
      ),
    );
    expect(stackSource).not.toContain('extendedLayoutIncludesOpaqueBars');
  });

  it('keeps navigation safe-area cleanup after NativeScript host refreshes', () => {
    const layoutSource = stackSource.slice(
      stackSource.indexOf('function layoutNavigationStackViews'),
      stackSource.indexOf('function layoutPresentedModalControllers'),
    );
    const navigationControllerSource = stackSource.slice(
      stackSource.indexOf('class RNSNavigationNativeScriptController'),
      stackSource.indexOf('function installNativeBackGestureDelegate'),
    );
    const screenViewStart = stackSource.indexOf(
      'class RNSScreenNativeScriptView',
    );
    const screenViewSource = stackSource.slice(
      screenViewStart,
      stackSource.indexOf(
        'const interopTypes = globalObject.interop?.types;',
        screenViewStart,
      ),
    );
    expect(stackSource).toContain('function viewLayoutDidChange');
    expect(stackSource).toContain('function viewGeometryLayoutKey');
    expect(stackSource).toContain('const key = viewGeometryLayoutKey(view);');
    expect(stackSource).toContain(
      "view.window != null ? 'window' : 'detached'",
    );
    expect(stackSource).toContain('function navigationStackStableLayoutKey');
    expect(stackSource).toContain('viewGeometryLayoutKey(navigationView)');
    expect(stackSource).toContain('viewGeometryLayoutKey(stackHostView)');
    expect(stackSource).toContain(
      'viewGeometryLayoutKey(stackHostView?.superview)',
    );
    expect(stackSource).toContain(
      'viewGeometryLayoutKey(navigationController?.navigationBar)',
    );
    expect(stackSource).toContain(
      'viewGeometryLayoutKey(screenControllerView(controller))',
    );
    expect(stackSource).toContain(
      'function navigationStackCanSkipStableLayout',
    );
    expect(stackSource).toContain(
      'function rememberNavigationStackStableLayoutKey',
    );
    expect(stackSource).toContain(
      'function currentNavigationStackStableLayoutKey',
    );
    expect(stackSource).toContain('STACK_STABLE_LAYOUT_KEY_ASSOCIATION_KEY');
    expect(stackSource).toContain(
      'currentNavigationStackStableLayoutKey(navigationController) === layoutKey',
    );
    expect(stackSource).toContain(
      'registry.stackPendingReconcileKeys[stackId] != null',
    );
    expect(stackSource).toContain(
      'registry.stackUpdatingModals[stackId] === true',
    );
    expect(stackSource).toContain('registry.stackPresentedModalKeys[stackId]');
    expect(stackSource).toContain('registry.stackTransitionTokens[stackId]');
    expect(stackSource).toContain(
      'navigationController?.tabBarController?.selectedViewController',
    );
    const stableLayoutKeySource = stackSource.slice(
      stackSource.indexOf('function navigationStackStableLayoutKey'),
      stackSource.indexOf('function navigationStackHasStableReadyContent'),
    );
    const stableContentSource = stackSource.slice(
      stackSource.indexOf('function navigationStackHasStableReadyContent'),
      stackSource.indexOf('function navigationStackCanSkipStableLayout'),
    );
    expect(stableLayoutKeySource).not.toContain(
      'screenPendingHeaderSubviewKeys',
    );
    expect(stableContentSource).not.toContain('screenPendingHeaderSubviewKeys');
    expect(stableContentSource).not.toContain(
      'screenPendingHeaderConfigUpdates',
    );
    expect(stableContentSource).toContain(
      'liveScreenContentWrapperViewFromRegistry(screenId, registry)',
    );
    expect(stackSource).toMatch(
      /!contentWrapperIsMountedInScreenView\(\s*contentWrapperView,\s*controllerView,\s*\)/,
    );
    expect(stackSource).toMatch(
      /hiddenAncestorBetweenViewAndAncestor\(\s*contentWrapperView,\s*controllerView,\s*\)/,
    );
    expect(stableContentSource).toMatch(
      /controllerView\.window != null\s*&&\s*contentWrapperView\.window == null/,
    );
    expect(layoutSource).toContain(
      'navigationControllerLayoutDidChange(navigationController)',
    );
    expect(layoutSource).toContain(
      'const stableLayoutKey = navigationStackStableLayoutKey(',
    );
    expect(layoutSource).toContain('navigationStackCanSkipStableLayout(');
    expect(layoutSource).toContain(
      'restoreVisibleNavigationControllerInteractivity(\n' +
        '      navigationController,\n' +
        '      registry,\n' +
        '    );',
    );
    expect(layoutSource).toContain(
      "traceSlowWorklet('layoutNavigationStackViews.skipStable', startedAt)",
    );
    expect(layoutSource).toContain(
      'const didSetControllerFrame = setViewFrameIfNeeded(',
    );
    expect(layoutSource).toContain(
      'screenControllerLayoutDidChange(\n      controller,\n      registry,\n    )',
    );
    expect(
      layoutSource.indexOf('refreshNavigationControllerHostedViews('),
    ).toBeGreaterThan(layoutSource.indexOf("'layout-navigation-stack'"));
    expect(
      layoutSource.indexOf(
        'syncNavigationStackSafeAreaInsets(navigationController)',
      ),
    ).toBeGreaterThan(
      layoutSource.indexOf('refreshNavigationControllerHostedViews('),
    );
    expect(layoutSource).toContain(
      'refreshNavigationControllerSafeAreaLayout(navigationController);',
    );
    expect(
      layoutSource.indexOf(
        'refreshNavigationControllerSafeAreaLayout(navigationController);',
      ),
    ).toBeLessThan(
      layoutSource.indexOf('refreshNavigationControllerHostedViews('),
    );
    expect(layoutSource).toContain(
      'rememberNavigationStackStableLayoutKey(navigationController, registry);',
    );
    expect(
      stackSource.indexOf('function refreshNavigationControllerSafeAreaLayout'),
    ).toBeLessThan(stackSource.indexOf('function layoutNavigationStackViews'));
    expect(navigationControllerSource).toContain(
      'emitTopScreenHeaderHeightAfterNavigationLayout(this)',
    );
    expect(screenViewSource).toContain(
      'postSafeAreaDidChangeNotification(this)',
    );
    expect(screenViewSource).not.toContain('layoutNavigationStackViews(');
  });

  it('reapplies navigation-bar appearance through transition coordinator completion', () => {
    const applySource = stackSource.slice(
      stackSource.indexOf('function applyNavigationAppearance'),
      stackSource.indexOf('function applyAnimatedNavigationBarConfig'),
    );
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
    expect(configureSource).toContain('animateAlongsideTransitionCompletion(');
    expect(stackSource).toContain("'animateAlongsideTransition:completion:'");
    expect(applySource).toContain(
      'navigationController.setNavigationBarHiddenAnimated(hidden, animated)',
    );
    expect(applySource).not.toContain(
      'navigationController.setNavigationBarHiddenAnimated(hidden, false)',
    );
    expect(applySource).toContain('if (!canSetNavigationBarHidden)');
    expect(configureSource).toContain(
      'applyNavigationAppearance(\n' +
        '    navigationController,\n' +
        '    headerConfig,\n' +
        '    ctx,\n' +
        '    registry,\n' +
        '    animated,\n' +
        '  )',
    );
    expect(configureSource).toContain(
      'navigationController.__nativeScriptHeaderAppearanceToken',
    );
    expect(configureSource).toContain('NATIVESCRIPT_PORT_DEVIATION');
  });

  it('passes UIKit willShow animation state into header configuration', () => {
    const willShowHelperSource = stackSource.slice(
      stackSource.indexOf('function configureHeaderForWillShowViewController'),
      stackSource.indexOf('function shouldIgnoreNoOpNativeDidShow'),
    );
    const delegateSource = stackSource.slice(
      stackSource.indexOf('navigationControllerWillShowViewControllerAnimated'),
      stackSource.indexOf('navigationControllerDidShowViewControllerAnimated'),
    );

    expect(willShowHelperSource).toContain('animated = false');
    expect(willShowHelperSource).toContain(
      'registry,\n' + '    animated,\n' + '  );',
    );
    expect(delegateSource).toContain('animated?: boolean');
    expect(delegateSource).toContain('animated === true');
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
    expect(stackSource).toContain('ctx.actionTarget');
    expect(stackSource).toContain(
      'function nativeScriptHeaderBarButtonItemClass',
    );
    expect(stackSource).toContain('class RNSBarButtonItem');
    expect(stackSource).toContain('handleBarButtonItemPress');
    expect(stackSource).toContain(
      'NativeScriptRuntime.createNativeActionTarget(',
    );
    expect(stackSource).toContain('bridgedPress as (...args: any[]) => any');
    expect(stackSource).toContain(
      'NativeScriptRuntime.canCreateNativeActionTarget()',
    );
    expect(stackSource).toContain(
      'function setHeaderNavigationItemLeftBarButtonItems',
    );
    expect(stackSource).toContain(
      'function setHeaderNavigationItemRightBarButtonItems',
    );
    const leftSetterSource = stackSource.slice(
      stackSource.indexOf('function setHeaderNavigationItemLeftBarButtonItems'),
      stackSource.indexOf(
        'function setHeaderNavigationItemRightBarButtonItems',
      ),
    );
    const rightSetterSource = stackSource.slice(
      stackSource.indexOf(
        'function setHeaderNavigationItemRightBarButtonItems',
      ),
      stackSource.indexOf('function configureHeaderSubviewViews'),
    );
    expect(leftSetterSource).toContain(
      'navigationItem.leftBarButtonItems = items;',
    );
    expect(rightSetterSource).toContain(
      'navigationItem.rightBarButtonItems = items;',
    );
    expect(leftSetterSource).not.toContain('setLeftBarButtonItemsAnimated');
    expect(rightSetterSource).not.toContain('setRightBarButtonItemsAnimated');
    expect(leftSetterSource).not.toContain('setLeftBarButtonItems:animated:');
    expect(rightSetterSource).not.toContain('setRightBarButtonItems:animated:');
    expect(stackSource).toContain('dispose?: () => void');
    expect(stackSource).toContain('HEADER_BAR_BUTTON_ACTION_TARGET_KEY');
    expect(stackSource).toContain('barItem.target = actionTarget.target');
    expect(stackSource).not.toContain('barItem.target = barItem');
    expect(stackSource).not.toContain('fallbackActionTarget');
    expect(stackSource).toContain('HEADER_BAR_BUTTON_ITEM_CONFIG_KEY');
    expect(stackSource).toContain(
      'HEADER_BAR_BUTTON_ITEM_CONFIG_SIGNATURE_KEY',
    );
    expect(stackSource).toContain('headerBarButtonItemConfigSignature');
    expect(stackSource).toContain('takeReusableHeaderBarButtonItem');
    expect(stackSource).toContain('const integer = value >>> 0;');
    expect(stackSource).toContain(
      'const alpha = ((integer >>> 24) & 255) / 255;',
    );
    expect(stackSource).toContain('headerBarButtonActionSignature');
    expect(stackSource).not.toContain('headerBarButtonCanKeepActionTarget');
    expect(stackSource).not.toContain('updateReusableHeaderBarButtonItem');
    expect(stackSource).toContain('barItem.enabled = item.disabled !== true;');
    expect(stackSource).not.toContain(
      'if (item.disabled != null) {\n    barItem.enabled = item.disabled !== true;\n  }',
    );
    expect(stackSource).toContain('header-button-invoke-js');
    expect(stackSource).toContain('header-menu-invoke-js');
    expect(stackSource).toContain('invokeHeaderActionOnJS(buttonPressHandler');
    expect(stackSource).toContain('invokeHeaderActionOnJS(menuPressHandler');
    expect(stackSource).not.toContain(
      "ctx.emit('onNativeScriptHeaderButtonPress'",
    );
    expect(stackSource).not.toContain(
      "ctx.emit('onNativeScriptHeaderMenuItemPress'",
    );
    expect(stackSource).toContain(
      'function applyHeaderBarButtonItemsAccessibilityToViews',
    );
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
    expect(stackSource).toContain('invokeHeaderActionOnJS(item.onPress);');
    expect(stackSource).toContain('function createHeaderMenu');
    expect(stackSource).toContain('function createHeaderMenuAction');
    expect(stackSource).toContain(
      'UIAction.actionWithTitleImageIdentifierHandler',
    );
    expect(stackSource).toContain('initWithTitleImageIdentifierHandler');
    expect(stackSource).toContain(
      'UIMenu.menuWithTitleImageIdentifierOptionsChildren',
    );
    expect(stackSource).toContain('if (typeof pressCallback ===');
    expect(stackSource).toContain('pressCallback();');
    expect(
      stackSource.slice(
        stackSource.indexOf('function createHeaderMenuAction'),
        stackSource.indexOf('function createHeaderMenu('),
      ),
    ).toContain("'runtime'");
    expect(stackSource).toContain('applyHeaderBarButtonBadge');
    expect(stackSource).toContain('setTitleTextAttributesForState');
    const titleAttributesHelper = stackSource.slice(
      stackSource.indexOf('function setTitleTextAttributesForAllStates'),
      stackSource.indexOf('function applyHeaderBarButtonTitleStyle'),
    );
    expect(titleAttributesHelper).not.toContain("controlState('Selected', 4)");
  });

  it('routes UIKit header menu actions through the generic native UIAction primitive', () => {
    const emitted: [string, unknown][] = [];
    const onMenuPress = jest.fn();
    let actionTargetCallback: ((sender: unknown) => void) | undefined;
    let actionHandler: ((sender: unknown) => void) | undefined;
    let nativeUIActionCallback: ((sender: unknown) => void) | undefined;
    const nativeUIActionDispose = jest.fn();
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const previousEventBridge = NativeScriptRuntime.eventBridge;
    const previousInvokeNativeActionTarget =
      NativeScriptRuntime.invokeNativeActionTarget;
    const previousCreateNativeUIAction =
      NativeScriptRuntime.createNativeUIAction;
    const previousCanCreateNativeUIAction =
      NativeScriptRuntime.canCreateNativeUIAction;
    const previousInterop = (global as Record<string, unknown>).interop;
    const barItem: any = {
      setTitleTextAttributesForState: jest.fn(),
      title: '',
    };
    const UIBarButtonItem: any = function UIBarButtonItem() {};
    UIBarButtonItem.alloc = () => ({
      init: () => barItem,
    });

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      NSArray: {
        arrayWithArray: (values: unknown[]) => values,
      },
      UIAction: {
        alloc: () => ({
          initWithTitleImageIdentifierHandler: (
            title: string,
            image: unknown,
            identifier: unknown,
            handler: (sender: unknown) => void,
          ) => {
            actionHandler = handler;
            return { title, image, identifier, handler };
          },
        }),
        actionWithTitleImageIdentifierHandler: (
          _title: string,
          _image: unknown,
          _identifier: unknown,
          _handler: (sender: unknown) => void,
        ) => {
          throw new Error('initializer path should be preferred');
        },
      },
      UIBarButtonItem,
      UIBarButtonItemStyle: {
        Plain: 'plain',
      },
      UIMenu: {
        menuWithTitleImageIdentifierOptionsChildren: (
          title: string,
          image: unknown,
          identifier: unknown,
          options: unknown,
          children: unknown[],
        ) => ({ title, image, identifier, options, children }),
      },
    };
    (global as Record<string, unknown>).interop = {
      Block: jest.fn(
        (_signature: string, callback: (sender: unknown) => void) => callback,
      ),
    };
    NativeScriptRuntime.eventBridge = jest.fn(
      (callback: (sender: unknown) => void) => callback,
    );
    NativeScriptRuntime.invokeNativeActionTarget = jest.fn(
      (_actionTarget: unknown, sender: unknown) => {
        actionTargetCallback?.(sender);
        return true;
      },
    );
    NativeScriptRuntime.canCreateNativeUIAction = jest.fn(() => true);
    NativeScriptRuntime.createNativeUIAction = jest.fn(
      (callback: (sender: unknown) => void, options: Record<string, unknown>) => {
        nativeUIActionCallback = callback;
        return {
          action: { ...options },
          actionTarget: { target: {} },
          dispose: nativeUIActionDispose,
        };
      },
    );

    const ctx = {
      actionTarget: jest.fn((callback: (sender: unknown) => void) => {
        actionTargetCallback = callback;
        return {
          action: 'nativeScriptHandleAction:',
          target: {},
        };
      }),
      emit: (eventName: string, payload: unknown) => {
        emitted.push([eventName, payload]);
      },
      retain: jest.fn(),
    };

    try {
      const items = __nativeScriptCreateHeaderBarButtonItemsForTests(
        [
          {
            index: 0,
            menu: {
              items: [
                {
                  menuId: '0-0-right',
                  title: 'Increment',
                  type: 'action',
                },
              ],
              title: 'Header menu',
            },
            title: 'Menu',
            type: 'menu',
          },
        ] as any,
        [],
        ctx,
        { onPressHeaderBarButtonMenuItem: onMenuPress } as any,
      ) as any[];

      expect(items).toHaveLength(1);
      expect(items[0].menu.children).toHaveLength(1);
      expect(NativeScriptRuntime.createNativeUIAction).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          image: null,
          title: 'Increment',
        }),
      );
      expect(NativeScriptRuntime.eventBridge).not.toHaveBeenCalled();
      expect(ctx.actionTarget).not.toHaveBeenCalled();
      expect(
        NativeScriptRuntime.invokeNativeActionTarget,
      ).not.toHaveBeenCalled();
      expect(actionHandler).toBeUndefined();
      expect(items[0].menu.children[0].state).toBe(0);

      nativeUIActionCallback?.(items[0].menu.children[0]);

      expect(
        NativeScriptRuntime.invokeNativeActionTarget,
      ).not.toHaveBeenCalled();
      expect(emitted).toEqual([]);
      expect(onMenuPress).toHaveBeenCalledWith({
        nativeEvent: {
          menuId: '0-0-right',
        },
      });
    } finally {
      NativeScriptRuntime.eventBridge = previousEventBridge;
      NativeScriptRuntime.invokeNativeActionTarget =
        previousInvokeNativeActionTarget;
      NativeScriptRuntime.createNativeUIAction = previousCreateNativeUIAction;
      NativeScriptRuntime.canCreateNativeUIAction =
        previousCanCreateNativeUIAction;
      (global as Record<string, unknown>).interop = previousInterop;
      (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
    }
  });

  it('routes Fabric-style header button id events through a retained action target', () => {
    const emitted: [string, unknown][] = [];
    const onButtonPress = jest.fn();
    let bridgedPress: ((sender: unknown) => void) | undefined;
    const retainedTarget = {
      nativeScriptHandleAction: (sender: unknown) => {
        bridgedPress?.(sender);
      },
    };
    const barItem: any = {
      setTitleTextAttributesForState: jest.fn(),
      title: '',
    };
    const UIBarButtonItem: any = function UIBarButtonItem() {};
    UIBarButtonItem.alloc = () => ({
      init: () => barItem,
    });
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIBarButtonItem,
      UIBarButtonItemStyle: {
        Plain: 'plain',
      },
    };
    (
      global as Record<string, unknown>
    ).__rnsNativeScriptHeaderBarButtonItemClass = undefined;

    const ctx = {
      actionTarget: jest.fn((callback: (sender: unknown) => void) => {
        bridgedPress = callback;
        return {
          action: 'nativeScriptHandleAction:',
          target: retainedTarget,
        };
      }),
      emit: (eventName: string, payload: unknown) => {
        emitted.push([eventName, payload]);
      },
      retain: jest.fn(),
    };

    try {
      const items = __nativeScriptCreateHeaderBarButtonItemsForTests(
        [
          {
            buttonId: 'right-0',
            index: 0,
            title: 'Ping',
            type: 'button',
          },
        ] as any,
        [],
        ctx,
        { onPressHeaderBarButtonItem: onButtonPress } as any,
      ) as any[];

      expect(items).toHaveLength(1);
      expect(items[0]).toBe(barItem);
      expect(items[0].target).toBe(retainedTarget);
      expect(items[0].action).toBe('nativeScriptHandleAction:');
      expect(items[0].target).not.toBe(items[0]);
      expect(ctx.actionTarget).toHaveBeenCalledTimes(1);

      items[0].target.nativeScriptHandleAction(items[0]);

      expect(emitted).toEqual([]);
      expect(onButtonPress).toHaveBeenCalledWith({
        nativeEvent: {
          buttonId: 'right-0',
        },
      });
    } finally {
      (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
      (
        global as Record<string, unknown>
      ).__rnsNativeScriptHeaderBarButtonItemClass = undefined;
    }
  });

  it('dispatches header bar-button subclass selector through the associated native target', () => {
    const emitted: [string, unknown][] = [];
    const onButtonPress = jest.fn();
    let bridgedPress: ((sender: unknown) => void) | undefined;
    let barButtonImplementation:
      | {
          handleBarButtonItemPress: (this: unknown, sender: unknown) => void;
        }
      | undefined;
    const retainedTarget = {
      nativeScriptHandleAction: (sender: unknown) => {
        bridgedPress?.(sender);
      },
    };
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const previousInvokeNativeActionTarget =
      NativeScriptRuntime.invokeNativeActionTarget;
    const barItem: any = {
      setTitleTextAttributesForState: jest.fn(),
      title: '',
    };
    const UIBarButtonItem: any = function UIBarButtonItem() {};
    UIBarButtonItem.extend = jest.fn((implementation: any) => {
      barButtonImplementation = implementation;
      return {
        alloc: () => ({
          init: () => barItem,
        }),
      };
    });
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIBarButtonItem,
      UIBarButtonItemStyle: {
        Plain: 'plain',
      },
    };
    (
      global as Record<string, unknown>
    ).__rnsNativeScriptHeaderBarButtonItemClass = undefined;

    const ctx = {
      actionTarget: jest.fn((callback: (sender: unknown) => void) => {
        bridgedPress = callback;
        return {
          action: 'nativeScriptHandleAction:',
          target: retainedTarget,
        };
      }),
      emit: (eventName: string, payload: unknown) => {
        emitted.push([eventName, payload]);
      },
      retain: jest.fn(),
    };

    try {
      NativeScriptRuntime.invokeNativeActionTarget = jest.fn(
        (actionTarget: any, sender: unknown) => {
          actionTarget.target.nativeScriptHandleAction(sender);
          return true;
        },
      );

      const items = __nativeScriptCreateHeaderBarButtonItemsForTests(
        [
          {
            buttonId: 'right-0',
            index: 0,
            title: 'Ping',
            type: 'button',
          },
        ] as any,
        [],
        ctx,
        { onPressHeaderBarButtonItem: onButtonPress } as any,
      ) as any[];

      expect(items).toHaveLength(1);
      expect(items[0]).toBe(barItem);
      expect(UIBarButtonItem.extend).toHaveBeenCalledWith(
        expect.objectContaining({
          handleBarButtonItemPress: expect.any(Function),
        }),
        expect.objectContaining({
          name: 'RNSBarButtonItemNativeScript',
        }),
      );
      expect(typeof barButtonImplementation?.handleBarButtonItemPress).toBe(
        'function',
      );

      barButtonImplementation?.handleBarButtonItemPress.call(
        items[0],
        items[0],
      );

      expect(NativeScriptRuntime.invokeNativeActionTarget).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'nativeScriptHandleAction:',
          target: retainedTarget,
        }),
        items[0],
      );
      expect(emitted).toEqual([]);
      expect(onButtonPress).toHaveBeenCalledWith({
        nativeEvent: {
          buttonId: 'right-0',
        },
      });
    } finally {
      NativeScriptRuntime.invokeNativeActionTarget =
        previousInvokeNativeActionTarget;
      (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
      (
        global as Record<string, unknown>
      ).__rnsNativeScriptHeaderBarButtonItemClass = undefined;
    }
  });

  it('falls back to a retained target when a header bar-button subclass initializes as a plain item', () => {
    const createdItems: any[] = [];
    const fallbackTarget = { nativeScriptHandleAction: jest.fn() };
    const fallbackDispose = jest.fn();
    const onPress = jest.fn();
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const previousCreateNativeActionTarget =
      NativeScriptRuntime.createNativeActionTarget;
    const UIViewBarButtonItem: any = function UIBarButtonItem() {};
    UIViewBarButtonItem.alloc = () => ({
      init: () => {
        const item: any = {
          setTitleTextAttributesForState: jest.fn(),
          title: '',
        };
        createdItems.push(item);
        return item;
      },
    });
    (global as Record<string, unknown>).NativeClass = jest.fn();
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIBarButtonItem: UIViewBarButtonItem,
      UIBarButtonItemStyle: {
        Plain: 'plain',
      },
    };
    (
      global as Record<string, unknown>
    ).__rnsNativeScriptHeaderBarButtonItemClass = undefined;

    const ctx = {
      actionTarget: jest.fn(() => ({
        action: 'nativeScriptHandleAction:',
        target: fallbackTarget,
      })),
      retain: jest.fn(),
    };

    try {
      NativeScriptRuntime.createNativeActionTarget = jest.fn(() => ({
        action: 'nativeScriptHandleAction:',
        dispose: fallbackDispose,
        target: fallbackTarget,
      }));

      const items = __nativeScriptCreateHeaderBarButtonItemsForTests(
        [
          {
            onPress,
            title: 'Ping',
            type: 'button',
          },
        ] as any,
        [],
        ctx,
      ) as any[];

      expect(items).toHaveLength(1);
      expect(items[0]).toBe(createdItems[0]);
      expect(items[0].title).toBe('Ping');
      expect(items[0].target).toBe(fallbackTarget);
      expect(items[0].action).toBe('nativeScriptHandleAction:');
      expect(
        NativeScriptRuntime.createNativeActionTarget,
      ).toHaveBeenCalledTimes(0);
      expect(ctx.actionTarget).toHaveBeenCalledTimes(1);
      expect(items[0].action).not.toBe('handleBarButtonItemPress:');
    } finally {
      NativeScriptRuntime.createNativeActionTarget =
        previousCreateNativeActionTarget;
      (global as Record<string, unknown>).NativeClass = undefined;
      (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
      (
        global as Record<string, unknown>
      ).__rnsNativeScriptHeaderBarButtonItemClass = undefined;
    }
  });

  it('creates retained header bar-button action targets without a UIKit lifecycle context', () => {
    const onPress = jest.fn();
    const dispose = jest.fn();
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const previousCreateNativeActionTarget =
      NativeScriptRuntime.createNativeActionTarget;
    let bridgedCallback: ((sender: unknown) => void) | null = null;
    const actionTarget = {
      action: 'nativeScriptHandleAction:',
      dispose,
      target: {
        nativeScriptHandleAction: (sender: unknown) => {
          bridgedCallback?.(sender);
        },
      },
    };
    const barItem: any = {
      setTitleTextAttributesForState: jest.fn(),
      title: '',
    };
    const UIViewBarButtonItem: any = function UIBarButtonItem() {};
    UIViewBarButtonItem.alloc = () => ({
      init: () => barItem,
    });
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIBarButtonItem: UIViewBarButtonItem,
      UIBarButtonItemStyle: {
        Plain: 'plain',
      },
    };
    (
      global as Record<string, unknown>
    ).__rnsNativeScriptHeaderBarButtonItemClass = undefined;

    try {
      NativeScriptRuntime.createNativeActionTarget = jest.fn(
        (callback: (sender: unknown) => void) => {
          bridgedCallback = callback;
          return actionTarget;
        },
      );

      const items = __nativeScriptCreateHeaderBarButtonItemsForTests(
        [
          {
            index: 0,
            onPress,
            title: 'Ping',
            type: 'button',
          },
        ] as any,
        [],
      ) as any[];

      expect(items).toHaveLength(1);
      expect(items[0].target).toBe(actionTarget.target);
      expect(items[0].__rnsNativeScriptHeaderBarButtonActionTarget).toBe(
        actionTarget,
      );
      expect(items[0].action).toBe('nativeScriptHandleAction:');
      expect(typeof items[0].target.nativeScriptHandleAction).toBe('function');
      items[0].target.nativeScriptHandleAction(items[0]);
      expect(onPress).toHaveBeenCalledTimes(1);
      expect(
        NativeScriptRuntime.createNativeActionTarget,
      ).toHaveBeenCalledTimes(1);
    } finally {
      NativeScriptRuntime.createNativeActionTarget =
        previousCreateNativeActionTarget;
      (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
      (
        global as Record<string, unknown>
      ).__rnsNativeScriptHeaderBarButtonItemClass = undefined;
    }
  });

  it('keeps no-context header bar-button visuals when native target allocation is unavailable', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const previousCanCreateNativeActionTarget =
      NativeScriptRuntime.canCreateNativeActionTarget;
    const previousCreateNativeActionTarget =
      NativeScriptRuntime.createNativeActionTarget;
    const UIViewBarButtonItem: any = function UIBarButtonItem() {};
    UIViewBarButtonItem.alloc = () => ({
      init: () => ({
        setTitleTextAttributesForState: jest.fn(),
        title: '',
      }),
    });
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIBarButtonItem: UIViewBarButtonItem,
      UIBarButtonItemStyle: {
        Plain: 'plain',
      },
    };
    (
      global as Record<string, unknown>
    ).__rnsNativeScriptHeaderBarButtonItemClass = undefined;

    try {
      NativeScriptRuntime.canCreateNativeActionTarget = jest.fn(() => false);
      NativeScriptRuntime.createNativeActionTarget = jest.fn(() => {
        throw new Error('should not allocate without availability');
      });

      const items = __nativeScriptCreateHeaderBarButtonItemsForTests(
        [
          {
            index: 0,
            onPress: jest.fn(),
            title: 'Ping',
            type: 'button',
          },
        ] as any,
        [],
      );

      expect(items).toHaveLength(1);
      expect((items as any[])[0].title).toBe('Ping');
      expect((items as any[])[0].target).toBeNull();
      expect((items as any[])[0].action).toBeNull();
      expect(
        NativeScriptRuntime.createNativeActionTarget,
      ).not.toHaveBeenCalled();
    } finally {
      NativeScriptRuntime.canCreateNativeActionTarget =
        previousCanCreateNativeActionTarget;
      NativeScriptRuntime.createNativeActionTarget =
        previousCreateNativeActionTarget;
      (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
      (
        global as Record<string, unknown>
      ).__rnsNativeScriptHeaderBarButtonItemClass = undefined;
    }
  });

  it('replaces stale configured header bar-button items while preserving unchanged and custom current items', () => {
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIBarButtonItem: {
        alloc: () => ({
          init: () => ({
            title: '',
          }),
          initWithBarButtonSystemItemTargetAction: () => ({
            kind: 'spacing',
          }),
        }),
      },
      UIBarButtonItemStyle: {
        Plain: 'plain',
      },
    };
    const ctx = {
      actionTarget: () => ({ action: 'nativeScriptHandleAction:', target: {} }),
      retain: jest.fn(),
    };

    try {
      const initialItems = __nativeScriptCreateHeaderBarButtonItemsForTests(
        [
          {
            index: 0,
            onPress: jest.fn(),
            title: 'Ping',
            type: 'button',
          },
          {
            index: 1,
            title: 'Menu',
            type: 'menu',
          },
        ] as any,
        [],
        ctx,
      ) as any[];
      const customSubviewItem = { customView: 'header-subview' };
      const nextItems = __nativeScriptCreateHeaderBarButtonItemsForTests(
        [
          {
            index: 0,
            onPress: jest.fn(),
            title: 'Ping 1',
            type: 'button',
          },
          {
            index: 1,
            title: 'Menu',
            type: 'menu',
          },
        ] as any,
        [customSubviewItem, ...initialItems],
        ctx,
      ) as any[];

      expect(nextItems).toHaveLength(3);
      expect(nextItems).toContain(customSubviewItem);
      expect(nextItems).not.toContain(initialItems[0]);
      expect(nextItems).toContain(initialItems[1]);
      expect(nextItems.map(item => item.title ?? item.customView)).toEqual([
        'Ping 1',
        'Menu',
        'header-subview',
      ]);
    } finally {
      (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
    }
  });

  it('reuses unchanged configured header bar-button items across redundant configure passes', () => {
    const dispose = jest.fn();
    const createdItems: any[] = [];

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIBarButtonItem: {
        alloc: () => ({
          init: () => {
            const item = {
              setTitleTextAttributesForState: jest.fn(),
              title: '',
            };
            createdItems.push(item);
            return item;
          },
          initWithBarButtonSystemItemTargetAction: () => {
            const item = {
              kind: 'spacing',
            };
            createdItems.push(item);
            return item;
          },
        }),
      },
      UIBarButtonItemStyle: {
        Plain: 'plain',
      },
    };
    const ctx = {
      actionTarget: jest.fn(() => ({
        action: 'nativeScriptHandleAction:',
        dispose,
        target: {},
      })),
      retain: jest.fn(),
    };

    try {
      const configs = [
        {
          buttonId: 'right-0',
          index: 0,
          title: 'Ping',
          type: 'button',
        },
        {
          index: 1,
          spacing: 8,
          type: 'spacing',
        },
        {
          index: 2,
          title: 'Menu',
          type: 'menu',
        },
      ] as any;
      const initialItems = __nativeScriptCreateHeaderBarButtonItemsForTests(
        configs,
        [],
        ctx,
        { onPressHeaderBarButtonItem: jest.fn() } as any,
      ) as any[];
      const customSubviewItem = { customView: 'header-subview' };
      const nextItems = __nativeScriptCreateHeaderBarButtonItemsForTests(
        configs,
        [customSubviewItem, ...initialItems],
        ctx,
        { onPressHeaderBarButtonItem: jest.fn() } as any,
      ) as any[];

      expect(nextItems).toHaveLength(4);
      expect(nextItems).toContain(customSubviewItem);
      expect(nextItems).toContain(initialItems[0]);
      expect(nextItems).toContain(initialItems[1]);
      expect(nextItems).toContain(initialItems[2]);
      expect(createdItems).toHaveLength(3);
      expect(ctx.actionTarget).toHaveBeenCalledTimes(1);
      expect(dispose).not.toHaveBeenCalled();
    } finally {
      (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
    }
  });

  it('replaces stale associated header menu items when menu action state changes', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const previousInterop = (global as Record<string, unknown>).interop;
    const previousEventBridge = NativeScriptRuntime.eventBridge;
    const associatedValues = new WeakMap<object, Map<string, unknown>>();

    const setAssociatedObject = (
      target: object,
      key: string,
      value: unknown,
    ) => {
      let values = associatedValues.get(target);
      if (!values) {
        values = new Map();
        associatedValues.set(target, values);
      }
      values.set(key, value);
    };

    (global as Record<string, unknown>).interop = {
      Block: jest.fn(
        (_signature: string, callback: (sender: unknown) => void) => callback,
      ),
      getAssociatedObject: jest.fn((target: object, key: string) => {
        return associatedValues.get(target)?.get(key) ?? null;
      }),
      setAssociatedObject: jest.fn(setAssociatedObject),
    };
    NativeScriptRuntime.eventBridge = jest.fn(
      (callback: (sender: unknown) => void) => callback,
    );
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      NSArray: {
        arrayWithArray: (values: unknown[]) => values,
      },
      UIAction: {
        alloc: () => ({
          initWithTitleImageIdentifierHandler: (
            title: string,
            image: unknown,
            identifier: unknown,
            handler: (sender: unknown) => void,
          ) => ({ title, image, identifier, handler }),
        }),
        actionWithTitleImageIdentifierHandler: (
          title: string,
          image: unknown,
          identifier: unknown,
          handler: (sender: unknown) => void,
        ) => ({ title, image, identifier, handler }),
      },
      UIBarButtonItem: {
        alloc: () => ({
          init: () => ({
            title: '',
          }),
        }),
      },
      UIMenu: {
        menuWithTitleImageIdentifierOptionsChildren: (
          title: string,
          image: unknown,
          identifier: unknown,
          options: unknown,
          children: unknown[],
        ) => ({ title, image, identifier, options, children }),
      },
    };
    const ctx = {
      actionTarget: () => ({ action: 'nativeScriptHandleAction:', target: {} }),
      retain: jest.fn(),
    };
    const associatedConfigKey =
      '__rnsNativeScriptHeaderBarButtonItemConfig.NativeScriptValue';

    try {
      const initialItems = __nativeScriptCreateHeaderBarButtonItemsForTests(
        [
          {
            index: 0,
            menu: {
              items: [
                {
                  menuId: '0-0-right',
                  state: 'on',
                  title: 'React Navigation menu increment',
                  type: 'action',
                },
              ],
              title: 'Header menu',
            },
            title: 'Menu',
            type: 'menu',
          },
        ] as any,
        [],
        ctx,
        { onPressHeaderBarButtonMenuItem: jest.fn() } as any,
      ) as any[];
      const currentMenuItem = initialItems[0];
      const currentConfig =
        currentMenuItem.__rnsNativeScriptHeaderBarButtonItemConfig;

      expect(currentMenuItem.menu.children[0].state).toBe(1);
      delete currentMenuItem.__rnsNativeScriptHeaderBarButtonItemConfig;
      setAssociatedObject(currentMenuItem, associatedConfigKey, currentConfig);

      const nextItems = __nativeScriptCreateHeaderBarButtonItemsForTests(
        [
          {
            index: 0,
            menu: {
              items: [
                {
                  menuId: '0-0-right',
                  state: 'off',
                  title: 'React Navigation menu increment',
                  type: 'action',
                },
              ],
              title: 'Header menu',
            },
            title: 'Menu',
            type: 'menu',
          },
        ] as any,
        [currentMenuItem],
        ctx,
        { onPressHeaderBarButtonMenuItem: jest.fn() } as any,
      ) as any[];

      expect(nextItems).toHaveLength(1);
      expect(nextItems[0]).not.toBe(currentMenuItem);
      expect(nextItems[0].menu.children[0].state).toBe(0);
    } finally {
      NativeScriptRuntime.eventBridge = previousEventBridge;
      (global as Record<string, unknown>).interop = previousInterop;
      (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
    }
  });

  it('replaces configured header bar-button targets even when button ids are stable', () => {
    const dispose = jest.fn();
    const onButtonPress = jest.fn();
    let bridgedPress: ((sender: unknown) => void) | undefined;
    const createdItems: any[] = [];
    const actionTarget = {
      action: 'nativeScriptHandleAction:',
      dispose,
      target: {
        nativeScriptHandleAction: jest.fn(),
      },
    };

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIBarButtonItem: {
        alloc: () => ({
          init: () => {
            const item = {
              setTitleTextAttributesForState: jest.fn(),
              title: '',
            };
            createdItems.push(item);
            return item;
          },
        }),
      },
      UIBarButtonItemStyle: {
        Plain: 'plain',
      },
    };
    (
      global as Record<string, unknown>
    ).__rnsNativeScriptHeaderBarButtonItemClass = undefined;

    const currentItem: any = {
      __rnsNativeScriptHeaderBarButtonActionTarget: actionTarget,
      __rnsNativeScriptHeaderBarButtonItemConfig: {
        buttonId: 'right-0',
        index: 0,
        title: 'Ping',
        type: 'button',
      },
      __rnsNativeScriptHeaderBarButtonPrimaryAction: 'event:right-0',
      setTitleTextAttributesForState: jest.fn(),
      target: actionTarget.target,
      title: 'Ping',
    };
    const ctx = {
      actionTarget: jest.fn((callback: (sender: unknown) => void) => {
        bridgedPress = callback;
        return {
          action: 'nativeScriptHandleAction:',
          target: {
            nativeScriptHandleAction: (sender: unknown) => {
              bridgedPress?.(sender);
            },
          },
        };
      }),
      retain: jest.fn(),
    };

    try {
      const items = __nativeScriptCreateHeaderBarButtonItemsForTests(
        [
          {
            buttonId: 'right-0',
            index: 0,
            title: 'Ping 1',
            type: 'button',
          },
        ] as any,
        [currentItem],
        ctx,
        { onPressHeaderBarButtonItem: onButtonPress } as any,
      ) as any[];

      expect(items).toHaveLength(1);
      expect(items[0]).not.toBe(currentItem);
      expect(items[0]).toBe(createdItems[0]);
      expect(items[0].title).toBe('Ping 1');
      expect(dispose).toHaveBeenCalledTimes(1);
      expect(currentItem.target).toBeNull();
      expect(currentItem.action).toBeNull();
      expect(ctx.actionTarget).toHaveBeenCalledTimes(1);

      items[0].target.nativeScriptHandleAction(items[0]);

      expect(
        actionTarget.target.nativeScriptHandleAction,
      ).not.toHaveBeenCalled();
      expect(onButtonPress).toHaveBeenCalledWith({
        nativeEvent: {
          buttonId: 'right-0',
        },
      });
    } finally {
      (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
      (
        global as Record<string, unknown>
      ).__rnsNativeScriptHeaderBarButtonItemClass = undefined;
    }
  });

  it('inserts iOS header bar-button items by upstream index semantics', () => {
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIBarButtonItem: {
        alloc: () => ({
          init: () => ({
            kind: 'button',
            title: '',
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
      'setNativeScriptHeaderSubviewExpectedCount',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'nativeScriptHeaderSubviewCount={nativeScriptHeaderSubviewCount}',
    );
    expect(screenStackItemSource).toContain(
      'nativeScriptHeaderSubviewCount={nativeScriptHeaderSubviewCount}',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'countNativeScriptHeaderSubviewChildren(nativeScriptChildren)',
    );
    expect(screenStackItemSource).toContain(
      'countNativeScriptHeaderSubviewChildren(nativeScriptHeaderConfig?.children)',
    );
    expect(stackSource).toContain(
      'export function setNativeScriptHeaderSubviewExpectedCount',
    );
    expect(stackSource).toContain('screenHeaderSubviewExpectedCounts');
    expect(stackSource).toContain('screenHeaderSubviewExpectedCountResolved');
    expect(stackSource).toContain(
      'registry.screenHeaderSubviewExpectedCountResolved[screenId] = true;',
    );
    expect(
      stackSource.indexOf('function normalizedHeaderSubviewExpectedCount'),
    ).toBeLessThan(
      stackSource.indexOf(
        'export function setNativeScriptHeaderSubviewExpectedCount',
      ),
    );
    expect(
      stackSource
        .slice(
          stackSource.indexOf(
            'export function setNativeScriptHeaderSubviewExpectedCount',
          ),
          stackSource.indexOf(
            'export const __nativeScriptRegisterHeaderSubviewForTests',
          ),
        )
        .includes('reconcilePendingStackAfterHeaderSubviewUpdate('),
    ).toBe(false);
    expect(screenStackHeaderConfigSource).toContain(
      'const didChange = registerNativeScriptHeaderSubview',
    );
    expect(searchBarSource).toContain(
      'const didChange = registerNativeScriptHeaderSubview',
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
    expect(stackSource).toContain('function headerSubviewTitleCustomView');
    expect(stackSource).toContain(
      'titleView = headerSubviewTitleCustomView(record)',
    );
    expect(stackSource).not.toContain(
      'navigationItem.leftBarButtonItems = null;',
    );
    expect(stackSource).not.toContain(
      'navigationItem.rightBarButtonItems = null;',
    );
    expect(stackSource).toMatch(
      /nativeObjectArraysEqual\(\s*navigationItem\.leftBarButtonItems,\s*nextLeftBarButtonItems,\s*\)/,
    );
    expect(stackSource).toContain('initWithCustomView(customView)');
    expect(stackSource).toContain('function headerSubviewBarButtonCustomView');
    expect(stackSource).toContain('function backButtonImageForScreen');
    expect(stackSource).toContain('setBackIndicatorImageOnAppearance');
    expect(stackSource).toContain(
      'Upstream RNSScreenStackHeaderSubview wraps left/right custom views on iOS',
    );
    const headerSubviewWrapperSource = stackSource.slice(
      stackSource.indexOf('function headerSubviewBarButtonCustomView'),
      stackSource.indexOf('function createHeaderSubviewBarButtonItem'),
    );
    const headerSubviewTitleSource = stackSource.slice(
      stackSource.indexOf('function headerSubviewTitleCustomView'),
      stackSource.indexOf('function searchBarPlacementValue'),
    );
    const wrapperLayoutSource = stackSource.slice(
      stackSource.indexOf('function layoutHeaderSubviewCustomViewWrapper'),
      stackSource.indexOf(
        'function invalidateHeaderSubviewCustomViewWrapperLayout',
      ),
    );
    expect(wrapperLayoutSource).not.toContain(
      "if (subviewType === 'left' || subviewType === 'right')",
    );
    expect(headerSubviewWrapperSource).not.toContain(
      'constraintEqualToConstant',
    );
    expect(headerSubviewWrapperSource).not.toContain(
      'updateHeaderSubviewFixedSizeConstraints',
    );
    expect(headerSubviewTitleSource).toContain(
      'return headerSubviewBarButtonCustomView(record) ?? nativeView;',
    );
    expect(headerSubviewTitleSource).toContain(
      'nativeView.__rnsNativeScriptHeaderSubviewIntrinsicSize = titleSize;',
    );
    expect(headerSubviewTitleSource).not.toContain('initWithCustomView');
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
      'configureHeaderSubviewViews(\n      navigationItem,\n      props,',
    );
    const titleIndex = stackSource.indexOf(
      "setNativeValueForKey(navigationItem, 'title', headerConfig?.title ?? '');",
      subviewIndex,
    );
    const barItemsIndex = stackSource.indexOf(
      'configureHeaderBarButtonItems(\n      navigationItem,\n      headerConfig,\n      ctx,',
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
    expect(stackSource).toContain(
      'restoreActiveScreenContentAfterHeaderSubviewUpdate(screenId, registry);',
    );
  });

  it('exposes upstream-style intrinsic sizing for NativeScript header subview custom views', () => {
    const nativeScriptDefinitions = (
      NativeScriptRuntime as unknown as {
        __getDefinitions: () => Array<{ debugName?: string; layout?: unknown }>;
      }
    ).__getDefinitions();
    const headerSubviewDefinition = nativeScriptDefinitions.find(
      definition =>
        definition.debugName === 'RNSScreenStackHeaderSubview.NativeScript',
    );
    const updateFromLayoutSource = screenStackHeaderConfigSource.slice(
      screenStackHeaderConfigSource.indexOf(
        'function updateNativeScriptHeaderSubviewIntrinsicSizeFromLayout',
      ),
      screenStackHeaderConfigSource.indexOf(
        'function updateNativeScriptHeaderSubviewIntrinsicSize(\n',
      ),
    );
    const updateIntrinsicSource = screenStackHeaderConfigSource.slice(
      screenStackHeaderConfigSource.indexOf(
        'function updateNativeScriptHeaderSubviewIntrinsicSize(\n',
      ),
      screenStackHeaderConfigSource.indexOf(
        'function layoutNativeScriptHeaderSubviewHost',
      ),
    );
    const headerSubviewWrapperSource = stackSource.slice(
      stackSource.indexOf('function headerSubviewBarButtonCustomView'),
      stackSource.indexOf('function createHeaderSubviewBarButtonItem'),
    );
    const wrapperLayoutSource = stackSource.slice(
      stackSource.indexOf('function layoutHeaderSubviewCustomViewWrapper'),
      stackSource.indexOf(
        'function invalidateHeaderSubviewCustomViewWrapperLayout',
      ),
    );
    const titleCustomViewSource = stackSource.slice(
      stackSource.indexOf('function headerSubviewTitleCustomView'),
      stackSource.indexOf('function searchBarPlacementValue'),
    );

    expect(screenStackHeaderConfigSource).toContain(
      'function nativeScriptHeaderSubviewRootViewClass',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'RNSScreenStackHeaderSubviewNativeScriptView',
    );
    expect(screenStackHeaderConfigSource).toContain('intrinsicContentSize()');
    expect(screenStackHeaderConfigSource).toContain('sizeThatFits');
    expect(screenStackHeaderConfigSource).toContain(
      'function headerSubviewHitTestVisibleDescendantOutsideBounds',
    );
    expect(screenStackHeaderConfigSource).toContain(
      '__rnsNativeScriptHeaderSubviewChildrenView',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'childrenView.leadingAnchor.constraintEqualToAnchor',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'childrenView.bottomAnchor.constraintEqualToAnchor',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'updateNativeScriptHeaderSubviewIntrinsicSize',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'handleNativeScriptHeaderSubviewLayout',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'updateNativeScriptHeaderSubviewIntrinsicSizeFromLayout',
    );
    expect(screenStackHeaderConfigSource).not.toContain(
      'setHeaderSubviewChildrenContentOffset',
    );
    expect(screenStackHeaderConfigSource).not.toContain(
      'nativeHeaderSubviewNavigationBar',
    );
    expect(screenStackHeaderConfigSource).toContain('?.runOnUI');
    expect(screenStackHeaderConfigSource).toContain(
      'invalidateIntrinsicContentSize',
    );
    expect(screenStackHeaderConfigSource).toContain(
      '__rnsNativeScriptHeaderSubviewCustomViewWrapper',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'customViewWrapper?.invalidateIntrinsicContentSize',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'customViewWrapper?.superview?.setNeedsLayout',
    );
    expect(headerSubviewDefinition?.layout).toEqual({ sizing: 'fill' });
    expect(screenStackHeaderConfigSource).toContain(
      'function headerSubviewFabricLayoutFrame',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'function headerSubviewFabricLayoutSize',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'function headerSubviewViewNeedsAutoLayout',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'function headerSubviewTypePrefersIntrinsicContentSize',
    );
    expect(screenStackHeaderConfigSource).toContain(
      '__nativeScriptReactFabricViewLayoutTraits',
    );
    expect(screenStackHeaderConfigSource).toContain(
      '__rnsNativeScriptHeaderSubviewType',
    );
    expect(updateFromLayoutSource).toContain('const layoutSize =');
    expect(updateFromLayoutSource).toContain('const fabricSizeIsValid =');
    expect(updateFromLayoutSource).toContain('const shouldUseFabricSize =');
    expect(screenStackHeaderConfigSource).toContain(
      'function headerSubviewShouldUseCompactContentSize',
    );
    expect(updateFromLayoutSource).toContain(
      'const shouldUseCompactContentSize =',
    );
    expect(updateFromLayoutSource).toContain(
      'fabricSizeIsValid && !shouldUseCompactContentSize',
    );
    expect(updateFromLayoutSource).toContain('shouldUseContentWidth');
    expect(updateFromLayoutSource).toContain(
      'shouldUseFabricSize\n' +
        '      ? fabricSize.width\n' +
        '      : shouldUseContentWidth',
    );
    expect(updateIntrinsicSource).toContain('const fabricSizeIsValid =');
    expect(updateIntrinsicSource).toContain(
      'const shouldUseCompactContentSize =',
    );
    expect(updateIntrinsicSource).toContain(
      'fabricSizeIsValid && !shouldUseCompactContentSize',
    );
    expect(updateIntrinsicSource).not.toContain(
      'headerSubviewViewNeedsAutoLayout(rootView) &&',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'preserveDetachedChildrenLayout',
    );
    expect(screenStackHeaderConfigSource).not.toContain(
      'disableDetachedChildrenTouchHandler',
    );
    expect(screenStackHeaderConfigSource).toContain(
      '.refreshUIKitHostViewDirectOwner',
    );
    expect(screenStackHeaderConfigSource).toContain(
      '<NativeScriptHeaderSubviewHost',
    );
    expect(screenStackHeaderConfigSource).toContain('attachNativeView={false}');
    expect(screenStackHeaderConfigSource).toContain(
      'function layoutNativeScriptHeaderSubviewNavigationBar',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'function nativeScriptHeaderSubviewNearestNavigationBar',
    );
    expect(screenStackHeaderConfigSource).toContain('didMoveToSuperview()');
    expect(screenStackHeaderConfigSource).toContain('didMoveToWindow()');
    expect(screenStackHeaderConfigSource).toContain(
      'layoutNativeScriptHeaderSubviewNavigationBar(this);',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'layoutNativeScriptHeaderSubviewNavigationBar(rootView);',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'return { height: 0, width: 0 };',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'function headerSubviewNativeIntrinsicSize',
    );
    expect(screenStackHeaderConfigSource).toContain('invalidateNativeLayout');
    expect(stackSource).toContain(
      'function layoutHeaderSubviewCustomViewWrapper',
    );
    expect(stackSource).toContain('layoutHeaderSubviewCustomViewWrapper(this)');
    expect(wrapperLayoutSource).not.toContain('layoutIfNeeded');
    expect(wrapperLayoutSource).not.toContain(
      "if (subviewType === 'left' || subviewType === 'right')",
    );
    expect(stackSource).toContain(
      'function invalidateHeaderSubviewCustomViewWrapperLayout',
    );
    expect(stackSource).toContain('wrapper.superview?.setNeedsLayout?.();');
    const invalidateWrapperSource = stackSource.slice(
      stackSource.indexOf(
        'function invalidateHeaderSubviewCustomViewWrapperLayout',
      ),
      stackSource.indexOf(
        'function applyHeaderSubviewBarButtonLayoutPriorities',
      ),
    );
    expect(invalidateWrapperSource).not.toContain('layoutIfNeeded');
    expect(stackSource).toContain('return { height: 0, width: 0 };');
    expect(stackSource).not.toContain(
      'function updateHeaderSubviewFixedSizeConstraints',
    );
    expect(headerSubviewWrapperSource).not.toContain(
      'constraintEqualToConstant',
    );
    expect(stackSource).toContain(
      'function updateHeaderSubviewNativeViewSizeConstraints',
    );
    expect(titleCustomViewSource).toContain(
      'prepareHeaderSubviewNativeViewForTitleView(nativeView, titleSize);',
    );
    expect(titleCustomViewSource).toContain(
      'headerSubviewResolvedRecordCompactIntrinsicSize',
    );
    expect(titleCustomViewSource).toContain(
      'return headerSubviewBarButtonCustomView(record) ?? nativeView;',
    );
    expect(titleCustomViewSource).toContain(
      'nativeView.__rnsNativeScriptHeaderSubviewIntrinsicSize = titleSize;',
    );
    expect(titleCustomViewSource).not.toContain(
      'updateHeaderSubviewNativeViewSizeConstraints(',
    );
    expect(stackSource).toContain('navigationItem.titleView = titleView;');
    expect(stackSource).not.toContain('navigationItem.titleView = null;');
    expect(stackSource).toContain(
      'if (!nativeObjectsEqual(navigationItem.titleView, titleView))',
    );
    expect(stackSource).toContain(
      'function layoutNavigationBarForHeaderSubview',
    );
    expect(stackSource).toContain(
      'layoutNavigationBarForHeaderSubview(titleView, flushNavigationBarLayout);',
    );
    const layoutNavigationBarSource = stackSource.slice(
      stackSource.indexOf('function layoutNavigationBarForHeaderSubview'),
      stackSource.indexOf(
        'function nativeScriptHeaderSubviewCustomViewWrapperClass',
      ),
    );
    expect(layoutNavigationBarSource).toContain(
      'navigationBar.layoutIfNeeded?.();',
    );
    expect(layoutNavigationBarSource).toContain('if (flushLayout)');
    expect(titleCustomViewSource).not.toContain(
      'nativeView.translatesAutoresizingMaskIntoConstraints = true;',
    );
    expect(headerSubviewWrapperSource).toContain(
      'wrapper.widthAnchor.constraintEqualToAnchor(nativeView.widthAnchor)',
    );
    expect(headerSubviewWrapperSource).toContain(
      'nativeView.centerXAnchor.constraintEqualToAnchor(wrapper.centerXAnchor)',
    );
    expect(headerSubviewWrapperSource).toContain(
      'nativeView.centerYAnchor.constraintEqualToAnchor(wrapper.centerYAnchor)',
    );
    expect(headerSubviewWrapperSource).toContain(
      'widthEqual.priority = layoutPriorityDefaultHigh()',
    );
    expect(stackSource).not.toContain('IOS_26_HEADER_SUBVIEW_MIN_WIDTH');
    expect(stackSource).not.toContain(
      'updateHeaderSubviewFixedSizeConstraints(\n      existingWrapper',
    );
    expect(stackSource).toContain(
      'function headerSubviewCustomViewWrapperIntrinsicSize',
    );
    expect(stackSource).not.toContain('UIViewNoIntrinsicMetric');
    expect(stackSource).toContain(
      'sizeThatFits(_size: any) {\n' +
        "      'worklet';\n" +
        '      const hostedView = this.__rnsNativeScriptHeaderSubviewHostedView;\n' +
        '      const size = headerSubviewIntrinsicSize(hostedView);',
    );
    expect(stackSource).toContain(
      'return makeHeaderSubviewSize(size.width, size.height);',
    );
    expect(stackSource).toContain('width: size.width,');
    expect(stackSource).not.toContain('horizontalPadding');
    expect(stackSource).toContain(
      'existingWrapper.__rnsNativeScriptHeaderSubviewType = record.type;',
    );
    expect(screenStackHeaderConfigSource).toContain('didLayoutChange');
    expect(screenStackHeaderConfigSource).toContain(
      'NativeClassFunction(RNSScreenStackHeaderSubviewNativeScriptView)',
    );
    expect(stackSource).toContain(
      'function nativeScriptHeaderSubviewCustomViewWrapperClass',
    );
    expect(stackSource).toContain(
      'RNSScreenStackHeaderSubviewCustomViewWrapper',
    );
    expect(stackSource).toContain(
      'function headerSubviewCustomViewWrapperIntrinsicSize',
    );
    expect(stackSource).toContain(
      'wrapper.__rnsNativeScriptHeaderSubviewHostedView = nativeView',
    );
    expect(stackSource).toContain(
      'nativeView[HEADER_SUBVIEW_CUSTOM_VIEW_WRAPPER_KEY] = wrapper',
    );
    expect(stackSource).toContain(
      'prepareHeaderSubviewNativeViewForBarButton(nativeView)',
    );
    expect(stackSource).toContain('nativeView.userInteractionEnabled = true;');
    expect(stackSource).toContain(
      'function refreshHeaderSubviewSurfaceTouchHandler',
    );
    expect(stackSource).toContain(
      'function headerSubviewChildrenView(nativeView: any)',
    );
    expect(stackSource).toContain(
      'nativeView.__rnsNativeScriptHeaderSubviewTouchRefreshKey === nextRefreshKey',
    );
    expect(stackSource).toContain(
      'surfaceTouchHandlerAttachmentKey(nativeView)',
    );
    expect(stackSource).toContain('viewWindowOriginKey(nativeView)');
    expect(stackSource).toContain(
      'refreshHeaderSubviewSurfaceTouchHandler(nativeView);',
    );
    expect(stackSource).toContain(
      'refreshNativeScriptScreenViewSurfaceTouchHandler(childrenView, true)',
    );
    expect(wrapperLayoutSource).not.toContain(
      'refreshHeaderSubviewSurfaceTouchHandler(hostedView);',
    );
    expect(wrapperLayoutSource).toContain(
      'if (didUpdateBounds || didUpdateFrame) {',
    );
    expect(wrapperLayoutSource).toContain(
      'headerSubviewChildrenView(hostedView)?.setNeedsLayout?.();',
    );
    expect(stackSource).toContain(
      'function refreshKnownUIKitHostViewDirectOwner',
    );
    expect(stackSource).not.toContain(
      'refreshKnownUIKitHostViewDirectOwner(nativeView);',
    );
    expect(stackSource).toContain('headerSubviewIntrinsicSizeKey(nativeView)');
    expect(stackSource).toContain(
      'existingWrapper.__rnsNativeScriptHeaderSubviewSizeKey !== nextSizeKey',
    );
    expect(stackSource).toContain('previousSubviewType !== record.type');
    expect(stackSource).toContain(
      'existingWrapper.userInteractionEnabled = true;',
    );
    expect(stackSource).toContain('wrapper.userInteractionEnabled = true;');
    expect(screenStackHeaderConfigSource).toContain(
      'function refreshNativeScriptHeaderSubviewHostIfContentInvalid',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'function refreshNativeScriptHeaderSubviewHostDirectOwner',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'function refreshCollectedNativeScriptHeaderSubviewHosts',
    );
    expect(screenStackHeaderConfigSource).toContain(
      '.collectedUIKitHostChildren',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'refreshCollectedNativeScriptHeaderSubviewHosts(rootView);',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'refresh(view, props) {\n' +
        "    'worklet';\n" +
        '    syncNativeScriptHeaderSubview(view, props);',
    );
    expect(
      screenStackHeaderConfigSource.indexOf(
        'refreshCollectedNativeScriptHeaderSubviewHosts(rootView);',
      ),
    ).toBeLessThan(
      screenStackHeaderConfigSource.indexOf(
        'setNativeScriptHeaderSubviewExpectedCount(',
      ),
    );
    expect(screenStackHeaderConfigSource).toContain(
      'refreshNativeScriptHeaderSubviewHostIfContentInvalid(view);',
    );
    expect(
      screenStackHeaderConfigSource.indexOf(
        'refreshNativeScriptHeaderSubviewHostIfContentInvalid(view);',
      ),
    ).toBeLessThan(
      screenStackHeaderConfigSource.indexOf(
        'const didLayoutChange = layoutNativeScriptHeaderSubviewHost(view);',
      ),
    );
    expect(screenStackHeaderConfigSource).toContain(
      'refreshNativeScriptHeaderSubviewHostIfContentInvalid(hostView);',
    );
    expect(
      screenStackHeaderConfigSource.indexOf(
        'function updateNativeScriptHeaderSubviewIntrinsicSizeFromLayout',
      ),
    ).toBeLessThan(
      screenStackHeaderConfigSource.indexOf(
        'function updateNativeScriptHeaderSubviewIntrinsicSize(\n',
      ),
    );
  });

  it('keeps stretched UIKit header widths out of NativeScript header intrinsic sizing', () => {
    const rect = (width: number, height: number) => ({
      origin: { x: 0, y: 0 },
      size: { height, width },
    });
    const wrapperSuperview = { setNeedsLayout: jest.fn() };
    const wrapper = {
      invalidateIntrinsicContentSize: jest.fn(),
      setNeedsLayout: jest.fn(),
      superview: wrapperSuperview,
    };
    const rootView: any = {
      __rnsNativeScriptHeaderSubviewCustomViewWrapper: wrapper,
      __rnsNativeScriptHeaderSubviewType: 'right',
      __nativeScriptFabricViewLayoutTraits: {
        layoutMetricsFrameHeight: 32,
        layoutMetricsFrameWidth: 44,
        layoutMetricsFrameX: 0,
        layoutMetricsFrameY: 0,
      },
      bounds: rect(270, 36),
      frame: rect(270, 36),
      invalidateIntrinsicContentSize: jest.fn(),
      setNeedsLayout: jest.fn(),
    };
    const childrenView: any = {
      frame: rect(270, 36),
      setNeedsLayout: jest.fn(),
      subviews: [
        {
          __nativeScriptFabricViewLayoutTraits: {
            layoutMetricsFrameHeight: 32,
            layoutMetricsFrameWidth: 44,
            layoutMetricsFrameX: 0,
            layoutMetricsFrameY: 0,
          },
          bounds: rect(270, 36),
          frame: rect(270, 36),
        },
      ],
    };
    const hostView = { childrenView, rootView };

    expect(
      __nativeScriptUpdateHeaderSubviewIntrinsicSizeFromLayoutForTests(
        hostView,
        270,
        36,
      ),
    ).toBe(true);
    expect(rootView.__rnsNativeScriptHeaderSubviewIntrinsicSize).toEqual({
      height: 32,
      width: 44,
    });
    expect(rootView.bounds).toEqual(rect(270, 36));
    expect(rootView.frame).toEqual(rect(270, 36));
    expect(childrenView.frame).toEqual(rect(270, 36));

    rootView.bounds = rect(270, 36);
    childrenView.frame = rect(270, 36);

    expect(
      __nativeScriptUpdateHeaderSubviewIntrinsicSizeFromLayoutForTests(
        hostView,
        270,
        36,
      ),
    ).toBe(false);
    expect(rootView.bounds).toEqual(rect(270, 36));
    expect(childrenView.frame).toEqual(rect(270, 36));
  });

  it('preserves Fabric-measured padding for React headerRight custom views', () => {
    const rect = (width: number, height: number) => ({
      origin: { x: 0, y: 0 },
      size: { height, width },
    });
    const rootView: any = {
      __rnsNativeScriptHeaderSubviewType: 'right',
      __nativeScriptFabricViewLayoutTraits: {
        layoutMetricsFrameHeight: 32,
        layoutMetricsFrameWidth: 44,
        layoutMetricsFrameX: 0,
        layoutMetricsFrameY: 0,
      },
      bounds: rect(44, 32),
      frame: rect(44, 32),
      invalidateIntrinsicContentSize: jest.fn(),
      setNeedsLayout: jest.fn(),
    };
    const textLeaf = {
      bounds: rect(24, 18),
      frame: rect(10, 7),
      intrinsicContentSize: () => ({ height: 18, width: 24 }),
    };
    const pressableView = {
      __nativeScriptFabricViewLayoutTraits: {
        layoutMetricsFrameHeight: 32,
        layoutMetricsFrameWidth: 44,
        layoutMetricsFrameX: 0,
        layoutMetricsFrameY: 0,
      },
      bounds: rect(44, 32),
      frame: rect(44, 32),
      subviews: [textLeaf],
    };
    const childrenView: any = {
      frame: rect(44, 32),
      setNeedsLayout: jest.fn(),
      subviews: [pressableView],
    };

    expect(
      __nativeScriptUpdateHeaderSubviewIntrinsicSizeFromLayoutForTests(
        { childrenView, rootView },
        44,
        32,
      ),
    ).toBe(true);
    expect(rootView.__rnsNativeScriptHeaderSubviewIntrinsicSize).toEqual({
      height: 32,
      width: 44,
    });
  });

  it('uses compact hosted Fabric size instead of stretched headerRight lane size', () => {
    const rect = (width: number, height: number) => ({
      origin: { x: 0, y: 0 },
      size: { height, width },
    });
    const rootView: any = {
      __rnsNativeScriptHeaderSubviewType: 'right',
      __nativeScriptFabricViewLayoutTraits: {
        layoutMetricsFrameHeight: 64,
        layoutMetricsFrameWidth: 88,
        layoutMetricsFrameX: 0,
        layoutMetricsFrameY: 0,
      },
      bounds: rect(88, 64),
      frame: rect(88, 64),
      invalidateIntrinsicContentSize: jest.fn(),
      setNeedsLayout: jest.fn(),
    };
    const textLeaf = {
      bounds: rect(24, 18),
      frame: {
        origin: { x: 10, y: 7 },
        size: { height: 18, width: 24 },
      },
      intrinsicContentSize: () => ({ height: 18, width: 24 }),
    };
    const pressableView = {
      __nativeScriptFabricViewLayoutTraits: {
        layoutMetricsFrameHeight: 32,
        layoutMetricsFrameWidth: 44,
        layoutMetricsFrameX: 0,
        layoutMetricsFrameY: 0,
      },
      bounds: rect(44, 32),
      frame: rect(44, 32),
      subviews: [textLeaf],
    };
    const childrenView: any = {
      frame: rect(88, 64),
      setNeedsLayout: jest.fn(),
      subviews: [pressableView],
    };

    expect(
      __nativeScriptUpdateHeaderSubviewIntrinsicSizeFromLayoutForTests(
        { childrenView, rootView },
        88,
        64,
      ),
    ).toBe(true);
    expect(rootView.__rnsNativeScriptHeaderSubviewIntrinsicSize).toEqual({
      height: 32,
      width: 44,
    });
    expect(rootView.__rnsNativeScriptHeaderSubviewLayoutSize).toEqual({
      height: 64,
      width: 88,
    });
    expect(rootView.bounds).toEqual(rect(88, 64));
  });

  it('uses hosted iOS 26 left/right header wrapper intrinsic size like upstream', () => {
    const hostedView = {
      __rnsNativeScriptHeaderSubviewIntrinsicSize: {
        height: 32,
        width: 44,
      },
      __rnsNativeScriptHeaderSubviewType: 'right',
    };

    expect(
      __nativeScriptHeaderSubviewCustomViewWrapperIntrinsicSizeForTests({
        __rnsNativeScriptHeaderSubviewHostedView: hostedView,
        __rnsNativeScriptHeaderSubviewType: 'right',
      }),
    ).toEqual({ height: 32, width: 44 });
    expect(
      __nativeScriptHeaderSubviewCustomViewWrapperIntrinsicSizeForTests({
        __rnsNativeScriptHeaderSubviewHostedView: hostedView,
        __rnsNativeScriptHeaderSubviewType: 'center',
      }),
    ).toEqual({ height: 32, width: 44 });
  });

  it('uses React layout size for headerRight intrinsic size when Fabric traits are unavailable', () => {
    const rect = (width: number, height: number) => ({
      origin: { x: 0, y: 0 },
      size: { height, width },
    });
    const rootView: any = {
      __rnsNativeScriptHeaderSubviewType: 'right',
      bounds: rect(0, 0),
      frame: rect(0, 0),
      invalidateIntrinsicContentSize: jest.fn(),
      setNeedsLayout: jest.fn(),
    };
    const textLeaf = {
      bounds: rect(24, 18),
      frame: rect(10, 7),
      intrinsicContentSize: () => ({ height: 18, width: 24 }),
    };
    const pressableView = {
      bounds: rect(44, 32),
      frame: rect(44, 32),
      subviews: [textLeaf],
    };
    const childrenView: any = {
      frame: rect(44, 32),
      setNeedsLayout: jest.fn(),
      subviews: [pressableView],
    };

    expect(
      __nativeScriptUpdateHeaderSubviewIntrinsicSizeFromLayoutForTests(
        { childrenView, rootView },
        44,
        32,
      ),
    ).toBe(true);
    expect(rootView.__rnsNativeScriptHeaderSubviewIntrinsicSize).toEqual({
      height: 32,
      width: 44,
    });
    expect(rootView.__rnsNativeScriptHeaderSubviewLayoutSize).toEqual({
      height: 32,
      width: 44,
    });
  });

  it('shrinks center title views to intrinsic content instead of the full Fabric header lane', () => {
    const rect = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { height, width },
    });
    const rootView: any = {
      __rnsNativeScriptHeaderSubviewType: 'center',
      bounds: rect(270, 36),
      frame: {
        origin: { x: 79, y: 0 },
        size: { height: 36, width: 270 },
      },
      invalidateIntrinsicContentSize: jest.fn(),
      setNeedsLayout: jest.fn(),
    };
    const titleText = {
      bounds: rect(112, 22),
      frame: rect(0, 0),
      intrinsicContentSize: () => ({ height: 22, width: 112 }),
    };
    const titleContainer = {
      __nativeScriptFabricViewLayoutTraits: {
        layoutMetricsFrameHeight: 36,
        layoutMetricsFrameWidth: 270,
        layoutMetricsFrameX: 0,
        layoutMetricsFrameY: 0,
      },
      bounds: rect(270, 36),
      frame: rect(270, 36),
      subviews: [titleText],
    };
    const childrenView: any = {
      frame: rect(270, 36),
      setNeedsLayout: jest.fn(),
      subviews: [titleContainer],
    };
    rootView.__rnsNativeScriptHeaderSubviewChildrenView = childrenView;

    expect(
      __nativeScriptUpdateHeaderSubviewIntrinsicSizeFromLayoutForTests(
        { childrenView, rootView },
        270,
        36,
      ),
    ).toBe(true);
    expect(rootView.__rnsNativeScriptHeaderSubviewIntrinsicSize).toEqual({
      height: 22,
      width: 112,
    });
    expect(rootView.__rnsNativeScriptHeaderSubviewLayoutSize).toEqual({
      height: 36,
      width: 270,
    });
    expect(rootView.bounds).toEqual(rect(112, 22));
    expect(childrenView.frame).toEqual(rect(112, 22));
    expect(childrenView.bounds).toEqual(rect(112, 22));
  });

  it('does not include centered title child origin in intrinsic content width', () => {
    const rect = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { height, width },
    });
    const rootView: any = {
      __rnsNativeScriptHeaderSubviewType: 'center',
      bounds: rect(270, 36),
      frame: rect(270, 36),
      invalidateIntrinsicContentSize: jest.fn(),
      setNeedsLayout: jest.fn(),
    };
    const titleText = {
      bounds: rect(112, 22),
      frame: rect(112, 22, 79, 7),
      intrinsicContentSize: () => ({ height: 22, width: 112 }),
    };
    const childrenView: any = {
      frame: rect(270, 36),
      setNeedsLayout: jest.fn(),
      subviews: [titleText],
    };
    rootView.__rnsNativeScriptHeaderSubviewChildrenView = childrenView;

    expect(
      __nativeScriptUpdateHeaderSubviewIntrinsicSizeFromLayoutForTests(
        { childrenView, rootView },
        270,
        36,
      ),
    ).toBe(true);
    expect(rootView.__rnsNativeScriptHeaderSubviewIntrinsicSize).toEqual({
      height: 22,
      width: 112,
    });
    expect(rootView.__rnsNativeScriptHeaderSubviewLayoutSize).toEqual({
      height: 36,
      width: 270,
    });
    expect(rootView.bounds).toEqual(rect(112, 22));
    expect(childrenView.frame).toEqual(rect(112, 22));
    expect(childrenView.bounds).toEqual(rect(112, 22, 79, 7));

    (titleText as any).bounds = rect(270, 22);
    (titleText as any).frame = rect(270, 22);
    (titleText as any).intrinsicContentSize = () => ({
      height: 22,
      width: 270,
    });

    expect(
      __nativeScriptUpdateHeaderSubviewIntrinsicSizeFromLayoutForTests(
        { childrenView, rootView },
        270,
        22,
      ),
    ).toBe(false);
    expect(rootView.__rnsNativeScriptHeaderSubviewIntrinsicSize).toEqual({
      height: 22,
      width: 112,
    });
    expect(rootView.bounds).toEqual(rect(112, 22));
  });

  it('uses compact UIKit intrinsic content instead of stretched headerSubview frames', () => {
    const rect = (width: number, height: number) => ({
      origin: { x: 0, y: 0 },
      size: { height, width },
    });
    const rootView: any = {
      __rnsNativeScriptHeaderSubviewType: 'right',
      bounds: rect(180, 36),
      frame: rect(180, 36),
      invalidateIntrinsicContentSize: jest.fn(),
      setNeedsLayout: jest.fn(),
    };
    const childrenView: any = {
      frame: rect(180, 36),
      setNeedsLayout: jest.fn(),
      subviews: [
        {
          bounds: rect(180, 36),
          frame: rect(180, 36),
          intrinsicContentSize: () => ({ height: 32, width: 44 }),
        },
      ],
    };

    expect(
      __nativeScriptUpdateHeaderSubviewIntrinsicSizeFromLayoutForTests(
        { childrenView, rootView },
        180,
        36,
      ),
    ).toBe(true);
    expect(rootView.__rnsNativeScriptHeaderSubviewIntrinsicSize).toEqual({
      height: 32,
      width: 44,
    });
    expect(rootView.bounds).toEqual(rect(180, 36));
    expect(childrenView.frame).toEqual(rect(180, 36));
  });

  it('does not learn stretched UIKit bounds from left and right header subview layout events', () => {
    const rect = (width: number, height: number) => ({
      origin: { x: 0, y: 0 },
      size: { height, width },
    });
    const rootView: any = {
      __rnsNativeScriptHeaderSubviewType: 'right',
      bounds: rect(180, 36),
      frame: rect(180, 36),
      invalidateIntrinsicContentSize: jest.fn(),
      setNeedsLayout: jest.fn(),
    };
    const childrenView: any = {
      bounds: rect(180, 36),
      frame: rect(180, 36),
      setNeedsLayout: jest.fn(),
      subviews: [],
    };

    expect(
      __nativeScriptUpdateHeaderSubviewIntrinsicSizeFromLayoutForTests(
        { childrenView, rootView },
        180,
        36,
      ),
    ).toBe(false);
    expect(
      rootView.__rnsNativeScriptHeaderSubviewIntrinsicSize,
    ).toBeUndefined();
    expect(rootView.bounds).toEqual(rect(180, 36));
    expect(childrenView.frame).toEqual(rect(180, 36));
  });

  it('does not use an empty UIKit header child host as intrinsic content', () => {
    const rect = (width: number, height: number) => ({
      origin: { x: 0, y: 0 },
      size: { height, width },
    });
    const rootView: any = {
      bounds: rect(270, 36),
      invalidateIntrinsicContentSize: jest.fn(),
      setNeedsLayout: jest.fn(),
    };
    const childrenView: any = {
      bounds: rect(270, 36),
      frame: rect(270, 36),
      subviews: [],
    };

    expect(
      __nativeScriptUpdateHeaderSubviewIntrinsicSizeForTests({
        childrenView,
        rootView,
      }),
    ).toBe(false);
    expect(
      rootView.__rnsNativeScriptHeaderSubviewIntrinsicSize,
    ).toBeUndefined();
  });

  it('reuses NativeScript header subview bar button wrappers like upstream', () => {
    (global as Record<string, unknown>).__rnsNativeScriptHeaderSubviewRegistry =
      undefined;

    const createdItems: any[] = [];
    const createdWrappers: any[] = [];
    const makeAnchor = () => ({
      constraintEqualToAnchor: () => ({ active: false, priority: 0 }),
    });
    const makeWrapper = () => {
      const wrapper: any = {
        addSubview: jest.fn((view: any) => {
          wrapper.subviews = [view];
          view.superview = wrapper;
        }),
        centerXAnchor: makeAnchor(),
        centerYAnchor: makeAnchor(),
        frame: undefined,
        heightAnchor: makeAnchor(),
        init() {
          return wrapper;
        },
        invalidateIntrinsicContentSize: jest.fn(),
        setNeedsLayout: jest.fn(),
        widthAnchor: makeAnchor(),
      };
      createdWrappers.push(wrapper);
      return wrapper;
    };

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIBarButtonItem: {
        alloc: () => ({
          initWithCustomView: (customView: unknown) => {
            const item = { customView, hidesSharedBackground: false };
            createdItems.push(item);
            return item;
          },
        }),
      },
      UIDevice: {
        currentDevice: {
          systemVersion: '26.5',
        },
      },
      UIView: {
        alloc: makeWrapper,
      },
    };

    const nativeView: any = {
      __rnsNativeScriptHeaderSubviewIntrinsicSize: {
        height: 32,
        width: 44,
      },
      centerXAnchor: makeAnchor(),
      centerYAnchor: makeAnchor(),
      heightAnchor: makeAnchor(),
      setContentCompressionResistancePriorityForAxis: jest.fn(),
      setContentHuggingPriorityForAxis: jest.fn(),
      widthAnchor: makeAnchor(),
    };

    __nativeScriptRegisterHeaderSubviewForTests(
      {
        hidesSharedBackground: true,
        order: 0,
        screenId: 'screen-a',
        subviewId: 'right',
        type: 'right',
      },
      nativeView,
    );

    const firstNavigationItem: any = {};
    __nativeScriptConfigureHeaderSubviewViewsForTests(firstNavigationItem, {
      screenId: 'screen-a',
    } as any);

    const secondNavigationItem: any = {};
    __nativeScriptConfigureHeaderSubviewViewsForTests(secondNavigationItem, {
      screenId: 'screen-a',
    } as any);

    expect(createdWrappers).toHaveLength(1);
    expect(createdItems).toHaveLength(1);
    expect(firstNavigationItem.rightBarButtonItems[0]).toBe(
      secondNavigationItem.rightBarButtonItems[0],
    );
    expect(nativeView.__rnsNativeScriptHeaderSubviewCustomViewWrapper).toBe(
      createdWrappers[0],
    );
    expect(nativeView.__rnsNativeScriptHeaderSubviewBarButtonItem).toBe(
      createdItems[0],
    );

    __nativeScriptUnregisterHeaderSubviewForTests('screen-a', 'right');

    expect(
      nativeView.__rnsNativeScriptHeaderSubviewCustomViewWrapper,
    ).toBeNull();
    expect(nativeView.__rnsNativeScriptHeaderSubviewBarButtonItem).toBeNull();
    expect(stackSource).toContain(
      'const existingItem = nativeView[HEADER_SUBVIEW_BAR_BUTTON_ITEM_KEY]',
    );
    expect(stackSource).toContain('invalidateHeaderSubviewBarButtonItem');

    (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
  });

  it('clears stale configured header bar buttons while replacing stale header subview items', () => {
    (global as Record<string, unknown>).__rnsNativeScriptHeaderSubviewRegistry =
      undefined;

    const configuredItem: any = {
      __rnsNativeScriptHeaderBarButtonItemConfig: {
        buttonId: 'right-0',
        type: 'button',
      },
      title: 'Ping',
    };
    const staleSubviewItem = { customView: 'stale-subview' };
    const nativeView = { id: 'fresh-subview' };

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIBarButtonItem: {
        alloc: () => ({
          initWithCustomView: (customView: unknown) => ({ customView }),
        }),
      },
    };

    __nativeScriptRegisterHeaderSubviewForTests(
      {
        order: 0,
        screenId: 'screen-a',
        subviewId: 'right',
        type: 'right',
      },
      nativeView,
    );

    const navigationItem: any = {
      rightBarButtonItems: [staleSubviewItem, configuredItem],
    };

    __nativeScriptConfigureHeaderSubviewViewsForTests(navigationItem, {
      screenId: 'screen-a',
    } as any);

    expect(navigationItem.rightBarButtonItems).toHaveLength(1);
    expect(navigationItem.rightBarButtonItems[0].customView).toBe(nativeView);
    expect(navigationItem.rightBarButtonItems).not.toContain(staleSubviewItem);
    expect(navigationItem.rightBarButtonItems).not.toContain(configuredItem);

    (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
    (global as Record<string, unknown>).__rnsNativeScriptHeaderSubviewRegistry =
      undefined;
  });

  it('deduplicates unchanged NativeScript header subview registrations', () => {
    (global as Record<string, unknown>).__rnsNativeScriptHeaderSubviewRegistry =
      undefined;

    const nativeView = { id: 'host-view' };
    const registration = {
      order: 0,
      screenId: 'screen-a',
      subviewId: 'right',
      type: 'right',
    } as const;

    expect(
      __nativeScriptRegisterHeaderSubviewForTests(registration, nativeView),
    ).toBe(true);
    expect(
      __nativeScriptRegisterHeaderSubviewForTests(
        { ...registration },
        nativeView,
      ),
    ).toBe(false);
    const proxiedRegistration = {
      ...registration,
      screenId: 'screen-proxy',
    };
    const nativeViewProxy = {
      nativeId: 'same-native-view',
      isEqual(other: any) {
        return other?.nativeId === 'same-native-view';
      },
    };
    const nextNativeViewProxy = {
      nativeId: 'same-native-view',
      isEqual(other: any) {
        return other?.nativeId === 'same-native-view';
      },
    };

    expect(
      __nativeScriptRegisterHeaderSubviewForTests(
        proxiedRegistration,
        nativeViewProxy,
      ),
    ).toBe(true);
    expect(
      __nativeScriptRegisterHeaderSubviewForTests(
        { ...proxiedRegistration },
        nextNativeViewProxy,
      ),
    ).toBe(false);
    const hashedRegistration = {
      ...registration,
      screenId: 'screen-hash-proxy',
    };
    expect(
      __nativeScriptRegisterHeaderSubviewForTests(hashedRegistration, {
        hash: 4815162342,
      }),
    ).toBe(true);
    expect(
      __nativeScriptRegisterHeaderSubviewForTests(
        { ...hashedRegistration },
        { hash: 4815162342 },
      ),
    ).toBe(false);
    expect(
      __nativeScriptRegisterHeaderSubviewForTests(
        { ...registration, order: 1 },
        nativeView,
      ),
    ).toBe(true);
    expect(
      __nativeScriptRegisterHeaderSubviewForTests(
        { ...registration, order: 1 },
        { id: 'replacement-view' },
      ),
    ).toBe(true);
    expect(stackSource).toContain(
      'nativeObjectsEqual(record.nativeView, nativeView)',
    );
    expect(stackSource).toContain(
      'version: (existingRecord?.version ?? 0) + 1',
    );
    expect(stackSource).toContain('function headerSubviewRecordsKey');
    expect(stackSource).toContain('function headerSubviewPublishedSizeKey');
    expect(stackSource).toContain(
      'headerSubviewPublishedSizeKey(record.nativeView)',
    );
    expect(stackSource).toContain('__nativeScriptHeaderSubviewKey');
  });

  it('counts NativeScript header subviews through fragments like the header host', () => {
    const Left = () => null;
    const Center = () => null;
    const Right = () => null;

    expect(
      countNativeScriptHeaderSubviewChildren(
        React.createElement(
          React.Fragment,
          null,
          React.createElement(Left),
          React.createElement(
            React.Fragment,
            null,
            React.createElement(Center),
            null,
            React.createElement(Right),
          ),
        ),
      ),
    ).toBe(3);
  });

  it('tracks NativeScript header subview intrinsic sizes without blocking stack reconciliation', () => {
    (global as Record<string, unknown>).__rnsNativeScriptHeaderSubviewRegistry =
      undefined;

    const nativeView: any = {
      __rnsNativeScriptHeaderSubviewType: 'right',
      bounds: { origin: { x: 0, y: 0 }, size: { height: 0, width: 0 } },
      frame: { origin: { x: 0, y: 0 }, size: { height: 0, width: 0 } },
    };
    const registry: any = {
      screenHeaderConfigs: {
        'screen-native-only-header': {},
        'screen-sized-header': {},
      },
      screenHeaderSubviewExpectedCountResolved: {
        'screen-sized-header': true,
      },
      screenHeaderSubviewExpectedCounts: {
        'screen-sized-header': 1,
      },
    };

    expect(
      __nativeScriptScreenHeaderSubviewsAreReadyForTests(
        'screen-native-only-header',
        registry,
      ),
    ).toBe(true);
    expect(
      __nativeScriptRegisterHeaderSubviewForTests(
        {
          order: 0,
          screenId: 'screen-sized-header',
          subviewId: 'right',
          type: 'right',
        },
        nativeView,
      ),
    ).toBe(true);
    expect(
      __nativeScriptScreenHeaderSubviewsAreReadyForTests(
        'screen-sized-header',
        registry,
      ),
    ).toBe(false);

    nativeView.__rnsNativeScriptHeaderSubviewIntrinsicSize = {
      height: 32,
      width: 44,
    };

    expect(
      __nativeScriptScreenHeaderSubviewsAreReadyForTests(
        'screen-sized-header',
        registry,
      ),
    ).toBe(true);

    const stackCanReconcileSource = stackSource.slice(
      stackSource.indexOf('function stackCanReconcileFromPropsUpdate'),
      stackSource.indexOf(
        'function reconcilePendingStackAfterHeaderSubviewUpdate',
      ),
    );
    expect(stackCanReconcileSource).not.toContain(
      'screenHeaderSubviewsAreReady(screenId, registry)',
    );
    expect(stackCanReconcileSource).not.toContain('reason=header-subviews');
  });

  it('ports RNSScreenStackView header hit testing for oversized left/right subviews', () => {
    expect(stackSource).toContain('const STACK_CONTAINER_VIEW_CLASS_KEY');
    expect(stackSource).toContain(
      'class RNSScreenStackNativeScriptView extends UIView',
    );
    expect(stackSource).toContain('hitTestWithEvent(point: any, event: any)');
    expect(stackSource).toContain('hitTestHeaderSubviewForPoint');
    expect(stackSource).toContain('function topScreenIdForHeaderHitTest');
    expect(stackSource).toContain('registry.stackActiveScreenIds[stackId]');
    expect(stackSource).toContain(
      'return screenIdForController(topController, registry)',
    );
    expect(stackSource).toContain(
      'CGRectContainsPoint(navigationBar.frame, point)',
    );
    expect(stackSource).toContain('function convertPointBetweenNativeViews');
    expect(stackSource).toContain(
      "typeof sourceView?.convertPointToView === 'function'",
    );
    expect(stackSource).toContain(
      "typeof targetView?.convertPointFromView === 'function'",
    );
    expect(stackSource).not.toContain("sourceView?.['convertPoint:toView:']");
    expect(stackSource).not.toContain("targetView?.['convertPoint:fromView:']");
    expect(stackSource).not.toContain("superObject?.['hitTest:withEvent:']");
    expect(stackSource).toContain('function nativeViewHitTestWithEvent');
    expect(stackSource).toContain(
      'function nativeViewHitTestVisibleDescendantOutsideBounds',
    );
    expect(stackSource).toContain(
      'class RNSScreenStackHeaderSubviewCustomViewWrapper extends UIView',
    );
    expect(stackSource).toContain(
      'const hostedView = this.__rnsNativeScriptHeaderSubviewHostedView',
    );
    expect(stackSource).toContain("'hitTest:withEvent:': {");
    expect(stackSource).toContain('depth > 16');
    expect(stackSource).toContain(
      'for (let index = count - 1; index >= 0; index -= 1)',
    );
    expect(stackSource).toContain(
      'nativeViewHitTestVisibleDescendantOutsideBounds(\n' +
        '        record.nativeView,\n' +
        '        convertedPoint,\n' +
        '        event,\n' +
        '      );',
    );
    expect(stackSource).not.toContain("view?.['hitTest:withEvent:']");
    expect(stackSource).toContain('nativeViewHitTestWithEvent(');
    expect(stackSource).toContain('const navigationBarHitTestResult');
    expect(stackSource).toContain('return navigationBarHitTestResult');
    expect(stackSource).toContain(
      'const navigationView = nativeScriptEmbeddedNavigationView(stackView);',
    );
    expectSourceToContain(
      stackSource,
      'containerView.__rnsNativeScriptStackViewHitTestWithEvent =\n' +
        '        screenStackNativeScriptViewHitTestWithEvent;',
    );
    expectSourceToContain(
      stackSource,
      'const hitTestHandler =\n' +
        '        this.__rnsNativeScriptStackViewHitTestWithEvent;',
    );
    expect(stackSource).toContain('let hitView = null;');
    expect(stackSource).toContain('nativeObjectsEqual(hitView, stackView) ||');
    expect(stackSource).toContain(
      'nativeObjectsEqual(hitView, navigationView)',
    );
    const stackHitTestStart = stackSource.indexOf(
      'function screenStackNativeScriptViewHitTestWithEvent',
    );
    const stackHitTestSource = stackSource.slice(
      stackHitTestStart,
      stackSource.indexOf(
        'function retainGestureRecognizerDelegate',
        stackHitTestStart,
      ),
    );
    expect(stackHitTestSource).toContain(
      'const routeHitTestRoot = hitView ?? navigationView;',
    );
    expect(stackHitTestSource).toContain(
      'const routeHitTestResult = nativeViewHitTestVisibleDescendantOutsideBounds(',
    );
    expect(stackHitTestSource).toContain(
      "traceHitTest('stack-hit-route-descendant');",
    );
    expect(stackHitTestSource).not.toContain(
      'hitTestVisibleStackContentForPoint',
    );
    expect(stackHitTestSource).not.toContain(
      'restoreVisibleNavigationControllerInteractivity',
    );
    expect(stackSource).toContain(
      'empty container/background hits pass through',
    );
    expect(stackSource).toContain(
      'function stackContainerShouldKeepNativeBackGestureHit',
    );
    expect(stackSource).toContain('function topScreenPropsForStackBackGesture');
    expect(stackSource).toContain(
      'const nativeTopScreenId = screenIdForController(topController, registry);',
    );
    expect(stackSource).toContain(
      'if (nativeTopProps && nativeTopScreenId !== activeTopScreenId)',
    );
    expect(stackSource).toContain(
      'const viewControllerCount = arrayCount(navigationController.viewControllers);',
    );
    expect(stackSource).toContain('if (viewControllerCount < 2) {');
    expectSourceToContain(
      stackSource,
      'props &&\n' +
        '    !shouldReceiveStackBackGesture(\n' +
        '      props,\n' +
        '      viewControllerCount,\n' +
        "      'native-pop',\n" +
        '    )',
    );
    expect(stackHitTestSource).toContain(
      'stackContainerShouldKeepNativeBackGestureHit(',
    );
    expect(stackHitTestSource).toContain('navigationController,');
    expect(stackHitTestSource).toContain('stackView,');
    expect(stackHitTestSource).toContain('point,');
    expect(stackSource).toContain(
      'topScreenPropsForStackBackGesture(stackId, registry, navigationController)',
    );
    expect(stackHitTestSource).toContain(
      'return topScreenUsesCustomSwipeAnimation(props) ? stackView : navigationView;',
    );
    expect(
      stackHitTestSource.indexOf('stack-hit-native-back-edge'),
    ).toBeLessThan(stackHitTestSource.indexOf('stack-hit-route-descendant'));
    expect(
      stackHitTestSource.indexOf('stack-hit-native-back-edge'),
    ).toBeLessThan(
      stackHitTestSource.indexOf('stack-hit-pass-through-background'),
    );
    expect(
      stackSource.indexOf('for (const record of headerSubviewRecordsForScreen'),
    ).toBeLessThan(stackSource.indexOf('const navigationBarHitTestResult'));
    expect(stackSource).toContain(
      'navigationController.__nativeScriptStackContainerView = containerView',
    );
    expect(stackSource).toContain('STACK_CONTAINER_VIEW_ASSOCIATION_KEY');
    expect(stackSource).toContain(
      'const superviewNavigationController =\n' +
        '      nativeScriptStackNavigationController(superview);',
    );
    expect(stackSource).toContain(
      'nativeObjectsEqual(superviewNavigationController, navigationController) ||',
    );
    expect(stackSource).toContain(
      "invokeNativeSelector(\n        containerView,\n        'addSubview',\n        'addSubview:',\n        navigationView,\n      )",
    );
    expect(stackSource).toContain(
      'setNativeScriptEmbeddedNavigationView(controller, navigationView)',
    );
    expect(stackSource).toContain(
      'STACK_EMBEDDED_NAVIGATION_VIEW_ASSOCIATION_KEY',
    );
    expect(stackSource).not.toContain(
      'configureExtendedLayout(navigationController)',
    );
    expect(stackSource).toContain(
      'if (!navigationControllerContainsController(parentController, this))',
    );
    expect(stackSource).toContain(
      'this.view?.superview?.bringSubviewToFront?.(this.view);',
    );
    expect(stackSource).toContain(
      'navigationBar.superview?.bringSubviewToFront?.(navigationBar);',
    );
    expect(stackSource).toContain('function layoutNavigationBarWithinSafeArea');
    expect(stackSource).toContain(
      'function layoutNavigationStackViews(\n' +
        '  navigationController: any,\n' +
        "  reason = 'unknown',",
    );
    expect(stackSource).toContain(
      'layoutNavigationBarWithinSafeArea(navigationController)',
    );
    expect(stackSource).not.toContain(
      "layoutNavigationStackViews(navigationController, 'apply-navigation-appearance')",
    );
    expect(stackSource).toContain('layoutNavigationBarWithinSafeArea(this);');
    const navigationBarLayoutSource = stackSource.slice(
      stackSource.indexOf('function layoutNavigationBarWithinSafeArea'),
      stackSource.indexOf(
        'export const __nativeScriptLayoutNavigationBarWithinSafeAreaForTests',
      ),
    );
    expect(navigationBarLayoutSource).not.toContain('navigationBar.frame =');
    expect(navigationBarLayoutSource).not.toContain(
      'CGAffineTransformIdentity',
    );
    expect(stackSource).toContain('function syncNavigationBarSafeAreaInset');
    expect(stackSource).toContain(
      'controller.__rnsNativeScriptNavigationBarSafeAreaTop = missingTop',
    );
    expect(stackSource).toContain('screenScrollInsetTops');
    expect(stackSource).toContain('pointReplacingY');
    expect(stackSource).toContain('hostView(controller) {');
    expect(stackSource).toContain(
      'return hostViewForController(controller) ?? controller.view',
    );
  });

  it('ports RNSScreenStackView parent attachment before modal presentation', () => {
    const reactAddControllerIndex = stackSource.indexOf(
      'function reactAddControllerToClosestParent',
    );
    const attachSource = stackSource.slice(
      reactAddControllerIndex,
      stackSource.indexOf(
        'function maybeAddStackControllerToParentAndUpdateContainer',
      ),
    );
    const stackContainerSource = stackSource.slice(
      stackSource.indexOf('function nativeScriptStackContainerViewClass'),
      stackSource.indexOf('function nativeScriptScreenControllerClass'),
    );

    expect(attachSource).toContain(
      'function reactAddControllerToClosestParent',
    );
    expect(stackSource).toContain(
      "const STACK_MODAL_CONTENT_PARENT_ASSOCIATION_KEY =\n  'react-native-screens.NativeScriptStackModalContentParentViewController';",
    );
    expect(stackSource).toContain(
      'function setNativeScriptStackModalContentParentController',
    );
    expect(stackSource).toContain(
      'function nativeScriptStackModalContentParentController',
    );
    expectSourceToContain(
      attachSource,
      'const modalContentParent =\n' +
        '    nativeScriptStackModalContentParentController(controller, registry);',
    );
    expect(attachSource).toContain(
      'parentControllerViewContainsView(modalContentParent, stackView)',
    );
    expect(attachSource).toContain(
      'attachControllerToParentViewController(\n' +
        '      stackView,\n' +
        '      controller,\n' +
        '      modalContentParent,\n' +
        '    );',
    );
    expect(attachSource).toContain(
      'const currentParent = parentViewControllerForController(controller);',
    );
    expect(attachSource).toContain(
      'const currentParentContainsStackView = parentControllerViewContainsView(',
    );
    expect(attachSource).toContain(
      'controllerHasKnownRootContainedParent(\n' +
        '      controller,\n' +
        '      currentParent,\n' +
        '    )',
    );
    expect(attachSource).toContain(
      'currentParentContainsStackView &&\n' +
        '      viewControllerIsAttachableScreensParent(currentParent)',
    );
    expect(stackSource).toContain(
      'detachControllerFromCurrentParent(controller, true)',
    );
    expect(stackSource).toContain('function nextReactSuperviewForView');
    expect(stackSource).toContain('function owningViewControllerForView');
    expect(stackSource).toContain('function nextResponderForObject');
    expect(stackSource.indexOf('function nextResponderForObject')).toBeLessThan(
      stackSource.indexOf('function viewControllerFromResponderChain'),
    );
    expect(stackSource).toContain(
      "typeof nextResponderValue === 'function'\n    ? object.nextResponder()",
    );
    expect(stackSource).toContain(
      'function nearestRuntimeViewControllerForView',
    );
    expect(stackSource).toContain(
      '.nearestViewController;\n  if (typeof nearestViewController !==',
    );
    expect(stackSource).toContain(
      'const runtimeController = nearestRuntimeViewControllerForView(view);',
    );
    expect(stackSource).toContain('function nearestViewControllerForHostView');
    expect(stackSource).toContain('function parentViewControllerForController');
    expect(stackSource).toContain('function isAlreadyParentedAddChildError');
    expect(stackSource).toContain(
      'owningViewControllerForView(current) ??\n      viewControllerFromResponderChain(current) ??\n      reactViewControllerForView(current)',
    );
    expect(stackSource).toContain(
      'owningViewControllerForView(current) ??\n      viewControllerFromResponderChain(current) ??\n      reactViewControllerForView(current)',
    );
    expect(stackSource).toContain(
      'view.__nativeScriptOwningViewController = controller;',
    );
    expect(stackSource).toContain(
      'function markControllerAlreadyParentedByUIKit',
    );
    expect(stackSource).toContain("valueForKey('parentViewController')");
    expect(stackSource).toContain("performSelector('parentViewController')");
    expect(stackSource).toContain(
      'function viewControllerHasWindowAttachedView',
    );
    expect(stackSource).toContain('function viewControllerIsRootContained');
    expect(stackSource).toContain(
      'function viewControllerHasNativeScriptScreensOwnership',
    );
    expect(stackSource).toContain(
      'function viewControllerIsAttachableScreensParent',
    );
    expect(stackSource).toContain(
      'viewControllerIsAttachableScreensParent(viewController)',
    );
    expect(stackSource).toContain(
      'explicit RNSScreen/RNSTabs ownership and a window-attached view is the',
    );
    expect(stackSource).toContain(
      'Plain UIKit wrapper controllers are rejected',
    );
    expect(stackSource).toContain(
      'function controllerHasKnownRootContainedParent',
    );
    expect(stackSource).toContain('function setKnownRootContainedParent');
    expect(stackSource).toContain(
      "const RECONCILE_SELECTED_TAB_CONTROLLER_VIEW_KEY =\n  '__rnsNativeScriptReconcileSelectedTabControllerView';",
    );
    expect(stackSource).toContain(
      'function scheduleContainingTabControllerReconcile',
    );
    const contentReadyContainingTabSource = stackSource.slice(
      stackSource.indexOf(
        'function reconcileContainingTabControllerFromStackContent',
      ),
      stackSource.indexOf(
        'export function notifyNativeScriptScreenContentWrapperFrame',
      ),
    );
    const scheduledContainingTabSource = stackSource.slice(
      stackSource.indexOf('function scheduleContainingTabControllerReconcile'),
      stackSource.indexOf('function emitTransitionProgress'),
    );
    const hostReadyContainmentSource = stackSource.slice(
      stackSource.indexOf('function refreshStackContainmentFromHostReady'),
      stackSource.indexOf(
        'export function notifyNativeScriptScreenContentWrapperFrame',
      ),
    );
    const contentWrapperHostReadySource = stackSource.slice(
      stackSource.indexOf(
        'export function nativeScriptScreenContentWrapperHostReadyOnUI',
      ),
      stackSource.indexOf(
        'export function notifyNativeScriptScreenContentWrapperHostReady',
      ),
    );
    expect(
      stackSource.indexOf('function refreshStackContainmentFromHostReady'),
    ).toBeLessThan(
      stackSource.indexOf(
        'export function nativeScriptScreenContentWrapperHostReadyOnUI',
      ),
    );
    expect(contentWrapperHostReadySource).toContain(
      'refreshStackContainmentFromHostReady(',
    );
    expect(contentWrapperHostReadySource).not.toContain(
      'refreshStackContainmentFromLifecycle(',
    );
    expect(hostReadyContainmentSource).toContain(
      '[LAYOUT_NAVIGATION_STACK_VIEWS_KEY]',
    );
    expect(hostReadyContainmentSource).not.toContain(
      'layoutNavigationStackViews(stack);',
    );
    expect(stackSource).toMatch(
      /const stackNavigationController\s*=\s*nativeScriptStackNavigationController\(view\);/,
    );
    expect(stackSource).toContain(
      "const stackNativeKey =\n      typeof stackId === 'string' ? registry.stackNativeKeys[stackId] : '';",
    );
    expect(stackSource).toContain('const stackTransitionToken =');
    expect(stackSource).toContain('registry.stackTransitionTokens[stackId]');
    expect(stackSource).toContain(
      'parentViewControllerForController(stackNavigationController)',
    );
    expect(stackSource).toContain('viewLayoutKey(stackNavigationView)');
    expect(stackSource).toContain(
      'restoreVisibleNavigationControllerInteractivity(\n' +
        '          stackNavigationController,\n' +
        '          registry,\n' +
        '        );',
    );
    expect(
      stackSource.indexOf(
        'restoreVisibleNavigationControllerInteractivity(\n' +
          '          stackNavigationController,\n' +
          '          registry,\n' +
          '        );',
      ),
    ).toBeLessThan(
      stackSource.indexOf(
        'if (view.__nativeScriptContainingTabReconcileKey === reconcileKey)',
      ),
    );
    expect(scheduledContainingTabSource).toContain(
      'const notifyContainingTabAccessibilityLayoutChanged = (targetView: any) => {',
    );
    expect(scheduledContainingTabSource).toContain(
      'notifyContainingTabAccessibilityLayoutChanged(selectedView);',
    );
    expect(scheduledContainingTabSource).toContain(
      'notifyContainingTabAccessibilityLayoutChanged(tabController.view);',
    );
    expect(scheduledContainingTabSource).toContain(
      'const publishSelectedTabAccessibility = (globalThis as Record<string, any>)[',
    );
    expect(scheduledContainingTabSource).toContain(
      'PUBLISH_SELECTED_TAB_ACCESSIBILITY_KEY',
    );
    expect(scheduledContainingTabSource).toContain(
      'callWorkletFunction(\n' +
        '          publishSelectedTabAccessibility,\n' +
        '          tabController,\n' +
        '          selectedController,\n' +
        '          stackNavigationController,\n' +
        '        );',
    );
    expect(
      scheduledContainingTabSource.indexOf(
        'notifyContainingTabAccessibilityLayoutChanged(selectedView);',
      ),
    ).toBeLessThan(
      scheduledContainingTabSource.indexOf(
        'if (view.__nativeScriptContainingTabReconcileKey === reconcileKey)',
      ),
    );
    expect(
      scheduledContainingTabSource.indexOf(
        'callWorkletFunction(\n' +
          '          publishSelectedTabAccessibility,\n' +
          '          tabController,\n' +
          '          selectedController,\n' +
          '          stackNavigationController,\n' +
          '        );',
      ),
    ).toBeLessThan(
      scheduledContainingTabSource.indexOf(
        'if (view.__nativeScriptContainingTabReconcileKey === reconcileKey)',
      ),
    );
    expect(stackSource).toContain('stackNavigationView?.setNeedsLayout?.();');
    expect(stackSource).toContain('view.setNeedsLayout?.();');
    expect(stackSource).not.toContain(
      'layoutNavigationStackViews(stackNavigationController);',
    );
    expect(stackSource).toContain(
      'current.__rnsNativeScriptTabsSelectedController ??',
    );
    expect(stackSource).toContain('current.__rnsNativeScriptTabsController ??');
    expect(stackSource).toContain(
      'function containingTabBarControllerForController',
    );
    expect(stackSource).toContain(
      'containingTabBarControllerForController(associatedSelectedController)',
    );
    expect(stackSource).toContain(
      'containingTabBarControllerForController(ownerController)',
    );
    expect(contentReadyContainingTabSource).toContain(
      'publishContainingTabAccessibilityFromStack(',
    );
    expect(scheduledContainingTabSource).toContain(
      'publishContainingTabAccessibilityFromStack(',
    );
    expect(
      contentReadyContainingTabSource.indexOf(
        'publishContainingTabAccessibilityFromStack(',
      ),
    ).toBeLessThan(
      contentReadyContainingTabSource.indexOf(
        'if (shouldDeferFullReconcile || typeof reconcile !==',
      ),
    );
    expect(
      scheduledContainingTabSource.indexOf(
        'publishContainingTabAccessibilityFromStack(',
      ),
    ).toBeLessThan(
      scheduledContainingTabSource.indexOf(
        'if (view.__nativeScriptContainingTabReconcileKey === reconcileKey)',
      ),
    );
    expect(contentReadyContainingTabSource).toContain(
      "const transitionTokenKey =\n        typeof stackTransitionToken === 'number'\n          ? '' + stackTransitionToken\n          : '';",
    );
    expect(scheduledContainingTabSource).toContain(
      "const transitionTokenKey =\n        typeof stackTransitionToken === 'number'\n          ? '' + stackTransitionToken\n          : '';",
    );
    expect(scheduledContainingTabSource).toContain(
      'presentedModalIdsForStack(stackId, registry).length > 0',
    );
    expect(scheduledContainingTabSource).toContain(
      "'tab-reconcile-skip-presented-modal'",
    );
    expect(
      scheduledContainingTabSource.indexOf(
        'presentedModalIdsForStack(stackId, registry).length > 0',
      ),
    ).toBeLessThan(
      scheduledContainingTabSource.indexOf('callWorkletFunction(reconcile'),
    );
    expect(scheduledContainingTabSource).not.toContain(
      'reconcile(tabController, selectedController);',
    );
    expect(contentReadyContainingTabSource).not.toContain('String(');
    expect(scheduledContainingTabSource).not.toContain('String(');
    expect(contentReadyContainingTabSource).not.toContain("].join('|')");
    expect(scheduledContainingTabSource).not.toContain("].join('|')");
    expect(stackSource).toContain('__nativeScriptAlreadyParentedByUIKit');
    expect(stackSource).toContain('interopObject.getAssociatedObject');
    expect(stackSource).toContain('interopObject.setAssociatedObject');
    expect(stackSource).toContain("'assign'");
    expect(stackSource).toContain(
      'currentController = parentViewControllerForController(currentController);',
    );
    expect(stackSource).toContain(
      'nativeObjectsEqual(currentController, rootController)',
    );
    expect(stackSource).toContain(
      'NATIVESCRIPT_PORT_DEVIATION: upstream can trust direct ObjC',
    );
    expect(stackSource).toContain('let currentResponder = controller.view;');
    expect(stackSource).toContain(
      'currentResponder = nextResponderForObject(currentResponder);',
    );
    expect(stackSource).toContain(
      'function closestAttachableViewControllerForHostView',
    );
    expect(stackSource).toContain('__nativeScriptOwningViewController');
    expect(attachSource).toContain(
      'const existingParentController =\n    nearestParentControllerForControllerView(controller);',
    );
    expect(attachSource).toMatch(
      /const hostViewController\s*=\s*closestAttachableViewControllerForHostView\(stackView\);/,
    );
    expect(
      attachSource.indexOf(
        'const currentParent = parentViewControllerForController(controller);',
      ),
    ).toBeLessThan(attachSource.indexOf('const existingParentController'));
    expect(attachSource.indexOf('const modalContentParent =')).toBeLessThan(
      attachSource.indexOf(
        'const currentParent = parentViewControllerForController(controller);',
      ),
    );
    expect(attachSource.indexOf('const existingParentController')).toBeLessThan(
      attachSource.indexOf('const hostViewController'),
    );
    expect(attachSource).toContain(
      'let parentView = nextReactSuperviewForView(stackView);',
    );
    expect(attachSource).toContain(
      'Walk reactSuperview when present and fall back to UIKit superview',
    );
    expect(attachSource).toContain(
      'closestAttachableViewControllerForHostView(parentView)',
    );
    expect(stackSource).toContain('function addSubviewIfNotSelf');
    expect(stackSource).toContain(
      'function attachControllerToParentViewController',
    );
    expect(stackSource).toContain('function parentControllerViewContainsView');
    expect(stackSource).toContain(
      'const parentContainsStackView = parentControllerViewContainsView',
    );
    expect(stackSource).toContain('if (!parentContainsStackView)');
    expect(stackSource).toContain(
      'function hiddenAncestorBetweenViewAndAncestor',
    );
    expect(stackSource).toContain('function viewIsDescendantOfView');
    expect(stackSource).toContain(
      'function navigationControllerHostsControllerViews',
    );
    expect(stackSource).toContain(
      'const topController = controllers[controllers.length - 1];',
    );
    expect(stackSource).toContain(
      'const controllerView = screenControllerView(topController);',
    );
    expect(stackSource).toContain(
      'const controllerWindow = controllerView?.window;',
    );
    expect(stackSource).toContain(
      'const navigationWindow = navigationView.window;',
    );
    expect(stackSource).toContain('const windowsAreCompatible =');
    expect(stackSource).toContain(
      '(controllerWindow == null && navigationWindow == null) || hasSameWindow',
    );
    expect(stackSource).toContain(
      'nativeObjectsEqual(controllerWindow, navigationWindow)',
    );
    expect(stackSource).not.toContain('controllerWindow !== navigationWindow');
    expect(stackSource).toContain(
      'function detachControllerViewsFromStaleNavigationMount',
    );
    expect(stackSource).toContain(
      'function repairNavigationControllerViewHostingIfNeeded',
    );
    expect(stackSource).toContain(
      'function navigationControllerNeedsViewHostingRepair',
    );
    expect(stackSource).not.toContain('stackContainmentRefreshTokens');
    expect(stackSource).not.toContain('stackNavigationHostingRepairScheduled');
    expect(stackSource).toContain(
      'function refreshStackContainmentFromLifecycle',
    );
    expect(stackSource).not.toContain(
      'function scheduleStackContainmentRefresh',
    );
    expect(stackSource).not.toContain('setTimeout(refresh');
    expect(stackSource).toContain(
      'refreshStackContainmentFromLifecycle(\n      props.stackId,\n      registry,\n      ctx,\n      controller,\n      false,',
    );
    expect(stackSource).toContain(
      'const didAttach = reactAddControllerToClosestParent(stackView, stack);',
    );
    expect(stackSource).toContain(
      'function navigationControllerCanRepairViewHosting',
    );
    expect(stackSource).not.toContain(
      'function scheduleNavigationControllerViewHostingRepair',
    );
    expect(stackSource).toContain(
      'return navigationController?.view?.window != null;',
    );
    expect(stackSource).toContain('parentViewController resolves through');
    expect(stackSource).toContain(
      'root-contained navigation controller can finish that pop',
    );
    expect(stackSource).toContain(
      'if (!navigationControllerCanRepairViewHosting(navigationController))',
    );
    expect(stackSource).toContain(
      'if (navigationControllerIsTransitioning(navigationController))',
    );
    expect(stackSource).toContain(
      "!isNativeKindOfClass(navigationController, 'UINavigationController')",
    );
    expect(stackSource).toContain(
      'navigationControllerIsTransitioning(navigationController)',
    );
    expect(stackSource).toContain(
      'const isTransitioning =\n' +
        '    navigationControllerIsTransitioning(navigationController);',
    );
    expect(stackSource).toContain(
      'const canLayoutModalContentDuringPresentation =\n' +
        '    isTransitioning &&',
    );
    expect(stackSource).toContain(
      'const shouldForceCompletedNativeDismissLayout =\n' +
        "    reason === 'native-back-gesture-dismissed' ||\n" +
        "    reason === 'restore-stack-after-native-dismissal';",
    );
    expect(stackSource).toContain(
      'const shouldUseNativeTransitionLayout =\n' +
        '    !shouldForceCompletedNativeDismissLayout &&\n' +
        '    ((isTransitioning && !canLayoutModalContentDuringPresentation) ||\n' +
        '      hasPendingRegistryUpdate);',
    );
    expect(stackSource).toContain('if (!shouldUseNativeTransitionLayout)');
    expect(stackSource).not.toContain('setTimeout(repair');
    expect(
      stackSource.indexOf(
        'function repairNavigationControllerViewHostingIfNeeded',
      ),
    ).toBeLessThan(stackSource.indexOf('function layoutNavigationStackViews'));
    expect(stackSource).toContain(
      'NATIVESCRIPT_PORT_DEVIATION: upstream RNSScreenStackView owns React',
    );
    expect(stackSource).toContain(
      'repairNavigationControllerViewHostingIfNeeded(navigationController);',
    );
    expect(stackSource).toContain(
      'navigationControllerNeedsViewHostingRepair(navigationController)',
    );
    expect(stackSource).toContain(
      'navigationControllerHostsControllerViews(\n          navigationController,\n          controllers,',
    );
    expect(stackSource).toContain(
      'const isTopController = index === count - 1;',
    );
    expect(stackSource).toContain(
      '(isTopController && !screenContentIsReady(screenId, registry))',
    );
    expect(stackSource).toContain(
      'const placeholder = createPlaceholderViewController();',
    );
    expect(stackSource).toContain(
      'function rehostNavigationControllerViewControllers',
    );
    expect(stackSource).toContain(
      'rehostNavigationControllerViewControllers(navigationController, controllers);',
    );
    expect(stackSource).toContain('function canInvokeNativeSelector');
    expect(stackSource).toContain('.invokeObjCSelector');
    expect(stackSource).toContain('const invoke = target.invoke;');
    expect(stackSource).toContain(
      'return target.invoke(selectorName, ...args);',
    );
    expect(stackSource.indexOf('const invoke = target.invoke;')).toBeLessThan(
      stackSource.indexOf(
        'const invokeObjCSelector = (NativeScriptRuntime as Record<string, any>)',
      ),
    );
    expect(stackSource).not.toContain('target[selectorName]');
    expect(stackSource).toContain("'setViewControllers:animated:'");
    expect(stackSource).toContain(
      'invokeNativeSelector(\n' +
        '      navigationController,\n' +
        "      'setViewControllersAnimated',\n" +
        "      'setViewControllers:animated:',\n" +
        '      nativeControllers,\n' +
        '      false,\n' +
        '    );',
    );
    expect(stackSource).toContain(
      'detachControllerViewsFromStaleNavigationMount(\n        navigationController,\n        controllers,',
    );
    expect(stackSource).toContain(
      'try {\n      return NSArray.arrayWithArray(values);\n    } catch (_error) {\n      return values;\n    }',
    );
    expect(stackSource).toContain(
      '// NATIVESCRIPT_PORT_DEVIATION: upstream UINavigationController rehosts the',
    );
    expect(stackSource).toContain('controllerView.removeFromSuperview?.();');
    expect(stackSource).toContain(
      'const targetParentIsRootContained =\n    viewControllerIsRootContained(parentViewController);',
    );
    expect(stackSource).toContain(
      'controllerHasKnownRootContainedParent(\n' +
        '      controller,\n' +
        '      currentParent,\n' +
        '    )',
    );
    expect(stackSource).toContain('function clearKnownControllerParentProof');
    expect(stackSource).toContain('function markControllerParentProof');
    expect(stackSource).toContain(
      'clearKnownControllerParentProof(controller);',
    );
    expect(stackSource).toContain(
      'markControllerParentProof(controller, parentViewController);',
    );
    expect(stackSource).toMatch(
      /controllerView === stackView\s*\|\|\s*nativeObjectsEqual\(controllerView, stackView\)/,
    );
    expect(stackSource).toContain(
      'parentViewController.addChildViewController(controller);',
    );
    expect(stackSource).toContain(
      'didMutate = addSubviewIfNotSelf(stackView, controllerView) || didMutate;',
    );
    expect(stackSource).toContain(
      'typeof controller.didMoveToParentViewController ===',
    );
    expect(stackSource).toContain(
      'controller.didMoveToParentViewController(parentViewController);',
    );
    expect(attachSource).not.toContain('topMostPresentedViewControllerFrom(');
    expect(attachSource).toContain('return false;');
    expect(attachSource).toContain(
      'const nextParentView = nextReactSuperviewForView(parentView);',
    );
    expect(stackSource).toContain(
      'function maybeAddStackControllerToParentAndUpdateContainer',
    );
    expect(stackSource).toContain('reconcileWhenAlreadyMounted = true');
    expect(stackSource).toContain('attachControllerToParent={false}');
    expect(stackSource).not.toContain(
      'detachControllersFromWrongNavigationParent',
    );
    expect(stackSource).toContain(
      'const reconcileStackFromRegistry = (globalThis as Record<string, any>)[\n    RECONCILE_STACK_KEY\n  ];',
    );
    expect(stackSource).toContain('const hasPendingNativeModel =');
    expect(stackSource).toContain(
      '(didRepairContainment || hasPendingNativeModel) &&',
    );
    expect(stackSource).toContain(
      'navigationControllerCanApplyStackModel(\n      navigationController,\n      registry,',
    );
    expect(stackSource).toContain('callWorkletFunction(');
    expect(stackSource).toContain('reconcileStackFromRegistry,');
    expect(stackSource).not.toContain(
      'reconcileStackFromRegistry(stackId, registry, ctx, true);',
    );
    expect(stackContainerSource).toContain('didMoveToWindow()');
    expect(stackContainerSource).toContain('layoutSubviews()');
    expect(stackContainerSource).toContain(
      'maybeAddStackControllerToParentAndUpdateContainer(',
    );
    expect(stackContainerSource).toContain(
      'navigationController,\n        false,',
    );
    const stackLayoutSource = stackContainerSource.slice(
      stackContainerSource.indexOf('layoutSubviews()'),
      stackContainerSource.indexOf('hitTestWithEvent(point: any, event: any)'),
    );
    expect(stackLayoutSource).toContain('this.super?.layoutSubviews?.();');
    expect(stackLayoutSource).toContain(
      'setViewFrameIfNeeded(navigationView, this.bounds);',
    );
    expect(stackLayoutSource).not.toContain(
      'maybeAddStackControllerToParentAndUpdateContainer(',
    );
    expect(stackLayoutSource).not.toContain(
      'scheduleContainingTabControllerReconcile(this);',
    );
    expect(stackContainerSource).toContain(
      'scheduleContainingTabControllerReconcile(this);',
    );
    expect(stackContainerSource).not.toContain(
      'layoutNavigationStackViews(navigationController);',
    );
    expect(stackSource).toContain(
      'setNativeScriptStackId(controller, ctx.props.stackId)',
    );
    expect(stackSource).toContain('attachControllerToParent={false}');
    expect(stackSource).not.toContain(
      'detachControllersFromWrongNavigationParent',
    );
    expect(stackSource).toMatch(
      /reactAddControllerToClosestParent\(\s*stackContainerView,\s*controller\s*\)/,
    );
  });

  it('rejects plain window-attached UIKit wrappers as stack parents', () => {
    const plainWrapperController = {
      view: { window: {} },
      addChildViewController: jest.fn(),
    };
    const screenController = {
      __nativeScriptScreenId: 'screen-a',
      view: { window: {} },
      addChildViewController: jest.fn(),
    };
    const tabsOwnedController = {
      view: {
        window: {},
        __rnsNativeScriptTabsController: {},
      },
      addChildViewController: jest.fn(),
    };
    const associatedScreenController = {
      view: { window: {} },
      addChildViewController: jest.fn(),
    };
    const previousInterop = (global as Record<string, unknown>).interop;
    (global as Record<string, unknown>).interop = {
      getAssociatedObject: jest.fn((object, key) =>
        object === associatedScreenController &&
        key === 'react-native-screens.NativeScriptScreenController'
          ? associatedScreenController
          : null,
      ),
    };

    try {
      expect(
        __nativeScriptViewControllerIsAttachableScreensParentForTests(
          plainWrapperController,
        ),
      ).toBe(false);
      expect(
        __nativeScriptViewControllerIsAttachableScreensParentForTests(
          screenController,
        ),
      ).toBe(true);
      expect(
        __nativeScriptViewControllerIsAttachableScreensParentForTests(
          tabsOwnedController,
        ),
      ).toBe(true);
      expect(
        __nativeScriptViewControllerIsAttachableScreensParentForTests(
          associatedScreenController,
        ),
      ).toBe(true);
    } finally {
      (global as Record<string, unknown>).interop = previousInterop;
    }
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
    const navigationItem: any = {};
    const navigationController: any = {
      navigationBar,
      view: { autoresizingMask: 0 },
      viewControllers: [
        {
          __nativeScriptScreenId: 'screen-a',
          navigationItem,
          view: { autoresizingMask: 0 },
        },
      ],
    };

    __nativeScriptConfigureNavigationAppearanceForTests(
      navigationController,
      {},
      {},
    );

    expect(navigationItem.standardAppearance.backIndicatorImage).toBe(
      backImage,
    );
    expect(
      navigationItem.standardAppearance.backIndicatorTransitionMaskImage,
    ).toBe(backImage);
    expect(
      navigationItem.standardAppearance
        .setBackIndicatorImageTransitionMaskImage,
    ).toHaveBeenCalledWith(backImage, backImage);
    expect(navigationItem.scrollEdgeAppearance.backIndicatorImage).toBe(
      backImage,
    );

    __nativeScriptUnregisterHeaderSubviewForTests('screen-a', 'back');
    __nativeScriptConfigureNavigationAppearanceForTests(
      navigationController,
      {},
      {},
    );

    expect(navigationItem.standardAppearance.backIndicatorImage).toBe(null);
    expect(
      navigationItem.standardAppearance.backIndicatorTransitionMaskImage,
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
    const renderedStackSource = stackSource.slice(
      stackSource.indexOf('<NativeScriptStackController'),
      stackSource.indexOf('</NativeScriptStackController>'),
    );
    const animatePopSource = stackSource.slice(
      stackSource.indexOf('function animateStackPop'),
      stackSource.indexOf('function refreshStackContainmentFromLifecycle'),
    );

    expect(renderedStackSource).toContain('immediateTransactionCommit');
    expect(renderedStackSource).toContain(
      'disableUIKitHostWindowAttachRefresh',
    );
    expect(renderedStackSource).toContain('attachControllerView');
    expect(renderedStackSource).toContain('attachControllerToParent');
    expect(renderedStackSource).toContain('attachNativeView');
    expect(renderedStackSource).toContain(
      'externalDetachedChildrenOwner={false}',
    );
    expect(renderedStackSource).toContain(
      'disableDetachedChildrenTouchHandler={false}',
    );
    expect(renderedStackSource).toContain(
      'preserveDetachedChildrenLayout={false}',
    );
    expect(stackSource).toContain("'pushViewController:animated:'");
    expect(stackSource).toContain('const finishPostPushViewHosting = () => {');
    expect(stackSource).toContain(
      'runAfterTransitionCoordinator(parent, finishPostPushViewHosting)',
    );
    expect(stackSource).toContain(
      'runAfterTransitionCoordinator(controller, finishPostPushViewHosting)',
    );
    expect(stackSource).toContain('finishPostPushViewHosting();');
    expect(stackSource).toContain(
      'function repairNavigationControllerViewHostingAfterTransition',
    );
    expect(stackSource).toContain(
      'repairNavigationControllerViewHostingAfterTransition(parent);',
    );
    expect(stackSource).toContain(
      'runAfterTransitionCoordinator(navigationController, repair)',
    );
    expect(stackSource).toContain(
      'configureStackControllers(target.availableIds, registry, false, false);',
    );
    expect(stackSource).toContain(
      'if (stackId && registry.stackTransitioning[stackId] === true) {\n' +
        '      return;\n' +
        '    }',
    );
    expect(stackSource).toContain(
      'if (needsHostingRepair) {\n' +
        '      repairNavigationControllerViewHostingIfNeeded(navigationController);\n' +
        '    }\n\n' +
        '    if (\n' +
        '      navigationStackHasStableReadyContent(navigationController, registry) ||\n' +
        '      navigationStackTopScreenHasReadyContent(navigationController, registry)\n' +
        '    ) {',
    );
    expect(stackSource).toContain(
      'restoreVisibleNavigationControllerInteractivity(\n' +
        '        navigationController,\n' +
        '        registry,\n' +
        '        true,\n' +
        '      );',
    );
    expect(stackSource).toContain(
      "layoutNavigationStackViews(navigationController, 'post-transition-repair');\n" +
        '    if (\n' +
        '      !navigationStackHasStableReadyContent(navigationController, registry) &&\n' +
        '      !navigationStackTopScreenHasReadyContent(navigationController, registry)\n' +
        '    ) {\n' +
        '      refreshNavigationControllerHostedViews(navigationController);\n' +
        '    }',
    );
    expect(stackSource).toContain('const shouldRepairOffTopHostedSubviews =');
    expect(stackSource).toContain(
      'const shouldRepairOffTopHostedSubviews =\n' +
        '      !isTopController && !contentIsReady;',
    );
    expect(stackSource).toContain(
      '(isTopController || shouldRepairOffTopHostedSubviews)',
    );
    expect(stackSource.indexOf("'pushViewController:animated:'")).toBeLessThan(
      stackSource.indexOf(
        'runAfterTransitionCoordinator(parent, finishPostPushViewHosting)',
      ),
    );
    expect(
      stackSource.indexOf(
        'runAfterTransitionCoordinator(parent, finishPostPushViewHosting)',
      ),
    ).toBeLessThan(
      stackSource.indexOf(
        'repairNavigationControllerViewHostingAfterTransition(parent);',
      ),
    );
    expect(stackSource).toContain("'setViewControllers:animated:'");
    expect(animatePopSource).toMatch(
      /invokeNativeSelector\(\s*parent,\s*'setViewControllersAnimated',\s*'setViewControllers:animated:',\s*createArray\(\[\.\.\.controllers, previousTopController\]\),\s*false/,
    );
    expect(animatePopSource).toContain("'popViewControllerAnimated:'");
    expect(animatePopSource).not.toContain('popToRootViewControllerAnimated');
    expect(animatePopSource).not.toContain('popToViewControllerAnimated');
  });

  it('uses upstream-shaped transaction ordering for NativeScript RNS component-view stand-ins', () => {
    const renderedStackSource = stackSource.slice(
      stackSource.indexOf('<NativeScriptStackController'),
      stackSource.indexOf('</NativeScriptStackController>'),
    );
    const renderedContainerScreenSource = stackSource.slice(
      stackSource.indexOf('activityState={resolvedActivityState}'),
      stackSource.indexOf('{children}\n      </NativeScriptScreenController>'),
    );
    const renderedStackItemSource = stackSource.slice(
      stackSource.indexOf('accessibilityElementsHidden={accessibilityHidden}'),
      stackSource.indexOf('{content}\n    </NativeScriptScreenController>'),
    );
    const headerConfigHostTransactionSource =
      screenStackHeaderConfigSource.slice(
        screenStackHeaderConfigSource.indexOf(
          'transactionCommitted(view, props)',
        ),
        screenStackHeaderConfigSource.indexOf(
          'const NativeScriptHeaderSubviewHost',
        ),
      );

    expect(renderedStackSource).toContain('immediateTransactionCommit');
    expect(renderedContainerScreenSource).toContain(
      'immediateTransactionCommit',
    );
    expect(renderedContainerScreenSource).toContain(
      'disableUIKitHostWindowAttachRefresh',
    );
    expect(renderedStackItemSource).toContain('immediateTransactionCommit');
    expect(renderedStackItemSource).toContain(
      'disableUIKitHostWindowAttachRefresh',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'transactionCommitted(view, props)',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'setNativeScriptHeaderSubviewExpectedCount(',
    );
    expect(headerConfigHostTransactionSource).not.toContain(
      'notifyNativeScriptHeaderSubviewChanged(props.screenId);',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'screenId={nativeScriptScreenId}',
    );
    expect(screenStackHeaderConfigSource).toContain(
      'immediateTransactionCommit',
    );
    expect(screenContentWrapperSource).toContain(
      'transactionCommitted(view, props)',
    );
    expect(screenContentWrapperSource).toContain('immediateTransactionCommit');
    expect(screenContentWrapperSource).not.toContain(
      'syncCollectedNativeScriptScreenContentChildren(view)',
    );
    expect(screenContentWrapperSource).not.toContain(
      'preserveDetachedChildrenLayout',
    );
    expect(screenContentWrapperSource).toContain(
      'layoutNativeScriptScreenContentWrapper(view, props, true, true);',
    );
    expect(screenContentWrapperSource).toContain(
      'layoutNativeScriptScreenContentWrapper(view, props, false, false, false);',
    );
    const nativeContentWrapperSource = stackSource.slice(
      stackSource.indexOf('export const NativeScriptScreenContentWrapper'),
      stackSource.indexOf('const NativeScriptScreenController'),
    );
    const nativeContentWrapperMountedSource = nativeContentWrapperSource.slice(
      nativeContentWrapperSource.indexOf('mounted(view, props)'),
      nativeContentWrapperSource.indexOf('update(view, props)'),
    );
    const nativeContentWrapperUpdateSource = nativeContentWrapperSource.slice(
      nativeContentWrapperSource.indexOf('update(view, props)'),
      nativeContentWrapperSource.indexOf('transactionCommitted(view, props)'),
    );
    expect(nativeContentWrapperMountedSource).toContain(
      'publishNativeScriptScreenContentWrapperHostReady(',
    );
    expect(nativeContentWrapperUpdateSource).toContain(
      'publishNativeScriptScreenContentWrapperHostReady(',
    );
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

  it('matches upstream stack-animation aliases before choosing a custom animator', () => {
    const customAnimationSource = stackSource.slice(
      stackSource.indexOf('function isCustomStackAnimation'),
      stackSource.indexOf('function statusBarAnimationValue'),
    );
    const animationDelegateSource = stackSource.slice(
      stackSource.indexOf(
        'navigationControllerAnimationControllerForOperationFromViewControllerToViewController',
      ),
      stackSource.indexOf(
        'navigationControllerInteractionControllerForAnimationController',
      ),
    );

    expect(customAnimationSource).toContain(
      "animation === 'ios_from_right' || animation === 'slide_from_right'",
    );
    expect(customAnimationSource).toContain("? 'default'");
    expect(customAnimationSource).toContain("animation === 'ios_from_left'");
    expect(customAnimationSource).toContain("? 'slide_from_left'");
    expect(customAnimationSource).toContain(
      "resolvedAnimation !== 'default' && resolvedAnimation !== 'flip'",
    );
    expect(animationDelegateSource).toContain(
      '!isCustomStackAnimation(animation)',
    );
    expectSourceToContain(
      animationDelegateSource,
      'const gestureDrivenPop =\n          isPopOperation(operation) &&',
    );
    expect(animationDelegateSource).toContain('return null;');
  });

  it('requires UIViewPropertyAnimator instead of silently falling back for custom stack animations', () => {
    const propertyAnimatorSource = stackSource.slice(
      stackSource.indexOf('function createPropertyAnimator'),
      stackSource.indexOf('function runTransitionAnimation'),
    );
    const fadeFromBottomSource = stackSource.slice(
      stackSource.indexOf('function animateFadeFromBottomTransition'),
      stackSource.indexOf('function animateNoneTransition'),
    );

    expect(stackSource).toContain(
      'UIViewPropertyAnimator is required for RNSScreenStackAnimator parity',
    );
    expect(propertyAnimatorSource).toContain('startAnimationAfterDelay');
    expect(fadeFromBottomSource).toContain(
      "curve: viewAnimationCurve('Linear', 3)",
    );
    expect(fadeFromBottomSource).toContain(
      'RNS_FADE_CLOSE_DELAY_TRANSITION_DURATION_PROPORTION',
    );
    expect(fadeFromBottomSource).not.toContain('setTimeout(');
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
      'upstream assigns ObjC properties from native\n  // code',
      'iOS 26 exposes UINavigationItem.largeTitle\n  // separately from title',
      'upstream just skips assigning a custom\n      // item. The TS port clears only the item it owns',
      'upstream self-targets RNSBarButtonItem and\n    // invokes a stored ObjC block',
      'Upstream RNSScreenStackHeaderSubview wraps left/right custom views on iOS',
      'upstream also mirrors UINavigationBar layout\n  // into RNSScreenStackHeaderConfig',
      'upstream calls\n  // screenView.reactSuperview.updateContainer() from RNSScreen.mm here',
      'upstream re-applies the fromVC config if the\n    // transition is cancelled',
      'React owns child element lifetime in the TS\n  // port',
      'upstream re-reads from/to views from\n        // transitionCoordinator',
      'upstream receives the exact\n          // RNSScreen controller in didShow',
      'upstream RNSScreenContentWrapper is a native\n  // component view under the same UIKit hit-test tree',
      'upstream RNSScreenContentWrapper is always a\n    // native subview of RNSScreen.view',
      'upstream RNSScreenContentWrapper is a native\n  // UIKit/Fabric component whose ancestors already have coherent bounds during',
      'upstream can trust direct ObjC\n  // parentViewController identity here',
      "upstream's closest React view controller\n      // comes from ObjC `reactViewController`",
      'upstream RNSScreenStackView is itself a React\n  // native view',
      'upstream receives one ObjC controller identity\n  // through direct containment',
      'upstream reads parentViewController directly\n  // from ObjC',
      'when NativeScript hosts the stack in a\n      // plain UIKit hostView(controller)',
      'NativeScript can expose the same UIView\n      // through distinct JS proxies',
      'upstream UINavigationController keeps its\n    // UINavigationBar above managed route content internally',
      'upstream UIKit observes RNSScreenStackView\n  // safe-area changes through one ObjC object identity',
      'upstream does not need a cleanup path here\n  // because RNSScreen is parented before UIKit computes ScrollView safe-area',
      'upstream never writes a manual\n    // UIScrollView.contentInset before the screen is parented',
      "upstream UINavigationController propagates\n  // the nav bar's adjusted top safe area to its RNSScreen child naturally",
      "upstream's RNSScreen view stays in the\n  // UINavigationController hierarchy while UIKit dismisses modals",
      'upstream lets UINavigationController own\n        // z-order between screen content and UINavigationBar',
      'upstream returns from `finish` without\n    // presenting when the change-root controller is detached',
      'upstream RNSScreenStackView is the live ObjC\n  // stack view',
      'parent lookup must start from the attached\n    // UIKit presenter view',
      'upstream updateContainer receives current\n      // RNSScreen children before filtering removed native controllers',
      'upstream calls an ObjC category that\n      // already knows about RCTSurfaceTouchHandler',
      'upstream owns the touch handler directly on\n  // RNSScreenView',
      'upstream RNSScreenStackView owns native\n    // RNSScreenView removal directly',
      'upstream RNSScreenStackView and\n        // UIKit-owned presentation controllers share one native view tree',
      'upstream RNSScreen.view is a real Fabric\n    // component view',
      'upstream RNSScreenStackView owns React\n      // screen subviews directly',
      'NativeScript can expose a windowed\n    // UINavigationController view before parentViewController resolves through',
      'upstream UINavigationController rehosts the\n  // visible RNSScreen.view during an interactive native pop',
      "UIKit's snapshot is only a transition\n      // placeholder",
      'upstream setViewToSnapshot replaces\n      // RNSScreen.view only while a native-owned removal is in flight',
      'upstream defaults afterScreenUpdates to\n      // false unless RNSScreen.snapshotAfterUpdates is set',
      'upstream Fabric unmount calls\n  // RNSScreenStackView::unmountChildComponentView',
      'upstream Fabric unmount calls\n  // RNSScreenController.setViewToSnapshot before removing the screen component',
      'generated ObjC props carry default\n    // `automatic` edge values',
      'upstream receives the\n    // RNSScreenContentWrapper component view directly from Fabric mount',
    ];

    expect(
      nativeStackSources.match(/NATIVESCRIPT_PORT_DEVIATION:/g) ?? [],
    ).toHaveLength(expectedDeviationReasons.length);

    for (const reason of expectedDeviationReasons) {
      expectSourceToContain(
        nativeStackSources,
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
    expect(stackSource).toContain(
      'function nativeContentPopGestureInteropEnabled',
    );
    expect(stackSource).toContain(
      '__NSRNS_ENABLE_NATIVE_CONTENT_POP_GESTURE',
    );
    expectSourceToContain(
      stackSource,
      'nativeContentPopGestureInteropEnabled() &&\n    contentGesture &&\n    !nativeObjectsEqual(contentGesture, popGesture)',
    );
    expect(stackSource).toContain('function retainGestureRecognizerDelegate');
    expect(stackSource).toContain(
      'gesture.__nativeScriptStackBackGestureDelegate = delegate;',
    );
    expect(stackSource).toContain('ctx?.retain?.(delegate);');
    expectSourceToContain(
      stackSource,
      "assignTo: {\n      object: gesture,\n      property: 'delegate',",
    );
    expect(stackSource).not.toContain('gesture.delegate = delegate;');
  });

  it('keeps UIKit-owned back-swipe recognizers delegate-only like upstream RNS', () => {
    expectSourceToContain(
      stackSource,
      "const shouldInstallGestureAction =\n    gestureKind === 'custom-edge' || gestureKind === 'custom-pan';",
    );
    expectSourceToContain(
      stackSource,
      "if (\n    shouldInstallGestureAction &&\n    typeof ctx.gestureAction === 'function' &&\n    currentActionKey !== installedActionKey\n  )",
    );
    expect(stackSource).not.toContain(
      'stack-native-content-pop-interaction-created',
    );
    expect(stackSource).not.toContain('stack-native-content-pop-requested');
    expect(stackSource).toMatch(
      /installNativeBackGestureDelegateForRecognizer\(\s*navigationController,\s*popGesture,\s*ctx,\s*'native-pop',\s*\);/,
    );
    expect(stackSource).toMatch(
      /installNativeBackGestureDelegateForRecognizer\(\s*navigationController,\s*contentGesture,\s*ctx,\s*'native-content-pop',\s*\);/,
    );
  });

  it('matches upstream shouldReceiveTouch gating for stack back gestures', () => {
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIDevice: {
        currentDevice: {
          systemVersion: '26.5',
        },
      },
    };
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
    ).toBe(false);
    expect(
      __shouldReceiveNativeScriptStackBackGestureForTests(
        { ...baseProps, fullScreenSwipeEnabled: false } as any,
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
    ).toBe(false);
    expect(
      __shouldReceiveNativeScriptStackBackGestureForTests(
        { ...baseProps, fullScreenSwipeEnabled: true } as any,
        2,
        'native-content-pop',
      ),
    ).toBe(false);
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
    ).toBe(true);
    expect(
      __shouldReceiveNativeScriptStackBackGestureForTests(
        baseProps as any,
        2,
        'custom-edge',
      ),
    ).toBe(false);
    expect(
      __shouldReceiveNativeScriptStackBackGestureForTests(
        customProps as any,
        2,
        'custom-edge',
      ),
    ).toBe(true);
    delete (global as Record<string, unknown>).__nativeScriptNativeApi;
  });

  it('repairs stale hosted RN wrapper frames after UIKit modal presentation', () => {
    expect(stackSource).toContain('const isModalNavigationController');
    expect(stackSource).toContain(
      'navigationController.presentationController?.containerView?.bounds',
    );
    expect(stackSource).toContain(
      'function shouldFillHostedSubview(\n' +
        '  rootView: any,\n' +
        '  subview: any,\n' +
        '  depth: number,',
    );
    expect(stackSource).toContain(
      'RN host wrappers expose the intended content width through contentSize or',
    );
    expect(stackSource).toContain('hostedSubviewMaxVisibleChildRight');
    expect(stackSource).toContain('hostedSubviewMaxVisibleChildBottom');
    expect(stackSource).toContain('maxChildRight >= parentWidth - 2');
    expect(stackSource).toContain('canBeHostWrapper');
    expect(stackSource).toContain('function isNativeTextBackedView');
    expect(stackSource).toContain(
      "isNativeKindOfClass(view, 'RCTParagraphComponentView')",
    );
    expect(stackSource).toContain('contentWidth >= parentWidth - 2');
    expect(stackSource).toContain(
      'const isScrollContainer = isNativeScrollView(subview)',
    );
    expect(stackSource).toContain(
      'const hasUnmeasuredHeight = childHeight <= 0',
    );
    expect(stackSource).toContain('const fillsParentHeight =');
    expect(stackSource).toContain(
      'const hasOverflowingChildren = maxChildBottom > childHeight + 2',
    );
    expect(stackSource).toContain(
      'const hasChildrenOverflowingWidth = maxChildRight > childWidth + 2',
    );
    expect(stackSource).toContain(
      '(hasUnmeasuredHeight || fillsParentHeight || hasOverflowingChildren)',
    );
    expect(stackSource).toContain('childWidth < parentWidth - 2');
    expect(stackSource).toContain(
      'const isScrollView = isNativeScrollView(rootView)',
    );
    expect(stackSource).toContain('scrollContentWidth > scrollWidth + 2');
    expect(stackSource).toContain(
      'const childHeight = frame?.size?.height ?? 0;',
    );
    expect(stackSource).toContain(
      'function scrollViewHasViewportBoundedHostedContent',
    );
    expect(stackSource).toContain('function hostedScrollContentFitsViewport');
    expect(stackSource).toContain('const hasViewportBoundedHostedContent =');
    expect(stackSource).toContain(
      'const targetHeight = hasViewportBoundedHostedContent',
    );
    expect(stackSource).toContain(
      'const hostedContentExtentHeight = hasHostedScrollContent',
    );
    expect(stackSource).toContain(
      'const shouldUseHostedVisibleHeightForContentSize',
    );
    expect(stackSource).toContain('? hostedContentExtentHeight > 0');
    expect(stackSource).toContain(': hostedScrollContentSubviewTargetHeight');
    expect(stackSource).toMatch(
      /rectWithOriginAndSize\(\s*0,\s*0,\s*scrollWidth,\s*targetHeight,\s*\)/,
    );
    expect(stackSource).toContain('normalizeScrollContentFabricLayoutTree');
    expect(stackSource).toContain('resetViewAutoresizingMaskIfNeeded(subview)');
    expect(stackSource).toContain('reactNativeFabricViewLayoutTraits');
    expect(stackSource).toContain('__nativeScriptReactFabricViewLayoutTraits');
    expect(stackSource).toContain('reactNativeFabricViewLayoutMetricsFrame');
    expect(stackSource).toContain('layoutMetricsFrameWidth');
    expect(stackSource).toContain(
      'setViewGeometryFromFabricLayoutFrameIfNeeded',
    );
    expect(stackSource).toContain(
      'function scrollSubviewContainsHostedReactContent',
    );
    expect(stackSource).toContain('const zeroOriginScrollSubview =');
    expect(stackSource).toContain('scrollContentShouldFillViewport');
    expect(stackSource).not.toContain(
      'rootView.contentSize = sizeWithDimensions(scrollWidth, targetHeight)',
    );
    expect(stackSource).not.toContain(
      'setViewFrameIfNeeded(subview, rectWithWidth(frame, scrollWidth));',
    );
    expect(stackSource).toContain(
      'rootView.contentSize = sizeWithWidth(rootView.contentSize, scrollWidth)',
    );
    expect(stackSource).toContain(
      'didNormalizeSubview ||\n' +
        '          didRefreshHostedViews ||\n' +
        '          forceRootHostWrapperLayout',
    );
    expect(stackSource).toContain(
      'shouldFillHostedSubview(\n' +
        '        rootView,\n' +
        '        subview,\n' +
        '        depth,\n' +
        '        traversalBudget,\n' +
        '        shouldForceHostWrapperLayout,\n' +
        '      )',
    );
    expect(stackSource).toContain('__rnsNativeScriptSafeAreaContentView');
    expect(stackSource).toContain(
      'const safeAreaContentSubviews = subview.subviews',
    );
    expect(stackSource).not.toContain(
      'function enableNativeViewInteractionAncestorChain',
    );
    expect(stackSource).toContain('function refreshScreenContentWrapperHost');
    expect(stackSource).not.toContain(
      'function refreshRegisteredScreenContentWrapperHosts',
    );
    expect(stackSource).toContain(
      'function refreshScreenContentWrapperHostsForScreenIds',
    );
    expect(stackSource).toContain(
      'const contentWrapperChildHost =\n    screenContentWrapperChildHostView(contentWrapperView);',
    );
    expect(stackSource).toContain(
      'refreshKnownUIKitHostViewDirectOwner(contentWrapperChildHost) === true',
    );
    expect(stackSource).toContain(
      'function refreshVisibleStackContentWrapperHosts',
    );
    expect(stackSource).toContain(
      'function refreshVisibleStackScreenContentReady',
    );
    expect(stackSource).toContain(
      'restoreScreenControllerViewFromHostHandle(controller, screenId, registry);',
    );
    expect(stackSource).toContain(
      'const controllerView = ensureScreenControllerView(controller);',
    );
    expect(stackSource).toContain(
      'const shouldRepairContent =\n      flushDisplay || !screenContentIsReady(screenId, registry);',
    );
    expect(stackSource).toContain(
      'layoutScreenHostedReactSubviews(\n' +
        '        controller,\n' +
        '        controllerView,\n' +
        '        registry,\n' +
        '        screenId,\n' +
        '        shouldRepairContent,\n' +
        '        shouldRepairContent,\n' +
        '      );',
    );
    expect(stackSource).toContain(
      'refreshScreenContentWrapperHost(\n' +
        '      screenId,\n' +
        '      registry,\n' +
        '      shouldRepairContent,\n' +
        '      shouldRepairContent,\n' +
        '      shouldRepairContent,\n' +
        '      false,\n' +
        "      'refresh-visible-stack-content',\n" +
        '    );',
    );
    expect(stackSource).toContain(
      'return controllerScreenId(arrayItem(viewControllers, count - 1));',
    );
    expect(stackSource).not.toContain(
      'screenIdForController(arrayItem(viewControllers, count - 1), registry)',
    );
    expect(stackSource).toContain('function prepareControllerForPresentation');
    expect(stackSource).toContain(
      'function preparePresentedModalNestedContentForPresentation',
    );
    expect(stackSource).toContain(
      'function presentedModalContentScreenHasLiveHostedContent',
    );
    expect(stackSource).not.toContain(
      'function preparePresentedModalNestedViewForPresentation',
    );
    expect(stackSource).not.toContain(
      'function presentedModalContentScreenHasVisibleHostedContent',
    );
    expect(stackSource).toContain(
      'function presentedModalContentScreenHasPreparedHostedContent',
    );
    expect(stackSource).toContain(
      'function nestedModalPresentationGeometryKey',
    );
    expect(stackSource).toContain(
      'function rememberNestedModalPresentationGeometry',
    );
    expect(stackSource).toContain(
      'navigationController.__nativeScriptNestedModalPresentationGeometryKey',
    );
    expect(stackSource).toContain(
      'function resetPresentedModalNestedContentStacks',
    );
    expect(stackSource).toContain(
      'function presentationControllerForModalScreen',
    );
    expect(stackSource).toContain(
      'function presentedModalContentCanSkipPostPresentationRefresh',
    );
    const postPresentationRefreshSource = stackSource.slice(
      stackSource.indexOf(
        'function refreshPresentedModalContentAfterPresentation',
      ),
      stackSource.indexOf('function prepareControllerForPresentation'),
    );
    expect(postPresentationRefreshSource).toContain(
      'const canSkipPostPresentationRefresh =',
    );
    expect(postPresentationRefreshSource).toContain(
      'presentedModalContentCanSkipPostPresentationRefresh(modalId, registry)',
    );
    expect(postPresentationRefreshSource).toContain(
      '? presentedModalScreenContentReadinessSnapshot(modalId, registry)',
    );
    expect(postPresentationRefreshSource).toContain(
      '? false\n' +
        '    : preparePresentedModalNestedContentForPresentation(modalId, registry)',
    );
    expect(postPresentationRefreshSource).toContain(
      '? false\n' +
        '    : layoutPresentedModalNestedContentScreen(modalId, registry, false)',
    );
    const modalPresentationControllerSource = stackSource.slice(
      stackSource.indexOf('function presentationControllerForModalScreen'),
      stackSource.indexOf(
        'function presentedModalContentCanSkipPostPresentationRefresh',
      ),
    );
    expect(modalPresentationControllerSource).toContain(
      "the modal route's RNSScreen controller",
    );
    expect(modalPresentationControllerSource).toContain(
      'return fallbackController;',
    );
    expect(modalPresentationControllerSource).not.toContain(
      'return modalHeaderNavigationController;',
    );
    expect(stackSource).toContain(
      'resetPresentedModalNestedContentStacks(modalId, registry);',
    );
    expect(stackSource).toContain(
      'setNavigationControllerViewControllers(navigationController, [], false);',
    );
    expect(stackSource).toContain(
      'detachNavigationControllerForModalReparent(navigationController, stackView);',
    );
    expect(stackSource).toContain(
      'markNavigationControllerNeedsViewControllerRehost(navigationController);',
    );
    expect(stackSource).toContain(
      'setNativeScriptStackModalContentParentController(\n' +
        '      navigationController,\n' +
        '      null,\n' +
        '    );',
    );
    expect(stackSource).toContain("registry.stackNativeKeys[stackId] = '';");
    expect(stackSource).toContain('registry.stackNativeCounts[stackId] = 0;');
    expect(stackSource).toContain(
      'setNavigationControllerViewControllers(\n' +
        '        navigationController,\n' +
        '        controllers,\n' +
        '        false,\n' +
        '      );',
    );
    expect(stackSource).toContain(
      'const modalController = registry.screens[modalId];',
    );
    expect(stackSource).toContain(
      'function reparentNavigationControllerForModalContent',
    );
    expectSourceToContain(
      stackSource,
      'function nativeScriptStackModalContentParentController(\n' +
        '  navigationController: any,\n' +
        '  registry?: NativeScriptStackRegistry,\n' +
        ')',
    );
    expect(stackSource).toContain(
      'resolvedRegistry.stackModalContentParentScreenIds?.[stackId]',
    );
    expect(stackSource).toContain(
      'const modalView = ensureScreenControllerView(modalController);',
    );
    expect(stackSource).toContain('let didReparentNestedStack = false;');
    expect(stackSource).toContain(
      'didReparentNestedStack = reparentNavigationControllerForModalContent(',
    );
    expectSourceToContain(
      stackSource,
      'didReparentNestedStack = reparentNavigationControllerForModalContent(\n' +
        '          navigationController,\n' +
        '          stackView,\n' +
        '          modalController,\n' +
        '          modalView,\n' +
        '          registry,\n' +
        '        );',
    );
    expectSourceToContain(
      stackSource,
      'const recordedParent =\n' +
        '    nativeScriptStackModalContentParentController(\n' +
        '      navigationController,\n' +
        '      registry,\n' +
        '    );',
    );
    expect(stackSource).toContain('const needsVisibleRehostForMove =');
    expect(stackSource).toContain(
      'stackView.window != null || navigationView?.window != null',
    );
    expectSourceToContain(
      stackSource,
      'if (needsVisibleRehostForMove) {\n' +
        '      resetNavigationControllerToPlaceholder(navigationController);\n' +
        '      markNavigationControllerNeedsViewControllerRehost(navigationController);\n' +
        '    }',
    );
    expect(stackSource).toContain(
      'registry.stackModalContentParentScreenIds[stackId] = modalId;',
    );
    expect(stackSource).toContain(
      'const didLayoutNestedController =\n' +
        '    layoutNestedNavigationControllerInParentView(',
    );
    expect(stackSource).toContain(
      '} layout=${didLayoutNestedController ? 1 : 0} did=${',
    );
    expect(stackSource).not.toContain(
      'didMutate =\n' +
        '    layoutNestedNavigationControllerInParentView(\n' +
        '      navigationController,\n' +
        '      modalView,\n' +
        '    ) || didMutate;',
    );
    expect(stackSource).toContain(
      'if (didReparentNestedStack || !idsEqual(previousNativeIds, availableIds))',
    );
    expect(stackSource).not.toContain(
      'maybeAddStackControllerToParentAndUpdateContainer(\n' +
        '            stackView,\n' +
        '            navigationController,\n' +
        '            true,\n' +
        '          )',
    );
    expect(stackSource).not.toContain('nestedStackIsPresentedController');
    expect(stackSource).toContain('navigationView.removeFromSuperview?.();');
    expect(stackSource).toContain(
      'addSubviewIfNotSelf(stackView, navigationView)',
    );
    expect(stackSource).toContain('addSubviewIfNotSelf(modalView, stackView)');
    expectSourceToContain(
      stackSource,
      'attachControllerToParentViewController(\n' +
        '    stackView,\n' +
        '    navigationController,\n' +
        '    modalController,\n' +
        '  );',
    );
    expect(stackSource).not.toContain(
      'configureStackControllers(availableIds, registry, true, false);',
    );
    expect(stackSource).toContain(
      'configureStackControllers(\n' +
        '      availableIds,\n' +
        '      registry,\n' +
        '      nestedContentNeedsForcedRefresh,\n' +
        '      false,\n' +
        '    );',
    );
    expect(stackSource).toContain(
      'if (layoutNestedContent && nestedContentNeedsForcedRefresh) {\n' +
        "      layoutNavigationStackViews(navigationController, 'modal-base-refresh');\n" +
        '    }\n' +
        '    updateNativeBackGesture(navigationController);',
    );
    expect(stackSource).toContain(
      'prepareControllerForPresentation(nextController, nextScreenId, registry);',
    );
    const prepareControllerSource = stackSource.slice(
      stackSource.indexOf('function prepareControllerForPresentation'),
      stackSource.indexOf('function controllerAllowsModalDismiss'),
    );
    expect(prepareControllerSource).toContain(
      'const hasNestedModalContent = presentedModalHasNestedContentScreen(',
    );
    expect(prepareControllerSource).not.toContain(
      'presentedModalContentScreenHasPreparedHostedContent(screenId, registry)',
    );
    expect(prepareControllerSource).not.toContain('shouldRepairContent');
    expect(prepareControllerSource).not.toContain(
      'layoutScreenHostedReactSubviews(',
    );
    expect(prepareControllerSource).not.toContain(
      'refreshScreenContentWrapperHost(',
    );
    expect(prepareControllerSource).toContain(
      'if (!hasNestedModalContent) {\n' +
        '      refreshScreenContentWrapperTouchHandler(screenId, registry, false);\n' +
        '    }',
    );
    expect(stackSource).toContain(
      'const presentedController = presentationControllerForModalScreen(',
    );
    expect(stackSource).toContain(
      'if (\n' +
        '        !nativeControllersEqual(presentedController, nextController) &&\n' +
        '        parentViewControllerForController(presentedController)\n' +
        '      ) {\n' +
        '        detachControllerFromCurrentParent(presentedController, true);\n' +
        '      }',
    );
    expect(stackSource).toContain(
      'invokeNativeSelector(\n' +
        '        previousController,\n' +
        "        'presentViewControllerAnimatedCompletion',\n" +
        "        'presentViewController:animated:completion:',\n" +
        '        presentedController,',
    );
    expect(stackSource).toContain(
      'invokeNativeSelector(\n' +
        '        previousController,\n' +
        "        'presentViewControllerAnimatedCompletion',\n" +
        "        'presentViewController:animated:completion:',\n" +
        '        presentedController,\n' +
        '        shouldAnimate,\n' +
        '        presentationCompletionBlock,\n' +
        '      );',
    );
    expect(stackSource).not.toContain(
      'dismissingController.dismissViewControllerAnimatedCompletion(',
    );
    expect(stackSource).toContain(
      'const firstModalToBeDismissed = changeRootController.presentedViewController;',
    );
    expect(stackSource).toContain(
      "        'dismissViewControllerAnimated:completion:',",
    );
    expect(stackSource).toContain('function layoutPresentedModalControllers');
    const modalPresentationIndex = stackSource.indexOf(
      'invokeNativeSelector(\n' +
        '        previousController,\n' +
        "        'presentViewControllerAnimatedCompletion',",
    );
    const finishPresentationIndex = stackSource.lastIndexOf(
      'const finishPresentation = () => {',
      modalPresentationIndex,
    );
    expect(modalPresentationIndex).toBeGreaterThan(-1);
    expect(finishPresentationIndex).toBeGreaterThan(-1);
    expect(
      stackSource.slice(finishPresentationIndex, modalPresentationIndex),
    ).toContain('refreshPresentedModalContentAfterPresentation(');
    expect(
      stackSource.indexOf('function layoutPresentedModalControllers'),
    ).toBeLessThan(modalPresentationIndex);
    const prepareControllerIndex = stackSource.lastIndexOf(
      'prepareControllerForPresentation(nextController, nextScreenId, registry);',
      modalPresentationIndex,
    );
    expect(prepareControllerIndex).toBeGreaterThan(-1);
    const prePresentationSource = stackSource.slice(
      prepareControllerIndex,
      modalPresentationIndex,
    );
    expect(prePresentationSource).toContain(
      'prepareControllerForPresentation(nextController, nextScreenId, registry);',
    );
    expect(prePresentationSource).not.toContain(
      'preparePresentedModalNestedViewForPresentation(',
    );
    expect(prePresentationSource).not.toContain(
      'preparePresentedModalNestedContentForPresentation(',
    );
    expect(prePresentationSource).not.toContain(
      'modal-present-block-content-not-ready',
    );
    const prepareNestedContentSource = stackSource.slice(
      stackSource.indexOf(
        'function preparePresentedModalNestedContentForPresentation',
      ),
      stackSource.indexOf('function presentationControllerForModalScreen'),
    );
    expect(prepareNestedContentSource).toContain(
      'nestedModalStackCanSkipPresentationRefresh(',
    );
    expect(prepareNestedContentSource).toContain(
      'rememberNestedModalPresentationGeometry(',
    );
    expect(stackSource).not.toContain('modal-present-prepared-nested-content');
    expect(stackSource).not.toContain('modal-present-prepared-nested-view');
    expect(
      stackSource.slice(finishPresentationIndex, modalPresentationIndex),
    ).toContain('refreshPresentedModalContentAfterPresentation(');
    expect(stackSource).toContain(
      'const modalIdsNeedingContentRefresh: string[] = [];',
    );
    expect(stackSource).toContain(
      'const modalIdsNeedingTouchRefresh: string[] = [];',
    );
    expect(stackSource).toContain(
      'function restorePresentedModalControllerViewAttachment',
    );
    expect(stackSource).toContain(
      "'presented-modal-reattach-screen-view'",
    );
    expect(stackSource).toContain(
      "'presented-modal-layout-skip-detached'",
    );
    expect(stackSource).toContain('didRestorePresentedAttachment');
    expect(stackSource).toContain(
      'if (modalIdsNeedingContentRefresh.length > 0) {',
    );
    expect(stackSource).toMatch(
      /refreshPresentedModalContentWrapperHosts\(\s*modalIdsNeedingContentRefresh,\s*registry,\s*true,\s*true,\s*true,\s*\);/,
    );
    expect(stackSource).toContain(
      'refreshPresentedModalSubtreeTouchHandlers(\n' +
        '      modalIdsNeedingTouchRefresh,\n' +
        '      registry,\n' +
        '      false,\n' +
        '    );',
    );
    expect(stackSource).toContain(
      "'presented-modal-layout-touch-skip-stable'",
    );
    expect(stackSource).toContain('stackPresentedModalLayoutKeys');
    expect(stackSource).toContain('function presentedModalLayoutCanSkip');
    expect(stackSource).toContain(
      "'layoutPresentedModalControllers.skipStable'",
    );
    expect(stackSource).toContain(
      'function modalContentParentStackHasActiveTransition',
    );
    expect(stackSource).toContain(
      'modalContentParentStackHasActiveTransition(owningStackId, registry)',
    );
    expect(stackSource).toContain(
      'registry.stackTransitionScreenIds[parentStackId] === modalId',
    );
    expect(stackSource).toContain(
      'registry.stackPresentedModalLayoutKeys[stackId] = presentedModalLayoutKey(',
    );
    const nestedModalLayoutSource = stackSource.slice(
      stackSource.indexOf('function layoutPresentedModalNestedContentScreen'),
      stackSource.indexOf(
        'function preparePresentedModalNestedContentForPresentation',
      ),
    );
    expect(nestedModalLayoutSource).toContain(
      'nestedModalStackCanSkipPresentationRefresh(',
    );
    expect(nestedModalLayoutSource).toContain(
      "'modal-nested-content-layout-skip'",
    );
    expect(nestedModalLayoutSource).toContain(
      'let didLayoutNestedController = false;',
    );
    expect(nestedModalLayoutSource).toContain(
      'const shouldRefreshNestedHostedContent = !!(',
    );
    expect(nestedModalLayoutSource).toContain(
      'const wrapperWasMountedBeforeEnsure = !!(',
    );
    expect(nestedModalLayoutSource).toContain(
      'const didNormalizeWrapper = ensureScreenContentWrapperMounted(',
    );
    expect(nestedModalLayoutSource).toContain('const didMountWrapper = !!(');
    expect(nestedModalLayoutSource).toContain(
      '!wrapperWasMountedBeforeEnsure',
    );
    expect(nestedModalLayoutSource).toContain(
      'const shouldRepairNestedContentLayout = !!(',
    );
    expect(nestedModalLayoutSource).toContain('wrapperNeedsLayout ||');
    expect(nestedModalLayoutSource).toContain('didNormalizeWrapper ||');
    expect(nestedModalLayoutSource).toContain('didLayoutNestedController');
    expectSourceToContain(
      nestedModalLayoutSource,
      'refreshScreenContentWrapperHost(\n' +
        '        topScreenId,\n' +
        '        registry,\n' +
        '        shouldRefreshNestedHostedContent,\n' +
        '        shouldRepairNestedContentLayout,\n' +
        '        shouldRepairNestedContentLayout,',
    );
    expect(nestedModalLayoutSource).not.toContain(
      'didMutate =\n' +
        '        layoutNestedNavigationControllerInParentView(',
    );
    expect(nestedModalLayoutSource).not.toContain(
      'forceHostRefresh ||\n' +
        '      wrapperNeedsLayout',
    );
    expect(nestedModalLayoutSource).not.toContain(
      'forceHostRefresh || wrapperNeedsLayout,\n' +
        '        true,\n' +
        '        true,',
    );
    expect(stackSource).not.toContain('setTimeout(refresh, 250);');
    expect(stackSource).toContain('controllerView.superview?.bounds');
    expect(stackSource).not.toContain(
      'controller.view.superview?.frame ?? fallbackBounds',
    );
    expect(stackSource).toContain(
      'refreshHost &&\n' +
        '    !skipHostedRefresh &&\n' +
        '    !alreadyRefreshedForLayout &&\n' +
        '    ((contentWrapperChildHost &&\n' +
        '      refreshKnownUIKitHostViewDirectOwner(contentWrapperChildHost) === true) ||\n' +
        '      refreshKnownUIKitHostViewDirectOwner(contentWrapperView) === true)',
    );
    expect(stackSource).toContain('function refreshKnownUIKitHostView');
    expect(stackSource).toContain(
      'function refreshKnownUIKitHostViewDirectOwnerHandle',
    );
    const refreshKnownUIKitHostViewDirectOwnerSource = stackSource.slice(
      stackSource.indexOf('function refreshKnownUIKitHostViewDirectOwner'),
      stackSource.indexOf(
        'function refreshKnownUIKitHostViewDirectOwnerHandle',
      ),
    );
    expect(refreshKnownUIKitHostViewDirectOwnerSource).toContain(
      'return didRefresh;',
    );
    expect(
      refreshKnownUIKitHostViewDirectOwnerSource.indexOf('return didRefresh;'),
    ).toBeLessThan(
      refreshKnownUIKitHostViewDirectOwnerSource.indexOf(
        'return refreshKnownUIKitHostView(view);',
      ),
    );
    const refreshKnownUIKitHostViewDirectOwnerHandleSource = stackSource.slice(
      stackSource.indexOf(
        'function refreshKnownUIKitHostViewDirectOwnerHandle',
      ),
      stackSource.indexOf('function flushKnownUIKitHostView'),
    );
    expect(refreshKnownUIKitHostViewDirectOwnerHandleSource).toContain(
      'return refreshDirectOwnerByHandle(viewHandle) === true;',
    );
    expect(
      refreshKnownUIKitHostViewDirectOwnerHandleSource.indexOf(
        'return refreshDirectOwnerByHandle(viewHandle) === true;',
      ),
    ).toBeLessThan(
      refreshKnownUIKitHostViewDirectOwnerHandleSource.indexOf(
        'return refreshKnownUIKitHostViewHandle(viewHandle);',
      ),
    );
    const refreshKnownUIKitHostViewSource = stackSource.slice(
      stackSource.indexOf('function refreshKnownUIKitHostView'),
      stackSource.indexOf('function refreshKnownUIKitHostViewHandle'),
    );
    expect(refreshKnownUIKitHostViewSource).toContain(
      'view?.__rnsNativeScriptScreenView === true',
    );
    expect(refreshKnownUIKitHostViewSource).toContain(
      '.refreshUIKitHostViewDirectOwner',
    );
    expect(
      refreshKnownUIKitHostViewSource.indexOf(
        '.refreshUIKitHostViewDirectOwner',
      ),
    ).toBeLessThan(
      refreshKnownUIKitHostViewSource.indexOf(
        'NativeScriptRuntime.refreshUIKitHostView',
      ),
    );
    expect(
      refreshKnownUIKitHostViewSource.indexOf(
        'NativeScriptRuntime.refreshUIKitHostView',
      ),
    ).toBeGreaterThan(-1);
    expect(refreshKnownUIKitHostViewSource).not.toContain(
      'refreshUIKitHostViewOwner',
    );
    expect(refreshKnownUIKitHostViewSource).not.toContain(
      'refreshKnownUIKitHostView.owner',
    );
    expect(refreshKnownUIKitHostViewSource).toContain(
      "traceSlowWorklet('refreshKnownUIKitHostView.missing', startedAt);",
    );
    expect(refreshKnownUIKitHostViewSource).toContain('return didRefresh;');
    const refreshKnownUIKitHostViewHandleSource = stackSource.slice(
      stackSource.indexOf('function refreshKnownUIKitHostViewHandle'),
      stackSource.indexOf('function screenContentWrapperRefreshKey'),
    );
    expect(refreshKnownUIKitHostViewHandleSource).toContain(
      '.refreshUIKitHostViewHandle',
    );
    expect(refreshKnownUIKitHostViewHandleSource).not.toContain(
      'refreshUIKitHostViewOwnerHandle',
    );
    expect(stackSource).toContain(
      'const shouldDeferHostRefresh =\n' +
        '    contentWrapperView &&\n' +
        '    canUseScreenContent &&\n' +
        '    shouldDeferReadyContentWrapperRefreshDuringTransition(screenId, registry);',
    );
    expect(stackSource).toContain(
      'const shouldSkipHostedRefreshForNativeStackStart =\n' +
        '    canStartNativeStackUpdateFromWrapper &&\n' +
        '    !isModalScreen &&\n' +
        '    !!stackId &&\n' +
        '    registry.stackTransitioning[stackId] !== true;',
    );
    expect(stackSource).toContain(
      'const didRefresh = contentWrapperView\n' +
        '    ? refreshScreenContentWrapperHost(\n' +
        '        screenId,\n' +
        '        registry,\n' +
        '        true,\n' +
        '        false,\n' +
        '        false,\n' +
        '        shouldDeferHostRefresh || shouldSkipHostedRefreshForNativeStackStart,\n' +
        "        'content-wrapper-host-ready',\n" +
        '      )',
    );
    expect(stackSource).not.toContain(
      '(contentWrapperView\n      ? refreshScreenContentWrapperHost(screenId, registry)\n      : false) ||\n    refreshKnownUIKitHostViewDirectOwnerHandle(contentWrapperViewHandle)',
    );
    const flushKnownUIKitHostViewSource = stackSource.slice(
      stackSource.indexOf('function flushKnownUIKitHostView'),
      stackSource.indexOf('function isSurfaceTouchHandlerGestureRecognizer'),
    );
    expect(flushKnownUIKitHostViewSource).toContain('flushUIKitHostView');
    expect(flushKnownUIKitHostViewSource).not.toContain(
      'flushUIKitHostViewOwner',
    );
    expect(flushKnownUIKitHostViewSource).toContain(
      "traceSlowWorklet('flushKnownUIKitHostView.missing', startedAt);",
    );
    expect(stackSource).toContain(
      "const LAYOUT_HOSTED_SUBVIEW_CHAIN_KEY =\n  '__rnsNativeScriptLayoutHostedSubviewChain';",
    );
    expect(stackSource).toContain(
      "const LAYOUT_PRESENTED_MODAL_CONTROLLERS_KEY =\n  '__rnsNativeScriptLayoutPresentedModalControllers';",
    );
    expect(stackSource).toMatch(
      /const layoutHostedSubviewChainFromRegistry\s*=\s*\(\s*globalThis as Record<string, any>\s*\)\[LAYOUT_HOSTED_SUBVIEW_CHAIN_KEY\];/,
    );
    expect(stackSource).toContain(
      'const shouldScanHostedLayout =\n' +
        '    !skipHostedRefresh &&\n' +
        '    (forceLayoutScan ||\n' +
        '      didNormalizeWrapper ||\n' +
        '      didNormalizeChildHost ||\n' +
        '      didRefresh ||\n' +
        '      !alreadyRefreshedForLayout);',
    );
    expect(stackSource).toContain(
      "shouldScanHostedLayout &&\n    typeof layoutHostedSubviewChainFromRegistry === 'function'",
    );
    expect(stackSource).toContain(
      'layoutHostedSubviewChainFromRegistry(\n' +
        '      contentWrapperView,\n' +
        '      0,\n' +
        '      availableHeight,\n' +
        '      [],\n' +
        '      undefined,\n' +
        '      0,\n' +
        '      didNormalizeWrapper ||\n' +
        '        didNormalizeChildHost ||\n' +
        '        didRefresh ||\n' +
        '        forceLayoutScan,\n' +
        '    );',
    );
    expect(stackSource).toContain(
      'function screenTransitionInteractionIsDisabled',
    );
    expect(stackSource).toContain(
      'contentWrapperView.userInteractionEnabled = true;',
    );
    expect(stackSource).not.toContain(
      'contentWrapperView.userInteractionEnabled = !interactionDisabled;',
    );
    const hostedSubviewRepairSource = stackSource.slice(
      stackSource.indexOf('function installHostedSubviewRepairHandler'),
      stackSource.indexOf('function layoutPresentedModalControllers'),
    );
    expect(hostedSubviewRepairSource).not.toContain(
      'setScreenTransitionInteractionDisabled(screenId, registry, true);',
    );
    expect(stackSource).toContain(
      'setScreenTransitionInteractionDisabled(screenId, registry, false);',
    );
    expect(stackSource).toContain('function installHostedSubviewRepairHandler');
    expect(stackSource).toContain(
      '(globalThis as Record<string, any>)[LAYOUT_HOSTED_SUBVIEW_CHAIN_KEY] =\n    layoutHostedSubviewChain;',
    );
    expect(stackSource).toContain(
      '(globalThis as Record<string, any>)[LAYOUT_PRESENTED_MODAL_CONTROLLERS_KEY] =\n  layoutPresentedModalControllers;',
    );
    expect(stackSource).not.toContain(
      'COMPLETE_PENDING_NATIVE_BACK_GESTURE_CANCEL_KEY',
    );
    expect(stackSource).not.toContain(
      'runOnUI(installNativeBackGestureCancelHandler)',
    );
    expect(stackSource).toContain(
      'runOnUI(installHostedSubviewRepairHandler).catch(() => undefined);',
    );
    expect(stackSource).toContain('return didRefresh;');
    expect(stackSource).toContain('function ensureScreenContentWrapperMounted');
    expect(stackSource.indexOf('function flexibleSizeMask')).toBeLessThan(
      stackSource.indexOf('function ensureScreenContentWrapperMounted'),
    );
    expect(stackSource.indexOf('function rectWithZeroOrigin')).toBeLessThan(
      stackSource.indexOf('function ensureScreenContentWrapperMounted'),
    );
    expect(stackSource.indexOf('function controllersEqual')).toBeLessThan(
      stackSource.indexOf(
        'function restoreDetachedScreenViewIntoNavigationWrapper',
      ),
    );
    expect(stackSource.indexOf('function controllersEqual')).toBeLessThan(
      stackSource.indexOf(
        'function layoutHostedReactSubviewsForControllerHierarchy',
      ),
    );
    expect(
      stackSource.indexOf('function modalDismissalWasRequestedFromJS'),
    ).toBeLessThan(
      stackSource.indexOf('function detachedModalHeaderCanCompleteDismissal'),
    );
    expect(stackSource).toContain(
      'contentWrapperIsMountedInScreenView(\n    contentWrapperView,\n    screenView,\n  )',
    );
    expect(stackSource).toContain(
      'addSubviewIfNotSelf(screenView, contentWrapperView)',
    );
    expect(stackSource).toContain(
      'upstream RNSScreenContentWrapper is always a',
    );
    expect(stackSource).toContain(
      'contentWrapperView.userInteractionEnabled = true;',
    );
    expect(stackSource).not.toContain(
      'contentWrapperView.userInteractionEnabled = !interactionDisabled;',
    );
    expect(stackSource).toContain('forceLayoutScan = false');
    expect(stackSource).toContain('refreshKeys[screenId] === refreshKey');
    expect(stackSource).not.toContain(
      '!forceLayoutScan &&\n    !forceTouchRefresh &&',
    );
    expect(stackSource).toContain("'layout-presented-modal'");
    expect(stackSource).toContain(
      'function refreshPresentedModalContentWrapperHosts',
    );
    expect(stackSource).toMatch(
      /screenId === modalId\s*\|\|\s*screenId\.indexOf\(modalSubtreePrefix\) === 0/,
    );
    expect(stackSource).toMatch(
      /refreshPresentedModalContentWrapperHosts\(\s*modalIdsNeedingContentRefresh,\s*registry,\s*true,\s*true,\s*true,\s*\);/,
    );
    expect(stackSource).toContain(
      'refreshPresentedModalSubtreeTouchHandlers(\n' +
        '      modalIdsNeedingTouchRefresh,\n' +
        '      registry,\n' +
        '      false,\n' +
        '    );',
    );
    expect(stackSource).toContain('function resetScreenContentRefreshState');
    expect(stackSource).toContain(
      'registry.screenContentReady[screenId] = undefined;',
    );
    expect(stackSource).toContain(
      'registry.screenContentWrapperRefreshKeys[screenId] = undefined;',
    );
    expect(stackSource).toContain('.invalidateUIKitHostReadyOwner');
    expect(stackSource).toContain('invalidateHostReady(contentWrapperView);');
    expect(stackSource).toContain(
      'function resetPresentedModalContentRefreshState',
    );
    expect(stackSource).toContain(
      'resetPresentedModalContentRefreshState(screenId, registry);',
    );
    expect(stackSource).toContain(
      'function restoreVisibleBaseStackAfterModalDismissal',
    );
    expect(stackSource).toContain('function restoredScreenNeedsContentRefresh');
    expect(stackSource).toContain(
      'return !screenHasVisibleHostedContent(screenId, registry, controllerView);',
    );
    const restoreVisibleBaseStackSource = stackSource.slice(
      stackSource.indexOf(
        'function restoreVisibleBaseStackAfterModalDismissal',
      ),
      stackSource.indexOf('function restoreVisibleStackAfterNativeDismissal'),
    );
    expect(restoreVisibleBaseStackSource).not.toContain(
      'scheduleContainingTabControllerReconcile',
    );
    expect(restoreVisibleBaseStackSource).toContain(
      'reconcileContainingTabControllerFromStackContent(\n' +
        '    stackId,\n' +
        '    registry,\n' +
        '    stack?.view,\n' +
        '  );',
    );
    expect(restoreVisibleBaseStackSource).toContain(
      'const shouldForceBaseTouchRefresh =\n' +
        '    !canSkipBaseLayout || idsNeedingContentRefresh.length > 0;',
    );
    expect(restoreVisibleBaseStackSource).toContain(
      'restoreVisibleNavigationControllerInteractivity(\n' +
        '      stack,\n' +
        '      registry,\n' +
        '      shouldForceBaseTouchRefresh,\n' +
        '    );',
    );
    expect(restoreVisibleBaseStackSource).toContain(
      'if (shouldForceBaseTouchRefresh) {\n' +
        '    refreshVisibleScreenTouchHandlers(baseIds, registry);\n' +
        '  }',
    );
    expect(restoreVisibleBaseStackSource).not.toContain(
      'restoreVisibleNavigationControllerInteractivity(stack, registry, true);',
    );
    expect(restoreVisibleBaseStackSource).toContain(
      'const baseIds = configureVisibleBaseStackAfterModalDismissal(',
    );
    expect(restoreVisibleBaseStackSource).toContain(
      'setScreenTransitionInteractionDisabled(screenId, registry, false);',
    );
    expect(restoreVisibleBaseStackSource).toContain(
      'const idsNeedingContentRefresh: string[] = [];',
    );
    expect(restoreVisibleBaseStackSource).toContain(
      'if (restoredScreenNeedsContentRefresh(screenId, controller, registry)) {',
    );
    expect(restoreVisibleBaseStackSource).toContain(
      'resetScreenContentRefreshState(screenId, registry);',
    );
    expect(restoreVisibleBaseStackSource).toContain(
      'addUniqueScreenId(idsNeedingContentRefresh, screenId);',
    );
    expect(restoreVisibleBaseStackSource).toContain(
      'refreshScreenContentWrapperHostsForScreenIds(',
    );
    expect(restoreVisibleBaseStackSource).toContain(
      'idsNeedingContentRefresh,\n' + '    registry,\n' + '    true,',
    );
    expect(stackSource).toContain('function refreshVisibleScreenTouchHandlers');
    expect(restoreVisibleBaseStackSource).not.toContain(
      'refreshVisibleStackContentWrapperHosts(',
    );
    expect(stackSource).toContain('staleShortRootHostWrapperCandidate');
    expect(stackSource).toContain(
      'controllerView.superview?.bringSubviewToFront?.(controllerView);',
    );
    expect(stackSource).toContain(
      'disableStaleUIKitWrapperSiblingsAroundControllerView(controllerView);',
    );
    expect(stackSource).toContain(
      'disableStaleUIKitWrapperSiblingsAroundControllerView(navigationView);',
    );
    expect(stackSource).toContain(
      'refreshVisibleStackScreenContentReady(\n' +
        '      stackId,\n' +
        '      registry,\n' +
        '      screenId,\n' +
        '      !closing || cancelled,\n' +
        '      shouldForceRevealedScreenRefresh,\n' +
        '    );',
    );
    const modalBlockedSource = stackSource.slice(
      stackSource.indexOf('function markModalPresentationBlocked'),
      stackSource.indexOf('function setModalViewControllers'),
    );
    expect(modalBlockedSource).not.toContain(
      'refreshScreenContentWrapperHostsForScreenIds',
    );
    expect(stackSource).toContain(
      'const shouldUseTouchOnlyStableLayout =\n' +
        '    wasContentReady &&\n' +
        '    isContentReady &&\n' +
        '    !layoutDidChange &&\n' +
        '    previousHeight === height &&\n' +
        '    !shouldDeferHostRefresh;',
    );
    expect(stackSource).toContain(
      'function repairHostedSubviewHeightForChildren',
    );
    expect(stackSource).toContain(
      'hostedSubviewMaxVisibleChildBottomWithBudget(view, budget)',
    );
    expect(stackSource).toContain('childScansRemaining: 192');
    expect(stackSource).toContain('viewsRemaining: 48');
    expect(stackSource).toContain(
      'hostedSubviewRepairLayoutDidChange(rootView, availableHeight)',
    );
    expect(stackSource).toContain('traversalDepth > 64');
    expect(stackSource).toContain('budget.childScansRemaining <= 0');
    expect(stackSource).toContain(
      'Pressables below that stale bound never receive',
    );
    expect(stackSource).toContain(
      'function disableStaleUIKitWrapperSiblingsAroundControllerView',
    );
    expect(stackSource).toContain(
      'UIViewControllerWrapperView transition siblings above the active screen',
    );
    expect(stackSource).toContain('subview.hidden = true;');
    expect(stackSource).toContain('subview.removeFromSuperview?.();');
    expect(stackSource).toContain(
      'disableStaleUIKitWrapperSiblingsAroundControllerView(controllerView);',
    );
    expect(stackSource).toContain('depth > 16');
    expect(stackSource).toContain(
      'nativeControllersEqual(visited, controller)',
    );
    expect(
      stackSource.slice(
        stackSource.indexOf(
          'function layoutHostedReactSubviewsForControllerHierarchy',
        ),
        stackSource.indexOf(
          'function disableStaleUIKitWrapperSiblingsAroundControllerView',
        ),
      ),
    ).not.toContain('nativeObjectsEqual');
    expect(
      stackSource.slice(
        stackSource.indexOf(
          'function layoutHostedReactSubviewsForControllerHierarchy',
        ),
        stackSource.indexOf(
          'function disableStaleUIKitWrapperSiblingsAroundControllerView',
        ),
      ),
    ).toContain('layoutHostedHierarchy-skip-stable');
    expect(
      stackSource.slice(
        stackSource.indexOf(
          'function layoutHostedReactSubviewsForControllerHierarchy',
        ),
        stackSource.indexOf(
          'function disableStaleUIKitWrapperSiblingsAroundControllerView',
        ),
      ),
    ).toContain('screenHasStableReadyMountedContent(');
    expect(stackSource).not.toContain('layoutHostedSubviewChain(this, 0);');
    expect(stackSource).not.toContain('subview.userInteractionEnabled = true');
    expect(stackSource).toContain('detachInactiveNativeScriptScreen');
    expect(stackSource).toContain(
      "typeof view.removeFromSuperview === 'function'",
    );
    expect(stackSource).toContain(
      'function presentedControllerChainContainsController',
    );
    expect(stackSource).toContain(
      'function controllerHierarchyContainsController',
    );
    expect(stackSource).toContain('rootController.childViewControllers');
    expect(stackSource).toContain(
      'controllerHierarchyContainsController(navigationController, controller)',
    );
    expect(stackSource).toContain(
      'function controllerParticipatesInUIKitPresentation',
    );
    expect(stackSource).toContain(
      'controller.presentingViewController != null',
    );
    expect(stackSource).toContain(
      'controllerParticipatesInUIKitPresentation(rootViewController(), controller)',
    );
    expect(stackSource).toContain('depth <= 1');
    expect(stackSource).toContain('childWidth <= 0');
    const layoutHostedReactSubviewsSource = stackSource.slice(
      stackSource.indexOf('function layoutHostedReactSubviews'),
      stackSource.indexOf('function refreshNavigationControllerHostedViews'),
    );
    expect(layoutHostedReactSubviewsSource).toContain(
      'rootView.userInteractionEnabled = true;',
    );
    expect(layoutHostedReactSubviewsSource).toContain(
      'shouldSkipHostedSubviewRepairDuringNativeTransaction(',
    );
    expect(stackSource).toContain(
      'registry.stackUpdatingModals[stackId] !== true',
    );
    expect(stackSource).toContain(
      'registry.stackTransitioning[stackId] === true',
    );
    expect(stackSource).toContain(
      'screenHasVisibleHostedContent(screenId, registry, rootView)',
    );
    expect(layoutHostedReactSubviewsSource).not.toContain(
      'subview.userInteractionEnabled = true',
    );
    expect(
      layoutHostedReactSubviewsSource.indexOf(
        'refreshKnownUIKitHostView(rootView) === true;',
      ),
    ).toBeLessThan(
      layoutHostedReactSubviewsSource.indexOf(
        'const targetFrame = rectWithZeroOrigin(rootView.bounds);',
      ),
    );
    expect(layoutHostedReactSubviewsSource).toContain(
      'didNormalizeSubview ||\n' +
        '          didRefreshHostedViews ||\n' +
        '          forceRootHostWrapperLayout',
    );
    expect(layoutHostedReactSubviewsSource).toContain(
      'boundsRectForFilledHostedSubview(subview, targetFrame)',
    );
    expect(stackSource).toContain('function setViewFrameIfNeeded');
    expect(stackSource).toContain('function setViewBoundsIfNeeded');
    expect(stackSource).toContain('function rectWithZeroOrigin');
    expect(stackSource).toContain('rectsApproximatelyEqual(view.frame, frame)');

    const staleFullWidthWrapper: any = {
      alpha: 1,
      bounds: { origin: { x: 0, y: 0 }, size: { width: 402, height: 174.667 } },
      frame: { origin: { x: 0, y: 0 }, size: { width: 402, height: 174.667 } },
      hidden: false,
      subviews: [
        {
          alpha: 1,
          frame: {
            origin: { x: 18, y: 317.333 },
            size: { width: 366, height: 50 },
          },
          hidden: false,
        },
      ],
      superview: {
        bounds: { origin: { x: 0, y: 0 }, size: { width: 402, height: 437 } },
      },
      userInteractionEnabled: false,
    };

    expect(
      __nativeScriptHostedSubviewChildBoundsRepairHeightForTests(
        staleFullWidthWrapper,
      ),
    ).toBeCloseTo(367.333);
    expect(
      __nativeScriptHostedSubviewChildBoundsRepairHeightForTests(
        staleFullWidthWrapper,
        874,
      ),
    ).toBeCloseTo(367.333);
    expect(
      __nativeScriptRepairHostedSubviewHeightForTests(staleFullWidthWrapper),
    ).toBe(true);
    expect(staleFullWidthWrapper.frame.size.height).toBeCloseTo(367.333);
    expect(staleFullWidthWrapper.bounds.size.height).toBeCloseTo(367.333);
    expect(staleFullWidthWrapper.userInteractionEnabled).toBe(false);

    const offsetUserLayout = {
      ...staleFullWidthWrapper,
      frame: {
        origin: { x: 18, y: 0 },
        size: { width: 366, height: 174.667 },
      },
    };
    expect(
      __nativeScriptHostedSubviewChildBoundsRepairHeightForTests(
        offsetUserLayout,
      ),
    ).toBe(0);

    const wrapperWithOverflowingStaleChild = {
      ...staleFullWidthWrapper,
      bounds: { origin: { x: 0, y: 0 }, size: { width: 402, height: 174.667 } },
      frame: { origin: { x: 0, y: 0 }, size: { width: 402, height: 174.667 } },
      subviews: [
        {
          alpha: 1,
          frame: {
            origin: { x: 18, y: 147 },
            size: { width: 768, height: 329 },
          },
          hidden: false,
        },
      ],
      superview: {
        bounds: { origin: { x: 0, y: 0 }, size: { width: 402, height: 437 } },
      },
    };
    expect(
      __nativeScriptHostedSubviewChildBoundsRepairHeightForTests(
        wrapperWithOverflowingStaleChild,
      ),
    ).toBe(437);
    expect(
      __nativeScriptHostedSubviewChildBoundsRepairHeightForTests(
        wrapperWithOverflowingStaleChild,
        874,
      ),
    ).toBeCloseTo(476);

    const pushedScreenLowerButtonWrapper = {
      ...staleFullWidthWrapper,
      bounds: { origin: { x: 0, y: 0 }, size: { width: 402, height: 437 } },
      frame: { origin: { x: 0, y: 0 }, size: { width: 402, height: 437 } },
      subviews: [
        {
          alpha: 1,
          frame: {
            origin: { x: 18, y: 583 },
            size: { width: 366, height: 50 },
          },
          hidden: false,
        },
      ],
      superview: {
        bounds: { origin: { x: 0, y: 0 }, size: { width: 402, height: 437 } },
      },
    };
    expect(
      __nativeScriptHostedSubviewChildBoundsRepairHeightForTests(
        pushedScreenLowerButtonWrapper,
        874,
      ),
    ).toBe(633);

    const activeScreenView: any = {
      frame: { origin: { x: 0, y: 0 }, size: { width: 402, height: 874 } },
    };
    const staleEmptyWrapperSibling: any = {
      alpha: 1,
      frame: { origin: { x: 0, y: 0 }, size: { width: 402, height: 874 } },
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
    };
    const nonEmptyTransitionSibling: any = {
      alpha: 1,
      frame: { origin: { x: 0, y: 0 }, size: { width: 402, height: 874 } },
      hidden: false,
      subviews: [{}],
      userInteractionEnabled: true,
    };
    const offsetUserSibling: any = {
      alpha: 1,
      frame: { origin: { x: 18, y: 0 }, size: { width: 366, height: 874 } },
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
    };
    const centeredEmptyOverlaySibling: any = {
      __nativeScriptClassName: 'UIView',
      accessibilityElementsHidden: false,
      alpha: 1,
      description: () => '<UIView: centered-overlay>',
      frame: { origin: { x: 150, y: 400 }, size: { width: 130, height: 390 } },
      hidden: false,
      removeFromSuperview: jest.fn(),
      subviews: [],
      userInteractionEnabled: true,
    };
    activeScreenView.superview = {
      bounds: { origin: { x: 0, y: 0 }, size: { width: 402, height: 874 } },
      subviews: [
        activeScreenView,
        staleEmptyWrapperSibling,
        nonEmptyTransitionSibling,
        offsetUserSibling,
        centeredEmptyOverlaySibling,
      ],
    };

    expect(
      __nativeScriptDisableStaleUIKitWrapperSiblingsForTests(activeScreenView),
    ).toBe(true);
    expect(staleEmptyWrapperSibling.userInteractionEnabled).toBe(false);
    expect(nonEmptyTransitionSibling.userInteractionEnabled).toBe(false);
    expect(offsetUserSibling.userInteractionEnabled).toBe(true);
    expect(centeredEmptyOverlaySibling.hidden).toBe(true);
    expect(centeredEmptyOverlaySibling.userInteractionEnabled).toBe(false);
    expect(centeredEmptyOverlaySibling.accessibilityElementsHidden).toBe(true);
    expect(centeredEmptyOverlaySibling.removeFromSuperview).toHaveBeenCalled();
  });

  it('expands same-width presented modal bounds from the stable presentation fallback', () => {
    const rect = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { height, width },
    });
    const window = { bounds: rect(402, 800) };
    const shortSuperview = {
      bounds: rect(402, 430),
      convertPointToView: () => ({ x: 0, y: 58 }),
      window,
    };
    const controllerView = {
      superview: shortSuperview,
      window,
    };

    expect(
      __nativeScriptStablePresentedControllerBoundsForTests(
        controllerView,
        rect(402, 742),
      ),
    ).toEqual(rect(402, 742));

    const sheetSuperview = {
      bounds: rect(360, 430),
      convertPointToView: () => ({ x: 21, y: 58 }),
      window,
    };

    expect(
      __nativeScriptStablePresentedControllerBoundsForTests(
        { superview: sheetSuperview, window },
        rect(402, 742),
      ),
    ).toEqual(rect(360, 430));
  });

  it('removes stale modal wrapper siblings above the active route ancestor chain', () => {
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };
    const activeScreenView: any = {
      frame,
      hidden: false,
      userInteractionEnabled: true,
    };
    const transitionView: any = {
      frame,
      hidden: false,
      subviews: [activeScreenView],
      userInteractionEnabled: true,
    };
    const stalePresentationWrapper: any = {
      accessibilityElementsHidden: false,
      alpha: 1,
      description: () => 'UIViewControllerWrapperView',
      frame,
      hidden: false,
      removeFromSuperview: jest.fn(),
      userInteractionEnabled: true,
    };
    const navigationBar: any = {
      alpha: 1,
      description: () => 'UINavigationBar',
      frame: {
        origin: { x: 0, y: 0 },
        size: { height: 96, width: 402 },
      },
      hidden: false,
      removeFromSuperview: jest.fn(),
      userInteractionEnabled: true,
    };
    const stackHostView: any = {
      bounds: frame,
      frame,
      subviews: [transitionView, stalePresentationWrapper, navigationBar],
    };
    activeScreenView.superview = transitionView;
    transitionView.superview = stackHostView;
    stalePresentationWrapper.superview = stackHostView;
    navigationBar.superview = stackHostView;

    expect(
      __nativeScriptDisableStaleUIKitWrapperSiblingsAboveActiveViewChainForTests(
        activeScreenView,
        stackHostView,
      ),
    ).toBe(true);
    expect(stalePresentationWrapper.hidden).toBe(true);
    expect(stalePresentationWrapper.userInteractionEnabled).toBe(false);
    expect(stalePresentationWrapper.accessibilityElementsHidden).toBe(true);
    expect(stalePresentationWrapper.removeFromSuperview).toHaveBeenCalled();
    expect(navigationBar.hidden).toBe(false);
    expect(navigationBar.removeFromSuperview).not.toHaveBeenCalled();
  });

  it('removes empty screen wrapper residue from the touch path', () => {
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };
    const contentLeaf = {
      alpha: 1,
      frame: {
        origin: { x: 18, y: 543 },
        size: { height: 50, width: 366 },
      },
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
    };
    const hostedContent = {
      __nativeScriptClassName: 'UIView',
      alpha: 1,
      frame,
      hidden: false,
      subviews: [contentLeaf],
      userInteractionEnabled: true,
    };
    const staleEmptyWrapper: any = {
      __nativeScriptClassName: 'UIView',
      accessibilityIdentifier: null,
      accessibilityLabel: null,
      alpha: 1,
      frame,
      gestureRecognizers: [] as any[],
      hidden: false,
      subviews: [],
      tag: 0,
      userInteractionEnabled: true,
    };
    const rootView = {
      bounds: frame,
      frame,
      subviews: [hostedContent, staleEmptyWrapper],
    };

    expect(
      __nativeScriptDisableStaleEmptyScreenHitTargetSiblingsForTests(rootView),
    ).toBe(true);
    expect(staleEmptyWrapper.userInteractionEnabled).toBe(false);
    expect(staleEmptyWrapper.accessibilityElementsHidden).toBe(true);
    expect(hostedContent.userInteractionEnabled).toBe(true);

    staleEmptyWrapper.userInteractionEnabled = true;
    staleEmptyWrapper.gestureRecognizers = [{}];

    expect(
      __nativeScriptDisableStaleEmptyScreenHitTargetSiblingsForTests(rootView),
    ).toBe(false);
    expect(staleEmptyWrapper.userInteractionEnabled).toBe(true);
  });

  it('disables covered stack screen interactivity during native transitions', () => {
    const rootControllerView: any = {
      userInteractionEnabled: true,
    };
    const detailControllerView: any = {
      userInteractionEnabled: false,
    };
    const rootWrapper: any = {
      userInteractionEnabled: true,
    };
    const detailWrapper: any = {
      userInteractionEnabled: false,
    };
    const registry: any = {
      screenContentWrapperViews: {
        detail: detailWrapper,
        root: rootWrapper,
      },
      screenTransitionInteractionDisabled: {},
      screens: {
        detail: {
          view: detailControllerView,
        },
        root: {
          view: rootControllerView,
        },
      },
    };

    expect(
      __nativeScriptApplyStackTransitionInteractivityForTests(
        ['root', 'detail'],
        registry,
        'detail',
      ),
    ).toBe(true);
    expect(registry.screenTransitionInteractionDisabled.root).toBe(true);
    expect(registry.screenTransitionInteractionDisabled.detail).toBeUndefined();
    expect(rootControllerView.userInteractionEnabled).toBe(false);
    expect(rootWrapper.userInteractionEnabled).toBe(false);
    expect(detailControllerView.userInteractionEnabled).toBe(true);
    expect(detailWrapper.userInteractionEnabled).toBe(true);

    expect(
      __nativeScriptApplyScreenTransitionInteractionDisabledForTests(
        'root',
        registry,
        false,
      ),
    ).toBe(true);
    expect(registry.screenTransitionInteractionDisabled.root).toBeUndefined();
    expect(rootControllerView.userInteractionEnabled).toBe(true);
    expect(rootWrapper.userInteractionEnabled).toBe(true);

    expect(stackSource).toContain(
      'applyStackTransitionInteractivity(\n' +
        '        availableIds,\n' +
        '        registry,\n' +
        '        pushedScreenId,\n' +
        '      );',
    );
    expect(stackSource).toContain(
      'applyStackTransitionInteractivity(\n' +
        '        previousIds,\n' +
        '        registry,\n' +
        '        revealedScreenId,\n' +
        '      );',
    );
    expect(stackSource).toContain(
      "reason=transition-interaction-disabled",
    );
    expect(stackSource).toContain(
      'layoutHostedReactSubviews.skipTransitionInteraction',
    );
    expect(stackSource).toContain(
      'refreshHosted.skipTransitionInteraction',
    );
  });

  it('keeps settled covered stack screens non-interactive after transitions', () => {
    const rootControllerView: any = {
      userInteractionEnabled: true,
    };
    const detailControllerView: any = {
      userInteractionEnabled: true,
    };
    const rootWrapper: any = {
      userInteractionEnabled: true,
    };
    const detailWrapper: any = {
      userInteractionEnabled: true,
    };
    const rootController = {
      view: rootControllerView,
    };
    const detailController = {
      view: detailControllerView,
    };
    const registry: any = {
      screenContentWrapperViews: {
        detail: detailWrapper,
        root: rootWrapper,
      },
      screenTransitionInteractionDisabled: {},
      screens: {
        detail: detailController,
        root: rootController,
      },
      stackActiveScreenIds: {
        stack: ['root', 'detail'],
      },
    };
    const navigationController = {
      viewControllers: [rootController, detailController],
    };

    expect(
      __nativeScriptApplyStackSettledInteractivityForTests(
        'stack',
        registry,
        navigationController,
      ),
    ).toBe(true);
    expect(registry.screenTransitionInteractionDisabled.root).toBe(true);
    expect(registry.screenTransitionInteractionDisabled.detail).toBeUndefined();
    expect(rootControllerView.userInteractionEnabled).toBe(false);
    expect(rootWrapper.userInteractionEnabled).toBe(false);
    expect(detailControllerView.userInteractionEnabled).toBe(true);
    expect(detailWrapper.userInteractionEnabled).toBe(true);
    expect(stackSource).toContain(
      'applyStackSettledInteractivity(stackId, registry, navigationController)',
    );
  });

  it('removes nested empty host plumbing from the route body touch path', () => {
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };
    const visibleRouteContent = {
      alpha: 1,
      frame,
      hidden: false,
      subviews: [
        {
          alpha: 1,
          frame: {
            origin: { x: 18, y: 583 },
            size: { height: 50, width: 366 },
          },
          hidden: false,
          subviews: [],
          userInteractionEnabled: true,
        },
      ],
      userInteractionEnabled: true,
    };
    const nestedEmptyHostPlumbing: any = {
      __nativeScriptClassName: 'UIView',
      accessibilityIdentifier: null,
      accessibilityLabel: null,
      alpha: 1,
      frame,
      gestureRecognizers: [] as any[],
      hidden: false,
      subviews: [],
      tag: 0,
      userInteractionEnabled: true,
    };
    const nestedContainer = {
      alpha: 1,
      bounds: frame,
      frame,
      hidden: false,
      subviews: [visibleRouteContent, nestedEmptyHostPlumbing],
      userInteractionEnabled: true,
    };
    const screenView = {
      alpha: 1,
      bounds: frame,
      frame,
      hidden: false,
      subviews: [nestedContainer],
      userInteractionEnabled: true,
    };

    expect(
      __nativeScriptDisableStaleEmptyScreenHitTargetDescendantsForTests(
        screenView,
      ),
    ).toBe(true);
    expect(nestedEmptyHostPlumbing.userInteractionEnabled).toBe(false);
    expect(nestedEmptyHostPlumbing.accessibilityElementsHidden).toBe(true);
    expect(visibleRouteContent.userInteractionEnabled).toBe(true);
  });

  it('repairs stale narrow scroll content roots after native push reparenting', () => {
    const frame = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { height, width },
    });
    const parentBounds = frame(402, 731.333);
    const staleContentRoot: any = {
      alpha: 1,
      autoresizingMask: 0,
      bounds: frame(358, 588.667),
      frame: frame(358, 588.667),
      hidden: false,
      isKindOfClass: () => false,
      subviews: [
        {
          alpha: 1,
          frame: frame(322, 36, 18, 18),
          hidden: false,
        },
        {
          alpha: 1,
          frame: frame(358, 437, 18, 170),
          hidden: false,
        },
        {
          alpha: 1,
          frame: frame(366, 132.333, 18, 533),
          hidden: false,
        },
      ],
    };
    const scrollContentContainer: any = {
      alpha: 1,
      bounds: parentBounds,
      frame: parentBounds,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [staleContentRoot],
    };

    staleContentRoot.superview = scrollContentContainer;
    for (const child of staleContentRoot.subviews) {
      child.subviews = [];
      child.superview = staleContentRoot;
    }

    __nativeScriptLayoutHostedSubviewChainForTests(
      scrollContentContainer,
      0,
      874,
    );

    expect(staleContentRoot.frame).toEqual(parentBounds);
    expect(staleContentRoot.bounds).toEqual(parentBounds);
    expect(staleContentRoot.autoresizingMask).toBe(18);
  });

  it('preserves measured zero-origin content leaves while repairing modal host wrappers', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const UIScrollView = function UIScrollView() {};
    const RCTParagraphComponentView = function RCTParagraphComponentView() {};
    const frame = (width: number, height: number) => ({
      origin: { x: 0, y: 0 },
      size: { width, height },
    });
    const modalBounds = frame(402, 728.333);

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      RCTParagraphComponentView,
      UIScrollView,
    };

    try {
      const textLeaf: any = {
        alpha: 1,
        autoresizingMask: 0,
        bounds: frame(366, 92),
        frame: frame(366, 92),
        hidden: false,
        isKindOfClass: () => false,
        subviews: [],
      };
      const textContainer: any = {
        alpha: 1,
        autoresizingMask: 0,
        bounds: modalBounds,
        frame: modalBounds,
        hidden: false,
        isKindOfClass: () => false,
        subviews: [textLeaf],
      };

      textLeaf.superview = textContainer;

      __nativeScriptLayoutHostedSubviewChainForTests(
        textContainer,
        0,
        modalBounds.size.height,
      );

      expect(textLeaf.frame).toEqual(frame(366, 92));
      expect(textLeaf.bounds).toEqual(frame(366, 92));

      const contentSizedTextLeaf: any = {
        alpha: 1,
        autoresizingMask: 0,
        bounds: frame(402, 92),
        contentSize: { width: 402, height: 92 },
        frame: frame(402, 92),
        hidden: false,
        isKindOfClass: () => false,
        subviews: [],
      };
      const contentSizedTextContainer: any = {
        alpha: 1,
        autoresizingMask: 0,
        bounds: modalBounds,
        frame: modalBounds,
        hidden: false,
        isKindOfClass: () => false,
        subviews: [contentSizedTextLeaf],
      };

      contentSizedTextLeaf.superview = contentSizedTextContainer;

      __nativeScriptLayoutHostedSubviewChainForTests(
        contentSizedTextContainer,
        0,
        modalBounds.size.height,
      );

      expect(contentSizedTextLeaf.frame).toEqual(frame(402, 92));
      expect(contentSizedTextLeaf.bounds).toEqual(frame(402, 92));

      const decoratedTextLeaf: any = {
        alpha: 1,
        autoresizingMask: 0,
        bounds: frame(366, 92),
        frame: frame(366, 92),
        hidden: false,
        isKindOfClass: () => false,
        subviews: [
          {
            alpha: 1,
            frame: frame(366, 20),
            hidden: false,
          },
        ],
      };
      const decoratedTextContainer: any = {
        alpha: 1,
        autoresizingMask: 0,
        bounds: modalBounds,
        frame: modalBounds,
        hidden: false,
        isKindOfClass: () => false,
        subviews: [decoratedTextLeaf],
      };

      decoratedTextLeaf.superview = decoratedTextContainer;

      __nativeScriptLayoutHostedSubviewChainForTests(
        decoratedTextContainer,
        0,
        modalBounds.size.height,
      );

      expect(decoratedTextLeaf.frame).toEqual(frame(366, 92));
      expect(decoratedTextLeaf.bounds).toEqual(frame(366, 92));

      const selectableParagraphLeaf: any = {
        alpha: 1,
        autoresizingMask: 0,
        bounds: frame(366, 69),
        frame: frame(366, 69),
        hidden: false,
        isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
        subviews: [
          {
            alpha: 1,
            frame: frame(366, 69),
            hidden: false,
          },
        ],
      };
      const selectableParagraphContainer: any = {
        alpha: 1,
        autoresizingMask: 0,
        bounds: {
          origin: { x: 0, y: 0 },
          size: { width: 366, height: 728.333 },
        },
        frame: {
          origin: { x: 0, y: 0 },
          size: { width: 366, height: 728.333 },
        },
        hidden: false,
        isKindOfClass: () => false,
        subviews: [selectableParagraphLeaf],
      };

      selectableParagraphLeaf.superview = selectableParagraphContainer;

      __nativeScriptLayoutHostedSubviewChainForTests(
        selectableParagraphContainer,
        0,
        modalBounds.size.height,
      );

      expect(selectableParagraphLeaf.frame).toEqual(frame(366, 69));
      expect(selectableParagraphLeaf.bounds).toEqual(frame(366, 69));

      const fullWidthDecoratedTextLeaf: any = {
        alpha: 1,
        autoresizingMask: 0,
        bounds: frame(366, 36),
        frame: frame(366, 36),
        hidden: false,
        isKindOfClass: () => false,
        subviews: [
          {
            alpha: 1,
            frame: frame(366, 36),
            hidden: false,
          },
        ],
      };
      const fullWidthDecoratedTextContainer: any = {
        alpha: 1,
        autoresizingMask: 0,
        bounds: {
          origin: { x: 0, y: 0 },
          size: { width: 366, height: 728.333 },
        },
        frame: {
          origin: { x: 0, y: 0 },
          size: { width: 366, height: 728.333 },
        },
        hidden: false,
        isKindOfClass: () => false,
        subviews: [fullWidthDecoratedTextLeaf],
      };

      fullWidthDecoratedTextLeaf.superview = fullWidthDecoratedTextContainer;

      __nativeScriptLayoutHostedSubviewChainForTests(
        fullWidthDecoratedTextContainer,
        0,
        modalBounds.size.height,
      );

      expect(fullWidthDecoratedTextLeaf.frame).toEqual(frame(366, 36));
      expect(fullWidthDecoratedTextLeaf.bounds).toEqual(frame(366, 36));

      const selectableTextLeaf: any = {
        accessibilityLabel:
          'This route uses React Navigation presentation options.',
        alpha: 1,
        autoresizingMask: 0,
        bounds: frame(402, 92),
        frame: frame(402, 92),
        hidden: false,
        isAccessibilityElement: true,
        isKindOfClass: () => false,
        subviews: [
          {
            alpha: 1,
            frame: frame(402, 20),
            hidden: false,
          },
        ],
      };
      const selectableTextContainer: any = {
        alpha: 1,
        autoresizingMask: 0,
        bounds: modalBounds,
        frame: modalBounds,
        hidden: false,
        isKindOfClass: () => false,
        subviews: [selectableTextLeaf],
      };

      selectableTextLeaf.superview = selectableTextContainer;

      __nativeScriptLayoutHostedSubviewChainForTests(
        selectableTextContainer,
        0,
        modalBounds.size.height,
      );

      expect(selectableTextLeaf.frame).toEqual(frame(402, 92));
      expect(selectableTextLeaf.bounds).toEqual(frame(402, 92));

      const nativeAccessorTextLeaf: any = {
        accessibilityLabel: jest.fn(
          () => 'This route uses React Navigation presentation options.',
        ),
        alpha: 1,
        autoresizingMask: 0,
        bounds: frame(402, 92),
        frame: frame(402, 92),
        hidden: false,
        isAccessibilityElement: jest.fn(() => true),
        isKindOfClass: () => false,
        subviews: [
          {
            alpha: 1,
            frame: frame(402, 20),
            hidden: false,
          },
        ],
      };
      const nativeAccessorTextContainer: any = {
        alpha: 1,
        autoresizingMask: 0,
        bounds: modalBounds,
        frame: modalBounds,
        hidden: false,
        isKindOfClass: () => false,
        subviews: [nativeAccessorTextLeaf],
      };

      nativeAccessorTextLeaf.superview = nativeAccessorTextContainer;

      __nativeScriptLayoutHostedSubviewChainForTests(
        nativeAccessorTextContainer,
        0,
        modalBounds.size.height,
      );

      expect(nativeAccessorTextLeaf.frame).toEqual(frame(402, 92));
      expect(nativeAccessorTextLeaf.bounds).toEqual(frame(402, 92));
      expect(nativeAccessorTextLeaf.isAccessibilityElement).toHaveBeenCalled();

      const kvcTextLeaf: any = {
        alpha: 1,
        autoresizingMask: 0,
        bounds: frame(402, 92),
        frame: frame(402, 92),
        hidden: false,
        isKindOfClass: () => false,
        subviews: [
          {
            alpha: 1,
            frame: frame(402, 20),
            hidden: false,
          },
        ],
        valueForKey: jest.fn((key: string) =>
          key === 'accessibilityLabel'
            ? 'This route uses React Navigation presentation options.'
            : null,
        ),
      };
      const kvcTextContainer: any = {
        alpha: 1,
        autoresizingMask: 0,
        bounds: modalBounds,
        frame: modalBounds,
        hidden: false,
        isKindOfClass: () => false,
        subviews: [kvcTextLeaf],
      };

      kvcTextLeaf.superview = kvcTextContainer;

      __nativeScriptLayoutHostedSubviewChainForTests(
        kvcTextContainer,
        0,
        modalBounds.size.height,
      );

      expect(kvcTextLeaf.frame).toEqual(frame(402, 92));
      expect(kvcTextLeaf.bounds).toEqual(frame(402, 92));
      expect(kvcTextLeaf.valueForKey).toHaveBeenCalledWith(
        'accessibilityLabel',
      );

      const inflatedSelectableTextLeaf: any = {
        accessibilityLabel:
          'Pushed with navigation.push. The visible back button is the system UIKit button in minimal display mode, and the edge swipe should pop this route.',
        alpha: 1,
        autoresizingMask: 0,
        bounds: frame(366, 92),
        frame: frame(366, 92),
        hidden: false,
        isAccessibilityElement: true,
        isKindOfClass: () => false,
        subviews: [
          {
            alpha: 1,
            frame: frame(366, 874),
            hidden: false,
          },
        ],
      };
      const inflatedSelectableTextContainer: any = {
        alpha: 1,
        autoresizingMask: 0,
        bounds: {
          origin: { x: 0, y: 0 },
          size: { width: 366, height: 728.333 },
        },
        frame: {
          origin: { x: 0, y: 0 },
          size: { width: 366, height: 728.333 },
        },
        hidden: false,
        isKindOfClass: () => false,
        subviews: [inflatedSelectableTextLeaf],
      };

      inflatedSelectableTextLeaf.superview = inflatedSelectableTextContainer;

      __nativeScriptLayoutHostedSubviewChainForTests(
        inflatedSelectableTextContainer,
        0,
        modalBounds.size.height,
      );

      expect(inflatedSelectableTextLeaf.frame).toEqual(frame(366, 92));
      expect(inflatedSelectableTextLeaf.bounds).toEqual(frame(366, 92));

      const describedParagraphTextLeaf: any = {
        alpha: 1,
        autoresizingMask: 0,
        bounds: frame(366, 92),
        description: '<RCTParagraphComponentView: 0x1234>',
        frame: frame(366, 92),
        hidden: false,
        isKindOfClass: () => false,
        subviews: [
          {
            alpha: 1,
            frame: frame(366, 874),
            hidden: false,
          },
        ],
      };
      const describedParagraphTextContainer: any = {
        alpha: 1,
        autoresizingMask: 0,
        bounds: {
          origin: { x: 0, y: 0 },
          size: { width: 366, height: 728.333 },
        },
        frame: {
          origin: { x: 0, y: 0 },
          size: { width: 366, height: 728.333 },
        },
        hidden: false,
        isKindOfClass: () => false,
        subviews: [describedParagraphTextLeaf],
      };

      describedParagraphTextLeaf.superview = describedParagraphTextContainer;

      __nativeScriptLayoutHostedSubviewChainForTests(
        describedParagraphTextContainer,
        0,
        modalBounds.size.height,
      );

      expect(describedParagraphTextLeaf.frame).toEqual(frame(366, 92));
      expect(describedParagraphTextLeaf.bounds).toEqual(frame(366, 92));
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('does not assign wrapper autoresizing to transient ScrollView paragraph leaves', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const UIScrollView = function UIScrollView() {};
    const RCTParagraphComponentView = function RCTParagraphComponentView() {};
    const frame = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { width, height },
    });
    const paragraph: any = {
      alpha: 1,
      autoresizingMask: 0,
      bounds: frame(366, 36),
      frame: frame(366, 36),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [
        {
          alpha: 1,
          frame: frame(366, 36),
          hidden: false,
        },
      ],
    };
    const staleParagraph: any = {
      alpha: 1,
      autoresizingMask: 18,
      bounds: frame(366, 69),
      frame: frame(366, 69, 0, 44),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [
        {
          alpha: 1,
          frame: frame(366, 69),
          hidden: false,
        },
      ],
    };
    const hostWrapper: any = {
      alpha: 1,
      autoresizingMask: 0,
      bounds: frame(300, 812),
      frame: frame(300, 812, 0, 128),
      hidden: false,
      isKindOfClass: () => false,
      subviews: [
        {
          alpha: 1,
          frame: frame(402, 812),
          hidden: false,
        },
      ],
    };
    const scrollView: any = {
      autoresizingMask: 0,
      bounds: frame(402, 812),
      contentSize: { width: 402, height: 812 },
      frame: frame(402, 812),
      isKindOfClass: (klass: unknown) => klass === UIScrollView,
      subviews: [paragraph, staleParagraph, hostWrapper],
    };

    paragraph.superview = scrollView;
    staleParagraph.superview = scrollView;
    hostWrapper.superview = scrollView;

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      RCTParagraphComponentView,
      UIScrollView,
    };

    try {
      __nativeScriptLayoutHostedSubviewChainForTests(scrollView, 0, 812);

      expect(paragraph.frame).toEqual(frame(366, 36));
      expect(paragraph.bounds).toEqual(frame(366, 36));
      expect(paragraph.autoresizingMask).toBe(0);
      expect(staleParagraph.frame).toEqual(frame(366, 69, 0, 44));
      expect(staleParagraph.bounds).toEqual(frame(366, 69));
      expect(staleParagraph.autoresizingMask).toBe(0);
      expect(hostWrapper.frame).toEqual(frame(402, 812));
      expect(hostWrapper.bounds).toEqual(frame(402, 812));
      expect(hostWrapper.autoresizingMask).toBe(0);
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('preserves accessibility-bearing direct children while refreshing hosted views', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostView;
    const refreshUIKitHostView = jest.fn(() => true);
    const frame = (width: number, height: number) => ({
      origin: { x: 0, y: 0 },
      size: { width, height },
    });
    const rootBounds = frame(402, 874);
    const selectableTextLeaf: any = {
      accessibilityLabel: 'UIKit presentation',
      alpha: 1,
      autoresizingMask: 0,
      bounds: frame(402, 22),
      frame: frame(402, 22),
      hidden: false,
      isAccessibilityElement: true,
      isKindOfClass: () => false,
      subviews: [
        {
          alpha: 1,
          frame: frame(402, 20),
          hidden: false,
        },
      ],
    };
    const rootView: any = {
      bounds: rootBounds,
      frame: rootBounds,
      refreshSurfaceTouchHandler: jest.fn(),
      subviews: [selectableTextLeaf],
      userInteractionEnabled: false,
    };

    selectableTextLeaf.superview = rootView;
    NativeScriptRuntime.refreshUIKitHostView = refreshUIKitHostView;

    try {
      __nativeScriptLayoutHostedReactSubviewsForTests({ view: rootView });

      expect(refreshUIKitHostView).toHaveBeenCalledWith(rootView);
      expect(rootView.userInteractionEnabled).toBe(true);
      expect(selectableTextLeaf.frame).toEqual(frame(402, 22));
      expect(selectableTextLeaf.bounds).toEqual(frame(402, 22));
    } finally {
      NativeScriptRuntime.refreshUIKitHostView = previousRefreshUIKitHostView;
    }
  });

  it('does not shrink accessible controls with Yoga-reserved minHeight to their text child', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const RCTParagraphComponentView = function RCTParagraphComponentView() {};
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { width, height },
    });
    const rootBounds = frame(402, 934.667);
    const buttonText: any = {
      alpha: 1,
      bounds: frame(91, 19.333),
      description: '<RCTParagraphComponentView: 0xbutton>',
      frame: frame(91, 19.333, 137.333, 15.333),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const primaryButton: any = {
      accessibilityLabel: 'Push React Navigation detail',
      alpha: 1,
      bounds: frame(366, 50),
      frame: frame(366, 50, 18, 427.333),
      hidden: false,
      isAccessibilityElement: true,
      isKindOfClass: () => false,
      setNeedsLayout: jest.fn(),
      subviews: [buttonText],
    };
    const secondaryButton: any = {
      accessibilityLabel: 'Present React Navigation modal',
      alpha: 1,
      bounds: frame(366, 48),
      frame: frame(366, 48, 18, 493.333),
      hidden: false,
      isAccessibilityElement: true,
      isKindOfClass: () => false,
      subviews: [],
    };
    const rootView: any = {
      alpha: 1,
      bounds: rootBounds,
      frame: rootBounds,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [primaryButton, secondaryButton],
    };

    primaryButton.superview = rootView;
    buttonText.superview = primaryButton;
    secondaryButton.superview = rootView;

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      RCTParagraphComponentView,
      UIScrollView,
    };

    try {
      __nativeScriptLayoutHostedSubviewChainForTests(
        rootView,
        0,
        rootBounds.size.height,
        [],
        undefined,
        0,
        true,
      );

      expect(primaryButton.frame).toEqual(frame(366, 50, 18, 427.333));
      expect(primaryButton.bounds).toEqual(frame(366, 50));
      expect(primaryButton.setNeedsLayout).not.toHaveBeenCalled();
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('preserves measured paragraph wrappers whose internal text child overflows', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const RCTParagraphComponentView = function RCTParagraphComponentView() {};
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number) => ({
      origin: { x: 0, y: 0 },
      size: { width, height },
    });
    const modalBounds = frame(402, 728.333);
    const paragraphChild: any = {
      alpha: 1,
      bounds: frame(402, 373.667),
      description: '<RCTParagraphComponentView: 0x1234>',
      frame: frame(402, 373.667),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const measuredTextWrapper: any = {
      alpha: 1,
      autoresizingMask: 0,
      bounds: frame(366, 69),
      frame: frame(366, 69),
      hidden: false,
      isKindOfClass: () => false,
      subviews: [paragraphChild],
    };
    const modalHost: any = {
      alpha: 1,
      bounds: modalBounds,
      frame: modalBounds,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [measuredTextWrapper],
    };

    paragraphChild.superview = measuredTextWrapper;
    measuredTextWrapper.superview = modalHost;

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      RCTParagraphComponentView,
      UIScrollView,
    };

    try {
      __nativeScriptLayoutHostedSubviewChainForTests(
        modalHost,
        0,
        modalBounds.size.height,
      );

      expect(measuredTextWrapper.frame).toEqual(frame(366, 69));
      expect(measuredTextWrapper.bounds).toEqual(frame(366, 69));
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('repairs stale Fabric paragraph leaves while refreshing hosted views', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const RCTParagraphComponentView = function RCTParagraphComponentView() {};
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { width, height },
    });
    const modalBounds = frame(402, 728.333);
    const paragraphChild: any = {
      accessibilityLabel: 'Modal route description',
      accessibilityFrame: frame(402, 373.667),
      alpha: 1,
      bounds: frame(402, 373.667),
      description: '<RCTParagraphComponentView: 0x1234>',
      frame: frame(402, 373.667),
      hidden: false,
      isAccessibilityElement: true,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const measuredTextWrapper: any = {
      alpha: 1,
      autoresizingMask: 0,
      bounds: frame(366, 69),
      convertRectToView: jest.fn(() => frame(366, 69, 18, 194)),
      frame: frame(366, 69, 18, 194),
      hidden: false,
      isKindOfClass: () => false,
      subviews: [paragraphChild],
    };
    const modalHost: any = {
      alpha: 1,
      bounds: modalBounds,
      frame: modalBounds,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [measuredTextWrapper],
    };

    paragraphChild.superview = measuredTextWrapper;
    measuredTextWrapper.superview = modalHost;

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      RCTParagraphComponentView,
      UIScrollView,
    };

    try {
      __nativeScriptLayoutHostedSubviewChainForTests(
        modalHost,
        0,
        modalBounds.size.height,
      );

      expect(measuredTextWrapper.frame).toEqual(frame(366, 69, 18, 194));
      expect(paragraphChild.frame).toEqual(frame(366, 69));
      expect(paragraphChild.bounds).toEqual(frame(366, 69));
      expect(paragraphChild.accessibilityFrame).toEqual(
        frame(366, 69, 18, 194),
      );
      expect(measuredTextWrapper.convertRectToView).toHaveBeenCalledWith(
        frame(366, 69),
        null,
      );
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('repairs direct stale Fabric paragraph leaves that overlap following modal content', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const RCTParagraphComponentView = function RCTParagraphComponentView() {};
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { width, height },
    });
    const modalBounds = frame(402, 728.333);
    const titleChild: any = {
      accessibilityLabel: 'Modal route',
      alpha: 1,
      bounds: frame(366, 36),
      description: '<RCTParagraphComponentView: 0x5678>',
      frame: frame(366, 36, 18, 150),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const paragraphChild: any = {
      accessibilityFrame: frame(402, 373.667, 18, 194),
      accessibilityLabel:
        'This route uses React Navigation presentation options. It is included to keep checking modal stack semantics as the NativeScript port grows.',
      alpha: 1,
      bounds: frame(402, 373.667),
      convertRectToView: jest.fn((rect: any) =>
        frame(rect.size.width, rect.size.height, 18, 194),
      ),
      description: '<RCTParagraphComponentView: 0x1234>',
      frame: frame(402, 373.667, 18, 194),
      hidden: false,
      isAccessibilityElement: true,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      setNeedsLayout: jest.fn(),
      subviews: [],
    };
    const firstCardBackground: any = {
      accessibilityLabel: '',
      alpha: 1,
      bounds: frame(366, 138),
      frame: frame(366, 138, 18, 279.333),
      hidden: false,
      isKindOfClass: () => false,
      subviews: [],
    };
    const firstCardTitle: any = {
      accessibilityLabel: 'UIKit presentation',
      alpha: 1,
      bounds: frame(333.333, 21.667),
      description: '<RCTParagraphComponentView: 0x9012>',
      frame: frame(333.333, 21.667, 34.333, 295.333),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const modalHost: any = {
      alpha: 1,
      bounds: modalBounds,
      frame: modalBounds,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [
        titleChild,
        paragraphChild,
        firstCardBackground,
        firstCardTitle,
      ],
    };

    titleChild.superview = modalHost;
    paragraphChild.superview = modalHost;
    firstCardBackground.superview = modalHost;
    firstCardTitle.superview = modalHost;

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      RCTParagraphComponentView,
      UIScrollView,
    };

    try {
      __nativeScriptLayoutHostedSubviewChainForTests(
        modalHost,
        0,
        modalBounds.size.height,
        [],
        undefined,
        0,
        true,
      );

      expect(paragraphChild.frame.origin).toEqual({ x: 18, y: 194 });
      expect(paragraphChild.frame.size.width).toBe(366);
      expect(paragraphChild.frame.size.height).toBeCloseTo(69.333);
      expect(paragraphChild.bounds.size.width).toBe(366);
      expect(paragraphChild.bounds.size.height).toBeCloseTo(69.333);
      expect(paragraphChild.accessibilityFrame.size.width).toBe(366);
      expect(paragraphChild.accessibilityFrame.size.height).toBeCloseTo(69.333);
      expect(paragraphChild.setNeedsLayout).toHaveBeenCalled();
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('does not clamp valid multi-column Fabric paragraph leaves to unrelated columns', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const RCTParagraphComponentView = function RCTParagraphComponentView() {};
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { width, height },
    });
    const rootBounds = frame(402, 961);
    const transitionEventLabel: any = {
      alpha: 1,
      bounds: frame(85.333, 28.667),
      description: '<RCTParagraphComponentView: TRANSITION EVENT>',
      frame: frame(85.333, 28.667, 32.333, 628.333),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      setNeedsLayout: jest.fn(),
      subviews: [],
    };
    const headerPingsLabel: any = {
      alpha: 1,
      bounds: frame(85.333, 28.667),
      description: '<RCTParagraphComponentView: HEADER PINGS>',
      frame: frame(85.333, 28.667, 158.333, 602),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      setNeedsLayout: jest.fn(),
      subviews: [],
    };
    const iosTargetLabel: any = {
      alpha: 1,
      bounds: frame(85.333, 14.333),
      description: '<RCTParagraphComponentView: IOS TARGET>',
      frame: frame(85.333, 14.333, 284.333, 602),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const menuActionsLabel: any = {
      alpha: 1,
      bounds: frame(337.333, 14.333),
      description: '<RCTParagraphComponentView: MENU ACTIONS>',
      frame: frame(337.333, 14.333, 32.333, 669),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const rootView: any = {
      alpha: 1,
      bounds: rootBounds,
      frame: rootBounds,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [
        transitionEventLabel,
        headerPingsLabel,
        iosTargetLabel,
        menuActionsLabel,
      ],
    };

    transitionEventLabel.superview = rootView;
    headerPingsLabel.superview = rootView;
    iosTargetLabel.superview = rootView;
    menuActionsLabel.superview = rootView;

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      RCTParagraphComponentView,
      UIScrollView,
    };

    try {
      __nativeScriptLayoutHostedSubviewChainForTests(
        rootView,
        0,
        rootBounds.size.height,
        [],
        undefined,
        0,
        true,
      );

      expect(headerPingsLabel.frame).toEqual(
        frame(85.333, 28.667, 158.333, 602),
      );
      expect(headerPingsLabel.bounds).toEqual(frame(85.333, 28.667));
      expect(headerPingsLabel.setNeedsLayout).not.toHaveBeenCalled();
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('force scans refreshed hosted React subviews for direct stale modal text', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const refreshUIKitHostView = jest.fn(() => true);
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const RCTParagraphComponentView = function RCTParagraphComponentView() {};
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { width, height },
    });
    const modalBounds = frame(402, 728.333);
    const titleChild: any = {
      accessibilityLabel: 'Modal route',
      alpha: 1,
      bounds: frame(366, 36),
      description: '<RCTParagraphComponentView: 0x5678>',
      frame: frame(366, 36, 18, 150),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const paragraphChild: any = {
      accessibilityFrame: frame(402, 373.667, 18, 194),
      accessibilityLabel:
        'This route uses React Navigation presentation options. It is included to keep checking modal stack semantics as the NativeScript port grows.',
      alpha: 1,
      bounds: frame(402, 373.667),
      convertRectToView: jest.fn((rect: any) =>
        frame(rect.size.width, rect.size.height, 18, 194),
      ),
      description: '<RCTParagraphComponentView: 0x1234>',
      frame: frame(402, 373.667, 18, 194),
      hidden: false,
      isAccessibilityElement: true,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      setNeedsLayout: jest.fn(),
      subviews: [],
    };
    const firstCardBackground: any = {
      accessibilityLabel: '',
      alpha: 1,
      bounds: frame(366, 138),
      frame: frame(366, 138, 18, 279.333),
      hidden: false,
      isKindOfClass: () => false,
      subviews: [],
    };
    const firstCardTitle: any = {
      accessibilityLabel: 'UIKit presentation',
      alpha: 1,
      bounds: frame(333.333, 21.667),
      description: '<RCTParagraphComponentView: 0x9012>',
      frame: frame(333.333, 21.667, 34.333, 295.333),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const modalHost: any = {
      alpha: 1,
      bounds: modalBounds,
      frame: modalBounds,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [
        titleChild,
        paragraphChild,
        firstCardBackground,
        firstCardTitle,
      ],
    };
    const rootView: any = {
      bounds: modalBounds,
      frame: modalBounds,
      refreshSurfaceTouchHandler: jest.fn(),
      subviews: [modalHost],
      userInteractionEnabled: false,
    };

    modalHost.superview = rootView;
    titleChild.superview = modalHost;
    paragraphChild.superview = modalHost;
    firstCardBackground.superview = modalHost;
    firstCardTitle.superview = modalHost;
    NativeScriptRuntime.refreshUIKitHostView = refreshUIKitHostView;
    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      RCTParagraphComponentView,
      UIScrollView,
    };

    try {
      __nativeScriptLayoutHostedReactSubviewsForTests({ view: rootView });

      expect(refreshUIKitHostView).toHaveBeenCalledWith(rootView);
      expect(paragraphChild.frame.origin).toEqual({ x: 18, y: 194 });
      expect(paragraphChild.frame.size.width).toBe(366);
      expect(paragraphChild.frame.size.height).toBeCloseTo(69.333);
      expect(paragraphChild.bounds.size.width).toBe(366);
      expect(paragraphChild.bounds.size.height).toBeCloseTo(69.333);
      expect(paragraphChild.accessibilityFrame.size.width).toBe(366);
      expect(paragraphChild.accessibilityFrame.size.height).toBeCloseTo(69.333);
      expect(paragraphChild.setNeedsLayout).toHaveBeenCalled();

      const wrappedParagraphLeaf: any = {
        alpha: 1,
        bounds: frame(366, 69.333),
        description: '<RCTParagraphComponentView: 0xabcd>',
        frame: frame(366, 69.333),
        hidden: false,
        isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
        subviews: [],
      };
      const wrappedParagraph: any = {
        accessibilityLabel:
          'This route uses React Navigation presentation options. It is included to keep checking modal stack semantics as the NativeScript port grows.',
        alpha: 1,
        bounds: frame(402, 373.667),
        frame: frame(402, 373.667, 18, 194),
        hidden: false,
        isAccessibilityElement: true,
        isKindOfClass: () => false,
        setNeedsLayout: jest.fn(),
        subviews: [wrappedParagraphLeaf],
      };
      const wrappedCardBackground: any = {
        alpha: 1,
        bounds: frame(366, 138),
        frame: frame(366, 138, 18, 279.333),
        hidden: false,
        isKindOfClass: () => false,
        subviews: [],
      };
      const wrappedModalHost: any = {
        alpha: 1,
        bounds: modalBounds,
        frame: modalBounds,
        hidden: false,
        isKindOfClass: () => false,
        subviews: [wrappedParagraph, wrappedCardBackground],
      };

      wrappedParagraph.superview = wrappedModalHost;
      wrappedParagraphLeaf.superview = wrappedParagraph;
      wrappedCardBackground.superview = wrappedModalHost;

      __nativeScriptLayoutHostedSubviewChainForTests(
        wrappedModalHost,
        0,
        modalBounds.size.height,
        [],
        undefined,
        0,
        true,
      );

      expect(wrappedParagraph.frame.size.width).toBe(366);
      expect(wrappedParagraph.frame.size.height).toBeCloseTo(69.333);
      expect(wrappedParagraph.bounds.size.width).toBe(366);
      expect(wrappedParagraph.bounds.size.height).toBeCloseTo(69.333);
      expect(wrappedParagraph.setNeedsLayout).toHaveBeenCalled();

      const measuredWrapperLeaf: any = {
        alpha: 1,
        bounds: frame(366, 69.333),
        description: '<RCTParagraphComponentView: 0xdcba>',
        frame: frame(366, 69.333),
        hidden: false,
        isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
        subviews: [],
      };
      const measuredWrapper: any = {
        alpha: 1,
        bounds: frame(402, 373.667),
        frame: frame(402, 373.667, 18, 194),
        hidden: false,
        isKindOfClass: () => false,
        setNeedsLayout: jest.fn(),
        subviews: [measuredWrapperLeaf],
      };
      const measuredWrapperSibling: any = {
        alpha: 1,
        bounds: frame(366, 138),
        frame: frame(366, 138, 18, 279.333),
        hidden: false,
        isKindOfClass: () => false,
        subviews: [],
      };
      const measuredWrapperHost: any = {
        alpha: 1,
        bounds: modalBounds,
        frame: modalBounds,
        hidden: false,
        isKindOfClass: () => false,
        subviews: [measuredWrapper, measuredWrapperSibling],
      };

      measuredWrapper.superview = measuredWrapperHost;
      measuredWrapperLeaf.superview = measuredWrapper;
      measuredWrapperSibling.superview = measuredWrapperHost;

      __nativeScriptLayoutHostedSubviewChainForTests(
        measuredWrapperHost,
        0,
        modalBounds.size.height,
        [],
        undefined,
        0,
        true,
      );

      expect(measuredWrapper.frame.size.width).toBe(366);
      expect(measuredWrapper.frame.size.height).toBeCloseTo(69.333);
      expect(measuredWrapper.bounds.size.width).toBe(366);
      expect(measuredWrapper.bounds.size.height).toBeCloseTo(69.333);
      expect(measuredWrapper.setNeedsLayout).toHaveBeenCalled();

      const staleSheetHostGrandchild: any = {
        alpha: 1,
        bounds: frame(402, 437),
        frame: frame(402, 437),
        hidden: false,
        isKindOfClass: () => false,
        subviews: [],
      };
      const staleSheetHostChild: any = {
        alpha: 1,
        bounds: frame(402, 437),
        frame: frame(402, 437),
        hidden: false,
        isKindOfClass: () => false,
        subviews: [staleSheetHostGrandchild],
      };
      const staleSheetHostWrapper: any = {
        alpha: 1,
        bounds: frame(402, 437),
        frame: frame(402, 437),
        hidden: false,
        isKindOfClass: () => false,
        subviews: [staleSheetHostChild],
      };
      const staleSheetHost: any = {
        alpha: 1,
        bounds: frame(402, 812),
        frame: frame(402, 812),
        hidden: false,
        isKindOfClass: () => false,
        subviews: [staleSheetHostWrapper],
      };

      staleSheetHostWrapper.superview = staleSheetHost;
      staleSheetHostChild.superview = staleSheetHostWrapper;
      staleSheetHostGrandchild.superview = staleSheetHostChild;

      __nativeScriptLayoutHostedSubviewChainForTests(
        staleSheetHost,
        0,
        812,
        [],
        undefined,
        0,
        true,
      );

      expect(staleSheetHostWrapper.frame).toEqual(frame(402, 812));
      expect(staleSheetHostWrapper.bounds).toEqual(frame(402, 812));
      expect(staleSheetHostChild.frame).toEqual(frame(402, 812));
      expect(staleSheetHostChild.bounds).toEqual(frame(402, 812));
    } finally {
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostView;
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('skips stale UIKit lifecycle work after a screen controller is disposed', () => {
    expect(
      __nativeScriptScreenControllerLifecycleCanRunForTests({
        __nativeScriptScreenDisposed: true,
      }),
    ).toBe(false);
    expect(
      __nativeScriptScreenControllerLifecycleCanRunForTests({
        __nativeScriptScreenDisposed: false,
      }),
    ).toBe(true);

    const lifecycleSource = stackSource.slice(
      stackSource.indexOf(
        'function screenControllerLifecycleCanRun(controller: any)',
      ),
      stackSource.indexOf('function setupTransitionProgressNotification'),
    );
    const screenControllerSource = stackSource.slice(
      stackSource.indexOf('class RNSScreenNativeScriptController'),
      stackSource.indexOf(
        "const CADisplayLink = nativeValue('CADisplayLink');",
        stackSource.indexOf('class RNSScreenNativeScriptController'),
      ),
    );
    const disposeSource = stackSource.slice(
      stackSource.indexOf(
        'dispose(controller, props) {',
        stackSource.indexOf('const NativeScriptScreenController'),
      ),
      stackSource.indexOf('function containerScreenParticipatesInUIKitModel'),
    );

    expect(lifecycleSource).toContain(
      'return controller?.__nativeScriptScreenDisposed !== true;',
    );
    expect(screenControllerSource).toContain(
      'if (!screenControllerLifecycleCanRun(this))',
    );
    expect(screenControllerSource).toContain(
      "callNativeScriptControllerSuper(this, 'viewDidAppear', true, animated);",
    );
    expect(disposeSource).toContain(
      'markScreenControllerDisposed(controller);',
    );
    expect(disposeSource).toContain(
      'registry.screenContexts[props.screenId] = undefined;',
    );
  });

  it('caches NativeScript native value lookups on the UI runtime', () => {
    const nativeValueSource = stackSource.slice(
      stackSource.indexOf('function nativeValue(name: string)'),
      stackSource.indexOf('function flexibleSizeMask'),
    );

    expect(nativeValueSource).toContain('NATIVE_VALUE_CACHE_KEY');
    expect(nativeValueSource).toContain(
      'cache.__nativeScriptNativeValueCacheOwner !== cacheOwner',
    );
    expect(nativeValueSource).toContain(
      'Object.prototype.hasOwnProperty.call(cache, name)',
    );
    expect(nativeValueSource).toContain('cache[name] = value;');
    expect(nativeValueSource).toContain('api?.getClass?.(name)');
  });

  it('gates ordinary screen host refreshes once content is ready', () => {
    const registry: any = {
      screenContentReady: {},
      screenContentWrapperHostHandles: {},
      screenContentWrapperViews: {},
      screenHostHandles: {},
      screenHostRefreshKeys: {},
      screenLayoutKeys: {},
    };
    const controller: any = {};
    const view: any = {
      bounds: { origin: { x: 0, y: 0 }, size: { width: 320, height: 480 } },
      frame: { origin: { x: 0, y: 0 }, size: { width: 320, height: 480 } },
      window: {},
    };

    expect(
      __nativeScriptScreenHostedViewNeedsRefreshForTests(
        controller,
        'screen',
        registry,
        view,
      ),
    ).toBe(true);

    registry.screenContentReady.screen = true;
    registry.screenContentWrapperViews.screen = {
      description: 'RCTScrollViewComponentView',
      hidden: false,
      subviews: [],
      superview: view,
    };

    expect(
      __nativeScriptScreenHostedViewNeedsRefreshForTests(
        controller,
        'screen',
        registry,
        view,
      ),
    ).toBe(true);
    expect(
      __nativeScriptScreenHostedViewNeedsRefreshForTests(
        controller,
        'screen',
        registry,
        view,
      ),
    ).toBe(false);

    registry.screenContentWrapperViews.screen = {
      description: 'UIView',
      hidden: false,
      subviews: [],
      superview: view,
    };
    expect(
      __nativeScriptScreenHostedViewNeedsRefreshForTests(
        controller,
        'screen',
        registry,
        view,
      ),
    ).toBe(true);
    registry.screenContentWrapperViews.screen = {
      description: 'RCTScrollViewComponentView',
      hidden: false,
      subviews: [],
      superview: view,
    };

    registry.screenHostHandles.screen = 'host-1';
    expect(
      __nativeScriptScreenHostedViewNeedsRefreshForTests(
        controller,
        'screen',
        registry,
        view,
      ),
    ).toBe(true);
    expect(
      __nativeScriptScreenHostedViewNeedsRefreshForTests(
        controller,
        'screen',
        registry,
        view,
      ),
    ).toBe(false);

    view.bounds = {
      origin: { x: 0, y: 0 },
      size: { width: 320, height: 520 },
    };
    expect(
      __nativeScriptScreenHostedViewNeedsRefreshForTests(
        controller,
        'screen',
        registry,
        view,
      ),
    ).toBe(true);
    expect(
      __nativeScriptScreenHostedViewNeedsRefreshForTests(
        controller,
        'screen',
        registry,
        view,
      ),
    ).toBe(false);
    expect(
      __nativeScriptScreenHostedViewNeedsRefreshForTests(
        controller,
        'screen',
        registry,
        view,
        true,
      ),
    ).toBe(true);

    const viewDidAppearSource = stackSource.slice(
      stackSource.indexOf('viewDidAppear(animated: boolean)'),
      stackSource.indexOf("'viewDidAppear:'(animated: boolean)"),
    );
    const configureScreenSource = stackSource.slice(
      stackSource.indexOf('function configureScreenController'),
      stackSource.indexOf('function stableNativeScriptConfigValueKey'),
    );

    expect(stackSource).toContain('function screenHostedViewRefreshKey');
    expect(stackSource).toContain('screenHostRefreshKeys');
    expect(stackSource).toContain('screenLayoutKeys');
    expect(stackSource).toContain('function layoutScreenHostedReactSubviews');
    expect(stackSource).toContain(
      'const didRefreshHostedContent = layoutHostedReactSubviews(',
    );
    expect(stackSource).toContain(
      'function refreshAppearedScreenHostedContent',
    );
    expect(stackSource).toContain(
      'const canReuseReadyNativeStackContent =\n' +
        '    isNativeStackScreen &&\n' +
        '    contentWasReady &&\n' +
        '    screenHasVisibleHostedContent(screenId, registry, controllerView);',
    );
    expect(stackSource).toContain(
      'const canReuseReadyPresentedContent =\n' +
        '    !isNativeStackScreen &&\n' +
        '    contentWasReady &&\n' +
        '    screenHasVisibleHostedContent(screenId, registry, controllerView);',
    );
    expect(stackSource).toContain(
      'canReuseReadyNativeStackContent ||\n' +
        '    canReuseReadyPresentedContent ||\n' +
        '    (contentWasReady && isNativeStackScreen)',
    );
    expect(stackSource).toContain(
      'shouldRefreshHost &&\n' +
        '    didRefreshHostedContent &&\n' +
        '    screenId &&\n' +
        '    screenCanCertifyContentReady(screenId, registry)',
    );
    expect(viewDidAppearSource).toContain(
      'refreshAppearedScreenHostedContent(this, parentController);',
    );
    expect(viewDidAppearSource).not.toContain(
      'layoutScreenHostedReactSubviews(',
    );
    expect(viewDidAppearSource).not.toContain("'screen-did-appear-refresh'");
    expect(viewDidAppearSource).not.toContain(
      'layoutHostedReactSubviews(this, undefined, true, true)',
    );
    expect(configureScreenSource).toContain('layoutScreenHostedReactSubviews(');
    expect(configureScreenSource).not.toContain(
      'layoutHostedReactSubviews(controller, controllerView, true, true)',
    );
  });

  it('forces screen content readiness through the controller host even when layout is unchanged', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const originalRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostView;
    const refreshUIKitHostView = jest.fn(() => true);
    NativeScriptRuntime.refreshUIKitHostView = refreshUIKitHostView;

    const view: any = {
      bounds: { origin: { x: 0, y: 0 }, size: { width: 320, height: 480 } },
      frame: { origin: { x: 0, y: 0 }, size: { width: 320, height: 480 } },
      subviews: [],
      window: {},
    };
    const controller: any = { view };
    const registry: any = {
      screenContentReady: { screen: true },
      screenContentWrapperHostHandles: {},
      screenContentWrapperRefreshKeys: {},
      screenContentWrapperViews: {},
      screenHostHandles: {},
      screenHostRefreshKeys: {},
      screenLayoutKeys: {},
      screenProps: {
        screen: { screenId: 'screen', stackPresentation: 'push' },
      },
      screens: { screen: controller },
    };

    try {
      expect(
        __nativeScriptRefreshScreenContentReadyForTests(
          'screen',
          controller,
          registry,
          true,
        ),
      ).toBe(true);
      expect(refreshUIKitHostView).toHaveBeenCalledTimes(1);

      expect(
        __nativeScriptRefreshScreenContentReadyForTests(
          'screen',
          controller,
          registry,
          true,
        ),
      ).toBe(true);
      expect(refreshUIKitHostView).toHaveBeenCalledTimes(2);

      view.bounds = {
        origin: { x: 0, y: 0 },
        size: { width: 320, height: 520 },
      };

      expect(
        __nativeScriptRefreshScreenContentReadyForTests(
          'screen',
          controller,
          registry,
          true,
        ),
      ).toBe(true);
      expect(refreshUIKitHostView).toHaveBeenCalledTimes(3);

      expect(
        __nativeScriptRefreshScreenContentReadyForTests(
          'screen',
          controller,
          registry,
          false,
        ),
      ).toBe(true);
      expect(refreshUIKitHostView).toHaveBeenCalledTimes(3);
    } finally {
      NativeScriptRuntime.refreshUIKitHostView = originalRefreshUIKitHostView;
    }

    const refreshReadySource = stackSource.slice(
      stackSource.indexOf('function refreshScreenContentReady'),
      stackSource.indexOf(
        'function refreshPresentedModalContentAfterPresentation',
      ),
    );

    expect(stackSource).toContain(
      'function rememberScreenHostedViewRefreshKey',
    );
    expect(refreshReadySource).toContain('shouldRefreshControllerView');
    expect(refreshReadySource).toContain(
      '    (forceRefresh ||\n' +
        '      !contentAlreadyReady ||\n' +
        '      screenHostedViewNeedsRefresh(',
    );
    expect(refreshReadySource).not.toContain(
      'refreshScreenContentReady-cached',
    );
    expect(refreshReadySource).toContain(
      'screenHostedViewNeedsRefresh(\n' +
        '        controller,\n' +
        '        screenId,\n' +
        '        registry,\n' +
        '        controllerView,\n' +
        '        forceRefresh,\n' +
        '      ));',
    );
  });

  it('skips stale non-native view controller proxies while repairing UIKit hosting', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const UIViewController = function UIViewController() {};
    const nativeController = {
      isKindOfClass: (klass: unknown) => klass === UIViewController,
    };
    const staleProxy = {
      isKindOfClass: () => {
        throw new Error('stale proxy should be treated as non-native');
      },
    };

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      UIViewController,
    };

    try {
      expect(
        __nativeScriptNativeViewControllersFromArrayForTests([
          nativeController,
        ]),
      ).toEqual([nativeController]);
      expect(
        __nativeScriptNativeViewControllersFromArrayForTests([
          nativeController,
        ]),
      ).toEqual([nativeController]);
      expect(
        __nativeScriptNativeViewControllersFromArrayForTests([
          nativeController,
          staleProxy,
        ]),
      ).toBe(null);
      expect(stackSource).toContain(
        "if (!isNativeKindOfClass(controller, 'UIViewController'))",
      );
      expect(stackSource).toContain(
        '!controllers ||\n    controllers.length === 0',
      );
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('only accepts tagged registered screen controller proxies for stable stack checks', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const UIViewController = function UIViewController() {};
    const nativeController = {
      isKindOfClass: (klass: unknown) => klass === UIViewController,
    };
    const taggedController = {
      __nativeScriptScreenId: 'screen-a',
      isKindOfClass: () => false,
    };
    const unregisteredTaggedController = {
      __nativeScriptScreenId: 'screen-b',
      isKindOfClass: () => false,
    };
    const retainedController = {
      hash: 42,
    };
    const hashMatchedProxy = {
      restorationIdentifier: 'screen-c',
      hash: 42,
      isKindOfClass: () => false,
    };
    const staleProxy = {
      isKindOfClass: () => false,
    };
    const registry = {
      screens: {
        'screen-a': taggedController,
        'screen-c': retainedController,
      },
      screenControllerHashes: {
        'screen-c': 42,
      },
    };

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      UIViewController,
    };

    try {
      expect(
        __nativeScriptStableNativeViewControllersFromArrayForTests(
          [nativeController, taggedController],
          registry as never,
        ),
      ).toEqual({
        controllers: [nativeController, taggedController],
        usedTaggedFallback: true,
      });
      expect(
        __nativeScriptStableNativeViewControllersFromArrayForTests(
          [nativeController, unregisteredTaggedController],
          registry as never,
        ),
      ).toBe(null);
      expect(
        __nativeScriptStableNativeViewControllersFromArrayForTests(
          [nativeController, staleProxy],
          registry as never,
        ),
      ).toBe(null);
      expect(
        __nativeScriptStableNativeViewControllersFromArrayForTests(
          [hashMatchedProxy],
          registry as never,
          false,
        ),
      ).toBe(null);
      expect(
        __nativeScriptStableNativeViewControllersFromArrayForTests(
          [hashMatchedProxy],
          registry as never,
          true,
        ),
      ).toEqual({
        controllers: [hashMatchedProxy],
        usedTaggedFallback: true,
      });
      expect(stackSource).toContain(
        'function stableNativeViewControllersFromArray',
      );
      expect(stackSource).toContain(
        'controllerIsRegisteredNativeScriptScreen(\n' +
          '        controller,\n' +
          '        registry,\n' +
          '        allowHashIdentity,\n' +
          '      )',
      );
      expect(stackSource).toContain(
        'navigationController?.view?.window != null',
      );
      expect(stackSource).toContain(
        'allowHashIdentity && controller.restorationIdentifier === screenId',
      );
      expect(stackSource).toContain(
        'currentControllerHash === registeredControllerHash',
      );
      expect(stackSource).toContain(
        '(!usedTaggedFallback && topContentHasCommittedHostedContent)',
      );
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('rescans measured text wrappers when nested Fabric paragraph geometry changes', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const RCTParagraphComponentView = function RCTParagraphComponentView() {};
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { width, height },
    });
    const modalBounds = frame(402, 728.333);
    const paragraphChild: any = {
      accessibilityFrame: frame(366, 92, 18, 178),
      alpha: 1,
      bounds: frame(366, 92),
      description: '<RCTParagraphComponentView: 0x1234>',
      frame: frame(366, 92),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const measuredTextWrapper: any = {
      alpha: 1,
      bounds: frame(366, 92),
      convertRectToView: jest.fn(() => frame(366, 92, 18, 178)),
      frame: frame(366, 92),
      hidden: false,
      isKindOfClass: () => false,
      subviews: [paragraphChild],
    };
    const modalHost: any = {
      alpha: 1,
      bounds: modalBounds,
      frame: modalBounds,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [measuredTextWrapper],
    };

    paragraphChild.superview = measuredTextWrapper;
    measuredTextWrapper.superview = modalHost;

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      RCTParagraphComponentView,
      UIScrollView,
    };

    try {
      __nativeScriptLayoutHostedSubviewChainForTests(
        modalHost,
        0,
        modalBounds.size.height,
      );

      paragraphChild.accessibilityFrame = frame(724, 874, 18, 178);
      paragraphChild.bounds = frame(724, 874);
      paragraphChild.frame = frame(724, 874);

      __nativeScriptLayoutHostedSubviewChainForTests(
        modalHost,
        0,
        modalBounds.size.height,
      );

      expect(paragraphChild.frame).toEqual(frame(366, 92));
      expect(paragraphChild.bounds).toEqual(frame(366, 92));
      expect(paragraphChild.accessibilityFrame).toEqual(
        frame(366, 92, 18, 178),
      );
      expect(measuredTextWrapper.convertRectToView).toHaveBeenCalledWith(
        frame(366, 92),
        null,
      );
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('clamps stale measured text accessibility frames after Fabric republishes matching geometry', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const RCTParagraphComponentView = function RCTParagraphComponentView() {};
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { width, height },
    });
    const modalBounds = frame(402, 728.333);
    const paragraphChild: any = {
      accessibilityFrame: frame(724, 874, 18, 178),
      alpha: 1,
      bounds: frame(366, 92),
      description: '<RCTParagraphComponentView: 0x1234>',
      frame: frame(366, 92),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const measuredTextWrapper: any = {
      alpha: 1,
      bounds: frame(366, 92),
      convertRectToView: jest.fn(() => frame(366, 92, 18, 178)),
      frame: frame(366, 92),
      hidden: false,
      isKindOfClass: () => false,
      subviews: [paragraphChild],
    };
    const modalHost: any = {
      alpha: 1,
      bounds: modalBounds,
      frame: modalBounds,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [measuredTextWrapper],
    };

    paragraphChild.superview = measuredTextWrapper;
    measuredTextWrapper.superview = modalHost;

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      RCTParagraphComponentView,
      UIScrollView,
    };

    try {
      __nativeScriptLayoutHostedSubviewChainForTests(
        modalHost,
        0,
        modalBounds.size.height,
        [],
        undefined,
        0,
        true,
      );

      expect(paragraphChild.frame).toEqual(frame(366, 92));
      expect(paragraphChild.bounds).toEqual(frame(366, 92));
      expect(paragraphChild.accessibilityFrame).toEqual(
        frame(366, 92, 18, 178),
      );
      expect(measuredTextWrapper.convertRectToView).toHaveBeenCalledWith(
        frame(366, 92),
        null,
      );
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('scans offset user-layout containers for stale measured text accessibility frames', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const RCTParagraphComponentView = function RCTParagraphComponentView() {};
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { width, height },
    });
    const modalBounds = frame(402, 728.333);
    const paragraphChild: any = {
      accessibilityFrame: frame(724, 874, 18, 178),
      alpha: 1,
      bounds: frame(366, 92),
      description: '<RCTParagraphComponentView: 0x1234>',
      frame: frame(366, 92),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const measuredTextWrapper: any = {
      alpha: 1,
      bounds: frame(366, 92),
      convertRectToView: jest.fn(() => frame(366, 92, 18, 178)),
      frame: frame(366, 92),
      hidden: false,
      isKindOfClass: () => false,
      subviews: [paragraphChild],
    };
    const offsetUserLayoutContainer: any = {
      alpha: 1,
      bounds: frame(366, 120),
      frame: frame(366, 120, 18, 178),
      hidden: false,
      isKindOfClass: () => false,
      subviews: [measuredTextWrapper],
    };
    const modalHost: any = {
      alpha: 1,
      bounds: modalBounds,
      frame: modalBounds,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [offsetUserLayoutContainer],
    };

    paragraphChild.superview = measuredTextWrapper;
    measuredTextWrapper.superview = offsetUserLayoutContainer;
    offsetUserLayoutContainer.superview = modalHost;

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      RCTParagraphComponentView,
      UIScrollView,
    };

    try {
      __nativeScriptLayoutHostedSubviewChainForTests(
        modalHost,
        0,
        modalBounds.size.height,
        [],
        undefined,
        0,
        true,
      );

      expect(offsetUserLayoutContainer.frame).toEqual(frame(366, 120, 18, 178));
      expect(measuredTextWrapper.frame).toEqual(frame(366, 92));
      expect(paragraphChild.frame).toEqual(frame(366, 92));
      expect(paragraphChild.accessibilityFrame).toEqual(
        frame(366, 92, 18, 178),
      );
      expect(measuredTextWrapper.convertRectToView).toHaveBeenCalledWith(
        frame(366, 92),
        null,
      );
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('force scans through stale scroll wrappers and repairs overflowing text leaves', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const RCTParagraphComponentView = function RCTParagraphComponentView() {};
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { width, height },
    });
    const contentBounds = frame(402, 874);
    const staleContainerBounds = frame(760, 1279);
    const staleScrollBounds = frame(760, 1279, 0, -116);
    const paragraphChild: any = {
      accessibilityFrame: frame(402, 874, 18, 178),
      accessibilityLabel:
        'Pushed with navigation.push. The visible back button is the system UIKit button in minimal display mode, and the edge swipe should pop this route.',
      alpha: 1,
      bounds: frame(402, 874),
      description: '<RCTParagraphComponentView: 0x1234>',
      frame: frame(402, 874, 18, 62),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      layoutIfNeeded: jest.fn(),
      setNeedsLayout: jest.fn(),
      subviews: [],
    };
    const titleChild: any = {
      accessibilityLabel: 'Detail route',
      alpha: 1,
      bounds: frame(366, 36),
      description: '<RCTParagraphComponentView: 0x5678>',
      frame: frame(366, 36, 18, 18),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const firstCardBackground: any = {
      accessibilityLabel: '',
      alpha: 1,
      bounds: frame(402, 874),
      frame: frame(402, 874, 18, 170),
      hidden: false,
      isKindOfClass: () => false,
      subviews: [],
    };
    const firstCardTitle: any = {
      accessibilityLabel: 'Route params',
      alpha: 1,
      bounds: frame(333.333, 21.667),
      description: '<RCTParagraphComponentView: 0x9012>',
      frame: frame(333.333, 21.667, 34.333, 186.333),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const contentView: any = {
      alpha: 1,
      bounds: contentBounds,
      frame: contentBounds,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [
        titleChild,
        paragraphChild,
        firstCardBackground,
        firstCardTitle,
      ],
    };
    const scrollContentView: any = {
      alpha: 1,
      bounds: contentBounds,
      frame: contentBounds,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [contentView],
    };
    const enhancedScrollView: any = {
      alpha: 1,
      bounds: staleScrollBounds,
      contentSize: { width: 760, height: 1279 },
      frame: staleContainerBounds,
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === UIScrollView,
      subviews: [scrollContentView],
    };
    const scrollComponentView: any = {
      alpha: 1,
      bounds: staleContainerBounds,
      frame: staleContainerBounds,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [enhancedScrollView],
    };
    const contentWrapperView: any = {
      alpha: 1,
      bounds: contentBounds,
      frame: contentBounds,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [scrollComponentView],
    };

    paragraphChild.superview = contentView;
    titleChild.superview = contentView;
    firstCardBackground.superview = contentView;
    firstCardTitle.superview = contentView;
    contentView.superview = scrollContentView;
    scrollContentView.superview = enhancedScrollView;
    enhancedScrollView.superview = scrollComponentView;
    scrollComponentView.superview = contentWrapperView;

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      RCTParagraphComponentView,
      UIScrollView,
    };

    try {
      __nativeScriptLayoutHostedSubviewChainForTests(
        contentWrapperView,
        0,
        contentBounds.size.height,
        [],
        undefined,
        0,
        true,
      );

      expect(scrollComponentView.frame).toEqual(contentBounds);
      expect(scrollComponentView.bounds).toEqual(contentBounds);
      expect(enhancedScrollView.frame).toEqual(contentBounds);
      expect(enhancedScrollView.bounds).toEqual(frame(402, 874, 0, -116));
      expect(enhancedScrollView.contentSize.width).toBe(402);
      expect(paragraphChild.frame.origin).toEqual({ x: 18, y: 62 });
      expect(paragraphChild.frame.size.width).toBe(366);
      expect(paragraphChild.frame.size.height).toBeCloseTo(91.667);
      expect(paragraphChild.bounds.size.width).toBe(366);
      expect(paragraphChild.bounds.size.height).toBeCloseTo(91.667);
      expect(paragraphChild.setNeedsLayout).toHaveBeenCalled();
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('clamps overwide hosted modal scroll content when visible leaves fit the viewport', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const RCTParagraphComponentView = function RCTParagraphComponentView() {};
    const RCTViewComponentView = function RCTViewComponentView() {};
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { width, height },
    });
    const viewport = frame(402, 812);
    const staleContentFrame = frame(804, 1249);
    const modalTitle: any = {
      accessibilityLabel: 'Modal route',
      alpha: 1,
      bounds: frame(366, 36),
      description: '<RCTParagraphComponentView: 0xtitle>',
      frame: frame(366, 36, 18, 18),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const modalBody: any = {
      accessibilityLabel:
        'This route uses React Navigation presentation options.',
      alpha: 1,
      bounds: frame(366, 69),
      description: '<RCTParagraphComponentView: 0xbody>',
      frame: frame(366, 69, 18, 62),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const cardBackground: any = {
      alpha: 1,
      bounds: frame(366, 154.333),
      description: '<RCTViewComponentView: 0xcard>',
      frame: frame(366, 154.333, 18, 147),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTViewComponentView,
      subviews: [],
    };
    const dismissButtonText: any = {
      accessibilityLabel: 'Dismiss Modal',
      alpha: 1,
      bounds: frame(116, 19.333),
      description: '<RCTParagraphComponentView: 0xbuttonText>',
      frame: frame(116, 19.333, 125, 15.333),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const dismissButton: any = {
      accessibilityLabel: 'Dismiss React Navigation modal',
      alpha: 1,
      bounds: frame(366, 50),
      description: '<RCTViewComponentView: 0xbutton>',
      frame: frame(366, 50, 18, 317.333),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTViewComponentView,
      subviews: [dismissButtonText],
    };
    const contentRoot: any = {
      alpha: 1,
      bounds: staleContentFrame,
      description: '<RCTViewComponentView: 0xcontentRoot>',
      frame: staleContentFrame,
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTViewComponentView,
      subviews: [modalTitle, modalBody, cardBackground, dismissButton],
    };
    const scrollContentView: any = {
      alpha: 1,
      bounds: staleContentFrame,
      frame: staleContentFrame,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [contentRoot],
    };
    const enhancedScrollView: any = {
      alpha: 1,
      bounds: frame(402, 812, 0, -70),
      contentSize: { width: 804, height: 1249 },
      frame: viewport,
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === UIScrollView,
      subviews: [scrollContentView],
    };

    modalTitle.superview = contentRoot;
    modalBody.superview = contentRoot;
    cardBackground.superview = contentRoot;
    dismissButtonText.superview = dismissButton;
    dismissButton.superview = contentRoot;
    contentRoot.superview = scrollContentView;
    scrollContentView.superview = enhancedScrollView;

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      RCTParagraphComponentView,
      RCTViewComponentView,
      UIScrollView,
    };

    try {
      __nativeScriptLayoutHostedSubviewChainForTests(
        enhancedScrollView,
        0,
        viewport.size.height,
        [],
        undefined,
        0,
        true,
      );

      expect(enhancedScrollView.contentSize).toEqual({
        width: 402,
        height: 367.333,
      });
      expect(scrollContentView.frame).toEqual(frame(402, 367.333));
      expect(scrollContentView.bounds).toEqual(frame(402, 367.333));
      expect(contentRoot.frame).toEqual(frame(402, 367.333));
      expect(contentRoot.bounds).toEqual(frame(402, 367.333));
      expect(modalTitle.frame).toEqual(frame(366, 36, 18, 18));
      expect(dismissButton.frame).toEqual(frame(366, 50, 18, 317.333));
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('uses Fabric layout metrics instead of stale empty leaf frames for hosted scroll extents', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const RCTParagraphComponentView = function RCTParagraphComponentView() {};
    const RCTViewComponentView = function RCTViewComponentView() {};
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { width, height },
    });
    const layoutBackedView = (
      currentFrame: ReturnType<typeof frame>,
      layoutFrame: ReturnType<typeof frame>,
      debugName: string,
      subviews: any[] = [],
    ) => ({
      __nativeScriptFabricViewLayoutTraits: {
        hasLayoutMetrics: true,
        isFabricComponentView: true,
        layoutMetricsFrameHeight: layoutFrame.size.height,
        layoutMetricsFrameWidth: layoutFrame.size.width,
        layoutMetricsFrameX: layoutFrame.origin.x,
        layoutMetricsFrameY: layoutFrame.origin.y,
      },
      alpha: 1,
      bounds: frame(currentFrame.size.width, currentFrame.size.height),
      description: `<RCTViewComponentView: ${debugName}>`,
      frame: currentFrame,
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTViewComponentView,
      subviews,
    });
    const viewport = frame(402, 812);
    const staleContentFrame = frame(804, 2148);
    const modalTitle: any = {
      accessibilityLabel: 'Modal route',
      alpha: 1,
      bounds: frame(366, 36),
      description: '<RCTParagraphComponentView: 0xtitle>',
      frame: frame(366, 36, 18, 18),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const modalBody: any = {
      accessibilityLabel:
        'This route uses React Navigation presentation options.',
      alpha: 1,
      bounds: frame(366, 69),
      description: '<RCTParagraphComponentView: 0xbody>',
      frame: frame(366, 69, 18, 62),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const staleEmptyCardBackground: any = layoutBackedView(
      frame(366, 1844, 18, 147),
      frame(366, 154.333, 18, 147),
      '0xcard',
    );
    const dismissButtonText: any = {
      accessibilityLabel: 'Dismiss Modal',
      alpha: 1,
      bounds: frame(116, 19.333),
      description: '<RCTParagraphComponentView: 0xbuttonText>',
      frame: frame(116, 19.333, 125, 15.333),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const dismissButton: any = {
      accessibilityLabel: 'Dismiss React Navigation modal',
      alpha: 1,
      bounds: frame(366, 50),
      description: '<RCTViewComponentView: 0xbutton>',
      frame: frame(366, 50, 18, 317.333),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTViewComponentView,
      subviews: [dismissButtonText],
    };
    const contentRoot: any = {
      alpha: 1,
      bounds: staleContentFrame,
      description: '<RCTViewComponentView: 0xcontentRoot>',
      frame: staleContentFrame,
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTViewComponentView,
      subviews: [
        modalTitle,
        modalBody,
        staleEmptyCardBackground,
        dismissButton,
      ],
    };
    const scrollContentView: any = {
      alpha: 1,
      bounds: staleContentFrame,
      frame: staleContentFrame,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [contentRoot],
    };
    const enhancedScrollView: any = {
      alpha: 1,
      bounds: viewport,
      contentSize: { width: 804, height: 2148 },
      frame: viewport,
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === UIScrollView,
      subviews: [scrollContentView],
    };

    modalTitle.superview = contentRoot;
    modalBody.superview = contentRoot;
    staleEmptyCardBackground.superview = contentRoot;
    dismissButtonText.superview = dismissButton;
    dismissButton.superview = contentRoot;
    contentRoot.superview = scrollContentView;
    scrollContentView.superview = enhancedScrollView;

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      RCTParagraphComponentView,
      RCTViewComponentView,
      UIScrollView,
    };

    try {
      __nativeScriptLayoutHostedSubviewChainForTests(
        enhancedScrollView,
        0,
        viewport.size.height,
        [],
        undefined,
        0,
        true,
      );

      expect(enhancedScrollView.contentSize).toEqual({
        width: 402,
        height: 367.333,
      });
      expect(scrollContentView.frame).toEqual(frame(402, 367.333));
      expect(contentRoot.frame).toEqual(frame(402, 367.333));
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('repairs zero-sized Fabric paragraph leaves from attributed text layout', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const RCTParagraphComponentView = function RCTParagraphComponentView() {};
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { width, height },
    });
    const contentBounds = frame(402, 874);
    const paragraphText = {
      boundingRectWithSizeOptionsContext: jest.fn(() => frame(366, 91.667)),
    };
    const paragraphTextSubview: any = {
      alpha: 1,
      bounds: frame(0, 0),
      description: '<RCTParagraphTextView: 0xtext>',
      frame: frame(0, 0),
      hidden: false,
      isKindOfClass: () => false,
      setNeedsDisplay: jest.fn(),
      subviews: [],
    };
    const paragraphChild: any = {
      accessibilityLabel:
        'Pushed with navigation.push. The visible back button is the system UIKit button in minimal display mode, and the edge swipe should pop this route.',
      alpha: 1,
      attributedText: paragraphText,
      bounds: frame(0, 0),
      description: '<RCTParagraphComponentView: 0xbody>',
      frame: frame(0, 0, 18, 62),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      layoutIfNeeded: jest.fn(),
      setNeedsLayout: jest.fn(),
      subviews: [paragraphTextSubview],
    };
    const titleChild: any = {
      accessibilityLabel: 'Detail route',
      alpha: 1,
      bounds: frame(366, 36),
      description: '<RCTParagraphComponentView: 0xtitle>',
      frame: frame(366, 36, 18, 18),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const cardWrapper: any = {
      alpha: 1,
      bounds: frame(0, 0),
      description: '<RCTViewComponentView: 0xcard>',
      frame: frame(0, 0, 18, 170),
      hidden: false,
      isKindOfClass: () => false,
      subviews: [],
    };
    const cardTitle: any = {
      accessibilityLabel: 'Route params',
      alpha: 1,
      bounds: frame(333.333, 21.667),
      description: '<RCTParagraphComponentView: 0xcard-title>',
      frame: frame(333.333, 21.667, 34.333, 186.333),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const contentView: any = {
      alpha: 1,
      bounds: contentBounds,
      frame: contentBounds,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [titleChild, paragraphChild, cardWrapper, cardTitle],
    };

    titleChild.superview = contentView;
    paragraphChild.superview = contentView;
    paragraphTextSubview.superview = paragraphChild;
    cardWrapper.superview = contentView;
    cardTitle.superview = contentView;

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      CGSizeMake: (width: number, height: number) => ({ width, height }),
      RCTParagraphComponentView,
      UIScrollView,
    };

    try {
      __nativeScriptLayoutHostedSubviewChainForTests(
        contentView,
        0,
        contentBounds.size.height,
        [],
        undefined,
        0,
        true,
      );

      expect(
        paragraphText.boundingRectWithSizeOptionsContext,
      ).toHaveBeenCalled();
      expect(paragraphChild.frame).toEqual(frame(366, 91.667, 18, 62));
      expect(paragraphChild.bounds).toEqual(frame(366, 91.667));
      expect(paragraphTextSubview.frame).toEqual(frame(366, 91.667));
      expect(paragraphTextSubview.bounds).toEqual(frame(366, 91.667));
      expect(paragraphChild.setNeedsLayout).toHaveBeenCalled();
      expect(paragraphTextSubview.setNeedsDisplay).toHaveBeenCalled();
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('keeps scroll content Yoga descendants out of UIKit flexible autoresizing repair', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const RCTParagraphComponentView = function RCTParagraphComponentView() {};
    const RCTViewComponentView = function RCTViewComponentView() {};
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { width, height },
    });
    const viewport = frame(402, 874);
    const titleChild: any = {
      alpha: 1,
      autoresizingMask: 0,
      bounds: frame(366, 36),
      description: '<RCTParagraphComponentView: 0xtitle>',
      frame: frame(366, 36, 18, 18),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const paragraphChild: any = {
      alpha: 1,
      autoresizingMask: 18,
      bounds: frame(366, 92),
      description: '<RCTParagraphComponentView: 0xbody>',
      frame: frame(366, 92, 18, 62),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const cardBackground: any = {
      alpha: 1,
      autoresizingMask: 18,
      bounds: frame(366, 1844.333),
      description: '<RCTViewComponentView: 0xcard>',
      frame: frame(366, 1844.333, 18, 170),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTViewComponentView,
      subviews: [],
    };
    const pill: any = {
      alpha: 1,
      autoresizingMask: 18,
      bounds: frame(116.333, 1744),
      description: '<RCTViewComponentView: 0xpill>',
      frame: frame(116.333, 1744, 34.333, 254),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTViewComponentView,
      subviews: [],
    };
    const contentView: any = {
      alpha: 1,
      autoresizingMask: 18,
      bounds: frame(402, 2148.667),
      description: '<RCTViewComponentView: 0xcontent>',
      frame: frame(402, 2148.667),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTViewComponentView,
      subviews: [titleChild, paragraphChild, cardBackground, pill],
    };
    const scrollContentView: any = {
      alpha: 1,
      autoresizingMask: 18,
      bounds: frame(402, 1511.333),
      frame: frame(402, 1511.333),
      hidden: false,
      isKindOfClass: () => false,
      subviews: [contentView],
    };
    const enhancedScrollView: any = {
      alpha: 1,
      bounds: viewport,
      contentSize: { width: 402, height: 699.333 },
      frame: viewport,
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === UIScrollView,
      subviews: [scrollContentView],
    };

    titleChild.superview = contentView;
    paragraphChild.superview = contentView;
    cardBackground.superview = contentView;
    pill.superview = contentView;
    contentView.superview = scrollContentView;
    scrollContentView.superview = enhancedScrollView;

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      RCTParagraphComponentView,
      RCTViewComponentView,
      UIScrollView,
    };

    try {
      __nativeScriptLayoutHostedSubviewChainForTests(
        enhancedScrollView,
        0,
        viewport.size.height,
        [],
        undefined,
        0,
        true,
      );

      expect(scrollContentView.frame).toEqual(viewport);
      expect(scrollContentView.bounds).toEqual(viewport);
      expect(scrollContentView.autoresizingMask).toBe(0);
      expect(contentView.frame).toEqual(viewport);
      expect(contentView.bounds).toEqual(viewport);
      expect(contentView.autoresizingMask).toBe(0);
      expect(paragraphChild.autoresizingMask).toBe(0);
      expect(cardBackground.autoresizingMask).toBe(0);
      expect(pill.autoresizingMask).toBe(0);
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('uses Fabric layout metrics to restore stale RN descendant frames inside hosted scroll content', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const RCTViewComponentView = function RCTViewComponentView() {};
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { width, height },
    });
    const layoutBackedView = (
      currentFrame: ReturnType<typeof frame>,
      layoutFrame: ReturnType<typeof frame>,
      debugName: string,
      traits: Record<string, unknown> = {},
    ) => {
      let center = {
        x: currentFrame.origin.x + currentFrame.size.width / 2,
        y: currentFrame.origin.y + currentFrame.size.height / 2,
      };
      let bounds = frame(currentFrame.size.width, currentFrame.size.height);
      const view: any = {
        __nativeScriptFabricViewLayoutTraits: {
          isFabricComponentView: true,
          hasLayoutMetrics: true,
          layoutMetricsFrameX: layoutFrame.origin.x,
          layoutMetricsFrameY: layoutFrame.origin.y,
          layoutMetricsFrameWidth: layoutFrame.size.width,
          layoutMetricsFrameHeight: layoutFrame.size.height,
          ...traits,
        },
        alpha: 1,
        autoresizingMask: 18,
        description: `<RCTViewComponentView: ${debugName}>`,
        hidden: false,
        isKindOfClass: (klass: unknown) => klass === RCTViewComponentView,
        subviews: [],
      };

      Object.defineProperty(view, 'center', {
        get() {
          return center;
        },
        set(nextCenter) {
          center = nextCenter;
        },
      });
      Object.defineProperty(view, 'bounds', {
        get() {
          return bounds;
        },
        set(nextBounds) {
          bounds = nextBounds;
        },
      });
      Object.defineProperty(view, 'frame', {
        get() {
          const width = bounds.size.width;
          const height = bounds.size.height;
          return frame(
            width,
            height,
            center.x - width / 2,
            center.y - height / 2,
          );
        },
        set(nextFrame) {
          center = {
            x: nextFrame.origin.x + nextFrame.size.width / 2,
            y: nextFrame.origin.y + nextFrame.size.height / 2,
          };
          bounds = frame(nextFrame.size.width, nextFrame.size.height);
        },
      });

      return view;
    };
    const viewport = frame(402, 874);
    const naturalContent = frame(402, 699.333);
    const cardLayoutFrame = frame(366, 132.667, 18, 170);
    const cardBackground = layoutBackedView(
      frame(366, 395, 18, 170),
      cardLayoutFrame,
      '0xcard',
      {
        hasYogaStyle: false,
        flex: null,
        flexGrow: null,
        flexShrink: null,
      },
    );
    const contentView = layoutBackedView(
      frame(402, 2148.667),
      naturalContent,
      '0xcontent',
      {
        hasYogaStyle: true,
        flex: null,
        flexGrow: 1,
        flexShrink: null,
      },
    );
    const scrollContentView: any = {
      alpha: 1,
      autoresizingMask: 18,
      bounds: naturalContent,
      frame: naturalContent,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [contentView],
    };
    const enhancedScrollView: any = {
      alpha: 1,
      bounds: viewport,
      contentSize: { width: 402, height: 699.333 },
      frame: viewport,
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === UIScrollView,
      subviews: [scrollContentView],
    };

    contentView.subviews = [cardBackground];
    cardBackground.superview = contentView;
    contentView.superview = scrollContentView;
    scrollContentView.superview = enhancedScrollView;

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      RCTViewComponentView,
      UIScrollView,
    };

    try {
      __nativeScriptLayoutHostedSubviewChainForTests(
        enhancedScrollView,
        0,
        viewport.size.height,
        [],
        undefined,
        0,
        true,
      );

      expect(scrollContentView.frame).toEqual(viewport);
      expect(contentView.frame).toEqual(viewport);
      expect(cardBackground.frame).toEqual(cardLayoutFrame);
      expect(cardBackground.bounds).toEqual(frame(366, 132.667));
      expect(cardBackground.autoresizingMask).toBe(0);
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('uses Fabric flexGrow traits to expand short ScrollView content view without rewriting contentSize height', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const RCTViewComponentView = function RCTViewComponentView() {};
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { width, height },
    });
    const viewport = frame(402, 874);
    const naturalContent = frame(402, 699.333);
    const contentView: any = {
      __nativeScriptFabricViewLayoutTraits: {
        isFabricComponentView: true,
        hasYogaStyle: true,
        flex: null,
        flexGrow: 1,
        flexShrink: null,
      },
      alpha: 1,
      autoresizingMask: 0,
      bounds: naturalContent,
      description: '<RCTViewComponentView: 0xcontent>',
      frame: naturalContent,
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTViewComponentView,
      subviews: [],
    };
    const scrollContentView: any = {
      alpha: 1,
      autoresizingMask: 0,
      bounds: naturalContent,
      frame: naturalContent,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [contentView],
    };
    const enhancedScrollView: any = {
      alpha: 1,
      bounds: viewport,
      contentSize: { width: 402, height: 699.333 },
      frame: viewport,
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === UIScrollView,
      subviews: [scrollContentView],
    };

    contentView.superview = scrollContentView;
    scrollContentView.superview = enhancedScrollView;

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      RCTViewComponentView,
      UIScrollView,
    };

    try {
      __nativeScriptLayoutHostedSubviewChainForTests(
        enhancedScrollView,
        0,
        viewport.size.height,
        [],
        undefined,
        0,
        true,
      );

      expect(scrollContentView.frame).toEqual(viewport);
      expect(scrollContentView.bounds).toEqual(viewport);
      expect(contentView.frame).toEqual(viewport);
      expect(contentView.bounds).toEqual(viewport);
      expect(enhancedScrollView.contentSize).toEqual({
        width: 402,
        height: 699.333,
      });
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('ignores UIScrollView helper siblings when expanding short Fabric content', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const RCTViewComponentView = function RCTViewComponentView() {};
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { width, height },
    });
    const viewport = frame(402, 874);
    const naturalContent = frame(402, 699.333);
    const touchPassthroughView: any = {
      alpha: 1,
      bounds: viewport,
      frame: frame(402, 874, 0, -116),
      hidden: false,
      isKindOfClass: () => false,
      subviews: [],
    };
    const topBackdropView: any = {
      alpha: 1,
      bounds: frame(402, 170),
      frame: frame(402, 170),
      hidden: false,
      isKindOfClass: () => false,
      subviews: [],
    };
    const contentView: any = {
      __nativeScriptFabricViewLayoutTraits: {
        isFabricComponentView: true,
        hasYogaStyle: true,
        flex: null,
        flexGrow: 1,
        flexShrink: null,
      },
      alpha: 1,
      autoresizingMask: 0,
      bounds: naturalContent,
      description: '<RCTViewComponentView: 0xcontent>',
      frame: naturalContent,
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === RCTViewComponentView,
      subviews: [],
    };
    const scrollContentView: any = {
      alpha: 1,
      autoresizingMask: 0,
      bounds: naturalContent,
      frame: naturalContent,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [contentView],
    };
    const enhancedScrollView: any = {
      alpha: 1,
      bounds: viewport,
      contentSize: { width: 402, height: 699.333 },
      frame: viewport,
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === UIScrollView,
      subviews: [touchPassthroughView, topBackdropView, scrollContentView],
    };

    touchPassthroughView.superview = enhancedScrollView;
    topBackdropView.superview = enhancedScrollView;
    contentView.superview = scrollContentView;
    scrollContentView.superview = enhancedScrollView;

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      RCTViewComponentView,
      UIScrollView,
    };

    try {
      __nativeScriptLayoutHostedSubviewChainForTests(
        enhancedScrollView,
        0,
        viewport.size.height,
        [],
        undefined,
        0,
        true,
      );

      expect(touchPassthroughView.frame).toEqual(frame(402, 874, 0, -116));
      expect(topBackdropView.frame).toEqual(frame(402, 170));
      expect(scrollContentView.frame).toEqual(viewport);
      expect(scrollContentView.bounds).toEqual(viewport);
      expect(contentView.frame).toEqual(viewport);
      expect(contentView.bounds).toEqual(viewport);
      expect(enhancedScrollView.contentSize).toEqual({
        width: 402,
        height: 699.333,
      });
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('clamps native text accessibility descendants to their visible parent without changing layout frames', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const RCTParagraphComponentView = function RCTParagraphComponentView() {};
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number, x = 0, y = 0) => ({
      origin: { x, y },
      size: { width, height },
    });
    const modalBounds = frame(402, 728.333);
    const paragraphChild: any = {
      accessibilityFrame: frame(724, 874, 18, 178),
      accessibilityLabel:
        'Pushed with navigation.push. The visible back button is the system UIKit button in minimal display mode, and the edge swipe should pop this route.',
      alpha: 1,
      bounds: frame(724, 874),
      description: '<RCTParagraphComponentView: 0x1234>',
      frame: frame(724, 874),
      hidden: false,
      isAccessibilityElement: true,
      isKindOfClass: (klass: unknown) => klass === RCTParagraphComponentView,
      subviews: [],
    };
    const visibleTextParent: any = {
      alpha: 1,
      bounds: frame(366, 92),
      convertRectToView: jest.fn(() => frame(366, 92, 18, 178)),
      frame: frame(366, 92, 18, 178),
      hidden: false,
      isKindOfClass: () => false,
      subviews: [paragraphChild],
    };
    const modalHost: any = {
      alpha: 1,
      bounds: modalBounds,
      frame: modalBounds,
      hidden: false,
      isKindOfClass: () => false,
      subviews: [visibleTextParent],
    };

    paragraphChild.superview = visibleTextParent;
    visibleTextParent.superview = modalHost;

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      RCTParagraphComponentView,
      UIScrollView,
    };

    try {
      __nativeScriptLayoutHostedSubviewChainForTests(
        modalHost,
        0,
        modalBounds.size.height,
        [],
        undefined,
        0,
        true,
      );

      expect(paragraphChild.frame).toEqual(frame(366, 92));
      expect(paragraphChild.bounds).toEqual(frame(366, 92));
      expect(paragraphChild.accessibilityFrame).toEqual(
        frame(366, 92, 18, 178),
      );
      expect(visibleTextParent.convertRectToView).toHaveBeenCalledWith(
        frame(366, 92),
        null,
      );
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('does not revisit hosted scroll-content cycles while repairing wrapper layout', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number) => ({
      origin: { x: 0, y: 0 },
      size: { width, height },
    });

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      UIScrollView,
    };

    try {
      const scrollView: any = {
        autoresizingMask: 0,
        bounds: frame(402, 874),
        contentSize: { width: 402, height: 874 },
        frame: frame(402, 874),
        isKindOfClass: (klass: unknown) => klass === UIScrollView,
      };
      const contentView: any = {
        alpha: 1,
        autoresizingMask: 0,
        bounds: frame(402, 874),
        frame: frame(402, 874),
        hidden: false,
        isKindOfClass: () => false,
      };
      let scrollSubviewReads = 0;
      let contentSubviewReads = 0;

      Object.defineProperty(scrollView, 'subviews', {
        get() {
          scrollSubviewReads += 1;
          if (scrollSubviewReads > 20) {
            throw new Error('scroll view cycle was not guarded');
          }
          return [contentView];
        },
      });
      Object.defineProperty(contentView, 'subviews', {
        get() {
          contentSubviewReads += 1;
          if (contentSubviewReads > 20) {
            throw new Error('content view cycle was not guarded');
          }
          return [scrollView];
        },
      });

      expect(() =>
        __nativeScriptLayoutHostedSubviewChainForTests(scrollView, 0, 874),
      ).not.toThrow();
      expect(scrollSubviewReads).toBeLessThan(20);
      expect(contentSubviewReads).toBeLessThan(20);
      expect(contentView.frame).toEqual(frame(402, 874));
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('uses a traversal budget instead of native equality for hosted view cycles', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number) => ({
      origin: { x: 0, y: 0 },
      size: { width, height },
    });
    let subviewReads = 0;
    const nativeEqualityShouldNotRun = () => {
      throw new Error('hosted view traversal should not call native equality');
    };
    const makeContentProxy = (): any => ({
      alpha: 1,
      bounds: frame(402, 874),
      frame: frame(402, 874),
      hidden: false,
      isEqual: nativeEqualityShouldNotRun,
      isKindOfClass: () => false,
      get subviews() {
        subviewReads += 1;
        if (subviewReads > 200) {
          throw new Error('hosted view traversal budget was not enforced');
        }
        return [makeScrollProxy()];
      },
    });
    const makeScrollProxy = (): any => ({
      bounds: frame(402, 874),
      contentSize: { width: 402, height: 874 },
      frame: frame(402, 874),
      isEqual: nativeEqualityShouldNotRun,
      isKindOfClass: (klass: unknown) => klass === UIScrollView,
      get subviews() {
        subviewReads += 1;
        if (subviewReads > 200) {
          throw new Error('hosted view traversal budget was not enforced');
        }
        return [makeContentProxy()];
      },
    });

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      UIScrollView,
    };

    try {
      expect(() =>
        __nativeScriptLayoutHostedSubviewChainForTests(
          makeScrollProxy(),
          0,
          874,
        ),
      ).not.toThrow();
      expect(subviewReads).toBeGreaterThan(0);
      expect(subviewReads).toBeLessThanOrEqual(200);
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('skips unchanged hosted subtree repair after recording a layout key', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number) => ({
      origin: { x: 0, y: 0 },
      size: { width, height },
    });
    let rootSubviewReads = 0;
    const child: any = {
      alpha: 1,
      autoresizingMask: 0,
      bounds: frame(402, 874),
      frame: frame(402, 874),
      hidden: false,
      isKindOfClass: () => false,
      subviews: [],
    };
    const root: any = {
      alpha: 1,
      autoresizingMask: 0,
      bounds: frame(402, 874),
      frame: frame(402, 874),
      hidden: false,
      isKindOfClass: () => false,
    };

    child.superview = root;
    Object.defineProperty(root, 'subviews', {
      get() {
        rootSubviewReads += 1;
        if (rootSubviewReads > 8) {
          throw new Error('unchanged hosted layout was rescanned');
        }
        return [child];
      },
    });

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      UIScrollView,
    };

    try {
      expect(() =>
        __nativeScriptLayoutHostedSubviewChainForTests(root, 0, 874),
      ).not.toThrow();
      const readsAfterFirstLayout = rootSubviewReads;

      expect(() =>
        __nativeScriptLayoutHostedSubviewChainForTests(root, 0, 874),
      ).not.toThrow();
      expect(rootSubviewReads - readsAfterFirstLayout).toBeLessThanOrEqual(1);
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('reruns hosted scroll repair when only contentSize changes', () => {
    const globalObject = global as Record<string, unknown>;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const UIScrollView = function UIScrollView() {};
    const frame = (width: number, height: number) => ({
      origin: { x: 0, y: 0 },
      size: { width, height },
    });
    let rootSubviewReads = 0;
    const child: any = {
      alpha: 1,
      bounds: frame(402, 699),
      frame: frame(402, 699),
      hidden: false,
      isKindOfClass: () => false,
      subviews: [],
    };
    const root: any = {
      alpha: 1,
      bounds: frame(402, 874),
      contentSize: { width: 402, height: 699 },
      frame: frame(402, 874),
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === UIScrollView,
    };

    child.superview = root;
    Object.defineProperty(root, 'subviews', {
      get() {
        rootSubviewReads += 1;
        return [child];
      },
    });

    globalObject.__nativeScriptNativeApi = {
      ...((previousNativeApi as Record<string, unknown>) ?? {}),
      UIScrollView,
    };

    try {
      __nativeScriptLayoutHostedSubviewChainForTests(root, 0, 874);
      const readsAfterFirstLayout = rootSubviewReads;

      __nativeScriptLayoutHostedSubviewChainForTests(root, 0, 874);
      const unchangedDelta = rootSubviewReads - readsAfterFirstLayout;

      root.contentSize = { width: 402, height: 1200 };
      __nativeScriptLayoutHostedSubviewChainForTests(root, 0, 874);

      expect(unchangedDelta).toBeLessThanOrEqual(1);
      expect(rootSubviewReads - readsAfterFirstLayout).toBeGreaterThan(
        unchangedDelta,
      );
    } finally {
      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('remounts a detached screen content wrapper before refreshing it', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const refreshUIKitHostView = jest.fn(() => true);
    NativeScriptRuntime.refreshUIKitHostViewDirectOwner = refreshUIKitHostView;

    const staleSuperview = {};
    const contentWrapperView: any = {
      alpha: 0,
      frame: undefined,
      hidden: true,
      removeFromSuperview: jest.fn(function removeFromSuperview() {
        contentWrapperView.superview = null;
      }),
      superview: staleSuperview,
      userInteractionEnabled: false,
    };
    const screenView = {
      addSubview: jest.fn(function addSubview(view: any) {
        view.superview = screenView;
      }),
      bounds: { origin: { x: 0, y: 704 }, size: { width: 320, height: 640 } },
      refreshSurfaceTouchHandler: jest.fn(),
    };
    const registry: any = {
      screens: {
        modal: { view: screenView },
      },
      screenContentWrapperViews: {
        modal: contentWrapperView,
      },
    };

    try {
      __nativeScriptRefreshScreenContentWrapperHostForTests('modal', registry);
    } finally {
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostView;
    }

    expect(contentWrapperView.removeFromSuperview).toHaveBeenCalled();
    expect(screenView.addSubview).toHaveBeenCalledWith(contentWrapperView);
    expect(contentWrapperView.superview).toBe(screenView);
    expect(contentWrapperView.frame).toEqual({
      origin: { x: 0, y: 0 },
      size: { height: 640, width: 320 },
    });
    expect(contentWrapperView.autoresizingMask).toBe(18);
    expect(contentWrapperView.hidden).toBe(false);
    expect(contentWrapperView.alpha).toBe(1);
    expect(contentWrapperView.userInteractionEnabled).toBe(true);
    expect(screenView.refreshSurfaceTouchHandler).toHaveBeenCalled();
    expect(refreshUIKitHostView).toHaveBeenCalledWith(contentWrapperView);
  });

  it('normalizes an already-mounted reused modal content wrapper before refreshing it', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const refreshUIKitHostView = jest.fn(() => true);
    NativeScriptRuntime.refreshUIKitHostViewDirectOwner = refreshUIKitHostView;

    const contentWrapperView: any = {
      alpha: 0,
      frame: { origin: { x: 0, y: 704 }, size: { width: 320, height: 640 } },
      hidden: true,
      removeFromSuperview: jest.fn(),
      userInteractionEnabled: false,
    };
    const disabledHostedLeaf: any = {
      alpha: 1,
      hidden: false,
      gestureRecognizers: [],
      subviews: [],
      userInteractionEnabled: false,
    };
    const disabledHostedRoot: any = {
      alpha: 1,
      hidden: false,
      gestureRecognizers: [],
      subviews: [disabledHostedLeaf],
      userInteractionEnabled: false,
    };
    const disabledGestureView: any = {
      alpha: 1,
      hidden: false,
      gestureRecognizers: [{}],
      subviews: [],
      userInteractionEnabled: false,
    };
    const hiddenHostedRoot: any = {
      alpha: 1,
      hidden: true,
      gestureRecognizers: [],
      subviews: [
        {
          alpha: 1,
          hidden: false,
          gestureRecognizers: [],
          subviews: [],
          userInteractionEnabled: false,
        },
      ],
      userInteractionEnabled: false,
    };
    contentWrapperView.subviews = [
      disabledHostedRoot,
      disabledGestureView,
      hiddenHostedRoot,
    ];
    const screenView: any = {
      addSubview: jest.fn(),
      bounds: { origin: { x: 0, y: 0 }, size: { width: 402, height: 874 } },
      refreshSurfaceTouchHandler: jest.fn(),
    };
    contentWrapperView.superview = screenView;
    const registry: any = {
      screens: {
        modal: { view: screenView },
      },
      screenContentWrapperViews: {
        modal: contentWrapperView,
      },
    };

    try {
      __nativeScriptRefreshScreenContentWrapperHostForTests('modal', registry);
    } finally {
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostView;
    }

    expect(contentWrapperView.removeFromSuperview).not.toHaveBeenCalled();
    expect(screenView.addSubview).not.toHaveBeenCalled();
    expect(contentWrapperView.frame).toEqual({
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    });
    expect(contentWrapperView.autoresizingMask).toBe(18);
    expect(contentWrapperView.hidden).toBe(false);
    expect(contentWrapperView.alpha).toBe(1);
    expect(contentWrapperView.userInteractionEnabled).toBe(true);
    expect(disabledHostedRoot.userInteractionEnabled).toBe(true);
    expect(disabledHostedLeaf.userInteractionEnabled).toBe(false);
    expect(disabledGestureView.userInteractionEnabled).toBe(true);
    expect(hiddenHostedRoot.userInteractionEnabled).toBe(false);
    expect(screenView.refreshSurfaceTouchHandler).toHaveBeenCalled();
    expect(refreshUIKitHostView).toHaveBeenCalledWith(contentWrapperView);
  });

  it('keeps the content wrapper visible when hosted content is detected separately', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const refreshUIKitHostView = jest.fn(() => false);
    NativeScriptRuntime.refreshUIKitHostViewDirectOwner = refreshUIKitHostView;

    const realModalContent = {
      alpha: 1,
      description: 'RCTViewComponentView',
      hidden: false,
      subviews: [
        {
          alpha: 1,
          description: 'RCTScrollViewComponentView',
          hidden: false,
          subviews: [],
        },
      ],
    };
    const contentWrapperView: any = {
      alpha: 1,
      description: 'RNSScreenContentWrapper.NativeScript',
      frame: { origin: { x: 0, y: 0 }, size: { width: 402, height: 812 } },
      hidden: false,
      removeFromSuperview: jest.fn(),
      subviews: [
        {
          alpha: 1,
          description: 'NativeScriptUIView',
          hidden: false,
          subviews: [],
        },
      ],
      userInteractionEnabled: true,
    };
    const screenView: any = {
      addSubview: jest.fn(),
      bounds: { origin: { x: 0, y: 0 }, size: { width: 402, height: 812 } },
      bringSubviewToFront: jest.fn(),
      refreshSurfaceTouchHandler: jest.fn(),
      sendSubviewToBack: jest.fn(),
      subviews: [realModalContent, contentWrapperView],
    };
    contentWrapperView.superview = screenView;
    const registry: any = {
      screens: {
        modal: { view: screenView },
      },
      screenContentReady: {
        modal: true,
      },
      screenContentWrapperHostHandles: {},
      screenContentWrapperHostReadyKeys: {},
      screenContentWrapperRefreshKeys: {},
      screenContentWrapperViews: {
        modal: contentWrapperView,
      },
      screenSurfaceTouchRefreshKeys: {},
    };

    try {
      __nativeScriptRefreshScreenContentWrapperHostForTests(
        'modal',
        registry,
        false,
        true,
        true,
      );
    } finally {
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostView;
    }

    expect(contentWrapperView.removeFromSuperview).not.toHaveBeenCalled();
    expect(screenView.addSubview).not.toHaveBeenCalled();
    expect(screenView.sendSubviewToBack).not.toHaveBeenCalled();
    expect(contentWrapperView.__nativeScriptEmptyContentWrapperShell).not.toBe(
      true,
    );
    expect(contentWrapperView.userInteractionEnabled).toBe(true);
    expect(screenView.refreshSurfaceTouchHandler).toHaveBeenCalled();
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

  it('keeps full-width stack back recognizers out of React pressable touches', () => {
    const UIControl = {};
    const UIScrollView = {};
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIAccessibilityTraitButton: 1,
      UIControl,
      UIScrollView,
    };

    const window = {};
    const host = {
      alpha: 1,
      hidden: false,
      subviews: [] as any[],
      userInteractionEnabled: true,
      window,
    };
    const pressableAncestor = {
      accessibilityRole: 'button',
      accessibilityTraits: 1,
      alpha: 1,
      hidden: false,
      superview: host,
      userInteractionEnabled: true,
      window,
    };
    const pressableTextLeaf = {
      alpha: 1,
      hidden: false,
      superview: pressableAncestor,
      userInteractionEnabled: true,
      window,
    };
    const uiControlLeaf = {
      alpha: 1,
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === UIControl,
      superview: host,
      userInteractionEnabled: true,
      window,
    };
    const scrollView = {
      alpha: 1,
      hidden: false,
      isKindOfClass: (klass: unknown) => klass === UIScrollView,
      superview: host,
      userInteractionEnabled: true,
      window,
    };
    const plainScrollLeaf = {
      alpha: 1,
      hidden: false,
      superview: scrollView,
      userInteractionEnabled: true,
      window,
    };
    const pressableHitTarget: any = {
      accessibilityLabel: 'Pop Detail',
      accessibilityRole: 'button',
      alpha: 1,
      hidden: false,
      hitTestWithEvent: jest.fn(function hitTest() {
        return pressableHitTarget;
      }),
      subviews: [],
      userInteractionEnabled: true,
      window,
    };
    const wrapperHitTarget: any = {
      alpha: 1,
      hidden: false,
      hitTestWithEvent: jest.fn(function hitTest() {
        return wrapperHitTarget;
      }),
      subviews: [pressableHitTarget],
      userInteractionEnabled: true,
      window,
    };
    pressableHitTarget.superview = wrapperHitTarget;
    wrapperHitTarget.superview = host;
    host.subviews = [wrapperHitTarget];

    expect(
      __nativeScriptStackGestureDelegateDecisionForTests.touchStartsOnInteractiveTarget(
        { view: pressableTextLeaf },
        host,
      ),
    ).toBe(true);
    expect(
      __nativeScriptStackGestureDelegateDecisionForTests.touchStartsOnInteractiveTarget(
        { view: uiControlLeaf },
        host,
      ),
    ).toBe(true);
    expect(
      __nativeScriptStackGestureDelegateDecisionForTests.touchStartsOnInteractiveTarget(
        { view: plainScrollLeaf },
        host,
      ),
    ).toBe(false);
    expect(
      __nativeScriptStackGestureDelegateDecisionForTests.touchStartsOnInteractiveTarget(
        {
          locationInView: () => ({ x: 20, y: 20 }),
          view: wrapperHitTarget,
        },
        host,
      ),
    ).toBe(true);
    expect(wrapperHitTarget.hitTestWithEvent).toHaveBeenCalled();
    expect(pressableHitTarget.hitTestWithEvent).toHaveBeenCalled();
    expect(
      __nativeScriptStackGestureDelegateDecisionForTests.shouldIgnoreInteractiveTouch(
        'custom-pan',
        { view: pressableTextLeaf },
        host,
      ),
    ).toBe(true);
    expect(
      __nativeScriptStackGestureDelegateDecisionForTests.shouldIgnoreInteractiveTouch(
        'native-content-pop',
        { view: pressableTextLeaf },
        host,
      ),
    ).toBe(true);
    expect(
      __nativeScriptStackGestureDelegateDecisionForTests.shouldIgnoreInteractiveTouch(
        'custom-edge',
        { view: pressableTextLeaf },
        host,
      ),
    ).toBe(false);

    const addSwipeGestureSource = stackSource.slice(
      stackSource.indexOf('function addStackSwipeGesture'),
      stackSource.indexOf('function installStackSwipeGestures'),
    );
    const nativeGestureDelegateSource = stackSource.slice(
      stackSource.indexOf(
        'function installNativeBackGestureDelegateForRecognizer',
      ),
      stackSource.indexOf('function installNativeBackGestureDelegate('),
    );

    expect(addSwipeGestureSource).toContain(
      'gestureRecognizerShouldReceiveTouch(_candidate: any, touch: any)',
    );
    expect(nativeGestureDelegateSource).toContain(
      'gestureRecognizerShouldReceiveTouch(_candidate: any, touch: any)',
    );
    expect(addSwipeGestureSource).toContain(
      'stackBackGestureShouldIgnoreInteractiveTouch(',
    );
    expect(stackSource).toContain('function touchHitViewForGesture');
    expect(stackSource).toContain(
      'nativeViewHitTestVisibleDescendantOutsideBounds(\n' +
        '        hostView,\n' +
        '        point,\n' +
        '        null,\n' +
        '      )',
    );
    expect(stackSource).toContain(
      'hostedSubviewHasUserAccessibilityPayload(view) ||\n' +
        '      nativeAccessibilityTraitsIncludeButton(view) ||',
    );
    expect(nativeGestureDelegateSource).toContain(
      'stackBackGestureShouldIgnoreInteractiveTouch(',
    );
    expect(addSwipeGestureSource).toContain('reason=interactive-touch');
    delete (global as Record<string, unknown>).__nativeScriptNativeApi;
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
    const RCTSurfaceTouchHandler = function RCTSurfaceTouchHandler() {};
    const enabledStates: boolean[] = [];
    let resetCount = 0;
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      RCTSurfaceTouchHandler,
    };
    const gestureRecognizer = {
      isKindOfClass: (klass: unknown) => klass === RCTSurfaceTouchHandler,
      reset: () => {
        resetCount += 1;
      },
      setEnabled: (enabled: boolean) => {
        enabledStates.push(enabled);
      },
    };

    expect(
      __nativeScriptStackCancelTouchesInParentForTests({
        superview: {
          __rnsNativeScriptScreenView: true,
          gestureRecognizers: [gestureRecognizer],
        },
      }),
    ).toBe(true);
    expect(enabledStates).toEqual([false, true]);
    expect(resetCount).toBe(1);
    enabledStates.length = 0;
    resetCount = 0;
    expect(
      __nativeScriptStackCancelTouchesInParentForTests({
        superview: {
          __rnsNativeScriptScreenView: true,
          gestureRecognizers: [
            {
              description: () => '<RCTSurfaceTouchHandler: 0x123>',
              isKindOfClass: () => {
                throw new TypeError('class wrapper mismatch');
              },
              reset: () => {
                resetCount += 1;
              },
              setEnabled: (enabled: boolean) => {
                enabledStates.push(enabled);
              },
            },
          ],
        },
      }),
    ).toBe(true);
    expect(enabledStates).toEqual([false, true]);
    expect(resetCount).toBe(1);
    delete (global as Record<string, unknown>).__nativeScriptNativeApi;
    expect(__nativeScriptStackCancelTouchesInParentForTests({})).toBe(false);
    expect(stackSource).toContain('function cancelTouchesInParent');
    expect(stackSource).toContain(
      'function findSurfaceTouchHandlerInAncestorChain',
    );
    expect(stackSource).toContain('function nativeObjectDescription');
    expect(stackSource).toContain('RCTSurfaceTouchHandler');
    expect(stackSource).toContain("nativeValue('RCTSurfaceView')");
    expect(stackSource).toContain('function nativeScriptScreenOrReactRootView');
    expect(stackSource).toContain('function nativeScriptScreenView');
    expect(stackSource).toContain(
      'function surfaceTouchHandlerInAncestorChain',
    );
    expect(stackSource).toContain(
      'NativeScript hosts RNSScreen content through UIKit\n  // controller views',
    );
    expect(stackSource).toContain(
      'function shouldAttachSurfaceTouchHandlerToScreenView',
    );
    const nativeGestureDelegateSource = stackSource.slice(
      stackSource.indexOf('function installNativeBackGestureDelegateForRecognizer'),
      stackSource.indexOf('function installNativeBackGestureDelegate('),
    );
    expect(nativeGestureDelegateSource).toContain(
      'cancelTouchesInParent(navigationController.view);',
    );
    expect(nativeGestureDelegateSource).toContain(
      'STACK_NATIVE_BACK_GESTURE_ACTION_KEY',
    );
    expect(nativeGestureDelegateSource).toContain(
      'ctx.gestureAction(gesture',
    );
    expect(nativeGestureDelegateSource).toContain(
      'stack-native-back-gesture-action',
    );
    expect(nativeGestureDelegateSource).toContain(
      "gestureRecognizerState('Began', 1)",
    );
    expect(nativeGestureDelegateSource).toContain(
      "gestureRecognizerState('Cancelled', 4)",
    );
    expect(nativeGestureDelegateSource).toContain(
      "gestureRecognizerState('Failed', 5)",
    );
    expect(nativeGestureDelegateSource).toContain(
      'finishNativeBackGestureTransitionFromTerminalState(',
    );
    expect(nativeGestureDelegateSource).toContain(
      'const activeIds = registry.stackActiveScreenIds[stackId] ?? [];',
    );
    expect(nativeGestureDelegateSource).not.toContain(
      'stackActiveScreenIdsForUIKitModel(',
    );
    expect(nativeGestureDelegateSource).toContain(
      'registry.stackTransitionNativeDriven[stackId] = true;',
    );
    expect(nativeGestureDelegateSource).toContain(
      'registry.stackTransitionRequestedFromJS[stackId] = false;',
    );
    expect(nativeGestureDelegateSource).not.toContain('markTransition(');
    const shouldBeginSource = nativeGestureDelegateSource.slice(
      nativeGestureDelegateSource.indexOf('gestureRecognizerShouldBegin'),
      nativeGestureDelegateSource.indexOf(
        'gestureRecognizerShouldRecognizeSimultaneouslyWithGestureRecognizer',
      ),
    );
    expect(shouldBeginSource).not.toContain('markTransition(');
    expect(stackSource).toContain(
      'function finishNativeBackGestureTransitionFromTerminalState',
    );
    expect(stackSource).toContain(
      'runAfterNavigationStackTransitionCoordinator(',
    );
    expect(stackSource).toContain(
      "const shouldWaitForCoordinator = terminalState === 'ended';",
    );
    expect(stackSource).toContain(
      'const latestActiveIds = resolvedRegistry.stackActiveScreenIds[stackId] ?? [];',
    );
    expect(stackSource).toContain(
      'COMPLETE_NATIVE_BACK_GESTURE_TRANSITION_KEY',
    );
    expect(stackSource).toContain(
      'completeNativeBackGestureTransitionFromTerminalState',
    );
    expect(stackSource).toContain(
      'callWorkletFunction(completeNativeBackGestureTransition',
    );
    expect(stackSource).toContain(
      'stack-native-back-gesture-terminal-complete',
    );
    expect(stackSource).toContain(
      'notifyWhenInteractionChangesUsingBlock:',
    );
    expect(stackSource).toContain(
      'stack-native-back-gesture-defer-native-completion',
    );
    expect(stackSource).toContain(
      'stack-native-back-gesture-began-native-completion',
    );
    expect(stackSource).toContain(
      'stack-native-back-gesture-await-began-completion',
    );
    expect(stackSource).toContain(
      'stack-native-back-gesture-native-dismiss-complete',
    );
    expect(nativeGestureDelegateSource).not.toContain(
      'finishNativeBackGestureCancelWithoutRegisteredTransition(',
    );
    expect(stackSource).not.toContain(
      'function finishNativeBackGestureCancelWithoutRegisteredTransition',
    );
    expect(stackSource).not.toContain(
      'stack-native-back-gesture-cancel-no-transition',
    );
    expect(stackSource).not.toContain(
      "'native-back-gesture-cancel-no-transition'",
    );
    expect(stackSource).not.toContain('stack-native-back-gesture-dismissed');
    expect(nativeGestureDelegateSource).not.toContain(
      'setScreenTransitionInteractionDisabled(screenId, registry, true);',
    );
    expect(nativeGestureDelegateSource).not.toContain(
      'setTimeout(completeCancel',
    );
    expect(stackSource).not.toContain('stackNativeBackGestureCancelPending');
    expect(stackSource).not.toContain(
      'function completePendingNativeBackGestureCancelIfNeeded',
    );
    expect(stackSource).not.toContain('stack-native-back-gesture-cancel-skip');
    expect(nativeGestureDelegateSource).not.toContain(
      'stack-native-back-gesture-mark-transition',
    );
    const customGestureSource = stackSource.slice(
      stackSource.indexOf('function addStackSwipeGesture'),
      stackSource.indexOf('function installStackSwipeGestures'),
    );
    expect(customGestureSource).toContain('cancelTouchesInParent(view);');
    expect(customGestureSource).toMatch(
      /registry\.stackFullWidthSwipingWithPanGesture\[stackId\]\s*=\s*fullWidth \|\| gestureKind === 'custom-edge';/,
    );
    expect(customGestureSource).toMatch(
      /fullWidth \|\|\s*gestureKind === 'custom-edge' \|\|\s*topScreenUsesCustomSwipeAnimation\(props\)/,
    );
  });

  it('keeps RNSScreenNativeScriptView surface touch handler ownership idempotent', () => {
    const screenViewClassSource = stackSource.slice(
      stackSource.indexOf('class RNSScreenNativeScriptView'),
      stackSource.indexOf('function nativeScriptScreenView()'),
    );
    const RCTSurfaceTouchHandler = function RCTSurfaceTouchHandler() {};
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      RCTSurfaceTouchHandler,
    };

    const keptHandler = {
      detachFromView: jest.fn(),
      isKindOfClass: (klass: unknown) => klass === RCTSurfaceTouchHandler,
    };
    const unrelatedGesture = {
      detachFromView: jest.fn(),
      description: () => '<UIPanGestureRecognizer: 0x999>',
    };
    const duplicateHandler = {
      detachFromView: jest.fn(),
      description: () => '<RCTSurfaceTouchHandler: 0x123>',
      isKindOfClass: () => {
        throw new TypeError('class wrapper mismatch');
      },
    };
    const view = {
      gestureRecognizers: [keptHandler, unrelatedGesture, duplicateHandler],
    };

    expect(__nativeScriptSurfaceTouchHandlersForTests(view)).toEqual([
      keptHandler,
      duplicateHandler,
    ]);
    expect(
      __nativeScriptDetachSurfaceTouchHandlersForTests(view, keptHandler),
    ).toEqual([keptHandler, duplicateHandler]);
    expect(keptHandler.detachFromView).not.toHaveBeenCalled();
    expect(unrelatedGesture.detachFromView).not.toHaveBeenCalled();
    expect(duplicateHandler.detachFromView).toHaveBeenCalledWith(view);

    const ownedHandler = {
      detachFromView: jest.fn(),
      view: undefined as any,
    };
    const ownedView = {
      gestureRecognizers: [ownedHandler],
    };
    ownedHandler.view = ownedView;
    expect(
      __nativeScriptSurfaceTouchHandlerAttachedToViewForTests(
        ownedHandler,
        ownedView,
      ),
    ).toBe(true);
    expect(
      __nativeScriptDetachSurfaceTouchHandlerFromViewForTests(
        ownedHandler,
        ownedView,
      ),
    ).toBe(true);
    expect(ownedHandler.detachFromView).toHaveBeenCalledWith(ownedView);

    const staleTrackedHandler = {
      detachFromView: jest.fn(),
      view: undefined as any,
    };
    const otherView = {
      gestureRecognizers: [staleTrackedHandler],
    };
    staleTrackedHandler.view = otherView;
    const staleView = {
      gestureRecognizers: [],
    };
    expect(
      __nativeScriptSurfaceTouchHandlerAttachedToViewForTests(
        staleTrackedHandler,
        staleView,
      ),
    ).toBe(false);
    expect(
      __nativeScriptDetachSurfaceTouchHandlerFromViewForTests(
        staleTrackedHandler,
        staleView,
      ),
    ).toBe(false);
    expect(staleTrackedHandler.detachFromView).not.toHaveBeenCalled();

    const convertedOrigin = { x: 12, y: 34 };
    const originHandler = {
      description: () => '<RCTSurfaceTouchHandler: 0x456>',
      viewOriginOffset: undefined as unknown,
    };
    const originView = {
      convertPointToView: jest.fn(() => convertedOrigin),
      gestureRecognizers: [originHandler],
      window: {},
    };

    expect(
      __nativeScriptUpdateSurfaceTouchHandlerOriginsForTests(originView),
    ).toBe(true);
    expect(originHandler.viewOriginOffset).toBe(convertedOrigin);
    expect(originView.convertPointToView).toHaveBeenCalledWith(
      { x: 0, y: 0 },
      originView.window,
    );

    const ancestorConvertedOrigin = { x: 25, y: 116 };
    const ancestorHandler = {
      description: () => '<RCTSurfaceTouchHandler: 0x789>',
      viewOriginOffset: undefined as unknown,
    };
    const ancestorOwner = {
      convertPointToView: jest.fn(() => ancestorConvertedOrigin),
      description: () => '<RCTRootComponentView: 0x999>',
      gestureRecognizers: [ancestorHandler],
      window: {},
    };
    const descendantView = {
      superview: ancestorOwner,
    };

    expect(
      __nativeScriptUpdateAncestorSurfaceTouchHandlerOriginsForTests(
        descendantView,
      ),
    ).toBe(true);
    expect(ancestorHandler.viewOriginOffset).toBe(ancestorConvertedOrigin);
    expect(ancestorOwner.convertPointToView).toHaveBeenCalledWith(
      { x: 0, y: 0 },
      ancestorOwner.window,
    );
    expect(
      __nativeScriptUpdateAncestorSurfaceTouchHandlerOriginsForTests(
        ancestorOwner,
      ),
    ).toBe(false);

    delete (global as Record<string, unknown>).__nativeScriptNativeApi;

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      RCTSurfaceTouchHandler,
    };
    const window = {};
    const rootMountedView = {
      isMountedUnderScreenOrReactRoot: jest.fn(() => true),
      superview: {},
      window,
    };
    const rootMountedScreenView = {
      __rnsNativeScriptScreenView: true,
      isMountedUnderScreenOrReactRoot: jest.fn(() => true),
      superview: {},
      window,
    };
    const usableAncestorHandlerOwner: any = {
      description: () => '<RCTRootComponentView: 0x123>',
      gestureRecognizers: [],
      window,
    };
    const usableAncestorHandler = {
      enabled: true,
      isKindOfClass: (klass: unknown) => klass === RCTSurfaceTouchHandler,
      view: usableAncestorHandlerOwner,
    };
    usableAncestorHandlerOwner.gestureRecognizers = [usableAncestorHandler];
    const rootMountedScreenViewWithAncestorHandler = {
      __rnsNativeScriptScreenView: true,
      isMountedUnderScreenOrReactRoot: jest.fn(() => true),
      superview: usableAncestorHandlerOwner,
      window,
    };
    const disabledAncestorHandlerOwner: any = {
      description: () => '<RCTRootComponentView: 0x456>',
      gestureRecognizers: [],
      window,
    };
    const disabledAncestorHandler = {
      enabled: false,
      isKindOfClass: (klass: unknown) => klass === RCTSurfaceTouchHandler,
      view: disabledAncestorHandlerOwner,
    };
    disabledAncestorHandlerOwner.gestureRecognizers = [disabledAncestorHandler];
    const rootMountedScreenViewWithDisabledAncestorHandler = {
      __rnsNativeScriptScreenView: true,
      isMountedUnderScreenOrReactRoot: jest.fn(() => true),
      superview: disabledAncestorHandlerOwner,
      window,
    };
    const detachedModalView = {
      isMountedUnderScreenOrReactRoot: jest.fn(() => false),
      superview: {},
      window,
    };
    const offWindowDetachedScreenView = {
      __rnsNativeScriptScreenView: true,
      isMountedUnderScreenOrReactRoot: jest.fn(() => false),
      superview: {},
      window: null,
    };
    const offWindowAncestorHandlerOwner: any = {
      description: () => '<RNSScreenNativeScriptView: 0x789>',
      gestureRecognizers: [],
      window: null,
    };
    const offWindowAncestorHandler = {
      enabled: true,
      isKindOfClass: (klass: unknown) => klass === RCTSurfaceTouchHandler,
      view: offWindowAncestorHandlerOwner,
    };
    offWindowAncestorHandlerOwner.gestureRecognizers = [
      offWindowAncestorHandler,
    ];
    const offWindowRootMountedChildView = {
      isMountedUnderScreenOrReactRoot: jest.fn(() => true),
      superview: offWindowAncestorHandlerOwner,
      window: null,
    };
    const detachedTransitionScreenView = {
      __rnsNativeScriptScreenView: true,
      isMountedUnderScreenOrReactRoot: jest.fn(() => false),
      superview: null,
      window: null,
    };

    expect(
      __nativeScriptShouldAttachSurfaceTouchHandlerForTests(rootMountedView),
    ).toBe(true);
    expect(
      __nativeScriptShouldAttachSurfaceTouchHandlerForTests(
        rootMountedScreenView,
      ),
    ).toBe(true);
    expect(
      __nativeScriptShouldAttachSurfaceTouchHandlerForTests(
        rootMountedScreenViewWithAncestorHandler,
      ),
    ).toBe(false);
    expect(
      __nativeScriptShouldAttachSurfaceTouchHandlerForTests(
        rootMountedScreenViewWithDisabledAncestorHandler,
      ),
    ).toBe(true);
    expect(
      __nativeScriptShouldAttachSurfaceTouchHandlerForTests(detachedModalView),
    ).toBe(true);
    expect(
      __nativeScriptShouldAttachSurfaceTouchHandlerForTests(
        offWindowDetachedScreenView,
      ),
    ).toBe(true);
    expect(
      __nativeScriptShouldAttachSurfaceTouchHandlerForTests(
        offWindowRootMountedChildView,
      ),
    ).toBe(false);
    expect(
      __nativeScriptShouldAttachSurfaceTouchHandlerForTests(
        detachedTransitionScreenView,
      ),
    ).toBe(false);
    expect(
      __nativeScriptShouldAttachSurfaceTouchHandlerForTests(
        detachedTransitionScreenView,
        undefined,
        true,
      ),
    ).toBe(true);
    expect(rootMountedView.isMountedUnderScreenOrReactRoot).toHaveBeenCalled();
    expect(
      rootMountedScreenView.isMountedUnderScreenOrReactRoot,
    ).toHaveBeenCalled();
    expect(
      rootMountedScreenViewWithAncestorHandler.isMountedUnderScreenOrReactRoot,
    ).toHaveBeenCalled();
    expect(
      rootMountedScreenViewWithDisabledAncestorHandler.isMountedUnderScreenOrReactRoot,
    ).toHaveBeenCalled();
    expect(
      detachedModalView.isMountedUnderScreenOrReactRoot,
    ).toHaveBeenCalled();
    expect(
      offWindowDetachedScreenView.isMountedUnderScreenOrReactRoot,
    ).toHaveBeenCalled();
    expect(
      offWindowRootMountedChildView.isMountedUnderScreenOrReactRoot,
    ).toHaveBeenCalled();
    expect(
      detachedTransitionScreenView.isMountedUnderScreenOrReactRoot,
    ).not.toHaveBeenCalled();

    const nativeStackTouchRegistry = {
      screenParents: {
        root: 'stack',
        detail: 'stack',
        modal: 'stack',
        'modal:content': undefined,
        orphan: 'missing-stack',
      },
      screenProps: {
        root: { stackPresentation: 'push' },
        detail: { stackPresentation: 'push' },
        modal: { stackPresentation: 'modal' },
        'modal:content': { stackPresentation: 'push' },
        orphan: { stackPresentation: 'push' },
      },
      stackContexts: {
        stack: {},
      },
    };

    expect(
      __nativeScriptScreenRequiresOwnSurfaceTouchHandlerForTests(
        'root',
        nativeStackTouchRegistry as any,
      ),
    ).toBe(false);
    expect(
      __nativeScriptScreenRequiresOwnSurfaceTouchHandlerForTests(
        'detail',
        nativeStackTouchRegistry as any,
      ),
    ).toBe(false);
    expect(
      __nativeScriptScreenRequiresOwnSurfaceTouchHandlerForTests(
        'modal',
        nativeStackTouchRegistry as any,
      ),
    ).toBe(true);
    expect(
      __nativeScriptScreenRequiresOwnSurfaceTouchHandlerForTests(
        'modal:content',
        nativeStackTouchRegistry as any,
      ),
    ).toBe(true);
    expect(
      __nativeScriptScreenRequiresOwnSurfaceTouchHandlerForTests(
        'orphan',
        nativeStackTouchRegistry as any,
      ),
    ).toBe(false);

    const nativeScriptScreenView: any = {
      __rnsNativeScriptScreenView: true,
    };
    const mountedContentWrapperView: any = {
      superview: nativeScriptScreenView,
    };
    const unmarkedScreenView: any = {};
    const mountedWrapperUnderUnmarkedScreenView: any = {
      superview: unmarkedScreenView,
    };
    const detachedContentWrapperView: any = {
      superview: null,
    };
    const contentWrapperThatIsScreenView: any = {
      __rnsNativeScriptScreenView: true,
    };

    expect(
      __nativeScriptContentWrapperNeedsSurfaceTouchHandlerFallbackForTests(
        nativeScriptScreenView,
        mountedContentWrapperView,
      ),
    ).toBe(false);
    expect(
      __nativeScriptContentWrapperNeedsSurfaceTouchHandlerFallbackForTests(
        unmarkedScreenView,
        mountedWrapperUnderUnmarkedScreenView,
      ),
    ).toBe(false);
    expect(
      __nativeScriptContentWrapperNeedsSurfaceTouchHandlerFallbackForTests(
        undefined,
        detachedContentWrapperView,
      ),
    ).toBe(true);
    expect(
      __nativeScriptContentWrapperNeedsSurfaceTouchHandlerFallbackForTests(
        contentWrapperThatIsScreenView,
        contentWrapperThatIsScreenView,
      ),
    ).toBe(true);
    const staleMountedWrapperHandler = {
      detachFromView: jest.fn(),
      isKindOfClass: (klass: unknown) => klass === RCTSurfaceTouchHandler,
      view: mountedContentWrapperView,
    };
    mountedContentWrapperView.gestureRecognizers = [staleMountedWrapperHandler];

    expect(
      __nativeScriptDetachRedundantContentWrapperSurfaceTouchHandlerForTests(
        nativeScriptScreenView,
        mountedContentWrapperView,
      ),
    ).toBe(true);
    expect(staleMountedWrapperHandler.detachFromView).toHaveBeenCalledWith(
      mountedContentWrapperView,
    );
    staleMountedWrapperHandler.detachFromView.mockClear();
    detachedContentWrapperView.gestureRecognizers = [
      staleMountedWrapperHandler,
    ];

    expect(
      __nativeScriptDetachRedundantContentWrapperSurfaceTouchHandlerForTests(
        undefined,
        detachedContentWrapperView,
      ),
    ).toBe(false);
    expect(staleMountedWrapperHandler.detachFromView).not.toHaveBeenCalled();

    delete (global as Record<string, unknown>).__nativeScriptNativeApi;

    expect(stackSource).toContain('function surfaceTouchHandlersForView');
    expect(stackSource).toContain(
      'function updateSurfaceTouchHandlerOriginsForView',
    );
    expect(stackSource).toContain(
      'function updateAncestorSurfaceTouchHandlerOriginsForView',
    );
    expect(stackSource).toContain('handler.viewOriginOffset = origin;');
    expect(stackSource).not.toContain(
      "setNativeValueForKey(handler, 'viewOriginOffset', origin)",
    );
    expect(stackSource).toContain('function nativeObjectStableHandle');
    expect(stackSource).toContain('function viewWindowOriginKey');
    expect(stackSource).toContain('viewWindowOriginKey(screenView)');
    expect(stackSource).toContain('viewWindowOriginKey(contentWrapperView)');
    expect(stackSource).toContain(
      'usableSurfaceTouchHandlerInAncestorChain(screenView) != null',
    );
    expect(stackSource).toContain(
      'function screenRequiresOwnSurfaceTouchHandler',
    );
    expect(stackSource).toContain(
      'function screenShouldOwnSurfaceTouchHandlerDuringTransition',
    );
    expect(
      stackSource.indexOf('function findSurfaceTouchHandlerOwnerInAncestorChain'),
    ).toBeLessThan(
      stackSource.indexOf(
        'function updateAncestorSurfaceTouchHandlerOriginsForView',
      ),
    );
    expect(stackSource).toContain(
      'updateAncestorSurfaceTouchHandlerOriginsForView(screenView)',
    );
    expect(stackSource).toContain(
      'updateAncestorSurfaceTouchHandlerOriginsForView(contentWrapperView)',
    );
    expect(stackSource).toContain('ancestorScreen=');
    expect(stackSource).toContain('ancestorWrapper=');
    const ownTouchHandlerSource = stackSource.slice(
      stackSource.indexOf('function screenRequiresOwnSurfaceTouchHandler'),
      stackSource.indexOf(
        'function refreshNativeScriptScreenViewSurfaceTouchHandler',
      ),
    );
    expect(ownTouchHandlerSource).not.toContain(
      'registry.screenParents?.[screenId]',
    );
    expect(ownTouchHandlerSource).not.toContain('registry.stackContexts');
    expect(stackSource).toContain(
      "const separatorIndex = screenId.indexOf(':');",
    );
    expect(stackSource).toContain(
      'const modalId = screenId.slice(0, separatorIndex);',
    );
    expect(stackSource).toContain(
      'screenRequiresOwnSurfaceTouchHandler(screenId, registry)',
    );
    expect(stackSource).toContain(
      'screenShouldOwnSurfaceTouchHandlerDuringTransition(screenId, registry)',
    );
    expect(stackSource).toContain(
      "forceOwnSurfaceTouchHandler ? 'own-touch' : 'ancestor-touch'",
    );
    expect(stackSource).toContain(
      'function shouldAttachSurfaceTouchHandlerToScreenView',
    );
    const shouldAttachSurfaceTouchHandlerSource = stackSource.slice(
      stackSource.indexOf(
        'function shouldAttachSurfaceTouchHandlerToScreenView',
      ),
      stackSource.indexOf('function configureReactTouchSurfaceView'),
    );

    expect(shouldAttachSurfaceTouchHandlerSource).not.toContain(
      'if (view.__rnsNativeScriptScreenView === true) {\n' +
        '    return true;\n' +
        '  }',
    );
    expect(shouldAttachSurfaceTouchHandlerSource).toContain(
      '!screenViewIsMountedUnderScreenOrReactRoot(view)',
    );
    expect(shouldAttachSurfaceTouchHandlerSource).toContain(
      'usableSurfaceTouchHandlerInAncestorChain(view) == null',
    );
    expect(shouldAttachSurfaceTouchHandlerSource).toContain(
      'surfaceTouchHandlerInAncestorChain(view) == null',
    );
    expect(stackSource).toContain(
      'surfaceTouchHandlerIsUsable(gestureRecognizer, ownerView)',
    );
    expect(stackSource).toContain('function configureReactTouchSurfaceView');
    expect(stackSource).toContain('view.multipleTouchEnabled = true;');
    expect(stackSource).toContain('function nativeScriptScreenOrReactRootView');
    expect(stackSource).toContain('function gestureRecognizerAttachedView');
    expect(stackSource).toContain('function surfaceTouchHandlerIsUsable');
    expect(stackSource).toContain(
      'function screenSurfaceTouchHandlerIsCurrent',
    );
    expect(stackSource).toContain(
      'function viewHasAttachedSurfaceTouchHandler',
    );
    expect(stackSource).toContain('function surfaceTouchHandlerAttachmentKey');
    expect(stackSource).toContain(
      "handler?.enabled === false ? 'disabled' : 'enabled'",
    );
    expect(stackSource).toContain('function detachSurfaceTouchHandlerFromView');
    expect(stackSource).toContain(
      'gestureRecognizerAttachedView(trackedTouchHandler)',
    );
    expect(stackSource).toContain(
      'function detachSurfaceTouchHandlersFromView',
    );
    expect(stackSource).toContain('attachedHandlers.length > 1');
    expect(stackSource).toContain(
      'view.__rnsNativeScriptSurfaceTouchHandler = touchHandler',
    );
    expect(stackSource).toContain('touchHandler.enabled = true;');
    expect(stackSource).toContain(
      'view.__rnsNativeScriptLastTouchRefreshWindowHandle = windowHandle;',
    );
    expect(stackSource).toContain(
      'lastRefreshSuperviewHandle === superviewHandle',
    );
    expect(stackSource).toContain('touch-refresh-preserve-transient-detach');
    expect(stackSource).toContain(
      '!shouldAttach &&\n' +
        '    (view.window == null || view.superview == null)',
    );
    expect(stackSource).toContain(
      'view.__rnsNativeScriptSurfaceTouchHandlerAttached === true',
    );
    expect(stackSource).toContain(
      "'hitTest:withEvent:'(point: any, event: any)",
    );
    expect(screenViewClassSource).toContain(
      'this.super?.didMoveToSuperview?.();',
    );
    expect(screenViewClassSource).toContain(
      'configureReactTouchSurfaceView(this);',
    );
    expect(screenViewClassSource).toContain(
      'isMountedUnderScreenOrReactRoot()',
    );
    expect(screenViewClassSource).toContain(
      'refreshNativeScriptScreenViewSurfaceTouchHandler(this);',
    );
    expect(screenViewClassSource).not.toContain(
      'this.refreshSurfaceTouchHandler();',
    );
    expect(screenViewClassSource).toContain('layoutSubviews()');
    expect(screenViewClassSource).toContain('this.super?.layoutSubviews?.();');
    expect(screenViewClassSource).not.toContain(
      'updateSurfaceTouchHandlerOriginsForView(this);',
    );
    expect(stackSource).toContain(
      'class RNSScreenStackNativeScriptView extends UIView',
    );
    expect(stackSource).toContain(
      'this.super?.didMoveToWindow?.();\n      configureReactTouchSurfaceView(this);',
    );
    expect(stackSource).toContain(
      'updateSurfaceTouchHandlerOriginsForView(view, RCTSurfaceTouchHandler);',
    );
    expect(stackSource).toContain('function screenViewAccessibilityElements');
    expect(screenViewClassSource).toContain('accessibilityElements()');
    expect(screenViewClassSource).toContain('accessibilityElementCount()');
    expect(screenViewClassSource).toContain(
      "'accessibilityElementAtIndex:'(index: number)",
    );
    expect(screenViewClassSource).toContain(
      "'indexOfAccessibilityElement:'(element: any)",
    );
    expect(stackSource).toContain(
      'accessibilityElements: {\n      params: [],',
    );
    expect(stackSource).toContain("'accessibilityElementAtIndex:':");
    expect(stackSource).toContain("'indexOfAccessibilityElement:':");
    expect(screenViewClassSource).not.toContain(
      "layoutSubviews() {\n      'worklet';\n\n      this.super?.layoutSubviews?.();\n      this.refreshSurfaceTouchHandler();",
    );
    expect(stackSource).toContain('view.superview == null');
    expect(stackSource).toContain(
      'if (view.__rnsNativeScriptScreenView === true) {\n' +
        '    return true;\n' +
        '  }',
    );
    expect(screenViewClassSource.indexOf('didMoveToSuperview()')).toBeLessThan(
      screenViewClassSource.indexOf('didMoveToWindow()'),
    );
    expect(stackSource).not.toContain('layoutHostedSubviewChain(this, 0);');
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

  it('keeps stack-owned edge pop gating off gesture response distance', () => {
    const addSwipeGestureStart = stackSource.indexOf(
      'function addStackSwipeGesture',
    );
    const addSwipeGestureSource = stackSource.slice(
      addSwipeGestureStart,
      stackSource.indexOf('ctx.gestureAction(gesture', addSwipeGestureStart),
    );

    expectSourceToContain(
      addSwipeGestureSource,
      'nativeScriptStackContainerViewForStackId(\n' +
        '      stackId,\n' +
        '      navigationController,\n' +
        '      registry,\n' +
        '    )',
    );
    expect(addSwipeGestureSource).toContain(
      ': hostView ?? stackContainerView ?? navigationController?.view',
    );
    expect(addSwipeGestureSource).toMatch(
      /fullWidth\s*&&\s*!gestureResponseDistanceAllows/,
    );
    expect(addSwipeGestureSource).toMatch(
      /fullWidth\s*&&\s*!stackSwipeGestureHasBackMotion/,
    );
    expect(addSwipeGestureSource).toMatch(
      /!fullWidth\s*&&\s*!stackBackGestureUsesCorrectEdge/,
    );
    expect(addSwipeGestureSource.indexOf('!stackSwipeGestureHasBackMotion')).toBeLessThan(
      addSwipeGestureSource.indexOf('cancelTouchesInParent(view)'),
    );
    expect(addSwipeGestureSource).not.toMatch(
      /viewControllerCount < 2 \|\|\s*!gestureResponseDistanceAllows/,
    );
    const gestureActionSource = stackSource.slice(
      stackSource.indexOf('ctx.gestureAction(gesture'),
      stackSource.indexOf('function installStackSwipeGestures'),
    );
    expect(gestureActionSource).toContain(
      'if (topScreenUsesCustomSwipeAnimation(props))',
    );
    expect(gestureActionSource).toMatch(
      /invokeNativeSelector\(\s*navigationController,\s*'popViewControllerAnimated',\s*'popViewControllerAnimated:',\s*true,\s*\)/,
    );
    expect(gestureActionSource).not.toContain(
      'beginStackAppearanceTransition(',
    );
    expect(gestureActionSource).not.toContain(
      'stack-swipe-gesture-action-error',
    );
    const installGestureSource = stackSource.slice(
      stackSource.indexOf('function installStackSwipeGestures'),
      stackSource.indexOf('function applyNavigationAppearance'),
    );
    const gestureHostSource = stackSource.slice(
      stackSource.indexOf('function stackSwipeGestureHostViews'),
      stackSource.indexOf('function installStackSwipeGestures'),
    );
    expect(stackSource).toContain('function stackSwipeGestureHostViews');
    expect(gestureHostSource).toContain(
      'Upstream RNSScreenStackView owns one set of custom swipe recognizers.',
    );
    expect(gestureHostSource).toContain(
      "stackContainerView && typeof stackContainerView.addGestureRecognizer === 'function'",
    );
    expect(gestureHostSource).toContain(
      'addUniqueGestureHost(hosts, gestureHost);',
    );
    expect(gestureHostSource).not.toContain(
      'screenContentWrapperChildHostView(',
    );
    expect(gestureHostSource).not.toContain(
      'liveScreenContentWrapperViewFromRegistry(',
    );
    expect(installGestureSource).toContain(
      'const hosts = stackSwipeGestureHostViews(',
    );
    expect(installGestureSource).toContain(
      'stackSwipeGesturesAreInstalledOnView(host, stackId)',
    );
    expect(installGestureSource).toContain(
      'markStackSwipeGesturesInstalledOnView(host, stackId);',
    );
    expect(stackSource).toContain(
      'STACK_SWIPE_GESTURES_INSTALLED_ASSOCIATION_KEY',
    );
    expect(stackSource).toContain(
      'function stackSwipeGestureAssociationKey',
    );
    expect(stackSource).toContain('STACK_SWIPE_GESTURE_OWNER_ASSOCIATION_KEY');
    expect(stackSource).toContain('STACK_SWIPE_GESTURE_NAME_PREFIX');
    expect(stackSource).toContain('function stackSwipeGestureNativeName');
    expect(stackSource).toContain('function stackSwipeGestureBelongsToStack');
    expect(stackSource).toContain('function stackSwipeGestureCountOnView');
    expect(stackSource).toContain('function removeStackSwipeGesturesFromView');
    expect(stackSource).toContain(
      "setNativeValueForKey(gesture, 'name', gestureName);",
    );
    expect(stackSource).toContain(
      'STACK_SWIPE_GESTURE_OWNER_ASSOCIATION_KEY,\n' +
        '    gestureOwnerKey,',
    );
    expect(stackSource).toContain(
      'stackSwipeGestureCountOnView(view, stackId) >= 3',
    );
    expect(installGestureSource).toContain(
      'removeStackSwipeGesturesFromView(host, stackId);',
    );
    expect(stackSource).toContain(
      'associatedObjectForKey(view, stackSwipeGestureAssociationKey(stackId))',
    );
    expect(stackSource).toContain(
      'setAssociatedObjectForKey(\n' +
        '    view,\n' +
        '    stackSwipeGestureAssociationKey(stackId),\n' +
        "    '1',\n" +
        '  );',
    );
    expect(stackSource).toContain(
      'unmarkStackSwipeGesturesInstalledOnView(view, stackId);',
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

    const hasBackMotion =
      __nativeScriptStackGestureDelegateDecisionForTests.hasBackMotion;

    expect(hasBackMotion(gesture(0), ltrView, {} as any)).toBe(false);
    expect(hasBackMotion(gesture(3), ltrView, {} as any)).toBe(true);
    expect(hasBackMotion(gesture(-3), ltrView, {} as any)).toBe(false);
    expect(hasBackMotion(gesture(-3), rtlView, {} as any)).toBe(true);
    expect(
      hasBackMotion(gesture(3), ltrView, {
        stackAnimation: 'slide_from_left',
      } as any),
    ).toBe(false);
  });

  it('keeps fresh JS stack mutations off unrelated UIKit transition coordinators', () => {
    const reconcileBeforeDiffSource = stackSource.slice(
      stackSource.indexOf('function reconcileStack'),
      stackSource.indexOf('if (canAnimateNativeChange && previousKey != null'),
    );
    const pushPopSource = stackSource.slice(
      stackSource.indexOf('if (canAnimateNativeChange && previousKey != null'),
      stackSource.indexOf('const previousTopScreenId ='),
    );

    expect(stackSource).not.toContain(
      'function scheduleReconcileAfterNativeTransition',
    );
    expect(reconcileBeforeDiffSource).not.toContain(
      'transitionCoordinatorForController',
    );
    expect(reconcileBeforeDiffSource).not.toContain(
      'animateAlongsideTransitionCompletion',
    );
    expect(pushPopSource).toContain('animateStackPush(');
    expect(pushPopSource).toContain('animateStackPop(');
    expect(stackSource).toContain('animateAlongsideTransitionCompletion(');
    expect(stackSource).toContain("'animateAlongsideTransition:completion:'");
    expect(stackSource).toContain('InteropBlock(');
    expect(stackSource).toContain(
      'interopBlock(TRANSITION_COORDINATOR_COMPLETION_BLOCK, complete)',
    );
    expect(stackSource).not.toContain('afterUIKitTransition');
    expect(stackSource).not.toContain('coordinator.transitionDuration');
  });

  it('synthesizes the native stack lifecycle pair when UIKit does not deliver didAppear/didDisappear callbacks', () => {
    const beginSource = stackSource.slice(
      stackSource.indexOf('function beginStackAppearanceTransition'),
      stackSource.indexOf('function startNativeStackBackPopImpl'),
    );
    const fallbackSource = stackSource.slice(
      stackSource.indexOf('function finishStackTransitionLifecycleIfNeeded'),
      stackSource.indexOf('function animateStackPush'),
    );
    const appearanceFinishSource = stackSource.slice(
      stackSource.indexOf('function finishStackAppearanceTransition'),
      stackSource.indexOf('function finishStackTransitionLifecycleIfNeeded'),
    );
    const finishSource = stackSource.slice(
      stackSource.indexOf('function finishTransition'),
      stackSource.indexOf('function scheduleTransitionFallback'),
    );

    expect(fallbackSource).toContain('registry.stackTransitionStartedAts');
    expect(stackSource).toContain('screenLastDidAppearAts');
    expect(stackSource).toContain('screenLastDidDisappearAts');
    expect(fallbackSource).toContain('registry.screenLastDidAppearAts');
    expect(fallbackSource).toContain('registry.screenLastDidDisappearAts');
    expect(fallbackSource).toContain('__nativeScriptLastDidAppearAt');
    expect(fallbackSource).toContain('__nativeScriptLastDidDisappearAt');
    expect(fallbackSource).toContain('!didDisappearSinceTransition');
    expect(fallbackSource).toContain('!didAppearSinceTransition');
    expect(fallbackSource).toContain(
      'runScreenControllerViewDidDisappear(\n        disappearingController,',
    );
    expect(fallbackSource).toContain(
      'runScreenControllerViewDidAppear(\n        topController,',
    );
    expect(fallbackSource).toContain(
      'runScreenControllerViewDidDisappear(\n      previousController,',
    );
    expect(fallbackSource).toContain(
      'runScreenControllerViewDidAppear(\n      appearingController,',
    );
    expect(stackSource).toContain('function controllerUsesUIKitScreenLifecycle');
    expect(beginSource).toContain(
      'controllerUsesUIKitScreenLifecycle(disappearingController)',
    );
    expect(beginSource).toContain('!disappearingUsesUIKitLifecycle');
    expect(beginSource).toContain('appearingUsesUIKitLifecycle,');
    expect(beginSource).toContain('disappearingUsesUIKitLifecycle,');
    expect(beginSource).toContain('synthesizedAppearing: false');
    expect(beginSource).toContain('synthesizedDisappearing: false');
    expect(beginSource).toContain("'method=UIKit-viewWill'");
    expect(beginSource).not.toContain(
      'runScreenControllerViewWillDisappear(\n      disappearingController,',
    );
    expect(beginSource).not.toContain(
      'runScreenControllerViewWillAppear(\n      appearingController,',
    );
    expect(appearanceFinishSource).toContain(
      'pending.synthesizedAppearing === true',
    );
    expect(appearanceFinishSource).toContain(
      'const didUseUIKitLifecycle =',
    );
    expect(appearanceFinishSource).toContain(
      'return didFinishSyntheticTransition || didUseUIKitLifecycle;',
    );
    expect(finishSource).toContain(
      'const didFinishAppearanceTransition = finishStackAppearanceTransition',
    );
    expect(finishSource).toContain(
      'if (!didFinishAppearanceTransition) {\n    finishStackTransitionLifecycleIfNeeded',
    );
  });

  it('applies header subview navigation-item updates immediately while deferring body refresh during transitions', () => {
    const updateHandlerSource = stackSource.slice(
      stackSource.indexOf('function shouldDeferHeaderSubviewUpdate'),
      stackSource.indexOf('function emitTransition('),
    );
    const shouldDeferSource = stackSource.slice(
      stackSource.indexOf('function shouldDeferHeaderSubviewUpdate'),
      stackSource.indexOf('function scheduleDeferredHeaderSubviewUpdateFlush'),
    );
    const configureSubviewsSource = stackSource.slice(
      stackSource.indexOf('function configureHeaderSubviewViews'),
      stackSource.indexOf(
        'export const __nativeScriptConfigureHeaderSubviewViewsForTests',
      ),
    );

    expect(stackSource).toContain('screenPendingHeaderSubviewKeys');
    expect(stackSource).toContain('screenPendingHeaderConfigUpdates');
    expect(stackSource).toContain('screenHeaderSubviewFlushScheduled');
    expect(shouldDeferSource).toContain('return false;');
    expect(shouldDeferSource).toContain(
      'registry.stackTransitioning[stackId] !== true',
    );
    expect(shouldDeferSource).toContain(
      'stackHasActiveUIKitTransitionCoordinator(',
    );
    expect(shouldDeferSource).toContain(
      'navigationControllerIsTransitioning(navigationController)',
    );
    expect(shouldDeferSource).toContain(
      'screenControllerIsTransitioning(controller)',
    );
    expect(updateHandlerSource).toContain(
      'runAfterTransitionCoordinator(navigationController, flush)',
    );
    expect(updateHandlerSource).not.toContain('setTimeout(');
    expect(shouldDeferSource).not.toContain(
      '!navigationControllerIsTransitioning(navigationController)',
    );
    expect(updateHandlerSource).toContain('HEADER_SUBVIEW_UPDATE_KEY');
    expect(updateHandlerSource).toContain('notify(screenId);');
    expect(stackSource).toContain('_deferHeaderWhenTransitioning = false');
    expect(stackSource).not.toContain(
      '_deferHeaderWhenTransitioning &&\n    shouldDeferHeaderSubviewUpdate',
    );
    expect(stackSource).toContain(
      'flushPendingHeaderSubviewUpdatesForStack(stackId, registry, ctx);',
    );
    expect(updateHandlerSource).toContain(
      'applyHeaderSubviewUpdateForScreen(screenId, registry, ctx)',
    );
    expect(
      updateHandlerSource.indexOf(
        'applyHeaderSubviewUpdateForScreen(screenId, registry, ctx)',
      ),
    ).toBeLessThan(updateHandlerSource.indexOf('if (shouldDeferBodyRefresh)'));
    expect(updateHandlerSource).toContain(
      'const shouldDeferBodyRefresh = shouldDeferHeaderSubviewUpdate(',
    );
    expect(updateHandlerSource).toContain(
      'scheduleDeferredHeaderSubviewUpdateFlush(',
    );
    expect(updateHandlerSource).toContain("'header-subview-update-defer-body'");
    expect(updateHandlerSource).toContain(
      'if (screenCanCertifyContentReady(screenId, registry))',
    );
    expect(updateHandlerSource).toContain(
      'registry.screenContentReady[screenId] = true;',
    );
    expect(updateHandlerSource).toContain(
      'function reconcilePendingStackAfterHeaderSubviewUpdate',
    );
    expect(updateHandlerSource).toContain(
      'registry.stackPendingReconcileKeys[stackId] != null',
    );
    expect(updateHandlerSource).toContain(
      'const { availableIds } = controllersForStackUIKitModelIds(',
    );
    expect(updateHandlerSource).toContain(
      'registry.stackPendingReconcileKeys[stackId] = activeKey;',
    );
    expect(updateHandlerSource).toContain(
      'header-subview-stack-reconcile-defer-owner-transaction',
    );
    expect(updateHandlerSource).not.toContain(
      'scheduledReconcileStack(\n' +
        '    stackId,\n' +
        '    registry,\n' +
        '    ctx,\n' +
        '    registry.stackNativeKeys[stackId] != null,\n' +
        '  );',
    );
    expect(updateHandlerSource).not.toContain(
      'stackTopScreenCanStartNativeUpdate(activeIds, registry, stackId)',
    );
    expect(updateHandlerSource).toContain(
      'reconcilePendingStackAfterHeaderSubviewUpdate(screenId, registry);',
    );
    expect(stackSource).not.toContain(
      'registry.screenPendingHeaderConfigUpdates[props.screenId] = true;',
    );
    expect(stackSource).toContain(
      'false,\n' + "    'header-subview-update',\n" + '  );',
    );
    expect(configureSubviewsSource).not.toContain(
      'navigationItem.leftBarButtonItems = null;',
    );
    expect(configureSubviewsSource).not.toContain(
      'navigationItem.rightBarButtonItems = null;',
    );
    expect(configureSubviewsSource).toContain('nativeObjectArraysEqual');
    expect(stackSource).not.toContain('canSyncVisibleTopItemHeaderViews');
    expect(stackSource).not.toContain(
      'navigationBarTopItem.leftBarButtonItems =',
    );
    expect(stackSource).not.toContain(
      'navigationBarTopItem.rightBarButtonItems =',
    );
    expect(stackSource).not.toContain('navigationBarTopItem.titleView =');
    expect(stackSource).not.toContain('navigationBarTopItem.title =');
    expect(stackSource).toContain(
      'navigationItem?.__rnsNativeScriptNavigationAppearanceKey !== appearanceKey',
    );
    expect(stackSource).not.toContain(
      'topScreenId ? headerSubviewRecordsKey(topScreenId) :',
    );
    expect(stackSource).not.toContain('navigationBar.standardAppearance =');
    expect(stackSource).not.toContain('navigationBar.scrollEdgeAppearance =');
    expect(stackSource).toContain('navigationItem.standardAppearance =');
  });

  it('does not resubscribe no-op reconciles to an active transition coordinator', () => {
    const reconcileSource = stackSource.slice(
      stackSource.indexOf('function reconcileStack'),
      stackSource.indexOf('if (canAnimateNativeChange && previousKey != null'),
    );
    const noOpIndex = reconcileSource.indexOf(
      'if (!didChange && idsEqual(nativeIds, availableIds))',
    );

    expect(noOpIndex).toBeGreaterThanOrEqual(0);
    expect(reconcileSource).not.toContain(
      'scheduleReconcileAfterNativeTransition',
    );
    expect(reconcileSource).not.toContain(
      'transitionCoordinatorForController',
    );
  });

  it('does not create native-driven transitions for no-op UIKit willShow callbacks', () => {
    expect(
      __nativeScriptShouldIgnoreNoOpNativeWillShowForTests(
        ['home', 'detail'],
        ['home', 'detail'],
        'detail',
      ),
    ).toBe(true);
    expect(
      __nativeScriptShouldIgnoreNoOpNativeWillShowForTests(
        ['home', 'detail'],
        ['home', 'detail'],
        'home',
      ),
    ).toBe(false);
    expect(
      __nativeScriptShouldIgnoreNoOpNativeWillShowForTests(
        ['home'],
        ['home', 'detail'],
        'home',
      ),
    ).toBe(false);

    const willShowSource = stackSource.slice(
      stackSource.indexOf('navigationControllerWillShowViewControllerAnimated'),
      stackSource.indexOf('navigationControllerDidShowViewControllerAnimated'),
    );
    const didShowSource = stackSource.slice(
      stackSource.indexOf('navigationControllerDidShowViewControllerAnimated'),
      stackSource.indexOf('});\n\n    return controller;'),
    );

    expect(willShowSource).toContain('shouldIgnoreNoOpNativeWillShow');
    expect(
      willShowSource.indexOf('shouldIgnoreNoOpNativeWillShow'),
    ).toBeLessThan(willShowSource.indexOf('markTransition('));
    expect(willShowSource).toContain(
      'configureHeaderForWillShowViewController(',
    );
    expect(stackSource).toContain(
      'function configureHeaderForWillShowViewController',
    );
    expect(
      willShowSource.indexOf('configureHeaderForWillShowViewController('),
    ).toBeLessThan(willShowSource.indexOf('shouldIgnoreNoOpNativeWillShow'));
    expect(stackSource).toContain('Direct port of RNSScreenStackView');
    expect(didShowSource).toContain('stack-didShow-noop-current');
    expect(didShowSource).toContain(
      'installNativeBackGestureDelegate(navigationController, ctx);',
    );
    expectSourceToContain(
      didShowSource,
      'installStackSwipeGestures(\n' +
        '          ctx.props.stackId,\n' +
        '          registry,\n' +
        '          ctx,\n' +
        '          navigationController,\n' +
        '        );',
    );
    expect(
      didShowSource.indexOf(
        'installNativeBackGestureDelegate(navigationController, ctx);',
      ),
    ).toBeLessThan(didShowSource.indexOf('const activeIds ='));
    expect(didShowSource.indexOf('installStackSwipeGestures(')).toBeLessThan(
      didShowSource.indexOf('const activeIds ='),
    );
    expect(didShowSource).toContain('const jsRequestedShownScreenIds =');
    expect(didShowSource).toContain('stack-didShow-js-requested');
    expectSourceToContain(
      didShowSource,
      'jsRequestedShownScreenIds ??\n' +
        '          navigationControllerScreenIds(navigationController, registry)',
    );
    expect(stackSource).toContain('stackLastDidShowKeys');
    expect(didShowSource).toContain('shouldIgnoreNoOpNativeDidShow(');
    expect(stackSource).toContain('function shouldIgnoreNoOpNativeDidShow(');
    expect(stackSource).toContain(
      'navigationStackHasStableReadyContent(navigationController, registry, true)',
    );
    expect(didShowSource).toContain(
      'registry.stackLastDidShowKeys[ctx.props.stackId] = shownKey;',
    );
    expectSourceToContain(
      didShowSource,
      'const shownStackContentReady = navigationStackHasStableReadyContent(',
    );
    expectSourceToContain(
      didShowSource,
      'navigationStackHasStableReadyContent(navigationController, registry, true)',
    );
    expect(didShowSource).toContain('const shouldRepairShownStack =');
    expectSourceToContain(
      didShowSource,
      'const shouldRepairShownStack =\n' +
        '            !shownStackContentReady ||\n' +
        '            didNativeStackOwnChange ||\n' +
        '            didCancelNativeDismiss;',
    );
    expect(didShowSource).toContain('if (shouldRepairShownStack) {');
    expectSourceToContain(
      stackSource,
      'const stackContentReady = navigationStackHasStableReadyContent(\n' +
        '    navigationController,\n' +
        '    registry,\n' +
        '    true,\n' +
        '  );',
    );
    expectSourceToContain(
      stackSource,
      'const shouldRunFullPostTransitionRepair =\n' +
        '    !stackContentReady ||\n' +
        '    shouldForceRevealedScreenRefresh ||\n' +
        '    (closing && cancelled);',
    );
    expectSourceToContain(
      didShowSource,
      'configureStackControllers(\n' +
        '          shownScreenIds,\n' +
        '          registry,\n' +
        '          shouldRepairShownStack,\n' +
        '          shouldRepairShownStack,\n' +
        '        );',
    );
    const knownScreenDidShowSource = didShowSource.slice(
      didShowSource.indexOf(
        'registry.stackLastDidShowKeys[ctx.props.stackId] = shownKey;',
      ),
    );
    expect(
      knownScreenDidShowSource.indexOf(
        'registry.stackLastDidShowKeys[ctx.props.stackId] = shownKey;',
      ),
    ).toBeLessThan(
      knownScreenDidShowSource.indexOf('markNavigationStackNeedsLayout'),
    );
  });

  it('does not force didShow content repair only because the transition is still active', () => {
    const stableContentSource = stackSource.slice(
      stackSource.indexOf('function navigationStackHasStableReadyContent'),
      stackSource.indexOf('function navigationStackCanSkipStableLayout'),
    );
    const didShowSource = stackSource.slice(
      stackSource.indexOf('navigationControllerDidShowViewControllerAnimated'),
      stackSource.indexOf('});\n\n    return controller;'),
    );
    const knownScreenDidShowTimingSource = didShowSource.slice(
      didShowSource.indexOf(
        'const shownStackContentReady = navigationStackHasStableReadyContent(',
      ),
    );

    expect(stableContentSource).toContain('ignoreTransitionState = false');
    expectSourceToContain(
      stableContentSource,
      '!ignoreTransitionState &&\n    navigationControllerIsTransitioning(navigationController)',
    );
    expectSourceToContain(
      stableContentSource,
      '!ignoreTransitionState &&\n    stackId &&',
    );
    expectSourceToContain(
      knownScreenDidShowTimingSource,
      'const shownStackContentReady = navigationStackHasStableReadyContent(\n' +
        '          navigationController,\n' +
        '          registry,\n' +
        '          true,\n' +
        '        );',
    );
    const normalizedKnownScreenDidShowTimingSource = normalizeSource(
      knownScreenDidShowTimingSource,
    );
    expect(
      normalizedKnownScreenDidShowTimingSource.indexOf(
        'navigationStackHasStableReadyContent',
      ),
    ).toBeLessThan(
      normalizedKnownScreenDidShowTimingSource.indexOf(
        'configureStackControllers(shownScreenIds,',
      ),
    );
    expect(
      normalizedKnownScreenDidShowTimingSource.indexOf(
        'configureStackControllers(shownScreenIds,',
      ),
    ).toBeLessThan(
      normalizedKnownScreenDidShowTimingSource.indexOf('finishTransition('),
    );
  });

  it('keeps no-op stack reconciles from reconfiguring unchanged screen controllers', () => {
    const noopSource = stackSource.slice(
      stackSource.indexOf(
        'if (!didChange && idsEqual(nativeIds, availableIds))',
      ),
      stackSource.indexOf('if (canAnimateNativeChange && previousKey != null'),
    );

    expect(noopSource).toContain(
      'updateNativeBackGesture(navigationController);',
    );
    expectSourceToContain(
      noopSource,
      "layoutNavigationStackViews(navigationController, 'reconcile-stack-noop-content');",
    );
    expect(noopSource).toContain(
      'const shouldWaitForModalContentWrapper =',
    );
    expect(noopSource).toContain(
      'reconcileStack-noop-content-wait-modal-wrapper',
    );
    expect(noopSource).not.toContain('configureStackControllers');
    expect(noopSource).not.toContain('configureNavigationAppearance');
  });

  it('registers coordinator completions without timeout watchdogs', () => {
    const fallbackSource = stackSource.slice(
      stackSource.indexOf('function scheduleTransitionFallback'),
      stackSource.indexOf('function shouldApplyStackPropsRevision'),
    );

    expect(fallbackSource).toContain(
      'runAfterTransitionCoordinator(navigationController, complete, ctx)',
    );
    expect(fallbackSource).toContain(
      'runAfterTransitionCoordinator(transitionController, complete, ctx)',
    );
    expect(fallbackSource).not.toContain('setTimeout(complete, 420)');
    expect(fallbackSource).toContain(
      'let didScheduleCoordinatorCompletion = false;',
    );
    expect(fallbackSource).toContain(
      'didScheduleCoordinatorCompletion = true;',
    );
    expect(fallbackSource).toContain(
      'if (!didScheduleCoordinatorCompletion) {\n    complete();\n  }',
    );
    const coordinatorSource = stackSource.slice(
      stackSource.indexOf('function runAfterTransitionCoordinator'),
      stackSource.indexOf('function dismissCountForController'),
    );

    expect(coordinatorSource).toContain('let completionBlock: any = null;');
    expect(coordinatorSource).toContain('ctx?.retain?.(completionBlock);');
    expect(coordinatorSource).toContain('ctx.release(completionBlock);');
    expect(coordinatorSource).toContain(
      'releaseCompletionBlock();\n      completion();',
    );
    expect(coordinatorSource).toContain(
      'if (!didSchedule) {\n    releaseCompletionBlock();\n  }',
    );
    expect(fallbackSource).toContain('transition-fallback-screen-coordinator');
    expect(fallbackSource).toContain(
      'registry.stackTransitionTokens[stackId] !== token',
    );
    expect(fallbackSource).toContain(
      'registry.stackTransitioning[stackId] !== true',
    );
    expect(
      fallbackSource.indexOf('registry.stackTransitioning[stackId]'),
    ).toBeLessThan(fallbackSource.indexOf("'transition-fallback-complete'"));
    expect(fallbackSource).not.toContain('token + 1');
    expect(fallbackSource).not.toContain(
      'NATIVESCRIPT_PORT_DEVIATION: upstream finishes stack transitions from',
    );
    expect(fallbackSource).not.toContain(
      'transition-coordinator proxy\n  // completions can be dropped',
    );

    const pushSource = stackSource.slice(
      stackSource.indexOf('const isPush ='),
      stackSource.indexOf('if (isPop && nativeIds.length > nextCount)'),
    );
    const popSource = stackSource.slice(
      stackSource.indexOf('if (isPop && nativeIds.length > nextCount)'),
      stackSource.indexOf('const previousTopScreenId ='),
    );
    const replaceSource = stackSource.slice(
      stackSource.indexOf('if (isReplace && nextTopScreenId)'),
      stackSource.indexOf(
        'prepareControllerForStackExposure(\n    navigationController,',
      ),
    );

    expect(pushSource).toContain('pushedController,');
    expect(popSource).toContain('previousTopController,');
    expect(replaceSource).toContain('const transitionController = closing');
    expect(replaceSource).toContain('transitionController,');
  });

  it('declares worklet helpers before worklets that capture them', () => {
    expect(
      [
        ['NativeScriptScreenStack.ios.tsx', stackSource],
        ['ScreenStackHeaderConfig.tsx', screenStackHeaderConfigSource],
        ['NativeScriptTabs.ios.tsx', tabsSource],
      ].flatMap(([fileName, source]) =>
        topLevelWorkletDeclarationOrderHazards(fileName, source),
      ),
    ).toEqual([]);

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
    ).toBeLessThan(stackSource.indexOf('function finishTransition'));
    expect(stackSource.indexOf('function isModalPresentation')).toBeLessThan(
      stackSource.indexOf('function firstModalIndex'),
    );
    expect(stackSource.indexOf('function firstModalIndex')).toBeLessThan(
      stackSource.indexOf('function scheduledReconcileStack'),
    );
    expect(stackSource.indexOf('function controllerHash')).toBeLessThan(
      stackSource.indexOf('function nativeControllersEqual'),
    );
    expect(stackSource.indexOf('function nativeControllersEqual')).toBeLessThan(
      stackSource.indexOf(
        'function stackShouldWaitForModalContentParentBeforeAttach',
      ),
    );
    expect(
      stackSource.indexOf('function scheduledReconcileStack'),
    ).toBeLessThan(
      stackSource.indexOf(
        'export function nativeScriptScreenContentWrapperHostReadyOnUI',
      ),
    );
    expect(
      stackSource.indexOf('function stackCanReconcileFromPropsUpdate'),
    ).toBeLessThan(
      stackSource.indexOf(
        'function reconcilePendingStackAfterHeaderSubviewUpdate',
      ),
    );
    expect(
      stackSource.indexOf('function stackCanReconcileFromPropsUpdate'),
    ).toBeLessThan(
      stackSource.indexOf('function reconcileStackFromExternalHost'),
    );
    expect(
      stackSource.indexOf('function screenHostedViewRefreshKey'),
    ).toBeLessThan(
      stackSource.indexOf('function rememberScreenHostedViewRefreshKey'),
    );
    expect(
      stackSource.indexOf('function rememberScreenHostedViewRefreshKey'),
    ).toBeLessThan(
      stackSource.indexOf('function nativeScriptScreenHostReadyOnUI'),
    );
    expect(
      stackSource.indexOf('function stableReadyScreenHostHandle'),
    ).toBeLessThan(
      stackSource.indexOf('function nativeScriptScreenHostReadyOnUI'),
    );
    expect(
      stackSource.indexOf('function hiddenAncestorBetweenViewAndAncestor'),
    ).toBeLessThan(
      stackSource.indexOf('function screenHasStableReadyMountedContent'),
    );
    expect(
      stackSource.indexOf(
        'function dispatchPresentedModalContentRefreshAfterPresentation',
      ),
    ).toBeLessThan(
      stackSource.indexOf(
        'export function nativeScriptScreenContentWrapperHostReadyOnUI',
      ),
    );
    expect(
      stackSource.indexOf('function navigationControllerIsTransitioning'),
    ).toBeLessThan(
      stackSource.indexOf(
        'function stackShouldDeferContainingTabContentReconcile',
      ),
    );
    expect(
      stackSource.indexOf('function screenControllerIsTransitioning'),
    ).toBeLessThan(
      stackSource.indexOf(
        'function stackShouldDeferContainingTabContentReconcile',
      ),
    );
    expect(
      stackSource.indexOf(
        'function reconcileContainingTabControllerFromStackContent',
      ),
    ).toBeLessThan(
      stackSource.indexOf(
        'export function notifyNativeScriptScreenContentWrapperFrame',
      ),
    );
    expect(
      stackSource.indexOf(
        'function reconcileContainingTabControllerFromStackContent',
      ),
    ).toBeLessThan(
      stackSource.indexOf(
        'export function nativeScriptScreenContentWrapperHostReadyOnUI',
      ),
    );
    expect(
      stackSource.indexOf(
        'function dispatchPresentedModalContentRefreshAfterPresentation',
      ),
    ).toBeLessThan(
      stackSource.indexOf('function nativeScriptScreenHostReadyOnUI'),
    );
    expect(
      stackSource.indexOf(
        'function refreshPresentedModalContentAfterPresentation',
      ),
    ).toBeLessThan(
      stackSource.indexOf(
        'function installPresentedModalContentRefreshHandler',
      ),
    );
    expect(
      stackSource.indexOf('function detachInactiveNativeScriptScreen'),
    ).toBeLessThan(stackSource.indexOf('function cleanupDetachedScreens'));
    expect(
      stackSource.indexOf('function controllerHierarchyContainsController'),
    ).toBeLessThan(
      stackSource.indexOf(
        'function presentedControllerChainContainsController',
      ),
    );
    expect(
      stackSource.indexOf(
        'function presentedControllerChainContainsController',
      ),
    ).toBeLessThan(
      stackSource.indexOf('function screenControllerIsVisibleInNativeStack'),
    );
    expect(
      stackSource.indexOf('function setKnownRootContainedParent'),
    ).toBeLessThan(
      stackSource.indexOf('function attachControllerToParentViewController'),
    );
    expect(stackSource.indexOf('function nativeObjectsEqual')).toBeLessThan(
      stackSource.indexOf('function headerSubviewRecordMatchesRegistration'),
    );
    expect(
      stackSource.indexOf('function navigationControllerIsPresentedModally'),
    ).toBeLessThan(
      stackSource.indexOf('function syncNavigationBarSafeAreaInset'),
    );
    expect(
      stackSource.indexOf('function navigationControllerIsPresentedModally'),
    ).toBeLessThan(stackSource.indexOf('function layoutNavigationStackViews'));
    expect(
      stackSource.indexOf('function hasNonEmptyAccessibilityText'),
    ).toBeLessThan(
      stackSource.indexOf('function hostedSubviewVisibleContentExtent'),
    );
    expect(
      stackSource.indexOf('function nativeAccessibilityText'),
    ).toBeLessThan(
      stackSource.indexOf('function hostedSubviewVisibleContentExtent'),
    );
    expect(
      stackSource.indexOf('function hostedSubviewHasUserAccessibilityPayload'),
    ).toBeLessThan(
      stackSource.indexOf('function hostedSubviewVisibleContentExtent'),
    );
    expect(
      stackSource.indexOf('function presentationControllerForModalScreen'),
    ).toBeLessThan(
      stackSource.indexOf(
        'function refreshPresentedModalContentAfterPresentation',
      ),
    );
    expect(stackSource.indexOf('function idsFromKey')).toBeLessThan(
      stackSource.indexOf('function presentedModalIdsForStack'),
    );
    expect(
      stackSource.indexOf('function presentedModalIdsForStack'),
    ).toBeLessThan(
      stackSource.indexOf(
        'function completePresentedModalDismissalForDetachedHeaderIfNeeded',
      ),
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
    expect(stackSource).toContain(
      'function restoreVisibleNavigationControllerInteractivity',
    );
    expect(stackSource).toContain(
      'restoreHostedReactSubviewInteractivity(visibleControllerView);',
    );
    const visibleInteractivitySource = stackSource.slice(
      stackSource.indexOf(
        'function restoreVisibleNavigationControllerInteractivity',
      ),
      stackSource.indexOf('function rectMaxY'),
    );
    expect(visibleInteractivitySource).toContain(
      'disableStaleUIKitWrapperSiblingsAboveActiveViewChain(controllerView);',
    );
    expect(visibleInteractivitySource).toContain(
      'const restoreControllerInteractivity = (controller: any) => {',
    );
    expect(visibleInteractivitySource).toContain(
      'normalizeVisibleNavigationControllerViewChain(\n' +
        '      visibleControllerView,\n' +
        '      navigationController.view,\n' +
        '    );',
    );
    expect(visibleInteractivitySource).toContain('if (restoreAllControllers) {');
    expect(visibleInteractivitySource).toContain(
      'restoreControllerInteractivity(controller);',
    );
    const normalizeVisibleSource = stackSource.slice(
      stackSource.indexOf('function normalizeVisibleNavigationControllerViewChain'),
      stackSource.indexOf('function restoreVisibleNavigationControllerInteractivity'),
    );
    expect(normalizeVisibleSource).toContain(
      'if (current.accessibilityElementsHidden === true)',
    );
    expect(normalizeVisibleSource).toContain(
      'current.accessibilityElementsHidden = false;',
    );
    expect(stackSource).toContain(
      'restoreVisibleNavigationControllerInteractivity(\n' +
        '      navigationController,\n' +
        '      registry,\n' +
        '      false,\n' +
        '      cancelled,\n' +
        '    );',
    );
    expect(
      visibleInteractivitySource.indexOf(
        'normalizeVisibleNavigationControllerViewChain',
      ),
    ).toBeLessThan(
      visibleInteractivitySource.indexOf(
        'restoreHostedReactSubviewInteractivity(visibleControllerView);',
      ),
    );
    expect(visibleInteractivitySource).not.toContain(
      'nativeScriptStackContainerView(navigationController) ??',
    );
    const restoreInteractivitySource = stackSource.slice(
      stackSource.indexOf('function restoreHostedReactSubviewInteractivity'),
      stackSource.indexOf('function rectWithZeroOrigin'),
    );
    expect(
      restoreInteractivitySource.indexOf(
        'if (view.accessibilityElementsHidden === true)',
      ),
    ).toBeGreaterThan(
      restoreInteractivitySource.indexOf('let didMutate = false;'),
    );
    expect(restoreInteractivitySource).toContain(
      'view.accessibilityElementsHidden = false;',
    );
    expect(stackSource).toContain('if (isTopController) {');
    expect(stackSource).not.toContain('function enableHostedInteraction');
    expect(stackSource).not.toContain('function setViewSubtreeInteraction');
  });

  it('queues JS navigation after a native-driven pop once the popped screen left React state', () => {
    const queueSource = stackSource.slice(
      stackSource.indexOf('function shouldQueueReconcileWhileTransitioning'),
      stackSource.indexOf('function finishTransition'),
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

  it('runs post-transition hosted view/header repair in finishTransition', () => {
    const finishSource = stackSource.slice(
      stackSource.indexOf('function finishTransition'),
      stackSource.indexOf('function scheduleTransitionFallback'),
    );

    expect(stackSource).not.toContain('stackTransitionSettling');
    expect(stackSource).not.toContain('function schedulePostTransitionSettle');
    expectSourceToContain(
      finishSource,
      'const topScreenId = topScreenIdForNavigationController(navigationController);',
    );
    expect(finishSource).toContain(
      'ensureScreenContentWrapperMounted(topScreenId, registry);',
    );
    expect(
      finishSource.indexOf(
        'ensureScreenContentWrapperMounted(topScreenId, registry);',
      ),
    ).toBeLessThan(
      finishSource.indexOf('const shouldRunFullPostTransitionRepair ='),
    );
    expectSourceToContain(
      finishSource,
      'const didCertifyOpenedTopExposure = rememberScreenStableReadyExposure(',
    );
    expectSourceToContain(
      finishSource,
      "'post-transition-opened-top-exposure'",
    );
    expect(
      finishSource.indexOf(
        'const didCertifyOpenedTopExposure = rememberScreenStableReadyExposure(',
      ),
    ).toBeLessThan(
      finishSource.indexOf('const stackContentReady = navigationStackHasStableReadyContent('),
    );
    expect(
      finishSource.indexOf("'post-transition-opened-top-exposure'"),
    ).toBeLessThan(
      finishSource.indexOf('const shouldRunFullPostTransitionRepair ='),
    );
    expectSourceToContain(
      finishSource,
      'installStackSwipeGestures(stackId, registry, ctx, navigationController);',
    );
    expect(
      finishSource.indexOf(
        'installStackSwipeGestures(stackId, registry, ctx, navigationController);',
      ),
    ).toBeLessThan(
      finishSource.indexOf('const shouldRunFullPostTransitionRepair ='),
    );
    expectSourceToContain(
      finishSource,
      'const stackContentReady = navigationStackHasStableReadyContent(\n' +
        '    navigationController,\n' +
        '    registry,\n' +
        '    true,\n' +
        '  );',
    );
    expectSourceToContain(
      finishSource,
      'const shouldRunFullPostTransitionRepair =\n' +
        '    !stackContentReady ||\n' +
        '    shouldForceRevealedScreenRefresh ||\n' +
        '    (closing && cancelled);',
    );
    expectSourceToContain(
      finishSource,
      'if (shouldRunFullPostTransitionRepair) {\n' +
        "    layoutNavigationStackViews(navigationController, 'post-transition-repair');",
    );
    expectSourceToContain(
      finishSource,
      'cancelled = false,\n' +
        '  deferStableInteractivityRestore = false',
    );
    expectSourceToContain(
      finishSource,
      'restoreVisibleNavigationControllerInteractivity(\n' +
        '      navigationController,\n' +
        '      registry,\n' +
        '      false,\n' +
        '      cancelled,\n' +
        '    );',
    );
    expectSourceToContain(
      finishSource,
      "} else if (deferStableInteractivityRestore) {\n" +
        "    traceWorkletEvent(\n" +
        "      'post-transition-repair-skip-stable-deferred',",
    );
    expectSourceToContain(
      finishSource,
      'const shouldSuppressTransitionTouchOwnership =\n' +
        '    deferStableInteractivityRestore && closing && !cancelled;',
    );
    expectSourceToContain(
      finishSource,
      'if (shouldSuppressTransitionTouchOwnership) {\n' +
        '    registry.stackTransitioning[stackId] = false;\n' +
        '  }\n' +
        '  if (!didFinishAppearanceTransition) {',
    );
    expectSourceToContain(
      finishSource,
      'if (shouldSuppressTransitionTouchOwnership) {\n' +
        '    registry.stackTransitioning[stackId] = previousStackTransitioning;\n' +
        '  }\n' +
        '  notifyFinishTransitioningForScreen(registry, screenId);',
    );
    expect(finishSource).toContain('const hasActiveTransition =');
    expect(finishSource).toContain('finishTransition-skip-completed');
    expect(finishSource.indexOf('if (!hasActiveTransition)')).toBeLessThan(
      finishSource.indexOf('emitTransition('),
    );
    expect(finishSource).toContain(
      'layoutPresentedModalControllers(stackId, registry);',
    );
    expect(stackSource).toContain(
      'function restoreRevealedStackTopAfterClosingTransition',
    );
    expect(stackSource).toContain("'post-closing-transition-revealed'");
    expect(finishSource).toContain(
      'let shouldForceRevealedScreenRefresh = false;',
    );
    expect(finishSource).toContain(
      'shouldForceRevealedScreenRefresh =\n' +
        '      restoreRevealedStackTopAfterClosingTransition(',
    );
    expect(stackSource).not.toContain(
      'function invalidateVisibleStackAfterClosingTransition',
    );
    expect(finishSource).not.toContain(
      'resetScreenContentRefreshState(screenId, registry);',
    );
    expect(finishSource).toContain(
      'refreshVisibleStackScreenContentReady(\n' +
        '      stackId,\n' +
        '      registry,\n' +
        '      screenId,\n' +
        '      !closing || cancelled,\n' +
        '      shouldForceRevealedScreenRefresh,\n' +
        '    );',
    );
    expect(finishSource).toContain(
      'refreshVisibleStackContentWrapperHosts(\n' +
        '      stackId,\n' +
        '      registry,\n' +
        '      undefined,\n' +
        '      false,\n' +
        '      shouldForceRevealedScreenRefresh,\n' +
        '      shouldForceRevealedScreenRefresh,\n' +
        '      true,\n' +
        '      true,\n' +
        '    );',
    );
    expect(finishSource).toContain(
      'flushPendingHeaderSubviewUpdatesForStack(stackId, registry, ctx);',
    );
    expect(finishSource).toContain('if (shouldRunPendingReconcile)');
    expect(finishSource).toContain(
      'scheduledReconcileStack(stackId, registry, ctx, true);',
    );
    expect(finishSource.indexOf('layoutNavigationStackViews')).toBeLessThan(
      finishSource.indexOf('refreshVisibleStackScreenContentReady'),
    );
    expect(finishSource.indexOf('layoutNavigationStackViews')).toBeGreaterThan(
      finishSource.indexOf('registry.stackTransitionTokens[stackId] ='),
    );
    expect(
      finishSource.indexOf('refreshVisibleStackScreenContentReady'),
    ).toBeLessThan(
      finishSource.indexOf('refreshVisibleStackContentWrapperHosts'),
    );
    expect(
      finishSource.indexOf('refreshVisibleStackContentWrapperHosts'),
    ).toBeLessThan(
      finishSource.indexOf('flushPendingHeaderSubviewUpdatesForStack'),
    );
    expect(
      finishSource.indexOf('flushPendingHeaderSubviewUpdatesForStack'),
    ).toBeLessThan(finishSource.indexOf('scheduledReconcileStack'));
    expect(finishSource).not.toContain('setTimeout(');
    expect(finishSource).not.toContain(
      'setNavigationControllerViewControllers',
    );
  });

  it('does not layout the base stack while an animated modal dismissal is pending', () => {
    const modalDismissReconcileSource = stackSource.slice(
      stackSource.indexOf(
        'if (presentedModalIdsForStack(stackId, registry).length > 0)',
      ),
      stackSource.indexOf("if (!didChange && idsEqual(nativeIds, availableIds))"),
    );

    expect(modalDismissReconcileSource).toContain(
      "if (modalUpdateResult === 'pending') {",
    );
    expect(modalDismissReconcileSource).toContain(
      "'reconcile-stack-after-modal-update-pending-skip'",
    );
    expect(
      modalDismissReconcileSource.indexOf(
        "if (modalUpdateResult === 'pending') {",
      ),
    ).toBeLessThan(
      modalDismissReconcileSource.indexOf(
        'const canSkipPostModalUpdateLayout =',
      ),
    );
    expect(
      modalDismissReconcileSource.indexOf(
        "if (modalUpdateResult === 'pending') {",
      ),
    ).toBeLessThan(
      modalDismissReconcileSource.indexOf(
        "layoutNavigationStackViews(\n          navigationController,\n          'reconcile-stack-after-modal-update',\n        );",
      ),
    );
  });

  it('defers stable base interactivity restore to the modal dismissal base pass', () => {
    const modalCompletionSource = stackSource.slice(
      stackSource.indexOf('function completeModalTransitionTransaction'),
      stackSource.indexOf('function completeJsRequestedModalDismissalFromDelegate'),
    );

    expect(modalCompletionSource).toContain(
      'finishTransition(stackId, registry, ctx, closing, screenId, false, true);',
    );
    expect(
      modalCompletionSource.indexOf(
        'finishTransition(stackId, registry, ctx, closing, screenId, false, true);',
      ),
    ).toBeLessThan(
      modalCompletionSource.lastIndexOf(
        'restoreVisibleBaseStackAfterModalDismissal(stackId, registry);',
      ),
    );
  });

  it('deduplicates stack transition events and fallback coordinator completions', () => {
    const emitSource = stackSource.slice(
      stackSource.indexOf('function emitTransition('),
      stackSource.indexOf('function markTransition('),
    );
    const fallbackSource = stackSource.slice(
      stackSource.indexOf('function scheduleTransitionFallback'),
      stackSource.indexOf('function shouldApplyStackPropsRevision'),
    );

    expect(stackSource).toContain('LAST_EMITTED_TRANSITION_EVENT_KEY');
    expect(emitSource).toContain('const transitionEventKey = [');
    expect(emitSource).toContain(
      'ctx[LAST_EMITTED_TRANSITION_EVENT_KEY] === transitionEventKey',
    );
    expect(emitSource).toContain('transition-emit-skip-duplicate');
    expect(emitSource).toContain(
      'ctx[LAST_EMITTED_TRANSITION_EVENT_KEY] = transitionEventKey;',
    );
    expect(fallbackSource).toContain(
      "} else if (runAfterTransitionCoordinator(transitionController, complete, ctx)) {",
    );
    expect(fallbackSource).not.toContain(
      "}\n\n  if (runAfterTransitionCoordinator(transitionController, complete, ctx)) {",
    );
  });

  it('does not reapply view controller arrays from unknown UIKit didShow controllers', () => {
    expect(stackSource).toContain(
      'NATIVESCRIPT_PORT_DEVIATION: upstream receives the exact',
    );
    expect(stackSource).toContain('const resolvedScreenIds = !isClosing');
    expect(stackSource).toContain('finishTransition(');
    expect(stackSource).toContain('!idsEqual(shownScreenIds, activeIds)');
    expect(stackSource).not.toContain('onNativeStackChange');
    expect(stackSource).not.toContain('scheduleStackChange');
    expect(stackSource).not.toContain('applyFallbackControllers');
    expect(stackSource).not.toContain('setTimeout(applyFallbackControllers');
  });

  it('drops stale native host updates that arrive after newer stack renders', () => {
    expect(stackSource).toContain('stackPropRevisions');
    expect(stackSource).toContain('shouldApplyStackPropsRevision');
    expect(stackSource).toContain('renderRevision={renderRevision}');
    expect(stackSource).toContain('revision <= previousRevision');
  });

  it('deduplicates repeated native host transactions for the same stack render', () => {
    const transactionSource = stackSource.slice(
      stackSource.indexOf('transactionCommitted(controller, props'),
      stackSource.indexOf('refresh(controller, props'),
    );

    expect(stackSource).toContain('stackTransactionRevisions');
    expect(stackSource).toContain('shouldApplyStackTransactionRevision');
    expect(transactionSource).toContain('shouldApplyStackTransactionRevision(');
    expect(
      transactionSource.indexOf('shouldApplyStackTransactionRevision('),
    ).toBeLessThan(
      transactionSource.indexOf('registerNativeScriptStackController'),
    );
    expect(
      transactionSource.indexOf('shouldApplyStackTransactionRevision('),
    ).toBeLessThan(transactionSource.indexOf('reconcileStack('));
  });

  it('deduplicates unchanged NativeScript screen host updates', () => {
    const firstProps = {
      activityState: 2,
      headerConfig: {
        headerLeftBarButtonItems: [
          {
            buttonId: 'primary',
            onPress: jest.fn(),
            title: 'Primary',
            type: 'button',
          },
        ],
        title: 'Native Detail',
      },
      onHeaderHeightChange: jest.fn(),
      onTransitionProgress: jest.fn(),
      parentId: 'stack-a',
      screenId: 'detail',
      stackPresentation: 'push',
    } as any;
    const sameProps = {
      activityState: 2,
      headerConfig: {
        headerLeftBarButtonItems: [
          {
            buttonId: 'primary',
            onPress: jest.fn(),
            title: 'Primary',
            type: 'button',
          },
        ],
        title: 'Native Detail',
      },
      onHeaderHeightChange: jest.fn(),
      onTransitionProgress: jest.fn(),
      parentId: 'stack-a',
      screenId: 'detail',
      stackPresentation: 'push',
    } as any;
    const changedHeaderProps = {
      activityState: 2,
      headerConfig: {
        title: 'Changed Detail',
      },
      onHeaderHeightChange: jest.fn(),
      parentId: 'stack-a',
      screenId: 'detail',
      stackPresentation: 'push',
    } as any;
    const changedCoreProps = {
      ...firstProps,
      activityState: 0,
    } as any;
    const firstKey =
      __nativeScriptScreenControllerNativePropsKeyForTests(firstProps);
    const sameNativeKey =
      __nativeScriptScreenControllerNativePropsKeyForTests(sameProps);
    const changedHeaderKey =
      __nativeScriptScreenControllerNativePropsKeyForTests(changedHeaderProps);
    const firstCoreKey =
      __nativeScriptScreenControllerCoreNativePropsKeyForTests(firstProps);
    const sameCoreKey =
      __nativeScriptScreenControllerCoreNativePropsKeyForTests(sameProps);
    const changedHeaderCoreKey =
      __nativeScriptScreenControllerCoreNativePropsKeyForTests(
        changedHeaderProps,
      );
    const changedCoreKey =
      __nativeScriptScreenControllerCoreNativePropsKeyForTests(
        changedCoreProps,
      );
    const firstHeaderKey =
      __nativeScriptScreenControllerHeaderConfigKeyForTests(
        firstProps.headerConfig,
      );
    const sameHeaderKey = __nativeScriptScreenControllerHeaderConfigKeyForTests(
      sameProps.headerConfig,
    );
    const changedHeaderHeaderKey =
      __nativeScriptScreenControllerHeaderConfigKeyForTests(
        changedHeaderProps.headerConfig,
      );
    const controllerSource = stackSource.slice(
      stackSource.indexOf('const NativeScriptScreenController'),
      stackSource.indexOf('function containerScreenParticipatesInUIKitModel'),
    );
    const updateSource = controllerSource.slice(
      controllerSource.indexOf(
        'update(controller, props, _previousProps, ctx)',
      ),
      controllerSource.indexOf('dispose(controller, props)'),
    );

    expect(firstKey).toBe(sameNativeKey);
    expect(firstKey).not.toBe(changedHeaderKey);
    expect(firstCoreKey).toBe(sameCoreKey);
    expect(firstCoreKey).toBe(changedHeaderCoreKey);
    expect(firstCoreKey).not.toBe(changedCoreKey);
    expect(firstHeaderKey).toBe(sameHeaderKey);
    expect(firstHeaderKey).not.toBe(changedHeaderHeaderKey);
    expect(stackSource).toContain('function screenControllerNativePropsKey');
    expect(stackSource).toContain(
      'function screenControllerCoreNativePropsKey',
    );
    expect(stackSource).toContain('function configureScreenControllerHeader');
    expect(
      stackSource.indexOf('function configureScreenControllerHeader'),
    ).toBeLessThan(stackSource.indexOf('function configureScreenController('));
    expect(stackSource).toContain(
      'function shouldApplyScreenControllerNativeProps',
    );
    expect(stackSource).toContain('screenCoreNativePropsKeys');
    expect(stackSource).toContain('screenHeaderConfigKeys');
    expect(stackSource).toContain('screenNativePropsKeys');
    expect(stackSource).toContain(
      'const previousCoreKey = registry.screenCoreNativePropsKeys[screenId];',
    );
    expect(stackSource).toContain(
      'registry.screenCoreNativePropsKeys[screenId] = nextCoreKey;',
    );
    expect(stackSource).not.toContain('__nativeScriptScreenCoreNativePropsKey');
    expect(stackSource).not.toContain('__nativeScriptScreenHeaderConfigKey');
    expect(updateSource).toContain(
      'const nativePropChanges = shouldApplyScreenControllerNativeProps',
    );
    expect(updateSource).toContain('!nativePropChanges.coreChanged');
    expect(updateSource).toContain('!nativePropChanges.headerChanged');
    expect(updateSource).toContain('if (nativePropChanges.coreChanged)');
    expect(updateSource).toContain('configureScreenControllerHeader(');
    expect(
      updateSource.indexOf('registry.screenProps[props.screenId] = props;'),
    ).toBeLessThan(updateSource.indexOf('!nativePropChanges.coreChanged'));
    expect(
      updateSource.indexOf('if (nativePropChanges.coreChanged)'),
    ).toBeLessThan(
      updateSource.indexOf('configureScreenController(\n        controller,'),
    );
    expect(
      updateSource.indexOf('configureScreenController(\n        controller,'),
    ).toBeLessThan(updateSource.indexOf('configureScreenControllerHeader('));
  });

  it('invalidates NativeScript screen header key when nested menu action state changes', () => {
    const offHeaderKey = __nativeScriptScreenControllerHeaderConfigKeyForTests({
      headerRightBarButtonItems: [
        {
          buttonId: 'menu',
          menu: {
            items: [
              {
                menuId: '0-0-right',
                state: 'off',
                title: 'React Navigation menu increment',
                type: 'action',
              },
            ],
            title: 'Header menu',
          },
          title: 'Menu',
          type: 'menu',
        },
      ],
      title: 'Native Detail',
    } as any);
    const onHeaderKey = __nativeScriptScreenControllerHeaderConfigKeyForTests({
      headerRightBarButtonItems: [
        {
          buttonId: 'menu',
          menu: {
            items: [
              {
                menuId: '0-0-right',
                state: 'on',
                title: 'React Navigation menu increment',
                type: 'action',
              },
            ],
            title: 'Header menu',
          },
          title: 'Menu',
          type: 'menu',
        },
      ],
      title: 'Native Detail',
    } as any);

    expect(offHeaderKey).not.toBe(onHeaderKey);
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
    expect(stackSource).toMatch(
      /if\s*\(\s*stackScreenParticipatesInUIKitModel\(\s*retainedByStack,\s*props\.activityState,?\s*\)\s*\)/,
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
      'function prepareRequestedControllersForUIKitModel',
    );
    expect(
      stackSource.indexOf('prepareRequestedControllersForUIKitModel'),
    ).toBeLessThan(
      stackSource.indexOf(
        'controllersForStackUIKitModelIds(\n    requestedIds',
      ),
    );
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

  it('defers generic off-window stack UIKit models except the initial non-modal model', () => {
    const prepareSource = stackSource.slice(
      stackSource.indexOf('function prepareControllerForStackExposure'),
      stackSource.indexOf(
        'function refreshPresentedModalContentAfterPresentation',
      ),
    );

    expect(
      __nativeScriptNavigationControllerCanApplyStackModelForTests({
        view: null,
      }),
    ).toBe(false);
    expect(
      __nativeScriptNavigationControllerCanApplyStackModelForTests({
        view: { window: null },
      }),
    ).toBe(false);
    const navigationView: any = {
      window: null,
    };
    const screenView: any = {};
    const contentWrapperView: any = {
      superview: screenView,
    };
    expect(
      __nativeScriptNavigationControllerCanApplyStackModelForTests(
        {
          view: navigationView,
        },
        {
          screenContentReady: { root: true },
          screenContentWrapperViews: { root: contentWrapperView },
          screens: { root: { view: screenView } },
        } as any,
        ['root'],
      ),
    ).toBe(false);
    const attachedWindow = {};
    expect(
      __nativeScriptNavigationControllerCanApplyStackModelForTests({
        view: { window: attachedWindow },
      }),
    ).toBe(true);
    expect(
      __nativeScriptNavigationControllerCanApplyInitialOffwindowStackModelForTests(
        'stack',
        { view: navigationView },
        {
          screenProps: { root: { stackPresentation: 'push' } },
          stackNativeKeys: {},
        } as any,
        ['root'],
      ),
    ).toBe(true);
    expect(
      __nativeScriptNavigationControllerCanApplyInitialOffwindowStackModelForTests(
        'stack',
        { view: navigationView },
        {
          screenProps: { root: { stackPresentation: 'push' } },
          stackNativeKeys: { stack: 'root' },
        } as any,
        ['root'],
      ),
    ).toBe(false);
    expect(
      __nativeScriptNavigationControllerCanApplyInitialOffwindowStackModelForTests(
        'stack',
        { view: navigationView },
        {
          screenProps: {
            modal: { stackPresentation: 'modal' },
            root: { stackPresentation: 'push' },
          },
          stackNativeKeys: {},
        } as any,
        ['root', 'modal'],
      ),
    ).toBe(false);
    expect(stackSource).toContain(
      'function navigationControllerCanApplyInitialOffwindowStackModel',
    );
    expect(stackSource).toContain('reconcileStack-allow-initial-offwindow');
    expect(stackSource).toContain(
      'function ensureTopStackContentWrapperMountedForModel',
    );
    expect(stackSource).not.toContain(
      'ensureTopStackContentWrapperMountedForModel(availableIds, registry);',
    );
    const reconcileStackSource = stackSource.slice(
      stackSource.indexOf('function reconcileStack'),
      stackSource.indexOf(
        'function refreshVisibleStackContentFromExternalHost',
      ),
    );
    expect(reconcileStackSource).toContain(
      'const canApplyWindowedStackModel = navigationControllerCanApplyStackModel',
    );
    expect(reconcileStackSource).toContain(
      'navigationControllerCanApplyInitialOffwindowStackModel(',
    );
    expect(reconcileStackSource).toContain(
      'if (!canApplyWindowedStackModel && !canApplyInitialOffwindowStackModel)',
    );
    expect(stackSource).toContain('reconcileStack-deferred-offwindow');
    expect(
      stackSource.indexOf('reconcileStack-deferred-offwindow'),
    ).toBeLessThan(
      stackSource.indexOf('if (registry.stackTransitioning[stackId])'),
    );
    expect(stackSource).toContain('function rectHasPositiveSize');
    expect(prepareSource).toContain(
      'if (restoreHostView) {\n' +
        '    restoreScreenControllerViewFromHostHandle(controller, screenId, registry);\n' +
        '  }',
    );
    expect(prepareSource).toContain(
      'controller.__nativeScriptViewIsSnapshot === true ||\n' +
        '      controllerView.__nativeScriptOwningViewController !== controller',
    );
    expect(prepareSource).toContain(
      'if (targetBounds && rectHasPositiveSize(targetBounds))',
    );
  });

  it('uses strict UIKit controller identity for native stack containment', () => {
    expect(stackSource).toContain('function controllersEqual');
    expect(stackSource).toContain('function nativeControllersEqual');
    expect(stackSource).toContain('function controllerScreenId');
    expect(stackSource).toContain(
      'nativeControllersEqual(arrayItem(viewControllers, index), controller)',
    );
    expect(stackSource).toContain(
      '!nativeControllersEqual(\n        arrayItem(viewControllers, index),\n        controllers[index],\n      )',
    );
  });

  it('exposes a narrow UI-thread refresh for visible stack touch surfaces', () => {
    const touchSurfaceSource = stackSource.slice(
      stackSource.indexOf('function refreshVisibleStackTouchSurfacesForStack'),
      stackSource.indexOf('function finishTransition'),
    );
    const externalTouchSurfaceSource = stackSource.slice(
      stackSource.indexOf(
        'function refreshVisibleStackTouchSurfacesFromExternalHost',
      ),
      stackSource.indexOf('function stackHasStableReadyContentFromExternalHost'),
    );
    const refreshSource = stackSource.slice(
      stackSource.indexOf(
        'function rememberStackNavigationControllerForHostView',
      ),
      stackSource.indexOf('function installRefreshVisibleStackContentHandler'),
    );
    const installSource = stackSource.slice(
      stackSource.indexOf('function installRefreshVisibleStackContentHandler'),
      stackSource.indexOf(
        'function reconcileParentStackAfterScreenRegistration',
      ),
    );

    expect(stackSource).toContain('REFRESH_VISIBLE_STACK_TOUCH_SURFACES_KEY');
    expect(stackSource).toContain(
      'REFRESH_VISIBLE_STACK_TOUCH_SURFACES_FOR_HOST_KEY',
    );
    expect(stackSource).toContain(
      'STACK_NAVIGATION_CONTROLLER_RECORD_FOR_HOST_KEY',
    );
    expect(installSource).toContain(
      '[\n    REFRESH_VISIBLE_STACK_TOUCH_SURFACES_KEY\n  ]',
    );
    expect(installSource).toContain(
      '[\n    REFRESH_VISIBLE_STACK_TOUCH_SURFACES_FOR_HOST_KEY\n  ]',
    );
    expect(installSource).toContain(
      '[\n    STACK_NAVIGATION_CONTROLLER_RECORD_FOR_HOST_KEY\n  ]',
    );
    expect(refreshSource).toContain(
      'function refreshVisibleStackTouchSurfacesForHostViewFromExternalHost',
    );
    expect(refreshSource).toContain(
      'function rememberStackNavigationControllerForHostView',
    );
    expect(refreshSource).toContain(
      'function stackNavigationControllerRecordForHostViewFromExternalHost',
    );
    expect(refreshSource).toContain(
      'stackNavigationControllerMatchesHostView(',
    );
    expect(refreshSource).toContain(
      'hostView.__nativeScriptNavigationController = navigationController;',
    );
    expect(refreshSource).toContain(
      'rememberStackNavigationControllerForHostView(\n' +
        '      hostView,\n' +
        '      stackId,\n' +
        '      navigationController,\n' +
        '      registry,\n' +
        '    );',
    );
    expect(touchSurfaceSource).toContain(
      'restoreVisibleNavigationControllerInteractivity(\n' +
        '    navigationController,\n' +
        '    registry,\n' +
        '    forceRefresh,\n' +
        '  );',
    );
    expect(touchSurfaceSource).toContain(
      'const visibleScreenIds = stackVisibleScreenIds(stackId, registry);',
    );
    expect(touchSurfaceSource).toContain(
      'const topVisibleScreenId = visibleScreenIds[visibleScreenIds.length - 1];',
    );
    expect(touchSurfaceSource).toContain(
      'restoreScreenControllerViewFromHostHandle(controller, screenId, registry);\n' +
        '    let controllerView = screenControllerView(controller);',
    );
    expect(touchSurfaceSource).toContain(
      'ensureScreenContentWrapperMounted(screenId, registry);',
    );
    expect(touchSurfaceSource).toContain(
      'if (!controllerView) {\n' +
        '      restoreScreenControllerViewFromHostHandle(controller, screenId, registry);\n' +
        '      controllerView = screenControllerView(controller);\n' +
        '    }',
    );
    expect(touchSurfaceSource).toContain(
      'refreshScreenSurfaceTouchHandlerIfNeeded(',
    );
    expect(touchSurfaceSource).toContain('forceRefresh,');
    expect(touchSurfaceSource).toContain(
      'const isTopVisibleScreen = screenId === topVisibleScreenId;',
    );
    expect(touchSurfaceSource).toContain(
      'isTopVisibleScreen,\n' +
        '        forceRefresh && isTopVisibleScreen,',
    );
    expect(touchSurfaceSource).toContain(
      'restoreDescendantInteractivity = true',
    );
    expect(touchSurfaceSource).toContain('let didRefreshTouchSurface = false;');
    expect(touchSurfaceSource).toContain('didRefreshTouchSurface = true;');
    expect(touchSurfaceSource).toContain(
      'if (restoreDescendantInteractivity || didRefreshTouchSurface) {',
    );
    expect(
      touchSurfaceSource.indexOf('refreshScreenSurfaceTouchHandlerIfNeeded('),
    ).toBeLessThan(
      touchSurfaceSource.indexOf(
        'if (restoreDescendantInteractivity || didRefreshTouchSurface) {',
      ),
    );
    expect(touchSurfaceSource).not.toContain('layoutNavigationStackViews');
    expect(touchSurfaceSource).not.toContain(
      'refreshVisibleStackScreenContentReady',
    );
    expect(touchSurfaceSource).not.toContain(
      'refreshVisibleStackContentWrapperHosts',
    );
    expect(touchSurfaceSource).not.toContain('reconcileStack(');
    expect(touchSurfaceSource).not.toContain('refreshKnownUIKitHostView');
    expect(externalTouchSurfaceSource).toContain(
      'nativeScriptStackIdForNavigationController(',
    );
    expect(externalTouchSurfaceSource).toContain(
      'return refreshVisibleStackTouchSurfacesForStack(\n' +
        '    stackId,\n' +
        '    registry,\n' +
        '    navigationController,\n' +
        '    forceRefresh,\n' +
        '    restoreDescendantInteractivity,\n' +
        '  );',
    );
    expect(stackSource).toContain(
      'const didRefreshSettledTouchSurfaces =\n' +
        '    refreshVisibleStackTouchSurfacesForStack(',
    );
    expect(stackSource).toContain("'post-transition-touch-refresh'");
  });

  it('exposes a narrow UI-thread reconcile for selected embedded stacks', () => {
    const scheduledSource = stackSource.slice(
      stackSource.indexOf('function scheduledReconcileStack'),
      stackSource.indexOf('function refreshScreenContentWrapperHost'),
    );
    const reconcileSource = stackSource.slice(
      stackSource.indexOf('function reconcileStackFromExternalHost'),
      stackSource.indexOf(
        'function refreshVisibleStackTouchSurfacesFromExternalHost',
      ),
    );
    const installSource = stackSource.slice(
      stackSource.indexOf('function installRefreshVisibleStackContentHandler'),
      stackSource.indexOf(
        'function reconcileParentStackAfterScreenRegistration',
      ),
    );

    expect(stackSource).toContain('RECONCILE_STACK_FROM_EXTERNAL_HOST_KEY');
    expect(scheduledSource).toContain('RECONCILE_STACK_KEY');
    expect(scheduledSource).toContain(
      'const directActiveIds = registry.stackActiveScreenIds[stackId] ?? [];',
    );
    expect(scheduledSource).toContain(
      'const directModalIndex = firstModalIndex(directActiveIds, registry);',
    );
    expect(scheduledSource).toContain(
      'const canUseDirectReconcile = ctx && directActiveIds.length > 0;',
    );
    expect(scheduledSource).not.toContain(
      'ctx && directActiveIds.length > 0 && directModalIndex < 0',
    );
    expect(scheduledSource).toContain(
      "traceWorkletEvent(\n      'scheduledReconcileStack-direct'",
    );
    expect(scheduledSource.indexOf('RECONCILE_STACK_KEY')).toBeLessThan(
      scheduledSource.indexOf('RECONCILE_STACK_FROM_EXTERNAL_HOST_KEY'),
    );
    expect(scheduledSource).toContain(
      'callWorkletFunction(\n' +
        '      reconcileStackFromRegistry,\n' +
        '      stackId,\n' +
        '      registry,\n' +
        '      ctx,\n' +
        '      animated,',
    );
    expect(scheduledSource).toContain(
      "traceWorkletEvent(\n      'scheduledReconcileStack-external'",
    );
    expect(scheduledSource).toContain('modalIndex=${directModalIndex}');
    expect(scheduledSource).toContain(
      'reconcile=${typeof reconcileStackFromRegistry}',
    );
    expect(installSource).toContain('[RECONCILE_STACK_FROM_EXTERNAL_HOST_KEY]');
    expect(reconcileSource).toContain(
      'nativeScriptStackIdForNavigationController(',
    );
    expect(reconcileSource).toContain('const activeKey = idsKey(activeIds);');
    expect(reconcileSource).toContain(
      'navigationControllerCanApplyStackModel(',
    );
    expect(reconcileSource).toContain(
      'registry.stackPendingReconcileKeys[stackId] = activeKey;',
    );
    expect(reconcileSource).toContain(
      'registry.stackPendingReconcileKeys[stackId] = undefined;\n' +
        '      updateNativeBackGesture(navigationController);\n' +
        '      return false;',
    );
    expect(reconcileSource).toContain(
      'registry.stackPendingReconcileKeys[stackId] == null &&\n' +
        '    registry.stackNativeKeys[stackId] === activeKey',
    );
    expect(reconcileSource).toContain(
      'updateNativeBackGesture(navigationController);\n' + '    return false;',
    );
    expect(reconcileSource).toContain(
      'const previousNativeKey = registry.stackNativeKeys[stackId];',
    );
    expect(reconcileSource).toContain(
      'const previousPendingKey = registry.stackPendingReconcileKeys[stackId];',
    );
    expect(reconcileSource).toContain(
      'reconcileStack(\n' +
        '    stackId,\n' +
        '    registry,\n' +
        '    ctx,\n' +
        "    typeof animated === 'boolean'\n" +
        '      ? animated\n' +
        '      : registry.stackNativeKeys[stackId] != null,\n' +
        '  );',
    );
    expect(reconcileSource).toContain(
      'registry.stackNativeKeys[stackId] === activeKey &&\n' +
        '    (previousNativeKey !== activeKey || previousPendingKey != null)',
    );
    expect(reconcileSource).not.toContain('layoutNavigationStackViews');
    expect(reconcileSource).not.toContain(
      'refreshVisibleStackScreenContentReady',
    );
    expect(reconcileSource).not.toContain(
      'refreshVisibleStackContentWrapperHosts',
    );
    expect(reconcileSource).not.toContain('refreshScreenContentWrapperHost');
  });

  it('keeps modal presentation as UIKit presentation-controller behavior', () => {
    const setModalSource = stackSource.slice(
      stackSource.indexOf('function setModalViewControllers'),
      stackSource.indexOf('function reconcilePresentedModalStack'),
    );

    expect(stackSource).toContain('UIAdaptivePresentationControllerDelegate');
    expect(stackSource).toContain('UINavigationBarDelegate');
    expect(stackSource).toContain('navigationBarShouldPopItem(');
    expect(stackSource).toContain("'navigationBar:shouldPopItem:'");
    expect(stackSource).toContain(
      'function retainNavigationControllerDelegate',
    );
    expect(stackSource).toContain(
      'navigationController.__nativeScriptNavigationControllerDelegate = delegate;',
    );
    expect(stackSource).toContain('const navigationDelegate = ctx.delegate(');
    expect(stackSource).toContain(
      'retainNavigationControllerDelegate(controller, navigationDelegate, ctx);',
    );
    expect(stackSource).toContain(
      'releaseNavigationControllerDelegate(navigationController);',
    );
    expect(stackSource).toContain('.createNativeUIAction');
    expect(stackSource).toContain(
      'startNativeStackBackPop(nav, controller, registry);',
    );
    expect(stackSource).toContain("'popViewControllerAnimated:'");
    expect(stackSource).toContain('presentationControllerShouldDismiss(');
    expect(stackSource).toContain('presentationControllerDidAttemptToDismiss(');
    expect(stackSource).toContain('presentationControllerDidDismiss(');
    for (const match of stackSource.matchAll(
      /presentationControllerShouldDismiss\([^)]*\)\s*\{([\s\S]*?)presentationControllerDidAttemptToDismiss/g,
    )) {
      expect(match[1]).not.toContain(
        'repairDescendantStackContainmentForController',
      );
    }
    expect(stackSource).toContain(
      'class RNSNavigationNativeScriptController extends UINavigationController',
    );
    expect(stackSource).toContain(
      'function setupAdaptivePresentationControllerDelegate',
    );
    expect(stackSource).toContain(
      'presentationController.delegate = controller;',
    );
    expectSourceToContain(
      stackSource,
      'controller.__nativeScriptAdaptivePresentationControllerDelegate = controller;',
    );
    expectSourceToContain(
      stackSource,
      'ctx.delegate(presentationController, delegateProtocol, {',
    );
    expectSourceToContain(
      stackSource,
      "assignTo: {\n      object: presentationController,\n      property: 'delegate',",
    );
    expect(stackSource).not.toContain(
      'presentationController.delegate = delegate;',
    );
    expect(stackSource).toContain(
      'presentationController.__nativeScriptAdaptivePresentationControllerDelegate =\n' +
        '    delegate;',
    );
    expect(setModalSource).toContain(
      'configureModalScreenController(nextController, nextProps, registry, ctx);',
    );
    expect(
      setModalSource.indexOf(
        'configureModalScreenController(nextController, nextProps, registry, ctx);',
      ),
    ).toBeLessThan(
      setModalSource.indexOf(
        'invokeNativeSelector(\n' +
          '        previousController,\n' +
          "        'presentViewControllerAnimatedCompletion',",
      ),
    );
    expect(stackSource).not.toContain(
      'ctx.delegate(controller, delegateProtocol, {\n' +
        '    presentationControllerShouldDismiss',
    );
    expectSourceToContain(
      stackSource,
      "assignTo: {\n        object: controller,\n        property: 'delegate',",
    );
    expect(stackSource).not.toContain(
      'controller.delegate = navigationDelegate;',
    );
    expect(stackSource).toContain(
      'completePresentedModalDismissalIfNeeded(this, presentationController)',
    );
    expectSourceToContain(
      stackSource,
      'completePresentedModalDismissalIfNeeded(\n' +
        '        controller,\n' +
        '        presentationController,\n' +
        '        props,\n' +
        '      );',
    );
    expect(stackSource).toContain(
      "defineObjCClassMetadata(\n      RNSNavigationNativeScriptController,\n      'ObjCProtocols'",
    );
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

  it('delays detached-screen modal presentation only on the local React superview controller', () => {
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
    ).toBeNull();
  });

  it('uses upstream attached presenter readiness for modal presentation', () => {
    const reconcileSource = stackSource.slice(
      stackSource.indexOf('function reconcileStack'),
      stackSource.indexOf('const NativeScriptStackController'),
    );
    const setModalSource = stackSource.slice(
      stackSource.indexOf('function setModalViewControllers'),
      stackSource.indexOf('function reconcilePresentedModalStack'),
    );

    expect(stackSource).toContain('function hostViewForController');
    expect(stackSource).toContain('function viewControllerCanPresentModal');
    expect(stackSource).toContain('function markModalPresentationBlocked');
    const canPresentSource = stackSource.slice(
      stackSource.indexOf('function viewControllerCanPresentModal'),
      stackSource.indexOf(
        'export const __nativeScriptViewControllerCanPresentModalForTests',
      ),
    );
    expect(canPresentSource).toContain(
      'parentViewControllerForController(controller) != null',
    );
    expect(canPresentSource).toContain(
      'controller.presentingViewController != null',
    );
    expect(canPresentSource).not.toContain('const hasAttachedView =');
    expect(canPresentSource).not.toContain('hostViewForController(controller)');
    expect(canPresentSource).not.toContain('screenControllerView(controller)');
    expect(canPresentSource).not.toContain(
      'controllerHierarchyContainsController',
    );
    expect(canPresentSource).not.toContain(
      'controllerHasKnownRootContainedParent',
    );
    expect(canPresentSource).not.toContain('viewControllerIsRootContained');
    expect(stackSource).toContain('generic ObjC associated-object interop');
    expect(stackSource).not.toContain('stackModalPresentationRetryScheduled');
    expect(stackSource).toContain("traceWorkletEvent('modal-await-lifecycle'");
    expect(stackSource).not.toContain('}, 32);');
    expect(stackSource).toContain(
      'function controllerIsVisiblyParentedToController',
    );
    expect(stackSource).toContain(
      'const controllerIsVisiblyHostedByTargetParent =',
    );
    expect(stackSource).toContain(
      'controllerIsVisiblyParentedToController(controller, parentViewController)',
    );
    expectSourceToContain(
      setModalSource,
      'const navigationHostView = hostViewForController(navigationController);',
    );
    expectSourceToContain(
      setModalSource,
      'const navigationControllerView = screenControllerView(navigationController);',
    );
    expect(setModalSource).toContain(
      'previousLastControllerView?.window == null',
    );
    expect(setModalSource).toContain('navigationHostView?.window == null');
    expect(setModalSource).toContain('const navigationPresenterHostView =');
    expect(setModalSource).toContain('navigationHostView?.window != null');
    expect(setModalSource).toContain(
      'navigationControllerView ?? navigationController?.view',
    );
    expect(setModalSource).not.toContain('const changeRootHostView');
    expect(setModalSource).toContain('const didAttachRootController');
    expectSourceToContain(
      setModalSource,
      "layoutNavigationStackViews(navigationController, 'modal-root-controller-attach');",
    );
    expect(setModalSource).not.toContain('modal-skip-attached-root');
    expect(setModalSource).toContain(
      '!viewControllerCanPresentModal(changeRootController)',
    );
    expect(setModalSource).toContain('const hasNewModalControllers');
    expect(setModalSource).toContain(
      'keep that cache at the previous committed value',
    );
    expectSourceToContain(
      setModalSource,
      'markModalPresentationBlocked(\n' +
        '      stackId,\n' +
        '      registry,\n' +
        '      controllerIds.slice(changeRootIndex),\n' +
        '    );',
    );
    expectSourceToContain(
      setModalSource,
      'cancelSkippedTransitionAttempt(\n' +
        '        stackId,\n' +
        '        registry,\n' +
        '        ctx,\n' +
        '        closing,\n' +
        '        transitionScreenId,\n' +
        '      );',
    );
    expect(reconcileSource).toContain('reconcilePresentedModalStack(');
    expectSourceToContain(
      reconcileSource,
      'updateNativeBackGesture(navigationController);\n    return;\n  }\n\n  if (presentedModalIdsForStack',
    );
    expect(
      setModalSource.indexOf(
        'registry.stackUpdatingModals[stackId] = true',
        setModalSource.indexOf(
          '!viewControllerCanPresentModal(changeRootController)',
        ),
      ),
    ).toBeGreaterThan(
      setModalSource.indexOf(
        '!viewControllerCanPresentModal(changeRootController)',
      ),
    );
  });

  it('matches upstream modal presentation readiness once a presenter controller is attached', () => {
    const rootController: any = {
      childViewControllers: [],
      view: { window: {} },
      viewControllers: [],
    };
    const parentController: any = {
      childViewControllers: [],
      view: { window: {} },
      viewControllers: [],
    };
    const navigationController: any = {
      __nativeScriptRootContainedParentViewController: parentController,
      childViewControllers: [],
      parentViewController: parentController,
      view: { window: {} },
      viewControllers: [],
    };

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
      __nativeScriptViewControllerCanPresentModalForTests(navigationController),
    ).toBe(true);

    const attachedWithoutDiscoverableParent: any = {
      childViewControllers: [],
      view: { window: {} },
      viewControllers: [],
    };

    expect(
      __nativeScriptViewControllerCanPresentModalForTests(
        attachedWithoutDiscoverableParent,
      ),
    ).toBe(false);

    const detachedController: any = {
      childViewControllers: [],
      view: { window: null },
      viewControllers: [],
    };

    expect(
      __nativeScriptViewControllerCanPresentModalForTests(detachedController),
    ).toBe(false);

    detachedController.presentingViewController = parentController;

    expect(
      __nativeScriptViewControllerCanPresentModalForTests(detachedController),
    ).toBe(true);

    detachedController.presentingViewController = undefined;

    navigationController.view.superview = parentController.view;

    expect(
      __nativeScriptViewControllerCanPresentModalForTests(navigationController),
    ).toBe(true);

    navigationController.view.superview = undefined;

    const alreadyParentedNavigationController: any = {
      __nativeScriptAlreadyParentedByUIKit: true,
      childViewControllers: [],
      parentViewController: {
        childViewControllers: [],
        view: { window: null },
        viewControllers: [],
      },
      view: { window: {} },
      viewControllers: [],
    };

    expect(
      __nativeScriptViewControllerCanPresentModalForTests(
        alreadyParentedNavigationController,
      ),
    ).toBe(true);

    parentController.parentViewController = rootController;

    expect(
      __nativeScriptViewControllerCanPresentModalForTests(navigationController),
    ).toBe(true);

    parentController.parentViewController = undefined;
    rootController.childViewControllers = [parentController];
    parentController.childViewControllers = [navigationController];

    expect(
      __nativeScriptViewControllerCanPresentModalForTests(navigationController),
    ).toBe(true);

    delete (global as Record<string, unknown>).__nativeScriptNativeApi;
  });

  it('reparents nested modal navigation stacks as one UIKit hierarchy', () => {
    const previousNativeApi = (global as Record<string, unknown>)
      .__nativeScriptNativeApi;
    const makeView = () => {
      const view: any = {
        autoresizingMask: 0,
        bounds: { origin: { x: 0, y: 0 }, size: { height: 100, width: 100 } },
        frame: { origin: { x: 0, y: 0 }, size: { height: 100, width: 100 } },
        subviews: [],
        addSubview(child: any) {
          child.removeFromSuperview?.();
          child.superview = view;
          view.subviews.push(child);
        },
        removeFromSuperview() {
          const parent = view.superview;
          if (!parent?.subviews) {
            view.superview = undefined;
            return;
          }
          parent.subviews = parent.subviews.filter(
            (child: any) => child !== view,
          );
          view.superview = undefined;
        },
      };

      return view;
    };
    const placeholderController = { view: makeView() };
    const staleRootView = makeView();
    const stackView = makeView();
    const navigationView = makeView();
    const modalView = makeView();
    const window = {};

    stackView.window = window;
    navigationView.window = window;
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIViewController: {
        alloc: () => ({
          init: () => placeholderController,
        }),
      },
    };
    const staleRootController: any = {
      childViewControllers: [],
      view: staleRootView,
    };
    const modalController: any = {
      childViewControllers: [],
      view: modalView,
      addChildViewController(child: any) {
        modalController.childViewControllers.push(child);
        child.parentViewController = modalController;
      },
    };
    const navigationController: any = {
      __nativeScriptAlreadyParentedByUIKit: true,
      __nativeScriptRootContainedParentViewController: staleRootController,
      __nativeScriptStackContainerView: stackView,
      parentViewController: staleRootController,
      view: navigationView,
      viewControllers: [{ view: makeView() }],
      didMoveToParentViewController: jest.fn(),
      removeFromParentViewController: jest.fn(() => {
        staleRootController.childViewControllers =
          staleRootController.childViewControllers.filter(
            (child: any) => child !== navigationController,
          );
        navigationController.parentViewController = undefined;
      }),
      setViewControllersAnimated: jest.fn(),
      willMoveToParentViewController: jest.fn(),
    };

    staleRootController.childViewControllers.push(navigationController);
    staleRootView.addSubview(stackView);
    staleRootView.addSubview(navigationView);

    const registry: any = {
      screenParents: {
        'modal:modal-header': 'nested-stack',
      },
      screenProps: {
        modal: { stackPresentation: 'modal' },
      },
      screens: {
        modal: modalController,
      },
      stacks: {
        'nested-stack': navigationController,
      },
    };

    expect(
      __nativeScriptControllerCanApplyScrollEdgeEffectsForTests(
        {},
        {
          screenId: 'modal:modal-header',
          scrollEdgeEffects: { top: 'automatic' },
        } as any,
        registry,
      ),
    ).toBe(false);
    expect(
      __nativeScriptControllerCanApplyScrollEdgeEffectsForTests(
        {},
        {
          screenId: 'modal:modal-header',
          scrollEdgeEffects: { top: 'automatic' },
        } as any,
        {
          ...registry,
          screenProps: {},
        },
      ),
    ).toBe(false);

    expect(
      __nativeScriptReparentNavigationControllerForModalContentForTests(
        navigationController,
        stackView,
        modalController,
        modalView,
      ),
    ).toBe(true);

    expect(
      navigationController.setViewControllersAnimated,
    ).toHaveBeenCalledWith([placeholderController], false);
    expect(navigationController.viewControllers).toEqual([
      placeholderController,
    ]);
    expect(navigationController.__nativeScriptNeedsViewControllerRehost).toBe(
      true,
    );
    expect(navigationController.parentViewController).toBe(modalController);
    expect(
      navigationController.__nativeScriptRootContainedParentViewController,
    ).toBe(modalController);
    expect(navigationController.__nativeScriptAlreadyParentedByUIKit).toBe(
      undefined,
    );
    expect(stackView.superview).toBe(modalView);
    expect(navigationView.superview).toBe(stackView);
    expect(staleRootView.subviews).not.toContain(stackView);
    expect(staleRootView.subviews).not.toContain(navigationView);
    expect(
      __nativeScriptControllerCanApplyScrollEdgeEffectsForTests(
        {},
        {
          screenId: 'modal:modal-header',
          scrollEdgeEffects: { top: 'automatic' },
        } as any,
        registry,
      ),
    ).toBe(false);

    (global as Record<string, unknown>).__nativeScriptNativeApi =
      previousNativeApi;
  });

  it('attaches nested modal stacks without resetting when the view hierarchy is already correct', () => {
    const previousNativeApi = (global as Record<string, unknown>)
      .__nativeScriptNativeApi;
    const makeView = () => {
      const view: any = {
        autoresizingMask: 0,
        bounds: { origin: { x: 0, y: 0 }, size: { height: 100, width: 100 } },
        frame: { origin: { x: 0, y: 0 }, size: { height: 100, width: 100 } },
        subviews: [],
        addSubview(child: any) {
          child.removeFromSuperview?.();
          child.superview = view;
          view.subviews.push(child);
        },
        removeFromSuperview() {
          const parent = view.superview;
          if (!parent?.subviews) {
            view.superview = undefined;
            return;
          }
          parent.subviews = parent.subviews.filter(
            (child: any) => child !== view,
          );
          view.superview = undefined;
        },
      };

      return view;
    };
    const placeholderController = { view: makeView() };
    const stackView = makeView();
    const navigationView = makeView();
    const modalView = makeView();
    const routeController = { view: makeView() };
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIViewController: {
        alloc: () => ({
          init: () => placeholderController,
        }),
      },
    };
    const modalController: any = {
      childViewControllers: [],
      view: modalView,
      addChildViewController(child: any) {
        modalController.childViewControllers.push(child);
        child.parentViewController = modalController;
      },
    };
    const navigationController: any = {
      __nativeScriptStackContainerView: stackView,
      parentViewController: undefined,
      view: navigationView,
      viewControllers: [routeController],
      didMoveToParentViewController: jest.fn(),
      removeFromParentViewController: jest.fn(),
      setViewControllersAnimated: jest.fn(),
      willMoveToParentViewController: jest.fn(),
    };

    modalView.addSubview(stackView);
    stackView.addSubview(navigationView);

    expect(
      __nativeScriptReparentNavigationControllerForModalContentForTests(
        navigationController,
        stackView,
        modalController,
        modalView,
      ),
    ).toBe(true);

    expect(navigationController.parentViewController).toBe(modalController);
    expect(
      navigationController.__nativeScriptRootContainedParentViewController,
    ).toBe(modalController);
    expect(navigationController.viewControllers).toEqual([routeController]);
    expect(
      navigationController.setViewControllersAnimated,
    ).not.toHaveBeenCalled();
    expect(
      navigationController.removeFromParentViewController,
    ).not.toHaveBeenCalled();
    expect(
      navigationController.willMoveToParentViewController,
    ).not.toHaveBeenCalled();
    expect(navigationController.__nativeScriptNeedsViewControllerRehost).toBe(
      undefined,
    );
    expect(stackView.superview).toBe(modalView);
    expect(navigationView.superview).toBe(stackView);
    expect(
      navigationController.didMoveToParentViewController,
    ).toHaveBeenCalledWith(modalController);

    (global as Record<string, unknown>).__nativeScriptNativeApi =
      previousNativeApi;
  });

  it('does not attach modal content stacks to a fallback parent before the modal parent is known', () => {
    const previousRegistry = (global as Record<string, unknown>)
      .__rnsNativeScriptStackRegistry;
    const parentController: any = {
      addChildViewController: jest.fn(),
      view: null,
    };
    const navigationController: any = {
      __nativeScriptStackId: 'nested-stack',
      didMoveToParentViewController: jest.fn(),
      view: {
        removeFromSuperview: jest.fn(),
      },
    };
    const stackView: any = {
      addSubview: jest.fn(),
      nextResponder: parentController,
      reactSuperview: jest.fn(() => null),
      window: {},
    };
    parentController.view = stackView;

    (global as Record<string, unknown>).__rnsNativeScriptStackRegistry = {
      screenParents: {},
      screenProps: {
        modal: { stackPresentation: 'modal' },
      },
      screens: {
        modal: { view: {} },
      },
      stackActiveScreenIds: {
        'nested-stack': ['modal:modal-header'],
      },
      stacks: {
        'nested-stack': navigationController,
      },
    };

    expect(
      __nativeScriptReactAddControllerToClosestParentForTests(
        stackView,
        navigationController,
      ),
    ).toBe(false);
    expect(parentController.addChildViewController).not.toHaveBeenCalled();
    expect(stackView.addSubview).not.toHaveBeenCalled();
    expect(
      navigationController.didMoveToParentViewController,
    ).not.toHaveBeenCalled();

    (global as Record<string, unknown>).__rnsNativeScriptStackRegistry =
      previousRegistry;
  });

  it('uses explicit modal content stack ownership before child screen registration', () => {
    const previousRegistry = (global as Record<string, unknown>)
      .__rnsNativeScriptStackRegistry;
    const parentController: any = {
      addChildViewController: jest.fn(),
      view: null,
    };
    const navigationController: any = {
      __nativeScriptStackId: 'nested-stack',
      didMoveToParentViewController: jest.fn(),
      view: {
        removeFromSuperview: jest.fn(),
      },
    };
    const stackView: any = {
      addSubview: jest.fn(),
      nextResponder: parentController,
      reactSuperview: jest.fn(() => null),
      window: {},
    };
    parentController.view = stackView;

    (global as Record<string, unknown>).__rnsNativeScriptStackRegistry = {
      screenParents: {},
      screenProps: {
        modal: { stackPresentation: 'modal' },
      },
      screens: {
        modal: { view: {} },
      },
      stackActiveScreenIds: {
        'nested-stack': [],
      },
      stackModalContentParentScreenIds: {
        'nested-stack': 'modal',
      },
      stacks: {
        'nested-stack': navigationController,
      },
    };

    expect(
      __nativeScriptReactAddControllerToClosestParentForTests(
        stackView,
        navigationController,
      ),
    ).toBe(false);
    expect(parentController.addChildViewController).not.toHaveBeenCalled();
    expect(stackView.addSubview).not.toHaveBeenCalled();
    expect(
      navigationController.didMoveToParentViewController,
    ).not.toHaveBeenCalled();

    (global as Record<string, unknown>).__rnsNativeScriptStackRegistry =
      previousRegistry;
  });

  it('reparents nested modal stacks out of stale view-controller-owned ancestors', () => {
    const previousNativeApi = (global as Record<string, unknown>)
      .__nativeScriptNativeApi;
    const makeView = (owner?: any) => {
      const view: any = {
        __nativeScriptOwningViewController: owner,
        autoresizingMask: 0,
        bounds: { origin: { x: 0, y: 0 }, size: { height: 100, width: 100 } },
        frame: { origin: { x: 0, y: 0 }, size: { height: 100, width: 100 } },
        subviews: [],
        addSubview(child: any) {
          child.removeFromSuperview?.();
          child.superview = view;
          view.subviews.push(child);
        },
        removeFromSuperview() {
          const parent = view.superview;
          if (!parent?.subviews) {
            view.superview = undefined;
            return;
          }
          parent.subviews = parent.subviews.filter(
            (child: any) => child !== view,
          );
          view.superview = undefined;
        },
      };

      return view;
    };
    const placeholderController = { view: makeView() };
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIViewController: {
        alloc: () => ({
          init: () => placeholderController,
        }),
      },
    };

    const modalController: any = {
      childViewControllers: [],
      didMoveToParentViewController: jest.fn(),
      view: undefined,
      addChildViewController(child: any) {
        modalController.childViewControllers.push(child);
        child.parentViewController = modalController;
      },
    };
    const staleOwnerController: any = {
      addChildViewController: jest.fn(),
      childViewControllers: [],
      view: undefined,
    };
    const modalView = makeView(modalController);
    const staleOwnerView = makeView();
    const stackView = makeView();
    const navigationView = makeView();
    const window = {};

    stackView.window = window;
    navigationView.window = window;
    modalController.view = modalView;
    staleOwnerController.view = staleOwnerView;
    staleOwnerView.nextResponder = staleOwnerController;

    const navigationController: any = {
      __nativeScriptRootContainedParentViewController: modalController,
      __nativeScriptStackContainerView: stackView,
      __nativeScriptStackModalContentParentController: modalController,
      parentViewController: modalController,
      view: navigationView,
      viewControllers: [{ view: makeView() }],
      didMoveToParentViewController: jest.fn(),
      removeFromParentViewController: jest.fn(() => {
        modalController.childViewControllers =
          modalController.childViewControllers.filter(
            (child: any) => child !== navigationController,
          );
        navigationController.parentViewController = undefined;
      }),
      setViewControllersAnimated: jest.fn(),
      willMoveToParentViewController: jest.fn(),
    };

    modalController.childViewControllers.push(navigationController);
    modalView.addSubview(staleOwnerView);
    staleOwnerView.addSubview(stackView);
    stackView.addSubview(navigationView);

    expect(
      __nativeScriptReparentNavigationControllerForModalContentForTests(
        navigationController,
        stackView,
        modalController,
        modalView,
      ),
    ).toBe(true);

    expect(
      navigationController.setViewControllersAnimated,
    ).toHaveBeenCalledWith([placeholderController], false);
    expect(navigationController.viewControllers).toEqual([
      placeholderController,
    ]);
    expect(navigationController.parentViewController).toBe(modalController);
    expect(stackView.superview).toBe(modalView);
    expect(navigationView.superview).toBe(stackView);
    expect(staleOwnerView.subviews).not.toContain(stackView);
    expect(navigationController.__nativeScriptNeedsViewControllerRehost).toBe(
      true,
    );

    (global as Record<string, unknown>).__nativeScriptNativeApi =
      previousNativeApi;
  });

  it('removes stale root-owned modal navigation descendants before modal reparent', () => {
    const makeView = (owner?: any) => {
      const view: any = {
        __nativeScriptOwningViewController: owner,
        subviews: [],
        addSubview(child: any) {
          child.removeFromSuperview?.();
          child.superview = view;
          view.subviews.push(child);
        },
        removeFromSuperview() {
          const parent = view.superview;
          if (!parent?.subviews) {
            view.superview = undefined;
            return;
          }
          parent.subviews = parent.subviews.filter(
            (child: any) => child !== view,
          );
          view.superview = undefined;
        },
      };

      return view;
    };
    const nestedNavigationController: any = {};
    const rootView = makeView();
    const oldRootWrapper = makeView();
    const staleNavigationWrapper = makeView(nestedNavigationController);
    const modalView = makeView();
    const modalContent = makeView(nestedNavigationController);

    staleNavigationWrapper.nextResponder = nestedNavigationController;
    modalContent.nextResponder = nestedNavigationController;
    rootView.addSubview(oldRootWrapper);
    oldRootWrapper.addSubview(staleNavigationWrapper);
    rootView.addSubview(modalView);
    modalView.addSubview(modalContent);

    expect(
      __nativeScriptRemoveControllerOwnedDescendantsOutsideAncestorForTests(
        rootView,
        nestedNavigationController,
        modalView,
      ),
    ).toBe(true);

    expect(rootView.subviews).not.toContain(oldRootWrapper);
    expect(oldRootWrapper.superview).toBeUndefined();
    expect(modalView.subviews).toContain(modalContent);
  });

  it('resets modal nested stacks from active ids after modal header screen records are gone', () => {
    const navigationView: any = {
      removeFromSuperview: jest.fn(),
      superview: {},
    };
    const stackView: any = {
      removeFromSuperview: jest.fn(),
      superview: {},
    };
    const navigationController: any = {
      __nativeScriptStackContainerView: stackView,
      __nativeScriptStackModalContentParentController: {},
      __nativeScriptStableStackLayoutKey: 'stale-layout',
      parentViewController: {},
      removeFromParentViewController: jest.fn(() => {
        navigationController.parentViewController = undefined;
      }),
      setViewControllersAnimated: jest.fn(),
      view: navigationView,
      viewControllers: [{ view: {} }],
      willMoveToParentViewController: jest.fn(),
    };
    const registry: any = {
      screens: {},
      screenParents: {},
      stackActiveScreenIds: {
        'nested-stack': ['modal:modal-header'],
      },
      stackNativeCounts: {
        'nested-stack': 1,
      },
      stackNativeKeys: {
        'nested-stack': 'modal:modal-header',
      },
      stacks: {
        'nested-stack': navigationController,
      },
    };

    __nativeScriptResetPresentedModalNestedContentStacksForTests(
      'modal',
      registry,
    );

    expect(
      navigationController.willMoveToParentViewController,
    ).toHaveBeenCalledWith(null);
    expect(
      navigationController.removeFromParentViewController,
    ).toHaveBeenCalled();
    expect(navigationView.removeFromSuperview).toHaveBeenCalled();
    expect(stackView.removeFromSuperview).toHaveBeenCalled();
    expect(
      navigationController.setViewControllersAnimated,
    ).toHaveBeenCalledWith([], false);
    expect(navigationController.__nativeScriptNeedsViewControllerRehost).toBe(
      true,
    );
    expect(
      navigationController.__nativeScriptStackModalContentParentController,
    ).toBeNull();
    expect(registry.stackNativeKeys['nested-stack']).toBe('');
    expect(registry.stackNativeCounts['nested-stack']).toBe(0);
    expect(
      navigationController.__nativeScriptStableStackLayoutKey,
    ).toBeUndefined();
  });

  it('skips nested modal presentation refresh when UIKit hierarchy and content are current', () => {
    const makeRect = (width = 402, height = 437, x = 0, y = 0) => ({
      origin: { x, y },
      size: { width, height },
    });
    const makeView = (
      description = 'UIView',
      frame = makeRect(),
      bounds = makeRect(frame.size.width, frame.size.height),
    ) => {
      const view: any = {
        alpha: 1,
        bounds,
        description,
        frame,
        hidden: false,
        subviews: [],
        userInteractionEnabled: true,
        addSubview(child: any) {
          child.removeFromSuperview?.();
          child.superview = view;
          view.subviews.push(child);
        },
        removeFromSuperview() {
          const parent = view.superview;
          if (!parent?.subviews) {
            view.superview = undefined;
            return;
          }
          parent.subviews = parent.subviews.filter(
            (child: any) => child !== view,
          );
          view.superview = undefined;
        },
      };

      return view;
    };
    const modalView = makeView('UIView', makeRect(402, 842));
    const stackView = makeView('UIView', makeRect(402, 842));
    const navigationView = makeView('UIView', makeRect(402, 842));
    const screenView = makeView('UIView', makeRect(402, 437));
    const contentWrapperView = makeView('UIView', makeRect(402, 437));
    const hostedText = makeView(
      'RCTParagraphComponentView',
      makeRect(366, 50, 18, 317),
    );
    const modalController: any = {
      __nativeScriptScreenId: 'modal',
      view: modalView,
    };
    const contentController: any = {
      __nativeScriptScreenId: 'modal:modal-header',
      view: screenView,
    };
    const navigationController: any = {
      __nativeScriptStackId: 'nested-stack',
      __nativeScriptStackContainerView: stackView,
      __nativeScriptStackModalContentParentController: modalController,
      parentViewController: modalController,
      view: navigationView,
      viewControllers: [contentController],
    };
	    const registry: any = {
	      screenContentReady: { 'modal:modal-header': true },
      screenContentWrapperViews: {
        'modal:modal-header': contentWrapperView,
      },
      screenPendingHeaderConfigUpdates: {},
      screenPendingHeaderSubviewKeys: {},
      screens: {
        modal: modalController,
        'modal:modal-header': contentController,
      },
      stackTransitioning: {
        'nested-stack': true,
      },
	    };
	    const window = {};

	    modalView.addSubview(stackView);
	    stackView.addSubview(navigationView);
	    screenView.addSubview(contentWrapperView);
	    contentWrapperView.addSubview(hostedText);

    expect(
      __nativeScriptNestedModalStackCanSkipPresentationRefreshForTests(
        navigationController,
        stackView,
        modalController,
        modalView,
        ['modal:modal-header'],
        registry,
      ),
    ).toBe(false);

	    __nativeScriptRememberNestedModalPresentationGeometryForTests(
	      navigationController,
	      stackView,
	      modalView,
	      ['modal:modal-header'],
	      registry,
	    );

	    expect(
	      __nativeScriptNestedModalStackCanSkipPresentationRefreshForTests(
        navigationController,
        stackView,
        modalController,
        modalView,
        ['modal:modal-header'],
	        registry,
	      ),
	    ).toBe(false);

	    modalView.window = window;
	    stackView.window = window;
	    navigationView.window = window;
	    screenView.window = window;
	    contentWrapperView.window = window;
	    hostedText.window = window;

	    expect(
	      __nativeScriptNestedModalStackCanSkipPresentationRefreshForTests(
	        navigationController,
	        stackView,
	        modalController,
	        modalView,
	        ['modal:modal-header'],
	        registry,
	      ),
	    ).toBe(true);

	    contentWrapperView.window = undefined;
	    expect(
	      __nativeScriptNestedModalStackCanSkipPresentationRefreshForTests(
	        navigationController,
	        stackView,
	        modalController,
	        modalView,
	        ['modal:modal-header'],
	        registry,
	      ),
	    ).toBe(false);
	    contentWrapperView.window = window;

	    navigationView.window = undefined;
	    expect(
	      __nativeScriptNestedModalStackCanSkipPresentationRefreshForTests(
	        navigationController,
	        stackView,
	        modalController,
	        modalView,
	        ['modal:modal-header'],
	        registry,
	      ),
	    ).toBe(false);
	    navigationView.window = window;

	    contentWrapperView.frame = makeRect(760, 842);
    expect(
      __nativeScriptNestedModalStackCanSkipPresentationRefreshForTests(
        navigationController,
        stackView,
        modalController,
        modalView,
        ['modal:modal-header'],
        registry,
      ),
    ).toBe(false);
    contentWrapperView.frame = makeRect(402, 437);
    __nativeScriptRememberNestedModalPresentationGeometryForTests(
      navigationController,
      stackView,
      modalView,
      ['modal:modal-header'],
      registry,
    );

    registry.screenPendingHeaderConfigUpdates['modal:modal-header'] = true;
    expect(
      __nativeScriptNestedModalStackCanSkipPresentationRefreshForTests(
        navigationController,
        stackView,
        modalController,
        modalView,
        ['modal:modal-header'],
        registry,
      ),
    ).toBe(false);
    registry.screenPendingHeaderConfigUpdates['modal:modal-header'] = false;

    expect(
      __nativeScriptNestedModalStackCanSkipPresentationRefreshForTests(
        navigationController,
        stackView,
        modalController,
        modalView,
        ['different'],
        registry,
      ),
    ).toBe(false);
  });

  it('does not synthesize modal dismissal from transient header off-window during presentation', () => {
    const presentedController: any = {};
    const modalController: any = {};
    const registry: any = {
      stackTransitionClosing: {
        parent: false,
      },
      stackTransitionScreenIds: {},
      stackUpdatingModals: {
        parent: true,
      },
    };

    expect(
      __nativeScriptDetachedModalHeaderCanCompleteDismissalForTests(
        'parent',
        'modal',
        registry,
        presentedController,
        modalController,
      ),
    ).toBe(false);

    registry.stackTransitionClosing.parent = true;
    registry.stackTransitionScreenIds.parent = 'modal';

    expect(
      __nativeScriptDetachedModalHeaderCanCompleteDismissalForTests(
        'parent',
        'modal',
        registry,
        presentedController,
        modalController,
      ),
    ).toBe(true);

    registry.stackTransitionClosing.parent = false;
    registry.stackUpdatingModals.parent = false;
    presentedController.isBeingDismissed = true;

    expect(
      __nativeScriptDetachedModalHeaderCanCompleteDismissalForTests(
        'parent',
        'modal',
        registry,
        presentedController,
        modalController,
      ),
    ).toBe(true);
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

  it('keeps route body repair out of RNSScreenStackView hit testing', () => {
    const stackHitTestStart = stackSource.indexOf(
      'function screenStackNativeScriptViewHitTestWithEvent',
    );
    const stackHitTestSource = stackSource.slice(
      stackHitTestStart,
      stackSource.indexOf(
        'function retainGestureRecognizerDelegate',
        stackHitTestStart,
      ),
    );

    expect(stackHitTestSource).toContain('hitTestHeaderSubviewForPoint(');
    expect(stackHitTestSource).not.toContain(
      'hitTestVisibleStackContentForPoint',
    );
    expect(stackHitTestSource).not.toContain(
      'restoreVisibleNavigationControllerInteractivity',
    );
    expect(stackSource).not.toContain(
      'function hitTestVisibleStackContentForPoint',
    );
  });

  it('passes through stale plain host shells while hit-testing visible descendants', () => {
    const buttonView: any = {
      accessibilityLabel: 'Pop React Navigation detail',
      alpha: 1,
      frame: { origin: { x: 18, y: 583 }, size: { width: 366, height: 50 } },
      hidden: false,
      hitTestWithEvent: jest.fn(function hitTest() {
        return buttonView;
      }),
      subviews: [],
      userInteractionEnabled: true,
      window: {},
    };
    const staleShell: any = {
      alpha: 1,
      frame: { origin: { x: 150, y: 400 }, size: { width: 130, height: 390 } },
      hidden: false,
      hitTestWithEvent: jest.fn(function hitTest() {
        return staleShell;
      }),
      subviews: [],
      userInteractionEnabled: true,
      window: buttonView.window,
    };
    const rootView: any = {
      alpha: 1,
      frame: { origin: { x: 0, y: 0 }, size: { width: 402, height: 874 } },
      hidden: false,
      subviews: [buttonView, staleShell],
      userInteractionEnabled: true,
      window: buttonView.window,
    };
    buttonView.superview = rootView;
    staleShell.superview = rootView;

    expect(
      __nativeScriptHitTestVisibleDescendantForTests(
        rootView,
        { x: 201, y: 608 },
        {},
      ),
    ).toBe(buttonView);
    expect(staleShell.hitTestWithEvent).toHaveBeenCalled();
    expect(buttonView.hitTestWithEvent).toHaveBeenCalled();
  });

  it('routes RNSScreenNativeScriptView hit testing through content wrapper descendants', () => {
    const previousRegistry = (global as Record<string, unknown>)
      .__rnsNativeScriptStackRegistry;
    const window = {};
    const screenView: any = {
      __rnsNativeScriptScreenView: true,
      accessibilityIdentifier: 'detail',
      alpha: 1,
      convertPointToView: jest.fn(point => point),
      hidden: false,
      userInteractionEnabled: true,
      window,
    };
    const controller: any = {
      __nativeScriptScreenId: 'detail',
      view: screenView,
    };
    screenView.__nativeScriptOwningViewController = controller;
    const pressableView: any = {
      accessibilityLabel: 'Pop Detail',
      alpha: 1,
      hidden: false,
      hitTestWithEvent: jest.fn(function hitTest() {
        return pressableView;
      }),
      subviews: [],
      userInteractionEnabled: true,
      window,
    };
    const contentWrapperView: any = {
      __rnsNativeScriptScreenContentWrapperRootView: true,
      alpha: 1,
      convertPointFromView: jest.fn(point => point),
      hidden: false,
      hitTestWithEvent: jest.fn(function hitTest() {
        return contentWrapperView;
      }),
      subviews: [pressableView],
      userInteractionEnabled: true,
      window,
    };
    contentWrapperView.superview = screenView;
    pressableView.superview = contentWrapperView;
    (global as Record<string, unknown>).__rnsNativeScriptStackRegistry = {
      screenContentWrapperViews: { detail: contentWrapperView },
      screenContentWrapperHostHandles: {},
      screenControllerHashes: {},
      screens: { detail: controller },
    };

    expect(
      __nativeScriptScreenViewContentWrapperHitTestForTests(
        screenView,
        { x: 201, y: 575 },
        {},
      ),
    ).toBe(pressableView);
    expect(contentWrapperView.hitTestWithEvent).toHaveBeenCalled();
    expect(pressableView.hitTestWithEvent).toHaveBeenCalled();
    expect(stackSource).toContain('function screenViewContentWrapperHitTest');
    expect(stackSource).toContain('screenViewContentWrapperHitTest(');
    expect(stackSource).toContain('liveScreenContentWrapperViewFromRegistry');
    expect(stackSource).toContain('screen-hit-content-wrapper-descendant');

    if (previousRegistry === undefined) {
      delete (global as Record<string, unknown>).__rnsNativeScriptStackRegistry;
    } else {
      (global as Record<string, unknown>).__rnsNativeScriptStackRegistry =
        previousRegistry;
    }
  });

  it('ports RNSScreenStack presented-modal common-root bookkeeping', () => {
    const reconcileModalSource = stackSource.slice(
      stackSource.indexOf('function reconcilePresentedModalStack'),
      stackSource.indexOf('function screenIdFromStackChild'),
    );
    const setModalSource = stackSource.slice(
      stackSource.indexOf('function setModalViewControllers'),
      stackSource.indexOf('function reconcilePresentedModalStack'),
    );

    expect(stackSource).toContain('stackPresentedModalKeys');
    expect(stackSource).toContain('stackModalIsolationViews');
    expect(stackSource).toContain('function presentedModalIdsForStack');
    expect(stackSource).toContain('function setPresentedModalIdsForStack');
    expect(stackSource).toContain(
      'function syncModalPresentationIsolationForStack',
    );
    expect(stackSource).toContain(
      'MODAL_PRESENTATION_ISOLATION_ASSOCIATION_KEY',
    );
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
    expect(setModalSource).toContain('setPresentedModalIdsForStack(');
    expect(stackSource).toContain(
      'syncModalPresentationIsolationForStack(stackId, registry, modalIds);',
    );
    expect(stackSource).toContain('view.accessibilityElementsHidden = true;');
  });

  it('commits stack native keys only after modal UIKit transactions complete', () => {
    const completeModalSource = stackSource.slice(
      stackSource.indexOf('function completeModalTransitionTransaction'),
      stackSource.indexOf(
        'function completeNativePresentedModalDismissalForController',
      ),
    );
    const reconcileModalSource = stackSource.slice(
      stackSource.indexOf('function reconcilePresentedModalStack'),
      stackSource.indexOf('function screenIdFromStackChild'),
    );
    const reconcileSource = stackSource.slice(
      stackSource.indexOf('function reconcileStack'),
      stackSource.indexOf(
        'function refreshVisibleStackContentFromExternalHost',
      ),
    );
    const stackCanReconcileSource = stackSource.slice(
      stackSource.indexOf('function stackCanReconcileFromPropsUpdate'),
      stackSource.indexOf(
        'function reconcileParentStackAfterScreenRegistration',
      ),
    );
    const setModalSource = stackSource.slice(
      stackSource.indexOf('function setModalViewControllers'),
      stackSource.indexOf('function reconcilePresentedModalStack'),
    );

    expect(stackSource).toContain(
      "type NativeScriptModalUpdateResult = 'blocked' | 'completed' | 'pending'",
    );
    expect(completeModalSource).toContain(
      'applyStackNativeState(stackId, registry, nativeState);',
    );
    expect(setModalSource).toMatch(
      /completeModalTransitionTransaction\(\s*stackId,\s*registry,\s*ctx,\s*false,\s*nextScreenId,\s*nativeState,\s*\);/,
    );
    expect(reconcileModalSource).toContain(
      "if (modalUpdateResult === 'completed')",
    );
    expect(reconcileModalSource).toContain(
      "return modalUpdateResult !== 'blocked';",
    );
    expect(reconcileModalSource).not.toContain('const didUpdateModals');
    expect(reconcileModalSource).not.toContain(
      'registry.stackNativeKeys[stackId] = idsKey(availableIds);',
    );
    expect(reconcileSource).toContain(
      "if (modalUpdateResult === 'completed' && didChange)",
    );
    expect(reconcileSource).toContain(
      'const modalIndex = firstModalIndex(availableIds, registry);',
    );
    expect(reconcileSource).not.toContain('readinessScreenIds');
    expect(reconcileSource).not.toContain(
      '!stackTopScreenCanStartNativeUpdate(',
    );
    expect(stackCanReconcileSource).not.toContain(
      'const modalIndex = firstModalIndex(activeScreenIds, registry);',
    );
    expect(stackCanReconcileSource).not.toContain('allowControllerHostStart');
    expect(stackCanReconcileSource).not.toContain(
      '!stackTopScreenCanStartNativeUpdate(',
    );
  });

  it('emits modal transition start at the UIKit transaction boundary', () => {
    const setModalSource = stackSource.slice(
      stackSource.indexOf('function setModalViewControllers'),
      stackSource.indexOf('function reconcilePresentedModalStack'),
    );
    const silentMarkIndex = setModalSource.indexOf(
      'markTransition(\n' +
        '    stackId,\n' +
        '    registry,\n' +
        '    ctx,\n' +
        '    closing,\n' +
        '    transitionScreenId,\n' +
        '    false,\n' +
        '    true,\n' +
        '    false,\n' +
        '  );',
    );
    const configureIndex = setModalSource.indexOf(
      'configurePresentedModalControllers(controllerIds, registry);',
    );
    const presentLifecycleStartIndex = setModalSource.indexOf(
      'beginModalScreenAppearanceTransition(nextController, shouldAnimate);',
    );
    const presentStartIndex = setModalSource.indexOf(
      'emitTransition(',
      presentLifecycleStartIndex,
    );
    const presentCallIndex = setModalSource.indexOf(
      'invokeNativeSelector(\n' +
        '        previousController,\n' +
        "        'presentViewControllerAnimatedCompletion',",
      presentStartIndex,
    );
    const presentModelCommitIndex = setModalSource.indexOf(
      'setPresentedModalIdsForStack(\n' +
        '        stackId,\n' +
        '        registry,\n' +
        '        controllerIds.slice(0, index + 1),\n' +
        '      );',
      presentStartIndex,
    );
    const ownedDismissLifecycleStartIndex = setModalSource.indexOf(
      'beginModalScreenDismissalTransition(',
      setModalSource.indexOf('firstModalToBeDismissed'),
    );
    const ownedDismissStartIndex = setModalSource.indexOf(
      'emitTransition(',
      ownedDismissLifecycleStartIndex,
    );
    const ownedDismissCallIndex = setModalSource.indexOf(
      'invokeNativeSelector(\n' +
        '            changeRootController,\n' +
        "            'dismissViewControllerAnimatedCompletion',",
      ownedDismissStartIndex,
    );

    expect(silentMarkIndex).toBeGreaterThan(-1);
    expect(configureIndex).toBeGreaterThan(silentMarkIndex);
    expect(presentLifecycleStartIndex).toBeGreaterThan(-1);
    expect(presentStartIndex).toBeGreaterThan(-1);
    expect(presentStartIndex).toBeGreaterThan(presentLifecycleStartIndex);
    expect(setModalSource.slice(presentStartIndex, presentCallIndex)).toContain(
      'nextScreenId',
    );
    expect(presentModelCommitIndex).toBeGreaterThan(presentStartIndex);
    expect(presentCallIndex).toBeGreaterThan(presentModelCommitIndex);
    expect(presentCallIndex).toBeGreaterThan(presentStartIndex);
    expect(ownedDismissLifecycleStartIndex).toBeGreaterThan(-1);
    expect(ownedDismissStartIndex).toBeGreaterThan(-1);
    expect(ownedDismissStartIndex).toBeGreaterThan(
      ownedDismissLifecycleStartIndex,
    );
    expect(
      setModalSource.slice(ownedDismissStartIndex, ownedDismissCallIndex),
    ).toContain('transitionScreenId');
    expect(ownedDismissCallIndex).toBeGreaterThan(ownedDismissStartIndex);
  });

  it('prelayouts modal presentation content before UIKit present call', () => {
    const prelayoutSource = stackSource.slice(
      stackSource.indexOf('function prelayoutPresentedModalForPresentation'),
      stackSource.indexOf('function presentationControllerForModalScreen'),
    );
    const predictedBoundsSource = stackSource.slice(
      stackSource.indexOf(
        'function predictedPresentedModalBoundsBeforePresentation',
      ),
      stackSource.indexOf('function prelayoutPresentedModalForPresentation'),
    );
    const setModalSource = stackSource.slice(
      stackSource.indexOf('function setModalViewControllers'),
      stackSource.indexOf('function reconcilePresentedModalStack'),
    );
    const prelayoutCallIndex = setModalSource.indexOf(
      'prelayoutPresentedModalForPresentation(',
    );
    const preflightIndex = setModalSource.indexOf(
      'preparePresentedModalContentBeforePresentation(',
    );
    const presentCallIndex = setModalSource.indexOf(
      'invokeNativeSelector(\n' +
        '        previousController,\n' +
        "        'presentViewControllerAnimatedCompletion',",
    );

    expect(predictedBoundsSource).toContain('firstPositiveRect(');
    expect(predictedBoundsSource).toContain(
      "presentation !== 'modal' && presentation !== 'pageSheet'",
    );
    expect(predictedBoundsSource).toContain(
      'presenterController?.view?.safeAreaInsets?.top',
    );
    expect(predictedBoundsSource).toContain('height - topInset');
    expect(prelayoutSource).toContain(
      'predictedPresentedModalBoundsBeforePresentation(',
    );
    expect(prelayoutSource).toContain('setViewFrameIfNeeded(modalView');
    expect(prelayoutSource).toContain(
      'layoutNestedNavigationControllerInParentView(',
    );
    expect(prelayoutSource).toContain('modal-prelayout-presentation');
    expect(prelayoutCallIndex).toBeGreaterThan(-1);
    expect(preflightIndex).toBeGreaterThan(prelayoutCallIndex);
    expect(presentCallIndex).toBeGreaterThan(preflightIndex);
  });

  it('routes native modal dismiss completion through the shared transition finisher', () => {
    const nativeDismissSource = stackSource.slice(
      stackSource.indexOf(
        'function completeNativePresentedModalDismissalForController',
      ),
      stackSource.indexOf('function viewControllerCanPresentModal'),
    );

    expect(nativeDismissSource).toContain('const hasActiveTransition =');
    expect(nativeDismissSource).toContain(
      'markTransition(stackId, registry, ctx, true, screenId, true, false, true);',
    );
    expect(nativeDismissSource).toContain(
      'finishModalScreenDismissalTransition(controller, true);',
    );
    expect(nativeDismissSource).toContain(
      'finishTransition(stackId, registry, ctx, true, screenId);',
    );
    expect(nativeDismissSource).toContain(
      'restoreVisibleBaseStackAfterModalDismissal(stackId, registry);',
    );
    expect(nativeDismissSource).not.toContain(
      "emitTransition(ctx, 'end', true, screenId, false, true, false);",
    );
  });

  it('skips redundant UIKit modal dismissal after native interactive dismissal already completed', () => {
    const alreadyCompletedDismissSource = stackSource.slice(
      stackSource.indexOf(
        'function completeAlreadyNativeDismissedPresentedModalIfStable',
      ),
      stackSource.indexOf('function screenIdFromStackChild'),
    );
    const reconcileSource = stackSource.slice(
      stackSource.indexOf('function reconcileStack'),
      stackSource.indexOf(
        'function refreshVisibleStackContentFromExternalHost',
      ),
    );

    expect(alreadyCompletedDismissSource).toContain(
      'presentedModalDismissalCompleted(',
    );
    expect(alreadyCompletedDismissSource).toContain(
      'navigationControllerScreenIds(navigationController, registry)',
    );
    expect(alreadyCompletedDismissSource).toContain(
      'if (!idsEqual(nativeIds, availableIds))',
    );
    expect(alreadyCompletedDismissSource).toContain(
      'modal-native-dismissal-already-completed',
    );
    expect(alreadyCompletedDismissSource).toContain(
      'setPresentedModalIdsForStack(stackId, registry, []);',
    );
    expect(alreadyCompletedDismissSource).toContain(
      'restoreVisibleBaseStackAfterModalDismissal(stackId, registry);',
    );
    expect(reconcileSource).toContain(
      'completeAlreadyNativeDismissedPresentedModalIfStable(',
    );
    expect(reconcileSource).toContain(
      'reconcile-stack-after-native-modal-dismissal-complete',
    );
  });

  it('lets UIKit own modal screen lifecycle and keeps synthetic fallbacks', () => {
    const lifecycleSource = stackSource.slice(
      stackSource.indexOf('function beginModalScreenAppearanceTransition'),
      stackSource.indexOf('function nativeScriptScreenControllerClass'),
    );
    const controllerClassSource = stackSource.slice(
      stackSource.indexOf('class RNSScreenNativeScriptController'),
      stackSource.indexOf('function configureModalScreenController'),
    );
    const setModalSource = stackSource.slice(
      stackSource.indexOf('function setModalViewControllers'),
      stackSource.indexOf('function reconcilePresentedModalStack'),
    );
    const nativeDismissSource = stackSource.slice(
      stackSource.indexOf(
        'function completeNativePresentedModalDismissalForController',
      ),
      stackSource.indexOf('function viewControllerCanPresentModal'),
    );

    expect(lifecycleSource).toContain(
      'runScreenControllerViewWillAppear(controller, animated, false, true);',
    );
    expect(lifecycleSource).toContain(
      'runScreenControllerViewDidAppear(controller, animated, false, true);',
    );
    expect(lifecycleSource).toContain(
      'runScreenControllerViewWillDisappear(controller, animated, false, false);',
    );
    expect(lifecycleSource).toContain('didReceiveWillAppear');
    expect(lifecycleSource).toContain('didReceiveDidAppear');
    expect(lifecycleSource).toContain('didReceiveWillDisappear');
    expect(lifecycleSource).toContain('didReceiveDidDisappear');
    expect(lifecycleSource).toContain(
      'controller.__nativeScriptModalAppearanceStartedAt = lifecycleTimestamp();',
    );
    expect(lifecycleSource).toContain(
      'controller.__nativeScriptModalDismissalStartedAt = lifecycleTimestamp();',
    );
    expect(lifecycleSource).not.toContain(
      'controller.__nativeScriptSuppressNextViewWillAppear = true;',
    );
    expect(lifecycleSource).not.toContain(
      'controller.__nativeScriptSuppressNextViewDidAppear = true;',
    );
    expect(lifecycleSource).not.toContain(
      'controller.__nativeScriptSuppressNextViewWillDisappear = true;',
    );
    expect(lifecycleSource).not.toContain(
      'controller.__nativeScriptSuppressNextViewDidDisappear = true;',
    );
    expect(controllerClassSource).toContain(
      'this.__nativeScriptSuppressNextViewWillAppear === true',
    );
    expect(controllerClassSource).toContain(
      'this.__nativeScriptSuppressNextViewDidAppear === true',
    );
    expect(controllerClassSource).toContain(
      'this.__nativeScriptSuppressNextViewWillDisappear === true',
    );
    expect(controllerClassSource).toContain(
      'this.__nativeScriptSuppressNextViewDidDisappear === true',
    );
    expect(setModalSource).toContain(
      'beginModalScreenAppearanceTransition(nextController, shouldAnimate);',
    );
    expect(setModalSource).toContain(
      'finishModalScreenAppearanceTransition(nextController, shouldAnimate);',
    );
    expect(setModalSource).not.toContain(
      'beginModalScreenDismissalTransition(presentedController, animated);',
    );
    expect(setModalSource).not.toContain(
      'finishModalScreenDismissalTransition(presentedController, animated);',
    );
    const ownedDismissControllerIndex = setModalSource.indexOf(
      'firstModalToBeDismissed',
    );
    const ownedDismissLifecycleStartIndex = setModalSource.indexOf(
      'beginModalScreenDismissalTransition(',
      ownedDismissControllerIndex,
    );
    expect(ownedDismissLifecycleStartIndex).toBeGreaterThan(
      ownedDismissControllerIndex,
    );
    expect(
      setModalSource.slice(
        ownedDismissLifecycleStartIndex,
        ownedDismissLifecycleStartIndex + 200,
      ),
    ).toContain('shouldAnimateDismiss');
    expect(nativeDismissSource).toContain(
      'finishModalScreenDismissalTransition(controller, true);',
    );
  });

  it('cleans UIKit modal presentation artifacts on programmatic dismiss completion', () => {
    const setModalSource = stackSource.slice(
      stackSource.indexOf('function setModalViewControllers'),
      stackSource.indexOf('function reconcilePresentedModalStack'),
    );
    const clearAllDismissIndex = setModalSource.indexOf(
      'cleanupDismissedModalPresentationArtifacts(dismissedController);',
    );
    const clearAllCompleteIndex = setModalSource.indexOf(
      'finish();',
      clearAllDismissIndex,
    );

    expect(clearAllDismissIndex).toBeGreaterThan(-1);
    expect(clearAllCompleteIndex).toBeGreaterThan(clearAllDismissIndex);
    expect(setModalSource).toContain(
      'const finishDismissedModalTransition = (dismissedController: any) => {',
    );
    expect(setModalSource).toContain(
      'cleanupDismissedModalPresentationArtifacts(dismissedController);',
    );
    expect(setModalSource).not.toContain(
      'markModalDismissalRequestedFromJS(presentedController);',
    );
    expect(setModalSource).toContain(
      'markModalDismissalRequestedFromJS(firstModalToBeDismissed);',
    );
    expect(setModalSource).toContain(
      'markModalDismissalRequestedFromJS(changeRootController);',
    );
    expect(setModalSource).toContain(
      'clearModalDismissalRequestedFromJS(dismissedController);',
    );
    expect(setModalSource).not.toContain(
      'clearModalDismissalRequestedFromJS(presentedController);',
    );
    expect(setModalSource).toContain(
      'finishDismissedModalTransition(firstModalToBeDismissed);',
    );
    expect(setModalSource).toContain(
      'finishDismissedModalTransition(changeRootController);',
    );
    expect(setModalSource).toContain(
      'invokeNativeSelector(\n' +
        '          changeRootController,\n' +
        "          'dismissViewControllerAnimatedCompletion',\n" +
        "          'dismissViewControllerAnimated:completion:',\n" +
        '          animated,\n' +
        '          dismissalCompletionBlock,\n' +
        '        );',
    );
    expect(setModalSource).toContain(
      'invokeNativeSelector(\n' +
        '            changeRootController,\n' +
        "            'dismissViewControllerAnimatedCompletion',\n" +
        "            'dismissViewControllerAnimated:completion:',\n" +
        '            shouldAnimateDismiss,\n' +
        '            dismissalCompletionBlock,\n' +
        '          );',
    );
    expect(setModalSource).toContain(
      'runAfterTransitionCoordinator(firstModalToBeDismissed, () => {',
    );
  });

  it('treats presentation delegate didDismiss as completion for JS-requested modal dismissal', () => {
    const delegateDismissSource = stackSource.slice(
      stackSource.indexOf(
        'function completeJsRequestedModalDismissalFromDelegate',
      ),
      stackSource.indexOf(
        'function completeNativePresentedModalDismissalForController',
      ),
    );
    const completeDismissalSource = stackSource.slice(
      stackSource.indexOf('function completePresentedModalDismissalIfNeeded'),
      stackSource.indexOf(
        'function completePresentedModalDismissalForDetachedStackIfNeeded',
      ),
    );

    expect(delegateDismissSource).toContain(
      'presentedModalDismissalCompleted(\n' +
        '      controller,\n' +
        '      dismissedModalScreenId,\n' +
        '      registry,\n' +
        '    )',
    );
    expect(delegateDismissSource).toContain(
      'markPresentedModalDismissalCompleted(',
    );
    expect(
      delegateDismissSource.indexOf('markPresentedModalDismissalCompleted('),
    ).toBeLessThan(
      delegateDismissSource.indexOf(
        'cleanupDismissedModalPresentationArtifacts(',
      ),
    );
    expect(
      delegateDismissSource.indexOf('markPresentedModalDismissalCompleted('),
    ).toBeLessThan(
      delegateDismissSource.indexOf(
        'finishModalScreenDismissalTransition(controller, true);',
      ),
    );
    expect(delegateDismissSource).toContain(
      'clearModalDismissalRequestedFromJS(controller);',
    );
    expect(delegateDismissSource).toContain(
      'finishModalScreenDismissalTransition(controller, true);',
    );
    expect(delegateDismissSource).toContain(
      'completeModalTransitionTransaction(',
    );
    expect(completeDismissalSource).toContain(
      'const completeJsRequestedDismissal = (globalThis as Record<string, any>)[\n' +
        '      COMPLETE_JS_REQUESTED_PRESENTED_MODAL_DISMISSAL_KEY\n' +
        '    ];',
    );
    expect(completeDismissalSource).toContain(
      'return completeJsRequestedDismissal(',
    );
  });

  it('does not accept stale presented modal ids without a matching UIKit chain', () => {
    const setModalSource = stackSource.slice(
      stackSource.indexOf('function setModalViewControllers'),
      stackSource.indexOf('function reconcilePresentedModalStack'),
    );

    expect(stackSource).toContain('function presentedModalChainMatchesIds');
    expect(stackSource).toContain(
      'function presentedModalControllerHasWindowAttachedView',
    );
    expect(
      __nativeScriptPresentedModalControllerHasWindowAttachedViewForTests({
        __nativeScriptScreenView: { window: null },
        view: { window: null },
      }),
    ).toBe(false);
    expect(
      __nativeScriptPresentedModalControllerHasWindowAttachedViewForTests({
        __nativeScriptScreenView: { window: { id: 'window' } },
        view: { window: null },
      }),
    ).toBe(true);
    expect(
      __nativeScriptPresentedModalControllerHasWindowAttachedViewForTests({
        presentationController: {
          presentedView: { window: { id: 'presentation-window' } },
        },
        view: { window: null },
      }),
    ).toBe(true);
    expect(stackSource).toContain(
      'const presentedScreenId = presentedController\n' +
        '      ? screenIdForController(presentedController, registry) ??\n' +
        '        controllerScreenId(presentedController)\n' +
        '      : undefined;',
    );
    expect(stackSource).toContain('const expectedMatches =');
    expect(stackSource).toContain('modal-chain-mismatch');
    const chainMatchSource = stackSource.slice(
      stackSource.indexOf(
        'function presentedModalChainMatchesIdsFromController',
      ),
      stackSource.indexOf('function presentedModalScreenIdForController'),
    );
    const detachedTraceSource = chainMatchSource.slice(
      chainMatchSource.indexOf("'modal-chain-detached'"),
      chainMatchSource.indexOf(
        'currentPresenter = presentedController;',
        chainMatchSource.indexOf("'modal-chain-detached'"),
      ),
    );
    expect(chainMatchSource).toContain('modal-chain-detached');
    expect(detachedTraceSource).not.toContain('return false;');
    expect(setModalSource).toContain(
      'if (presentedModalChainMatchesIds(stackId, registry, controllerIds))',
    );
    expect(stackSource).toContain(
      'function presenterHasStackOwnedPresentedModal',
    );
    expect(stackSource).toContain('modal-chain-owned-presented');
    expect(setModalSource).not.toContain(
      'setPresentedModalIdsForStack(stackId, registry, []);',
    );
    expect(setModalSource).toContain(
      'markModalPresentationBlocked(stackId, registry, controllerIds);',
    );
    expect(setModalSource).toContain("return 'blocked';");
  });

  it('reconciles the parent stack from active screen registration once controllers are complete', () => {
    const parentReconcileSource = stackSource.slice(
      stackSource.indexOf(
        'function reconcileParentStackAfterScreenRegistration',
      ),
      stackSource.indexOf('function registerNativeScriptStackController'),
    );
    const screenDefinitionSource = stackSource.slice(
      stackSource.indexOf('const NativeScriptScreenController'),
      stackSource.indexOf('function containerScreenParticipatesInUIKitModel'),
    );

    expect(parentReconcileSource).toContain(
      'registry.containerContexts[parentId]',
    );
    expect(parentReconcileSource).toContain(
      '!screenIdInList(props.screenId, activeIds)',
    );
    expect(parentReconcileSource).toContain(
      'registry.stackPendingReconcileKeys[parentId] = activeKey;',
    );
    expect(parentReconcileSource).toContain(
      'registry.stackTransitioning[parentId] !== true',
    );
    expect(parentReconcileSource).toContain(
      'registry.stackUpdatingModals[parentId] !== true',
    );
    expect(parentReconcileSource).toContain(
      'stackCanReconcileFromPropsUpdate(parentId, registry, activeIds)',
    );
    expect(parentReconcileSource).toContain(
      'screen-host-parent-stack-reconcile',
    );
    expect(parentReconcileSource).toContain(
      'screen-host-parent-stack-defer-owner-transaction',
    );
    expect(parentReconcileSource).not.toContain('scheduledReconcileStack(');
    expect(parentReconcileSource).toContain('reconcileStack(');
    expect(screenDefinitionSource).toContain(
      'reconcileParentStackAfterScreenRegistration(props, registry);',
    );
    expect(
      screenDefinitionSource.match(
        /reconcileParentStackAfterScreenRegistration\(props, registry\);/g,
      )?.length,
    ).toBeGreaterThanOrEqual(3);
  });

  it('separates modal shell presentation readiness from nested modal content readiness', () => {
    const modalController = { view: {} };
    const nestedNavigationController = {
      __nativeScriptStackContainerView: {},
      view: {},
    };
    const nestedContentView = {};
    const nestedContentWrapper = { superview: nestedContentView };
    const nestedContentController = { view: nestedContentView };
    const registry: any = {
      screenContentReady: {},
      screenHostHandles: {
        modal: 'remembered-placeholder-host',
      },
      screenHostReadyHandles: {
        modal: 'modal-host-ready',
      },
      screenContentWrapperHostHandles: {},
      screenContentWrapperViews: {
        'modal:modal-header': nestedContentWrapper,
      },
      screenParents: {
        modal: 'root-stack',
        'modal:modal-header': 'nested-stack',
      },
      screenProps: {
        modal: { stackPresentation: 'modal' },
        'modal:modal-header': {},
      },
      screens: {
        modal: modalController,
        'modal:modal-header': nestedContentController,
      },
      stackActiveScreenIds: {
        'nested-stack': ['modal:modal-header'],
      },
      stackContainerHandles: {},
      stackContainerViews: {},
      stacks: {
        'nested-stack': nestedNavigationController,
      },
    };

    expect(
      __nativeScriptPresentedModalContentCanStartPresentationForTests(
        'modal',
        registry,
      ),
    ).toBe(true);
    expect(
      __nativeScriptPresentedModalScreenCanStartPresentationForTests(
        'modal',
        registry,
      ),
    ).toBe(true);

    registry.screenHostReadyHandles.modal = undefined;

    expect(
      __nativeScriptPresentedModalContentCanStartPresentationForTests(
        'modal',
        registry,
      ),
    ).toBe(true);
    expect(
      __nativeScriptPresentedModalScreenCanStartPresentationForTests(
        'modal',
        registry,
      ),
    ).toBe(true);

    delete registry.screens['modal:modal-header'];
    delete registry.screenParents['modal:modal-header'];
    registry.stackActiveScreenIds = {};

    expect(
      __nativeScriptPresentedModalContentCanStartPresentationForTests(
        'modal',
        registry,
      ),
    ).toBe(false);

    registry.screens['modal:modal-header'] = nestedContentController;
    registry.screenParents['modal:modal-header'] = 'nested-stack';
    registry.stackActiveScreenIds = {
      'nested-stack': ['modal:modal-header'],
    };

    registry.screenHostReadyHandles.modal = 'modal-host-ready';
    registry.screenContentWrapperViews['modal:modal-header'] = undefined;

    expect(
      __nativeScriptPresentedModalContentCanStartPresentationForTests(
        'modal',
        registry,
      ),
    ).toBe(false);
    expect(
      __nativeScriptPresentedModalScreenCanStartPresentationForTests(
        'modal',
        registry,
      ),
    ).toBe(true);

    registry.screens.modal.view = undefined;

    expect(
      __nativeScriptPresentedModalScreenCanStartPresentationForTests(
        'modal',
        registry,
      ),
    ).toBe(false);
  });

  it('keeps modal route host repair active when nested modal content is prepared', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const globalObject = global as Record<string, any>;
    const previousRegistry = globalObject.__rnsNativeScriptStackRegistry;
    const previousRefreshPresentedModal =
      globalObject.__rnsNativeScriptRefreshPresentedModalContentAfterPresentation;
    const previousReconcileStackFromExternalHost =
      globalObject.__rnsNativeScriptReconcileStackFromExternalHost;
    const previousNativeObjectFromHandle = (NativeScriptRuntime as any)
      .nativeObjectFromHandle;
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostView;
    const previousRefreshUIKitHostViewDirectOwner =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const refreshUIKitHostView = jest.fn(() => true);
    const refreshPresentedModal = jest.fn();
    const reconcileStackFromExternalHost = jest.fn();
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };
    const hostedLeaf: any = {
      alpha: 1,
      description: 'RCTViewComponentView',
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
      window: {},
    };
    const modalView: any = {
      __rnsNativeScriptScreenView: true,
      bounds: frame,
      frame,
      hash: 'modal-host',
      hidden: false,
      layoutIfNeeded: jest.fn(),
      refreshSurfaceTouchHandler: jest.fn(),
      setNeedsLayout: jest.fn(),
      subviews: [],
      userInteractionEnabled: true,
      window: {},
    };
    const nestedScreenView: any = {
      __rnsNativeScriptScreenView: true,
      bounds: frame,
      frame,
      hash: 'nested-screen-host',
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
      window: {},
    };
    const nestedContentWrapperView: any = {
      alpha: 1,
      bounds: frame,
      description: 'RNSScreenContentWrapper.NativeScript',
      frame,
      hash: 'nested-wrapper-host',
      hidden: false,
      subviews: [hostedLeaf],
      superview: nestedScreenView,
      userInteractionEnabled: true,
      window: {},
    };
    const modalController: any = {
      __nativeScriptScreenId: 'modal',
      __nativeScriptScreenView: modalView,
      view: modalView,
    };
    const nestedController: any = {
      __nativeScriptScreenId: 'modal:modal-header',
      __nativeScriptScreenView: nestedScreenView,
      view: nestedScreenView,
    };
    const registry: any = {
      screenContentReady: { 'modal:modal-header': true },
      screenContentWrapperHostHandles: {},
      screenContentWrapperViews: {
        'modal:modal-header': nestedContentWrapperView,
      },
      screenContentWrapperVisibleDescendantCounts: {
        'modal:modal-header': 1,
      },
      screenHostHandles: {
        modal: 'modal-host',
        'modal:modal-header': 'nested-screen-host',
      },
      screenHostRefreshKeys: {},
      screenParents: {
        modal: 'root-stack',
        'modal:modal-header': 'nested-stack',
      },
      screenProps: {
        modal: { screenId: 'modal', stackPresentation: 'modal' },
        'modal:modal-header': { screenId: 'modal:modal-header' },
      },
      screens: {
        modal: modalController,
        'modal:modal-header': nestedController,
      },
      stackActiveScreenIds: {
        'root-stack': ['home', 'modal'],
        'nested-stack': ['modal:modal-header'],
      },
      stackContexts: {
        'root-stack': {},
      },
      stacks: {
        'root-stack': {
          view: { bounds: frame, frame, window: {} },
          viewControllers: [{ __nativeScriptScreenId: 'home' }],
        },
      },
    };

    nestedScreenView.subviews = [nestedContentWrapperView];
    nestedScreenView.superview = modalView;
    modalView.subviews = [nestedScreenView];
    globalObject.__rnsNativeScriptStackRegistry = registry;
    globalObject.__rnsNativeScriptRefreshPresentedModalContentAfterPresentation =
      refreshPresentedModal;
    globalObject.__rnsNativeScriptReconcileStackFromExternalHost =
      reconcileStackFromExternalHost;
    NativeScriptRuntime.refreshUIKitHostView = refreshUIKitHostView;
    NativeScriptRuntime.refreshUIKitHostViewDirectOwner = refreshUIKitHostView;
    (NativeScriptRuntime as any).nativeObjectFromHandle = jest.fn(
      (handle: string) => {
        if (handle === 'modal-host') {
          return modalView;
        }
        return null;
      },
    );

    try {
      expect(
        __nativeScriptModalScreenHasPreparedNestedContentForTests(
          'modal',
          registry,
        ),
      ).toBe(true);
      expect(
        __nativeScriptScreenHostedViewNeedsRefreshForTests(
          modalController,
          'modal',
          registry,
          modalView,
          true,
        ),
      ).toBe(true);

      expect(registry.screenContentReady.modal).toBeUndefined();

      __nativeScriptLayoutScreenHostedReactSubviewsForTests(
        modalController,
        modalView,
        registry,
        'modal',
        true,
        true,
      );
      expect(
        __nativeScriptRefreshScreenContentReadyForTests(
          'modal',
          modalController,
          registry,
          true,
        ),
      ).toBe(true);

      expect(refreshUIKitHostView).toHaveBeenCalled();
      expect(registry.screenContentReady.modal).toBe(true);
      expect(registry.screenHostRefreshKeys.modal).toContain('ready');

      registry.screenContentReady.modal = undefined;
      registry.screenHostHandles.modal = undefined;

      expect(
        __nativeScriptScreenHostReadyOnUIForTests(
          'modal',
          'root-stack',
          'modal-host',
        ),
      ).toBe(true);

      expect(registry.screenContentReady.modal).toBe(true);
      expect(refreshPresentedModal).not.toHaveBeenCalled();
      expect(reconcileStackFromExternalHost).not.toHaveBeenCalled();

      registry.screenContentReady.modal = undefined;
      registry.screenContentReady['modal:modal-header'] = undefined;
      registry.screenHostHandles.modal = undefined;
      refreshPresentedModal.mockClear();
      reconcileStackFromExternalHost.mockClear();

      expect(
        __nativeScriptModalScreenHasPreparedNestedContentForTests(
          'modal',
          registry,
        ),
      ).toBe(false);
      expect(
        __nativeScriptScreenHostReadyOnUIForTests(
          'modal',
          'root-stack',
          'modal-host',
        ),
      ).toBe(true);

      expect(registry.screenContentReady.modal).toBe(true);
      expect(refreshPresentedModal).toHaveBeenCalledWith(
        'root-stack',
        'modal',
        registry,
      );
      expect(reconcileStackFromExternalHost).not.toHaveBeenCalled();
    } finally {
      NativeScriptRuntime.refreshUIKitHostView = previousRefreshUIKitHostView;
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostViewDirectOwner;

      if (previousNativeObjectFromHandle === undefined) {
        delete (NativeScriptRuntime as any).nativeObjectFromHandle;
      } else {
        (NativeScriptRuntime as any).nativeObjectFromHandle =
          previousNativeObjectFromHandle;
      }

      if (previousRefreshPresentedModal === undefined) {
        delete globalObject.__rnsNativeScriptRefreshPresentedModalContentAfterPresentation;
      } else {
        globalObject.__rnsNativeScriptRefreshPresentedModalContentAfterPresentation =
          previousRefreshPresentedModal;
      }

      if (previousReconcileStackFromExternalHost === undefined) {
        delete globalObject.__rnsNativeScriptReconcileStackFromExternalHost;
      } else {
        globalObject.__rnsNativeScriptReconcileStackFromExternalHost =
          previousReconcileStackFromExternalHost;
      }

      if (previousRegistry === undefined) {
        delete globalObject.__rnsNativeScriptStackRegistry;
      } else {
        globalObject.__rnsNativeScriptStackRegistry = previousRegistry;
      }
    }
  });

  it('wakes the parent modal stack only when nested content first becomes ready', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const globalObject = global as Record<string, any>;
    const previousRegistry = globalObject.__rnsNativeScriptStackRegistry;
    const previousRefreshPresentedModal =
      globalObject.__rnsNativeScriptRefreshPresentedModalContentAfterPresentation;
    const previousReconcileStack = globalObject.__rnsNativeScriptReconcileStack;
    const previousReconcileStackFromExternalHost =
      globalObject.__rnsNativeScriptReconcileStackFromExternalHost;
    const previousNativeObjectFromHandle = (NativeScriptRuntime as any)
      .nativeObjectFromHandle;
    const previousRefreshUIKitHostViewDirectOwner =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const refreshPresentedModal = jest.fn();
    const reconcileStack = jest.fn();
    const reconcileStackFromExternalHost = jest.fn();
    const refreshUIKitHostViewDirectOwner = jest.fn(() => false);
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };
    const modalView: any = {
      __rnsNativeScriptScreenView: true,
      bounds: frame,
      frame,
      hash: 'modal-host',
      subviews: [],
      userInteractionEnabled: true,
      window: {},
    };
    const nestedScreenView: any = {
      __rnsNativeScriptScreenView: true,
      bounds: frame,
      frame,
      hash: 'nested-screen-host',
      refreshSurfaceTouchHandler: jest.fn(),
      subviews: [],
      userInteractionEnabled: true,
      window: {},
    };
    const nestedContentWrapperView: any = {
      alpha: 1,
      bounds: frame,
      description: 'RNSScreenContentWrapper.NativeScript',
      frame,
      hash: 'nested-wrapper-host',
      hidden: false,
      subviews: [
        {
          alpha: 1,
          description: 'RCTViewComponentView',
          hidden: false,
          subviews: [],
          userInteractionEnabled: true,
          window: {},
        },
      ],
      superview: nestedScreenView,
      userInteractionEnabled: true,
      window: {},
    };
    const modalController: any = {
      __nativeScriptScreenId: 'modal',
      __nativeScriptScreenView: modalView,
      view: modalView,
    };
    const nestedController: any = {
      __nativeScriptScreenId: 'modal:modal-header',
      __nativeScriptScreenView: nestedScreenView,
      view: nestedScreenView,
    };
    const rootNavigationController: any = {
      view: { bounds: frame, frame, window: {} },
      viewControllers: [{ __nativeScriptScreenId: 'home' }],
    };
    const nestedNavigationController: any = {
      __nativeScriptStackId: 'nested-stack',
      topViewController: nestedController,
      view: { bounds: frame, frame, window: {} },
      viewControllers: [nestedController],
    };
    const registry: any = {
      screenContentReady: {},
      screenContentWrapperHostHandles: {},
      screenContentWrapperHostReadyKeys: {},
      screenContentWrapperRefreshKeys: {},
      screenContentWrapperViews: {},
      screenContentWrapperVisibleDescendantCounts: {},
      screenHostHandles: {
        'modal:modal-header': 'nested-screen-host',
      },
      screenHostRefreshKeys: {},
      screenParents: {
        modal: 'root-stack',
        'modal:modal-header': 'nested-stack',
      },
      screenProps: {
        modal: { screenId: 'modal', stackPresentation: 'modal' },
        'modal:modal-header': { screenId: 'modal:modal-header' },
      },
      screenSurfaceTouchRefreshKeys: {},
      screens: {
        modal: modalController,
        'modal:modal-header': nestedController,
      },
      stackActiveScreenIds: {
        'root-stack': ['home', 'modal'],
        'nested-stack': ['modal:modal-header'],
      },
      stackContexts: {
        'root-stack': {},
        'nested-stack': {},
      },
      stackNativeKeys: {
        'root-stack': 'home',
        'nested-stack': 'modal:modal-header',
      },
      stackPendingReconcileKeys: {},
      stackTransitioning: {},
      stacks: {
        'root-stack': rootNavigationController,
        'nested-stack': nestedNavigationController,
      },
    };

    nestedScreenView.subviews = [nestedContentWrapperView];
    globalObject.__rnsNativeScriptStackRegistry = registry;
    globalObject.__rnsNativeScriptRefreshPresentedModalContentAfterPresentation =
      refreshPresentedModal;
    globalObject.__rnsNativeScriptReconcileStack = reconcileStack;
    globalObject.__rnsNativeScriptReconcileStackFromExternalHost =
      reconcileStackFromExternalHost;
    NativeScriptRuntime.refreshUIKitHostViewDirectOwner =
      refreshUIKitHostViewDirectOwner;
    (NativeScriptRuntime as any).nativeObjectFromHandle = jest.fn(
      (handle: string) => {
        if (handle === 'nested-wrapper-host') {
          return nestedContentWrapperView;
        }
        if (handle === 'nested-screen-host') {
          return nestedScreenView;
        }
        return null;
      },
    );

    try {
      expect(
        nativeScriptScreenContentWrapperHostReadyOnUI(
          'modal:modal-header',
          'nested-wrapper-host',
          1,
          false,
        ),
      ).toBe(true);

      expect(registry.screenContentReady['modal:modal-header']).toBe(true);
      expect(reconcileStack).not.toHaveBeenCalledWith(
        'nested-stack',
        expect.anything(),
        expect.anything(),
        expect.anything(),
      );
      expect(registry.stackPendingReconcileKeys['root-stack']).toBe(
        'home\u001fmodal',
      );
      expect(reconcileStack).toHaveBeenCalledWith(
        'root-stack',
        registry,
        registry.stackContexts['root-stack'],
        true,
      );
      expect(reconcileStackFromExternalHost).not.toHaveBeenCalled();
      expect(refreshPresentedModal).not.toHaveBeenCalled();

      reconcileStack.mockClear();
      reconcileStackFromExternalHost.mockClear();

      expect(
        nativeScriptScreenContentWrapperHostReadyOnUI(
          'modal:modal-header',
          'nested-wrapper-host',
          2,
          true,
        ),
      ).toBe(false);

      expect(refreshPresentedModal).not.toHaveBeenCalled();
      expect(reconcileStackFromExternalHost).not.toHaveBeenCalled();
    } finally {
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostViewDirectOwner;

      if (previousNativeObjectFromHandle === undefined) {
        delete (NativeScriptRuntime as any).nativeObjectFromHandle;
      } else {
        (NativeScriptRuntime as any).nativeObjectFromHandle =
          previousNativeObjectFromHandle;
      }

      if (previousRefreshPresentedModal === undefined) {
        delete globalObject.__rnsNativeScriptRefreshPresentedModalContentAfterPresentation;
      } else {
        globalObject.__rnsNativeScriptRefreshPresentedModalContentAfterPresentation =
          previousRefreshPresentedModal;
      }

      if (previousReconcileStack === undefined) {
        delete globalObject.__rnsNativeScriptReconcileStack;
      } else {
        globalObject.__rnsNativeScriptReconcileStack = previousReconcileStack;
      }

      if (previousReconcileStackFromExternalHost === undefined) {
        delete globalObject.__rnsNativeScriptReconcileStackFromExternalHost;
      } else {
        globalObject.__rnsNativeScriptReconcileStackFromExternalHost =
          previousReconcileStackFromExternalHost;
      }

      if (previousRegistry === undefined) {
        delete globalObject.__rnsNativeScriptStackRegistry;
      } else {
        globalObject.__rnsNativeScriptStackRegistry = previousRegistry;
      }
    }
  });

  it('starts modal presentation from the upstream modal controller list without hosted-content gates', () => {
    const refreshReadySource = stackSource.slice(
      stackSource.indexOf('function refreshScreenContentReady'),
      stackSource.indexOf('function reconcilePresentedModalStack'),
    );
    const afterPresentationSource = stackSource.slice(
      stackSource.indexOf(
        'function refreshPresentedModalContentAfterPresentation',
      ),
      stackSource.indexOf('function prepareControllerForPresentation'),
    );
    const nativeDismissSource = stackSource.slice(
      stackSource.indexOf(
        'function completeNativePresentedModalDismissalForController',
      ),
      stackSource.indexOf('function viewControllerCanPresentModal'),
    );
    const reconcileModalSource = stackSource.slice(
      stackSource.indexOf('function reconcilePresentedModalStack'),
      stackSource.indexOf('function screenIdFromStackChild'),
    );
    const setModalSource = stackSource.slice(
      stackSource.indexOf('function setModalViewControllers'),
      stackSource.indexOf('function reconcilePresentedModalStack'),
    );
    const wrapperHostReadySource = stackSource.slice(
      stackSource.indexOf(
        'export function nativeScriptScreenContentWrapperHostReadyOnUI',
      ),
      stackSource.indexOf(
        'export function notifyNativeScriptScreenContentWrapperHostReady',
      ),
    );
    const modalParentWaitSource = stackSource.slice(
      stackSource.indexOf('function stackShouldWaitForModalContentParent'),
      stackSource.indexOf(
        'function scheduleParentModalStackReconcileForContentScreen',
      ),
    );
    const scheduleParentModalSource = stackSource.slice(
      stackSource.indexOf(
        'function scheduleParentModalStackReconcileForContentScreen',
      ),
      stackSource.indexOf('function presentedModalIdsForStack'),
    );
    const modalContentCanStartSource = stackSource.slice(
      stackSource.indexOf('function presentedModalContentCanStartPresentation'),
      stackSource.indexOf('function presentedModalScreenCanStartPresentation'),
    );
    const preflightModalContentSource = stackSource.slice(
      stackSource.indexOf(
        'function preparePresentedModalContentBeforePresentation',
      ),
      stackSource.indexOf('function installPresentedModalContentRefreshHandler'),
    );
    const presentationIndex = reconcileModalSource.indexOf(
      'setModalViewControllers(',
    );

    expect(reconcileModalSource).not.toContain(
      'refreshPresentedModalScreenContentReady(',
    );
    expect(reconcileModalSource).not.toContain(
      'presentedModalContentCanStartPresentation(',
    );
    expect(reconcileModalSource).not.toContain(
      'presentedModalScreenCanStartPresentation(',
    );
    expect(reconcileModalSource).not.toContain('modalPresentationCanStart');
    expect(reconcileModalSource).not.toContain('modal-screen-await-lifecycle');
    expect(reconcileModalSource).not.toContain(
      'markModalPresentationBlocked(stackId, registry, modalIds);',
    );
    expect(reconcileModalSource).not.toContain('if (!modalContentCanStart) {');
    expect(presentationIndex).toBeGreaterThanOrEqual(0);
    expect(reconcileModalSource).not.toContain(
      'preparePresentedModalNestedContentForPresentation(modalIds[index], registry);',
    );
    expect(reconcileModalSource).not.toContain('setTimeout(');
    expect(stackSource).toContain('function screenHostReadyCallbackFired');
    expect(reconcileModalSource).toContain(
      'setModalViewControllers(\n' +
        '    stackId,\n' +
        '    registry,\n' +
        '    ctx,\n' +
        '    modal.controllers,\n' +
        '    modalIds,',
    );
    expect(stackSource).toContain('function presentedModalContentScreenIds');
    expect(stackSource).toContain(
      'const modalHeaderScreenId = `${modalId}:modal-header`;',
    );
    expect(stackSource).toContain(
      'let hasHeader = registry.screens[modalHeaderScreenId] != null;',
    );
    expect(stackSource).toContain(
      'hasHeader = registry.screenParents[modalHeaderScreenId] != null;',
    );
    expect(stackSource).toContain(
      'activeIds.indexOf(modalHeaderScreenId) >= 0',
    );
    expect(stackSource).toContain(
      'function presentedModalContentHasReadyHostDescendants',
    );
    expect(stackSource).toContain(
      'function parentPresentedModalIdForContentScreen',
    );
    expect(stackSource).toContain('function modalContentParentIdForStack');
    expect(stackSource).toContain(
      'function stackShouldWaitForModalContentParent',
    );
    expectSourceToContain(
      modalParentWaitSource,
      'const recordedModalContentParent =\n' +
        '    nativeScriptStackModalContentParentController(\n' +
        '      navigationController,\n' +
        '      registry,\n' +
        '    );',
    );
    expect(modalParentWaitSource).toContain(
      'const currentModalContentParent =\n' +
        '    parentViewControllerForController(navigationController);',
    );
    expect(modalParentWaitSource).toContain(
      'const modalControllerHandle = nativeObjectStableHandle(modalController);',
    );
    expect(modalParentWaitSource).toContain(
      'parentControllerViewContainsView(modalController, stackView)',
    );
    expect(modalParentWaitSource).toContain(
      'const parentMatchesModalController = (parentController: any) => {',
    );
    expect(modalParentWaitSource).toContain(
      'nativeControllersEqual(parentController, modalController)',
    );
    expect(modalParentWaitSource).toContain(
      'parentHandle === modalControllerHandle',
    );
    expect(modalParentWaitSource).toContain(
      'parentMatchesModalController(recordedModalContentParent) ||',
    );
    expect(modalParentWaitSource).toContain(
      'parentMatchesModalController(currentModalContentParent)',
    );
    expect(modalParentWaitSource).toContain(
      'modalContentParentIdForStack(stackId, registry)',
    );
    expect(stackSource).toContain('scroll-edge-modal-stack-skip');
    expect(stackSource).toContain(
      'stackShouldWaitForModalContentParent(stackId, stack, registry)',
    );
    expect(stackSource).toContain(
      'stackShouldWaitForModalContentParent(props.stackId, controller, registry)',
    );
    expect(stackSource).toContain('stack-containment-wait-modal-parent');
    expect(stackSource).toContain(
      'function scheduleParentModalStackReconcileForContentScreen',
    );
    expect(scheduleParentModalSource).toContain(
      'registry.stackPendingReconcileKeys[parentStackId] = idsKey(activeIds);',
    );
    expect(scheduleParentModalSource).toContain(
      'registry.stackUpdatingModals[parentStackId] === true ||',
    );
    expect(scheduleParentModalSource).toContain(
      'registry.stackTransitioning[parentStackId] === true ||',
    );
    expect(scheduleParentModalSource).toContain(
      'registry.stackTransitionScreenIds[parentStackId] === modalId',
    );
    expect(scheduleParentModalSource).toContain(
      "'parent-modal-reconcile-defer-active-transition'",
    );
    expect(scheduleParentModalSource).toMatch(
      /parent-modal-reconcile-defer-active-transition[\s\S]*return true;[\s\S]*scheduledReconcileStack/,
    );
    expect(stackSource).toContain(
      'scheduleParentModalStackReconcileForContentScreen(\n' +
        '        screenId,\n' +
        '        registry,\n' +
        '        windowAttached,\n' +
        '      );',
    );
    expect(stackSource).toContain('windowAttached !== true');
    expect(stackSource).toContain(
      'function presentedModalContentScreenHasLiveHostedContent',
    );
    expect(stackSource).toContain(
      'function presentedModalContentScreenHasPreparedHostedContent',
    );
    expect(stackSource).toContain(
      'function presentedModalContentHasLiveHostedContent',
    );
    expect(stackSource).not.toContain(
      'function presentedModalContentScreenHasVisibleHostedContent',
    );
    expect(stackSource).not.toContain(
      'function presentedModalContentHasVisibleHostedContent',
    );
    expect(stackSource).toContain('function detachViewOutsideAncestor');
    expect(stackSource).not.toContain('function rootCleanupView');
    expect(stackSource).not.toContain('return rootView?.window ?? rootView;');
    expect(stackSource.indexOf('function screenContentIsReady')).toBeLessThan(
      stackSource.indexOf(
        'function presentedModalContentScreenHasLiveHostedContent',
      ),
    );
    expect(
      stackSource.indexOf('function screenContentWrapperIsReady'),
    ).toBeLessThan(
      stackSource.indexOf(
        'function presentedModalContentScreenHasPreparedHostedContent',
      ),
    );
    expect(
      stackSource.indexOf('function presentedModalContentScreenIds'),
    ).toBeLessThan(
      stackSource.indexOf(
        'function presentedModalContentHasLiveHostedContent',
      ),
    );
    expect(stackSource).toContain(
      'screenView.window == null ||\n    contentWrapperView.window == null',
    );
    expect(stackSource).toContain(
      'return screenHasVisibleHostedContent(screenId, registry, screenView);',
    );
    expect(stackSource).toContain(
      'function navigationStackCanReuseVisibleBaseForModalPresentation',
    );
    const modalBaseReuseSource = stackSource.slice(
      stackSource.indexOf(
        'function navigationStackCanReuseVisibleBaseForModalPresentation',
      ),
      stackSource.indexOf('function reconcilePresentedModalStack'),
    );
    expect(modalBaseReuseSource).not.toContain('screenContentIsReady');
    expect(modalBaseReuseSource).not.toContain(
      'screenHasHostReadyVisibleDescendants',
    );
    expect(modalBaseReuseSource).not.toContain('screenHasVisibleHostedContent');
    expect(
      stackSource.indexOf('function parentViewControllerForController'),
    ).toBeLessThan(stackSource.indexOf('function traceControllerOwnership'));
    expect(reconcileModalSource).toContain(
      'const canReuseVisibleBase =\n' +
        '    navigationStackCanReuseVisibleBaseForModalPresentation(',
    );
    expect(reconcileModalSource).toContain(
      'const presentedModalIds = presentedModalIdsForStack(stackId, registry);',
    );
    expect(reconcileModalSource).toContain(
      'const shouldPreserveBaseBehindPresentedModal = !!(',
    );
    expect(reconcileModalSource).toContain(
      'idsEqual(presentedModalIds, modalIds)',
    );
    expect(reconcileModalSource).toContain(
      'if (canReuseVisibleBase || shouldPreserveBaseBehindPresentedModal) {',
    );
    expect(reconcileModalSource).toContain(
      'const shouldRestoreReusableBaseInteractivity =',
    );
    expect(reconcileModalSource).toContain(
      'shouldPreserveBaseBehindPresentedModal ||\n' +
        '    modalIds.length === 0 ||\n' +
        '    presentedModalIds.length > 0 ||\n' +
        '    hasPresentedModalController;',
    );
    expect(reconcileModalSource).toContain(
      'restoreVisibleNavigationControllerInteractivity(\n' +
        '      navigationController,\n' +
        '      registry,\n' +
        '    );',
    );
    expect(reconcileModalSource).toContain(
      "'reconcileModal-skip-base-interactivity-restore'",
    );
    expect(stackSource).toContain(
      'registry.stackPendingReconcileKeys[stackId] = idsKey(\n' +
        '    registry.stackActiveScreenIds[stackId] ?? [],\n' +
        '  );',
    );
    const modalBlockedSource = stackSource.slice(
      stackSource.indexOf('function markModalPresentationBlocked'),
      stackSource.indexOf('function setModalViewControllers'),
    );
    expect(modalBlockedSource).not.toContain('layoutNavigationStackViews');
    expect(modalBlockedSource).not.toContain(
      'refreshVisibleStackContentWrapperHosts',
    );
    expect(modalBlockedSource).not.toContain(
      'refreshScreenContentWrapperHostsForScreenIds',
    );
    expect(reconcileModalSource).toContain(
      'registry.stackPendingReconcileKeys[stackId] = idsKey(\n' +
        '      registry.stackActiveScreenIds[stackId] ?? availableIds,\n' +
        '    );',
    );
    expect(stackSource).toContain(
      'const nestedContentWrapperReady = screenContentWrapperIsReady(\n' +
        '      topScreenId,\n' +
        '      registry,\n' +
        '    );',
    );
    expect(stackSource).toContain(
      'const nestedContentNeedsForcedRefresh =\n' +
        '      nestedContentWrapperReady &&\n' +
        '      !presentedModalContentScreenHasPreparedHostedContent(\n' +
        '        topScreenId,\n' +
        '        registry,\n' +
        '      );',
    );
    expect(stackSource).toContain(
      'if (layoutNestedContent && nestedContentNeedsForcedRefresh) {\n' +
        "      layoutNavigationStackViews(navigationController, 'modal-base-refresh');\n" +
        '    }',
    );
    expect(stackSource).toContain(
      'function modalContentStackCanLayoutDuringPresentation(',
    );
    expect(stackSource).toContain("reason === 'modal-base-refresh' ||");
    expect(stackSource).toContain(
      "reason === 'modal-presented-content-refresh' ||",
    );
    expect(stackSource).toContain("reason === 'descendant-stack-layout' ||");
    expect(stackSource).toContain("reason === 'reconcile-stack-noop-content'");
    expect(stackSource).toContain(
      'isTransitioning &&\n' +
        '    modalContentStackCanLayoutDuringPresentation(',
    );
    expect(stackSource).toContain(
      '!shouldForceCompletedNativeDismissLayout &&\n' +
        '    ((isTransitioning && !canLayoutModalContentDuringPresentation) ||\n' +
        '      hasPendingRegistryUpdate)',
    );
    expect(afterPresentationSource).toContain(
      'const modalId =\n' +
        '    parentPresentedModalIdForContentScreen(screenId, registry) ?? screenId;',
    );
    expect(afterPresentationSource).toContain(
      'if (!presentedModalControllerHasWindowAttachedView(presentedController)) {',
    );
    expect(afterPresentationSource).toContain("'modal-refresh-skip-detached'");
    expect(afterPresentationSource).toContain(
      'const canSkipPostPresentationRefresh =\n' +
        '    presentedModalContentCanSkipPostPresentationRefresh(modalId, registry);',
    );
    expect(afterPresentationSource).toContain(
      'const modalContentRefresh = canSkipPostPresentationRefresh\n' +
        '    ? presentedModalScreenContentReadinessSnapshot(modalId, registry)',
    );
    expect(afterPresentationSource).toContain(
      'const didPrepareNestedContent = canSkipPostPresentationRefresh\n' +
        '    ? false\n' +
        '    : preparePresentedModalNestedContentForPresentation(modalId, registry);',
    );
    expect(stackSource).toContain(
      'function preparePresentedModalContentBeforePresentation',
    );
    expect(stackSource).toContain(
      'function presentedModalScreenContentReadinessSnapshot',
    );
    expect(stackSource).toContain("'modal-preflight-content'");
    expect(preflightModalContentSource).toContain(
      'preparePresentedModalNestedContentForPresentation(\n' +
        '      modalId,\n' +
        '      registry,\n' +
        '      false,\n' +
        '    );',
    );
    expect(preflightModalContentSource).toContain(
      'presentedModalScreenContentReadinessSnapshot(',
    );
    expect(preflightModalContentSource).not.toContain(
      'refreshPresentedModalScreenContentReady(',
    );
    expect(preflightModalContentSource).not.toContain(
      'layoutPresentedModalNestedContentScreen(',
    );
    expect(modalContentCanStartSource).toContain(
      'contentScreenIds.length === 1 &&\n' +
        '    contentScreenIds[0] === modalId &&\n' +
        '    !screenHostReadyCallbackFired(modalId, registry)',
    );
    expect(setModalSource).toContain(
      'preparePresentedModalContentBeforePresentation(\n' +
        '        stackId,\n' +
        '        modalScreenId,\n' +
        '        registry,\n' +
        '      );',
    );
    expect(setModalSource).toContain(
      'if (!presentedModalContentCanStartPresentation(modalScreenId, registry)) {',
    );
    expect(setModalSource).toContain("'modal-content-not-ready-at-start'");
    expect(setModalSource).not.toContain("'modal-skip-content-not-ready'");
    expect(setModalSource).not.toContain(
      'markModalPresentationBlocked(\n' +
        '        stackId,\n' +
        '        registry,\n' +
        '        blockedModalScreenIds,\n' +
        '      );',
    );
    const prepareControllerIndex = setModalSource.indexOf(
      'prepareControllerForPresentation(nextController, nextScreenId, registry);',
    );
    const prepareContentIndex = setModalSource.indexOf(
      'preparePresentedModalContentBeforePresentation(',
    );
    expect(prepareControllerIndex).toBeGreaterThan(-1);
    expect(prepareContentIndex).toBeGreaterThan(-1);
    expect(prepareContentIndex).toBeLessThan(prepareControllerIndex);
    expect(stackSource).toContain(
      'function dispatchParentPresentedModalContentRefreshForContentScreen',
    );
    expect(stackSource).toContain(
      'const parentPresentedModalId = !isModalScreen\n' +
        '    ? parentPresentedModalIdForContentScreen(screenId, registry)\n' +
        '    : undefined;',
    );
    expect(stackSource).toContain(
      'let didDispatchParentModalContentRefresh =\n' +
        '    canUseScreenContent && !wasContentReady && parentPresentedModalId\n' +
        '      ? dispatchParentPresentedModalContentRefreshForContentScreen(',
    );
    expect(wrapperHostReadySource).toContain(
      'const shouldDeferOffWindowModalContentHostReady =',
    );
    expect(wrapperHostReadySource).toContain(
      'parentPresentedModalId != null &&\n' +
        '    windowAttached !== true &&\n' +
        '    didScheduleParentModalStack;',
    );
    expect(wrapperHostReadySource).toContain(
      "'content-wrapper-host-ready-defer-parent-modal'",
    );
    expect(wrapperHostReadySource.indexOf(
      'if (shouldDeferOffWindowModalContentHostReady)',
    )).toBeLessThan(
      wrapperHostReadySource.indexOf(
        'const shouldDeferNativeStackHostReadyRefresh',
      ),
    );
    expect(
      wrapperHostReadySource.indexOf(
        'let didDispatchParentModalContentRefresh =',
      ),
    ).toBeGreaterThan(
      wrapperHostReadySource.indexOf('if (shouldSkipReadySameWrapperRefresh)'),
    );
    expect(wrapperHostReadySource).toContain(
      'return didReconcileContainingTab;',
    );
    expect(wrapperHostReadySource).toContain(
      'didDispatchParentModalContentRefresh ||\n' +
        '    didScheduleParentModalStack ||\n' +
        '    didReconcileContainingTab\n' +
        '  );',
    );
    const finishPresentationIndex = setModalSource.indexOf(
      'const finishPresentation = () => {',
    );
    const presentCallIndex = setModalSource.indexOf(
      'invokeNativeSelector(\n' +
        '        previousController,\n' +
        "        'presentViewControllerAnimatedCompletion',",
    );
    const finishPresentationSource = setModalSource.slice(
      finishPresentationIndex,
      presentCallIndex,
    );
    expect(finishPresentationIndex).toBeGreaterThan(-1);
    expect(presentCallIndex).toBeGreaterThan(finishPresentationIndex);
    expect(presentCallIndex).toBeGreaterThan(prepareContentIndex);
    expect(finishPresentationSource).toContain(
      'refreshPresentedModalContentAfterPresentation(',
    );
    expect(
      finishPresentationSource.indexOf('completeModalTransitionTransaction('),
    ).toBeLessThan(
      finishPresentationSource.indexOf(
        'refreshPresentedModalContentAfterPresentation(',
      ),
    );
    expect(setModalSource).not.toContain(
      'modal-present-block-content-not-ready',
    );
    expect(setModalSource).not.toContain(
      'presentedModalContentHasReadyHostDescendants(nextScreenId, registry)',
    );
    const modalPresentCallTraceIndex = setModalSource.indexOf(
      "'modal-present-call',",
      presentCallIndex,
    );
    expect(modalPresentCallTraceIndex).toBeGreaterThan(presentCallIndex);
    expectSourceToContain(
      finishPresentationSource,
      'setPresentedModalIdsForStack(\n' +
        '          stackId,\n' +
        '          registry,\n' +
        '          controllerIds.slice(0, index + 1),\n' +
        '        );',
    );
    expect(finishPresentationSource).toContain(
      'restorePresentedModalViewZOrder(presentedController);',
    );
    expect(setModalSource).not.toContain(
      'repairDescendantStackContainmentForController(',
    );
    expectSourceToContain(
      afterPresentationSource,
      'const modalContentHasLiveHostedContent =\n' +
        '    presentedModalContentHasLiveHostedContent(modalId, registry);',
    );
    expectSourceToContain(
      afterPresentationSource,
      'const modalContentHasReadyHostDescendants =\n' +
        '    presentedModalContentHasReadyHostDescendants(modalId, registry);',
    );
    expectSourceToContain(
      afterPresentationSource,
      'const modalContentMissing = !modalContentHasLiveHostedContent;',
    );
    expect(afterPresentationSource).toContain(
      'const modalContentRefresh = canSkipPostPresentationRefresh\n' +
        '    ? presentedModalScreenContentReadinessSnapshot(modalId, registry)\n' +
        '    : refreshPresentedModalScreenContentReady(',
    );
    expectSourceToContain(
      afterPresentationSource,
      '        modalContentMissing,\n' + '      );',
    );
    expect(afterPresentationSource).toContain(
      'if (shouldForcePresentedModalContentRepair) {',
    );
    expect(afterPresentationSource).toContain(
      'layoutPresentedModalControllers(stackId, registry);',
    );
    expect(afterPresentationSource).toContain(
      'refreshPresentedModalContentWrapperHosts(\n' +
        '      [modalId],\n' +
        '      registry,\n' +
        '      true,\n' +
        '      true,\n' +
        '      true,\n' +
        '    );',
    );
    expect(afterPresentationSource).toContain(
      'const shouldForcePresentedModalContentRepair =\n' +
        '    modalContentMissing || !modalContentRefresh.allContentReady;',
    );
    expect(afterPresentationSource).toContain(
      '} else {\n' +
        '    if (didPrepareNestedContent || didLayoutNestedContent) {\n' +
        '      layoutPresentedModalControllers(stackId, registry);\n' +
        '    }\n' +
        '    refreshPresentedModalSubtreeTouchHandlers([modalId], registry, false);\n' +
        '  }',
    );
    expect(afterPresentationSource).toContain(
      'if (shouldForcePresentedModalContentRepair) {\n' +
        '    refreshPresentedModalSubtreeTouchHandlers([modalId], registry, true);\n' +
        '  }',
    );
    expect(afterPresentationSource).toContain(
      'const didLayoutNestedContent = canSkipPostPresentationRefresh\n' +
        '    ? false\n' +
        '    : layoutPresentedModalNestedContentScreen(modalId, registry, false);',
    );
    expect(stackSource).toContain('modalView.bringSubviewToFront?.(stackView);');
    expect(afterPresentationSource).toContain(
      'layout=${didLayoutNestedContent ? 1 : 0}',
    );
    expectSourceToContain(
      afterPresentationSource,
      'const presentedController = controller\n' +
        '    ? presentationControllerForModalScreen(modalId, controller, registry)\n' +
        '    : null;',
    );
    expect(afterPresentationSource).toContain(
      '!nativeControllersEqual(presentedController, controller)',
    );
    expectSourceToContain(
      afterPresentationSource,
      "layoutNavigationStackViews(presentedController, 'modal-presented-content-refresh');",
    );
    expect(afterPresentationSource).toContain(
      'refreshNavigationControllerHostedViews(presentedController);',
    );
    expect(afterPresentationSource).toContain(
      'if (modalContentMissing && controllerView) {',
    );
    expect(stackSource).toContain(
      'const baseIds = configureVisibleBaseStackAfterModalDismissal(',
    );
    expect(stackSource).toContain('stackNeedsModalDismissalRestore');
    expect(stackSource).toContain(
      'registry.stackNeedsModalDismissalRestore[stackId] = true;',
    );
    expect(stackSource).toContain(
      'controllerIds.length === 0 &&\n' +
        '        registry.stackNeedsModalDismissalRestore[stackId] === true',
    );
    expect(stackSource).toContain(
      'refreshScreenContentWrapperHostsForScreenIds(\n' +
        '    idsNeedingContentRefresh,\n' +
        '    registry,\n' +
        '    true,\n' +
        '    true,\n' +
        '    true,\n' +
        '    true,\n' +
        '  );',
    );
    expect(afterPresentationSource).toContain(
      'if (shouldForcePresentedModalContentRepair) {',
    );
    expect(afterPresentationSource).toContain(
      'refreshPresentedModalContentWrapperHosts(',
    );
    expect(afterPresentationSource).toContain(
      'refreshPresentedModalSubtreeTouchHandlers(',
    );
    expect(stackSource).toContain(
      'restoreVisibleNavigationControllerInteractivity(stack, registry, true);',
    );
    expect(nativeDismissSource).toContain(
      'restoreVisibleBaseStackAfterModalDismissal(stackId, registry);',
    );
    expect(stackSource).toContain('function flushKnownUIKitHostView');
    expect(stackSource).toContain(
      'function configureVisibleBaseStackAfterModalDismissal',
    );
    const configureVisibleBaseAfterDismissalSource = stackSource.slice(
      stackSource.indexOf('function configureVisibleBaseStackAfterModalDismissal'),
      stackSource.indexOf('function restoredScreenNeedsContentRefresh'),
    );
    expectSourceToContain(
      configureVisibleBaseAfterDismissalSource,
      'configureStackControllers(baseIds, registry, true, false);',
    );
    const flushKnownUIKitHostViewSource = stackSource.slice(
      stackSource.indexOf('function flushKnownUIKitHostView'),
      stackSource.indexOf('function isSurfaceTouchHandlerGestureRecognizer'),
    );
    expect(flushKnownUIKitHostViewSource).toContain('flushUIKitHostView');
    expect(flushKnownUIKitHostViewSource).not.toContain(
      'flushUIKitHostViewOwner',
    );
    expect(reconcileModalSource).not.toContain(
      'if (!refreshScreenContentReady(firstModalId, firstModalController, registry))',
    );
    expect(refreshReadySource).toContain(
      'layoutHostedReactSubviews(\n' +
        '      controller,\n' +
        '      controllerView,\n' +
        '      false,\n' +
        '      true,\n' +
        '      registry,\n' +
        '      screenId,\n' +
        '      forceRefresh,\n' +
        '    );',
    );
    expect(refreshReadySource).toContain(
      'refreshScreenContentWrapperHost(\n' +
        '      screenId,\n' +
        '      registry,\n' +
        '      true,\n' +
        '      forceRefresh,\n' +
        '      false,\n' +
        '      false,\n' +
        "      'screen-content-ready-controller',\n" +
        '    );',
    );
    expect(refreshReadySource).toContain(
      'const didRefreshWrapper = refreshScreenContentWrapperHost(\n' +
        '      screenId,\n' +
        '      registry,\n' +
        '      true,\n' +
        '      forceRefresh,\n' +
        '      false,\n' +
        '      false,\n' +
        "      'screen-content-ready-controller',\n" +
        '    );',
    );
    expect(refreshReadySource).toContain(
      'if (screenCanCertifyContentReady(screenId, registry))',
    );
    expect(refreshReadySource).toContain(
      'registry.screenContentReady[screenId] = true;',
    );
    expect(refreshReadySource).toContain(
      'return didRefreshWrapper || screenContentIsReady(screenId, registry);',
    );
    expect(stackSource).toContain(
      'function screenRequiresContentWrapperForReady',
    );
    expect(stackSource).toContain(
      "registry.screenProps[screenId ?? '']?.stackPresentation",
    );
    expect(stackSource).toContain(
      "const parentId = registry.screenParents?.[screenId ?? ''];",
    );
    expect(stackSource).toContain(
      '(parentId != null && registry.stackContexts[parentId] != null)',
    );
    expect(stackSource).toContain('function screenHasVisibleHostedContent');
    expect(stackSource).toContain(
      'viewHasVisibleHostedReactContent(contentWrapperView)',
    );
    expect(stackSource).toContain(
      '!screenHasVisibleHostedContent(screenId, registry, rootView)',
    );
    expect(stackSource).toContain('const topContentHasVisibleHostedContent =');
    expect(stackSource).toContain(
      'const topContentHasCommittedHostedContent =',
    );
    expect(stackSource).toContain('const topContentIsStableEnough =');
    expect(stackSource).toContain('!topContentIsStableEnough');
    expect(stackSource).toContain(
      'const topScreenId = availableIds[nextCount - 1];',
    );
    expect(stackSource).toContain(
      'const topContentHasVisibleHostedContent = screenHasVisibleHostedContent(\n' +
        '      topScreenId,\n' +
        '      registry,\n' +
        '      topControllerView,\n' +
        '    );',
    );
    expect(stackSource).toContain(
      'const hasVisibleHostedContent = screenHasVisibleHostedContent(',
    );
    expect(stackSource).toContain(
      '(shouldForceCompletedNativeDismissHostedLayout ||\n' +
        '        didControllerGeometryChange ||\n' +
        '        !hasVisibleHostedContent ||\n' +
        '        didForceCompletedNativeDismissWrapperLayout)',
    );
    const pushBranchStart = stackSource.indexOf(
      'const pushedScreenId = availableIds[nextCount - 1];',
    );
    const reconcilePushSource = stackSource.slice(
      pushBranchStart,
      stackSource.indexOf('if (didAnimatePush)', pushBranchStart),
    );
    expect(reconcilePushSource).toContain(
      'prepareControllerForStackExposure(\n' +
        '        navigationController,\n' +
        '        pushedScreenId,\n' +
        '        pushedController,\n' +
        '        registry,\n' +
        '        ctx,\n' +
        '        true,\n' +
        '        nextCount > 1,\n' +
        '        true,\n' +
        '        false,\n' +
        '        true,\n' +
        '      );',
    );
    expect(reconcilePushSource).toContain('didAnimatePush = animateStackPush(');
    expect(reconcilePushSource).not.toContain(
      'prepareScreenHostedContentForNativeTransition(',
    );
    expect(reconcilePushSource).not.toContain(
      'pushedScreenHasReadyHostDescendants',
    );
    expect(reconcilePushSource).not.toContain(
      'pushedScreenHasVisibleHostedContent',
    );
    expect(reconcilePushSource).not.toContain(
      'shouldForcePushedContentRefresh',
    );
    expect(reconcilePushSource).not.toContain(
      'refreshScreenContentWrapperHost(',
    );
    expect(reconcilePushSource).not.toContain('flushKnownUIKitHostView(');
    expect(reconcilePushSource).not.toContain('screenContentWrapperIsReady');
    expect(reconcilePushSource).not.toContain(
      '!registry.screenContentWrapperViews[pushedScreenId]',
    );
    expect(reconcilePushSource).not.toContain(
      'reconcileStack-push-header-not-ready',
    );
    expect(reconcilePushSource).not.toContain(
      '!screenHeaderSubviewsAreReady(pushedScreenId, registry)',
    );
    expect(stackSource).toContain(
      'const isModalScreen = isModalPresentation(props?.stackPresentation);',
    );
    expect(stackSource).toContain(
      'registry.screenContentReady[screenId] = true;',
    );
    expect(stackSource).toContain('LAYOUT_PRESENTED_MODAL_CONTROLLERS_KEY');
    expect(stackSource).not.toContain(
      'function schedulePresentedModalTransitionFallback',
    );
    expect(stackSource).not.toContain(
      'schedulePresentedModalTransitionFallback(',
    );
    expect(stackSource).toContain(
      "        'presentViewController:animated:completion:',",
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
    expect(stackSource).toContain(
      'function effectiveScreenContentWrapperFrame',
    );
    expect(stackSource).toContain(
      "if (props?.stackPresentation === 'formSheet') {",
    );
    expect(stackSource).toContain(
      'const modalAncestorId = modalPresentationAncestorIdForContentScreen(',
    );
    expect(stackSource).toContain(
      'modalController?.presentationController?.presentedView?.bounds',
    );
    expect(wrapperFrameSource).toContain(
      'const effectiveFrame = effectiveScreenContentWrapperFrame(',
    );
    expect(wrapperFrameSource).toContain(
      'const layoutKey = notifiedContentWrapperFrameLayoutKey(effectiveFrame);',
    );
    expect(wrapperFrameSource).toContain(
      'registry.stackTransitioning[stackId] === true',
    );
    expect(wrapperFrameSource).toContain(
      'queuePendingStackReconcileIfNativeModelDiffers(stackId, registry);',
    );
    expect(wrapperFrameSource).toContain(
      '} else if (typeof reconcileStackFromRegistry ===',
    );
    expect(wrapperFrameSource).toContain('forceTouchRefresh = false');
    expect(wrapperFrameSource).toContain(
      'const shouldDeferHostRefresh =\n' +
        '    shouldDeferReadyContentWrapperRefreshDuringTransition(screenId, registry);',
    );
    expect(wrapperFrameSource).toContain(
      'if (shouldUseTouchOnlyStableLayout) {\n' +
        '    refreshScreenContentWrapperTouchHandler(\n' +
        '      screenId,\n' +
        '      registry,\n' +
        '      forceTouchRefresh,\n' +
        '    );',
    );
    expect(wrapperFrameSource).toContain(
      'refreshScreenContentWrapperHost(\n' +
        '      screenId,\n' +
        '      registry,\n' +
        '      false,\n' +
        '      forceTouchRefresh || layoutDidChange,\n' +
        '      forceTouchRefresh,\n' +
        '      shouldDeferHostRefresh,\n' +
        "      'content-wrapper-layout',\n" +
        '    );',
    );
    const hostReadySource = stackSource.slice(
      stackSource.indexOf(
        'export function nativeScriptScreenContentWrapperHostReadyOnUI',
      ),
      stackSource.indexOf(
        'export function notifyNativeScriptScreenContentWrapperHostReady',
      ),
    );
    const refreshHostSource = stackSource.slice(
      stackSource.indexOf('function refreshScreenContentWrapperHost'),
      stackSource.indexOf(
        'export const __nativeScriptRefreshScreenContentWrapperHostForTests',
      ),
    );
    const parentModalScheduleSource = stackSource.slice(
      stackSource.indexOf(
        'function scheduleParentModalStackReconcileForContentScreen',
      ),
      stackSource.indexOf('function presentedModalIdsForStack'),
    );
    expect(hostReadySource).toContain(
      'registry.stackTransitioning[stackId] === true',
    );
    expect(refreshHostSource).toContain(
      'const shouldSkipOffWindowTouchRefresh =\n' +
        '    skipHostedRefresh &&\n' +
        '    !contentWrapperView.window &&\n' +
        '    !touchScreenView?.window;',
    );
    expect(refreshHostSource).toContain(
      'shouldDeferTouchRefreshDuringTransition ||\n' +
        '    shouldSkipOffWindowTouchRefresh ||',
    );
    expect(parentModalScheduleSource).toContain(
      'windowAttached !== true &&\n' +
        '    !presentedModalHasNestedContentScreen(modalId, registry)',
    );
    expect(parentModalScheduleSource).toContain(
      '!presentedModalHasNestedContentScreen(modalId, registry)',
    );
    expect(hostReadySource).toContain(
      'queuePendingStackReconcileIfNativeModelDiffers(stackId, registry);',
    );
    expect(stackSource).toContain(
      'function queuePendingStackReconcileIfNativeModelDiffers',
    );
    expect(stackSource).toContain(
      'if (registry.stackNativeKeys[stackId] !== activeKey) {',
    );
    expect(stackSource).toContain(
      'registry.stackPendingReconcileKeys[stackId] = undefined;',
    );
    expect(hostReadySource).toContain(
      'shouldDeferReadyContentWrapperRefreshDuringTransition(screenId, registry)',
    );
    expect(hostReadySource).toContain(
      'const canStartNativeStackUpdateFromWrapper =',
    );
    expect(hostReadySource).toContain('!isModalScreen &&');
    expect(hostReadySource).toContain(
      'stackTopScreenCanStartNativeUpdate(activeStackIds, registry, stackId)',
    );
    expect(hostReadySource).toContain(
      'registry.screenContentReady[screenId] = true;',
    );
    expectSourceToContain(
      hostReadySource,
      'const canUseScreenContent =\n' +
        '    isContentReady || canStartNativeStackUpdateFromWrapper;',
    );
    expectSourceToContain(
      hostReadySource,
      'const shouldSkipHostedRefreshForNativeStackStart =\n' +
        '    canStartNativeStackUpdateFromWrapper &&\n' +
        '    !isModalScreen &&\n' +
        '    !!stackId &&\n' +
        '    registry.stackTransitioning[stackId] !== true;',
    );
    expectSourceToContain(
      hostReadySource,
      'const shouldDeferNativeStackHostReadyRefresh =\n' +
        '    shouldDeferHostRefresh &&\n' +
        '    canUseScreenContent &&\n' +
        '    stackId &&\n' +
        '    !isModalScreen &&\n' +
        '    registry.stackTransitioning[stackId] === true;',
    );
    expectSourceToContain(
      hostReadySource,
      'if (shouldDeferNativeStackHostReadyRefresh) {\n' +
        '    queuePendingStackReconcileIfNativeModelDiffers(stackId, registry);\n' +
        '    traceWorkletEvent(\n' +
        "      'content-wrapper-host-ready-defer-transition-refresh',",
    );
    expect(
      hostReadySource.indexOf('shouldDeferNativeStackHostReadyRefresh'),
    ).toBeLessThan(
      hostReadySource.indexOf("'content-wrapper-host-ready-refresh'"),
    );
    expectSourceToContain(
      hostReadySource,
      'const didRefresh = contentWrapperView\n' +
        '    ? refreshScreenContentWrapperHost(\n' +
        '        screenId,\n' +
        '        registry,\n' +
        '        true,\n' +
        '        false,\n' +
        '        false,\n' +
        '        shouldDeferHostRefresh || shouldSkipHostedRefreshForNativeStackStart,\n' +
        "        'content-wrapper-host-ready',\n" +
        '      )',
    );
    expect(
      hostReadySource.indexOf(
        'shouldDeferReadyContentWrapperRefreshDuringTransition',
      ),
    ).toBeLessThan(
      hostReadySource.indexOf('const didRefresh = contentWrapperView'),
    );
    expect(stackSource).toContain('forceRootScan = false');
    expect(stackSource).toContain(
      '!forceRootScan &&\n    !hostedSubviewRepairLayoutDidChange(rootView, availableHeight)',
    );
    expect(stackSource).not.toContain(
      'setTimeout(refreshScreenContentWrapperHost',
    );
    expect(screenContentWrapperSource).toContain(
      'nativeScriptScreenContentWrapperHostReadyOnUI',
    );
    expect(screenContentWrapperSource).toContain(
      'hostReady(view, props, event)',
    );
    expect(screenContentWrapperSource).not.toContain(
      'onHostReady={handleHostReady}',
    );
    expect(stackSource).toContain(
      'export function notifyNativeScriptScreenContentWrapperHostReady',
    );
    expect(stackSource).toContain(
      'export function nativeScriptScreenContentWrapperHostReadyOnUI',
    );
    expect(stackSource).toContain('function nativeObjectFromHandle');
    expect(stackSource).toContain(
      'interopObject.object(interopObject.Pointer(handle))',
    );
    expect(stackSource).toContain('refreshUIKitHostViewHandle');
    expect(stackSource).toContain(
      'function screenContentWrapperViewFromHostReadyHandle',
    );
    expect(stackSource).toContain(
      'function liveScreenContentWrapperViewFromRegistry',
    );
    expectSourceToContain(
      stackSource,
      'const contentWrapperView = liveScreenContentWrapperViewFromRegistry(\n' +
        '    screenId,\n' +
        '    registry,\n' +
        '  );',
    );
    expectSourceToContain(
      stackSource,
      'const contentWrapperViewHandle =\n' +
        '    registry.screenContentWrapperHostHandles?.[screenId];',
    );
    expect(stackSource).toContain(
      'registry.screenContentWrapperViews[screenId] = undefined;',
    );
    expectSourceToContain(
      stackSource,
      'screenView && nativeObjectsEqual(resolvedContentWrapperView, screenView)',
    );
    expect(stackSource).toContain(
      'registry.screenContentWrapperViews[screenId] = contentWrapperView;',
    );
    expect(stackSource).toContain('screenContentWrapperHostHandles');
    expect(stackSource).toContain('screenContentWrapperHostReadyKeys');
    expect(stackSource).toContain(
      'screenContentWrapperVisibleDescendantCounts',
    );
    expect(stackSource).toContain('screenHostHandles');
    expect(stackSource).toContain(
      'previousHandle === contentWrapperViewHandle &&\n' +
        '    previousReadyKey === readyKey &&\n' +
        '    wasContentReady',
    );
    expect(stackSource).toContain('function screenContentWrapperHostReadyKey');
    expect(stackSource).toContain(
      "windowAttached === true ? 'window' : 'offwindow'",
    );
    expect(stackSource).toContain(
      'const controllerView = screenControllerView(registry.screens[screenId]);',
    );
    expect(stackSource).toContain(
      'function refreshNativeScriptScreenViewSurfaceTouchHandler',
    );
    expect(stackSource).toContain(
      'const shouldOwnSurfaceTouchHandler =\n' +
        '    forceOwnSurfaceTouchHandler ||\n' +
        '    !!(\n' +
        '      view?.__rnsNativeScriptScreenView === true &&\n' +
        '      registry &&\n' +
        '      screenRequiresOwnSurfaceTouchHandler(screenId, registry)\n' +
        '    );',
    );
    expect(stackSource).toContain(
      'forceReattachSurfaceTouchHandler = false,\n' +
        ') {\n' +
        "  'worklet';\n",
    );
    expect(stackSource).toContain(
      'function detachNativeScriptScreenViewSurfaceTouchHandler',
    );
    expect(stackSource).toContain(
      'function nearestNativeScriptScreenViewForView',
    );
    expect(stackSource).toContain(
      'const touchScreenView =\n' +
        '    controllerView?.__rnsNativeScriptScreenView === true\n' +
        '      ? controllerView\n' +
        '      : nearestNativeScriptScreenViewForView(contentWrapperView) ??\n' +
        '        controllerView;',
    );
    expect(stackSource).toContain(
      'function shouldDeferContentWrapperTouchRefreshDuringTransition',
    );
    expect(stackSource).toContain(
      'function shouldDeferScreenSurfaceTouchRefreshDuringTransition',
    );
    expect(stackSource).toContain(
      'if (screenHasActiveParentModalTransaction(screenId, registry)) {\n' +
        '    return true;\n' +
        '  }',
    );
    expect(stackSource).toContain(
      'registry.stackTransitioning?.[stackId] === true',
    );
    expect(stackSource).toContain(
      "reason=native-transition-coordinator",
    );
    expect(stackSource).toContain('function screenIsTopActiveScreen');
    expect(stackSource).toContain(
      'const touchHandlerIsCurrent = screenSurfaceTouchHandlerIsCurrent(',
    );
    expect(stackSource).toContain(
      'const shouldDeferNonTopTransitionTouchRefresh =\n' +
        '    shouldDeferTouchRefreshDuringTransition &&\n' +
        '    !screenIsTopActiveScreen(screenId, registry);',
    );
    expect(stackSource).toContain(
      'shouldDeferTouchRefreshDuringTransition ||\n' +
        '    shouldSkipOffWindowTouchRefresh ||\n' +
        '    (touchHandlerIsCurrent && skipHostedRefresh) ||\n' +
        '    shouldDeferNonTopTransitionTouchRefresh;',
    );
    expect(stackSource).toContain(
      'if (!shouldSkipTouchRefresh) {\n' +
        '    refreshScreenSurfaceTouchHandlerIfNeeded(',
    );
    expect(stackSource).toContain(
      'const isSameRefreshKey = refreshKeys[screenId] === refreshKey;',
    );
    expect(stackSource).toContain(
      "reason === 'header-subview-update' &&\n" +
        '    !forceTouchRefresh &&\n' +
        '    !forceTouchReattach;',
    );
    expect(stackSource).toContain(
      '!isHeaderSubviewOnlyRefresh &&\n' +
        '    (didNormalizeWrapper ||',
    );
    expect(stackSource).toContain(
      'const didGeometryChange = geometryKeys[screenId] !== geometryKey;',
    );
    expect(stackSource).toContain(
      'const isCurrentTouchSurface = screenSurfaceTouchHandlerIsCurrent(',
    );
    expect(stackSource).toContain(
      'const contentWrapperNeedsTouchFallback =\n' +
        '    contentWrapperNeedsSurfaceTouchHandlerFallback(',
    );
    expect(stackSource).toContain(
      'const contentWrapperTouchKey = contentWrapperNeedsTouchFallback',
    );
    expect(stackSource).toContain("'screen-owned-wrapper-touch'");
    expect(stackSource).toContain('contentWrapperTouchKey,');
    expect(stackSource).toContain(
      'if (isSameRefreshKey && isCurrentTouchSurface && !forceRefresh) {',
    );
    expect(stackSource).toContain(
      'if (didGeometryChange) {\n' +
        '      const didUpdateScreenTouchOrigin =\n' +
        '        updateSurfaceTouchHandlerOriginsForView(screenView);',
    );
    expect(stackSource).toContain(
      'const didUpdateContentWrapperTouchOrigin =\n' +
        '        updateSurfaceTouchHandlerOriginsForView(contentWrapperView);',
    );
    expect(stackSource).toContain("'screen-touch-refresh-origin'");
    expect(stackSource).toContain(
      '`screen=${screenId} reason=same-key force=${forceRefresh ? 1 : 0}`',
    );
    expect(stackSource).toContain('forceReattachSurfaceTouchHandler = false');
    expect(stackSource).toContain(
      'forceReattachSurfaceTouchHandler &&\n' +
        '    touchHandler &&\n' +
        '    surfaceTouchHandlerIsAttachedToView(touchHandler, view)',
    );
    expect(stackSource).toContain(
      'detachSurfaceTouchHandlerFromView(touchHandler, view);',
    );
    expect(stackSource).toContain(
      'refreshScreenViewSurfaceTouchHandler(\n' +
        '    screenView,\n' +
        '    shouldOwnSurfaceTouchHandler,\n' +
        '    forceReattachSurfaceTouchHandler,\n' +
        '  );',
    );
    expect(stackSource).toContain(
      'refreshNativeScriptScreenViewSurfaceTouchHandler(\n' +
        '        contentWrapperView,\n' +
        '        shouldOwnSurfaceTouchHandler,\n' +
        '        forceReattachSurfaceTouchHandler,\n' +
        '      )',
    );
    expect(stackSource).toContain(
      '} reattach=${forceReattachSurfaceTouchHandler ? 1 : 0} has=${',
    );
    expect(stackSource).toContain(
      'refreshScreenSurfaceTouchHandlerIfNeeded(\n' +
        '      screenId,\n' +
        '      registry,\n' +
        '      touchScreenView,\n' +
        '      contentWrapperView,\n' +
        '      shouldForceTouchHandlerRefresh,\n' +
        '      false,\n' +
        '      forceTouchReattach,\n' +
        '    );',
    );
    expect(stackSource).toContain(
      'function contentWrapperNeedsSurfaceTouchHandlerFallback',
    );
    expect(stackSource).toContain('const isNativeScriptContentWrapper =');
    expect(stackSource).toContain('const allowsContentWrapperTouchFallback =');
    expect(stackSource).toContain(
      'if (isNativeScriptContentWrapper && !allowsContentWrapperTouchFallback) {',
    );
    expect(stackSource).toContain(
      'function detachRedundantContentWrapperSurfaceTouchHandler',
    );
    expect(stackSource).toContain('let didDetach = attachedHandlers.length > 0;');
    expect(stackSource).toContain(
      'return detachNativeScriptScreenViewSurfaceTouchHandler(contentWrapperView);',
    );
    expect(stackSource).toContain(
      'contentWrapperNeedsSurfaceTouchHandlerFallback(\n' +
        '      screenView,\n' +
        '      contentWrapperView,\n' +
        '    )',
    );
    expect(stackSource).toContain(
      'refreshNativeScriptScreenViewSurfaceTouchHandler(this);',
    );
    expect(stackSource).toContain(
      'registry.screenContentWrapperHostReadyKeys[screenId] = readyKey;',
    );
    expect(stackSource).toMatch(
      /registry\.screenContentWrapperVisibleDescendantCounts\[screenId\]\s*=\s*visibleDescendantCount \?\? 0;/,
    );
    expect(stackSource).toContain(
      'const stableHostViewHandle = stableReadyScreenHostHandle(controller);',
    );
    expect(stackSource).toContain(
      'previousHandle === resolvedHostViewHandle && wasContentReady',
    );
    expect(stackSource).toContain(
      'function screenHostViewHandleFromReadyEvent',
    );
    expect(stackSource).not.toContain('const eventChildrenViewHandle');
    expect(stackSource).not.toContain(
      'eventChildrenView?.__rnsNativeScriptScreenView === true',
    );
    expect(stackSource).not.toContain(
      'eventChildrenView?.__nativeScriptOwningViewController',
    );
    expect(stackSource).toContain(
      'return nativeObjectStableHandle(screenView);',
    );
    expect(stackSource).toContain(
      'const screenViewHandle = screenHostViewHandleFromReadyEvent(',
    );
    expect(stackSource).not.toContain(
      'const screenViewHandle = event.nativeEvent.nativeViewHandle;',
    );
    expect(stackSource).toContain(
      'const isContentReady = screenCanCertifyContentReady(screenId, registry);',
    );
    expect(stackSource).toContain(
      'contentWrapperIsMountedInScreenView(contentWrapperView, screenView)',
    );
    expect(stackSource).toContain(
      'didRefreshHostedContent &&\n' +
        '    screenId &&\n' +
        '    screenCanCertifyContentReady(screenId, registry)',
    );
    expect(stackSource).not.toContain('didRefreshHostedContent && screenId');
    expect(stackSource).toContain(
      'if (canUseScreenContent && !wasContentReady && stackId)',
    );
    expect(stackSource).toContain(
      'content-wrapper-host-ready-parent-reconcile',
    );
    expect(hostReadySource).toContain(
      'let didScheduleParentModalStack = false;',
    );
    expect(
      hostReadySource.indexOf('let didScheduleParentModalStack = false;'),
    ).toBeLessThan(
      hostReadySource.indexOf("'content-wrapper-host-ready-refresh'"),
    );
    expect(
      hostReadySource.indexOf('let didScheduleParentModalStack = false;'),
    ).toBeLessThan(
      hostReadySource.indexOf(
        'if (shouldDeferNativeStackHostReadyRefresh) {',
      ),
    );
    expect(stackSource).not.toContain(
      'content-wrapper-host-ready-parent-reconcile-check',
    );
    expect(stackSource).toContain(
      'if (ctx) {\n' +
        '      traceWorkletEvent(\n' +
        "        'content-wrapper-host-ready-reconcile',",
    );
    expect(stackSource).toContain(
      'isModalPresentation(props?.stackPresentation)',
    );
    expect(stackSource).toContain(
      'dispatchPresentedModalContentRefreshAfterPresentation(\n' +
        '      stackId,\n' +
        '      screenId,\n' +
        '      registry,\n' +
        '    );',
    );
    expect(hostReadySource).toContain(
      '} else if (\n' +
        '    canUseScreenContent &&\n' +
        '    parentPresentedModalId &&\n' +
        '    windowAttached === true\n' +
        '  ) {',
    );
    expect(hostReadySource).toContain(
      'refreshPresentedModalSubtreeTouchHandlers(\n' +
        '      [parentPresentedModalId],\n' +
        '      registry,\n' +
        '      true,\n' +
        '    );',
    );
    expect(stackSource).toContain('function nativeScriptScreenHostReadyOnUI');
    expect(stackSource).toContain(
      'Upstream RNSScreenStackView treats the mounted RNSScreen component view as\n  // enough native identity to update the UIKit stack',
    );
    const screenHostReadySource = stackSource.slice(
      stackSource.indexOf('function nativeScriptScreenHostReadyOnUI'),
      stackSource.indexOf(
        'export const __nativeScriptScreenHostReadyOnUIForTests',
      ),
    );
    expect(screenHostReadySource).toContain(
      'const hasPreparedNestedModalContent = modalScreenHasPreparedNestedContent(\n' +
        '    screenId,\n' +
        '    registry,\n' +
        '  );',
    );
    expect(screenHostReadySource).toContain(
      'if (!hasPreparedNestedModalContent) {\n' +
        '        dispatchPresentedModalContentRefreshAfterPresentation(\n' +
        '          parentId!,\n' +
        '          screenId,\n' +
        '          registry,\n' +
        '        );\n' +
        '      }\n' +
        '      return didBecomeReady;',
    );
    expect(stackSource).not.toContain(
      'const layoutPresentedModals = (globalThis as Record<string, any>)[\n        LAYOUT_PRESENTED_MODAL_CONTROLLERS_KEY\n      ];',
    );
    expect(stackSource).toContain('hostReady(controller, props, event)');
    expect(stackSource).toContain(
      'prepareControllerForStackExposure(\n' +
        '        navigationController,\n' +
        '        pushedScreenId,\n' +
        '        pushedController,\n' +
        '        registry,\n' +
        '        ctx,\n' +
        '        true,\n' +
        '        nextCount > 1,\n' +
        '        true,\n' +
        '        false,\n' +
        '        true,\n' +
        '      );',
    );
    const pushBranchStart = stackSource.indexOf(
      'const pushedScreenId = availableIds[nextCount - 1];',
    );
    const pushBranchSource = stackSource.slice(
      pushBranchStart,
      stackSource.indexOf('if (didAnimatePush)', pushBranchStart),
    );
    expect(pushBranchSource).toContain('didAnimatePush = animateStackPush(');
    expect(pushBranchSource).not.toContain(
      'prepareScreenHostedContentForNativeTransition(',
    );
    expect(pushBranchSource).not.toContain(
      'pushedScreenHasReadyHostDescendants',
    );
    expect(pushBranchSource).not.toContain(
      'pushedScreenHasVisibleHostedContent',
    );
    expect(pushBranchSource).not.toContain('shouldForcePushedContentRefresh');
    expect(stackSource).toContain(
      'function screenHasCommittedContentForNativeStack',
    );
    expect(stackSource).toContain(
      'const visibleDescendantCount =\n' +
        '    registry.screenContentWrapperVisibleDescendantCounts?.[screenId];',
    );
    expect(stackSource).toContain(
      "typeof visibleDescendantCount === 'number' &&\n" +
        '    visibleDescendantCount > 0',
    );
    expect(stackSource).not.toContain('reconcileStack-deferred-top-not-ready');
    expect(stackSource).toContain(
      'ensureTopStackContentWrapperMountedForModel(screenIds, registry);',
    );
    expect(stackSource).not.toMatch(
      /if\s*\(\s*!didPreparePushedContent\s*&&\s*!screenContentIsReady\(\s*pushedScreenId,\s*registry,?\s*\)\s*\)/,
    );
    const popBranchSource = stackSource.slice(
      stackSource.indexOf('if (isPop && nativeIds.length > nextCount)'),
      stackSource.indexOf('const previousTopScreenId ='),
    );
    expect(pushBranchSource).not.toContain('refreshScreenContentReady(');
    expect(popBranchSource).not.toContain('refreshScreenContentReady(');
    expect(screenContentWrapperSource).toContain(
      'nativeScriptScreenContentWrapperHostReadyOnUI(',
    );
    expect(stackSource).not.toContain('onHostReady={handleHostReady}');
  });

  it('keeps trace-only detail work out of normal navigation hot paths', () => {
    const traceEventsSource = stackSource.slice(
      stackSource.indexOf('function traceEventsEnabled'),
      stackSource.indexOf('let nextStackId'),
    );
    const touchRefreshSource = stackSource.slice(
      stackSource.indexOf(
        'function refreshNativeScriptScreenViewSurfaceTouchHandler',
      ),
      stackSource.indexOf(
        'function contentWrapperNeedsSurfaceTouchHandlerFallback',
      ),
    );
    const topReadySource = stackSource.slice(
      stackSource.indexOf('function stackTopScreenCanStartNativeUpdate'),
      stackSource.indexOf('function scheduledReconcileStack'),
    );
    const refreshHostSource = stackSource.slice(
      stackSource.indexOf('function refreshScreenContentWrapperHost'),
      stackSource.indexOf(
        'export const __nativeScriptRefreshScreenContentWrapperHostForTests',
      ),
    );
    const layoutSource = stackSource.slice(
      stackSource.indexOf('function layoutNavigationStackViews'),
      stackSource.indexOf(
        'globalThisObject[LAYOUT_NAVIGATION_STACK_VIEWS_KEY] =',
      ),
    );
    const setModalSource = stackSource.slice(
      stackSource.indexOf('function setModalViewControllers'),
      stackSource.indexOf('function reconcileNativeStackWithScreenStackHost'),
    );

    expect(traceEventsSource).toContain('__NSRNS_TRACE_EVENTS === true');
    expect(traceEventsSource).toContain('traceSlowWorkletsEnabled()');
    expect(touchRefreshSource).toContain(
      'if (view.window != null && traceEventsEnabled()) {',
    );
    expect(topReadySource).toContain(
      'const topRequiresContentWrapper = screenRequiresContentWrapperForReady(',
    );
    expect(topReadySource).toContain(
      'if (traceEventsEnabled()) {\n' +
        '    traceWorkletEvent(\n' +
        "      'stack-top-ready-check',",
    );
    expect(topReadySource).toContain(
      'const topContentIsReady = stackTopContentIsReady(screenIds, registry);',
    );
    expect(topReadySource).toContain(
      'return topCanStartFromControllerHost || topContentIsReady;',
    );
    expect(refreshHostSource).toContain(
      'if (traceEventsEnabled()) {\n' +
        '    const controllerHashForScreen = controllerHash(',
    );
    expect(layoutSource).toContain(
      'if (traceEventsEnabled()) {\n' +
        '    traceWorkletEvent(\n' +
        "      'layoutNavigationStackViews-enter',",
    );
    expectSourceToContain(
      layoutSource,
      'const owningStackId = nativeScriptStackIdForNavigationController(\n' +
        '    navigationController,\n' +
        '    registry,\n' +
        '  );',
    );
    expect(setModalSource).toContain(
      'if (traceEventsEnabled()) {\n' +
        '        traceWorkletEvent(\n' +
        "          'modal-present-call-state',",
    );
    expect(setModalSource).toContain(
      'invokeNativeSelector(\n' +
        '        previousController,\n' +
        "        'presentViewControllerAnimatedCompletion',\n" +
        "        'presentViewController:animated:completion:',\n" +
        '        presentedController,\n' +
        '        shouldAnimate,\n' +
        '        presentationCompletionBlock,\n' +
        '      );',
    );
    const finishPresentationIndex = setModalSource.indexOf(
      'const finishPresentation = () => {',
    );
    const presentCallIndex = setModalSource.indexOf(
      'invokeNativeSelector(\n' +
        '        previousController,\n' +
        "        'presentViewControllerAnimatedCompletion',",
    );
    expect(
      setModalSource.slice(finishPresentationIndex, presentCallIndex),
    ).toContain(
      'refreshPresentedModalContentAfterPresentation(\n' +
        '          stackId,\n' +
        '          nextScreenId,\n' +
        '          registry,\n' +
        '        );',
    );
  });

  it('deduplicates modal content-wrapper host refreshes by layout key', () => {
    const refreshSource = stackSource.slice(
      stackSource.indexOf('function refreshScreenContentWrapperHost'),
      stackSource.indexOf(
        'export const __nativeScriptRefreshScreenContentWrapperHostForTests',
      ),
    );
    const refreshKeySource = stackSource.slice(
      stackSource.indexOf('function screenContentWrapperRefreshKey'),
      stackSource.indexOf('function screenContentWrapperHostReadyKey'),
    );
    const hostReadyKeySource = stackSource.slice(
      stackSource.indexOf('function screenContentWrapperHostReadyKey'),
      stackSource.indexOf(
        'function screenShouldOwnSurfaceTouchHandlerDuringTransition',
      ),
    );

    expect(stackSource).toContain('screenContentWrapperRefreshKeys');
    expect(stackSource).toContain('function screenContentWrapperRefreshKey');
    expect(stackSource.indexOf('function viewGeometryLayoutKey')).toBeLessThan(
      stackSource.indexOf('function screenContentWrapperRefreshKey'),
    );
    expect(refreshKeySource).toContain(
      'viewGeometryLayoutKey(contentWrapperView)',
    );
    expect(refreshKeySource).toContain('viewGeometryLayoutKey(controllerView)');
    expect(refreshKeySource).not.toContain('viewLayoutKey(contentWrapperView)');
    expect(refreshKeySource).not.toContain("].join('|')");
    expect(hostReadyKeySource).toContain(
      "const visibleDescendantCountKey =\n    typeof visibleDescendantCount === 'number'\n      ? '' + visibleDescendantCount\n      : '0';",
    );
    expect(hostReadyKeySource).not.toContain("].join('|')");
    expect(hostReadyKeySource).not.toContain('String(');
    expect(stackSource.indexOf('function screenContentIsReady')).toBeLessThan(
      stackSource.indexOf('function refreshScreenContentWrapperHost'),
    );
    expect(refreshSource).toContain('alreadyRefreshedForLayout');
    expect(refreshSource).toContain('didNormalizeAfterHostedLayout');
    expect(refreshSource).toContain(
      'content-wrapper-host-refresh-normalized',
    );
    expect(refreshSource).toContain(
      'return didRefresh || didNormalizeAfterHostedLayout;',
    );
    expect(stackSource).toContain(
      'content-wrapper-touch-refresh-normalized',
    );
    expect(refreshSource).toContain(
      'refreshHost &&\n    !skipHostedRefresh &&\n    !alreadyRefreshedForLayout &&',
    );
    expect(refreshSource).toContain('skipHostedRefresh = false');
    expect(refreshSource).toContain(
      '!skipHostedRefresh &&\n    (forceLayoutScan ||',
    );
    expect(stackSource).not.toContain("forceLayoutScan ? 'force' : 'normal'");
    expect(refreshSource).toContain('refreshKeys[screenId] === refreshKey');
    expect(refreshSource).not.toContain(
      '!forceLayoutScan &&\n' +
        '    !forceTouchRefresh &&\n' +
        '    refreshKeys[screenId] === refreshKey',
    );
    expect(stackSource).toContain('shouldSkipReadySameWrapperRefresh');
    expect(stackSource).toContain('shouldSkipOffWindowCommittedWrapperRefresh');
    expect(stackSource).toContain('const isModalHeaderScreen =');
    expect(stackSource).toContain('(!isModalScreen || isModalHeaderScreen)');
    expect(stackSource).not.toContain('didMissDetachedModalHeaderDismissal');
    expect(stackSource).toContain(
      'if (shouldSkipOffWindowCommittedWrapperRefresh) {',
    );
    expect(stackSource).toContain(
      'content-wrapper-host-ready-skip-offwindow-committed',
    );
    expect(stackSource).toContain('modalHeader=${');
    expect(
      stackSource.indexOf('shouldSkipOffWindowCommittedWrapperRefresh'),
    ).toBeLessThan(stackSource.indexOf("'content-wrapper-host-ready-refresh'"));
    const detachedHeaderDismissalCompletionIndex = stackSource.indexOf(
      'const didCompleteDetachedHeaderDismissal =\n' +
        '    completePresentedModalDismissalForDetachedHeaderIfNeeded(',
    );
    const offWindowCommittedSkipIndex = stackSource.indexOf(
      'if (shouldSkipOffWindowCommittedWrapperRefresh) {',
    );
    expect(detachedHeaderDismissalCompletionIndex).toBeGreaterThan(-1);
    expect(offWindowCommittedSkipIndex).toBeGreaterThan(-1);
    expect(
      detachedHeaderDismissalCompletionIndex,
    ).toBeLessThan(offWindowCommittedSkipIndex);
    expect(stackSource).toContain(
      'refreshKeys[screenId] = screenContentWrapperRefreshKey(\n' +
        '        screenId,\n' +
        '        registry,\n' +
        '        contentWrapperView,\n' +
        '        false,\n' +
        '      );',
    );
    expect(
      stackSource.indexOf(
        'refreshKeys[screenId] = screenContentWrapperRefreshKey(',
      ),
    ).toBeLessThan(
      stackSource.indexOf("'content-wrapper-host-ready-skip-committed'"),
    );
    expect(stackSource).toContain(
      'registry.screenContentWrapperRefreshKeys[screenId] = undefined;',
    );
  });

  it('skips hosted wrapper layout scans when the wrapper layout key is unchanged', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const globalObject = global as Record<string, unknown>;
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const previousLayoutHostedSubviewChain =
      globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
    const refreshUIKitHostView = jest.fn(() => true);
    const layoutHostedSubviewChain = jest.fn();

    NativeScriptRuntime.refreshUIKitHostViewDirectOwner = refreshUIKitHostView;
    globalObject.__rnsNativeScriptLayoutHostedSubviewChain =
      layoutHostedSubviewChain;

    const screenView: any = {
      bounds: { origin: { x: 0, y: 0 }, size: { width: 402, height: 874 } },
      frame: { origin: { x: 0, y: 0 }, size: { width: 402, height: 874 } },
      refreshSurfaceTouchHandler: jest.fn(),
    };
    const contentWrapperView: any = {
      alpha: 1,
      autoresizingMask: 18,
      bounds: { origin: { x: 0, y: 0 }, size: { width: 402, height: 874 } },
      frame: { origin: { x: 0, y: 0 }, size: { width: 402, height: 874 } },
      hidden: false,
      superview: screenView,
      userInteractionEnabled: true,
    };
    const registry: any = {
      screenContentReady: { screen: true },
      screenContentWrapperHostHandles: { screen: 'host' },
      screenContentWrapperRefreshKeys: {},
      screenContentWrapperViews: { screen: contentWrapperView },
      screenHostHandles: { screen: 'screen-host' },
      screenSurfaceTouchRefreshKeys: {},
      screens: { screen: { view: screenView } },
    };

    try {
      __nativeScriptRefreshScreenContentWrapperHostForTests('screen', registry);
      expect(refreshUIKitHostView).toHaveBeenCalled();
      expect(layoutHostedSubviewChain).toHaveBeenCalledTimes(1);

      refreshUIKitHostView.mockImplementation(() => {
        throw new Error('unchanged wrapper host should not refresh');
      });
      layoutHostedSubviewChain.mockClear();
      screenView.refreshSurfaceTouchHandler.mockClear();

      __nativeScriptRefreshScreenContentWrapperHostForTests('screen', registry);

      expect(screenView.refreshSurfaceTouchHandler).not.toHaveBeenCalled();
      expect(layoutHostedSubviewChain).not.toHaveBeenCalled();

      refreshUIKitHostView.mockImplementation(() => true);
      __nativeScriptRefreshScreenContentWrapperHostForTests(
        'screen',
        registry,
        true,
        true,
        true,
      );

      expect(refreshUIKitHostView).toHaveBeenCalled();
      expect(layoutHostedSubviewChain).toHaveBeenCalledTimes(1);
    } finally {
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostView;

      if (previousLayoutHostedSubviewChain === undefined) {
        delete globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
      } else {
        globalObject.__rnsNativeScriptLayoutHostedSubviewChain =
          previousLayoutHostedSubviewChain;
      }
    }
  });

  it('does not force duplicate touch refreshes for stable header subview wrapper commits', () => {
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };
    const screenView: any = {
      bounds: frame,
      frame,
      refreshSurfaceTouchHandler: jest.fn(),
      subviews: [],
      superview: {},
      window: {},
    };
    const contentWrapperView: any = {
      alpha: 1,
      autoresizingMask: 18,
      bounds: frame,
      frame,
      hidden: false,
      subviews: [],
      superview: screenView,
      userInteractionEnabled: true,
      window: {},
    };
    screenView.subviews = [contentWrapperView];

    const registry: any = {
      screenContentReady: { screen: true },
      screenContentWrapperHostHandles: { screen: 'host' },
      screenContentWrapperHostReadyKeys: { screen: 'ready' },
      screenContentWrapperRefreshKeys: {},
      screenContentWrapperViews: { screen: contentWrapperView },
      screenHostHandles: { screen: 'screen-host' },
      screenParents: {},
      screenSurfaceTouchGeometryKeys: {},
      screenSurfaceTouchRefreshKeys: {},
      screens: { screen: { view: screenView } },
      stackTransitioning: {},
    };

    __nativeScriptRefreshScreenContentWrapperHostForTests(
      'screen',
      registry,
      false,
      true,
      true,
      false,
      'header-subview-update',
    );
    expect(screenView.refreshSurfaceTouchHandler).toHaveBeenCalledTimes(1);

    screenView.refreshSurfaceTouchHandler.mockClear();
    __nativeScriptRefreshScreenContentWrapperHostForTests(
      'screen',
      registry,
      false,
      true,
      true,
      false,
      'header-subview-update',
    );
    expect(screenView.refreshSurfaceTouchHandler).not.toHaveBeenCalled();

    const resizedFrame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 401 },
    };
    contentWrapperView.frame = resizedFrame;
    contentWrapperView.bounds = resizedFrame;
    __nativeScriptRefreshScreenContentWrapperHostForTests(
      'screen',
      registry,
      false,
      true,
      true,
      false,
      'header-subview-update',
    );
    expect(screenView.refreshSurfaceTouchHandler).toHaveBeenCalledTimes(1);
  });

  it('reattaches touch handlers for stable post-transition wrapper refreshes', () => {
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };
    const screenView: any = {
      bounds: frame,
      frame,
      refreshSurfaceTouchHandler: jest.fn(),
      subviews: [],
      superview: {},
      window: {},
    };
    const contentWrapperView: any = {
      alpha: 1,
      autoresizingMask: 18,
      bounds: frame,
      frame,
      hidden: false,
      subviews: [],
      superview: screenView,
      userInteractionEnabled: true,
      window: {},
    };
    screenView.subviews = [contentWrapperView];

    const registry: any = {
      screenContentReady: { screen: true },
      screenContentWrapperHostHandles: { screen: 'host' },
      screenContentWrapperHostReadyKeys: { screen: 'ready' },
      screenContentWrapperRefreshKeys: {},
      screenContentWrapperViews: { screen: contentWrapperView },
      screenHostHandles: { screen: 'screen-host' },
      screenParents: {},
      screenSurfaceTouchGeometryKeys: {},
      screenSurfaceTouchRefreshKeys: {},
      screens: { screen: { view: screenView } },
      stackTransitioning: {},
    };

    __nativeScriptRefreshScreenContentWrapperHostForTests(
      'screen',
      registry,
      false,
      true,
      true,
      false,
      'refresh-screen-wrapper-hosts',
      true,
    );
    expect(screenView.refreshSurfaceTouchHandler).toHaveBeenCalledTimes(1);

    __nativeScriptRefreshScreenContentWrapperHostForTests(
      'screen',
      registry,
      false,
      true,
      true,
      false,
      'refresh-screen-wrapper-hosts',
      true,
    );
    expect(screenView.refreshSurfaceTouchHandler).toHaveBeenCalledTimes(2);
  });

  it('keeps child-hosted content wrappers visible instead of treating them as empty shells', () => {
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };
    const hostedLeaf: any = {
      alpha: 1,
      description: 'RCTParagraphComponentView',
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
    };
    const wrapperChildHost: any = {
      alpha: 1,
      autoresizingMask: 0,
      description: 'UIView',
      frame,
      hidden: false,
      subviews: [hostedLeaf],
      userInteractionEnabled: true,
    };
    const separateHostedContent: any = {
      alpha: 1,
      description: 'UIView',
      hidden: false,
      subviews: [hostedLeaf],
      userInteractionEnabled: true,
    };
    const contentWrapperView: any = {
      alpha: 1,
      autoresizingMask: 0,
      bounds: frame,
      frame,
      hidden: false,
      subviews: [wrapperChildHost],
      userInteractionEnabled: false,
    };
    contentWrapperView.__rnsNativeScriptScreenContentWrapperChildrenView =
      wrapperChildHost;
    wrapperChildHost.superview = contentWrapperView;

    const screenView: any = {
      __rnsNativeScriptScreenView: true,
      bounds: frame,
      bringSubviewToFront: jest.fn((view: any) => {
        screenView.subviews = screenView.subviews.filter(
          (subview: any) => subview !== view,
        );
        screenView.subviews.push(view);
        view.superview = screenView;
      }),
      frame,
      refreshSurfaceTouchHandler: jest.fn(),
      sendSubviewToBack: jest.fn(),
      subviews: [contentWrapperView, separateHostedContent],
    };
    contentWrapperView.superview = screenView;
    separateHostedContent.superview = screenView;

    const registry: any = {
      screenContentReady: { screen: true },
      screenContentWrapperHostHandles: {},
      screenContentWrapperRefreshKeys: {},
      screenContentWrapperViews: { screen: contentWrapperView },
      screenHostHandles: {},
      screenSurfaceTouchRefreshKeys: {},
      screens: { screen: { view: screenView } },
    };

    __nativeScriptRefreshScreenContentWrapperHostForTests(
      'screen',
      registry,
      false,
      true,
      true,
    );

    expect(contentWrapperView.__nativeScriptEmptyContentWrapperShell).not.toBe(
      true,
    );
    expect(contentWrapperView.userInteractionEnabled).toBe(true);
    expect(screenView.bringSubviewToFront).toHaveBeenCalledWith(
      contentWrapperView,
    );
    expect(screenView.sendSubviewToBack).not.toHaveBeenCalled();
    expect(screenView.subviews[screenView.subviews.length - 1]).toBe(
      contentWrapperView,
    );
  });

  it('restores active screen body hosting after header subview commits', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const globalObject = global as Record<string, unknown>;
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const previousNativeObjectFromHandle = (NativeScriptRuntime as any)
      .nativeObjectFromHandle;
    const previousLayoutHostedSubviewChain =
      globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
    const refreshUIKitHostView = jest.fn(() => true);
    const layoutHostedSubviewChain = jest.fn();
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };
    const hostedLeaf: any = {
      alpha: 1,
      description: 'RCTViewComponentView',
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
    };
    const screenView: any = {
      __rnsNativeScriptScreenView: true,
      addSubview: jest.fn((child: any) => {
        screenView.subviews.push(child);
        child.superview = screenView;
      }),
      bounds: frame,
      frame,
      gestureRecognizers: [],
      hidden: true,
      refreshSurfaceTouchHandler: jest.fn(),
      subviews: [],
      userInteractionEnabled: false,
      window: {},
    };
    const staleWrapperView: any = {
      alpha: 1,
      bounds: frame,
      description: 'RNSScreenContentWrapper.NativeScript',
      frame,
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
    };
    const liveWrapperView: any = {
      alpha: 0,
      bounds: frame,
      description: 'RNSScreenContentWrapper.NativeScript',
      frame,
      hidden: true,
      subviews: [hostedLeaf],
      userInteractionEnabled: false,
      window: {},
    };
    const controller: any = {
      view: screenView,
    };
    const navigationController: any = {
      topViewController: controller,
      transitionCoordinator: null,
      view: {
        bounds: frame,
        frame,
      },
      viewControllers: [controller],
    };
    const registry: any = {
      screenContentReady: { detail: true },
      screenContentWrapperHostHandles: { detail: 'live-wrapper' },
      screenContentWrapperHostReadyKeys: {},
      screenContentWrapperRefreshKeys: {},
      screenContentWrapperViews: { detail: staleWrapperView },
      screenContentWrapperVisibleDescendantCounts: { detail: 1 },
      screenHostHandles: { detail: 'screen-host' },
      screenHostRefreshKeys: {},
      screenParents: { detail: 'stack' },
      screenProps: { detail: { screenId: 'detail' } },
      screenSurfaceTouchRefreshKeys: {},
      screens: { detail: controller },
      stackActiveScreenIds: { stack: ['root', 'detail'] },
      stackContexts: { stack: {} },
      stackTransitioning: {},
      stacks: { stack: navigationController },
    };

    NativeScriptRuntime.refreshUIKitHostViewDirectOwner = refreshUIKitHostView;
    (NativeScriptRuntime as any).nativeObjectFromHandle = jest.fn(
      (handle: string) => {
        if (handle === 'screen-host') {
          return screenView;
        }

        if (handle === 'live-wrapper') {
          return liveWrapperView;
        }

        return null;
      },
    );
    globalObject.__rnsNativeScriptLayoutHostedSubviewChain =
      layoutHostedSubviewChain;

    try {
      expect(
        __nativeScriptRestoreActiveScreenContentAfterHeaderSubviewUpdateForTests(
          'detail',
          registry,
        ),
      ).toBe(true);

      expect(registry.screenContentWrapperViews.detail).toBe(liveWrapperView);
      expect(screenView.hidden).toBe(false);
      expect(screenView.userInteractionEnabled).toBe(true);
      expect(liveWrapperView.hidden).toBe(false);
      expect(liveWrapperView.alpha).toBe(1);
      expect(liveWrapperView.userInteractionEnabled).toBe(true);
      expect(liveWrapperView.superview).toBe(screenView);
      expect(screenView.addSubview).toHaveBeenCalledWith(liveWrapperView);
      expect(refreshUIKitHostView).toHaveBeenCalledWith(liveWrapperView);
      expect(layoutHostedSubviewChain).toHaveBeenCalled();
      expect(screenView.refreshSurfaceTouchHandler).not.toHaveBeenCalled();

      refreshUIKitHostView.mockClear();
      layoutHostedSubviewChain.mockClear();
      screenView.refreshSurfaceTouchHandler.mockClear();
      registry.stackActiveScreenIds.stack = ['root', 'detail', 'other'];

      expect(
        __nativeScriptRestoreActiveScreenContentAfterHeaderSubviewUpdateForTests(
          'detail',
          registry,
        ),
      ).toBe(false);
      expect(refreshUIKitHostView).not.toHaveBeenCalled();
      expect(layoutHostedSubviewChain).not.toHaveBeenCalled();
      expect(screenView.refreshSurfaceTouchHandler).not.toHaveBeenCalled();
    } finally {
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostView;

      if (previousNativeObjectFromHandle === undefined) {
        delete (NativeScriptRuntime as any).nativeObjectFromHandle;
      } else {
        (NativeScriptRuntime as any).nativeObjectFromHandle =
          previousNativeObjectFromHandle;
      }

      if (previousLayoutHostedSubviewChain === undefined) {
        delete globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
      } else {
        globalObject.__rnsNativeScriptLayoutHostedSubviewChain =
          previousLayoutHostedSubviewChain;
      }
    }
  });

  it('refreshes first-ready content wrappers but skips safe native stack transition refreshes', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const globalObject = global as Record<string, any>;
    const previousRegistry = globalObject.__rnsNativeScriptStackRegistry;
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const previousNativeObjectFromHandle = (NativeScriptRuntime as any)
      .nativeObjectFromHandle;
    const previousLayoutHostedSubviewChain =
      globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
    const previousReconcileSelectedTab =
      globalObject.__rnsNativeScriptReconcileSelectedTabControllerView;
    const refreshUIKitHostView = jest.fn(() => true);
    const layoutHostedSubviewChain = jest.fn();
    const reconcileSelectedTab = jest.fn();
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };

    function createReadyStackRegistry(
      hasCoordinator: boolean,
      activeScreenIds = ['root', 'screen'],
    ) {
      const hostedLeaf: any = {
        alpha: 1,
        description: 'RCTViewComponentView',
        hidden: false,
        subviews: [],
        userInteractionEnabled: true,
      };
      const screenView: any = {
        bounds: frame,
        frame,
        refreshSurfaceTouchHandler: jest.fn(),
        subviews: [],
        window: {},
      };
      const contentWrapperView: any = {
        alpha: 1,
        autoresizingMask: 18,
        bounds: frame,
        description: 'RNSScreenContentWrapper.NativeScript',
        frame,
        hidden: false,
        subviews: [hostedLeaf],
        superview: screenView,
        userInteractionEnabled: true,
        window: {},
      };
      screenView.subviews = [contentWrapperView];
      const tabController: any = {
        hash: 'tab',
        selectedViewController: null,
        tabBar: { hash: 'tab-bar', window: {} },
        view: { hash: 'tab-view', window: {} },
      };
      const navigationView: any = {
        bounds: frame,
        frame,
        hash: 'nav-view',
        setNeedsLayout: jest.fn(),
        window: {},
      };
      const navigationController: any = {
        topViewController: undefined,
        tabBarController: tabController,
        transitionCoordinator: hasCoordinator ? {} : null,
        view: navigationView,
        viewControllers: [],
      };
      tabController.selectedViewController = navigationController;
      const screenController: any = {
        transitionCoordinator: null,
        view: screenView,
      };
      navigationController.topViewController = screenController;
      navigationController.viewControllers = [screenController];
      navigationController.__nativeScriptStackContainerView = navigationView;
      navigationController.__nativeScriptStackId = 'stack';
      navigationView.__nativeScriptNavigationController = navigationController;
      navigationView.__rnsNativeScriptTabsController = tabController;
      navigationView.__rnsNativeScriptTabsSelectedController =
        navigationController;

      return {
        contentWrapperView,
        registry: {
          screenContentReady: { screen: true },
          screenContentWrapperHostHandles: { screen: 'wrapper-handle' },
          screenContentWrapperHostReadyKeys: {},
          screenContentWrapperRefreshKeys: {},
          screenContentWrapperViews: { screen: contentWrapperView },
          screenHostHandles: { screen: 'screen-host' },
          screenParents: { screen: 'stack' },
          screenProps: { screen: { screenId: 'screen' } },
          screenSurfaceTouchRefreshKeys: {},
          screens: { screen: screenController },
          stackActiveScreenIds: { stack: activeScreenIds },
          stackContexts: { stack: {} },
          stackPendingReconcileKeys: {},
          stacks: { stack: navigationController },
          stackTransitioning: { stack: true },
        },
      };
    }

    NativeScriptRuntime.refreshUIKitHostViewDirectOwner = refreshUIKitHostView;
    (NativeScriptRuntime as any).nativeObjectFromHandle = jest.fn(
      (handle: string) =>
        handle === 'wrapper-handle'
          ? globalObject.__rnsNativeScriptStackRegistry
              ?.screenContentWrapperViews?.screen
          : null,
    );
    globalObject.__rnsNativeScriptLayoutHostedSubviewChain =
      layoutHostedSubviewChain;
    globalObject.__rnsNativeScriptReconcileSelectedTabControllerView =
      reconcileSelectedTab;

    try {
      const firstReadyTransition = createReadyStackRegistry(true);
      firstReadyTransition.registry.screenContentReady.screen = false;
      globalObject.__rnsNativeScriptStackRegistry =
        firstReadyTransition.registry;

      expect(
        nativeScriptScreenContentWrapperHostReadyOnUI(
          'screen',
          'wrapper-handle',
          1,
          true,
        ),
      ).toBe(true);
      notifyNativeScriptScreenContentWrapperFrame(
        'screen',
        frame,
        firstReadyTransition.contentWrapperView,
      );

      expect(refreshUIKitHostView).not.toHaveBeenCalled();
      expect(layoutHostedSubviewChain).not.toHaveBeenCalled();
      expect(reconcileSelectedTab).not.toHaveBeenCalled();
      expect(
        (firstReadyTransition.registry.stackPendingReconcileKeys as any).stack,
      ).toBe(['root', 'screen'].join('\u001f'));

      refreshUIKitHostView.mockClear();
      layoutHostedSubviewChain.mockClear();
      reconcileSelectedTab.mockClear();

      const activeTransition = createReadyStackRegistry(true);
      globalObject.__rnsNativeScriptStackRegistry = activeTransition.registry;

      expect(
        nativeScriptScreenContentWrapperHostReadyOnUI(
          'screen',
          'wrapper-handle',
          1,
          true,
        ),
      ).toBe(true);
      notifyNativeScriptScreenContentWrapperFrame(
        'screen',
        frame,
        activeTransition.contentWrapperView,
      );

      expect(refreshUIKitHostView).not.toHaveBeenCalled();
      expect(layoutHostedSubviewChain).not.toHaveBeenCalled();
      expect(reconcileSelectedTab).not.toHaveBeenCalled();
      expect(
        (activeTransition.registry.stackPendingReconcileKeys as any).stack,
      ).toBe(['root', 'screen'].join('\u001f'));

      const outgoingTransition = createReadyStackRegistry(true, [
        'root',
        'other',
      ]);
      globalObject.__rnsNativeScriptStackRegistry = outgoingTransition.registry;
      refreshUIKitHostView.mockClear();
      layoutHostedSubviewChain.mockClear();
      reconcileSelectedTab.mockClear();

      nativeScriptScreenContentWrapperHostReadyOnUI(
        'screen',
        'wrapper-handle',
        1,
        true,
      );

      expect(refreshUIKitHostView).not.toHaveBeenCalled();
      expect(layoutHostedSubviewChain).not.toHaveBeenCalled();
      expect(reconcileSelectedTab).not.toHaveBeenCalled();

      const preAnimation = createReadyStackRegistry(false);
      preAnimation.registry.stackTransitioning.stack = false;
      globalObject.__rnsNativeScriptStackRegistry = preAnimation.registry;
      refreshUIKitHostView.mockClear();
      layoutHostedSubviewChain.mockClear();

      nativeScriptScreenContentWrapperHostReadyOnUI(
        'screen',
        'wrapper-handle',
        1,
        true,
      );

      expect(refreshUIKitHostView).not.toHaveBeenCalled();
      expect(layoutHostedSubviewChain).not.toHaveBeenCalled();
      expect(reconcileSelectedTab).toHaveBeenCalledTimes(1);

      const nonTopScreen = createReadyStackRegistry(false, ['root', 'other']);
      globalObject.__rnsNativeScriptStackRegistry = nonTopScreen.registry;
      refreshUIKitHostView.mockClear();
      layoutHostedSubviewChain.mockClear();
      reconcileSelectedTab.mockClear();

      nativeScriptScreenContentWrapperHostReadyOnUI(
        'screen',
        'wrapper-handle',
        1,
        true,
      );

      expect(refreshUIKitHostView).toHaveBeenCalledWith(
        nonTopScreen.contentWrapperView,
      );
      expect(layoutHostedSubviewChain).toHaveBeenCalledTimes(1);
      expect(reconcileSelectedTab).not.toHaveBeenCalled();
    } finally {
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostView;

      if (previousNativeObjectFromHandle === undefined) {
        delete (NativeScriptRuntime as any).nativeObjectFromHandle;
      } else {
        (NativeScriptRuntime as any).nativeObjectFromHandle =
          previousNativeObjectFromHandle;
      }

      if (previousLayoutHostedSubviewChain === undefined) {
        delete globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
      } else {
        globalObject.__rnsNativeScriptLayoutHostedSubviewChain =
          previousLayoutHostedSubviewChain;
      }

      if (previousReconcileSelectedTab === undefined) {
        delete globalObject.__rnsNativeScriptReconcileSelectedTabControllerView;
      } else {
        globalObject.__rnsNativeScriptReconcileSelectedTabControllerView =
          previousReconcileSelectedTab;
      }

      if (previousRegistry === undefined) {
        delete globalObject.__rnsNativeScriptStackRegistry;
      } else {
        globalObject.__rnsNativeScriptStackRegistry = previousRegistry;
      }
    }
  });

  it('reconciles the containing selected tab when nested stack content becomes ready', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const globalObject = global as Record<string, any>;
    const previousRegistry = globalObject.__rnsNativeScriptStackRegistry;
    const previousReconcileSelectedTab =
      globalObject.__rnsNativeScriptReconcileSelectedTabControllerView;
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const previousNativeObjectFromHandle = (NativeScriptRuntime as any)
      .nativeObjectFromHandle;
    const previousLayoutHostedSubviewChain =
      globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
    const reconcileSelectedTab = jest.fn();
    const refreshUIKitHostView = jest.fn(() => true);
    const layoutHostedSubviewChain = jest.fn();
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };
    const tabController: any = {
      hash: 'tab',
      selectedViewController: null,
      tabBar: { hash: 'tab-bar', window: {} },
      view: { hash: 'tab-view', window: {} },
    };
    const navigationView: any = {
      bounds: frame,
      frame,
      hash: 'nav-view',
      setNeedsLayout: jest.fn(),
      superview: { hash: 'tab-selected-root' },
      window: {},
    };
    const navigationController: any = {
      hash: 'nav',
      parentViewController: tabController,
      tabBarController: tabController,
      topViewController: null,
      view: navigationView,
      viewControllers: [],
    };
    tabController.selectedViewController = navigationController;
    const hostedLeaf: any = {
      alpha: 1,
      bounds: frame,
      description: 'RCTViewComponentView',
      frame,
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
      window: {},
    };
    const screenView: any = {
      __rnsNativeScriptScreenView: true,
      bounds: frame,
      frame,
      hash: 'screen-host',
      setNeedsLayout: jest.fn(),
      subviews: [],
      userInteractionEnabled: true,
      window: {},
    };
    const contentWrapperView: any = {
      __rnsNativeScriptScreenContentWrapperChildrenView: hostedLeaf,
      __rnsNativeScriptScreenContentWrapperRootView: true,
      alpha: 1,
      bounds: frame,
      frame,
      hash: 'wrapper-handle',
      hidden: false,
      subviews: [hostedLeaf],
      superview: screenView,
      userInteractionEnabled: true,
      window: {},
    };
    const screenController: any = {
      __nativeScriptScreenId: 'screen',
      __nativeScriptScreenView: screenView,
      view: screenView,
    };
    const registry: any = {
      screenContentReady: {},
      screenContentWrapperHostHandles: {},
      screenContentWrapperHostReadyKeys: {},
      screenContentWrapperRefreshKeys: {},
      screenContentWrapperViews: {},
      screenContentWrapperVisibleDescendantCounts: {},
      screenHostHandles: { screen: 'screen-host' },
      screenParents: { screen: 'stack' },
      screenProps: { screen: { screenId: 'screen' } },
      screenSurfaceTouchRefreshKeys: {},
      screens: { screen: screenController },
      stackActiveScreenIds: { stack: ['screen'] },
      stackContexts: { stack: {} },
      stackNativeKeys: { stack: 'screen' },
      stackPendingReconcileKeys: {},
      stacks: { stack: navigationController },
      stackTransitioning: {},
      stackTransitionTokens: { stack: 1 },
    };

    screenView.subviews = [contentWrapperView];
    navigationController.topViewController = screenController;
    navigationController.viewControllers = [screenController];
    navigationController.__nativeScriptStackContainerView = navigationView;
    navigationController.__nativeScriptStackId = 'stack';
    navigationView.__nativeScriptNavigationController = navigationController;
    navigationView.__rnsNativeScriptTabsController = tabController;
    navigationView.__rnsNativeScriptTabsSelectedController =
      navigationController;

    NativeScriptRuntime.refreshUIKitHostViewDirectOwner = refreshUIKitHostView;
    (NativeScriptRuntime as any).nativeObjectFromHandle = jest.fn(
      (handle: string) => {
        if (handle === 'wrapper-handle') {
          return contentWrapperView;
        }

        if (handle === 'screen-host') {
          return screenView;
        }

        return null;
      },
    );
    globalObject.__rnsNativeScriptLayoutHostedSubviewChain =
      layoutHostedSubviewChain;
    globalObject.__rnsNativeScriptReconcileSelectedTabControllerView =
      reconcileSelectedTab;
    globalObject.__rnsNativeScriptStackRegistry = registry;

    try {
      notifyNativeScriptScreenContentWrapperFrame(
        'screen',
        frame,
        contentWrapperView,
      );

      expect(reconcileSelectedTab).toHaveBeenCalledTimes(1);
      expect(reconcileSelectedTab.mock.calls[0]?.slice(0, 2)).toEqual([
        tabController,
        navigationController,
      ]);
      expect(navigationView.setNeedsLayout).toHaveBeenCalled();
      expect(tabController.view.accessibilityElements).toEqual([
        screenView,
        tabController.tabBar,
      ]);

      reconcileSelectedTab.mockClear();
      navigationView.setNeedsLayout.mockClear();
      navigationView.__nativeScriptContainingTabContentReadyReconcileKey =
        undefined;
      registry.stackNativeKeys.stack = undefined;
      registry.stackPendingReconcileKeys.stack = 'screen';

      expect(
        nativeScriptScreenContentWrapperHostReadyOnUI(
          'screen',
          'wrapper-handle',
          1,
          true,
        ),
      ).toBe(true);

      expect(reconcileSelectedTab).toHaveBeenCalledTimes(1);
      expect(reconcileSelectedTab.mock.calls[0]?.slice(0, 2)).toEqual([
        tabController,
        navigationController,
      ]);
      expect(navigationView.setNeedsLayout).toHaveBeenCalled();
    } finally {
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostView;

      if (previousNativeObjectFromHandle === undefined) {
        delete (NativeScriptRuntime as any).nativeObjectFromHandle;
      } else {
        (NativeScriptRuntime as any).nativeObjectFromHandle =
          previousNativeObjectFromHandle;
      }

      if (previousLayoutHostedSubviewChain === undefined) {
        delete globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
      } else {
        globalObject.__rnsNativeScriptLayoutHostedSubviewChain =
          previousLayoutHostedSubviewChain;
      }

      if (previousReconcileSelectedTab === undefined) {
        delete globalObject.__rnsNativeScriptReconcileSelectedTabControllerView;
      } else {
        globalObject.__rnsNativeScriptReconcileSelectedTabControllerView =
          previousReconcileSelectedTab;
      }

      if (previousRegistry === undefined) {
        delete globalObject.__rnsNativeScriptStackRegistry;
      } else {
        globalObject.__rnsNativeScriptStackRegistry = previousRegistry;
      }
    }
  });

  it('does not refresh an already committed top wrapper for descendant-count churn', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const globalObject = global as Record<string, any>;
    const previousRegistry = globalObject.__rnsNativeScriptStackRegistry;
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const previousNativeObjectFromHandle = (NativeScriptRuntime as any)
      .nativeObjectFromHandle;
    const previousLayoutHostedSubviewChain =
      globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
    const previousReconcileStack = globalObject.__rnsNativeScriptReconcileStack;
    const previousReconcileStackFromExternalHost =
      globalObject.__rnsNativeScriptReconcileStackFromExternalHost;
    const refreshUIKitHostView = jest.fn(() => true);
    const layoutHostedSubviewChain = jest.fn();
    const reconcileStack = jest.fn();
    const reconcileStackFromExternalHost = jest.fn(() => true);
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };
    const hostedLeaf: any = {
      alpha: 1,
      description: 'RCTViewComponentView',
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
      window: {},
    };
    const screenView: any = {
      __rnsNativeScriptScreenView: true,
      bounds: frame,
      frame,
      hash: 'screen-host',
      subviews: [],
      userInteractionEnabled: true,
      window: {},
    };
    const contentWrapperView: any = {
      alpha: 1,
      bounds: frame,
      description: 'RNSScreenContentWrapper.NativeScript',
      frame,
      hash: 'wrapper-handle',
      hidden: false,
      subviews: [hostedLeaf],
      superview: screenView,
      userInteractionEnabled: true,
      window: {},
    };
    const controller: any = {
      __nativeScriptScreenId: 'screen',
      __nativeScriptScreenView: screenView,
      view: screenView,
    };
    const registry: any = {
      screenContentReady: { screen: true },
      screenContentWrapperHostHandles: { screen: 'wrapper-handle' },
      screenContentWrapperHostReadyKeys: { screen: 'wrapper-handle|1|window' },
      screenContentWrapperRefreshKeys: {},
      screenContentWrapperViews: { screen: contentWrapperView },
      screenContentWrapperVisibleDescendantCounts: { screen: 1 },
      screenHostHandles: { screen: 'screen-host' },
      screenStableReadyExposureKeys: {},
      screenParents: { screen: 'stack' },
      screenProps: { screen: { screenId: 'screen' } },
      screenSurfaceTouchRefreshKeys: {},
      screens: { screen: controller },
      stackActiveScreenIds: { stack: ['root', 'screen'] },
      stackContexts: { stack: {} },
      stackNativeKeys: { stack: 'root\u001fscreen' },
      stackPendingReconcileKeys: {},
      stacks: {
        stack: {
          topViewController: controller,
          view: { bounds: frame, frame },
          viewControllers: [controller],
        },
      },
      stackTransitioning: {},
    };

    screenView.subviews = [contentWrapperView];
    NativeScriptRuntime.refreshUIKitHostViewDirectOwner = refreshUIKitHostView;
    (NativeScriptRuntime as any).nativeObjectFromHandle = jest.fn(
      (handle: string) => {
        if (handle === 'wrapper-handle') {
          return contentWrapperView;
        }

        if (handle === 'screen-host') {
          return screenView;
        }

        return null;
      },
    );
    globalObject.__rnsNativeScriptLayoutHostedSubviewChain =
      layoutHostedSubviewChain;
    globalObject.__rnsNativeScriptReconcileStack = reconcileStack;
    globalObject.__rnsNativeScriptReconcileStackFromExternalHost =
      reconcileStackFromExternalHost;
    globalObject.__rnsNativeScriptStackRegistry = registry;

    try {
      expect(
        nativeScriptScreenContentWrapperHostReadyOnUI(
          'screen',
          'wrapper-handle',
          2,
          true,
        ),
      ).toBe(false);

      expect(registry.screenContentWrapperHostReadyKeys.screen).toBe(
        'wrapper-handle|2|window',
      );
      expect(registry.screenContentWrapperVisibleDescendantCounts.screen).toBe(
        2,
      );
      expect(registry.screenContentReady.screen).toBe(true);
      expect(refreshUIKitHostView).not.toHaveBeenCalled();
      expect(layoutHostedSubviewChain).not.toHaveBeenCalled();
      expect(registry.stackPendingReconcileKeys.stack).toBeUndefined();
      expect(reconcileStack).not.toHaveBeenCalled();
      expect(reconcileStackFromExternalHost).not.toHaveBeenCalled();

      registry.stackPendingReconcileKeys.stack = 'root\u001fscreen';

      expect(
        nativeScriptScreenContentWrapperHostReadyOnUI(
          'screen',
          'wrapper-handle',
          3,
          true,
        ),
      ).toBe(false);

      expect(registry.stackPendingReconcileKeys.stack).toBeUndefined();
      expect(reconcileStack).not.toHaveBeenCalled();
      expect(reconcileStackFromExternalHost).not.toHaveBeenCalled();

      registry.stackNativeKeys.stack = undefined;

      expect(
        nativeScriptScreenContentWrapperHostReadyOnUI(
          'screen',
          'wrapper-handle',
          4,
          true,
        ),
      ).toBe(true);

      expect(reconcileStack).toHaveBeenCalledWith(
        'stack',
        registry,
        registry.stackContexts.stack,
        false,
      );
      expect(reconcileStackFromExternalHost).not.toHaveBeenCalled();
    } finally {
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostView;

      if (previousNativeObjectFromHandle === undefined) {
        delete (NativeScriptRuntime as any).nativeObjectFromHandle;
      } else {
        (NativeScriptRuntime as any).nativeObjectFromHandle =
          previousNativeObjectFromHandle;
      }

      if (previousLayoutHostedSubviewChain === undefined) {
        delete globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
      } else {
        globalObject.__rnsNativeScriptLayoutHostedSubviewChain =
          previousLayoutHostedSubviewChain;
      }

      if (previousReconcileStack === undefined) {
        delete globalObject.__rnsNativeScriptReconcileStack;
      } else {
        globalObject.__rnsNativeScriptReconcileStack = previousReconcileStack;
      }

      if (previousReconcileStackFromExternalHost === undefined) {
        delete globalObject.__rnsNativeScriptReconcileStackFromExternalHost;
      } else {
        globalObject.__rnsNativeScriptReconcileStackFromExternalHost =
          previousReconcileStackFromExternalHost;
      }

      if (previousRegistry === undefined) {
        delete globalObject.__rnsNativeScriptStackRegistry;
      } else {
        globalObject.__rnsNativeScriptStackRegistry = previousRegistry;
      }
    }
  });

  it('ignores stale off-window host-ready after a committed top wrapper was windowed', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const globalObject = global as Record<string, any>;
    const previousRegistry = globalObject.__rnsNativeScriptStackRegistry;
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const previousNativeObjectFromHandle = (NativeScriptRuntime as any)
      .nativeObjectFromHandle;
    const previousLayoutHostedSubviewChain =
      globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
    const refreshUIKitHostView = jest.fn(() => true);
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };
    const window = {};
    const hostedLeaf: any = {
      alpha: 1,
      description: 'RCTViewComponentView',
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
      window,
    };
    const screenView: any = {
      __rnsNativeScriptScreenView: true,
      alpha: 1,
      bounds: frame,
      frame,
      hash: 'screen-host',
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
      window,
    };
    const contentWrapperView: any = {
      __rnsNativeScriptScreenContentWrapperRootView: true,
      alpha: 1,
      bounds: frame,
      description: 'RNSScreenContentWrapper.NativeScript',
      frame,
      hash: 'wrapper-handle',
      hidden: false,
      subviews: [hostedLeaf],
      superview: screenView,
      userInteractionEnabled: true,
      window,
    };
    const controller: any = {
      __nativeScriptScreenId: 'screen',
      __nativeScriptScreenView: screenView,
      view: screenView,
    };
    const registry: any = {
      screenContentReady: { screen: true },
      screenContentWrapperCommittedHandles: { screen: 'wrapper-handle' },
      screenContentWrapperEverWindowAttached: { screen: true },
      screenContentWrapperHostHandles: { screen: 'wrapper-handle' },
      screenContentWrapperHostReadyKeys: { screen: 'wrapper-handle|1|window' },
      screenContentWrapperRefreshKeys: {},
      screenContentWrapperViews: { screen: contentWrapperView },
      screenContentWrapperVisibleDescendantCounts: { screen: 1 },
      screenHostHandles: { screen: 'screen-host' },
      screenParents: { screen: 'stack' },
      screenProps: { screen: { screenId: 'screen' } },
      screenSurfaceTouchRefreshKeys: {},
      screens: { screen: controller },
      stackActiveScreenIds: { stack: ['root', 'screen'] },
      stackContexts: { stack: {} },
      stackNativeKeys: { stack: 'root\u001fscreen' },
      stackPendingReconcileKeys: {},
      stackTransitioning: {},
    };

    hostedLeaf.superview = contentWrapperView;
    screenView.subviews = [contentWrapperView];
    NativeScriptRuntime.refreshUIKitHostViewDirectOwner = refreshUIKitHostView;
    (NativeScriptRuntime as any).nativeObjectFromHandle = jest.fn(
      (handle: string) => {
        if (handle === 'wrapper-handle') {
          return contentWrapperView;
        }

        if (handle === 'screen-host') {
          return screenView;
        }

        return null;
      },
    );
    globalObject.__rnsNativeScriptLayoutHostedSubviewChain = jest.fn();
    globalObject.__rnsNativeScriptStackRegistry = registry;

    try {
      expect(
        nativeScriptScreenContentWrapperHostReadyOnUI(
          'screen',
          'wrapper-handle',
          50,
          false,
        ),
      ).toBe(false);

      expect(registry.screenContentWrapperViews.screen).toBe(
        contentWrapperView,
      );
      expect(registry.screenContentWrapperHostReadyKeys.screen).toBe(
        'wrapper-handle|1|window',
      );
      expect(registry.screenContentWrapperVisibleDescendantCounts.screen).toBe(
        1,
      );
      expect(registry.screenContentReady.screen).toBe(true);
      expect(refreshUIKitHostView).not.toHaveBeenCalled();
      expect(
        globalObject.__rnsNativeScriptLayoutHostedSubviewChain,
      ).not.toHaveBeenCalled();
    } finally {
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostView;

      if (previousNativeObjectFromHandle === undefined) {
        delete (NativeScriptRuntime as any).nativeObjectFromHandle;
      } else {
        (NativeScriptRuntime as any).nativeObjectFromHandle =
          previousNativeObjectFromHandle;
      }

      if (previousLayoutHostedSubviewChain === undefined) {
        delete globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
      } else {
        globalObject.__rnsNativeScriptLayoutHostedSubviewChain =
          previousLayoutHostedSubviewChain;
      }

      if (previousRegistry === undefined) {
        delete globalObject.__rnsNativeScriptStackRegistry;
      } else {
        globalObject.__rnsNativeScriptStackRegistry = previousRegistry;
      }
    }
  });

  it('does not certify a displayable empty wrapper as committed stack content', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const globalObject = global as Record<string, any>;
    const previousRegistry = globalObject.__rnsNativeScriptStackRegistry;
    const previousReconcileStack = globalObject.__rnsNativeScriptReconcileStack;
    const previousNativeObjectFromHandle = (NativeScriptRuntime as any)
      .nativeObjectFromHandle;
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };
    const window = {};
    const screenView: any = {
      __rnsNativeScriptScreenView: true,
      alpha: 1,
      bounds: frame,
      frame,
      hash: 'detail-screen-host',
      hidden: false,
      refreshSurfaceTouchHandler: jest.fn(),
      subviews: [],
      userInteractionEnabled: true,
      window,
    };
    const emptyContentWrapperView: any = {
      __rnsNativeScriptScreenContentWrapperChildrenView: null,
      __rnsNativeScriptScreenContentWrapperRootView: true,
      alpha: 1,
      bounds: frame,
      description: 'RNSScreenContentWrapper.NativeScript',
      frame,
      hash: 'detail-wrapper-host',
      hidden: false,
      subviews: [],
      superview: screenView,
      userInteractionEnabled: true,
      window,
    };
    const detailController: any = {
      __nativeScriptScreenId: 'detail',
      __nativeScriptScreenView: screenView,
      view: screenView,
    };
    const navigationController: any = {
      topViewController: detailController,
      view: { bounds: frame, frame, window },
      viewControllers: [detailController],
    };
    const reconcileStack = jest.fn();
    const registry: any = {
      screenContentReady: {},
      screenContentWrapperCommittedHandles: {},
      screenContentWrapperHostHandles: {},
      screenContentWrapperHostReadyKeys: {},
      screenContentWrapperRefreshKeys: {},
      screenContentWrapperViews: {},
      screenContentWrapperVisibleDescendantCounts: {},
      screenHostHandles: { detail: 'detail-screen-host' },
      screenHostRefreshKeys: {},
      screenParents: { detail: 'stack' },
      screenProps: { detail: { screenId: 'detail' } },
      screenSurfaceTouchRefreshKeys: {},
      screens: { detail: detailController },
      stackActiveScreenIds: { stack: ['root', 'detail'] },
      stackContexts: { stack: {} },
      stackNativeCounts: { stack: 1 },
      stackNativeKeys: { stack: 'root' },
      stackPendingReconcileKeys: {},
      stackTransitioning: {},
      stacks: { stack: navigationController },
      stackUpdatingModals: {},
    };

    screenView.subviews = [emptyContentWrapperView];
    globalObject.__rnsNativeScriptReconcileStack = reconcileStack;
    globalObject.__rnsNativeScriptStackRegistry = registry;
    NativeScriptRuntime.refreshUIKitHostViewDirectOwner = jest.fn(() => false);
    (NativeScriptRuntime as any).nativeObjectFromHandle = jest.fn(
      (handle: string) => {
        if (handle === 'detail-wrapper-host') {
          return emptyContentWrapperView;
        }

        if (handle === 'detail-screen-host') {
          return screenView;
        }

        return null;
      },
    );

    try {
      nativeScriptScreenContentWrapperHostReadyOnUI(
        'detail',
        'detail-wrapper-host',
        0,
        true,
      );

      expect(registry.screenContentReady.detail).toBeUndefined();
      expect(
        registry.screenContentWrapperCommittedHandles.detail,
      ).toBeUndefined();
      expect(reconcileStack).not.toHaveBeenCalled();
      expect(
        __nativeScriptScreenHasStableReadyMountedContentForTests(
          'detail',
          registry,
          screenView,
        ),
      ).toBe(false);
    } finally {
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostView;

      if (previousNativeObjectFromHandle === undefined) {
        delete (NativeScriptRuntime as any).nativeObjectFromHandle;
      } else {
        (NativeScriptRuntime as any).nativeObjectFromHandle =
          previousNativeObjectFromHandle;
      }

      if (previousReconcileStack === undefined) {
        delete globalObject.__rnsNativeScriptReconcileStack;
      } else {
        globalObject.__rnsNativeScriptReconcileStack = previousReconcileStack;
      }

      if (previousRegistry === undefined) {
        delete globalObject.__rnsNativeScriptStackRegistry;
      } else {
        globalObject.__rnsNativeScriptStackRegistry = previousRegistry;
      }
    }
  });

  it('requires a current exposure certificate before stable-skipping visible stack content', () => {
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostView;
    const previousRefreshUIKitHostViewDirectOwner =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const globalObject = global as Record<string, any>;
    const previousLayoutHostedSubviewChain =
      globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };
    const window = {};
    const hostedLeaf: any = {
      alpha: 1,
      bounds: { origin: { x: 12, y: 20 }, size: { height: 32, width: 160 } },
      description: '<RCTParagraphComponentView: 0xcertified>',
      frame: { origin: { x: 12, y: 20 }, size: { height: 32, width: 160 } },
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
      window,
    };
    const screenView: any = {
      __rnsNativeScriptScreenView: true,
      accessibilityIdentifier: 'detail',
      alpha: 1,
      bounds: frame,
      frame,
      gestureRecognizers: [],
      hash: 'detail-screen-host',
      hidden: false,
      refreshSurfaceTouchHandler: jest.fn(),
      subviews: [],
      superview: { gestureRecognizers: [], window },
      userInteractionEnabled: false,
      window,
    };
    const contentWrapperView: any = {
      __rnsNativeScriptScreenContentWrapperRootView: true,
      alpha: 1,
      bounds: frame,
      frame,
      gestureRecognizers: [],
      hash: 'detail-wrapper-host',
      hidden: false,
      subviews: [hostedLeaf],
      superview: screenView,
      userInteractionEnabled: true,
      window,
    };
    const controller: any = {
      __nativeScriptScreenId: 'detail',
      __nativeScriptScreenView: screenView,
      view: screenView,
    };
    const registry: any = {
      screenContentReady: { detail: true },
      screenContentWrapperCommittedHandles: {},
      screenContentWrapperHostHandles: { detail: 'detail-wrapper-host' },
      screenContentWrapperRefreshKeys: {},
      screenContentWrapperViews: { detail: contentWrapperView },
      screenContentWrapperVisibleDescendantCounts: { detail: 1 },
      screenHostHandles: { detail: 'detail-screen-host' },
      screenHostRefreshKeys: {},
      screenParents: { detail: 'stack' },
      screenProps: { detail: { screenId: 'detail' } },
      screenStableReadyExposureKeys: {},
      screenSurfaceTouchRefreshKeys: {},
      screens: { detail: controller },
      stackActiveScreenIds: { stack: ['detail'] },
      stackContexts: { stack: {} },
      stackTransitioning: {},
      stackUpdatingModals: {},
    };

    hostedLeaf.superview = contentWrapperView;
    screenView.subviews = [contentWrapperView];
    const refreshUIKitHostView = jest.fn(() => true);
    (NativeScriptRuntime as any).refreshUIKitHostView = refreshUIKitHostView;
    (NativeScriptRuntime as any).refreshUIKitHostViewDirectOwner =
      refreshUIKitHostView;
    globalObject.__rnsNativeScriptLayoutHostedSubviewChain = jest.fn();

    try {
      expect(
        __nativeScriptScreenHasStableReadyMountedContentForTests(
          'detail',
          registry,
          screenView,
        ),
      ).toBe(false);

      __nativeScriptLayoutScreenHostedReactSubviewsForTests(
        controller,
        screenView,
        registry,
        'detail',
        false,
        true,
      );

      expect(
        __nativeScriptScreenHasStableReadyMountedContentForTests(
          'detail',
          registry,
          screenView,
        ),
      ).toBe(true);
      expect(registry.screenStableReadyExposureKeys.detail).toContain(
        'detail-screen-host',
      );

      refreshUIKitHostView.mockClear();
      (
        globalObject.__rnsNativeScriptLayoutHostedSubviewChain as jest.Mock
      ).mockClear();

      __nativeScriptLayoutScreenHostedReactSubviewsForTests(
        controller,
        screenView,
        registry,
        'detail',
        false,
        true,
      );

      expect(refreshUIKitHostView).not.toHaveBeenCalled();
      expect(
        globalObject.__rnsNativeScriptLayoutHostedSubviewChain,
      ).not.toHaveBeenCalled();

      __nativeScriptRefreshScreenContentWrapperHostForTests(
        'detail',
        registry,
        true,
        true,
        true,
        false,
        'refresh-screen-wrapper-hosts',
        true,
      );
      const currentWrapperRefreshKey =
        registry.screenContentWrapperRefreshKeys.detail;
      delete registry.screenStableReadyExposureKeys.detail;
      refreshUIKitHostView.mockClear();
      (
        globalObject.__rnsNativeScriptLayoutHostedSubviewChain as jest.Mock
      ).mockClear();

      __nativeScriptRefreshScreenContentWrapperHostForTests(
        'detail',
        registry,
        false,
        false,
        true,
        false,
        'refresh-screen-wrapper-hosts',
        true,
      );

      expect(registry.screenContentWrapperRefreshKeys.detail).toBe(
        currentWrapperRefreshKey,
      );
      expect(refreshUIKitHostView).not.toHaveBeenCalled();
      expect(
        globalObject.__rnsNativeScriptLayoutHostedSubviewChain,
      ).not.toHaveBeenCalled();
      expect(registry.screenStableReadyExposureKeys.detail).toContain(
        'detail-screen-host',
      );
    } finally {
      (NativeScriptRuntime as any).refreshUIKitHostView =
        previousRefreshUIKitHostView;
      (NativeScriptRuntime as any).refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostViewDirectOwner;

      if (previousLayoutHostedSubviewChain === undefined) {
        delete globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
      } else {
        globalObject.__rnsNativeScriptLayoutHostedSubviewChain =
          previousLayoutHostedSubviewChain;
      }
    }
  });

  it('keeps a committed NativeScript wrapper stable across transient zero descendant counts', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const globalObject = global as Record<string, any>;
    const previousRegistry = globalObject.__rnsNativeScriptStackRegistry;
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const previousNativeObjectFromHandle = (NativeScriptRuntime as any)
      .nativeObjectFromHandle;
    const previousLayoutHostedSubviewChain =
      globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
    const previousReconcileStack = globalObject.__rnsNativeScriptReconcileStack;
    const refreshUIKitHostView = jest.fn(() => true);
    const reconcileStack = jest.fn();
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };
    const window = {};
    const childHost: any = {
      alpha: 1,
      bounds: frame,
      description: 'UIView',
      frame,
      hash: 'child-host',
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
      window,
    };
    const screenView: any = {
      __rnsNativeScriptScreenView: true,
      alpha: 1,
      bounds: frame,
      frame,
      hash: 'screen-host',
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
      window,
    };
    const contentWrapperView: any = {
      __rnsNativeScriptScreenContentWrapperChildrenView: childHost,
      __rnsNativeScriptScreenContentWrapperRootView: true,
      alpha: 1,
      bounds: frame,
      description: 'RNSScreenContentWrapper.NativeScript',
      frame,
      hash: 'wrapper-handle',
      hidden: false,
      subviews: [childHost],
      superview: screenView,
      userInteractionEnabled: true,
      window,
    };
    childHost.superview = contentWrapperView;
    screenView.subviews = [contentWrapperView];

    const controller: any = {
      __nativeScriptScreenId: 'screen',
      __nativeScriptScreenView: screenView,
      view: screenView,
    };
    const registry: any = {
      screenContentReady: { screen: true },
      screenContentWrapperCommittedHandles: {},
      screenContentWrapperHostHandles: { screen: 'wrapper-handle' },
      screenContentWrapperHostReadyKeys: { screen: 'wrapper-handle|1|window' },
      screenContentWrapperRefreshKeys: {},
      screenContentWrapperViews: { screen: contentWrapperView },
      screenContentWrapperVisibleDescendantCounts: { screen: 1 },
      screenHostHandles: { screen: 'screen-host' },
      screenParents: { screen: 'stack' },
      screenProps: { screen: { screenId: 'screen' } },
      screenSurfaceTouchRefreshKeys: {},
      screens: { screen: controller },
      stackActiveScreenIds: { stack: ['root', 'screen'] },
      stackContexts: { stack: {} },
      stackNativeKeys: { stack: 'root\u001fscreen' },
      stackPendingReconcileKeys: {},
      stackTransitioning: {},
    };

    NativeScriptRuntime.refreshUIKitHostViewDirectOwner = refreshUIKitHostView;
    (NativeScriptRuntime as any).nativeObjectFromHandle = jest.fn(
      (handle: string) => {
        if (handle === 'wrapper-handle') {
          return contentWrapperView;
        }

        if (handle === 'screen-host') {
          return screenView;
        }

        if (handle === 'child-host') {
          return childHost;
        }

        return null;
      },
    );
    globalObject.__rnsNativeScriptLayoutHostedSubviewChain = jest.fn();
    globalObject.__rnsNativeScriptReconcileStack = reconcileStack;
    globalObject.__rnsNativeScriptStackRegistry = registry;

    try {
      expect(
        __nativeScriptRememberScreenStableReadyExposureForTests(
          'screen',
          registry,
          screenView,
        ),
      ).toBe(true);
      expect(
        __nativeScriptScreenHasStableReadyMountedContentForTests(
          'screen',
          registry,
          screenView,
        ),
      ).toBe(true);
      expect(registry.screenContentWrapperCommittedHandles.screen).toBe(
        'wrapper-handle',
      );

      refreshUIKitHostView.mockClear();
      reconcileStack.mockClear();

      expect(
        nativeScriptScreenContentWrapperHostReadyOnUI(
          'screen',
          'wrapper-handle',
          0,
          true,
        ),
      ).toBe(false);

      expect(registry.screenContentWrapperVisibleDescendantCounts.screen).toBe(
        0,
      );
      expect(registry.screenContentReady.screen).toBe(true);
      expect(registry.screenContentWrapperCommittedHandles.screen).toBe(
        'wrapper-handle',
      );
      expect(
        __nativeScriptScreenHasStableReadyMountedContentForTests(
          'screen',
          registry,
          screenView,
        ),
      ).toBe(true);
      expect(refreshUIKitHostView).not.toHaveBeenCalled();
      expect(reconcileStack).not.toHaveBeenCalled();

      registry.screenContentWrapperCommittedHandles.screen = 'child-host';
      registry.screenContentWrapperVisibleDescendantCounts.screen = 0;

      expect(
        __nativeScriptScreenHasStableReadyMountedContentForTests(
          'screen',
          registry,
          screenView,
        ),
      ).toBe(true);
    } finally {
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostView;

      if (previousNativeObjectFromHandle === undefined) {
        delete (NativeScriptRuntime as any).nativeObjectFromHandle;
      } else {
        (NativeScriptRuntime as any).nativeObjectFromHandle =
          previousNativeObjectFromHandle;
      }

      if (previousLayoutHostedSubviewChain === undefined) {
        delete globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
      } else {
        globalObject.__rnsNativeScriptLayoutHostedSubviewChain =
          previousLayoutHostedSubviewChain;
      }

      if (previousReconcileStack === undefined) {
        delete globalObject.__rnsNativeScriptReconcileStack;
      } else {
        globalObject.__rnsNativeScriptReconcileStack = previousReconcileStack;
      }

      if (previousRegistry === undefined) {
        delete globalObject.__rnsNativeScriptStackRegistry;
      } else {
        globalObject.__rnsNativeScriptStackRegistry = previousRegistry;
      }
    }
  });

  it('does not treat a blank committed wrapper as stable native-stack content', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const previousNativeObjectFromHandle = (NativeScriptRuntime as any)
      .nativeObjectFromHandle;
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };
    const window = {};
    const screenView: any = {
      __rnsNativeScriptScreenView: true,
      alpha: 1,
      bounds: frame,
      frame,
      hash: 'screen-host',
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
      window,
    };
    const contentWrapperView: any = {
      __rnsNativeScriptScreenContentWrapperRootView: true,
      alpha: 1,
      bounds: frame,
      frame,
      hash: 'wrapper-handle',
      hidden: false,
      subviews: [],
      superview: screenView,
      userInteractionEnabled: true,
      window,
    };
    const controller: any = {
      __nativeScriptScreenId: 'screen',
      __nativeScriptScreenView: screenView,
      view: screenView,
    };
    const registry: any = {
      screenContentReady: { screen: true },
      screenContentWrapperCommittedHandles: { screen: 'wrapper-handle' },
      screenContentWrapperHostHandles: { screen: 'wrapper-handle' },
      screenContentWrapperViews: { screen: contentWrapperView },
      screenHostHandles: { screen: 'screen-host' },
      screenParents: { screen: 'stack' },
      screenProps: { screen: { screenId: 'screen' } },
      screens: { screen: controller },
      stackActiveScreenIds: { stack: ['screen'] },
      stackContexts: { stack: {} },
    };

    screenView.subviews = [contentWrapperView];
    (NativeScriptRuntime as any).nativeObjectFromHandle = jest.fn(
      (handle: string) => {
        if (handle === 'wrapper-handle') {
          return contentWrapperView;
        }

        if (handle === 'screen-host') {
          return screenView;
        }

        return null;
      },
    );

    try {
      expect(
        __nativeScriptScreenHasStableReadyMountedContentForTests(
          'screen',
          registry,
          screenView,
        ),
      ).toBe(false);
    } finally {
      if (previousNativeObjectFromHandle === undefined) {
        delete (NativeScriptRuntime as any).nativeObjectFromHandle;
      } else {
        (NativeScriptRuntime as any).nativeObjectFromHandle =
          previousNativeObjectFromHandle;
      }
    }
  });

  it('prepares native push content without refreshing the Fabric host', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostView;
    const previousRefreshUIKitHostViewDirectOwner =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const refreshUIKitHostView = jest.fn(() => true);
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };
    const hostedLeaf: any = {
      alpha: 1,
      description: 'RCTViewComponentView',
      hidden: false,
      subviews: [],
    };
    const screenView: any = {
      bounds: frame,
      frame,
      gestureRecognizers: [],
      hidden: false,
      layoutIfNeeded: jest.fn(),
      refreshSurfaceTouchHandler: jest.fn(),
      setNeedsLayout: jest.fn(),
      subviews: [],
      userInteractionEnabled: true,
    };
    const contentWrapperView: any = {
      __rnsNativeScriptScreenContentWrapperChildrenView: hostedLeaf,
      __rnsNativeScriptScreenContentWrapperRootView: true,
      alpha: 1,
      bounds: frame,
      frame,
      hidden: false,
      layoutIfNeeded: jest.fn(),
      setNeedsLayout: jest.fn(),
      subviews: [hostedLeaf],
      superview: screenView,
      userInteractionEnabled: true,
    };
    const controller: any = { view: screenView };
    const registry: any = {
      screenContentReady: { screen: true },
      screenContentWrapperHostHandles: { screen: 'wrapper-host' },
      screenContentWrapperVisibleDescendantCounts: { screen: 1 },
      screenContentWrapperViews: { screen: contentWrapperView },
      screenHostHandles: { screen: 'screen-host' },
      screenParents: { screen: 'stack' },
      screenProps: { screen: { screenId: 'screen' } },
      screenSurfaceTouchRefreshKeys: {},
      screens: { screen: controller },
      stackTransitioning: {},
    };

    screenView.subviews = [contentWrapperView];

    NativeScriptRuntime.refreshUIKitHostView = refreshUIKitHostView;
    NativeScriptRuntime.refreshUIKitHostViewDirectOwner = refreshUIKitHostView;

    try {
      expect(
        __nativeScriptPrepareScreenHostedContentForNativeTransitionForTests(
          controller,
          'screen',
          registry,
        ),
      ).toBe(true);
      expect(refreshUIKitHostView).not.toHaveBeenCalled();
      expect(contentWrapperView.layoutIfNeeded).toHaveBeenCalled();
      expect(screenView.layoutIfNeeded).toHaveBeenCalled();
    } finally {
      NativeScriptRuntime.refreshUIKitHostView = previousRefreshUIKitHostView;
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostViewDirectOwner;
    }
  });

  it('keeps the native-stack controller view as screen host when wrapper-ready wins the race', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const globalObject = global as Record<string, any>;
    const previousRegistry = globalObject.__rnsNativeScriptStackRegistry;
    const previousNativeObjectFromHandle = (NativeScriptRuntime as any)
      .nativeObjectFromHandle;
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostView;
    const previousRefreshUIKitHostViewDirectOwner =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };
    const window = {};
    const hostedLeaf: any = {
      alpha: 1,
      description: 'RCTViewComponentView',
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
      window,
    };
    const screenView: any = {
      __rnsNativeScriptScreenView: true,
      alpha: 1,
      bounds: frame,
      frame,
      hash: 'screen-host',
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
      window,
    };
    const contentWrapperView: any = {
      alpha: 1,
      bounds: frame,
      description: 'RNSScreenContentWrapper.NativeScript',
      frame,
      hash: 'wrapper-host',
      hidden: false,
      subviews: [hostedLeaf],
      superview: screenView,
      userInteractionEnabled: true,
      window,
    };
    const churnHostView: any = {
      __rnsNativeScriptScreenView: true,
      alpha: 1,
      bounds: frame,
      frame,
      hash: 'churn-host',
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
      window,
    };
    screenView.subviews = [contentWrapperView];
    const controller: any = {
      __nativeScriptScreenId: 'screen',
      __nativeScriptScreenView: screenView,
      view: screenView,
    };
    const registry: any = {
      screenContentReady: {},
      screenContentWrapperHostHandles: {},
      screenContentWrapperHostReadyKeys: {},
      screenContentWrapperRefreshKeys: {},
      screenContentWrapperViews: {},
      screenContentWrapperVisibleDescendantCounts: {},
      screenHostHandles: {},
      screenHostRefreshKeys: {},
      screenParents: { screen: 'stack' },
      screenProps: { screen: { screenId: 'screen' } },
      screenSurfaceTouchRefreshKeys: {},
      screens: { screen: controller },
      stackActiveScreenIds: { stack: ['root', 'screen'] },
      stackContexts: { stack: {} },
      stackPendingReconcileKeys: {},
      stackTransitioning: { stack: true },
    };

    globalObject.__rnsNativeScriptStackRegistry = registry;
    NativeScriptRuntime.refreshUIKitHostView = jest.fn(() => true);
    NativeScriptRuntime.refreshUIKitHostViewDirectOwner = jest.fn(() => true);
    (NativeScriptRuntime as any).nativeObjectFromHandle = jest.fn(
      (handle: string) => {
        if (handle === 'screen-host') {
          return screenView;
        }
        if (handle === 'wrapper-host') {
          return contentWrapperView;
        }
        if (handle === 'churn-host') {
          return churnHostView;
        }
        return null;
      },
    );

    try {
      expect(
        nativeScriptScreenContentWrapperHostReadyOnUI(
          'screen',
          'wrapper-host',
          1,
          false,
        ),
      ).toBe(true);

      expect(registry.screenContentReady.screen).toBe(true);
      expect(registry.screenHostHandles.screen).toBe('screen-host');

      expect(
        __nativeScriptScreenHostReadyOnUIForTests(
          'screen',
          'stack',
          'churn-host',
        ),
      ).toBe(false);

      expect(registry.screenHostHandles.screen).toBe('screen-host');
      expect(controller.view).toBe(screenView);
      expect(contentWrapperView.superview).toBe(screenView);
    } finally {
      NativeScriptRuntime.refreshUIKitHostView = previousRefreshUIKitHostView;
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostViewDirectOwner;

      if (previousNativeObjectFromHandle === undefined) {
        delete (NativeScriptRuntime as any).nativeObjectFromHandle;
      } else {
        (NativeScriptRuntime as any).nativeObjectFromHandle =
          previousNativeObjectFromHandle;
      }

      if (previousRegistry === undefined) {
        delete globalObject.__rnsNativeScriptStackRegistry;
      } else {
        globalObject.__rnsNativeScriptStackRegistry = previousRegistry;
      }
    }
  });

  it('keeps navigation stack layout native-only while UIKit or the stack registry is transitioning', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const globalObject = global as Record<string, any>;
    const previousRegistry = globalObject.__rnsNativeScriptStackRegistry;
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostView;
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };
    const hostedLeaf: any = {
      alpha: 1,
      description: 'RCTViewComponentView',
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
    };
    const contentWrapperView: any = {
      alpha: 1,
      bounds: frame,
      frame,
      hidden: false,
      subviews: [hostedLeaf],
      userInteractionEnabled: true,
      window: {},
    };
    const screenView: any = {
      __rnsNativeScriptScreenView: true,
      accessibilityIdentifier: 'detail',
      alpha: 1,
      bounds: frame,
      frame,
      gestureRecognizers: [],
      hidden: false,
      subviews: [contentWrapperView],
      userInteractionEnabled: false,
      window: {},
    };
    const navigationView: any = {
      bounds: frame,
      frame,
      setNeedsLayout: jest.fn(),
      subviews: [screenView],
      window: screenView.window,
    };
    screenView.superview = navigationView;
    contentWrapperView.superview = screenView;
    const controller: any = {
      __nativeScriptScreenId: 'detail',
      view: screenView,
    };
    const navigationController: any = {
      __nativeScriptStackId: 'stack',
      navigationBar: {
        superview: {
          bringSubviewToFront: jest.fn(),
        },
      },
      topViewController: controller,
      transitionCoordinator: {},
      view: navigationView,
      viewControllers: [controller],
    };
    controller.navigationController = navigationController;

    globalObject.__rnsNativeScriptStackRegistry = {
      screenContentReady: { detail: true },
      screenContentWrapperViews: { detail: contentWrapperView },
      screenHostHandles: { detail: 'screen-host' },
      screenLayoutKeys: {},
      screenParents: { detail: 'stack' },
      screenProps: { detail: { screenId: 'detail' } },
      screenSurfaceTouchRefreshKeys: {},
      screens: { detail: controller },
      stackActiveScreenIds: { stack: ['detail'] },
      stackNativeKeys: {},
      stackPendingReconcileKeys: {},
      stackTransitioning: { stack: true },
      stacks: { stack: navigationController },
    };
    NativeScriptRuntime.refreshUIKitHostView = jest.fn(() => {
      throw new Error('transition layout must not refresh hosted React views');
    });

    try {
      __nativeScriptLayoutNavigationStackViewsForTests(navigationController);

      expect(screenView.userInteractionEnabled).toBe(true);
      expect(NativeScriptRuntime.refreshUIKitHostView).not.toHaveBeenCalled();

      navigationController.transitionCoordinator = null;
      screenView.userInteractionEnabled = false;
      (globalObject.__rnsNativeScriptStackRegistry as any).stackTransitioning =
        {};
      (
        globalObject.__rnsNativeScriptStackRegistry as any
      ).stackPendingReconcileKeys = { stack: 'detail' };
      (globalObject.__rnsNativeScriptStackRegistry as any).stackNativeKeys = {
        stack: 'root',
      };
      (NativeScriptRuntime.refreshUIKitHostView as jest.Mock).mockClear();

      __nativeScriptLayoutNavigationStackViewsForTests(navigationController);

      expect(screenView.userInteractionEnabled).toBe(true);
      expect(NativeScriptRuntime.refreshUIKitHostView).not.toHaveBeenCalled();

      const initialPendingRegistry = {
        ...(globalObject.__rnsNativeScriptStackRegistry as any),
        screenLayoutKeys: {},
        stackNativeKeys: {},
        stackPendingReconcileKeys: { stack: 'detail' },
        stackTransitioning: {},
      };
      globalObject.__rnsNativeScriptStackRegistry = initialPendingRegistry;
      screenView.userInteractionEnabled = false;

      __nativeScriptLayoutNavigationStackViewsForTests(navigationController);

      expect(screenView.userInteractionEnabled).toBe(true);
      expect(initialPendingRegistry.screenLayoutKeys.detail).toBeDefined();
      expect(NativeScriptRuntime.refreshUIKitHostView).not.toHaveBeenCalled();

      const layoutSource = stackSource.slice(
        stackSource.indexOf('function layoutNavigationStackViews'),
        stackSource.indexOf('function markNavigationStackNeedsLayout'),
      );
      const transitionIndex = layoutSource.indexOf(
        'if (shouldUseNativeTransitionLayout) {',
      );
      const controllerLoopIndex = layoutSource.indexOf(
        'for (let index = 0; index < count; index += 1)',
      );
      const transitionSource = layoutSource.slice(
        transitionIndex,
        controllerLoopIndex,
      );

      expect(transitionIndex).toBeGreaterThanOrEqual(0);
      expect(transitionIndex).toBeLessThan(controllerLoopIndex);
      expect(layoutSource).toContain(
        'stackHasPendingNativeModel(owningStackId, registry)',
      );
      expect(transitionSource).not.toContain(
        'refreshScreenSurfaceTouchHandlerIfNeeded',
      );
      expect(transitionSource).not.toContain('layoutHostedReactSubviews');
      expect(transitionSource).not.toContain(
        'refreshNavigationControllerHostedViews',
      );
    } finally {
      NativeScriptRuntime.refreshUIKitHostView = previousRefreshUIKitHostView;

      if (previousRegistry === undefined) {
        delete globalObject.__rnsNativeScriptStackRegistry;
      } else {
        globalObject.__rnsNativeScriptStackRegistry = previousRegistry;
      }
    }
  });

  it('skips ready off-top controllers during settled navigation stack layout', () => {
    const layoutSource = stackSource.slice(
      stackSource.indexOf('function layoutNavigationStackViews'),
      stackSource.indexOf('function markNavigationStackNeedsLayout'),
    );
    const offTopReadySkipIndex = layoutSource.indexOf(
      'if (!isTopController && contentIsReady) {\n      continue;\n    }',
    );
    const restoreIndex = layoutSource.indexOf(
      'const didRestoreScreenView = restoreDetachedScreenViewIntoNavigationWrapper',
    );
    const hostedLayoutIndex = layoutSource.indexOf(
      'layoutHostedReactSubviews(',
    );

    expect(offTopReadySkipIndex).toBeGreaterThanOrEqual(0);
    expect(offTopReadySkipIndex).toBeLessThan(restoreIndex);
    expect(offTopReadySkipIndex).toBeLessThan(hostedLayoutIndex);
  });

  it('keeps ready mounted content stable during screen layout callbacks', () => {
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostView;
    const previousRefreshUIKitHostViewDirectOwner =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const globalObject = global as Record<string, any>;
    const previousRegistry = globalObject.__rnsNativeScriptStackRegistry;
    const previousLayoutHostedSubviewChain =
      globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
    const frame = (width: number, height: number) => ({
      origin: { x: 0, y: 0 },
      size: { width, height },
    });
    const window = {};
    const hostedLeaf: any = {
      alpha: 1,
      bounds: frame(120, 32),
      description: '<RCTParagraphComponentView: 0xstable>',
      frame: frame(120, 32),
      hidden: false,
      subviews: [],
      window,
    };
    const screenView: any = {
      __rnsNativeScriptScreenView: true,
      accessibilityIdentifier: 'detail',
      alpha: 1,
      bounds: frame(402, 874),
      frame: frame(402, 874),
      gestureRecognizers: [],
      hidden: false,
      subviews: [],
      superview: {
        gestureRecognizers: [],
        window,
      },
      userInteractionEnabled: false,
      window,
    };
    const contentWrapperView: any = {
      alpha: 1,
      bounds: frame(402, 874),
      frame: frame(402, 874),
      gestureRecognizers: [],
      hidden: false,
      subviews: [hostedLeaf],
      superview: screenView,
      userInteractionEnabled: false,
      window,
    };
    const controller: any = {
      __nativeScriptScreenId: 'detail',
      __nativeScriptScreenView: screenView,
      view: screenView,
    };
    const navigationController: any = {
      topViewController: controller,
      viewControllers: [controller],
    };

    hostedLeaf.superview = contentWrapperView;
    screenView.subviews = [contentWrapperView];
    controller.parentViewController = navigationController;
    globalObject.__rnsNativeScriptStackRegistry = {
      screenContentReady: { detail: true },
      screenContentWrapperHostHandles: { detail: 'wrapper-host' },
      screenContentWrapperHostReadyKeys: {},
      screenContentWrapperRefreshKeys: {},
      screenContentWrapperViews: { detail: contentWrapperView },
      screenHostHandles: { detail: 'screen-host' },
      screenLayoutKeys: {},
      screenParents: { detail: 'stack' },
      screenProps: { detail: { screenId: 'detail' } },
      screenStableReadyExposureKeys: {},
      screenSurfaceTouchRefreshKeys: {},
      screens: { detail: controller },
      stackActiveScreenIds: { stack: ['detail'] },
      stackContexts: {},
      stackTransitioning: {},
      stackUpdatingModals: {},
    };
    (NativeScriptRuntime as any).refreshUIKitHostView = jest.fn(() => {
      throw new Error('stable layout must not refresh the screen host');
    });
    (NativeScriptRuntime as any).refreshUIKitHostViewDirectOwner = jest.fn(
      () => {
        throw new Error('stable layout must not refresh the wrapper host');
      },
    );
    globalObject.__rnsNativeScriptLayoutHostedSubviewChain = jest.fn(() => {
      throw new Error('stable layout must not rescan hosted content');
    });

    try {
      screenView.userInteractionEnabled = true;
      contentWrapperView.userInteractionEnabled = true;
      expect(
        __nativeScriptRememberScreenStableReadyExposureForTests(
          'detail',
          globalObject.__rnsNativeScriptStackRegistry,
          screenView,
        ),
      ).toBe(true);
      screenView.userInteractionEnabled = false;
      contentWrapperView.userInteractionEnabled = false;
      expect(
        __nativeScriptScreenHasStableReadyMountedContentForTests(
          'detail',
          globalObject.__rnsNativeScriptStackRegistry,
          screenView,
        ),
      ).toBe(true);

      __nativeScriptUpdateScreenBoundsAfterLayoutForTests(controller);

      expect(screenView.userInteractionEnabled).toBe(true);
      expect(contentWrapperView.userInteractionEnabled).toBe(true);
      expect(NativeScriptRuntime.refreshUIKitHostView).not.toHaveBeenCalled();
      expect(
        NativeScriptRuntime.refreshUIKitHostViewDirectOwner,
      ).not.toHaveBeenCalled();
      expect(
        globalObject.__rnsNativeScriptLayoutHostedSubviewChain,
      ).not.toHaveBeenCalled();
    } finally {
      (NativeScriptRuntime as any).refreshUIKitHostView =
        previousRefreshUIKitHostView;
      (NativeScriptRuntime as any).refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostViewDirectOwner;

      if (previousLayoutHostedSubviewChain === undefined) {
        delete globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
      } else {
        globalObject.__rnsNativeScriptLayoutHostedSubviewChain =
          previousLayoutHostedSubviewChain;
      }

      if (previousRegistry === undefined) {
        delete globalObject.__rnsNativeScriptStackRegistry;
      } else {
        globalObject.__rnsNativeScriptStackRegistry = previousRegistry;
      }
    }
  });

  it('refreshes a ready top screen whose hosted content disappeared after a native transition', () => {
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostView;
    const previousRefreshUIKitHostViewDirectOwner =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const globalObject = global as Record<string, any>;
    const previousRegistry = globalObject.__rnsNativeScriptStackRegistry;
    const previousLayoutHostedSubviewChain =
      globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
    const frame = (width: number, height: number) => ({
      origin: { x: 0, y: 0 },
      size: { width, height },
    });
    const window = {};
    const hostedLeaf: any = {
      alpha: 1,
      bounds: frame(120, 32),
      description: '<RCTParagraphComponentView: 0xmissing>',
      frame: frame(120, 32),
      hidden: true,
      subviews: [],
      window,
    };
    const navigationView: any = {
      alpha: 1,
      bounds: frame(402, 874),
      frame: frame(402, 874),
      hidden: false,
      subviews: [],
      window,
      addSubview(view: any) {
        view.superview = navigationView;
        navigationView.subviews.push(view);
      },
      bringSubviewToFront(view: any) {
        navigationView.subviews = navigationView.subviews.filter(
          (subview: any) => subview !== view,
        );
        navigationView.subviews.push(view);
      },
    };
    const screenView: any = {
      __rnsNativeScriptScreenView: true,
      accessibilityIdentifier: 'detail',
      alpha: 1,
      bounds: frame(402, 874),
      frame: frame(402, 874),
      gestureRecognizers: [],
      hidden: false,
      subviews: [],
      superview: navigationView,
      userInteractionEnabled: false,
      window,
    };
    const contentWrapperView: any = {
      alpha: 1,
      bounds: frame(402, 874),
      frame: frame(402, 874),
      gestureRecognizers: [],
      hidden: false,
      subviews: [hostedLeaf],
      superview: screenView,
      userInteractionEnabled: false,
      window,
    };
    const controller: any = {
      __nativeScriptScreenId: 'detail',
      __nativeScriptScreenView: screenView,
      view: screenView,
    };
    const navigationController: any = {
      topViewController: controller,
      view: navigationView,
      viewControllers: [controller],
    };
    const registry: any = {
      screenContentReady: { detail: true },
      screenContentWrapperHostHandles: { detail: 'wrapper-host' },
      screenContentWrapperHostReadyKeys: { detail: 'ready-key' },
      screenContentWrapperRefreshKeys: { detail: 'stale-wrapper-key' },
      screenContentWrapperViews: { detail: contentWrapperView },
      screenContentWrapperVisibleDescendantCounts: { detail: 1 },
      screenHostHandles: { detail: 'screen-host' },
      screenHostRefreshKeys: { detail: 'stale-host-key' },
      screenLayoutKeys: { detail: 'stale-layout-key' },
      screenParents: { detail: 'stack' },
      screenProps: { detail: { screenId: 'detail' } },
      screenSurfaceTouchRefreshKeys: { detail: 'stale-touch-key' },
      screens: { detail: controller },
      stackActiveScreenIds: { stack: ['detail'] },
      stackContexts: {},
      stackNativeKeys: { stack: 'detail' },
      stackPendingReconcileKeys: {},
      stackTransitioning: {},
      stackUpdatingModals: {},
      stacks: { stack: navigationController },
    };

    hostedLeaf.superview = contentWrapperView;
    screenView.subviews = [contentWrapperView];
    navigationView.subviews = [screenView];
    controller.parentViewController = navigationController;
    controller.navigationController = navigationController;
    globalObject.__rnsNativeScriptStackRegistry = registry;
    (NativeScriptRuntime as any).refreshUIKitHostView = jest.fn(() => false);
    (NativeScriptRuntime as any).refreshUIKitHostViewDirectOwner = jest.fn(
      () => {
        hostedLeaf.hidden = false;
        return true;
      },
    );
    globalObject.__rnsNativeScriptLayoutHostedSubviewChain = jest.fn();

    try {
      expect(
        __nativeScriptScreenHasStableReadyMountedContentForTests(
          'detail',
          registry,
          screenView,
        ),
      ).toBe(false);

      __nativeScriptLayoutNavigationStackViewsForTests(navigationController);

      expect(
        NativeScriptRuntime.refreshUIKitHostViewDirectOwner,
      ).toHaveBeenCalled();
      expect(hostedLeaf.hidden).toBe(false);
      expect(registry.screenHostRefreshKeys.detail).not.toBe('stale-host-key');
      expect(registry.screenContentWrapperRefreshKeys.detail).not.toBe(
        'stale-wrapper-key',
      );
      expect(
        __nativeScriptScreenHasStableReadyMountedContentForTests(
          'detail',
          registry,
          screenView,
        ),
      ).toBe(true);
    } finally {
      (NativeScriptRuntime as any).refreshUIKitHostView =
        previousRefreshUIKitHostView;
      (NativeScriptRuntime as any).refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostViewDirectOwner;

      if (previousLayoutHostedSubviewChain === undefined) {
        delete globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
      } else {
        globalObject.__rnsNativeScriptLayoutHostedSubviewChain =
          previousLayoutHostedSubviewChain;
      }

      if (previousRegistry === undefined) {
        delete globalObject.__rnsNativeScriptStackRegistry;
      } else {
        globalObject.__rnsNativeScriptStackRegistry = previousRegistry;
      }
    }
  });

  it('skips lifecycle hosted-subview repair for ready mounted screen content', () => {
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostView;
    const previousRefreshUIKitHostViewDirectOwner =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const globalObject = global as Record<string, any>;
    const previousLayoutHostedSubviewChain =
      globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
    const frame = (width: number, height: number) => ({
      origin: { x: 0, y: 0 },
      size: { width, height },
    });
    const window = {};
    const hostedLeaf: any = {
      alpha: 1,
      bounds: frame(120, 32),
      description: '<RCTParagraphComponentView: 0xlifecycle>',
      frame: frame(120, 32),
      hidden: false,
      subviews: [],
      window,
    };
    const screenView: any = {
      __rnsNativeScriptScreenView: true,
      accessibilityIdentifier: 'detail',
      alpha: 1,
      bounds: frame(402, 874),
      frame: frame(402, 874),
      gestureRecognizers: [],
      hidden: false,
      subviews: [],
      superview: {
        gestureRecognizers: [],
        window,
      },
      userInteractionEnabled: false,
      window,
    };
    const contentWrapperView: any = {
      alpha: 1,
      bounds: frame(402, 874),
      frame: frame(402, 874),
      gestureRecognizers: [],
      hidden: false,
      subviews: [hostedLeaf],
      superview: screenView,
      userInteractionEnabled: false,
      window,
    };
    const controller: any = {
      __nativeScriptScreenId: 'detail',
      __nativeScriptScreenView: screenView,
      view: screenView,
    };
    const registry: any = {
      screenContentReady: { detail: true },
      screenContentWrapperHostHandles: { detail: 'wrapper-host' },
      screenContentWrapperHostReadyKeys: {},
      screenContentWrapperRefreshKeys: {},
      screenContentWrapperViews: { detail: contentWrapperView },
      screenHostHandles: { detail: 'screen-host' },
      screenHostRefreshKeys: {},
      screenParents: { detail: 'stack' },
      screenProps: { detail: { screenId: 'detail' } },
      screenStableReadyExposureKeys: {},
      screenSurfaceTouchRefreshKeys: {},
      screens: { detail: controller },
      stackActiveScreenIds: { stack: ['detail'] },
      stackContexts: {},
      stackTransitioning: {},
      stackUpdatingModals: {},
    };

    hostedLeaf.superview = contentWrapperView;
    screenView.subviews = [contentWrapperView];
    expect(
      __nativeScriptRememberScreenStableReadyExposureForTests(
        'detail',
        registry,
        screenView,
      ),
    ).toBe(false);
    screenView.userInteractionEnabled = true;
    contentWrapperView.userInteractionEnabled = true;
    expect(
      __nativeScriptRememberScreenStableReadyExposureForTests(
        'detail',
        registry,
        screenView,
      ),
    ).toBe(true);
    screenView.userInteractionEnabled = false;
    contentWrapperView.userInteractionEnabled = false;
    (NativeScriptRuntime as any).refreshUIKitHostView = jest.fn(() => {
      throw new Error('stable lifecycle layout must not refresh host view');
    });
    (NativeScriptRuntime as any).refreshUIKitHostViewDirectOwner = jest.fn(
      () => {
        throw new Error(
          'stable lifecycle layout must not refresh wrapper host',
        );
      },
    );
    globalObject.__rnsNativeScriptLayoutHostedSubviewChain = jest.fn(() => {
      throw new Error('stable lifecycle layout must not rescan hosted content');
    });

    try {
      __nativeScriptLayoutScreenHostedReactSubviewsForTests(
        controller,
        screenView,
        registry,
        'detail',
        false,
        true,
      );

      expect(screenView.userInteractionEnabled).toBe(true);
      expect(contentWrapperView.userInteractionEnabled).toBe(true);
      expect(registry.screenHostRefreshKeys.detail).toContain('detail');
      expect(NativeScriptRuntime.refreshUIKitHostView).not.toHaveBeenCalled();
      expect(
        NativeScriptRuntime.refreshUIKitHostViewDirectOwner,
      ).not.toHaveBeenCalled();
      expect(
        globalObject.__rnsNativeScriptLayoutHostedSubviewChain,
      ).not.toHaveBeenCalled();
    } finally {
      (NativeScriptRuntime as any).refreshUIKitHostView =
        previousRefreshUIKitHostView;
      (NativeScriptRuntime as any).refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostViewDirectOwner;

      if (previousLayoutHostedSubviewChain === undefined) {
        delete globalObject.__rnsNativeScriptLayoutHostedSubviewChain;
      } else {
        globalObject.__rnsNativeScriptLayoutHostedSubviewChain =
          previousLayoutHostedSubviewChain;
      }
    }
  });

  it('keeps a ready mounted RNSScreen host stable across later host-ready churn', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const globalObject = global as Record<string, any>;
    const previousRegistry = globalObject.__rnsNativeScriptStackRegistry;
    const previousNativeObjectFromHandle = (NativeScriptRuntime as any)
      .nativeObjectFromHandle;
    const frame = {
      origin: { x: 0, y: 0 },
      size: { height: 874, width: 402 },
    };
    const window = {};
    const hostedLeaf: any = {
      alpha: 1,
      description: 'RCTViewComponentView',
      frame,
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
      window,
    };
    const previousScreenView: any = {
      __rnsNativeScriptScreenView: true,
      alpha: 1,
      bounds: frame,
      frame,
      hidden: false,
      subviews: [],
      userInteractionEnabled: true,
      window,
    };
    const contentWrapperView: any = {
      __rnsNativeScriptScreenContentWrapperChildrenView: hostedLeaf,
      __rnsNativeScriptScreenContentWrapperRootView: true,
      alpha: 1,
      bounds: frame,
      frame,
      hidden: false,
      subviews: [hostedLeaf],
      superview: previousScreenView,
      userInteractionEnabled: true,
      window,
    };
    previousScreenView.subviews = [contentWrapperView];
    const controller: any = {
      __nativeScriptScreenId: 'screen',
      __nativeScriptScreenView: previousScreenView,
      view: previousScreenView,
    };
    const registry: any = {
      screenContentReady: { screen: true },
      screenContentWrapperHostHandles: { screen: 'wrapper-host' },
      screenContentWrapperViews: { screen: contentWrapperView },
      screenHostHandles: { screen: 'previous-screen-host' },
      screens: { screen: controller },
    };

    globalObject.__rnsNativeScriptStackRegistry = registry;
    (NativeScriptRuntime as any).nativeObjectFromHandle = jest.fn(
      (handle: string) => {
        if (handle === 'previous-screen-host') {
          return previousScreenView;
        }
        if (handle === 'wrapper-host') {
          return contentWrapperView;
        }
        return null;
      },
    );

    try {
      expect(
        __nativeScriptStableReadyScreenHostHandleForTests(controller),
      ).toBe('previous-screen-host');

      contentWrapperView.superview = null;
      previousScreenView.subviews = [];

      expect(
        __nativeScriptStableReadyScreenHostHandleForTests(controller),
      ).toBeUndefined();
    } finally {
      if (previousNativeObjectFromHandle === undefined) {
        delete (NativeScriptRuntime as any).nativeObjectFromHandle;
      } else {
        (NativeScriptRuntime as any).nativeObjectFromHandle =
          previousNativeObjectFromHandle;
      }

      if (previousRegistry === undefined) {
        delete globalObject.__rnsNativeScriptStackRegistry;
      } else {
        globalObject.__rnsNativeScriptStackRegistry = previousRegistry;
      }
    }
  });

  it('attaches the screen surface touch handler when host-ready identifies an already-windowed screen view', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const globalObject = global as Record<string, unknown>;
    const previousRegistry = globalObject.__rnsNativeScriptStackRegistry;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const previousNativeValueCache =
      globalObject.__rnsNativeScriptNativeValueCache;
    const previousNativeObjectFromHandle = (NativeScriptRuntime as any)
      .nativeObjectFromHandle;
    const attachToView = jest.fn((view: any) => {
      touchHandler.view = view;
      view.gestureRecognizers = [touchHandler];
    });
    const touchHandler: any = {
      attachToView,
      detachFromView: jest.fn(),
      isKindOfClass: (klass: unknown) => klass === RCTSurfaceTouchHandler,
      view: undefined as any,
    };
    function RCTSurfaceTouchHandler() {}
    RCTSurfaceTouchHandler.alloc = () => ({
      init: () => touchHandler,
    });

    const window = {};
    const screenView: any = {
      __rnsNativeScriptScreenView: true,
      bounds: { origin: { x: 0, y: 0 }, size: { width: 402, height: 874 } },
      convertPointToView: jest.fn(() => ({ x: 0, y: 0 })),
      frame: { origin: { x: 0, y: 0 }, size: { width: 402, height: 874 } },
      gestureRecognizers: [],
      superview: { window },
      window,
    };
    const contentWrapperView: any = {
      alpha: 1,
      bounds: screenView.bounds,
      frame: screenView.frame,
      hidden: false,
      superview: screenView,
      userInteractionEnabled: true,
      window,
    };
    const controller: any = {
      view: screenView,
    };
    const registry: any = {
      screenContentReady: { screen: true },
      screenContentWrapperHostHandles: { screen: 'wrapper-host' },
      screenContentWrapperViews: { screen: contentWrapperView },
      screenHostHandles: {},
      screenHostRefreshKeys: {},
      screenParents: { screen: 'stack' },
      screenProps: { screen: { screenId: 'screen' } },
      screenSurfaceTouchRefreshKeys: {},
      screens: { screen: controller },
      stackContexts: { stack: {} },
    };

    globalObject.__rnsNativeScriptStackRegistry = registry;
    delete globalObject.__rnsNativeScriptNativeValueCache;
    globalObject.__nativeScriptNativeApi = {
      RCTSurfaceTouchHandler,
    };
    (NativeScriptRuntime as any).nativeObjectFromHandle = jest.fn(
      (handle: string) => (handle === 'screen-host' ? screenView : null),
    );

    try {
      expect(
        __nativeScriptScreenHostReadyOnUIForTests(
          'screen',
          'stack',
          'screen-host',
        ),
      ).toBe(true);

      expect(screenView.__rnsNativeScriptLastTouchRefreshShouldAttach).toBe(
        true,
      );
      expect(attachToView).toHaveBeenCalledTimes(1);
      expect(attachToView).toHaveBeenCalledWith(screenView);
      expect(screenView.gestureRecognizers).toEqual([touchHandler]);
    } finally {
      if (previousRegistry === undefined) {
        delete globalObject.__rnsNativeScriptStackRegistry;
      } else {
        globalObject.__rnsNativeScriptStackRegistry = previousRegistry;
      }

      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }

      if (previousNativeValueCache === undefined) {
        delete globalObject.__rnsNativeScriptNativeValueCache;
      } else {
        globalObject.__rnsNativeScriptNativeValueCache =
          previousNativeValueCache;
      }

      if (previousNativeObjectFromHandle === undefined) {
        delete (NativeScriptRuntime as any).nativeObjectFromHandle;
      } else {
        (NativeScriptRuntime as any).nativeObjectFromHandle =
          previousNativeObjectFromHandle;
      }
    }
  });

  it('reattaches surface touch handlers when UIKit detaches them under an unchanged layout key', () => {
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    const globalObject = global as Record<string, unknown>;
    const previousRefreshUIKitHostView =
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner;
    const previousNativeApi = globalObject.__nativeScriptNativeApi;
    const refreshUIKitHostView = jest.fn(() => true);
    const attachToView = jest.fn((view: any) => {
      touchHandler.view = view;
      view.gestureRecognizers = [touchHandler];
    });
    const touchHandler: any = {
      attachToView,
      detachFromView: jest.fn(),
      isKindOfClass: (klass: unknown) => klass === RCTSurfaceTouchHandler,
      view: undefined as any,
    };
    function RCTSurfaceTouchHandler() {}
    RCTSurfaceTouchHandler.alloc = () => ({
      init: () => touchHandler,
    });

    NativeScriptRuntime.refreshUIKitHostViewDirectOwner = refreshUIKitHostView;
    globalObject.__nativeScriptNativeApi = {
      RCTSurfaceTouchHandler,
    };

    const screenView: any = {
      __rnsNativeScriptScreenView: true,
      bounds: { origin: { x: 0, y: 0 }, size: { width: 402, height: 874 } },
      convertPointToView: jest.fn(() => ({ x: 0, y: 0 })),
      frame: { origin: { x: 0, y: 0 }, size: { width: 402, height: 874 } },
      gestureRecognizers: [],
      superview: {},
      window: {},
    };
    const contentWrapperView: any = {
      alpha: 1,
      autoresizingMask: 18,
      bounds: { origin: { x: 0, y: 0 }, size: { width: 402, height: 874 } },
      frame: { origin: { x: 0, y: 0 }, size: { width: 402, height: 874 } },
      hidden: false,
      superview: screenView,
      userInteractionEnabled: true,
    };
    const registry: any = {
      screenContentReady: { screen: true },
      screenContentWrapperHostHandles: { screen: 'host' },
      screenContentWrapperRefreshKeys: {},
      screenContentWrapperViews: { screen: contentWrapperView },
      screenHostHandles: { screen: 'screen-host' },
      screenSurfaceTouchRefreshKeys: {},
      screens: { screen: { view: screenView } },
    };

    try {
      __nativeScriptRefreshScreenContentWrapperHostForTests('screen', registry);
      expect(attachToView).toHaveBeenCalledTimes(1);

      screenView.gestureRecognizers = [];
      touchHandler.view = undefined;
      attachToView.mockClear();
      refreshUIKitHostView.mockClear();

      __nativeScriptRefreshScreenContentWrapperHostForTests('screen', registry);

      expect(refreshUIKitHostView).not.toHaveBeenCalled();
      expect(attachToView).toHaveBeenCalledTimes(1);
      expect(screenView.gestureRecognizers).toEqual([touchHandler]);

      touchHandler.enabled = false;
      attachToView.mockClear();
      refreshUIKitHostView.mockClear();

      __nativeScriptRefreshScreenContentWrapperHostForTests('screen', registry);

      expect(refreshUIKitHostView).not.toHaveBeenCalled();
      expect(attachToView).not.toHaveBeenCalled();
      expect(touchHandler.enabled).toBe(true);
    } finally {
      NativeScriptRuntime.refreshUIKitHostViewDirectOwner =
        previousRefreshUIKitHostView;

      if (previousNativeApi === undefined) {
        delete globalObject.__nativeScriptNativeApi;
      } else {
        globalObject.__nativeScriptNativeApi = previousNativeApi;
      }
    }
  });

  it('invalidates stale body ownership when a screen controller identity changes', () => {
    expect(stackSource).toContain('function rememberScreenControllerRecord');
    expect(stackSource).toContain(
      'previousControllerHash !== nextControllerHash',
    );
    expect(stackSource).toContain(
      'resetScreenContentOwnershipState(props.screenId, registry);',
    );
    expect(stackSource).toContain(
      'registry.screenContentWrapperViews[screenId] = undefined;',
    );
    expect(stackSource).toContain(
      'rememberScreenControllerRecord(controller, props, ctx, registry);',
    );
  });

  it('uses UIKit system back button ownership for stack back navigation', () => {
    const configureHeaderBackButtonSource = stackSource.slice(
      stackSource.indexOf('function configureHeaderBackButton'),
      stackSource.indexOf('function isBlankOrNull'),
    );
    const installNativeBackActionSource = stackSource.slice(
      stackSource.indexOf('function installNativeBackActionIfNeeded'),
      stackSource.indexOf('function configureHeaderBackButton'),
    );
    const startNativeBackPopSource = stackSource.slice(
      stackSource.indexOf('function startNativeStackBackPopImpl'),
      stackSource.indexOf('function finishStackAppearanceTransition'),
    );
    const navigationBarShouldPopSource = stackSource.slice(
      stackSource.indexOf('navigationBarShouldPopItem('),
      stackSource.indexOf("'navigationBar:shouldPopItem:'"),
    );

    expect(stackSource).not.toContain('function createNativeBackBarButtonItem');
    expect(stackSource).not.toContain(
      'function configureNativeBackBarButtonItem',
    );
    expect(configureHeaderBackButtonSource).not.toContain(
      'configureNativeBackBarButtonItem(',
    );
    expect(configureHeaderBackButtonSource).toContain(
      'installNativeBackActionIfNeeded(',
    );
    expect(configureHeaderBackButtonSource).toContain(
      'navigationItem.hidesBackButton = !shouldShowBackButton;',
    );
    expect(configureHeaderBackButtonSource).not.toContain(
      'popViewControllerAnimated',
    );
    expect(configureHeaderBackButtonSource).not.toContain('markTransition(');
    expect(installNativeBackActionSource).toContain('.createNativeUIAction');
    expect(installNativeBackActionSource).toContain(
      'navigationItem.backAction = backAction.action;',
    );
    expect(installNativeBackActionSource).toContain(
      'controller[BACK_ACTION_KEY] = backAction;',
    );
    expect(installNativeBackActionSource).toContain(
      'startNativeStackBackPop(nav, controller, registry);',
    );
    expect(startNativeBackPopSource).toContain('markTransition(');
    expect(startNativeBackPopSource).toContain("'popViewControllerAnimated:'");
    expect(navigationBarShouldPopSource).toContain(
      'startNativeStackBackPop(this, topController, registry)',
    );
    expect(navigationBarShouldPopSource).toContain('return false;');
  });

  it('applies complete stack model changes from the host update and keeps the transaction fallback', () => {
    const updateSource = stackSource.slice(
      stackSource.indexOf('update(controller, props, _previousProps, ctx)'),
      stackSource.indexOf('transactionCommitted(controller, props'),
    );
    const transactionSource = stackSource.slice(
      stackSource.indexOf('transactionCommitted(controller, props'),
      stackSource.indexOf('hostReady(controller, props, event'),
    );

    expect(updateSource).toContain(
      'registry.stackPendingReconcileKeys[props.stackId] = activeKey;',
    );
    expect(updateSource).toContain('stack-host-update-defer-transaction');
    expect(updateSource).toContain('stackCanReconcileFromPropsUpdate(');
    expect(updateSource).toContain('stack-host-update-reconcile');
    expect(updateSource).toContain('reconcileStack(');
    expect(updateSource).toContain('stack-host-update-pending-transaction');
    expectSourceToContain(
      transactionSource,
      'stackCanReconcileFromPropsUpdate(\n' +
        '        props.stackId,\n' +
        '        registry,\n' +
        '        activeIds,\n' +
        '      )',
    );
    expectSourceToContain(
      transactionSource,
      'reconcileStack(\n' +
        '      props.stackId,\n' +
        '      registry,\n' +
        '      ctx,\n' +
        '      registry.stackNativeKeys[props.stackId] != null,\n' +
        '    );',
    );
  });

  it('keeps screen configuration from full stack layout during native transactions', () => {
    const configureSource = stackSource.slice(
      stackSource.indexOf('function configureScreenController'),
      stackSource.indexOf('function stableNativeScriptConfigValueKey'),
    );
    const updateCoreStart = stackSource.indexOf(
      "traceWorkletEvent('screen-host-update-core'",
    );
    const updateCoreSource = stackSource.slice(
      updateCoreStart,
      stackSource.indexOf(
        'if (props.parentId && registry.containerContexts[props.parentId])',
        updateCoreStart,
      ),
    );
    const modalUpdateSource = stackSource.slice(
      stackSource.indexOf(
        'if (presentedModalIdsForStack(stackId, registry).length > 0)',
      ),
      stackSource.indexOf(
        'if (!didChange && idsEqual(nativeIds, availableIds))',
      ),
    );

    expect(stackSource).toContain(
      'function navigationControllerHasActiveNativeTransaction',
    );
    expect(stackSource).toContain(
      'function screenHasActiveParentModalTransaction',
    );
    expect(stackSource).toContain(
      'const modalId = parentPresentedModalIdForContentScreen(screenId, registry);',
    );
    expect(stackSource).toContain(
      'registry.stackTransitionScreenIds[parentStackId] === modalId',
    );
    expect(stackSource).toContain(
      'const modalContentParentId = stackId\n' +
        '    ? registry.stackModalContentParentScreenIds[stackId]\n' +
        '    : undefined;',
    );
    expect(stackSource).toContain(
      'const modalContentParentOwnsPresentedRoute = !!(',
    );
    expect(stackSource).toContain(
      'presentedModalIdsForStack(modalContentParentStackId, registry).indexOf(',
    );
    expect(stackSource).toContain(
      'const modalContentParentHasActiveNativeTransaction = !!(',
    );
    expect(stackSource).not.toContain(
      'navigationController.view?.window == null &&',
    );
    expect(stackSource).toContain(
      'modalContentParentHasActiveNativeTransaction ||',
    );
    expect(configureSource).toContain(
      'screenHasActiveParentModalTransaction(props.screenId, registry) ||\n' +
        '      navigationControllerHasActiveNativeTransaction(',
    );
    expect(configureSource).toContain(
      'navigationControllerHasActiveNativeTransaction(\n' +
        '        navigationController,\n' +
        '        registry,\n' +
        '      )',
    );
    expect(configureSource).toContain(
      "'configure-screen-controller-skip-layout'",
    );
    expect(configureSource).toContain(
      'restoreVisibleNavigationControllerInteractivity(\n' +
        '        navigationController,\n' +
        '        registry,\n' +
        '        true,\n' +
        '      );',
    );
    expect(
      configureSource.indexOf('navigationControllerHasActiveNativeTransaction'),
    ).toBeLessThan(
      configureSource.indexOf(
        "layoutNavigationStackViews(\n        navigationController,\n        'configure-screen-controller',\n      );",
      ),
    );
    expect(updateCoreSource).toContain(
      'false,\n' + '        true,\n' + '        false,\n' + '      );',
    );
    expect(modalUpdateSource).toContain(
      'const canSkipPostModalUpdateLayout =',
    );
    expect(modalUpdateSource).toContain(
      '!navigationControllerNeedsViewHostingRepair(navigationController) &&',
    );
    expect(modalUpdateSource).toContain(
      'navigationStackHasStableReadyContent(navigationController, registry)',
    );
    expect(modalUpdateSource).toContain(
      "'reconcile-stack-after-modal-update-skip-stable'",
    );
    expect(modalUpdateSource).toContain(
      'layoutNavigationStackViews(\n' +
        '          navigationController,\n' +
        "          'reconcile-stack-after-modal-update',\n" +
        '        );',
    );
    expect(modalUpdateSource).toContain(
      'configureStackControllers(availableIds, registry, false, false);',
    );
    expect(modalUpdateSource).not.toContain(
      'configureStackControllers(availableIds, registry);\n' +
        '      configureNavigationAppearance(',
    );
  });

  it('prepares native push content without hosted-content retry gates', () => {
    const pushSource = stackSource.slice(
      stackSource.indexOf('const isPush ='),
      stackSource.indexOf('if (isPop && nativeIds.length > nextCount)'),
    );
    const popSource = stackSource.slice(
      stackSource.indexOf('if (isPop && nativeIds.length > nextCount)'),
      stackSource.indexOf(
        'const previousTopScreenId = previousIds[previousCount - 1]',
      ),
    );
    const prepareIndex = pushSource.indexOf(
      'prepareControllerForStackExposure(',
    );
    const animateCallIndex = pushSource.indexOf(
      'didAnimatePush = animateStackPush(',
    );

    expect(stackSource).not.toContain('stackContentReadyRetryTokens');
    expect(stackSource).not.toContain('function scheduleContentReadyReconcile');
    expect(stackSource).not.toContain(
      'function pushedScreenHostedContentIsReady',
    );
    expect(pushSource).not.toContain(
      'RNSScreenContentWrapper host is prepared before',
    );
    expect(pushSource).not.toContain('blank UIKit shell');
    expect(pushSource).not.toContain('configureScreenControllerHeader(');
    expect(pushSource).not.toContain('configureSourceBackButton(');
    expect(stackSource).toContain('configureHeaderForWillShowViewController(');
    expect(pushSource).toContain(
      'prepareControllerForStackExposure(\n' +
        '        navigationController,\n' +
        '        pushedScreenId,\n' +
        '        pushedController,\n' +
        '        registry,\n' +
        '        ctx,\n' +
        '        true,\n' +
        '        nextCount > 1,\n' +
        '        true,\n' +
        '        false,\n' +
        '        true,\n' +
        '      );',
    );
    expect(pushSource).not.toContain(
      'prepareScreenHostedContentForNativeTransition(',
    );
    expect(pushSource).not.toContain('pushedScreenHasReadyHostDescendants');
    expect(pushSource).not.toContain('pushedScreenHasVisibleHostedContent');
    expect(pushSource).not.toContain('shouldForcePushedContentRefresh');
    expect(pushSource).not.toContain('refreshScreenContentWrapperHost(');
    expect(pushSource).not.toContain('flushKnownUIKitHostView(');
    expect(
      pushSource.slice(
        0,
        pushSource.indexOf('didAnimatePush = animateStackPush('),
      ),
    ).not.toContain('refreshScreenSurfaceTouchHandlerIfNeeded(');
    expect(stackSource).toContain(
      'const alreadyPreparedCommittedContent =\n' +
        '    screenContentIsReady(screenId, registry) &&\n' +
        '    (!contentWrapperView || wrapperAlreadyMounted) &&\n' +
        '    (controllerView.window != null || contentWrapperView?.window != null) &&\n' +
        '    screenHasHostReadyVisibleDescendants(screenId, registry);',
    );
    expect(stackSource).not.toContain('alreadyPreparedVisibleContent');
    const postAnimateSource = pushSource.slice(
      pushSource.indexOf('if (didAnimatePush) {'),
      pushSource.indexOf(
        'scheduleTransitionFallback(',
        pushSource.indexOf('if (didAnimatePush) {'),
      ),
    );
    expect(postAnimateSource).not.toContain(
      'layoutNavigationStackViews(navigationController);',
    );
    expect(postAnimateSource).not.toContain('refreshScreenContentWrapperHost(');
    expect(postAnimateSource).not.toContain('flushKnownUIKitHostView(');
    expect(postAnimateSource).toContain(
      'prepareVisibleScreenForImmediateInteraction(\n' +
        '            pushedScreenId,\n' +
        '            registry,\n' +
        '            pushedControllerView,\n' +
        '            false,\n' +
        '          );',
    );
    expect(popSource).toContain(
      'const revealedControllerView = screenControllerView(\n' +
        '          controllers[nextCount - 1],\n' +
        '        );',
    );
    expect(popSource).toContain(
      'prepareVisibleScreenForImmediateInteraction(\n' +
        '            revealedScreenId,\n' +
        '            registry,\n' +
        '            revealedControllerView,\n' +
        '            false,\n' +
        '          );',
    );
    expect(pushSource).not.toMatch(
      /if\s*\(\s*!didPreparePushedContent\s*&&\s*!screenContentIsReady\(\s*pushedScreenId,\s*registry,?\s*\)\s*\)/,
    );
    expect(prepareIndex).toBeGreaterThanOrEqual(0);
    expect(pushSource).not.toContain(
      '!screenHeaderSubviewsAreReady(pushedScreenId, registry)',
    );
    expect(pushSource.indexOf('const token = markTransition')).toBeLessThan(
      prepareIndex,
    );
    expect(pushSource).not.toContain('configureScreenControllerHeader');
    expect(animateCallIndex).toBeGreaterThanOrEqual(0);
    expect(prepareIndex).toBeLessThan(animateCallIndex);
    expect(stackSource).not.toContain('controllerViewBeforePush');
    expect(stackSource).toContain("'pushViewController:animated:'");
    expect(pushSource).toContain(
      'prepareVisibleScreenForImmediateInteraction(\n' +
        '            pushedScreenId,\n' +
        '            registry,\n' +
        '            pushedControllerView,\n' +
        '            false,\n' +
        '          );',
    );
    expect(popSource).toContain(
      'prepareVisibleScreenForImmediateInteraction(\n' +
        '            revealedScreenId,\n' +
        '            registry,\n' +
        '            revealedControllerView,\n' +
        '            false,\n' +
        '          );',
    );
    const interactionPrepSource = stackSource.slice(
      stackSource.indexOf('function prepareVisibleScreenForImmediateInteraction'),
      stackSource.indexOf('function screenHostedViewNeedsRefresh'),
    );
    expect(interactionPrepSource).toContain(
      'restoreHostedReactSubviewInteractivity(controllerView)',
    );
    expect(interactionPrepSource).toContain(
      'restoreHostedReactSubviewInteractivity(contentWrapperView)',
    );
    expect(interactionPrepSource).toContain(
      'refreshScreenContentWrapperTouchHandler(',
    );
    expect(interactionPrepSource).toContain(
      'refreshScreenSurfaceTouchHandlerIfNeeded(',
    );
    expect(stackSource).toMatch(
      /restoreDetachedScreenViewIntoNavigationWrapper\(\s*controller,\s*controllerView,\s*true,\s*\);/,
    );
    expect(pushSource).not.toContain(
      'configureScreenController(\n' +
        '          pushedController,\n' +
        '          registry.screenProps[pushedScreenId]!,',
    );
  });

  it('refreshes hosted UIKit views across modal and native gesture transitions', () => {
    const completeModalSource = stackSource.slice(
      stackSource.indexOf('function completeModalTransitionTransaction'),
      stackSource.indexOf(
        'function completeNativePresentedModalDismissalForController',
      ),
    );
    const navigationLayoutSource = stackSource.slice(
      stackSource.indexOf('function layoutNavigationStackViews'),
      stackSource.indexOf('function layoutPresentedModalControllers'),
    );
    const modalLayoutSource = stackSource.slice(
      stackSource.indexOf('function layoutPresentedModalControllers'),
      stackSource.indexOf('function configureHeaderBackButton'),
    );
    const restoreInteractivitySource = stackSource.slice(
      stackSource.indexOf(
        'function restoreVisibleNavigationControllerInteractivity',
      ),
      stackSource.indexOf('function rectMaxY'),
    );
    const refreshVisibleTouchSource = stackSource.slice(
      stackSource.indexOf('function refreshVisibleScreenTouchHandlers'),
      stackSource.indexOf('function visibleBaseScreenIdsAfterModalDismissal'),
    );

    expect(stackSource).toContain(
      'function refreshNavigationControllerHostedViews',
    );
    expect(stackSource).toContain('function layoutPresentedModalControllers');
    expect(stackSource).toContain(
      'function layoutDescendantNavigationStacksForController',
    );
    expect(stackSource).toContain(
      'function layoutNestedNavigationControllerInParentView',
    );
    expect(stackSource).toContain(
      'layoutNestedNavigationControllerInParentView(\n' +
        '      navigationController,\n' +
        '      modalView,\n' +
        '    )',
    );
    expect(stackSource).toContain(
      'layoutPresentedModalControllers(stackId, registry)',
    );
    expect(stackSource).toContain(
      'refreshNavigationControllerHostedViews(navigationController);',
    );
    expect(restoreInteractivitySource).toContain('forceTouchRefresh = false');
    expect(restoreInteractivitySource).toContain(
      'const contentWrapperView = liveScreenContentWrapperViewFromRegistry(\n' +
        '        visibleScreenId,\n' +
        '        registry,\n' +
        '      );',
    );
    expect(restoreInteractivitySource).toContain('forceTouchRefresh,\n      );');
    expect(refreshVisibleTouchSource).toContain(
      'const contentWrapperView = liveScreenContentWrapperViewFromRegistry(\n' +
        '      screenId,\n' +
        '      registry,\n' +
        '    );',
    );
    expect(refreshVisibleTouchSource).toContain(
      'restoreScreenControllerViewFromHostHandle(controller, screenId, registry);\n' +
        '    const controllerView = screenControllerView(controller);',
    );
    expect(refreshVisibleTouchSource).toContain(
      'refreshScreenSurfaceTouchHandlerIfNeeded(\n' +
        '      screenId,\n' +
        '      registry,\n' +
        '      controllerView,\n' +
        '      contentWrapperView,\n' +
        '      true,\n' +
        '    );',
    );
    expect(refreshVisibleTouchSource).toContain(
      'contentWrapperNeedsSurfaceTouchHandlerFallback(\n' +
        '        controllerView,\n' +
        '        contentWrapperView,\n' +
        '      )',
    );
    expect(refreshVisibleTouchSource).toContain(
      'refreshScreenSurfaceTouchHandlerIfNeeded(\n' +
        '        screenId,\n' +
        '        registry,\n' +
        '        contentWrapperView,\n' +
        '        contentWrapperView,\n' +
        '        true,\n' +
        '      );',
    );
    expect(stackSource).toContain(
      'const navigationView = navigationController?.view',
    );
    expect(stackSource).toContain(
      'navigationView.userInteractionEnabled = true',
    );
    expect(stackSource).toContain(
      'const controllerView = screenControllerView(controller)',
    );
    expect(stackSource).toContain(
      'updateSurfaceTouchHandlerOriginsForView(controllerView)',
    );
    expect(stackSource).toContain(
      'screenControllerLayoutDidChange(\n      controller,\n      registry,\n    )',
    );
    expect(navigationLayoutSource).toContain(
      'const shouldRefreshMissingTopHostedContent =\n' +
        '      isTopController &&\n' +
        '      contentIsReady &&\n' +
        '      !hasVisibleHostedContent &&\n' +
        '      !hasCommittedHostedContent;',
    );
    expect(navigationLayoutSource).toContain(
      'invalidateScreenHostedContentRefreshKeys(screenId, registry);',
    );
    expect(navigationLayoutSource).toContain(
      '!shouldForceCompletedNativeDismissLayout &&\n' +
        '    navigationStackCanSkipStableLayout(',
    );
    expect(navigationLayoutSource).toContain(
      'const shouldForceCompletedNativeDismissHostedLayout =\n' +
        '      shouldForceCompletedNativeDismissLayout && isTopController;',
    );
    expect(navigationLayoutSource).toContain(
      'restoreLiveViewInteractionChain(contentWrapperView, controllerView);',
    );
    expect(navigationLayoutSource).toContain(
      'const shouldForceControllerTouchRefresh =\n' +
        '        shouldRefreshMissingTopHostedContent ||\n' +
        '        shouldForceCompletedNativeDismissHostedLayout;',
    );
    expect(navigationLayoutSource).toContain(
      'layoutHostedReactSubviews(\n' +
        '        controller,\n' +
        '        controllerView,\n' +
        '        shouldRefreshMissingTopHostedContent,\n' +
        '        true,\n' +
        '        registry,\n' +
        '        screenId,\n' +
        '        shouldForceControllerTouchRefresh,\n' +
        '        shouldForceCompletedNativeDismissHostedLayout,\n' +
      '      );',
    );
    expect(navigationLayoutSource).toContain(
      'const didSetControllerBounds = setViewBoundsIfNeeded(',
    );
    expect(navigationLayoutSource).toContain(
      'refreshScreenContentWrapperHost(\n' +
        '        screenId,\n' +
        '        registry,\n' +
        '        shouldRefreshMissingTopHostedContent,\n' +
        '        true,\n' +
        '        shouldForceControllerTouchRefresh,\n' +
        '        false,\n' +
        "        'layout-navigation-stack',\n" +
        '      );',
    );
    expect(navigationLayoutSource).toContain(
      'const screenId = controllerScreenId(controller);',
    );
    expect(navigationLayoutSource).not.toContain(
      'setViewFrameIfNeeded(stackHostView',
    );
    expect(navigationLayoutSource).toContain(
      'const navigationTargetBounds = isModalNavigationController',
    );
    expect(navigationLayoutSource).toContain(
      '? firstPositiveRect(',
    );
    expect(navigationLayoutSource).toContain(
      ': firstPositiveRect(',
    );
    expect(navigationLayoutSource).toContain(
      'stackHostView?.superview?.bounds',
    );
    expect(navigationLayoutSource).toContain(
      'const navigationTargetFrame = rectWithZeroOrigin(navigationTargetBounds);',
    );
    expect(navigationLayoutSource).toContain(
      'setViewBoundsIfNeeded(\n' +
        '      navigationView,\n' +
        '      boundsRectForFilledHostedSubview(navigationView, navigationTargetFrame),\n' +
        '    );',
    );
    expect(navigationLayoutSource).toContain("The stack view's own frame is");
    expect(stackSource).toContain('function layoutHostedReactSubviews');
    expect(modalLayoutSource).toContain(
      'let didChangeControllerGeometry = false;',
    );
    expect(modalLayoutSource).toContain(
      'if (\n' +
        '      modalContentNeedsRepair ||\n' +
        '      didChangeControllerGeometry ||\n' +
        '      didRestorePresentedAttachment\n' +
        '    ) {\n' +
        '      layoutDescendantNavigationStacksForController(controller);\n' +
        '      modalIdsNeedingTouchRefresh.push(modalId);\n' +
        '    }',
    );
    expect(navigationLayoutSource).toContain(
      'layoutNestedNavigationControllerInParentView(child, parentView);',
    );
    expect(stackSource).toContain(
      'setViewBoundsIfNeeded(\n' +
        '      stackView,\n' +
        '      boundsRectForFilledHostedSubview(',
    );
    expect(completeModalSource).toContain(
      'layoutPresentedModalControllers(stackId, registry);',
    );
    expect(completeModalSource).toContain('const alreadyCompleted =');
    expect(completeModalSource).toContain(
      'registry.stackUpdatingModals[stackId] !== true',
    );
    expect(completeModalSource).toContain(
      'registry.stackTransitioning[stackId] !== true',
    );
    expect(completeModalSource.indexOf('if (alreadyCompleted)')).toBeLessThan(
      completeModalSource.indexOf(
        'applyStackNativeState(stackId, registry, nativeState);',
      ),
    );
    expect(completeModalSource).toMatch(
      /if\s*\(\s*closing\s*\)\s*\{\s*resetPresentedModalContentRefreshState\(screenId,\s*registry\);\s*restoreVisibleBaseStackAfterModalDismissal\(stackId,\s*registry\);\s*\}/,
    );
    expect(completeModalSource).toMatch(
      /if\s*\(\s*alreadyCompleted\s*\)\s*\{\s*if\s*\(\s*closing\s*\)\s*\{\s*resetPresentedModalContentRefreshState\(screenId,\s*registry\);\s*restoreVisibleBaseStackAfterModalDismissal\(stackId,\s*registry\);\s*\}\s*return;\s*\}/,
    );
  });

  it('restores a reattached content-wrapper child host before visible-content checks', () => {
    const hostedDescendant = {
      accessibilityElementsHidden: true,
      alpha: 1,
      gestureRecognizers: [{}],
      hidden: false,
      subviews: [],
      userInteractionEnabled: false,
    };
    const childHost: any = {
      accessibilityElementsHidden: true,
      alpha: 0,
      autoresizingMask: 0,
      frame: { origin: { x: 12, y: 18 }, size: { height: 20, width: 40 } },
      gestureRecognizers: [],
      hidden: true,
      removeFromSuperview: jest.fn(() => {
        childHost.superview = null;
      }),
      subviews: [hostedDescendant],
      superview: null,
      userInteractionEnabled: false,
    };
    const wrapper: any = {
      __rnsNativeScriptScreenContentWrapperChildrenView: childHost,
      addSubview: jest.fn((view: any) => {
        view.superview = wrapper;
        wrapper.subviews = [view];
      }),
      bounds: { origin: { x: 0, y: 0 }, size: { height: 480, width: 320 } },
      frame: { origin: { x: 0, y: 0 }, size: { height: 480, width: 320 } },
      subviews: [],
    };

    expect(
      __nativeScriptNormalizeScreenContentWrapperChildHostForTests(wrapper),
    ).toBe(true);

    expect(childHost.removeFromSuperview).toHaveBeenCalled();
    expect(wrapper.addSubview).toHaveBeenCalledWith(childHost);
    expect(childHost.superview).toBe(wrapper);
    expect(childHost.hidden).toBe(false);
    expect(childHost.alpha).toBe(1);
    expect(childHost.userInteractionEnabled).toBe(true);
    expect(childHost.accessibilityElementsHidden).toBe(false);
    expect(hostedDescendant.accessibilityElementsHidden).toBe(false);
    expect(hostedDescendant.userInteractionEnabled).toBe(true);
  });

  it('resolves content-wrapper host handles to the UIKit wrapper root, not the NativeScript shell', () => {
    const rnContent = {
      hidden: false,
      subviews: [],
    };
    const childHost: any = {
      hidden: false,
      subviews: [rnContent],
    };
    const wrapperRoot: any = {
      __rnsNativeScriptScreenContentWrapperChildrenView: childHost,
      __rnsNativeScriptScreenContentWrapperRootView: true,
      hidden: false,
      subviews: [childHost],
    };
    const nativeScriptShell: any = {
      description:
        '<NativeScriptUIView: 0xshell; debugName = RNSScreenContentWrapper.NativeScript>',
      hidden: false,
      subviews: [wrapperRoot],
    };
    const screenView: any = {
      hidden: false,
      subviews: [nativeScriptShell],
    };
    childHost.superview = wrapperRoot;
    wrapperRoot.superview = nativeScriptShell;
    nativeScriptShell.superview = screenView;

    expect(
      __nativeScriptScreenContentWrapperFabricViewForMountedViewForTests(
        nativeScriptShell,
        screenView,
      ),
    ).toBe(wrapperRoot);
    expect(
      __nativeScriptScreenContentWrapperFabricViewForMountedViewForTests(
        wrapperRoot,
        screenView,
      ),
    ).toBe(wrapperRoot);
    expect(
      __nativeScriptScreenContentWrapperFabricViewForMountedViewForTests(
        childHost,
        screenView,
      ),
    ).toBe(wrapperRoot);
    const parentOwnedWrapperRoot: any = {
      __rnsNativeScriptScreenContentWrapperChildrenView: childHost,
      __rnsNativeScriptScreenContentWrapperRootView: true,
      hidden: false,
      subviews: [nativeScriptShell],
    };
    nativeScriptShell.subviews = [];
    nativeScriptShell.superview = parentOwnedWrapperRoot;
    parentOwnedWrapperRoot.superview = screenView;
    screenView.subviews = [parentOwnedWrapperRoot];

    expect(
      __nativeScriptScreenContentWrapperFabricViewForMountedViewForTests(
        nativeScriptShell,
        screenView,
      ),
    ).toBe(parentOwnedWrapperRoot);
    expect(
      __nativeScriptScreenContentWrapperFabricViewForMountedViewForTests(
        {
          description: '<NativeScriptUIView: 0xhost; debugName = Other>',
          hidden: false,
          subviews: [],
        },
        screenView,
      ),
    ).toBe(null);
  });

  it('defers content-wrapper remounts when UIKit ownership still belongs to another controller', () => {
    const screenController: any = {
      __nativeScriptScreenId: 'screen',
      view: null,
    };
    const tabController: any = {
      __rnsNativeScriptTabsView: true,
      view: { window: {} },
    };
    const screenView: any = {
      __nativeScriptOwningViewController: screenController,
      __rnsNativeScriptScreenView: true,
      addSubview: jest.fn(() => {
        throw new Error(
          'child view controller:<UIViewController> should have parent view controller:<RNSScreenNativeScriptController> but actual parent is:<UITabBarController>',
        );
      }),
      subviews: [],
      window: {},
    };
    const contentWrapperView: any = {
      __rnsNativeScriptScreenContentWrapperRootView: true,
      reactViewController: jest.fn(() => tabController),
      subviews: [],
      superview: { window: {} },
      window: {},
    };
    screenController.view = screenView;

    expect(
      __nativeScriptScreenContentWrapperCanMountInScreenViewForTests(
        'screen',
        {
          screens: { screen: screenController },
        } as any,
        screenView,
        contentWrapperView,
      ),
    ).toBe(false);
    expect(screenView.addSubview).not.toHaveBeenCalled();
  });

  it('derives native stack active ids from rendered children without waiting for registration effects', () => {
    const stackItemSource = stackSource.slice(
      stackSource.indexOf('export const NativeScriptScreenStackItem'),
      stackSource.indexOf('const styles = StyleSheet.create'),
    );

    expect(stackItemSource).not.toContain('stackContext.registerScreen');
    expect(stackItemSource).not.toContain('stackContext.unregisterScreen');
    expect(stackSource).toContain('const previousActiveScreenIdsRef');
    expect(stackSource).toContain(
      'previousActiveScreenIdsRef.current = activeScreenIds;',
    );
    expect(stackSource).toContain(
      'function stackModelRevisionKeyFromStackChildRecords',
    );
    expect(stackSource).toContain(
      'previousStackModelRevisionKeyRef.current !== stackModelRevisionKey',
    );
    expect(stackSource).toContain(
      'previousStackModelRevisionKeyRef.current = stackModelRevisionKey;',
    );

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
    const inactive = React.createElement(
      NativeScriptScreenStackItem,
      { activityState: 0, screenId: 'inactive' },
      'inactive',
    );
    const descriptorOnly = React.createElement(
      NativeScriptScreenStackItem,
      {
        activityState: 2,
        descriptor: { route: { key: 'descriptor-detail' } },
      } as any,
      'descriptor-detail',
    );

    expect(
      __nativeScriptActiveScreenIdsFromStackChildrenForTests(
        [root, detail, inactive, descriptorOnly],
        new Set(),
        new Set(),
      ),
    ).toEqual(['root', 'detail', 'descriptor-detail']);
    expect(
      __nativeScriptActiveScreenIdsFromStackChildrenForTests(
        [root, detail],
        new Set(['detail']),
        new Set(),
      ),
    ).toEqual(['root']);
    expect(
      __nativeScriptActiveScreenIdsFromStackChildrenForTests(
        [root, detail],
        new Set(),
        new Set(['detail']),
      ),
    ).toEqual(['root']);
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

  it('preserves the allocated RNSScreen view when interop view reads are nullish', () => {
    jest.resetModules();
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    const makeAllocatedScreenView = (name: string) => {
      const view: any = {
        accessibilityIdentifier: undefined,
        autoresizingMask: undefined,
        backgroundColor: undefined,
        bounds: { origin: { x: 0, y: 0 }, size: { width: 0, height: 0 } },
        frame: undefined,
        init: () => undefined,
        initWithFrame: (frame: unknown) => {
          view.initialFrame = frame;
          return view;
        },
        name,
        subviews: [],
        userInteractionEnabled: false,
      };

      return view;
    };
    const allocatedScreenView = makeAllocatedScreenView('mounted');
    const replacementScreenView = makeAllocatedScreenView('replacement');
    const plainControllerView = makeAllocatedScreenView(
      'plain-controller-view',
    );
    const allocatedViews = [allocatedScreenView, replacementScreenView];
    const associatedObjects = new WeakMap<object, Map<string, unknown>>();
    const controller: any = {
      childViewControllers: [],
      navigationItem: undefined,
      view: plainControllerView,
      viewControllers: [],
    };
    const UIView: any = function UIView() {};
    UIView.alloc = () => allocatedViews.shift();
    UIView.extend = () => UIView;

    const UIViewController: any = function UIViewController() {};
    UIViewController.alloc = () => ({
      init: () => controller,
    });
    UIViewController.extend = (methods: Record<string, unknown>) => ({
      alloc: () => ({
        init: () => {
          Object.defineProperties(
            controller,
            Object.getOwnPropertyDescriptors(methods),
          );
          return controller;
        },
      }),
    });

    (global as Record<string, unknown>).NativeClass = jest.fn();
    (global as Record<string, unknown>).interop = {
      getAssociatedObject(object: object, key: string) {
        return associatedObjects.get(object)?.get(key) ?? null;
      },
      setAssociatedObject(object: object, key: string, value: unknown) {
        let records = associatedObjects.get(object);
        if (!records) {
          records = new Map();
          associatedObjects.set(object, records);
        }
        if (value == null) {
          records.delete(key);
        } else {
          records.set(key, value);
        }
      },
    };
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      CGRectMake: (x: number, y: number, width: number, height: number) => ({
        origin: { x, y },
        size: { width, height },
      }),
      UIColor: {
        systemBackgroundColor: 'system-background',
      },
      UIView,
      UIViewController,
    };

    try {
      jest.requireActual('./NativeScriptScreenStack.ios');
      const screenDefinition = NativeScriptRuntime.__getDefinitions().find(
        (definition: { debugName?: string }) =>
          definition.debugName === 'RNSScreen.NativeScript',
      );

      const created = screenDefinition.createController({
        screenId: 'home',
      });

      expect(created.view).toBe(allocatedScreenView);
      expect(created.view).not.toBe(plainControllerView);
      expect(created.__nativeScriptScreenView).toBe(allocatedScreenView);
      expect(created.view.__rnsNativeScriptScreenView).toBe(true);
      expect(created.view.accessibilityIdentifier).toBe('home');
      expect(created.view.backgroundColor).toBe('system-background');

      created.__nativeScriptScreenView = undefined;
      created.view = plainControllerView;
      expect(screenDefinition.childrenView(created)).toBe(allocatedScreenView);
      expect(created.view).toBe(allocatedScreenView);

      created.view = undefined;
      expect(screenDefinition.childrenView(created)).toBe(allocatedScreenView);
      created.__nativeScriptScreenView = undefined;
      created.loadView();
      expect(created.view).toBe(allocatedScreenView);
      expect(created.view).not.toBe(replacementScreenView);

      const snapshotView = { snapshot: true };
      created.view = snapshotView;
      created.__nativeScriptIsRemovedFromParent = true;
      screenDefinition.update(created, { screenId: 'home' }, {}, {});
      expect(created.view).toBe(allocatedScreenView);
      expect(created.__nativeScriptIsRemovedFromParent).toBe(false);
    } finally {
      (global as Record<string, unknown>).NativeClass = undefined;
      (global as Record<string, unknown>).interop = undefined;
      (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
      (global as Record<string, unknown>).__rnsNativeScriptScreenViewClass =
        undefined;
      (
        global as Record<string, unknown>
      ).__rnsNativeScriptScreenControllerClass = undefined;
    }
  });

  it('materializes RNSScreen view subclasses through UIView.extend when NativeClass is unavailable', () => {
    jest.resetModules();
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    const UIView: any = function UIView() {};
    UIView.alloc = () => ({
      init: () => ({
        plainFallback: true,
        subviews: [],
      }),
    });
    UIView.extend = (methods: Record<string, unknown>) => ({
      alloc: () => ({
        init: () => {
          const view: any = {
            subviews: [],
            super: {},
          };
          Object.defineProperties(
            view,
            Object.getOwnPropertyDescriptors(methods),
          );
          return view;
        },
      }),
    });

    const UIViewController: any = function UIViewController() {};
    UIViewController.alloc = () => ({
      init: () => ({
        plainController: true,
        view: undefined,
      }),
    });
    UIViewController.extend = (methods: Record<string, unknown>) => ({
      alloc: () => ({
        init: () => {
          const controller: any = {
            childViewControllers: [],
            navigationItem: undefined,
            super: {},
            view: undefined,
            viewControllers: [],
          };
          Object.defineProperties(
            controller,
            Object.getOwnPropertyDescriptors(methods),
          );
          return controller;
        },
      }),
    });

    (global as Record<string, unknown>).NativeClass = undefined;
    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIColor: {
        systemBackgroundColor: 'system-background',
      },
      UIView,
      UIViewController,
    };

    try {
      jest.requireActual('./NativeScriptScreenStack.ios');

      const screenDefinition = NativeScriptRuntime.__getDefinitions().find(
        (definition: { debugName?: string }) =>
          definition.debugName === 'RNSScreen.NativeScript',
      );
      const created = screenDefinition.createController({ screenId: 'home' });

      expect(created.plainController).toBeUndefined();
      expect(created.view.plainFallback).toBeUndefined();
      expect(created.view.__rnsNativeScriptScreenView).toBe(true);
      expect(typeof created.view.refreshSurfaceTouchHandler).toBe('function');
      expect(typeof created.view['hitTest:withEvent:']).toBe('function');
      expect(typeof created.view.providerSafeAreaInsets).toBe('function');
    } finally {
      (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
      (global as Record<string, unknown>).__rnsNativeScriptScreenViewClass =
        undefined;
      (
        global as Record<string, unknown>
      ).__rnsNativeScriptScreenControllerClass = undefined;
    }
  });

  it('ports RNSScreen setViewToSnapshot for native-owned unmounts', () => {
    expect(stackSource).toContain('setViewToSnapshot()');
    expect(stackSource).toContain('this.__nativeScriptViewIsSnapshot === true');
    expect(stackSource).toContain('const view = screenControllerView(this)');
    expect(stackSource).toContain('snapshotViewAfterScreenUpdates');
    expect(stackSource).toContain('props?.snapshotAfterUpdates !== false');
    expect(stackSource).toContain('snapshot.userInteractionEnabled = false');
    expect(stackSource).toContain('this.view = snapshot');
    expect(stackSource).toContain('this.__nativeScriptViewIsSnapshot = true');
    expect(stackSource).toContain(
      'controller.__nativeScriptViewIsSnapshot = false',
    );
    expect(stackSource).toContain('controller.setViewToSnapshot?.();');
  });

  it('restores RNSScreen controller views from the NativeScript host-ready handle', () => {
    expect(stackSource).toContain('function registeredScreenViewForController');
    expect(stackSource).toContain(
      'const screenViewHandle = registry?.screenHostHandles?.[screenId];',
    );
    expect(stackSource).toContain(
      'const registeredView = registeredScreenViewForController(controller);',
    );
    expect(stackSource).toContain(
      'registeredScreenViewForController(controller) ??',
    );
    expect(stackSource).toContain(
      'function restoreScreenControllerViewFromHostHandle',
    );
    expect(stackSource).toContain(
      'const hostViewHandle = registry.screenHostHandles[screenId];',
    );
    expect(stackSource).toContain(
      'const previousSuperview = previousView?.superview;',
    );
    expect(stackSource).toContain('view.__rnsNativeScriptScreenView = true;');
    expect(stackSource).toContain(
      'existingView.__rnsNativeScriptScreenView = true;',
    );
    expect(stackSource).toContain(
      'const previousIndex = previousSuperview\n' +
        '    ? arrayIndexOf(previousSubviews, previousView)\n' +
        '    : -1;',
    );
    expect(stackSource).toContain(
      'if (previousSuperview && !view.superview) {',
    );
    expect(stackSource).toContain(
      'previousSuperview.insertSubviewAtIndex(view, previousIndex);',
    );
    expect(stackSource).toContain('function findStaleNavigationWrapperChild');
    expect(stackSource).toContain(
      "description.includes('UIViewControllerWrapperView')",
    );
    expect(stackSource).toContain(
      "description.includes('UIViewControllerWrapperView') && count === 0",
    );
    expect(stackSource).toContain(
      'function restoreDetachedScreenViewIntoNavigationWrapper',
    );
    expect(stackSource).toContain('allowStagedRestore = false');
    expect(stackSource).toContain('function viewHasAncestorWithTag');
    expect(stackSource).toContain(
      'viewHasAncestorWithTag(view, MOUNT_VIEW_TAG, navigationHostView)',
    );
    expect(stackSource).toContain(
      'nativeScriptStackContainerView(navigationController) ?? navigationView',
    );
    expect(stackSource).toContain(
      'viewIsDescendantOfView(view, navigationHostView)',
    );
    expect(stackSource).toContain(
      'controllersEqual(\n' +
        '      controller.navigationController?.topViewController,\n' +
        '      controller,\n' +
        '    )',
    );
    expect(stackSource).toContain('!allowStagedRestore');
    expect(stackSource).toContain(
      'const staleFrame = match.staleView?.frame ?? match.wrapper.bounds;',
    );
    expect(stackSource).toContain(
      'return restoreDetachedScreenViewIntoNavigationWrapper(controller, view);',
    );
    expect(stackSource).toContain('const didRestoreScreenView =');
    expect(stackSource).toContain(
      'restoreDetachedScreenViewIntoNavigationWrapper(\n' +
        '      controller,\n' +
        '      controllerView,\n' +
        '      isTopController,\n' +
        '    );',
    );
    expect(stackSource).toContain(
      'didRestoreScreenView ||\n' +
        '      didSetControllerFrame ||\n' +
        '      didSetControllerBounds ||',
    );
    expect(stackSource).toContain(
      'const shouldRepairControllerHostedSubviews =',
    );
    expect(stackSource).toContain(
      'const contentIsReady = screenContentIsReady(screenId, registry);',
    );
    expect(stackSource).toContain(
      'const hasVisibleHostedContent = screenHasVisibleHostedContent(',
    );
    expect(stackSource).toMatch(
      /!contentIsReady\s*\|\|\s*!hasVisibleHostedContent\s*\|\|\s*didSetControllerFrame\s*\|\|\s*didSetControllerBounds/,
    );
    expect(stackSource).toContain(
      '} else if (didRestoreScreenView && screenId) {',
    );
    expect(stackSource).toContain(
      'refreshScreenSurfaceTouchHandlerIfNeeded(\n' +
        '          screenId,\n' +
        '          registry,\n' +
        '          controllerView,\n' +
        '          registry.screenContentWrapperViews[screenId],\n' +
        '          true,\n' +
        '        );',
    );
    expect(stackSource).toContain(
      'function normalizeVisibleNavigationControllerViewChain',
    );
    expect(stackSource).toContain('if (current.tag === MOUNT_VIEW_TAG)');
    expect(stackSource).toContain('current.hidden = true;');
    expect(stackSource).toContain('current.userInteractionEnabled = false;');
    expect(stackSource).toContain(
      'isTopController &&\n' +
        '      (controllerView.hidden === true ||\n' +
        '        (controllerView.alpha ?? 1) <= 0.01 ||',
    );
    expect(stackSource).toContain(
      'normalizeVisibleNavigationControllerViewChain(\n' +
        '        controllerView,\n' +
        '        navigationView,\n' +
        '      );',
    );
    expect(stackSource).toContain(
      'controllerViewHasHiddenNavigationAncestor(\n' +
        '          controllerView,\n' +
        '          navigationController.view,\n' +
        '        )',
    );
    expect(stackSource).toContain('previousView?.removeFromSuperview?.();');
    expect(stackSource).toContain(
      'restoreScreenControllerViewFromHostHandle(\n    controller,\n    props.screenId,\n    registry,\n  );',
    );
    expect(stackSource).toContain(
      'restoreScreenControllerViewFromHostHandle(controller, screenId, registry);',
    );
    expect(stackSource).toContain('const didRemountContentWrapper =');
    expect(stackSource).toContain(
      'ensureScreenContentWrapperMounted(screenId, registry)',
    );
    expect(
      stackSource.indexOf(
        'restoreScreenControllerViewFromHostHandle(controller, screenId, registry);',
      ),
    ).not.toBe(
      stackSource.lastIndexOf(
        'restoreScreenControllerViewFromHostHandle(controller, screenId, registry);',
      ),
    );
  });

  it('snapshots retained JS-removed screens instead of keeping live children active', () => {
    expect(stackSource).toContain('function retainScreenControllerAsSnapshot');
    expect(stackSource).toContain('props.retainedByStack === true');
    expect(stackSource).toContain(
      'retainScreenControllerInRegistry(controller, props, ctx, registry);',
    );

    jest.resetModules();
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIColor: {},
      UIView: function UIView() {},
      UIViewController: {
        alloc: () => ({
          init: () => ({}),
        }),
      },
    };

    try {
      jest.requireActual('./NativeScriptScreenStack.ios');
      const screenDefinition = NativeScriptRuntime.__getDefinitions().find(
        (definition: { debugName?: string }) =>
          definition.debugName === 'RNSScreen.NativeScript',
      );
      const controller: any = {
        setViewToSnapshot: jest.fn(),
        view: {
          accessibilityIdentifier: undefined,
          subviews: [],
        },
      };
      const ctx = {};

      screenDefinition.update(
        controller,
        {
          activityState: 0,
          parentId: 'stack',
          retainedByStack: true,
          screenId: 'modal',
          stackPresentation: 'modal',
        },
        {},
        ctx,
      );

      expect(controller.setViewToSnapshot).toHaveBeenCalledTimes(1);
      expect(controller.__nativeScriptScreenContext).toBe(ctx);
      expect(controller.view.accessibilityIdentifier).toBe('modal');
    } finally {
      (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
    }
  });

  it('does not mount a new Fabric screen host for retained JS-removed stack screens', () => {
    const stackItemSource = stackSource.slice(
      stackSource.indexOf('export const NativeScriptScreenStackItem'),
      stackSource.indexOf('const styles = StyleSheet.create'),
    );
    const retainedReturnIndex = stackItemSource.indexOf(
      'if (retainedByStack) {\n    return null;\n  }',
    );
    const nativeHostIndex = stackItemSource.indexOf(
      '<NativeScriptScreenController',
    );

    expect(retainedReturnIndex).toBeGreaterThan(-1);
    expect(nativeHostIndex).toBeGreaterThan(-1);
    expect(retainedReturnIndex).toBeLessThan(nativeHostIndex);
  });

  it('keeps the live UIKit controller registered for retained stack screens', () => {
    jest.resetModules();
    const NativeScriptRuntime = jest.requireActual(
      '@nativescript/react-native',
    );
    NativeScriptRuntime.__resetDefinitions();

    (global as Record<string, unknown>).__nativeScriptNativeApi = {
      UIColor: {},
      UIView: function UIView() {},
      UIViewController: {
        alloc: () => ({
          init: () => ({}),
        }),
      },
    };

    try {
      jest.requireActual('./NativeScriptScreenStack.ios');
      const screenDefinition = NativeScriptRuntime.__getDefinitions().find(
        (definition: { debugName?: string }) =>
          definition.debugName === 'RNSScreen.NativeScript',
      );
      const liveController: any = {
        __nativeScriptScreenId: 'detail',
        hash: 'live-detail',
        setViewToSnapshot: jest.fn(),
        view: {
          accessibilityIdentifier: 'detail',
        },
      };
      const retainedCloneController: any = {
        __nativeScriptScreenId: 'detail',
        hash: 'retained-clone',
        removeFromParentViewController: jest.fn(),
        setViewToSnapshot: jest.fn(),
        view: {
          accessibilityIdentifier: 'detail',
          removeFromSuperview: jest.fn(),
        },
        willMoveToParentViewController: jest.fn(),
      };

      screenDefinition.mounted(
        liveController,
        {
          parentId: 'stack',
          screenId: 'detail',
          stackPresentation: 'push',
        },
        {},
      );

      const registry = (global as any).__rnsNativeScriptStackRegistry;

      registry.stacks.stack = {
        viewControllers: [{ hash: 'root' }, liveController],
      };

      screenDefinition.update(
        retainedCloneController,
        {
          activityState: 0,
          parentId: 'stack',
          retainedByStack: true,
          screenId: 'detail',
          stackPresentation: 'push',
        },
        {},
        {},
      );

      expect(registry.screens.detail).toBe(liveController);
      expect(registry.screenControllerHashes.detail).toBe('live-detail');
      expect(liveController.setViewToSnapshot).toHaveBeenCalledTimes(1);
      expect(retainedCloneController.setViewToSnapshot).not.toHaveBeenCalled();
      expect(
        retainedCloneController.view.removeFromSuperview,
      ).toHaveBeenCalled();

      const disposeResult = screenDefinition.dispose(
        liveController,
        {
          parentId: 'stack',
          screenId: 'detail',
          stackPresentation: 'push',
        },
        {},
      );

      expect(disposeResult).toEqual({ removeHostView: false });
      expect(liveController.__nativeScriptScreenDisposed).not.toBe(true);
      expect(registry.screens.detail).toBe(liveController);
    } finally {
      (global as Record<string, unknown>).__nativeScriptNativeApi = undefined;
      (global as Record<string, unknown>).__rnsNativeScriptStackRegistry =
        undefined;
    }
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
    expect(nativeDismissedScreenIds.has('detail')).toBe(false);
  });

  it('filters a natively dismissed child while delayed JS state still renders it', () => {
    const root = React.createElement(
      NativeScriptScreenStackItem,
      { activityState: 2, screenId: 'root' },
      'root',
    );
    const modal = React.createElement(
      NativeScriptScreenStackItem,
      { activityState: 2, screenId: 'modal', stackPresentation: 'modal' },
      'modal',
    );
    const retainedModal = React.createElement(
      NativeScriptScreenStackItem,
      {
        'aria-hidden': true,
        activityState: 0,
        pointerEvents: 'none',
        screenId: 'modal',
        stackPresentation: 'modal',
      },
      'retained modal',
    );
    const previousChildren = new Map([
      ['root', { element: root, order: 0 }],
      ['modal', { element: retainedModal, order: 1 }],
    ]);
    const retainedChildren = new Map([
      ['modal', { element: retainedModal, order: 1 }],
    ]);
    const nativeDismissedScreenIds = new Set(['modal']);

    const renderedChildren = __mergeNativeScriptStackChildrenForTests(
      [root, modal],
      previousChildren,
      retainedChildren,
      ['root'],
      nativeDismissedScreenIds,
    );

    expect(renderedChildren).toHaveLength(1);
    expect(testStackChildProps(renderedChildren[0]).screenId).toBe('root');
    expect(retainedChildren.has('modal')).toBe(false);
    expect(nativeDismissedScreenIds.has('modal')).toBe(true);
  });

  it('retains JS-removed modal screens as inactive React subtrees until UIKit finishes dismissing', () => {
    const root = React.createElement(
      NativeScriptScreenStackItem,
      { activityState: 2, screenId: 'root' },
      'root',
    );
    const modal = React.createElement(
      NativeScriptScreenStackItem,
      { activityState: 2, screenId: 'modal', stackPresentation: 'modal' },
      'modal',
    );
    const previousChildren = new Map([
      ['root', { element: root, order: 0 }],
      ['modal', { element: modal, order: 1 }],
    ]);
    const retainedChildren = new Map();

    const renderedChildren = __mergeNativeScriptStackChildrenForTests(
      [root],
      previousChildren,
      retainedChildren,
      ['root', 'modal'],
      new Set(),
    );

    expect(renderedChildren).toHaveLength(2);
    expect(testStackChildProps(renderedChildren[0]).screenId).toBe('root');
    expect(testStackChildProps(renderedChildren[1]).screenId).toBe('modal');
    expect(testStackChildProps(renderedChildren[1]).activityState).toBe(0);
    expect(
      (testStackChildProps(renderedChildren[1]) as Record<string, unknown>)
        .pointerEvents,
    ).toBe('none');
    expect(
      (testStackChildProps(renderedChildren[1]) as Record<string, unknown>)[
        'aria-hidden'
      ],
    ).toBe(true);
    expect(retainedChildren.has('modal')).toBe(true);
  });

  it('releases retained JS-removed screens from native transition events, not timers', () => {
    const handleNativeTransitionSource = stackSource.slice(
      stackSource.indexOf('const handleNativeTransition = React.useCallback'),
      stackSource.indexOf(
        'return (\n    <NativeScriptScreenStackContext.Provider',
      ),
    );

    expect(handleNativeTransitionSource).toContain(
      "if (phase === 'end' && closing && !cancelled)",
    );
    expect(handleNativeTransitionSource).toContain(
      'releaseRetainedScreen(screenId)',
    );
    expect(stackSource).not.toContain('RETAINED_SCREEN_RELEASE_TIMEOUT_MS');
    expect(stackSource).not.toContain('retainedReleaseTimersRef');
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
    expect(disposeSource).not.toContain(
      'markScreenControllerDisposed(controller)',
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
