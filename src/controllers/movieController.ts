import { Request, Response } from 'express';
import {addMovie, deleteMovieById, getAllMovies, getMovieById, updateMovieById} from '../services/movieService';
import { Movie } from '../models/movie';

export const createMovie = async (req: Request, res: Response) => {
    const { title, genre, duration, rating } = req.body;

    if (!title || !genre || !duration || !rating) {
        console.warn('⚠️ Missing fields in request:', req.body);
        return res.status(400).json({ error: 'Missing fields' });
    }

    const movie: Movie = { id: '', title, genre, duration, rating };

    try {
        console.log('✅ Adding movie to DynamoDB:', movie);
        await addMovie(movie);
        return res.status(201).json(movie);
    } catch (error) {
        console.error('❌ Error adding movie:', error);
        return res.status(500).json({ error: 'Could not add movie', details: error });
    }
};

export const getMovies = async (_req: Request, res: Response) => {
    try {
        console.log('📦 Fetching movies from DynamoDB...');
        const movies = await getAllMovies();
        console.log('✅ Movies retrieved:', movies.Items);
        return res.json(movies.Items);
    } catch (error) {
        console.error('❌ Error fetching movies:', error);
        return res.status(500).json({ error: 'Could not fetch movies', details: error });
    }
};

export const getMovie = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Movie ID is required' });
    }

    try {
        console.log(`🔎 Fetching movie with ID: ${id}`);
        const movie = await getMovieById(id);
        // @ts-ignore
        if (!movie.Item) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        // @ts-ignore
        return res.json(movie.Item);
    } catch (error) {
        console.error('❌ Error fetching movie:', error);
        return res.status(500).json({ error: 'Could not fetch movie', details: error });
    }
};

export const removeMovie = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Se requiere el ID de la película.' });
    }

    try {
        await deleteMovieById(id);
        return res.json({ message: 'Película eliminada exitosamente.' });
    } catch (error) {
        console.error('Error deleting movie:', error);
        return res.status(500).json({ error: 'No se pudo eliminar la película.' });
    }
};


export const updateMovie = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, genre, duration, rating } = req.body;

    if (!id || !title || !genre || !duration || !rating) {
        return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }

    try {
        const updatedMovie = await updateMovieById({ id, title, genre, duration, rating });
        return res.json({ movie: updatedMovie });
    } catch (error) {
        console.error('Error updating movie:', error);
        return res.status(500).json({ error: 'No se pudo actualizar la película.' });
    }
};


