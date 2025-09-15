"use client"

import { useEffect, useCallback, useState } from 'react';
import { Block } from '@/types/page-builder';

interface KeyboardShortcutsProps {
  blocks: Block[];
  setBlocks: (blocks: Block[]) => void;
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
  onAddBlock?: (type: string) => void;
}

export function useKeyboardShortcuts({
  blocks,
  setBlocks,
  selectedBlockId,
  setSelectedBlockId,
  onAddBlock
}: KeyboardShortcutsProps) {
  // 히스토리 스택 for Undo/Redo
  const [history, setHistory] = useState<Block[][]>([blocks]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [copiedBlock, setCopiedBlock] = useState<Block | null>(null);

  // 히스토리에 현재 상태 저장
  const saveToHistory = useCallback((newBlocks: Block[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newBlocks]);

    // 히스토리 크기 제한 (최대 50개)
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(prev => prev + 1);
    }

    setHistory(newHistory);
  }, [history, historyIndex]);

  // Undo 기능
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setBlocks([...prevState]);
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex, setBlocks]);

  // Redo 기능
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setBlocks([...nextState]);
      setHistoryIndex(prev => prev + 1);
    }
  }, [history, historyIndex, setBlocks]);

  // 블록 복사
  const copyBlock = useCallback(() => {
    if (selectedBlockId) {
      const blockToCopy = blocks.find(b => b.id === selectedBlockId);
      if (blockToCopy) {
        setCopiedBlock({ ...blockToCopy });
      }
    }
  }, [selectedBlockId, blocks]);

  // 블록 붙여넣기
  const pasteBlock = useCallback(() => {
    if (copiedBlock && selectedBlockId) {
      const selectedIndex = blocks.findIndex(b => b.id === selectedBlockId);
      const newBlock = {
        ...copiedBlock,
        id: `${copiedBlock.type}-${Date.now()}`,
      };

      const newBlocks = [...blocks];
      newBlocks.splice(selectedIndex + 1, 0, newBlock);

      setBlocks(newBlocks);
      saveToHistory(newBlocks);
      setSelectedBlockId(newBlock.id);
    }
  }, [copiedBlock, selectedBlockId, blocks, setBlocks, saveToHistory, setSelectedBlockId]);

  // 블록 복제
  const duplicateBlock = useCallback(() => {
    if (selectedBlockId) {
      const blockToDuplicate = blocks.find(b => b.id === selectedBlockId);
      if (blockToDuplicate) {
        const selectedIndex = blocks.findIndex(b => b.id === selectedBlockId);
        const newBlock = {
          ...blockToDuplicate,
          id: `${blockToDuplicate.type}-${Date.now()}`,
        };

        const newBlocks = [...blocks];
        newBlocks.splice(selectedIndex + 1, 0, newBlock);

        setBlocks(newBlocks);
        saveToHistory(newBlocks);
        setSelectedBlockId(newBlock.id);
      }
    }
  }, [selectedBlockId, blocks, setBlocks, saveToHistory, setSelectedBlockId]);

  // 블록 삭제
  const deleteBlock = useCallback(() => {
    if (selectedBlockId) {
      const newBlocks = blocks.filter(b => b.id !== selectedBlockId);
      setBlocks(newBlocks);
      saveToHistory(newBlocks);
      setSelectedBlockId(null);
    }
  }, [selectedBlockId, blocks, setBlocks, saveToHistory, setSelectedBlockId]);

  // 블록 간 이동 (Arrow Keys)
  const navigateBlocks = useCallback((direction: 'up' | 'down') => {
    if (!selectedBlockId) return;

    const currentIndex = blocks.findIndex(b => b.id === selectedBlockId);
    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === 'up' && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < blocks.length - 1) {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex !== undefined) {
      setSelectedBlockId(blocks[nextIndex].id);
    }
  }, [selectedBlockId, blocks, setSelectedBlockId]);

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 입력 중인 경우 단축키 무시
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        return;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      if (isCtrlOrCmd) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 'c':
            e.preventDefault();
            copyBlock();
            break;
          case 'v':
            e.preventDefault();
            pasteBlock();
            break;
          case 'd':
            e.preventDefault();
            duplicateBlock();
            break;
        }
      } else {
        switch (e.key) {
          case 'Delete':
          case 'Backspace':
            e.preventDefault();
            deleteBlock();
            break;
          case 'ArrowUp':
            e.preventDefault();
            navigateBlocks('up');
            break;
          case 'ArrowDown':
            e.preventDefault();
            navigateBlocks('down');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, copyBlock, pasteBlock, duplicateBlock, deleteBlock, navigateBlocks]);

  // 블록이 변경될 때 히스토리 업데이트 (디바운싱)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (JSON.stringify(blocks) !== JSON.stringify(history[historyIndex] || [])) {
        saveToHistory(blocks);
      }
    }, 1000); // 1초 디바운싱

    return () => clearTimeout(timer);
  }, [blocks, history, historyIndex, saveToHistory]);

  return {
    // 히스토리 상태
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    hasCopiedBlock: !!copiedBlock,

    // 액션 함수들
    undo,
    redo,
    copyBlock,
    pasteBlock,
    duplicateBlock,
    deleteBlock,

    // 단축키 정보
    shortcuts: {
      'Ctrl+Z': 'Undo',
      'Ctrl+Y / Ctrl+Shift+Z': 'Redo',
      'Ctrl+C': 'Copy Block',
      'Ctrl+V': 'Paste Block',
      'Ctrl+D': 'Duplicate Block',
      'Delete': 'Delete Block',
      'Arrow Up/Down': 'Navigate Blocks'
    }
  };
}