'use client';

import { motion, AnimationControls, useAnimation, useInView } from 'framer-motion';
import { useRef, useEffect, ReactNode } from 'react';
import { Block } from '@/types/page-builder';

interface MotionWrapperProps {
  children: ReactNode;
  block: Block;
  isEditing?: boolean;
}

// 애니메이션 프리셋 정의
const animationPresets = {
  none: {
    initial: {},
    animate: {},
    transition: {}
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  },
  slideDown: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  },
  slideLeft: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  },
  slideRight: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  bounce: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { 
      duration: 0.8, 
      type: "spring", 
      damping: 12,
      stiffness: 100 
    }
  },
  rotate: {
    initial: { opacity: 0, rotate: -10, scale: 0.8 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export function MotionWrapper({ children, block, isEditing }: MotionWrapperProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-100px 0px -100px 0px" // 스크롤 트리거 여백
  });

  // 블록의 애니메이션 설정 가져오기
  const animationType = block.settings?.animation?.type || 'none';
  const animationDelay = block.settings?.animation?.delay || 0;
  const customDuration = block.settings?.animation?.duration;
  
  const preset = animationPresets[animationType as keyof typeof animationPresets] || animationPresets.none;
  
  // 커스텀 duration이 있으면 적용
  const transition = customDuration 
    ? { ...preset.transition, duration: customDuration }
    : preset.transition;

  // 편집 모드에서는 애니메이션 비활성화 (편집 편의성)
  if (isEditing) {
    return <div ref={ref}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={preset.initial}
      animate={isInView ? preset.animate : preset.initial}
      transition={{
        ...transition,
        delay: animationDelay
      }}
      className="motion-block"
    >
      {children}
    </motion.div>
  );
}

// 애니메이션 프리셋 목록 (다른 컴포넌트에서 import용)
export { animationPresets };
