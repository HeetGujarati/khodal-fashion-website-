import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';
import { CartDrawer } from './components/cart/CartDrawer';
import { QuickWhatsAppOrderModal } from './components/order/QuickWhatsAppOrderModal';
import { QuickViewModal } from './components/product/QuickViewModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { WishlistPage } from './pages/WishlistPage';
import { Home, Compass, Heart, MessageCircle, ShoppingBag, CheckCircle, AlertCircle, Info } from 'lucide-react';

const MainAppContent = () => {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'shop' | 'product-detail' | 'track' | 'wishlist'
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    return search.includes('admin') || hash.includes('admin') || pathname.includes('admin');
  });

  const { 
    activeToast, 
    cartTotalItems, 
    setIsCartOpen, 
    wishlist, 
    storeConfig 
  } = useStore();

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanPhone = storeConfig.whatsappNumber.replace(/[^0-9]/g, '');

  // Auto-detect admin path, query or hash in URL (e.g. /admin, ?admin=true or #admin)
  React.useEffect(() => {
    const checkAdminQuery = () => {
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      if (search.includes('admin') || hash.includes('admin') || pathname.includes('admin')) {
        setIsAdminOpen(true);
      }
    };
    checkAdminQuery();
    window.addEventListener('hashchange', checkAdminQuery);
    window.addEventListener('popstate', checkAdminQuery);
    return () => {
      window.removeEventListener('hashchange', checkAdminQuery);
      window.removeEventListener('popstate', checkAdminQuery);
    };
  }, []);

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    const hasAdminInUrl = 
      window.location.hash.toLowerCase().includes('admin') || 
      window.location.search.toLowerCase().includes('admin') || 
      window.location.pathname.toLowerCase().includes('admin');
    if (hasAdminInUrl) {
      window.history.replaceState(null, '', '/');
    }
  };

  if (isAdminOpen) {
    return (
      <AdminPortal 
        onBackToStore={handleCloseAdmin}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar 
        onOpenAdmin={() => {
          setIsAdminOpen(true);
          window.location.hash = 'admin';
        }} 
      />

      {/* 2. Luxury Sticky Navbar */}
      <Navbar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenAdmin={() => {
          setIsAdminOpen(true);
          window.location.hash = 'admin';
        }}
      />

      {/* 3. Main Views */}
      <main style={{ flex: 1 }}>
        {currentView === 'home' && (
          <HomePage 
            setCurrentView={setCurrentView}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'shop' && (
          <ShopPage 
            setCurrentView={setCurrentView}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'product-detail' && (
          <ProductDetailPage 
            product={selectedProduct}
            onBack={() => setCurrentView('shop')}
            setCurrentView={setCurrentView}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'track' && (
          <TrackOrderPage />
        )}

        {currentView === 'wishlist' && (
          <WishlistPage 
            setCurrentView={setCurrentView}
            onSelectProduct={handleSelectProduct}
          />
        )}
      </main>

      {/* 4. Luxury Footer */}
      <Footer 
        setCurrentView={setCurrentView} 
        onOpenAdmin={() => {
          setIsAdminOpen(true);
          window.location.hash = 'admin';
        }}
      />

      {/* 5. Persistent Floating WhatsApp Widget */}
      <FloatingWhatsApp />

      {/* 6. Slide-out Cart Drawer */}
      <CartDrawer />

      {/* 7. Express WhatsApp Order Modal */}
      <QuickWhatsAppOrderModal />

      {/* 8. Quick View Modal */}
      <QuickViewModal />

      {/* 10. Toast Notification */}
      {activeToast && (
        <div className="toast-container">
          {activeToast.type === 'success' && <CheckCircle size={18} color="var(--wa-green)" />}
          {activeToast.type === 'error' && <AlertCircle size={18} color="#EF4444" />}
          {activeToast.type === 'info' && <Info size={18} color="var(--gold-primary)" />}
          <span>{activeToast.message}</span>
        </div>
      )}

      {/* 11. Mobile Bottom Quick Bar */}
      <div 
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '0.5rem 1rem',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 890,
          boxShadow: '0 -4px 16px rgba(0,0,0,0.04)'
        }}
        className="d-md-none"
      >
        <button
          onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{ background: 'none', border: 'none', color: currentView === 'home' ? 'var(--gold-primary)' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
        >
          <Home size={18} />
          <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>Home</span>
        </button>

        <button
          onClick={() => { setCurrentView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{ background: 'none', border: 'none', color: currentView === 'shop' ? 'var(--gold-primary)' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
        >
          <Compass size={18} />
          <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>Explore</span>
        </button>

        <a
          href={`https://api.whatsapp.com/send?phone=91${cleanPhone}&text=Hello!%20I%20want%20to%20order%20a%20watch.`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: 'var(--wa-gradient)', width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', boxShadow: 'var(--shadow-wa)', marginTop: '-14px', border: '2px solid #FFF' }}
        >
          <MessageCircle size={22} />
        </a>

        <button
          onClick={() => { setCurrentView('wishlist'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{ background: 'none', border: 'none', color: currentView === 'wishlist' ? 'var(--gold-primary)' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer', position: 'relative' }}
        >
          <Heart size={18} />
          {wishlist.length > 0 && (
            <span style={{ position: 'absolute', top: -2, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#E11D48' }} />
          )}
          <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>Saved</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer', position: 'relative' }}
        >
          <ShoppingBag size={18} />
          {cartTotalItems > 0 && (
            <span style={{ position: 'absolute', top: -4, right: 4, background: 'var(--gold-primary)', color: '#FFF', borderRadius: '50%', width: 16, height: 16, fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cartTotalItems}
            </span>
          )}
          <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>Cart</span>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
