import { ReactNode } from 'react'

interface SectionCardProps {
  title: string
  description?: string
  icon?: ReactNode
  children: ReactNode
}

export function SectionCard({ title, description, icon, children }: SectionCardProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-200">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-md">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-xl font-serif font-bold text-slate-900">{title}</h3>
          {description && <p className="text-sm text-slate-600 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}
