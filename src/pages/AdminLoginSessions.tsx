import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, Smartphone, Monitor, MapPin, Clock, Activity, Ban, Undo2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface LoginSession {
  id: string;
  session_id: string;
  ip_address: string;
  user_agent: string;
  device_type: string;
  browser_name: string;
  browser_version: string;
  os_name: string;
  os_version: string;
  device_vendor: string;
  device_model: string;
  country: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  login_time: string;
  last_activity: string;
  is_active: boolean;
}

const AdminLoginSessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<LoginSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Banned IPs state and helpers
  const [bannedSet, setBannedSet] = useState<Set<string>>(new Set());

  const refreshBanned = async () => {
    const { data, error } = await supabase
      .from('banned_ips')
      .select('ip_address, is_active')
      .eq('is_active', true);
    if (!error) {
      setBannedSet(new Set((data || []).map(d => d.ip_address)));
    }
  };

  const banIp = async (ip: string) => {
    try {
      if (!ip || ip === 'Unknown') return;
      const { error } = await supabase
        .from('banned_ips')
        .upsert([{ ip_address: ip, is_active: true, reason: 'Banned by admin' }], { onConflict: 'ip_address' });
      if (error) throw error;
      toast({ title: 'IP Banned', description: `${ip} is now banned.` });
      await refreshBanned();
    } catch (e: any) {
      console.error('Ban IP failed', e);
      toast({ title: 'Error', description: 'Failed to ban IP', variant: 'destructive' });
    }
  };

  const unbanIp = async (ip: string) => {
    try {
      if (!ip || ip === 'Unknown') return;
      const { error } = await supabase
        .from('banned_ips')
        .update({ is_active: false })
        .eq('ip_address', ip);
      if (error) throw error;
      toast({ title: 'IP Unbanned', description: `${ip} is now unbanned.` });
      await refreshBanned();
    } catch (e: any) {
      console.error('Unban IP failed', e);
      toast({ title: 'Error', description: 'Failed to unban IP', variant: 'destructive' });
    }
  };

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('login_sessions')
        .select('*')
        .order('login_time', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch login sessions",
          variant: "destructive",
        });
        return;
      }

      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch login sessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    refreshBanned();

    // Set up real-time subscription for login sessions
    const loginChannel = supabase
      .channel('login_sessions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'login_sessions'
        },
        () => {
          fetchSessions();
        }
      )
      .subscribe();

    // Set up real-time subscription for banned IPs
    const bannedChannel = supabase
      .channel('banned_ips_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'banned_ips'
        },
        (payload: any) => {
          const ip = payload?.new?.ip_address || payload?.old?.ip_address;
          if (ip) {
            const active = payload?.new?.is_active ?? false;
            setBannedSet(prev => {
              const s = new Set(prev);
              if (active) s.add(ip); else s.delete(ip);
              return s;
            });
          } else {
            refreshBanned();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(loginChannel);
      supabase.removeChannel(bannedChannel);
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getDeviceIcon = (deviceType: string) => {
    if (deviceType === 'mobile') return <Smartphone className="w-4 h-4" />;
    if (deviceType === 'tablet') return <Smartphone className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const activeSessions = sessions.filter(s => s.is_active);
  const totalSessions = sessions.length;

  return (
    <div className="min-h-screen bg-background p-6 relative overflow-hidden"
         style={{ background: 'var(--gradient-panda)' }}>
      
      {/* Floating Elements - Saffron themed */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-white/15 rounded-full float-animation z-0 pointer-events-none"></div>
      <div className="absolute top-1/3 right-20 w-12 h-12 bg-white/10 rounded-full bounce-gentle bounce-delay-1 z-0 pointer-events-none"></div>
      <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-white/12 rounded-full float-animation float-delay-2 z-0 pointer-events-none"></div>
      <div className="absolute top-20 left-1/3 w-3 h-3 bg-white/20 rounded-full float-animation pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/3 w-5 h-5 bg-white/15 rounded-full bounce-gentle bounce-delay-2 pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-10 w-2 h-2 bg-white/30 rounded-full float-animation float-delay-1 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => navigate('/admin')}
            variant="outline"
            size="sm"
            className="bg-white/90"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">Login Sessions</h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="backdrop-blur-sm bg-white/90 border-0 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSessions}</div>
              <p className="text-xs text-muted-foreground">All time logins</p>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/90 border-0 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeSessions.length}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/90 border-0 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Countries</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(sessions.map(s => s.country)).size}
              </div>
              <p className="text-xs text-muted-foreground">Different locations</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/90 border-0 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Login</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">
                {sessions.length > 0 ? formatDate(sessions[0].login_time) : 'No logins'}
              </div>
              <p className="text-xs text-muted-foreground">Most recent</p>
            </CardContent>
          </Card>
        </div>

        {/* Sessions Table */}
        <Card className="backdrop-blur-sm bg-white/90 border-0 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>Login Session Details</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading sessions...</div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No login sessions found</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Browser</TableHead>
                      <TableHead>OS</TableHead>
                      <TableHead>Login Time</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <Badge 
                            variant={session.is_active ? "default" : "secondary"}
                            className={session.is_active ? "bg-green-100 text-green-800" : ""}
                          >
                            {session.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getDeviceIcon(session.device_type)}
                            <div>
                              <div className="font-medium">
                                {session.device_vendor || 'Unknown'} {session.device_model || ''}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {session.device_type}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <div>
                              <div className="font-medium">{session.city}</div>
                              <div className="text-sm text-muted-foreground">{session.country}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{session.ip_address}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{session.browser_name}</div>
                            <div className="text-sm text-muted-foreground">v{session.browser_version}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{session.os_name}</div>
                            <div className="text-sm text-muted-foreground">{session.os_version}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(session.login_time)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(session.last_activity)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={!session.ip_address || session.ip_address === 'Unknown'}
                              onClick={() => (bannedSet.has(session.ip_address) ? unbanIp(session.ip_address) : banIp(session.ip_address))}
                            >
                              {bannedSet.has(session.ip_address) ? (
                                <>
                                  <Undo2 className="w-4 h-4 mr-2" /> Unban
                                </>
                              ) : (
                                <>
                                  <Ban className="w-4 h-4 mr-2" /> Ban IP
                                </>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginSessions;