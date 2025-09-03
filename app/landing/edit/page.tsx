'use client';

import { useState, useEffect } from "react";
import { PageBuilder } from "@/components/page-builder/page-builder";
import { PuckPageBuilder } from "@/components/page-builder/puck-page-builder";
import { Block } from "@/types/page-builder";
import { Button } from "@/components/ui/button";
import { Zap, Settings, ArrowRight } from "lucide-react";

// 관리자용 랜딩 페이지 편집기
export default function LandingEditPage() {
  const [initialBlocks, setInitialBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editorMode, setEditorMode] = useState<'classic' | 'puck' | 'select'>('select');

  // 컴포넌트 마운트 시 기존 페이지 데이터 불러오기
  useEffect(() => {
    const loadPageData = async () => {
      try {
        const response = await fetch('/api/pages/landing');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data && result.data.blocks && result.data.blocks.length > 0) {
            console.log('✅ 서버에서 페이지 데이터 불러오기 성공:', result.data.blocks.length, '개 블록');
            
            // 블록 데이터 검증 및 정제
            const validatedBlocks = result.data.blocks.map((block: any) => {
              try {
                // 기본 블록 구조 검증
                if (!block.id || !block.type || !block.content) {
                  console.warn('⚠️ 잘못된 블록 구조 발견:', block);
                  return null;
                }

                // 각 블록 타입별 콘텐츠 검증
                let validatedContent = block.content;
                
                switch (block.type) {
                  case 'text':
                    validatedContent = {
                      text: typeof block.content.text === 'string' ? block.content.text : '',
                      format: block.content.format === 'markdown' ? 'markdown' : 'plain',
                      // 타이포그래피 속성들 보존
                      fontSize: block.content.fontSize || '16',
                      color: block.content.color || '#000000',
                      letterSpacing: block.content.letterSpacing || 'normal',
                      lineHeight: block.content.lineHeight || '1.5',
                      fontWeight: block.content.fontWeight || '400',
                      textAlign: block.content.textAlign || 'left',
                      fontFamily: block.content.fontFamily || 'default',
                      fontStyle: block.content.fontStyle || 'normal',
                    };
                    break;
                  case 'image':
                    if (block.content.images && Array.isArray(block.content.images)) {
                      validatedContent = {
                        images: block.content.images,
                        displayMode: block.content.displayMode || 'single'
                      };
                    } else if (block.content.src) {
                      // 레거시 단일 이미지 구조를 새 구조로 변환
                      validatedContent = {
                        images: [{
                          id: 'legacy-img',
                          src: block.content.src,
                          alt: block.content.alt || '',
                          caption: block.content.caption || '',
                          width: block.content.width,
                          height: block.content.height
                        }],
                        displayMode: 'single'
                      };
                    }
                    break;
                  case 'button':
                    validatedContent = {
                      text: block.content.text || '버튼',
                      link: block.content.link || '#',
                      variant: block.content.variant || 'default',
                      size: block.content.size || 'default',
                      alignment: block.content.alignment || 'left'
                    };
                    break;
                }

                return {
                  ...block,
                  content: validatedContent
                };
              } catch (error) {
                console.error('❌ 블록 검증 중 오류:', error, block);
                return null;
              }
            }).filter(Boolean); // null 값 제거

            setInitialBlocks(validatedBlocks);
          } else {
            console.log('📝 서버에 페이지 데이터 없음, 빈 페이지로 시작');
            setInitialBlocks([]);
          }
        } else {
          console.log('❌ 페이지 데이터 조회 실패, 빈 페이지로 시작');
          setInitialBlocks([]);
        }
      } catch (error) {
        console.error('❌ 페이지 데이터 불러오기 중 오류:', error);
        setInitialBlocks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPageData();
  }, []);

  // 페이지 저장 핸들러
  const handleSave = async (blocks: Block[]) => {
    try {
      console.log('💾 페이지 저장 시작:', blocks.length, '개 블록');
      
      // 🚀 모든 블록 데이터를 완전히 보존
      const preservedBlocks = blocks.map(block => ({
        ...block,
        content: { ...block.content }, // 모든 content 속성 보존
        settings: { ...block.settings }, // 모든 settings 속성 보존
      }));
      
      // 저장 전 블록 데이터 검증 및 정제
      const validatedBlocks = blocks.map((block) => {
        try {
          let cleanContent = { ...block.content };

          // 각 블록 타입별 데이터 정제
          switch (block.type) {
            case 'text':
              cleanContent = {
                text: block.content.text || '',
                format: block.content.format || 'plain',
                // 타이포그래피 속성들 보존
                fontSize: block.content.fontSize || '16',
                color: block.content.color || '#000000',
                letterSpacing: block.content.letterSpacing || 'normal',
                lineHeight: block.content.lineHeight || '1.5',
                fontWeight: block.content.fontWeight || '400',
                textAlign: block.content.textAlign || 'left',
                fontFamily: block.content.fontFamily || 'default',
                fontStyle: block.content.fontStyle || 'normal',
              };
              break;
            case 'image':
              cleanContent = {
                images: Array.isArray(block.content.images) ? block.content.images : [],
                displayMode: block.content.displayMode || 'single'
              };
              break;
            case 'button':
              cleanContent = {
                text: block.content.text || '버튼',
                link: block.content.link || '#',
                variant: block.content.variant || 'default',
                size: block.content.size || 'default',
                alignment: block.content.alignment || 'left'
              };
              break;
            case 'heading':
              cleanContent = {
                text: block.content.text || '',
                level: block.content.level || 1,
                // 타이포그래피 속성들 보존
                fontSize: block.content.fontSize || 'default',
                color: block.content.color || '#000000',
                letterSpacing: block.content.letterSpacing || 'normal',
                lineHeight: block.content.lineHeight || 'normal',
                fontWeight: block.content.fontWeight || 'bold',
                textAlign: block.content.textAlign || 'left',
                fontFamily: block.content.fontFamily || 'default',
              };
              break;
            case 'html':
              cleanContent = {
                html: block.content.html || ''
              };
              break;
            case 'hero':
              cleanContent = {
                title: block.content.title || '',
                subtitle: block.content.subtitle || '',
                backgroundImage: block.content.backgroundImage || '',
                backgroundVideo: block.content.backgroundVideo || '',
                overlay: block.content.overlay || false,
                overlayOpacity: block.content.overlayOpacity || 0.5,
                buttons: Array.isArray(block.content.buttons) ? block.content.buttons : [],
                // 타이포그래피 스타일 보존
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
              };
              break;
            case 'video':
              cleanContent = {
                src: block.content.src || '',
                type: block.content.type || 'youtube',
                // 비디오 설정 속성들 보존
                width: block.content.width || 'auto',
                height: block.content.height || 'auto',
                autoplay: block.content.autoplay || false,
                muted: block.content.muted || true,
                loop: block.content.loop || false,
                controls: block.content.controls !== false, // 기본값 true
              };
              break;
            case 'spacer':
              cleanContent = {
                height: block.content.height || 50
              };
              break;
          }

          return {
            id: block.id,
            type: block.type,
            content: cleanContent,
            settings: block.settings || {}
          };
        } catch (error) {
          console.error('❌ 블록 검증 중 오류:', error, block);
          return null;
        }
      }).filter(Boolean) as Block[]; // null 값 제거

      console.log('🔍 검증된 블록 수:', validatedBlocks.length);
      
      console.log('🔍 보존된 블록 수:', preservedBlocks.length);
      
      // API 엔드포인트 호출
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: 'landing',
          title: '케어온 랜딩 페이지',
          blocks: preservedBlocks, // 완전히 보존된 블록 사용
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ 서버 응답 에러:', errorText);
        throw new Error(`서버 오류: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ 서버 응답:', result);
      
      if (result.success) {
        // 저장 성공 메시지
        console.log('✅ 페이지 저장 완료:', blocks.length, '개 블록');
        
        // 🔄 중요: 저장된 블록으로 초기 상태 업데이트 (완전히 보존된 데이터)
        setInitialBlocks([...preservedBlocks]);
        
        alert('페이지가 성공적으로 저장되었습니다!');
      } else {
        throw new Error('저장 실패: ' + result.error);
      }
      
    } catch (error) {
      console.error('❌ 페이지 저장 실패:', error);
      alert('페이지 저장에 실패했습니다. 다시 시도해주세요.\n\n오류: ' + error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">페이지 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에디터 선택 화면
  if (editorMode === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              페이지 에디터 선택
            </h1>
            <p className="text-xl text-gray-600">
              원하는 편집 방식을 선택하세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 클래식 에디터 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">클래식 에디터</h3>
                <p className="text-gray-600 mb-4">기존 블록 기반 편집기</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  정밀한 설정 제어
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  안정적이고 검증된 시스템
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  프로페셔널 편집 도구
                </div>
              </div>

              <Button
                onClick={() => setEditorMode('classic')}
                variant="outline"
                className="w-full"
              >
                클래식 에디터 사용
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Puck 에디터 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow border-2 border-yellow-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Puck 에디터</h3>
                <p className="text-yellow-600 font-medium mb-1">🆕 캔바 수준 WYSIWYG</p>
                <p className="text-gray-600 text-sm">직관적인 드래그 앤 드롭</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  완전한 WYSIWYG 편집
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  자유로운 드래그 앤 드롭
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  캔바 수준의 직관성
                </div>
              </div>

              <Button
                onClick={() => setEditorMode('puck')}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                <Zap className="w-4 h-4 mr-2" />
                Puck 에디터 체험
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              언제든지 에디터를 전환할 수 있습니다
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Puck 에디터 모드
  if (editorMode === 'puck') {
    return (
      <PuckPageBuilder
        initialBlocks={initialBlocks}
        onSave={handleSave}
        onBack={() => setEditorMode('select')}
      />
    );
  }

  // 클래식 에디터 모드
  return (
    <div>
      <div className="bg-white border-b p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h2 className="text-lg font-semibold">클래식 에디터</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditorMode('select')}
          >
            에디터 변경
          </Button>
        </div>
      </div>
      
      <PageBuilder
        initialBlocks={initialBlocks}
        onSave={handleSave}
      />
    </div>
  );
}
