import React from "react";
import Link from "next/link";

interface StaticServicePageProps {
  title: string;
  description: string;
  editPath: string;
}

export default function StaticServicePage({ 
  title, 
  description, 
  editPath 
}: StaticServicePageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-6">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {title} 페이지를 생성해주세요
        </h1>
        <p className="text-gray-600 mb-6">
          아직 {description} 콘텐츠가 없습니다.<br />
          페이지 편집기에서 콘텐츠를 추가해보세요.
        </p>
        <Link
          href={editPath}
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>페이지 편집하기</span>
        </Link>
      </div>
    </div>
  );
}