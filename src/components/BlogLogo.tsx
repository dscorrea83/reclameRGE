import React, { useState } from 'react';
import logoImg from '../assets/images/taquara_logo_1788260523081.jpg';

interface BlogLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  withBackground?: boolean;
}

export const BlogLogo: React.FC<BlogLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  withBackground = true,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className={`relative ${sizeClasses[size]} ${
          withBackground
            ? 'rounded-xl overflow-hidden bg-white p-0.5 shadow-md border border-white/40 ring-1 ring-black/5'
            : ''
        } flex-shrink-0 flex items-center justify-center`}
      >
        {!imgError ? (
          <img
            src={logoImg}
            alt="Taquara em Foco"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          /* High-fidelity Vector SVG Fallback */
          <svg
            viewBox="0 0 1000 1000"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Slate Blue Speech Bubble */}
            <path
              d="M 230 418 L 545 418 A 56 56 0 0 1 601 474 L 601 620 A 56 56 0 0 1 545 676 L 285 676 L 240 740 L 238 676 L 230 676 A 56 56 0 0 1 174 620 L 174 474 A 56 56 0 0 1 230 418 Z"
              fill="#6F889D"
            />
            {/* Light Grey Speech Bubble */}
            <path
              d="M 444 280 L 759 280 A 56 56 0 0 1 815 336 L 815 458 A 56 56 0 0 1 759 514 L 752 514 L 752 580 L 702 514 L 444 514 A 56 56 0 0 1 388 458 L 388 336 A 56 56 0 0 1 444 280 Z"
              fill="#D2D4D8"
            />
            {/* Cap Dome */}
            <path
              d="M 372 238 C 405 160 515 118 675 118 C 725 118 780 135 825 175 C 872 218 880 270 865 315 C 850 360 820 385 780 375 C 725 360 645 285 530 255 C 460 236 405 240 372 238 Z"
              fill="#688296"
            />
            <path
              d="M 675 118 C 730 118 785 135 825 175 C 872 218 880 270 865 315 C 850 360 820 385 780 375 C 735 362 670 305 600 275 C 670 210 705 155 675 118 Z"
              fill="#526D81"
            />
            {/* Visor */}
            <path
              d="M 334 286 C 385 245 520 220 740 318 C 670 338 520 345 385 308 C 350 298 338 290 334 286 Z"
              fill="#2F3E4B"
            />
            <path
              d="M 330 285 C 365 245 470 215 725 305 C 745 312 742 324 720 324 C 530 324 410 305 345 292 C 328 288 322 286 330 285 Z"
              fill="#688296"
            />
            <text
              x="500"
              y="815"
              textAnchor="middle"
              fontFamily="sans-serif"
              fontSize="82"
              fontWeight="900"
              fill="#FFFFFF"
              stroke="#222A32"
              strokeWidth="5"
              paintOrder="stroke fill"
            >
              TAQUARA EM FOCO
            </text>
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold tracking-tight text-white uppercase text-sm sm:text-base leading-none">
            Taquara em Foco
          </span>
          <span className="text-[11px] text-amber-300 font-medium">
            Cidadão-Pesquisador Atento
          </span>
        </div>
      )}
    </div>
  );
};
