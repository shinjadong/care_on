"use client"

import { useState, useEffect, useCallback } from 'react';
import { Block } from '@/types/page-builder';
import { CreditCard, Settings, X, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { FileManager } from '../file-manager';
import { InlineTextEditor } from '../inline-text-editor';

interface CardBlockRendererProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (block: Block) => void;
}

interface CardItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  buttonText?: string;
}

export function CardBlockRenderer({ block, isEditing, onUpdate }: CardBlockRendererProps) {
  const [isEditingCards, setIsEditingCards] = useState(false);
  const [showFileManager, setShowFileManager] = useState(false);
  const [currentEditingCard, setCurrentEditingCard] = useState<string | null>(null);
  const [cards, setCards] = useState<CardItem[]>(
    block.content.cards || [
      {
        id: 'card-1',
        title: '카드 제목',
        description: '카드 설명을 입력하세요',
        buttonText: '자세히 보기'
      }
    ]
  );
  const [layout, setLayout] = useState(block.content.layout || 'grid');
  const [columns, setColumns] = useState(block.content.columns || 3);
  const [cardStyle, setCardStyle] = useState(block.content.cardStyle || 'default');

  // 블록 내용 동기화
  useEffect(() => {
    setCards(block.content.cards || [
      {
        id: 'card-1',
        title: '카드 제목',
        description: '카드 설명을 입력하세요',
        buttonText: '자세히 보기'
      }
    ]);
    setLayout(block.content.layout || 'grid');
    setColumns(block.content.columns || 3);
    setCardStyle(block.content.cardStyle || 'default');
  }, [block.content]);

  // 저장 함수
  const handleSave = useCallback(() => {
    onUpdate?.({
      ...block,
      content: {
        ...block.content,
        cards,
        layout,
        columns,
        cardStyle
      }
    });
    setIsEditingCards(false);
  }, [block, cards, layout, columns, cardStyle, onUpdate]);

  // 카드 추가
  const addCard = useCallback(() => {
    const newCard: CardItem = {
      id: `card-${Date.now()}`,
      title: '새 카드 제목',
      description: '카드 설명을 입력하세요',
      buttonText: '자세히 보기'
    };
    setCards([...cards, newCard]);
  }, [cards]);

  // 카드 삭제
  const removeCard = useCallback((cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId));
  }, []);

  // 카드 정보 업데이트
  const updateCard = useCallback((cardId: string, field: keyof CardItem, value: string) => {
    setCards(prev => prev.map(card =>
      card.id === cardId ? { ...card, [field]: value } : card
    ));
  }, []);

  // 이미지 선택 핸들러
  const handleImageSelect = useCallback((url: string) => {
    if (currentEditingCard) {
      updateCard(currentEditingCard, 'image', url);
      setCurrentEditingCard(null);
    }
    setShowFileManager(false);
  }, [currentEditingCard, updateCard]);

  if (isEditing && isEditingCards) {
    return (
      <div className="border-2 border-orange-300 rounded-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            카드 컴포넌트 편집기
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
            >
              저장
            </button>
            <button
              onClick={() => setIsEditingCards(false)}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 레이아웃 설정 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              컬럼 수: {columns}개
            </label>
            <input
              type="range"
              min="1"
              max="4"
              value={columns}
              onChange={(e) => setColumns(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">레이아웃</label>
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="grid">그리드</option>
              <option value="horizontal">가로 나열</option>
              <option value="vertical">세로 나열</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">카드 스타일</label>
            <select
              value={cardStyle}
              onChange={(e) => setCardStyle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="default">기본</option>
              <option value="minimal">미니멀</option>
              <option value="elevated">입체</option>
              <option value="bordered">테두리</option>
            </select>
          </div>
        </div>

        {/* 카드 편집 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-800">카드 목록 ({cards.length}개)</h4>
            <button
              onClick={addCard}
              className="px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1 inline" />
              카드 추가
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-4">
            {cards.map((card, index) => (
              <div key={card.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">
                    카드 {index + 1}
                  </span>
                  <button
                    onClick={() => removeCard(card.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="카드 제목"
                      value={card.title}
                      onChange={(e) => updateCard(card.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    <textarea
                      placeholder="카드 설명"
                      value={card.description}
                      onChange={(e) => updateCard(card.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded h-20"
                    />
                    <input
                      type="text"
                      placeholder="버튼 텍스트"
                      value={card.buttonText || ''}
                      onChange={(e) => updateCard(card.id, 'buttonText', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    <input
                      type="url"
                      placeholder="링크 URL"
                      value={card.link || ''}
                      onChange={(e) => updateCard(card.id, 'link', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    {card.image ? (
                      <div className="relative">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-32 object-cover rounded"
                        />
                        <button
                          onClick={() => updateCard(card.id, 'image', '')}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setCurrentEditingCard(card.id);
                          setShowFileManager(true);
                        }}
                        className="w-full h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-600 transition-colors"
                      >
                        <ImageIcon className="w-8 h-8 mb-2" />
                        <span className="text-sm">이미지 추가</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 파일 매니저 */}
        <FileManager
          isOpen={showFileManager}
          onClose={() => setShowFileManager(false)}
          onSelectFile={handleImageSelect}
          fileType="image"
          mode="select"
        />
      </div>
    );
  }

  // 보기 모드
  return (
    <div className="card-block relative group">
      {isEditing && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditingCards(true)}
            className="p-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
            title="카드 편집"
          >
            <CreditCard className="w-4 h-4" />
          </button>
        </div>
      )}

      {cards.length > 0 ? (
        <div
          className={`${
            layout === 'grid'
              ? `grid grid-cols-1 md:grid-cols-${Math.min(columns, 3)} gap-6`
              : layout === 'horizontal'
              ? 'flex flex-wrap gap-4'
              : 'space-y-6'
          }`}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className={`
                ${cardStyle === 'minimal' ? 'bg-transparent' :
                  cardStyle === 'elevated' ? 'bg-white shadow-lg hover:shadow-xl' :
                  cardStyle === 'bordered' ? 'bg-white border-2 border-gray-200' :
                  'bg-white shadow-md hover:shadow-lg'
                }
                rounded-lg overflow-hidden transition-all duration-300 hover:scale-105
              `}
            >
              {card.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {card.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {card.description}
                </p>

                {card.buttonText && (
                  <div>
                    {card.link ? (
                      <a
                        href={card.link}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {card.buttonText}
                      </a>
                    ) : (
                      <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        {card.buttonText}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        isEditing && (
          <div
            className="text-center py-12 text-gray-500 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all"
            onClick={() => setIsEditingCards(true)}
          >
            <CreditCard className="w-16 h-16 mx-auto text-orange-400 mb-4" />
            <p className="text-lg font-medium text-orange-600">카드 컴포넌트 추가</p>
            <p className="text-sm mt-1 text-orange-500">클릭해서 서비스/상품 카드를 만드세요</p>
          </div>
        )
      )}
    </div>
  );
}
