import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

// OpenAI API 클라이언트 초기화
let openaiClient: OpenAI | null = null;
const getOpenAIClient = () => {
  if (openaiClient) {
    return openaiClient;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  openaiClient = new OpenAI({
    apiKey,
    timeout: 90000,
    maxRetries: 3
  });

  return openaiClient;
};

// 시스템 프롬프트
const SYSTEM_PROMPT = `# AI 네이버 블로그 전문 작성 시스템

당신은 네이버 블로그 전문 작성 AI입니다. 주어진 키워드에 대해 SEO 최적화된 고품질 블로그 포스트를 작성하는 것이 주요 임무입니다.

## 글 작성 원칙

### 글자수 및 구조
* 총 글자수: 1500~1800자 (한글 음절 기준, 공백 포함)
* 소제목: 최소 5개 이상 필수
* 각 소제목 하위에 2~3개 문단 구성
* 각 문단 최소 400자

### 태그 사용법
- 제목: <title>{제목}</title>
- 첫 문장: <b>{제목과 동일}</b>
- 구분선: <horizontal-line>
- 키워드: <h1>{키워드}</h1>
- 소제목: <h2>{소제목}</h2>
- 해시태그: <hashtags>{태그목록}</hashtags>

### 이미지 배치
- 썸네일: [썸네일]
- <h1> 키워드 바로 뒤: [이미지0-이미지1]
- 본문 내 2장씩 쌍으로 배치: [이미지2-이미지3]
- 마지막 단독 이미지: [이미지4] (홀수일 경우)
- 스티커: [스티커]

### SEO 최적화
* 키워드 자연스럽게 배치 (5-7회)
* 관련 검색어 포함
* 읽기 쉬운 문장 구조
* 실용적이고 구체적인 정보 제공

## 출력 형식
반드시 다음 형식으로 출력하세요:

<title>블로그 제목</title>
<b>블로그 제목</b>

[썸네일]

<horizontal-line>

<h1>키워드</h1>
[이미지0-이미지1]

서론 내용...

<h2>소제목 1</h2>
본문 내용...
[이미지2-이미지3]

<h2>소제목 2</h2>
본문 내용...

[이미지4]

<hashtags>#태그1 #태그2 #태그3</hashtags>
`;

export async function POST(request: NextRequest) {
  try {
    // 테스트용: Service Role Key 사용하여 RLS 우회
    const supabase = await createClient(true);

    // 인증 확인 (테스트용 임시 비활성화)
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // TODO: 프로덕션에서는 인증 필수로 되돌려야 함
    // 테스트용 UUID 생성 (crypto.randomUUID() 사용)
    const testUserId = crypto.randomUUID();
    const effectiveUserId = user?.id || testUserId;

    // if (authError || !user) {
    //   return NextResponse.json(
    //     { error: '인증이 필요합니다.' },
    //     { status: 401 }
    //   );
    // }

    // 요청 바디 파싱
    const body = await request.json();
    const { keyword, imageUrls = [], model = 'gpt-4', temperature = 0.7 } = body;

    if (!keyword) {
      return NextResponse.json(
        { error: '키워드가 필요합니다.' },
        { status: 400 }
      );
    }

    // 이미지 URL 배열 검증
    if (imageUrls && !Array.isArray(imageUrls)) {
      return NextResponse.json(
        { error: 'imageUrls는 배열이어야 합니다.' },
        { status: 400 }
      );
    }

    // 생성 시작 시간 기록
    const startTime = Date.now();

    // 생성 히스토리 레코드 생성
    const { data: historyRecord, error: historyError } = await supabase
      .from('ai_blog_generation_history')
      .insert({
        user_id: effectiveUserId,
        keyword,
        model,
        status: 'processing'
      })
      .select()
      .single();

    if (historyError) {
      console.error('히스토리 생성 오류:', historyError);
    }

    try {
      // OpenAI API 호출
      const openai = getOpenAIClient();

      let userPrompt = `키워드: ${keyword}

위 키워드에 대해 SEO 최적화된 네이버 블로그 포스트를 작성해주세요.
독자들이 유용하고 신뢰할 수 있는 정보를 얻을 수 있도록 구체적이고 실용적인 내용으로 작성해주세요.`;

      // 이미지가 있는 경우 Vision 모델 사용
      const useVision = imageUrls && imageUrls.length > 0;
      // gpt-4o는 vision과 text 모두 지원
      const actualModel = useVision ? 'gpt-4o' : (model || 'gpt-4o');

      if (useVision) {
        // Vision 모델용 프롬프트 (이미지 포함)
        userPrompt += `\n\n업로드된 이미지(${imageUrls.length}개)를 분석하여 블로그 내용에 자연스럽게 녹여주세요. 이미지에서 보이는 내용을 설명하고, 본문과 연관지어 작성해주세요.`;
      }

      // Chat Completions API 사용 (현재 안정 버전)
      const messages: any[] = [
        { role: 'system', content: SYSTEM_PROMPT }
      ];

      if (useVision) {
        // Vision 모델용 메시지 구성
        const content: any[] = [
          { type: 'text', text: userPrompt }
        ];

        // 이미지 URL 추가
        imageUrls.forEach((imageUrl: string) => {
          content.push({
            type: 'image_url',
            image_url: {
              url: imageUrl,
              detail: 'high'
            }
          });
        });

        messages.push({ role: 'user', content });
      } else {
        // 텍스트만 있는 경우
        messages.push({ role: 'user', content: userPrompt });
      }

      const completion = await openai.chat.completions.create({
        model: actualModel,
        messages,
        temperature,
        max_tokens: 4096,
      });

      const content = completion.choices[0]?.message?.content || '';
      const tokenCount = completion.usage?.total_tokens || 0;
      const processingTime = Date.now() - startTime;

      // 제목 추출 (간단한 파싱)
      const titleMatch = content.match(/<title>(.*?)<\/title>/);
      const title = titleMatch ? titleMatch[1] : keyword;

      // SEO 키워드 추출
      const hashtagsMatch = content.match(/<hashtags>(.*?)<\/hashtags>/);
      const hashtags = hashtagsMatch
        ? hashtagsMatch[1].split('#').filter(tag => tag.trim()).map(tag => tag.trim())
        : [];

      // slug 생성 (한글 → 영문 변환 필요시 추가 로직)
      const slug = `${Date.now()}-${keyword.replace(/\s+/g, '-')}`;

      // 블로그 포스트 저장
      const insertData = {
        user_id: effectiveUserId,
        title,
        content,
        format: 'html',
        keyword,
        model: actualModel,
        slug,
        seo_keywords: hashtags,
        image_urls: imageUrls,
        generation_status: 'completed',
        status: 'draft'
      };
      
      console.log('블로그 포스트 저장 시도:', {
        ...insertData,
        content: content.substring(0, 100) + '...'
      });

      // Service role key should bypass RLS, but let's use .insert() directly
      const { data: blogPost, error: blogError } = await supabase
        .from('ai_blog_posts')
        .insert(insertData)
        .select()
        .single();

      console.log('Supabase insert result:', { 
        hasData: !!blogPost, 
        hasError: !!blogError,
        dataType: typeof blogPost,
        errorType: typeof blogError,
        blogPostValue: blogPost ? { id: blogPost.id, title: blogPost.title } : null,
        blogErrorValue: blogError,
        errorKeys: blogError ? Object.keys(blogError) : [],
        errorStringified: blogError ? JSON.stringify(blogError) : null
      });

      if (blogError || !blogPost) {
        console.error('블로그 포스트 저장 실패 - 상세:', {
          blogError,
          blogErrorKeys: blogError ? Object.keys(blogError) : [],
          blogPost,
          errorMessage: blogError?.message,
          errorDetails: blogError?.details,
          errorHint: blogError?.hint,
          errorCode: blogError?.code,
          fullErrorObject: JSON.stringify(blogError, null, 2)
        });
        throw new Error(`블로그 포스트 저장 실패: ${blogError?.message || JSON.stringify(blogError) || 'Unknown error'}`);
      }

      // 히스토리 업데이트
      if (historyRecord) {
        await supabase
          .from('ai_blog_generation_history')
          .update({
            blog_post_id: blogPost.id,
            status: 'completed',
            processing_time_ms: processingTime,
            token_count: tokenCount
          })
          .eq('id', historyRecord.id);
      }

      return NextResponse.json({
        success: true,
        data: {
          id: blogPost.id,
          title,
          content,
          keyword,
          slug,
          seo_keywords: hashtags,
          processing_time_ms: processingTime,
          token_count: tokenCount
        }
      });

    } catch (aiError: any) {
      // AI 생성 실패 시 히스토리 업데이트
      if (historyRecord) {
        await supabase
          .from('ai_blog_generation_history')
          .update({
            status: 'failed',
            error_message: aiError.message,
            processing_time_ms: Date.now() - startTime
          })
          .eq('id', historyRecord.id);
      }

      throw aiError;
    }

  } catch (error: any) {
    console.error('블로그 생성 오류:', error);

    return NextResponse.json(
      {
        error: '블로그 생성 중 오류가 발생했습니다.',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// GET: 사용자의 블로그 포스트 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');

    let query = supabase
      .from('ai_blog_posts')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
      total: count,
      limit,
      offset
    });

  } catch (error: any) {
    console.error('블로그 목록 조회 오류:', error);

    return NextResponse.json(
      {
        error: '블로그 목록 조회 중 오류가 발생했습니다.',
        details: error.message
      },
      { status: 500 }
    );
  }
}
