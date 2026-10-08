import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export const WishlistPage = ({ setCurrentView, onSelectProduct }) => {
  const { wishlist } = useStore();

  return (
    <div style={{ padding: '3.5rem 0 6rem 0', background: 'var(--bg-main)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#FFE4E6', border: '1px solid #FDA4AF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Heart size={24} color="#E11D48" fill="#E11D48" />
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.7rem)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            My Watch Wishlist
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            Your saved luxury timepieces ({wishlist.length} items)
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#FFFFFF', borderRadius: '14px', border: '1px solid var(--border-subtle)', maxWidth: '580px', margin: '0 auto', boxShadow: 'var(--shadow-sm)' }}>
            <Heart size={44} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 600 }}>Your Wishlist is Empty</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
              Explore our curation of automatic, chronograph, and luxury dress watches and save your favorite timepieces here.
            </p>
            <button className="btn btn-dark" onClick={() => setCurrentView('shop')}>
              <span>Browse All Watches</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {wishlist.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelectProduct={(item) => {
                  onSelectProduct(item);
                  setCurrentView('product-detail');
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
