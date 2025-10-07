"use client"

import { useState, useEffect, useCallback } from 'react';
import { Block } from '@/types/page-builder';
import { FileText, Settings, X, Plus, Trash2, User, Phone, Mail, MessageSquare } from 'lucide-react';

interface FormBlockRendererProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (block: Block) => void;
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: string[]; // select용
}

export function FormBlockRenderer({ block, isEditing, onUpdate }: FormBlockRendererProps) {
  const [isEditingForm, setIsEditingForm] = useState(false);
  const [formData, setFormData] = useState({
    title: block.content.title || '연락처 폼',
    description: block.content.description || '아래 정보를 입력해주세요',
    submitText: block.content.submitText || '전송하기',
    successMessage: block.content.successMessage || '전송이 완료되었습니다!'
  });
  const [fields, setFields] = useState<FormField[]>(
    block.content.fields || [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'email', label: '이메일', type: 'email', placeholder: 'email@example.com', required: true },
      { id: 'phone', label: '전화번호', type: 'tel', placeholder: '010-0000-0000', required: false },
      { id: 'message', label: '메시지', type: 'textarea', placeholder: '문의 내용을 입력하세요', required: true }
    ]
  );

  // 블록 내용 동기화
  useEffect(() => {
    setFormData({
      title: block.content.title || '연락처 폼',
      description: block.content.description || '아래 정보를 입력해주세요',
      submitText: block.content.submitText || '전송하기',
      successMessage: block.content.successMessage || '전송이 완료되었습니다!'
    });
    setFields(block.content.fields || [
      { id: 'name', label: '이름', type: 'text', placeholder: '이름을 입력하세요', required: true },
      { id: 'email', label: '이메일', type: 'email', placeholder: 'email@example.com', required: true },
      { id: 'phone', label: '전화번호', type: 'tel', placeholder: '010-0000-0000', required: false },
      { id: 'message', label: '메시지', type: 'textarea', placeholder: '문의 내용을 입력하세요', required: true }
    ]);
  }, [block.content]);

  // 저장 함수
  const handleSave = useCallback(() => {
    onUpdate?.({
      ...block,
      content: {
        ...block.content,
        ...formData,
        fields
      }
    });
    setIsEditingForm(false);
  }, [block, formData, fields, onUpdate]);

  // 필드 추가
  const addField = useCallback((type: FormField['type']) => {
    const fieldTypeLabels = {
      text: '텍스트',
      email: '이메일',
      tel: '전화번호',
      textarea: '장문 텍스트',
      select: '선택 목록',
      checkbox: '체크박스'
    };

    const newField: FormField = {
      id: `field-${Date.now()}`,
      label: fieldTypeLabels[type],
      type,
      placeholder: `${fieldTypeLabels[type]}을 입력하세요`,
      required: false,
      options: type === 'select' ? ['옵션 1', '옵션 2'] : undefined
    };
    setFields([...fields, newField]);
  }, [fields]);

  // 필드 삭제
  const removeField = useCallback((fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId));
  }, []);

  // 필드 업데이트
  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    setFields(prev => prev.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  }, []);

  // 폼 데이터 업데이트
  const updateFormData = useCallback((field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  if (isEditing && isEditingForm) {
    return (
      <div className="border-2 border-blue-300 rounded-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            연락처 폼 편집기
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              저장
            </button>
            <button
              onClick={() => setIsEditingForm(false)}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 폼 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">폼 제목</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">제출 버튼 텍스트</label>
            <input
              type="text"
              value={formData.submitText}
              onChange={(e) => updateFormData('submitText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">성공 메시지</label>
            <input
              type="text"
              value={formData.successMessage}
              onChange={(e) => updateFormData('successMessage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* 필드 추가 버튼들 */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 mb-3">필드 추가</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { type: 'text' as const, icon: User, label: '텍스트' },
              { type: 'email' as const, icon: Mail, label: '이메일' },
              { type: 'tel' as const, icon: Phone, label: '전화번호' },
              { type: 'textarea' as const, icon: MessageSquare, label: '장문' }
            ].map((fieldType) => (
              <button
                key={fieldType.type}
                onClick={() => addField(fieldType.type)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                <fieldType.icon className="w-4 h-4" />
                <span className="text-sm">{fieldType.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 필드 목록 */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-800">필드 목록 ({fields.length}개)</h4>
          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 rounded p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">
                  필드 {index + 1}: {field.label}
                </span>
                <button
                  onClick={() => removeField(field.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="필드 라벨"
                  value={field.label}
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  placeholder="플레이스홀더"
                  value={field.placeholder || ''}
                  onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded"
                />
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={field.required || false}
                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                  />
                  <span className="text-sm text-gray-700">필수 항목</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 보기 모드
  return (
    <div className="form-block relative group max-w-2xl mx-auto">
      {isEditing && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditingForm(true)}
            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            title="폼 편집"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {formData.title}
          </h2>
          <p className="text-gray-600">
            {formData.description}
          </p>
        </div>

        <form className="space-y-6">
          {fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {field.type === 'textarea' ? (
                <textarea
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              ) : field.type === 'select' ? (
                <select
                  required={field.required}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">선택하세요</option>
                  {field.options?.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    required={field.required}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{field.placeholder}</span>
                </label>
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {formData.submitText}
          </button>
        </form>
      </div>
    </div>
  );
}
