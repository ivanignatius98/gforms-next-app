import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { GrDocumentText } from 'react-icons/gr';
import { GiHamburgerMenu } from 'react-icons/gi';

const Navbar: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <>
      <nav className="bg-white border-gray-200 px-2 sm:px-4 pt-2.5 rounded dark:bg-gray-900 sticky top-0 z-10">
        <div className="flex flex-wrap justify-between items-center ">
          <div className={"p-0 m-0 static block w-auto"}>
            <div className="flex flex-row h-12">
              <div className="w-12 p-2 flex rounded-lg items-center justify-center">
                <button>
                  <GrDocumentText size={24} />
                </button>
              </div>
              <a href="#" className="hidden sm:flex items-center">
                <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Test Form</span>
              </a>
            </div>
          </div>
          <div className={"p-0 m-0 static block w-auto"} id="navbar-default">

            <div className="flex flex-row h-12">
              <div className="w-12 p-2 flex rounded-lg items-center justify-center">
                <button onClick={() => { setShowSidebar(!showSidebar) }}>
                  <GiHamburgerMenu size={24} />
                </button>
              </div>
              <div className="w-12  rounded-lg flex items-center justify-center">
                <button>
                  <GiHamburgerMenu size={24} />
                </button>
              </div>
              <div className="w-12 p-2 flex rounded-lg items-center justify-center">
                <button>
                  <GiHamburgerMenu size={24} />
                </button>
              </div>
              <div className="flex items-center justify-center mx-2">
                <button className="h-10 px-5 rounded-md text-white bg-fuchsia-500 shadow-lg text-sm">
                  Send
                </button>
              </div>
              <div className="w-12 flex rounded-lg items-center justify-center">
                <div className="h-6 relative inline-block">
                  <button onClick={() => { setShowSidebar(!showSidebar) }}>
                    <GiHamburgerMenu size={24} />
                  </button>
                  <div className={(showSidebar ? "block" : "hidden") + " absolute z-10 right-0 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700"}>
                    <ul className=" py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault">
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

              </div>
              <div className="w-12 p-2 flex rounded-lg items-center justify-center">
                <button>
                  <GiHamburgerMenu size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <a href="#" className="flex sm:hidden items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Test Form</span>
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
    </>
  );
};

export default Navbar;
