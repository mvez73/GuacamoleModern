'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Maximize2,
  Minimize2,
  X,
  RefreshCw,
  Monitor,
  Copy,
  Keyboard,
  MousePointer2,
} from 'lucide-react'

interface SessionViewerProps {
  connectionId: string
  connectionName: string
  onClose?: () => void
  onFullscreen?: () => void
}

export function SessionViewer({
  connectionId,
  connectionName,
  onClose,
  onFullscreen,
}: SessionViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showOnScreenKeyboard, setShowOnScreenKeyboard] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      onFullscreen?.()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full bg-background"
    >
      {/* Session Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Monitor className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold text-sm">{connectionName}</h3>
            <p className="text-xs text-muted-foreground">Connected</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Send Ctrl+Alt+Del"
          >
            <Keyboard className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Clipboard"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Fullscreen"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            title="Disconnect"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Remote Desktop Display */}
      <div className="flex-1 relative overflow-hidden bg-black">
        <div
          id={`guacamole-display-${connectionId}`}
          className="rdp-container w-full h-full"
        >
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Monitor className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="mb-2">Connecting to remote session...</p>
              <p className="text-sm">Connection ID: {connectionId}</p>
              <p className="text-xs mt-4 text-muted-foreground/70">
                Guacamole client will initialize here
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Session Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-card/50 backdrop-blur-sm text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Resolution: Auto</span>
          <span>Quality: High</span>
          <span>Compression: Enabled</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowOnScreenKeyboard(!showOnScreenKeyboard)}
          >
            <Keyboard className="h-4 w-4 mr-2" />
            Keyboard
          </Button>
          <Button variant="ghost" size="sm">
            <MousePointer2 className="h-4 w-4 mr-2" />
            Mouse Mode
          </Button>
        </div>
      </div>

      {/* On-Screen Keyboard (placeholder) */}
      {showOnScreenKeyboard && (
        <Card className="absolute bottom-16 left-1/2 -translate-x-1/2 p-4 bg-background border border-border shadow-lg">
          <div className="text-center text-sm text-muted-foreground">
            On-screen keyboard will appear here
          </div>
        </Card>
      )}
    </div>
  )
}
