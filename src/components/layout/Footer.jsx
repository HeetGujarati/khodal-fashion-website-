import React from 'react';
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { KhodalLogo } from '../common/KhodalLogo';
import {
  WhatsAppIcon,
  SealIcon,
  ParcelIcon,
  MovementIcon,
  LiveVideoIcon,
  BrandMark
} from '../common/BrandIcons';

const TRUST_POINTS = [
  {
    num: 'I',
    Icon: SealIcon,
    title: 'Checked before it ships',
    text: 'Every watch is inspected, timed and photographed before dispatch.'
  },
  {
    num: 'II',
    Icon: ParcelIcon,
    title: 'Luxury Box Packaging',
    text: 'Every watch arrives in a solid presentation box with cushion.'
  },
  {
    num: 'III',
    Icon: MovementIcon,
    title: '1-year movement warranty',
    text: 'Plus a 7-day easy exchange if it’s not quite right.'
  },
  {
    num: 'IV',
    Icon: LiveVideoIcon,
    title: 'See it live first',
    text: 'Ask for a real wrist video on WhatsApp before you pay.'
  }
];

const PAYMENTS = [
  { name: 'googlepay', label: 'Google Pay', h: 16 },
  { name: 'phonepe', label: 'PhonePe', h: 18 },
  { name: 'paytm', label: 'Paytm', h: 12 },
  { name: 'visa', label: 'Visa', h: 12 },
  { name: 'mastercard', label: 'Mastercard', h: 18 },
  { name: 'americanexpress', label: 'American Express', h: 18 }
];

export const Footer = ({ setCurrentView }) => {
  const { storeConfig, setSelectedCategory } = useStore();
  const phone = storeConfig.whatsappNumber;

  const goCategory = (catId) => {
    setSelectedCategory(catId);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goView = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const waLink = (msg) =>
    `https://api.whatsapp.com/send?phone=91${phone}&text=${encodeURIComponent(msg)}`;

  return (
    <>
      {/* ================= TRUST BAND (editorial, light) ================= */}
      <section className="kf-trust-band" aria-label="Why shop with Khodal Fashion">
        <div className="container">
          <div className="kf-trust-grid">
            {TRUST_POINTS.map(({ num, Icon, title, text }) => (
              <div className="kf-trust-item" key={num}>
                <div className="kf-trust-head">
                  <Icon size={30} color="var(--gold-primary)" />
                  <span className="kf-trust-num">{num}</span>
                </div>
                <h4 className="kf-trust-title">{title}</h4>
                <p className="kf-trust-text">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MAIN FOOTER (obsidian) ================= */}
      <footer className="kf-footer">
        <div className="container">
          {/* Top: brand statement + WhatsApp CTA */}
          <div className="kf-footer-top">
            <div className="kf-footer-brand">
              <KhodalLogo size={56} rounded="50%" />
              <div>
                <div className="kf-footer-wordmark">Khodal Fashion</div>
                <div className="kf-footer-sub">Watch Boutique · Surat, India</div>
              </div>
            </div>

            <p className="kf-footer-statement">
              Good watches, honestly priced — <em>chosen by hand</em> and delivered to your door.
            </p>

            <a
              href={waLink('Hello Khodal Fashion! I would like to see your latest watches.')}
              target="_blank"
              rel="noopener noreferrer"
              className="kf-footer-wa"
            >
              <WhatsAppIcon size={20} color="#25D366" />
              <span>
                <small>Chat with us</small>
                +91 {phone}
              </span>
              <ArrowUpRight size={16} />
            </a>
          </div>

          {/* Link columns */}
          <div className="kf-footer-cols">
            <div>
              <h5 className="kf-footer-h">Shop</h5>
              <ul className="kf-footer-list">
                <li><button onClick={() => goCategory('all')}>All Watches</button></li>
                <li><button onClick={() => goCategory('mens-watches')}>Men’s Watches</button></li>
                <li><button onClick={() => goCategory('ladies-watches')}>Women’s Watches</button></li>
                <li><button onClick={() => goCategory('automatic')}>Automatic</button></li>
                <li><button onClick={() => goCategory('chronograph')}>Chronograph</button></li>
              </ul>
            </div>

            <div>
              <h5 className="kf-footer-h">Help</h5>
              <ul className="kf-footer-list">
                <li><button onClick={() => goView('track')}>Track your order</button></li>
                <li><button onClick={() => goView('wishlist')}>Your wishlist</button></li>
                <li>
                  <a href={waLink('Hello! I would like a live video of a watch before ordering.')} target="_blank" rel="noopener noreferrer">
                    Request a live video
                  </a>
                </li>
                <li><span>7-day easy exchange</span></li>
                <li><span>Cash on delivery available</span></li>
              </ul>
            </div>

            <div>
              <h5 className="kf-footer-h">Visit</h5>
              <ul className="kf-footer-contact">
                <li>
                  <MapPin size={15} strokeWidth={1.5} />
                  <span>{storeConfig.storeAddress}</span>
                </li>
                <li>
                  <Phone size={15} strokeWidth={1.5} />
                  <a href={`tel:+91${phone}`}>+91 {phone}</a>
                </li>
                <li>
                  <Mail size={15} strokeWidth={1.5} />
                  <a href={`mailto:${storeConfig.supportEmail}`}>{storeConfig.supportEmail}</a>
                </li>
                <li>
                  <Clock size={15} strokeWidth={1.5} />
                  <span>Mon–Sun · 10 AM – 9 PM</span>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="kf-footer-h">Follow</h5>
              <div className="kf-footer-social">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <BrandMark name="instagram" label="Instagram" height={18} mono />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <BrandMark name="facebook" label="Facebook" height={18} mono />
                </a>
                <a href={waLink('Hello Khodal Fashion!')} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <WhatsAppIcon size={18} color="rgba(255,255,255,0.75)" />
                </a>
              </div>
              <p className="kf-footer-note">
                New arrivals every week. Follow us for real wrist shots and unboxing videos.
              </p>
            </div>
          </div>

          {/* Payments */}
          <div className="kf-footer-pay">
            <span className="kf-footer-pay-label">We accept</span>
            <div className="kf-footer-pay-row">
              {PAYMENTS.map((p) => (
                <span className="kf-pay-chip" key={p.name}>
                  <BrandMark name={p.name} label={p.label} height={p.h} />
                </span>
              ))}
              <span className="kf-pay-chip kf-pay-text">UPI</span>
              <span className="kf-pay-chip kf-pay-text">COD</span>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="kf-footer-bottom">
            <div onDoubleClick={() => { window.location.hash = 'admin'; }} style={{ cursor: 'default' }}>
              © {new Date().getFullYear()} {storeConfig.storeName}. All rights reserved.
            </div>
            <div className="kf-footer-legal">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Shipping</span>
              <span>Returns</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
