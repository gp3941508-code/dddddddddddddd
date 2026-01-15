import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Search, Grid, Download, Expand, Receipt, ChevronDown, ChevronRight, Info } from 'lucide-react';
import { Ad, useAds } from '@/hooks/useAds';
import InlineEdit from '@/components/admin/InlineEdit';
import InvoiceModal from '@/components/admin/InvoiceModal';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { useAppSettings } from '@/hooks/useAppSettings';


interface CampaignsTableProps {
  ads: Ad[];
  loading: boolean;
}

const CampaignsTable = ({ ads, loading }: CampaignsTableProps) => {
  const { updateAd, toggleAdStatus } = useAds();
  const [selectedAdForInvoice, setSelectedAdForInvoice] = useState<Ad | null>(null);
  const [expandedDrafts, setExpandedDrafts] = useState(false);
  const [expandedAccount, setExpandedAccount] = useState(true);
  const { settings } = useAppSettings();
  const symbol = settings.currencySymbol;

  // Separate active/paused ads from ended/draft ads
  const activeAds = ads.filter(ad => ad.status === 'active' || ad.status === 'paused');
  const draftAds = ads.filter(ad => ad.status === 'ended');

  const handleInlineEdit = async (adId: string, field: string, value: string | number) => {
    try {
      await updateAd(adId, { [field]: value });
      toast({
        title: "Success",
        description: `${field} updated successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update ${field}`,
        variant: "destructive",
      });
    }
  };

  const handleToggleAdStatus = async (adId: string) => {
    try {
      await toggleAdStatus(adId);
      toast({
        title: "Success",
        description: "Ad status updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ad status",
        variant: "destructive",
      });
    }
  };

  // Calculate totals from real data
  const totalClicks = activeAds.reduce((sum, ad) => sum + ad.clicks, 0);
  const totalImpressions = activeAds.reduce((sum, ad) => sum + ad.impressions, 0);
  const totalRevenue = activeAds.reduce((sum, ad) => sum + ad.revenue, 0);
  const totalConversions = activeAds.reduce((sum, ad) => sum + ad.conversions, 0);
  const avgCpc = totalClicks > 0 ? totalRevenue / totalClicks : 0;
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const costPerConv = totalConversions > 0 ? totalRevenue / totalConversions : 0;

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-sm text-muted-foreground hover:text-foreground">
            <CheckSquare className="w-4 h-4 mr-1" />
            Add filter
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Grid className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Expand className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border rounded-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f8f9fa] hover:bg-[#f8f9fa]">
              <TableHead className="w-8 pl-4">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
              </TableHead>
              <TableHead className="w-8"></TableHead>
              <TableHead className="font-medium text-[#5f6368] text-xs">Campaign</TableHead>
              <TableHead className="font-medium text-[#5f6368] text-xs">Budget</TableHead>
              <TableHead className="font-medium text-[#5f6368] text-xs">Status</TableHead>
              <TableHead className="font-medium text-[#5f6368] text-xs w-[90px]">
                <div className="flex items-center gap-1">
                  Optimization score
                  <Info className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead className="font-medium text-[#5f6368] text-xs">Campaign type</TableHead>
              <TableHead className="font-medium text-[#5f6368] text-xs text-right">Clicks</TableHead>
              <TableHead className="font-medium text-[#5f6368] text-xs text-right">Impr.</TableHead>
              <TableHead className="font-medium text-[#5f6368] text-xs text-right">CTR</TableHead>
              <TableHead className="font-medium text-[#5f6368] text-xs text-right">Avg. CPC</TableHead>
              <TableHead className="font-medium text-[#5f6368] text-xs text-right whitespace-nowrap">Cost</TableHead>
              <TableHead className="font-medium text-[#5f6368] text-xs">Bid strategy type</TableHead>
              <TableHead className="font-medium text-[#5f6368] text-xs text-right">Conv. rate</TableHead>
              <TableHead className="font-medium text-[#5f6368] text-xs text-right">Conversions</TableHead>
              <TableHead className="font-medium text-[#5f6368] text-xs text-right">Cost / conv.</TableHead>
              <TableHead className="font-medium text-[#5f6368] text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={17} className="text-center py-8 text-sm text-muted-foreground">
                  Loading campaigns...
                </TableCell>
              </TableRow>
            ) : (
              <>
                {/* Drafts in progress section */}
                {draftAds.length > 0 && (
                  <>
                    <TableRow 
                      className="bg-[#e8f0fe] hover:bg-[#d2e3fc] cursor-pointer"
                      onClick={() => setExpandedDrafts(!expandedDrafts)}
                    >
                      <TableCell className="pl-4">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                      </TableCell>
                      <TableCell>
                        {expandedDrafts ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </TableCell>
                      <TableCell colSpan={15} className="font-medium text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                          Drafts in progress: {draftAds.length}
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedDrafts && draftAds.map((ad) => (
                      <TableRow key={ad.id} className="hover:bg-[#f8f9fa]">
                        <TableCell className="pl-4">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                        </TableCell>
                        <TableCell>
                          <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                        </TableCell>
                        <TableCell className="text-[#1a73e8] hover:underline cursor-pointer text-sm">
                          <InlineEdit 
                            value={ad.name}
                            onSave={(value) => handleInlineEdit(ad.id, 'name', value)}
                          />
                        </TableCell>
                        <TableCell className="text-sm text-[#5f6368]">
                          {symbol}{ad.budget_amount}/{ad.budget_period}
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive" className="text-xs bg-red-100 text-red-700 hover:bg-red-100">
                            Ended
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-center">—</TableCell>
                        <TableCell className="text-sm text-[#5f6368]">Performance Max</TableCell>
                        <TableCell className="text-sm text-right">{ad.clicks}</TableCell>
                        <TableCell className="text-sm text-right">{ad.impressions.toLocaleString()}</TableCell>
                        <TableCell className="text-sm text-right">{ad.ctr.toFixed(2)}%</TableCell>
                        <TableCell className="text-sm text-right">{symbol}{(ad.revenue / ad.clicks || 0).toFixed(2)}</TableCell>
                        <TableCell className="text-sm text-right">{symbol}{ad.revenue.toFixed(2)}</TableCell>
                        <TableCell className="text-[#1a73e8] hover:underline cursor-pointer text-sm">
                          Maximise conversions
                        </TableCell>
                        <TableCell className="text-sm text-right">{ad.ctr.toFixed(2)}%</TableCell>
                        <TableCell className="text-sm text-right">{ad.conversions}</TableCell>
                        <TableCell className="text-sm text-right">{symbol}{ad.cost_per_conversion.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedAdForInvoice(ad)}
                            className="text-[#1a73e8] hover:text-[#1557b0] h-7"
                          >
                            <Receipt className="w-3 h-3 mr-1" />
                            Invoice
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}

                {/* Active/Paused Campaigns */}
                {activeAds.length === 0 && draftAds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={17} className="text-center py-8 text-sm text-muted-foreground">
                      No campaigns found. Create your first ad in the Admin panel!
                    </TableCell>
                  </TableRow>
                ) : (
                  activeAds.map((ad) => (
                    <TableRow key={ad.id} className="hover:bg-[#f8f9fa]">
                      <TableCell className="pl-4">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                      </TableCell>
                      <TableCell>
                        <span className={`w-2 h-2 rounded-full inline-block ${ad.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      </TableCell>
                      <TableCell className="text-[#1a73e8] hover:underline cursor-pointer text-sm font-medium">
                        <InlineEdit 
                          value={ad.name}
                          onSave={(value) => handleInlineEdit(ad.id, 'name', value)}
                        />
                      </TableCell>
                      <TableCell className="text-sm text-[#5f6368]">
                        <InlineEdit 
                          value={ad.budget_amount}
                          onSave={(value) => handleInlineEdit(ad.id, 'budget_amount', value)}
                          type="number"
                          prefix={symbol}
                          suffix={`/${ad.budget_period}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch 
                            checked={ad.status === 'active'}
                            onCheckedChange={() => handleToggleAdStatus(ad.id)}
                            className="scale-75"
                          />
                          <Badge 
                            variant={ad.status === 'active' ? 'default' : 'secondary'}
                            className={`text-xs ${ad.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-100'}`}
                          >
                            {ad.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-center">—</TableCell>
                      <TableCell className="text-sm text-[#5f6368]">Performance Max</TableCell>
                      <TableCell className="text-sm text-right">
                        <InlineEdit 
                          value={ad.clicks}
                          onSave={(value) => handleInlineEdit(ad.id, 'clicks', value)}
                          type="number"
                        />
                      </TableCell>
                      <TableCell className="text-sm text-right">
                        <InlineEdit 
                          value={ad.impressions}
                          onSave={(value) => handleInlineEdit(ad.id, 'impressions', value)}
                          type="number"
                        />
                      </TableCell>
                      <TableCell className="text-sm text-right">
                        <InlineEdit 
                          value={ad.ctr.toFixed(1)}
                          onSave={(value) => handleInlineEdit(ad.id, 'ctr', value)}
                          type="number"
                          suffix="%"
                        />
                      </TableCell>
                      <TableCell className="text-sm text-right">
                        <InlineEdit 
                          value={(ad.revenue / ad.clicks || 0).toFixed(2)}
                          onSave={(value) => handleInlineEdit(ad.id, 'cpc', value)}
                          type="number"
                          prefix={symbol}
                        />
                      </TableCell>
                      <TableCell className="text-sm text-right">
                        <InlineEdit 
                          value={ad.revenue}
                          onSave={(value) => handleInlineEdit(ad.id, 'revenue', value)}
                          type="number"
                          prefix={symbol}
                        />
                      </TableCell>
                      <TableCell className="text-[#1a73e8] hover:underline cursor-pointer text-sm">
                        Maximise conversions
                      </TableCell>
                      <TableCell className="text-sm text-right">{ad.ctr.toFixed(2)}%</TableCell>
                      <TableCell className="text-sm text-right">
                        <InlineEdit 
                          value={ad.conversions}
                          onSave={(value) => handleInlineEdit(ad.id, 'conversions', value)}
                          type="number"
                        />
                      </TableCell>
                      <TableCell className="text-sm text-right">
                        <InlineEdit 
                          value={ad.cost_per_conversion.toFixed(2)}
                          onSave={(value) => handleInlineEdit(ad.id, 'cost_per_conversion', value)}
                          type="number"
                          prefix={symbol}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAdForInvoice(ad)}
                          className="text-[#1a73e8] hover:text-[#1557b0] h-7"
                        >
                          <Receipt className="w-3 h-3 mr-1" />
                          Invoice
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}

                {/* Total: Campaigns in your current view */}
                {activeAds.length > 0 && (
                  <TableRow className="bg-[#f8f9fa] hover:bg-[#f8f9fa] border-t-2">
                    <TableCell className="pl-4"></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-sm font-medium text-[#5f6368]" colSpan={5}>
                      Total: Campaigns in your current view
                    </TableCell>
                    <TableCell className="text-sm text-right font-medium">{totalClicks.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-right font-medium">{totalImpressions.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-right font-medium">{avgCtr.toFixed(2)}%</TableCell>
                    <TableCell className="text-sm text-right font-medium">{symbol}{avgCpc.toFixed(2)}</TableCell>
                    <TableCell className="text-sm text-right font-medium">{symbol}{totalRevenue.toFixed(2)}</TableCell>
                    <TableCell className="text-sm">—</TableCell>
                    <TableCell className="text-sm text-right font-medium">{avgCtr.toFixed(2)}%</TableCell>
                    <TableCell className="text-sm text-right font-medium">{totalConversions}</TableCell>
                    <TableCell className="text-sm text-right font-medium">{symbol}{costPerConv.toFixed(2)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}

                {/* Total Account */}
                <TableRow 
                  className="bg-white hover:bg-[#f8f9fa] cursor-pointer border-t"
                  onClick={() => setExpandedAccount(!expandedAccount)}
                >
                  <TableCell className="pl-4">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  </TableCell>
                  <TableCell>
                    {expandedAccount ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </TableCell>
                  <TableCell className="text-sm font-medium flex items-center gap-2">
                    Total Account
                    <Info className="w-3 h-3 text-[#5f6368]" />
                  </TableCell>
                  <TableCell className="text-sm text-[#5f6368]">{symbol}{activeAds.reduce((sum, ad) => sum + ad.budget_amount, 0)}/day</TableCell>
                  <TableCell colSpan={3} className="text-sm">—</TableCell>
                  <TableCell className="text-sm text-right font-medium">{totalClicks.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-right font-medium">{totalImpressions.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-right font-medium">{avgCtr.toFixed(2)}%</TableCell>
                  <TableCell className="text-sm text-right font-medium">{symbol}{avgCpc.toFixed(2)}</TableCell>
                  <TableCell className="text-sm text-right font-medium">{symbol}{totalRevenue.toFixed(2)}</TableCell>
                  <TableCell className="text-sm">—</TableCell>
                  <TableCell className="text-sm text-right font-medium">{avgCtr.toFixed(2)}%</TableCell>
                  <TableCell className="text-sm text-right font-medium">{totalConversions}</TableCell>
                  <TableCell className="text-sm text-right font-medium">{symbol}{costPerConv.toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>

                {/* Total: Performance Max campaigns */}
                {expandedAccount && activeAds.length > 0 && (
                  <TableRow className="bg-[#f8f9fa] hover:bg-[#f8f9fa]">
                    <TableCell className="pl-4"></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-sm font-medium text-[#5f6368]" colSpan={5}>
                      <div className="flex items-center gap-2 pl-4">
                        Total: Performance Max campaigns
                        <Info className="w-3 h-3" />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-right font-medium">{totalClicks.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-right font-medium">{totalImpressions.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-right font-medium">{avgCtr.toFixed(2)}%</TableCell>
                    <TableCell className="text-sm text-right font-medium">{symbol}{avgCpc.toFixed(2)}</TableCell>
                    <TableCell className="text-sm text-right font-medium">{symbol}{totalRevenue.toFixed(2)}</TableCell>
                    <TableCell className="text-sm">—</TableCell>
                    <TableCell className="text-sm text-right font-medium">{avgCtr.toFixed(2)}%</TableCell>
                    <TableCell className="text-sm text-right font-medium">{totalConversions}</TableCell>
                    <TableCell className="text-sm text-right font-medium">{symbol}{costPerConv.toFixed(2)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>

        {/* Bottom info */}
        <div className="border-t px-4 py-3 text-xs text-[#5f6368] bg-white space-y-1">
          <p className="flex items-center gap-1">
            <span className="font-medium">Reporting is not real-time.</span> Time zone for all data and times: (GMT+05:30) India Standard Time.
            <span className="text-[#1a73e8] hover:underline cursor-pointer">Learn more</span>
          </p>
          <p>Some inventory may be provided through third party intermediaries.</p>
          <p>You'll see Media Rating Council (MRC) accreditation noted in the column header's hover text for accredited metrics.</p>
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        show={!!selectedAdForInvoice}
        ad={selectedAdForInvoice}
        onClose={() => setSelectedAdForInvoice(null)}
      />
    </div>
  );
};

export default CampaignsTable;