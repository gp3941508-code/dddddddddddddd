import { Sidebar, Header } from '@/components/google-ads';
import BillingDataEditor from '@/components/admin/BillingDataEditor';

const AdminBillingEdit = () => {
  return (
    <div className="flex h-screen bg-background relative overflow-hidden" 
         style={{ background: 'var(--gradient-panda)' }}>
      
      {/* Floating Elements - Saffron themed */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-white/15 rounded-full float-animation z-0 pointer-events-none"></div>
      <div className="absolute top-1/3 right-20 w-12 h-12 bg-white/10 rounded-full bounce-gentle bounce-delay-1 z-0 pointer-events-none"></div>
      <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-white/12 rounded-full float-animation float-delay-2 z-0 pointer-events-none"></div>
      <div className="absolute top-20 left-1/3 w-3 h-3 bg-white/20 rounded-full float-animation pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/3 w-5 h-5 bg-white/15 rounded-full bounce-gentle bounce-delay-2 pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-10 w-2 h-2 bg-white/30 rounded-full float-animation float-delay-1 pointer-events-none"></div>

      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10">
        <Header />

        <div className="flex-1 p-6 overflow-auto">
          <BillingDataEditor />
        </div>
      </div>
    </div>
  );
};

export default AdminBillingEdit;