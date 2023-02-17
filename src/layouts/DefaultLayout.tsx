import Navbar from '@modules/Navbar';
import Footer from '@modules/Footer';
import { ComponentPropsWithRef } from 'react';

const Layout: React.FC<ComponentPropsWithRef<'div'>> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="font-sans relative flex flex-col">
        <div className="flex flex-col items-center justify-center">
          <div className="w-screen max-w-[72rem]">{children}</div>
        </div>
      </main>
    </>
  );
};

export default Layout;
