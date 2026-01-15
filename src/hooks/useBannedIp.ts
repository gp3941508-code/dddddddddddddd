import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BannedState {
  banned: boolean;
  loading: boolean;
  reason?: string | null;
  ip?: string | null;
}

export const useBannedIp = (): BannedState => {
  const [state, setState] = useState<BannedState>({ banned: false, loading: true, reason: null, ip: null });
  const ipRef = useRef<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const checkBan = async (ip: string) => {
    try {
      const { data, error } = await supabase
        .from('banned_ips')
        .select('reason, is_active')
        .eq('ip_address', ip)
        .eq('is_active', true)
        .limit(1);
      if (error) throw error;
      const banned = (data || []).length > 0;
      setState(prev => ({ ...prev, banned, loading: false, reason: banned ? data?.[0]?.reason ?? null : null }));
    } catch (e) {
      console.error('Failed checking ban status', e);
      setState(prev => ({ ...prev, banned: false, loading: false }));
    }
  };

  useEffect(() => {
    let active = true;
    // Get current IP
    (async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const json = await res.json();
        if (!active) return;
        const ip = json?.ip || null;
        ipRef.current = ip;
        setState(prev => ({ ...prev, ip }));
        if (ip) await checkBan(ip);
      } catch (e) {
        console.warn('IP fetch failed', e);
        setState(prev => ({ ...prev, loading: false }));
      }
    })();

    return () => { active = false; };
  }, []);

  useEffect(() => {
    // Subscribe to realtime changes for banned_ips
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    const channel = supabase
      .channel('banned_ips_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'banned_ips' }, (payload: any) => {
        const currentIp = ipRef.current;
        const newIp = (payload.new as any)?.ip_address;
        const oldIp = (payload.old as any)?.ip_address;
        if (!currentIp) return;
        if (newIp === currentIp || oldIp === currentIp) {
          const active = (payload.new as any)?.is_active ?? false;
          setState(prev => ({ ...prev, banned: !!active, reason: active ? (payload.new as any)?.reason ?? null : null }));
        }
      })
      .subscribe();
    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  return state;
};
