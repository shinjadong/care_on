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

    // Get card company name from filename
    const cardName = filename.replace("-동의서.md", "")

    // Return HTML response
    const htmlResponse = `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${cardName} 가맹점 신청 동의서</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #009DA2;
            border-bottom: 2px solid #009DA2;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          h2 {
            color: #333;
            margin-top: 30px;
            margin-bottom: 15px;
            border-left: 4px solid #009DA2;
            padding-left: 10px;
          }
          h3 {
            color: #555;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          p {
            margin: 10px 0;
            line-height: 1.8;
          }
          ul, ol {
            margin: 10px 0;
            padding-left: 30px;
          }
          li {
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f8f9fa;
            font-weight: bold;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
          }
          .close-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #009DA2;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            z-index: 1000;
          }
          .close-btn:hover {
            background: #008a8f;
          }
        </style>
      </head>
      <body>
        <button class="close-btn" onclick="window.close()">확인 완료</button>
        <div class="container">
          ${contentHtml}
          <div class="footer">
            <p>본 동의서를 충분히 읽고 이해하신 후 동의해 주시기 바랍니다.</p>
            <p style="margin-top: 20px;">
              <button onclick="window.close()" style="background: #009DA2; color: white; border: none; padding: 12px 30px; border-radius: 5px; cursor: pointer; font-size: 16px;">
                확인했습니다
              </button>
            </p>
          </div>
        </div>
      </body>
      </html>
    `

    return new NextResponse(htmlResponse, {
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
