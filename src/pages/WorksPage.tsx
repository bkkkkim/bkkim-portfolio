import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function WorksPage() {
  const { data: works, loading } = useApi('/api/work', []);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 uppercase">All Projects</h1>
            <p className="text-gray-600 max-w-2xl font-serif italic text-xl">
              A comprehensive collection of my work in UX planning, service design, and digital experiences.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {(works as any[]).map((work, idx) => (
                <motion.div 
                  key={work.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/works/${work.id}`)}
                >
                  <div className="aspect-[4/3] bg-gray-100 overflow-hidden mb-4 relative shadow-sm group-hover:shadow-md transition-all duration-500">
                    <img 
                      src={work.image_url} 
                      alt={work.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{work.category}</span>
                    <h2 className="text-xl font-extrabold tracking-tight group-hover:text-gray-600 transition-colors">{work.title}</h2>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2 font-medium">{work.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
