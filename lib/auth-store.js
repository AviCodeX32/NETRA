import { create } from 'zustand';

async function safeParseJson(res) {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  } catch {
    return null;
  }
}

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  authError: null,

  // Initialize auth from localStorage / session check
  initialize: async () => {
    try {
      if (typeof window === 'undefined') return;
      
      const savedUser = localStorage.getItem('cctns_user_session');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          set({ user: parsed, isAuthenticated: true, isLoading: false });
        } catch (e) {
          localStorage.removeItem('cctns_user_session');
        }
      }

      // Verify with backend
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        const data = await safeParseJson(res);
        if (data && data.officer) {
          set({ user: data.officer, isAuthenticated: true, isLoading: false, authError: null });
          localStorage.setItem('cctns_user_session', JSON.stringify(data.officer));
        }
      } else if (res.status === 401 || res.status === 403) {
        // Only clear session if server explicitly states unauthorized
        set({ user: null, isAuthenticated: false, isLoading: false });
        localStorage.removeItem('cctns_user_session');
      } else {
        // If network issue or 500, maintain local state
        set({ isLoading: false });
      }
    } catch (err) {
      // Offline fallback: maintain saved session if available
      const saved = localStorage.getItem('cctns_user_session');
      if (saved) {
        try {
          set({ user: JSON.parse(saved), isAuthenticated: true, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    }
  },

  // 4-field login action
  login: async ({ pno, password, stationCode, otp }) => {
    set({ isLoading: true, authError: null });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ pno, password, stationCode, otp })
      });

      const data = await safeParseJson(res);

      if (!res.ok) {
        const errMessage = data?.message || data?.error || (res.status === 500 ? 'Internal server error while verifying credentials. Check server logs.' : `Authentication failed (${res.status})`);
        set({ isLoading: false, authError: errMessage });
        return { success: false, error: errMessage };
      }

      if (!data || !data.officer) {
        set({ isLoading: false, authError: 'Invalid response format received from authentication authority.' });
        return { success: false, error: 'Invalid response format received from authentication authority.' };
      }

      set({
        user: data.officer,
        isAuthenticated: true,
        isLoading: false,
        authError: null
      });

      localStorage.setItem('cctns_user_session', JSON.stringify(data.officer));
      return { success: true, officer: data.officer };
    } catch (err) {
      const msg = err.message || 'Unable to establish secure uplink to CCTNS server.';
      set({ isLoading: false, authError: msg });
      return { success: false, error: msg };
    }
  },

  // Logout action
  logout: async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {
      // Continue client cleanup
    }
    localStorage.removeItem('cctns_user_session');
    set({ user: null, isAuthenticated: false, authError: null });
  },

  // RBAC Permission Gates
  canIngestEvidence: () => {
    const role = get().user?.role;
    return role === 'CYBER_ANALYST' || role === 'SUPERVISOR_SP';
  },

  canSealCase: () => {
    return get().user?.role === 'SUPERVISOR_SP';
  },

  canProvisionOfficer: () => {
    return get().user?.role === 'SUPERVISOR_SP';
  },

  canViewAudit: () => {
    const role = get().user?.role;
    return role === 'SUPERVISOR_SP' || role === 'CYBER_ANALYST';
  }
}));
