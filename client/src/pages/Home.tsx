import { useRef } from 'react';
import { Hero } from '../features/Hero/Hero';
import { LatestRecipes } from '../features/LatestRecipes/LatestRecipes';
import { YourRecipes } from '../features/YourRecipes/YourRecipes';

export function Home() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <main>
      <Hero scrollToRef={sectionRef} />
      <LatestRecipes sectionRef={sectionRef} />
      <YourRecipes />
    </main>
  );
}
