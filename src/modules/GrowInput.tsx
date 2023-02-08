import { useState, Fragment, useRef, useMemo, useEffect } from 'react';
import { Transition } from '@headlessui/react'

type Props = {
  value: string,
  onChange: (e: React.ChangeEvent<any>) => void,
  onBlur?: () => void,
  containerClass?: string,
  placeholder?: string,
  minW?: number,
  maxW?: number
};

const Input: React.FC<Props> = ({ minW = 18, maxW = 384, ...props }) => {
  const [isShowing, setIsShowing] = useState(false)
  const [showInput, setShowInput] = useState(true)
  const [width, setWidth] = useState(minW)
  const contentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (props.value[props.value.length - 1] != " ") {
      const curW = contentRef.current?.clientWidth ?? minW
      let newW = curW + 7
      if (curW < minW) {
        newW = minW
      } else if (curW > maxW) {
        newW = maxW
      }
      setWidth(newW)
    }
  }, [props.value, minW, maxW])

  const handleAddSpace = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (width > minW && width < maxW && event.key == " " && props.value[props.value.length - 1] != " ") {
      setWidth(width + 5)
    }
  }
  return (
    showInput ? (
      <div
        className={`inline-grid items-center min-w-[${minW}px]` + (props.containerClass || "")}
        style={{ width }}
      >
        <input
          onKeyDown={handleAddSpace}
          autoFocus
          spellCheck={false}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          style={{ gridArea: '1 / 1 / 1 / 1' }}
          className="w-full outline-none max-w-sm text-md"
          onFocus={() => {
            setIsShowing(true)
          }}
          onBlur={() => {
            setIsShowing(false)
            if (props.value == "") setShowInput(false)
          }}
        />
        <span
          style={{ gridArea: '1 / 1 / 1 / 1' }}
          className="w-fit invisible whitespace-nowrap max-w-sm text-md"
          ref={contentRef}
        >
          {props.value}
        </span>
        <div className='h-0.5'>
          <Transition
            as={Fragment}
            show={isShowing}
            enter="transform transition duration-200"
            enterFrom="scale-x-0"
            enterTo=" scale-100"
            leave="transform transition ease-in-out duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95 "
          >
            <div className="h-full w-full rounded-md bg-blue-500 shadow-lg overflow-hidden" />
          </Transition>
        </div>
      </div>
    ) :
      <div className='ml-2 ' onClick={() => { setShowInput(true) }}>{props.placeholder}</div>
  )
}

export default Input