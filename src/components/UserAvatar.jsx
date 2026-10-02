import React from 'react';
import {
  GraduationCap,
  Laptop,
  Palette,
  Atom,
  PiggyBank,
  Target,
  BookOpen,
  Compass,
  User as UserIcon
} from 'lucide-react';
import { PRESET_AVATARS } from '../services/profileService';

const ICON_MAP = {
  GraduationCap,
  Laptop,
  Palette,
  Atom,
  PiggyBank,
  Target,
  BookOpen,
  Compass,
  UserIcon
};

/**
 * Universal User Avatar Component for KampusKash.
 * Seamlessly renders custom uploaded photos, modern student SVG presets, emojis, or letter initials.
 */
export default function UserAvatar({
  avatar,
  name = 'Student',
  size = 36,
  className = '',
  style = {},
  showBorder = true
}) {
  const iconSize = Math.max(14, Math.round(size * 0.52));
  const fontSize = Math.max(12, Math.round(size * 0.42));
  const initial = (name || 'S').trim().charAt(0).toUpperCase();

  const containerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
    position: 'relative',
    userSelect: 'none',
    boxShadow: showBorder ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none',
    border: showBorder ? '1.5px solid rgba(255, 255, 255, 0.15)' : 'none',
    ...style
  };

  // Case 1: Custom Uploaded Image (data URL or http URL)
  if (avatar && typeof avatar === 'string' && (avatar.startsWith('data:image') || avatar.startsWith('http://') || avatar.startsWith('https://'))) {
    return (
      <div style={containerStyle} className={className} aria-label={`${name}'s avatar`}>
        <img
          src={avatar}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            // Fallback to initial on image loading failure
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Case 2: Preset Avatar Identifier
  const matchedPreset = PRESET_AVATARS.find(p => p.id === avatar);
  if (matchedPreset) {
    const IconComponent = ICON_MAP[matchedPreset.iconName] || UserIcon;
    return (
      <div
        style={{
          ...containerStyle,
          background: matchedPreset.bg,
          color: matchedPreset.color
        }}
        className={className}
        title={matchedPreset.label}
        aria-label={`${matchedPreset.label} avatar`}
      >
        <IconComponent size={iconSize} />
      </div>
    );
  }

  // Case 3: Emoji string (1 or 2 emoji characters)
  if (avatar && typeof avatar === 'string' && avatar.length <= 4 && /\p{Extended_Pictographic}/u.test(avatar)) {
    return (
      <div
        style={{
          ...containerStyle,
          background: 'color-mix(in srgb, var(--primary) 30%, transparent)',
          fontSize: `${fontSize}px`
        }}
        className={className}
      >
        {avatar}
      </div>
    );
  }

  // Case 4: Default Initial Letter
  return (
    <div
      style={{
        ...containerStyle,
        background: 'linear-gradient(135deg, var(--primary), var(--primary-hover, #4A3657))',
        color: '#FFFFFF',
        fontWeight: 700,
        fontSize: `${fontSize}px`,
        fontFamily: 'Plus Jakarta Sans, var(--font-sans)'
      }}
      className={className}
      aria-label={`${name}'s avatar initial`}
    >
      {initial}
    </div>
  );
}
