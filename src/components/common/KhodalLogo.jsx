import React from 'react';

/**
 * KhodalLogo: Haute Horlogerie Luxury Brand Logo for Khodal Fashion
 * Features the custom generated 24K gold interlocking monogram & regal watch-gear coronet
 * presented as a circular luxury medallion with a polished gold bezel rim.
 */
export const KhodalLogo = ({ 
  size = 44, 
  rounded = '50%', 
  showBorder = true,
  className = '', 
  style = {} 
}) => {
  return (
    <div 
      className={`khodal-brand-badge ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        borderRadius: rounded,
        overflow: 'hidden',
        background: '#0B0D12',
        border: showBorder ? '1.8px solid rgba(212, 175, 55, 0.85)' : 'none',
        boxShadow: showBorder 
          ? '0 3px 12px rgba(148, 108, 31, 0.3), 0 0 10px rgba(212, 175, 55, 0.25)' 
          : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
        ...style
      }}
    >
      <img 
        src="/khodal_fashion_logo.jpg" 
        alt="Khodal Fashion Luxury Logo" 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transform: 'scale(1.08)'
        }}
      />
    </div>
  );
};

export default KhodalLogo;
