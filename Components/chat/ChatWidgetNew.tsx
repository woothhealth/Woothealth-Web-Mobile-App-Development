"use client"

import { useEffect, useState } from "react"
import bitrix24Integration from "./services/bitrix24Integration"

export default function ChatWidget() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if Bitrix24 is already ready
    if (bitrix24Integration.isBitrixReady()) {
      console.log('✅ Bitrix24 widget already loaded')
      setIsLoaded(true)
      return
    }

    // Get script URL from environment variable
    const scriptUrl = process.env.NEXT_PUBLIC_BITRIX24_SCRIPT_URL

    if (!scriptUrl) {
      const errorMsg = 'Bitrix24 script URL not configured in .env.local'
      console.error('❌', errorMsg)
      setError(errorMsg)
      return
    }

    console.log('📍 Loading Bitrix24 widget script...')

    // Use the bitrix24Integration service for proper initialization
    bitrix24Integration.initialize({
      scriptUrl,
      onReady: () => {
        console.log('🎉 Bitrix24 widget initialized successfully')
        setIsLoaded(true)
        setError(null)
      },
      onError: (err) => {
        console.error('❌ Failed to initialize Bitrix24 widget:', err)
        setError(err.message)
        setIsLoaded(false)
      }
    }).catch((err) => {
      console.error('❌ Error initializing Bitrix24:', err)
      setError(err.message)
      setIsLoaded(false)
    })

  }, [])

  // Return null - Bitrix24 handles its own UI completely
  // Show error state if initialization failed
  if (error) {
    console.warn('Bitrix24 widget failed to load:', error)
  }

  return null
}

/**
 * Hook to check if Bitrix24 widget is loaded and ready
 */
export function useBitrix24Status() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Check immediately
    setIsReady(bitrix24Integration.isBitrixReady())

    // Check periodically using the integration service
    const interval = setInterval(() => {
      setIsReady(bitrix24Integration.isBitrixReady())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return isReady
}