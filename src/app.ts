// @ts-nocheck
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import movieRoutes from './routes/movieRoutes';
import roomRoutes from './routes/roomRoutes';
import reservationRoutes from './routes/reservationRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/movies', movieRoutes);
app.use('/rooms', roomRoutes);
app.use('/reservations', reservationRoutes);

export default app;
