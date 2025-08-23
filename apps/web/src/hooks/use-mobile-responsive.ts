'use client'

import { useState, useEffect } from 'react'
import { useMediaQuery } from '@/hooks/use-media-query'

interface MobileResponsiveState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  orientation: 'portrait' | 'landscape'
  safeArea: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export function useMobileResponsive(): MobileResponsiveState {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  })

  // Standard breakpoints
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  // Screen size detection
  const isXs = useMediaQuery('(max-width: 639px)')
  const isSm = useMediaQuery('(max-width: 767px)')
  const isMd = useMediaQuery('(max-width: 1023px)')
  const isLg = useMediaQuery('(max-width: 1279px)')
  const isXl = useMediaQuery('(max-width: 1535px)')
  
  const getScreenSize = (): 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' => {
    if (isXs) return 'xs'
    if (isSm) return 'sm'
    if (isMd) return 'md'
    if (isLg) return 'lg'
    if (isXl) return 'xl'
    return '2xl'
  }
  const screenSize = getScreenSize()

  // Handle orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      const isLandscape = window.innerWidth > window.innerHeight
      setOrientation(isLandscape ? 'landscape' : 'portrait')
    }

    handleOrientationChange()
    window.addEventListener('resize', handleOrientationChange)
    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('resize', handleOrientationChange)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  // Handle safe area insets (for notched devices)
  useEffect(() => {
    const updateSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      setSafeArea({
        top: parseInt(computedStyle.getPropertyValue('--safe-area-top') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--safe-area-bottom') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--safe-area-left') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--safe-area-right') || '0')
      })
    }

    updateSafeArea()
    window.addEventListener('resize', updateSafeArea)

    return () => {
      window.removeEventListener('resize', updateSafeArea)
    }
  }, [])

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenSize,
    orientation,
    safeArea
  }
}

// Hook for mobile-specific gestures
export function useMobileGestures() {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = {
      x: touchStart.x - touchEnd.x,
      y: touchStart.y - touchEnd.y
    }

    const isHorizontalSwipe = Math.abs(distance.x) > Math.abs(distance.y)
    const isVerticalSwipe = Math.abs(distance.y) > Math.abs(distance.x)

    return {
      swipeLeft: isHorizontalSwipe && distance.x > 50,
      swipeRight: isHorizontalSwipe && distance.x < -50,
      swipeUp: isVerticalSwipe && distance.y > 50,
      swipeDown: isVerticalSwipe && distance.y < -50
    }
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    touchStart,
    touchEnd
  }
}

// Hook for mobile keyboard detection
export function useMobileKeyboard() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const handleFocusIn = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height
        const windowHeight = window.innerHeight
        const keyboardVisible = windowHeight - viewportHeight > 100
        
        setIsKeyboardOpen(keyboardVisible)
        setKeyboardHeight(keyboardVisible ? windowHeight - viewportHeight : 0)
      }
    }

    const handleFocusOut = () => {
      setIsKeyboardOpen(false)
      setKeyboardHeight(0)
    }

    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)
    window.visualViewport?.addEventListener('resize', handleFocusIn)

    return () => {
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('focusout', handleFocusOut)
      window.visualViewport?.removeEventListener('resize', handleFocusIn)
    }
  }, [])

  return {
    isKeyboardOpen,
    keyboardHeight
  }
}
