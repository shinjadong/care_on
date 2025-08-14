import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <p className="text-xl font-bold text-white mb-4">케어온</p>
            <address className="not-italic text-sm space-y-1">
              <p>케어온 | 대표자 : 신예준</p>
              <p>
                주소 : 경상남도 창원시 사화로80번길20, 201호 (팔용동) | 이메일 : siwwyy1012@gmail.com | 전화번호 :
                1866-1845
              </p>
              <p>사업자등록번호 :609-41-95762 | 통신판매업 신고번호 : 2024-창원의창-0453호</p>
            </address>
            <p className="text-xs mt-6">COPYRIGHT© 2024 케어온. ALL RIGHT RESERVED.</p>
          </div>
          <div className="flex flex-col space-y-2 text-sm">
            <Link href="#" className="hover:text-white">
              개인정보 처리방침
            </Link>
            <Link href="#" className="hover:text-white">
              이용약관
            </Link>
            <Link href="#" className="hover:text-white">
              공지사항
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
