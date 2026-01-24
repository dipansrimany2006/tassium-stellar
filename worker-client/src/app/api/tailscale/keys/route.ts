import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization")
  const tailnetId = request.headers.get("X-Tailnet-Id")

  if (!authHeader || !tailnetId) {
    return NextResponse.json(
      { error: "Missing Authorization or X-Tailnet-Id header" },
      { status: 400 }
    )
  }

  try {
    const body = await request.json()
    const res = await fetch(
      `https://api.tailscale.com/api/v2/tailnet/${tailnetId}/keys`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        { error: text || "Failed to create key" },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to create key" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization")
  const tailnetId = request.headers.get("X-Tailnet-Id")

  if (!authHeader || !tailnetId) {
    return NextResponse.json(
      { error: "Missing Authorization or X-Tailnet-Id header" },
      { status: 400 }
    )
  }

  try {
    const res = await fetch(
      `https://api.tailscale.com/api/v2/tailnet/${tailnetId}/keys`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    )

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        { error: text || "Failed to fetch keys" },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Failed to fetch keys" },
      { status: 500 }
    )
  }
}
