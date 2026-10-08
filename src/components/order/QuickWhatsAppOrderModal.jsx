import React, { useState } from 'react';
import { X, MessageCircle, ShieldCheck, Truck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useStore } from '../../context/StoreContext';

export const QuickWhatsAppOrderModal = () => {
  const { 
    quickOrderProduct, 
    setQuickOrderProduct, 
    sendWhatsAppOrder,
    storeConfig,
    showToast 
  } = useStore();

  const product = quickOrderProduct?.product;
  const initialVariant = quickOrderProduct?.variant;
  const [selectedVariant, setSelectedVariant] = useState(initialVariant || 'Standard');
  
  // Delivery Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });
  const [formErrors, setFormErrors] = useState({});

  if (!quickOrderProduct || !product) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Please enter your full name';
    if (!formData.phone.trim() || formData.phone.length < 10) errors.phone = 'Valid 10-digit mobile number required';
    if (!formData.address.trim()) errors.address = 'Please enter your full delivery address';
    if (!formData.city.trim()) errors.city = 'Please enter your city';
    if (!formData.pincode.trim() || formData.pincode.length < 6) errors.pincode = 'Valid 6-digit pincode required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }

    // Save order in localStorage with KF (Khodal Fashion) order code
    const orderId = `KF-${Math.floor(100000 + Math.random() * 900000)}`;
    const savedOrder = {
      orderId,
      createdAt: new Date().toISOString(),
      productTitle: product.title,
      variant: selectedVariant,
      price: product.price,
      customer: formData,
      status: 'Order Placed (WhatsApp Confirmed)'
    };

    const existingOrders = JSON.parse(localStorage.getItem('khodal_orders') || localStorage.getItem('ditya_orders') || '[]');
    localStorage.setItem('khodal_orders', JSON.stringify([savedOrder, ...existingOrders]));

    // Send order via WhatsApp
    sendWhatsAppOrder(product, selectedVariant, formData);
    showToast(`Order dispatched to WhatsApp! Ref: ${orderId}`, 'success');
    setQuickOrderProduct(null);
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay" 
        onClick={() => setQuickOrderProduct(null)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="modal-container" 
          onClick={(e) => e.stopPropagation()} 
          style={{ maxWidth: '580px', background: '#FFFFFF' }}
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.25 }}
        >
          {/* Header */}
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--wa-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageCircle size={18} color="#FFF" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)', fontWeight: 600 }}>Khodal Fashion Express WhatsApp Order</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--wa-green)', margin: 0, fontWeight: 600 }}>Direct Seller Dispatch Confirmation</p>
              </div>
            </div>
            <button className="btn-icon" onClick={() => setQuickOrderProduct(null)}>
              <X size={18} />
            </button>
          </div>

          {/* Content Body */}
          <div style={{ padding: '1.5rem', background: '#FFFFFF' }}>
            {/* Watch Summary Card */}
            <div style={{ display: 'flex', gap: '1rem', background: '#FAF9F6', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
              <img
                src={product.images?.[0]}
                alt={product.title}
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: '#FFF' }}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--gold-primary)', fontWeight: 700, textTransform: 'uppercase' }}>{product.brand}</span>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', margin: '0.2rem 0 0.4rem 0', lineHeight: 1.3, fontWeight: 600 }}>{product.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹{product.price.toLocaleString('en-IN')}</span>
                  {product.originalPrice && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  )}
                  <span className="badge-discount" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>FREE SHIPPING</span>
                </div>
              </div>
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ color: 'var(--text-secondary)' }}>
                  Select Dial / Edition:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {product.variants.map((v) => (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => setSelectedVariant(v.name)}
                      style={{
                        padding: '0.5rem 0.9rem',
                        borderRadius: '8px',
                        background: selectedVariant === v.name ? 'var(--gold-light)' : '#FFFFFF',
                        border: selectedVariant === v.name ? '2px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                        color: selectedVariant === v.name ? 'var(--gold-primary)' : 'var(--text-secondary)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {v.colorCode && (
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: v.colorCode, border: '1px solid rgba(0,0,0,0.15)' }} />
                      )}
                      <span>{v.name}</span>
                      {selectedVariant === v.name && <Check size={14} color="var(--gold-primary)" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Address Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={17} color="var(--gold-primary)" />
                <span>Enter Delivery Address for Instant Dispatch</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{ borderColor: formErrors.name ? '#EF4444' : undefined }}
                  />
                  {formErrors.name && <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{formErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit number"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{ borderColor: formErrors.phone ? '#EF4444' : undefined }}
                  />
                  {formErrors.phone && <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{formErrors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Flat / House No. / Street / Landmark *</label>
                <textarea
                  name="address"
                  placeholder="House No., Building Name, Street, Landmark"
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-textarea"
                  style={{ borderColor: formErrors.address ? '#EF4444' : undefined }}
                />
                {formErrors.address && <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{formErrors.address}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="e.g. Mumbai, Delhi, Surat"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{ borderColor: formErrors.city ? '#EF4444' : undefined }}
                  />
                  {formErrors.city && <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{formErrors.city}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="6-digit pincode"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{ borderColor: formErrors.pincode ? '#EF4444' : undefined }}
                  />
                  {formErrors.pincode && <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '0.2rem', display: 'block' }}>{formErrors.pincode}</span>}
                </div>
              </div>

              {/* Trust highlights */}
              <div style={{ background: 'var(--wa-light)', border: '1px solid var(--wa-border)', borderRadius: '8px', padding: '0.85rem', margin: '0.75rem 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={22} color="var(--wa-green)" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                  <strong>No Online Payment Needed:</strong> Your order details will be sent directly to Khodal Fashion's official WhatsApp (+91 {storeConfig.whatsappNumber}). Confirm with our concierge and pay via Cash On Delivery (COD) or UPI upon verification!
                </div>
              </div>

              {/* Submit CTA */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn btn-whatsapp btn-lg"
                style={{ width: '100%', gap: '0.65rem', fontSize: '0.98rem' }}
              >
                <MessageCircle size={20} />
                <span>Confirm Order on WhatsApp (+91 {storeConfig.whatsappNumber})</span>
              </motion.button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
