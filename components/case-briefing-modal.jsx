'use client';

import { useState } from 'react';
import { 
  FileText, X, Printer, Copy, Check, Download, 
  ShieldCheck, AlertTriangle, Calendar, User, Scale, 
  Hash, ExternalLink, Bookmark, Building, Phone, CreditCard
} from 'lucide-react';

export default function CaseBriefingModal({ caseId = 'CASE-1024', cases = [], onClose }) {
  const [copied, setCopied] = useState(false);

  const activeCaseInfo = cases.find(c => c.id === caseId) || {
    id: 'CASE-1024',
    caseNumber: 'FIR-2026-MUM-1024',
    title: 'Maritime Hawala & Contraband Network',
    category: 'Syndicate Smuggling & Hawala',
    assignedOfficerPno: 'IO-MH-7723',
    status: 'ACTIVE'
  };

  // Pre-seeded comprehensive case dossiers
  const briefingData = {
    'CASE-1024': {
      firNo: 'FIR-2026-MUM-1024',
      policeStation: 'Andheri Cyber & Anti-Narcotics Wing',
      dateOfRegistration: '12-Jan-2026',
      investigatingOfficer: 'Sub-Inspector Vikram Shinde (IO-MH-7723)',
      supervisingSP: 'SP Ananya Roy, IPS (SP-MH-0012)',
      sections: 'Sec 120B IPC (Conspiracy), Sec 420 IPC, Sec 135 Customs Act 1962, Sec 3 & 4 PMLA 2002',
      synopsis: 'Intelligence-driven investigation into a clandestine maritime smuggling and hawala money laundering corridor operating via Nhava Sheva (JNPT) container terminals and offshore conduits in Deira, Dubai. Unregistered shell companies utilized to transfer precursor contraband and launder proceeds through layered RTGS transactions.',
      entities: [
        {
          name: 'Rajesh Kumar (Alias: RK / Bhaijaan)',
          role: 'Syndicate Ringleader & Logistics Head',
          uncertainty: 'CONFIRMED',
          grade: 'Grade A1',
          evidenceSource: 'Biometric Passport Match & Seizure Panchnama',
          details: 'Directs container clearing via Oceanic Freight Logistics Ltd. Authorized ₹14.2 Cr in layered hawala accounts.'
        },
        {
          name: 'Farooq (Alias: Farooq Seth / Chacha)',
          role: 'Hawala Financial Conduit & Cross-Case Bridge Node',
          uncertainty: 'CONFIRMED',
          grade: 'Grade A1',
          evidenceSource: 'Recovered Dongri Physical Ledger & Lawful Intercept Tap',
          details: 'Disburses cash tokens between maritime syndicate (FIR-1024) and ransomware extortion syndicate (FIR-1021).'
        },
        {
          name: 'Tariq Merchant (Alias: Goldie)',
          role: 'Offshore Hawala Clearing Agent (Dubai)',
          uncertainty: 'HIGH PROBABILITY',
          grade: 'Grade B2',
          evidenceSource: 'CDR Logs with Ringleader & UAE Customs Export Manifests',
          details: 'Coordinates dhow shipments and gold bullion settlement from Deira, Dubai.'
        },
        {
          name: 'HDFC A/C 50200091823 (Oceanic Freight)',
          role: 'Primary Layering Corporate Current Account',
          uncertainty: 'CONFIRMED',
          grade: 'Grade A1',
          evidenceSource: 'Section 91 CrPC Bank Statement Ledger (SHA-256 Verified)',
          details: 'Processed ₹18.9 Cr turnover; frozen under Section 102 CrPC on 13-Sep-2026.'
        },
        {
          name: 'Al-Noor Dhow Crew & Clearing Brokers',
          role: 'Secondary Transport & Offloading Operatives',
          uncertainty: 'SUSPECTED / UNVERIFIED',
          grade: 'Grade C3',
          evidenceSource: 'Confidential Human Informant Tip (Under Field Verification)',
          details: 'Reported to manage midnight cargo transfers off Nhava Sheva coastal creeks.'
        }
      ],
      evidenceSummary: [
        { name: 'CDR_Interception_Log_Mumbai_Jan2026.csv', type: 'Telecommunications', hash: '8f92a1c0d481bb209e51c890f12a4b89c7d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5', block: 1 },
        { name: 'RTGS_Hawala_Transfer_Records_HDFC.xlsx', type: 'Financial Ledger', hash: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f', block: 2 },
        { name: 'Seizure_FIR_Contraband_Nhava_Sheva.pdf', type: 'Physical Evidence', hash: '5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b', block: 3 }
      ],
      timeline: [
        { date: '12-Jan-2026', title: 'FIR Lodged under Sec 154 CrPC', desc: 'Customs border intelligence flag passed to Cyber & Organized Crime Wing.' },
        { date: '10-Sep-2026', title: 'Surveillance Raid in Dongri', desc: 'Encrypted chit ledger seized from safehouse; Farooq identified as primary conduit.' },
        { date: '13-Sep-2026', title: 'Bank Accounts Frozen under Sec 102 CrPC', desc: 'HDFC current accounts debits restricted exceeding ₹1,00,000 threshold.' },
        { date: '14-Sep-2026', title: 'Lookout Circular (LOC) Enforced', desc: 'Rajesh Kumar flagged attempting departure via Mumbai Airport T2.' }
      ],
      nextActions: [
        'Execute simultaneous multi-point raid on Belapur residence and Panvel logistics yard.',
        'File Section 166A CrPC Letter Rogatory for Dubai bank accounts held by Apex Global Trading.',
        'Submit digital exhibits to Esplanade Metropolitan Magistrate with BSA 63 Cryptographic Certificate.'
      ]
    },
    'CASE-1021': {
      firNo: 'FIR-2026-MUM-1021',
      policeStation: 'Andheri Cyber Crime Police Station',
      dateOfRegistration: '18-Feb-2026',
      investigatingOfficer: 'Inspector Arjun Rao (IO-MH-9999)',
      supervisingSP: 'SP Ananya Roy, IPS (SP-MH-0012)',
      sections: 'Sec 66, 66C, 66D IT Act 2000, Sec 384 IPC (Extortion), Sec 120B IPC',
      synopsis: 'Sophisticated cryptolocker ransomware campaign targeting healthcare infrastructure in Mumbai Metropolitan Region. Demand of 48.5 BTC laundered via coin mixers and converted to physical fiat through domestic hawala channels.',
      entities: [
        {
          name: 'Vikram "Cipher" Malhotra',
          role: 'Malware Developer & Threat Actor',
          uncertainty: 'CONFIRMED',
          grade: 'Grade A1',
          evidenceSource: 'C2 Server Log Memory Dump & Malware Binary Compile Signature',
          details: 'Operator of ShadowGrid ransomware franchise. Tapped laundering 4.2 BTC into local INR.'
        },
        {
          name: 'Farooq (Broker)',
          role: 'Cryptocurrency-to-Cash Liquidation Node',
          uncertainty: 'CONFIRMED',
          grade: 'Grade A1',
          evidenceSource: 'Cross-Case Intercept Log (Linked with FIR-1024)',
          details: 'Facilitated conversion of 4.2 BTC into physical cash drops in South Mumbai.'
        }
      ],
      evidenceSummary: [
        { name: 'Ransomware_Binary_Disassembly_Report.pdf', type: 'Digital Forensics', hash: '4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e', block: 6 }
      ],
      timeline: [
        { date: '18-Feb-2026', title: 'Hospital Network Encrypted', desc: 'Ransom demand deployed across 40 hospital endpoints.' },
        { date: '14-Sep-2026', title: 'C2 Beacon Trace Identified', desc: 'Compile timestamp linked with local Bandra IP address pool.' }
      ],
      nextActions: [
        'Serve Section 91 CrPC notice on Indian crypto exchanges to freeze KYC linked wallets.',
        'Issue Red Corner Notice via Interpol NCB New Delhi for offshore C2 infrastructure.'
      ]
    },
    'CASE-1018': {
      firNo: 'FIR-2026-MUM-1018',
      policeStation: 'Anti-Narcotics Cell, Andheri Unit',
      dateOfRegistration: '05-Mar-2026',
      investigatingOfficer: 'Sub-Inspector Vikram Shinde (IO-MH-7723)',
      supervisingSP: 'SP Ananya Roy, IPS (SP-MH-0012)',
      sections: 'Sec 8(c), 21, 22, 29 NDPS Act 1985, Sec 120B IPC',
      synopsis: 'Interstate trafficking of synthetic stimulants and chemical precursors funneled via commercial freight routes and financed through shared corporate layering accounts.',
      entities: [
        {
          name: 'Bilal Qureshi',
          role: 'Cartel Logistics & Distribution Lead',
          uncertainty: 'CONFIRMED',
          grade: 'Grade A1',
          evidenceSource: 'FSL Chemical Laboratory Analysis & Seized Freight Delivery Receipt',
          details: 'Coordinated receipt of 25kg mephedrone precursors via Panvel container corridor.'
        }
      ],
      evidenceSummary: [
        { name: 'FSL_Chemical_Analysis_Report_Mephedrone.pdf', type: 'Lab Analysis', hash: '9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', block: 7 }
      ],
      timeline: [
        { date: '05-Mar-2026', title: 'Seizure at Port Gateway', desc: 'Precursor consignments intercepted in joint operation with Customs.' }
      ],
      nextActions: [
        'Attach commercial bank accounts under Section 68F NDPS Act.',
        'Execute search warrant on chemical manufacturing unit in Boisar MIDC.'
      ]
    }
  };

  const data = briefingData[caseId] || briefingData['CASE-1024'];

  const getUncertaintyBadge = (grade, label) => {
    if (grade === 'Grade A1') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          <span>{grade}: {label}</span>
        </span>
      );
    }
    if (grade === 'Grade B2') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          <span>{grade}: {label}</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1">
        <span>{grade}: {label}</span>
      </span>
    );
  };

  const handleCopy = () => {
    const text = `
POLICE INTELLIGENCE EXECUTIVE CASE BRIEFING
Docket: ${data.firNo} | Station: ${data.policeStation}
Date: ${data.dateOfRegistration} | Supervising SP: ${data.supervisingSP}
Investigating Officer: ${data.investigatingOfficer}
Statutory Charges: ${data.sections}

SYNOPSIS:
${data.synopsis}

KEY SYNDICATE ENTITIES & CONFIDENCE GRADES:
${data.entities.map(e => `• ${e.name} (${e.role}) - [${e.grade}: ${e.uncertainty}]\n  Evidence: ${e.evidenceSource}\n  Details: ${e.details}`).join('\n\n')}

VERIFIED DIGITAL EXHIBITS:
${data.evidenceSummary.map(ex => `• ${ex.name} (SHA-256: ${ex.hash.slice(0, 16)}... | Block #${ex.block})`).join('\n')}

INVESTIGATION TIMELINE:
${data.timeline.map(t => `• ${t.date}: ${t.title} - ${t.desc}`).join('\n')}

RECOMMENDED OPERATIONAL DIRECTIVES:
${data.nextActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

INTEGRITY SEAL: SHA-256 Hash Authenticated for Court Presentation.
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#0B1120] border border-slate-700/80 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between gap-4 print:border-b-2 print:border-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30 uppercase">
                  CONFIDENTIAL // LAW ENFORCEMENT SENSITIVE
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  SECTION 173 CrPC STANDARDS
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-100 mt-0.5 print:text-black">
                Executive Case Briefing Report — {data.firNo}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy formatted briefing report"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
              title="Print official report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Briefing</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 print:text-black print:p-0 print:space-y-4">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs print:bg-gray-100 print:border-gray-300">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">FIR Docket No.</span>
              <span className="font-mono font-bold text-blue-400 mt-0.5 block print:text-black">{data.firNo}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Police Station</span>
              <span className="font-medium text-slate-200 mt-0.5 block print:text-black">{data.policeStation}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Investigating Officer</span>
              <span className="font-medium text-slate-200 mt-0.5 block print:text-black">{data.investigatingOfficer}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Supervising Officer</span>
              <span className="font-medium text-slate-200 mt-0.5 block print:text-black">{data.supervisingSP}</span>
            </div>
            <div className="col-span-2 md:col-span-4 pt-2 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Charged Statutory Provisions</span>
              <span className="font-mono text-amber-300 text-xs mt-0.5 block print:text-black">{data.sections}</span>
            </div>
          </div>

          {/* Executive Synopsis */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>1. Executive Operational Synopsis</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 print:bg-white print:border-gray-200">
              {data.synopsis}
            </p>
          </div>

          {/* Key Entities & Confidence Grades */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-sky-400" />
                <span>2. Key Syndicate Entities & Intelligence Confidence Grading</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Admiralty Scale (A1 - C3)</span>
            </div>

            <div className="space-y-2.5">
              {data.entities.map((e, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 print:border-gray-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-xs print:text-black">{e.name}</span>
                      <span className="text-[11px] text-slate-400">({e.role})</span>
                    </div>
                    <div>{getUncertaintyBadge(e.grade, e.uncertainty)}</div>
                  </div>
                  <div className="text-[11px] text-slate-300 leading-relaxed">{e.details}</div>
                  <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/60 flex items-center gap-1.5">
                    <span className="text-slate-500 uppercase">Verification Source:</span>
                    <span className="text-slate-300 font-sans">{e.evidenceSource}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Forensic Evidence Trail */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>3. Verified Exhibits & Chain of Custody Proof</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
                <thead className="bg-slate-900 text-slate-400 font-semibold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Exhibit Filename</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">SHA-256 Digest</th>
                    <th className="py-2.5 px-3">Blockchain Height</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                  {data.evidenceSummary.map((ex, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-2 px-3 font-medium text-slate-200">{ex.name}</td>
                      <td className="py-2 px-3 text-slate-400">{ex.type}</td>
                      <td className="py-2 px-3 font-mono text-[10px] text-emerald-400">{ex.hash.slice(0, 28)}...</td>
                      <td className="py-2 px-3 font-mono text-slate-300">Block #{ex.block} (Verified)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Investigation Chronology */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>4. Chronological Case Progression</span>
            </h3>

            <div className="space-y-2">
              {data.timeline.map((t, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 flex items-start gap-3 text-xs">
                  <span className="font-mono text-blue-400 shrink-0 font-semibold">{t.date}</span>
                  <div>
                    <span className="font-semibold text-slate-200 block">{t.title}</span>
                    <span className="text-slate-400 text-[11px] mt-0.5 block">{t.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Directives */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Scale className="w-3.5 h-3.5 text-rose-400" />
              <span>5. Recommended Tactical Directives & Legal Steps</span>
            </h3>

            <div className="space-y-2">
              {data.nextActions.map((action, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-900/40 text-xs flex items-center gap-2 text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Authenticity Banner */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>INTEGRITY SEAL: SHA-256 e-Sign Verification Compliant</span>
            </div>
            <div className="text-slate-500">
              Generated: {new Date().toISOString().replace('T', ' ').slice(0, 19)} IST
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#0F172A] border-t border-slate-800 flex items-center justify-between text-xs print:hidden">
          <span className="text-slate-400 font-mono text-[11px]">
            Ready for court submission or senior leadership briefing.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
