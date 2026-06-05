'use client';

import React from 'react';
import type { TabsScreenProps } from './TabsScreen.types';
import { NativeScriptTabsScreen } from '../native-script/NativeScriptTabs.ios';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function TabsScreen(props: TabsScreenProps) {
  return <NativeScriptTabsScreen {...props} />;
}

export default TabsScreen;
