import React from 'react';

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
            ? 'rounded-xl overflow-hidden bg-white p-1 shadow-md border border-white/30'
            : ''
        } flex-shrink-0 flex items-center justify-center`}
      >
        <img
          src="/assets/taquara_em_foco_logo.svg"
          alt="Taquara em Foco - Logomarca Oficial"
          className="w-full h-full object-contain"
        />
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
