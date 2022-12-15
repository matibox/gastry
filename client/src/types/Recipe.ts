import { Ingredient } from './Ingredient';

export interface Recipe {
  title: string;
  cookingTime: number;
  ingredients: Ingredient[];
  instructions: string;
  thumbnail: string;
  isAuthor: boolean;
  types: { id: string; name: string }[];
}
