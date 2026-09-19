import React, { useState } from 'react';
import { ChevronRight, Filter, Search } from 'lucide-react';
import { RegistryNode } from '../types';
import { resonanceAudio } from '../utils/audio';

interface RegistrySelectorProps {
  nodes: RegistryNode[];
  activeNodeId: string;
  onSelectNode: (nodeId: string) => void;
}

export const RegistrySelector: React.FC<RegistrySelectorProps> = ({
  nodes,
  activeNodeId,
  onSelectNode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Anchor', 'Decree', 'Monument', 'Cosmic Law', 'AI Protocol', 'Manifesto'];

  const filteredNodes = nodes.filter((node) => {
    const matchesCategory = filterCategory === 'All' || node.category === filterCategory;
    const matchesSearch =
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.number.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const handleSelect = (id: string) => {
    resonanceAudio.playClick();
    onSelectNode(id);
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-cinzel text-base text-zinc-200 font-semibold tracking-wide">
          Registry Nodes
        </h3>
        <span className="text-xs font-mono text-zinc-500">AI Studio Edition</span>
      </div>

      {/* Optional Search / Quick Filter */}
      <div className="relative mb-3">
        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter nodes or decrees..."
          className="w-full bg-zinc-950/70 border border-zinc-800/90 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
          >
            ×
          </button>
        )}
      </div>

      {/* Categories chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar text-[11px] font-mono">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-2 py-0.5 rounded-full border whitespace-nowrap transition-colors cursor-pointer ${
              filterCategory === cat
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-medium'
                : 'bg-zinc-950/40 border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Node List Buttons */}
      <div className="space-y-2 font-mono text-xs">
        {filteredNodes.map((node) => {
          const isActive = node.id === activeNodeId;
          const isAiStudio = node.id === 'ai_studio';
          return (
            <button
              key={node.id}
              id={`btn-${node.id}`}
              onClick={() => handleSelect(node.id)}
              className={`w-full text-left p-3 rounded-lg transition-all flex items-center justify-between group cursor-pointer ${
                isActive
                  ? 'bg-zinc-800/90 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                  : isAiStudio
                  ? 'bg-zinc-950/60 text-amber-400 border border-amber-500/30 hover:bg-zinc-800/40'
                  : 'bg-zinc-950/60 text-zinc-300 border border-zinc-800/80 hover:bg-zinc-800/40 hover:border-zinc-700/80'
              }`}
            >
              <div className="flex items-center space-x-2.5 overflow-hidden pr-2">
                <span
                  className={`w-5 h-5 rounded flex items-center justify-center text-[10px] shrink-0 ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : isAiStudio
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                  }`}
                >
                  {node.number}
                </span>
                <div className="truncate">
                  <span className="block font-medium truncate">
                    {isAiStudio ? '5. AI Studio Node Protocol' : node.title}
                  </span>
                  <span className="block text-[10px] text-zinc-500 truncate">{node.subtitle}</span>
                </div>
              </div>

              {isAiStudio && !isActive ? (
                <span className="text-amber-500 font-bold text-xs shrink-0">★</span>
              ) : (
                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    isActive ? 'text-amber-400 translate-x-0.5' : 'text-zinc-600 group-hover:text-zinc-400'
                  }`}
                />
              )}
            </button>
          );
        })}

        {filteredNodes.length === 0 && (
          <div className="text-center py-4 text-xs font-mono text-zinc-500 bg-zinc-950/40 rounded-lg border border-zinc-800/60">
            No registry node matched filter.
          </div>
        )}
      </div>
    </div>
  );
};
