import { BarChart3, Target, Users, Wrench, CreditCard, Settings, Goal, TrendingUp, Package, Menu, Plus, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

const campaignSubItems = [
  { icon: BarChart3, label: 'Overview', path: '/' },
  { icon: TrendingUp, label: 'Recommendations', path: '#' },
  { icon: BarChart3, label: 'Insights and reports', path: '/insights' },
  { icon: Target, label: 'Campaigns', path: '/campaigns' },
  { icon: Package, label: 'Assets', path: '#' },
  { icon: Users, label: 'Audiences, keywords, and content', path: '/content' },
  { icon: FileText, label: 'Change history', path: '#' },
];

const mainItems = [
  { icon: Target, label: 'Campaigns', hasSubItems: true },
  { icon: Goal, label: 'Goals', path: '#' },
  { icon: Wrench, label: 'Tools', path: '#' },
  { icon: CreditCard, label: 'Billing', path: '/billing' },
  { icon: Settings, label: 'Admin', path: '/admin' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if current path is in campaigns section
  const isPathInCampaigns = campaignSubItems.some(item => location.pathname === item.path);
  
  // Always keep Campaigns expanded if we're on a campaign-related page
  const [expandedSection, setExpandedSection] = useState<string>('Campaigns');

  const handleMainItemClick = (item: any) => {
    if (item.hasSubItems) {
      setExpandedSection(expandedSection === item.label ? '' : item.label);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const handleSubItemClick = (path: string) => {
    if (path !== '#') {
      navigate(path);
    }
  };

  return (
    <>
      {/* Main Sidebar */}
      <div className="w-[240px] bg-[#f8f9fa] flex flex-col h-screen overflow-hidden" style={{ fontFamily: '"Inter", "Google Sans", sans-serif' }}>
        {/* Top section with Menu icon and Google Ads logo */}
        <div className="px-4 py-3 flex items-center gap-3">
          <Menu className="w-6 h-6 text-gray-700 flex-shrink-0 cursor-pointer hover:bg-gray-200 rounded p-0.5 transition-colors duration-200" />
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/b8d3f88f-0281-4cd7-af50-99a5f1754841.png" 
              alt="Google Ads" 
              className="w-6 h-6"
            />
            <h2 className="text-[22px] font-normal text-[#5f6368]">Google Ads</h2>
          </div>
        </div>
        
        {/* Create button section */}
        <div className="px-4 py-4">
          <button className="w-16 h-16 bg-white rounded-full shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-250 hover:scale-105">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <Plus className="w-6 h-6 text-[#1a73e8]" strokeWidth={3} />
            </div>
          </button>
          <span className="block text-sm text-gray-700 mt-2 ml-1">Create</span>
        </div>
        
        {/* Scrollable navigation area */}
        <ScrollArea className="flex-1">
          <nav className="px-2 pb-4 space-y-1">
            {mainItems.map((item, index) => {
              const isActive = item.path === location.pathname || (item.label === 'Campaigns' && isPathInCampaigns);
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-250 ${
                    isActive
                      ? 'bg-[#1a73e8] text-white' 
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleMainItemClick(item)}
                >
                  <item.icon className="w-6 h-6 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              );
            })}
          </nav>
        </ScrollArea>
      </div>

      {/* Secondary Sidebar Panel for Campaigns Submenu */}
      {expandedSection === 'Campaigns' && (
        <div className="w-[280px] bg-[#f8f9fa] flex flex-col h-screen pt-[140px]" style={{ fontFamily: '"Inter", "Google Sans", sans-serif' }}>
          <ScrollArea className="flex-1">
            <nav className="px-2 pb-4 space-y-1">
              {campaignSubItems.map((subItem, subIndex) => {
                const isSubActive = location.pathname === subItem.path;
                return (
                  <div
                    key={subIndex}
                    className={`flex items-center px-4 py-2.5 rounded-full cursor-pointer transition-all duration-250 ${
                      isSubActive
                        ? 'bg-[#1a73e8] text-white font-medium' 
                        : 'text-gray-700 hover:bg-[#e8f0fe]'
                    }`}
                    onClick={() => handleSubItemClick(subItem.path)}
                  >
                    <span className="text-sm">{subItem.label}</span>
                  </div>
                );
              })}
            </nav>
          </ScrollArea>
        </div>
      )}
    </>
  );
};

export default Sidebar;