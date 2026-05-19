import express from 'express';
import {
  getAllAnalisis,
  getAnalisisById,
  getAnalisisByDataId,
  createAnalisis,
  updateAnalisis,
  deleteAnalisis
} from '../controllers/analisisController.js';

const router = express.Router();

// Rute untuk mengambil semua data dan menambah analisis baru
router.route('/')
  .get(getAllAnalisis)
  .post(createAnalisis);

// Rute untuk mengambil, mengubah, dan menghapus analisis berdasarkan ID
router.route('/:id')
  .get(getAnalisisById)
  .put(updateAnalisis)
  .delete(deleteAnalisis);

// Rute untuk mengambil data analisis berdasarkan ID balita
router.route('/data-balita/:data_id')
  .get(getAnalisisByDataId);

export default router;
