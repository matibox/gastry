import express from 'express';
import type { Request, Response } from 'express';
import { getFilters } from './service';

export const filtersRouter = express.Router();

filtersRouter.get('', async (req: Request, res: Response) => {
  try {
    const filters = await getFilters();
    if (!filters) return res.status(404).json('No filters available');
    return res.status(200).json(filters);
  } catch (err: any) {
    return res.status(500).json(err.message);
  }
});
