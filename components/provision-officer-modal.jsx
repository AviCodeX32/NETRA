'use client';

import { useState, useEffect } from 'react';
import { 
  UserPlus, Users, X, Shield, Lock, Fingerprint, 
  Building, CheckCircle2, AlertCircle
} from 'lucide-react';

export default function ProvisionOfficerModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('provision');
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    pno: '',
    name: '',
    rank: 'Sub-Inspector',
    stationCode: 'MUM-AND-04',
    role: 'INVESTIGATING_OFFICER',
    clearanceLevel: 'LEVEL_2_CONFIDENTIAL',
    password: 'Temp@Police2026#'
  });

  const fetchOfficers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/officers', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setOfficers(data.officers || []);
      }
    } catch (err) {
      console.error('Error fetching officer directory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'directory') {
      fetchOfficers();
    }
  }, [activeTab]);

  const handleRoleChange = (selectedRole) => {
    let defaultClearance = 'LEVEL_2_CONFIDENTIAL';
    let defaultRank = 'Sub-Inspector';

    if (selectedRole === 'SUPERVISOR_SP') {
      defaultClearance = 'LEVEL_4_TOP_SECRET';
      defaultRank = 'Superintendent of Police (SP)';
    } else if (selectedRole === 'CYBER_ANALYST') {
      defaultClearance = 'LEVEL_3_SECRET';
      defaultRank = 'Senior Cyber Analyst';
    }

    setFormData(prev => ({
      ...prev,
      role: selectedRole,
      clearanceLevel: defaultClearance,
      rank: defaultRank
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/provision-officer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setFeedback({
          type: 'success',
          message: `Officer ${formData.pno} successfully provisioned.`
        });
        setFormData({
          pno: '',
          name: '',
          rank: 'Sub-Inspector',
          stationCode: 'MUM-AND-04',
          role: 'INVESTIGATING_OFFICER',
          clearanceLevel: 'LEVEL_2_CONFIDENTIAL',
          password: 'Temp@Police2026#'
        });
      } else {
        setFeedback({
          type: 'error',
          message: data.error || 'Provisioning rejected.'
        });
      }
    } catch (err) {
      setLoading(false);
      setFeedback({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-sm text-slate-100">Provision Authorized Personnel</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('provision')}
            className={`flex-1 py-2.5 text-xs font-medium text-center border-b-2 transition-colors ${
              activeTab === 'provision'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            New Officer Provisioning
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex-1 py-2.5 text-xs font-medium text-center border-b-2 transition-colors ${
              activeTab === 'directory'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Directory
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'provision' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {feedback && (
                <div className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                  feedback.type === 'success' 
                    ? 'bg-emerald-950/40 border border-emerald-800/60 text-emerald-300' 
                    : 'bg-rose-950/40 border border-rose-800/60 text-rose-300'
                }`}>
                  {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{feedback.message}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Police Personnel Number (PNO)</label>
                <input
                  type="text"
                  required
                  value={formData.pno}
                  onChange={(e) => setFormData(p => ({ ...p, pno: e.target.value.toUpperCase() }))}
                  placeholder="e.g. IO-MH-8841"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="Officer full name"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">System Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="INVESTIGATING_OFFICER">Investigating Officer</option>
                    <option value="CYBER_ANALYST">Cyber Analyst</option>
                    <option value="SUPERVISOR_SP">Supervisor SP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Station Code</label>
                  <input
                    type="text"
                    required
                    value={formData.stationCode}
                    onChange={(e) => setFormData(p => ({ ...p, stationCode: e.target.value.toUpperCase() }))}
                    placeholder="MUM-AND-04"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Initial Password</label>
                <input
                  type="text"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
              >
                <span>{loading ? 'Provisioning...' : 'Provision Officer & Issue Credentials'}</span>
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              {(officers.length > 0 ? officers : [
                { pno: 'SP-MH-0091', name: 'Dr. Rajeshwar Rao, IPS', rank: 'Superintendent of Police (SP)', role: 'SUPERVISOR_SP', station: 'MUM-AND-04' },
                { pno: 'CA-MH-4412', name: 'Inspector Priya Sharma', rank: 'Senior Cyber Forensics Analyst', role: 'CYBER_ANALYST', station: 'MUM-AND-04' },
                { pno: 'IO-MH-7723', name: 'Sub-Inspector Vikram Shinde', rank: 'Investigating Officer', role: 'INVESTIGATING_OFFICER', station: 'MUM-AND-04' }
              ]).map(o => (
                <div key={o.pno} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-100">{o.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{o.rank} · {o.station || 'MUM-AND-04'}</div>
                  </div>
                  <span className="font-mono text-blue-400 font-medium">{o.pno}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
