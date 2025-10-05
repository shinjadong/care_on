  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-lg mx-auto px-4">
        {/* 심플 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {quote.customer.business_name}
          </h1>
          <p className="text-gray-500 mt-1">견적서</p>
        </div>

        {/* 서비스 구성 */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          {quote.package ? (
            /* 패키지 */
            <div>
              <h3 className="text-lg font-bold mb-4">{quote.package.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>계약기간: {quote.package.contract_period}개월</p>
                <p>무료혜택: {quote.package.free_period}개월</p>
                <p>환급보장: {quote.package.closure_refund_rate}%</p>
              </div>
            </div>
          ) : (
            /* 커스텀 구성 */
            <div>
              <h3 className="text-lg font-bold mb-4">서비스 구성</h3>
              <div className="space-y-3">
                {quote.contract_items?.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.product.name}</span>
                    <span className="font-medium">{item.fee.toLocaleString()}원</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 총 요금 */}
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-2">월 이용료</p>
          <p className="text-4xl font-bold text-blue-600">
            {quote.total_monthly_fee.toLocaleString()}원
          </p>
          {quote.package?.free_period && (
            <p className="text-green-600 mt-2">
              {quote.package.free_period}개월 무료
            </p>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="space-y-4">
          {quote.status === 'quoted' && (
            <Button 
              size="lg"
              onClick={() => setIsSignModalOpen(true)}
              className="w-full py-4 text-lg rounded-2xl bg-blue-600 hover:bg-blue-700"
            >
              계약 서명하기
            </Button>
          )}

          {quote.status === 'active' && (
            <Button size="lg" className="w-full py-4 text-lg rounded-2xl" asChild>
              <a href="/my/services">
                내 서비스 확인
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )