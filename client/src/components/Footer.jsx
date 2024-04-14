import { FaPhone, FaEnvelope, FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-200 py-8 mt-3">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            <h2 className="text-lg font-bold mb-4">Explore</h2>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-700 hover:underline">Home</Link></li>
              <li><Link to="/about" className="text-slate-700 hover:underline">About Us</Link></li>
              <li><Link to="/sign-in" className="text-slate-700 hover:underline">Sign In</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h2 className="text-lg font-bold mb-4">Contact Me</h2>
            <div className="flex items-center space-x-4">
              <FaPhone className="text-slate-700" />
              <span className="text-slate-700">+254700503771</span>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <FaEnvelope className="text-slate-700" />
              <span className="text-slate-700">agnamare@gmail.com</span>
            </div>
          </div>
          <div className="col-span-1">
            <h2 className="text-lg font-bold mb-4">Connect With Me</h2>
            <div className="flex-col">
              <a href="http://github.com/agnamare" className="text-gray-700 hover:text-gray-500 flex items-center">
                <FaGithub className="mr-2" />
                @agnamare
              </a>
              <a href="http://x.com/agnamare" className="text-slate-700 hover:text-blue-400 flex items-center">
                <FaTwitter className='mr-2' /> @agnamare
              </a>
              <a href="https://www.instagram.com/__edgee/" className="text-slate-700 hover:text-red-500 flex items-center">
                <FaInstagram className='mr-2' /> @__edgee
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-700">&copy; 2024 EdgeEstate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
