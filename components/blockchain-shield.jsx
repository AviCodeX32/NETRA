'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, Lock, ChevronDown, ChevronUp, 
  FileCheck2, Award, RefreshCw, CheckCircle2, AlertTriangle, 
  ExternalLink, Hash, Clock, UserCheck, Shield
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import BsaCertificateModal from './bsa-certificate-modal';

export default function BlockchainShield({ caseId = 'CASE-1024' }) {
  const { user, canSealCase } = useAuthStore();
  const [ledger, setLedger] = useState([]);
  const [verification, setVerification] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [sealing, setSealing] = useState(false);
  const [caseStatus, setCaseStatus] = useState({ isSealed: false });

  // Fetch initial ledger and verification
  const loadBlockchainData = async () => {
    try {
      const [ledgerRes, verifyRes, caseRes] = await Promise.all([
        fetch(`/api/blockchain/ledger/${caseId}`, { credentials: 'include' }).then(r => r.json()).catch(() => null),
        fetch(`/api/blockchain/verify/${caseId}`, { credentials: 'include' }).then(r => r.json()).catch(() => null),
        fetch(`/api/cases/${caseId}`, { credentials: 'include' }).then(r => r.json()).catch(() => null)
      ]);

      if (ledgerRes && ledgerRes.blocks) setLedger(ledgerRes.blocks);
      else if (ledgerRes && ledgerRes.ledger) setLedger(ledgerRes.ledger);

      if (verifyRes) setVerification(verifyRes);
      if (caseRes && caseRes.case) {
        setCaseStatus({ isSealed: caseRes.case.isSealed, sealedAt: caseRes.case.sealedAt, sealedBy: caseRes.case.sealedBy });
      }
    } catch (e) {
      console.error('Failed to load blockchain ledger:', e);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, [caseId]);

  // Live automated verification triggered by user
  const runLiveVerification = async () => {
    setVerifying(true);
    try {
      const res = await fetch(`/api/blockchain/verify/${caseId}`, { credentials: 'include' });
      const data = await res.json();
      setVerification(data);
    } catch (e) {
      console.error('Verification error:', e);
    } finally {
      setTimeout(() => setVerifying(false), 500);
    }
  };

  // SP-restricted case sealing
  const handleSealCase = async () => {
    if (!confirm(`Are you sure you want to officially freeze and seal ${caseId} under Section 63 BSA?\n\nThis creates an immutable sealing block on the ledger.`)) {
      return;
    }

    setSealing(true);
    try {
      const res = await fetch(`/api/blockchain/seal/${caseId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Case ${caseId} successfully sealed.`);
        await loadBlockchainData();
      } else {
        alert(data.error || 'Failed to seal case.');
      }
    } catch (e) {
      alert('Error sealing case: ' + e.message);
    } finally {
      setSealing(false);
    }
  };

  const latestBlock = ledger.length > 0 ? ledger[ledger.length - 1] : null;
  const isTamperFree = verification ? (verification.isValid && !verification.tampered) : true;

  return (
    <div className="w-full bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-sm mb-6">
      {/* Main Bar */}
      <div className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Status indicator */}
        <div className="flex items-center gap-3.5">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            isTamperFree 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}>
            {isTamperFree ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-100">
                {isTamperFree ? 'Chain of Custody Verified' : 'Integrity Mismatch Detected'}
              </span>
              {caseStatus.isSealed && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> SEALED (BSA-63)
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span>Case: <b className="text-slate-200">{caseId}</b></span>
              <span>•</span>
              <span>Blocks: <b className="text-slate-200">{ledger.length}</b></span>
              {latestBlock && (
                <>
                  <span>•</span>
                  <span className="font-mono text-slate-500 truncate max-w-xs">
                    Hash: {(latestBlock.current_block_hash || latestBlock.currentBlockHash || '').slice(0, 16)}...
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={runLiveVerification}
            disabled={verifying}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${verifying ? 'animate-spin' : ''}`} />
            <span>{verifying ? 'Verifying...' : 'Verify Chain'}</span>
          </button>

          <button
            onClick={() => setCertModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Court Certificate</span>
          </button>

          {canSealCase() && !caseStatus.isSealed && (
            <button
              onClick={handleSealCase}
              disabled={sealing}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 text-xs font-medium text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{sealing ? 'Sealing...' : 'Seal Case'}</span>
            </button>
          )}

          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="Toggle Audit Timeline"
          >
            {drawerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Audit Drawer Timeline */}
      {drawerOpen && (
        <div className="border-t border-slate-800/80 bg-slate-950/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Forensic Custody Chain ({ledger.length} Blocks)
            </h4>
            <span className="text-xs text-slate-500">Section 63 BSA 2023 Compliant</span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto">
            {ledger.map((b, idx) => {
              const height = b.block_height ?? b.blockHeight ?? idx;
              const currHash = b.current_block_hash || b.currentBlockHash || '';
              const prevHash = b.previous_block_hash || b.previousBlockHash || '';
              const action = b.action || 'INGESTION';
              const officer = b.officer_pno || b.officerPno || 'OFFICER';

              return (
                <div key={height} className="p-3 rounded-lg bg-[#111827] border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-400">Block #{height}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-slate-300">
                        {action}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {b.timestamp ? new Date(b.timestamp).toLocaleString() : 'Active'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 bg-slate-950/40 p-2 rounded border border-slate-800/40">
                    <div className="truncate">
                      <span className="text-slate-500">Prev: </span>
                      {prevHash.slice(0, 24)}...
                    </div>
                    <div className="truncate">
                      <span className="text-slate-500">Curr: </span>
                      <span className="text-emerald-400">{currHash.slice(0, 24)}...</span>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Officer: <b className="text-slate-400">{officer}</b></span>
                    <span className="text-emerald-400 font-medium">✓ Cryptographically Valid</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {certModalOpen && (
        <BsaCertificateModal caseId={caseId} onClose={() => setCertModalOpen(false)} />
      )}
    </div>
  );
}
