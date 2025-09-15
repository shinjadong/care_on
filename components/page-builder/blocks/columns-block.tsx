"use client"

import { useState, useEffect, useCallback } from 'react';
import { Block } from '@/types/page-builder';
import { Grid, Settings, X, Plus, Trash2 } from 'lucide-react';
import { InlineTextEditor } from '../inline-text-editor';

interface ColumnsBlockRendererProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (block: Block) => void;
}

interface ColumnItem {
  id: string;
  content: string;
  width?: number; // 커스텀 너비 (%)
}

export function ColumnsBlockRenderer({ block, isEditing, onUpdate }: ColumnsBlockRendererProps) {
  const [isEditingColumns, setIsEditingColumns] = useState(false);
  const [columns, setColumns] = useState<ColumnItem[]>(
    block.content.columns || [
      { id: 'col-1', content: '첫 번째 컬럼 내용' },
      { id: 'col-2', content: '두 번째 컬럼 내용' }
    ]
  );
  const [columnCount, setColumnCount] = useState(block.content.columnCount || 2);
  const [gap, setGap] = useState(block.content.gap || 16);
  const [alignment, setAlignment] = useState(block.content.alignment || 'stretch');

  // 블록 내용 동기화
  useEffect(() => {
    setColumns(block.content.columns || [
      { id: 'col-1', content: '첫 번째 컬럼 내용' },
      { id: 'col-2', content: '두 번째 컬럼 내용' }
    ]);
    setColumnCount(block.content.columnCount || 2);
    setGap(block.content.gap || 16);
    setAlignment(block.content.alignment || 'stretch');
  }, [block.content]);

  // 저장 함수
  const handleSave = useCallback(() => {
    onUpdate?.({
      ...block,
      content: {
        ...block.content,
        columns,
        columnCount,
        gap,
        alignment
      }
    });
    setIsEditingColumns(false);
  }, [block, columns, columnCount, gap, alignment, onUpdate]);

  // 컬럼 추가
  const addColumn = useCallback(() => {
    if (columns.length < 4) {
      const newColumn: ColumnItem = {
        id: `col-${Date.now()}`,
        content: `${columns.length + 1}번째 컬럼 내용`
      };
      setColumns([...columns, newColumn]);
      setColumnCount(columns.length + 1);
    }
  }, [columns]);

  // 컬럼 삭제
  const removeColumn = useCallback((columnId: string) => {
    if (columns.length > 1) {
      const newColumns = columns.filter(col => col.id !== columnId);
      setColumns(newColumns);
      setColumnCount(newColumns.length);
    }
  }, [columns]);

  // 컬럼 내용 업데이트
  const updateColumnContent = useCallback((columnId: string, content: string) => {
    setColumns(prev => prev.map(col =>
      col.id === columnId ? { ...col, content } : col
    ));
  }, []);

  // 컬럼 너비 업데이트
  const updateColumnWidth = useCallback((columnId: string, width: number) => {
    setColumns(prev => prev.map(col =>
      col.id === columnId ? { ...col, width } : col
    ));
  }, []);

  if (isEditing && isEditingColumns) {
    return (
      <div className="border-2 border-green-300 rounded-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            컬럼 레이아웃 편집기
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              저장
            </button>
            <button
              onClick={() => setIsEditingColumns(false)}
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
              컬럼 수: {columnCount}개
            </label>
            <input
              type="range"
              min="1"
              max="4"
              value={columnCount}
              onChange={(e) => {
                const newCount = parseInt(e.target.value);
                setColumnCount(newCount);

                // 컬럼 수에 맞게 조정
                if (newCount > columns.length) {
                  const newColumns = [...columns];
                  for (let i = columns.length; i < newCount; i++) {
                    newColumns.push({
                      id: `col-${Date.now()}-${i}`,
                      content: `${i + 1}번째 컬럼 내용`
                    });
                  }
                  setColumns(newColumns);
                } else if (newCount < columns.length) {
                  setColumns(columns.slice(0, newCount));
                }
              }}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              간격: {gap}px
            </label>
            <input
              type="range"
              min="0"
              max="48"
              step="4"
              value={gap}
              onChange={(e) => setGap(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">정렬</label>
            <select
              value={alignment}
              onChange={(e) => setAlignment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="stretch">늘어뜨리기</option>
              <option value="start">상단 정렬</option>
              <option value="center">중앙 정렬</option>
              <option value="end">하단 정렬</option>
            </select>
          </div>
        </div>

        {/* 컬럼 편집 */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800">컬럼 내용 편집</h4>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}>
            {columns.slice(0, columnCount).map((column, index) => (
              <div key={column.id} className="border border-gray-200 rounded p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    컬럼 {index + 1}
                  </span>
                  {columns.length > 1 && (
                    <button
                      onClick={() => removeColumn(column.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <textarea
                  value={column.content}
                  onChange={(e) => updateColumnContent(column.id, e.target.value)}
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder={`${index + 1}번째 컬럼 내용을 입력하세요...`}
                />

                {/* 커스텀 너비 설정 */}
                <div className="mt-2">
                  <label className="block text-xs text-gray-600 mb-1">
                    너비: {column.width || Math.round(100 / columnCount)}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={column.width || Math.round(100 / columnCount)}
                    onChange={(e) => updateColumnWidth(column.id, parseInt(e.target.value))}
                    className="w-full h-1"
                  />
                </div>
              </div>
            ))}
          </div>

          {columns.length < 4 && (
            <button
              onClick={addColumn}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-400 hover:text-green-600 transition-colors"
            >
              <Plus className="w-5 h-5 mx-auto mb-1" />
              컬럼 추가
            </button>
          )}
        </div>
      </div>
    );
  }

  // 보기 모드
  return (
    <div className="columns-block relative group">
      {isEditing && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditingColumns(true)}
            className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            title="컬럼 편집"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 컬럼 렌더링 */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: columns.map(col =>
            col.width ? `${col.width}%` : `1fr`
          ).join(' '),
          gap: `${gap}px`,
          alignItems: alignment === 'stretch' ? 'stretch' :
                     alignment === 'start' ? 'flex-start' :
                     alignment === 'end' ? 'flex-end' : 'center'
        }}
      >
        {columns.slice(0, columnCount).map((column, index) => (
          <div
            key={column.id}
            className={`min-h-[100px] p-4 ${
              isEditing
                ? 'border border-dashed border-gray-300 hover:border-green-400 bg-gray-50'
                : ''
            }`}
          >
            {isEditing ? (
              <InlineTextEditor
                block={{
                  ...block,
                  id: column.id,
                  content: { text: column.content }
                }}
                onUpdate={(updatedBlock) => {
                  updateColumnContent(column.id, updatedBlock.content.text);
                  handleSave();
                }}
                placeholder={`${index + 1}번째 컬럼 내용...`}
                className="w-full h-full min-h-[60px]"
              />
            ) : (
              <div className="whitespace-pre-wrap text-gray-800">
                {column.content || `${index + 1}번째 컬럼`}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 빈 상태 */}
      {isEditing && columns.length === 0 && (
        <div
          className="text-center py-12 text-gray-500 border-2 border-dashed border-green-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
          onClick={() => setIsEditingColumns(true)}
        >
          <Grid className="w-16 h-16 mx-auto text-green-400 mb-4" />
          <p className="text-lg font-medium text-green-600">컬럼 레이아웃 추가</p>
          <p className="text-sm mt-1 text-green-500">클릭해서 2-4 컬럼 레이아웃을 만드세요</p>
        </div>
      )}
    </div>
  );
}