import { useRef } from 'react';
import { Hero } from '../../features/hero/Hero';

export function Home() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <main>
      <Hero scrollToRef={sectionRef} />
      <section ref={sectionRef}>placeholder section</section>
    </main>
  );
}
