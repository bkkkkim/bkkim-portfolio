import { FadeIn, Section } from './Layout';

export default function About({ data }: { data: any }) {
  const skills = data?.skills ? JSON.parse(data.skills) : [];
  const experience = data?.experience ? JSON.parse(data.experience) : [];

  return (
    <Section id="about" className="bg-white">
      <div className="max-w-5xl mx-auto w-full">
        <FadeIn>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-12">01. About Me</h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <FadeIn delay={0.2}>
              <h3 className="text-4xl font-extrabold mb-8 tracking-tight leading-tight">The Adaptive Deep-Diver</h3>
              <div className="prose prose-lg text-gray-600 mb-10 font-serif italic text-xl leading-relaxed">
                <p>커머스,패션, 뷰티, 헬스케어 등 다양한 산업 속에서 디자인을 넘어 기획과 PM,PO까지 유연한 적응형 몰입자 입니다.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-6 border-b-2 border-black pb-2 inline-block">Core Skills</h4>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill: string, idx: number) => (
                  <span key={idx} className="px-4 py-2 bg-gray-100 text-gray-900 text-sm font-bold tracking-tight rounded-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>

          <div>
            <FadeIn delay={0.4}>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-8 border-b-2 border-black pb-2 inline-block">Experience</h4>
              <div className="space-y-10">
                {experience.map((exp: any, idx: number) => (
                  <div key={idx} className="relative pl-8 border-l-2 border-gray-200 hover:border-black transition-colors duration-300">
                    <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-white border-2 border-black rounded-full" />
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-2">{exp.period}</span>
                    <h5 className="text-xl font-bold text-black tracking-tight">{exp.role}</h5>
                    <p className="text-gray-800 font-semibold mb-2">{exp.company}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </Section>
  );
}
