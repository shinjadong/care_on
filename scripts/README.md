# 문서 포맷팅 스크립트

## 개요
care_on 핵심 도메인 모듈 구현 명세서의 가독성을 개선하기 위한 Python 스크립트입니다.

## 스크립트

### 1. format_spec_doc.py
기본 마크다운 포맷팅을 수행합니다.

**기능:**
- 헤딩 계층 구조화
- 불필요한 공백 제거 (최대 2줄로 제한)
- 코드 블록 전후 빈 줄 보장
- 리스트 포맷팅 정리
- 긴 줄 자동 개행 (120자 기준)

**사용법:**
```bash
python3 scripts/format_spec_doc.py [입력파일] [출력파일]
```

**예시:**
```bash
python3 scripts/format_spec_doc.py "docs/문서.md" "docs/문서_formatted.md"
```

### 2. enhance_spec_doc.py
고급 마크다운 개선을 수행합니다.

**기능:**
- 목차 자동 생성 (GitHub 스타일 앵커)
- 주요 섹션 사이 구분선 추가
- 코드 블록에 언어 명시 추가 (prisma, json, typescript 등)
- 중요 키워드 볼드 처리 (tRPC, Prisma, Supabase 등)
- 파일 경로 코드 강조

**사용법:**
```bash
python3 scripts/enhance_spec_doc.py [입력파일] [출력파일]
```

**예시:**
```bash
python3 scripts/enhance_spec_doc.py "docs/문서_formatted.md" "docs/문서_enhanced.md"
```

## 워크플로우

일반적인 사용 순서:

```bash
# 1. 기본 포맷팅
python3 scripts/format_spec_doc.py "docs/원본.md" "docs/원본_formatted.md"

# 2. 고급 개선
python3 scripts/enhance_spec_doc.py "docs/원본_formatted.md" "docs/원본_final.md"

# 3. 원본 교체 (선택)
mv "docs/원본.md" "docs/원본.md.backup"
mv "docs/원본_final.md" "docs/원본.md"
```

## 결과

- **원본**: 2830줄
- **포맷팅 후**: 2690줄 (-140줄, 불필요한 공백 제거)
- **최종**: 2779줄 (목차 및 구분선 추가)

## 주의사항

- 백업 파일(`.backup`)은 자동으로 생성됩니다
- UTF-8 인코딩을 사용합니다
- Python 3.6+ 필요
- 외부 의존성 없음 (표준 라이브러리만 사용)
