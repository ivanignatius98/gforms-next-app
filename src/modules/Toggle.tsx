/* This example requires Tailwind CSS v2.0+ */
import { useState, useRef, useEffect } from 'react'
import { Switch } from '@headlessui/react'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [enabled, setEnabled] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setActive(false);
      }
    }

    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
  return (
    <Switch
      ref={ref}
      onClick={() => setActive(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      checked={enabled}
      onChange={setEnabled}
      className="flex-shrink-0 group relative rounded-full inline-flex outline-none items-center justify-center h-5 w-10 cursor-pointer"
    >
      <span className="sr-only">Use setting</span>
      <span aria-hidden="true" className="pointer-events-none absolute bg-white w-full h-full rounded-md" />
      <span
        aria-hidden="true"
        className={classNames(
          enabled ? 'bg-indigo-600' : 'bg-gray-200',
          'pointer-events-none absolute h-4 w-9 mx-auto rounded-full  transition-colors ease-in-out duration-200'
        )}
      />
      <span
        aria-hidden="true"
        style={{
          backgroundColor: enabled ? "rgb(103 232 249)" : "white",
          boxShadow: active ? "0 0 0 10px rgba(79, 70, 229, 0.5)" : "",
        }}
        className={classNames(
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none  absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full  transform ring-0 transition-transform ease-in-out duration-200'
        )}
      />
    </Switch>
  )
}
