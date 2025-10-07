'use client';

import { useState, useEffect } from 'react';
import { useKeyboardShortcuts } from './keyboard-shortcuts';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block, BlockType } from '@/types/page-builder';
import { BlockRenderer } from './block-renderer';
import { Button } from '@/components/ui/button';
import { 
  Plus, Eye, Edit, Save, Download, Upload, FolderOpen, Images, 
  ChevronLeft, ChevronRight, Menu, X, Settings 
} from 'lucide-react';
import { FileManager } from './file-manager';
import { BulkImageUploader } from '@/components/ui/bulk-image-uploader';
import { TemplateGallery } from './template-gallery';

interface PageBuilderProps {
  initialBlocks?: Block[];
  onSave?: (blocks: Block[]) => void;
}

interface SortableBlockProps {
  block: Block;
  isEditing: boolean;
  onUpdate: (block: Block) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

function SortableBlock({ block, isEditing, onUpdate, onDelete, onMoveUp, onMoveDown, canMoveUp, canMoveDown, isSelected, onSelect }: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        className={`relative group ${isEditing ? 'border-2 border-dashed rounded-lg hover:border-blue-400 hover:bg-blue-25' : ''} ${
          isSelected ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-300'
        } transition-all duration-200`}
        onClick={() => onSelect?.(block.id)}
      >
        {isEditing && (
          <div className="absolute top-4 left-4 z-10 bg-blue-600 text-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-700">
            <div {...listeners} className="cursor-move flex items-center space-x-1" title="드래그하여 순서 변경">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
              </svg>
              <span className="text-xs font-medium">끌기</span>
            </div>
          </div>
        )}
        <BlockRenderer
          block={block}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
        />
      </div>
    </div>
  );
}

export function PageBuilder({ initialBlocks = [], onSave }: PageBuilderProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [isEditing, setIsEditing] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showFileManager, setShowFileManager] = useState(false);
  const [showBulkUploader, setShowBulkUploader] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarPosition, setSidebarPosition] = useState({ top: 100 });

  // 키보드 단축키 시스템
  const {
    canUndo,
    canRedo,
    hasCopiedBlock,
    undo,
    redo,
    copyBlock,
    pasteBlock,
    duplicateBlock,
    deleteBlock: deleteSelectedBlock,
    moveBlock,
    shortcuts
  } = useKeyboardShortcuts({
    blocks,
    setBlocks,
    selectedBlockId,
    setSelectedBlockId
  });

  useEffect(() => {
    setMounted(true);
    
    // 스크롤 감지로 스마트 사이드바 포지셔닝
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const optimalTop = Math.max(100, Math.min(200, scrollY + windowHeight / 4));
      setSidebarPosition({ top: optimalTop });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🔄 initialBlocks가 변경될 때 내부 상태 업데이트
  useEffect(() => {
    if (initialBlocks.length > 0) {
      setBlocks(initialBlocks);
    }
  }, [initialBlocks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setBlocks((blocks) => {
        const oldIndex = blocks.findIndex((block) => block.id === active.id);
        const newIndex = blocks.findIndex((block) => block.id === over?.id);

        return arrayMove(blocks, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const addBlock = (type: BlockType) => {
    const newBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content: getDefaultContent(type),
      settings: {
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        animation: 'none'
      },
    } as Block;

    setBlocks([...blocks, newBlock]);
  };

  const addTemplate = (templateBlocks: Block[]) => {
    setBlocks([...blocks, ...templateBlocks]);
  };

  const getDefaultContent = (type: BlockType): any => {
    switch (type) {
      case 'heading':
        return { text: '새 제목', level: 1 as const };
      case 'text':
        return { text: '새 텍스트를 입력하세요...', format: 'plain' as const };
      case 'image':
        return { images: [], displayMode: 'single' };
      case 'video':
        return { src: '', type: 'youtube' as const };
      case 'button':
        return { text: '버튼', link: '#' };
      case 'spacer':
        return { height: 50 };
      case 'hero':
        return { title: '새 히어로 섹션', subtitle: '부제목을 입력하세요' };
      case 'columns':
        return { columns: [{ content: '첫 번째 열' }, { content: '두 번째 열' }] };
      case 'html':
        return { html: '<p>HTML 코드를 입력하세요</p>' };
      default:
        return {};
    }
  };

  const updateBlock = (updatedBlock: Block) => {
    setBlocks(blocks.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    ));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const moveBlockUp = (id: string) => {
    const currentIndex = blocks.findIndex(block => block.id === id);
    if (currentIndex > 0) {
      setBlocks(arrayMove(blocks, currentIndex, currentIndex - 1));
    }
  };

  const moveBlockDown = (id: string) => {
    const currentIndex = blocks.findIndex(block => block.id === id);
    if (currentIndex < blocks.length - 1) {
      setBlocks(arrayMove(blocks, currentIndex, currentIndex + 1));
    }
  };

  const handleSave = () => {
    onSave?.(blocks);
    alert('페이지가 저장되었습니다!');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(blocks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `page-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedBlocks = JSON.parse(e.target?.result as string);
        setBlocks(importedBlocks);
      } catch {
        alert('파일을 불러오는데 실패했습니다.');
      }
    };
    reader.readAsText(file);
  };

  const blockTypes: { type: BlockType; label: string; icon: string }[] = [
    { type: 'hero', label: '히어로', icon: '🌟' },
    { type: 'columns', label: '컬럼 레이아웃', icon: '⚏' },
    { type: 'gallery', label: '이미지 갤러리', icon: '🖼️' },
    { type: 'card', label: '카드 컴포넌트', icon: '🎴' },
    { type: 'form', label: '연락처 폼', icon: '📝' },
    { type: 'heading', label: '제목', icon: '📄' },
    { type: 'text', label: '텍스트', icon: '✏️' },
    { type: 'image', label: '단일 이미지', icon: '🖼️' },
    { type: 'video', label: '동영상', icon: '🎥' },
    { type: 'button', label: '버튼', icon: '🔘' },
    { type: 'spacer', label: '공백', icon: '📏' },
    { type: 'html', label: 'HTML', icon: '💻' },
  ];

  const activeBlock = blocks.find(block => block.id === activeId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 간소화된 상단 툴바 */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">페이지 빌더</h1>
            <Button
              variant={isEditing ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Edit className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {isEditing ? '편집 모드' : '미리보기'}
            </Button>

            {/* Undo/Redo 버튼 */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={!canUndo}
                title="실행 취소 (Ctrl+Z)"
              >
                ↶
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={!canRedo}
                title="다시 실행 (Ctrl+Y)"
              >
                ↷
              </Button>
              {hasCopiedBlock && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={pasteBlock}
                  title="붙여넣기 (Ctrl+V)"
                >
                  📋
                </Button>
              )}
            </div>
          </div>
          
          {/* 사이드바 토글 (모바일용) */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 플로팅 스마트 사이드바 */}
      {isEditing && (
        <div 
          className={`fixed right-0 z-50 transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ top: `${sidebarPosition.top}px` }}
        >
          <div className="bg-white rounded-l-2xl shadow-2xl border border-gray-200 w-80 max-h-[70vh] overflow-y-auto">
            {/* 사이드바 헤더 */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 rounded-tl-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  편집 도구
                </h3>
                <div className="flex items-center space-x-2">
                  {/* 사이드바 위치 조절 버튼 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarPosition(prev => ({ top: Math.max(50, prev.top - 50) }))}
                    className="p-1"
                    title="위로"
                  >
                    <ChevronLeft className="w-4 h-4 rotate-90" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarPosition(prev => ({ top: Math.min(400, prev.top + 50) }))}
                    className="p-1"
                    title="아래로"
                  >
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                    className="p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* 사이드바 컨텐츠 */}
            <div className="p-4 space-y-6">
              {/* 페이지 관리 섹션 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">페이지 관리</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSave}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    저장
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    내보내기
                  </Button>
                </div>
                <div className="mt-2">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                    id="import-file"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('import-file')?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    가져오기
                  </Button>
                </div>
              </div>

              {/* 파일 관리 섹션 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">파일 관리</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBulkUploader(true)}
                    className="w-full"
                  >
                    <Images className="w-4 h-4 mr-1" />
                    이미지 업로드
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFileManager(true)}
                    className="w-full"
                  >
                    <FolderOpen className="w-4 h-4 mr-1" />
                    파일 매니저
                  </Button>
                </div>
              </div>

              {/* 템플릿 섹션 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">빠른 시작</h4>
                <Button
                  onClick={() => setShowTemplateGallery(true)}
                  variant="outline"
                  size="sm"
                  className="w-full mb-4"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  템플릿 갤러리
                </Button>
              </div>

              {/* 블록 추가 섹션 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">개별 블록</h4>
                <div className="grid grid-cols-1 gap-2">
                  {blockTypes.map((blockType) => (
                    <button
                      key={blockType.type}
                      onClick={() => addBlock(blockType.type)}
                      className="flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                    >
                      <span className="text-xl">{blockType.icon}</span>
                      <span className="font-medium text-gray-700 text-sm">
                        {blockType.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 현재 블록 수 */}
              <div className="text-center py-2 text-sm text-gray-500 border-t border-gray-100">
                총 {blocks.length}개 블록
              </div>
            </div>
          </div>

          {/* 사이드바 토글 핸들 */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full">
            <Button
              variant="default"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-r-none rounded-l-lg shadow-lg"
            >
              {sidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <div className={`transition-all duration-300 ${isEditing && sidebarOpen ? 'pr-80' : ''}`}>
        <div className="max-w-7xl mx-auto p-2 sm:p-4">
          {mounted ? (
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={blocks.map(block => block.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2"> {/* 드래그를 위한 약간의 간격 */}
                  {blocks.map((block, index) => (
                    <div key={block.id} className="relative">
                      {/* 드롭 존 표시 */}
                      {activeId && activeId !== block.id && (
                        <div className="absolute -top-1 left-0 right-0 h-2 bg-blue-200 opacity-0 hover:opacity-100 transition-opacity rounded-full" />
                      )}

                      <SortableBlock
                        block={block}
                        isEditing={isEditing}
                        onUpdate={updateBlock}
                        onDelete={deleteBlock}
                        onMoveUp={moveBlockUp}
                        onMoveDown={moveBlockDown}
                        canMoveUp={index > 0}
                        canMoveDown={index < blocks.length - 1}
                        isSelected={block.id === selectedBlockId}
                        onSelect={setSelectedBlockId}
                      />

                      {/* 마지막 블록 뒤에도 드롭 존 */}
                      {activeId && index === blocks.length - 1 && (
                        <div className="absolute -bottom-1 left-0 right-0 h-2 bg-blue-200 opacity-0 hover:opacity-100 transition-opacity rounded-full" />
                      )}
                    </div>
                  ))}
                </div>
              </SortableContext>
              <DragOverlay>
                {activeBlock && (
                  <div className="opacity-90 transform rotate-3 scale-105 shadow-2xl border-2 border-blue-400 rounded-lg bg-white">
                    <div className="p-2 bg-blue-600 text-white text-xs font-bold rounded-t-lg">
                      드래그 중: {activeBlock.type.toUpperCase()} 블록
                    </div>
                    <BlockRenderer
                      block={activeBlock}
                      isEditing={false}
                      onUpdate={() => {}}
                      onDelete={() => {}}
                      onMoveUp={() => {}}
                      onMoveDown={() => {}}
                      canMoveUp={false}
                      canMoveDown={false}
                    />
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          ) : (
            <div className="space-y-0">
              {blocks.map((block, index) => (
                <div key={block.id}>
                  <BlockRenderer
                    block={block}
                    isEditing={isEditing}
                    onUpdate={updateBlock}
                    onDelete={deleteBlock}
                    onMoveUp={moveBlockUp}
                    onMoveDown={moveBlockDown}
                    canMoveUp={index > 0}
                    canMoveDown={index < blocks.length - 1}
                  />
                </div>
              ))}
            </div>
          )}

          {blocks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">페이지를 만들어보세요</h3>
              <p className="text-gray-600 mb-4">우측 플로팅 사이드바에서 블록을 추가하여 페이지를 구성하세요.</p>
              {isEditing && (
                <Button onClick={() => addBlock('text')}>
                  <Plus className="w-4 h-4 mr-2" />
                  첫 번째 블록 추가
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* File Manager Modal */}
      <FileManager
        isOpen={showFileManager}
        onClose={() => setShowFileManager(false)}
        fileType="all"
      />

      {/* Bulk Image Uploader Modal */}
      <BulkImageUploader
        isOpen={showBulkUploader}
        onClose={() => setShowBulkUploader(false)}
        onComplete={() => {
          setShowBulkUploader(false)
          if (showFileManager) {
            setShowFileManager(false)
            setTimeout(() => setShowFileManager(true), 100)
          }
        }}
      />

      {/* Template Gallery Modal */}
      <TemplateGallery
        isOpen={showTemplateGallery}
        onClose={() => setShowTemplateGallery(false)}
        onSelectTemplate={addTemplate}
      />
    </div>
  );
}
