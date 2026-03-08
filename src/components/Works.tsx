import { FadeIn, Section } from './Layout';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Works({ works }: { works: any[] }) {
  const navigate = useNavigate();
  // Show only first 3 or 4 works on home page
  const displayWorks = works.slice(0, 3);

  return (
    <Section id="works" className="bg-gray-50">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-end mb-16">
          <FadeIn>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">02. Selected Works</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight">Featured<br/>Projects</h3>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <button 
              onClick={() => navigate('/works')}
              className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-gray-600 transition-colors border-b-2 border-black pb-1 hover:border-gray-600"
            >
              More View 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {displayWorks.map((work, idx) => (
            <FadeIn 
              key={work.id} 
              delay={0.2 + (idx * 0.1)} 
              className="group cursor-pointer"
            >
              <div onClick={() => navigate(`/works/${work.id}`)}>
                <div className="aspect-[4/3] bg-gray-200 overflow-hidden mb-6 relative shadow-sm group-hover:shadow-md transition-all duration-500">
                  <img 
                    src={work.image_url} 
                    alt={work.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">{work.category}</span>
                  <h4 className="text-2xl font-extrabold tracking-tight group-hover:text-gray-600 transition-colors">{work.title}</h4>
                  <p className="text-gray-600 text-sm mt-3 line-clamp-2 font-medium leading-relaxed">{work.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  );
}
