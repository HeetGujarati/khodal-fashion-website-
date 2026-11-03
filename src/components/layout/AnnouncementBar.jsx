import React, { useState, useEffect } from 'react';
import { Phone, Sparkles, Truck, ShieldCheck } from 'lucide-react';
import { WhatsAppIcon as MessageCircle } from '../common/BrandIcons';
import { useStore } from '../../context/StoreContext';

export const AnnouncementBar = () => {
  const { storeConfig } = useStore();
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (!storeConfig.announcements || storeConfig.announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % storeConfig.announcements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [storeConfig.announcements]);

  const cleanPhone = storeConfig.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="announcement-bar">
      <div className="container announcement-content">
        {/* Left: Contact Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="d-none d-md-flex">
          <a
            href={`tel:+91${cleanPhone}`}
            style={{ color: '#E2E8F0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
          >
            <Phone size={13} color="var(--gold-accent)" />
            <span>+91 {storeConfig.whatsappNumber}</span>
          </a>
          <span style={{ opacity: 0.3, color: '#94A3B8' }}>|</span>
          <a
            href={`https://api.whatsapp.com/send?phone=91${cleanPhone}&text=Hello%20Khodal%20Fashion!%20I%20have%20an%20inquiry.`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#4ADE80', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 600 }}
          >
            <MessageCircle size={13} />
            <span>WhatsApp Support</span>
          </a>
        </div>

        {/* Center: Live Rotating Announcement */}
        <div className="announcement-ticker" style={{ margin: '0 auto', textAlign: 'center' }}>
          <Sparkles size={13} color="var(--gold-accent)" />
          <span style={{ letterSpacing: '0.03em', fontSize: '0.8rem' }}>
            {storeConfig.announcements[currentIdx] || '100% Original Certified Luxury Watches | Direct WhatsApp Concierge'}
          </span>
        </div>

        {/* Right: Guarantee badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="d-none d-lg-flex">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.76rem', color: '#CBD5E1' }}>
            <Sparkles size={13} color="var(--gold-accent)" />
            Live 4K Preview
          </span>
          <span style={{ opacity: 0.3, color: '#94A3B8' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.76rem', color: '#CBD5E1' }}>
            <ShieldCheck size={13} color="var(--gold-accent)" />
            1-Year Warranty
          </span>
        </div>
      </div>
    </div>
  );
};
