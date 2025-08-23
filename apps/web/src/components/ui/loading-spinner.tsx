import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const spinnerVariants = cva(
  'loading-spinner',
  {
    variants: {
      size: {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        default: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
      variant: {
        default: 'border-primary',
        muted: 'border-muted-foreground',
        white: 'border-white',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
)

interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string
}

export function LoadingSpinner({
  className,
  size,
  variant,
  label = 'Loading...',
  ...props
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn('inline-block', className)}
      {...props}
    >
      <div className={cn(spinnerVariants({ size, variant }))} />
      <span className="sr-only">{label}</span>
    </div>
  )
}

interface PageLoadingProps {
  message?: string
}

export function PageLoading({ message = 'Loading page...' }: PageLoadingProps) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="xl" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

interface ButtonLoadingProps {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
}

export function ButtonLoading({
  isLoading,
  children,
  loadingText,
}: ButtonLoadingProps) {
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <LoadingSpinner size="sm" variant="white" />
        <span>{loadingText || 'Loading...'}</span>
      </div>
    )
  }
  
  return <>{children}</>
}