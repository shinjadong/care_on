import { Metadata } from "next"
import fs from "fs"
import path from "path"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "이용약관 | 케어온",
  description: "케어온 서비스 이용약관입니다.",
}

async function getTermsContent() {
  const filePath = path.join(process.cwd(), "content", "terms-of-service.md")
  const content = fs.readFileSync(filePath, "utf8")
  return content
}

export default async function TermsPage() {
  const content = await getTermsContent()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span className="text-sm">홈으로</span>
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">이용약관</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-10">
          <div className="prose prose-gray max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // 커스텀 렌더링 컴포넌트
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-medium text-gray-700 mt-6 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-gray-600 mb-4 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-600">
                    {children}
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900">
                    {children}
                  </strong>
                ),
                hr: () => (
                  <hr className="my-8 border-gray-200" />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <div className="bg-gray-100 border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>본 이용약관에 대한 문의사항이 있으신 경우</p>
            <p className="mt-1">
              <a href="tel:1866-1845" className="text-[#148777] hover:text-[#0f6b5c] font-medium">
                1866-1845
              </a>
              {" 또는 "}
              <a href="mailto:support@careon.ai.kr" className="text-[#148777] hover:text-[#0f6b5c] font-medium">
                support@careon.ai.kr
              </a>
              로 연락주시기 바랍니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}