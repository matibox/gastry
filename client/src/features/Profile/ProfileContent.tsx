import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Icon } from '../../components/Icon/Icon';
import { useAuth } from '../../contexts/authContext';
import { useAsyncFn } from '../../hooks/useAsync';
import { logout } from '../../services/user';

import styles from './ProfileContent.module.css';
import { UpdatePic } from './UpdatePic';

export function ProfileContent() {
  const [isOpen, setIsOpen] = useState(false);

  const authContext = useAuth();
  if (!authContext) return null;
  const { user, setLocalUser, resetUser } = authContext;

  const logoutFn = useAsyncFn(logout);

  if (!user) return <Navigate to='/' />;

  return (
    <>
      <main className={styles.wrapper}>
        <AnimatePresence>
          {isOpen && <UpdatePic setIsOpen={setIsOpen} />}
        </AnimatePresence>
        <h1>your profile</h1>
        <section className={styles.pictureWrapper}>
          <img src={user.profilePicture} alt='current profile picture' />
          <p>profile picture</p>
          <button className={styles.edit} onClick={() => setIsOpen(true)}>
            <Icon name='edit' />
          </button>
        </section>
        <section className={styles.userData}>
          <p>
            <span className={styles.bold}>nickname: </span> {user.name}
          </p>
          <p>
            <span className={styles.bold}>email address: </span> {user.email}
          </p>
        </section>
        <section className={styles.logoutWrapper}>
          <button
            className={styles.logout}
            onClick={() => {
              logoutFn.run().then(res => {
                resetUser();
                window.location.reload();
              });
            }}
          >
            <span>logout</span>
            <Icon name='logout' />
          </button>
        </section>
      </main>
    </>
  );
}
