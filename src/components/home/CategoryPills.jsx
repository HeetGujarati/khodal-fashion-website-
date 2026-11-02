import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../context/StoreContext';

export const CategoryPills = ({ onCategorySelect }) => {
  const { categories, selectedCategory, setSelectedCategory } = useStore();

  const handleSelect = (catId) => {
    setSelectedCategory(catId);
    if (onCategorySelect) onCategorySelect(catId);
  };

  return (
    <section style={{ padding: '3.5rem 0', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--gold-primary)', fontWeight: 700 }}>
            EXPLORE BY CATEGORY
          </span>
          <h2 style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)', color: 'var(--text-primary)', marginTop: '0.35rem', fontWeight: 600 }}>
            Curated Horology Collections
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
            Discover precision movements designed for executive, sport, and formal occasions
          </p>
        </div>

        <div className="category-pills-grid">
          {categories.map((cat, idx) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <motion.div
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                style={{
                  background: isSelected ? 'linear-gradient(180deg, #FBF8F2 0%, #F7F1E6 100%)' : '#FFFFFF',
                  border: isSelected ? '1.5px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '1.5rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isSelected ? '0 12px 28px rgba(148, 108, 31, 0.14)' : '0 2px 8px rgba(18, 24, 38, 0.03)',
                  transition: 'all 0.25s ease'
                }}
              >
                {/* Category Thumbnail with Horology Bezel Ring */}
                <motion.div 
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    border: isSelected ? '3px solid var(--gold-primary)' : '2px solid rgba(148, 108, 31, 0.28)',
                    boxShadow: isSelected ? '0 0 0 4px rgba(148, 108, 31, 0.18), 0 6px 16px rgba(0,0,0,0.1)' : '0 3px 10px rgba(0,0,0,0.06)',
                    background: '#F5F4F0'
                  }}
                  whileHover={{ scale: 1.08 }}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </motion.div>

                <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  {cat.name}
                </h4>

                <span style={{ 
                  fontSize: '0.7rem', 
                  color: isSelected ? 'var(--gold-dark)' : 'var(--text-muted)', 
                  marginBottom: '0.85rem',
                  fontWeight: 600,
                  background: isSelected ? 'rgba(148, 108, 31, 0.12)' : 'var(--bg-subtle)',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  {cat.badge}
                </span>

                <div 
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: isSelected ? 'var(--gold-primary)' : 'var(--text-secondary)',
                    marginTop: 'auto',
                    letterSpacing: '0.03em'
                  }}
                >
                  {isSelected ? '● Viewing Collection' : 'Explore →'}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
