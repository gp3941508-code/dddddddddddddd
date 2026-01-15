import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBannedIp } from '@/hooks/useBannedIp';
import { ShieldAlert } from 'lucide-react';

const BannedOverlay = () => {
  const { banned, loading, reason, ip } = useBannedIp();

  useEffect(() => {
    if (banned) {
      document.title = 'Access blocked - Banned';
    }
  }, [banned]);

  if (loading || !banned) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-background/95 backdrop-blur-sm flex items-center justify-center p-6">
      <Card className="max-w-md w-full border-destructive/30 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Access Blocked</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-center">
          <p className="text-muted-foreground">
            Your IP{ip ? ` (${ip})` : ''} has been banned by the administrator.
          </p>
          {reason && (
            <p className="text-sm">
              Reason: <span className="font-medium">{reason}</span>
            </p>
          )}
          <p className="text-sm text-muted-foreground">If you believe this is a mistake, please contact the admin.</p>
          <div className="pt-2">
            <Button variant="secondary" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BannedOverlay;
