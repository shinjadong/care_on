export default {
  async fetch(request, env, ctx) {
    // CORS 헤더
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // OPTIONS 요청 처리
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // IP 체크 엔드포인트
    if (request.url.includes('/check-ip')) {
      try {
        const cfData = request.cf || {};
        return Response.json({
          ip: request.headers.get('CF-Connecting-IP') || 'unknown',
          cloudflare_colo: cfData.colo || 'unknown',
          message: 'Cloudflare Workers는 고정 IP 대역을 사용합니다',
          ip_ranges: [
            '173.245.48.0/20',
            '103.21.244.0/22',
            '103.22.200.0/22',
            '103.31.4.0/22',
            '141.101.64.0/18',
            '108.162.192.0/18',
            '190.93.240.0/20',
            '188.114.96.0/20',
            '197.234.240.0/22',
            '198.41.128.0/17',
            '162.158.0.0/15',
            '172.64.0.0/13',
            '131.0.72.0/22',
            '104.16.0.0/13',
            '104.24.0.0/14'
          ],
          instruction: '위 IP 대역을 뿌리오 관리자 페이지에 등록하세요'
        }, {
          headers: corsHeaders
        });
      } catch (error) {
        return Response.json({ error: error.message }, { 
          status: 500,
          headers: corsHeaders 
        });
      }
    }

    // SMS 전송 엔드포인트
    try {
      // 뿌리오 인증 정보 (하드코딩)
      const PPURIO_USERNAME = 'nvr_7464463887';
      const PPURIO_API_KEY = 'd55f01a941947acd711702ede3f90b74fdda318a78ed26dbde193cceeb0af4ac';
      const SENDER_PHONE = '01032453385';

      const body = await request.json();
      const { to, name, businessType, text } = body;

      // 1. 토큰 발급
      const tokenResponse = await fetch('https://message.ppurio.com/v1/token', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${PPURIO_USERNAME}:${PPURIO_API_KEY}`)
        }
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        throw new Error(`토큰 발급 실패: ${error}`);
      }

      const tokenData = await tokenResponse.json();
      const token = tokenData.token;

      // 2. 메시지 생성
      let message = text;
      if (!message && name) {
        message = `[케어온]
${name}님, 스타트케어 신청이 완료되었습니다.

담당자가 곧 연락드릴 예정입니다.
${businessType ? `업종: ${businessType}` : ''}

문의: 1866-1845`;
      }

      // 3. SMS 전송
      const messageType = new TextEncoder().encode(message).length <= 90 ? 'SMS' : 'LMS';
      
      const smsPayload = {
        account: PPURIO_USERNAME,
        messageType: messageType,
        content: message,
        from: SENDER_PHONE.replace(/-/g, ''),
        duplicateFlag: 'N',
        targetCount: 1,
        targets: [{ to: to.replace(/-/g, '') }],
        refKey: `careon_${Date.now()}`
      };

      const smsResponse = await fetch('https://message.ppurio.com/v1/message', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(smsPayload)
      });

      const result = await smsResponse.json();

      if (smsResponse.ok && result.code === '200') {
        return Response.json({
          success: true,
          messageKey: result.messageKey,
          type: messageType,
          platform: 'Cloudflare Workers'
        }, {
          headers: corsHeaders
        });
      } else {
        throw new Error(result.description || '메시지 전송 실패');
      }

    } catch (error) {
      console.error('SMS 전송 오류:', error);
      return Response.json({
        success: false,
        error: error.message
      }, {
        status: 400,
        headers: corsHeaders
      });
    }
  }
};