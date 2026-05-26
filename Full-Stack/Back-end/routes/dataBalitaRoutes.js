import express from 'express';
import {
  getAllDataBalita,
  getDataBalitaById,
  createDataBalita,
  updateDataBalita,
  deleteDataBalita
} from '../controllers/dataBalitaController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Rute untuk mengambil semua data dan menambah data balita
router.route('/')
  .get(getAllDataBalita)
  .post(upload.single('foto'), createDataBalita);

// Rute untuk mengambil, mengubah, dan menghapus data balita berdasarkan ID
router.route('/:id')
  .get(getDataBalitaById)
  .put(updateDataBalita)
  .delete(deleteDataBalita);

export default router;
