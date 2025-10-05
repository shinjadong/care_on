import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const filename = request.headers.get("x-filename") || "file"
    const contentType = request.headers.get("content-type") || "application/octet-stream"

    // Check file size (max 100MB)
    const contentLength = request.headers.get("content-length")
    if (contentLength && Number.parseInt(contentLength) > 100 * 1024 * 1024) {
      return NextResponse.json({ error: "파일 크기가 너무 큽니다 (최대 100MB)" }, { status: 413 })
    }

    // Get the file data
    const blob = await request.blob()

    // Upload to Vercel Blob
    const uploadedBlob = await put(filename, blob, {
      access: "public",
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return NextResponse.json({
      url: uploadedBlob.url,
      downloadUrl: uploadedBlob.downloadUrl,
      pathname: uploadedBlob.pathname,
      size: uploadedBlob.size,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "업로드 실패" },
      { status: 500 }
    )
  }
}

// Handle multipart/form-data uploads
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "파일이 제공되지 않았습니다" }, { status: 400 })
    }

    // Validate file type (images and PDF for document upload)
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/heic",
      "image/heif",
      "application/pdf",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "지원하지 않는 파일 형식입니다 (이미지, PDF만 가능)" }, { status: 400 })
    }

    // Check file size (max 10MB for images)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "파일 크기가 너무 큽니다 (최대 10MB)" }, { status: 413 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split(".").pop()
    const fileName = `documents/${timestamp}_${randomString}.${fileExtension}`

    // Convert File to ArrayBuffer then to Blob
    const fileBuffer = await file.arrayBuffer()
    const blob = new Blob([fileBuffer], { type: file.type })

    // Upload to Vercel Blob
    const uploadedBlob = await put(fileName, blob, {
      access: "public",
      contentType: file.type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    return NextResponse.json({
      url: uploadedBlob.url,
      downloadUrl: uploadedBlob.downloadUrl,
      pathname: uploadedBlob.pathname,
      size: uploadedBlob.size,
      name: file.name,
      type: file.type,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "업로드 실패", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}