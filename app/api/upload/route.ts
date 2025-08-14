import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const contentLength = request.headers.get("content-length")
    if (contentLength && Number.parseInt(contentLength) > 100 * 1024 * 1024) {
      return NextResponse.json({ error: "파일 크기가 너무 큽니다 (최대 100MB)" }, { status: 413 })
    }

    const supabase = await createClient()
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "파일이 제공되지 않았습니다" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/quicktime",
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "지원하지 않는 파일 형식입니다" }, { status: 400 })
    }

    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "파일 크기가 너무 큽니다 (최대 100MB)" }, { status: 413 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split(".").pop()
    const fileName = `${timestamp}_${randomString}.${fileExtension}`

    // Convert File to ArrayBuffer for Supabase
    const fileBuffer = await file.arrayBuffer()

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from("care-on").upload(fileName, fileBuffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Supabase upload error:", error)
      return NextResponse.json(
        {
          error: `업로드 실패: ${error.message}`,
        },
        { status: 500 },
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("care-on").getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      fileName: fileName,
      fileType: file.type,
    })
  } catch (error) {
    console.error("Upload API error:", error)

    if (error instanceof Error) {
      if (error.message.includes("PayloadTooLargeError") || error.message.includes("Request Entity Too Large")) {
        return NextResponse.json({ error: "파일 크기가 너무 큽니다 (최대 100MB)" }, { status: 413 })
      }
    }

    return NextResponse.json(
      {
        error: `서버 오류: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get("fileName")

    if (!fileName) {
      return NextResponse.json({ error: "파일명이 제공되지 않았습니다" }, { status: 400 })
    }

    const { error } = await supabase.storage.from("care-on").remove([fileName])

    if (error) {
      console.error("Supabase delete error:", error)
      return NextResponse.json(
        {
          error: `삭제 실패: ${error.message}`,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete API error:", error)
    return NextResponse.json(
      {
        error: `서버 오류: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      },
      { status: 500 },
    )
  }
}
