'use client';

import { useState } from 'react';
import { HeroBlock } from '@/types/page-builder';
import { Button } from '@/components/ui/button';

interface HeroBlockRendererProps {
  block: HeroBlock;
  isEditing?: boolean;
  onUpdate?: (block: HeroBlock) => void;
}

export function HeroBlockRenderer({ block, isEditing, onUpdate }: HeroBlockRendererProps) {
  const [isEditingHero, setIsEditingHero] = useState(false);
  const [heroData, setHeroData] = useState(block.content);

  const handleSave = () => {
    onUpdate?.({
      ...block,
      content: heroData,
    });
    setIsEditingHero(false);
  };

  if (isEditing && isEditingHero) {
    return (
      <div className="space-y-4 p-4 border rounded">
        <div>
          <label className="block text-sm font-medium mb-2">제목</label>
          <input
            type="text"
            value={heroData.title}
            onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">부제목</label>
          <input
            type="text"
            value={heroData.subtitle || ''}
            onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">배경 이미지 URL</label>
          <input
            type="text"
            value={heroData.backgroundImage || ''}
            onChange={(e) => setHeroData({ ...heroData, backgroundImage: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">배경 동영상 URL</label>
          <input
            type="text"
            value={heroData.backgroundVideo || ''}
            onChange={(e) => setHeroData({ ...heroData, backgroundVideo: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={heroData.overlay || false}
              onChange={(e) => setHeroData({ ...heroData, overlay: e.target.checked })}
              className="mr-2"
            />
            오버레이 표시
          </label>
          <div>
            <label className="block text-sm font-medium mb-2">오버레이 투명도</label>
            <input
              type="number"
              value={heroData.overlayOpacity || 0.5}
              onChange={(e) => setHeroData({ ...heroData, overlayOpacity: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border rounded"
              min="0"
              max="1"
              step="0.1"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            저장
          </button>
          <button
            onClick={() => {
              setHeroData(block.content);
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
    <div
      className={`relative min-h-[500px] flex items-center justify-center ${isEditing ? 'cursor-pointer hover:opacity-80' : ''}`}
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
          style={{ opacity: heroData.overlayOpacity || 0.5 }}
        />
      )}

      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {heroData.title}
        </h1>
        {heroData.subtitle && (
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {heroData.subtitle}
          </p>
        )}
        {heroData.buttons && heroData.buttons.length > 0 && (
          <div className="flex gap-4 justify-center">
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
  );
}