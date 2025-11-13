// Simple toast implementation for build purposes
import { cn } from "@/lib/utils"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function useToast() {
  const toast = (props: ToastProps) => {
    console.log('Toast:', props)
    return { id: Date.now().toString(), dismiss: () => {}, update: () => {} }
  }

  return {
    toast,
    dismiss: () => {},
    toasts: [],
  }
}

export function toast(props: ToastProps) {
  console.log('Toast:', props)
  return { id: Date.now().toString(), dismiss: () => {}, update: () => {} }
}
