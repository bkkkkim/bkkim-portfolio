import { motion } from 'framer-motion';

export default function Hero({ config }: { config: any }) {
  return (
    <div id="home" className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gray-50">
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <div className="w-[800px] h-[800px] border border-black rounded-full" />
        <div className="absolute w-[600px] h-[600px] border border-black rounded-full" />
        <div className="absolute w-[400px] h-[400px] border border-black rounded-full" />
      </div>

      <div className="z-10 flex flex-col items-center text-center max-w-5xl px-6 pt-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 uppercase leading-tight"
        >
          {config?.hero_title || "Forward from the Basics"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl md:text-3xl text-gray-600 font-medium italic font-serif max-w-3xl leading-relaxed"
        >
          "{config?.hero_description || "Building experiences by stacking layers of expertise on a solid foundation of basics."}"
        </motion.p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-black to-transparent" />
      </motion.div>
    </div>
  );
}
