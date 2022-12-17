import express from 'express';
import authToken from '../middleware/authenticateToken';
import validateSchema from '../middleware/validateSchema';
import { createMenuSchema } from '../schemas/menu.schema';
import { addMenu, getMenus } from '../services/menu.services';
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
