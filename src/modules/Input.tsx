import { useState, Fragment, useMemo, Ref } from 'react';
import { Transition } from '@headlessui/react'

type Props = {
  children?: JSX.Element,
  value: string,
  name?: string,
  onChange?: (e: React.ChangeEvent<any>) => void,
  containerClass?: string,
  placeholder?: string,
  label?: string,
  alwaysHighlight?: boolean,
  className?: string,
  autoFocus?: boolean,
  inputRef?: Ref<HTMLInputElement>
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
const Input: React.FC<Props> = (props) => {
  const [isShowing, setIsShowing] = useState(false)
  return (
    <div>
      {props.label &&
        <label className="block text-sm font-medium text-gray-700">
          {props.label}
        </label>
      }
      <div
        className={props.containerClass + ` bg-white`}
      >
        <input
          ref={props.inputRef}
          autoFocus={props.autoFocus}
          spellCheck={false}
          placeholder={props.placeholder}
          className={'outline-none my-1 w-full ' + props.className}
          value={props.value}
          onChange={(event) => {
            (props.onChange ? props.onChange(event) : () => { })
          }}
          onFocus={({ target }) => {
            setIsShowing(true)
            if (props.alwaysHighlight) {
              target.select()
            }
          }}
          onBlur={() => setIsShowing(false)}
        />
        <div className='h-0.5' >
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
            <div className="h-[1px] w-full rounded-md bg-blue-500 shadow-lg overflow-hidden" />
          </Transition>
          <div className=' h-[1px] w-full bg-slate-300'></div>
        </div>
      </div>
    </div>
  )
}

export default Input