import axios from 'axios';

/**
 * 외부 블로그 생성 API 응답 인터페이스
 */
export interface ExternalBlogResponse {
  content: string;
  status: 'success' | 'error';
  message?: string;
  timestamp?: number;
  source?: 'cache' | 'api';
  processingTime?: number;
}

/**
 * 외부 블로그 생성 API 요청 파라미터 인터페이스
 */
export interface ExternalBlogRequestParams {
  title_keyword: string;
  keyword_related?: string;
  additional_instructions?: string;
  promptType?: string;
  uploaded_images?: string[];
  client_api_key?: string;
  typeId?: string;
}

/**
 * CareOn AI 블로그 생성 API 응답
 */
interface AIBlogResponse {
  success: boolean;
  data?: {
    id: string;
    title: string;
    content: string;
    keyword: string;
    processing_time_ms: number;
  };
  error?: string;
}

// 로컬 메모리 캐시
const blogCache = new Map<string, { content: string, timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30분

// 캐시 키 생성 함수
function generateCacheKey(params: ExternalBlogRequestParams): string {
  const cacheKeyObj = {
    title_keyword: params.title_keyword,
    keyword_related: params.keyword_related || '',
    promptType: params.promptType || '',
    additional_instructions: params.additional_instructions || ''
  };

  return JSON.stringify(cacheKeyObj);
}

/**
 * 블로그 생성 API를 호출하는 서비스
 * CareOn의 /api/aiblog/generate 엔드포인트 사용
 */
export async function generateExternalBlog(params: ExternalBlogRequestParams): Promise<ExternalBlogResponse> {
  if (!params.title_keyword) {
    return {
      content: '',
      status: 'error',
      message: '주제 키워드는 필수 입력 항목입니다.'
    };
  }

  try {
    console.log("블로그 서비스 API 호출 준비:", params.title_keyword);

    // 캐시 키 생성
    const cacheKey = generateCacheKey(params);

    // 캐시 확인
    const cachedContent = blogCache.get(cacheKey);
    if (cachedContent && (Date.now() - cachedContent.timestamp) < CACHE_TTL) {
      console.log("캐시에서 블로그 콘텐츠 반환:", params.title_keyword);
      return {
        content: cachedContent.content,
        status: 'success',
        source: 'cache',
        timestamp: Date.now()
      };
    }

    // CareOn API 요청 본문 구성
    const requestBody = {
      keyword: params.title_keyword,
      model: 'gpt-4',
      temperature: 0.7
    };

    const startTime = Date.now();
    console.log("블로그 API 요청 시작:", new Date().toISOString());

    // CareOn 내부 API 호출
    const response = await axios.post<AIBlogResponse>('/api/aiblog/generate', requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 120000, // 2분 타임아웃
    });

    const processingTime = Date.now() - startTime;
    console.log(`블로그 API 응답 완료: ${processingTime}ms`);

    // 응답 데이터 확인
    if (response.status === 200 && response.data.success && response.data.data?.content) {
      const content = response.data.data.content;

      // 캐시에 저장
      blogCache.set(cacheKey, {
        content,
        timestamp: Date.now()
      });

      return {
        content,
        status: 'success',
        source: 'api',
        processingTime: response.data.data.processing_time_ms || processingTime,
        timestamp: Date.now()
      };
    } else {
      return {
        content: '',
        status: 'error',
        message: response.data.error || '블로그 콘텐츠 생성에 실패했습니다.'
      };
    }
  } catch (error) {
    console.error('블로그 생성 API 호출 오류:', error);

    // Axios 에러 응답 처리
    if (axios.isAxiosError(error) && error.response) {
      return {
        content: '',
        status: 'error',
        message: error.response.data.error || '블로그 생성 API 응답 오류'
      };
    }

    // 네트워크 오류나 타임아웃 처리
    return {
      content: '',
      status: 'error',
      message: error instanceof Error ? error.message : '블로그 생성 중 알 수 없는 오류가 발생했습니다.'
    };
  }
}

/**
 * 간단한 키워드로 블로그 생성
 */
export async function generateBlogFromKeyword(keyword: string): Promise<ExternalBlogResponse> {
  return generateExternalBlog({
    title_keyword: keyword
  });
}
