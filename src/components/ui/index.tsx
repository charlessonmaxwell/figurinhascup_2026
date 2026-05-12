/* ========== REUSABLE UI COMPONENTS ========== */

import React, { ReactNode, InputHTMLAttributes, ButtonHTMLAttributes } from 'react';

// ==================== BUTTON ====================
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, loading, icon, children, disabled, ...props }, ref) => {
    const baseStyles = 'font-semibold transition cursor-pointer rounded-lg disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      primary: 'bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 hover:from-gold-600 hover:to-gold-700 hover:shadow-lg',
      secondary: 'bg-transparent border-2 border-gold-500 text-gold-500 hover:bg-gold-500 hover:bg-opacity-10',
      tertiary: 'bg-transparent text-gold-500 hover:text-gold-400',
      danger: 'bg-error text-white hover:bg-opacity-90'
    };

    const sizeStyles = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    };

    const buttonClasses = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${fullWidth ? 'w-full' : ''}
      flex items-center justify-center gap-2
    `;

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={buttonClasses}
        {...props}
      >
        {loading ? '⏳' : icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ==================== CARD ====================
interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'hero' | 'elevated';
  interactive?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, variant = 'default', interactive, onClick }) => {
  const variantStyles = {
    default: 'bg-navy-800 border border-navy-700',
    hero: 'bg-navy-800 border-2 border-gold-500',
    elevated: 'bg-gradient-to-br from-navy-800 to-navy-700 shadow-2xl'
  };

  return (
    <div
      className={`
        ${variantStyles[variant]}
        rounded-2xl p-6 transition
        ${interactive ? 'cursor-pointer hover:shadow-lg hover:border-gold-500' : ''}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// ==================== INPUT ====================
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  icon?: ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        {label && (
          <label className="text-sm font-semibold mb-2 text-primary">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2">{icon}</div>}
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-lg
              bg-navy-800 border border-navy-700
              text-primary placeholder-dim
              focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500 focus:ring-opacity-10
              transition
              ${error ? 'border-error' : ''}
              ${icon ? 'pl-10' : ''}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-error mt-1">{error}</p>}
        {helper && <p className="text-xs text-secondary mt-1">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ==================== SELECT ====================
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, ...props }) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="text-sm font-semibold mb-2 text-primary">
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-3 rounded-lg
          bg-navy-800 border border-navy-700
          text-primary
          focus:outline-none focus:border-gold-500
          transition
          ${error ? 'border-error' : ''}
          cursor-pointer
        `}
        {...props}
      >
        <option value="">Selecione...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
};

// ==================== CHECKBOX ====================
interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          className="
            w-5 h-5 rounded-md
            border-2 border-navy-700
            bg-navy-800
            cursor-pointer
            accent-gold-500
            focus:ring-2 focus:ring-gold-500
          "
          {...props}
        />
        {label && <span className="text-primary">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// ==================== BADGE ====================
interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'md' }) => {
  const variantStyles = {
    default: 'bg-gray-700 text-gray-100',
    success: 'bg-green-900 text-green-100',
    error: 'bg-red-900 text-red-100',
    warning: 'bg-yellow-900 text-yellow-100',
    info: 'bg-cyan-900 text-cyan-100'
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm'
  };

  return (
    <span className={`${variantStyles[variant]} ${sizeStyles[size]} rounded-full font-semibold inline-block`}>
      {children}
    </span>
  );
};

// ==================== AVATAR ====================
interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, initials, size = 'md', border }) => {
  const sizeStyles = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  return (
    <div
      className={`
        ${sizeStyles[size]}
        rounded-full flex items-center justify-center
        bg-gradient-to-br from-cyan-500 to-green-500
        text-white font-bold
        ${border ? 'border-2 border-gold-500' : ''}
      `}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full rounded-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
};

// ==================== MODAL ====================
interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  actions?: { label: string; variant?: 'primary' | 'secondary'; onClick: () => void }[];
}

export const Modal: React.FC<ModalProps> = ({ isOpen, title, children, onClose, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-modal flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        {/* Header */}
        {title && (
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-navy-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 text-navy-900">{children}</div>

        {/* Footer */}
        {actions && (
          <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
            {actions.map((action, idx) => (
              <Button
                key={idx}
                variant={action.variant || 'secondary'}
                size="sm"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== TOAST/NOTIFICATION ====================
interface ToastProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onClose?: () => void;
}

const toastStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200 border-l-4 border-l-green-500',
    text: 'text-green-900',
    icon: '✓'
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200 border-l-4 border-l-red-500',
    text: 'text-red-900',
    icon: '✕'
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200 border-l-4 border-l-yellow-500',
    text: 'text-yellow-900',
    icon: '⚠'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200 border-l-4 border-l-blue-500',
    text: 'text-blue-900',
    icon: 'ⓘ'
  }
};

export const Toast: React.FC<ToastProps> = ({ type = 'info', message, duration = 5000, onClose }) => {
  React.useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = toastStyles[type];

  return (
    <div
      className={`${styles.bg} ${styles.border} ${styles.text} p-4 rounded-lg shadow-lg max-w-sm animate-slide-up`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{styles.icon}</span>
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-auto text-current opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

// ==================== PROGRESS BAR ====================
interface ProgressProps {
  value: number;
  max?: number;
  showLabel?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({ value, max = 100, showLabel }) => {
  const percentage = (value / max) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full bg-navy-700 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-gold-500 to-gold-400 h-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-secondary">
          {percentage.toFixed(1)}% completo
        </p>
      )}
    </div>
  );
};

// ==================== LOADING SPINNER ====================
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeStyles[size]} animate-spin`}>
      <div
        className="w-full h-full border-4 border-navy-700 border-t-gold-500 rounded-full"
      />
    </div>
  );
};

// ==================== EMPTY STATE ====================
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="text-5xl mb-4">{icon}</div>}
      <h3 className="text-lg font-bold text-primary mb-2">{title}</h3>
      {description && <p className="text-secondary mb-6">{description}</p>}
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};
