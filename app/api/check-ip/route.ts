import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 여러 방법으로 IP 확인
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const cfConnectingIp = request.headers.get('cf-connecting-ip')
    
    // 외부 서비스로 공인 IP 확인
    const ipResponse = await fetch('https://api.ipify.org?format=json')
    const ipData = await ipResponse.json()
    
    // 백업 IP 확인
    let backupIp = null
    try {
      const ip2Response = await fetch('https://ifconfig.me/ip')
      backupIp = await ip2Response.text()
    } catch (e) {
      // 백업 실패 무시
    }

    return NextResponse.json({
      server_ip: ipData.ip,
      backup_ip: backupIp?.trim(),
      headers: {
        'x-forwarded-for': forwarded,
        'x-real-ip': realIp,
        'cf-connecting-ip': cfConnectingIp,
      },
      message: '이 IP들을 뿌리오 관리자 페이지에 등록해주세요',
      ppurio_url: 'https://www.ppurio.com',
      menu: 'API 설정 > 연동 IP 관리 > IP 추가',
      platform: 'Vercel',
      note: 'Vercel은 동적 IP를 사용하므로 Edge Function 사용을 권장합니다'
    })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      message: 'IP 확인 실패'
    }, { status: 500 })
  }
}
