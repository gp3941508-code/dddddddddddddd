import { Sidebar, Header, MetricsGrid } from '@/components/google-ads';
import CampaignsTable from '@/components/google-ads/CampaignsTable';
import CampaignsHeader from '@/components/google-ads/CampaignsHeader';
import { useAds } from '@/hooks/useAds';
import { DateRangeProvider } from '@/contexts/DateRangeContext';

const Campaigns = () => {
  const { ads, loading } = useAds();

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
              <CampaignsHeader />
            </div>
            <div className="mx-6 mt-6">
              <div className="bg-white px-6 py-4 rounded-sm">
                <MetricsGrid />
              </div>
              <div className="mt-6">
                <CampaignsTable ads={ads} loading={loading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DateRangeProvider>
  );
};

export default Campaigns;