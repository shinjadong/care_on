'use client'

/**
 * tRPC Test Page
 * Tests Clean Architecture flow: tRPC → Use Cases → Domain → Infrastructure
 */

import { trpc } from '@/lib/presentation/api/trpc/client'
import { useState } from 'react'

export default function TestPage() {
  const [testResult, setTestResult] = useState<string>('')

  // Test: Create enrollment
  const createEnrollment = trpc.enrollment.create.useMutation({
    onSuccess: (data) => {
      setTestResult(`✅ SUCCESS: Created enrollment ${data.id}`)
    },
    onError: (error) => {
      setTestResult(`❌ ERROR: ${error.message}`)
    }
  })

  const handleTestCreate = () => {
    createEnrollment.mutate({
      agreeTerms: true,
      agreePrivacy: true,
      agreeMarketing: false,
      agreeTosspay: true,
      businessType: '개인사업자',
      representativeName: '홍길동',
      phoneNumber: '01012345678',
      birthDate: '1990-01-01',
      gender: 'male'
    })
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">🧪 Clean Architecture Test</h1>

      <div className="space-y-6">
        {/* Test 1: Create Enrollment */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test 1: Create Enrollment</h2>
          <p className="text-sm text-gray-600 mb-4">
            Tests: tRPC → CreateEnrollmentUseCase → EnrollmentApplication Entity → PrismaRepository
          </p>
          <button
            onClick={handleTestCreate}
            disabled={createEnrollment.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {createEnrollment.isPending ? 'Creating...' : 'Create Test Enrollment'}
          </button>

          {testResult && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <pre className="text-sm">{testResult}</pre>
            </div>
          )}

          {createEnrollment.data && (
            <div className="mt-4 p-4 bg-green-50 rounded">
              <h3 className="font-semibold mb-2">Created Enrollment:</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(createEnrollment.data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Architecture Flow Diagram */}
        <div className="border rounded-lg p-6 bg-blue-50">
          <h2 className="text-xl font-semibold mb-4">📐 Architecture Flow</h2>
          <div className="space-y-2 text-sm font-mono">
            <div>1️⃣ UI Component (this page)</div>
            <div className="ml-4">↓ calls tRPC mutation</div>
            <div>2️⃣ tRPC Router (Presentation Layer)</div>
            <div className="ml-4">↓ validates input with Zod</div>
            <div className="ml-4">↓ creates Repository</div>
            <div className="ml-4">↓ creates Use Case</div>
            <div>3️⃣ CreateEnrollmentUseCase (Application Layer)</div>
            <div className="ml-4">↓ calls EnrollmentApplication.createDraft()</div>
            <div>4️⃣ EnrollmentApplication Entity (Domain Layer)</div>
            <div className="ml-4">↓ validates business rules</div>
            <div className="ml-4">↓ returns domain entity</div>
            <div>5️⃣ Use Case calls repository.save()</div>
            <div>6️⃣ PrismaEnrollmentRepository (Infrastructure Layer)</div>
            <div className="ml-4">↓ maps domain entity to Prisma model</div>
            <div className="ml-4">↓ saves to PostgreSQL</div>
            <div className="ml-4">↓ returns saved entity</div>
            <div>7️⃣ Response flows back up to UI</div>
          </div>
        </div>

        {/* Layer Separation Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border rounded p-4">
            <h3 className="font-bold text-sm mb-2">🎨 Framework</h3>
            <p className="text-xs text-gray-600">Next.js, React, tRPC Router</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-bold text-sm mb-2">🔌 Application</h3>
            <p className="text-xs text-gray-600">Use Cases, Orchestration</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-bold text-sm mb-2">💎 Domain</h3>
            <p className="text-xs text-gray-600">Entities, Business Rules</p>
          </div>
          <div className="border rounded p-4">
            <h3 className="font-bold text-sm mb-2">🏗️ Infrastructure</h3>
            <p className="text-xs text-gray-600">Prisma, Database</p>
          </div>
        </div>
      </div>
    </div>
  )
}
