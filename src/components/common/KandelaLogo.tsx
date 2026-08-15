import React from 'react';
import iconSrc from '../../assets/logo/kandela-icon-transparent.png';
import fullSrc from '../../assets/logo/kandela-logo-transparent.png';

interface KandelaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** 'compact' (default): small icon mark + "KANDELA / CARS" text, for navbar/
   *  tight spaces — matches the reference layout. 'full': the complete
   *  illustrated lockup (icon + swoosh + wordmark) as one image, for places
   *  with more room (footer, login screen). */
  variant?: 'compact' | 'full';
}

// Real Kandela Cars logo, now with genuine transparency (extracted by keying
// out the flat black canvas the original export used — the artwork itself
// was always red/charcoal, which reads cleanly on a light background).
// Source files: src/assets/logo/kandela-icon-transparent.png (icon only) and
// kandela-logo-transparent.png (full illustrated lockup).
const iconHeightBySize: Record<NonNullable<KandelaLogoProps['size']>, string> = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
  xl: 'h-14'
};

const textSizeBySize: Record<NonNullable<KandelaLogoProps['size']>, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
};

const fullHeightBySize: Record<NonNullable<KandelaLogoProps['size']>, string> = {
  sm: 'h-10',
  md: 'h-14',
  lg: 'h-20',
  xl: 'h-28'
};

export const KandelaLogo: React.FC<KandelaLogoProps> = ({ className = '', size = 'md', variant = 'compact' }) => {
  if (variant === 'full') {
    return (
      <img
        src={fullSrc}
        alt="Kandela Cars"
        className={`${fullHeightBySize[size]} w-auto object-contain select-none ${className}`}
        id="brand-logo-full"
        draggable={false}
      />
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 select-none ${className}`} id="brand-logo">
      <img
        src={iconSrc}
        alt="Kandela Cars"
        className={`${iconHeightBySize[size]} w-auto object-contain`}
        draggable={false}
      />
      <span className="flex flex-col leading-none">
        <span className={`font-black tracking-tight text-kandela-ink ${textSizeBySize[size]}`}>
          KANDELA
        </span>
        <span className="text-[9px] font-bold tracking-[0.3em] text-kandela-red -mt-0.5">
          CARS
        </span>
      </span>
    </span>
  );
};
