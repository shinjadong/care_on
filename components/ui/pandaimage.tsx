interface PandaImageProps {
  type: "shield" | "check"
  className?: string
}

export function PandaImage({ type, className }: PandaImageProps) {
  if (type === "shield") {
    return (
      <div className={`w-30 h-30 flex items-center justify-center ${className}`}>
        <img
          src="https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%ED%8C%90%ED%8C%90%EC%A6%88.gif"
          alt="판판즈 캐릭터"
          className="w-30 h-30 object-contain"
        />
      </div>
    )
  }

  if (type === "check") {
    return (
      <div className={`w-16 h-16 border-3 border-[#009da2] rounded-full flex items-center justify-center ${className}`}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#009da2]">
          <path
            d="M9 12L11 14L15 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    )
  }

  return null
}
