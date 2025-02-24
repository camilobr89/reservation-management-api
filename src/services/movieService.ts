// @ts-nocheck
import dynamoDB from '../config/awsConfig';
import { Movie } from '../models/movie';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = 'Movies';

export const addMovie = async (movie: Movie) => {
    movie.id = uuidv4();
    const params = {
        TableName: TABLE_NAME,
        Item: movie
    };
    return dynamoDB.put(params).promise();
};

export const getAllMovies = async () => {
    const params = { TableName: TABLE_NAME };
    return dynamoDB.scan(params).promise();
};


export const getMovieById = async (movieId: string) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id: movieId }
    };

    try {
        const result = await dynamoDB.get(params).promise();
        return result.Item || null;
    } catch (error) {
        console.error('Error fetching movie:', error);
        return null;
    }
};

export const deleteMovieById = async (movieId: string) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id: movieId }
    };
    return dynamoDB.delete(params).promise();
};

export const updateMovieById = async (movie: Movie) => {
    const params = {
        TableName: 'Movies',
        Key: { id: movie.id },
        UpdateExpression: 'SET title = :title, genre = :genre, #dur = :duration, rating = :rating',
        ExpressionAttributeNames: {
            '#dur': 'duration'
        },
        ExpressionAttributeValues: {
            ':title': movie.title,
            ':genre': movie.genre,
            ':duration': movie.duration,
            ':rating': movie.rating,
        },
        ReturnValues: 'ALL_NEW'
    };

    const result = await dynamoDB.update(params).promise();
    return result.Attributes;
};

