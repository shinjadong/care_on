export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">
          CareOn Clean Architecture
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          처음부터 올바르게 구축된 비즈니스 플랫폼
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border p-6 rounded-lg">
            <h2 className="font-bold mb-2">Clean Architecture</h2>
            <p className="text-sm text-gray-600">
              계층 분리와 의존성 규칙을 엄격히 준수
            </p>
          </div>
          <div className="border p-6 rounded-lg">
            <h2 className="font-bold mb-2">Domain-Driven Design</h2>
            <p className="text-sm text-gray-600">
              비즈니스 도메인을 중심으로 한 설계
            </p>
          </div>
          <div className="border p-6 rounded-lg">
            <h2 className="font-bold mb-2">Type Safety</h2>
            <p className="text-sm text-gray-600">
              TypeScript, Prisma, tRPC로 완전한 타입 안전성
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
