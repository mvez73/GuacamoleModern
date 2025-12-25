'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export interface GuacamoleClientConfig {
  tunnelURL: string
  connectionId?: string
  token?: string
  onConnected?: () => void
  onDisconnected?: () => void
  onError?: (error: string) => void
}

export interface GuacamoleState {
  connected: boolean
  connecting: boolean
  error: string | null
}

declare global {
  interface Window {
    Guacamole?: {
      Client: any
      WebSocketTunnel: any
      HTTPTunnel: any
      Keyboard: any
      Mouse: any
      Touch: any
      OnScreenKeyboard: any
    }
  }
}

export function useGuacamoleClient(config: GuacamoleClientConfig) {
  const [state, setState] = useState<GuacamoleState>({
    connected: false,
    connecting: false,
    error: null,
  })

  const clientRef = useRef<any>(null)
  const displayRef = useRef<HTMLDivElement>(null)

  // Load Guacamole JavaScript client library
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Guacamole) {
      const script = document.createElement('script')
      script.src = '/guacamole-common-js/all.min.js'
      script.async = true
      script.onload = () => {
        console.log('Guacamole client library loaded')
      }
      script.onerror = () => {
        console.error('Failed to load Guacamole client library')
        toast.error('Failed to load Guacamole client library')
      }
      document.head.appendChild(script)
    }
  }, [])

  const connect = () => {
    if (!window.Guacamole) {
      toast.error('Guacamole client library not loaded')
      return
    }

    if (!displayRef.current) {
      toast.error('Display container not found')
      return
    }

    try {
      setState(prev => ({ ...prev, connecting: true, error: null }))

      // Create tunnel (WebSocket or HTTP)
      const tunnel = new window.Guacamole.WebSocketTunnel(config.tunnelURL)

      // Create client
      const client = new window.Guacamole.Client(tunnel)
      clientRef.current = client

      // Add display to DOM
      const display = client.getDisplay()
      displayRef.current.innerHTML = ''
      displayRef.current.appendChild(display.getElement())

      // Handle connection state
      client.onstatechange = (clientState: number) => {
        // 0: Idle, 1: Connecting, 2: Connected, 3: Disconnected
        switch (clientState) {
          case 0:
            console.log('Guacamole client: Idle')
            break
          case 1:
            console.log('Guacamole client: Connecting')
            setState(prev => ({ ...prev, connecting: true }))
            break
          case 2:
            console.log('Guacamole client: Connected')
            setState(prev => ({ ...prev, connected: true, connecting: false }))
            config.onConnected?.()
            toast.success('Connected to remote desktop')
            break
          case 3:
            console.log('Guacamole client: Disconnected')
            setState(prev => ({ ...prev, connected: false, connecting: false }))
            config.onDisconnected?.()
            toast.info('Disconnected from remote desktop')
            break
        }
      }

      // Handle errors
      client.onerror = (error: any) => {
        console.error('Guacamole client error:', error)
        const errorMessage = error.message || 'Connection error'
        setState(prev => ({ ...prev, error: errorMessage, connecting: false }))
        config.onError?.(errorMessage)
        toast.error(errorMessage)
      }

      // Handle clipboard events
      client.onclipboard = (stream: any, mimetype: string) => {
        console.log('Clipboard data received:', mimetype)
        reader = new Guacamole.StringReader(stream)
        reader.ontext = (text: string) => {
          console.log('Clipboard text:', text)
          // Handle clipboard data
        }
      }

      // Handle connection parameters
      const connectData = config.connectionId
        ? { connectionId: config.connectionId }
        : { token: config.token }

      // Connect
      client.connect(connectData)

      // Setup mouse and keyboard input
      if (typeof window !== 'undefined') {
        const mouse = new window.Guacamole.Mouse(display.getElement())
        const keyboard = new window.Guacamole.Keyboard(display.getElement())

        mouse.onmousedown = mouse.onmouseup = mouse.onmousemove = () => {
          client.sendMouseState(mouse.getState())
        }

        keyboard.onkeydown = (keysym: number) => {
          client.sendKeyEvent(1, keysym)
        }

        keyboard.onkeyup = (keysym: number) => {
          client.sendKeyEvent(0, keysym)
        }
      }
    } catch (error) {
      console.error('Error connecting to Guacamole:', error)
      const errorMessage = error instanceof Error ? error.message : 'Connection failed'
      setState(prev => ({ ...prev, error: errorMessage, connecting: false }))
      config.onError?.(errorMessage)
      toast.error(errorMessage)
    }
  }

  const disconnect = () => {
    if (clientRef.current) {
      clientRef.current.disconnect()
      clientRef.current = null
      setState(prev => ({ ...prev, connected: false, connecting: false }))
    }
  }

  const sendClipboardData = (data: string) => {
    if (clientRef.current && state.connected) {
      const stream = clientRef.current.createClipboardStream('text/plain')
      const writer = new window.Guacamole.StringWriter(stream)
      writer.sendText(data)
      writer.sendEnd()
    }
  }

  const sendKeyCombination = (keys: number[]) => {
    if (clientRef.current && state.connected) {
      keys.forEach((keysym, index) => {
        setTimeout(() => {
          clientRef.current.sendKeyEvent(1, keysym)
          setTimeout(() => {
            clientRef.current.sendKeyEvent(0, keysym)
          }, 50)
        }, index * 100)
      })
    }
  }

  return {
    state,
    displayRef,
    connect,
    disconnect,
    sendClipboardData,
    sendKeyCombination,
  }
}
