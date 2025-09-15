import { ReviewForm } from "@/components/review/review-form"

export default function WriteReviewPage() {
  return (
    <div className="min-h-screen relative py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="glass-card p-8 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold glass-text-primary mb-2">
              스토리 작성
            </h1>
            <p className="glass-text-secondary">당신의 경험을 공유해주세요</p>
          </div>
          <ReviewForm />
        </div>
      </div>
    </div>
  )
}
