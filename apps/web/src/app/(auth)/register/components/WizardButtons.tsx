import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'

interface WizardButtonsProps {
  currentStep: number
  onBack: () => void
  onNext: () => void
  isLoading?: boolean
  canProceed?: boolean
  nextLabel?: string
}

export function WizardButtons({
  currentStep,
  onBack,
  onNext,
  isLoading = false,
  canProceed = true,
  nextLabel = 'Continue'
}: WizardButtonsProps) {
  const isFirstStep = currentStep === 1

  return (
    <div className="flex items-center justify-between gap-4 pt-8 border-t border-slate-200">
      {!isFirstStep ? (
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="h-12 px-6 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all"
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      ) : (
        <div />
      )}

      <Button
        type="button"
        onClick={onNext}
        disabled={!canProceed || isLoading}
        className="h-12 px-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 text-white font-bold shadow-lg hover:shadow-xl transition-all border-2 border-amber-500/20 hover:border-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {nextLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  )
}
