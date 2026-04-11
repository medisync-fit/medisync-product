'use client'

import { usePreorder } from '@/context/PreorderContext'
import Button from '@/components/ui/Button'

interface PreorderButtonProps {
  mode?: 'b2c' | 'b2b'
  variant?: 'filled' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
}

export default function PreorderButton({
  mode = 'b2c',
  variant = 'filled',
  size = 'md',
  className,
  children = 'Preorder Now',
}: PreorderButtonProps) {
  const { openDrawer } = usePreorder()

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => openDrawer(mode)}
    >
      {children}
    </Button>
  )
}
