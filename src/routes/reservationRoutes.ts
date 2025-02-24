// @ts-nocheck
import { Router } from 'express';
import { addReservation, getReservations, getReservation, getReservationsByEmail, deleteReservation, getReservationsByDates } from '../controllers/reservationController';

const router = Router();

router.get('/date-range', getReservationsByDates);
router.get('/:id', getReservation);

router.post('/', addReservation);
router.get('/', getReservations);

router.get('/user/:email', getReservationsByEmail);
router.delete('/:id', deleteReservation);

export default router;
