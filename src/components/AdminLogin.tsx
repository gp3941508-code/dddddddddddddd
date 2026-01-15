import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AdminLoginProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
  isLocked: boolean;
  lockTimeRemaining: number;
}

const AdminLogin = ({ onLogin, isLocked, lockTimeRemaining }: AdminLoginProps) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`
        }
      });

      if (error) {
        toast({
          title: "Google Login Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login with Google",
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast({
        title: "Account Locked",
        description: `Please wait ${formatTime(lockTimeRemaining)} before trying again`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const success = await onLogin('admin', password);
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to the admin panel",
        });
      } else {
        toast({
          title: "Access Denied", 
          description: "Wrong password. Wait 2 minutes before trying again.",
          variant: "destructive",
        });
        setPassword('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" 
         style={{ background: 'var(--gradient-panda)' }}>
      
      {/* Floating Elements - Saffron themed */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/20 rounded-full float-animation"></div>
      <div className="absolute top-32 right-16 w-16 h-16 bg-white/15 rounded-full bounce-gentle bounce-delay-1"></div>
      <div className="absolute bottom-24 left-20 w-24 h-24 bg-white/10 rounded-full float-animation float-delay-2"></div>
      <div className="absolute top-10 left-1/4 w-4 h-4 bg-white/30 rounded-full float-animation"></div>
      <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-white/20 rounded-full bounce-gentle bounce-delay-2"></div>
      <div className="absolute bottom-1/4 right-10 w-3 h-3 bg-white/40 rounded-full float-animation float-delay-1"></div>
      <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-white/25 rounded-full bounce-gentle"></div>
      <div className="absolute top-1/2 left-16 w-5 h-5 bg-white/35 rounded-full float-animation float-delay-1"></div>
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/90 shadow-2xl pulse-glow border-0 transform hover:scale-105 transition-all duration-300">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bounce-gentle transform transition-all duration-300" 
               style={{ background: 'var(--gradient-panda)' }}>
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Admin Panel
          </CardTitle>
          <p className="text-gray-600 font-medium">Sign in to access the admin dashboard</p>
        </CardHeader>
        <CardContent>
          {isLocked ? (
            <div className="text-center py-8">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 bounce-gentle">
                <Lock className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-600 mb-2">Account Temporarily Locked</h3>
              <p className="text-muted-foreground mb-4">
                Too many failed attempts. Please wait before trying again.
              </p>
              <div className="text-3xl font-mono font-bold text-red-600 pulse-glow">
                {formatTime(lockTimeRemaining)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                The login form will reappear automatically
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-12 border-2 border-gray-200 focus:border-orange-400 rounded-xl transition-all duration-300 hover:shadow-lg"
                    required
                  />
                </div>
                </div>
              
              <Button
                type="submit" 
                className="w-full h-12 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" 
                style={{ background: 'var(--gradient-panda)' }}
                disabled={loading || isLocked}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-12 rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transform hover:scale-105 transition-all duration-300" 
                onClick={handleGoogleLogin}
                disabled={googleLoading || isLocked}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {googleLoading ? "Signing in..." : "Continue with Google"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;