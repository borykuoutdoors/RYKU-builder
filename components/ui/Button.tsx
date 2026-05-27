import React from 'react'

interface ButtonProps {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  'data-action'?: string
}

/** Animated loading dots shown when loading=true */
function LoadingDots() {
  return (
    <span
      aria-hidden="true"
      style={{ display: 'inline-flex', gap: '3px', alignItems: 'center' }}
    >
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'currentColor',
            animation: `btnDot 0.9s ease-in-out ${i * 0.18}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes btnDot {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1);   }
        }
      `}</style>
    </span>
  )
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  onClick,
  type = 'button',
  className = '',
  'data-action': dataAction,
}: ButtonProps) {
  const variantClass = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    ghost:   'btn-ghost',
    danger:  'btn-danger',
  }[variant]

  const sizeClass = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  }[size]

  const classes = [
    'btn',
    variantClass,
    sizeClass,
    className,
  ].filter(Boolean).join(' ')

  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      className={classes}
      disabled={isDisabled}
      onClick={onClick}
      data-action={dataAction}
      aria-busy={loading ? 'true' : undefined}
      style={isDisabled ? { opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' } : undefined}
    >
      {loading ? (
        <>
          <LoadingDots />
          <span style={{ marginLeft: '4px', opacity: 0.7 }}>LOADING</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
