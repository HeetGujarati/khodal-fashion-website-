import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';

export const CartDrawer = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQty, 
    cartSubtotal, 
    cartTotalItems,
    sendCartWhatsAppOrder,
    storeConfig 
  } = useStore();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  const freeShippingGoal = storeConfig.freeShippingThreshold || 1500;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingGoal) * 100));

  const handleWhatsAppCheckout = () => {
    sendCartWhatsAppOrder(showAddressForm ? customerDetails : null);
    setIsCartOpen(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div 
          className="drawer-overlay" 
          onClick={() => setIsCartOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="drawer-container"
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#FFFFFF' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          >
            {/* Drawer Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <ShoppingBag size={20} color="var(--gold-primary)" />
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)', fontWeight: 600 }}>Your Watch Bag</h3>
                <span className="badge-gold" style={{ fontSize: '0.7rem' }}>{cartTotalItems} items</span>
              </div>
              <button className="btn-icon" onClick={() => setIsCartOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Free Shipping Progress Meter */}
            <div style={{ padding: '0.85rem 1.5rem', background: 'var(--gold-light)', borderBottom: '1px solid var(--gold-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Truck size={14} color="var(--gold-primary)" />
                  {cartSubtotal >= freeShippingGoal ? (
                    <strong style={{ color: 'var(--wa-green)' }}>🎉 You have unlocked FREE Express Delivery!</strong>
                  ) : (
                    <span>Add ₹{(freeShippingGoal - cartSubtotal).toLocaleString('en-IN')} more for Free Delivery</span>
                  )}
                </span>
                <span style={{ fontWeight: 700, color: 'var(--gold-primary)' }}>{progressPercent}%</span>
              </div>
              <div style={{ width: '100%', height: '5px', background: 'rgba(0, 0, 0, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${progressPercent}%`, 
                    height: '100%', 
                    background: cartSubtotal >= freeShippingGoal ? 'var(--wa-green)' : 'var(--gold-gradient)',
                    transition: 'width 0.3s ease'
                  }} 
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', background: '#FFFFFF' }}>
              {cart.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <ShoppingBag size={30} color="var(--text-muted)" />
                  </div>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: 600 }}>Your Bag is Empty</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Explore our curated horology collections and find your signature timepiece.
                  </p>
                  <button 
                    className="btn btn-dark btn-sm"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  {cart.map((item) => (
                    <div 
                      key={item.cartItemId}
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        background: '#FAF9F6',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        padding: '0.85rem'
                      }}
                    >
                      <img
                        src={item.product.images?.[0]}
                        alt={item.product.title}
                        style={{ width: '68px', height: '68px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: '#FFF' }}
                      />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.3, margin: 0, paddingRight: '0.5rem', fontWeight: 600 }}>
                              {item.product.title}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.cartItemId)}
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                              title="Remove item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: 600 }}>
                            {item.variant}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                          <span style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>

                          {/* Quantity Stepper */}
                          <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                            <button
                              onClick={() => updateCartQty(item.cartItemId, item.quantity - 1)}
                              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                              <Minus size={12} />
                            </button>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, padding: '0 0.4rem', minWidth: '22px', textAlign: 'center', color: 'var(--text-primary)' }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQty(item.cartItemId, item.quantity + 1)}
                              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer & WhatsApp Checkout */}
            {cart.length > 0 && (
              <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-subtle)', background: '#FFFFFF', boxShadow: '0 -4px 16px rgba(0,0,0,0.03)' }}>
                {/* Optional Address Toggle */}
                <div style={{ marginBottom: '1rem' }}>
                  <div 
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0' }}
                  >
                    <span>{showAddressForm ? '▼ Hide Delivery Address' : '► Add Delivery Address (Optional)'}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Auto-included in message</span>
                  </div>

                  {showAddressForm && (
                    <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#F8F7F4', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={customerDetails.name}
                        onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                        className="form-input"
                        style={{ padding: '0.5rem', fontSize: '0.82rem' }}
                      />
                      <input
                        type="tel"
                        placeholder="Mobile Number"
                        value={customerDetails.phone}
                        onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                        className="form-input"
                        style={{ padding: '0.5rem', fontSize: '0.82rem' }}
                      />
                      <input
                        type="text"
                        placeholder="Address, City, Pincode"
                        value={customerDetails.address}
                        onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                        className="form-input"
                        style={{ padding: '0.5rem', fontSize: '0.82rem' }}
                      />
                    </div>
                  )}
                </div>

                {/* Total Summary */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Amount:</span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--wa-green)', fontWeight: 600 }}>Free Express Delivery Included</div>
                  </div>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* HIGH-CONVERTING WHATSAPP ORDER BUTTON */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-whatsapp btn-lg"
                  onClick={handleWhatsAppCheckout}
                  style={{ width: '100%', gap: '0.6rem', fontSize: '0.96rem' }}
                >
                  <MessageCircle size={20} />
                  <span>Order All on WhatsApp (+91 {storeConfig.whatsappNumber})</span>
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
