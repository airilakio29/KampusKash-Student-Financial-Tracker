import React, { useState } from 'react';
import { X, Star, ArrowRight, Compass } from 'lucide-react';

/**
 * Built-in Stylized Dark Vector Map of Ipoh
 * Rendered when user has not provided /public/ipoh-map.png or on image error.
 * Matches Kiro dark purple gemstone aesthetic with roads, Kinta River, parks, and area typography.
 */
function StylizedIpohSvgMap() {
  return (
    <svg
      viewBox="0 0 1000 650"
      className="static-map-svg"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Background Gradient */}
        <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#140D20" />
          <stop offset="50%" stopColor="#1A1128" />
          <stop offset="100%" stopColor="#120A1C" />
        </linearGradient>

        {/* River Gradient */}
        <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#254B62" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#1E3A5F" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#172B48" stopOpacity="0.85" />
        </linearGradient>

        {/* Limestone Hill / Karst Gradient */}
        <radialGradient id="hillGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3B264E" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#1E122B" stopOpacity="0" />
        </radialGradient>

        {/* Park Tint Gradient */}
        <linearGradient id="parkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.08" />
        </linearGradient>

        {/* Grid pattern */}
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(168, 85, 247, 0.04)" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Base Background */}
      <rect width="1000" height="650" fill="url(#mapBg)" />
      <rect width="1000" height="650" fill="url(#grid)" />

      {/* Stylized Limestone Hills (Gunung Rapat / Tambun / Lang) */}
      <ellipse cx="140" cy="180" rx="90" ry="60" fill="url(#hillGrad)" />
      <ellipse cx="880" cy="480" rx="100" ry="70" fill="url(#hillGrad)" />
      <ellipse cx="850" cy="140" rx="90" ry="60" fill="url(#hillGrad)" />
      <ellipse cx="160" cy="520" rx="80" ry="50" fill="url(#hillGrad)" />

      {/* Parks / Green Zones */}
      {/* Gunung Lang Recreation */}
      <path d="M 380,80 Q 420,70 450,110 T 420,160 Q 370,140 380,80 Z" fill="url(#parkGrad)" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1" />
      {/* Padang Ipoh / Town Green */}
      <rect x="420" y="300" width="45" height="30" rx="4" fill="url(#parkGrad)" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="1" />
      {/* Polo Ground / Sultan Abdul Aziz Recreation */}
      <rect x="620" y="270" width="70" height="45" rx="6" fill="url(#parkGrad)" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1" />
      {/* Kinta Riverfront Park */}
      <path d="M 460,250 Q 480,290 470,350 Q 455,320 460,250 Z" fill="url(#parkGrad)" />

      {/* Kinta River (Sungai Kinta) flowing through center between Old Town & New Town */}
      <path
        d="M 480,-20 
           Q 460,60 480,120 
           T 470,220 
           Q 460,270 475,320 
           T 490,400 
           Q 500,480 485,540 
           T 510,670"
        fill="none"
        stroke="url(#riverGrad)"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <path
        d="M 480,-20 
           Q 460,60 480,120 
           T 470,220 
           Q 460,270 475,320 
           T 490,400 
           Q 500,480 485,540 
           T 510,670"
        fill="none"
        stroke="#38BDF8"
        strokeWidth="2"
        strokeOpacity="0.4"
      />

      {/* Minor Tributary (Pinji River) */}
      <path
        d="M 480,380 Q 560,400 640,430 T 780,480"
        fill="none"
        stroke="url(#riverGrad)"
        strokeWidth="6"
        strokeOpacity="0.6"
      />

      {/* Expressway & Main Highway Arteries */}
      {/* North-South Expressway (E1) bypassing East */}
      <path
        d="M 520,-20 L 680,140 Q 780,240 820,380 L 860,670"
        fill="none"
        stroke="rgba(168, 85, 247, 0.35)"
        strokeWidth="5"
        strokeDasharray="8 4"
      />

      {/* Main East-West Trunk: Jalan Sultan Iskandar / Jalan Raja Dihilir */}
      <path
        d="M -20,340 Q 300,330 460,325 T 600,310 T 800,280 L 1020,260"
        fill="none"
        stroke="rgba(255, 255, 255, 0.22)"
        strokeWidth="4"
      />

      {/* North-South Trunk: Jalan Kuala Kangsar */}
      <path
        d="M 460,-20 Q 450,140 440,250 L 430,340 Q 420,440 380,560 L 340,670"
        fill="none"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="4"
      />

      {/* Jalan Sultan Nazrin Shah (Gopeng Road) towards South */}
      <path
        d="M 540,330 Q 560,420 590,520 L 640,670"
        fill="none"
        stroke="rgba(255, 255, 255, 0.22)"
        strokeWidth="4"
      />

      {/* Jalan Bercham linking to Northeast */}
      <path
        d="M 680,180 Q 750,170 850,160 L 1020,150"
        fill="none"
        stroke="rgba(255, 255, 255, 0.16)"
        strokeWidth="3"
      />

      {/* Jalan Tambun */}
      <path
        d="M 600,310 Q 720,260 840,240 L 1020,220"
        fill="none"
        stroke="rgba(255, 255, 255, 0.16)"
        strokeWidth="3"
      />

      {/* Jalan Lahat to Menglembu */}
      <path
        d="M 430,340 Q 320,390 220,440 L -20,500"
        fill="none"
        stroke="rgba(255, 255, 255, 0.16)"
        strokeWidth="3"
      />

      {/* Secondary Street Grid Network */}
      {/* Old Town Heritage Grid */}
      <line x1="390" y1="280" x2="460" y2="280" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" />
      <line x1="390" y1="305" x2="460" y2="305" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" />
      <line x1="390" y1="330" x2="460" y2="330" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" />
      <line x1="410" y1="260" x2="410" y2="350" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" />
      <line x1="435" y1="260" x2="435" y2="350" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" />

      {/* New Town Grid */}
      <line x1="490" y1="290" x2="560" y2="290" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" />
      <line x1="490" y1="315" x2="560" y2="315" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" />
      <line x1="490" y1="340" x2="560" y2="340" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" />
      <line x1="490" y1="365" x2="560" y2="365" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" />
      <line x1="510" y1="275" x2="510" y2="380" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" />
      <line x1="535" y1="275" x2="535" y2="380" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="2" />

      {/* Railway Line */}
      <path
        d="M 390,-20 L 400,240 Q 405,300 400,360 L 370,670"
        fill="none"
        stroke="rgba(245, 158, 11, 0.4)"
        strokeWidth="2"
        strokeDasharray="4 4"
      />

      {/* District / Area Typography Labels (Requirement 1) */}
      {/* 1. Old Town */}
      <g opacity="0.85">
        <text x="390" y="270" fill="#E8DEF5" fontSize="13" fontWeight="800" letterSpacing="2">
          OLD TOWN
        </text>
        <text x="390" y="284" fill="#A78BFA" fontSize="8" fontWeight="600" letterSpacing="1">
          (PEKAN LAMA)
        </text>
      </g>

      {/* 2. New Town */}
      <g opacity="0.85">
        <text x="500" y="275" fill="#E8DEF5" fontSize="13" fontWeight="800" letterSpacing="2">
          NEW TOWN
        </text>
        <text x="500" y="289" fill="#A78BFA" fontSize="8" fontWeight="600" letterSpacing="1">
          (PEKAN BARU)
        </text>
      </g>

      {/* 3. Taman Canning */}
      <g opacity="0.85">
        <text x="660" y="260" fill="#E8DEF5" fontSize="12" fontWeight="700" letterSpacing="1.5">
          TAMAN CANNING
        </text>
      </g>

      {/* 4. Ipoh Garden */}
      <g opacity="0.85">
        <text x="730" y="220" fill="#E8DEF5" fontSize="13" fontWeight="800" letterSpacing="2">
          IPOH GARDEN
        </text>
        <text x="730" y="234" fill="#A78BFA" fontSize="8" fontWeight="600" letterSpacing="1">
          (MEDAN IPOH)
        </text>
      </g>

      {/* 5. Bercham */}
      <g opacity="0.85">
        <text x="810" y="140" fill="#E8DEF5" fontSize="13" fontWeight="800" letterSpacing="2">
          BERCHAM
        </text>
      </g>

      {/* 6. Menglembu */}
      <g opacity="0.85">
        <text x="140" y="440" fill="#E8DEF5" fontSize="13" fontWeight="800" letterSpacing="2">
          MENGLEMBU
        </text>
      </g>

      {/* 7. Meru Raya */}
      <g opacity="0.85">
        <text x="440" y="75" fill="#E8DEF5" fontSize="13" fontWeight="800" letterSpacing="2">
          BANDAR MERU RAYA
        </text>
        <text x="440" y="90" fill="#A78BFA" fontSize="8" fontWeight="600" letterSpacing="1">
          CAMPUS & TERMINAL HUB
        </text>
      </g>

      {/* Greentown */}
      <g opacity="0.75">
        <text x="560" y="240" fill="#C4B5D4" fontSize="11" fontWeight="700" letterSpacing="1">
          GREENTOWN
        </text>
      </g>

      {/* Pasir Pinji */}
      <g opacity="0.75">
        <text x="520" y="450" fill="#C4B5D4" fontSize="11" fontWeight="700" letterSpacing="1">
          PASIR PINJI
        </text>
      </g>

      {/* River Label */}
      <text
        x="495"
        y="420"
        fill="#38BDF8"
        fontSize="9"
        fontWeight="600"
        letterSpacing="2"
        opacity="0.5"
        transform="rotate(78 495 420)"
      >
        SUNGAI KINTA
      </text>

      {/* Decorative Compass Rose */}
      <g transform="translate(930, 60)" opacity="0.45">
        <circle cx="0" cy="0" r="22" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <polygon points="0,-20 5,-5 20,0 5,5 0,20 -5,5 -20,0 -5,-5" fill="rgba(168, 85, 247, 0.6)" />
        <polygon points="0,-20 5,-5 0,0 -5,-5" fill="#FFFFFF" />
        <text x="-4" y="-24" fill="#FFFFFF" fontSize="9" fontWeight="800">N</text>
      </g>
    </svg>
  );
}

export default function MapView({
  cafes = [],
  selectedCafeId = null,
  onSelectCafe,
  onOpenDetailsModal
}) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activePopupCafeId, setActivePopupCafeId] = useState(selectedCafeId);

  // Sync active popup with selectedCafeId prop
  React.useEffect(() => {
    setActivePopupCafeId(selectedCafeId);
  }, [selectedCafeId]);

  // Derived image path (respecting Vite BASE_URL for GitHub Pages or root)
  const basePath = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  const externalImageSrc = `${basePath}/ipoh-map.png`.replace(/\/{2,}/g, '/');

  // Find currently selected cafe object for the interactive popup
  const activeCafe = cafes.find((c) => c.id === activePopupCafeId);

  // Handle marker click (Requirement 4)
  const handleMarkerClick = (cafe, e) => {
    e.stopPropagation();
    setActivePopupCafeId(cafe.id);
    if (onSelectCafe) {
      onSelectCafe(cafe.id);
    }
  };

  // Center / Reset Selection button (Requirement 5)
  const handleResetSelection = () => {
    setActivePopupCafeId(null);
    if (onSelectCafe) {
      onSelectCafe(null);
    }
  };

  return (
    <div
      className="map-view-container"
      onClick={() => setActivePopupCafeId(null)}
      role="region"
      aria-label="Demo Map of Ipoh Cafes"
    >
      {/* Map Background Layer: Uses user image if available, falls back to stylized SVG */}
      <div className="map-view-canvas-wrapper">
        {!imageError ? (
          <img
            src={externalImageSrc}
            alt="Stylized street map of Ipoh, Perak with student cafe markers"
            className="map-view-static-img"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : null}

        {/* Fallback stylized SVG when imageError is true or before external image is available */}
        {(imageError || !imageLoaded) && <StylizedIpohSvgMap />}
      </div>

      {/* Subtle Map Overlay Corner Labels (Requirement 5) */}
      <div className="map-overlay-controls">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleResetSelection();
          }}
          className="map-control-pill-btn"
          title="Reset marker selection and view all"
          aria-label="Reset selection"
        >
          <Compass size={13} />
          <span>Center Ipoh</span>
        </button>

        <span className="demo-map-badge" title="Interactive demo presentation mode">
          Demo map
        </span>
      </div>

      {/* Markers Layer (Requirement 3, 4, 6) */}
      <div className="map-markers-layer">
        {cafes.map((cafe) => {
          const isSelected = cafe.id === activePopupCafeId;
          const leftPercent = cafe.xPercent != null ? cafe.xPercent : 50;
          const topPercent = cafe.yPercent != null ? cafe.yPercent : 50;

          return (
            <div
              key={cafe.id}
              className={`demo-marker-container ${isSelected ? 'marker-selected' : ''}`}
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                '--accent-color': cafe.accentColor || '#A855F7'
              }}
            >
              {/* Pulsing halo when selected (Requirement 5) */}
              {isSelected && <div className="demo-marker-halo"></div>}

              {/* Price Pill Marker Button (Requirement 3 & 6) */}
              <button
                type="button"
                className="demo-marker-pill"
                onClick={(e) => handleMarkerClick(cafe, e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleMarkerClick(cafe, e);
                  }
                }}
                aria-label={`${cafe.name}, RM ${cafe.minBudget} to ${cafe.maxBudget}`}
                aria-expanded={isSelected}
                tabIndex={0}
              >
                <span className="marker-pin-dot"></span>
                <span className="marker-price-text">
                  RM {cafe.minBudget} - {cafe.maxBudget}
                </span>
              </button>

              <div className="marker-down-arrow"></div>
            </div>
          );
        })}
      </div>

      {/* Interactive Popup Card (Requirement 4) */}
      {activeCafe && (
        <div
          className="demo-map-popup-card"
          style={{
            // Position popup intelligently near marker coordinates
            left: `${Math.min(76, Math.max(24, activeCafe.xPercent || 50))}%`,
            top: `${Math.min(72, Math.max(26, (activeCafe.yPercent || 50) - 10))}%`
          }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label={`Details for ${activeCafe.name}`}
        >
          <div className="popup-top">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <span className="popup-area-pill">{activeCafe.area}</span>
                <span className="popup-cat-pill">{activeCafe.category}</span>
              </div>
              <h4 className="popup-name">{activeCafe.name}</h4>
            </div>

            <button
              type="button"
              className="popup-close-btn"
              onClick={() => setActivePopupCafeId(null)}
              aria-label="Close popup"
            >
              <X size={14} />
            </button>
          </div>

          <p className="popup-desc">{activeCafe.shortDescription}</p>

          <div className="popup-footer">
            <div className="popup-budget-stat">
              <span className="stat-label">Budget:</span>
              <strong>RM {activeCafe.minBudget} - {activeCafe.maxBudget}</strong>
            </div>

            <div className="popup-rating-stat">
              <Star size={13} fill="#FBBF24" color="#FBBF24" />
              <span>{activeCafe.rating.toFixed(1)}</span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm popup-view-btn"
            onClick={() => {
              if (onOpenDetailsModal) {
                onOpenDetailsModal(activeCafe);
              }
            }}
          >
            <span>View Details & Expenses</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
