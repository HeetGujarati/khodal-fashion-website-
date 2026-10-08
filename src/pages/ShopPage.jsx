import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

export const ShopPage = ({ onSelectProduct, setCurrentView }) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { 
    products, 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    sortBy, 
    setSortBy,
    priceRange, 
    setPriceRange 
  } = useStore();

  // Filter products
  let filtered = products.filter((p) => {
    // Category filter
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchBrand = p.brand?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchSku = p.sku?.toLowerCase().includes(q);
      if (!matchTitle && !matchBrand && !matchDesc && !matchSku) {
        return false;
      }
    }
    // Price range
    if (p.price > priceRange) {
      return false;
    }
    return true;
  });

  // Sorting
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange(5000);
    setSortBy('featured');
  };

  return (
    <div style={{ padding: '3rem 0 5rem 0', background: 'var(--bg-main)' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--gold-primary)', fontWeight: 700 }}>
            Khodal Fashion • Haute Horlogerie Catalogue
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.7rem)', color: 'var(--text-primary)', marginTop: '0.2rem', fontWeight: 600 }}>
            All Luxury Timepieces
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Showing {filtered.length} of {products.length} exclusive models ready for express WhatsApp dispatch
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="d-lg-none" style={{ marginBottom: '1.25rem' }}>
          <button 
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="btn btn-outline-gold"
            style={{ width: '100%', justifyContent: 'space-between', padding: '0.75rem 1.1rem', borderRadius: '10px' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <SlidersHorizontal size={16} />
              <span>Filter Watches ({selectedCategory !== 'all' ? categories.find(c => c.id === selectedCategory)?.name || 'Filtered' : 'All Collections'})</span>
            </span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>
              {mobileFiltersOpen ? '▲ Hide Filters' : '▼ Show Filters'}
            </span>
          </button>
        </div>

        {/* 2-Column Responsive Layout: Sidebar Filters & Product Grid */}
        <div className="shop-layout">
          
          {/* LEFT SIDEBAR: FILTERS */}
          <div 
            className={`shop-sidebar ${mobileFiltersOpen ? 'mobile-open' : 'd-none d-lg-block'}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SlidersHorizontal size={17} color="var(--gold-primary)" />
                <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', margin: 0, fontWeight: 600 }}>Filters</h3>
              </div>
              <button
                onClick={resetFilters}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            </div>

            {/* Category Selector */}
            <div style={{ marginBottom: '2rem' }}>
              <label className="form-label">Collections</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {categories.map((c) => {
                  const active = selectedCategory === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedCategory(c.id);
                        setMobileFiltersOpen(false);
                      }}
                      style={{
                        padding: '0.6rem 0.85rem',
                        borderRadius: '8px',
                        background: active ? 'var(--gold-light)' : 'transparent',
                        border: active ? '1px solid var(--gold-border)' : '1px solid transparent',
                        color: active ? 'var(--gold-primary)' : 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        fontWeight: active ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s'
                      }}
                    >
                      <span>{c.name}</span>
                      <span style={{ fontSize: '0.72rem', color: active ? 'var(--gold-primary)' : 'var(--text-muted)' }}>
                        {c.id === 'all' ? products.length : products.filter(p => p.category === c.id).length}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Max Budget</label>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
                  ₹{priceRange.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="1500"
                max="5000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--gold-primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                <span>₹1,500</span>
                <span>₹5,000</span>
              </div>
            </div>

            {/* WhatsApp Custom Sourcing Box */}
            <div style={{ background: 'var(--wa-light)', border: '1px solid var(--wa-border)', borderRadius: '10px', padding: '1.1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', margin: '0 0 0.75rem 0', lineHeight: 1.5 }}>
                Searching for a specific watch model? Send us a reference photo on WhatsApp:
              </p>
              <a
                href={`https://api.whatsapp.com/send?phone=917383556275&text=Hello!%20I%20am%20looking%20for%20a%20specific%20watch%20model.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm"
                style={{ width: '100%' }}
              >
                Find on WhatsApp
              </a>
            </div>
          </div>

          {/* RIGHT SIDE: PRODUCT GRID & TOP SORT */}
          <div className="shop-content">
            {/* Top Toolbar */}
            <div className="shop-toolbar">
              {/* Search Bar */}
              <div className="shop-search-box">
                <Search size={16} color="var(--gold-primary)" style={{ marginRight: '0.5rem', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search by model or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', width: '100%' }}
                />
              </div>

              {/* Sort By Dropdown */}
              <div className="shop-sort-box">
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', width: 'auto' }}
                >
                  <option value="featured">Featured Picks</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Customer Rating</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#FFFFFF', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Watches Match Your Filter</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  Try resetting your price range or search terms to view all models.
                </p>
                <button className="btn btn-dark btn-sm" onClick={resetFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '1.75rem'
                }}
              >
                {filtered.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelectProduct={(item) => {
                      onSelectProduct(item);
                      setCurrentView('product-detail');
                    }}
                  />
                ))}
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
