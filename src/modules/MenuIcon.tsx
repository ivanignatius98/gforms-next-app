import { IconContext } from 'react-icons';
import Tooltip from './Tooltip'
import { classNames } from '@helpers';

type Props = {
  icon: JSX.Element,
  title?: string,
  smallContainer?: boolean,
  additionalClass?: string,
  orientation?: string,
  autoSize?: boolean,
  onClick?: () => void
  disabled?: boolean,
};
const styleMap = new Map([
  [true, "#9aa0a6"],
  [false, "#5f6368"]
])
const MenuIcon = ({
  onClick,
  autoSize = true,
  icon,
  title = "",
  orientation = "bottom",
  additionalClass = "",
  smallContainer = false,
  disabled = false
}: Props) => {
  return (
    <Tooltip
      tooltipText={title}
      orientation={orientation}
      showPointer={false}
      show={title != ""}
    >
      <IconContext.Provider
        value={{
          color: styleMap.get(disabled),
          size: "24px"
        }}
      >
        <button
          onClick={onClick}
          className={classNames(
            autoSize ? (smallContainer ? "w-6 h-6" : "w-12 h-12 p-2 m-0") : "",
            additionalClass,
            disabled ? "pointer-events-none" : "",
            "flex items-center justify-center hover:bg-slate-50 active:bg-slate-200 rounded-full"
          )}
        >
          {icon}
        </button>
      </IconContext.Provider>
    </Tooltip>
  )
}

export default MenuIcon