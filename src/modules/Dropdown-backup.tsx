
import { useRef, useState, useEffect } from 'react';
import Tooltip from './Tooltip'
interface ListItem {
  onClick: Function;
  content: String | JSX.Element;
}

type Props = {
  children: JSX.Element,
  listItemData: ListItem[],
  tooltipText?: string,
  orientation?: string,
  showPointer?: boolean,
  show?: boolean,
  showTooltip?: boolean,
  additionalContainerClass?: string
};
interface ItemProps {
  listItemData: ListItem[];
}

const ListItems = ({ listItemData }: ItemProps) => {
  return (
    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
      {listItemData.map((item: ListItem, i) => (
        <li className='cursor-pointer' onClick={() => { item.onClick() }} key={i}>
          <div className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{item.content}</div>
        </li>
      ))}
    </ul>
  )
}
const Dropdown: React.FC<Props> = ({ children: icon, listItemData, orientation = "bottom", showTooltip = true, tooltipText = "" }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const dropdown = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showSidebar) return;
    const handleClick = ({ target }: MouseEvent) => {
      if (dropdown.current && !dropdown.current.contains(target as HTMLElement)) {
        setShowSidebar(false)
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [showSidebar]);

  return (
    <div
      className="relative inline-block"
      ref={dropdown}
    >
      <div
        className="w-12 h-12 cursor-pointer flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 rounded-full"
        onClick={() => { setShowSidebar(!showSidebar) }}
      >
        {icon}
      </div>
      <div
        onClick={() => { setShowSidebar(!showSidebar) }}
        className={(showSidebar ? "block" : "hidden") + " absolute z-10 right-0 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700"}
      >
        <ListItems listItemData={listItemData} />
      </div>
    </div>
  );
}
export default Dropdown;
