# Multi-Provider AI Implementation

**Date**: 2025-10-11
**Status**: ✅ Complete
**Providers Supported**: Anthropic Claude, OpenAI GPT

---

## Overview

Canvas 도메인이 **Anthropic와 OpenAI를 모두 지원**하도록 확장되었습니다. Provider Pattern을 사용하여 환경 변수만으로 AI 제공자를 전환할 수 있습니다.

---

## Architecture

### Provider Pattern Implementation

```
lib/infrastructure/ai/
├── AIServiceFactory.ts           # Provider 선택 및 인스턴스 생성
├── AnthropicVisionAIService.ts   # Anthropic Claude Vision 구현
├── AnthropicBlogService.ts       # Anthropic Claude Text 구현
├── OpenAIVisionAIService.ts      # OpenAI GPT Vision 구현
└── OpenAIBlogService.ts          # OpenAI GPT Text 구현
```

### Layer Diagram

```
┌─────────────────────────────────────────────────┐
│  Presentation Layer (tRPC Router)              │
│  - getAIServiceConfig() → 환경 변수 읽기      │
└────────────────┬────────────────────────────────┘
                 │ uses ↓
┌────────────────▼────────────────────────────────┐
│  Infrastructure Layer (Factory)                │
│  - AIServiceFactory.createVisionService()      │
│  - AIServiceFactory.createBlogService()        │
└────────────────┬────────────────────────────────┘
                 │ creates ↓
┌────────────────▼────────────────────────────────┐
│  Infrastructure Layer (Implementations)        │
│  - AnthropicVisionAIService                    │
│  - OpenAIVisionAIService                       │
│  - AnthropicBlogService                        │
│  - OpenAIBlogService                           │
└────────────────┬────────────────────────────────┘
                 │ implements ↓
┌────────────────▼────────────────────────────────┐
│  Domain Layer (Interfaces)                     │
│  - IVisionAIService                            │
│  - IAIBlogService                              │
└─────────────────────────────────────────────────┘
```

---

## Implementation Details

### 1. Factory Pattern

**File**: `lib/infrastructure/ai/AIServiceFactory.ts`

```typescript
export type AIProvider = 'anthropic' | 'openai'

export class AIServiceFactory {
  static createVisionService(config: AIServiceConfig): IVisionAIService {
    switch (config.provider) {
      case 'anthropic':
        return new AnthropicVisionAIService(config.apiKey)
      case 'openai':
        return new OpenAIVisionAIService(config.apiKey)
    }
  }

  static createBlogService(config: AIServiceConfig): IAIBlogService {
    switch (config.provider) {
      case 'anthropic':
        return new AnthropicBlogService(config.apiKey)
      case 'openai':
        return new OpenAIBlogService(config.apiKey)
    }
  }
}

export function getAIServiceConfig(): AIServiceConfig {
  const provider = (process.env.AI_PROVIDER || 'anthropic') as AIProvider

  let apiKey: string
  if (provider === 'anthropic') {
    apiKey = process.env.ANTHROPIC_API_KEY || ''
  } else if (provider === 'openai') {
    apiKey = process.env.OPENAI_API_KEY || ''
  }

  return { provider, apiKey }
}
```

### 2. Anthropic Implementation

**Vision AI**: `lib/infrastructure/ai/AnthropicVisionAIService.ts`
- Model: `claude-3-5-sonnet-20241022`
- API: Messages API
- Image Format: base64 with `source.type`

**Blog Generation**: `lib/infrastructure/ai/AnthropicBlogService.ts`
- Model: `claude-3-5-sonnet-20241022`
- API: Messages API
- Tokens: 2048 (short), 4096 (medium), 8192 (long)

### 3. OpenAI Implementation

**Vision AI**: `lib/infrastructure/ai/OpenAIVisionAIService.ts`
- Model: `gpt-4.1-mini`
- API: Responses API
- Image Format: `data:image/jpeg;base64,${base64}`

**Blog Generation**: `lib/infrastructure/ai/OpenAIBlogService.ts`
- Model: `gpt-5`
- API: Responses API with `instructions` parameter
- Reasoning: `{ effort: 'medium' }`

### 4. tRPC Router Integration

**File**: `lib/presentation/api/trpc/routers/canvas.ts`

```typescript
function getBlogGenerationService() {
  // Get AI provider configuration from environment
  const aiConfig = getAIServiceConfig()

  // Create services using factory pattern
  const visionService = AIServiceFactory.createVisionService(aiConfig)
  const blogService = AIServiceFactory.createBlogService(aiConfig)

  // Use Cases
  const analyzeImages = new AnalyzeImagesUseCase(visionService)
  const generateBlog = new GenerateBlogUseCase(blogService)

  // Application Service
  return new BlogGenerationService(
    getEnrollment,
    analyzeImages,
    generateBlog,
    blogRepo
  )
}
```

---

## Configuration

### Environment Variables

**File**: `.env.local`

```bash
# AI Provider Configuration
# Choose between 'anthropic' or 'openai' (default: 'anthropic')
AI_PROVIDER=anthropic

# Anthropic Claude AI API
# Get from: https://console.anthropic.com/
# Required when AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-xxx

# OpenAI API
# Get from: https://platform.openai.com/api-keys
# Required when AI_PROVIDER=openai
# OPENAI_API_KEY=sk-xxx
```

### Switching Providers

#### Use Anthropic (Default)
```bash
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-xxx
```

#### Use OpenAI
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-xxx
```

---

## API Differences

### Vision AI

| Feature | Anthropic | OpenAI |
|---------|-----------|--------|
| Model | claude-3-5-sonnet-20241022 | gpt-4.1-mini |
| API | Messages API | Responses API |
| Image Format | `{type:'image', source:{type:'base64'}}` | `{type:'input_image', image_url:'data:...'}` |
| Max Images | 10 | 10 |
| Response Format | `response.content[0].text` | `response.output_text` |

### Blog Generation

| Feature | Anthropic | OpenAI |
|---------|-----------|--------|
| Model | claude-3-5-sonnet-20241022 | gpt-5 |
| API | Messages API | Responses API |
| System Prompt | In `messages` array | `instructions` parameter |
| Reasoning | N/A | `reasoning: {effort: 'medium'}` |
| Tokens (medium) | 4096 | 4096 |
| Response Format | `response.content[0].text` | `response.output_text` |

---

## Testing

### Manual Testing Steps

1. **Set Provider to Anthropic**
```bash
echo 'AI_PROVIDER=anthropic' >> .env.local
```

2. **Test Canvas Page**
```bash
npm run dev
# Navigate to http://localhost:3002/canvas
# Upload images → Verify Anthropic is used
```

3. **Switch to OpenAI**
```bash
# Update .env.local
AI_PROVIDER=openai
OPENAI_API_KEY=sk-xxx

# Restart dev server
# Navigate to http://localhost:3002/canvas
# Upload images → Verify OpenAI is used
```

4. **Verify Logs**
```bash
# Check console for provider-specific API calls
# Anthropic: messages.create()
# OpenAI: responses.create()
```

---

## Benefits

### 1. Flexibility
- Switch providers without code changes
- Test different models easily
- Migrate providers seamlessly

### 2. Cost Optimization
- Use cheaper provider for high-volume scenarios
- Fallback to alternative if primary provider has issues

### 3. Vendor Lock-in Avoidance
- Not dependent on single AI vendor
- Easy to add more providers (e.g., Google Gemini, Cohere)

### 4. Clean Architecture Compliance
- Domain layer knows only interfaces
- Infrastructure layer handles implementations
- Easy to test with mock implementations

---

## Future Enhancements

### Add More Providers
```typescript
// lib/infrastructure/ai/GoogleVisionAIService.ts
export class GoogleVisionAIService implements IVisionAIService {
  // Implement Google Gemini Vision
}

// Update Factory
case 'google':
  return new GoogleVisionAIService(config.apiKey)
```

### Provider-Specific Features
```typescript
export interface ProviderCapabilities {
  supportsStreaming: boolean
  maxImageSize: number
  supportedFormats: string[]
}

export class AIServiceFactory {
  static getCapabilities(provider: AIProvider): ProviderCapabilities {
    // Return provider-specific capabilities
  }
}
```

### Load Balancing
```typescript
export class AIServiceLoadBalancer {
  private providers: AIProvider[]

  selectProvider(): AIProvider {
    // Round-robin, least-loaded, or cost-based selection
  }
}
```

### Fallback Strategy
```typescript
export class AIServiceWithFallback implements IVisionAIService {
  constructor(
    private primary: IVisionAIService,
    private fallback: IVisionAIService
  ) {}

  async analyzeImages(images: File[]) {
    try {
      return await this.primary.analyzeImages(images)
    } catch (error) {
      console.warn('Primary provider failed, using fallback')
      return await this.fallback.analyzeImages(images)
    }
  }
}
```

---

## Dependencies Added

```json
{
  "dependencies": {
    "openai": "^6.3.0"  // Added for OpenAI support
  }
}
```

Anthropic SDK (`@anthropic-ai/sdk`) was already installed.

---

## Files Modified/Created

### Created
- `lib/infrastructure/ai/OpenAIVisionAIService.ts` - OpenAI Vision implementation
- `lib/infrastructure/ai/OpenAIBlogService.ts` - OpenAI Blog generation implementation
- `lib/infrastructure/ai/AIServiceFactory.ts` - Provider factory pattern
- `docs/MULTI_PROVIDER_AI_IMPLEMENTATION.md` - This document

### Modified
- `lib/presentation/api/trpc/routers/canvas.ts` - Use factory pattern
- `.env.local` - Add AI_PROVIDER and OPENAI_API_KEY documentation
- `CLAUDE.md` - Add multi-provider documentation
- `package.json` - Add OpenAI dependency

---

## Summary

Canvas 도메인이 이제 **Anthropic Claude와 OpenAI GPT를 모두 지원**합니다:

✅ **Provider Pattern**: Factory 패턴으로 깔끔한 구현
✅ **Environment-Based**: 환경 변수로 간단한 전환
✅ **Clean Architecture**: 도메인 레이어는 인터페이스만 알고 있음
✅ **Zero Breaking Changes**: 기존 코드에 영향 없음
✅ **Future-Proof**: 쉽게 새로운 제공자 추가 가능

환경 변수 `AI_PROVIDER`만 변경하면 즉시 다른 AI 서비스 사용 가능!
