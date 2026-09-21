'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  User, Building, MapPin, Truck, Phone, CreditCard, 
  Search, ZoomIn, ZoomOut, RotateCcw, Filter, 
  ShieldAlert, Share2, Info, Eye, Layers,
  ChevronRight, X, Activity, ShieldCheck, Flame, RefreshCw,
  ExternalLink, ArrowRight, Zap, Target, AlertOctagon,
  Sparkles, FileText, Check, Copy, Radio, Scissors,
  AlertTriangle, GitMerge, Lock
} from 'lucide-react';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/lib/auth-store';

const ENTITY_CONFIG = {
  PERSON: { label: 'Person', icon: User, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30' },
  ORGANIZATION: { label: 'Organization', icon: Building, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  LOCATION: { label: 'Location', icon: MapPin, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  VEHICLE: { label: 'Vehicle', icon: Truck, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  PHONE: { label: 'Phone', icon: Phone, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  ACCOUNT: { label: 'Account', icon: CreditCard, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' }
};

export default function NetworkGraph({ caseId = 'CASE-1024', onCaseChange, onSelectEntity, onOpenEvidence }) {
  const [activeCase, setActiveCase] = useState(caseId);
  const [casesList, setCasesList] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { user, canResolveEntities, canMergeEntities } = useAuthStore();
  
  // Controls
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [influencerOnly, setInfluencerOnly] = useState(false);
  const [patternsList, setPatternsList] = useState([]);
  const [showPatternsModal, setShowPatternsModal] = useState(false);

  // Entity Resolution (Jaro-Winkler) state
  const [resolutionModalOpen, setResolutionModalOpen] = useState(false);
  const [resolutionLoading, setResolutionLoading] = useState(false);
  const [resolutionCandidates, setResolutionCandidates] = useState([]);
  const [mergeSuccessMsg, setMergeSuccessMsg] = useState(null);
  const [merging, setMerging] = useState(false);

  // Dragging state
  const isDraggingCanvas = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState(null);
  const [nodePositions, setNodePositions] = useState({});

  // -------------------------------------------------------------------------
  // Tactical Simulation / "What-If" Arrest Mode State
  // -------------------------------------------------------------------------
  const [simulationActive, setSimulationActive] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simTargetNode, setSimTargetNode] = useState(null);
  const [simResult, setSimResult] = useState(null);
  const [simulationError, setSimulationError] = useState(null);

  // Right-click context menu state
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, node: null });

  // AI Entity Extraction Modal state
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiText, setAiText] = useState(
    'FIR-2026-MUM-1024: Surveillance intercepted call between Farooq (Financial Broker) and Tariq Merchant regarding cash layering of INR 4.2 Crore via Oceanic Freight Logistics HDFC Account 50200091823. Mastermind Rajesh Kumar directed the transfer to Dubai.'
  );
  const [aiExtracting, setAiExtracting] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // AI Scoring state for drawer
  const [scoringNodeId, setScoringNodeId] = useState(null);
  const [aiScoreResult, setAiScoreResult] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  // Sync activeCase with prop caseId
  useEffect(() => {
    if (caseId && caseId !== activeCase) {
      setActiveCase(caseId);
    }
  }, [caseId]);

  const handleCaseChange = (newCaseId) => {
    setActiveCase(newCaseId);
    if (onCaseChange) onCaseChange(newCaseId);
  };

  // 1. Fetch available cases
  useEffect(() => {
    fetch('/api/cases', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.cases) setCasesList(data.cases);
      })
      .catch(() => {});
  }, []);

  // 2. Fetch case-scoped graph data & patterns
  useEffect(() => {
    setLoading(true);
    // Reset simulation when case changes
    setSimulationActive(false);
    setSimResult(null);
    setSimTargetNode(null);

    Promise.all([
      fetch(`/api/graph/case/${activeCase}`, { credentials: 'include' }).then(r => r.json()).catch(() => null),
      fetch(`/api/analytics/patterns/${activeCase}`, { credentials: 'include' }).then(r => r.json()).catch(() => null)
    ])
      .then(([graphRes, patternRes]) => {
        if (graphRes && graphRes.nodes) {
          setGraphData(graphRes);
          computeInitialPositions(graphRes.nodes, graphRes.edges);
        }
        if (patternRes && patternRes.patterns) {
          setPatternsList(patternRes.patterns);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [activeCase]);

  // Entity Resolution Handlers
  const handleRunEntityResolution = async () => {
    setResolutionLoading(true);
    setMergeSuccessMsg(null);
    setResolutionModalOpen(true);
    try {
      const res = await api.resolveEntities(activeCase);
      if (res && res.candidates) {
        setResolutionCandidates(res.candidates);
      } else {
        setResolutionCandidates([]);
      }
    } catch (err) {
      console.error('Failed to resolve entities:', err);
      setResolutionCandidates([]);
    } finally {
      setResolutionLoading(false);
    }
  };

  const handleExecuteMerge = async (cand) => {
    if (!canMergeEntities()) return;
    setMerging(true);
    try {
      const res = await api.mergeEntities({
        targetNodeId: cand.sourceId,
        duplicateNodeId: cand.targetId,
        masterLabel: cand.sourceLabel,
        caseId: activeCase,
        activeCase
      });
      if (res && (res.mergedNode || res.success)) {
        setMergeSuccessMsg(`Successfully merged ${cand.targetLabel} into ${cand.sourceLabel}`);
        setResolutionCandidates(prev => prev.filter(c => c.targetId !== cand.targetId && c.sourceId !== cand.targetId));
        // Refresh graph data
        const updated = await fetch(`/api/graph/case/${activeCase}`, { credentials: 'include' }).then(r => r.json());
        if (updated && updated.nodes) {
          setGraphData(updated);
          computeInitialPositions(updated.nodes, updated.edges);
        }
      }
    } catch (err) {
      alert('Error executing merge: ' + (err.message || 'Permission denied'));
    } finally {
      setMerging(false);
    }
  };

  // Compute organic coordinates centered around central nodes
  const computeInitialPositions = (nodes, edges) => {
    const positions = {};
    const width = 1100;
    const height = 650;
    const centerX = width / 2;
    const centerY = height / 2;

    const count = nodes.length;
    nodes.forEach((node, idx) => {
      const isLead = idx === 0 || (node.riskScore && node.riskScore > 0.85);
      if (isLead && idx === 0) {
        positions[node.id] = { x: centerX, y: centerY };
      } else {
        const angle = (idx / Math.max(count, 1)) * 2 * Math.PI;
        const radius = isLead ? 150 : 260 + (idx % 2) * 60;
        positions[node.id] = {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius
        };
      }
    });

    setNodePositions(positions);
  };

  // Run Decapitation Simulation
  const runDecapitationSimulation = async (targetNode) => {
    if (!targetNode) return;
    setSimulating(true);
    setSimulationError(null);
    setContextMenu({ visible: false, x: 0, y: 0, node: null });

    try {
      const res = await api.simulateDecapitation(activeCase, [targetNode.id]);
      if (res && res.simulation) {
        setSimResult(res.simulation);
        setSimTargetNode(targetNode);
        setSimulationActive(true);
      } else {
        throw new Error('Simulation failed to return metrics');
      }
    } catch (err) {
      console.error('Decapitation simulation error:', err);
      setSimulationError(err.message || 'Simulation execution failed');
    } finally {
      setSimulating(false);
    }
  };

  const resetSimulation = () => {
    setSimulationActive(false);
    setSimResult(null);
    setSimTargetNode(null);
    setSimulationError(null);
  };

  // AI Scoring inside dossier
  const handleScoreNodeWithAI = async (node) => {
    if (!node) return;
    setScoringNodeId(node.id);
    try {
      const res = await api.scoreEntity(
        { id: node.id, label: node.label, type: node.type, properties: node.properties },
        { activeCase, nodeCount: graphData.nodes?.length }
      );
      if (res && res.prediction) {
        setAiScoreResult(res.prediction);
      }
    } catch (err) {
      console.error('AI scoring error:', err);
    } finally {
      setScoringNodeId(null);
    }
  };

  // AI Extraction modal handler
  const handleExtractIntelligence = async () => {
    if (!aiText.trim()) return;
    setAiExtracting(true);
    try {
      const res = await api.extractEntities(aiText);
      if (res && res.extraction) {
        setAiResult(res.extraction);
      }
    } catch (err) {
      console.error('Extraction error:', err);
    } finally {
      setAiExtracting(false);
    }
  };

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return (graphData.nodes || []).filter(node => {
      if (filterType !== 'ALL' && node.type !== filterType) return false;
      if (influencerOnly && !(node.riskScore > 0.8 || node.properties?.role?.includes('Ringleader'))) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchLabel = (node.label || '').toLowerCase().includes(q);
        const matchType = (node.type || '').toLowerCase().includes(q);
        return matchLabel || matchType;
      }
      return true;
    });
  }, [graphData.nodes, filterType, influencerOnly, searchQuery]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  // Filtered edges
  const filteredEdges = useMemo(() => {
    return (graphData.edges || []).filter(edge => {
      return filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target);
    });
  }, [graphData.edges, filteredNodeIds]);

  // Selected Node Details
  const selectedNode = useMemo(() => {
    return (graphData.nodes || []).find(n => n.id === selectedNodeId);
  }, [graphData.nodes, selectedNodeId]);

  // Connected edges for selected node
  const selectedNodeEdges = useMemo(() => {
    if (!selectedNodeId) return [];
    return (graphData.edges || []).filter(e => e.source === selectedNodeId || e.target === selectedNodeId);
  }, [graphData.edges, selectedNodeId]);

  const connectedNodeIds = useMemo(() => {
    const ids = new Set();
    selectedNodeEdges.forEach(e => {
      ids.add(e.source);
      ids.add(e.target);
    });
    return ids;
  }, [selectedNodeEdges]);

  // Canvas Mouse Events for Panning & Node Dragging
  const handleCanvasMouseDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('.graph-node-card') || e.target.closest('.floating-toolbar') || e.target.closest('.tactical-hud')) return;
    setContextMenu({ visible: false, x: 0, y: 0, node: null });
    isDraggingCanvas.current = true;
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleCanvasMouseMove = (e) => {
    if (draggedNode) {
      setNodePositions(prev => ({
        ...prev,
        [draggedNode]: {
          x: (e.clientX - pan.x) / zoom,
          y: (e.clientY - pan.y) / zoom
        }
      }));
      return;
    }

    if (isDraggingCanvas.current) {
      setPan({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    }
  };

  const handleCanvasMouseUp = () => {
    isDraggingCanvas.current = false;
    setDraggedNode(null);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleNodeClick = (node) => {
    setSelectedNodeId(node.id);
    setAiScoreResult(null); // Reset per-node AI score
    setDrawerOpen(true);
    setContextMenu({ visible: false, x: 0, y: 0, node: null });
    if (onSelectEntity) onSelectEntity(node);
  };

  const handleNodeContextMenu = (e, node) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: Math.min(e.clientX, window.innerWidth - 260),
      y: Math.min(e.clientY, window.innerHeight - 240),
      node
    });
  };

  return (
    <div 
      className="relative w-full h-[calc(100vh-140px)] min-h-[650px] bg-[#090D16] border border-slate-800/80 rounded-xl overflow-hidden flex flex-col select-none"
      onClick={() => setContextMenu({ visible: false, x: 0, y: 0, node: null })}
    >
      {/* Top Floating Control Bar */}
      <div className="floating-toolbar z-20 absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Search & Case Selector */}
        <div className="flex items-center gap-2 pointer-events-auto bg-[#111827]/90 backdrop-blur-md border border-slate-800 rounded-lg p-1.5 shadow-xl">
          {casesList.length > 0 && (
            <select
              value={activeCase}
              onChange={(e) => handleCaseChange(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
            >
              {casesList.map(c => (
                <option key={c.id} value={c.id}>{c.caseNumber || c.id} · {c.title}</option>
              ))}
            </select>
          )}

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search suspects & nodes..."
              className="bg-slate-900 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 w-44 transition-all focus:w-60"
            />
          </div>
        </div>

        {/* Entity Type Filter Pills */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#111827]/90 backdrop-blur-md border border-slate-800 rounded-lg p-1.5 shadow-xl overflow-x-auto">
          {['ALL', 'PERSON', 'ORGANIZATION', 'PHONE', 'ACCOUNT', 'LOCATION', 'VEHICLE'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                filterType === type 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {type === 'ALL' ? 'All Entities' : (ENTITY_CONFIG[type]?.label || type)}
            </button>
          ))}
          <div className="h-4 w-px bg-slate-800 mx-1" />
          <button
            type="button"
            onClick={() => setInfluencerOnly(!influencerOnly)}
            className={`text-xs px-2.5 py-1 rounded font-medium flex items-center gap-1.5 transition-colors ${
              influencerOnly 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Key Ringleaders</span>
          </button>
        </div>

        {/* Action Controls & AI Extractor */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Entity Resolution Button (CA & SP Only) */}
          {canResolveEntities() && (
            <button
              type="button"
              onClick={handleRunEntityResolution}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold backdrop-blur-md shadow-xl transition-all"
              title="Run Jaro-Winkler Entity Resolution / Deduplication (CA & SP Only)"
            >
              <GitMerge className="w-3.5 h-3.5 text-emerald-400" />
              <span>Entity Resolution</span>
            </button>
          )}

          {/* LLM Entity Extraction Tool */}
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30 text-xs font-semibold backdrop-blur-md shadow-xl transition-all"
            title="Extract Entities and Relationships with LLM"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>LLM Extractor</span>
          </button>

          {/* Zoom & View Actions */}
          <div className="flex items-center gap-1 bg-[#111827]/90 backdrop-blur-md border border-slate-800 rounded-lg p-1.5 shadow-xl">
            <button
              onClick={() => setZoom(z => Math.min(z + 0.15, 2.2))}
              title="Zoom In"
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(z => Math.max(z - 0.15, 0.5))}
              title="Zoom Out"
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              title="Reset View"
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-400 px-2">{Math.round(zoom * 100)}%</span>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          TACTICAL SIMULATION HUD (Apprehension What-If Banner)
      --------------------------------------------------------------------- */}
      {simulationActive && simResult && (
        <div className="tactical-hud z-20 absolute top-16 left-4 right-4 bg-[#0B1120]/95 backdrop-blur-md border border-amber-500/40 border-t-2 border-t-amber-400 rounded-xl p-4 shadow-2xl space-y-3 pointer-events-auto animate-in fade-in slide-in-from-top-3 duration-200">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                  Tactical Decapitation Simulation Active
                </span>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <span>Simulated Apprehension:</span>
                  <span className="text-rose-400 underline decoration-rose-500/50">{simTargetNode?.label}</span>
                  <span className="text-xs text-slate-500 font-normal">({simTargetNode?.properties?.role || simTargetNode?.type})</span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded font-bold ${
                simResult.tacticalCollapseIndex >= 70
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {simResult.verdictLabel || 'Critical Decapitation'}
              </span>

              <button
                type="button"
                onClick={resetSimulation}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Exit simulation and restore live graph"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Exit Simulation</span>
              </button>
            </div>
          </div>

          {/* 3 Key Operational Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. Graph Fragmentation */}
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="font-semibold uppercase text-slate-400">Graph Fragmentation</span>
                <Scissors className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-xl font-bold text-rose-400">
                {simResult.fragmentation?.score || 85}%
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Network breaks into <b className="text-white">{simResult.fragmentation?.componentsAfter || 3}</b> disconnected sub-islands (<b className="text-emerald-400">+{simResult.fragmentation?.newIslandsCreated || 2} islands</b>).
              </p>
            </div>

            {/* 2. Path Disruption & Bottleneck */}
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="font-semibold uppercase text-slate-400">Path Disruption / Latency</span>
                <Radio className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-amber-400">
                {simResult.pathLength?.increasePercentage || '+140%'}
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                <b className="text-white">{simResult.pathLength?.communicationDisruption || '72%'}</b> communication/cash routes severed (<b className="text-amber-300">{simResult.severedEdgesCount}</b> conduits cut).
              </p>
            </div>

            {/* 3. Succession Flagging */}
            <div className="p-3 rounded-lg bg-slate-900/90 border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent">
              <div className="flex items-center justify-between text-[11px] text-amber-300 mb-1">
                <span className="font-semibold uppercase">Succession Flagged</span>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-base font-bold text-slate-100 truncate flex items-center gap-1.5">
                <span>{simResult.succession?.successorName || 'Tariq Merchant'}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {Math.round((simResult.succession?.successionProbability || 0.88) * 100)}% Risk
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                {simResult.succession?.reasoning || 'Predicted to assume control of financial conduits within 24h.'}
              </p>
            </div>
          </div>

          {/* Chief Tactical Advice */}
          <div className="px-3.5 py-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-amber-300">Police Chief Raid Directive: </span>
              {simResult.chiefRaidRecommendation}
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Interactive Canvas */}
      <div
        className="w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
      >
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* SVG Edges Layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="6" refX="28" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#334155" />
            </marker>
            <marker id="arrow-active" markerWidth="9" markerHeight="7" refX="28" refY="3.5" orient="auto">
              <polygon points="0 0, 9 3.5, 0 7" fill="#3B82F6" />
            </marker>
            <marker id="arrow-severed" markerWidth="8" markerHeight="6" refX="28" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#EF4444" />
            </marker>
          </defs>

          {filteredEdges.map(edge => {
            const p1 = nodePositions[edge.source];
            const p2 = nodePositions[edge.target];
            if (!p1 || !p2) return null;

            const isSevered = simulationActive && simTargetNode && 
              (edge.source === simTargetNode.id || edge.target === simTargetNode.id);

            const isHighlighted = !isSevered && (
              edge.source === selectedNodeId || edge.target === selectedNodeId ||
              edge.source === hoveredNodeId || edge.target === hoveredNodeId
            );

            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            return (
              <g key={edge.id || `${edge.source}-${edge.target}`}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={isSevered ? '#EF4444' : isHighlighted ? '#3B82F6' : '#1E293B'}
                  strokeWidth={isSevered ? 2 : isHighlighted ? 2.5 : 1.2}
                  strokeDasharray={isSevered ? '5 4' : edge.relationship?.includes('SUSPICIOUS') ? '4 3' : 'none'}
                  strokeOpacity={isSevered ? 0.6 : 1}
                  markerEnd={isSevered ? 'url(#arrow-severed)' : isHighlighted ? 'url(#arrow-active)' : 'url(#arrow)'}
                />
                {/* Edge Label Pill */}
                <rect
                  x={midX - ((isSevered ? 'SEVERED' : edge.relationship || 'LINK').length * 3 + 8)}
                  y={midY - 8}
                  width={(isSevered ? 'SEVERED' : edge.relationship || 'LINK').length * 6 + 16}
                  height={16}
                  rx={4}
                  fill={isSevered ? '#450A0A' : isHighlighted ? '#1E293B' : '#0B101B'}
                  stroke={isSevered ? '#EF4444' : isHighlighted ? '#3B82F6' : '#334155'}
                  strokeWidth={1}
                />
                <text
                  x={midX}
                  y={midY + 3}
                  textAnchor="middle"
                  fill={isSevered ? '#FCA5A5' : isHighlighted ? '#93C5FD' : '#64748B'}
                  fontSize="8.5"
                  fontWeight="700"
                >
                  {isSevered ? 'SEVERED' : (edge.relationship || 'LINK')}
                </text>
              </g>
            );
          })}
        </svg>

        {/* HTML Node Elements Layer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {filteredNodes.map(node => {
            const pos = nodePositions[node.id] || { x: 500, y: 300 };
            const conf = ENTITY_CONFIG[node.type] || ENTITY_CONFIG.PERSON;
            const Icon = conf.icon;
            const isSelected = node.id === selectedNodeId;
            const isHovered = node.id === hoveredNodeId;
            const isConnected = connectedNodeIds.has(node.id);
            const isDimmed = (selectedNodeId || hoveredNodeId) && !isSelected && !isConnected;
            const isHub = (node.riskScore > 0.85) || node.properties?.role?.includes('Ringleader');
            const hasCollision = Boolean(node.hasCrossCaseCollision || (node.otherCases && node.otherCases.length > 0));

            // Tactical Simulation flags
            const isApprehended = simulationActive && simTargetNode?.id === node.id;
            const isSuccessor = simulationActive && simResult?.succession?.successorId === node.id;

            return (
              <div
                key={node.id}
                className={`graph-node-card absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer transition-all duration-150 flex flex-col items-center group ${
                  isDimmed && !isApprehended && !isSuccessor ? 'opacity-30 scale-95' : 'opacity-100 scale-100'
                }`}
                style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setDraggedNode(node.id);
                }}
                onClick={() => handleNodeClick(node)}
                onContextMenu={(e) => handleNodeContextMenu(e, node)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                {/* Floating Badge for Successor */}
                {isSuccessor && (
                  <div className="absolute -top-7 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[9px] shadow-lg shadow-amber-500/50 animate-bounce flex items-center gap-1 z-10 whitespace-nowrap">
                    <Zap className="w-2.5 h-2.5 fill-current" />
                    <span>SUCCESSOR ({Math.round((simResult.succession?.successionProbability || 0.88) * 100)}%)</span>
                  </div>
                )}

                {/* Floating Badge for Apprehended */}
                {isApprehended && (
                  <div className="absolute -top-7 px-2 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[9px] shadow-lg shadow-rose-600/50 flex items-center gap-1 z-10 whitespace-nowrap">
                    <span>⛔ APPREHENDED</span>
                  </div>
                )}

                {/* Floating Badge for Cross-Case Collision */}
                {hasCollision && !isApprehended && !isSuccessor && (
                  <div
                    className="absolute -top-7 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[9px] shadow-lg shadow-amber-500/40 flex items-center gap-1 z-10 whitespace-nowrap"
                    title={`Active across multiple cases: ${node.otherCases?.join(', ') || 'Cross-Case Entity'}`}
                  >
                    <AlertTriangle className="w-2.5 h-2.5 fill-current" />
                    <span>CROSS-CASE ({node.otherCases?.length || 1})</span>
                  </div>
                )}

                {/* Circular Node Icon Avatar */}
                <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  isApprehended
                    ? 'border-2 border-dashed border-rose-500 bg-rose-950/70 opacity-60 scale-95'
                    : isSuccessor
                      ? 'ring-4 ring-amber-400 bg-amber-950/80 scale-110 shadow-xl shadow-amber-500/40 animate-pulse'
                      : isSelected 
                        ? 'ring-2 ring-blue-500 bg-blue-950/80 scale-110 shadow-lg shadow-blue-500/20' 
                        : hasCollision
                          ? 'ring-2 ring-amber-400 bg-amber-950/30 border border-amber-400/80 shadow-md shadow-amber-500/20'
                          : isHub 
                            ? 'ring-2 ring-amber-500/80 bg-slate-900 shadow-md shadow-amber-500/10'
                            : 'bg-slate-900/95 border border-slate-700/80 group-hover:border-slate-500 shadow-md'
                }`}>
                  <Icon className={`w-5 h-5 ${isApprehended ? 'text-rose-300' : isSuccessor ? 'text-amber-300' : conf.color}`} />
                  
                  {isHub && !isApprehended && !isSuccessor && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[9px] font-bold text-slate-950" title="Key Influencer / Ringleader">
                      ★
                    </span>
                  )}
                  {hasCollision && !isHub && !isApprehended && !isSuccessor && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[9px] font-black" title={`Active in multiple cases: ${node.otherCases?.join(', ')}`}>
                      !
                    </span>
                  )}
                </div>

                {/* Clean Label */}
                <div className="mt-2 text-center max-w-[140px]">
                  <div className={`text-xs font-medium truncate ${
                    isApprehended ? 'line-through text-rose-300' 
                    : isSuccessor ? 'text-amber-300 font-bold' 
                    : isSelected ? 'text-blue-300 font-semibold' 
                    : 'text-slate-200'
                  }`}>
                    {node.label}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                    {conf.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          RIGHT-CLICK CONTEXT MENU
      --------------------------------------------------------------------- */}
      {contextMenu.visible && contextMenu.node && (
        <div 
          className="fixed z-50 w-60 bg-[#0F172A] border border-slate-700 rounded-xl shadow-2xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150"
          style={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Menu Header */}
          <div className="px-3 py-2 border-b border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {contextMenu.node.type}
            </span>
            <div className="text-xs font-semibold text-slate-100 truncate mt-0.5">
              {contextMenu.node.label}
            </div>
          </div>

          {/* Tactical Simulation Action */}
          <button
            type="button"
            onClick={() => runDecapitationSimulation(contextMenu.node)}
            disabled={simulating}
            className="w-full px-3 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2 transition-colors text-left"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{simulating ? 'Simulating...' : 'Simulate Apprehension'}</span>
          </button>

          {/* Inspect Dossier */}
          <button
            type="button"
            onClick={() => handleNodeClick(contextMenu.node)}
            className="w-full px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium flex items-center gap-2 transition-colors text-left"
          >
            <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Inspect Suspect Dossier</span>
          </button>

          {/* Forensic Evidence */}
          <button
            type="button"
            onClick={() => {
              setContextMenu({ visible: false, x: 0, y: 0, node: null });
              if (onOpenEvidence) onOpenEvidence();
            }}
            className="w-full px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium flex items-center gap-2 transition-colors text-left"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>View Related Evidence</span>
          </button>

          {/* Copy ID */}
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(contextMenu.node.id);
              setCopiedId(true);
              setTimeout(() => setCopiedId(false), 1500);
              setContextMenu({ visible: false, x: 0, y: 0, node: null });
            }}
            className="w-full px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs flex items-center gap-2 transition-colors text-left"
          >
            <Copy className="w-3.5 h-3.5 shrink-0" />
            <span>Copy Identifier</span>
          </button>
        </div>
      )}

      {/* ---------------------------------------------------------------------
          SLIDE-OVER DOSSIER DRAWER
      --------------------------------------------------------------------- */}
      {drawerOpen && selectedNode && (
        <div className="absolute top-0 right-0 bottom-0 w-96 bg-[#0F172A] border-l border-slate-800 shadow-2xl z-30 flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                {selectedNode.type} Details
              </span>
              <h3 className="text-base font-semibold text-slate-100 mt-1">{selectedNode.label}</h3>
              {selectedNode.riskScore && (
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    selectedNode.riskScore > 0.8 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    Risk Score: {Math.round(selectedNode.riskScore * 100)}%
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tactical Simulation Button inside Drawer */}
          <div className="py-3 border-b border-slate-800">
            <button
              type="button"
              onClick={() => runDecapitationSimulation(selectedNode)}
              disabled={simulating}
              className="w-full py-2.5 px-3 rounded-lg bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{simulating ? 'Calculating Network Impact...' : 'Simulate Apprehension (What-If)'}</span>
            </button>
          </div>

          {/* Cross-Case Collision Alert Box */}
          {(selectedNode.hasCrossCaseCollision || (selectedNode.otherCases && selectedNode.otherCases.length > 0)) && (
            <div className="my-3 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider text-[11px]">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Cross-Case Collision Alert</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Collision Alert: This entity is active across multiple investigations:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(selectedNode.otherCases || []).map(cId => (
                  <span key={cId} className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                    {cId}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                This entity bridges separate criminal syndicates. Cross-case identity deduplication or inter-unit coordination may be required.
              </p>
              {canResolveEntities() && (
                <button
                  type="button"
                  onClick={handleRunEntityResolution}
                  className="w-full py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <GitMerge className="w-3.5 h-3.5" />
                  <span>Inspect Deduplication & Merges</span>
                </button>
              )}
            </div>
          )}

          {/* Properties / Known Identifiers */}
          <div className="py-4 border-b border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Known Attributes</h4>
            {selectedNode.properties && Object.keys(selectedNode.properties).length > 0 ? (
              <div className="space-y-2 text-xs">
                {Object.entries(selectedNode.properties).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-slate-800/40">
                    <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-slate-200 font-medium text-right">{String(val)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No additional attributes registered.</p>
            )}
          </div>

          {/* LLM Threat Prediction Section */}
          <div className="py-4 border-b border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>LLM Threat Assessment</span>
              </h4>
              <button
                type="button"
                onClick={() => handleScoreNodeWithAI(selectedNode)}
                disabled={scoringNodeId === selectedNode.id}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
              >
                {scoringNodeId === selectedNode.id ? 'Analyzing...' : 'Run LLM Assessment'}
              </button>
            </div>

            {aiScoreResult ? (
              <div className="p-3 rounded-lg bg-slate-900 border border-indigo-500/30 text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Predicted Threat:</span>
                  <span className="font-bold text-rose-400">{aiScoreResult.threatScore}% ({aiScoreResult.threatLevel})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Identified Role:</span>
                  <span className="font-medium text-slate-200">{aiScoreResult.predictedRole}</span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 leading-relaxed">
                  {aiScoreResult.reasoning}
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500">
                Click "Run LLM Assessment" to generate AI predictive threat score and behavioral risk markers.
              </p>
            )}
          </div>

          {/* Direct Relationships */}
          <div className="py-4 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Direct Links ({selectedNodeEdges.length})
              </h4>
            </div>
            <div className="space-y-2">
              {selectedNodeEdges.map(edge => {
                const otherId = edge.source === selectedNode.id ? edge.target : edge.source;
                const otherNode = (graphData.nodes || []).find(n => n.id === otherId);
                return (
                  <div
                    key={edge.id || `${edge.source}-${edge.target}`}
                    onClick={() => setSelectedNodeId(otherId)}
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-medium text-slate-200">{otherNode?.label || otherId}</div>
                      <div className="text-[10px] text-blue-400 font-medium mt-0.5">{edge.relationship}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drawer Actions */}
          <div className="pt-4 border-t border-slate-800 flex gap-2">
            <button
              type="button"
              onClick={() => onOpenEvidence && onOpenEvidence()}
              className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Inspect Case Evidence</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------
          AI INTELLIGENCE EXTRACTION MODAL
      --------------------------------------------------------------------- */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">LLM Entity & Relationship Extractor</h3>
                  <p className="text-[11px] text-slate-400">Extract suspects, phone numbers, bank accounts, and links from raw FIRs or transcripts</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Raw Investigative Text / FIR Dispatch
                </label>
                <textarea
                  rows={4}
                  value={aiText}
                  onChange={(e) => setAiText(e.target.value)}
                  placeholder="Paste police report, CDR log excerpt, or interrogation notes..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleExtractIntelligence}
                  disabled={aiExtracting}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{aiExtracting ? 'Extracting Entities with LLM...' : 'Extract Entities & Links'}</span>
                </button>
              </div>

              {/* Extraction Results */}
              {aiResult && (
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Extracted Entities ({aiResult.entities?.length || 0})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {aiResult.entities?.map((e, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-0.5">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-slate-100">{e.label}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-blue-400 font-medium">{e.type}</span>
                          </div>
                          <div className="text-[11px] text-slate-400">{e.role || 'Operative'}</div>
                          {e.threatScore && (
                            <div className="text-[10px] text-rose-400 font-medium">Predicted Threat: {e.threatScore}%</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Extracted Relationships ({aiResult.relationships?.length || 0})
                    </h4>
                    <div className="space-y-1.5">
                      {aiResult.relationships?.map((r, idx) => (
                        <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800/80 text-xs flex items-center justify-between text-slate-300">
                          <span><b>{r.source}</b> → <b>{r.target}</b></span>
                          <span className="text-[10px] text-indigo-400 font-semibold uppercase">{r.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------
          SUSPICIOUS PATTERNS MODAL
      --------------------------------------------------------------------- */}
      {showPatternsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-semibold text-slate-100">Suspicious Network Patterns</h3>
              </div>
              <button
                onClick={() => setShowPatternsModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {patternsList.map(pat => (
                <div key={pat.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-100">{pat.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      {pat.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{pat.description}</p>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-950/50 flex justify-end">
              <button
                onClick={() => setShowPatternsModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------
          ENTITY RESOLUTION (JARO-WINKLER) MODAL
      --------------------------------------------------------------------- */}
      {resolutionModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitMerge className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">Jaro-Winkler Entity Resolution & Deduplication</h3>
                  <p className="text-[11px] text-slate-400">Detect cross-case identity collisions, alias overlaps, and phone number links</p>
                </div>
              </div>
              <button
                onClick={() => setResolutionModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {mergeSuccessMsg && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{mergeSuccessMsg}</span>
                </div>
              )}

              {resolutionLoading ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin mx-auto mb-2" />
                  <span>Analyzing string similarity metrics and graph collisions for {activeCase}...</span>
                </div>
              ) : resolutionCandidates.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400 space-y-1">
                  <ShieldCheck className="w-8 h-8 text-emerald-500/60 mx-auto mb-2" />
                  <p className="font-semibold text-slate-300">No duplicate candidates detected (&ge;85% threshold).</p>
                  <p className="text-[11px] text-slate-500">All entities currently indexed have distinct canonical identifiers.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs text-slate-400">
                    Found <b className="text-slate-200">{resolutionCandidates.length}</b> identity candidate pair(s) in active investigation:
                  </div>

                  {resolutionCandidates.map((cand, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            {cand.similarityScore ? `${Math.round(cand.similarityScore * 100)}% Similarity` : 'High Overlap'}
                          </span>
                          <span className="text-xs font-semibold text-slate-200">
                            {cand.sourceLabel} &harr; {cand.targetLabel}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Method: {cand.reason || 'Jaro-Winkler'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Canonical Record</span>
                          <div className="font-semibold text-slate-200">{cand.sourceLabel}</div>
                          <div className="text-[10px] text-slate-400">{cand.sourceType} · {cand.sourceId}</div>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Duplicate Record</span>
                          <div className="font-semibold text-slate-200">{cand.targetLabel}</div>
                          <div className="text-[10px] text-slate-400">{cand.targetType} · {cand.targetId}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                        <div className="text-[11px] text-slate-400">
                          Merges attributes, preserves custody chain, and unifies incident edges.
                        </div>

                        {canMergeEntities() ? (
                          <button
                            type="button"
                            onClick={() => handleExecuteMerge(cand)}
                            disabled={merging}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <GitMerge className="w-3.5 h-3.5" />
                            <span>{merging ? 'Merging...' : 'Approve & Execute Merge (SP)'}</span>
                          </button>
                        ) : (
                          <div
                            className="px-3 py-1.5 rounded-lg bg-slate-950 text-slate-500 border border-slate-800 text-xs font-medium flex items-center gap-1.5 cursor-not-allowed"
                            title="Supervisor (SP) clearance required to execute identity merges"
                          >
                            <Lock className="w-3.5 h-3.5 text-slate-500" />
                            <span>SP Approval Required</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Merges logged immutably under Section 63 BSA audit trail.
              </span>
              <button
                type="button"
                onClick={() => setResolutionModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Status Bar */}
      <div className="z-10 absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-500 pointer-events-none">
        <div className="flex items-center gap-4 bg-[#111827]/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 pointer-events-auto">
          <span>Active Nodes: <b className="text-slate-300">{filteredNodes.length}</b></span>
          <span>Relationships: <b className="text-slate-300">{filteredEdges.length}</b></span>
          <span className="text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Neo4j Engine Active
          </span>
          <span className="hidden sm:inline text-slate-500">| Right-click suspect for Tactical Simulator</span>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          {patternsList.length > 0 && (
            <button
              onClick={() => setShowPatternsModal(true)}
              className="bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>{patternsList.length} Suspicious Patterns Detected</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
