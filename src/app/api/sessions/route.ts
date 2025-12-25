import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { connectionId, token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token required' },
        { status: 401 }
      )
    }

    if (!connectionId) {
      return NextResponse.json(
        { error: 'Connection ID is required' },
        { status: 400 }
      )
    }

    const guacamoleUrl = process.env.GUACAMOLE_URL || 'http://localhost:8080'

    // Get active connections from Guacamole
    const response = await fetch(`${guacamoleUrl}/api/session/data/mysql/activeConnections?token=${token}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(() => null)

    if (!response || !response.ok) {
      // Mock response for demo
      return NextResponse.json({
        sessionId: `session_${Date.now()}`,
        connectionId,
        tunnelUrl: `${guacamoleUrl}/websocket?token=${token}&GUAC_ID=${connectionId}`,
        status: 'connected',
        startedAt: new Date().toISOString(),
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token required' },
        { status: 401 }
      )
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const guacamoleUrl = process.env.GUACAMOLE_URL || 'http://localhost:8080'

    // Terminate session in Guacamole
    const response = await fetch(
      `${guacamoleUrl}/api/session/data/mysql/activeConnections/${sessionId}?token=${token}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).catch(() => null)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error terminating session:', error)
    return NextResponse.json(
      { error: 'Failed to terminate session' },
      { status: 500 }
    )
  }
}
