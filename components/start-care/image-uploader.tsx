"use client"

import { useFormState, useFormStatus } from "react-dom"
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

// 버튼의 pending 상태를 관리하는 별도 컴포넌트
// 마치 엘리베이터의 층수 표시등처럼 현재 상태를 보여주는 역할
function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "업로드 중..." : "업로드"}
    </Button>
  )
}

export function ImageUploader() {
  // React 18의 방식: useFormState로 폼 상태 관리
  // 마치 우체국에서 소포 배송 상태를 추적하는 것과 비슷한 개념
  const [state, formAction] = useFormState(uploadAction, initialState)

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>이미지 업로드</CardTitle>
            <CardDescription>Server Action을 사용하여 Vercel Blob 저장소에 이미지를 직접 업로드하세요.</CardDescription>
          </CardHeader>
          <form action={formAction}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">이미지 선택</Label>
                <Input id="image" name="image" type="file" accept="image/*" required />
              </div>
              {state?.success === false && <p className="text-sm text-red-500">{state.message}</p>}
              {state?.success === true && <p className="text-sm text-green-500">{state.message}</p>}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <SubmitButton />
              {state?.success && state.data && (
                <div className="w-24 h-24 relative">
                  <Image
                    src={state.data.url || "/placeholder.svg"}
                    alt="업로드된 이미지"
                    fill
                    className="rounded-md object-cover"
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
