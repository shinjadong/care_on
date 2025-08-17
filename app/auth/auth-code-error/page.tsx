export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-sm rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h1 className="text-xl font-semibold text-gray-900 mb-4">
          로그인 오류
        </h1>
        
        <p className="text-gray-600 mb-8">
          구글 로그인 중 문제가 발생했습니다.<br />
          다시 시도해주세요.
        </p>
        
        <a
          href="/login"
          className="inline-block w-full bg-[#148777] hover:bg-[#0f6b5c] text-white py-3 px-6 rounded-lg transition-colors duration-200"
        >
          다시 로그인하기
        </a>
      </div>
    </div>
  )
}
