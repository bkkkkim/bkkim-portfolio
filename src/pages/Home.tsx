import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Works from '../components/Works';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { useApi } from '../hooks/useApi';

export default function Home() {
  const { data: contents } = useApi('/api/contents', {});
  const { data: works } = useApi('/api/work', []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero config={contents} />
      <Works works={works as any[]} />
      <Contact />
      <Footer />
    </div>
  );
}
