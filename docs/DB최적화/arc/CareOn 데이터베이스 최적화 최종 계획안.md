# CareOn 데이터베이스 최적화 최종 계획안

## 📋 개요

본 문서는 CareOn 프로젝트의 데이터베이스 구조를 체계적으로 개선하여 **확장 가능하고 관리 효율적인 시스템**을 구축하기 위한 종합 계획안입니다. 기존 분석 자료와 현장 실무진의 요구사항을 종합하여 **단계별 구현 전략**을 제시합니다.

### 🎯 주요 개선 목표

1. **데이터 중복 제거** - 고객정보, 상품정보 정규화를 통한 일관성 확보
2. **유연한 상품/패키지 관리** - 새로운 서비스 추가 시 DB 변경 없이 대응
3. **내부 운영 시스템 강화** - 담당자 관리, CS 기록, 청구/정산 자동화
4. **AI 기반 자동화** - OCR을 통한 서류 정보 자동 입력
5. **실무자 UX 개선** - 입력 실수 방지 및 업무 효율성 증대

---

## 🔍 현황 분석

### 기존 시스템의 한계점

| 문제점 | 현재 상황 | 개선 필요성 |
|--------|-----------|-------------|
| **고객정보 중복** | 계약마다 고객정보 재입력 | 데이터 불일치, 관리 어려움 |
| **상품 확장성 부족** | 새 서비스 추가 시 테이블 구조 변경 필요 | 개발 비용 증가, 유연성 저하 |
| **담당자 관리 미흡** | 계약 처리자 텍스트로만 기록 | 담당자별 업무 추적 어려움 |
| **CS 기록 부재** | 고객 서비스 내역 체계적 관리 없음 | 서비스 품질 관리 한계 |
| **청구/정산 수동화** | 월별 이체, 정산 수작업 | 인적 오류 가능성, 업무 부담 |
| **서류 입력 수작업** | 사업자등록증, 통장사본 정보 수기 입력 | 입력 실수, 시간 소요 |

---

## 🏗️ 새로운 데이터베이스 설계

### 1. 핵심 테이블 구조

#### 🏢 고객 테이블 (customers)
\`\`\`sql
CREATE TABLE customers (
  customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_code VARCHAR(20) UNIQUE, -- 고객번호 (CO202309100001 형태)
  business_name VARCHAR(200) NOT NULL, -- 사업장 상호
  owner_name VARCHAR(100) NOT NULL, -- 대표자명
  business_registration VARCHAR(20), -- 사업자등록번호
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  industry VARCHAR(100), -- 업종
  status VARCHAR(20) DEFAULT 'active',
  -- 케어 관리
  account_manager_employee_id BIGINT REFERENCES employees(id),
  care_status VARCHAR(20) DEFAULT 'active',
  care_started_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
\`\`\`

#### 📦 상품 테이블 (products)
\`\`\`sql
CREATE TABLE products (
  product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL, -- 상품명
  category VARCHAR(50) NOT NULL, -- 카테고리 (인터넷, CCTV, POS 등)
  provider VARCHAR(100), -- 공급사/브랜드
  monthly_fee INTEGER, -- 월 요금
  description TEXT, -- 상품 설명
  available BOOLEAN DEFAULT true, -- 판매 가능 여부
  closure_refund_rate INTEGER, -- 폐업 환급율(%)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
\`\`\`

#### 📋 패키지 테이블 (packages)
\`\`\`sql
CREATE TABLE packages (
  package_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL, -- 패키지명
  monthly_fee INTEGER, -- 패키지 월 요금
  contract_period INTEGER, -- 계약 기간(개월)
  free_period INTEGER, -- 무료 기간(개월)
  closure_refund_rate INTEGER, -- 폐업 환급율(%)
  included_services TEXT, -- 부가 서비스 설명
  description TEXT, -- 패키지 설명
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
\`\`\`

#### 🔗 패키지-상품 연결 (package_items)
\`\`\`sql
CREATE TABLE package_items (
  package_id UUID REFERENCES packages(package_id),
  product_id UUID REFERENCES products(product_id),
  quantity INTEGER NOT NULL, -- 포함 수량
  item_fee INTEGER, -- 패키지 내 할당 요금
  PRIMARY KEY (package_id, product_id)
);
\`\`\`

#### 👥 직원 테이블 (employees)
\`\`\`sql
CREATE TABLE employees (
  employee_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50), -- 역할/직책
  email VARCHAR(100),
  phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
\`\`\`

### 2. 계약 관리 강화

#### 📄 계약 테이블 보완 (contracts)
\`\`\`sql
-- 기존 contracts 테이블에 추가 필드
ALTER TABLE contracts 
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES customers(customer_id),
ADD COLUMN IF NOT EXISTS package_id UUID REFERENCES packages(package_id),
ADD COLUMN IF NOT EXISTS account_manager_employee_id BIGINT REFERENCES employees(id),
-- 환불 관련
ADD COLUMN IF NOT EXISTS refund_eligible BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS refund_processed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS refund_amount INTEGER,
-- 포트폴리오/체험단
ADD COLUMN IF NOT EXISTS is_portfolio BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_trial BOOLEAN DEFAULT false,
-- 청구 정보
ADD COLUMN IF NOT EXISTS billing_day SMALLINT CHECK (billing_day BETWEEN 1 AND 31) DEFAULT 1,
ADD COLUMN IF NOT EXISTS remittance_day SMALLINT CHECK (remittance_day BETWEEN 1 AND 31),
ADD COLUMN IF NOT EXISTS next_billing_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS next_remittance_at TIMESTAMPTZ;
\`\`\`

#### 🔗 계약-상품 연결 (contract_items)
\`\`\`sql
CREATE TABLE contract_items (
  contract_id UUID REFERENCES contracts(id),
  product_id UUID REFERENCES products(product_id),
  quantity INTEGER NOT NULL,
  fee INTEGER NOT NULL, -- 해당 상품의 계약 요금
  PRIMARY KEY (contract_id, product_id)
);
\`\`\`

### 3. 청구/정산 시스템

#### 💰 청구서 테이블 (invoices)
\`\`\`sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  status VARCHAR NOT NULL CHECK (status IN ('pending','paid','overdue','void')),
  paid_at TIMESTAMPTZ,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
\`\`\`

#### 💸 송금/정산 테이블 (remittances)
\`\`\`sql
CREATE TABLE remittances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  counterparty_type VARCHAR NOT NULL CHECK (counterparty_type IN ('vendor','customer','other')),
  counterparty_name TEXT,
  bank_name VARCHAR,
  account_number VARCHAR,
  account_holder VARCHAR,
  scheduled_for DATE NOT NULL,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  status VARCHAR NOT NULL CHECK (status IN ('scheduled','processing','sent','failed','canceled')),
  sent_at TIMESTAMPTZ,
  memo TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
\`\`\`

### 4. CS 관리 시스템

#### 🎫 CS 티켓 테이블 (cs_tickets)
\`\`\`sql
CREATE TABLE cs_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  category VARCHAR NOT NULL CHECK (category IN ('install','billing','technical','refund','change_request','other')),
  priority VARCHAR NOT NULL CHECK (priority IN ('low','normal','high','urgent')) DEFAULT 'normal',
  status VARCHAR NOT NULL CHECK (status IN ('open','in_progress','pending_customer','on_hold','resolved','closed')) DEFAULT 'open',
  channel VARCHAR CHECK (channel IN ('phone','email','kakao','web','in_person')),
  assigned_employee_id BIGINT REFERENCES employees(id),
  due_at DATE,
  resolved_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
\`\`\`

#### 💬 CS 댓글/로그 (cs_comments)
\`\`\`sql
CREATE TABLE cs_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES cs_tickets(id) ON DELETE CASCADE,
  author_employee_id BIGINT REFERENCES employees(id),
  body TEXT NOT NULL,
  visibility VARCHAR NOT NULL CHECK (visibility IN ('internal','public')) DEFAULT 'internal',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
\`\`\`

### 5. 서류 관리 시스템

#### 📎 계약 서류 (contract_documents)
\`\`\`sql
CREATE TABLE contract_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  doc_type VARCHAR(20) NOT NULL CHECK (doc_type IN ('id_card','business_reg','bank_book','other')),
  file_url TEXT NOT NULL,
  ocr_text TEXT, -- OCR 추출 텍스트
  extracted_data JSONB, -- 구조화된 추출 데이터
  verified BOOLEAN DEFAULT false, -- 검증 완료 여부
  verified_by BIGINT REFERENCES employees(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
\`\`\`

---

## 🔄 AI OCR 자동화 시스템

### OCR 처리 플로우

\`\`\`mermaid
graph TD
    A[서류 이미지 업로드] --> B[OCR 엔진 실행]
    B --> C[텍스트 추출]
    C --> D[정규식 패턴 매칭]
    D --> E[구조화된 데이터 생성]
    E --> F[DB 필드 자동 입력]
    F --> G[담당자 검증]
    G --> H[최종 승인 및 저장]
\`\`\`

### 추출 데이터 매핑

| 서류 종류 | 추출 항목 | 매핑 테이블.필드 |
|-----------|-----------|------------------|
| **사업자등록증** | 상호명, 대표자명, 사업자번호, 주소 | customers.business_name, owner_name, business_registration, address |
| **통장사본** | 은행명, 계좌번호, 예금주 | contracts.bank_name, account_number, account_holder |
| **신분증** | 이름, 생년월일 | customers.owner_name (검증용) |

### OCR 구현 방안

1. **OCR 엔진**: Tesseract OCR, Google Vision API, NAVER CLOVA OCR 활용
2. **전처리**: 이미지 품질 향상, 노이즈 제거
3. **후처리**: 정규식을 통한 데이터 검증 및 정제
4. **보안**: 민감정보 마스킹, 암호화 저장

---

## 📋 구현 단계별 계획

### Phase 1: 기본 스키마 구축 (2주)
- [ ] 고객, 상품, 패키지, 직원 테이블 생성
- [ ] 기존 contracts 테이블 필드 추가
- [ ] 연결 테이블 (package_items, contract_items) 생성

### Phase 2: 계약 관리 강화 (2주)
- [ ] 계약-고객 연결 구조 구현
- [ ] 계약서 생성 로직 개선
- [ ] 환불/해지 프로세스 시스템화

### Phase 3: 청구/정산 시스템 (3주)
- [ ] 청구서, 송금 테이블 구축
- [ ] 월별 자동 청구서 생성 로직
- [ ] 정산 프로세스 자동화

### Phase 4: CS 관리 시스템 (2주)
- [ ] CS 티켓, 댓글 시스템 구축
- [ ] 담당자 배정 및 추적 기능
- [ ] 내부 관리 페이지 개발

### Phase 5: OCR 자동화 (3주)
- [ ] OCR 엔진 통합
- [ ] 서류별 추출 로직 개발
- [ ] 검증 및 편집 UI 구현

### Phase 6: 통합 및 최적화 (2주)
- [ ] 전체 시스템 통합 테스트
- [ ] 성능 최적화
- [ ] 관리자 대시보드 완성

---

## 🎯 기대 효과

### 💪 업무 효율성 증대
- **입력 시간 80% 단축**: OCR 자동 입력으로 서류 처리 시간 대폭 감소
- **오류 감소 90%**: 자동화된 검증으로 인적 오류 최소화
- **관리 업무 간소화**: 통합 대시보드로 모든 정보 한눈에 파악

### 📈 확장성 및 유연성
- **신규 서비스 추가**: DB 구조 변경 없이 새로운 상품/패키지 추가 가능
- **고객 맞춤형 서비스**: 유연한 상품 조합으로 다양한 요구사항 대응
- **데이터 분석 기반**: 체계화된 데이터로 비즈니스 인사이트 도출

### 🔒 데이터 품질 향상
- **일관성 확보**: 정규화된 구조로 데이터 중복 및 불일치 제거
- **추적 가능성**: 모든 변경사항과 담당자 기록으로 완전한 이력 관리
- **보안 강화**: 민감정보 암호화 및 접근 권한 세분화

### 💰 비용 절감 효과
- **운영 비용 30% 절감**: 자동화를 통한 인력 비용 절약
- **개발 비용 50% 절감**: 확장 가능한 구조로 향후 기능 추가 비용 최소화
- **고객 만족도 향상**: 빠르고 정확한 서비스로 고객 이탈률 감소

---

## 🚀 마이그레이션 전략

### 1. 데이터 백업
\`\`\`sql
-- 기존 데이터 전체 백업
pg_dump careon_db > backup_$(date +%Y%m%d).sql
\`\`\`

### 2. 단계별 마이그레이션
1. **새 테이블 생성** (기존 데이터에 영향 없음)
2. **기존 데이터 이관** (contracts → customers, products 분리)
3. **외래키 관계 설정**
4. **기존 컬럼 정리** (불필요한 필드 제거)

### 3. 검증 및 롤백 계획
- 각 단계별 데이터 무결성 검증
- 문제 발생 시 즉시 롤백 가능한 체계 구축
- 병렬 운영을 통한 점진적 전환

---

## 📞 지원 및 유지보수

### 개발팀 역할 분담
- **백엔드**: 스키마 설계, API 개발, OCR 통합
- **프론트엔드**: 관리 페이지 UI/UX, 대시보드 개발
- **데이터**: 마이그레이션, 성능 최적화, 모니터링

### 운영 가이드
- **일일 점검**: 시스템 상태, 오류 로그 확인
- **주간 리포트**: 성능 지표, 사용량 분석
- **월간 백업**: 데이터 백업 및 복구 테스트

---

## 📝 결론

본 계획안을 통해 CareOn은 **현재의 운영 효율성 문제를 해결**하고, **미래 확장에 대비한 견고한 시스템**을 구축할 수 있습니다. 특히 **AI 기반 자동화**와 **체계적인 데이터 관리**를 통해 업계 선도적인 디지털 플랫폼으로 발전할 수 있을 것으로 기대됩니다.

**성공적인 구현을 위한 핵심 요소:**
1. **단계별 점진적 적용** - 리스크 최소화
2. **현장 실무진과의 긴밀한 소통** - 실용적인 기능 구현
3. **지속적인 모니터링 및 개선** - 운영 중 피드백 반영
4. **충분한 테스트와 검증** - 안정성 확보

이를 통해 CareOn이 **고객에게는 더 나은 서비스**를, **내부적으로는 더 효율적인 운영**을 제공하는 플랫폼으로 거듭날 수 있을 것입니다.

---

*본 문서는 CareOn 데이터베이스 최적화 프로젝트의 종합 계획안으로, 지속적인 업데이트와 개선을 통해 완성도를 높여나갈 예정입니다.*
