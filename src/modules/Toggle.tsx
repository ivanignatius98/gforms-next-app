import { useState, useRef, useEffect } from 'react'
import { Switch } from '@headlessui/react'
import { classNames } from '@helpers';

type Props = {
  handleChange: (val: boolean) => void
  value?: boolean
};
export default function Toggle({ handleChange, value }: Props) {
  // const [value, setvalue] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [active, setActive] = useState(false);
  const [clicking, setClicking] = useState(false);
  const ref = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setActive(false);
      }
    }

    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
  const glowStyle = () => {
    let rgb = ""
    if (!active && isHovered) {
      rgb = "rgba(193, 193, 193, 0.2)"
    } else if (active) {
      rgb = value ? "rgba(193, 196, 199, 0.2)" : "rgba(187, 188, 188, 0.2)"
    }
    if (clicking) {
      rgb = value ? "rgba(161, 161, 161, 0.5)" : "rgba(129,140,248, 0.5)"
    }
    return rgb ? `0 0 0 8.5px ${rgb}` : ""
  }
  return (
    <Switch
      ref={ref}
      onMouseDown={() => { setClicking(true) }}
      onMouseUp={() => { setClicking(false) }}
      onClick={() => setActive(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setClicking(false) }}
      checked={value}
      onChange={(checked: boolean) => { (handleChange ? handleChange(checked) : () => { }) }}
      className="flex-shrink-0 group relative rounded-full inline-flex outline-none items-center justify-center h-5 w-10 cursor-pointer"
    >
      <span className="sr-only"> Use setting</span >
      <span aria-hidden="true" className="pointer-events-none absolute bg-white w-full h-full rounded-md" />
      <span
        aria-hidden="true"
        className={classNames(
          value ? 'bg-indigo-400' : 'bg-gray-400',
          'pointer-events-none absolute h-4 w-9 mx-auto rounded-full  transition-colors ease-in-out duration-200'
        )}
      />
      <span
        aria-hidden="true"
        style={{
          backgroundColor: value ? "rgb(79 70 229)" : "white",
          boxShadow: glowStyle() || "none",
          borderWidth: value ? 0 : 1,
          transitionProperty: "color, background-color, transform, opacity",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          transitionDuration: "200ms",
        }}
        className={classNames(
          value ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none  absolute left-0 inline-block h-[22px] w-[22px] shadow-lg border border-gray-200 rounded-full transform ring-0'
        )}
      />
    </Switch >
  )
}
