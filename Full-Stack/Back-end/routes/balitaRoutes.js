import express from 'express';
import {
  getAllBalita,
  getBalitaById,
  createBalita,
  updateBalita,
  deleteBalita
} from '../controllers/balitaController.js';

const router = express.Router();

router.route('/')
  .get(getAllBalita)
  .post(createBalita);

router.route('/:id')
  .get(getBalitaById)
  .put(updateBalita)
  .delete(deleteBalita);

export default router;
