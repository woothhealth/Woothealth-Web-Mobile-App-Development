/**
 * Bitrix24 Integration Module
 * Handles script loading, initialization, and provides utilities for interacting with Bitrix24 widgets and applications
 * Supports both BX24.init() for applications and BX24.ready() for widgets
 */

type BitrixCallback = () => void
type BitrixReadyListener = (callback: BitrixCallback) => void

declare global {
  interface Window {
    BX24?: {
      init?: (callback: () => void) => void
      ready?: (callback: () => void) => void
      reload?: () => void
      show?: () => void
      hide?: () => void
    }
  }
}

interface BitrixInitConfig {
  scriptUrl: string
  onReady?: () => void
  onError?: (error: Error) => void
}

class Bitrix24Integration {
  private static instance: Bitrix24Integration
  private isLoading = false
  private isReady = false
  private readyCallbacks: BitrixCallback[] = []
  private scriptUrl: string = ""

  private constructor() {}

  static getInstance(): Bitrix24Integration {
    if (!Bitrix24Integration.instance) {
      Bitrix24Integration.instance = new Bitrix24Integration()
    }
    return Bitrix24Integration.instance
  }

  /**
   * Initialize Bitrix24 integration
   * Should be called early in the application's lifecycle, preferably within a DOMContentLoaded event listener
   */
  async initialize(config: BitrixInitConfig): Promise<void> {
    // Ensure DOM is ready before initializing
    if (typeof document !== "undefined" && document.readyState === "loading") {
      await new Promise<void>((resolve) => {
        document.addEventListener("DOMContentLoaded", () => resolve())
      })
    }

    if (this.isReady) {
      console.log("✅ Bitrix24 already initialized")
      config.onReady?.()
      return
    }

    if (this.isLoading) {
      console.log("⏳ Bitrix24 is loading...")
      if (this.isReady) {
        config.onReady?.()
      } else {
        this.addReadyCallback(config.onReady || (() => {}))
      }
      return
    }

    this.isLoading = true
    this.scriptUrl = config.scriptUrl

    try {
      await this.loadScript(config.scriptUrl)
      this.waitForBX24(config.onReady)
    } catch (error) {
      this.isLoading = false
      const err = error instanceof Error ? error : new Error(String(error))
      console.error("❌ Failed to initialize Bitrix24:", err)
      config.onError?.(err)
    }
  }

  /**
   * Load Bitrix24 script dynamically
   */
  private loadScript(scriptUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Window object not available"))
        return
      }

      // Check if script is already in DOM
      const existingScript = document.querySelector(
        `script[src*="cdn.bitrix24.com"]`
      )
      if (existingScript) {
        console.log("✅ Bitrix24 script already in DOM")
        resolve()
        return
      }

      const script = document.createElement("script")
      script.async = true
      script.src = scriptUrl + "?" + (Date.now() / 60000 | 0)

      script.onload = () => {
        console.log("✅ Bitrix24 script loaded successfully")
        resolve()
      }

      script.onerror = () => {
        reject(new Error("Failed to load Bitrix24 script"))
      }

      const firstScript = document.querySelector("script")
      if (firstScript?.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript)
      } else {
        document.head.appendChild(script)
      }
    })
  }

  /**
   * Wait for BX24 object to be available and initialize it
   */
  private waitForBX24(onReady?: () => void, maxAttempts = 50): void {
    const checkBX24 = (attempts = 0) => {
      if (typeof window !== "undefined" && window.BX24) {
        console.log("🎉 Bitrix24 object found!")

        // Check if BX24.init is available (for applications)
        if (window.BX24.init && typeof window.BX24.init === "function") {
          console.log("🔧 Initializing BX24 application...")
          window.BX24.init(() => {
            console.log("✅ BX24 application initialized successfully")
            this.isReady = true
            this.isLoading = false
            this.executeReadyCallbacks()
            onReady?.()
          })
        }
        // Check if BX24.ready is available (for widgets)
        else if (window.BX24.ready && typeof window.BX24.ready === "function") {
          console.log("🔧 Setting up BX24 widget ready callback...")
          window.BX24.ready(() => {
            console.log("✅ BX24 widget is ready!")
            this.isReady = true
            this.isLoading = false
            this.executeReadyCallbacks()
            onReady?.()
          })
        }
        // Fallback: assume it's ready immediately
        else {
          console.log("✅ BX24 object available, assuming ready")
          this.isReady = true
          this.isLoading = false
          this.executeReadyCallbacks()
          onReady?.()
        }
      } else if (attempts < maxAttempts) {
        setTimeout(() => checkBX24(attempts + 1), 100)
      } else {
        this.isLoading = false
        console.warn("⚠️ BX24 object not found after waiting")
      }
    }

    checkBX24()
  }

  /**
   * Add callback to be executed when Bitrix24 is ready
   */
  addReadyCallback(callback: BitrixCallback): void {
    if (this.isReady) {
      callback()
    } else {
      this.readyCallbacks.push(callback)
    }
  }

  /**
   * Execute all ready callbacks
   */
  private executeReadyCallbacks(): void {
    this.readyCallbacks.forEach((callback) => {
      try {
        callback()
      } catch (error) {
        console.error("Error executing Bitrix24 ready callback:", error)
      }
    })
    this.readyCallbacks = []
  }

  /**
   * Check if Bitrix24 is ready
   */
  isBitrixReady(): boolean {
    return (
      typeof window !== "undefined" && window.BX24 !== undefined
    )
  }

  /**
   * Get Bitrix24 object
   */
  getBitrix(): Window["BX24"] | undefined {
    return typeof window !== "undefined" ? window.BX24 : undefined
  }

  /**
   * Show Bitrix24 widget
   */
  show(): void {
    const bx24 = this.getBitrix()
    if (bx24?.show) {
      bx24.show()
    }
  }

  /**
   * Hide Bitrix24 widget
   */
  hide(): void {
    const bx24 = this.getBitrix()
    if (bx24?.hide) {
      bx24.hide()
    }
  }

  /**
   * Reload Bitrix24 widget
   */
  reload(): void {
    const bx24 = this.getBitrix()
    if (bx24?.reload) {
      bx24.reload()
    }
  }
}

export default Bitrix24Integration.getInstance()
