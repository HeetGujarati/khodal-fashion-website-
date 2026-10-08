import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  Watch,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';

export const Navbar = ({ currentView, setCurrentView, onOpenAdmin }) => {
  const { 
    cartTotalItems, 
    setIsCartOpen, 
    wishlist, 
    searchQuery, 
    setSearchQuery,
    setSelectedCategory,
    storeConfig
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'All Watches', category: 'all' },
    { id: 'mens', label: "Men's Luxury", category: 'mens-watches' },
    { id: 'automatic', label: 'Automatic', category: 'automatic' },
    { id: 'chrono', label: 'Chronograph', category: 'chronograph' },
    { id: 'ladies', label: 'Ladies', category: 'ladies-watches' },
    { id: 'track', label: 'Track Order' }
  ];

  const handleNavClick = (item) => {
    if (item.category) {
      setSelectedCategory(item.category);
      setCurrentView('shop');
    } else if (item.id === 'track') {
      setCurrentView('track');
    } else if (item.id === 'home') {
      setCurrentView('home');
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-inner">
          {/* Mobile Menu Button */}
          <button 
            className="btn-icon d-lg-none"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            style={{ display: 'flex' }}
          >
            <Menu size={20} />
          </button>

          {/* Brand Logo - Khodal Fashion */}
          <motion.div 
            className="nav-brand"
            onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{ cursor: 'pointer' }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="nav-brand-logo">
              <Watch size={22} color="var(--gold-primary)" />
            </div>
            <div className="nav-brand-text">
              <h1>KHODAL FASHION</h1>
              <span>HAUTE HORLOGERIE</span>
            </div>
          </motion.div>

          {/* Desktop Navigation Links */}
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.id}>
                <span
                  className={`nav-link ${
                    (currentView === item.id || (currentView === 'shop' && item.category)) ? 'active' : ''
                  }`}
                  onClick={() => handleNavClick(item)}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className="nav-actions">
            {/* Search Toggle */}
            <div style={{ position: 'relative' }}>
              {showSearchInput ? (
                <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid var(--gold-primary)', borderRadius: '25px', padding: '0.25rem 0.75rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <Search size={15} color="var(--gold-primary)" style={{ marginRight: '0.4rem' }} />
                  <input
                    type="text"
                    placeholder="Search Rolex, Casio, Tissot..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (currentView !== 'shop') setCurrentView('shop');
                    }}
                    autoFocus
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      width: '180px'
                    }}
                  />
                  <button 
                    onClick={() => { setShowSearchInput(false); setSearchQuery(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <button
                  className="btn-icon"
                  onClick={() => {
                    setShowSearchInput(true);
                    if (currentView !== 'shop') setCurrentView('shop');
                  }}
                  title="Search Timepieces"
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              className="btn-icon"
              style={{ position: 'relative' }}
              onClick={() => {
                setCurrentView('wishlist');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title="My Wishlist"
            >
              <Heart size={18} color={wishlist.length > 0 ? '#E11D48' : 'currentColor'} fill={wishlist.length > 0 ? '#E11D48' : 'none'} />
              {wishlist.length > 0 && (
                <span className="cart-btn-badge" style={{ background: '#E11D48', color: '#FFF' }}>
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              className="btn-icon"
              style={{ position: 'relative', background: 'var(--gold-light)', borderColor: 'var(--gold-border)' }}
              onClick={() => setIsCartOpen(true)}
              title="View Cart"
            >
              <ShoppingBag size={18} color="var(--gold-primary)" />
              {cartTotalItems > 0 && (
                <span className="cart-btn-badge">
                  {cartTotalItems}
                </span>
              )}
            </button>

            {/* Client Store Manager Trigger */}
            <button
              onClick={onOpenAdmin}
              title="Khodal Fashion Store Admin Dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '20px',
                background: 'rgba(148, 108, 31, 0.08)',
                border: '1px solid var(--gold-border)',
                color: 'var(--gold-primary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Settings size={14} />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu with Framer Motion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="drawer-overlay" 
            onClick={() => setMobileMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="drawer-container" 
              style={{ left: 0, right: 'auto' }}
              onClick={(e) => e.stopPropagation()}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="nav-brand">
                  <div className="nav-brand-logo">
                    <Watch size={20} color="var(--gold-primary)" />
                  </div>
                  <div className="nav-brand-text">
                    <h1>KHODAL FASHION</h1>
                    <span>LUXURY HOROLOGY</span>
                  </div>
                </div>
                <button className="btn-icon" onClick={() => setMobileMenuOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              {/* Menu Links */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {navItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      background: (currentView === item.id || (currentView === 'shop' && item.category)) ? 'var(--gold-light)' : 'transparent',
                      color: (currentView === item.id || (currentView === 'shop' && item.category)) ? 'var(--gold-primary)' : 'var(--text-primary)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{item.label}</span>
                    <span style={{ color: 'var(--gold-primary)', fontSize: '0.8rem' }}>→</span>
                  </motion.div>
                ))}

                <motion.div
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.04 }}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(148, 108, 31, 0.08)',
                    border: '1px solid var(--gold-border)',
                    color: 'var(--gold-primary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Settings size={16} />
                    <span>Admin Dashboard</span>
                  </div>
                  <span style={{ color: 'var(--gold-primary)', fontSize: '0.8rem' }}>⚙</span>
                </motion.div>
              </div>

              {/* WhatsApp Contact Box in Mobile Menu */}
              <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                  Need help picking a watch? Chat directly with our Khodal Fashion concierge on WhatsApp:
                </p>
                <a
                  href={`https://api.whatsapp.com/send?phone=91${storeConfig.whatsappNumber}&text=Hello%20Khodal%20Fashion!%20I%20need%20assistance%20picking%20a%20watch.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ width: '100%' }}
                >
                  Chat on WhatsApp (+91 {storeConfig.whatsappNumber})
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
