
import { useRef } from 'react';
type Props = {
  children: JSX.Element,
  tooltipText: string,
  orientation?: string,
  showPointer?: boolean
};

const Tooltip: React.FC<Props> = ({ children, tooltipText, orientation = "bottom", showPointer = true }) => {
  const tipRef = useRef<HTMLInputElement>(null);

  const handleMouseEnter = () => {
    if (tipRef.current != null) {
      tipRef.current.style.opacity = "1";
    }
  }
  const handleMouseLeave = () => {
    if (tipRef.current != null) {
      tipRef.current.style.opacity = "0";
    }
  }
  const orientations = {
    right: 'right',
    top: 'top',
    left: 'left',
    bottom: 'bottom',
  }
  const setContainerPosition = (orientation: string) => {
    let classnames
    switch (orientation) {
      case orientations.right:
        classnames = 'top-0 left-full ml-4'
        break
      case orientations.left:
        classnames = 'top-0 right-full mr-4'
        break
      case orientations.top:
        classnames = 'bottom-[85%] left-[50%] translate-x-[-50%] -translate-y-2'
        break
      case orientations.bottom:
        classnames = 'top-[85%] left-[50%] translate-x-[-50%] translate-y-2'
        break
      default:
        break
    }
    return classnames
  }

  const setPointerPosition = (orientation: string) => {
    let classnames
    switch (orientation) {
      case orientations.right:
        classnames = 'left-[-6px]'
        break
      case orientations.left:
        classnames = 'right-[-6px]'
        break
      case orientations.top:
        classnames = 'top-full left-[50%] translate-x-[-50%] -translate-y-2'
        break
      case orientations.bottom:
        classnames = 'bottom-full left-[50%] translate-x-[-50%] translate-y-2'
        break

      default:
        break
    }

    return classnames
  }
  const classContainer = `w-max absolute z-10 ${setContainerPosition(
    orientation
  )} bg-gray-600 text-white text-xs px-2 py-1 rounded flex items-center transition-all duration-150 pointer-events-none`

  const pointerClasses = `bg-gray-600 h-3 w-3 absolute z-10 ${setPointerPosition(
    orientation
  )} rotate-45 pointer-events-none`


  return (
    <div
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={classContainer}
        style={{ opacity: 0 }}
        ref={tipRef}
      >
        {showPointer ? <div className={pointerClasses} /> : null}
        {tooltipText}
      </div>
      {children}
    </div>
  );
}
export default Tooltip;
