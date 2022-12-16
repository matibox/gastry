import { AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Modal } from '../components/Modal/Modal';
import { useDeleteRecipe } from '../contexts/deleteRecipeContext';
import { Hero } from '../features/Hero/Hero';
import { LatestRecipes } from '../features/LatestRecipes/LatestRecipes';
import { YourRecipes } from '../features/YourRecipes/YourRecipes';

export function Home() {
  const sectionRef = useRef<HTMLElement>(null);
  const deleteRecipeContext = useDeleteRecipe();
  if (!deleteRecipeContext) return null;
  const { isDeleted, setIsDeleted } = deleteRecipeContext;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isDeleted) {
        setIsDeleted(false);
      }
    }, 2500);

    return () => {
      clearTimeout(timeout);
    };
  }, [isDeleted]);

  return (
    <main>
      <AnimatePresence>
        {isDeleted && (
          <Modal>
            <p>Recipe has been successfully deleted</p>
          </Modal>
        )}
      </AnimatePresence>
      <Hero scrollToRef={sectionRef} />
      <LatestRecipes sectionRef={sectionRef} />
      <YourRecipes />
    </main>
  );
}
