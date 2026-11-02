import React from 'react';
import { Shield, Sparkles, Droplets, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export const WatchSpecsBanner = () => {
  const specs = [
    {
      icon: Shield,
      title: '316L Surgical Steel',
      desc: 'Corrosion-proof solid marine steel cases and integrated link bracelets, satin-brushed with mirror-polished chamfers.'
    },
    {
      icon: Sparkles,
      title: 'Sapphire Crystal Glass',
      desc: 'Diamond-hard anti-reflective coated sapphire crystal that resists daily scuffs, scratches, and abrasions.'
    },
    {
      icon: Droplets,
      title: 'Water Resistance 5-20 ATM',
      desc: 'Multi-gasket sealed crown and screw-down case-back engineered to withstand rain, handwashing, and aquatic sports.'
    },
    {
      icon: Cpu,
      title: 'Japanese & Swiss Calibres',
      desc: 'High-beat automatic rotors with 40-hour power reserves and high-torque chronographs with sweeping sub-dials.'
    }
  ];

  return (
    <section style={{ padding: '5rem 0', background: '#F8F7F4', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
          <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--gold-primary)', fontWeight: 700 }}>
            UNCOMPROMISING HOROLOGY STANDARDS
          </span>
          <h2 style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)', color: 'var(--text-primary)', marginTop: '0.4rem', marginBottom: '0.6rem', fontWeight: 600 }}>
            Built With Precision. Finished by Hand.
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            Every timepiece at Khodal Fashion undergoes rigorous pressure testing, timing calibration, and multi-point visual inspection before dispatch.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.75rem' }}>
          {specs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6, borderColor: 'var(--gold-border-strong)' }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '2.2rem 1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  boxShadow: '0 4px 14px rgba(18, 24, 38, 0.03)',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div style={{ width: 50, height: 50, borderRadius: '12px', background: 'var(--gold-light)', border: '1px solid var(--gold-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', boxShadow: '0 2px 8px rgba(148, 108, 31, 0.12)' }}>
                  <Icon size={24} color="var(--gold-primary)" />
                </div>
                <h4 style={{ fontSize: '1.08rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 700 }}>{item.title}</h4>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
