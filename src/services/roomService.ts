import dynamoDB from '../config/awsConfig';
import { Room } from '../models/room';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = 'Rooms';

export const addRoom = async (room: Room) => {
    room.id = uuidv4();
    const params = {
        TableName: TABLE_NAME,
        Item: room
    };
    return dynamoDB.put(params).promise();
};

export const getAllRooms = async () => {
    const params = {
        TableName: TABLE_NAME
    };
    return dynamoDB.scan(params).promise();
};


export const getRoomById = async (roomId: string) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id: roomId }
    };

    try {
        const result = await dynamoDB.get(params).promise();
        return result.Item || null;
    } catch (error) {
        console.error('❌ Error fetching room:', error);
        return null;
    }
};

export const updateRoomById = async (roomId: string, roomData: Partial<Room>) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id: roomId },
        UpdateExpression: 'set #name = :name, #capacity = :capacity',
        ExpressionAttributeNames: {
            '#name': 'name',
            '#capacity': 'capacity'
        },
        ExpressionAttributeValues: {
            ':name': roomData.name,
            ':capacity': roomData.capacity
        },
        ReturnValues: "UPDATED_NEW"
    };

    return dynamoDB.update(params).promise();
};

export const deleteRoomById = async (id: string) => {
    const params = {
        TableName: TABLE_NAME,
        Key: { id }
    };

    return dynamoDB.delete(params).promise();
};
