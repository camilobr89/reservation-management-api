import { Request, Response } from 'express';
import {addRoom, deleteRoomById, getAllRooms, getRoomById, updateRoomById} from '../services/roomService';
import { Room } from '../models/room';

export const createRoom = async (req: Request, res: Response) => {
    const { name, capacity } = req.body;

    if (!name || !capacity) {
        console.warn('⚠️ Missing fields in request:', req.body);
        return res.status(400).json({ error: 'Missing fields' });
    }

    const room: Room = { id: '', name, capacity };

    try {
        console.log('✅ Adding room to DynamoDB:', room);
        await addRoom(room);
        return res.status(201).json(room);
    } catch (error) {
        console.error('❌ Error adding room:', error);
        return res.status(500).json({ error: 'Could not add room', details: error });
    }
};

export const getRooms = async (_req: Request, res: Response) => {
    try {
        console.log('📦 Fetching rooms from DynamoDB...');
        const rooms = await getAllRooms();
        console.log('✅ Rooms retrieved:', rooms.Items);
        return res.json(rooms.Items);
    } catch (error) {
        console.error('❌ Error fetching rooms:', error);
        return res.status(500).json({ error: 'Could not fetch rooms' });
    }
};

export const getRoom = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Room ID is required' });
    }

    try {
        console.log(`🔎 Fetching room with ID: ${id}`);
        const room = await getRoomById(id);
        // @ts-ignore
        if (!room.Item) {
            return res.status(404).json({ error: 'Room not found' });
        }
        // @ts-ignore
        return res.json(room.Item);
    } catch (error) {
        console.error('❌ Error fetching room:', error);
        return res.status(500).json({ error: 'Could not fetch room', details: error });
    }
};

export const updateRoom = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, capacity } = req.body;

    if (!name || !capacity) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    try {
        await updateRoomById(id, { name, capacity });
        return res.json({ message: 'Room updated successfully' });
    } catch (error) {
        console.error('❌ Error updating room:', error);
        return res.status(500).json({ error: 'Could not update room', details: error });
    }
};

export const deleteRoom = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await deleteRoomById(id);
        return res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error('❌ Error deleting room:', error);
        return res.status(500).json({ error: 'Could not delete room', details: error });
    }
};

