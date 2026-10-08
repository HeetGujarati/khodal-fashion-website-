import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, Trash2, MessageCircle, Watch } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminDashboard = ({ isOpen, onClose }) => {
  const { 
    storeConfig, 
    setStoreConfig, 
    products, 
    setProducts, 
    categories, 
    showToast 
  } = useStore();

  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'products' | 'orders'
  
  // Settings Form
  const [configForm, setConfigForm] = useState({ ...storeConfig });

  useEffect(() => {
    if (isOpen) {
      setConfigForm({ ...storeConfig });
    }
  }, [isOpen, storeConfig]);

  // Add Product Form
  const [newWatch, setNewWatch] = useState({
    title: '',
    brand: 'Khodal Fashion',
    category: 'mens-watches',
    price: '',
    originalPrice: '',
    discountPercent: 75,
    stock: 5,
    images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900'],
    description: 'Master craftsmanship stainless steel luxury watch.',
    movement: 'High-Precision Calibre',
    caseDiameter: '42mm',
    glass: 'Sapphire Crystal'
  });

  const savedOrders = JSON.parse(localStorage.getItem('khodal_orders') || localStorage.getItem('ditya_orders') || '[]');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setStoreConfig(configForm);
    showToast('Store settings & WhatsApp number updated!', 'success');
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newWatch.title || !newWatch.price) {
      showToast('Title and Price are required', 'error');
      return;
    }

    const priceNum = parseInt(newWatch.price, 10);
    const origNum = parseInt(newWatch.originalPrice || (priceNum * 4), 10);

    const productToAdd = {
      id: `watch-${Date.now()}`,
      title: newWatch.title,
      brand: newWatch.brand,
      category: newWatch.category,
      sku: `KF-${Math.floor(1000 + Math.random() * 9000)}`,
      price: priceNum,
      originalPrice: origNum,
      discountPercent: Math.round(((origNum - priceNum) / origNum) * 100),
      stock: parseInt(newWatch.stock, 10) || 5,
      rating: 5.0,
      reviewsCount: 12,
      images: [newWatch.images[0]],
      description: newWatch.description,
      variants: [{ name: 'Standard Edition', inStock: true }],
      specs: {
        movement: newWatch.movement,
        caseDiameter: newWatch.caseDiameter,
        glass: newWatch.glass,
        waterResistance: '5 ATM / 50m',
        strap: '316L Solid Steel Bracelet'
      }
    };

    setProducts([productToAdd, ...products]);
    showToast(`Added watch "${newWatch.title}" to catalog!`, 'success');
    setNewWatch({
      title: '',
      brand: 'Khodal Fashion',
      category: 'mens-watches',
      price: '',
      originalPrice: '',
      discountPercent: 75,
      stock: 5,
      images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900'],
      description: 'Master craftsmanship stainless steel luxury watch.',
      movement: 'High-Precision Calibre',
      caseDiameter: '42mm',
      glass: 'Sapphire Crystal'
    });
    setActiveTab('products');
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    showToast('Product removed from catalog', 'info');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-overlay" 
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="modal-container" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '820px', background: '#FFFFFF' }}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'var(--gold-light)', border: '1px solid var(--gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Watch size={20} color="var(--gold-primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0, fontWeight: 600 }}>Khodal Fashion Store Manager</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', margin: 0, fontWeight: 500 }}>Manage WhatsApp Numbers, Catalog & Orders</p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: '#FAF9F6', borderBottom: '1px solid var(--border-subtle)', padding: '0 1.5rem' }}>
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '0.9rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'settings' ? '2px solid var(--gold-primary)' : '2px solid transparent',
              color: activeTab === 'settings' ? 'var(--gold-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            WhatsApp & Store Settings
          </button>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '0.9rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'products' ? '2px solid var(--gold-primary)' : '2px solid transparent',
              color: activeTab === 'products' ? 'var(--gold-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            Watch Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '0.9rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'orders' ? '2px solid var(--gold-primary)' : '2px solid transparent',
              color: activeTab === 'orders' ? 'var(--gold-primary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            Received Orders ({savedOrders.length})
          </button>
        </div>

        {/* Content Area */}
        <div style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto', background: '#FFFFFF' }}>
          {/* TAB 1: SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings}>
              <div style={{ background: 'var(--wa-light)', border: '1px solid var(--wa-border)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <MessageCircle size={18} color="var(--wa-green)" />
                  <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>WhatsApp Order Receiver Number</strong>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                  All WhatsApp inquiries and express orders from the website will automatically open a chat with this phone number.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold-primary)' }}>+91</span>
                  <input
                    type="tel"
                    value={configForm.whatsappNumber}
                    onChange={(e) => setConfigForm({ ...configForm, whatsappNumber: e.target.value })}
                    className="form-input"
                    placeholder="e.g. 7383556275"
                    style={{ flex: 1, fontSize: '1rem', fontWeight: 700 }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Store Brand Name</label>
                  <input
                    type="text"
                    value={configForm.storeName}
                    onChange={(e) => setConfigForm({ ...configForm, storeName: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Support Email</label>
                  <input
                    type="email"
                    value={configForm.supportEmail}
                    onChange={(e) => setConfigForm({ ...configForm, supportEmail: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Office / Store Address</label>
                <textarea
                  rows={2}
                  value={configForm.storeAddress}
                  onChange={(e) => setConfigForm({ ...configForm, storeAddress: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <button type="submit" className="btn btn-dark" style={{ marginTop: '0.5rem' }}>
                <Save size={16} />
                <span>Save Store Settings</span>
              </button>
            </form>
          )}

          {/* TAB 2: PRODUCTS CATALOG */}
          {activeTab === 'products' && (
            <div>
              {/* Add New Watch Form */}
              <div style={{ background: '#FAF9F6', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  <Plus size={16} color="var(--gold-primary)" />
                  <span>Add New Watch to Store</span>
                </h4>
                <form onSubmit={handleAddProduct}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Watch Model Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Omega Speedmaster Style Chronograph"
                        value={newWatch.title}
                        onChange={(e) => setNewWatch({ ...newWatch, title: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Selling Price (₹) *</label>
                      <input
                        type="number"
                        placeholder="e.g. 2199"
                        value={newWatch.price}
                        onChange={(e) => setNewWatch({ ...newWatch, price: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">MRP (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 8999"
                        value={newWatch.originalPrice}
                        onChange={(e) => setNewWatch({ ...newWatch, originalPrice: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select
                        value={newWatch.category}
                        onChange={(e) => setNewWatch({ ...newWatch, category: e.target.value })}
                        className="form-select"
                      >
                        {categories.filter(c => c.id !== 'all').map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Stock Units</label>
                      <input
                        type="number"
                        value={newWatch.stock}
                        onChange={(e) => setNewWatch({ ...newWatch, stock: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Image URL</label>
                      <input
                        type="url"
                        value={newWatch.images[0]}
                        onChange={(e) => setNewWatch({ ...newWatch, images: [e.target.value] })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-dark btn-sm">
                    <Plus size={15} />
                    <span>Publish Watch Listing</span>
                  </button>
                </form>
              </div>

              {/* Existing Catalog List */}
              <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 600 }}>Existing Store Inventory ({products.length} Watches)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {products.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#FFFFFF',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={p.images?.[0]} alt="watch" style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--border-subtle)' }} />
                      <div>
                        <h5 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', margin: 0, fontWeight: 600 }}>{p.title}</h5>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 600 }}>
                          ₹{p.price.toLocaleString('en-IN')} <span style={{ color: 'var(--text-muted)' }}>({p.category})</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="btn-icon"
                      style={{ color: '#E11D48', borderColor: 'rgba(225, 29, 72, 0.2)' }}
                      title="Delete Product"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SAVED ORDERS */}
          {activeTab === 'orders' && (
            <div>
              {savedOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                  <p>No orders dispatched yet in this browser session.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {savedOrders.map((ord, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#FAF9F6',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        padding: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--gold-primary)' }}>{ord.orderId}</span>
                        <span className="badge-gold" style={{ fontSize: '0.7rem' }}>{ord.status}</span>
                      </div>
                      <h4 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', margin: '0 0 0.4rem 0', fontWeight: 600 }}>{ord.productTitle}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                        Customer: <strong>{ord.customer?.name}</strong> (+91 {ord.customer?.phone})
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                        Address: {ord.customer?.address}, {ord.customer?.city} - {ord.customer?.pincode}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  );
};
