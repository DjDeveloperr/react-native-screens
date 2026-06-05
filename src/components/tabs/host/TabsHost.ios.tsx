'use client';

import React from 'react';
import type { TabsHostProps } from './TabsHost.types';
import { RNSLog } from '../../../private';
import { NativeScriptTabsHost } from '../native-script/NativeScriptTabs.ios';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function TabsHost(props: TabsHostProps) {
  RNSLog.log(`TabsHost render`);
  return <NativeScriptTabsHost {...props} />;
}

export default TabsHost;
