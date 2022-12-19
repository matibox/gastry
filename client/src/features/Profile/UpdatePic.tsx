import { motion } from 'framer-motion';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Error } from '../../components/Error/Error';
import { Icon } from '../../components/Icon/Icon';
import { useAuth } from '../../contexts/authContext';
import { useAsyncFn } from '../../hooks/useAsync';
import { updateProfilePicture } from '../../services/user';
import { TError } from '../../types/Error';
import { User } from '../../types/User';
import styles from './UpdatePic.module.css';

interface UpdatePicProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UpdatePic({ setIsOpen }: UpdatePicProps) {
  const [profilePic, setProfilePic] = useState<File | undefined | null>();
  const [pfpError, setPfpError] = useState<TError>();

  const authContext = useAuth();
  if (!authContext) return null;
  const { user, setLocalUser } = authContext;
  const editPictureFn = useAsyncFn(updateProfilePicture);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!profilePic) {
      setPfpError({ message: 'Profile picture is required' });
      return;
    }

    if (!profilePic.type.startsWith('image')) {
      setPfpError({ message: 'Uploaded file is not an image' });
      return;
    }

    if (profilePic.size > 1000000) {
      setPfpError({ message: 'File size exceeds 1MB' });
      return;
    }

    const formData = new FormData();
    formData.append('picture', profilePic);

    editPictureFn.run(formData).then(res => {
      setLocalUser({ ...user, ...res });
      setIsOpen(false);
    });
  }

  return (
    <>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.2,
          ease: 'easeOut',
        }}
        onClick={() => setIsOpen(false)}
      />
      <motion.form
        className={styles.wrapper}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.35,
          ease: 'backOut',
        }}
        onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}
      >
        <label>
          <span>Profile picture</span>
          <input
            type='file'
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setProfilePic(e.target.files && e.target.files[0])
            }
          />
        </label>
        {editPictureFn.errors && <Error errors={editPictureFn.errors} />}
        {editPictureFn.loading ? (
          <button
            className={`${styles.loadingButton} ${styles.submit}`}
            disabled
          >
            Loading...
          </button>
        ) : (
          <button className={styles.submit}>
            <span>Edit profile picture</span>
            <Icon name='edit' />
          </button>
        )}
      </motion.form>
    </>
  );
}
