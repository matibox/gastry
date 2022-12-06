import Loading from '../../components/Loading/Loading';
import { useRecipe } from './recipeContext';
import { Icon } from '../../components/Icon/Icon';

import styles from './RecipeContent.module.css';
import { Error } from '../../components/Error/Error';

export function RecipeContent() {
  const recipeContext = useRecipe();
  if (!recipeContext) return null;
  const { data: recipe, loading, errors } = recipeContext.recipe;

  return (
    <main className={styles.wrapper}>
      {loading && <Loading />}
      {errors && <Error errors={errors} size='large' />}
      {recipe && (
        <>
          <h1>{recipe.title}</h1>
          <div className={styles.content}>
            <img src={recipe.thumbnail} alt={recipe.title} />
            <section className={styles.info}>
              <p className={styles.iconWrapper}>
                <Icon name='timer' />
                <span>{recipe.cookingTime} minutes</span>
              </p>
              <p>
                <span className={styles.bold}>Ingredients: </span>
                {recipe.ingredients.map((ingredient) => {
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
            <section className={styles.buttons}>
              {/*//TODO btn onClicks */}
              <Button
                color='green'
                text='add to menu'
                iconName='menu_book'
                handleClick={() => null}
              />
              <Button
                color='green'
                text='edit recipe'
                iconName='edit'
                handleClick={() => null}
              />
              <Button
                color='orange'
                text='delete recipe'
                iconName='delete'
                handleClick={() => null}
              />
            </section>
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
