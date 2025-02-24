import { Request, Response } from 'express';
import {
    createReservation, deleteReservationById,
    getAllReservations,
    getReservationById, getReservationsByDateRange,
    getReservationsByRoomAndSchedule
} from '../services/reservationService';
import {sendCancellationEmail, sendReservationEmail} from '../services/emailService';
import { Reservation } from '../models/reservation';
import {getRoomById} from "../services/roomService";
import {getMovieById} from "../services/movieService";


export const addReservation = async (req: Request, res: Response) => {
    const { movieId, roomId, userEmail, schedule, seats } = req.body;

    if (!movieId || !roomId || !userEmail || !schedule || !seats || seats.length === 0) {
        console.warn('⚠️ Missing fields in request:', req.body);
        return res.status(400).json({ error: 'Missing fields' });
    }

    try {
        // 🔍 1️⃣ Obtener todas las reservas existentes para la misma sala y horario
        const existingReservations = await getReservationsByRoomAndSchedule(roomId, schedule);

        // 🔍 2️⃣ Extraer los asientos ya ocupados
        const occupiedSeats = existingReservations.flatMap(res => res.seats);

        // ❌ 3️⃣ Verificar si los asientos seleccionados ya están ocupados
        const alreadyTakenSeats = seats.filter((seat: any) => occupiedSeats.includes(seat));
        if (alreadyTakenSeats.length > 0) {
            return res.status(400).json({
                error: `Los siguientes asientos ya están reservados: ${alreadyTakenSeats.join(", ")}`,
                occupiedSeats
            });
        }

        // ✅ 4️⃣ Crear la reserva si los asientos están disponibles
        const reservation: Reservation = { id: '', movieId, roomId, userEmail, schedule, seats };
        await createReservation(reservation);

        // 🔍 Obtener datos reales de película y sala
        const movie = await getMovieById(movieId);
        const room = await getRoomById(roomId);

        if (!movie || !room) {
            return res.status(404).json({ error: "Película o sala no encontradas" });
        }

        // 📧 Enviar correo con los datos reales
        await sendReservationEmail(userEmail, {
            movieName: movie.title,
            roomName: room.name,
            schedule,
            seats
        });

        console.log('📧 Email sent to:', userEmail);

        return res.status(201).json({ reservation, message: "Reserva confirmada. Se ha enviado un email." });
    } catch (error) {
        console.error('❌ Error creating reservation:', error);
        return res.status(500).json({ error: 'Could not create reservation', details: error });
    }
};

export const getReservations = async (req: Request, res: Response) => {
    const { roomId, schedule } = req.query;

    try {
        let reservations = await getAllReservations();

        if (roomId && schedule) {
            // @ts-ignore
            reservations = reservations.Items.filter(
                // @ts-ignore
                (reservation: Reservation) => reservation.roomId === roomId && reservation.schedule === schedule
            );
        } else {
            // @ts-ignore
            reservations = reservations.Items;
        }

        return res.json(reservations);
    } catch (error) {
        console.error('❌ Error fetching reservations:', error);
        return res.status(500).json({ error: 'Could not fetch reservations' });
    }
};


export const getReservation = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Reservation ID is required' });
    }

    try {
        console.log(`🔎 Fetching reservation with ID: ${id}`);
        const reservation = await getReservationById(id);
        if (!reservation.Item) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        return res.json(reservation.Item);
    } catch (error) {
        console.error('❌ Error fetching reservation:', error);
        return res.status(500).json({ error: 'Could not fetch reservation', details: error });
    }
};

export const getReservationsByEmail = async (req: Request, res: Response) => {
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({ error: 'User email is required' });
    }

    try {
        console.log(`🔎 Fetching reservations for email: ${email}`);
        const reservations = await getAllReservations();

        // @ts-ignore
        const userReservations = reservations.Items.filter((res: Reservation) => res.userEmail === email);

        if (userReservations.length === 0) {
            return res.status(404).json({ error: 'No reservations found for this email' });
        }

        // ✅ Aquí realizamos la consulta adicional para cada reserva y traer nombre de película y sala
        // @ts-ignore
        const detailedReservations = await Promise.all(userReservations.map(async (reservation: Reservation) => {
            const movie = await getMovieById(reservation.movieId);
            const room = await getRoomById(reservation.roomId);

            return {
                ...reservation,
                title: movie?.title || 'Película no encontrada',
                name: room?.name || 'Sala no encontrada'
            };
        }));

        return res.json(detailedReservations);
    } catch (error) {
        console.error('❌ Error fetching reservations by email:', error);
        return res.status(500).json({ error: 'Could not fetch reservations', details: error });
    }
};

export const deleteReservation = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Reservation ID is required' });
    }

    try {
        const reservation = await getReservationById(id);

        if (!reservation.Item) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Obtener detalles completos antes de eliminar
        const movie = await getMovieById(reservation.Item.movieId);
        const room = await getRoomById(reservation.Item.roomId);

        if (!movie || !room) {
            return res.status(404).json({ error: 'Movie or room not found' });
        }

        await deleteReservationById(id);

        // Enviar correo de cancelación después de eliminar exitosamente
        await sendCancellationEmail(reservation.Item.userEmail, {
            movieName: movie.title,
            roomName: room.name,
            schedule: reservation.Item.schedule,
            seats: reservation.Item.seats
        });

        console.log('📧 Email de cancelación enviado a:', reservation.Item.userEmail);

        return res.json({ message: 'Reservation deleted successfully and cancellation email sent.' });

    } catch (error) {
        console.error('❌ Error deleting reservation:', error);
        return res.status(500).json({ error: 'Could not delete reservation', details: error });
    }
};


export const getReservationsByDates = async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: "Start date and end date are required." });
    }

    try {
        const reservations = await getAllReservations();
        const start = new Date(`${startDate}T00:00:00`);
        const end = new Date(`${endDate}T23:59:59`);

        // @ts-ignore
        const filteredReservations = reservations.Items.filter((res: Reservation) => {
            const resDate = new Date(res.schedule.replace(' ', 'T'));
            return resDate >= start && resDate <= end;
        });

        // 🔥 Transformar reservas agregando título y nombre
        // @ts-ignore
        const detailedReservations = await Promise.all(filteredReservations.map(async (reservation: Reservation) => {
            const movie = await getMovieById(reservation.movieId);
            const room = await getRoomById(reservation.roomId);

            return {
                ...reservation,
                movieTitle: movie?.title || 'Película no encontrada',
                roomName: room?.name || 'Sala no encontrada',
                schedule: reservation.schedule
            };
        }));

        if (detailedReservations.length === 0) {
            return res.status(404).json({ message: "No hay reservas en este rango de fechas." });
        }

        return res.json(detailedReservations);
    } catch (error) {
        console.error("Error fetching reservations by date range:", error);
        return res.status(500).json({ error: "Error interno del servidor", details: error });
    }
};



