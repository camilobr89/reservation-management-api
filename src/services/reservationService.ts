import dynamoDB from '../config/awsConfig';
import { Reservation } from '../models/reservation';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = 'Reservations';

export const createReservation = async (reservation: Reservation) => {
    reservation.id = uuidv4(); // Generar ID único
    const params = {
        TableName: TABLE_NAME,
        Item: reservation
    };
    return dynamoDB.put(params).promise();
};

export const getAllReservations = async () => {
    const params = { TableName: TABLE_NAME };
    return dynamoDB.scan(params).promise();
};

export const getReservationById = async (id: string) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id }
    };
    return dynamoDB.get(params).promise();
};

export const getReservationsByRoomAndSchedule = async (roomId: string, schedule: string) => {
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: "roomId = :room AND schedule = :schedule",
        ExpressionAttributeValues: {
            ":room": roomId,
            ":schedule": schedule
        }
    };

    const result = await dynamoDB.scan(params).promise();
    return result.Items || [];
};

export const deleteReservationById = async (id: string) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id }
    };
    return dynamoDB.delete(params).promise();
};


export const getReservationsByDateRange = async (startDate: string, endDate: string) => {
    const params = { TableName: TABLE_NAME };
    const data = await dynamoDB.scan(params).promise();

    // @ts-ignore
    return data.Items.filter(item => {
        const scheduleDate = new Date(item.schedule).getTime();
        return scheduleDate >= new Date(startDate).getTime() && scheduleDate <= new Date(endDate).getTime();
    });
};

