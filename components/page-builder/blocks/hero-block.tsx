'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { HeroBlock } from '@/types/page-builder';
import { Button } from '@/components/ui/button';
import { FileManager } from '../file-manager';
import { 
  Image, Video, Type, Settings, X, Palette, AlignLeft, AlignCenter, AlignRight,
  Plus, Trash2, FolderOpen 
} from 'lucide-react';

interface HeroBlockRendererProps {
  block: HeroBlock;
  isEditing?: boolean;
  onUpdate?: (block: HeroBlock) => void;
}

export const HeroBlockRenderer = memo(function HeroBlockRenderer({ block, isEditing, onUpdate }: HeroBlockRendererProps) {
  const [isEditingHero, setIsEditingHero] = useState(false);
  const [showFileManager, setShowFileManager] = useState(false);
  const [fileManagerTarget, setFileManagerTarget] = useState<'background' | 'image'>('background');
  const [showTypography, setShowTypography] = useState(false);
  const [heroData, setHeroData] = useState({
    title: block.content.title || '새 히어로 섹션',
    subtitle: block.content.subtitle || '',
    backgroundImage: block.content.backgroundImage || '',
    backgroundVideo: block.content.backgroundVideo || '',
    overlay: block.content.overlay || false,
    overlayOpacity: block.content.overlayOpacity || 0.5,
    buttons: block.content.buttons || [],
    titleStyle: {
      fontSize: block.content.titleStyle?.fontSize || '48',
      color: block.content.titleStyle?.color || '#ffffff',
      letterSpacing: block.content.titleStyle?.letterSpacing || 'normal',
      lineHeight: block.content.titleStyle?.lineHeight || 'normal',
      fontWeight: block.content.titleStyle?.fontWeight || '700',
      textAlign: block.content.titleStyle?.textAlign || 'center',
    },
    subtitleStyle: {
      fontSize: block.content.subtitleStyle?.fontSize || '20',
      color: block.content.subtitleStyle?.color || '#ffffff',
      letterSpacing: block.content.subtitleStyle?.letterSpacing || 'normal',
      lineHeight: block.content.subtitleStyle?.lineHeight || 'normal',
      fontWeight: block.content.subtitleStyle?.fontWeight || '400',
      textAlign: block.content.subtitleStyle?.textAlign || 'center',
    },
  });

  // 🔄 블록 내용이 변경될 때 상태 동기화
  useEffect(() => {
    setHeroData({
      title: block.content.title || '새 히어로 섹션',
      subtitle: block.content.subtitle || '',
      backgroundImage: block.content.backgroundImage || '',
      backgroundVideo: block.content.backgroundVideo || '',
      overlay: block.content.overlay || false,
      overlayOpacity: block.content.overlayOpacity || 0.5,
      buttons: block.content.buttons || [],
      titleStyle: {
        fontSize: block.content.titleStyle?.fontSize || '48',
        color: block.content.titleStyle?.color || '#ffffff',
        letterSpacing: block.content.titleStyle?.letterSpacing || 'normal',
        lineHeight: block.content.titleStyle?.lineHeight || 'normal',
        fontWeight: block.content.titleStyle?.fontWeight || '700',
        textAlign: block.content.titleStyle?.textAlign || 'center',
      },
      subtitleStyle: {
        fontSize: block.content.subtitleStyle?.fontSize || '20',
        color: block.content.subtitleStyle?.color || '#ffffff',
        letterSpacing: block.content.subtitleStyle?.letterSpacing || 'normal',
        lineHeight: block.content.subtitleStyle?.lineHeight || 'normal',
        fontWeight: block.content.subtitleStyle?.fontWeight || '400',
        textAlign: block.content.subtitleStyle?.textAlign || 'center',
      },
    });
  }, [block.content]);

  const handleSave = () => {
    onUpdate?.({
      ...block,
      content: heroData,
    });
    setIsEditingHero(false);
    setShowTypography(false);
  };

  const handleFileSelect = (url: string, type: 'image' | 'video') => {
    if (fileManagerTarget === 'background') {
      if (type === 'image') {
        setHeroData(prev => ({ ...prev, backgroundImage: url, backgroundVideo: '' }));
      } else {
        setHeroData(prev => ({ ...prev, backgroundVideo: url, backgroundImage: '' }));
      }
    }
    setShowFileManager(false);
  };

  const addButton = () => {
    setHeroData(prev => ({
      ...prev,
      buttons: [...prev.buttons, { text: '새 버튼', link: '#', variant: 'default', size: 'lg' }]
    }));
  };

  const updateButton = (index: number, buttonData: any) => {
    setHeroData(prev => ({
      ...prev,
      buttons: prev.buttons.map((btn, i) => i === index ? buttonData : btn)
    }));
  };

  const deleteButton = (index: number) => {
    setHeroData(prev => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index)
    }));
  };

  const titleStyle = useMemo((): React.CSSProperties => {
    const style = heroData.titleStyle;
    return {
      fontSize: `${style.fontSize}px`,
      color: style.color,
      letterSpacing: style.letterSpacing === 'normal' ? 'normal' : `${style.letterSpacing}px`,
      lineHeight: style.lineHeight === 'normal' ? 'normal' : style.lineHeight,
      fontWeight: style.fontWeight,
      textAlign: style.textAlign as any,
      margin: 0,
      padding: 0,
    };
  }, [heroData.titleStyle]);

  const subtitleStyle = useMemo((): React.CSSProperties => {
    const style = heroData.subtitleStyle;
    return {
      fontSize: `${style.fontSize}px`,
      color: style.color,
      letterSpacing: style.letterSpacing === 'normal' ? 'normal' : `${style.letterSpacing}px`,
      lineHeight: style.lineHeight === 'normal' ? 'normal' : style.lineHeight,
      fontWeight: style.fontWeight,
      textAlign: style.textAlign as any,
      margin: 0,
      padding: 0,
    };
  }, [heroData.subtitleStyle]);

  if (isEditing && isEditingHero) {
    return (
      <div className="space-y-6 p-6 border rounded-lg bg-white shadow-lg max-w-4xl mx-auto">
        {/* Basic Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">제목</label>
            <input
              type="text"
              value={heroData.title}
              onChange={(e) => setHeroData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">부제목</label>
            <input
              type="text"
              value={heroData.subtitle}
              onChange={(e) => setHeroData(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Background Settings */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="font-medium mb-4 flex items-center">
            <Image className="w-4 h-4 mr-2" />
            배경 설정
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">배경 이미지</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={heroData.backgroundImage}
                  onChange={(e) => setHeroData(prev => ({ ...prev, backgroundImage: e.target.value }))}
                  className="flex-1 px-3 py-2 border rounded-md"
                  placeholder="이미지 URL"
                />
                <Button
                  onClick={() => {
                    setFileManagerTarget('background');
                    setShowFileManager(true);
                  }}
                  variant="outline"
                  size="sm"
                >
                  <FolderOpen className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">배경 동영상</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={heroData.backgroundVideo}
                  onChange={(e) => setHeroData(prev => ({ ...prev, backgroundVideo: e.target.value }))}
                  className="flex-1 px-3 py-2 border rounded-md"
                  placeholder="동영상 URL"
                />
                <Button
                  onClick={() => {
                    setFileManagerTarget('background');
                    setShowFileManager(true);
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Video className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={heroData.overlay}
                onChange={(e) => setHeroData(prev => ({ ...prev, overlay: e.target.checked }))}
                className="mr-2"
              />
              오버레이 표시
            </label>
            <div>
              <label className="block text-sm font-medium mb-1">투명도</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={heroData.overlayOpacity}
                onChange={(e) => setHeroData(prev => ({ ...prev, overlayOpacity: parseFloat(e.target.value) }))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 text-center">{Math.round(heroData.overlayOpacity * 100)}%</div>
            </div>
          </div>
        </div>

        {/* Typography Settings */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="font-medium mb-4 flex items-center">
            <Type className="w-4 h-4 mr-2" />
            타이포그래피
          </h4>
          
          {/* Title Typography */}
          <div className="mb-4">
            <h5 className="text-sm font-medium mb-3">제목 스타일</h5>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">크기</label>
                <input
                  type="number"
                  value={heroData.titleStyle.fontSize}
                  onChange={(e) => setHeroData(prev => ({
                    ...prev,
                    titleStyle: { ...prev.titleStyle, fontSize: e.target.value }
                  }))}
                  className="w-full text-sm border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">색상</label>
                <input
                  type="color"
                  value={heroData.titleStyle.color}
                  onChange={(e) => setHeroData(prev => ({
                    ...prev,
                    titleStyle: { ...prev.titleStyle, color: e.target.value }
                  }))}
                  className="w-full h-8 border rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">자간</label>
                <input
                  type="number"
                  step="0.1"
                  value={heroData.titleStyle.letterSpacing === 'normal' ? 0 : heroData.titleStyle.letterSpacing}
                  onChange={(e) => setHeroData(prev => ({
                    ...prev,
                    titleStyle: { ...prev.titleStyle, letterSpacing: e.target.value }
                  }))}
                  className="w-full text-sm border rounded px-2 py-1"
                />
              </div>
            </div>
          </div>

          {/* Subtitle Typography */}
          <div>
            <h5 className="text-sm font-medium mb-3">부제목 스타일</h5>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">크기</label>
                <input
                  type="number"
                  value={heroData.subtitleStyle.fontSize}
                  onChange={(e) => setHeroData(prev => ({
                    ...prev,
                    subtitleStyle: { ...prev.subtitleStyle, fontSize: e.target.value }
                  }))}
                  className="w-full text-sm border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">색상</label>
                <input
                  type="color"
                  value={heroData.subtitleStyle.color}
                  onChange={(e) => setHeroData(prev => ({
                    ...prev,
                    subtitleStyle: { ...prev.subtitleStyle, color: e.target.value }
                  }))}
                  className="w-full h-8 border rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">자간</label>
                <input
                  type="number"
                  step="0.1"
                  value={heroData.subtitleStyle.letterSpacing === 'normal' ? 0 : heroData.subtitleStyle.letterSpacing}
                  onChange={(e) => setHeroData(prev => ({
                    ...prev,
                    subtitleStyle: { ...prev.subtitleStyle, letterSpacing: e.target.value }
                  }))}
                  className="w-full text-sm border rounded px-2 py-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              버튼 관리
            </h4>
            <Button onClick={addButton} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              버튼 추가
            </Button>
          </div>

          {heroData.buttons.map((button, index) => (
            <div key={index} className="border rounded p-3 mb-3 bg-white">
              <div className="grid grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  value={button.text}
                  onChange={(e) => updateButton(index, { ...button, text: e.target.value })}
                  placeholder="버튼 텍스트"
                  className="text-sm border rounded px-2 py-1"
                />
                <input
                  type="text"
                  value={button.link}
                  onChange={(e) => updateButton(index, { ...button, link: e.target.value })}
                  placeholder="링크 URL"
                  className="text-sm border rounded px-2 py-1"
                />
                <div className="flex gap-1">
                  <select
                    value={button.variant}
                    onChange={(e) => updateButton(index, { ...button, variant: e.target.value })}
                    className="flex-1 text-sm border rounded px-1 py-1"
                  >
                    <option value="default">기본</option>
                    <option value="outline">테두리</option>
                    <option value="ghost">투명</option>
                  </select>
                  <button
                    onClick={() => deleteButton(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="border rounded-lg p-4 bg-white">
          <label className="block text-sm font-medium mb-2">미리보기</label>
          <div className="min-h-[200px] bg-gray-900 rounded-lg relative overflow-hidden">
            {heroData.backgroundImage && (
              <img
                src={heroData.backgroundImage}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            {heroData.backgroundVideo && (
              <video
                src={heroData.backgroundVideo}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                loop
              />
            )}
            {heroData.overlay && (
              <div 
                className="absolute inset-0 bg-black"
                style={{ opacity: heroData.overlayOpacity }}
              />
            )}
            <div className="relative z-10 flex items-center justify-center h-full p-6">
              <div className="text-center">
                <h1 style={titleStyle}>{heroData.title}</h1>
                {heroData.subtitle && <p style={subtitleStyle}>{heroData.subtitle}</p>}
                {heroData.buttons.length > 0 && (
                  <div className="flex gap-2 justify-center mt-4">
                    {heroData.buttons.map((btn, i) => (
                      <button key={i} className="px-4 py-2 bg-blue-500 text-white rounded">
                        {btn.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            저장
          </button>
          <button
            onClick={() => {
              setHeroData({
                title: block.content.title || '새 히어로 섹션',
                subtitle: block.content.subtitle || '',
                backgroundImage: block.content.backgroundImage || '',
                backgroundVideo: block.content.backgroundVideo || '',
                overlay: block.content.overlay || false,
                overlayOpacity: block.content.overlayOpacity || 0.5,
                buttons: block.content.buttons || [],
                titleStyle: block.content.titleStyle || {
                  fontSize: '48',
                  color: '#ffffff',
                  letterSpacing: 'normal',
                  lineHeight: 'normal',
                  fontWeight: '700',
                  textAlign: 'center',
                },
                subtitleStyle: block.content.subtitleStyle || {
                  fontSize: '20',
                  color: '#ffffff',
                  letterSpacing: 'normal',
                  lineHeight: 'normal',
                  fontWeight: '400',
                  textAlign: 'center',
                },
              });
              setIsEditingHero(false);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            취소
          </button>
        </div>
      </div>
    );
  }

  const backgroundStyle: React.CSSProperties = {
    backgroundImage: heroData.backgroundImage ? `url(${heroData.backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="relative">
      {/* 히어로 편집 컨트롤 분산 배치 */}
      {isEditing && (
        <>
          {/* 배경 관련 버튼 - 상단 좌측 */}
          <div className="absolute top-2 left-2 z-15 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-1 bg-white/90 backdrop-blur rounded shadow-lg border">
              <button
                onClick={() => {
                  setFileManagerTarget('background');
                  setShowFileManager(true);
                }}
                className="p-2 rounded transition-colors bg-purple-500 text-white hover:bg-purple-600"
                title="배경 변경"
              >
                <Image className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 편집 기능 버튼 - 상단 우측 */}
          <div className="absolute top-2 right-2 z-15 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-1 bg-white/90 backdrop-blur rounded shadow-lg border">
              <button
                onClick={() => setShowTypography(!showTypography)}
                className="p-2 rounded transition-colors bg-green-500 text-white hover:bg-green-600"
                title="타이포그래피"
              >
                <Type className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsEditingHero(true)}
                className="p-2 rounded transition-colors bg-blue-500 text-white hover:bg-blue-600"
                title="상세 편집"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Hero Display */}
      <div
        className={`relative min-h-[500px] flex items-center justify-center m-0 p-0 ${isEditing ? 'cursor-pointer hover:opacity-90 group' : ''}`}
        style={backgroundStyle}
        onClick={() => isEditing && setIsEditingHero(true)}
      >
        {heroData.backgroundVideo && (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={heroData.backgroundVideo}
            autoPlay
            loop
            muted
            playsInline
          />
        )}
        
        {heroData.overlay && (
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: heroData.overlayOpacity }}
          />
        )}

        <div className="relative z-10 text-center px-6">
          <h1 style={titleStyle}>
            {heroData.title}
          </h1>
          {heroData.subtitle && (
            <p className="mt-4 mb-8" style={subtitleStyle}>
              {heroData.subtitle}
            </p>
          )}
          {heroData.buttons && heroData.buttons.length > 0 && (
            <div className="flex gap-4 justify-center mt-8">
              {heroData.buttons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.variant || 'default'}
                  size={button.size || 'lg'}
                  onClick={() => !isEditing && window.open(button.link, '_blank')}
                >
                  {button.text}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* File Manager */}
      <FileManager
        isOpen={showFileManager}
        onClose={() => setShowFileManager(false)}
        onSelectFile={handleFileSelect}
        fileType="all"
        mode="select"
      />
    </div>
  );
}, (prevProps, nextProps) => {
  // 히어로 블록 내용이 동일하고 편집 모드가 같으면 리렌더링 방지
  return JSON.stringify(prevProps.block.content) === JSON.stringify(nextProps.block.content) &&
         prevProps.isEditing === nextProps.isEditing;
});
