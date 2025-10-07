-- 페이지 빌더를 위한 데이터베이스 스키마

-- pages 테이블 생성
CREATE TABLE IF NOT EXISTS pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug varchar(255) UNIQUE NOT NULL,
  title varchar(500) NOT NULL,
  blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 페이지를 읽을 수 있도록 허용
CREATE POLICY "Anyone can read pages" ON pages
  FOR SELECT USING (true);

-- 인증된 사용자만 페이지를 생성할 수 있도록 허용
CREATE POLICY "Authenticated users can insert pages" ON pages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자만 페이지를 수정할 수 있도록 허용  
CREATE POLICY "Authenticated users can update pages" ON pages
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자만 페이지를 삭제할 수 있도록 허용
CREATE POLICY "Authenticated users can delete pages" ON pages
  FOR DELETE USING (auth.role() = 'authenticated');

-- 미디어 파일 저장을 위한 media 테이블 생성
CREATE TABLE IF NOT EXISTS media (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  filename varchar(500) NOT NULL,
  original_filename varchar(500) NOT NULL,
  file_path varchar(1000) NOT NULL,
  file_size integer NOT NULL,
  mime_type varchar(100) NOT NULL,
  alt_text varchar(500),
  created_at timestamptz DEFAULT now()
);

-- media 테이블 RLS 설정
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 미디어를 읽을 수 있도록 허용
CREATE POLICY "Anyone can read media" ON media
  FOR SELECT USING (true);

-- 인증된 사용자만 미디어를 업로드할 수 있도록 허용
CREATE POLICY "Authenticated users can upload media" ON media
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자만 미디어를 삭제할 수 있도록 허용
CREATE POLICY "Authenticated users can delete media" ON media
  FOR DELETE USING (auth.role() = 'authenticated');

-- 기본 랜딩 페이지 데이터 삽입 (RLS 임시 비활성화)
ALTER TABLE pages DISABLE ROW LEVEL SECURITY;

INSERT INTO pages (slug, title, blocks) VALUES (
  'landing',
  '케어온 랜딩 페이지',
  '[
    {
      "id": "hero-1",
      "type": "hero",
      "content": {
        "title": "사업 성공의 파트너\n케어온이 함께합니다",
        "subtitle": "프랜차이즈 창업부터 매장 운영까지, 필요한 모든 장비를 한 번에.\n초기 투자 부담은 줄이고, 매출 성장에만 집중하세요.",
        "backgroundImage": "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80",
        "overlay": true,
        "overlayOpacity": 0.6,
        "buttons": [
          { "text": "무료 견적 받기", "link": "#contact-form", "variant": "default", "size": "lg" },
          { "text": "상품 카탈로그 보기", "link": "#products", "variant": "outline", "size": "lg" }
        ]
      },
      "settings": {
        "margin": { "bottom": 0 }
      }
    },
    {
      "id": "announcement-1",
      "type": "html",
      "content": {
        "html": "<div class=\"bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 text-center\"><p class=\"text-lg font-semibold\">🎉 신규 가입 고객 한정! 첫 달 렌탈료 50% 할인 + 설치비 무료</p></div>"
      },
      "settings": {
        "margin": { "top": 0, "bottom": 0 }
      }
    },
    {
      "id": "stats-1",
      "type": "html",
      "content": {
        "html": "<div class=\"py-16 bg-gray-50\"><div class=\"container mx-auto px-4\"><div class=\"grid grid-cols-2 md:grid-cols-4 gap-8 text-center\"><div><div class=\"text-4xl font-bold text-primary mb-2\">15,000+</div><div class=\"text-gray-600\">누적 고객사</div></div><div><div class=\"text-4xl font-bold text-primary mb-2\">98%</div><div class=\"text-gray-600\">고객 만족도</div></div><div><div class=\"text-4xl font-bold text-primary mb-2\">24시간</div><div class=\"text-gray-600\">A/S 대응</div></div><div><div class=\"text-4xl font-bold text-primary mb-2\">300억+</div><div class=\"text-gray-600\">연간 거래액</div></div></div></div></div>"
      },
      "settings": {
        "margin": { "top": 0, "bottom": 0 }
      }
    }
  ]'::jsonb
) ON CONFLICT (slug) DO NOTHING;

-- RLS 다시 활성화
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_updated_at ON pages(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);
