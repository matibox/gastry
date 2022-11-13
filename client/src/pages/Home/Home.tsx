import { useRef } from 'react';
import { Hero } from '../../features/hero/Hero';
import { LatestRecipes } from '../../features/latestRecipes/LatestRecipes';

export function Home() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <main>
      <Hero scrollToRef={sectionRef} />
      <LatestRecipes sectionRef={sectionRef} />
    </main>
  );
}
