import { motion } from 'framer-motion';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Icon } from '../../components/Icon/Icon';
import styles from './AddRecipeForm.module.css';
import { v4 as uuidv4 } from 'uuid';

interface Ingredient {
  id: string;
  name: string;
  value: number;
  unit: string;
}

export function AddRecipeForm() {
  const [title, setTitle] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientValue, setIngredientValue] = useState('');
  const [ingredientUnit, setIngredientUnit] = useState('');
  const [instructions, setInstructions] = useState('');
  const [thumbnail, setThumbnail] = useState<any>();

  function handleIngredientAdd(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    setIngredients(prev => {
      if (!ingredientName || !ingredientValue || !ingredientUnit) return prev;
      return [
        ...prev,
        {
          id: uuidv4(),
          name: ingredientName,
          value: parseInt(ingredientValue),
          unit: ingredientUnit,
        },
      ];
    });
    setIngredientName('');
    setIngredientValue('');
    setIngredientUnit('');
  }

  function handleSubmit(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    // if (thumbnail.size > 1024)
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
      >
        <h2>New recipe</h2>
        <label>
          <span>Title</span>
          <input
            type='text'
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            required
            autoFocus
          />
        </label>
        <label>
          <span>Cooking time (minutes)</span>
          <input
            type='number'
            step='1'
            min='0'
            value={cookingTime}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCookingTime(e.target.value)
            }
            required
          />
        </label>
        <label>
          <span>Ingredients</span>
          <div className={styles.ingredientInputsWrapper}>
            <input
              type='text'
              placeholder='name (e.g. eggs)'
              value={ingredientName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setIngredientName(e.target.value)
              }
            />
            <input
              type='text'
              placeholder='value (e.g 500)'
              value={ingredientValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setIngredientValue(e.target.value)
              }
            />
            <input
              type='text'
              placeholder='unit (e.g ml)'
              value={ingredientUnit}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setIngredientUnit(e.target.value)
              }
            />
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleIngredientAdd(e)
              }
            >
              <span>add</span>
              <Icon name='add' />
            </button>
          </div>
          <p>
            {ingredients.map(ingredient => (
              <span
                key={ingredient.id}
                onClick={() =>
                  setIngredients(prev =>
                    prev.filter(item => item.id !== ingredient.id)
                  )
                }
              >
                {ingredient.value} {ingredient.unit} {ingredient.name},{' '}
              </span>
            ))}
          </p>
        </label>
        <label>
          <span>Instructions</span>
          <textarea
            value={instructions}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setInstructions(e.target.value)
            }
            required
          />
        </label>
        <label>
          <span>Thumbnail</span>
          <input
            type='file'
            value={thumbnail}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setThumbnail(e.target.files && e.target.files[0])
            }
          />
          <span className={styles.littleLabel}>Max size: 1MB</span>
        </label>
        <button
          onSubmit={(e: FormEvent<HTMLButtonElement>) => handleSubmit(e)}
          className={styles.submit}
        >
          <span>Create recipe</span>
          <Icon name='add' />
        </button>
      </motion.form>
    </>
  );
}
