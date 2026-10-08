import React, { useState } from 'react';
import { X, MessageCircle, Heart, ShoppingBag, Zap, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';

export const QuickViewModal = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    isWishlisted, 
    sendWhatsAppInquiry,
    setQuickOrderProduct 
  } = useStore();

  const product = quickViewProduct;
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0]?.name || 'Standard');

  if (!quickViewProduct || !product) return null;

  const wishlisted = isWishlisted(product.id);
  const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900'];

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay" 
        onClick={() => setQuickViewProduct(null)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="modal-container" 
          onClick={(e) => e.stopPropagation()} 
          style={{ maxWidth: '850px', background: '#FFFFFF' }}
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.25 }}
        >
          {/* Close Button */}
          <button 
            className="btn-icon" 
            onClick={() => setQuickViewProduct(null)}
            style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}
          >
            <X size={18} />
          </button>

          <div className="quickview-grid">
            {/* Left Column: Visual Gallery */}
            <div>
              <div 
                style={{ 
                  width: '100%', 
                  aspectRatio: '1/1', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  border: '1px solid var(--border-subtle)', 
                  background: '#F5F4F0',
                  marginBottom: '1rem',
                  position: 'relative'
                }}
              >
                <img
                  src={images[activeImgIdx]}
                  alt={product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {product.discountPercent && (
                  <div style={{ position: 'absolute', top: 12, left: 12 }}>
                    <span className="badge-discount">{product.discountPercent}% OFF</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Row */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveImgIdx(idx)}
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: activeImgIdx === idx ? '2px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                        opacity: activeImgIdx === idx ? 1 : 0.65,
                        transition: 'all 0.2s',
                        background: '#F5F4F0'
                      }}
                    >
                      <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Details & Actions */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span className="watch-card-brand">{product.brand}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#D97706', fontSize: '0.85rem' }}>
                  <Star size={14} fill="#D97706" color="#D97706" />
                  <span style={{ fontWeight: 700 }}>{product.rating}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount} reviews)</span>
                </div>
              </div>

              <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '0.6rem', lineHeight: 1.3, fontWeight: 600 }}>
                {product.title}
              </h2>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="badge-stock">⚡ In Stock</span>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {product.description}
              </p>

              {/* Variant Switcher */}
              {product.variants && product.variants.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <span className="form-label" style={{ color: 'var(--text-secondary)' }}>
                    Dial & Finish: <strong style={{ color: 'var(--text-primary)' }}>{selectedVariant}</strong>
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {product.variants.map((v) => (
                      <button
                        key={v.name}
                        onClick={() => setSelectedVariant(v.name)}
                        style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: '6px',
                          background: selectedVariant === v.name ? 'var(--gold-light)' : '#FFFFFF',
                          border: selectedVariant === v.name ? '2px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                          color: selectedVariant === v.name ? 'var(--gold-primary)' : 'var(--text-secondary)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Horology Specs Highlights */}
              {product.specs && (
                <div style={{ background: '#FAF9F6', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.82rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Movement: </span>
                      <strong style={{ color: 'var(--text-primary)' }}>{product.specs.movement}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Case Size: </span>
                      <strong style={{ color: 'var(--text-primary)' }}>{product.specs.caseDiameter}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Glass: </span>
                      <strong style={{ color: 'var(--text-primary)' }}>{product.specs.glass}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Water Resistance: </span>
                      <strong style={{ color: 'var(--text-primary)' }}>{product.specs.waterResistance}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                <div className="quickview-actions">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-dark"
                    onClick={() => {
                      setQuickOrderProduct({ product, variant: selectedVariant });
                      setQuickViewProduct(null);
                    }}
                    style={{ gap: '0.4rem', fontSize: '0.85rem' }}
                  >
                    <Zap size={15} />
                    <span>Order on WhatsApp</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-whatsapp"
                    onClick={() => sendWhatsAppInquiry(product, selectedVariant)}
                    style={{ gap: '0.4rem', fontSize: '0.85rem' }}
                  >
                    <MessageCircle size={15} />
                    <span>WhatsApp Inquiry</span>
                  </motion.button>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    className="btn btn-ghost"
                    style={{ flex: 1, gap: '0.4rem', fontSize: '0.85rem' }}
                    onClick={() => {
                      addToCart(product, selectedVariant);
                      setQuickViewProduct(null);
                    }}
                  >
                    <ShoppingBag size={15} />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    className={`btn-icon ${wishlisted ? 'active' : ''}`}
                    onClick={() => toggleWishlist(product)}
                    style={{ width: '38px', height: '38px' }}
                  >
                    <Heart size={16} fill={wishlisted ? '#E11D48' : 'none'} color={wishlisted ? '#E11D48' : 'currentColor'} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
