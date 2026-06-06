'use client';

import { useCallback, useEffect, useState } from 'react';

type HasId = { id: string };

export function reorderById<T extends HasId>(list: T[], draggedId: string, targetId: string): T[] {
  if (draggedId === targetId) return list;
  const from = list.findIndex((x) => x.id === draggedId);
  const to = list.findIndex((x) => x.id === targetId);
  if (from < 0 || to < 0) return list;
  const next = [...list];
  const [removed] = next.splice(from, 1);
  next.splice(to, 0, removed);
  return next;
}

export function useSortableReorder<T extends HasId>(sortedItems: T[]) {
  const [items, setItems] = useState<T[]>(sortedItems);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  useEffect(() => {
    setItems(sortedItems);
  }, [sortedItems]);

  const onDragStart = useCallback((id: string) => {
    setDraggedId(id);
  }, []);

  const onDragEnd = useCallback(() => {
    setDraggedId(null);
    setOverId(null);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setOverId(targetId);
  }, []);

  const commitDrop = useCallback(
    (targetId: string): T[] | null => {
      if (!draggedId || draggedId === targetId) {
        onDragEnd();
        return null;
      }
      const next = reorderById(items, draggedId, targetId);
      const unchanged = next.every((item, i) => item.id === items[i]?.id);
      if (unchanged) {
        onDragEnd();
        return null;
      }
      setItems(next);
      onDragEnd();
      return next;
    },
    [draggedId, items, onDragEnd],
  );

  return {
    items,
    draggedId,
    overId,
    onDragStart,
    onDragEnd,
    onDragOver,
    commitDrop,
    isDragging: draggedId !== null,
  };
}
