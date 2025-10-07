# Supabase 제품 관리 시스템 통합 계획 (개선판)

## 📋 현재 상태 분석

### ✅ 기존 테이블 구조 확인 완료
**products 테이블이 이미 존재함!**

#### products 테이블 현재 구조:
\`\`\`sql
CREATE TABLE public.products (
  product_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar NOT NULL,
  category varchar NOT NULL,
  provider varchar,
  monthly_fee integer DEFAULT 0 CHECK (monthly_fee >= 0),
  description text,
  available boolean DEFAULT true,
  closure_refund_rate integer DEFAULT 0,
  max_discount_rate integer DEFAULT 0,
  discount_tiers jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
)
\`\`\`

#### 관련 테이블들:
- `packages` - 패키지 상품
- `package_items` - 패키지 구성 아이템
- `contracts` - 계약
- `contract_items` - 계약 아이템
- `customers` - 고객
- `employees` - 직원

## 🗂️ 기존 데이터 구조 활용 전략

### 데이터 매핑
기존 products 테이블 필드를 프론트엔드 요구사항에 매핑:

| DB 필드 | 프론트엔드 매핑 | 설명 |
|---------|---------------|------|
| `product_id` | `id` | 제품 고유 ID |
| `name` | `name` | 제품명 |
| `category` | `category` | 제품 카테고리 |
| `provider` | `provider` | 제공업체 |
| `monthly_fee` | `price` | 월 구독료 |
| `description` | `description` | 제품 설명 |
| `available` | `inStock` | 재고 상태 |
| `discount_tiers` | 할인 정보 | 단계별 할인율 |

### 추가 데이터 관리 방안
프론트엔드에서 필요한 추가 정보는 다음과 같이 관리:

1. **제품 이미지**: 현재는 하드코딩된 그라디언트 사용
2. **평점/리뷰**: 별도 reviews 테이블과 연동 가능
3. **상세 기능**: description 필드 활용 또는 JSON 구조 사용
4. **배지**: discount_tiers의 조건별 표시

## 🔄 구현 계획

### Phase 1: 데이터 시딩 (즉시 실행 가능)
1. 기존 `lib/products-data.ts`의 데이터를 products 테이블에 INSERT
2. 샘플 SQL:
   \`\`\`sql
   INSERT INTO products (name, category, provider, monthly_fee, description, available)
   VALUES
   ('케어온 토탈 솔루션', '종합솔루션', '케어온', 150000,
    '창업부터 운영까지 모든 것을 한번에 해결하는 종합 패키지', true),
   ('CCTV 보안 시스템', '보안', '케어온', 80000,
    '24시간 실시간 모니터링과 AI 이상감지 기능', true);
   \`\`\`

### Phase 2: API 엔드포인트 (✅ 완료)
- `/api/products` - 제품 목록 조회 ✅
- `/api/products/[id]` - 제품 상세 조회 ✅

### Phase 3: 프론트엔드 통합 (다음 단계)
1. `app/products/page.tsx`를 서버 컴포넌트로 변경
2. 데이터베이스에서 직접 데이터 페칭
3. 하드코딩된 데이터 제거

## 🚀 완료된 작업

### ✅ Step 1: Supabase Helper 함수 (lib/supabase/products.ts)
- getProducts() - 필터링된 제품 목록 조회
- getProductById() - ID로 제품 조회
- getProductCategories() - 카테고리 목록
- getPackages() - 패키지 상품 조회
- getContractItems() - 계약 아이템 조회

### ✅ Step 2: API 엔드포인트
- `/api/products` - GET 제품 목록
- `/api/products/[id]` - GET 제품 상세

### ✅ Step 3: 컴포넌트 구조화
- `/app/products/components/` 폴더 생성
- ProductCard, ProductGrid, CategoryFilter 등 컴포넌트화
- Next.js 15 co-location 패턴 적용

## 🔐 보안 고려사항

현재 RLS가 비활성화 상태 (`20250125000001_disable_rls_temp.sql`)
- 개발 환경에서는 비활성화
- 프로덕션 배포 시 RLS 정책 적용 필요

## 📝 완료된 작업 체크리스트 ✅

### 데이터베이스 및 백엔드
- [x] products 테이블 구조 확인 ✅
- [x] Supabase helper 함수 작성 ✅
- [x] API 엔드포인트 구현 ✅
- [x] 샘플 데이터 seed 스크립트 작성 ✅
- [x] 데이터베이스에 기존 데이터 확인 ✅

### 프론트엔드 통합
- [x] 컴포넌트 구조화 (Next.js 15 co-location) ✅
- [x] products/page.tsx를 서버 컴포넌트로 변경 ✅
- [x] DB에서 실제 데이터 fetching 구현 ✅
- [x] ProductCard 컴포넌트 DB 구조 대응 ✅
- [x] ProductGrid 컴포넌트 업데이트 ✅
- [x] ProductsClientWrapper 생성 (클라이언트 상호작용) ✅
- [x] 하드코딩 의존성 제거 ✅

### 향후 작업 (선택 사항)
- [ ] TypeScript 타입 자동 생성 (`npx supabase gen types` - 인증 필요)
- [ ] lib/products-data.ts 파일 삭제 (참조 없음 확인 후)

### 관리자 기능 (선택)
- [ ] /admin/products 제품 관리 페이지
- [ ] 제품 CRUD API
- [ ] 할인 정책 관리

## 🔮 향후 확장 계획

### Phase 1 (현재)
- 기본 제품 관리 시스템
- 카테고리 필터링
- 제품 상세 페이지

### Phase 2 (1개월 후)
- 제품 리뷰 시스템
- 제품 추천 알고리즘
- 번들 상품 지원
- 할인 쿠폰 시스템

### Phase 3 (3개월 후)
- AI 기반 제품 추천
- 사용량 기반 가격 책정
- A/B 테스팅 플랫폼
- 제품 비교 기능

### Phase 4 (6개월 후)
- 다국어 지원
- 글로벌 결제 통합
- 파트너 제품 마켓플레이스
- API 상품화

## 🤝 팀 협업 가이드

### 개발자
- 마이그레이션 작성 시 반드시 롤백 스크립트 포함
- API 변경 시 OpenAPI 스펙 업데이트
- 타입 안정성 유지 (strict mode)

### 디자이너
- 제품 이미지 가이드라인 준수
- 반응형 디자인 검증
- 접근성 표준 준수

### 마케팅
- 제품 설명 SEO 최적화
- 키워드 연구 및 적용
- A/B 테스트 요청

### 운영
- 제품 재고 관리
- 가격 정책 업데이트
- 고객 피드백 수집

## 📚 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Next.js 13+ App Router](https://nextjs.org/docs/app)
- [PostgreSQL JSON 타입 활용](https://www.postgresql.org/docs/current/datatype-json.html)
- [Row Level Security 베스트 프랙티스](https://supabase.com/docs/guides/auth/row-level-security)
