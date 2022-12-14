import { useIsMobile } from '../../contexts/isMobileContext';

// assets
import GitHub from '../../assets/github.png';
import Twitter from '../../assets/twitter.png';

// styles
import styles from './Footer.module.css';

export function Footer() {
  const { isMobile } = useIsMobile();

  return (
    <footer className={`${styles.footer} ${isMobile ? styles.mobile : ''}`}>
      <div className={styles.logosWrapper}>
        <img src='/footer-logo.png' alt='gastry' />
        <div className={styles.socialsWrapper}>
          <a
            href='https://github.com/matibox/gastry'
            target='_blank'
            aria-label='github'
          >
            <img src={GitHub} alt='github' />
          </a>
          <a
            href='https://twitter.com/m4t1box'
            target='_blank'
            aria-label='twitter'
          >
            <img src={Twitter} alt='twitter' />
          </a>
        </div>
      </div>
      <p className={styles.text}>
        <span>Designed and made by </span>
        <a href='https://github.com/matibox' target='_blank'>
          Mateusz Hladky
        </a>
        <span> &copy; {new Date().getFullYear()}</span>
      </p>
    </footer>
  );
}
