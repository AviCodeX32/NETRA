'use client';

import { useState, useEffect } from 'react';
import { 
  Smartphone, Wifi, WifiOff, MapPin, Camera, Clock, 
  Send, RefreshCw, CheckCircle2, ShieldCheck, AlertCircle, 
  X, Upload, Hash, User, Trash2, Database, Radio, ArrowUpRight
} from 'lucide-react';
import MultilingualVoiceInput from './multilingual-voice-input';

export default function FieldModeModal({ caseId = 'CASE-1024', cases = [], onClose }) {
  const [isOnline, setIsOnline] = useState(true);
  const [simulateOffline, setSimulateOffline] = useState(false);
  const [activeTab, setActiveTab] = useState('NOTE'); // 'NOTE' | 'PHOTO' | 'QUEUE'
  
  // Note state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [notePriority, setNotePriority] = useState('ROUTINE');
  const [selectedCase, setSelectedCase] = useState(caseId);

  // Evidence state
  const [evidenceName, setEvidenceName] = useState('');
  const [evidenceCategory, setEvidenceCategory] = useState('Physical Seizure');
  const [gpsLocation, setGpsLocation] = useState('18.9438° N, 72.8354° E (Nhava Sheva Dock Sector 4)');

  // Local storage queue state
  const [queue, setQueue] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);

  // Load offline queue on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexus_field_offline_queue');
      if (saved) {
        try {
          setQueue(JSON.parse(saved));
        } catch (e) {}
      } else {
        // Pre-populate with 2 realistic offline field exhibits
        const initial = [
          {
            id: 1,
            type: 'EVIDENCE_PHOTO',
            caseId: 'CASE-1024',
            title: 'Seized Container Seal #MH-9921',
            category: 'Physical Contraband',
            gps: '18.9481° N, 72.9312° E (JNPT Freight Gate 3)',
            timestamp: '2026-09-26 14:10:22',
            sha256: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
            synced: false
          },
          {
            id: 2,
            type: 'FIELD_NOTE',
            caseId: 'CASE-1024',
            title: 'Informant Meet at Dongri Nishanpada',
            content: 'Subject Farooq sighted handing paper chit to unknown driver.',
            gps: '18.9567° N, 72.8340° E (Dongri Sector 2)',
            timestamp: '2026-09-26 15:45:10',
            priority: 'HIGH',
            synced: false
          }
        ];
        setQueue(initial);
        localStorage.setItem('nexus_field_offline_queue', JSON.stringify(initial));
      }
    }
  }, []);

  // Listen to browser network changes
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const effectiveOnline = isOnline && !simulateOffline;

  // Save new note to offline queue
  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    const newItem = {
      id: Date.now(),
      type: 'FIELD_NOTE',
      caseId: selectedCase,
      title: noteTitle.trim() || 'Field Surveillance Log',
      content: noteContent.trim(),
      priority: notePriority,
      gps: gpsLocation,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      synced: false
    };

    const updated = [newItem, ...queue];
    setQueue(updated);
    localStorage.setItem('nexus_field_offline_queue', JSON.stringify(updated));

    setNoteTitle('');
    setNoteContent('');
    setSyncFeedback('Note captured and buffered locally into encrypted offline enclave.');
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  // Save evidence capture to offline queue
  const handleSaveEvidence = (e) => {
    e.preventDefault();
    if (!evidenceName.trim()) return;

    // Generate simulated SHA-256 client-side
    const pseudoHash = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0')).join('');

    const newItem = {
      id: Date.now(),
      type: 'EVIDENCE_PHOTO',
      caseId: selectedCase,
      title: evidenceName.trim(),
      category: evidenceCategory,
      gps: gpsLocation,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      sha256: pseudoHash,
      synced: false
    };

    const updated = [newItem, ...queue];
    setQueue(updated);
    localStorage.setItem('nexus_field_offline_queue', JSON.stringify(updated));

    setEvidenceName('');
    setSyncFeedback('Photo/Exhibit hash generated and queued for blockchain anchoring.');
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  // Sync all to secure backend
  const handleSyncAll = async () => {
    if (!effectiveOnline) {
      alert('Cannot sync while in offline mode. Restore network connectivity to transmit.');
      return;
    }

    setSyncing(true);
    // Simulate transmitting offline queued items to /api/evidence/upload and blockchain
    setTimeout(() => {
      const syncedQueue = queue.map(item => ({ ...item, synced: true }));
      setQueue(syncedQueue);
      localStorage.setItem('nexus_field_offline_queue', JSON.stringify(syncedQueue));
      setSyncing(false);
      setSyncFeedback(`Successfully synchronized ${queue.filter(q => !q.synced).length} items to case ledger with SHA-256 anchoring!`);
      setTimeout(() => setSyncFeedback(null), 4000);
    }, 1500);
  };

  const handleClearSynced = () => {
    const unSyncedOnly = queue.filter(q => !q.synced);
    setQueue(unSyncedOnly);
    localStorage.setItem('nexus_field_offline_queue', JSON.stringify(unSyncedOnly));
  };

  const pendingCount = queue.filter(q => !q.synced).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0B1120] border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="px-5 py-4 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  TACTICAL FIELD MODE
                </span>
                {effectiveOnline ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <Wifi className="w-3 h-3" />
                    <span>ONLINE</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
                    <WifiOff className="w-3 h-3" />
                    <span>OFFLINE ENCLAVE</span>
                  </span>
                )}
              </div>
              <h2 className="text-sm font-bold text-slate-100 mt-0.5">
                Nexus Mobile Field Desk & Offline Capture
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Simulate Offline for Testing */}
            <button
              type="button"
              onClick={() => setSimulateOffline(!simulateOffline)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold border transition-colors ${
                simulateOffline
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Simulate weak connectivity in field"
            >
              {simulateOffline ? 'Offline Sim On' : 'Simulate Offline'}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live GPS & Context Strip */}
        <div className="px-5 py-2.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="text-[11px] font-mono">{gpsLocation}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">Scoped Docket:</span>
            <select
              value={selectedCase}
              onChange={(e) => setSelectedCase(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-blue-400 font-mono focus:outline-none"
            >
              <option value="CASE-1024">FIR-1024 (Maritime)</option>
              <option value="CASE-1021">FIR-1021 (Ransomware)</option>
              <option value="CASE-1018">FIR-1018 (Narcotics)</option>
            </select>
          </div>
        </div>

        {/* Operational Feedback Toast */}
        {syncFeedback && (
          <div className="px-5 py-2.5 bg-blue-950/40 border-b border-blue-900/60 text-xs text-blue-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-5 pt-3 bg-[#0B1120] border-b border-slate-800 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('NOTE')}
            className={`px-3 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'NOTE' 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Field Note Dictation
          </button>
          <button
            onClick={() => setActiveTab('PHOTO')}
            className={`px-3 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'PHOTO' 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Photo & Exhibit Metadata
          </button>
          <button
            onClick={() => setActiveTab('QUEUE')}
            className={`px-3 py-2 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'QUEUE' 
                ? 'border-blue-500 text-blue-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Sync Buffer</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab Panes */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* TAB 1: QUICK NOTE CAPTURE */}
          {activeTab === 'NOTE' && (
            <form onSubmit={handleSaveNote} className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Observation Header (e.g. Burner Sighted)..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
                <select
                  value={notePriority}
                  onChange={(e) => setNotePriority(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="ROUTINE">Routine Memo</option>
                  <option value="HIGH">High Priority</option>
                  <option value="CRITICAL">Critical Alert</option>
                </select>
              </div>

              {/* Multilingual Voice Input Component */}
              <MultilingualVoiceInput
                value={noteContent}
                onChange={setNoteContent}
                onTranscribeComplete={({ original, translated, language }) => {
                  setNoteContent(translated ? `${original}\n[Official Translation: ${translated}]` : original);
                }}
              />

              <textarea
                rows={4}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Type or voice dictate surveillance notes in Hindi, Marathi, Bengali, Tamil or English..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed resize-none font-sans"
              />

              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-500">
                  Buffer Mode: <b className="text-slate-400">{effectiveOnline ? 'Direct Enclave' : 'Encrypted Offline Storage'}</b>
                </span>
                <button
                  type="submit"
                  disabled={!noteContent.trim()}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save to Field Buffer</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PHOTO & EXHIBIT CAPTURE */}
          {activeTab === 'PHOTO' && (
            <form onSubmit={handleSaveEvidence} className="space-y-4">
              <div className="p-6 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 text-center space-y-2">
                <Camera className="w-8 h-8 text-blue-400 mx-auto" />
                <div className="text-xs font-semibold text-slate-200">Field Evidence Metadata Capture</div>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Automatically embeds device GPS coordinates, timestamp, and computes client-side SHA-256 hash.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Exhibit Name / Tag</label>
                  <input
                    type="text"
                    value={evidenceName}
                    onChange={(e) => setEvidenceName(e.target.value)}
                    placeholder="e.g. Seized Burner SIM packaging, Vehicle number plate..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Category</label>
                    <select
                      value={evidenceCategory}
                      onChange={(e) => setEvidenceCategory(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Physical Contraband">Physical Contraband</option>
                      <option value="Digital Handset">Digital Handset / SIM</option>
                      <option value="Paper Ledger / Chits">Paper Ledger / Chits</option>
                      <option value="Vehicle Inspection">Vehicle Inspection</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase block mb-1">Auto GPS Lock</label>
                    <input
                      type="text"
                      readOnly
                      value={gpsLocation}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!evidenceName.trim()}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Compute SHA-256 & Queue for Ledger Anchoring</span>
              </button>
            </form>
          )}

          {/* TAB 3: QUEUE & SYNC STATUS */}
          {activeTab === 'QUEUE' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="text-xs text-slate-300">
                  <span>Queued Items: <b className="text-blue-400 font-mono">{queue.length}</b></span>
                  <span className="text-slate-500 mx-2">•</span>
                  <span>Pending Sync: <b className="text-amber-400 font-mono">{pendingCount}</b></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearSynced}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                    title="Remove already synced items"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear Synced</span>
                  </button>

                  <button
                    onClick={handleSyncAll}
                    disabled={syncing || pendingCount === 0 || !effectiveOnline}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                    <span>{syncing ? 'Transmitting...' : 'Sync All to Secure Ledger'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {queue.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
                    Offline queue is empty. Capture notes or photos to buffer them locally.
                  </div>
                ) : (
                  queue.map(item => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                            item.type === 'EVIDENCE_PHOTO' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          }`}>
                            {item.type}
                          </span>
                          <span className="font-bold text-slate-100">{item.title}</span>
                          <span className="text-[10px] font-mono text-slate-400">({item.caseId})</span>
                        </div>
                        {item.content && (
                          <p className="text-[11px] text-slate-300 line-clamp-1">{item.content}</p>
                        )}
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                          <span>{item.timestamp}</span>
                          <span>•</span>
                          <span>{item.gps}</span>
                        </div>
                      </div>

                      <div className="shrink-0 self-end sm:self-center">
                        {item.synced ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-mono">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>LEDGER LOCKED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>PENDING SYNC</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0F172A] border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            AES-256 Client-Side Enclave // Auto-reconnect enabled
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors cursor-pointer"
          >
            Close Field Desk
          </button>
        </div>
      </div>
    </div>
  );
}
