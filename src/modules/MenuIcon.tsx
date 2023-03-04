import { IconContext } from 'react-icons';
import Tooltip from './Tooltip'

type Props = {
  icon: JSX.Element,
  title?: string,
  smallContainer?: boolean,
  additionalClass?: string,
  orientation?: string,
  autoSize?: boolean,
  onClick?: () => void
};
const MenuIcon = ({ onClick, autoSize = true, icon, title = "", orientation = "bottom", additionalClass = "", smallContainer = false }: Props) => {
  return (
    <Tooltip tooltipText={title} orientation={orientation} showPointer={false} show={title != ""}>
      <IconContext.Provider value={{ color: '#5f6368', size: "24px" }}>
        <button onClick={onClick} className={`${autoSize ? (smallContainer ? "w-6 h-6" : "w-12 h-12 p-2 m-0") : ""} ${additionalClass} flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 rounded-full`}>
          {icon}
        </button>
      </IconContext.Provider>
    </Tooltip>
  )
}

export default MenuIcon