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
  Building, Phone, MapPin, Truck, CreditCard, User
} from 'lucide-react';

import { useAuthStore } from '@/lib/auth-store';
import NetworkGraph from './network-graph';
import BlockchainShield from './blockchain-shield';
import ProvisionOfficerModal from './provision-officer-modal';
import AuditLedgerModal from './audit-ledger-modal';

const PAGE_TITLES = {
  '/dashboard': 'Investigation Dashboard',
  '/network': 'Criminal Network Explorer',
  '/investigate': 'Suspect Dossier Explorer',
  '/data': 'Digital Evidence Vault',
  '/alerts': 'Intelligence Alerts',
  '/help': 'Field Guide & Section 63 BSA'
};

/* --------------------------------------------------------------------------
   SIDEBAR
-------------------------------------------------------------------------- */
function Sidebar({ mobileOpen, setMobileOpen, onOpenProvision, onOpenAudit }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, canProvisionOfficer, canViewAudit, logout } = useAuthStore();
  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'PO';

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
    router.push('/login');
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
                <div className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Officer'}</div>
                <div className="text-[10px] text-slate-500 font-mono truncate">{user?.pno || 'OFFICER'}</div>
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
function Topbar({ onMenu }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const roleName = user?.role === 'SUPERVISOR_SP' ? 'Supervisor SP' 
    : user?.role === 'CYBER_ANALYST' ? 'Cyber Analyst' 
    : 'Investigating Officer';

  return (
    <header className="h-16 px-6 bg-[#0B0F19] border-b border-slate-800/80 flex items-center justify-between gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenu} 
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-semibold text-slate-100">{PAGE_TITLES[pathname] || 'Workspace'}</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span className="font-medium text-slate-300">{roleName}</span>
          <span className="text-slate-500 text-[10px]">({user?.clearanceLevel || 'LEVEL_2'})</span>
        </div>

        <button
          onClick={async () => {
            await logout();
            router.push('/login');
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
   DASHBOARD VIEW (NO SPLIT SCREEN!)
-------------------------------------------------------------------------- */
function DashboardView({ go }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cases', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.cases) setCases(data.cases);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Criminal Network Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">Cross-jurisdictional intelligence and immutable evidence chain of custody.</p>
        </div>
        <button
          onClick={() => go('/network')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg flex items-center gap-2 transition-colors cursor-pointer w-fit"
        >
          <Share2 className="w-4 h-4" />
          <span>Launch Network Explorer</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#111827] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Active Cases</span>
            <FolderOpen className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-semibold text-slate-100">{cases.length || 3}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium">All active under jurisdiction</div>
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Tracked Entities</span>
            <User className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-semibold text-slate-100">18</div>
          <div className="text-[11px] text-slate-400 mt-1">Suspects, phones & accounts</div>
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Blockchain Exhibits</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-semibold text-slate-100">6</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium">100% Tamper-Free Verified</div>
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Key Ringleaders</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-semibold text-slate-100">2</div>
          <div className="text-[11px] text-amber-400 mt-1 font-medium">High centrality index</div>
        </div>
      </div>

      {/* Reactive Blockchain Shield */}
      <BlockchainShield caseId="CASE-1024" />

      {/* Investigations Table (Full Width) */}
      <div className="rounded-xl bg-[#111827] border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Active Investigation Dossiers</h3>
            <p className="text-xs text-slate-400 mt-0.5">Assigned criminal syndicates and custody records</p>
          </div>
          <button
            onClick={() => go('/network')}
            className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>Network View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Investigation Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Suspects</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(cases.length > 0 ? cases : [
                { id: 'CASE-1024', caseNumber: 'FIR-2026-MUM-1024', title: 'Maritime Hawala & Contraband Network', category: 'Syndicate Smuggling', suspectCount: 6, status: 'ACTIVE', isSealed: false },
                { id: 'CASE-1021', caseNumber: 'FIR-2026-MUM-1021', title: 'Automated Ransomware Syndicate', category: 'Cyber Extortion', suspectCount: 4, status: 'SEALED', isSealed: true },
                { id: 'CASE-1018', caseNumber: 'FIR-2026-MUM-1018', title: 'Synthetic Narcotics Distribution', category: 'Narcotics Cartel', suspectCount: 5, status: 'ACTIVE', isSealed: false }
              ]).map(c => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-blue-400">{c.caseNumber || c.id}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-100">{c.title}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-medium">
                      {c.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">{c.suspectCount || 6} linked nodes</td>
                  <td className="py-3.5 px-4">
                    {c.isSealed ? (
                      <span className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Sealed (BSA-63)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Active Investigation
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => go('/network')}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    >
                      Explore Graph
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Intelligence & Pattern Insights (Grid Below Table, No Awkward Split Screen!) */}
      <div>
        <h3 className="text-sm font-semibold text-slate-100 mb-3">Detected Syndicate Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
                HIGH SEVERITY
              </span>
              <span className="text-[11px] text-slate-500 font-medium">94% confidence</span>
            </div>
            <h4 className="text-xs font-semibold text-slate-100">Layered Hawala Settlement Channel</h4>
            <p className="text-xs text-slate-400 line-clamp-2">
              Multi-jurisdictional funds transfer path detected between offshore entity and domestic accounts.
            </p>
            <button onClick={() => go('/network')} className="text-xs font-medium text-blue-400 hover:text-blue-300 pt-1 flex items-center gap-1">
              <span>View in Graph</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                MEDIUM SEVERITY
              </span>
              <span className="text-[11px] text-slate-500 font-medium">89% confidence</span>
            </div>
            <h4 className="text-xs font-semibold text-slate-100">Burner Phone Cell Tower Cluster</h4>
            <p className="text-xs text-slate-400 line-clamp-2">
              Repeated co-location of burner SIM cards near Nhava Sheva coastal dock boundaries.
            </p>
            <button onClick={() => go('/network')} className="text-xs font-medium text-blue-400 hover:text-blue-300 pt-1 flex items-center gap-1">
              <span>View in Graph</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                ANALYTICS
              </span>
              <span className="text-[11px] text-slate-500 font-medium">84% confidence</span>
            </div>
            <h4 className="text-xs font-semibold text-slate-100">Transit Vehicle ANPR Overlap</h4>
            <p className="text-xs text-slate-400 line-clamp-2">
              Commercial transport MH-04-AZ-9921 observed moving freight between Panvel and port terminal.
            </p>
            <button onClick={() => go('/network')} className="text-xs font-medium text-blue-400 hover:text-blue-300 pt-1 flex items-center gap-1">
              <span>View in Graph</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   INVESTIGATE VIEW (CLEAN DOSSIER, NO SPLIT SCREEN!)
-------------------------------------------------------------------------- */
function InvestigateView({ go }) {
  const [search, setSearch] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('person-1');

  const entities = [
    { id: 'person-farooq', name: 'Farooq (Financial Broker)', type: 'PERSON', role: 'Hawala Financial Conduit & Broker', risk: 'HIGH', score: 89, phone: '+91 97690 11204', org: 'Apex Global Trading', location: 'Dongri, Mumbai', aliases: 'Farooq Seth / Chacha' },
    { id: 'person-1', name: 'Rajesh Kumar', type: 'PERSON', role: 'Syndicate Ringleader', risk: 'HIGH', score: 94, phone: '+91 98201 44891', org: 'Oceanic Freight Logistics', location: 'Navi Mumbai', aliases: 'RK / Bhaijaan' },
    { id: 'person-2', name: 'Tariq Merchant', type: 'PERSON', role: 'Hawala Financial Broker', risk: 'HIGH', score: 81, phone: '+971 50 882 1943', org: 'Apex Global Trading', location: 'Dubai / Mumbai', aliases: 'Merchant' },
    { id: 'org-1', name: 'Oceanic Freight Logistics Ltd', type: 'ORGANIZATION', role: 'Shell Logistics Front', risk: 'HIGH', score: 88, phone: '022-27891022', org: 'CIN-U63090MH2019PTC1092', location: 'Nhava Sheva' },
    { id: 'account-1', name: 'HDFC A/C 50200091823', type: 'ACCOUNT', role: 'Primary Layering Account', risk: 'HIGH', score: 82, phone: 'IFSC: HDFC0000060', org: 'Oceanic Freight Ltd', location: 'Fort, Mumbai' },
    { id: 'phone-1', name: '+91 98201 44891', type: 'PHONE', role: 'Burner Coordinator Handset', risk: 'MEDIUM', score: 72, phone: 'IMEI: 864209041238910', org: 'Airtel Mumbai', location: 'Tower Cell MH-402' },
    { id: 'vehicle-1', name: 'MH-04-AZ-9921 (Tata Prima)', type: 'VEHICLE', role: 'Smuggling Transport Asset', risk: 'MEDIUM', score: 60, phone: 'ANPR Registered', org: 'Oceanic Freight Ltd', location: 'Panvel, Raigad' }
  ];

  const filtered = entities.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.role.toLowerCase().includes(search.toLowerCase()) ||
    e.type.toLowerCase().includes(search.toLowerCase())
  );

  const active = entities.find(e => e.id === selectedEntity) || entities[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-100">Suspect Dossier Explorer</h1>
        <p className="text-xs text-slate-400 mt-1">Detailed profile inspection, behavioral metrics, and connected assets.</p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search suspects, phones, or accounts..."
          className="w-full bg-[#111827] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Full Dossier Card (No cramped split screen) */}
      <div className="p-6 rounded-xl bg-[#111827] border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center font-bold text-xl text-blue-400">
              {active.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-100">{active.name}</h2>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-slate-300">
                  {active.type}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{active.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Threat Rating</span>
              <span className="text-sm font-bold text-rose-400">{active.risk} ({active.score}%)</span>
            </div>
            <button
              onClick={() => go('/network')}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Show in Graph</span>
            </button>
          </div>
        </div>

        {/* Attribute Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Primary Contact</span>
            <span className="text-xs font-mono font-medium text-slate-200 mt-1 block">{active.phone}</span>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Associated Organization</span>
            <span className="text-xs font-medium text-slate-200 mt-1 block truncate">{active.org}</span>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Observed Location</span>
            <span className="text-xs font-medium text-slate-200 mt-1 block">{active.location}</span>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Known Aliases</span>
            <span className="text-xs font-medium text-slate-200 mt-1 block">{active.aliases || 'None'}</span>
          </div>
        </div>

        {/* Entity Selector Pills */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Select Syndicate Profile
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {filtered.map(e => (
              <button
                key={e.id}
                onClick={() => setSelectedEntity(e.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedEntity === e.id
                    ? 'bg-blue-600/10 border-blue-500/50 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="text-xs font-semibold text-slate-200">{e.name}</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">{e.role}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   EVIDENCE VAULT (NO SPLIT SCREEN!)
-------------------------------------------------------------------------- */
function EvidenceView() {
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
    formData.append('caseId', 'CASE-1024');

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
      <div>
        <h1 className="text-xl font-semibold text-slate-100">Digital Evidence Vault</h1>
        <p className="text-xs text-slate-400 mt-1">Section 63 BSA cryptographic ledger exhibits and pre-ingestion SHA-256 hashes.</p>
      </div>

      {/* Upload Box (Full Width, Sleek) */}
      <div className="p-8 rounded-xl bg-[#111827] border border-dashed border-slate-700 text-center hover:border-blue-500 transition-colors">
        <Upload className="w-8 h-8 text-blue-400 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-slate-200">Ingest Digital Evidence File</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
          Upload CDR spreadsheets, banking RTGS ledgers, or surveillance scans to compute SHA-256 and anchor into the blockchain ledger.
        </p>
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium cursor-pointer transition-colors">
          <span>{uploading ? 'Calculating SHA-256 & Anchoring...' : 'Select File to Ingest'}</span>
          <input type="file" onChange={handleFileUpload} disabled={uploading} className="hidden" />
        </label>
      </div>

      {/* Exhibits Table (Full Width) */}
      <div className="rounded-xl bg-[#111827] border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Anchored Digital Exhibits</h3>
            <p className="text-xs text-slate-400 mt-0.5">Continuous cryptographic custody chain</p>
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
                      VERIFIED (BSA-63)
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
        <h1 className="text-xl font-semibold text-slate-100">Section 63 BSA & System Guide</h1>
        <p className="text-xs text-slate-400 mt-1">Legal admissibility standards and investigative workflows.</p>
      </div>

      <div className="p-6 rounded-xl bg-[#111827] border border-slate-800 space-y-4 text-xs text-slate-300 leading-relaxed">
        <h3 className="text-sm font-semibold text-slate-100">Section 63 Bharatiya Sakshya Adhiniyam, 2023</h3>
        <p>
          Section 63 of the BSA 2023 governs the admissibility of electronic records in judicial proceedings, replacing Section 65B of the Indian Evidence Act, 1872. Under Section 63, electronic records are deemed documents and admissible without further proof provided the chain of custody and integrity can be demonstrated.
        </p>
        <p>
          This platform implements continuous cryptographic hashing: every ingested exhibit receives an authoritative SHA-256 digest before storage, and is chained into an append-only block ledger linking timestamp, previous block hash, and officer credentials.
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

  const [mobileOpen, setMobileOpen] = useState(false);
  const [provisionOpen, setProvisionOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Navigate helper
  const go = (path) => {
    router.push(path);
  };

  const currentPath = pathname || initialPage;

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenProvision={() => setProvisionOpen(true)}
        onOpenAudit={() => setAuditOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenu={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          {currentPath === '/dashboard' && <DashboardView go={go} />}
          {currentPath === '/network' && (
            <div className="p-6 max-w-[1600px] mx-auto">
              <div className="mb-4">
                <h1 className="text-xl font-semibold text-slate-100">Criminal Network Explorer</h1>
                <p className="text-xs text-slate-400 mt-1">Interactive syndicate topology powered by Neo4j and centrality analytics.</p>
              </div>
              <NetworkGraph onOpenEvidence={() => go('/data')} />
            </div>
          )}
          {currentPath === '/investigate' && <InvestigateView go={go} />}
          {currentPath === '/data' && <EvidenceView />}
          {currentPath === '/alerts' && <AlertsView go={go} />}
          {currentPath === '/help' && <HelpView />}
        </main>
      </div>

      {/* Modals */}
      {provisionOpen && <ProvisionOfficerModal onClose={() => setProvisionOpen(false)} />}
      {auditOpen && <AuditLedgerModal onClose={() => setAuditOpen(false)} />}
    </div>
  );
}
