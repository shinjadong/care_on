"use client"

import { memo, useCallback } from 'react';
import { FixedSizeList as List, areEqual } from 'react-window';
import { Block } from '@/types/page-builder';
import { BlockRenderer } from './block-renderer';

interface VirtualizedBlockListProps {
  blocks: Block[];
  isEditing: boolean;
  onUpdate: (block: Block) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  selectedBlockId: string | null;
  onSelect: (id: string) => void;
  height?: number;
  itemHeight?: number;
}

interface BlockRowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    blocks: Block[];
    isEditing: boolean;
    onUpdate: (block: Block) => void;
    onDelete: (id: string) => void;
    onMoveUp: (id: string) => void;
    onMoveDown: (id: string) => void;
    selectedBlockId: string | null;
    onSelect: (id: string) => void;
  };
}

const BlockRow = memo(({ index, style, data }: BlockRowProps) => {
  const {
    blocks,
    isEditing,
    onUpdate,
    onDelete,
    onMoveUp,
    onMoveDown,
    selectedBlockId,
    onSelect
  } = data;

  const block = blocks[index];
  if (!block) return null;

  return (
    <div style={style}>
      <div className="px-2">
        <BlockRenderer
          block={block}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          canMoveUp={index > 0}
          canMoveDown={index < blocks.length - 1}
        />
      </div>
    </div>
  );
}, areEqual);

BlockRow.displayName = 'BlockRow';

export const VirtualizedBlockList = memo(function VirtualizedBlockList({
  blocks,
  isEditing,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  selectedBlockId,
  onSelect,
  height = 800,
  itemHeight = 200
}: VirtualizedBlockListProps) {
  const itemData = useCallback(() => ({
    blocks,
    isEditing,
    onUpdate,
    onDelete,
    onMoveUp,
    onMoveDown,
    selectedBlockId,
    onSelect
  }), [blocks, isEditing, onUpdate, onDelete, onMoveUp, onMoveDown, selectedBlockId, onSelect]);

  // 블록이 20개 이하면 일반 렌더링, 20개 초과면 가상화
  if (blocks.length <= 20) {
    return (
      <div className="space-y-2">
        {blocks.map((block, index) => (
          <div key={block.id}>
            <BlockRenderer
              block={block}
              isEditing={isEditing}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              canMoveUp={index > 0}
              canMoveDown={index < blocks.length - 1}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="virtualized-container">
      <List
        height={height}
        itemCount={blocks.length}
        itemSize={itemHeight}
        itemData={itemData()}
        width="100%"
        className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {BlockRow}
      </List>
    </div>
  );
});

VirtualizedBlockList.displayName = 'VirtualizedBlockList';