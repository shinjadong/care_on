'use client'

import { useState } from 'react'

export default function TestSMSPage() {
  const [phone, setPhone] = useState('010-3245-3385')
  const [name, setName] = useState('테스트')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testSMS = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phone,
          name: name,
          businessType: '요식업'
        })
      })

      const data = await response.json()
      setResult({
        status: response.status,
        ok: response.ok,
        data: data
      })
    } catch (error: any) {
      setResult({
        error: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">SMS 테스트 페이지</h1>
      
      <div className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">수신번호</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          onClick={testSMS}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? '전송 중...' : 'SMS 테스트'}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-bold mb-2">결과:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-bold text-yellow-800 mb-2">환경 정보:</h3>
          <p className="text-sm text-yellow-700">
            NODE_ENV: {process.env.NODE_ENV}<br/>
            API: /api/sms/send<br/>
            IP 등록 필요: 프로덕션 서버 IP를 뿌리오에 등록
          </p>
        </div>
      </div>
    </div>
  )
}