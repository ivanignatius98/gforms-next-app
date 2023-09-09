import Navbar from '@modules/Navbar';
import Footer from '@modules/Footer';
import React, { ComponentPropsWithRef, useState } from 'react';

const MemoizedNavbar = React.memo(Navbar);

const Layout: React.FC<ComponentPropsWithRef<'div'>> = ({ children }) => {
  return (
    <>
      <MemoizedNavbar />
      <main className="font-sans relative flex flex-col overflow-x-clip">
        <div className="flex flex-col items-center justify-center">
          <div className="w-screen max-w-[72rem]">{children}</div>
        </div>
      </main>
    </>
  );
};

export default Layout;
