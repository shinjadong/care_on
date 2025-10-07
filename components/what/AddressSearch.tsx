"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

declare global {
  interface Window {
    daum: any
  }
}

interface AddressSearchProps {
  onComplete: (data: {
    address: string
    zonecode: string
    buildingName?: string
    bname?: string
    roadAddress?: string
  }) => void
  placeholder?: string
  value?: string
}

export default function AddressSearch({ onComplete, placeholder = "클릭하여 주소 검색", value = "" }: AddressSearchProps) {
  const [address, setAddress] = useState(value)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  useEffect(() => {
    setAddress(value)
  }, [value])

  const handleClick = () => {
    if (!isScriptLoaded || !window.daum) {
      alert("주소 검색 서비스를 로딩중입니다. 잠시 후 다시 시도해주세요.")
      return
    }

    new window.daum.Postcode({
      oncomplete: function(data: any) {
        let fullAddress = data.address
        let extraAddress = ""
        
        if (data.addressType === "R") {
          if (data.bname !== "") {
            extraAddress += data.bname
          }
          if (data.buildingName !== "") {
            extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName
          }
          fullAddress += extraAddress !== "" ? ` (${extraAddress})` : ""
        }

        setAddress(fullAddress)
        onComplete({
          address: fullAddress,
          zonecode: data.zonecode,
          buildingName: data.buildingName,
          bname: data.bname,
          roadAddress: data.roadAddress
        })
      },
      theme: {
        bgColor: "#FFFFFF",
        searchBgColor: "#FFFFFF",
        contentBgColor: "#FFFFFF",
        pageBgColor: "#FAFAFA",
        textColor: "#333333",
        queryTextColor: "#222222",
        postcodeTextColor: "#FA4256",
        emphTextColor: "#008FFD",
        outlineColor: "#E0E0E0"
      }
    }).open()
  }

  return (
    <>
      <Script 
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        onLoad={() => setIsScriptLoaded(true)}
        strategy="lazyOnload"
      />
      <div className="relative">
        <input
          type="text"
          value={address}
          onClick={handleClick}
          placeholder={placeholder}
          readOnly
          className="w-full rounded-xl border border-gray-300 px-3 py-2 cursor-pointer hover:border-gray-400 focus:border-black focus:outline-none bg-white"
        />
        {address && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setAddress("")
              onComplete({
                address: "",
                zonecode: ""
              })
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
    </>
  )
}
