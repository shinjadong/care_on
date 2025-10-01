# 🚨 CODEX 긴급 수정 요청: Enrollment useEffect 에러

**작성일**: 2025-10-02
**우선순위**: 🔴 긴급
**담당**: Codex (Cursor AI)
**연관 작업**: Claude Code - Careon UI 통일 작업

---

## 📋 문제 요약

**페이지**: `/enrollment`
**에러 타입**: React Hook 규칙 위반
**상태**: 페이지 로드 시 콘솔 에러 발생

### 에러 메시지
```javascript
Console Error:
useEffect must not return anything besides a function,
which is used for clean-up. You returned: [object Object]
```

---

## 🔍 에러 상세

### React 규칙
```javascript
// ❌ 잘못된 패턴
useEffect(() => {
  return someObject  // 객체를 리턴하면 에러!
}, [])

// ❌ 잘못된 패턴 2
useEffect(async () => {  // async는 Promise 객체를 리턴
  await fetchData()
}, [])

// ✅ 올바른 패턴
useEffect(() => {
  return () => {  // cleanup 함수만 리턴 가능
    // cleanup logic
  }
}, [])
```

---

## 📁 조사 범위

### 이미 확인된 파일 (✅ 정상)
- `app/enrollment/layout.tsx` - useEffect 정상
- `app/enrollment/page.tsx` - 조사 필요

### 조사 필요 파일
```bash
components/enrollment/step-*.tsx  (19개 파일)
- step-0-agreements.tsx
- step-1-owner-info.tsx
- step-1.5-card-agreements-v2.tsx
- step-2-contact-business.tsx
- step-3-store-info.tsx
- step-4-application-type.tsx
- step-4.5-delivery-app.tsx
- step-5-business-type.tsx
- step-6-ownership-type.tsx
- step-7-license-type.tsx
- step-8-business-category.tsx
- step-8.7-sales-info.tsx
- step-8.3-internet-cctv-check.tsx
- step-8.5-free-service.tsx
- step-9.3-settlement-info.tsx
- step-9.5-first-completion.tsx
- step-10-document-upload.tsx
- step-11-final-confirmation.tsx
- step-12-success.tsx
```

---

## 🎯 수정 목표

### 1단계: 에러 원인 파일 특정
```bash
# 방법 1: 브라우저 DevTools 사용
1. http://localhost:3000/enrollment 접속
2. F12 → Console 탭
3. 에러 메시지 클릭하여 스택 트레이스 확인
4. 파일명과 라인 번호 확인

# 방법 2: 코드 검색
grep -r "useEffect.*async" components/enrollment/
grep -r "useEffect" components/enrollment/ | grep -v "return ()"
```

### 2단계: 코드 수정
```javascript
// 패턴 1: async/await 사용 시
// Before
useEffect(async () => {
  const data = await fetchData()
  setData(data)
}, [])

// After
useEffect(() => {
  const loadData = async () => {
    const data = await fetchData()
    setData(data)
  }
  loadData()
}, [])

// 패턴 2: 잘못된 리턴값
// Before
useEffect(() => {
  const subscription = subscribe()
  return subscription  // 객체 리턴 (에러!)
}, [])

// After
useEffect(() => {
  const subscription = subscribe()
  return () => {  // cleanup 함수로 감싸기
    subscription.unsubscribe()
  }
}, [])
```

### 3단계: 검증
```bash
# 1. 브라우저에서 확인
http://localhost:3000/enrollment
→ 콘솔 에러 없어야 함

# 2. 전체 스텝 테스트
스텝 0 → 스텝 1 → ... → 스텝 12
→ 모든 스텝에서 에러 없어야 함
```

---

## ⚠️ 주의사항

### 수정 금지 사항
- ❌ **Careon UI 관련 코드 변경 금지**
  - CareonButton, CareonInput은 건드리지 말 것
  - className에서 Careon 관련 스타일 유지
  - 색상 코드 (#009da2, #fbfbfb) 변경 금지

### 수정 허용 사항
- ✅ useEffect 내부 로직 수정
- ✅ async/await 패턴 변경
- ✅ cleanup 함수 추가/수정
- ✅ 상태 관리 로직 개선

---

## 📊 체크리스트

### 수정 전
- [ ] 브라우저 DevTools에서 정확한 에러 위치 확인
- [ ] 에러 발생 파일 특정 (파일명 + 라인 번호)
- [ ] 해당 파일의 useEffect 패턴 분석

### 수정 중
- [ ] useEffect 리턴값이 함수인지 확인
- [ ] async useEffect 사용 시 내부 함수로 감싸기
- [ ] cleanup이 필요한 경우 올바르게 구현

### 수정 후
- [ ] 브라우저 콘솔 에러 사라졌는지 확인
- [ ] enrollment 전체 플로우 테스트 (스텝 0-12)
- [ ] 다른 useEffect에서 동일 패턴 검색 및 수정
- [ ] TypeScript 컴파일 에러 없는지 확인

---

## 📝 수정 완료 후 보고 양식

```markdown
## ✅ Enrollment useEffect 에러 수정 완료

### 문제 파일
- `components/enrollment/step-X-xxx.tsx` (라인 XX)

### 원인
- [async useEffect / 잘못된 리턴값 / 기타]

### 수정 내용
```javascript
// Before
useEffect(() => {
  // 문제 코드
}, [])

// After
useEffect(() => {
  // 수정된 코드
}, [])
```

### 테스트 결과
- ✅ 콘솔 에러 사라짐
- ✅ Enrollment 플로우 정상 작동
- ✅ TypeScript 컴파일 성공

### 추가 발견 사항
- [있다면 작성]
```

---

## 🔗 참고 자료

### React Hooks 문서
- [useEffect Rules](https://react.dev/reference/react/useEffect#my-effect-runs-after-every-re-render)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

### 프로젝트 문맥
- Careon UI 통일 작업: Claude Code 완료
- Enrollment는 이미 Careon UI 사용 중
- 이 에러는 UI 통일 작업과 무관한 기존 이슈

---

**작업 시작 전 Claude Code에게 "수정 시작합니다" 회신 부탁드립니다.**
