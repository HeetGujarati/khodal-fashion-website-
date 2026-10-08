import React, { useState } from 'react';
import { Search, Truck, CheckCircle2, MessageCircle, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const TrackOrderPage = () => {
  const { storeConfig } = useStore();
  const [searchInput, setSearchInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const cleanPhone = storeConfig.whatsappNumber.replace(/[^0-9]/g, '');

  const handleTrack = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setHasSearched(true);
    const existingOrders = JSON.parse(localStorage.getItem('khodal_orders') || localStorage.getItem('ditya_orders') || '[]');
    
    // Look up by Order ID or Phone number
    const found = existingOrders.find(
      (o) => o.orderId.toLowerCase() === searchInput.trim().toLowerCase() ||
             o.customer?.phone?.includes(searchInput.trim())
    );

    if (found) {
      setTrackedOrder(found);
    } else {
      // Create simulated tracking for demo if not in local storage
      setTrackedOrder({
        orderId: searchInput.toUpperCase().startsWith('KF-') ? searchInput.toUpperCase() : `KF-${Math.floor(100000 + Math.random() * 900000)}`,
        productTitle: 'Khodal Fashion Octagon Bezel / Luxury Automatic Watch',
        variant: 'Ice Blue Edition',
        price: 1898,
        createdAt: new Date().toISOString(),
        customer: {
          name: 'Valued Customer',
          city: 'Mumbai / Delhi',
          phone: searchInput
        },
        status: 'In Transit with Express Air Courier'
      });
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem 0', background: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--gold-light)', border: '1px solid var(--gold-border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Truck size={26} color="var(--gold-primary)" />
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.7rem)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Live Order Tracking
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            Enter your 6-digit WhatsApp Order ID or 10-digit mobile number to track dispatch status
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleTrack} style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '0.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, paddingLeft: '0.75rem' }}>
              <Search size={19} color="var(--gold-primary)" style={{ marginRight: '0.75rem' }} />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. KF-849120) or Phone Number..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.96rem',
                  width: '100%'
                }}
              />
            </div>
            <button type="submit" className="btn btn-dark">
              <span>Track Parcel</span>
            </button>
          </div>
        </form>

        {/* Tracking Details Results */}
        {hasSearched && trackedOrder && (
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '2rem', boxShadow: 'var(--shadow-sm)', animation: 'fadeIn 0.3s ease' }}>
            {/* Header info */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TRACKING ID:</span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--gold-primary)', margin: 0, fontWeight: 700 }}>{trackedOrder.orderId}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge-gold">● {trackedOrder.status}</span>
              </div>
            </div>

            {/* Watch Snippet */}
            <div style={{ background: '#FAF9F6', borderRadius: '10px', padding: '1rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-subtle)' }}>
              <div>
                <h4 style={{ fontSize: '0.96rem', color: 'var(--text-primary)', margin: '0 0 0.2rem 0', fontWeight: 600 }}>{trackedOrder.productTitle}</h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Variant: {trackedOrder.variant}</span>
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                ₹{trackedOrder.price.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Stepper Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', position: 'relative', paddingLeft: '2rem', borderLeft: '2px solid var(--gold-border)', marginLeft: '1rem', marginBottom: '2.5rem' }}>
              {/* Step 1 */}
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-2.7rem', top: '0', width: 24, height: 24, borderRadius: '50%', background: 'var(--wa-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={15} color="#FFF" />
                </div>
                <h5 style={{ fontSize: '0.94rem', color: 'var(--text-primary)', margin: '0 0 0.2rem 0', fontWeight: 600 }}>Order Received & WhatsApp Verified</h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Customer order confirmed via WhatsApp concierge desk.</p>
              </div>

              {/* Step 2 */}
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-2.7rem', top: '0', width: 24, height: 24, borderRadius: '50%', background: 'var(--wa-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={15} color="#FFF" />
                </div>
                <h5 style={{ fontSize: '0.94rem', color: 'var(--text-primary)', margin: '0 0 0.2rem 0', fontWeight: 600 }}>Quality Check & Calibre Inspection Passed</h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Accuracy timing verified; packed safely in hardcase presentation box.</p>
              </div>

              {/* Step 3 */}
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-2.7rem', top: '0', width: 24, height: 24, borderRadius: '50%', background: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={13} color="#FFF" />
                </div>
                <h5 style={{ fontSize: '0.94rem', color: 'var(--gold-primary)', margin: '0 0 0.2rem 0', fontWeight: 600 }}>Dispatched via BlueDart / Delhivery Air Express</h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>In transit to destination delivery hub. Expected delivery: 2-3 business days.</p>
              </div>

              {/* Step 4 */}
              <div style={{ position: 'relative', opacity: 0.55 }}>
                <div style={{ position: 'absolute', left: '-2.7rem', top: '0', width: 24, height: 24, borderRadius: '50%', background: '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={13} color="#FFF" />
                </div>
                <h5 style={{ fontSize: '0.94rem', color: 'var(--text-primary)', margin: '0 0 0.2rem 0', fontWeight: 600 }}>Out for Delivery</h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Courier executive will call before doorstep delivery.</p>
              </div>
            </div>

            {/* Need Help WhatsApp Callout */}
            <div style={{ background: 'var(--wa-light)', border: '1px solid var(--wa-border)', borderRadius: '10px', padding: '1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <h5 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', margin: '0 0 0.2rem 0', fontWeight: 600 }}>Have Questions About Your Parcel?</h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Send your Order ID on WhatsApp to talk directly with our dispatch concierge.</p>
              </div>
              <a
                href={`https://api.whatsapp.com/send?phone=91${cleanPhone}&text=Hello!%20I%20am%20checking%20status%20for%20order%20${trackedOrder.orderId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm"
              >
                <MessageCircle size={15} />
                <span>WhatsApp Dispatch Help</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
