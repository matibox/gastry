import { motion } from 'framer-motion';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Icon } from '../../components/Icon/Icon';
import styles from './AddRecipeForm.module.css';
import { v4 as uuidv4 } from 'uuid';
import { TError } from '../../types/Error';
import { Ingredient } from '../../types/Ingredient';
import { useAsyncFn } from '../../hooks/useAsync';
import { createRecipe, updateRecipeThumbnail } from '../../services/recipes';
import { Error } from '../../components/Error/Error';
import { useSearch } from '../Search/searchContext';

interface AddRecipeFormProps {
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AddRecipeForm({ setOpened }: AddRecipeFormProps) {
  const [title, setTitle] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientValue, setIngredientValue] = useState('');
  const [ingredientUnit, setIngredientUnit] = useState('');
  const [instructions, setInstructions] = useState('');
  const [types, setTypes] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<File | undefined | null>();
  const [thumbnailError, setThumbnailError] = useState<TError>();

  const addRecipeFn = useAsyncFn(createRecipe);
  const updateRecipeThumbnailFn = useAsyncFn(updateRecipeThumbnail);

  const searchContext = useSearch();
  if (!searchContext) return null;
  const { addLocalRecipe } = searchContext.recipes;

  function handleIngredientAdd(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    setIngredients(prev => {
      if (!ingredientName || !ingredientValue) return prev;
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

  function handleCheckboxToggle(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setTypes(prev => [...prev, e.target.value]);
    } else {
      setTypes(prev => prev.filter(item => item !== e.target.value));
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (thumbnail && !thumbnail.type.startsWith('image')) {
      setThumbnailError({ message: 'Uploaded file is not an image' });
      return;
    }
    if (thumbnail && thumbnail.size > 1000000) {
      setThumbnailError({ message: 'File size exceeds 1MB' });
      return;
    }

    let newRecipeId: string;
    addRecipeFn
      .run(title, parseInt(cookingTime), ingredients, instructions, types)
      .then(res => {
        newRecipeId = res.id;
        if (thumbnail) {
          const formData = new FormData();
          formData.append('thumbnail', thumbnail);
          updateRecipeThumbnailFn.run(newRecipeId, formData).then(res => {
            addLocalRecipe(res);
          });
        } else {
          addLocalRecipe(res);
        }
        setOpened(false);
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
            {ingredients.map(ingredient => {
              const lastItem = [...ingredients].pop();
              return (
                <span
                  key={ingredient.id}
                  className={styles.ingredient}
                  onClick={() =>
                    setIngredients(prev =>
                      prev.filter(item => item.id !== ingredient.id)
                    )
                  }
                >
                  {ingredient.value} {ingredient.unit} {ingredient.name}
                  {lastItem?.id !== ingredient.id && ', '}
                </span>
              );
            })}
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
        <label className={styles.checkboxes}>
          <label>
            <input
              type='checkbox'
              value='vegetarian'
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleCheckboxToggle(e)
              }
            />
            <span>Vegetarian</span>
          </label>
          <label>
            <input
              type='checkbox'
              value='vegan'
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleCheckboxToggle(e)
              }
            />
            <span>Vegan</span>
          </label>
          <label>
            <input
              type='checkbox'
              value='spicy'
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleCheckboxToggle(e)
              }
            />
            <span>Spicy</span>
          </label>
        </label>
        <label>
          <span>Thumbnail</span>
          <input
            type='file'
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setThumbnail(e.target.files && e.target.files[0])
            }
          />
          <span className={styles.littleLabel}>Max size: 1MB</span>
        </label>
        <div>
          {addRecipeFn.errors && (
            <Error errors={addRecipeFn.errors} size='small' />
          )}
          {updateRecipeThumbnailFn.errors && (
            <Error errors={updateRecipeThumbnailFn.errors} size='small' />
          )}
          {thumbnailError && <Error errors={[thumbnailError]} size='small' />}
        </div>
        {addRecipeFn.loading || updateRecipeThumbnailFn.loading ? (
          <button
            className={`${styles.loadingButton} ${styles.submit}`}
            disabled
          >
            Loading...
          </button>
        ) : (
          <button className={styles.submit}>
            <span>Create recipe</span>
            <Icon name='add' />
          </button>
        )}
      </motion.form>
    </>
  );
}
