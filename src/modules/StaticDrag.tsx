import { getLayoutY, getYCoordFromEvent } from "@helpers";
import React, { useMemo, useCallback, useState, useEffect, MutableRefObject, Ref, RefObject, useRef } from "react";

interface WrapperProp {
  y: number | null
  children: JSX.Element | null
  draggedItem: any | null
  onDragEnd: () => void
  move: (index: number, nextIndex?: number) => void
  cardRefs: MutableRefObject<HTMLDivElement[]> | null
  manualOffset?: number
}
const DragWrapper = ({
  y,
  children,
  draggedItem,
  onDragEnd,
  cardRefs,
  move,
  manualOffset = 0,
}: WrapperProp) => {
  const [dragY, setDragY] = useState(y);

  useEffect(() => {
    setDragY(y);
  }, [y]);

  const currentDrag = useRef<number>(-1)

  useEffect(() => {
    if (draggedItem != null) {
      currentDrag.current = draggedItem.index
    }
  }, [draggedItem]);

  interface boundaryType {
    start: number
    end: number
  }
  const [boundaries, setBoundaries] = useState<boundaryType>({ start: 0, end: 0 })
  useEffect(() => {
    setBoundaries(() => {
      if (!cardRefs) return { start: 0, end: 0 }

      const startingBoundary = getLayoutY(cardRefs.current[0]) - manualOffset
      const endingBoundary = getLayoutY(cardRefs.current[cardRefs.current.length - 1]) - manualOffset
      return { start: startingBoundary, end: endingBoundary }
    })
  }, [cardRefs, manualOffset])

  const handleDragging = useCallback((event: any) => {
    const yCoordinate = getYCoordFromEvent(event)
    if (!cardRefs || currentDrag.current < 0)
      return

    const cardHeight = cardRefs.current[0].getBoundingClientRect().height
    const newCoord = yCoordinate - (cardHeight / 2) - manualOffset
    let newIndex = -1
    if (newCoord < boundaries.start) {
      newIndex = 0
      setDragY(boundaries.start)
    } else if (newCoord > boundaries.end) {
      setDragY(boundaries.end)
      newIndex = cardRefs.current.length - 1
    } else {
      setDragY(newCoord)

      const upBoundary = boundaries.start + ((currentDrag.current - 1) * cardHeight)
      const botBoundary = boundaries.start + ((currentDrag.current + 1) * cardHeight)

      if (newCoord < upBoundary) {
        newIndex = currentDrag.current - 1
      } else if (newCoord > botBoundary) {
        newIndex = currentDrag.current + 1
      } else {
        newIndex = currentDrag.current
      }
    }

    if (currentDrag.current != newIndex) {
      move(newIndex)
      currentDrag.current = newIndex
    }
  }, [setDragY, draggedItem, cardRefs, boundaries]);

  const handleDragEnd = () => {
    onDragEnd()
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleDragging)
    window.addEventListener('mouseup', handleDragEnd)
    window.addEventListener('touchmove', handleDragging)
    window.addEventListener('touchend', handleDragEnd)
    return () => {
      window.removeEventListener('mousemove', handleDragging)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('touchmove', handleDragging)
      window.removeEventListener('touchend', handleDragEnd)
    }
  }, [handleDragging, draggedItem, boundaries])

  return (
    <div
      style={{ top: dragY ?? 0, width: cardRefs?.current[0].getBoundingClientRect().width }}
      className='fixed z-20 opacity-75'
    >
      {children}
    </div>
  );
}

export default DragWrapper