import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  className = '',
  icon: Icon = null,
  iconPosition = 'right',
  ...props 
}) => {
  // Base classes
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    transition-all duration-300 font-bold
    focus:outline-none disabled:cursor-not-allowed
  `;

  // Variants
  const variants = {
    primary: `
      relative overflow-hidden rounded-xl bg-blue-600 text-white
      shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50
      hover:scale-[1.02] active:scale-[0.98]
      disabled:bg-slate-700 disabled:shadow-none disabled:text-slate-500
      group
    `,
    secondary: `
      rounded-xl bg-slate-800/50 hover:bg-slate-800 text-white
      border border-white/5 hover:border-white/10
      transition-all duration-200 disabled:opacity-50
    `,
    ghost: `
      rounded-xl hover:bg-white/5 text-slate-300 hover:text-white
      transition-all duration-200 disabled:opacity-50
    `,
    tinted: `
      rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400
      border border-purple-500/20 transition-all duration-200
      disabled:opacity-50
    `,
    danger: `
      relative rounded-xl bg-red-500 text-white
      hover:bg-red-600 shadow-lg shadow-red-900/20
      transition-all duration-200 disabled:opacity-50
    `,
    dangerGhost: `
      rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500
      border border-red-500/20 transition-all duration-200
      disabled:opacity-50
    `,
    social: `
      rounded-xl border border-slate-700 text-white
      hover:bg-slate-800/50 transition-colors duration-200
      disabled:opacity-50
    `,
  };

  // Sizes
  const sizes = {
    xs: 'h-8 px-3 text-xs',
    sm: 'h-8 px-3 text-xs rounded-lg',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
    xl: 'h-14 px-8 text-lg shadow-glow',
    icon: 'h-10 w-10 rounded-xl',
    'icon-sm': 'h-8 w-8 rounded-lg',
    'icon-lg': 'h-12 w-12 rounded-full',
  };

  const combinedClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  const renderIcon = () => {
    if (loading) {
      return (
        <span className="animate-spin material-symbols-outlined text-[20px]">
          progress_activity
        </span>
      );
    }
    return Icon ? <Icon className="text-[20px]" /> : null;
  };

  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {/* Hover glow effect for primary */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
      )}

      <div className="relative z-10 flex items-center justify-center gap-2">
        {Icon && iconPosition === 'left' && renderIcon()}
        {children && <span>{children}</span>}
        {Icon && iconPosition === 'right' && renderIcon()}
      </div>
    </button>
  );
};

export default Button;