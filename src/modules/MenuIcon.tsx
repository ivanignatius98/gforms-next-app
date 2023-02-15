import { IconContext } from 'react-icons';
import Tooltip from './Tooltip'

type Props = {
  icon: JSX.Element,
  title: string,
  smallContainer?: boolean,
  additionalClass?: string,
};
const MenuIcon = ({ icon, title, additionalClass = "", smallContainer = false }: Props) => {
  return (
    <Tooltip tooltipText={title} orientation="bottom" showPointer={false}>
      <IconContext.Provider value={{ color: '#5f6368', size: '23px' }}>
        <button className={`${additionalClass} ${smallContainer ? "w-6 h-6" : "w-12 h-12 p-2 m-0"} flex items-center justify-center z-10 hover:bg-slate-100 active:bg-slate-200 rounded-full`}>
          {icon}
        </button>
      </IconContext.Provider>
    </Tooltip>
  )
}

export default MenuIcon