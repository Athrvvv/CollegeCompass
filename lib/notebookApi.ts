import { GenerateReportRequest, DownloadPdfRequest } from "./notebook"

const API_BASE_URL = "https://notebook-synthesis-api.onrender.com"

export async function generateReport(request: GenerateReportRequest): Promise<string> {
  const response = await fetch(`/api/notebook/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail?.[0]?.msg || "Failed to generate report")
  }

  const data = await response.json()
  
  // Robust check: if data is an object, try to find a string property
  if (typeof data === 'object' && data !== null) {
    // Priority: html (seen in user log) > report > data > result
    const content = data.html || data.report || data.data || data.result
    if (content) return content
    return JSON.stringify(data)
  }
  
  return data
}

export async function downloadPdf(html: string): Promise<string> {
  // Ensure we are sending a clean string
  let htmlString = html
  if (typeof html === 'object') {
    htmlString = (html as any).html || JSON.stringify(html)
  }

  const response = await fetch(`/api/notebook/download`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ html: htmlString }),
  })

  if (!response.ok) {
    let errorMsg = "Failed to download PDF"
    try {
      const error = await response.json()
      errorMsg = error.detail?.[0]?.msg || error.message || errorMsg
    } catch (e) {
      errorMsg = response.statusText || errorMsg
    }
    throw new Error(errorMsg)
  }

  // Check if response is a file (Blob)
  const contentType = response.headers.get("Content-Type")
  if (contentType && contentType.includes("application/pdf")) {
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  }

  // Otherwise assume it's JSON with a URL or string
  try {
    const result = await response.json()
    return typeof result === 'object' ? result.pdf_download_url || result.url : result
  } catch (e) {
    // If it's not JSON but was successful, maybe it's the URL itself
    return await response.text()
  }
}
