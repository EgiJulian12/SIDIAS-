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

router.route('/')
  .get(getAllAnalisis)
  .post(createAnalisis);

router.route('/:id')
  .get(getAnalisisById)
  .put(updateAnalisis)
  .delete(deleteAnalisis);

router.route('/data-balita/:data_id')
  .get(getAnalisisByDataId);

export default router;
