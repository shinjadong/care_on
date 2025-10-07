'use client';

import { useState } from 'react';
import { KeywordBlogGenerator } from '@/components/aiblog/KeywordBlogGenerator';
import { BlogPreview } from '@/components/aiblog/BlogPreview';

export default function BlogGeneratorPage() {
  const [generatedContent, setGeneratedContent] = useState<string>('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 생성 폼 */}
          <div>
            <KeywordBlogGenerator onBlogGenerated={setGeneratedContent} />
          </div>

          {/* 오른쪽: 미리보기 */}
          <div>
            <BlogPreview content={generatedContent} />
          </div>
        </div>
      </div>
    </div>
  );
}
