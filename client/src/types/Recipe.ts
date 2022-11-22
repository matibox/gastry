import { Ingredient } from './Ingredient';

export interface Recipe {
  title: string;
  cookingTime: number;
  ingredients: Ingredient[];
  intructions: string;
  thumbnail: string;
}
