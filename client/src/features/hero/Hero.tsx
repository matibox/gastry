import { RefObject } from 'react';

// styles
import styles from './Hero.module.css';
import { useScroll } from './useScroll';

interface HeroProps {
  scrollToRef: RefObject<HTMLElement>;
}

export function Hero({ scrollToRef }: HeroProps) {
  const { scrollTo } = useScroll(scrollToRef);

  return (
    <section className={styles.wrapper}>
      <div className={styles.content}>
        <h1>gastry</h1>
        {/*//TODO changing text */}
        <h2>a nutrition app</h2>
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
