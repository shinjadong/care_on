"use server"

import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import type { State } from "@/lib/types"

export async function uploadAction(prevState: State, formData: FormData): Promise<State> {
  const file = formData.get("image") as File

  if (!file || file.size === 0) {
    return {
      message: "Please select an image to upload.",
      success: false,
    }
  }

  try {
    const blob = await put(file.name, file, {
      access: "public",
    })

    // Revalidate the path to show the new image if you were displaying a list of them
    revalidatePath("/")

    return {
      message: `Successfully uploaded ${blob.pathname}!`,
      success: true,
      data: blob,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return {
      message: "Failed to upload image.",
      success: false,
    }
  }
}
