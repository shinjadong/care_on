"use client"

import { useState, useEffect } from "react"

const navLinks = [
  { name: "수업 소개", target: "academy" },
  { name: "커리큘럼", target: "curriculum" },
  { name: "후기", target: "review" },
  { name: "신청하기", target: "apply" },
]

export function StickyNav() {
  const [isSticky, setIsSticky] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      const heroSectionHeight = window.innerHeight
      if (window.scrollY > heroSectionHeight) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }

      let currentSection = ""
      navLinks.forEach((link) => {
        const section = document.getElementById(link.target)
        if (section && window.scrollY >= section.offsetTop - 100) {
          currentSection = link.target
        }
      })
      setActiveSection(currentSection)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (targetId: string) => {
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Adjust for sticky nav height
        behavior: "smooth",
      })
    }
  }

  return (
    <div
      className={`transition-all duration-300 bg-teal-600 ${
        isSticky ? "sticky top-[128px] lg:top-[128px] shadow-lg z-40" : "relative"
      }`}
    >
      <div className="container mx-auto px-4">
        <ul className="flex justify-center items-center h-14">
          {navLinks.map((link) => (
            <li key={link.name} className="flex-1 text-center">
              <button
                onClick={() => scrollToSection(link.target)}
                className={`w-full h-full text-white font-semibold transition-colors duration-300 ${
                  activeSection === link.target ? "border-b-2 border-white" : "opacity-80 hover:opacity-100"
                }`}
              >
                {link.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
