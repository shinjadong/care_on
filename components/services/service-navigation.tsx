"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface ServiceNavigationProps {
  basePath: string;
  title: string;
  subServices: {
    id: string;
    name: string;
    path: string;
  }[];
}

export default function ServiceNavigation({ 
  basePath, 
  title, 
  subServices 
}: ServiceNavigationProps) {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8 py-4">
          {/* 메인 서비스 링크 */}
          <Link
            href={basePath}
            className={cn(
              "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
              pathname === basePath
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            {title} 전체
          </Link>

          {/* 하위 서비스 링크들 */}
          {subServices.map((service) => (
            <Link
              key={service.id}
              href={service.path}
              className={cn(
                "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                pathname === service.path || pathname.startsWith(service.path + "/")
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              {service.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
