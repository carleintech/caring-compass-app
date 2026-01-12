interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <div className="flex items-center justify-between relative">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          
          return (
            <div key={stepNumber} className="flex-1 flex items-center">
              {/* Step Circle */}
              <div className="relative flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 shadow-lg z-10 ${
                    isCompleted
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white scale-100'
                      : isCurrent
                      ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white scale-110 ring-4 ring-amber-500/30'
                      : 'bg-slate-200 text-slate-400 scale-90'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                
                {/* Step Label */}
                <span
                  className={`absolute -bottom-8 text-xs font-medium whitespace-nowrap transition-colors ${
                    isCurrent ? 'text-slate-900 font-bold' : 'text-slate-500'
                  }`}
                >
                  {stepNumber === 1 && 'Choose Role'}
                  {stepNumber === 2 && 'Your Info'}
                  {stepNumber === 3 && 'Account'}
                  {stepNumber === 4 && 'Agreements'}
                  {stepNumber === 5 && 'Complete'}
                </span>
              </div>
              
              {/* Connecting Line */}
              {index < totalSteps - 1 && (
                <div className="flex-1 h-1 mx-2 relative -top-6">
                  <div className="w-full h-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-amber-500 to-yellow-600 transition-all duration-500 ${
                        isCompleted ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
