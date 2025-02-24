// @ts-nocheck
import { Router } from 'express';
import { createRoom, getRooms, getRoom, updateRoom, deleteRoom } from '../controllers/roomController';

const router = Router();

router.post('/', createRoom);
router.get('/', getRooms);
router.get('/:id', getRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

export default router;
