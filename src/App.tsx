/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { OSProvider } from './context/OSContext';
import { DeviceContainer } from './components/system/DeviceContainer';

export default function App() {
  return (
    <OSProvider>
      <DeviceContainer />
    </OSProvider>
  );
}
