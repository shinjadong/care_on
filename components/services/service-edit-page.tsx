"use client"

import React from "react"
import { PageBuilder } from "@/components/page-builder/page-builder"

interface ServiceEditPageProps {
  slug: string;
  title: string;
  description: string;
  backPath: string;
}

export default function ServiceEditPage({ 
  slug, 
  title, 
  description, 
  backPath 
}: ServiceEditPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {title} 페이지 편집
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {description} 페이지의 콘텐츠를 관리합니다.
              </p>
            </div>
            <a
              href={backPath}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              페이지로 돌아가기
            </a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <PageBuilder slug={slug} />
      </div>
    </div>
  )
}