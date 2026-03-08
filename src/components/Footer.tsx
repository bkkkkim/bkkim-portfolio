import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div className="text-center md:text-left">
          <h4 className="text-2xl font-extrabold tracking-tight mb-4 uppercase">Basics.</h4>
          <p className="text-gray-400 text-lg font-serif italic">"Good design is as little as possible."</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 text-sm font-bold uppercase tracking-widest text-gray-500">
          <Link to="/admin" className="hover:text-white transition-colors">Admin</Link>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
