import { Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AccountDiagnostics = () => {
  const accountIssues = [
    { type: 'error', title: 'Account is suspended', action: 'Fix it' },
    { type: 'error', title: 'Account balance is exhausted', action: 'Add funds' },
    { type: 'info', title: 'Campaign has ended', action: 'View details' },
    { type: 'info', title: '1 out of 1 asset group', action: 'View details' },
  ];

  return (
    <Card className="border-[hsl(var(--google-gray-200))]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[hsl(var(--google-gray-600))]" />
            <span className="font-medium">Account diagnostics</span>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-[hsl(var(--google-gray-600))] mb-4">
            Your campaign can't run because its end date has passed
          </p>
          
          <div className="flex gap-2 mb-6">
            <Button variant="outline" size="sm" className="bg-[hsl(var(--google-blue-light))] text-[hsl(var(--google-blue))] border-[hsl(var(--google-blue))] h-8">
              All
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-[hsl(var(--google-gray-600))]">
              Account
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-[hsl(var(--google-gray-600))]">
              Assets
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-[hsl(var(--google-gray-600))]">
              Budget & bidding
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-[hsl(var(--google-gray-600))]">
              Goals
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-[hsl(var(--google-gray-600))]">
              Signals
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {accountIssues.map((issue, index) => (
            <Card key={index} className={`border-l-4 ${
              issue.type === 'error' ? 'border-l-[hsl(var(--google-red))]' : 'border-l-[hsl(var(--google-blue))]'
            } border-[hsl(var(--google-gray-200))]`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-2 mb-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    issue.type === 'error' 
                      ? 'bg-[hsl(var(--google-red)/0.1)] text-[hsl(var(--google-red))]' 
                      : 'bg-[hsl(var(--google-blue)/0.1)] text-[hsl(var(--google-blue))]'
                  }`}>
                    {issue.type === 'error' ? '!' : 'i'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-normal mb-2">{issue.title}</p>
                    <div className="flex flex-col gap-1">
                      <Button variant="link" size="sm" className="p-0 h-auto text-[hsl(var(--google-blue))] justify-start">
                        {issue.action}
                      </Button>
                      <Button variant="link" size="sm" className="p-0 h-auto text-[hsl(var(--google-blue))] justify-start">
                        View details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Button variant="link" className="mt-4 p-0 text-[hsl(var(--google-blue))]">
          View campaign diagnostics
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountDiagnostics;