'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          서버 오류가 발생했습니다
        </h2>
        <p className="text-gray-600 mb-8">
          일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  )
}
