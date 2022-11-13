import { RefObject } from 'react';
import { useIsMobile } from '../../contexts/isMobileContext';
import { ChangingText } from './ChangingText';
import { useScroll } from './useScroll';

// styles
import styles from './Hero.module.css';

interface HeroProps {
  scrollToRef: RefObject<HTMLElement>;
}

const heroTextValues = ['nutrition app', 'recipe base', 'menu planner'];

export function Hero({ scrollToRef }: HeroProps) {
  const { scrollTo } = useScroll(scrollToRef);
  const { isMobile } = useIsMobile();

  return (
    <section className={`${styles.wrapper} ${isMobile ? styles.mobile : ''}`}>
      <div className={styles.content}>
        <h1>gastry</h1>
        <h2>
          a <ChangingText textOptions={heroTextValues} />
        </h2>
        <button className='button' onClick={scrollTo}>
          <span>learn more</span>
          <span
            className='material-symbols-outlined icons-normal'
            style={{ translate: '0 1px' }}
          >
            expand_more
          </span>
        </button>
      </div>
      <div className={styles.overlay} />
    </section>
  );
}
