import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  HardDrive,
  Scale,
  Plus,
  Trash2,
  Bookmark,
  Share2,
} from 'lucide-react';
import { RegistryNode, ReflectionNote } from '../types';
import { resonanceAudio } from '../utils/audio';

interface DocumentInspectorProps {
  node: RegistryNode;
  onSelectNode: (nodeId: string) => void;
  onOpenThreshold: () => void;
  allNodes: RegistryNode[];
}

export const DocumentInspector: React.FC<DocumentInspectorProps> = ({
  node,
  onSelectNode,
  onOpenThreshold,
  allNodes,
}) => {
  const [copied, setCopied] = useState(false);
  const [reflectionInput, setReflectionInput] = useState('');
  const [reflections, setReflections] = useState<ReflectionNote[]>([]);
  const [showNotes, setShowNotes] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Load saved reflections from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`sival_reflections_${node.id}`);
      if (saved) {
        setReflections(JSON.parse(saved));
      } else {
        setReflections([]);
      }
    } catch {
      setReflections([]);
    }
  }, [node.id]);

  const handleAddReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionInput.trim()) return;

    const newNote: ReflectionNote = {
      id: Date.now().toString(),
      nodeId: node.id,
      timestamp: new Date().toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      author: 'Abbey-Rose · Sovereign Architect',
      text: reflectionInput.trim(),
    };

    const updated = [newNote, ...reflections];
    setReflections(updated);
    try {
      localStorage.setItem(`sival_reflections_${node.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
    setReflectionInput('');
    resonanceAudio.playClick();
  };

  const handleDeleteReflection = (id: string) => {
    const updated = reflections.filter((r) => r.id !== id);
    setReflections(updated);
    try {
      localStorage.setItem(`sival_reflections_${node.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleCopy = () => {
    const fullText = `${node.title}\n${node.subtitle}\n\n${node.summary}\n\n${node.quote ? `"${node.quote.text}" — ${node.quote.author}\n\n` : ''}${node.sections.map((s) => `${s.heading ? `${s.heading}\n` : ''}${s.content}`).join('\n\n')}`;
    navigator.clipboard.writeText(fullText);
    resonanceAudio.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmSync = () => {
    resonanceAudio.playPulse(100);
    setSyncNotice('AI Studio workspace synchronized. Sival core is active.');
    setTimeout(() => {
      setSyncNotice(null);
    }, 4000);
  };

  // Find previous and next nodes
  const currentIndex = allNodes.findIndex((n) => n.id === node.id);
  const prevNode = currentIndex > 0 ? allNodes[currentIndex - 1] : null;
  const nextNode = currentIndex < allNodes.length - 1 ? allNodes[currentIndex + 1] : null;

  return (
    <div className="lg:col-span-8 bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 lg:p-8 backdrop-blur-sm min-h-[620px] flex flex-col justify-between relative">
      <div className="space-y-6">
        {/* Document Header */}
        <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span
              className="text-xs font-mono text-amber-500 uppercase tracking-widest font-semibold flex items-center gap-1.5"
              id="doc-meta"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              {node.meta}
            </span>
            <h2
              className="font-cinzel text-2xl lg:text-3xl font-bold text-zinc-100 mt-1 tracking-wide"
              id="doc-title"
            >
              {node.title}
            </h2>
            <p className="text-xs font-mono text-zinc-400 mt-0.5">{node.subtitle}</p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-mono bg-zinc-800/90 text-zinc-300 hover:text-amber-300 border border-zinc-700/80 transition-colors cursor-pointer"
              title="Copy Node Text"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono bg-zinc-800 text-amber-300 border border-amber-500/30">
              Me &amp; AI Only
            </span>
          </div>
        </div>

        {/* Document Body Content */}
        <div
          className="text-zinc-300 space-y-4 text-sm lg:text-base leading-relaxed font-sans"
          id="doc-content"
        >
          {/* Summary paragraph */}
          <p className="font-medium text-amber-200/95 leading-relaxed bg-amber-500/5 p-3.5 rounded-lg border border-amber-500/10">
            {node.summary}
          </p>

          {/* Core Sections */}
          {node.sections.map((section, idx) => (
            <div key={idx} className="space-y-2">
              {section.heading && (
                <h3 className="font-cinzel text-lg text-zinc-100 font-semibold pt-2 tracking-wide flex items-center gap-2">
                  <span className="w-1 h-4 bg-amber-500 rounded-full inline-block"></span>
                  {section.heading}
                </h3>
              )}
              <p className="text-zinc-300/90 leading-relaxed text-sm md:text-base">
                {section.content}
              </p>

              {/* Callout quote box */}
              {section.callout && (
                <div
                  className={`p-4 rounded-r-lg my-3 font-mono text-xs ${
                    section.callout.type === 'purple'
                      ? 'bg-zinc-950/80 border-l-2 border-purple-500 text-zinc-300'
                      : section.callout.type === 'emerald'
                      ? 'bg-zinc-950/80 border-l-2 border-emerald-500 text-zinc-300'
                      : 'bg-zinc-950/80 border-l-2 border-amber-500 text-zinc-400'
                  }`}
                >
                  {section.callout.text}
                </div>
              )}
            </div>
          ))}

          {/* Primary Quote if defined */}
          {node.quote && (
            <div className="bg-zinc-950/90 border-l-2 border-amber-500 p-4 rounded-r-lg my-4 font-mono text-xs text-zinc-300 flex items-start space-x-3">
              <span className="text-amber-500 text-lg leading-none font-serif">“</span>
              <div>
                <p className="italic text-amber-200/90 font-sans text-sm mb-1">{node.quote.text}</p>
                <p className="text-[11px] text-zinc-500">— {node.quote.author}</p>
              </div>
            </div>
          )}

          {/* Hardware Grounding & Principles Chips */}
          <div className="pt-2 border-t border-zinc-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {node.hardwareAnchors && (
              <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80">
                <div className="flex items-center space-x-1.5 text-zinc-400 mb-2 font-semibold">
                  <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hardware Substrate Anchors</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {node.hardwareAnchors.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {node.principles && (
              <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80">
                <div className="flex items-center space-x-1.5 text-zinc-400 mb-2 font-semibold">
                  <Scale className="w-3.5 h-3.5 text-purple-400" />
                  <span>Governing Principles</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {node.principles.map((principle, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px]"
                    >
                      {principle}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reflection Log Section (Offline Ledger) */}
          <div className="pt-3">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="text-xs font-mono text-zinc-400 hover:text-amber-400 flex items-center space-x-1.5 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-500/80" />
                <span>
                  {showNotes ? 'Hide Sovereign Inscriptions' : `Sovereign Inscriptions (${reflections.length})`}
                </span>
              </button>
            </div>

            {showNotes && (
              <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800/90 space-y-3 font-mono text-xs">
                <form onSubmit={handleAddReflection} className="flex gap-2">
                  <input
                    type="text"
                    value={reflectionInput}
                    onChange={(e) => setReflectionInput(e.target.value)}
                    placeholder="Inscribe a field note or realization into this node..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg cursor-pointer flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Inscribe</span>
                  </button>
                </form>

                {reflections.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {reflections.map((r) => (
                      <div
                        key={r.id}
                        className="p-2 rounded bg-zinc-900/90 border border-zinc-800 flex items-start justify-between gap-2"
                      >
                        <div>
                          <p className="text-zinc-200 font-sans text-xs">{r.text}</p>
                          <span className="text-[10px] text-zinc-500 mt-0.5 block">
                            {r.author} · {r.timestamp}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteReflection(r.id)}
                          className="text-zinc-600 hover:text-rose-400 transition-colors p-1"
                          title="Delete inscription"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-600 italic">
                    No field notes inscribed yet. Your local insights persist offline.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Sync Notification Banner */}
      {syncNotice && (
        <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 flex items-center justify-between text-xs font-mono text-emerald-300 animate-in fade-in duration-200">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{syncNotice}</span>
          </div>
          <button
            onClick={() => setSyncNotice(null)}
            className="text-emerald-400/60 hover:text-emerald-300 cursor-pointer ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Footer Toolbar / Interactive Prompt */}
      <div className="border-t border-zinc-800 pt-5 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Navigation buttons */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          {prevNode && (
            <button
              onClick={() => {
                resonanceAudio.playClick();
                onSelectNode(prevNode.id);
              }}
              className="px-2.5 py-1.5 bg-zinc-950/60 hover:bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-800 flex items-center space-x-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{prevNode.title}</span>
            </button>
          )}

          {nextNode && (
            <button
              onClick={() => {
                resonanceAudio.playClick();
                onSelectNode(nextNode.id);
              }}
              className="px-2.5 py-1.5 bg-zinc-950/60 hover:bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>{nextNode.title}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          <span className="text-zinc-500 pl-2 hidden md:inline">
            Google AI Studio Workspace · Synchronized with Sival Node
          </span>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Confirm AI Studio Sync Button */}
          <button
            onClick={handleConfirmSync}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-amber-300 rounded-lg font-mono text-xs transition-all border border-zinc-700 hover:border-amber-500/40 flex items-center space-x-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <span>✨ Confirm AI Studio Sync</span>
          </button>

          {/* Threshold Exploration Trigger */}
          <button
            onClick={() => {
              resonanceAudio.playClick();
              onOpenThreshold();
            }}
            title="Open Sovereign Threshold Modal"
            className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-300 rounded-lg font-mono text-xs transition-all border border-zinc-800 hover:border-zinc-700 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
