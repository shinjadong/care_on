import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { remark } from "remark"
import html from "remark-html"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params

    // Security: prevent directory traversal
    if (filename.includes("..") || filename.includes("/")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 })
    }

    const filePath = path.join(process.cwd(), "content", filename)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Read markdown file
    const fileContents = fs.readFileSync(filePath, "utf8")

    // Convert markdown to HTML
    const processedContent = await remark()
      .use(html)
      .process(fileContents)
    const contentHtml = processedContent.toString()

    // Return HTML content
    return new NextResponse(contentHtml, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("Error reading agreement file:", error)
    return NextResponse.json(
      { error: "Failed to load agreement" },
      { status: 500 }
    )
  }
}