import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { AiFillFacebook, AiFillGithub, AiFillInstagram } from 'react-icons/ai';

interface Social {
  href: string;
  icon: JSX.Element;
}

const socialsData: Social[] = [
  {
    href: '#',
    icon: <AiFillInstagram color="white" size={24} />,
  },
  {
    href: '#',
    icon: <AiFillFacebook color="white" size={24} />,
  },
  {
    href: '#',
    icon: <AiFillGithub color="white" size={24} />,
  },
];

const Socials: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      {socialsData.map((social: Social, i) => (
        <Link href={social.href} key={i}>
          <a rel={'noopener noreferrer'}>
            {social.icon}
          </a>
        </Link>
      ))}
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <section className="bg-gray-600 mt-auto">
      <div className="flex flex-col items-center justify-center">
        <div className="w-screen max-w-[72rem] p-4">
          <div>
            <h3 className="font-semibold text-xl text-white">
              About
            </h3>
            <p className="text-gray-300 text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae aspernatur in voluptates eos optio. Molestiae consectetur, sed dolorem ipsam deserunt fuga. Perspiciatis ab aliquid dolor a! Saepe numquam tempore facilis.
            </p>
            <div className="p-2"></div>
            <div className="grid grid-cols-2">
              <div>
                <h3 className="font text-lg text-white">
                  Let&apos;s stay <br className="md:hidden" /> connected
                </h3>
                <div className="p-1" />
                <Socials />
              </div>
              <div className="">
                <h3 className="font text-lg text-white">
                  Get involved
                </h3>
                <div className="p-1" />
                <button className="px-3 py-1 bg-indigo-500 text-white rounded">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="p-2" />
            <div className="text-white text-sm">&copy; 2022 Company</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
