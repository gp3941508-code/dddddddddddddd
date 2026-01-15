import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { UAParser } from 'ua-parser-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string; role: 'admin' | 'user' } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string; role: 'admin' | 'user' } | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  // Track session row and heartbeat timer
  const heartbeatRef = useRef<number | null>(null);
  const sessionRowIdRef = useRef<string | null>(null);

  const startHeartbeat = (rowId: string) => {
    sessionRowIdRef.current = rowId;
    if (heartbeatRef.current) {
      window.clearInterval(heartbeatRef.current);
    }
    const id = window.setInterval(async () => {
      try {
        await supabase
          .from('login_sessions')
          .update({
            last_activity: new Date().toISOString(),
            is_active: true,
          })
          .eq('id', rowId);
      } catch (e) {
        console.error('Heartbeat update failed', e);
      }
    }, 30000); // Update every 30 seconds
    heartbeatRef.current = id;
  };

  const stopHeartbeat = async (setInactive = false) => {
    if (heartbeatRef.current) {
      window.clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    const rowId = sessionRowIdRef.current || localStorage.getItem('login_session_row_id');
    if (setInactive && rowId) {
      try {
        await supabase
          .from('login_sessions')
          .update({
            is_active: false,
            last_activity: new Date().toISOString(),
          })
          .eq('id', rowId);
      } catch (e) {
        console.error('Failed to mark session inactive', e);
      }
    }
    sessionRowIdRef.current = null;
  };
  useEffect(() => {
    // Check if there's a lockout in progress
    const lockData = localStorage.getItem('auth_lockout');
    if (lockData) {
      const { lockUntil } = JSON.parse(lockData);
      const now = Date.now();
      if (now < lockUntil) {
        setIsLocked(true);
        setLockTimeRemaining(Math.ceil((lockUntil - now) / 1000));
        
        // Start countdown timer
        const timer = setInterval(() => {
          const remaining = Math.ceil((lockUntil - Date.now()) / 1000);
          if (remaining <= 0) {
            setIsLocked(false);
            setLockTimeRemaining(0);
            localStorage.removeItem('auth_lockout');
            clearInterval(timer);
          } else {
            setLockTimeRemaining(remaining);
          }
        }, 1000);
        
        return () => clearInterval(timer);
      } else {
        localStorage.removeItem('auth_lockout');
      }
    }
    
    // Check for saved authentication state
    const savedAuth = localStorage.getItem('auth_state');
    if (savedAuth) {
      const { isAuthenticated: wasAuthenticated, user } = JSON.parse(savedAuth);
      if (wasAuthenticated && user) {
        setIsAuthenticated(true);
        setUser(user);
        const savedRowId = localStorage.getItem('login_session_row_id');
        if (savedRowId) {
          startHeartbeat(savedRowId);
        }
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (isLocked) {
      return false;
    }
    
    if (password === 'ADMIN199' || password === 'AGENTLOOTS') {
      // Capture device and session information
      const rowId = await captureLoginSession();
      if (rowId) {
        localStorage.setItem('login_session_row_id', rowId);
        startHeartbeat(rowId);
      }
      
      const role = password === 'ADMIN199' ? 'admin' : 'user';
      const authData = { isAuthenticated: true, user: { username: role, role } };
      // Save to localStorage for persistent login
      localStorage.setItem('auth_state', JSON.stringify(authData));
      setIsAuthenticated(true);
      setUser({ username: role, role });
      return true;
    } else {
      // Set 2-minute lockout for wrong password
      const lockUntil = Date.now() + (2 * 60 * 1000); // 2 minutes
      localStorage.setItem('auth_lockout', JSON.stringify({ lockUntil }));
      setIsLocked(true);
      setLockTimeRemaining(120);
      
      // Start countdown timer
      const timer = setInterval(() => {
        const remaining = Math.ceil((lockUntil - Date.now()) / 1000);
        if (remaining <= 0) {
          setIsLocked(false);
          setLockTimeRemaining(0);
          localStorage.removeItem('auth_lockout');
          clearInterval(timer);
        } else {
          setLockTimeRemaining(remaining);
        }
      }, 1000);
    }
    return false;
  };

  const logout = async () => {
    await stopHeartbeat(true);
    // Remove from localStorage and reset state
    localStorage.removeItem('auth_state');
    localStorage.removeItem('login_session_row_id');
    setIsAuthenticated(false);
    setUser(null);
  };

  const captureLoginSession = async (): Promise<string | null> => {
    try {
      // Get device information using UAParser
      const parser = new UAParser();
      const result = parser.getResult();
      
      // Generate unique session ID
      const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Get IP address from external service
      let ipData: any = null;
      try {
        const ipResponse = await fetch('https://ipapi.co/json/');
        ipData = await ipResponse.json();
      } catch (error) {
        console.log('Could not fetch IP data:', error);
      }
      
      const sessionData = {
        session_id: sessionId,
        ip_address: ipData?.ip || 'Unknown',
        user_agent: navigator.userAgent,
        device_type: result.device.type || 'desktop',
        browser_name: result.browser.name || 'Unknown',
        browser_version: result.browser.version || 'Unknown',
        os_name: result.os.name || 'Unknown',
        os_version: result.os.version || 'Unknown',
        device_vendor: result.device.vendor || 'Unknown',
        device_model: result.device.model || 'Unknown',
        country: ipData?.country_name || 'Unknown',
        city: ipData?.city || 'Unknown',
        latitude: ipData?.latitude || null,
        longitude: ipData?.longitude || null,
        login_time: new Date().toISOString(),
        last_activity: new Date().toISOString(),
        is_active: true
      };

      const { data, error } = await supabase
        .from('login_sessions')
        .insert([sessionData])
        .select('id')
        .single();

      if (error) {
        console.error('Error saving login session:', error);
        return null;
      }

      // Save generated session id (client-side)
      localStorage.setItem('login_session_id', sessionId);

      return data?.id ?? null;
    } catch (error) {
      console.error('Error capturing login session:', error);
      return null;
    }
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    isLocked,
    lockTimeRemaining,
    AuthContext
  };
};