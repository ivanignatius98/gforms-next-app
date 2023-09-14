import { getLayoutY } from "@helpers";
import React, { useMemo, useCallback, useState, useEffect, MutableRefObject, Ref, RefObject } from "react";

interface WrapperProp {
  y: number | null
  children: JSX.Element | null
  draggedItem: any | null
  onDragEnd: (index: number) => void
  move: (index: number, nextIndex: number) => void
  cardRefs: MutableRefObject<HTMLDivElement[]> | null
  layoutRef: RefObject<HTMLDivElement> | null
  staticCard?: boolean | null
}
interface dragProp {
  current: number | null
  prev: number | null
  isFirstCard: boolean | null
  isLastCard: boolean | null
}
const DragWrapper = ({
  y,
  children,
  draggedItem,
  onDragEnd,
  cardRefs,
  move,
  layoutRef,
  staticCard = false,
}: WrapperProp) => {
  const [dragY, setDragY] = useState(y);

  useEffect(() => {
    setDragY(y);
  }, [y]);
  const defaultDragState = {
    current: null,
    prev: null,
    isFirstCard: null,
    isLastCard: null
  }
  const [drag, setDrag] = useState<dragProp>(defaultDragState)


  const handleDragChange = (nextIndex: number, index: number | null) => {
    setDrag(() => {
      const dragCurrent = nextIndex
      const isLastCard = dragCurrent >= (cardRefs ? cardRefs.current.length - 1 : 0)
      const isFirstCard = dragCurrent === 0
      return {
        current: nextIndex,
        prev: index,
        isLastCard,
        isFirstCard
      }
    })
  }

  useEffect(() => {
    if (draggedItem != null) {
      handleDragChange(draggedItem.index, null)
    }
  }, [draggedItem]);
  const getYCoordFromEvent = (event: any) => {
    let yCoordinate = 0
    if (event.touches && event.touches.length > 0) {
      // It's a touchmove event
      yCoordinate = event.touches[0].clientY;
    } else {
      // It's a mousemove event
      yCoordinate = event.clientY;
    }
    return yCoordinate
  }
  const handleDragging = useCallback((event: any) => {
    const yCoordinate = getYCoordFromEvent(event)
    if (yCoordinate <= 0) {
      return;
    }
    const shift = (index: number, direction: "up" | "down") => {
      const nextIndex = direction === "up" ? index - 1 : index + 1
      if (nextIndex >= 0 && nextIndex < (cardRefs ? cardRefs?.current.length : 0) && index !== drag.prev) {
        handleDragChange(nextIndex, index)
        move(index, nextIndex)
      }
    }
    if (drag.current == null || drag.current == drag.prev) {
      return
    }
    if (!cardRefs)
      return

    if (!drag.isLastCard) {
      const nextY = getLayoutY(cardRefs.current[drag.current + 1]) + 12
      if (yCoordinate > nextY) {
        shift(drag.current, "down")
      }
    }
    if (!drag.isFirstCard) {
      const prevY = getLayoutY(cardRefs.current[drag.current - 1]) + 12
      if (yCoordinate < prevY) {
        shift(drag.current, "up")
      }
    }


    if (staticCard) {
      const cardHeight = 48
      const newCoord = yCoordinate - (getLayoutY(layoutRef?.current as HTMLDivElement) ?? 0) - 16
      if (newCoord > 0 && newCoord < (cardHeight * (cardRefs.current.length - 1))) {
        setDragY(newCoord)
      }
    } else {
      setDragY(yCoordinate - (getLayoutY(layoutRef?.current as HTMLDivElement) ?? 0) - 16)
    }
    // setDragY(yCoordinate - 150);
  }, [cardRefs, drag, move]);

  const handleDragEnd = () => {
    onDragEnd(drag.current ?? 0)
    setTimeout(() => {
      setDrag(defaultDragState)
    }, 10);
  }
  useEffect(() => {
    if (draggedItem != null) {
      window.addEventListener('mousemove', handleDragging)
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('touchmove', handleDragging)
      window.addEventListener('touchend', handleDragEnd)
    }
    return () => {
      window.removeEventListener('mousemove', handleDragging)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('touchmove', handleDragging)
      window.removeEventListener('touchend', handleDragEnd)
    }

  }, [handleDragging, draggedItem])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (drag.current == null) {
      return;
    }
    const y = getYCoordFromEvent(event)
    const windowHeight = window.innerHeight;
    const offset = windowHeight - y;
    const bottomBreakpoint = 150;
    const getScrollSpeed = (yOffset: number) => {
      const scrollSpeed = 20;
      if (yOffset < (bottomBreakpoint / 2)) {
        return 50;
      }
      if (yOffset < scrollSpeed) {
        return 100;
      }
      return scrollSpeed;
    }
    const lastCardRect = cardRefs ? getLayoutY(cardRefs.current[cardRefs.current.length - 1]) : 0
    if (y - offset < lastCardRect && offset < bottomBreakpoint) {
      window.scrollTo(0, window.pageYOffset + getScrollSpeed(offset))
    } else if (y < bottomBreakpoint) {
      window.scrollTo(0, window.pageYOffset - getScrollSpeed(y))
    }
  }
  return (
    <div
      className='relative'
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
    >
      <div
        style={{ top: dragY ?? 0 }}
        className='absolute z-20 w-full opacity-50'
      >
        {children}
      </div>
    </div>
  );
}

export default DragWrapper