const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    credentials: 'include', // Include HttpOnly cookies
    ...options
  };

  // If sending FormData, delete Content-Type to let browser set boundary
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.error || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  login: (credentials) => request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  logout: () => request('/api/auth/logout', {
    method: 'POST'
  }),

  getMe: () => request('/api/auth/me'),

  // Cases
  getCases: () => request('/api/cases'),
  getCase: (id) => request(`/api/cases/${id}`),
  createCase: (data) => request('/api/cases', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Graph Topology & Neo4j (Case-Scoped & Multi-Case Synthesis)
  getGraph: (caseId) => request(`/api/graph/case/${caseId}`),
  compareCases: (caseIds) => request('/api/graph/compare', {
    method: 'POST',
    body: JSON.stringify({ caseIds })
  }),
  resolveEntities: (caseId) => request('/api/graph/resolve-entities', {
    method: 'POST',
    body: JSON.stringify({ caseId })
  }),
  mergeEntities: (payload) => request('/api/graph/merge-entities', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  addNode: (caseId, nodeData) => request(`/api/graph/${caseId}/nodes`, {
    method: 'POST',
    body: JSON.stringify(nodeData)
  }),
  addEdge: (caseId, edgeData) => request(`/api/graph/${caseId}/edges`, {
    method: 'POST',
    body: JSON.stringify(edgeData)
  }),

  // Analytics
  getInfluencers: (caseId) => request(`/api/analytics/influencers/${caseId}`),
  getPatterns: (caseId) => request(`/api/analytics/patterns/${caseId}`),

  // Blockchain Ledger & Section 63 BSA
  getLedger: (caseId) => request(`/api/blockchain/ledger/${caseId}`),
  verifyLedger: (caseId) => request(`/api/blockchain/verify/${caseId}`),
  sealCase: (caseId) => request(`/api/blockchain/seal/${caseId}`, {
    method: 'POST'
  }),
  getCertificate: (caseId) => request(`/api/blockchain/certificate/${caseId}`),

  // Evidence
  uploadEvidence: (formData) => request('/api/evidence/upload', {
    method: 'POST',
    body: formData
  }),
  getEvidence: (caseId) => request(`/api/evidence/${caseId}`),

  // Audit Logs & Provisioning
  getAuditLogs: () => request('/api/audit-logs'),
  provisionOfficer: (data) => request('/api/admin/provision-officer', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Tactical Simulation & Decapitation Engine
  simulateDecapitation: (caseId, targetNodeIds) => request('/api/simulation/decapitate', {
    method: 'POST',
    body: JSON.stringify({ caseId, targetNodeIds })
  }),

  // LLM Entity & Threat Intelligence
  extractEntities: (text) => request('/api/ai/extract', {
    method: 'POST',
    body: JSON.stringify({ text })
  }),
  scoreEntity: (entity, networkContext) => request('/api/ai/score', {
    method: 'POST',
    body: JSON.stringify({ entity, networkContext })
  })
};
