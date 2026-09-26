'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Shield, LayoutDashboard, Share2, Search as SearchIcon, 
  FolderArchive, Bell, HelpCircle, UserPlus, History, 
  LogOut, ChevronRight, CheckCircle2, AlertTriangle, 
  FolderOpen, ShieldCheck, Flame, Activity, Upload, 
  FileText, ExternalLink, Menu, X, ArrowUpRight,
  Building, Phone, MapPin, Truck, CreditCard, User,
  ChevronDown, ShieldAlert, FolderPlus, GitMerge, Lock, Filter,
  Fingerprint, AlertOctagon, Scale, Radio, MessageSquare, Download,
  Calendar, ArrowRight, Eye, Plus, Send, Check, Hash, Bookmark,
  Smartphone, BookOpen, Mic
} from 'lucide-react';

import { useAuthStore } from '@/lib/auth-store';
import NetworkGraph from './network-graph';
import BlockchainShield from './blockchain-shield';
import ProvisionOfficerModal from './provision-officer-modal';
import AuditLedgerModal from './audit-ledger-modal';
import CreateCaseModal from './create-case-modal';
import MergeCaseModal from './merge-case-modal';
import AddEvidenceModal from './add-evidence-modal';
import CaseBriefingModal from './case-briefing-modal';
import FieldModeModal from './field-mode-modal';
import InvestigationPlaybooksModal from './investigation-playbooks-modal';
import MultilingualVoiceInput from './multilingual-voice-input';

const PAGE_TITLES = {
  '/dashboard': 'Investigation Dashboard',
  '/network': 'Criminal Network Explorer',
  '/investigate': 'Suspect Dossier Explorer',
  '/data': 'Digital Evidence Vault',
  '/alerts': 'Intelligence Alerts',
  '/help': 'User Guide'
};

function Sidebar({ 
  mobileOpen, 
  setMobileOpen, 
  onOpenProvision, 
  onOpenAudit,
  onOpenBriefing,
  onOpenFieldMode,
  onOpenPlaybooks
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, canProvisionOfficer, canViewAudit, logout } = useAuthStore();
  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '--';

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/network', label: 'Network Graph', icon: Share2 },
    { href: '/investigate', label: 'Investigate', icon: SearchIcon },
    { href: '/data', label: 'Evidence Vault', icon: FolderArchive },
    { href: '/alerts', label: 'Alerts', icon: Bell, count: 3 },
    { href: '/help', label: 'Documentation', icon: HelpCircle }
  ];

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-[#0B0F19] border-r border-slate-800/80 z-50 flex flex-col transition-transform duration-200 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-100 text-sm tracking-tight block">Nexus</span>
              <span className="text-[10px] text-slate-500 font-medium block -mt-0.5">Criminal Intelligence</span>
            </div>
          </Link>
          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Station Jurisdiction Badge */}
        <div className="px-6 py-3 border-b border-slate-800/40 bg-slate-950/30 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-slate-400">Station: <b className="text-slate-300">{user?.stationCode || 'MUM-AND-04'}</b></span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Workspaces
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white font-semibold' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.count && (
                  <span className={`px-1.5 py-0.5 text-[10px] rounded font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Tactical Intelligence Modules */}
          <div className="pt-4 mt-3 border-t border-slate-800/60">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Tactical Operations
            </div>
            <button
              type="button"
              onClick={() => { setMobileOpen(false); onOpenBriefing?.(); }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Case Briefing</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold">A1-C3</span>
            </button>
            <button
              type="button"
              onClick={() => { setMobileOpen(false); onOpenFieldMode?.(); }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <span>Field Desk</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono font-bold">Offline</span>
            </button>
            <button
              type="button"
              onClick={() => { setMobileOpen(false); onOpenPlaybooks?.(); }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>SOP Playbooks</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono font-bold">5 SOPs</span>
            </button>
          </div>

          {/* Admin Tools */}
          {(canProvisionOfficer() || canViewAudit()) && (
            <div className="pt-5 mt-4 border-t border-slate-800/60">
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Administration
              </div>
              {canProvisionOfficer() && (
                <button
                  type="button"
                  onClick={onOpenProvision}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
                >
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  <span>Provision Officers</span>
                </button>
              )}
              {canViewAudit() && (
                <button
                  type="button"
                  onClick={onOpenAudit}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
                >
                  <History className="w-4 h-4 text-blue-400" />
                  <span>Audit Ledger</span>
                </button>
              )}
            </div>
          )}
        </nav>

        {/* Officer Footer Badge */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-blue-400 shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Unauthenticated'}</div>
                <div className="text-[10px] text-slate-500 font-mono truncate">{user?.pno || 'OFFLINE'}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

/* --------------------------------------------------------------------------
   TOPBAR
-------------------------------------------------------------------------- */
function Topbar({ 
  onMenu, 
  activeCase, 
  setActiveCase, 
  cases = [],
  onOpenBriefing,
  onOpenFieldMode,
  onOpenPlaybooks
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const roleName = user?.role === 'SUPERVISOR_SP' ? 'Supervisor SP' 
    : user?.role === 'CYBER_ANALYST' ? 'Cyber Analyst' 
    : user?.role === 'INVESTIGATING_OFFICER' ? 'Investigating Officer'
    : 'Unassigned';

  const currentCase = cases.find(c => c.id === activeCase);
  const isAssignedToIO = user?.role === 'INVESTIGATING_OFFICER' && currentCase?.assignedOfficerPno === user?.pno;

  return (
    <header className="h-16 px-6 bg-[#0B0F19] border-b border-slate-800/80 flex items-center justify-between gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <button 
          onClick={onMenu} 
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-semibold text-slate-100 hidden md:block shrink-0">{PAGE_TITLES[pathname] || 'Workspace'}</h2>

        {/* Active Case Selector Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={activeCase}
              onChange={(e) => setActiveCase(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-xs font-semibold text-slate-200 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none max-w-[240px] sm:max-w-xs truncate"
              title="Select Active Investigation Case"
            >
              {(cases.length > 0 ? cases : [
                { id: 'CASE-1024', caseNumber: 'FIR-2026-MUM-1024', title: 'Maritime Hawala & Contraband Network' },
                { id: 'CASE-1021', caseNumber: 'FIR-2026-MUM-1021', title: 'Automated Ransomware Syndicate' },
                { id: 'CASE-1018', caseNumber: 'FIR-2026-MUM-1018', title: 'Synthetic Narcotics Distribution' }
              ]).map(c => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber ? `${c.caseNumber}` : c.id} · {c.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* IO Assignment Badge */}
          {user?.role === 'INVESTIGATING_OFFICER' && (
            <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${
              isAssignedToIO
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            }`}>
              {isAssignedToIO ? '✓ Assigned' : '⚠ Restricted'}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick Intelligence Action Buttons */}
        <div className="hidden xl:flex items-center gap-2 border-r border-slate-800 pr-3">
          <button
            type="button"
            onClick={onOpenBriefing}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-xs font-semibold text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Generate certified case briefing with Admiralty grading (A1-C3) and SHA-256 seal"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Case Briefing</span>
          </button>
          <button
            type="button"
            onClick={onOpenFieldMode}
            className="px-2.5 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-xs font-semibold text-blue-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Launch offline-first mobile field desk for patrol/raid notes and geotagged evidence"
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            <span>Field Desk</span>
          </button>
          <button
            type="button"
            onClick={onOpenPlaybooks}
            className="px-2.5 py-1.5 rounded-lg bg-purple-600/15 hover:bg-purple-600/25 border border-purple-500/30 text-xs font-semibold text-purple-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Investigation SOP playbooks with statutory legal citations"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Playbooks</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="font-medium text-slate-200">{roleName}</span>
        </div>

        <button
          onClick={async () => {
            await logout();
            router.replace('/login');
          }}
          className="text-xs font-medium text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}

/* --------------------------------------------------------------------------
   DASHBOARD VIEW (FORENSIC LAW ENFORCEMENT INTELLIGENCE COMMAND DESK)
-------------------------------------------------------------------------- */
function DashboardView({ 
  go, 
  activeCase = 'CASE-1024', 
  setActiveCase, 
  cases = [],
  onOpenCreateCase,
  onOpenMergeModal,
  onOpenAddEvidence,
  onLaunchSynthesizedGraph,
  onOpenBriefing,
  onOpenFieldMode,
  onOpenPlaybooks
}) {
  const { user, canIngestEvidence, canCreateCase } = useAuthStore();
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'MY_CASES' | 'OVERLAPS'
  const [searchFilter, setSearchFilter] = useState('');
  const [authAlert, setAuthAlert] = useState(null);

  const isSP = user?.role === 'SUPERVISOR_SP';
  const isAnalyst = user?.role === 'CYBER_ANALYST';
  const isIO = user?.role === 'INVESTIGATING_OFFICER';

  const defaultSeedCases = [
    { 
      id: 'CASE-1024', 
      caseNumber: 'FIR-2026-MUM-1024', 
      title: 'Maritime Hawala & Contraband Network', 
      category: 'Syndicate Smuggling', 
      assignedOfficerPno: 'IO-MH-7723',
      suspectCount: 6, 
      evidenceCount: 3,
      status: 'ACTIVE', 
      isSealed: false 
    },
    { 
      id: 'CASE-1021', 
      caseNumber: 'FIR-2026-MUM-1021', 
      title: 'Automated Ransomware Syndicate', 
      category: 'Cyber Extortion', 
      assignedOfficerPno: 'IO-MH-9999',
      suspectCount: 4, 
      evidenceCount: 2,
      status: 'SEALED', 
      isSealed: true 
    },
    { 
      id: 'CASE-1018', 
      caseNumber: 'FIR-2026-MUM-1018', 
      title: 'Synthetic Narcotics Distribution', 
      category: 'Narcotics Cartel', 
      assignedOfficerPno: 'IO-MH-7723',
      suspectCount: 5, 
      evidenceCount: 1,
      status: 'ACTIVE', 
      isSealed: false 
    }
  ];

  const displayCases = cases.length > 0 ? cases : defaultSeedCases;

  // Officer Assignment Segregation
  const myAssignedCases = useMemo(() => {
    return displayCases.filter(c => c.assignedOfficerPno === user?.pno);
  }, [displayCases, user?.pno]);

  // Cross-Case Overlapping Syndicates
  const overlapCases = useMemo(() => {
    return displayCases.filter(c => c.id === 'CASE-1024' || c.id === 'CASE-1021' || c.id === 'CASE-1018');
  }, [displayCases]);

  // Filtered List based on tab and search
  const visibleCases = useMemo(() => {
    let list = displayCases;
    if (filterTab === 'MY_CASES') {
      list = myAssignedCases;
    } else if (filterTab === 'OVERLAPS') {
      list = overlapCases;
    }

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      list = list.filter(c => 
        (c.caseNumber || '').toLowerCase().includes(q) ||
        (c.title || '').toLowerCase().includes(q) ||
        (c.category || '').toLowerCase().includes(q) ||
        (c.assignedOfficerPno || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [displayCases, myAssignedCases, overlapCases, filterTab, searchFilter]);

  const totalSuspects = displayCases.reduce((acc, c) => acc + (c.suspectCount || 6), 0);
  const totalExhibits = displayCases.reduce((acc, c) => acc + (c.evidenceCount || 2), 0);

  const handleCreateCaseClick = () => {
    if (isSP) {
      if (onOpenCreateCase) onOpenCreateCase();
    } else {
      setAuthAlert('Authority Restricted: FIR docket registration under Section 154 CrPC requires Superintendent of Police (SP) clearance.');
      setTimeout(() => setAuthAlert(null), 4500);
    }
  };

  const handleAddEvidenceClick = (targetCaseId) => {
    if (isSP || isAnalyst) {
      if (onOpenAddEvidence) onOpenAddEvidence(targetCaseId || activeCase);
    } else {
      setAuthAlert('Exhibit Ingestion Restricted: Investigating Officers have read-only access to exhibits. Uploading is managed by Cyber Forensics Analysts and Supervisors.');
      setTimeout(() => setAuthAlert(null), 4500);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ---------------------------------------------------------------------
          STATION COMMAND & JURISDICTION RIBBON
      --------------------------------------------------------------------- */}
      <div className="p-4 rounded-xl bg-[#0D1322] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30 tracking-wider">
              POLICE INTELLIGENCE DESK // MUM-AND-04
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              RESTRICTED // LAW ENFORCEMENT SENSITIVE
            </span>
          </div>
          <h1 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span>Andheri Cyber & Organized Crime Wing</span>
            <span className="text-slate-600 font-normal">|</span>
            <span className="text-xs text-slate-400 font-medium font-mono">Duty Officer: {user?.name || 'Officer On Duty'} ({user?.rank || 'Investigator'})</span>
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-0.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Neo4j Graph Enclave: <b className="text-slate-200">Case-Partition Active</b></span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Custody Chain: <b className="text-slate-200">SHA-256 Ledger Locked</b></span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Officer PNO: <b className="text-blue-400 font-mono">{user?.pno || 'OFFLINE'}</b></span>
            </span>
          </div>
        </div>

        {/* Tactical Action Bar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* 1. SP-Exclusive Register New Case */}
          <button
            type="button"
            onClick={handleCreateCaseClick}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isSP 
                ? 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/50 hover:shadow-blue-600/20' 
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-300 hover:border-slate-700'
            }`}
            title={isSP ? 'Register and open a new FIR docket (SP Clearance)' : 'SP Authorization Required to Register Dockets'}
          >
            {isSP ? <FolderPlus className="w-4 h-4 text-white" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
            <span>+ Register Case Docket</span>
            {!isSP && <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">SP Only</span>}
          </button>

          {/* 2. Analyst & SP Add Evidence */}
          <button
            type="button"
            onClick={() => handleAddEvidenceClick(activeCase)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isSP || isAnalyst
                ? 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-300 hover:border-slate-700'
            }`}
            title={isSP || isAnalyst ? 'Ingest evidence file into immutable custody chain' : 'Exhibit Ingestion Restricted to Cyber Analysts & SP'}
          >
            {isSP || isAnalyst ? <Upload className="w-4 h-4 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
            <span>+ Ingest Exhibit</span>
            {isIO && <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">Analyst/SP</span>}
          </button>

          {/* 3. Cross-Case Synthesis Launch */}
          <button
            type="button"
            onClick={() => onOpenMergeModal && onOpenMergeModal(displayCases.find(c => c.id === activeCase) || displayCases[0])}
            className="px-3 py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            title="Launch cross-case synthesis to detect common bridge entities"
          >
            <GitMerge className="w-4 h-4 text-indigo-400" />
            <span>Cross-Case Synthesis</span>
          </button>

          {/* 4. One-Click Case Briefing */}
          <button
            type="button"
            onClick={onOpenBriefing}
            className="px-3 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            title="Generate certified case briefing with Admiralty grading (A1-C3) and SHA-256 seal"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Case Briefing</span>
          </button>

          {/* 5. Mobile-Friendly Field Desk */}
          <button
            type="button"
            onClick={onOpenFieldMode}
            className="px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            title="Offline-first field operations desk with GPS geotagging and client-side SHA-256 queue"
          >
            <Smartphone className="w-4 h-4 text-blue-400" />
            <span>Field Desk</span>
          </button>

          {/* 6. Investigation Playbooks */}
          <button
            type="button"
            onClick={onOpenPlaybooks}
            className="px-3 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            title="Guided statutory checklists for Cyber Fraud, Hawala, Organized Crime, and Narcotics"
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>SOP Playbooks</span>
          </button>
        </div>
      </div>

      {/* Role-Based Authority Feedback Toast/Banner */}
      {authAlert && (
        <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/50 text-amber-300 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{authAlert}</span>
          </div>
          <button onClick={() => setAuthAlert(null)} className="text-amber-400 hover:text-amber-200 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ---------------------------------------------------------------------
          FORENSIC METRICS GRID (HIGH INFORMATION DENSITY)
      --------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0D1322] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-semibold uppercase text-slate-400">Jurisdiction Dockets</span>
            <FolderOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">{displayCases.length}</div>
          <div className="text-[11px] text-blue-400 mt-1 font-medium flex items-center gap-1">
            <span>★ {myAssignedCases.length} assigned directly to your PNO</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D1322] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-semibold uppercase text-slate-400">Tracked Entities</span>
            <User className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">{totalSuspects}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-medium">
            Suspects, burner phones & shell accounts
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D1322] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-semibold uppercase text-slate-400">Cryptographic Exhibits</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">{totalExhibits}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium">
            100% SHA-256 Tamper-Proof Verified
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0D1322] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-semibold uppercase text-slate-400">Syndicate Collisions</span>
            <GitMerge className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">2 Overlaps</div>
          <div className="text-[11px] text-amber-400 mt-1 font-medium">
            Cross-case bridge entities identified
          </div>
        </div>
      </div>

      {/* Compact Alert Strip: Bridge Node Intelligence Alert */}
      <div className="px-4 py-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <GitMerge className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-slate-300">
            <b className="text-indigo-300 font-semibold">Syndicate Radar Alert:</b> 2 Cross-Case bridge entities identified linking FIR-1024, FIR-1021 and FIR-1018.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setFilterTab('OVERLAPS')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Collisions ({overlapCases.length})</span>
            <ChevronRight className="w-3 h-3" />
          </button>
          <span className="text-slate-600">|</span>
          <button
            type="button"
            onClick={() => onLaunchSynthesizedGraph && onLaunchSynthesizedGraph(['CASE-1024', 'CASE-1021'])}
            className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <GitMerge className="w-3 h-3" />
            <span>Synthesize Graphs</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          INVESTIGATION DOSSIERS SEGREGATION & MATRIX
      --------------------------------------------------------------------- */}
      <div className="rounded-xl bg-[#0D1322] border border-slate-800 overflow-hidden shadow-xl">
        {/* Dossier Filter & Segregation Bar */}
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/50">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterTab('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTab === 'ALL'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              All District Dockets ({displayCases.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterTab('MY_CASES')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                filterTab === 'MY_CASES'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>My Assigned Cases ({myAssignedCases.length})</span>
              {myAssignedCases.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${filterTab === 'MY_CASES' ? 'bg-white/20 text-white' : 'bg-blue-500/20 text-blue-400'}`}>
                  ★ Assigned
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setFilterTab('OVERLAPS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                filterTab === 'OVERLAPS'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitMerge className="w-3.5 h-3.5 text-indigo-400" />
              <span>Cross-Case Overlaps ({overlapCases.length})</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-64">
            <SearchIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search FIR, category or title..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        {/* Sub-label banner */}
        {filterTab === 'MY_CASES' && (
          <div className="px-5 py-2.5 bg-blue-950/20 border-b border-blue-900/30 flex items-center justify-between text-xs text-blue-300">
            <span>Showing criminal investigations directly assigned to Officer PNO: <b className="font-mono text-white">{user?.pno}</b></span>
            <span className="text-[11px] text-slate-400">Strict Case Segregation Active</span>
          </div>
        )}

        {/* Overlaps Detailed Intelligence Banner */}
        {filterTab === 'OVERLAPS' && (
          <div className="p-4 bg-indigo-950/30 border-b border-indigo-900/40 space-y-3 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 font-mono">
                  Cross-Case Overlap Collisions
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  2 BRIDGE NODES IDENTIFIED
                </span>
              </div>
              <button
                type="button"
                onClick={() => onLaunchSynthesizedGraph && onLaunchSynthesizedGraph(['CASE-1024', 'CASE-1021'])}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md w-fit"
              >
                <GitMerge className="w-3.5 h-3.5" />
                <span>Launch Synthesized Multi-Case Canvas</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">Bridge Node: Farooq (Financial Broker)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">CRITICAL</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Operating concurrently in <b className="text-slate-200 font-mono">FIR-1024</b> (Maritime Hawala) and <b className="text-slate-200 font-mono">FIR-1021</b> (Ransomware Syndicate). Directing cash layering between Dubai dhow logistics and extortion proceeds.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">Bridge Node: HDFC A/C 50200091823</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">SUSPICIOUS</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Account appears in both <b className="text-slate-200 font-mono">FIR-1024</b> and <b className="text-slate-200 font-mono">FIR-1018</b> (Narcotics Cartel). Disperses funds for precursor chemical transports.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* High-Density Dossier Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/70 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">FIR Docket Number</th>
                <th className="py-3 px-4">Investigation Title & Category</th>
                <th className="py-3 px-4">Assigned IO</th>
                <th className="py-3 px-4">Suspects</th>
                <th className="py-3 px-4">Exhibits</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {visibleCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No investigation dockets found matching the active filter.
                  </td>
                </tr>
              ) : (
                visibleCases.map(c => {
                  const isCurrent = c.id === activeCase;
                  const isAssignedToUser = c.assignedOfficerPno === user?.pno;

                  return (
                    <tr 
                      key={c.id} 
                      className={`hover:bg-slate-800/40 transition-colors ${isCurrent ? 'bg-blue-950/20' : ''}`}
                    >
                      <td className="py-3.5 px-4 font-mono font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400">{c.caseNumber || c.id}</span>
                          {isCurrent && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              Active
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-100">{c.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{c.category}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {isAssignedToUser ? (
                          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[11px] font-bold border border-blue-500/30 inline-flex items-center gap-1">
                            <span>★ You ({c.assignedOfficerPno})</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[11px]">
                            {c.assignedOfficerPno || 'Unassigned'}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono">{c.suspectCount || 6} linked nodes</td>

                      <td className="py-3.5 px-4 font-mono">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          {c.evidenceCount || 2} SHA-256
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {c.isSealed ? (
                          <span className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Sealed Docket
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Active Case
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Merge Case Button */}
                          <button
                            type="button"
                            onClick={() => onOpenMergeModal && onOpenMergeModal(c)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            title="Merge this docket with another active case to inspect common bridge nodes"
                          >
                            <GitMerge className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Merge Case</span>
                          </button>

                          {/* Add Evidence Button */}
                          <button
                            type="button"
                            onClick={() => handleAddEvidenceClick(c.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                              isSP || isAnalyst
                                ? 'bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300'
                                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                            title={isSP || isAnalyst ? 'Ingest evidence into this case' : 'Exhibit ingestion restricted for Investigating Officers'}
                          >
                            <Upload className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Add File</span>
                          </button>

                          {/* Explore Graph */}
                          <button
                            type="button"
                            onClick={() => {
                              if (setActiveCase) setActiveCase(c.id);
                              go('/network');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Explore Graph
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lower Operational Intelligence Grid (2-Column Balanced Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Blockchain Custody Shield */}
        <div>
          <BlockchainShield caseId={activeCase} />
        </div>

        {/* Right Column: Detected Syndicate Patterns */}
        <div className="p-5 rounded-xl bg-[#0D1322] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span>Detected Syndicate Patterns</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Automated graph heuristics & cross-case link analysis</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
              3 ACTIVE DETECTIONS
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  HIGH SEVERITY
                </span>
                <span className="text-[11px] text-slate-500 font-mono">94% confidence</span>
              </div>
              <h4 className="text-xs font-semibold text-slate-100">Layered Hawala Settlement Channel</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multi-jurisdictional funds transfer path detected between offshore entity and domestic accounts.
              </p>
              <button onClick={() => go('/network')} className="text-xs font-medium text-blue-400 hover:text-blue-300 pt-1 flex items-center gap-1 cursor-pointer">
                <span>Inspect in Graph Canvas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  MEDIUM SEVERITY
                </span>
                <span className="text-[11px] text-slate-500 font-mono">89% confidence</span>
              </div>
              <h4 className="text-xs font-semibold text-slate-100">Burner Phone Cell Tower Cluster</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Repeated co-location of burner SIM cards near Nhava Sheva coastal dock boundaries.
              </p>
              <button onClick={() => go('/network')} className="text-xs font-medium text-blue-400 hover:text-blue-300 pt-1 flex items-center gap-1 cursor-pointer">
                <span>Inspect in Graph Canvas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  ANALYTICS
                </span>
                <span className="text-[11px] text-slate-500 font-mono">84% confidence</span>
              </div>
              <h4 className="text-xs font-semibold text-slate-100">Transit Vehicle ANPR Overlap</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Commercial transport MH-04-AZ-9921 observed moving freight between Panvel and port terminal.
              </p>
              <button onClick={() => go('/network')} className="text-xs font-medium text-blue-400 hover:text-blue-300 pt-1 flex items-center gap-1 cursor-pointer">
                <span>Inspect in Graph Canvas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   INVESTIGATE VIEW (ADVANCED CRIMINAL DOSSIER & TARGET PROFILING WORKSTATION)
-------------------------------------------------------------------------- */
function InvestigateView({ go, activeCase = 'CASE-1024', setActiveCase, cases = [] }) {
  const { user } = useAuthStore();
  const [selectedCaseFilter, setSelectedCaseFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedEntityId, setSelectedEntityId] = useState('person-1');
  const [activeTab, setActiveTab] = useState('PROFILE'); // 'PROFILE' | 'TIMELINE' | 'ASSOCIATES' | 'EXHIBITS' | 'NOTES'
  const [toastMessage, setToastMessage] = useState(null);

  // Dynamic warrant & legal status per entity
  const [warrantStatusMap, setWarrantStatusMap] = useState({
    'person-1': 'LOOKOUT CIRCULAR (LOC)',
    'person-farooq': 'ACTIVE ARREST WARRANT (SEC 73 CrPC)',
    'person-2': 'UNDER SURVEILLANCE',
    'person-ransom-1': 'RED CORNER NOTICE PENDING',
    'person-narc-1': 'NON-BAILABLE WARRANT',
    'org-1': 'FREEZE ORDER (SEC 102 CrPC)',
    'account-1': 'ATTACHED UNDER PMLA',
    'phone-1': 'INTERCEPTION ACTIVE',
    'vehicle-1': 'IMPOUND CIRCULAR'
  });

  // Dynamic investigator notes state
  const [notesMap, setNotesMap] = useState({
    'person-1': [
      { id: 1, author: 'IO-MH-7723', date: '2026-09-14 19:30', priority: 'CRITICAL', text: 'Subject spotted conducting late-night meeting near Sector 15 Belapur. Surveillance team Alpha deployed with continuous telephoto coverage.' },
      { id: 2, author: 'CYBER-MH-4011', date: '2026-09-13 16:00', priority: 'HIGH', text: 'Section 91 CrPC notice served on HDFC Bank Fort branch. Freezing order placed on debit transactions exceeding ₹1,00,000.' }
    ],
    'person-farooq': [
      { id: 1, author: 'IO-MH-7723', date: '2026-09-14 21:00', priority: 'CRITICAL', text: 'Non-Bailable Warrant obtained from Esplanade Metropolitan Magistrate Court. Joint raid scheduled with Special Operation Squad.' },
      { id: 2, author: 'ANALYST-MH-02', date: '2026-09-12 14:15', priority: 'HIGH', text: 'Chit ledger seized in Dongri raid indicates ₹8.4 Cr routed across 4 shell accounts to Al-Noor Exchange Dubai.' }
    ],
    'person-2': [
      { id: 1, author: 'IO-MH-9999', date: '2026-09-11 11:20', priority: 'ROUTINE', text: 'Offshore movements tracked via Dubai immigration feed. Co-travel confirmed with shipping logistics agents.' }
    ],
    'person-ransom-1': [
      { id: 1, author: 'CYBER-MH-4011', date: '2026-09-14 02:40', priority: 'CRITICAL', text: 'Darkweb threat intelligence matched malware compile timestamp with local Mumbai IP address pool.' }
    ],
    'person-narc-1': [
      { id: 1, author: 'IO-MH-7723', date: '2026-09-12 18:00', priority: 'HIGH', text: 'Informant reports delivery of 25kg synthetic precursor consignment via JNPT container gateway.' }
    ]
  });

  const [newNoteText, setNewNoteText] = useState('');
  const [newNotePriority, setNewNotePriority] = useState('ROUTINE');
  const [showVoiceDictation, setShowVoiceDictation] = useState(false);

  const entities = useMemo(() => [
    {
      id: 'person-1',
      name: 'Rajesh Kumar',
      type: 'PERSON',
      role: 'Syndicate Ringleader & Logistics Head',
      risk: 'CRITICAL',
      score: 94,
      caseId: 'CASE-1024',
      caseNumber: 'FIR-2026-MUM-1024',
      caseTitle: 'Maritime Hawala & Contraband Network',
      uid: 'UID-MH-1024-RK',
      aliases: 'RK / Bhaijaan / Captain',
      phone: '+91 98201 44891',
      org: 'Oceanic Freight Logistics Ltd',
      location: 'CBD Belapur, Navi Mumbai',
      demographics: {
        age: '48 Yrs (DOB: 14-Aug-1977)',
        nationality: 'Indian Citizen',
        fatherName: 'Late Ramprasad Kumar',
        residence: 'Flat 902, Palm Heights, Sector 15, CBD Belapur',
        passport: 'Z-4891024 (Impounded by RPO Mumbai)',
        pan: 'ABC PK 9182 K (Attached)'
      },
      comms: {
        imei: '864209041238910 (Dual SIM)',
        imsi: '404450918234102',
        encryptedHandle: 'Threema: #RK991 / Signal: +91-9820144891',
        burnerCarrier: 'Airtel Mumbai (Sector 12 Cell Tower)'
      },
      financial: {
        aggregateVolume: '₹14.2 Crore Layered',
        primaryBank: 'HDFC Bank, Fort Branch (A/C 50200091823)',
        offshoreChannels: 'Al-Noor Exchange (Dubai Dhow Pool)',
        taxStatus: 'Prosecution under Sec 132/135 Customs Act'
      },
      legalSections: [
        'Sec 120B IPC (Criminal Conspiracy)',
        'Sec 420 IPC (Cheating & Dishonest Inducement)',
        'Sec 135 Customs Act 1962 (Smuggling)',
        'Sec 3 & 4 PMLA 2002 (Money Laundering)'
      ],
      metrics: {
        centrality: '0.96 (Syndicate Epicenter)',
        volume: '₹14.2 Cr',
        flightRisk: 'EXTREME (LOC Active)',
        evidentiaryRigor: '100% SHA-256 Anchored'
      },
      timeline: [
        { time: '2026-09-14 18:45', event: 'CDR Intercept: 142s encrypted call with Tariq Merchant (Dubai broker)', icon: Phone, severity: 'HIGH' },
        { time: '2026-09-13 14:10', event: 'Financial: Authorized ₹1.85 Cr RTGS from HDFC A/C to Oceanic Freight front', icon: CreditCard, severity: 'HIGH' },
        { time: '2026-09-12 03:22', event: 'ANPR Toll Scan: Transport MH-04-AZ-9921 departed Nhava Sheva Terminal gate 3', icon: Truck, severity: 'MEDIUM' },
        { time: '2026-09-10 21:00', event: 'Field Surveillance: Physical meeting at Dongri safehouse with Farooq', icon: User, severity: 'HIGH' },
        { time: '2026-09-08 11:30', event: 'Immigration Bureau: Flagged attempting departure via Mumbai T2; LOC enforced', icon: AlertOctagon, severity: 'CRITICAL' }
      ],
      associates: [
        { id: 'person-farooq', name: 'Farooq (Financial Broker)', role: 'Syndicate Treasurer', relation: 'Hawala Conduit', threat: 'CRITICAL 92%', type: 'PERSON' },
        { id: 'person-2', name: 'Tariq Merchant', role: 'Dubai Hawala Agent', relation: 'Offshore Clearing', threat: 'HIGH 81%', type: 'PERSON' },
        { id: 'org-1', name: 'Oceanic Freight Logistics Ltd', role: 'Front Logistics Entity', relation: 'Managing Director & Signatory', threat: 'HIGH 88%', type: 'ORGANIZATION' },
        { id: 'account-1', name: 'HDFC A/C 50200091823', role: 'Layering Current A/C', relation: 'Authorized Corporate Signatory', threat: 'HIGH 82%', type: 'ACCOUNT' },
        { id: 'vehicle-1', name: 'MH-04-AZ-9921 (Tata Prima)', role: 'Contraband Transport', relation: 'Fleet Asset', threat: 'MEDIUM 60%', type: 'VEHICLE' }
      ],
      exhibits: [
        { name: 'CDR_Interception_Log_Mumbai_Jan2026.csv', size: '1.4 MB', hash: '8f92a1c0d481bb209e51c890f12a4b89c7d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5', height: 1, type: 'Call Detail Record' },
        { name: 'RTGS_Hawala_Transfer_Records_HDFC.xlsx', size: '2.8 MB', hash: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f', height: 2, type: 'Financial Ledger' },
        { name: 'Seizure_FIR_Contraband_Nhava_Sheva.pdf', size: '4.1 MB', hash: '5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b', height: 3, type: 'FIR & Panchnama' }
      ]
    },
    {
      id: 'person-farooq',
      name: 'Farooq (Financial Broker)',
      type: 'PERSON',
      role: 'Hawala Financial Conduit & Cross-Case Bridge Node',
      risk: 'CRITICAL',
      score: 92,
      caseId: 'CASE-1024',
      isBridge: true,
      bridgeCases: ['CASE-1024', 'CASE-1021'],
      caseNumber: 'FIR-1024 & FIR-1021',
      caseTitle: 'Cross-Case Financial Backbone',
      uid: 'UID-MH-1024-F4',
      aliases: 'Farooq Seth / Chacha / Al-Noor Manager',
      phone: '+91 97690 11204',
      org: 'Apex Global Trading / Al-Noor Exchange',
      location: 'Dongri, South Mumbai',
      demographics: {
        age: '54 Yrs (DOB: 03-May-1971)',
        nationality: 'Indian Citizen',
        fatherName: 'Late Gulam Farooq',
        residence: 'Bismillah Manzil, 2nd Floor, Nishanpada Road, Dongri',
        passport: 'P-9021882 (Active watch at sea ports)',
        pan: 'AGF PF 8812 L'
      },
      comms: {
        imei: '359812049182310',
        imsi: '404200819234812',
        encryptedHandle: 'Telegram: @farooq_apex / Session Private ID',
        burnerCarrier: 'Vodafone Idea Mumbai (Tower MH-114)'
      },
      financial: {
        aggregateVolume: '₹22.7 Crore Synthesized',
        primaryBank: 'Hawala Nodal Houses / Cash Settlement Desks',
        offshoreChannels: 'Al-Noor Exchange Deira Dubai (Cash Tokens)',
        taxStatus: 'Directorate of Enforcement (ED) Attachment Pending'
      },
      legalSections: [
        'Sec 120B IPC (Conspiracy)',
        'Sec 3 & 4 PMLA 2002 (Hawala Operations)',
        'Sec 66D IT Act (Cyber Extortion Conduit)',
        'Sec 467 & 471 IPC (Forged Invoices)'
      ],
      metrics: {
        centrality: '0.94 (Multi-Case Bridge)',
        volume: '₹22.7 Cr',
        flightRisk: 'CRITICAL (Offshore Links)',
        evidentiaryRigor: '100% SHA-256 Anchored'
      },
      timeline: [
        { time: '2026-09-14 20:15', event: 'Cross-Case Transfer: Dispersed ₹45 Lakh ransomware proceeds from CASE-1021 to maritime logistics pool', icon: GitMerge, severity: 'CRITICAL' },
        { time: '2026-09-13 11:00', event: 'Hawala Chit Handover: Delivered encrypted numerical paper token at Dongri safehouse', icon: Lock, severity: 'HIGH' },
        { time: '2026-09-11 15:45', event: 'Voice Tap: 210s call logged discussing encrypted escrow release with Vikram Malhotra', icon: Phone, severity: 'HIGH' },
        { time: '2026-09-09 17:20', event: 'Bank Alert: 4 structured cash deposits under ₹50,000 within 2 hours in null accounts', icon: CreditCard, severity: 'MEDIUM' }
      ],
      associates: [
        { id: 'person-1', name: 'Rajesh Kumar', role: 'Smuggling Ringleader', relation: 'Logistics Partner', threat: 'CRITICAL 94%', type: 'PERSON' },
        { id: 'person-ransom-1', name: 'Vikram Malhotra', role: 'Ransomware Dev (CASE-1021)', relation: 'Extortion Laundering Conduit', threat: 'CRITICAL 95%', type: 'PERSON' },
        { id: 'person-2', name: 'Tariq Merchant', role: 'Offshore Broker (Dubai)', relation: 'Hawala Counterpart', threat: 'HIGH 81%', type: 'PERSON' },
        { id: 'account-1', name: 'HDFC A/C 50200091823', role: 'Layering Account', relation: 'Fund Beneficiary', threat: 'HIGH 82%', type: 'ACCOUNT' }
      ],
      exhibits: [
        { name: 'Hawala_Ledger_Chits_Dongri_Raid.pdf', size: '3.2 MB', hash: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d', height: 4, type: 'Seizure Panchnama' },
        { name: 'RTGS_Hawala_Transfer_Records_HDFC.xlsx', size: '2.8 MB', hash: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f', height: 2, type: 'Financial Ledger' }
      ]
    },
    {
      id: 'person-2',
      name: 'Tariq Merchant',
      type: 'PERSON',
      role: 'Offshore Hawala Clearing Agent',
      risk: 'HIGH',
      score: 81,
      caseId: 'CASE-1024',
      caseNumber: 'FIR-2026-MUM-1024',
      caseTitle: 'Maritime Hawala & Contraband',
      uid: 'UID-MH-1024-TM',
      aliases: 'Merchant / Goldie / Tariq Bhai',
      phone: '+971 50 882 1943',
      org: 'Apex Global Trading (FZE, Dubai)',
      location: 'Deira, Dubai / Fort, Mumbai',
      demographics: {
        age: '42 Yrs',
        nationality: 'Indian (NRI / UAE Resident)',
        fatherName: 'Bashir Merchant',
        residence: 'Al Barsha 1, Dubai / Marine Lines, Mumbai',
        passport: 'R-7721904',
        pan: 'BPM PM 7721 M'
      },
      comms: {
        imei: '354201982736192',
        imsi: '424021982301928',
        encryptedHandle: 'WhatsApp Business / Threema',
        burnerCarrier: 'Etisalat UAE / Roaming'
      },
      financial: {
        aggregateVolume: 'AED 6.8 Million (₹15.3 Cr)',
        primaryBank: 'Emirates NBD / Apex FZE Corporate A/C',
        offshoreChannels: 'Gold Souk Bullion Settlement',
        taxStatus: 'Non-compliant under FEMA'
      },
      legalSections: [
        'Sec 120B IPC',
        'Sec 135 Customs Act',
        'FEMA Sec 3 / 4'
      ],
      metrics: {
        centrality: '0.81 (Offshore Hub)',
        volume: '₹15.3 Cr',
        flightRisk: 'HIGH (Resides in UAE)',
        evidentiaryRigor: '100% SHA-256 Anchored'
      },
      timeline: [
        { time: '2026-09-14 18:45', event: 'Intercept: Received 142s call from Rajesh Kumar regarding customs clearance', icon: Phone, severity: 'HIGH' },
        { time: '2026-09-11 12:00', event: 'Financial: Transferred $120,000 USD via dhow trade invoice settlement', icon: CreditCard, severity: 'HIGH' }
      ],
      associates: [
        { id: 'person-1', name: 'Rajesh Kumar', role: 'Syndicate Head', relation: 'Domestic Buyer', threat: 'CRITICAL 94%', type: 'PERSON' },
        { id: 'person-farooq', name: 'Farooq (Financial Broker)', role: 'Domestic Treasurer', relation: 'Hawala Settlement', threat: 'CRITICAL 92%', type: 'PERSON' }
      ],
      exhibits: [
        { name: 'Dubai_Export_Manifest_Apex_Trading.pdf', size: '2.1 MB', hash: '6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c', height: 5, type: 'Customs Manifest' }
      ]
    },
    {
      id: 'person-ransom-1',
      name: 'Vikram "Cipher" Malhotra',
      type: 'PERSON',
      role: 'Ransomware Developer & Extortion Operator',
      risk: 'CRITICAL',
      score: 95,
      caseId: 'CASE-1021',
      caseNumber: 'FIR-2026-MUM-1021',
      caseTitle: 'Automated Ransomware Syndicate',
      uid: 'UID-MH-1021-VM',
      aliases: '0xGhost / V-Mal / Cryptor',
      phone: '+91 91370 88219',
      org: 'ShadowGrid Cyber Threat Actor Group',
      location: 'Bandra Kurla Complex, Mumbai',
      demographics: {
        age: '32 Yrs',
        nationality: 'Indian Citizen',
        fatherName: 'Sunil Malhotra',
        residence: 'Tower 4, Kalpataru Solitaire, BKC, Mumbai',
        passport: 'T-1192834 (Flagged with Interpol)',
        pan: 'BKP PM 4401 X'
      },
      comms: {
        imei: '861092834719283',
        imsi: '404110928374612',
        encryptedHandle: 'Tox ID / Matrix / Session: 05a8f...c9',
        burnerCarrier: 'Jio 5G Private APN'
      },
      financial: {
        aggregateVolume: '48.5 BTC (~₹28.4 Cr)',
        primaryBank: 'Tornado Cash / Wasabi CoinJoin Mixer Pool',
        offshoreChannels: 'Farooq Cash Settlement Desk Dongri',
        taxStatus: 'Cryptocurrency PMLA Violation'
      },
      legalSections: [
        'Sec 66, 66C, 66D Information Technology Act 2000',
        'Sec 384 IPC (Extortion)',
        'Sec 420 IPC (Cheating)',
        'Sec 120B IPC (Conspiracy)'
      ],
      metrics: {
        centrality: '0.95 (Core Threat Actor)',
        volume: '48.5 BTC',
        flightRisk: 'CRITICAL (Darknet Operator)',
        evidentiaryRigor: '100% SHA-256 Anchored'
      },
      timeline: [
        { time: '2026-09-14 20:15', event: 'Crypto Wash: Deposited 4.2 BTC into Farooq Hawala nexus for INR liquidation', icon: GitMerge, severity: 'CRITICAL' },
        { time: '2026-09-14 02:40', event: 'Compile Event: Malware payload beaconed to C2 server at 185.220.101.4', icon: Activity, severity: 'HIGH' }
      ],
      associates: [
        { id: 'person-farooq', name: 'Farooq (Financial Broker)', role: 'Cash Out Specialist', relation: 'Crypto-to-Cash Conduit', threat: 'CRITICAL 92%', type: 'PERSON' }
      ],
      exhibits: [
        { name: 'Ransomware_Binary_Disassembly_Report.pdf', size: '5.6 MB', hash: '4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e', height: 6, type: 'Binary Forensic Report' }
      ]
    },
    {
      id: 'person-narc-1',
      name: 'Bilal Qureshi',
      type: 'PERSON',
      role: 'Synthetic Narcotics Distribution Head',
      risk: 'HIGH',
      score: 87,
      caseId: 'CASE-1018',
      caseNumber: 'FIR-2026-MUM-1018',
      caseTitle: 'Synthetic Narcotics Distribution',
      uid: 'UID-MH-1018-BQ',
      aliases: 'Bilal Chikna / Chemical Bhai',
      phone: '+91 98920 33118',
      org: 'Apex Pharma Distribution Shell',
      location: 'Kurla West, Mumbai',
      demographics: {
        age: '39 Yrs',
        nationality: 'Indian Citizen',
        fatherName: 'Late Nasir Qureshi',
        residence: 'Plot 41, Pipeline Road, Kurla West',
        passport: 'K-9901823',
        pan: 'CQZ PQ 1109 B'
      },
      comms: {
        imei: '351982736192837',
        imsi: '404091827364519',
        encryptedHandle: 'Signal: Private Burner',
        burnerCarrier: 'Vi prepaid unregistered'
      },
      financial: {
        aggregateVolume: '₹6.3 Crore',
        primaryBank: 'HDFC Bank Fort (A/C 50200091823 Shared Layering)',
        offshoreChannels: 'Chemical Precursor Import Lines',
        taxStatus: 'NDPS Act Asset Attachment'
      },
      legalSections: [
        'Sec 8(c), 21, 22, 29 NDPS Act 1985',
        'Sec 120B IPC'
      ],
      metrics: {
        centrality: '0.87 (Cartel Distributor)',
        volume: '₹6.3 Cr',
        flightRisk: 'HIGH (Repeat Offender)',
        evidentiaryRigor: '100% SHA-256 Anchored'
      },
      timeline: [
        { time: '2026-09-12 16:30', event: 'Fund Movement: Received ₹42 Lakh from HDFC account for precursor chemicals', icon: CreditCard, severity: 'HIGH' }
      ],
      associates: [
        { id: 'account-1', name: 'HDFC A/C 50200091823', role: 'Shared Account', relation: 'Dispersal Channel', threat: 'HIGH 82%', type: 'ACCOUNT' }
      ],
      exhibits: [
        { name: 'FSL_Chemical_Analysis_Report_Mephedrone.pdf', size: '1.9 MB', hash: '9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', height: 7, type: 'Forensic Lab Analysis' }
      ]
    },
    {
      id: 'org-1',
      name: 'Oceanic Freight Logistics Ltd',
      type: 'ORGANIZATION',
      role: 'Shell Front Company & Container Freight Conduits',
      risk: 'HIGH',
      score: 88,
      caseId: 'CASE-1024',
      caseNumber: 'FIR-2026-MUM-1024',
      caseTitle: 'Maritime Hawala & Contraband Network',
      uid: 'CIN-U63090MH2019PTC1092',
      aliases: 'Oceanic Logistics / OFL India',
      phone: '022-27891022',
      org: 'Registered ROC Mumbai (Nhava Sheva SEZ)',
      location: 'JNPT Freight Gateway, Dronagiri, Navi Mumbai',
      demographics: {
        age: 'Incorporated 2019 (7 Yrs)',
        nationality: 'Indian Entity (ROC Mumbai)',
        fatherName: 'Directors: Rajesh Kumar & Tariq Merchant',
        residence: 'Office 304, Logistic Park, Dronagiri, Navi Mumbai',
        passport: 'GSTIN: 27AABCO9182K1Z5',
        pan: 'AAB CO 9182 K'
      },
      comms: {
        imei: 'IP PBX: 022-27891022',
        imsi: 'Corporate Lease Line',
        encryptedHandle: 'Corporate Mail: info@oceanicfreight.in',
        burnerCarrier: 'Tata Communications'
      },
      financial: {
        aggregateVolume: '₹34.8 Crore Declared Turnover',
        primaryBank: 'HDFC Bank, Fort (A/C 50200091823)',
        offshoreChannels: 'Customs Drawback & Trade Misinvoicing',
        taxStatus: 'ROC Strike-Off Notice / Bank Accounts Frozen'
      },
      legalSections: ['Sec 420, 468, 471 IPC', 'Sec 135 Customs Act', 'Companies Act 2013 Sec 447'],
      metrics: {
        centrality: '0.88 (Corporate Shell)',
        volume: '₹34.8 Cr',
        flightRisk: 'N/A (Entity Frozen)',
        evidentiaryRigor: '100% SHA-256 Anchored'
      },
      timeline: [
        { time: '2026-09-13 14:10', event: 'Wire Received: ₹1.85 Cr RTGS incoming into HDFC account', icon: CreditCard, severity: 'HIGH' }
      ],
      associates: [
        { id: 'person-1', name: 'Rajesh Kumar', role: 'Director', relation: 'Beneficial Owner', threat: 'CRITICAL 94%', type: 'PERSON' },
        { id: 'account-1', name: 'HDFC A/C 50200091823', role: 'Corporate A/C', relation: 'Operating Banking Node', threat: 'HIGH 82%', type: 'ACCOUNT' }
      ],
      exhibits: [
        { name: 'ROC_Incorporation_Filings_Oceanic.pdf', size: '3.8 MB', hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b', height: 8, type: 'Corporate Registrar Record' }
      ]
    },
    {
      id: 'account-1',
      name: 'HDFC A/C 50200091823',
      type: 'ACCOUNT',
      role: 'Primary Layering Account & Multi-Docket Clearing Channel',
      risk: 'HIGH',
      score: 82,
      caseId: 'CASE-1024',
      isBridge: true,
      bridgeCases: ['CASE-1024', 'CASE-1018'],
      caseNumber: 'FIR-1024 & FIR-1018',
      caseTitle: 'Shared Banking Pipeline',
      uid: 'IFSC-HDFC0000060-50200091823',
      aliases: 'Oceanic Freight Current Account',
      phone: 'IFSC: HDFC0000060 (Fort)',
      org: 'HDFC Bank Corporate Banking, Mumbai',
      location: 'Nanik Motwani Marg, Fort, Mumbai',
      demographics: {
        age: 'Opened Aug 2020',
        nationality: 'Commercial Account',
        fatherName: 'Authorized Signatory: Rajesh Kumar',
        residence: 'Branch Manager Desk, Fort HDFC',
        passport: 'CIN: U63090MH2019PTC1092',
        pan: 'AAB CO 9182 K'
      },
      comms: {
        imei: 'NetBanking Registered IP: 103.21.144.9',
        imsi: 'OTP Mobile: +91 98201 44891',
        encryptedHandle: 'Corporate NetBanking Portal',
        burnerCarrier: 'HDFC Direct Banking Gateway'
      },
      financial: {
        aggregateVolume: '₹18.9 Crore (Credits & Debits)',
        primaryBank: 'HDFC Bank Fort Branch',
        offshoreChannels: 'Layered Outward RTGS & Precursor Settlements',
        taxStatus: 'Debit Freeze Order under Sec 102 CrPC'
      },
      legalSections: ['Sec 102 CrPC (Police Seizure of Property)', 'PMLA Sec 17 (Freezing of Records)'],
      metrics: {
        centrality: '0.82 (Financial Node)',
        volume: '₹18.9 Cr',
        flightRisk: 'FROZEN (Sec 102)',
        evidentiaryRigor: '100% SHA-256 Anchored'
      },
      timeline: [
        { time: '2026-09-13 14:10', event: 'Debit: ₹1.85 Cr RTGS to shell logistics accounts', icon: CreditCard, severity: 'HIGH' },
        { time: '2026-09-12 16:30', event: 'Credit: ₹42 Lakh routed into CASE-1018 narcotics procurement', icon: GitMerge, severity: 'CRITICAL' }
      ],
      associates: [
        { id: 'person-1', name: 'Rajesh Kumar', role: 'Signatory', relation: 'Signing Authority', threat: 'CRITICAL 94%', type: 'PERSON' },
        { id: 'person-narc-1', name: 'Bilal Qureshi', role: 'Beneficiary', relation: 'Precursor Fund Transferee', threat: 'HIGH 87%', type: 'PERSON' }
      ],
      exhibits: [
        { name: 'RTGS_Hawala_Transfer_Records_HDFC.xlsx', size: '2.8 MB', hash: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f', height: 2, type: 'Bank Statement' }
      ]
    },
    {
      id: 'phone-1',
      name: '+91 98201 44891 (Burner SIM)',
      type: 'PHONE',
      role: 'Operational Handset & Encrypted Dispatch Phone',
      risk: 'MEDIUM',
      score: 72,
      caseId: 'CASE-1024',
      caseNumber: 'FIR-2026-MUM-1024',
      caseTitle: 'Field Coordination Device',
      uid: 'IMEI-864209041238910',
      aliases: 'Burner 1 / Alpha Command Handset',
      phone: '+91 98201 44891',
      org: 'Airtel Mumbai (Forged KYC)',
      location: 'Cell Tower ID: MH-402 (Nhava Sheva Dock Sector 7)',
      demographics: {
        age: 'Activated: 12-Jan-2026',
        nationality: 'Aadhaar Forgery (UIDAI Reported)',
        fatherName: 'KYC Name: Ramesh Joshi (Impersonated)',
        residence: 'Tower Sector 7, JNPT Nhava Sheva',
        passport: 'N/A',
        pan: 'Forged Document Seized'
      },
      comms: {
        imei: '864209041238910 (OnePlus Nord CE 3)',
        imsi: '404450918234102',
        encryptedHandle: 'Signal, Threema, Telegram Installed',
        burnerCarrier: 'Bharti Airtel (Lawful Interception Active)'
      },
      financial: {
        aggregateVolume: 'Recharged via Cash Scratch Cards',
        primaryBank: 'N/A (Cash recharges)',
        offshoreChannels: 'Frequent International Roaming Packets',
        taxStatus: 'Exhibit Tag: EXHIBIT-CDR-01'
      },
      legalSections: ['Sec 468/471 IPC (Forgery of Valuable Security)', 'Sec 5(2) Indian Telegraph Act'],
      metrics: {
        centrality: '0.72 (Comms Asset)',
        volume: '342 Logged Calls',
        flightRisk: 'HANDSET TAPPED',
        evidentiaryRigor: '100% SHA-256 Anchored'
      },
      timeline: [
        { time: '2026-09-14 18:45', event: 'Lawful Intercept: 142s encrypted call recorded with Dubai VoIP gateway', icon: Phone, severity: 'HIGH' }
      ],
      associates: [
        { id: 'person-1', name: 'Rajesh Kumar', role: 'User', relation: 'Carrier / Physical Custody', threat: 'CRITICAL 94%', type: 'PERSON' }
      ],
      exhibits: [
        { name: 'CDR_Interception_Log_Mumbai_Jan2026.csv', size: '1.4 MB', hash: '8f92a1c0d481bb209e51c890f12a4b89c7d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5', height: 1, type: 'Call Detail Record' }
      ]
    },
    {
      id: 'vehicle-1',
      name: 'MH-04-AZ-9921 (Tata Prima)',
      type: 'VEHICLE',
      role: 'Heavy Commercial Transport & Contraband Carrier',
      risk: 'MEDIUM',
      score: 60,
      caseId: 'CASE-1024',
      caseNumber: 'FIR-2026-MUM-1024',
      caseTitle: 'Smuggling Logistics Fleet',
      uid: 'CHASSIS-MAT4928S1092',
      aliases: 'Prime Mover 9921 / Blue Tata Prima',
      phone: 'FASTag: 34161FA8902',
      org: 'Oceanic Freight Logistics Fleet Asset',
      location: 'Panvel Bypass Expressway Toll Plaza',
      demographics: {
        age: 'Model 2022 Tata Prima 4928.S',
        nationality: 'Registered RTO Thane (MH-04)',
        fatherName: 'Owner: Oceanic Freight Logistics Ltd',
        residence: 'Dock Depot 4, JNPT Dronagiri',
        passport: 'RC Book No: MH0420220019284',
        pan: 'Fleet Commercial Tax Paid'
      },
      comms: {
        imei: 'AIS-140 GPS Device: 869018239019283',
        imsi: '404019283718293',
        encryptedHandle: 'Telematics Server Port 5005',
        burnerCarrier: 'BSNL M2M Telematics'
      },
      financial: {
        aggregateVolume: 'Commercial Asset Value ₹42 Lakh',
        primaryBank: 'Financed via Cholamandalam Finance',
        offshoreChannels: 'Container Freight Misdeclaration',
        taxStatus: 'Impound Notice Circulated to NHAI Toll Plazas'
      },
      legalSections: ['Sec 115 Customs Act (Confiscation of Conveyances)', 'Sec 102 CrPC'],
      metrics: {
        centrality: '0.60 (Logistics Asset)',
        volume: '12 Freight Trips',
        flightRisk: 'IMPOUND NOTICE ACTIVE',
        evidentiaryRigor: '100% SHA-256 Anchored'
      },
      timeline: [
        { time: '2026-09-12 03:22', event: 'ANPR Toll Hit: Observed exiting Panvel Toll heading towards JNPT Terminal 2', icon: Truck, severity: 'MEDIUM' }
      ],
      associates: [
        { id: 'person-1', name: 'Rajesh Kumar', role: 'Operator', relation: 'Logistics Controller', threat: 'CRITICAL 94%', type: 'PERSON' },
        { id: 'org-1', name: 'Oceanic Freight Logistics Ltd', role: 'Registered Owner', relation: 'Fleet Asset', threat: 'HIGH 88%', type: 'ORGANIZATION' }
      ],
      exhibits: [
        { name: 'Seizure_FIR_Contraband_Nhava_Sheva.pdf', size: '4.1 MB', hash: '5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b', height: 3, type: 'Seizure Panchnama' }
      ]
    }
  ], []);

  // Filtered entities based on case, type, and search
  const filteredEntities = useMemo(() => {
    return entities.filter(e => {
      // Filter by case
      if (selectedCaseFilter !== 'ALL') {
        const matchesPrimary = e.caseId === selectedCaseFilter;
        const matchesBridge = e.bridgeCases && e.bridgeCases.includes(selectedCaseFilter);
        if (!matchesPrimary && !matchesBridge) return false;
      }

      // Filter by entity type
      if (typeFilter !== 'ALL' && e.type !== typeFilter) {
        return false;
      }

      // Filter by search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = (e.name || '').toLowerCase().includes(q);
        const matchRole = (e.role || '').toLowerCase().includes(q);
        const matchAliases = (e.aliases || '').toLowerCase().includes(q);
        const matchPhone = (e.phone || '').toLowerCase().includes(q);
        const matchUid = (e.uid || '').toLowerCase().includes(q);
        const matchOrg = (e.org || '').toLowerCase().includes(q);
        const matchLocation = (e.location || '').toLowerCase().includes(q);
        if (!matchName && !matchRole && !matchAliases && !matchPhone && !matchUid && !matchOrg && !matchLocation) {
          return false;
        }
      }

      return true;
    });
  }, [entities, selectedCaseFilter, typeFilter, search]);

  const active = entities.find(e => e.id === selectedEntityId) || filteredEntities[0] || entities[0];
  const activeNotes = notesMap[active.id] || [];
  const currentWarrantStatus = warrantStatusMap[active.id] || 'UNDER SURVEILLANCE';

  // Toggle legal warrant / LOC status
  const handleToggleWarrant = () => {
    const statuses = [
      'LOOKOUT CIRCULAR (LOC)',
      'ACTIVE ARREST WARRANT (SEC 73 CrPC)',
      'UNDER ACTIVE SURVEILLANCE',
      'RED CORNER NOTICE PENDING'
    ];
    const currentIndex = statuses.indexOf(currentWarrantStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    setWarrantStatusMap(prev => ({
      ...prev,
      [active.id]: nextStatus
    }));

    setToastMessage(`Legal status for ${active.name} updated to: ${nextStatus}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add a new field note
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newEntry = {
      id: Date.now(),
      author: user?.pno || 'IO-MH-7723',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      priority: newNotePriority,
      text: newNoteText.trim()
    };

    setNotesMap(prev => ({
      ...prev,
      [active.id]: [newEntry, ...(prev[active.id] || [])]
    }));

    setNewNoteText('');
    setToastMessage(`Field memo logged under ${active.uid} with officer signature.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Export Court Dossier
  const handleExportDossier = () => {
    setToastMessage(`Court Dossier for ${active.name} (${active.uid}) compiled with SHA-256 integrity seal.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Get Threat Badge Color
  const getThreatBadge = (risk) => {
    if (risk === 'CRITICAL') return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    if (risk === 'HIGH') return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'PERSON': return User;
      case 'ACCOUNT': return CreditCard;
      case 'PHONE': return Phone;
      case 'ORGANIZATION': return Building;
      case 'VEHICLE': return Truck;
      default: return Shield;
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-5">
      {/* ---------------------------------------------------------------------
          HEADER & STATUS BANNER
      --------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">Criminal Dossier & Suspect Profiler</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/25 font-bold">
              POLICE INTELLIGENCE DESK
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Forensic behavioral metrics, intercepted communications, syndicate hierarchy & chain of custody exhibits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Target Profiles: <b className="text-slate-200 font-mono">{filteredEntities.length} of {entities.length}</b></span>
          </div>
        </div>
      </div>

      {/* Floating Action Feedback Toast */}
      {toastMessage && (
        <div className="p-3 rounded-lg bg-slate-900/95 border border-blue-500/50 text-blue-300 text-xs flex items-center justify-between gap-3 shadow-2xl animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-200">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ---------------------------------------------------------------------
          MASTER-DETAIL WORKSTATION (TWO COLUMNS)
      --------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ===================================================================
            LEFT COLUMN: SUSPECT & TARGET DIRECTORY (~380px)
        =================================================================== */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl bg-[#0D1322] border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <SearchIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>Target Directory</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                {filteredEntities.length} Loaded
              </span>
            </div>

            {/* Case Filter Selector */}
            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Jurisdiction Docket Scope
              </label>
              <select
                value={selectedCaseFilter}
                onChange={(e) => setSelectedCaseFilter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="ALL">All Active Dockets (Full Enclave)</option>
                <option value="CASE-1024">FIR-1024 (Maritime Hawala)</option>
                <option value="CASE-1021">FIR-1021 (Ransomware Syndicate)</option>
                <option value="CASE-1018">FIR-1018 (Narcotics Cartel)</option>
              </select>
            </div>

            {/* Entity Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'PERSON', label: 'Persons' },
                { id: 'ACCOUNT', label: 'Accounts' },
                { id: 'PHONE', label: 'Burners' },
                { id: 'ORGANIZATION', label: 'Shell Orgs' },
                { id: 'VEHICLE', label: 'Vehicles' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTypeFilter(t.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    typeFilter === t.id
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <SearchIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by name, alias, phone, IMEI..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Target List Items */}
            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {filteredEntities.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No suspect profiles match the selected filters.
                </div>
              ) : (
                filteredEntities.map(e => {
                  const isSelected = e.id === active.id;
                  const IconComp = getTypeIcon(e.type);
                  const wStatus = warrantStatusMap[e.id] || 'UNDER SURVEILLANCE';

                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => {
                        setSelectedEntityId(e.id);
                        setActiveTab('PROFILE');
                      }}
                      className={`w-full p-3 rounded-lg border text-left transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-blue-600/10 border-blue-500/60 shadow-md ring-1 ring-blue-500/20'
                          : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                            isSelected ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                          }`}>
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                              <span>{e.name}</span>
                              {e.isBridge && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30">
                                  Bridge
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[190px]">
                              {e.aliases || e.role}
                            </div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${getThreatBadge(e.risk)}`}>
                          {e.score}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-800/60">
                        <span className="font-mono text-slate-400">{e.caseNumber}</span>
                        <span className="text-amber-400 font-medium truncate max-w-[140px]">{wStatus}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ===================================================================
            RIGHT COLUMN: COMPREHENSIVE FORENSIC DOSSIER WORKSTATION (~800px)
        =================================================================== */}
        <div className="lg:col-span-8 space-y-5">
          {/* 1. Dossier Hero Header Card */}
          <div className="p-6 rounded-xl bg-[#0D1322] border border-slate-800 space-y-5 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-900/40 to-slate-900 border-2 border-blue-500/40 flex items-center justify-center text-xl font-bold text-blue-300 shadow-inner">
                    {active.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0D1322] ${
                    active.risk === 'CRITICAL' ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'
                  }`} />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-100">{active.name}</h2>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {active.type}
                    </span>
                    {active.isBridge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 flex items-center gap-1">
                        <GitMerge className="w-3 h-3" />
                        <span>CROSS-CASE BRIDGE NODE</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 font-medium">{active.role}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                    <span className="font-mono text-blue-400">{active.uid}</span>
                    <span>•</span>
                    <span>Docket: <b className="text-slate-200 font-mono">{active.caseNumber}</b></span>
                    <span>•</span>
                    <span className="text-slate-400">{active.location}</span>
                  </div>
                </div>
              </div>

              {/* Directive Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => go('/network')}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                  title="Explore this node and multi-hop relationships in network graph canvas"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Inspect in Graph</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleWarrant}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Cycle legal warrant / surveillance enforcement status"
                >
                  <Scale className="w-3.5 h-3.5 text-amber-400" />
                  <span>Status Action</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportDossier}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Compile court-admissible forensic summary packet"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Export Dossier</span>
                </button>
              </div>
            </div>

            {/* Threat & Financial Operational Metric Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Threat Centrality</span>
                <span className="text-xs font-bold text-rose-400 mt-1 block font-mono">
                  {active.metrics?.centrality || `${active.score}% Central`}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Financial Trace Volume</span>
                <span className="text-xs font-bold text-slate-200 mt-1 block font-mono">
                  {active.financial?.aggregateVolume || '₹14.2 Crore'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Legal Status</span>
                <span className="text-xs font-bold text-amber-400 mt-1 block truncate">
                  {currentWarrantStatus}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Evidentiary Rigor</span>
                <span className="text-xs font-bold text-emerald-400 mt-1 block font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Anchored</span>
                </span>
              </div>
            </div>
          </div>

          {/* 2. Interactive Dossier Tabs Bar */}
          <div className="flex border-b border-slate-800 bg-[#0D1322] rounded-t-xl px-4 pt-2 overflow-x-auto gap-2">
            {[
              { id: 'PROFILE', label: 'Profile & Identifiers', icon: User },
              { id: 'TIMELINE', label: 'Surveillance Chronology', icon: Calendar },
              { id: 'ASSOCIATES', label: `Syndicate Associates (${active.associates?.length || 0})`, icon: Share2 },
              { id: 'EXHIBITS', label: `Attached Exhibits (${active.exhibits?.length || 0})`, icon: FileText },
              { id: 'NOTES', label: `Field Notes (${activeNotes.length})`, icon: MessageSquare }
            ].map(tab => {
              const Icon = tab.icon;
              const isCurrent = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
                    isCurrent
                      ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 3. Tab Content Panes */}
          <div className="p-6 rounded-b-xl bg-[#0D1322] border-x border-b border-slate-800 shadow-xl space-y-6">
            {/* ---------------------------------------------------------------
                TAB 1: PROFILE & FORENSIC IDENTIFIERS
            --------------------------------------------------------------- */}
            {activeTab === 'PROFILE' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Demographic Details */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 pb-2 border-b border-slate-800">
                      <Fingerprint className="w-4 h-4 text-blue-400" />
                      <span>Demographics & Civil Identity</span>
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Full Legal Name:</span>
                        <span className="font-semibold text-slate-200">{active.name}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Known Aliases:</span>
                        <span className="font-medium text-slate-300">{active.aliases || 'None logged'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Age & Citizenship:</span>
                        <span className="text-slate-200">{active.demographics?.age} • {active.demographics?.nationality}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Passport / Travel ID:</span>
                        <span className="font-mono text-amber-300">{active.demographics?.passport || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Tax PAN / Corporate UID:</span>
                        <span className="font-mono text-slate-300">{active.demographics?.pan || active.uid}</span>
                      </div>
                    </div>
                  </div>

                  {/* Communications Footprint */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 pb-2 border-b border-slate-800">
                      <Radio className="w-4 h-4 text-emerald-400" />
                      <span>Communications & Electronic Footprint</span>
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Primary Contact:</span>
                        <span className="font-mono text-blue-400 font-semibold">{active.phone}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Handset IMEI:</span>
                        <span className="font-mono text-slate-200">{active.comms?.imei}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">SIM IMSI Tag:</span>
                        <span className="font-mono text-slate-300">{active.comms?.imsi}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Encrypted Handles:</span>
                        <span className="font-mono text-emerald-300">{active.comms?.encryptedHandle}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Carrier & Cell Tower:</span>
                        <span className="text-slate-300">{active.comms?.burnerCarrier}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Channels & Legal Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 pb-2 border-b border-slate-800">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>Financial Channels & Hawala Settlement</span>
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Aggregated Volume:</span>
                        <span className="font-mono font-bold text-slate-100">{active.financial?.aggregateVolume}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Primary Banking Node:</span>
                        <span className="font-mono text-slate-300">{active.financial?.primaryBank}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Offshore Clearing Conduits:</span>
                        <span className="text-slate-300">{active.financial?.offshoreChannels}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">PMLA / ED Status:</span>
                        <span className="text-amber-400 font-semibold">{active.financial?.taxStatus}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 pb-2 border-b border-slate-800">
                      <Scale className="w-4 h-4 text-indigo-400" />
                      <span>Statutory Penal Provisions</span>
                    </h3>
                    <div className="space-y-2">
                      {active.legalSections?.map((sec, idx) => (
                        <div key={idx} className="p-2 rounded bg-slate-800/70 border border-slate-700/60 text-xs flex items-center justify-between">
                          <span className="font-mono text-slate-200">{sec}</span>
                          <span className="text-[10px] font-bold text-amber-400 uppercase">Charged</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------
                TAB 2: SURVEILLANCE CHRONOLOGY (TIMELINE)
            --------------------------------------------------------------- */}
            {activeTab === 'TIMELINE' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Interception & Surveillance Chronology Log
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Chronological Order // Esplanade Format
                  </span>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {active.timeline?.map((item, idx) => {
                    const EvIcon = item.icon || Activity;
                    return (
                      <div key={idx} className="relative group">
                        {/* Dot on vertical line */}
                        <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-[#0D1322] flex items-center justify-center ${
                          item.severity === 'CRITICAL' ? 'bg-rose-500' : item.severity === 'HIGH' ? 'bg-amber-400' : 'bg-blue-500'
                        }`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>

                        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono text-blue-400 font-semibold">{item.time}</span>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                              item.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>
                              {item.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-200 leading-relaxed font-medium">
                            {item.event}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------
                TAB 3: SYNDICATE ASSOCIATES & HIERARCHY
            --------------------------------------------------------------- */}
            {activeTab === 'ASSOCIATES' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Linked Syndicate Conspirators & Conduits
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Click any associate card below to immediately pivot the dossier to that target.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                    {active.associates?.length || 0} LINKS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {active.associates?.map(assoc => {
                    const AssocIcon = getTypeIcon(assoc.type || 'PERSON');

                    return (
                      <button
                        key={assoc.id}
                        type="button"
                        onClick={() => {
                          setSelectedEntityId(assoc.id);
                          setActiveTab('PROFILE');
                        }}
                        className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 text-left transition-all cursor-pointer group space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-blue-600/20 text-slate-400 group-hover:text-blue-400 border border-slate-700 flex items-center justify-center transition-colors shrink-0">
                              <AssocIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
                                {assoc.name}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
                                {assoc.role}
                              </div>
                            </div>
                          </div>

                          <span className="text-[10px] font-mono text-amber-400 font-bold">
                            {assoc.threat}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800 text-slate-400">
                          <span>Relationship: <b className="text-slate-200">{assoc.relation}</b></span>
                          <span className="text-blue-400 group-hover:underline flex items-center gap-0.5 text-[10px]">
                            <span>Open Dossier</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------
                TAB 4: ATTACHED FORENSIC EXHIBITS
            --------------------------------------------------------------- */}
            {activeTab === 'EXHIBITS' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Cryptographically Verified Digital Exhibits
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Evidentiary chain of custody secured via SHA-256 blockchain proof.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    TAMPER PROOF
                  </span>
                </div>

                <div className="space-y-2">
                  {active.exhibits?.map((ex, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100">{ex.name}</div>
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            SHA-256: <span className="text-emerald-400">{ex.hash.slice(0, 24)}...</span> ({ex.size})
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          Block #{ex.height}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                          Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------
                TAB 5: INVESTIGATOR FIELD NOTES & MEMOS
            --------------------------------------------------------------- */}
            {activeTab === 'NOTES' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Investigator Observations & Case Memos
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Confidential field intelligence memos attributed to active duty officer PNO.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                    RESTRICTED ACCESS
                  </span>
                </div>

                {/* Form to add new note */}
                <form onSubmit={handleAddNote} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">Record New Field Observation</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Priority:</span>
                      <select
                        value={newNotePriority}
                        onChange={(e) => setNewNotePriority(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      >
                        <option value="ROUTINE">Routine Note</option>
                        <option value="HIGH">High Priority</option>
                        <option value="CRITICAL">Critical Alert</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setShowVoiceDictation(!showVoiceDictation)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                        showVoiceDictation
                          ? 'bg-blue-600/25 text-blue-300 border border-blue-500/40'
                          : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5 text-blue-400" />
                      <span>{showVoiceDictation ? 'Close Voice Dictation' : '🎙 Vernacular Voice Dictation (Hindi/Marathi/Regional)'}</span>
                    </button>
                    {showVoiceDictation && (
                      <span className="text-[10px] text-slate-400 font-mono">WebSpeech API + Pan-India Lexicon</span>
                    )}
                  </div>

                  {showVoiceDictation && (
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                      <div className="text-[11px] text-slate-400">
                        Speak or test field notes in Hindi, Marathi, Tamil, Bengali, or Gujarati. Speech is transcribed verbatim and auto-translated to legal English:
                      </div>
                      <MultilingualVoiceInput
                        placeholder="Type or dictate observation in Hindi/Marathi..."
                        onTranscribeComplete={({ original, translated, language }) => {
                          const snippet = `[VERBATIM (${language})]: ${original}\n[CERTIFIED TRANSLATION]: ${translated}`;
                          setNewNoteText(prev => prev ? `${prev}\n\n${snippet}` : snippet);
                        }}
                      />
                    </div>
                  )}

                  <textarea
                    rows={3}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder={`Type surveillance observation, wire tap note, or warrant execution detail regarding ${active.name}...`}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">
                      Signing Officer: <b className="text-slate-300">{user?.pno || 'IO-MH-7723'}</b>
                    </span>
                    <button
                      type="submit"
                      disabled={!newNoteText.trim()}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Log Observation Memo</span>
                    </button>
                  </div>
                </form>

                {/* Chronological notes listing */}
                <div className="space-y-3">
                  {activeNotes.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
                      No investigative memos recorded for this profile yet.
                    </div>
                  ) : (
                    activeNotes.map(n => (
                      <div key={n.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-blue-400 font-bold">{n.author}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-400 text-[11px] font-mono">{n.date}</span>
                          </div>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                            n.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : n.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {n.priority}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {n.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   EVIDENCE VAULT (NO SPLIT SCREEN!)
-------------------------------------------------------------------------- */
function EvidenceView({ activeCase = 'CASE-1024' }) {
  const { user, canIngestEvidence } = useAuthStore();
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: 'CDR_Interception_Log_Mumbai_Jan2026.csv', size: '1.4 MB', hash: '8f92a1c0d481bb209e51c890f12a4b89c7d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5', height: 1, date: '2026-09-14 10:15', category: 'Call Detail Record' },
    { id: 2, name: 'RTGS_Hawala_Transfer_Records_HDFC.xlsx', size: '2.8 MB', hash: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f', height: 2, date: '2026-09-14 11:30', category: 'Financial Transaction' },
    { id: 3, name: 'Seizure_FIR_Contraband_Nhava_Sheva.pdf', size: '4.1 MB', hash: '5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b', height: 3, date: '2026-09-14 14:02', category: 'First Information Report' }
  ]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caseId', activeCase);

    fetch('/api/evidence/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
      .then(r => r.json())
      .then(data => {
        if (data && data.evidence) {
          setUploadedFiles(prev => [
            {
              id: Date.now(),
              name: data.evidence.fileName,
              size: `${(data.evidence.fileSize / 1024).toFixed(1)} KB`,
              hash: data.evidence.sha256Hash,
              height: data.evidence.blockHeight,
              date: new Date().toLocaleString(),
              category: 'Digital Exhibit'
            },
            ...prev
          ]);
        }
        setUploading(false);
      })
      .catch(() => setUploading(false));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Digital Evidence Vault</h1>
          <p className="text-xs text-slate-400 mt-1">Tamper-evident exhibit vault and verified cryptographic chain of custody.</p>
        </div>
        <div className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono">
          Scoped Case: <b className="text-blue-400 font-semibold">{activeCase}</b>
        </div>
      </div>

      {/* Upload Box or Role-Restricted Warning */}
      {canIngestEvidence() ? (
        <div className="p-8 rounded-xl bg-[#111827] border border-dashed border-slate-700 text-center hover:border-blue-500 transition-colors">
          <Upload className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-200">Ingest Digital Evidence File</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Upload evidence documents, call data records, or transaction ledgers to register into the chain of custody for <b className="text-slate-200">{activeCase}</b>.
          </p>
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium cursor-pointer transition-colors">
            <span>{uploading ? 'Registering Exhibit...' : 'Select File to Ingest'}</span>
            <input type="file" onChange={handleFileUpload} disabled={uploading} className="hidden" />
          </label>
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-slate-900/80 border border-amber-500/30 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Exhibit Ingestion Restricted
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                Role Restricted
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Exhibit Ingestion Restricted: Investigating Officers have read-only access to exhibits. Uploading new evidence is managed by Cyber Forensics Analysts and Supervisors.
            </p>
            <p className="text-[11px] text-slate-500">
              Exhibits must undergo verification through the Cyber Forensics Unit before being added to the primary dossier.
            </p>
          </div>
        </div>
      )}

      {/* Exhibits Table (Full Width) */}
      <div className="rounded-xl bg-[#111827] border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Anchored Digital Exhibits</h3>
            <p className="text-xs text-slate-400 mt-0.5">Continuous cryptographic custody chain for {activeCase}</p>
          </div>
          <span className="text-xs text-emerald-400 font-medium">✓ Cryptographically Locked</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">Exhibit Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">SHA-256 Hash Digest</th>
                <th className="py-3 px-4">Block #</th>
                <th className="py-3 px-4">File Size</th>
                <th className="py-3 px-4 text-right">Integrity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {uploadedFiles.map(f => (
                <tr key={f.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{f.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{f.category}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 truncate max-w-xs" title={f.hash}>
                    {f.hash.slice(0, 28)}...
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-400">Block #{f.height}</td>
                  <td className="py-3.5 px-4 text-slate-400">{f.size}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                      VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   ALERTS VIEW
-------------------------------------------------------------------------- */
function AlertsView({ go }) {
  const alerts = [
    { id: 1, title: 'Hawala Funds Routing Anomaly', priority: 'HIGH', time: '12 mins ago', desc: 'Unusual rapid successive transfers of INR 14.2 Cr between HDFC A/C and offshore shell account.' },
    { id: 2, title: 'Burner SIM Tower Handoff Peak', priority: 'HIGH', time: '45 mins ago', desc: 'Handset associated with Rajesh Kumar logged 28 short calls near terminal gate.' },
    { id: 3, title: 'Transit ANPR Overlap Detected', priority: 'MEDIUM', time: '2 hours ago', desc: 'Transport truck MH-04-AZ-9921 arrived at bonded warehouse outside declared schedule.' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-100">Intelligence Alerts</h1>
        <p className="text-xs text-slate-400 mt-1">Real-time alerts triggered by graph pattern analysis and surveillance feeds.</p>
      </div>

      <div className="space-y-3">
        {alerts.map(a => (
          <div key={a.id} className="p-4 rounded-xl bg-[#111827] border border-slate-800 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  a.priority === 'HIGH' 
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' 
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}>
                  {a.priority}
                </span>
                <h3 className="text-xs font-semibold text-slate-100">{a.title}</h3>
                <span className="text-[11px] text-slate-500">• {a.time}</span>
              </div>
              <p className="text-xs text-slate-400">{a.desc}</p>
            </div>
            <button
              onClick={() => go('/network')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors shrink-0"
            >
              Investigate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   DOCUMENTATION & HELP VIEW
-------------------------------------------------------------------------- */
function HelpView() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-100">User & Investigation Guide</h1>
        <p className="text-xs text-slate-400 mt-1">Operational guidelines and investigative workflows for field and cyber officers.</p>
      </div>

      <div className="p-6 rounded-xl bg-[#111827] border border-slate-800 space-y-4 text-xs text-slate-300 leading-relaxed">
        <h3 className="text-sm font-semibold text-slate-100">Evidence Chain of Custody & Integrity</h3>
        <p>
          Nexus enforces an immutable, tamper-evident audit trail for all investigative artifacts. Every digital exhibit is cryptographically hashed with SHA-256 upon intake and linked directly to the investigator's docket.
        </p>
        <p>
          Court-admissible certificates can be generated directly from sealed case files with full chain of custody verification.
        </p>
      </div>

      <div className="p-6 rounded-xl bg-[#111827] border border-slate-800 space-y-3">
        <h3 className="text-sm font-semibold text-slate-100">Keyboard Shortcuts</h3>
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span>Search nodes</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">⌘ K</kbd>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span>Reset graph view</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">R</kbd>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span>Close drawer</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">ESC</kbd>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800">
            <span>Zoom In / Out</span>
            <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">+ / -</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   MAIN NEXUS APP SHELL
-------------------------------------------------------------------------- */
export default function NexusApp({ initialPage = '/dashboard' }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, initialize, isLoading } = useAuthStore();

  const [activeCase, setActiveCase] = useState('CASE-1024');
  const [cases, setCases] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [provisionOpen, setProvisionOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);

  // Cross-Case & Investigation Modal States
  const [createCaseOpen, setCreateCaseOpen] = useState(false);
  const [mergeModalCase, setMergeModalCase] = useState(null);
  const [addEvidenceCaseId, setAddEvidenceCaseId] = useState(null);
  const [synthesizedCases, setSynthesizedCases] = useState(null);

  // Micro-Feature Tactical Modals
  const [caseBriefingOpen, setCaseBriefingOpen] = useState(false);
  const [fieldModeOpen, setFieldModeOpen] = useState(false);
  const [playbooksOpen, setPlaybooksOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle bfcache (Back/Forward Cache) on browser navigation
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        initialize();
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [initialize]);

  // Route guard: immediately redirect to /login if unauthenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/cases', { credentials: 'include' })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.cases) {
            setCases(data.cases);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  // Navigate helper
  const go = (path) => {
    router.push(path);
  };

  const currentPath = pathname || initialPage;

  // Render security barrier while validating session
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090D16] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 animate-pulse">
          <Shield className="w-5 h-5" />
        </div>
        <div className="text-sm font-medium text-slate-300">Verifying Officer Session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenProvision={() => setProvisionOpen(true)}
        onOpenAudit={() => setAuditOpen(true)}
        onOpenBriefing={() => setCaseBriefingOpen(true)}
        onOpenFieldMode={() => setFieldModeOpen(true)}
        onOpenPlaybooks={() => setPlaybooksOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onMenu={() => setMobileOpen(true)}
          activeCase={activeCase}
          setActiveCase={setActiveCase}
          cases={cases}
          onOpenBriefing={() => setCaseBriefingOpen(true)}
          onOpenFieldMode={() => setFieldModeOpen(true)}
          onOpenPlaybooks={() => setPlaybooksOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          {currentPath === '/dashboard' && (
            <DashboardView
              go={go}
              activeCase={activeCase}
              setActiveCase={setActiveCase}
              cases={cases}
              onOpenCreateCase={() => setCreateCaseOpen(true)}
              onOpenMergeModal={(targetCase) => setMergeModalCase(targetCase)}
              onOpenAddEvidence={(targetCaseId) => setAddEvidenceCaseId(targetCaseId || activeCase)}
              onLaunchSynthesizedGraph={(caseIds) => {
                setSynthesizedCases(caseIds);
                go('/network');
              }}
              onOpenBriefing={() => setCaseBriefingOpen(true)}
              onOpenFieldMode={() => setFieldModeOpen(true)}
              onOpenPlaybooks={() => setPlaybooksOpen(true)}
            />
          )}
          {currentPath === '/network' && (
            <div className="p-6 max-w-[1600px] mx-auto">
              <div className="mb-4">
                <h1 className="text-xl font-semibold text-slate-100">Criminal Network Explorer</h1>
                <p className="text-xs text-slate-400 mt-1">Interactive syndicate topology powered by Neo4j and centrality analytics.</p>
              </div>
              <NetworkGraph
                caseId={activeCase}
                synthesizedCases={synthesizedCases}
                onExitSynthesized={() => setSynthesizedCases(null)}
                onLaunchMergedGraph={(caseIds) => setSynthesizedCases(caseIds)}
                onCaseChange={(newCaseId) => {
                  setActiveCase(newCaseId);
                  setSynthesizedCases(null);
                }}
                onOpenEvidence={() => go('/data')}
              />
            </div>
          )}
          {currentPath === '/investigate' && (
            <InvestigateView 
              go={go} 
              activeCase={activeCase} 
              setActiveCase={setActiveCase} 
              cases={cases} 
            />
          )}
          {currentPath === '/data' && <EvidenceView activeCase={activeCase} />}
          {currentPath === '/alerts' && <AlertsView go={go} />}
          {currentPath === '/help' && <HelpView />}
        </main>
      </div>

      {/* Administration Modals */}
      {provisionOpen && <ProvisionOfficerModal onClose={() => setProvisionOpen(false)} />}
      {auditOpen && <AuditLedgerModal onClose={() => setAuditOpen(false)} />}

      {/* Police Intelligence & Case Modals */}
      {createCaseOpen && (
        <CreateCaseModal
          onClose={() => setCreateCaseOpen(false)}
          onCaseCreated={(newCase) => {
            setCases(prev => [newCase, ...prev]);
            setActiveCase(newCase.id);
          }}
        />
      )}

      {mergeModalCase && (
        <MergeCaseModal
          primaryCase={mergeModalCase}
          cases={cases}
          onClose={() => setMergeModalCase(null)}
          onLaunchMergedGraph={(selectedCases) => {
            setSynthesizedCases(selectedCases);
            setMergeModalCase(null);
            go('/network');
          }}
        />
      )}

      {addEvidenceCaseId && (
        <AddEvidenceModal
          targetCaseId={addEvidenceCaseId}
          cases={cases}
          onClose={() => setAddEvidenceCaseId(null)}
          onEvidenceUploaded={(newEvidence) => {
            setCases(prev => prev.map(c => 
              c.id === addEvidenceCaseId 
                ? { ...c, evidenceCount: (c.evidenceCount || 0) + 1 }
                : c
            ));
          }}
        />
      )}

      {/* One-Click Certified Case Briefing Modal */}
      {caseBriefingOpen && (
        <CaseBriefingModal
          caseId={activeCase}
          cases={cases}
          onClose={() => setCaseBriefingOpen(false)}
        />
      )}

      {/* Mobile-Friendly Offline Field Operations Desk */}
      {fieldModeOpen && (
        <FieldModeModal
          caseId={activeCase}
          cases={cases}
          onClose={() => setFieldModeOpen(false)}
        />
      )}

      {/* Standard Operating Procedure (SOP) Investigation Playbooks */}
      {playbooksOpen && (
        <InvestigationPlaybooksModal
          caseId={activeCase}
          cases={cases}
          onClose={() => setPlaybooksOpen(false)}
          onNavigate={(targetPath) => {
            setPlaybooksOpen(false);
            go(targetPath);
          }}
        />
      )}
    </div>
  );
}
