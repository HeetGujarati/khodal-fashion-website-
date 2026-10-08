import React, { useState } from 'react';
import { Heart, MessageCircle, Eye, Zap, Star } from 'lucide-react';
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
        <div className="watch-card-pricing">
          <span className="watch-price-current">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <span className="watch-price-original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          )}
        </div>

        {/* Dual WhatsApp Actions */}
        <div className="watch-card-actions">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="btn btn-dark btn-sm"
            onClick={() => setQuickOrderProduct({ product, variant: product.variants?.[0]?.name || 'Standard' })}
            style={{ width: '100%', gap: '0.45rem', fontSize: '0.84rem' }}
          >
            <Zap size={14} />
            <span>Order On WhatsApp</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            className="btn btn-whatsapp btn-sm"
            onClick={() => sendWhatsAppInquiry(product, product.variants?.[0]?.name)}
            style={{ width: '100%', gap: '0.45rem', fontSize: '0.84rem' }}
          >
            <MessageCircle size={14} />
            <span>Inquiry On WhatsApp</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
