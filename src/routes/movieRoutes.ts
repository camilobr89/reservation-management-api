// @ts-nocheck
import { Router } from 'express';
import { createMovie, getMovies, getMovie, removeMovie, updateMovie } from '../controllers/movieController';

const router = Router();


router.post('/', createMovie);
router.get('/', getMovies);
router.get('/:id', getMovie);
router.delete('/:id', removeMovie);
router.put('/:id', updateMovie);


export default router;
