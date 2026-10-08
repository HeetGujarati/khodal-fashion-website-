import React from 'react';
import { 
  Watch, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Clock, 
  MessageCircle 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer = ({ setCurrentView, onOpenAdmin }) => {
  const { storeConfig, setSelectedCategory } = useStore();

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ background: '#F8F7F4', borderTop: '1px solid var(--border-subtle)', marginTop: '5rem', paddingTop: '4rem', paddingBottom: '2.5rem' }}>
      <div className="container">
        {/* Top Trust Banner */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '1.5rem', 
            padding: '2rem', 
            background: '#FFFFFF', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: '14px',
            marginBottom: '4rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--gold-light)', border: '1px solid var(--gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={24} color="var(--gold-primary)" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.15rem', fontWeight: 600 }}>100% Genuine Quality</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Authentic craft & calibre testing</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--wa-light)', border: '1px solid var(--wa-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={24} color="var(--wa-green)" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.15rem', fontWeight: 600 }}>Express Pan-India</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Insured bubble-cushioned delivery</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--gold-light)', border: '1px solid var(--gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={24} color="var(--gold-primary)" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.15rem', fontWeight: 600 }}>1-Year Movement Warranty</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Complete after-sales assistance</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--wa-light)', border: '1px solid var(--wa-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={24} color="var(--wa-green)" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.15rem', fontWeight: 600 }}>Instant WhatsApp Concierge</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Live video demos before purchase</p>
            </div>
          </div>
        </div>

        {/* 4-Column Footer Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3rem', marginBottom: '3.5rem' }}>
          {/* Column 1: Brand Info */}
          <div>
            <div className="nav-brand" style={{ marginBottom: '1rem' }}>
              <div className="nav-brand-logo">
                <Watch size={20} color="var(--gold-primary)" />
              </div>
              <div className="nav-brand-text">
                <h1>KHODAL FASHION</h1>
                <span>HAUTE HORLOGERIE</span>
              </div>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Khodal Fashion is India's premier luxury horology boutique. Delivering precision Japanese & Swiss automatic calibres, executive chronographs, and iconic solid-steel bracelets directly to connoisseurs.
            </p>
            <a
              href={`https://api.whatsapp.com/send?phone=91${storeConfig.whatsappNumber}&text=Hello%20Khodal%20Fashion!%20I%20want%20to%20inquire%20about%20your%20luxury%20watches.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-sm"
              style={{ display: 'inline-flex' }}
            >
              <MessageCircle size={15} />
              Connect on WhatsApp
            </a>
          </div>

          {/* Column 2: Watch Collections */}
          <div>
            <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '1.25rem', letterSpacing: '0.08em', fontWeight: 700, textTransform: 'uppercase' }}>COLLECTIONS</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.86rem' }}>
              <li>
                <span onClick={() => handleCategoryClick('mens-watches')} style={{ color: 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.2s' }}>
                  Men's Luxury Editions
                </span>
              </li>
              <li>
                <span onClick={() => handleCategoryClick('automatic')} style={{ color: 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.2s' }}>
                  Automatic & Skeleton Work
                </span>
              </li>
              <li>
                <span onClick={() => handleCategoryClick('chronograph')} style={{ color: 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.2s' }}>
                  Chronograph & Tachymeters
                </span>
              </li>
              <li>
                <span onClick={() => handleCategoryClick('ladies-watches')} style={{ color: 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.2s' }}>
                  Ladies Diamond & Rose Gold
                </span>
              </li>
              <li>
                <span onClick={() => handleCategoryClick('luxury-limited')} style={{ color: 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.2s' }}>
                  Limited Masterpiece Homages
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Tracking */}
          <div>
            <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '1.25rem', letterSpacing: '0.08em', fontWeight: 700, textTransform: 'uppercase' }}>CUSTOMER CARE</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.86rem' }}>
              <li>
                <span onClick={() => { setCurrentView('track'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Live Order Tracking
                </span>
              </li>
              <li>
                <span onClick={() => { setCurrentView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Explore All 50+ Models
                </span>
              </li>
              <li>
                <a href={`https://api.whatsapp.com/send?phone=91${storeConfig.whatsappNumber}&text=Hello%20Khodal%20Fashion!%20I%20want%20to%20request%20video%20call%20preview.`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  Request Video Call Preview
                </a>
              </li>
              <li>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Exchange Policy: 7 Days Seamless
                </span>
              </li>
              <li>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Packaging: Luxury Hardcase Tin Box
                </span>
              </li>
              {onOpenAdmin && (
                <li>
                  <span onClick={onOpenAdmin} style={{ color: 'var(--gold-primary)', cursor: 'pointer', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    ⚙ Store Admin Dashboard
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Contact & Store Address */}
          <div>
            <h4 style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '1.25rem', letterSpacing: '0.08em', fontWeight: 700, textTransform: 'uppercase' }}>OFFICIAL BOUTIQUE</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <MapPin size={17} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{storeConfig.storeAddress}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={17} color="var(--gold-primary)" style={{ flexShrink: 0 }} />
                <a href={`tel:+91${storeConfig.whatsappNumber}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  +91 {storeConfig.whatsappNumber}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={17} color="var(--gold-primary)" style={{ flexShrink: 0 }} />
                <a href={`mailto:${storeConfig.supportEmail}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {storeConfig.supportEmail}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock size={17} color="var(--gold-primary)" style={{ flexShrink: 0 }} />
                <span>24x7 WhatsApp Orders & Concierge</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <div>
            © 2026 {storeConfig.storeName}. All rights reserved. Designed for Fine Horology Enthusiasts.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Shipping Policy</span>
            {onOpenAdmin && (
              <span onClick={onOpenAdmin} style={{ cursor: 'pointer', color: 'var(--gold-primary)', fontWeight: 600 }}>
                ⚙ Admin Portal
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
