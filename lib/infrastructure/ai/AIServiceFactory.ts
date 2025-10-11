import type { IVisionAIService, IAIBlogService } from '@/lib/domain/canvas/repositories/IVisionAIService'
import { AnthropicVisionAIService } from './AnthropicVisionAIService'
import { AnthropicBlogService } from './AnthropicBlogService'
import { OpenAIVisionAIService } from './OpenAIVisionAIService'
import { OpenAIBlogService } from './OpenAIBlogService'

/**
 * AI Provider Type
 *
 * Supported AI service providers for Canvas domain
 */
export type AIProvider = 'anthropic' | 'openai'

/**
 * AI Service Factory Configuration
 */
export interface AIServiceConfig {
  provider: AIProvider
  apiKey: string
}

/**
 * AIServiceFactory
 *
 * Factory for creating AI service instances based on provider selection
 * Implements Strategy Pattern for multi-provider support
 *
 * Supported Providers:
 * - Anthropic Claude (Vision + Text)
 * - OpenAI GPT (Vision + Text)
 *
 * Usage:
 * ```typescript
 * const config = getAIServiceConfig() // from env
 * const visionService = AIServiceFactory.createVisionService(config)
 * const blogService = AIServiceFactory.createBlogService(config)
 * ```
 */
export class AIServiceFactory {
  /**
   * Create Vision AI Service instance based on provider
   */
  static createVisionService(config: AIServiceConfig): IVisionAIService {
    switch (config.provider) {
      case 'anthropic':
        return new AnthropicVisionAIService(config.apiKey)

      case 'openai':
        return new OpenAIVisionAIService(config.apiKey)

      default:
        throw new Error(`Unsupported AI provider: ${config.provider}`)
    }
  }

  /**
   * Create Blog Generation Service instance based on provider
   */
  static createBlogService(config: AIServiceConfig): IAIBlogService {
    switch (config.provider) {
      case 'anthropic':
        return new AnthropicBlogService(config.apiKey)

      case 'openai':
        return new OpenAIBlogService(config.apiKey)

      default:
        throw new Error(`Unsupported AI provider: ${config.provider}`)
    }
  }

  /**
   * Validate provider configuration
   */
  static validateConfig(config: AIServiceConfig): void {
    if (!config.apiKey || config.apiKey.trim().length === 0) {
      throw new Error(`API key is required for provider: ${config.provider}`)
    }

    if (!['anthropic', 'openai'].includes(config.provider)) {
      throw new Error(`Invalid AI provider: ${config.provider}. Must be 'anthropic' or 'openai'`)
    }
  }
}

/**
 * Get AI Service Configuration from Environment Variables
 *
 * Environment Variables:
 * - AI_PROVIDER: 'anthropic' | 'openai' (default: 'anthropic')
 * - ANTHROPIC_API_KEY: Required if provider is 'anthropic'
 * - OPENAI_API_KEY: Required if provider is 'openai'
 */
export function getAIServiceConfig(): AIServiceConfig {
  const provider = (process.env.AI_PROVIDER || 'anthropic') as AIProvider

  let apiKey: string

  if (provider === 'anthropic') {
    apiKey = process.env.ANTHROPIC_API_KEY || ''
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required when AI_PROVIDER is "anthropic"')
    }
  } else if (provider === 'openai') {
    apiKey = process.env.OPENAI_API_KEY || ''
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required when AI_PROVIDER is "openai"')
    }
  } else {
    throw new Error(`Invalid AI_PROVIDER: ${provider}. Must be 'anthropic' or 'openai'`)
  }

  const config: AIServiceConfig = { provider, apiKey }

  // Validate configuration
  AIServiceFactory.validateConfig(config)

  return config
}
