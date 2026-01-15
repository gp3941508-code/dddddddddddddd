import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Receipt } from 'lucide-react';
import { Ad } from '@/hooks/useAds';
import { useAppSettings } from '@/hooks/useAppSettings';

interface BillingReceiptProps {
  ads: Ad[];
}

const BillingReceipt = ({ ads }: BillingReceiptProps) => {
  const { settings } = useAppSettings();
  const symbol = settings.currencySymbol;
  const totalSpend = ads.reduce((sum, ad) => sum + ad.budget_amount, 0);
  const totalRevenue = ads.reduce((sum, ad) => sum + ad.revenue, 0);
  const tax = totalSpend * 0.18; // 18% GST
  const netTotal = totalSpend + tax;

  const generateReceipt = () => {
    const receiptData = {
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      items: ads.map(ad => ({
        name: ad.name,
        budget: ad.budget_amount,
        clicks: ad.clicks,
        impressions: ad.impressions,
        revenue: ad.revenue
      })),
      subtotal: totalSpend,
      tax,
      total: netTotal,
      gst: '29AAACR0123A1Z5'
    };

    // Create downloadable receipt
    const receiptContent = `
ADVERTISING RECEIPT
==================

Invoice #: ${receiptData.invoiceNumber}
Date: ${receiptData.date}
GST: ${receiptData.gst}

Items:
------
${receiptData.items.map(item => 
  `${item.name}
  Budget: ₹${item.budget}
  Clicks: ${item.clicks}
  Impressions: ${item.impressions}
  Revenue: ₹${item.revenue}
  ---`
).join('\n')}

Subtotal: ${symbol}${receiptData.subtotal.toFixed(2)}
GST (18%): ${symbol}${receiptData.tax.toFixed(2)}
Total: ${symbol}${receiptData.total.toFixed(2)}

Thank you for your business!
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${receiptData.invoiceNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Billing & Receipt
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{symbol}{totalSpend.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Spend</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{symbol}{totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{symbol}{tax.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">GST (18%)</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{symbol}{netTotal.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Net Total</div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Invoice Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Invoice #: INV-{Date.now().toString().slice(-6)}</div>
              <div>Date: {new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div>GST: 29AAACR0123A1Z5</div>
              <div>Payment Status: Paid</div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Campaign Summary</h3>
            <div className="space-y-2">
              {ads.slice(0, 3).map(ad => (
                <div key={ad.id} className="flex justify-between text-sm">
                  <span>{ad.name}</span>
                  <span>{symbol}{ad.budget_amount}</span>
                </div>
              ))}
              {ads.length > 3 && (
                <div className="text-sm text-muted-foreground">
                  +{ads.length - 3} more campaigns
                </div>
              )}
            </div>
          </div>

          <Button onClick={generateReceipt} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingReceipt;