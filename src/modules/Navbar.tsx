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
import Tabs from './Tabs';

import MenuIcon from './MenuIcon';

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
      additionalClass='hidden form:flex'
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
      additionalClass='hidden form:flex'
      icon={<BiRedo />}
    />
  </>,
  <>
    <div className='hidden form:flex items-center justify-center mx-2'>
      <button className="h-9 px-6 rounded-md text-white bg-fuchsia-500 hover:bg-fuchsia-400 active:bg-fuchsia-300 active:shadow shadow-sm text-sm">
        Send
      </button>
    </div>
    <MenuIcon
      title="Send"
      additionalClass='flex form:hidden'
      icon={<GiHamburgerMenu />}
    />
  </>
];
const MenuItems = () => {
  return <>{menuItemData.map((row: JSX.Element, i) => (<React.Fragment key={i}>{row}</React.Fragment>))}</>
}

interface ListItem {
  onClick: Function;
  content: { icon?: JSX.Element, label: string };
}

interface DropdownItemsList {
  header?: string
  items: ListItem[]
}
const dropdownItemData: DropdownItemsList[] =
  [{
    items: [{
      onClick: () => { console.log("TEST") },
      content: {
        icon: <MdContentCopy size={24} color="#5f6368" />,
        label: "Make a copy"
      }
    }, {
      onClick: () => { console.log("TEST2") },
      content: {
        icon: <FiTrash2 size={24} color="#5f6368" />,
        label: "Move to trash"
      }
    }, {
      onClick: () => { console.log("TEST3") },
      content: {
        icon: <MdOutlineInsertLink size={24} color="#5f6368" />,
        label: "Get pre-filled link"
      }
    }, {
      onClick: () => { console.log("TEST4") },
      content: {
        icon: <MdPrint size={24} color="#5f6368" />,
        label: "Print"
      }
    }]
  },
  {
    items: [{
      onClick: () => { console.log("TEST4") },
      content: {
        icon: <MdGroupAdd size={24} color="#5f6368" />,
        label: "Add collaborators"
      }
    }]
  },
  {
    items: [{
      onClick: () => { console.log("TEST4") },
      content: {
        icon: <MdCode size={24} color="#5f6368" />,
        label: "Script editor"
      }
    }, {
      onClick: () => { console.log("TEST4") },
      content: {
        icon: <IoExtensionPuzzleOutline size={24} color="#5f6368" />,
        label: "Add ons"
      }
    }]
  }
  ]


const tabItemData = ["Questions", "Responses", "Settings"]

const Navbar: React.FC = () => {
  const [title, setTitle] = useState("Form Title")
  const [showTooltip, setShowTooltip] = useState(true)
  const handleTitleChange = (e: React.ChangeEvent<any>) => {
    setTitle(e.target.value)
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-2 pt-2.5 rounded sticky top-0 z-10">
      <div className="flex flex-wrap justify-between items-center">
        <div className={"p-0 m-0 static"}>
          <div className="flex h-12 mb-4 items-center">
            <div className="w-12 p-2 flex rounded-lg items-center justify-center">
              <button>
                <IoDocumentText size={40} color="#d946ef" />
              </button>
            </div>
            <div className='ml-2 hidden sm:block'>
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
              additionalClass="mx-3 hidden form:block"
            />
            <MenuIcon
              title="Star"
              icon={<MdStarOutline />}
              smallContainer={true}
              additionalClass="hidden form:block"
            />
          </div>
        </div>

        <div className={"p-0 m-0 static block w-auto"} id="navbar-default">
          <div className="flex">
            <MenuItems />
            <React.Fragment>
              <Tooltip
                additionalContainerClass=''
                orientation="bottom"
                showPointer={false}
                show={showTooltip}
                tooltipText="More"
              >
                <Dropdown {...{ dropdownItemData }} setOpen={(val) => setShowTooltip(!val)}>
                  <button className="w-12 h-12 flex items-center justify-center hover:bg-slate-100 active:bg-slate-200 rounded-full">
                    <BiDotsVerticalRounded size={24} color="#5f6368" />
                  </button>
                </Dropdown>
              </Tooltip>
            </React.Fragment>
          </div>
        </div>
      </div>
      <div className="flex sm:hidden items-center px-2">
        {/* <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Test Form</span> */}
        <GrowInput
          placeholder='Untitled Form'
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <Tabs tabItemData={tabItemData} />
    </nav>
  );
};

export default Navbar;