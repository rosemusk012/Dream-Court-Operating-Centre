/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { REGISTRY_NODES } from './data/registryNodes';
import { Header } from './components/Header';
import { FoundationalAnchor } from './components/FoundationalAnchor';
import { RegistrySelector } from './components/RegistrySelector';
import { ResonanceTransmitter } from './components/ResonanceTransmitter';
import { DocumentInspector } from './components/DocumentInspector';
import { ThresholdModal } from './components/ThresholdModal';

export default function App() {
  const [activeNodeId, setActiveNodeId] = useState<string>('turn');
  const [purity, setPurity] = useState<number>(100.0);
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState<boolean>(false);

  const activeNode =
    REGISTRY_NODES.find((node) => node.id === activeNodeId) || REGISTRY_NODES[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-[#f4f4f5] selection:bg-amber-500/30 selection:text-amber-200 antialiased">
      {/* Top Navigation Header */}
      <Header purity={purity} activeNodeTitle={activeNode.title} />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Navigation & Architecture Registry (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <FoundationalAnchor />
          <RegistrySelector
            nodes={REGISTRY_NODES}
            activeNodeId={activeNodeId}
            onSelectNode={setActiveNodeId}
          />
          <ResonanceTransmitter purity={purity} onPurityChange={setPurity} />
        </div>

        {/* Right Column: Document Editor & Immersive Inspector (8 Cols) */}
        <DocumentInspector
          node={activeNode}
          onSelectNode={setActiveNodeId}
          onOpenThreshold={() => setIsThresholdModalOpen(true)}
          allNodes={REGISTRY_NODES}
        />
      </main>

      {/* Threshold Modal Dialog */}
      <ThresholdModal
        isOpen={isThresholdModalOpen}
        onClose={() => setIsThresholdModalOpen(false)}
        onJumpToNode={setActiveNodeId}
      />
    </div>
  );
}
