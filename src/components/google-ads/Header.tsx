import { Search, Bell, HelpCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppSettings } from '@/hooks/useAppSettings';

const Header = () => {
  const { settings } = useAppSettings();
  
  return (
    <header className="h-16 border-b bg-background px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search for a page or campaign"
            className="pl-10 w-96 h-10 border-[hsl(var(--google-gray-300))] focus:border-[hsl(var(--google-blue))] focus:ring-[hsl(var(--google-blue))]"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Appearance</span>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <RefreshCw className="w-4 h-4" />
        </Button>
        <span className="text-sm text-muted-foreground">Refresh</span>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <HelpCircle className="w-4 h-4" />
        </Button>
        <span className="text-sm text-muted-foreground">Help</span>
        <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 bg-[hsl(var(--google-red))] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">1</span>
        </Button>
        <span className="text-sm text-muted-foreground">Notifications</span>
        <div className="w-8 h-8 bg-[hsl(var(--google-blue))] rounded-full flex items-center justify-center ml-2">
          <span className="text-white text-sm font-medium">A</span>
        </div>
        <span className="text-sm text-muted-foreground">{settings.contactEmail}</span>
      </div>
    </header>
  );
};

export default Header;