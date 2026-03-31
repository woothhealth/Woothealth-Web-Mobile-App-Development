/**
 * Custom Hooks for Chat Widget
 * Manages chat visibility state and Bitrix24 script loading
 */

"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import bitrix24Integration from "./services/bitrix24Integration"

/**
 * Hook to manage chat visibility state
 * Separates open/close logic from chat content management
 */
export function useChatVisibility() {
  const [isOpen, setIsOpen] = useState(false)

  const openChat = useCallback(() => {
    setIsOpen(true)
    bitrix24Integration.show()
  }, [])

  const closeChat = useCallback(() => {
    setIsOpen(false)
    bitrix24Integration.hide()
  }, [])

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev)
    if (isOpen) {
      bitrix24Integration.hide()
    } else {
      bitrix24Integration.show()
    }
  }, [isOpen])

  return {
    isOpen,
    openChat,
    closeChat,
    toggleChat,
  }
}

/**
 * Hook to manage Bitrix24 script loading
 * Handles initialization and ready state detection
 */
export function useBitrix24Script(options?: { onReady?: () => void; autoLoad?: boolean }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const initTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const loadBitrix24 = useCallback(async () => {
    const scriptUrl = process.env.NEXT_PUBLIC_BITRIX24_SCRIPT_URL

    if (!scriptUrl) {
      const errorMsg = "Bitrix24 script URL not configured"
      console.error("❌", errorMsg)
      setError(errorMsg)
      return
    }

    if (bitrix24Integration.isBitrixReady()) {
      console.log("✅ Bitrix24 already initialized")
      setIsReady(true)
      setIsLoading(false)
      options?.onReady?.()
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await bitrix24Integration.initialize({
        scriptUrl,
        onReady: () => {
          setIsReady(true)
          setIsLoading(false)
          console.log("🎉 Bitrix24 initialization complete")
          options?.onReady?.()
        },
        onError: (err) => {
          setError(err.message)
          setIsLoading(false)
          console.error("❌ Bitrix24 initialization failed:", err)
        },
      })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error"
      setError(errorMsg)
      setIsLoading(false)
      console.error("❌ Error loading Bitrix24:", errorMsg)
    }
  }, [options])

  useEffect(() => {
    // Auto-load on mount if enabled
    if (options?.autoLoad !== false) {
      // Small delay to ensure DOM is ready
      initTimeoutRef.current = setTimeout(() => {
        loadBitrix24()
      }, 100)
    }

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
      }
    }
  }, [loadBitrix24, options?.autoLoad])

  return {
    isLoading,
    isReady,
    error,
    loadBitrix24,
  }
}

/**
 * Hook to check if Bitrix24 is loaded and ready
 */
export function useBitrix24Ready() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (bitrix24Integration.isBitrixReady()) {
      setIsReady(true)
      return
    }

    const checkReady = () => {
      if (bitrix24Integration.isBitrixReady()) {
        setIsReady(true)
      }
    }

    const interval = setInterval(checkReady, 500)

    return () => clearInterval(interval)
  }, [])

  return isReady
}
