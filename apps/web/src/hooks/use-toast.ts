import { useToast as useHookToast } from "@/components/ui/use-toast"

export function useToast() {
  return useHookToast()
}

// Simple toast function that doesn't use hooks
export function toast(props: { title?: string; description?: string; variant?: "default" | "destructive" }) {
  // This is a simplified implementation for build purposes
  console.log('Toast:', props)
  return { id: Date.now().toString(), dismiss: () => {}, update: () => {} }
}
