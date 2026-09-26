'use client';

import { useState, useEffect } from 'react';
import { GitMerge, Layers, X, AlertTriangle, ArrowRight, CheckCircle2, Loader2, Sparkles, Shield, User, Building, CreditCard, Phone } from 'lucide-react';
import { api } from '@/lib/api-client';

export default function MergeCaseModal({ 
  primaryCase, 
  cases = [], 
  onClose, 
  onLaunchMergedGraph 
}) {
  const availableTargetCases = cases.filter(c => c.id !== primaryCase?.id);
  const [selectedTargetId, setSelectedTargetId] = useState(availableTargetCases[0]?.id || '');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [error, setError] = useState(null);

  const selectedTargetCase = cases.find(c => c.id === selectedTargetId);

  // Fetch synthesis preview whenever selected target changes
  useEffect(() => {
    if (!primaryCase?.id || !selectedTargetId) return;

    let isMounted = true;
    setLoadingPreview(true);
    setError(null);

    api.compareCases([primaryCase.id, selectedTargetId])
      .then(res => {
        if (!isMounted) return;
        if (res && res.success) {
          setPreviewData(res);
        } else {
          setError(res?.error || 'Failed to synthesize preview.');
        }
      })
      .catch(err => {
        if (!isMounted) return;
        setError(err.message || 'Error querying cross-case synthesis engine.');
      })
      .finally(() => {
        if (isMounted) setLoadingPreview(false);
      });

    return () => { isMounted = false; };
  }, [primaryCase?.id, selectedTargetId]);

  const handleLaunch = () => {
    if (!primaryCase?.id || !selectedTargetId) return;
    if (onLaunchMergedGraph) {
      onLaunchMergedGraph([primaryCase.id, selectedTargetId]);
    }
    onClose();
  };

  const bridgeEntities = previewData?.bridgeEntities || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0D121F] border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <GitMerge className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-100 tracking-tight">Cross-Case Network Synthesis</h3>
              <p className="text-[11px] text-slate-400 font-mono">Merge Multi-Docket Subgraphs & Detect Common Syndicate Links</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Dual Case Comparison Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            {/* Primary Case (Fixed) */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-500 mb-1">
                <span>Base Docket (Current)</span>
                <span className="text-blue-400 font-mono">{primaryCase?.caseNumber || primaryCase?.id}</span>
              </div>
              <div className="text-xs font-semibold text-slate-100 line-clamp-1">{primaryCase?.title}</div>
              <div className="text-[11px] text-slate-400 mt-1">{primaryCase?.category}</div>
            </div>

            {/* Target Case Selector */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-indigo-500/40">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-indigo-400 mb-1">
                <span>Select Target Docket to Merge</span>
                <span className="font-mono">{selectedTargetCase?.caseNumber || selectedTargetId}</span>
              </div>
              <select
                value={selectedTargetId}
                onChange={(e) => setSelectedTargetId(e.target.value)}
                className="w-full bg-[#090D16] border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {availableTargetCases.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.caseNumber || c.id} · {c.title}
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-slate-400 mt-1">{selectedTargetCase?.category || 'Active Investigation'}</div>
            </div>
          </div>

          {/* Overlap Intelligence Preview Box */}
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-xs font-semibold text-slate-200">
                  Shared Syndicate Bridge Entities
                </span>
              </div>
              {loadingPreview ? (
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
                  <span>Cross-referencing entities...</span>
                </div>
              ) : (
                <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  {bridgeEntities.length} Overlapping Assets Detected
                </span>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800/50 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {!loadingPreview && bridgeEntities.length === 0 && !error && (
              <div className="py-6 text-center text-slate-500 text-xs">
                No direct common suspect profiles or shared accounts detected between these two dockets. Launching synthesis will display isolated network clusters alongside each other.
              </div>
            )}

            {bridgeEntities.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {bridgeEntities.map(b => (
                  <div 
                    key={b.id} 
                    className="p-2.5 rounded-lg bg-[#0F172A] border border-amber-500/30 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                        {b.type === 'PERSON' ? <User className="w-3.5 h-3.5" /> : b.type === 'ACCOUNT' ? <CreditCard className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-100 flex items-center gap-2">
                          <span>{b.label}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            SHARED BRIDGE
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Type: {b.type} · Active in {b.intersectingCases?.join(' & ')}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Risk: <b className="text-amber-400 font-mono">{(b.riskScore * 100).toFixed(0)}%</b>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Metrics of Combined Graph */}
          {previewData && (
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Combined Nodes</span>
                <span className="font-mono font-semibold text-slate-200 text-sm">{previewData.nodeCount}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Total Cross-Links</span>
                <span className="font-mono font-semibold text-slate-200 text-sm">{previewData.edgeCount}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Bridge Junctions</span>
                <span className="font-mono font-semibold text-amber-400 text-sm">{previewData.bridgeCount}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Synthesizing creates a dual-case interactive canvas without altering underlying evidence dockets.
          </span>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLaunch}
              disabled={loadingPreview || !selectedTargetId}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>Launch Synthesized Canvas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
