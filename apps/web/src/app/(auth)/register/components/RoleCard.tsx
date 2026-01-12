import { ReactNode } from 'react'

interface RoleCardProps {
  icon: ReactNode
  title: string
  description: string
  value: string
  selected: boolean
  onClick: () => void
}

export function RoleCard({ icon, title, description, selected, onClick }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full p-8 rounded-2xl border-3 transition-all duration-300 text-left group ${
        selected
          ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-xl scale-105'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg hover:scale-102'
      }`}
    >
      {/* Selection Indicator */}
      {selected && (
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Icon */}
      <div className={`mb-4 transition-transform ${selected ? 'scale-110' : 'group-hover:scale-105'}`}>
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
          selected 
            ? 'bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg' 
            : 'bg-slate-100 group-hover:bg-slate-200'
        }`}>
          {icon}
        </div>
      </div>

      {/* Content */}
      <h3 className={`text-2xl font-serif font-bold mb-2 transition-colors ${
        selected ? 'text-slate-900' : 'text-slate-800 group-hover:text-slate-900'
      }`}>
        {title}
      </h3>
      <p className={`text-sm leading-relaxed ${
        selected ? 'text-slate-700' : 'text-slate-600'
      }`}>
        {description}
      </p>
    </button>
  )
}
