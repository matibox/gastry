import express from 'express';
import { getFilters } from '../services/filters.services';

export const filtersRouter = express.Router();

filtersRouter.get('', async (req, res) => {
  try {
    const filters = await getFilters();
    if (!filters)
      return res.status(404).json([{ message: 'No filters available' }]);
    return res.status(200).json(filters);
  } catch (err: any) {
    return res.status(500).json([{ message: err.message }]);
  }
});
