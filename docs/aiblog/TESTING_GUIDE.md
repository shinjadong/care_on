# AI Blog Image Upload & Generation - Testing Guide

## 📋 Overview

Complete testing guide for AI blog image upload and generation with server-side processing.

**Feature Summary:**
- Server-side image upload to Supabase Storage bucket 'aiblog'
- 30MB file size limit per image
- GPT-4 Vision integration for image analysis
- Complete server-side processing

---

## ✅ Implementation Status

### Completed Components

1. **Database Migrations**
   - ✅ `20251007000002_create_aiblog_storage.sql` - Storage bucket with RLS
   - ✅ `20251007000003_add_image_urls_to_aiblog.sql` - Added image_urls column

2. **API Endpoints**
   - ✅ `/api/aiblog/upload-image` - Server-side image upload
   - ✅ `/api/aiblog/generate` - Updated with GPT-4 Vision support

3. **Frontend Components**
   - ✅ `ImageUploader.tsx` - Server-side upload integration
   - ✅ `KeywordBlogGenerator.tsx` - New keyword-based generator
   - ✅ `app/aiblog/generator/page.tsx` - Two-column layout

4. **Styling**
   - ✅ `styles/image-uploader.css` - Progress bar and grid styles

---

## 🧪 Testing Prerequisites

### Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
```

### Database Setup

```bash
# Run migrations
npx supabase db reset

# Verify bucket exists in Supabase Dashboard
# Storage → Buckets → 'aiblog'
# - Public: ✅
# - Size limit: 30MB
# - MIME types: image/jpeg, jpg, png, gif, webp
```

---

## 🔍 Manual Test Procedures

### Test 1: UI Verification

**URL:** http://localhost:3000/aiblog/generator

**Expected:**
- ✅ Two-column layout
- ✅ Keyword input (0/100 counter)
- ✅ Image upload button
- ✅ Generate button (disabled until keyword entered)
- ✅ Preview panel on right
- ✅ No console errors

### Test 2: Keyword Input

**Steps:**
1. Type: "창업 성공 전략"

**Expected:**
- ✅ Counter updates: "8/100"
- ✅ Generate button enabled
- ✅ 100 char limit enforced

### Test 3: Single Image Upload

**Prerequisites:** Authenticated user

**Steps:**
1. Click "이미지 업로드"
2. Select image (≤30MB)

**Expected:**
- ✅ Progress bar animates
- ✅ Success toast
- ✅ Image preview appears
- ✅ Badge: "1개의 이미지"

**Verify in Supabase:**
- Storage → aiblog → {user_id} → file exists

### Test 4: Multiple Images Upload

**Steps:**
1. Select 3-5 images

**Expected:**
- ✅ Progress increments (33%→66%→100%)
- ✅ Toast: "3개의 이미지가..."
- ✅ All previews shown
- ✅ Badge: "3개의 이미지"

### Test 5: 30MB Limit

**Steps:**
1. Upload file >30MB

**Expected:**
- ✅ Error toast: "이미지 크기는 30MB 이하여야 합니다."
- ✅ No upload to storage

### Test 6: Image Deletion

**Steps:**
1. Upload 2 images
2. Click X on one

**Expected:**
- ✅ Image removed from grid
- ✅ Badge count decreases
- ✅ Memory cleanup (URL.revokeObjectURL)

### Test 7: Blog Generation Without Images

**Prerequisites:** OPENAI_API_KEY set

**Steps:**
1. Enter keyword
2. Click generate (no images)

**Expected:**
- ✅ Loading state: "AI가 블로그를 작성 중..."
- ✅ Success toast with title
- ✅ Content in preview panel
- ✅ Database record: model='gpt-4', image_urls='{}'

### Test 8: Blog Generation With Images ⭐

**Steps:**
1. Enter keyword
2. Upload 2 images
3. Click generate

**Expected:**
- ✅ Longer generation time (30-60s)
- ✅ Success toast
- ✅ **Content references uploaded images**
- ✅ Database: model='gpt-4-vision-preview', image_urls has 2 URLs

**Verify:**
```sql
SELECT model, array_length(image_urls, 1) as count
FROM ai_blog_posts
ORDER BY created_at DESC LIMIT 1;
```

### Test 9: Unauthenticated Upload

**Steps:**
1. Logout
2. Try upload

**Expected:**
- ✅ Error: "인증이 필요합니다."
- ✅ HTTP 401

### Test 10: Missing API Key

**Steps:**
1. Remove OPENAI_API_KEY
2. Restart server
3. Generate blog

**Expected:**
- ✅ Error: "OPENAI_API_KEY is not configured"

---

## 📊 Automated Check Script

```javascript
// Run in Chrome Console on /aiblog/generator
(async function() {
  console.log('🧪 AI Blog Test\n');
  
  // UI Check
  const input = document.querySelector('input[type="text"]');
  const upload = document.querySelector('button:has-text("업로드")');
  console.log('UI:', input && upload ? '✅' : '❌');
  
  // Auth Check
  const auth = await fetch('/api/admin/check-auth').then(r => r.json());
  console.log('Auth:', auth.authenticated ? '✅' : '❌');
  
  console.log('\n✓ Complete');
})();
```

---

## 🐛 Troubleshooting

### Upload fails with 401
- Check user logged in
- Verify Supabase keys in .env.local
- Check RLS policies on storage.objects

### Generation fails
- Verify OPENAI_API_KEY exists
- Check API quota not exceeded
- Review console for errors

### Images don't show in content
- Verify model is 'gpt-4-vision-preview'
- Test image URLs are publicly accessible
- Check image formats (JPEG/PNG preferred)

---

## ✅ Test Checklist

- [ ] All UI elements render
- [ ] Keyword validation works
- [ ] Single image upload successful
- [ ] Multiple image upload successful
- [ ] 30MB limit enforced
- [ ] Image deletion works
- [ ] Blog generation without images
- [ ] Blog generation WITH images (⭐ key test)
- [ ] Generated content references images
- [ ] Database records correct
- [ ] Error handling for unauth users
- [ ] Error handling for missing API key
- [ ] Responsive on mobile/tablet
- [ ] No console errors

---

## 🎯 Production Readiness

Before deploying:

1. **Environment**
   - [ ] All env vars set in production
   - [ ] Supabase bucket created in prod
   - [ ] RLS policies migrated

2. **Security**
   - [ ] File upload validation server-side
   - [ ] Rate limiting on API endpoints
   - [ ] CORS configured if needed

3. **Monitoring**
   - [ ] Error tracking (Sentry, etc.)
   - [ ] API quota monitoring
   - [ ] Storage usage alerts

---

*Last Updated: 2025-10-07*
*Status: ✅ Ready for Testing*
