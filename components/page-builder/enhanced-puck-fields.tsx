'use client';

import { FieldProps } from '@measured/puck';
import { useState } from 'react';
import { SketchPicker } from 'react-color';
import sanitizeHtml from 'sanitize-html';

// 컬러 피커 필드 커스텀 컴포넌트
export const ColorPickerField = ({ onChange, value }: FieldProps<string>) => {
  const [showPicker, setShowPicker] = useState(false);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 border rounded cursor-pointer"
          style={{ backgroundColor: value || '#000000' }}
          onClick={() => setShowPicker(!showPicker)}
        />
        <input
          type="text"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border rounded"
          placeholder="#000000"
        />
      </div>
      
      {showPicker && (
        <div className="relative">
          <div className="absolute top-0 left-0 z-50">
            <div 
              className="fixed inset-0"
              onClick={() => setShowPicker(false)}
            />
            <SketchPicker
              color={value || '#000000'}
              onChange={(color) => onChange(color.hex)}
              disableAlpha
            />
          </div>
        </div>
      )}
    </div>
  );
};

// 슬라이더 필드 커스텀 컴포넌트  
export const SliderField = ({ onChange, value, min = 0, max = 100, step = 1, unit = '' }: FieldProps<number> & {
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}) => {
  const currentValue = value || min;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">현재 값</span>
        <span className="text-sm font-medium bg-blue-50 px-2 py-1 rounded">
          {currentValue}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value || min}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
      
      {/* 직접 입력 필드 */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 px-2 py-1 text-sm border rounded"
        />
        <span className="text-xs text-gray-500">{unit}</span>
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

// 안전한 HTML 필드
export const SafeHtmlField = ({ onChange, value }: FieldProps<string>) => {
  const [rawHtml, setRawHtml] = useState(value || '');
  
  const handleChange = (html: string) => {
    setRawHtml(html);
    
    // HTML 샌티타이즈
    const cleanHtml = sanitizeHtml(html, {
      allowedTags: [
        'div', 'p', 'span', 'br', 'strong', 'em', 'b', 'i', 'u',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'a', 'img', 
        'button', 'form', 'input', 'label',
        'table', 'tr', 'td', 'th', 'thead', 'tbody'
      ],
      allowedAttributes: {
        'a': ['href', 'target', 'rel'],
        'img': ['src', 'alt', 'width', 'height', 'style'],
        'div': ['style', 'class'],
        'span': ['style', 'class'],
        'p': ['style', 'class'],
        '*': ['id', 'class', 'style']
      },
      allowedSchemes: ['http', 'https', 'mailto', 'tel']
    });
    
    onChange(cleanHtml);
  };
  
  return (
    <div className="space-y-2">
      <textarea
        value={rawHtml}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-md font-mono text-sm"
        rows={8}
        placeholder="<div>HTML 코드를 입력하세요</div>"
      />
      <div className="text-xs text-gray-500">
        ⚠️ 보안을 위해 스크립트 태그는 제거됩니다
      </div>
      
      {/* HTML 미리보기 */}
      {value && (
        <div className="border rounded p-2 bg-gray-50">
          <div className="text-xs text-gray-600 mb-1">미리보기:</div>
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </div>
      )}
    </div>
  );
};