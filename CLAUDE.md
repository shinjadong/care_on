# CLAUDE.md

This file provides guidance to Claude when working with code in this repository.

## 📋 프로젝트 개요

**케어온(Care On)** - 창업자를 위한 종합 비즈니스 플랫폼
- 창업 컨설팅, CCTV 보안, 계약 관리, 고객 리뷰, POS/결제 시스템을 통합한 올인원 플랫폼
- 사업자의 95% 생존율을 달성한 검증된 창업 안전망 시스템
- 한국형 창업 생태계에 최적화된 서비스
- 카드 가맹점 신청 및 토스페이 통합 결제 솔루션 제공

## Development Commands

```bash
# Development server
npm run dev           # Start development server at http://localhost:3000

# Production build
npm run build         # Build for production (TypeScript errors ignored in next.config.mjs)
npm start            # Start production server after building

# Code quality
npm run lint         # Run Next.js linter
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript 5 (strict mode enabled, ES6 target)
- **Frontend**: React 19 with Framer Motion animations
- **Styling**: Tailwind CSS with custom glassmorphic design system
- **UI Components**:
  - ShadcnUI (Radix UI based) in `components/ui/`
  - CareOn custom UI components (`careon-*` prefix)
- **Database**: Supabase (PostgreSQL with RLS)
- **Blob Storage**: Vercel Blob Storage
- **AI Integration**: Anthropic Claude API for HTML assistance and AI-powered features
- **SMS Service**: Ppurio API for Korean SMS notifications
- **Payment**:
  - TossPay integration for payment processing
  - Support for major Korean card companies (KB, BC, Samsung, Woori, Hana)
- **Address**: Daum Postcode API for Korean address search
- **Authentication**:
  - Kakao OAuth for social login
  - Google OAuth via Supabase Auth

### Database Architecture
The application uses Supabase with service role keys for server-side operations. Two client creation patterns:
- **Browser Client**: `lib/supabase/client.ts` - Uses public anon key
- **Server Client**: `lib/supabase/server.ts` - Can use service role key for admin operations

### Authentication Flow
- Google OAuth integration with Supabase Auth
- Protected routes handled via `components/auth/protected-route.tsx`
- Auth state managed through `hooks/useAuth.tsx`
- Callback handler at `/auth/callback`

### API Structure
All API routes are in `app/api/` with key endpoints:
- `/api/ai/html-assist` - Claude AI HTML editor assistance
- `/api/admin/*` - Admin dashboard endpoints
- `/api/agreements/*` - Card company agreements and terms
- `/api/contracts/*` - Contract management
- `/api/enrollment/*` - Merchant enrollment and card application
- `/api/reviews/*` - Review system
- `/api/sms/*` - SMS notifications via Ppurio
- `/api/upload/vercel-blob` - File upload to Vercel Blob Storage

## Project Structure

```
app/
├── admin/          # Admin dashboard (protected routes)
├── api/            # API endpoints
├── enrollment/     # Merchant enrollment flow
├── landing/        # Main landing page (default redirect from /)
├── services/       # Service pages
└── layout.tsx      # Root layout with Header/Footer

components/
├── ui/             # ShadcnUI components
├── ui-backup/      # Backup of original UI components
├── auth/           # Authentication components
├── enrollment/     # Multi-step enrollment form components
├── page-builder/   # Puck page builder integration
└── [feature]/      # Feature-specific components

lib/
├── supabase/       # Supabase clients
├── ppurio/         # SMS service
├── database.types.ts # Supabase database TypeScript types
└── utils/          # Utility functions

content/
├── [카드사명]-동의서.md # Card company agreement documents

docs/
├── 00_dev_docs/    # Development documentation
├── images/         # Documentation images
└── 고객 가입 시스템(리뉴얼)/ # Enrollment system docs

scripts/
├── apply-migration.js # Database migration script
└── check-enrollment-data.js # Enrollment data validation
```

## Environment Variables

Required environment variables (see `.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for server operations
- `ANTHROPIC_API_KEY` - Claude API key for AI features
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token

## Design System

The project uses a custom glassmorphic design system (see `app/globals.css`):

### CSS Classes
- **Glass containers**: `glass-container`, `glass-container-strong`, `glass-container-soft`
- **Text styles**: `glass-text-primary`, `glass-text-secondary`, `glass-text-muted`
- **Backgrounds**: `glass-bg-primary`, `glass-bg-secondary`, `glass-bg-accent`
- **Social components**: `social-card`, `social-button`, `thread-card`

### Brand Colors
- Primary: `#148777` (CareOn teal)
- Background gradient: Teal to cyan with radial overlays

### Custom Components
CareOn UI components follow a consistent naming pattern (`careon-*`):
- `careon-button` - Styled button with hover effects
- `careon-input` - Custom input field with validation
- `careon-container` - Responsive container wrapper
- `careon-bottom-sheet` - Mobile-friendly bottom sheet
- `careon-carrier-select` - Korean carrier selection dropdown

## Key Features

### Supabase Integration
- Migrations in `supabase/migrations/`
- Edge functions in `supabase/functions/`
- RLS policies configured for security
- Database types generated in `lib/database.types.ts`

### Merchant Enrollment System
Multi-step enrollment flow for new merchants:
- Agreement acceptance (TossPay and card companies)
- Business information collection
- Document upload with Vercel Blob Storage
- Real-time validation and progress tracking
- Support for individual and corporate businesses
- Integration with Korean business categories

### Page Builder
The app includes Puck page builder integration at `/admin/pages` for visual page editing with components defined in `components/page-builder/`.

### Review System
Comprehensive review system with:
- Public reviews at `/review`
- Admin management at `/admin/reviews`
- API endpoints for CRUD operations

### Contract Management
Contract system for service agreements:
- Customer portal at `/my/contract`
- Manager view at `/manager/contract`
- Admin management at `/admin/customers`

### Payment Integration
- TossPay for payment processing
- Support for major Korean card companies
- Card merchant application workflow
- Settlement account management

## Development Notes

### Build Configuration
- TypeScript errors ignored in production builds (`ignoreBuildErrors: true`)
- ESLint errors ignored during builds (`ignoreDuringBuilds: true`)
- Image optimization configured for Supabase and Vercel storage

### Routing
- Root path `/` redirects to `/landing` (configured in `next.config.mjs`)
- Protected admin routes use middleware and client-side protection
- Public routes include landing, services, FAQ, privacy, and terms

### Performance Optimizations
- Framer Motion optimized package imports
- Image formats: AVIF and WebP with 60s cache TTL
- Transpiled packages for better compatibility

## Recent Updates (2025-01)

### Enrollment System

- Complete merchant enrollment flow with 11+ step wizard
- Integration with TossPay and major Korean card companies
- Document upload system using Vercel Blob Storage
- Database schema for enrollment applications

### UI Components Refactoring

- Migrated original UI components to `ui-backup/`
- Created new CareOn-branded components with consistent design
- Implemented mobile-responsive enrollment forms
- Added Korean business category selection system

### Database Enhancements

- Added `enrollment_applications` table
- SMS webhook integration for Ppurio service
- TypeScript type definitions in `lib/database.types.ts`

### Documentation

- NextJS 15 development guides added
- Card company agreement documents
- Enrollment system technical documentation
