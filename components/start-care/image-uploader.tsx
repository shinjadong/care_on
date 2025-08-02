"use client"

import { useActionState } from "react"
import Image from "next/image"
import { uploadAction } from "@/app/upload-action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const initialState = {
  message: null,
  success: false,
}

export function ImageUploader() {
  const [state, formAction, isPending] = useActionState(uploadAction, initialState)

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Vercel Blob Uploader</CardTitle>
            <CardDescription>Upload an image directly to your Vercel Blob store using a Server Action.</CardDescription>
          </CardHeader>
          <form action={formAction}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">Choose Image</Label>
                <Input id="image" name="image" type="file" required />
              </div>
              {state?.success === false && <p className="text-sm text-red-500">{state.message}</p>}
              {state?.success === true && <p className="text-sm text-green-500">{state.message}</p>}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Uploading..." : "Upload"}
              </Button>
              {state?.success && state.data && (
                <div className="w-24 h-24 relative">
                  <Image
                    src={state.data.url || "/placeholder.svg"}
                    alt="Uploaded image"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </section>
  )
}
