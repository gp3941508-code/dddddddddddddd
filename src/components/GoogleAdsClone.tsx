import { Card, CardContent } from '@/components/ui/card';
import { Sidebar, Header, TopControls, MetricsGrid, AccountDiagnostics, DataChart } from './google-ads';
import { DateRangeProvider } from '@/contexts/DateRangeContext';

const GoogleAdsClone = () => {
  return (
    <DateRangeProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Header />

          {/* Content */}
          <div className="flex-1 overflow-auto bg-[#f8f9fa]">
            <div className="p-6 pb-0">
              <TopControls />
            </div>
            <div className="bg-white mx-6 mt-6 px-6 pb-6">
              <MetricsGrid />
              <DataChart />
            </div>
            <div className="p-6">
              <AccountDiagnostics />
            </div>
          </div>
        </div>
      </div>
    </DateRangeProvider>
  );
};

export default GoogleAdsClone;
