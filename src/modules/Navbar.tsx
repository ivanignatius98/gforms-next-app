import AppProps from 'next/app';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';

import { IconContext } from 'react-icons';
import { IoDocumentText, IoExtensionPuzzleOutline } from 'react-icons/io5';
import { GiHamburgerMenu } from 'react-icons/gi';
import { BiUndo, BiRedo, BiDotsVerticalRounded } from 'react-icons/bi';
import { MdOutlinePalette, MdOutlineRemoveRedEye, MdFolderOpen, MdStarOutline, MdContentCopy, MdOutlineInsertLink, MdPrint, MdGroupAdd, MdCode } from 'react-icons/md'
import { FiTrash2 } from 'react-icons/fi'

import Tooltip from './Tooltip'
import Dropdown from './Dropdown';
import Input from './Input';
import GrowInput from './GrowInput';

type Props = {
  icon: JSX.Element,
  title: string,
  smallContainer?: boolean,
  additionalClass?: string,
};
const MenuIcon = ({ icon, title, additionalClass = "", smallContainer = false }: Props) => {
  return (
    <Tooltip tooltipText={title} orientation="bottom" showPointer={false}>
      <IconContext.Provider value={{ color: '#5f6368', size: '24px' }}>
        <button className={`${additionalClass} ${smallContainer ? "w-6 h-6 " : "w-12 h-12 p-2 m-0"} flex items-center justify-center z-10 hover:bg-slate-100 active:bg-slate-200 rounded-full`}>
          {icon}
        </button>
      </IconContext.Provider>
    </Tooltip>
  )
}
const menuItemData: JSX.Element[] = [
  <>
    <MenuIcon
      title="Customize Theme"
      icon={<MdOutlinePalette />}
    />
  </>,
  <>
    <MenuIcon
      title="Preview"
      additionalClass='hidden lg:flex'
      icon={<MdOutlineRemoveRedEye />}
    />
  </>,
  <>
    <MenuIcon
      title="Undo"
      icon={<BiUndo />}
    />
  </>,
  <>
    <MenuIcon
      title="Redo"
      additionalClass='hidden lg:flex'
      icon={<BiRedo />}
    />
  </>,
  <>
    <div className='hidden lg:flex items-center justify-center mx-2'>
      <button className="h-9 px-6 rounded-md text-white bg-fuchsia-500 hover:bg-fuchsia-400 active:bg-fuchsia-300 active:shadow shadow-sm text-sm">
        Send
      </button>
    </div>
    <MenuIcon
      title="Send"
      additionalClass='flex lg:hidden'
      icon={<GiHamburgerMenu />}
    />
  </>
];
const MenuItems = () => {
  return <>{menuItemData.map((row: JSX.Element, i) => (<React.Fragment key={i}>{row}</React.Fragment>))}</>
}

interface ListItem {
  onClick: Function;
  content: string | { icon: JSX.Element, text: string };
}

const dropdownItemData: ListItem[][] = [
  [{
    onClick: () => { console.log("TEST") },
    content: {
      icon: <MdContentCopy size={24} color="#5f6368" />,
      text: "Make a copy"
    }
  }, {
    onClick: () => { console.log("TEST2") },
    content: {
      icon: <FiTrash2 size={24} color="#5f6368" />,
      text: "Move to trash"
    }
  }, {
    onClick: () => { console.log("TEST3") },
    content: {
      icon: <MdOutlineInsertLink size={24} color="#5f6368" />,
      text: "Get pre-filled link"
    }
  }, {
    onClick: () => { console.log("TEST4") },
    content: {
      icon: <MdPrint size={24} color="#5f6368" />,
      text: "Print"
    }
  }],
  [{
    onClick: () => { console.log("TEST4") },
    content: {
      icon: <MdGroupAdd size={24} color="#5f6368" />,
      text: "Add collaborators"
    }
  }],
  [{
    onClick: () => { console.log("TEST4") },
    content: {
      icon: <MdCode size={24} color="#5f6368" />,
      text: "Script editor"
    }
  }, {
    onClick: () => { console.log("TEST4") },
    content: {
      icon: <IoExtensionPuzzleOutline size={24} color="#5f6368" />,
      text: "Add ons"
    }
  }]
]


const Navbar: React.FC = () => {
  const [title, setTitle] = useState("aaaaaaaaaaaaa")

  const handleTitleChange = (e: React.ChangeEvent<any>) => {
    setTitle(e.target.value)
  }
  return (
    <nav className="bg-white border-gray-200 px-2 sm:px-4 pt-2.5 rounded dark:bg-gray-900 sticky top-0 z-10">
      <div className="flex flex-wrap justify-between items-center ">
        <div className={"p-0 m-0 static"}>
          <div className="flex h-12 items-center">
            <div className="w-12 p-2 flex rounded-lg items-center justify-center">
              <button>
                <IoDocumentText size={40} color="#d946ef" />
              </button>
            </div>
            <div className='ml-2'>
              <GrowInput
                placeholder='Untitled Form'
                value={title}
                onChange={handleTitleChange}
              />
            </div>
            <MenuIcon
              title="Move to Folder"
              icon={<MdFolderOpen />}
              smallContainer={true}
              additionalClass="mx-3 hidden lg:block "
            />
            <MenuIcon
              title="Star"
              icon={<MdStarOutline />}
              smallContainer={true}
              additionalClass="hidden lg:block  "
            />
          </div>
        </div>

        <div className={"p-0 m-0 static block w-auto"} id="navbar-default">
          <div className="flex ">
            <MenuItems />
            <React.Fragment>
              <Tooltip
                orientation="bottom"
                showPointer={false}
                // show={!showSidebar && showTooltip}
                tooltipText="More"
              >
                <Dropdown {...{ dropdownItemData }}>
                  <button className="w-12 h-12 flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 rounded-full">
                    <BiDotsVerticalRounded size={24} color="#5f6368" />
                  </button>
                </Dropdown>
              </Tooltip>
            </React.Fragment>
          </div>
        </div>
      </div>
      <a href="#" className="flex sm:hidden items-center">
        {/* <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Test Form</span> */}

        <Input
          value={title}
          onChange={(e: React.ChangeEvent<any>) => { setTitle(e.target.value) }}
        />
      </a>
      <div className="border-b border-gray-200 dark:border-gray-700 mt-4">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center sm:justify-center" >
          <li className="mr-2">
            <button className="inline-block p-2 rounded-t-lg border-b-4 border-indigo-600">Questions</button>
          </li>
          <li className="mr-2">
            <button className="inline-block p-2 rounded-t-lg border-b-4 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Responses</button>
          </li>
          <li className="mr-2">
            <button className="inline-block p-2 rounded-t-lg border-b-4 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Settings</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;