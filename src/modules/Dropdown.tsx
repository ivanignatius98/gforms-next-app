
import { useRef, useState, useEffect } from 'react';
import { BiUndo, BiRedo, BiDotsVerticalRounded } from 'react-icons/bi';
import Tooltip from './Tooltip'
type Props = {
  children?: JSX.Element,
  tooltipText?: string,
  orientation?: string,
  showPointer?: boolean,
  show?: boolean,
  additionalContainerClass?: string
};

const Dropdown: React.FC<Props> = ({ children, tooltipText, orientation = "bottom", showPointer = true, additionalContainerClass = "", show = true }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  const dropdown = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showSidebar) return;
    const handleClick = ({ target }: MouseEvent) => {
      if (dropdown.current && !dropdown.current.contains(target as HTMLElement)) {
        console.log("fired")
        setShowSidebar(false)
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [showSidebar]);

  return (
    <Tooltip
      tooltipText="More"
      orientation="bottom"
      showPointer={false}
      show={!showSidebar}
    >
      <div
        className="relative inline-block"
        ref={dropdown}
      >
        <div
          className="w-12 h-12 cursor-pointer flex items-center justify-center hover:bg-slate-100 rounded-full"
          onClick={() => { setShowSidebar(!showSidebar) }}
        >
          <BiDotsVerticalRounded size={24} color="#5f6368" />
        </div>
        <div className={(showSidebar ? "block" : "hidden") + " absolute z-10 right-0 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700"}>
          <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
            </li>
          </ul>
        </div>
      </div>
    </Tooltip>
  );
}
export default Dropdown;
