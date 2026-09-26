'use client';

import { useState } from 'react';
import { 
  BookOpen, CheckCircle2, Circle, Scale, ShieldAlert, 
  ExternalLink, Copy, Check, ChevronRight, X, ArrowUpRight, 
  Share2, Zap, FileText, Upload, AlertCircle
} from 'lucide-react';

export default function InvestigationPlaybooksModal({ 
  caseId = 'CASE-1024', 
  cases = [], 
  onClose,
  onNavigate 
}) {
  const [activePlaybookId, setActivePlaybookId] = useState('CYBER_FRAUD');
  const [completedSteps, setCompletedSteps] = useState({
    'CYBER_FRAUD': [1, 2],
    'HAWALA_PMLA': [1, 2, 3],
    'MISSING_PERSON': [1],
    'ORGANIZED_CRIME': [1, 2, 4],
    'VEHICLE_TRANSIT': [1, 3]
  });
  const [copied, setCopied] = useState(false);

  const playbooks = [
    {
      id: 'CYBER_FRAUD',
      title: 'Cyber Financial Fraud & Phishing',
      category: 'IT Act & Financial Crime',
      statutoryLaw: 'Sec 66D IT Act 2000, Sec 420 IPC, Sec 91 & 102 CrPC',
      description: 'Standard protocol for phishing, unauthorized banking transfers, crypto extortion, and payment gateway fraud.',
      steps: [
        {
          id: 1,
          phase: 'Phase 1: First Response (0-2h)',
          title: 'Immediate Debit Freeze Order',
          statute: 'Section 102 CrPC (Police Seizure of Property)',
          guidance: 'Issue immediate emergency freeze notice to beneficiary bank/payment gateway to halt outward layering or ATM withdrawals.',
          actionLabel: 'Freeze Records',
          actionView: '/data'
        },
        {
          id: 2,
          phase: 'Phase 1: First Response (0-2h)',
          title: 'Demand IP, IMEI & Session Logs',
          statute: 'Section 91 CrPC (Production of Documents)',
          guidance: 'Serve formal statutory notice to telecom provider & ISP for IP access logs, cell tower location, and handset IMEI at timestamp of transaction.',
          actionLabel: 'Check Telecom Exhibits',
          actionView: '/data'
        },
        {
          id: 3,
          phase: 'Phase 2: Network Tracing (2-24h)',
          title: 'Reconstruct Mule Account Layering Tree',
          statute: 'Section 120B IPC (Conspiracy)',
          guidance: 'Map intermediate receiver accounts in Network Graph canvas to identify common money mule handlers and withdrawal hubs.',
          actionLabel: 'Explore Graph',
          actionView: '/network'
        },
        {
          id: 4,
          phase: 'Phase 3: Digital Forensics',
          title: 'Cryptographic Hashing of Payloads & Ledgers',
          statute: 'Section 63 Bharatiya Sakshya Adhiniyam (BSA)',
          guidance: 'Anchor transaction CSVs and malware payload hashes into immutable blockchain ledger with SHA-256 integrity seal.',
          actionLabel: 'Vault Exhibits',
          actionView: '/data'
        },
        {
          id: 5,
          phase: 'Phase 4: Judicial Filing',
          title: 'Generate Court Case Briefing',
          statute: 'Section 173 CrPC (Police Report)',
          guidance: 'Compile executive case briefing report with Grade A1/B2 evidence labels for Metropolitan Magistrate hearing.',
          actionLabel: 'Case Briefing',
          actionView: '/dashboard'
        }
      ]
    },
    {
      id: 'HAWALA_PMLA',
      title: 'Hawala & Money Laundering',
      category: 'PMLA & Cross-Border Crime',
      statutoryLaw: 'Prevention of Money Laundering Act 2002 (Sec 3/4), FEMA 1999',
      description: 'Investigating clandestine cash settlement networks, bearer token chits, shell corporate layering, and offshore conduit accounts.',
      steps: [
        {
          id: 1,
          phase: 'Phase 1: Conduit Identification',
          title: 'Identify Cash Token & Numerical Chit Desks',
          statute: 'Sec 3 & 4 PMLA 2002',
          guidance: 'Seize physical chit ledgers and decrypt numerical token codes connecting local buyers to foreign clearing houses.',
          actionLabel: 'Inspect Suspects',
          actionView: '/investigate'
        },
        {
          id: 2,
          phase: 'Phase 2: Corporate Veil Piercing',
          title: 'Subpoena Registrar of Companies (ROC) Filings',
          statute: 'Companies Act 2013 Sec 447',
          guidance: 'Verify beneficial ownership of shell export-import firms registered at identical addresses or with nominee directors.',
          actionLabel: 'Inspect Shell Org',
          actionView: '/investigate'
        },
        {
          id: 3,
          phase: 'Phase 3: Cross-Case Synthesis',
          title: 'Detect Shared Multi-Docket Bridge Accounts',
          statute: 'Multi-Jurisdictional Intelligence',
          guidance: 'Synthesize FIR dockets using Cross-Case Synthesis tool to identify high-volume accounts common across separate police dockets.',
          actionLabel: 'Launch Synthesis',
          actionView: '/network'
        },
        {
          id: 4,
          phase: 'Phase 4: Tactical Raid Preparation',
          title: 'Simulate Decapitation of Financial Treasurer',
          statute: 'Tactical Raid Operations',
          guidance: 'Simulate arrest of primary financial broker in graph to measure network fragmentation score and identify backup successors.',
          actionLabel: 'Simulate Raid',
          actionView: '/network'
        },
        {
          id: 5,
          phase: 'Phase 5: Inter-Agency Referral',
          title: 'Letter Rogatory & Enforcement Directorate (ED) Transfer',
          statute: 'Section 166A CrPC',
          guidance: 'Submit certified electronic ledger to ED for provisional attachment of offshore bullion and immovable properties.',
          actionLabel: 'Export Dossier',
          actionView: '/investigate'
        }
      ]
    },
    {
      id: 'MISSING_PERSON',
      title: 'Missing Person & Abduction Tracing',
      category: 'Human Safety & Surveillance',
      statutoryLaw: 'Sec 363, 364A IPC (Kidnapping for Ransom), Sec 92 CrPC',
      description: 'Urgent chronological location triangulation, CDR cell dumps, last known contact networks, and border checkpoint alerts.',
      steps: [
        {
          id: 1,
          phase: 'Phase 1: Golden Hour (0-4h)',
          title: 'Emergency Cell Tower Dump & Last Handshake',
          statute: 'Section 92 CrPC (Urgent Communication Intercept)',
          guidance: 'Obtain immediate cell ID and sector azimuth of last known active transmission from subject and companion devices.',
          actionLabel: 'View Telemetry',
          actionView: '/investigate'
        },
        {
          id: 2,
          phase: 'Phase 2: Contact Sphere Analysis',
          title: 'Map Immediate 1-Hop Communication Circle',
          statute: 'Network Graph Topology',
          guidance: 'Isolate frequent voice/SMS contacts active in the 48 hours prior to disappearance to detect coercion or rendezvous.',
          actionLabel: 'Explore Graph',
          actionView: '/network'
        },
        {
          id: 3,
          phase: 'Phase 3: Highway ANPR Corroboration',
          title: 'Query Highway Toll FASTag Transactions',
          statute: 'Motor Vehicles Act / ANPR Logs',
          guidance: 'Cross-reference vehicle plates associated with contacts against toll plaza camera timestamps along probable exit routes.',
          actionLabel: 'Check Vehicle Assets',
          actionView: '/investigate'
        },
        {
          id: 4,
          phase: 'Phase 4: Border Circulation',
          title: 'Issue Lookout Circular (LOC) to Immigration',
          statute: 'Bureau of Immigration Guidelines',
          guidance: 'Disseminate biometric portraits and passport hashes across all sea and air ports of departure.',
          actionLabel: 'Toggle LOC',
          actionView: '/investigate'
        }
      ]
    },
    {
      id: 'ORGANIZED_CRIME',
      title: 'Organized Crime & Syndicate Smuggling',
      category: 'Syndicate & Contraband',
      statutoryLaw: 'MCOCA 1999, Sec 120B IPC, Sec 135 Customs Act, Sec 25 Arms Act',
      description: 'Dismantling multi-tier hierarchies, contraband shipping corridors, burner communications, and tactical raid coordination.',
      steps: [
        {
          id: 1,
          phase: 'Phase 1: Hierarchy Mapping',
          title: 'Map Ringleader, Transporter, and Broker Nodes',
          statute: 'MCOCA Sec 3 (Organized Crime Syndicate)',
          guidance: 'Chart hierarchical authority in Network Graph to distinguish command leadership from replaceable foot soldiers.',
          actionLabel: 'Open Graph',
          actionView: '/network'
        },
        {
          id: 2,
          phase: 'Phase 2: Intercept Warrants',
          title: 'Lawful Interception of Burner Telephony',
          statute: 'Section 5(2) Indian Telegraph Act',
          guidance: 'Deploy continuous lawful voice and packet recording on IMEI/IMSI pairs flagged near maritime dock sectors.',
          actionLabel: 'Inspect Burner Handset',
          actionView: '/investigate'
        },
        {
          id: 3,
          phase: 'Phase 3: Minimum-Cut Calculation',
          title: 'Execute Tactical Decapitation Simulation',
          statute: 'Tactical Raid Optimization',
          guidance: 'Determine exact minimum set of simultaneous arrests required to achieve >80% Graph Fragmentation and sever all communications.',
          actionLabel: 'Simulate Raid Mode',
          actionView: '/network'
        },
        {
          id: 4,
          phase: 'Phase 4: Multi-Point Simultaneous Raids',
          title: 'Execute Simultaneous Search & Seizure',
          statute: 'Section 93 & 100 CrPC (Search Warrants)',
          guidance: 'Coordinate arrest teams across residential and dock facilities within 60 minutes to neutralize successor operatives.',
          actionLabel: 'Field Desk Mode',
          actionView: '/dashboard'
        }
      ]
    },
    {
      id: 'VEHICLE_TRANSIT',
      title: 'Transit Vehicle & Highway Smuggling',
      category: 'Logistics & Interdiction',
      statutoryLaw: 'Sec 115 Customs Act (Conveyance Confiscation), Sec 102 CrPC',
      description: 'Tracing commercial transit trucks, fake number plates, FASTag expressway toll timestamps, and container loading depots.',
      steps: [
        {
          id: 1,
          phase: 'Phase 1: Toll Triangulation',
          title: 'Extract NHAI FASTag & ANPR Camera Feeds',
          statute: 'Section 91 CrPC',
          guidance: 'Obtain timestamped high-resolution camera captures from highway toll barriers to establish speed and transit trajectory.',
          actionLabel: 'Inspect Vehicle',
          actionView: '/investigate'
        },
        {
          id: 2,
          phase: 'Phase 2: RTO Registration Audit',
          title: 'Cross-Match Chassis and Engine Numbers',
          statute: 'Motor Vehicles Act 1988',
          guidance: 'Detect forged registration certificates and fake number plates by querying official RTO database with physical chassis stamp.',
          actionLabel: 'Evidence Vault',
          actionView: '/data'
        },
        {
          id: 3,
          phase: 'Phase 3: Highway Interdiction',
          title: 'Circulate Impound Notice to Toll Corridors',
          statute: 'Section 115 Customs Act 1962',
          guidance: 'Blacklist FASTag RFID tag to trigger automated barrier lock and alert Highway Police at upcoming toll plaza.',
          actionLabel: 'Update Status',
          actionView: '/investigate'
        }
      ]
    }
  ];

  const currentPlaybook = playbooks.find(p => p.id === activePlaybookId) || playbooks[0];
  const activeCompleted = completedSteps[activePlaybookId] || [];

  const toggleStep = (stepId) => {
    setCompletedSteps(prev => {
      const currentList = prev[activePlaybookId] || [];
      const updated = currentList.includes(stepId)
        ? currentList.filter(id => id !== stepId)
        : [...currentList, stepId];
      return { ...prev, [activePlaybookId]: updated };
    });
  };

  const progressPercent = Math.round((activeCompleted.length / currentPlaybook.steps.length) * 100);

  const handleCopyChecklist = () => {
    const text = `
INVESTIGATION SOP PLAYBOOK: ${currentPlaybook.title}
Governing Law: ${currentPlaybook.statutoryLaw}
Progress: ${activeCompleted.length}/${currentPlaybook.steps.length} Steps Completed (${progressPercent}%)

CHECKLIST:
${currentPlaybook.steps.map(s => {
  const isDone = activeCompleted.includes(s.id);
  return `[${isDone ? 'X' : ' '}] Step ${s.id}: ${s.title} (${s.phase})\n    Statute: ${s.statute}\n    Guidance: ${s.guidance}`;
}).join('\n\n')}

Certified by Investigating Officer via Nexus Command Desk.
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0B1120] border border-slate-700/80 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 uppercase">
                  STANDARD OPERATING PROCEDURES (SOP)
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  STATUTORY INVESTIGATION PLAYBOOKS
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-100 mt-0.5">
                Guided Investigation Playbooks & Statutory Compliance
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyChecklist}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy SOP compliance report"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy SOP Checklist'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Playbook Selection Strip */}
        <div className="px-6 py-2.5 bg-[#0D1322] border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          {playbooks.map(pb => (
            <button
              key={pb.id}
              onClick={() => setActivePlaybookId(pb.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                activePlaybookId === pb.id
                  ? 'bg-blue-600 text-white font-semibold shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {pb.title}
            </button>
          ))}
        </div>

        {/* Main Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Active Playbook Header Card */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-blue-400 uppercase font-bold block">
                  {currentPlaybook.category}
                </span>
                <h3 className="text-lg font-bold text-slate-100">{currentPlaybook.title}</h3>
              </div>

              {/* Progress Counter */}
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">SOP Compliance</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-32 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {progressPercent}% ({activeCompleted.length}/{currentPlaybook.steps.length})
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentPlaybook.description}
            </p>

            <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-xs">
              <Scale className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-400">Governing Enactments:</span>
              <span className="text-amber-300 font-mono text-[11px] font-medium">{currentPlaybook.statutoryLaw}</span>
            </div>
          </div>

          {/* Interactive Steps Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span>Step-by-Step Investigation Workflow</span>
              <span className="text-[10px] font-normal text-slate-500">(Click checkbox to mark step verified)</span>
            </h4>

            <div className="space-y-3">
              {currentPlaybook.steps.map((step) => {
                const isCompleted = activeCompleted.includes(step.id);

                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCompleted
                        ? 'bg-slate-900/60 border-emerald-500/30'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Interactive Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleStep(step.id)}
                        className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 border border-slate-700 text-transparent hover:border-slate-500'
                        }`}
                        title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>

                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">
                              {step.phase}
                            </span>
                            <span className="text-slate-600">•</span>
                            <h5 className={`text-xs font-bold ${isCompleted ? 'text-emerald-300 line-through' : 'text-slate-100'}`}>
                              {step.title}
                            </h5>
                          </div>

                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 self-start sm:self-auto font-medium">
                            {step.statute}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {step.guidance}
                        </p>

                        {/* Operational Action Shortcut */}
                        <div className="pt-2 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              if (onNavigate) onNavigate(step.actionView);
                            }}
                            className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Execute {step.actionLabel}</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0F172A] border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            SOP aligned with Indian Police Academy & Interpol standard practices.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors cursor-pointer"
          >
            Close Playbooks
          </button>
        </div>
      </div>
    </div>
  );
}
