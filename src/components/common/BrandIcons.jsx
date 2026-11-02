import React from 'react';

/**
 * Official WhatsApp glyph (Simple Icons, CC0).
 * Drop-in replacement for lucide's MessageCircle: accepts size, color, style, className.
 */
export const WhatsAppIcon = ({ size = 18, color = 'currentColor', style = {}, className = '', ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
    style={{ flexShrink: 0, ...style }}
    {...rest}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

/* --------------------------------------------------------------------------
 * Fine-line horology icon set (hand-tuned, 1.2px hairline strokes)
 * Designed to feel engraved rather than "generic UI".
 * -------------------------------------------------------------------------- */
const LineIcon = ({ size = 28, color = 'currentColor', children, style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke={color}
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ flexShrink: 0, ...style }}
  >
    {children}
  </svg>
);

// Certified seal with rosette edge + check
export const SealIcon = (p) => (
  <LineIcon {...p}>
    <path d="M16 3.5l2.3 1.7 2.8-.4 1.1 2.6 2.6 1.1-.4 2.8 1.7 2.3-1.7 2.3.4 2.8-2.6 1.1-1.1 2.6-2.8-.4L16 23.7l-2.3-1.7-2.8.4-1.1-2.6-2.6-1.1.4-2.8L5.9 13.6l1.7-2.3-.4-2.8 2.6-1.1 1.1-2.6 2.8.4z" />
    <circle cx="16" cy="13.6" r="5.6" />
    <path d="M13.6 13.7l1.7 1.7 3.2-3.3" />
    <path d="M11.5 22.6L10 29l3.4-1.9L16 29.5l2.6-2.4L22 29l-1.5-6.4" />
  </LineIcon>
);

// Courier box with motion lines
export const ParcelIcon = (p) => (
  <LineIcon {...p}>
    <path d="M9 10.5L18.5 6l9.5 4.5v11L18.5 26 9 21.5z" />
    <path d="M9 10.5l9.5 4.5 9.5-4.5" />
    <path d="M18.5 15v11" />
    <path d="M13.7 8.3l9.4 4.6v4" />
    <path d="M2.5 13h4M1.5 17h5M3.5 21h3" />
  </LineIcon>
);

// Watch movement / balance wheel
export const MovementIcon = (p) => (
  <LineIcon {...p}>
    <circle cx="16" cy="16" r="11.5" />
    <circle cx="16" cy="16" r="7.5" />
    <circle cx="16" cy="16" r="1.4" />
    <path d="M16 8.5v6.1M16 17.4v6.1M8.5 16h6.1M17.4 16h6.1" />
    <path d="M16 2.2v2.3M16 27.5v2.3M2.2 16h2.3M27.5 16h2.3" />
  </LineIcon>
);

// Video camera with play (live demo)
export const LiveVideoIcon = (p) => (
  <LineIcon {...p}>
    <rect x="3.5" y="9" width="18" height="14" rx="2.5" />
    <path d="M21.5 14l7-4v12l-7-4" />
    <path d="M10.5 13.2v5.6l4.6-2.8z" />
  </LineIcon>
);

// Exchange arrows
export const ExchangeIcon = (p) => (
  <LineIcon {...p}>
    <path d="M6 12h17l-4.5-4.5" />
    <path d="M26 20H9l4.5 4.5" />
  </LineIcon>
);

/* --------------------------------------------------------------------------
 * Real brand marks served from /public/brands (Simple Icons, CC0)
 * -------------------------------------------------------------------------- */
export const BrandMark = ({ name, label, height = 18, mono = false, style = {} }) => (
  <img
    src={`/brands/${name}.svg`}
    alt={label || name}
    title={label || name}
    height={height}
    loading="lazy"
    style={{
      height,
      width: 'auto',
      display: 'block',
      filter: mono ? 'grayscale(1) brightness(1.8) contrast(0.9)' : 'none',
      opacity: mono ? 0.75 : 1,
      transition: 'filter 0.25s ease, opacity 0.25s ease',
      ...style
    }}
  />
);

export default WhatsAppIcon;

