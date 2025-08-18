"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Save, Eye, EyeOff, ChevronLeft, LogOut } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function EditTermsPage() {
  const [content, setContent] = useState("")
  const [originalContent, setOriginalContent] = useState("")
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // 로그인 상태
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  
  const router = useRouter()

  // 인증 상태 확인 및 콘텐츠 로드
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // 현재 콘텐츠 로드 시도 (인증 필요)
      const response = await fetch('/api/admin/get-content?file=terms-of-service.md')
      if (response.ok) {
        const data = await response.text()
        setContent(data)
        setOriginalContent(data)
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  // 로그인 처리
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      
      if (response.ok) {
        setIsAuthenticated(true)
        checkAuth() // 로그인 후 콘텐츠 로드
      } else {
        const data = await response.json()
        setLoginError(data.error || '로그인에 실패했습니다.')
      }
    } catch (error) {
      setLoginError('로그인 처리 중 오류가 발생했습니다.')
    }
  }

  // 저장 처리
  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")
    
    try {
      const response = await fetch('/api/admin/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: 'terms-of-service.md',
          content: content
        })
      })
      
      if (response.ok) {
        setMessage("저장되었습니다!")
        setOriginalContent(content)
        setTimeout(() => setMessage(""), 3000)
      } else {
        const data = await response.json()
        setMessage(data.error || "저장 실패")
      }
    } catch (error) {
      setMessage("저장 중 오류가 발생했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  // 로그아웃
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    setIsAuthenticated(false)
    router.push('/terms')
  }

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    )
  }

  // 로그인 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              관리자 로그인
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  아이디
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#148777]"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#148777]"
                  required
                />
              </div>
              {loginError && (
                <div className="text-red-500 text-sm">{loginError}</div>
              )}
              <button
                type="submit"
                className="w-full bg-[#148777] text-white py-2 px-4 rounded-md hover:bg-[#0f6b5c] transition-colors"
              >
                로그인
              </button>
            </form>
            <div className="mt-4 text-center">
              <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm">
                돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 편집 화면
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/terms"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                <span className="text-sm">돌아가기</span>
              </Link>
              <h1 className="text-lg font-semibold text-gray-900">이용약관 편집</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {message && (
                <span className={`text-sm ${message.includes('실패') || message.includes('오류') ? 'text-red-500' : 'text-green-500'}`}>
                  {message}
                </span>
              )}
              
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                {isPreview ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" />
                    편집
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-1" />
                    미리보기
                  </>
                )}
              </button>
              
              <button
                onClick={handleSave}
                disabled={isSaving || content === originalContent}
                className={`flex items-center px-4 py-1.5 text-sm rounded-md transition-colors ${
                  content !== originalContent
                    ? 'bg-[#148777] text-white hover:bg-[#0f6b5c]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4 mr-1" />
                {isSaving ? '저장 중...' : '저장'}
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1" />
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {isPreview ? (
            // 미리보기 모드
            <div className="p-8">
              <div className="prose prose-gray max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
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
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            // 편집 모드
            <div className="p-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-[calc(100vh-200px)] px-4 py-3 font-mono text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#148777] resize-none"
                placeholder="마크다운 형식으로 작성하세요..."
              />
            </div>
          )}
        </div>
        
        {/* 도움말 */}
        {!isPreview && (
          <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">마크다운 문법 도움말</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p># 큰 제목 | ## 중간 제목 | ### 작은 제목</p>
              <p>**굵은 글씨** | *기울임*</p>
              <p>- 목록 항목 | 1. 번호 목록</p>
              <p>--- (구분선)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}