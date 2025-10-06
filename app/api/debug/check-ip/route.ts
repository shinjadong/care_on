import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 여러 IP 체크 서비스 사용
    const responses = await Promise.all([
      fetch('https://api.ipify.org?format=json').then(r => r.json()),
      fetch('https://ifconfig.me/ip').then(r => r.text()),
      fetch('https://api.my-ip.io/ip').then(r => r.text()),
    ])

    return NextResponse.json({
      success: true,
      ips: responses,
      vercelRegion: process.env.VERCEL_REGION,
      timestamp: new Date().toISOString(),
      message: 'Vercel에서 이 API를 호출할 때의 Outbound IP 주소입니다. 이 IP들을 Ppurio 화이트리스트에 등록하세요.',
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
