import React, { useState } from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryPills } from '../components/home/CategoryPills';
import { WatchSpecsBanner } from '../components/home/WatchSpecsBanner';
import { ProductCard } from '../components/product/ProductCard';
import { useStore } from '../context/StoreContext';
import { MessageCircle, Star, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const HomePage = ({ setCurrentView, onSelectProduct }) => {
  const { products, storeConfig } = useStore();
  const [activeTab, setActiveTab] = useState('trending'); // 'trending' | 'bestsellers' | 'automatic'

  const trendingProducts = products.filter(p => p.isTrending);
  const bestSellers = products.filter(p => p.isBestSeller);
  const automaticWatches = products.filter(p => p.category === 'automatic');

  const displayedProducts = activeTab === 'bestsellers' 
    ? bestSellers 
    : activeTab === 'automatic' 
      ? automaticWatches 
      : trendingProducts;

  const cleanPhone = storeConfig.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div>
      {/* 1. Hero Showcase */}
      <HeroBanner onExploreClick={() => setCurrentView('shop')} />

      {/* 2. Trending Categories Section */}
      <CategoryPills onCategorySelect={() => setCurrentView('shop')} />

      {/* 3. Featured Watches Showcase */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2.75rem' }}>
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--gold-primary)', fontWeight: 700 }}>
              CURATED TIMEPIECES
            </span>
            <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.7rem)', color: 'var(--text-primary)', marginTop: '0.35rem', marginBottom: '1.25rem', fontWeight: 600 }}>
              Explore Khodal Fashion Signature Watches
            </h2>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', background: '#FFFFFF', padding: '0.35rem', borderRadius: '35px', border: '1px solid var(--border-subtle)', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <button
                onClick={() => setActiveTab('trending')}
                style={{
                  padding: '0.55rem 1.4rem',
                  borderRadius: '30px',
                  background: activeTab === 'trending' ? '#121826' : 'transparent',
                  color: activeTab === 'trending' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Trending Now
              </button>
              <button
                onClick={() => setActiveTab('bestsellers')}
                style={{
                  padding: '0.55rem 1.4rem',
                  borderRadius: '30px',
                  background: activeTab === 'bestsellers' ? '#121826' : 'transparent',
                  color: activeTab === 'bestsellers' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Best Sellers
              </button>
              <button
                onClick={() => setActiveTab('automatic')}
                style={{
                  padding: '0.55rem 1.4rem',
                  borderRadius: '30px',
                  background: activeTab === 'automatic' ? '#121826' : 'transparent',
                  color: activeTab === 'automatic' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Automatic Mechanical
              </button>
            </div>
          </div>

          {/* Animated Product Grid with Framer Motion */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.75rem'
              }}
            >
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={(p) => {
                    onSelectProduct(p);
                    setCurrentView('product-detail');
                  }}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* View All Button */}
          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-outline-gold btn-lg"
              onClick={() => setCurrentView('shop')}
              style={{ gap: '0.6rem' }}
            >
              <span>View All 50+ Models in Catalog</span>
              <ArrowRight size={17} />
            </motion.button>
          </div>
        </div>
      </section>

      {/* 4. Craftsmanship Standards Banner */}
      <WatchSpecsBanner />

      {/* 5. Clean Editorial WhatsApp Live Video Banner */}
      <section style={{ padding: '5rem 0', background: '#F4F9F6', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '780px' }}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            style={{ width: 62, height: 62, borderRadius: '50%', background: 'var(--wa-gradient)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', boxShadow: 'var(--shadow-wa)' }}
          >
            <MessageCircle size={30} color="#FFF" />
          </motion.div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 600 }}>
            Request a Live 4K Video Before Ordering
          </h2>
          <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '2rem' }}>
            A fine timepiece is appreciated in motion. Simply message Khodal Fashion on WhatsApp with the model name, and our horology specialist will send you a crisp 4K wrist video showing dial texture, sweeping hands, and bracelet finish.
          </p>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={`https://api.whatsapp.com/send?phone=91${cleanPhone}&text=Hello%20Khodal%20Fashion!%20I%20want%20to%20request%20a%20live%20video%20demo%20of%20a%20watch.`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-lg"
            style={{ display: 'inline-flex', gap: '0.65rem' }}
          >
            <MessageCircle size={20} />
            <span>Request WhatsApp Video Demo (+91 {storeConfig.whatsappNumber})</span>
          </motion.a>
        </div>
      </section>

      {/* 6. Verified Reviews Section */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--gold-primary)', fontWeight: 700 }}>
              TESTIMONIALS
            </span>
            <h2 style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)', color: 'var(--text-primary)', marginTop: '0.35rem', fontWeight: 600 }}>
              What Khodal Fashion Clients Say
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                name: 'Karan Mehra',
                city: 'Delhi',
                watch: 'Tissot PRX Silver Ice-Blue',
                review: 'Ordered from Khodal Fashion via WhatsApp and received the watch in Delhi in just 3 days! The ice-blue dial finish and weight of the solid steel bracelet are unbelievable at this price.',
                rating: 5
              },
              {
                name: 'Vikram Joshi',
                city: 'Ahmedabad',
                watch: 'Casio G-Shock GM2100 Octagon',
                review: 'Khodal Fashion sent me a live video on WhatsApp before dispatch. The metal bezel is sharp and packaging was top notch with the metal tin box.',
                rating: 5
              },
              {
                name: 'Pooja Singhania',
                city: 'Mumbai',
                watch: 'Gucci Interlocking G Rose Gold',
                review: 'Purchased for my sister’s engagement. The emerald green dial and diamond cuts look extremely royal. 100% recommended!',
                rating: 5
              }
            ].map((rev, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -3 }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
                }}
              >
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', color: '#D97706' }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="#D97706" color="#D97706" />
                  ))}
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1, fontStyle: 'italic' }}>
                  "{rev.review}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                  <div>
                    <h5 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', margin: 0, fontWeight: 600 }}>{rev.name}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Buyer, {rev.city}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--wa-green)', fontSize: '0.72rem', fontWeight: 600 }}>
                    <CheckCircle size={14} />
                    <span>Verified Order</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
