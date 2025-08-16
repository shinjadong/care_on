"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Plus, Save, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Edit2, Bold, Italic, Underline, List } from "lucide-react"

interface FAQItem {
  id?: number
  question: string
  answer: string
  visible: boolean
  order_index: number
}

// 간단한 마크다운 스타일 적용 함수
function applyStyle(text: string, selectionStart: number, selectionEnd: number, style: string): string {
  const selectedText = text.substring(selectionStart, selectionEnd)
  let styledText = ""
  
  switch(style) {
    case 'bold':
      styledText = `**${selectedText}**`
      break
    case 'italic':
      styledText = `*${selectedText}*`
      break
    case 'underline':
      styledText = `__${selectedText}__`
      break
    case 'bullet':
      styledText = `• ${selectedText}`
      break
    default:
      styledText = selectedText
  }
  
  return text.substring(0, selectionStart) + styledText + text.substring(selectionEnd)
}

// 마크다운을 HTML로 변환 (간단한 버전)
function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/__(.*?)__/g, '<u>$1</u>')
    .replace(/^• /gm, '• ')
    .replace(/\n/g, '<br />')
}

export default function FAQAdminPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<FAQItem>({ question: "", answer: "", visible: true, order_index: 0 })
  const [isAdding, setIsAdding] = useState(false)
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    const { data, error } = await supabase
      .from('faq')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (!error && data) {
      setFaqs(data)
    }
    setLoading(false)
  }

  const handleStyleButton = (style: string) => {
    if (!textareaRef) return
    
    const start = textareaRef.selectionStart
    const end = textareaRef.selectionEnd
    const newText = applyStyle(editForm.answer, start, end, style)
    
    setEditForm({ ...editForm, answer: newText })
    
    // 커서 위치 복원
    setTimeout(() => {
      if (textareaRef) {
        textareaRef.focus()
        textareaRef.setSelectionRange(end + 2, end + 2)
      }
    }, 0)
  }

  const handleSave = async (faq: FAQItem) => {
    if (faq.id) {
      const { error } = await supabase
        .from('faq')
        .update({
          question: faq.question,
          answer: faq.answer,
          visible: faq.visible,
          order_index: faq.order_index
        })
        .eq('id', faq.id)
      
      if (!error) {
        setEditingId(null)
        fetchFAQs()
      } else {
        alert(`수정 실패: ${error.message}`)
      }
    } else {
      const { error } = await supabase
        .from('faq')
        .insert([{
          question: faq.question,
          answer: faq.answer,
          visible: faq.visible,
          order_index: faq.order_index
        }])
      
      if (!error) {
        setIsAdding(false)
        setEditForm({ question: "", answer: "", visible: true, order_index: 0 })
        fetchFAQs()
      } else {
        alert(`추가 실패: ${error.message}`)
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const { error } = await supabase
        .from('faq')
        .delete()
        .eq('id', id)
      
      if (!error) {
        fetchFAQs()
      }
    }
  }

  const handleToggleVisible = async (faq: FAQItem) => {
    const { error } = await supabase
      .from('faq')
      .update({ visible: !faq.visible })
      .eq('id', faq.id!)
    
    if (!error) {
      fetchFAQs()
    }
  }

  const handleMoveUp = async (index: number) => {
    if (index === 0) return
    
    const current = faqs[index]
    const previous = faqs[index - 1]
    
    await supabase
      .from('faq')
      .update({ order_index: previous.order_index })
      .eq('id', current.id!)
    
    await supabase
      .from('faq')
      .update({ order_index: current.order_index })
      .eq('id', previous.id!)
    
    fetchFAQs()
  }

  const handleMoveDown = async (index: number) => {
    if (index === faqs.length - 1) return
    
    const current = faqs[index]
    const next = faqs[index + 1]
    
    await supabase
      .from('faq')
      .update({ order_index: next.order_index })
      .eq('id', current.id!)
    
    await supabase
      .from('faq')
      .update({ order_index: current.order_index })
      .eq('id', next.id!)
    
    fetchFAQs()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">FAQ 관리</h1>
            <button
              onClick={() => {
                setIsAdding(true)
                setEditForm({ 
                  question: "", 
                  answer: "", 
                  visible: true, 
                  order_index: faqs.length > 0 ? Math.max(...faqs.map(f => f.order_index)) + 1 : 0 
                })
              }}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              새 질문 추가
            </button>
          </div>

          {/* 새 질문 추가 폼 */}
          {isAdding && (
            <div className="mb-6 p-4 border-2 border-teal-200 rounded-lg bg-teal-50">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">질문</label>
                  <input
                    type="text"
                    value={editForm.question}
                    onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="질문을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">답변</label>
                  
                  {/* 에디터 툴바 */}
                  <div className="flex gap-1 mb-2 p-2 bg-gray-100 rounded-t-lg">
                    <button
                      type="button"
                      onClick={() => handleStyleButton('bold')}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      title="굵게 (Bold)"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStyleButton('italic')}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      title="기울임 (Italic)"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStyleButton('underline')}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      title="밑줄 (Underline)"
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStyleButton('bullet')}
                      className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                      title="글머리 기호"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <textarea
                    ref={setTextareaRef}
                    value={editForm.answer}
                    onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[120px] font-mono text-sm"
                    placeholder="답변을 입력하세요&#10;**굵게**, *기울임*, __밑줄__ 사용 가능"
                  />
                  
                  {/* 미리보기 */}
                  {editForm.answer && (
                    <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">미리보기:</p>
                      <div 
                        className="text-gray-700"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(editForm.answer) }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editForm.visible}
                      onChange={(e) => setEditForm({ ...editForm, visible: e.target.checked })}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">공개</span>
                  </label>
                  <div className="flex gap-2 ml-auto">
                    <button
                      onClick={() => {
                        setIsAdding(false)
                        setEditForm({ question: "", answer: "", visible: true, order_index: 0 })
                      }}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => handleSave(editForm)}
                      className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                      <Save className="w-4 h-4" />
                      저장
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQ 목록 */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className={`p-4 border rounded-lg ${
                  faq.visible ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300'
                }`}
              >
                {editingId === faq.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">질문</label>
                      <input
                        type="text"
                        value={editForm.question}
                        onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">답변</label>
                      <textarea
                        value={editForm.answer}
                        onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 min-h-[100px] font-mono text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleSave(editForm)}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                      >
                        <Save className="w-4 h-4" />
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-gray-500">#{faq.order_index}</span>
                          {!faq.visible && (
                            <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">숨김</span>
                          )}
                        </div>
                        <h3 className="font-medium text-gray-800 mb-2">{faq.question}</h3>
                        <div 
                          className="text-sm text-gray-600"
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(faq.answer) }}
                        />
                      </div>
                      <div className="flex items-center gap-1 ml-4">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === faqs.length - 1}
                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleVisible(faq)}
                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                        >
                          {faq.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(faq.id!)
                            setEditForm(faq)
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id!)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {faqs.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              FAQ가 없습니다. 새 질문을 추가해주세요.
            </div>
          )}
        </div>

        {/* 안내 메시지 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">사용 안내</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 답변 작성 시 **굵게**, *기울임*, __밑줄__ 형식 사용 가능</li>
            <li>• 답변에서 줄바꿈을 사용하면 실제 화면에도 반영됩니다</li>
            <li>• 순서는 위아래 화살표로 조정할 수 있습니다</li>
            <li>• 눈 아이콘으로 공개/비공개를 전환할 수 있습니다</li>
            <li>• 비공개 항목은 사용자에게 보이지 않습니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}