import express from 'express';
import {
  getAllDataBalita,
  getDataBalitaById,
  createDataBalita,
  updateDataBalita,
  deleteDataBalita
} from '../controllers/dataBalitaController.js';

const router = express.Router();

router.route('/')
  .get(getAllDataBalita)
  .post(createDataBalita);

router.route('/:id')
  .get(getDataBalitaById)
  .put(updateDataBalita)
  .delete(deleteDataBalita);

export default router;
