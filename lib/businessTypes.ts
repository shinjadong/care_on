export type BusinessType = { 
  id: number; 
  label: string; 
  emoji?: string;
}

export const BUSINESS_TYPES: BusinessType[] = [
  { id: 1,  label: "음식·외식·배달", emoji: "🍱" },
  { id: 2,  label: "카페·제과·디저트", emoji: "☕" },
  { id: 3,  label: "호프·주점·포차", emoji: "🍺" },
  { id: 4,  label: "스마트스토어·쇼핑몰", emoji: "🛒" },
  { id: 5,  label: "무인 창업", emoji: "🤖" },
  { id: 6,  label: "일반소매점·편의점", emoji: "🏪" },
  { id: 7,  label: "미용·뷰티·네일", emoji: "💅" },
  { id: 8,  label: "스터디·학원·교육", emoji: "📚" },
  { id: 9,  label: "애견샵·반려동물", emoji: "🐶" },
  { id: 10, label: "숙박업·펜션·모텔", emoji: "🏨" },
  { id: 11, label: "레저·오락·스크린", emoji: "🎳" },
  { id: 12, label: "헬스장·레슨샵", emoji: "🏋️" },
  { id: 13, label: "제조업·유통업", emoji: "🏭" },
  { id: 14, label: "스타트업·1인기업", emoji: "🚀" },
  { id: 15, label: "노점·푸드트럭", emoji: "🚚" },
  { id: 16, label: "전문서비스·기술창업", emoji: "🛠️" },
]

export const getBusinessTypeLabel = (id?: number) =>
  BUSINESS_TYPES.find(b => b.id === id)?.label ?? ""
