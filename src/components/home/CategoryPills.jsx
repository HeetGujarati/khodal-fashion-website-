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
                  background: isSelected ? '#FAF8F4' : '#FFFFFF',
                  border: isSelected ? '2px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '1.4rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isSelected ? '0 8px 24px rgba(148, 108, 31, 0.12)' : '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                {/* Category Thumbnail */}
                <motion.div 
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    border: isSelected ? '2px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    background: '#F5F4F0'
                  }}
                  whileHover={{ scale: 1.06 }}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </motion.div>

                <h4 style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {cat.name}
                </h4>

                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  {cat.badge}
                </span>

                <div 
                  style={{
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: isSelected ? 'var(--gold-primary)' : 'var(--text-secondary)',
                    marginTop: 'auto'
                  }}
                >
                  {isSelected ? '● Selected' : 'Explore →'}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
