import dynamoDB from '../config/awsConfig';

export const putItem = async (tableName: string, item: any) => {
    const params = {
        TableName: tableName,
        Item: item
    };
    return dynamoDB.put(params).promise();
};

export const getAllItems = async (tableName: string) => {
    const params = { TableName: tableName };
    return dynamoDB.scan(params).promise();
};
