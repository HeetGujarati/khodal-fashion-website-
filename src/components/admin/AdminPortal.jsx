import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Watch, 
  ShoppingBag, 
  Settings, 
  Cloud, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Search, 
  Save, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  Boxes, 
  Zap, 
  RefreshCw,
  Menu,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ImageUploadDropzone } from './ImageUploadDropzone';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  testSupabaseConnection, 
  isSupabaseConfigured 
} from '../../lib/supabase';

export const AdminPortal = ({ onBackToStore }) => {
  const { 
    storeConfig, 
    setStoreConfig, 
    products, 
    setProducts, 
    categories: _categories, 
    showToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'add-product' | 'orders' | 'supabase' | 'settings'
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Supabase Settings Form
  const [supabaseForm, setSupabaseForm] = useState(getSupabaseConfig());
  const [supabaseTestStatus, setSupabaseTestStatus] = useState(null);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);

  // Store Settings Form
  const [configForm, setConfigForm] = useState({ ...storeConfig });

  // Add Product Form State
  const [newWatch, setNewWatch] = useState({
    title: '',
    brand: 'Khodal Fashion',
    category: 'mens-watches',
    price: '',
    originalPrice: '',
    stock: 5,
    images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900'],
    description: 'Master craftsmanship luxury timepiece engineered with high-precision movement and solid 316L stainless steel bracelet.',
    movement: 'High-Precision Calibre',
    caseDiameter: '42mm',
    glass: 'Sapphire Crystal Anti-Reflective',
    waterResistance: '5 ATM / 50m',
    strap: 'Solid 316L Stainless Steel'
  });


  // Load orders from localStorage
  const savedOrders = JSON.parse(
    localStorage.getItem('khodal_orders') || 
    localStorage.getItem('ditya_orders') || 
    '[]'
  );

  // Sync config form if storeConfig updates
  useEffect(() => {
    setConfigForm({ ...storeConfig });
  }, [storeConfig]);

  // Statistics
  const totalStockCount = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalCatalogValue = products.reduce((acc, p) => acc + ((p.price || 0) * (p.stock || 1)), 0);
  const totalOrdersAmount = savedOrders.reduce((acc, o) => acc + (o.totalAmount || o.price || 0), 0);

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(productSearch.toLowerCase()) || 
                          (p.brand && p.brand.toLowerCase().includes(productSearch.toLowerCase())) ||
                          (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCat = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Handler: Save Store Settings
  const handleSaveStoreSettings = (e) => {
    e.preventDefault();
    setStoreConfig(configForm);
    showToast('Store & WhatsApp configurations saved!', 'success');
  };

  // Handler: Save Supabase Credentials
  const handleSaveSupabase = (e) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseForm);
    showToast('Supabase settings saved! Ready for image uploads.', 'success');
  };

  const handleTestSupabase = async () => {
    setIsTestingSupabase(true);
    setSupabaseTestStatus(null);
    saveSupabaseConfig(supabaseForm);
    const res = await testSupabaseConnection();
    setSupabaseTestStatus(res);
    setIsTestingSupabase(false);
  };

  // Handler: Add Watch to Catalog
  const handleAddWatch = (e) => {
    e.preventDefault();
    if (!newWatch.title || !newWatch.price) {
      showToast('Watch title and price are mandatory.', 'error');
      return;
    }

    const priceNum = parseInt(newWatch.price, 10);
    const origNum = parseInt(newWatch.originalPrice || (priceNum * 4), 10);

    const productToAdd = {
      id: `watch-${Date.now()}`,
      title: newWatch.title,
      brand: newWatch.brand || 'Khodal Fashion',
      category: newWatch.category,
      sku: `KF-${Math.floor(1000 + Math.random() * 9000)}`,
      price: priceNum,
      originalPrice: origNum,
      discountPercent: Math.round(((origNum - priceNum) / origNum) * 100),
      stock: parseInt(newWatch.stock, 10) || 5,
      rating: 5.0,
      reviewsCount: 14,
      images: [newWatch.images[0] || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900'],
      description: newWatch.description,
      variants: [{ name: 'Standard Edition', inStock: true }],
      specs: {
        movement: newWatch.movement,
        caseDiameter: newWatch.caseDiameter,
        glass: newWatch.glass,
        waterResistance: newWatch.waterResistance,
        strap: newWatch.strap
      }
    };

    setProducts([productToAdd, ...products]);
    showToast(`Watch "${productToAdd.title}" added to store catalog!`, 'success');
    
    // Reset form
    setNewWatch({
      title: '',
      brand: 'Khodal Fashion',
      category: 'mens-watches',
      price: '',
      originalPrice: '',
      stock: 5,
      images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900'],
      description: 'Master craftsmanship luxury timepiece engineered with high-precision movement and solid 316L stainless steel bracelet.',
      movement: 'High-Precision Calibre',
      caseDiameter: '42mm',
      glass: 'Sapphire Crystal Anti-Reflective',
      waterResistance: '5 ATM / 50m',
      strap: 'Solid 316L Stainless Steel'
    });

    setActiveTab('products');
  };

  const handleDeleteProduct = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setProducts(products.filter(p => p.id !== id));
      showToast(`Removed "${title}" from catalog.`, 'info');
    }
  };


  const hasCloud = isSupabaseConfigured();

  return (
    <div className="admin-portal">
      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="admin-sidebar-backdrop d-lg-none" 
          onClick={() => setIsMobileSidebarOpen(false)} 
        />
      )}

      {/* 1. LEFT SIDEBAR (Slide-over drawer on mobile, sticky on desktop) */}
      <aside className={`admin-sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'linear-gradient(135deg, #D4AF37 0%, #AA820A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(212, 175, 55, 0.3)' }}>
              <Watch size={22} color="#FFFFFF" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, letterSpacing: '0.04em', color: '#FFFFFF' }}>KHODAL FASHION</h2>
              <span style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Store Control Portal</span>
            </div>
          </div>
          <button 
            className="d-lg-none" 
            onClick={() => setIsMobileSidebarOpen(false)}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', padding: '4px' }}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '1.25rem 0.85rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
          <button
            onClick={() => { setActiveTab('overview'); setIsMobileSidebarOpen(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'overview' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
              color: activeTab === 'overview' ? '#FACC15' : '#94A3B8',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <LayoutDashboard size={18} />
            <span>Overview & Stats</span>
          </button>

          <button
            onClick={() => { setActiveTab('products'); setIsMobileSidebarOpen(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'products' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
              color: activeTab === 'products' ? '#FACC15' : '#94A3B8',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Watch size={18} />
              <span>Watch Inventory</span>
            </div>
            <span style={{ background: '#334155', color: '#E2E8F0', padding: '2px 7px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700 }}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('add-product'); setIsMobileSidebarOpen(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'add-product' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
              color: activeTab === 'add-product' ? '#FACC15' : '#94A3B8',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <Plus size={18} />
            <span>Add New Watch</span>
          </button>

          <button
            onClick={() => { setActiveTab('orders'); setIsMobileSidebarOpen(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'orders' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
              color: activeTab === 'orders' ? '#FACC15' : '#94A3B8',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShoppingBag size={18} />
              <span>WhatsApp Orders</span>
            </div>
            <span style={{ background: '#334155', color: '#E2E8F0', padding: '2px 7px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700 }}>
              {savedOrders.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('supabase'); setIsMobileSidebarOpen(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'supabase' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
              color: activeTab === 'supabase' ? '#FACC15' : '#94A3B8',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Cloud size={18} />
              <span>Supabase Cloud</span>
            </div>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: hasCloud ? '#22C55E' : '#F59E0B' }} />
          </button>

          <button
            onClick={() => { setActiveTab('settings'); setIsMobileSidebarOpen(false); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'settings' ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
              color: activeTab === 'settings' ? '#FACC15' : '#94A3B8',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
          >
            <Settings size={18} />
            <span>Store & WhatsApp Settings</span>
          </button>
        </nav>

        {/* Bottom Sidebar: Return to Storefront */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid #1E293B', background: '#090D16' }}>
          <button
            onClick={onBackToStore}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #D4AF37 0%, #AA820A 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={16} />
            <span>View Live Storefront</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            <button 
              className="btn-icon d-lg-none" 
              onClick={() => setIsMobileSidebarOpen(true)}
              style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#0F172A', display: 'flex', flexShrink: 0 }}
              title="Open Navigation Menu"
              aria-label="Open sidebar menu"
            >
              <Menu size={18} />
            </button>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0F172A', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeTab === 'overview' && 'Executive Store Overview'}
                {activeTab === 'products' && 'Watch Inventory & Catalog'}
                {activeTab === 'add-product' && 'Add New Luxury Watch'}
                {activeTab === 'orders' && 'WhatsApp Orders History'}
                {activeTab === 'supabase' && 'Supabase Cloud Sync'}
                {activeTab === 'settings' && 'Storefront Configurations'}
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            {/* Supabase status badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: hasCloud ? '#F0FDF4' : '#FFFBEB', border: `1px solid ${hasCloud ? '#BBF7D0' : '#FDE68A'}`, padding: '4px 8px', borderRadius: '20px', fontSize: '0.74rem', color: hasCloud ? '#166534' : '#B45309', fontWeight: 600 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: hasCloud ? '#22C55E' : '#F59E0B' }} />
              <span className="d-none d-md-inline">{hasCloud ? 'Supabase Connected' : 'Local Mode'}</span>
            </div>

            <button
              onClick={() => setActiveTab('add-product')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                background: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <Plus size={15} />
              <span>Add Watch</span>
            </button>
          </div>
        </header>

        {/* Tab Contents */}
        <div className="admin-content">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Stat Cards */}
              <div className="admin-stat-grid">
                <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Active Catalog</span>
                    <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Watch size={18} color="#D4AF37" />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>{products.length}</h3>
                  <span style={{ fontSize: '0.74rem', color: '#16A34A', fontWeight: 600 }}>● WhatsApp Ready</span>
                </div>

                <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Physical Stock</span>
                    <div style={{ width: 36, height: 36, borderRadius: '8px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Boxes size={18} color="#16A34A" />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>{totalStockCount}</h3>
                  <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Surat Boutique</span>
                </div>

                <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Catalog Value</span>
                    <div style={{ width: 36, height: 36, borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <DollarSign size={18} color="#2563EB" />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>₹{totalCatalogValue.toLocaleString('en-IN')}</h3>
                  <span style={{ fontSize: '0.74rem', color: '#2563EB', fontWeight: 600 }}>Importer Pricing</span>
                </div>

                <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Orders Logged</span>
                    <div style={{ width: 36, height: 36, borderRadius: '8px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MessageCircle size={18} color="#15803D" />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>{savedOrders.length}</h3>
                  <span style={{ fontSize: '0.74rem', color: '#15803D', fontWeight: 600 }}>₹{totalOrdersAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Quick Actions & Recent Inventory */}
              <div className="admin-two-col">
                <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Recent Inventory Watches</h3>
                    <button onClick={() => setActiveTab('products')} style={{ background: 'none', border: 'none', color: '#D4AF37', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
                      View All ({products.length}) →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {products.slice(0, 5).map(prod => (
                      <div key={prod.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img src={prod.images[0]} alt={prod.title} style={{ width: 44, height: 44, borderRadius: '8px', objectFit: 'cover' }} />
                          <div>
                            <strong style={{ fontSize: '0.88rem', color: '#0F172A' }}>{prod.title}</strong>
                            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.74rem', color: '#64748B' }}>
                              <span>SKU: {prod.sku}</span>
                              <span>•</span>
                              <span style={{ textTransform: 'capitalize' }}>{prod.category}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.92rem' }}>₹{prod.price?.toLocaleString('en-IN')}</div>
                          <span style={{ fontSize: '0.72rem', background: '#DCFCE7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                            Stock: {prod.stock}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Storage & Compression Status Box */}
                <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Bandwidth & Storage Setup</h3>
                  
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <Zap size={16} color="#16A34A" />
                      <strong style={{ fontSize: '0.86rem' }}>Smart WebP Compression</strong>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                      Active for all uploads. Reduces 5MB+ photos to ~200KB while preserving razor-sharp 4K watch dial details.
                    </p>
                  </div>

                  <div style={{ background: hasCloud ? '#F0FDF4' : '#FFFBEB', border: `1px solid ${hasCloud ? '#BBF7D0' : '#FDE68A'}`, borderRadius: '10px', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <Cloud size={16} color={hasCloud ? '#166534' : '#D97706'} />
                      <strong style={{ fontSize: '0.86rem', color: hasCloud ? '#166534' : '#92400E' }}>
                        {hasCloud ? 'Supabase Storage Active' : 'Supabase Not Configured'}
                      </strong>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: hasCloud ? '#166534' : '#92400E', margin: 0, lineHeight: 1.5 }}>
                      {hasCloud 
                        ? `Bucket: ${supabaseForm.bucket || 'watch-images'} is ready for cloud hosting.` 
                        : 'Currently using local compressed storage. Configure Supabase in the tab for permanent cloud hosting.'}
                    </p>
                    <button
                      onClick={() => setActiveTab('supabase')}
                      style={{ marginTop: '0.75rem', background: '#0F172A', color: '#FFF', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      {hasCloud ? 'Manage Supabase' : 'Configure Supabase →'}
                    </button>
                  </div>

                  <div style={{ marginTop: 'auto', background: '#F1F5F9', padding: '0.85rem', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#475569', display: 'block', marginBottom: '0.35rem' }}>
                      <strong>WhatsApp Order Receiver:</strong>
                    </span>
                    <strong style={{ fontSize: '0.92rem', color: '#0F172A' }}>+91 {storeConfig.whatsappNumber}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS INVENTORY */}
          {activeTab === 'products' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Filter and Search Bar */}
              <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.45rem 0.85rem', flex: 1, minWidth: '220px' }}>
                  <Search size={16} color="#64748B" />
                  <input
                    type="text"
                    placeholder="Search by watch name, brand, or SKU..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.86rem' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    style={{ padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFFFFF', fontSize: '0.84rem', fontWeight: 600, color: '#334155' }}
                  >
                    <option value="all">All Categories ({products.length})</option>
                    <option value="mens-watches">Men's Luxury</option>
                    <option value="automatic">Automatic & Skeleton</option>
                    <option value="chronograph">Chronograph & Sports</option>
                    <option value="ladies-watches">Ladies Elegance</option>
                    <option value="luxury-limited">Masterpiece & Limited</option>
                  </select>

                  <button
                    onClick={() => setActiveTab('add-product')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #D4AF37 0%, #AA820A 100%)', color: '#FFFFFF', border: 'none', padding: '0.55rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer' }}
                  >
                    <Plus size={16} />
                    <span>Add New Watch</span>
                  </button>
                </div>
              </div>

              {/* Products Table with Smooth Mobile Horizontal Scrolling */}
              <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', minWidth: '660px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '1rem 1.25rem' }}>Watch Details</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Category</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Selling Price</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Stock</th>
                      <th style={{ padding: '1rem 1.25rem' }}>Movement / Specs</th>
                      <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s ease' }}>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img 
                              src={prod.images[0]} 
                              alt={prod.title} 
                              style={{ width: 50, height: 50, borderRadius: '8px', objectFit: 'cover', border: '1px solid #E2E8F0' }} 
                            />
                            <div>
                              <strong style={{ fontSize: '0.92rem', color: '#0F172A', display: 'block' }}>{prod.title}</strong>
                              <span style={{ fontSize: '0.74rem', color: '#64748B' }}>SKU: {prod.sku} • {prod.brand}</span>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span style={{ background: '#F1F5F9', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 600, textTransform: 'capitalize' }}>
                            {prod.category}
                          </span>
                        </td>

                        <td style={{ padding: '1rem 1.25rem' }}>
                          <strong style={{ color: '#0F172A', fontSize: '0.95rem' }}>₹{prod.price?.toLocaleString('en-IN')}</strong>
                          {prod.originalPrice && (
                            <del style={{ display: 'block', fontSize: '0.74rem', color: '#94A3B8' }}>
                              ₹{prod.originalPrice.toLocaleString('en-IN')}
                            </del>
                          )}
                        </td>

                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span style={{ background: prod.stock > 2 ? '#DCFCE7' : '#FEE2E2', color: prod.stock > 2 ? '#166534' : '#991B1B', padding: '3px 8px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 700 }}>
                            {prod.stock} units
                          </span>
                        </td>

                        <td style={{ padding: '1rem 1.25rem', color: '#64748B', fontSize: '0.78rem' }}>
                          <div>{prod.specs?.movement || 'Precision Calibre'}</div>
                          <span style={{ color: '#94A3B8' }}>{prod.specs?.caseDiameter || '42mm'} • {prod.specs?.glass || 'Sapphire'}</span>
                        </td>

                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.title)}
                            style={{ background: '#FEE2E2', border: '1px solid #FECACA', color: '#DC2626', padding: '6px 12px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            title="Delete Watch"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                          No watches matched your search query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ADD NEW WATCH */}
          {activeTab === 'add-product' && (
            <div style={{ maxWidth: '860px', margin: '0 auto' }}>
              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
                <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>Publish New Timepiece</h2>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0 0' }}>
                    Upload compressed watch photo & enter specs for the Khodal Fashion luxury catalog.
                  </p>
                </div>

                <form onSubmit={handleAddWatch} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Photo Upload Area with Image Compressor & Supabase */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                      Watch High-Resolution Image (Auto-Compressed with zero quality loss) *
                    </label>
                    <ImageUploadDropzone
                      currentImage={newWatch.images[0]}
                      productName={newWatch.title || 'watch'}
                      onImageReady={(url, stats) => {
                        setNewWatch({ ...newWatch, images: [url] });
                      }}
                    />
                  </div>

                  {/* Basic Details */}
                  <div className="admin-form-row-2">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                        Watch Title / Model Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rolex Submariner Date Ceramic Bezel 41mm"
                        value={newWatch.title}
                        onChange={(e) => setNewWatch({ ...newWatch, title: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                        Brand
                      </label>
                      <input
                        type="text"
                        value={newWatch.brand}
                        onChange={(e) => setNewWatch({ ...newWatch, brand: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                      />
                    </div>
                  </div>

                  {/* Pricing and Category */}
                  <div className="admin-form-row-4">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                        Selling Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 2499"
                        value={newWatch.price}
                        onChange={(e) => setNewWatch({ ...newWatch, price: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontWeight: 700 }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                        MRP / Original Price (₹)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 9999"
                        value={newWatch.originalPrice}
                        onChange={(e) => setNewWatch({ ...newWatch, originalPrice: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                        Category
                      </label>
                      <select
                        value={newWatch.category}
                        onChange={(e) => setNewWatch({ ...newWatch, category: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                      >
                        <option value="mens-watches">Men's Luxury</option>
                        <option value="automatic">Automatic & Skeleton</option>
                        <option value="chronograph">Chronograph & Sports</option>
                        <option value="ladies-watches">Ladies Elegance</option>
                        <option value="luxury-limited">Masterpiece & Limited</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                        Stock Units
                      </label>
                      <input
                        type="number"
                        value={newWatch.stock}
                        onChange={(e) => setNewWatch({ ...newWatch, stock: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                      />
                    </div>
                  </div>

                  {/* Specifications */}
                  <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.85rem 0' }}>Horology Specifications</h4>
                    <div className="admin-form-row-3">
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748B', marginBottom: '0.3rem' }}>Movement</label>
                        <input
                          type="text"
                          value={newWatch.movement}
                          onChange={(e) => setNewWatch({ ...newWatch, movement: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748B', marginBottom: '0.3rem' }}>Case Diameter</label>
                        <input
                          type="text"
                          value={newWatch.caseDiameter}
                          onChange={(e) => setNewWatch({ ...newWatch, caseDiameter: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748B', marginBottom: '0.3rem' }}>Crystal Glass</label>
                        <input
                          type="text"
                          value={newWatch.glass}
                          onChange={(e) => setNewWatch({ ...newWatch, glass: e.target.value })}
                          style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={newWatch.description}
                      onChange={(e) => setNewWatch({ ...newWatch, description: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontFamily: 'inherit' }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37 0%, #AA820A 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0.85rem 1.5rem',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 14px rgba(212, 175, 55, 0.3)'
                    }}
                  >
                    <Plus size={18} />
                    <span>Publish Timepiece to Store</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: WHATSAPP ORDERS */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Received WhatsApp Orders ({savedOrders.length})</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '4px 0 0 0' }}>
                    All orders submitted via WhatsApp checkout and instant inquiries on the website.
                  </p>
                </div>
              </div>

              {savedOrders.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
                  {savedOrders.map((order, idx) => (
                    <div key={order.id || idx} style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>{order.customerName || 'Customer'}</strong>
                          <span style={{ display: 'block', fontSize: '0.76rem', color: '#64748B' }}>Order ID: {order.id || `ORD-${idx + 101}`}</span>
                        </div>
                        <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '0.74rem', fontWeight: 700, padding: '3px 8px', borderRadius: '12px' }}>
                          WhatsApp Order
                        </span>
                      </div>

                      <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', color: '#334155' }}>
                        <div><strong>Phone:</strong> +91 {order.phone || 'N/A'}</div>
                        {order.address && <div><strong>Address:</strong> {order.address}</div>}
                        <div style={{ marginTop: '0.35rem', fontWeight: 700, color: '#0F172A' }}>
                          Amount: ₹{(order.totalAmount || order.price || 0).toLocaleString('en-IN')}
                        </div>
                      </div>

                      <a
                        href={`https://api.whatsapp.com/send?phone=91${order.phone || storeConfig.whatsappNumber}&text=Hello%20${order.customerName}!%20Confirming%20your%20Khodal%20Fashion%20watch%20order.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          background: '#25D366',
                          color: '#FFFFFF',
                          padding: '0.55rem',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontWeight: 700,
                          fontSize: '0.82rem'
                        }}
                      >
                        <MessageCircle size={15} />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                  <MessageCircle size={36} color="#94A3B8" style={{ marginBottom: '0.75rem' }} />
                  <h4 style={{ margin: 0, fontSize: '1rem', color: '#0F172A' }}>No WhatsApp Orders Received Yet</h4>
                  <p style={{ margin: '6px 0 0 0', fontSize: '0.82rem' }}>
                    When customers click "Instant WhatsApp Order" or checkout on the website, orders will appear here automatically.
                  </p>
                </div>
              )}
            </div>
          )}


          {/* TAB 6: SUPABASE CLOUD SYNC */}
          {activeTab === 'supabase' && (
            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Cloud size={24} color="#2563EB" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>Supabase Cloud Connection</h2>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '2px 0 0 0' }}>
                      Connect your Supabase project to store compressed watch photos permanently in Cloud Storage.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveSupabase} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                      Supabase Project URL *
                    </label>
                    <input
                      type="url"
                      placeholder="https://xyzcompany.supabase.co"
                      value={supabaseForm.url}
                      onChange={(e) => setSupabaseForm({ ...supabaseForm, url: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                    />
                    <span style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                      Find this in your Supabase Dashboard → Project Settings → API
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                      Supabase Anon / Public Key *
                    </label>
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={supabaseForm.anonKey}
                      onChange={(e) => setSupabaseForm({ ...supabaseForm, anonKey: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                      Storage Bucket Name
                    </label>
                    <input
                      type="text"
                      placeholder="watch-images"
                      value={supabaseForm.bucket}
                      onChange={(e) => setSupabaseForm({ ...supabaseForm, bucket: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                    />
                    <span style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                      Ensure this bucket is set to <strong>Public</strong> in Supabase Storage.
                    </span>
                  </div>

                  {supabaseTestStatus && (
                    <div style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: supabaseTestStatus.success ? '#F0FDF4' : '#FEF2F2',
                      border: `1px solid ${supabaseTestStatus.success ? '#BBF7D0' : '#FECACA'}`,
                      color: supabaseTestStatus.success ? '#15803D' : '#B91C1C'
                    }}>
                      {supabaseTestStatus.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      <span>{supabaseTestStatus.message}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button
                      type="submit"
                      style={{
                        background: '#0F172A',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <Save size={16} />
                      <span>Save Credentials</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleTestSupabase}
                      disabled={isTestingSupabase}
                      style={{
                        background: '#F1F5F9',
                        color: '#0F172A',
                        border: '1px solid #CBD5E1',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: isTestingSupabase ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <RefreshCw size={16} className={isTestingSupabase ? 'spinner' : ''} />
                      <span>{isTestingSupabase ? 'Testing...' : 'Test Connection'}</span>
                    </button>
                  </div>
                </form>

                {/* Helpful Guide */}
                <div style={{ marginTop: '2rem', padding: '1.25rem', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
                  <strong style={{ color: '#0F172A', display: 'block', marginBottom: '0.35rem' }}>
                    💡 How to get free Supabase credentials in 2 minutes:
                  </strong>
                  <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
                    <li>Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: '#2563EB' }}>supabase.com</a> and sign in / create a free project.</li>
                    <li>Click on <strong>Storage</strong> in the left menu → Create new bucket named <code>watch-images</code> → Turn <strong>Public bucket ON</strong>.</li>
                    <li>Go to <strong>Settings → API</strong> and copy your <strong>Project URL</strong> and <strong>anon public key</strong>.</li>
                    <li>Paste them above and click "Save Credentials".</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: STORE SETTINGS */}
          {activeTab === 'settings' && (
            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '10px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageCircle size={24} color="#16A34A" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>WhatsApp & Boutique Details</h2>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '2px 0 0 0' }}>
                      Configure the receiver phone number where all customer watch orders and chats go.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveStoreSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#166534', marginBottom: '0.4rem' }}>
                      WhatsApp Order Receiver Phone Number *
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: '#16A34A' }}>+91</span>
                      <input
                        type="tel"
                        required
                        value={configForm.whatsappNumber}
                        onChange={(e) => setConfigForm({ ...configForm, whatsappNumber: e.target.value })}
                        style={{ flex: 1, padding: '0.75rem 0.85rem', borderRadius: '8px', border: '1px solid #86EFAC', fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}
                      />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#15803D', marginTop: '6px', display: 'block' }}>
                      Every "Instant WhatsApp Order" and inquiry on the website triggers a chat directly with this number.
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                        Store / Boutique Brand Name
                      </label>
                      <input
                        type="text"
                        value={configForm.storeName}
                        onChange={(e) => setConfigForm({ ...configForm, storeName: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                        Support Email Address
                      </label>
                      <input
                        type="email"
                        value={configForm.supportEmail}
                        onChange={(e) => setConfigForm({ ...configForm, supportEmail: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                      Official Boutique / Office Address
                    </label>
                    <textarea
                      rows={2}
                      value={configForm.storeAddress}
                      onChange={(e) => setConfigForm({ ...configForm, storeAddress: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', fontFamily: 'inherit' }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: '#0F172A',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0.85rem 1.5rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      marginTop: '0.5rem'
                    }}
                  >
                    <Save size={16} />
                    <span>Save Store Settings</span>
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
