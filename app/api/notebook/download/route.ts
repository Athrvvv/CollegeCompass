import { NextResponse } from "next/server"

const MICROSERVICE_URL = "https://notebook-synthesis-api.onrender.com/download_pdf"

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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: [{ msg: response.statusText }] }))
      return NextResponse.json(errorData, { status: response.status })
    }

    // Forward important headers
    const contentType = response.headers.get("Content-Type") || "application/pdf"
    const contentDisposition = response.headers.get("Content-Disposition")
    
    // If it's a binary/file response or specific content types
    if (response.ok && (!contentType.includes("application/json"))) {
      const blob = await response.arrayBuffer()
      return new Response(blob, {
        headers: {
          "Content-Type": contentType,
          ...(contentDisposition && { "Content-Disposition": contentDisposition }),
        }
      })
    }

    const data = await response.json().catch(() => null)
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("Proxy error:", error)
    return NextResponse.json({ detail: [{ msg: error.message || "Internal server error" }] }, { status: 500 })
  }
}
