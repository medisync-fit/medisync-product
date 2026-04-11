type Variant = 'filled' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: React.ReactNode
  onClick?: () => void
  href?: string
}

const variantStyles: Record<Variant, string> = {
  filled:
    'bg-brand text-navy-900 hover:bg-brand-dark font-semibold',
  ghost:
    'border border-brand/40 text-brand hover:bg-brand/10',
  outline:
    'border border-white/20 text-white hover:bg-white/10',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3 text-base',
}

export default function Button({
  variant = 'filled',
  size = 'md',
  className = '',
  children,
  onClick,
  href,
}: ButtonProps) {
  const classes = `rounded-full transition-all duration-200 active:scale-95 inline-flex items-center justify-center cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
