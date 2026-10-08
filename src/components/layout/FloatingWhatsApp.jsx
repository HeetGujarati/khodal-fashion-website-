import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const FloatingWhatsApp = () => {
  const { storeConfig } = useStore();
  const [showTooltip, setShowTooltip] = useState(false);

  const cleanPhone = storeConfig.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 990 }}>
      {/* Mini popup card if tooltip is active */}
      {showTooltip && (
        <div 
          style={{
            position: 'absolute',
            bottom: '65px',
            right: '0',
            width: '280px',
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '1.2rem',
            boxShadow: 'var(--shadow-lg)',
            animation: 'slideUp 0.25s ease-out',
            color: 'var(--text-primary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--wa-green)' }} />
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>Watch Concierge Online</span>
            </div>
            <button 
              onClick={() => setShowTooltip(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
            >
              <X size={15} />
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.9rem' }}>
            Request live watch videos, high-res dial wrist shots, and order confirmation directly on WhatsApp.
          </p>
          <a
            href={`https://api.whatsapp.com/send?phone=91${cleanPhone}&text=Hello!%20I%20am%20browsing%20your%20website%20and%20want%20to%20see%20watches.`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-sm"
            style={{ width: '100%' }}
          >
            Start WhatsApp Chat
          </a>
        </div>
      )}

      {/* Persistent floating trigger */}
      <a
        href={`https://api.whatsapp.com/send?phone=91${cleanPhone}&text=Hello%20Khodal%20Fashion!%20I%20want%20to%20order%20a%20luxury%20watch.`}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp"
        onMouseEnter={() => setShowTooltip(true)}
      >
        <MessageCircle size={20} />
        <span>Inquire on WhatsApp</span>
      </a>
    </div>
  );
};
