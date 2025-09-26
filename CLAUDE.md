# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

# Database operations (requires Supabase CLI)
npx supabase migration new <name>  # Create new migration
npx supabase db reset              # Reset database with migrations
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
- **Browser Client**: `lib/supabase/client.ts` - Uses public anon key for client-side operations
- **Server Client**: `lib/supabase/server.ts` - Can use service role key for admin operations (server-side only)
- **RLS Policies**: Currently disabled for development (`20250125000001_disable_rls_temp.sql`)

### Authentication Flow
- Google OAuth integration with Supabase Auth
- Protected routes handled via `components/auth/protected-route.tsx`
- Auth state managed through `hooks/useAuth.tsx`
- Callback handler at `/auth/callback`
- Admin authentication separate from user auth

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

Required environment variables (create `.env.local`):
```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Integration
ANTHROPIC_API_KEY=your_claude_api_key

# OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret

# Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# SMS Service (Korean)
PPURIO_API_KEY=your_ppurio_key
```

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

## Key Features & Workflows

### Supabase Integration
- Migrations in `supabase/migrations/` (chronological order)
- Edge functions in `supabase/functions/`
- Database types in `lib/database.types.ts` (auto-generated from schema)
- Tables: `customers`, `contracts`, `enrollment_applications`, `cs_tickets`, `billing`, `managers`

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
- **TypeScript**: Strict mode enabled but errors ignored in production builds (`ignoreBuildErrors: true`)
- **ESLint**: Errors ignored during builds (`ignoreDuringBuilds: true`)
- **Target**: ES6 with bundler module resolution
- **Image domains**: Vercel Blob Storage, Supabase Storage, YouTube thumbnails

### Routing Patterns
- Root `/` redirects to `/landing` (302 temporary redirect)
- Admin routes (`/admin/*`) require authentication
- API routes follow RESTful conventions with `route.ts` files
- Dynamic routes use `[param]` folder naming

### Performance Considerations
- Framer Motion with `optimizePackageImports` for tree-shaking
- Image optimization: AVIF/WebP formats with 60s minimum cache
- Component lazy loading for large UI sections
- Parallel data fetching in server components

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

## Common Development Tasks

### Working with Enrollment System

When modifying enrollment flow:

1. Check `components/enrollment/` for multi-step form components
2. Update validation in `components/enrollment/EnrollmentSchema.tsx`
3. API endpoint at `/api/enrollment/submit`
4. Database table: `enrollment_applications`

### Admin Dashboard Development

Admin routes require auth check via `/api/admin/check-auth`:

1. Dashboard data from `/api/dashboard/stats`
2. Customer management via `/api/admin/customers`
3. Enrollment approvals at `/api/admin/enrollments/[id]/approve`
4. All admin components use standard ShadcnUI (not glass UI)

### Adding New API Endpoints

Follow the existing patterns:

1. Create `route.ts` file in appropriate `/api/` folder
2. Use `NextRequest` and `NextResponse` from `next/server`
3. Import Supabase client from `lib/supabase/server.ts` for server operations
4. Handle errors with appropriate status codes

### Korean-Specific Features

1. **Address Search**: Use `react-daum-postcode` component
2. **SMS**: Send via `/api/sms/send` using Ppurio service
3. **Business Categories**: See `components/enrollment/steps/BusinessInfo.tsx` for category list

### Admin Dashboard Improvements (2025-09-26)

- **UI System Migration**: Replaced glassmorphic design with standard ShadcnUI components
  - Moved all glass UI components to `components/ui-backup/`
  - Updated admin layout, header, footer to use standard white/gray UI
  - Converted review pages to use standard shadow-based cards

- **Admin API Implementation (Phase 1)**
  - Created comprehensive admin improvement plan (`/admin/ADMIN_IMPROVEMENT_PLAN.md`)
  - Implemented Dashboard Stats API (`/api/dashboard/stats`)
    - Real-time statistics for customers, contracts, tickets, billing
    - Returns actual data from Supabase database
  - Customer Management API (`/api/admin/customers`)
    - Full CRUD operations with pagination and filtering
    - Bulk update support for multiple customers
    - Soft delete functionality
  - Enrollment Approval API (`/api/admin/enrollments/[id]/approve`)
    - Approve/reject enrollment applications
    - Automatic customer account creation on approval
    - SMS notification integration
  - Billing Summary API (`/api/admin/billing/summary`)
    - Monthly revenue tracking and trends
    - 6-month historical data analysis
    - Payment method breakdown

- **Dashboard Enhancement**
  - Connected admin dashboard to real APIs instead of mock data
  - Displays live statistics: 2 customers, 2 contracts, enrollment status
  - Improved error handling with fallback UI states

## Testing Patterns

### Manual Testing Flow

1. Start development server: `npm run dev`
2. Access main landing: `http://localhost:3000/landing`
3. Test enrollment flow: `http://localhost:3000/enrollment`
4. Admin dashboard: `http://localhost:3000/admin` (requires auth)
5. Check API responses in browser DevTools Network tab

### Common Issues & Solutions

- **Supabase connection errors**: Verify `NEXT_PUBLIC_SUPABASE_URL` and keys in `.env.local`
- **Build errors**: TypeScript errors ignored in production, but check with `npm run lint`
- **Admin auth issues**: Check `/api/admin/check-auth` implementation
- **Korean text encoding**: Ensure UTF-8 encoding in all API responses
- **File upload errors**: Verify `BLOB_READ_WRITE_TOKEN` is set for Vercel Blob Storage
