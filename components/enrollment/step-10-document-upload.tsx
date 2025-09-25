"use client"

import { useState, useRef } from "react"
import { CareonContainer } from "@/components/ui/careon-container"
import { CareonButton } from "@/components/ui/careon-button"
import { BackButton } from "@/components/ui/back-button"
import { CareonBottomSheet } from "@/components/ui/careon-bottom-sheet"
import type { FormData } from "@/app/enrollment/page"
import { Eye, X, Upload, Check } from "lucide-react"

interface StepDocumentUploadProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: any) => void
  onNext: () => void
  onBack: () => void
}

interface DocumentFile {
  name: string
  file: File | null
  url: string | null
  uploading: boolean
  uploaded: boolean
  required: boolean
  description?: string
}

export default function StepDocumentUpload({ formData, updateFormData, onNext, onBack }: StepDocumentUploadProps) {
  const isLegalEntity = formData.businessType === "법인사업자"
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewTitle, setPreviewTitle] = useState<string>("")
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const [basicDocuments, setBasicDocuments] = useState<DocumentFile[]>([
    {
      name: "사업자등록증",
      file: null,
      url: formData.businessRegistrationUrl || null,
      uploading: false,
      uploaded: !!formData.businessRegistrationUrl,
      required: true,
      description: "열람용/팩스발송용 불가"
    },
    {
      name: "대표자 신분증 앞면",
      file: null,
      url: formData.idCardFrontUrl || null,
      uploading: false,
      uploaded: !!formData.idCardFrontUrl,
      required: true
    },
    {
      name: "대표자 신분증 뒷면",
      file: null,
      url: formData.idCardBackUrl || null,
      uploading: false,
      uploaded: !!formData.idCardBackUrl,
      required: true
    },
    {
      name: "통장 사본",
      file: null,
      url: formData.bankbookUrl || null,
      uploading: false,
      uploaded: !!formData.bankbookUrl,
      required: true,
      description: "카드매출 입금계좌"
    },
    {
      name: "영업신고증/등록증",
      file: null,
      url: formData.businessLicenseUrl || null,
      uploading: false,
      uploaded: !!formData.businessLicenseUrl,
      required: false,
      description: "요식업·학원 등 해당시 필수"
    },
  ])

  const [businessPhotos, setBusinessPhotos] = useState<DocumentFile[]>([
    {
      name: "간판 사진 or 도로명주소판",
      file: null,
      url: formData.signPhotoUrl || null,
      uploading: false,
      uploaded: !!formData.signPhotoUrl,
      required: true
    },
    {
      name: "출입문 닫힌 사진",
      file: null,
      url: formData.doorClosedUrl || null,
      uploading: false,
      uploaded: !!formData.doorClosedUrl,
      required: true,
      description: "호수 확인 가능해야 함"
    },
    {
      name: "출입문 열린 사진",
      file: null,
      url: formData.doorOpenUrl || null,
      uploading: false,
      uploaded: !!formData.doorOpenUrl,
      required: true,
      description: "내부가 살짝 보이게"
    },
    {
      name: "사업장 내부 전경",
      file: null,
      url: formData.interiorUrl || null,
      uploading: false,
      uploaded: !!formData.interiorUrl,
      required: true
    },
    {
      name: "판매/취급 제품 사진",
      file: null,
      url: formData.productUrl || null,
      uploading: false,
      uploaded: !!formData.productUrl,
      required: true
    },
    {
      name: "명함/팜플렛/장비 사진",
      file: null,
      url: formData.businessCardUrl || null,
      uploading: false,
      uploaded: !!formData.businessCardUrl,
      required: false
    },
  ])

  const [corporateDocuments, setCorporateDocuments] = useState<DocumentFile[]>([
    {
      name: "법인등기부등본",
      file: null,
      url: formData.corporateRegistrationUrl || null,
      uploading: false,
      uploaded: !!formData.corporateRegistrationUrl,
      required: true
    },
    {
      name: "주주명부",
      file: null,
      url: formData.shareholderListUrl || null,
      uploading: false,
      uploaded: !!formData.shareholderListUrl,
      required: true,
      description: "법인인감 날인 필수"
    },
    {
      name: "인감증명서",
      file: null,
      url: formData.sealCertificateUrl || null,
      uploading: false,
      uploaded: !!formData.sealCertificateUrl,
      required: true,
      description: "2개월 이내 발급"
    },
    {
      name: "사용인감계",
      file: null,
      url: formData.sealUsageUrl || null,
      uploading: false,
      uploaded: !!formData.sealUsageUrl,
      required: false,
      description: "인감 불일치시 필수"
    },
  ])

  const fileInputRefs = useRef<{[key: string]: HTMLInputElement | null}>({})

  const handleFileSelect = async (
    category: 'basic' | 'photos' | 'corporate',
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("파일 크기는 10MB 이하로 해주세요.")
      return
    }

    // 파일 타입 체크
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "application/pdf"]
    if (!validTypes.includes(file.type)) {
      alert("JPG, PNG, GIF, PDF 파일만 업로드 가능합니다.")
      return
    }

    uploadFile(category, index, file)
  }

  const uploadFile = async (
    category: 'basic' | 'photos' | 'corporate',
    index: number,
    file: File
  ) => {
    // 업로드 상태 업데이트
    const updateState = (docs: DocumentFile[]) =>
      docs.map((doc, i) => i === index ? { ...doc, file, uploading: true } : doc)

    if (category === 'basic') {
      setBasicDocuments(updateState)
    } else if (category === 'photos') {
      setBusinessPhotos(updateState)
    } else {
      setCorporateDocuments(updateState)
    }

    try {
      // Use FormData for Vercel Blob upload
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(
        '/api/upload/vercel-blob',
        {
          method: 'PUT',
          body: formData,
          // Don't set Content-Type header - let browser set it with boundary
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "업로드 실패")
      }

      const result = await response.json()

      // 성공 상태 업데이트 (Vercel Blob returns url directly)
      const successState = (docs: DocumentFile[]) =>
        docs.map((doc, i) => i === index ? { ...doc, url: result.url, uploading: false, uploaded: true } : doc)

      if (category === 'basic') {
        setBasicDocuments(successState)
        // FormData 업데이트
        const fieldMap = [
          'businessRegistrationUrl',
          'idCardFrontUrl',
          'idCardBackUrl',
          'bankbookUrl',
          'businessLicenseUrl'
        ]
        updateFormData(fieldMap[index] as keyof FormData, result.url)
      } else if (category === 'photos') {
        setBusinessPhotos(successState)
        const fieldMap = [
          'signPhotoUrl',
          'doorClosedUrl',
          'doorOpenUrl',
          'interiorUrl',
          'productUrl',
          'businessCardUrl'
        ]
        updateFormData(fieldMap[index] as keyof FormData, result.url)
      } else {
        setCorporateDocuments(successState)
        const fieldMap = [
          'corporateRegistrationUrl',
          'shareholderListUrl',
          'sealCertificateUrl',
          'sealUsageUrl'
        ]
        updateFormData(fieldMap[index] as keyof FormData, result.url)
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("파일 업로드에 실패했습니다. 다시 시도해주세요.")

      // 실패 상태 업데이트
      const failState = (docs: DocumentFile[]) =>
        docs.map((doc, i) => i === index ? { ...doc, uploading: false } : doc)

      if (category === 'basic') {
        setBasicDocuments(failState)
      } else if (category === 'photos') {
        setBusinessPhotos(failState)
      } else {
        setCorporateDocuments(failState)
      }
    }
  }

  const handleRemoveFile = (
    category: 'basic' | 'photos' | 'corporate',
    index: number
  ) => {
    const resetState = (docs: DocumentFile[]) =>
      docs.map((doc, i) => i === index ? { ...doc, file: null, url: null, uploaded: false } : doc)

    if (category === 'basic') {
      setBasicDocuments(resetState)
      const fieldMap = [
        'businessRegistrationUrl',
        'idCardFrontUrl',
        'idCardBackUrl',
        'bankbookUrl',
        'businessLicenseUrl'
      ]
      updateFormData(fieldMap[index] as keyof FormData, null)
    } else if (category === 'photos') {
      setBusinessPhotos(resetState)
      const fieldMap = [
        'signPhotoUrl',
        'doorClosedUrl',
        'doorOpenUrl',
        'interiorUrl',
        'productUrl',
        'businessCardUrl'
      ]
      updateFormData(fieldMap[index] as keyof FormData, null)
    } else {
      setCorporateDocuments(resetState)
      const fieldMap = [
        'corporateRegistrationUrl',
        'shareholderListUrl',
        'sealCertificateUrl',
        'sealUsageUrl'
      ]
      updateFormData(fieldMap[index] as keyof FormData, null)
    }
  }

  const handleNext = () => {
    // 필수 서류 체크
    const basicRequired = basicDocuments.filter(d => d.required).every(d => d.uploaded)
    const photosRequired = businessPhotos.filter(d => d.required).every(d => d.uploaded)
    const corporateRequired = !isLegalEntity || corporateDocuments.filter(d => d.required).every(d => d.uploaded)

    if (!basicRequired) {
      alert("기본 필수 서류를 모두 업로드해주세요.")
      return
    }

    if (!photosRequired) {
      alert("사업장 사진을 모두 업로드해주세요.")
      return
    }

    if (!corporateRequired) {
      alert("법인 필수 서류를 모두 업로드해주세요.")
      return
    }

    onNext()
  }

  const renderUploadSection = (
    title: string,
    documents: DocumentFile[],
    category: 'basic' | 'photos' | 'corporate'
  ) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm text-gray-500">
          {documents.filter(d => d.uploaded).length}/{documents.filter(d => d.required).length} 필수
        </span>
      </div>
      <div className="space-y-3">
        {documents.map((doc, index) => (
          <div key={`${category}-${index}`} className={`border rounded-xl p-4 transition-all ${
            doc.uploaded ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-medium text-sm flex items-center">
                  {doc.name}
                  {doc.required && <span className="text-red-500 ml-1">*</span>}
                  {doc.uploaded && (
                    <Check className="w-4 h-4 text-green-600 ml-2" />
                  )}
                </h3>
                {doc.description && (
                  <p className="text-xs text-gray-500 mt-1">{doc.description}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                ref={el => {fileInputRefs.current[`${category}-${index}`] = el}}
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => handleFileSelect(category, index, e)}
                className="hidden"
                id={`file-${category}-${index}`}
                disabled={doc.uploading}
              />

              {!doc.uploaded ? (
                <label
                  htmlFor={`file-${category}-${index}`}
                  className={`flex-1 text-center py-2.5 px-4 rounded-lg border-2 border-dashed cursor-pointer transition-all text-sm ${
                    doc.uploading
                      ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                      : "border-gray-300 hover:border-[#009DA2] hover:bg-gray-50"
                  }`}
                >
                  {doc.uploading ? (
                    <span className="text-gray-500 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#009DA2] mr-2"></div>
                      업로드 중...
                    </span>
                  ) : (
                    <span className="text-gray-600 flex items-center justify-center">
                      <Upload className="w-4 h-4 mr-2" />
                      파일 선택
                    </span>
                  )}
                </label>
              ) : (
                <div className="flex-1 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                  <div className="flex items-center flex-1">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-gray-700 truncate">
                      {doc.file?.name || "업로드 완료"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setPreviewUrl(doc.url)
                        setPreviewTitle(doc.name)
                        setIsPreviewOpen(true)
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="미리보기"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveFile(category, index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="삭제"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <CareonContainer>
      <div className="flex items-center justify-start p-4 pb-0">
        <BackButton onClick={onBack} />
      </div>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-black leading-relaxed mb-6">
          필요한 서류를<br />
          등록해주세요
        </h1>

        {renderUploadSection("📑 기본 서류", basicDocuments, 'basic')}
        {renderUploadSection("📷 사업장 사진", businessPhotos, 'photos')}
        {isLegalEntity && renderUploadSection("🏢 법인 추가 서류", corporateDocuments, 'corporate')}

        <div className="mt-4 mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-medium">안내사항:</span>
          </p>
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            <li>• 파일 형식: JPG, PNG, GIF, PDF</li>
            <li>• 최대 파일 크기: 10MB</li>
            <li>• 사업장 사진은 사업자등록증 주소와 동일해야 함</li>
            <li>• 필수(*) 서류는 반드시 업로드해주세요</li>
          </ul>
        </div>
      </div>
      <div className="p-6 pt-0">
        <CareonButton onClick={handleNext} variant="teal">
          다음
        </CareonButton>
      </div>
    </CareonContainer>

    {/* Image Preview Bottom Sheet */}
    <CareonBottomSheet
      isOpen={isPreviewOpen}
      onClose={() => {
        setIsPreviewOpen(false)
        setPreviewUrl(null)
        setPreviewTitle("")
      }}
      title={previewTitle}
    >
      <div className="flex flex-col items-center">
        {previewUrl && (
          <div className="w-full max-h-[60vh] overflow-auto">
            {previewUrl.toLowerCase().endsWith('.pdf') ? (
              <iframe
                src={previewUrl}
                className="w-full h-[60vh]"
                title={previewTitle}
              />
            ) : (
              <img
                src={previewUrl}
                alt={previewTitle}
                className="w-full h-auto rounded-lg"
                style={{ maxHeight: '60vh', objectFit: 'contain' }}
              />
            )}
          </div>
        )}
        <div className="mt-4 flex gap-3 w-full">
          <label
            htmlFor="file-replace"
            className="flex-1 flex items-center justify-center py-3 px-4 bg-white border-2 border-[#009DA2] text-[#009DA2] rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
          >
            <Upload className="w-4 h-4 mr-2" />
            다시 업로드
          </label>
          <input
            id="file-replace"
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => {
              // Find which document this is and replace it
              const allDocs = [...basicDocuments, ...businessPhotos, ...corporateDocuments]
              const docIndex = allDocs.findIndex(d => d.url === previewUrl)
              if (docIndex !== -1 && e.target.files?.[0]) {
                // Determine category and index
                let category: 'basic' | 'photos' | 'corporate'
                let index: number
                if (docIndex < basicDocuments.length) {
                  category = 'basic'
                  index = docIndex
                } else if (docIndex < basicDocuments.length + businessPhotos.length) {
                  category = 'photos'
                  index = docIndex - basicDocuments.length
                } else {
                  category = 'corporate'
                  index = docIndex - basicDocuments.length - businessPhotos.length
                }
                handleFileSelect(category, index, e)
                setIsPreviewOpen(false)
              }
            }}
          />
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="flex-1 py-3 px-4 bg-[#009DA2] text-white rounded-lg hover:bg-[#008a8f] transition-all"
          >
            확인
          </button>
        </div>
      </div>
    </CareonBottomSheet>
    </>
  )
}