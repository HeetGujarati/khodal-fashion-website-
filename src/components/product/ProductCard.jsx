import React, { useState } from 'react';
import { Heart, Eye, Zap, Star } from 'lucide-react';
import { WhatsAppIcon as MessageCircle } from '../common/BrandIcons';
import { motion } from 'framer-motion';
import { useStore } from '../../context/StoreContext';

export const ProductCard = ({ product, onSelectProduct }) => {
  const { 
    toggleWishlist, 
    isWishlisted, 
    sendWhatsAppInquiry, 
    setQuickOrderProduct,
    setQuickViewProduct 
  } = useStore();

  const [hovered, setHovered] = useState(false);
  const wishlisted = isWishlisted(product.id);

  // Fallback image handling
  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800';
  const secondaryImage = product.images?.[1] || mainImage;

  return (
    <motion.div 
      className="watch-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Media / Watch Visual */}
      <div 
        className="watch-card-media"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onSelectProduct ? onSelectProduct(product) : setQuickViewProduct(product)}
      >
        <img
          src={hovered && product.images?.length > 1 ? secondaryImage : mainImage}
          alt={product.title}
          className="watch-card-img"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="watch-card-top-badges">
          {product.discountPercent && (
            <span className="badge-discount">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isTrending && (
            <span className="badge-gold">
              Popular
            </span>
          )}
          {product.stock <= 4 && (
            <span className="badge-stock">
              Only {product.stock} Left
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={`watch-card-wishlist ${wishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={17} fill={wishlisted ? '#E11D48' : 'none'} color={wishlisted ? '#E11D48' : 'currentColor'} />
        </button>

        {/* Quick View Hover Pill */}
        <div 
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-subtle)',
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            fontSize: '0.74rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.2s ease',
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}
        >
          <Eye size={13} color="var(--gold-primary)" />
          <span>Quick View</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="watch-card-body">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
          <span className="watch-card-brand">{product.brand || 'Khodal Horology'}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.76rem', color: '#D97706' }}>
            <Star size={13} fill="#D97706" color="#D97706" />
            <span style={{ fontWeight: 700 }}>{product.rating || 4.9}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>({product.reviewsCount || 85})</span>
          </div>
        </div>

        <h3 
          className="watch-card-title"
          onClick={() => onSelectProduct ? onSelectProduct(product) : setQuickViewProduct(product)}
        >
          {product.title}
        </h3>

        {/* Horology Specs snippet */}
        <div className="watch-card-meta">
          <span>{product.specs?.caseDiameter || '41mm'}</span>
          <span>•</span>
          <span style={{ color: 'var(--gold-primary)', fontWeight: 500 }}>{product.specs?.glass || 'Sapphire Glass'}</span>
        </div>

        {/* Pricing */}
        <div className="watch-card-pricing" style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span className="watch-price-current">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <>
              <span className="watch-price-original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              <span style={{ fontSize: '0.7rem', color: '#16A34A', fontWeight: 700, background: '#DCFCE7', padding: '1px 6px', borderRadius: '4px' }}>
                Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            </>
          )}
        </div>

        {/* Dual WhatsApp Actions - Balanced Luxury Row */}
        <div style={{ display: 'flex', gap: '0.45rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-dark btn-sm"
            onClick={() => setQuickOrderProduct({ product, variant: product.variants?.[0]?.name || 'Standard' })}
            style={{ 
              flex: 1, 
              gap: '0.4rem', 
              fontSize: '0.82rem', 
              padding: '0.55rem 0.6rem',
              fontWeight: 700,
              background: '#0F172A',
              border: '1px solid #1E293B',
              letterSpacing: '0.02em'
            }}
          >
            <Zap size={13} color="#FACC15" />
            <span>Order On WhatsApp</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-whatsapp btn-sm"
            onClick={() => sendWhatsAppInquiry(product, product.variants?.[0]?.name)}
            title="Chat & Request Live Wrist Video on WhatsApp"
            style={{ 
              padding: '0.55rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              fontSize: '0.82rem',
              flexShrink: 0
            }}
          >
            <MessageCircle size={15} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600 }} className="d-none d-sm-inline">Inquire</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
