
import React from 'react';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: string; // Tailwind class like "size-12" or "w-12 h-12"
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'size-12', className = '', onClick }) => {
  // Generate fallback URL using UI Avatars
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff&size=128`;
  
  // Use src if valid, otherwise fallback
  const imageUrl = src && src.length > 10 ? src : fallbackUrl;

  return (
    <img
      src={imageUrl}
      alt={name}
      className={`${size} rounded-full object-cover border-2 border-primary/20 ${className}`}
      onClick={onClick}
      onError={(e) => {
        // If image fails to load, replace with fallback
        const target = e.target as HTMLImageElement;
        if (target.src !== fallbackUrl) {
          target.src = fallbackUrl;
        }
      }}
    />
  );
};
