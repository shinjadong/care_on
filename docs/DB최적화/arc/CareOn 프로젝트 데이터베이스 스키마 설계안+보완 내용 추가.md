여기에서, 더 보완할점들이있어. - 고객의 월마다 현금을 미리 이체해줘야 하는 날짜도 필요하고 - 우리 패키지를 계약완료 후 케어중인 고객도 "담당 매니저" (직원) 이 있어야하고, 해당 고객에 대한 cs 내역들도 모두 직원 전용 페이지에서 기록 관리 수정 등등 할 수 있어야해. 어쨋든 내부 시스템을 대폭 강화할 필요가 있어

###### ChatGPT의 말:

GPT-5 Pro 요청

Reasoned for 8m 23s

자동님, 요청하신 3가지(①월 이체일, ②담당 매니저, ③CS 기록관리) 반영용 **바로 적용 가능한 DDL**입니다.

> Supabase(Postgres) 기준, 모두 **idempotent**하게 작성했습니다.

---

## 1) 청구/송금 일정(“매달 미리 이체해야 하는 날짜”)

`-- 계약: 청구/송금 주기 정보 ALTER TABLE public.contracts   ADD COLUMN IF NOT EXISTS billing_day SMALLINT CHECK (billing_day BETWEEN 1 AND 31) DEFAULT 1,         -- 고객 청구일(매월)   ADD COLUMN IF NOT EXISTS remittance_day SMALLINT CHECK (remittance_day BETWEEN 1 AND 31),              -- 당사가 선(先)송금할 날짜(매월)   ADD COLUMN IF NOT EXISTS next_billing_at timestamptz,   ADD COLUMN IF NOT EXISTS next_remittance_at timestamptz;  CREATE INDEX IF NOT EXISTS idx_contracts_next_billing_at    ON public.contracts(next_billing_at); CREATE INDEX IF NOT EXISTS idx_contracts_next_remittance_at ON public.contracts(next_remittance_at);  -- 매월 청구서 CREATE TABLE IF NOT EXISTS public.invoices (   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),   contract_id uuid NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,   billing_period_start date NOT NULL,   billing_period_end   date NOT NULL,   issue_date           date NOT NULL DEFAULT CURRENT_DATE,   due_date             date NOT NULL,                                  -- 납기(=billing_day 기준 산출)   amount               integer NOT NULL CHECK (amount >= 0),           -- KRW   status               varchar NOT NULL CHECK (status IN ('pending','paid','overdue','void')),   paid_at              timestamptz,   memo                 text,   created_at           timestamptz DEFAULT now(),   updated_at           timestamptz DEFAULT now() ); CREATE INDEX IF NOT EXISTS idx_invoices_contract_id ON public.invoices(contract_id); CREATE INDEX IF NOT EXISTS idx_invoices_due_date    ON public.invoices(due_date);  -- 매월 선(先)송금/정산(벤더/고객/기타로 확장 가능) CREATE TABLE IF NOT EXISTS public.remittances (   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),   contract_id uuid NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,   counterparty_type varchar NOT NULL CHECK (counterparty_type IN ('vendor','customer','other')),   counterparty_name text,   bank_name         varchar,   account_number    varchar,   account_holder    varchar,   scheduled_for     date NOT NULL,                                     -- remittance_day 기준 산출   amount            integer NOT NULL CHECK (amount >= 0),              -- KRW   status            varchar NOT NULL CHECK (status IN ('scheduled','processing','sent','failed','canceled')),   sent_at           timestamptz,   memo              text,   created_at        timestamptz DEFAULT now(),   updated_at        timestamptz DEFAULT now() ); CREATE INDEX IF NOT EXISTS idx_remit_contract_id ON public.remittances(contract_id); CREATE INDEX IF NOT EXISTS idx_remit_scheduled   ON public.remittances(scheduled_for);`

> 운영 팁: `billing_day/remittance_day`를 기준으로 **Edge Function/pg_cron**으로 `invoices`/`remittances`를 매월 생성·롤포워드하세요. 실패/미납은 `status`만 갱신.

---

## 2) “케어중” 고객의 **담당 매니저**

> 고객 단위로 **상시 케어** 담당자를 두고, 필요 시 계약 단위로 오버라이드도 가능하게 설계.

`-- 고객(이전 설계대로 생성되어 있다면 ALTER만 적용) CREATE TABLE IF NOT EXISTS public.customers (   customer_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),   customer_code varchar(20) UNIQUE DEFAULT generate_customer_number(),  -- 기존 함수 재사용   business_name varchar(200) NOT NULL,   owner_name    varchar(100) NOT NULL,   business_registration varchar(20),   phone varchar(20), email varchar(255), address text, industry varchar(100),   status varchar(20) DEFAULT 'active',   -- ▼ 케어 관련   account_manager_employee_id bigint REFERENCES public.employees(id),   -- 고객 담당 매니저   care_status varchar(20) DEFAULT 'active' CHECK (care_status IN ('onboarding','active','paused','offboarded')),   care_started_at timestamptz DEFAULT now(),   created_at timestamptz DEFAULT now(),   updated_at timestamptz DEFAULT now() );  -- 계약 단위로 별도 지정이 필요하면(옵션) ALTER TABLE public.contracts   ADD COLUMN IF NOT EXISTS account_manager_employee_id bigint REFERENCES public.employees(id);  CREATE INDEX IF NOT EXISTS idx_customers_account_manager ON public.customers(account_manager_employee_id); CREATE INDEX IF NOT EXISTS idx_contracts_account_manager ON public.contracts(account_manager_employee_id);`

---

## 3) **CS(고객 지원) 티켓 & 활동 로그** — 직원 전용 관리

`-- CS 티켓(요청/이슈 단위) CREATE TABLE IF NOT EXISTS public.cs_tickets (   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),   customer_id uuid NOT NULL REFERENCES public.customers(customer_id) ON DELETE CASCADE,   contract_id uuid REFERENCES public.contracts(id) ON DELETE SET NULL,   subject text NOT NULL,   category varchar NOT NULL CHECK (category IN ('install','billing','technical','refund','change_request','other')),   priority varchar NOT NULL CHECK (priority IN ('low','normal','high','urgent')) DEFAULT 'normal',   status varchar NOT NULL CHECK (status IN ('open','in_progress','pending_customer','on_hold','resolved','closed')) DEFAULT 'open',   channel varchar CHECK (channel IN ('phone','email','kakao','web','in_person')),   assigned_employee_id bigint REFERENCES public.employees(id),          -- 담당자 배정   due_at date,   resolved_at timestamptz,   last_activity_at timestamptz,   created_at timestamptz DEFAULT now(),   updated_at timestamptz DEFAULT now() ); CREATE INDEX IF NOT EXISTS idx_cstickets_customer   ON public.cs_tickets(customer_id); CREATE INDEX IF NOT EXISTS idx_cstickets_contract   ON public.cs_tickets(contract_id); CREATE INDEX IF NOT EXISTS idx_cstickets_assignee   ON public.cs_tickets(assigned_employee_id); CREATE INDEX IF NOT EXISTS idx_cstickets_status_pri ON public.cs_tickets(status, priority);  -- CS 활동 로그(타임라인 댓글/메모/내부 공유) CREATE TABLE IF NOT EXISTS public.cs_comments (   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),   ticket_id uuid NOT NULL REFERENCES public.cs_tickets(id) ON DELETE CASCADE,   author_employee_id bigint REFERENCES public.employees(id),   body text NOT NULL,   visibility varchar NOT NULL CHECK (visibility IN ('internal','public')) DEFAULT 'internal',   created_at timestamptz DEFAULT now(),   updated_at timestamptz DEFAULT now() ); CREATE INDEX IF NOT EXISTS idx_cscomments_ticket ON public.cs_comments(ticket_id);`

---

## 4) `/manage` 반영(요점)

- **Billing/정산보드**: `next_billing_at`, `next_remittance_at`, `invoices.status`, `remittances.status` 기준 **이번 주/이번 달 캘린더·테이블**.
    
- **고객 케어보드**: `customers.account_manager_employee_id`로 필터, **미해결 CS**, 최근 설치/방문 일정, 패키지 현황(계약·품목).
    
- **CS 보드**: 티켓 생성/배정/상태변경, 내부 코멘트(`visibility='internal'`)만 직원에게 노출.
    
- **알림**: 납기 3일 전, 송금 예정일 전날 **알림 큐(Edge Function + 이메일/카카오톡 비즈메시지)**.
    

---

## 5) 마이그레이션 순서(안)

1. 위 **CREATE/ALTER** 실행 →
    
2. 기존 계약에 `billing_day`/`remittance_day` 채움 →
    
3. 활성 고객에 `account_manager_employee_id` 배정 →
    
4. CS 운영 프로세스(분류·우선순위·SLA) 합의 후 `/manage/cs` 연결 →
    
5. 월 배치(Edge Function/pg_cron)로 `invoices/remittances` 생성 자동화.
    

필요 시, 위 스키마로 **패키지/상품/계약 품목**(이전 설계)의 합계로 `invoices.amount`를 산출하는 SQL/함수도 바로 붙일 수 있습니다.
