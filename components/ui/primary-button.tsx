import React from 'react'
import { cn } from '@/lib/utils'

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  isLoading?: boolean
}

export function PrimaryButton({ 
  children, 
  className, 
  disabled, 
  isLoading,
  ...props 
}: PrimaryButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'w-full py-3 px-4 rounded-full font-medium text-white transition-all',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'hover:opacity-90',
        className
      )}
      style={{
        background: '#3075FF',
        boxShadow: '0px 0px 9px 0px #C0D5FF inset',
        border: '1px solid #0000000D'
      }}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>{children}</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}
