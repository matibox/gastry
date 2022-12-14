import express from 'express';
import authToken from '../middleware/authenticateToken';
import validateSchema from '../middleware/validateSchema';
import { createMenuSchema } from '../schemas/menu.schema';
import {
  addMenu,
  deleteMenu,
  editMenu,
  getMenus,
  removeRecipe,
  setRecipe,
} from '../services/menu.services';
import { findByEmail } from '../services/user.services';

export const menuRouter = express.Router();

// GET: menus
menuRouter.get('/', authToken, async (req, res) => {
  //@ts-ignore
  const user = req.user;

  try {
    const foundUser = await findByEmail(user.email);
    if (!foundUser) {
      return res.status(404).json([{ message: 'No user found' }]);
    }

    const menus = await getMenus(foundUser.id);

    if (menus.length === 0) {
      return res.status(404).json([{ message: 'Add menus to begin!' }]);
    }

    return res.status(200).json(menus);
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }
});

// POST: add new menu
menuRouter.post(
  '/',
  validateSchema(createMenuSchema),
  authToken,
  async (req, res) => {
    const { name } = req.body;
    //@ts-ignore
    const user = req.user;

    try {
      const foundUser = await findByEmail(user.email);
      if (!foundUser) {
        return res.status(404).json([{ message: 'No user found' }]);
      }

      const createdMenu = await addMenu(foundUser.id, name);

      return res.status(200).json(createdMenu);
    } catch (err: any) {
      return res.status(500).json([{ message: err.message }]);
    }
  }
);

// POST: set recipe
menuRouter.post('/recipe', authToken, async (req, res) => {
  const { recipeId, timeOfDayId } = req.body;
  if (!recipeId || !timeOfDayId) {
    return res.status(400).json([{ message: "No id's provided" }]);
  }

  try {
    const updatedTimeOfDay = await setRecipe(recipeId, timeOfDayId);
    return res.status(200).json(updatedTimeOfDay);
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }
});

// PATCH: change menu name
menuRouter.patch(
  '/:id',
  validateSchema(createMenuSchema),
  authToken,
  async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    //@ts-ignore
    const user = req.user;

    try {
      const foundUser = await findByEmail(user.email);
      if (!foundUser) {
        return res.status(404).json([{ message: 'No user found' }]);
      }

      const menu = await editMenu(id, name);
      return res.status(200).json(menu);
    } catch (err: any) {
      res.status(500).json([{ message: err.message }]);
    }
  }
);

// DELETE: delete recipe
menuRouter.delete('/recipe', authToken, async (req, res) => {
  const { timeOfDayId } = req.body;
  if (!timeOfDayId)
    return res.status(400).json([{ message: 'No id provided' }]);

  try {
    const deletedRecipe = await removeRecipe(timeOfDayId);
    return res.status(200).json(deletedRecipe);
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }
});

// DELETE: delete menu
menuRouter.delete('/:id', authToken, async (req, res) => {
  const { id: menuId } = req.params;

  try {
    const { id } = await deleteMenu(menuId);
    return res.status(200).json(id);
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }
});
