import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import DOMPurify from 'dompurify';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: work, loading } = useApi(`/api/work/${id}`, null as any);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-xl font-bold uppercase tracking-widest">Loading...</div>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="text-xl font-bold uppercase tracking-widest mb-4">Project not found</div>
        <button onClick={() => navigate('/works')} className="text-sm underline">Back to Works</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-12 transition-colors"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-sm font-bold uppercase tracking-widest text-gray-400 block mb-4">{work.category}</span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-black mb-8 uppercase leading-none">{work.title}</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full aspect-video bg-gray-100 mb-16 overflow-hidden"
          >
            <img 
              src={work.image_url} 
              alt={work.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="md:col-span-2"
            >
              <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-2 mb-6 inline-block">Overview</h3>
              <p className="text-xl md:text-2xl text-gray-800 font-serif italic leading-relaxed mb-12">
                "{work.description}"
              </p>
              
              {/* Rich Text Content */}
              <div 
                className="prose prose-lg text-gray-600 max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(work.content || '') }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-2 mb-6 inline-block">Project Info</h3>
              
              <div className="space-y-6">
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Role</span>
                  <span className="text-base font-bold text-black">UX Planning & Design</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Year</span>
                  <span className="text-base font-bold text-black">2024</span>
                </div>
                
                {work.link && work.link !== '#' && (
                  <div className="pt-6">
                    <a 
                      href={work.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                    >
                      Visit Site <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
