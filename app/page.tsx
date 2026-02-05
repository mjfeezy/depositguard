import { Hero } from '@/components/Hero-v2';
import { Stats } from '@/components/Stats';
import { Testimonials } from '@/components/Testimonials';

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Testimonials />
    </main>
  );
}
