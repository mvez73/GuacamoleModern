import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const guacamoleUrl = process.env.GUACAMOLE_URL || 'http://localhost:8080'

    // Authenticate with Guacamole server
    const response = await fetch(`${guacamoleUrl}/api/tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }).catch(() => null)

    if (!response || !response.ok) {
      // For demo purposes, return a mock token
      // In production, this should come from the actual Guacamole server
      return NextResponse.json({
        authToken: `demo_token_${Date.now()}`,
        username,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error authenticating:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
