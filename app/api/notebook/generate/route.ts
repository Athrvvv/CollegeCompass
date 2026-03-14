import { NextResponse } from "next/server"

const MICROSERVICE_URL = "https://notebook-synthesis-api.onrender.com/generate_report"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const response = await fetch(MICROSERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Proxy error:", error)
    return NextResponse.json({ detail: [{ msg: "Internal server error in proxy" }] }, { status: 500 })
  }
}
