import React from 'react';
import { X } from 'lucide-react';
import { Ad } from '@/hooks/useAds';

interface InvoiceModalProps {
  show: boolean;
  ad: Ad | null;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ show, ad, onClose }) => {
  if (!show || !ad) return null;

  const companyName = "GOOGLE LLC";
  const companyAddr = "1600 Amphitheatre Pkwy\nMountain View, CA 94043\nUnited States";
  const companyTaxId = "77-0493581";
  const billingId = `BILL-${new Date().getFullYear()}-${ad.id.slice(-4).toUpperCase()}`;
  const paymentMethod = "Bank Transfer";
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const downloadInvoice = () => {
    const invoiceContent = `
GOOGLE LLC
1600 Amphitheatre Pkwy
Mountain View, CA 94043
United States

Tax identification number: ${companyTaxId}
Your Company Name

Payment Receipt

Payment date: ${formatDate(ad.created_at)}
Billing ID: ${billingId}
Payment method: ${paymentMethod}
Campaign ID: ${ad.id}

Campaign Details:
Name: ${ad.name}
Status: ${ad.status}
Budget: $${ad.budget_amount} (${ad.budget_period})

Performance Metrics:
Impressions: ${ad.impressions.toLocaleString()}
Clicks: ${ad.clicks.toLocaleString()}
CTR: ${ad.ctr}%
Revenue: $${ad.revenue.toFixed(2)}
Conversions: ${ad.conversions}
Cost per Conversion: $${ad.cost_per_conversion.toFixed(2)}

Total Amount: $${ad.revenue.toFixed(2)}
GST (10%): $${(ad.revenue * 0.1).toFixed(2)}
Net Total: $${(ad.revenue * 1.1).toFixed(2)}

Thank you for your business!
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${ad.name.replace(/\s+/g, '-')}-${ad.id.slice(-4)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="invoice-modal-bg active">
      <div className="invoice-modal">
        <button className="invoice-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="invoice-header-row">
          <div>
            <img
              src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
              alt="Google"
              className="invoice-google-logo"
            />
            <div className="invoice-company-bold">{companyName}</div>
            <div className="invoice-company">
              {companyAddr.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
              <br />
              Tax identification number: {companyTaxId}
            </div>
          </div>
          
          <div className="invoice-details">
            <div className="invoice-h1">Payment Receipt</div>
            <div>
              <span className="invoice-label">Payment date</span>: {formatDate(ad.created_at)}
            </div>
            <div>
              <span className="invoice-label">Billing ID</span>: {billingId}
            </div>
            <div>
              <span className="invoice-label">Payment method</span>: {paymentMethod}
            </div>
            <div>
              <span className="invoice-label">Campaign ID</span>: {ad.id}
            </div>
          </div>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>AdSense Earnings for: {ad.name}</td>
              <td>₹{ad.budget_amount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            onClick={downloadInvoice}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;