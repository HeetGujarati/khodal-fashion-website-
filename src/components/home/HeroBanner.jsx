import React from 'react';
import { ArrowRight, MessageCircle, ShieldCheck, Truck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../../context/StoreContext';

export const HeroBanner = ({ onExploreClick }) => {
  const { storeConfig, sendWhatsAppInquiry, products, setQuickOrderProduct } = useStore();

  const featuredWatch = products.find(p => p.id === 'tissot-prx-tiffany-blue') || products[0];
  const cleanPhone = storeConfig.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <section 
      style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        padding: '4.5rem 0 5rem 0', 
        borderBottom: '1px solid var(--border-subtle)', 
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F9F8F5 100%)' 
      }}
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', alignItems: 'center', gap: '3.5rem' }}>
          
          {/* Left Column: Editorial Typography & Boutique Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Curated Horology Tag */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.55rem', 
                padding: '0.35rem 0.9rem', 
                borderRadius: '30px', 
                background: 'var(--gold-light)', 
                border: '1px solid var(--gold-border)', 
                marginBottom: '1.4rem' 
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold-primary)' }} />
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--gold-primary)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Khodal Fashion • Curated Horology
              </span>
            </motion.div>

            {/* Editorial Serif Headline */}
            <h1 
              style={{ 
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)', 
                lineHeight: 1.1, 
                marginBottom: '1.25rem', 
                color: 'var(--text-primary)',
                fontWeight: 600,
                letterSpacing: '-0.01em'
              }}
            >
              The Art of Timekeeping. <br />
              <span style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--gold-primary)' }}>
                Mastered for Connoisseurs.
              </span>
            </h1>

            <p style={{ fontSize: '1.02rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '2.4rem', maxWidth: '530px' }}>
              Handpicked automatic calibres, executive chronographs, and iconic solid-steel timepieces by Khodal Fashion. Direct importer pricing with personal WhatsApp concierge, certified authenticity, and express insured delivery across India.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
              <motion.button 
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-dark btn-lg"
                onClick={onExploreClick}
                style={{ gap: '0.6rem' }}
              >
                <span>Explore Catalog</span>
                <ArrowRight size={17} />
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                href={`https://api.whatsapp.com/send?phone=91${cleanPhone}&text=Hello%20Khodal%20Fashion!%20I%20want%20to%20view%20your%20latest%20watch%20catalogue.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
                style={{ gap: '0.6rem' }}
              >
                <MessageCircle size={19} />
                <span>WhatsApp Concierge</span>
              </motion.a>
            </div>

            {/* Trust Highlights */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} color="var(--gold-primary)" />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>100% Certified Authentic</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={18} color="var(--wa-green)" />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Free Insured Shipping</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="var(--gold-primary)" />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>1-Year Calibre Warranty</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: High-End Editorial Spotlight Watch Card with Framer Motion Float */}
          {featuredWatch && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  maxWidth: '430px',
                  width: '100%',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span className="badge-gold">
                    FEATURED MASTERPIECE
                  </span>
                  <span className="badge-discount">
                    {featuredWatch.discountPercent}% OFF
                  </span>
                </div>

                <div 
                  style={{
                    width: '100%',
                    aspectRatio: '1/1',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#F6F5F2',
                    marginBottom: '1.25rem',
                    position: 'relative',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <motion.img
                    src={featuredWatch.images?.[0]}
                    alt={featuredWatch.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div 
                    style={{ 
                      position: 'absolute', 
                      bottom: '10px', 
                      left: '10px', 
                      background: 'rgba(255, 255, 255, 0.94)', 
                      backdropFilter: 'blur(8px)', 
                      padding: '0.3rem 0.65rem', 
                      borderRadius: '6px', 
                      fontSize: '0.72rem', 
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    {featuredWatch.specs?.movement || 'Swiss Calibre Movement'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.14em', color: 'var(--gold-primary)', textTransform: 'uppercase' }}>
                    {featuredWatch.brand}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--wa-green)', fontWeight: 600 }}>
                    ● In Stock ({featuredWatch.stock} units left)
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3, fontWeight: 600 }}>
                  {featuredWatch.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  {featuredWatch.description.slice(0, 95)}...
                </p>

                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div>
                    <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      ₹{featuredWatch.price.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '0.92rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '0.6rem' }}>
                      ₹{featuredWatch.originalPrice?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--gold-primary)', fontWeight: 700 }}>
                    Direct Boutique Price
                  </span>
                </div>

                {/* Direct Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-dark btn-sm"
                    onClick={() => setQuickOrderProduct({ product: featuredWatch, variant: featuredWatch.variants?.[0]?.name })}
                  >
                    <span>Instant WhatsApp Order</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-whatsapp btn-sm"
                    onClick={() => sendWhatsAppInquiry(featuredWatch, featuredWatch.variants?.[0]?.name)}
                  >
                    <span>Request Live Video</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
