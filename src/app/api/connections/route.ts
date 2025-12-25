import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get auth token from query params or headers
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token') || request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token required' },
        { status: 401 }
      )
    }

    // Validate token with Guacamole server
    // This would connect to your Guacamole instance to validate
    const guacamoleUrl = process.env.GUACAMOLE_URL || 'http://localhost:8080'

    // Mock response for now - replace with actual Guacamole API call
    const response = await fetch(`${guacamoleUrl}/api/session/data/mysql/connections?token=${token}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch(() => null)

    // For demo purposes, return mock data if Guacamole is not available
    if (!response || !response.ok) {
      return NextResponse.json({
        connections: [
          {
            id: '1',
            name: 'Production Server',
            protocol: 'rdp',
            parameters: {
              hostname: '192.168.1.100',
              port: '3389',
            },
          },
          {
            id: '2',
            name: 'Database Server',
            protocol: 'ssh',
            parameters: {
              hostname: '192.168.1.101',
              port: '22',
            },
          },
        ],
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching connections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch connections' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, protocol, parameters, token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token required' },
        { status: 401 }
      )
    }

    if (!name || !protocol || !parameters) {
      return NextResponse.json(
        { error: 'Missing required fields: name, protocol, parameters' },
        { status: 400 }
      )
    }

    const guacamoleUrl = process.env.GUACAMOLE_URL || 'http://localhost:8080'

    // Create connection in Guacamole
    const response = await fetch(`${guacamoleUrl}/api/session/data/mysql/connections?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        protocol,
        parameters,
      }),
    }).catch(() => null)

    if (!response || !response.ok) {
      // Mock response for demo
      return NextResponse.json({
        id: Date.now().toString(),
        name,
        protocol,
        parameters,
        identifier: `conn_${Date.now()}`,
      })
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating connection:', error)
    return NextResponse.json(
      { error: 'Failed to create connection' },
      { status: 500 }
    )
  }
}
