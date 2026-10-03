import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IPOH_CENTER } from '../../services/exploreService';

// Fix standard Leaflet bundler image loading issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Category-based icon SVG paths for custom marker
function getCategoryIconSvg(category = '') {
  const cat = category.toLowerCase();
  if (cat.includes('coffee')) {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`;
  }
  if (cat.includes('study')) {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>`;
  }
  if (cat.includes('dessert')) {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 0-4 4v2h8V6a4 4 0 0 0-4-4Z"/><path d="M4 8h16l-2 13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L4 8Z"/></svg>`;
  }
  if (cat.includes('halal')) {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`;
  }
  // Local food / default
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4Z"/></svg>`;
}

export default function ExploreMap({
  cafes = [],
  selectedCafeId = null,
  onSelectCafe,
  onOpenDetailsModal
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const onSelectCafeRef = useRef(onSelectCafe);
  const onOpenDetailsModalRef = useRef(onOpenDetailsModal);

  useEffect(() => {
    onSelectCafeRef.current = onSelectCafe;
    onOpenDetailsModalRef.current = onOpenDetailsModal;
  }, [onSelectCafe, onOpenDetailsModal]);

  // Initialize Map Once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Ipoh center (4.5975, 101.0901), zoom 13
    const map = L.map(mapContainerRef.current, {
      center: [IPOH_CENTER.latitude, IPOH_CENTER.longitude],
      zoom: 13,
      zoomControl: false,
      attributionControl: true
    });

    // Sleek Dark CARTO Matter Tiles (Free, No API key needed, high reliability)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>'
    }).addTo(map);

    // Add Zoom Control to bottom-right for clean uncluttered layout
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    // Invalidate size once DOM layout is settled
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    // Resize observer to ensure responsive map resizing
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when `cafes` change or `selectedCafeId` changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    cafes.forEach((cafe) => {
      const isSelected = cafe.id === selectedCafeId;
      const iconSvg = getCategoryIconSvg(cafe.category);

      // Create Custom Styled HTML Pin
      const customDivIcon = L.divIcon({
        className: 'custom-cafe-marker-wrapper',
        html: `
          <div class="custom-cafe-marker ${isSelected ? 'marker-selected' : ''}" style="--accent-color: ${cafe.accentColor || '#A78BFA'}">
            <div class="marker-pulse"></div>
            <div class="marker-pin">
              <span class="marker-icon">${iconSvg}</span>
              <span class="marker-price">RM ${cafe.minBudget}</span>
            </div>
            <div class="marker-tip"></div>
          </div>
        `,
        iconSize: [44, 48],
        iconAnchor: [22, 46],
        popupAnchor: [0, -42]
      });

      const marker = L.marker([cafe.latitude, cafe.longitude], {
        icon: customDivIcon,
        title: cafe.name
      }).addTo(map);

      // Interactive Leaflet Popup
      const popupContent = document.createElement('div');
      popupContent.className = 'explore-map-popup-inner';
      popupContent.innerHTML = `
        <div class="popup-header">
          <div class="popup-title">${cafe.name}</div>
          <span class="popup-area-badge">${cafe.area}</span>
        </div>
        <div class="popup-desc">${cafe.shortDescription}</div>
        <div class="popup-meta">
          <div class="popup-budget">
            <span class="meta-label">Budget:</span>
            <strong>RM ${cafe.minBudget} - ${cafe.maxBudget}</strong>
          </div>
          <div class="popup-rating">
            ★ ${cafe.rating} <span class="rating-count">(${cafe.reviewCount})</span>
          </div>
        </div>
        <div class="popup-actions">
          <button type="button" class="btn btn-primary btn-sm popup-details-btn" data-cafe-id="${cafe.id}">
            View Details & Expenses →
          </button>
        </div>
      `;

      // Attach button event listener
      const detailsBtn = popupContent.querySelector('.popup-details-btn');
      if (detailsBtn) {
        detailsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (onOpenDetailsModalRef.current) {
            onOpenDetailsModalRef.current(cafe);
          }
        });
      }

      marker.bindPopup(popupContent, {
        className: 'explore-leaflet-popup',
        maxWidth: 290,
        minWidth: 240
      });

      marker.on('click', () => {
        if (onSelectCafeRef.current) {
          onSelectCafeRef.current(cafe.id);
        }
      });

      markersRef.current[cafe.id] = marker;
    });

    // If there is an active selected cafe, fly to it and open popup
    if (selectedCafeId && markersRef.current[selectedCafeId]) {
      const selectedMarker = markersRef.current[selectedCafeId];
      const selectedCafe = cafes.find((c) => c.id === selectedCafeId);
      if (selectedCafe) {
        map.flyTo([selectedCafe.latitude, selectedCafe.longitude], 15, {
          duration: 0.8,
          easeLinearity: 0.25
        });
        selectedMarker.openPopup();
      }
    }
  }, [cafes, selectedCafeId]);

  const handleResetCenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([IPOH_CENTER.latitude, IPOH_CENTER.longitude], 13, {
      duration: 0.8
    });
  };

  return (
    <div className="explore-map-container">
      <div ref={mapContainerRef} className="explore-map-element" tabIndex={0} aria-label="Interactive map of Ipoh student cafes" />

      {/* Map Overlay Controls */}
      <div className="map-overlay-controls">
        <button
          type="button"
          onClick={handleResetCenter}
          className="map-control-pill-btn"
          title="Reset map to central Ipoh"
        >
          <span>🎯 Center Ipoh</span>
        </button>
        <span className="map-tiles-badge">
          Dark Mode Map
        </span>
      </div>
    </div>
  );
}
