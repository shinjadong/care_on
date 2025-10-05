"use client"

interface BackButtonProps {
  onClick: () => void
  className?: string
}

export function BackButton({ onClick, className = "" }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${className}`}
      aria-label="뒤로가기"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-700"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
    </button>
  )
}
