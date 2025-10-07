# CareOn Contracts System: Improvement Analysis Report

## 1\. 계약 정보 관리 페이지 필드 누락 및 구조 이슈

현재 **contracts 테이블**에는 기본적인 고객/사업자 정보와 서비스 요금, 계약 조건 등이 정의되어 있습니다[\[1\]](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-contracts-table-final.sql#L34-L42). 그러나 실무 관점에서 몇 가지 **누락된 필드와 관리 어려운 구조**가 발견됩니다:

* **추가 서비스 필드 부재:** POS 단말기, TV, 보험 등 추가 서비스 여부 및 요금 필드가 최신 스키마에서 제외되었습니다[\[2\]](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-user-contract-system.sql#L48-L56). 초기 설계에는 pos\_needed, tv\_needed, insurance\_needed 등의 필드가 존재했지만[\[3\]](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-contracts-table-final.sql#L38-L44), 현재는 해당 서비스에 대한 정보를 명시적으로 입력할 곳이 없습니다. 이로 인해 **POS나 TV 제공 여부를 기록하기 어렵고**, 추후 이들 서비스에 대한 **요금 청구나 관리에 누락**이 생길 수 있습니다.

* **환불/해지 관련 필드 부족:** **1년 내 폐업 시 전액 환급 보장** 정책을 시행할 계획이지만, 현행 contracts 구조에는 **해지 일자, 해지 사유, 환불 금액** 등의 항목이 없습니다. 계약 상태(status)에 'cancelled'나 'terminated'가 정의되어 있지만[\[4\]](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-user-contract-system.sql#L78-L86), *“폐업으로 인한 해지”*인지 구분하기 어렵고, 환불 처리 여부를 기록할 전용 필드도 없습니다. 이로 인해 **환급 보장 프로세스 추적**이 어려워질 수 있습니다.

* **포트폴리오 및 무료 체험단 식별:** 초기에 **무료 체험단을 통해 포트폴리오(실제 성공 사례)**를 확보하는 전략을 사용했습니다. 그러나 contracts에는 **해당 계약이 무료 체험단(포트폴리오용)인지 표시하는 필드**가 없습니다. 예를 들어 **is\_trial**(무료 체험 여부)이나 **promo\_code** 같은 구분값이 없다면, 이후 포트폴리오 사례를 추려내거나 관리하는 데 불편이 예상됩니다.

* **기타 상세 정보 누락:** 신청 단계에서 수집하는 업종 분류, 창업 시기, 기존 가입 서비스, 희망 설치일 등 정보[\[5\]](https://github.com/shinjadong/admin-careon/blob/681ee9d583cf9f4fad8f1302f2a2fbe17e36e33c/docs/api-careon_apllication.md#L16-L24)가 계약으로 이어질 때 사라집니다. 현재 contracts에 **업종(business\_type)**이나 **희망 설치일(open\_date)** 필드가 없어, **현장 설치 일정 조율**이나 **고객 업종별 분석** 등에 활용하기 어렵습니다. 이 밖에 **해지 시 정산 메모**나 **환불계좌 정보** 등의 필드도 추가 고려가 필요합니다.

以上 누락된 항목들은 계약 관리 페이지에서 **담당자가 수작업으로 메모하거나 별도 관리**해야 하는 부분으로, **시스템에 직접 필드로 존재하지 않아 실수나 누락**이 발생할 우려가 있습니다.

## 2\. contracts와 관련 테이블 간 데이터 연결 및 조인 방안

데이터 일관성과 실무 효율성을 높이기 위해 **contracts**를 중심으로 **careon\_applications, quick\_applications, customer\_sessions** 등과 효과적으로 연결해야 합니다. 다음은 최적의 매칭/조인 방안입니다:

* **고객 테이블(customers)과의 연결:** contracts에는 customer\_id가 외래키로 포함되어 있어 각 계약이 어떤 고객에 속하는지 가리킵니다[\[6\]](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-user-contract-system.sql#L33-L41). **고객 기본 정보를 별도 customers 테이블**로 분리하고, 계약은 해당 고객의 참조를 갖는 구조입니다. 따라서 **contracts.customer\_id ↔ customers.id** 조인을 통해 고객 이름, 연락처 등의 기본 정보를 일관성 있게 참조할 수 있습니다. 또한 customers에 **고객번호(customer\_number)**를 생성·저장하여 계약에서도 동일 번호를 보관하므로, 고객 식별을 위한 참조키로 활용됩니다.

* **신청 테이블(careon/quick\_applications)과의 연계:** **careon\_applications**와 **quick\_applications**는 초기 신청서 정보(무료체험 신청, 간편 신청)를 담고 있으나 계약과 직접적인 외래키 관계는 없습니다. 대신 **전화번호/이름을 통한 매칭**으로 연계합니다. 예를 들어 신청 레코드의 phone\_number와 customers의 phone을 대조하여, **동일 번호일 경우 해당 신청을 그 고객의 신규 계약으로 전환**합니다. 신규 신청 발생 시 자동으로 **일치하는 고객을 찾거나(customers.phone) 없으면 생성**, 그리고 계약 레코드를 생성하여 연결하는 프로세스를 제안합니다. 이렇게 하면 신청 단계에서 받은 상세 주소, 업종, 희망설치일 등을 계약 작성시에 **미리 채워 넣어 실수 없이 반영**할 수 있습니다.

* **customer\_sessions와의 연결:** customer\_sessions 테이블은 고객의 로그인 세션(인증 토큰 등)을 관리합니다. 고객이 **자신의 계약 진행 상황을 조회**하거나 정보수정을 위해 로그인하는 기능이 있다면, customer\_sessions.customer\_id ↔ customers.id 조인을 통해 **본인 계약만 조회**하도록 권한을 제어합니다[\[7\]](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-user-contract-system.sql#L92-L100)[\[8\]](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-user-contract-system.sql#L126-L133). 이는 내부 운영보다는 **사용자용 연결**이지만, **세션 유효성 검증을 통해 고객이 자신의 계약에만 접근**하도록 해 데이터 보안을 유지할 수 있습니다.

* **매칭 키 선정:** 위 연결에서 주요 키는 **전화번호**와 **고객ID**입니다. **전화번호는 모든 신청 및 고객 데이터에 존재하는 공통 식별자**이므로, 이를 활용해 흩어진 신청 정보와 고객/계약 정보를 연결합니다. 다만 전화번호 변경 시 연쇄 업데이트 문제가 있으므로, **초기 매칭 후에는 customer\_id와 같은 불변키 기반으로 참조**하는 것이 좋습니다. 즉, **신청 → 고객 생성** 단계 이후에는 contracts가 **고객ID**만 참조하고, 신청 레코드는 아카이브 용도로 남겨두는 식입니다.

* **데이터 일관성 확보:** customers 테이블에 있는 정보(예: 상호명, 대표자명 등)를 contracts에도 **이중 저장한 이유**는 계약 시점의 정보 스냅샷을 보존하기 위함입니다. 예를 들어 한 고객이 여러 사업장 계약을 맺거나 정보가 변동되어도 기존 계약서의 기록은 유지해야 하므로, **참조 \+ 복사 전략**을 사용한 것입니다. 이러한 구조를 유지하되, **계약 생성 시 고객 정보 필드를 자동 채움**하고 이후 **고객 정보 변경이 계약에 영향주지 않도록** 분리 관리합니다.

## 3\. 현장 실무 문제점 반영한 개선 포인트

회의록 및 통화 기록에서 나타난 **현장 실무자의 고충과 입력 실수 사례**를 검토하여, 아래와 같은 개선 방안을 도출했습니다:

* **다중 계약서 작성 부담 완화:** 통화 내용에 따르면 **한 고객에게 여러 개의 계약서**를 작성하게 되는 현 상황에 우려가 있습니다. 예를 들어 인터넷, CCTV, 카드단말기 등 각각 별도 계약서를 쓰면 **고객은 이것이 사기인가 의심**할 수 있다는 지적이 있었습니다. 이를 개선하기 위해 **“원스톱 계약”** 개념을 도입합니다. 한 번의 입력으로 **통합 계약서**를 생성하고, 내부적으로는 통신사나 카드사 별 **서브 계약 데이터를 자동 준비**하는 방식입니다. 즉, **UI 상에서는 하나의 계약 절차**로 보이되 백엔드에서 필요한 경우 **별도 계약서 양식을 병합 출력**하거나 **참조 링크**를 제공하는 것입니다. 이렇게 하면 담당자가 **여러 양식을 직접 작성하는 번거로움**을 줄이고, 고객에게도 “한 곳과 계약했다”는 **일관된 인상**을 줄 수 있습니다.

* **입력 실수 방지 장치:** **“실수 안 할 수 있게 적을까?”**라는 언급에서 알 수 있듯, 담당자는 수기로 계약서를 작성하거나 여러 시스템을 오가며 입력할 때 실수가 발생할까 우려합니다. 이를 방지하기 위해 **필드 자동화와 검증**을 강화합니다. 예를 들어 **신청 단계 정보 자동 불러오기**, **필수 입력 누락 시 검출**, **전화번호·계좌번호 포맷 자동화**, **중복 데이터 알림** 등을 UI에서 구현합니다. 또한 한 계약을 **동일 직원이 처음부터 끝까지 책임 입력**하도록 워크플로우를 정의하고, 변경 이력과 최종 확인 절차(예: 상신 후 승인)를 추가해 **사람 오류를 이중으로 체크**합니다. 이러한 UX 개선으로 담당자가 안심하고 작업할 수 있도록 합니다.

* **환불/환급 프로세스 명시화:** 1년 내 폐업 시 요금 전액 환급이라는 **파격적인 보증 정책**을 시행하는 만큼, **환급 절차를 시스템화**해야 합니다. 계약서 상에 해당 조항을 명시하고, contracts 테이블에 **refund\_eligible(환급대상 여부)**와 **refund\_processed(환급 처리상태)**, **refund\_amount** 필드를 추가합니다. 예를 들어 계약 시작일로부터 1년 이내 status가 'terminated'로 변경되면 시스템이 **환급 대상임을 플래그로 표시**하고, 담당자는 환급 처리 후 refund\_processed에 날짜와 금액을 기입합니다. 이렇게 하면 나중에 **환급 사례를 검색**하거나 **정산**할 때 정확한 데이터를 얻을 수 있습니다.

* **포트폴리오 및 후기 관리:** 초기 무료 체험단 고객들의 **성과와 후기**는 향후 마케팅에 중요 자산이 됩니다. 따라서 계약 레코드와 연계하여 **포트폴리오 관리 기능**을 제안합니다. 예를 들어 **contracts 테이블에 is\_portfolio 플래그**를 두어 해당 계약을 포트폴리오 용도로 지정합니다. 또한 **후기 내용과 만족도 평점** 등을 저장하는 별도의 테이블(예: contract\_testimonials)을 만들어 contracts와 1:1로 연결할 수 있습니다. 이를 통해 담당자는 **포트폴리오 대상 계약을 손쉽게 필터링**하고, 각 계약의 후기/사례를 한 눈에 볼 수 있습니다. 추후 마케팅 자료 준비 시에도 DB에서 해당 내용을 바로 추출할 수 있어 효율적입니다.

* **실무자 중심의 UX:** 전반적으로 **담당자들이 자주 사용하는 기능을 한 화면에서 접근**할 수 있도록 UI를 재구성해야 합니다. 예를 들어 **신규 신청 현황판**을 두어 careon/quick 신청건을 실시간으로 보여주고, 각 신청을 클릭 시 계약 생성 화면으로 이동하여 **사전 입력된 계약서 양식**이 뜨도록 합니다. 계약 생성/편집 화면에서는 **고객정보, 서비스요금, 첨부서류, 특별조건** 섹션을 **탭**이나 **아코디언**으로 구분해 한 페이지에서 스크롤로 모두 확인 가능하게 합니다. 또한 **상태별 필터**(예: *대기중*, *견적발송*, *활성*, *해지됨* 등)와 **검색 기능**을 제공하여, 담당자가 많은 계약 건을 효율적으로 찾아볼 수 있게 합니다. 마지막으로 **중요 알림(예: 누락 서류, 임박한 설치일)** 등을 대시보드에 표시하여 **작업 우선순위**를 쉽게 파악하도록 개선합니다.

## 4\. AI 이미지 인식 기반 자동 입력 및 저장 전략

계약 과정에서 수집하는 **신분증, 사업자등록증, 통장 사본** 이미지를 활용하여 **필드를 자동 추출**하고자 합니다. 이를 위한 AI OCR(광학 문자 인식) 및 테이블 연계 전략은 다음과 같습니다:

* **OCR 엔진 활용:** 업로드된 이미지에 대해 서버 측에서 **OCR 엔진**을 실행하여 텍스트를 추출합니다. 예를 들어 **Tesseract OCR** 또는 구글 Vision API 등을 이용해 **신분증의 이름·주민번호**, **사업자등록증의 상호·사업자번호·대표자명·주소**, **통장 사본의 은행명·계좌번호·예금주** 등을 식별합니다. 추출한 텍스트는 **정규식 패턴 매칭**을 통해 필요한 항목으로 정제합니다 (예: 사업자번호 형태 검증, 계좌번호 숫자만 추출 등).

* **자동 필드 입력:** OCR 결과를 해당 계약 레코드의 필드에 미리 채워넣습니다. 예를 들어 사업자등록증 이미지에서 **“㈜케어온 123-45-67890 대표 홍길동”** 등의 정보를 읽었다면, **contracts 테이블의 business\_name, business\_registration, owner\_name 필드에 자동 입력**합니다. 통장 사본 OCR로 얻은 은행명, 계좌번호도 **bank\_name, account\_number, account\_holder 필드에 자동 반영**합니다. 이렇게 하면 담당자가 **일일이 타이핑하지 않아도 되므로 입력 실수를 줄이고** 업무 속도를 높일 수 있습니다.

* **검증 및 편집:** 자동 입력된 내용은 **UI 상에서 하이라이트**되어 담당자가 원본 이미지와 비교 검증할 수 있게 합니다. OCR 특성상 인식 오류 가능성이 있으므로, **담당자가 수정 가능하도록 필드를 열어두되** 기본값으로 인식 결과를 제공하는 방식입니다. 특히 한글과 숫자가 섞인 사업자번호 등은 인식 오류 시 잘못된 값이 치명적일 수 있으므로, **두 번 확인 절차**를 안내합니다 (예: “OCR 결과를 검토하세요” 메시지).

* **저장 구조 – 별도 미디어 테이블:** 현재는 contracts 테이블에 **첨부 이미지 URL 경로**를 직접 저장하고 있습니다[\[9\]](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-contracts-table-final.sql#L22-L26). 그러나 확장성과 관리 측면에서 **별도 파일 관리 테이블** 도입을 권장합니다. 예를 들어 contract\_documents 테이블을 만들어 contract\_id 외래키로 연계하고, 문서 타입과 URL을 저장합니다. 각 계약당 세 종류의 이미지를 저장하며, 구조는 다음과 같습니다:

  * contract\_documents: id (PK), contract\_id (FK, contracts), doc\_type (예: 'id\_card', 'business\_reg', 'bank\_book'), file\_url, ocr\_text (추출된 전체 텍스트 저장 필드), created\_at 등.

  * **조인:** 계약 상세 화면에서 contracts.id \= contract\_documents.contract\_id로 조인하여 해당 계약의 모든 서류를 가져옵니다. doc\_type별로 분류하여 **이미지 미리보기**와 OCR 추출 내용을 함께 표시합니다.

* **스토리지 연계:** Supabase Storage나 S3 등의 스토리지에 이미지를 저장하고 **파일 경로만 DB에 저장**하는 구조를 유지합니다. 다만 파일명이 contract\_id와 매핑되도록 네이밍 규칙을 정해 관리하면 추후 식별이 용이합니다. 예를 들어 ID\_{contract\_number}.png, BR\_{contract\_number}.png 형식으로 저장하고, DB에는 해당 경로를 기록합니다. 이렇게 하면 **스토리지 내 파일들을 계약별로 그룹화**하여 관리할 수 있습니다.

* **보안 및 개인정보 보호:** OCR을 통해 얻은 **주민등록번호, 계좌번호 등 민감정보는 평문 저장을 지양**합니다. 가능한 한 마스킹 처리(예: 주민번호 뒷자리 마스킹) 후 저장하거나, **일회성 활용 후 DB에는 해시**나 일부정보만 저장합니다. 또한 이미지 원본에 대한 접근 권한도 **관리자만 조회**가능하도록 세분화합니다. 이를 위해 **media 테이블에 접근 정책(Row-Level Security)**을 적용하고, 프론트엔드 요청 시 인증된 토큰을 요구하여 **URL이 유출되어도 타인이 열람할 수 없게** 대비합니다.

## 5\. 개선사항 요약 및 테이블 구조 개요

마지막으로, 위에서 논의한 개선점을 표와 도식으로 요약합니다:

**주요 개선사항 요약표:**

| 개선 영역 | 개선 내용 (요약) |
| :---- | :---- |
| **필드 추가 및 수정** | POS/TV/보험 서비스 관련 필드 복원, 해지·환불 필드 추가 (해지일, 사유, 환불액 등), 무료체험 여부 필드 추가, 신청서 정보(업종, 희망일 등) 필드 반영 |
| **데이터 연계 구조** | customers-contracts 연결 통한 고객정보 일관화, 신청서 ↔ 계약 매핑 자동화(전화번호 기준), 계약-첨부서류 분리저장, 세션을 통한 고객별 권한 제어 |
| **UI/UX 개선** | 원스톱 계약 작성 프로세스, 자동 입력 및 유효성검사 강화, 대시보드에 상태별 필터와 알림, 여러 계약서 작성시 사용자 안내 보완 |
| **AI/OCR 자동화** | 이미지 OCR로 주요 필드 자동 입력, 결과 편집 검증 UI 제공, 추출텍스트 및 파일 별도 저장, 민감정보 마스킹 및 보안 강화 |
| **포트폴리오/후기 관리** | 포트폴리오 대상 계약 식별 플래그, 후기 저장 및 연계 테이블, 우수 사례 데이터베이스화로 마케팅 활용 지원 |

위 표의 개선사항을 뒷받침하는 **개선 후 시스템 ERD**를 도식화하면 다음과 같습니다:

erDiagram  
    customers ||--o{ contracts : "1:N 고객-계약"  
    customers ||--o{ customer\_sessions : "1:N 고객-세션"  
    contracts ||--o{ contract\_documents : "1:N 계약-첨부파일"  
    careon\_applications }o--|| customers : "신청→고객 (전화번호로 연결)"  
    quick\_applications }o--|| customers : "간편신청→고객 (전화번호로 연결)"

*(도식: 굵은 실선은 테이블 간 외래키 관계를, 점선은 데이터 매칭을 나타냅니다.)* 각 요소를 설명하면: **한 명의 고객(customers)**이 여러 **계약(contracts)**을 맺을 수 있고, 각 계약에는 여러 **첨부 서류(contract\_documents)**가 연결됩니다. 고객은 여러 **로그인 세션(customer\_sessions)**을 가질 수 있습니다. **careon\_applications와 quick\_applications**는 각각 **초기 신청서**로, 직접 FK 연결은 없지만 **전화번호 등의 정보로 고객 및 계약과 연관**됩니다. 이와 같이 데이터베이스를 구조화함으로써 **계약 관리의 일관성, 정확성, 확장성**을 높일 수 있습니다.

**참고 자료:** 스키마 및 정책 정의[\[6\]](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-user-contract-system.sql#L33-L41)[\[10\]](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-user-contract-system.sql#L126-L134), 회의 전략 노트, 통화 로그 발췌, 등.

---

[\[1\]](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-contracts-table-final.sql#L34-L42) [\[3\]](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-contracts-table-final.sql#L38-L44) [\[9\]](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-contracts-table-final.sql#L22-L26) GitHub

[https://github.com/shinjadong/care\_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-contracts-table-final.sql](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-contracts-table-final.sql)

[\[2\]](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-user-contract-system.sql#L48-L56) [\[4\]](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-user-contract-system.sql#L78-L86) [\[6\]](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-user-contract-system.sql#L33-L41) [\[7\]](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-user-contract-system.sql#L92-L100) [\[8\]](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-user-contract-system.sql#L126-L133) [\[10\]](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-user-contract-system.sql#L126-L134) GitHub

[https://github.com/shinjadong/care\_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-user-contract-system.sql](https://github.com/shinjadong/care_on/blob/6139f882165f42c62333d89ffa486ad24c75a601/scripts/create-user-contract-system.sql)

[\[5\]](https://github.com/shinjadong/admin-careon/blob/681ee9d583cf9f4fad8f1302f2a2fbe17e36e33c/docs/api-careon_apllication.md#L16-L24) GitHub

[https://github.com/shinjadong/admin-careon/blob/681ee9d583cf9f4fad8f1302f2a2fbe17e36e33c/docs/api-careon\_apllication.md](https://github.com/shinjadong/admin-careon/blob/681ee9d583cf9f4fad8f1302f2a2fbe17e36e33c/docs/api-careon_apllication.md)
