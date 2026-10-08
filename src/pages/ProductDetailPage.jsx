import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  ShoppingBag, 
  Zap, 
  Star, 
  Check, 
  ArrowLeft,
  Share2,
  PackageCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';

export const ProductDetailPage = ({ product, onBack, _setCurrentView, onSelectProduct }) => {
  const { 
    toggleWishlist, 
    isWishlisted, 
    addToCart, 
    sendWhatsAppInquiry, 
    setQuickOrderProduct,
    products,
    showToast 
  } = useStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0]?.name || 'Standard');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900'];

  // Mouse move handler for luxury dial zoom
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Watch link copied to clipboard!');
    }
  };

  const relatedWatches = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div style={{ padding: '2.5rem 0 5rem 0', background: 'var(--bg-main)' }}>
      <div className="container">
        {/* Breadcrumb & Back Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <button
            onClick={onBack}
            className="btn btn-ghost btn-sm"
            style={{ gap: '0.4rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Collection</span>
          </button>

          <button
            onClick={handleShare}
            className="btn btn-ghost btn-sm"
            style={{ gap: '0.4rem' }}
          >
            <Share2 size={16} />
            <span>Share Model</span>
          </button>
        </div>

        {/* 2-Column Product Showcase */}
        <div className="pdp-grid">
          
          {/* LEFT: Multi-Angle Interactive Gallery & Dial Zoom */}
          <div>
            {/* Main Interactive Zoom Stage */}
            <div
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                background: '#F5F4F0',
                border: '1px solid var(--border-subtle)',
                cursor: 'crosshair',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <img
                src={images[activeImageIdx]}
                alt={product.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZoomed ? 'scale(2.2)' : 'scale(1)',
                  transition: isZoomed ? 'none' : 'transform 0.3s ease'
                }}
              />

              {/* Zoom hint badge */}
              {!isZoomed && (
                <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}>
                  Hover to Zoom Dial
                </div>
              )}

              {/* Discount Tag */}
              {product.discountPercent && (
                <div style={{ position: 'absolute', top: 14, left: 14 }}>
                  <span className="badge-discount">{product.discountPercent}% OFF</span>
                </div>
              )}
            </div>

            {/* Thumbnail Navigation Row */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    style={{
                      width: 76,
                      height: 76,
                      borderRadius: '10px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: activeImageIdx === idx ? '2px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                      boxShadow: activeImageIdx === idx ? '0 0 10px rgba(148, 108, 31, 0.2)' : 'none',
                      transition: 'all 0.2s ease',
                      background: '#F5F4F0'
                    }}
                  >
                    <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}

            {/* Packaging Guarantee Banner */}
            <div style={{ marginTop: '1.5rem', background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.9rem', boxShadow: 'var(--shadow-sm)' }}>
              <PackageCheck size={28} color="var(--gold-primary)" style={{ flexShrink: 0 }} />
              <div>
                <h5 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', margin: '0 0 0.2rem 0', fontWeight: 600 }}>Delivered in Hardcase Presentation Box</h5>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                  Includes international warranty booklet, velvet cushion, and protective case seals.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Horology Details & Direct WhatsApp Actions */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="watch-card-brand">{product.brand}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#D97706', fontSize: '0.88rem' }}>
                <Star size={16} fill="#D97706" color="#D97706" />
                <span style={{ fontWeight: 700 }}>{product.rating}</span>
                <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount} verified reviews)</span>
              </div>
            </div>

            <h1 style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.5rem)', color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.25 }}>
              {product.title}
            </h1>

            {/* SKU & Category badge */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>SKU: <strong style={{ color: 'var(--text-primary)' }}>{product.sku}</strong></span>
              <span>•</span>
              <span className="badge-gold">{product.category}</span>
            </div>

            {/* Pricing Section */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span style={{ fontSize: '0.82rem', color: 'var(--wa-green)', fontWeight: 700 }}>
                (Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')})
              </span>
            </div>

            {/* Live Stock Urgency Banner */}
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D97706' }} />
              <span style={{ fontSize: '0.84rem', color: '#92400E', fontWeight: 600 }}>
                Only {product.stock} units left in stock at this direct importer price. Ready for instant dispatch today.
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
              {product.description}
            </p>

            {/* Variant Switcher */}
            {product.variants && product.variants.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <label className="form-label" style={{ color: 'var(--text-secondary)' }}>
                  Selected Edition / Dial: <strong style={{ color: 'var(--text-primary)' }}>{selectedVariant}</strong>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {product.variants.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => setSelectedVariant(v.name)}
                      style={{
                        padding: '0.6rem 1.1rem',
                        borderRadius: '8px',
                        background: selectedVariant === v.name ? 'var(--gold-light)' : '#FFFFFF',
                        border: selectedVariant === v.name ? '2px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                        color: selectedVariant === v.name ? 'var(--gold-primary)' : 'var(--text-secondary)',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.15s'
                      }}
                    >
                      {v.colorCode && (
                        <span style={{ width: 14, height: 14, borderRadius: '50%', background: v.colorCode, border: '1px solid rgba(0,0,0,0.1)' }} />
                      )}
                      <span>{v.name}</span>
                      {selectedVariant === v.name && <Check size={16} color="var(--gold-primary)" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DUAL HIGH CONVERSION ACTION BUTTONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '2.5rem' }}>
              <div className="pdp-action-buttons">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-dark btn-lg"
                  onClick={() => setQuickOrderProduct({ product, variant: selectedVariant })}
                  style={{ gap: '0.5rem' }}
                >
                  <Zap size={18} />
                  <span>Order on WhatsApp</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-whatsapp btn-lg"
                  onClick={() => sendWhatsAppInquiry(product, selectedVariant)}
                  style={{ gap: '0.5rem' }}
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp Inquiry</span>
                </motion.button>
              </div>

              {/* Secondary Actions */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  className="btn btn-ghost"
                  style={{ flex: 1, gap: '0.5rem' }}
                  onClick={() => addToCart(product, selectedVariant)}
                >
                  <ShoppingBag size={18} />
                  <span>Add to Bag</span>
                </button>

                <button
                  className={`btn-icon ${wishlisted ? 'active' : ''}`}
                  onClick={() => toggleWishlist(product)}
                  style={{ width: '48px', height: '48px' }}
                  title="Wishlist"
                >
                  <Heart size={20} fill={wishlisted ? '#E11D48' : 'none'} color={wishlisted ? '#E11D48' : 'currentColor'} />
                </button>
              </div>
            </div>

            {/* Technical Horology Specifications Table */}
            {product.specs && (
              <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '1.25rem', letterSpacing: '0.04em', fontWeight: 700, textTransform: 'uppercase' }}>
                  Technical Horology Specifications
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.74rem' }}>Calibre / Movement:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{product.specs.movement}</strong>
                  </div>

                  <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.74rem' }}>Case Diameter:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{product.specs.caseDiameter}</strong>
                  </div>

                  <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.74rem' }}>Case Material:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{product.specs.caseMaterial}</strong>
                  </div>

                  <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.74rem' }}>Crystal Glass:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{product.specs.glass}</strong>
                  </div>

                  <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.74rem' }}>Water Resistance:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{product.specs.waterResistance}</strong>
                  </div>

                  <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.74rem' }}>Strap / Bracelet:</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{product.specs.strap}</strong>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Related Watches */}
        {relatedWatches.length > 0 && (
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '4rem' }}>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', marginBottom: '2rem', textAlign: 'center' }}>
              Related Luxury Timepieces
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem' }}>
              {relatedWatches.map((rw) => (
                <ProductCard
                  key={rw.id}
                  product={rw}
                  onSelectProduct={(p) => {
                    onSelectProduct(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
