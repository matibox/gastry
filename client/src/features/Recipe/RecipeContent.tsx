import Loading from '../../components/Loading/Loading';
import { useRecipe } from './recipeContext';
import { Icon } from '../../components/Icon/Icon';

import styles from './RecipeContent.module.css';
import { Error } from '../../components/Error/Error';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { EditRecipeForm } from './EditRecipeForm';
import { useAuth } from '../../contexts/authContext';
import { useLike } from '../../hooks/useLike';
import { useIsMobile } from '../../contexts/isMobileContext';

export function RecipeContent() {
  const { isMobile } = useIsMobile();

  const recipeContext = useRecipe();
  if (!recipeContext) return null;
  const {
    id,
    data: recipe,
    loading,
    errors,
    deleteLocalRecipe,
  } = recipeContext.recipe;

  const authContext = useAuth();
  if (!authContext) return null;
  const { user } = authContext;
  const {
    isFav,
    toggleLike,
    loading: likeLoading,
    errors: likeErrors,
  } = useLike(user, id);

  const [isFormOpened, setIsFormOpened] = useState(false);

  return (
    <main
      className={`${styles.wrapper} ${!isMobile && styles.pc} ${
        !recipe?.thumbnail && styles.noThumbnail
      }`}
    >
      <AnimatePresence>
        {isFormOpened && <EditRecipeForm setOpened={setIsFormOpened} />}
      </AnimatePresence>
      {loading && (
        <>
          {!isMobile ? (
            <div style={{ gridColumn: '2 / 3', justifySelf: 'center' }}>
              <Loading />
            </div>
          ) : (
            <Loading />
          )}
        </>
      )}
      {errors && (
        <>
          {!isMobile ? (
            <div style={{ gridColumn: '2 / 3', justifySelf: 'center' }}>
              <Error errors={errors} size='large' />
            </div>
          ) : (
            <Error errors={errors} size='large' />
          )}
        </>
      )}
      {likeErrors && (
        <>
          {!isMobile ? (
            <div style={{ gridColumn: '2 / 3', justifySelf: 'center' }}>
              <Error errors={likeErrors} size='large' />
            </div>
          ) : (
            <Error errors={likeErrors} size='large' />
          )}
        </>
      )}
      {recipe && (
        <>
          {!isMobile && recipe.thumbnail && (
            <div
              className={styles.pcThumbnail}
              style={{ backgroundImage: `url(${recipe.thumbnail})` }}
            />
          )}
          <div className={styles.pcWrapper}>
            <h1>{recipe.title}</h1>
            <div className={styles.content}>
              {isMobile && (
                <div
                  className={styles.thumbnail}
                  style={{ backgroundImage: `url(${recipe.thumbnail})` }}
                />
              )}
              <section className={styles.info}>
                {user && (
                  <button
                    onClick={toggleLike}
                    className={`${styles.favBtn} ${isFav && styles.favActive}`}
                    disabled={likeLoading}
                  >
                    <Icon name='favorite' isFilled={isFav} />
                  </button>
                )}
                <p className={styles.iconWrapper}>
                  <Icon name='timer' />
                  <span>{recipe.cookingTime} minutes</span>
                </p>
                <p>
                  <span className={styles.bold}>Ingredients: </span>
                  {recipe.ingredients.map(ingredient => {
                    const lastItem = [...recipe.ingredients].pop();
                    return (
                      <span key={ingredient.id}>
                        {ingredient.value} {ingredient.unit} {ingredient.name}
                        {lastItem?.id !== ingredient.id && ', '}
                      </span>
                    );
                  })}
                </p>
                <p>
                  <span className={styles.bold}>Instructions: </span>
                  {recipe.instructions}
                </p>
              </section>
              {recipe.isAuthor && (
                <section className={styles.buttons}>
                  <>
                    <Button
                      color='green'
                      text='edit recipe'
                      iconName='edit'
                      handleClick={() => setIsFormOpened(prev => !prev)}
                    />
                    <Button
                      color='orange'
                      text='delete recipe'
                      iconName='delete'
                      handleClick={() => deleteLocalRecipe(id)}
                    />
                  </>
                </section>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}

interface ButtonProps {
  color: string;
  text: string;
  iconName: string;
  handleClick: () => void;
}

function Button({ color, text, iconName, handleClick }: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[color]}`}
      style={{ border: `2px solid var(--${color})` }}
      onClick={handleClick}
    >
      {text}
      <Icon name={iconName} />
    </button>
  );
}
