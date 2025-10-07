export type BlockType = 'hero' | 'heading' | 'text' | 'image' | 'video' | 'button' | 'html' | 'spacer' | 'columns' | 'gallery' | 'card' | 'form'

export interface Block {
  id: string
  type: BlockType
  content: any
  settings?: {
    margin?: {
      top?: number
      bottom?: number
      left?: number
      right?: number
    }
    padding?: {
      top?: number
      bottom?: number
      left?: number
      right?: number
    }
    backgroundColor?: string
    textColor?: string
    fontSize?: string
    textAlign?: 'left' | 'center' | 'right'
    width?: string
    height?: string
    borderRadius?: number
    shadow?: boolean
    animation?: string
  }
}

export interface Page {
  id: string
  slug: string
  title: string
  blocks: Block[]
  created_at: string
  updated_at: string
}

export interface HeroBlockContent {
  title: string
  subtitle?: string
  backgroundImage?: string
  overlay?: boolean
  overlayOpacity?: number
  buttons?: Array<{
    text: string
    link: string
    variant: 'default' | 'outline' | 'ghost'
    size: 'sm' | 'md' | 'lg'
  }>
}

export interface HeadingBlockContent {
  text: string
  level: 1 | 2 | 3 | 4 | 5 | 6
}

export interface TextBlockContent {
  text: string
}

export interface ImageBlockContent {
  src: string
  alt: string
  caption?: string
}

export interface VideoBlockContent {
  src: string
  poster?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
}

export interface ButtonBlockContent {
  text: string
  link: string
  variant: 'default' | 'outline' | 'ghost'
  size: 'sm' | 'md' | 'lg'
}

export interface HtmlBlockContent {
  html: string
}

export interface SpacerBlockContent {
  height: number
}

export interface WadizStoryImage {
  id: string
  src: string
  alt?: string
  caption?: string
  width?: number
  height?: number
}

export interface WadizStoryBlockContent {
  images: WadizStoryImage[]
}
