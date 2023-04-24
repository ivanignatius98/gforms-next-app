import { useState, Fragment, useRef, Ref, useEffect } from 'react';
import { Transition } from '@headlessui/react'
import { classNames } from '@helpers';

type Props = {
  children?: JSX.Element,
  value: string,
  name?: string,
  onChange?: (e: React.ChangeEvent<any>) => void,
  onFocus?: () => void,
  onBlur?: (e: React.ChangeEvent<any>) => void,
  containerClass?: string,
  placeholder?: string,
  label?: string,
  alwaysHighlight?: boolean,
  className?: string,
  autoFocus?: boolean,
  error?: boolean | string,
  inputRef?: Ref<HTMLInputElement>
  underline?: boolean
  showOnHover?: boolean
  readOnly?: boolean
  disabled?: boolean
  showFooter?: boolean
  style?: object

}

const Input: React.FC<Props> = ({ showOnHover = false, underline = true, showFooter = true, value, ...props }) => {
  const [isShowing, setIsShowing] = useState(false)

  return (
    <div>
      {props.label &&
        <label className="block text-sm font-medium text-gray-700">
          {props.label}
        </label>
      }
      <div className={props.containerClass + ` bg-white`} >
        <input
          readOnly={props.readOnly}
          name={props.name}
          ref={props.inputRef}
          autoFocus={props.autoFocus}
          spellCheck={false}
          placeholder={props.placeholder}
          value={value}
          className={'outline-none my-1 w-full ' + props.className}
          onChange={(event) => { props.onChange?.(event) }}
          onFocus={(event) => {
            setIsShowing(true)
            if (props.alwaysHighlight) {
              event.target.select()
            }
            props.onFocus?.()
          }}
          onBlur={(event) => {
            setIsShowing(false);
            props.onBlur?.(event)
          }}
          disabled={props.disabled}
          style={props.style}
        />
        {showFooter && (
          <div className={classNames('h-0.5')}>
            <div className={classNames(showOnHover ? "hidden group-hover:block group-focus-within:block" : "")} >
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
                <div className={classNames(
                  props.error
                    ? 'bg-red-500'
                    : 'bg-blue-500',
                  "h-[1px] w-full rounded-md bg-blue-500 shadow-lg overflow-hidden"
                )} />
              </Transition>
              <div className={classNames(
                props.error && isShowing
                  ? 'bg-red-300'
                  : 'bg-slate-300',
                ' h-[1px] w-full'
              )} ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Input