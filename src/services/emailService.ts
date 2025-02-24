// @ts-nocheck
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

AWS.config.update({
    region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

export const sendReservationEmail = async (toEmail: string, reservationDetails: { movieName: string, roomName: string, schedule: string, seats: string[] }) => {
    const emailParams = {
        Source: `Cine Reservas <${process.env.AWS_SES_EMAIL_FROM}>`,
        Destination: { ToAddresses: [toEmail] },
        Message: {
            Subject: { Data: `🎟️ Confirmación de Reserva - ${reservationDetails.movieName}` },
            Body: {
                Html: {
                    Data: `
                        <html>
                            <body style=\"font-family: Arial, sans-serif; color: #333;\">
                                <h2 style=\"color: #007bff;\">🎬 ¡Tu reserva está confirmada!</h2>
                                <p>Hola,</p>
                                <p>Gracias por reservar tu entrada en nuestro cine. Aquí están los detalles de tu reserva:</p>
                                <ul>
                                    <li><strong>🎥 Película:</strong> ${reservationDetails.movieName}</li>
                                    <li><strong>🏢 Sala:</strong> ${reservationDetails.roomName}</li>
                                    <li><strong>📅 Fecha y Hora:</strong> ${reservationDetails.schedule}</li>
                                    <li><strong>🎫 Asientos:</strong> ${reservationDetails.seats.join(', ')}</li>
                                </ul>
                                <p>¡Disfruta la función y no olvides comprar tus palomitas! 🍿</p>
                            </body>
                        </html>
                    `
                },
                Text: {
                    Data: `Tu reserva está confirmada:\n\nPelícula: ${reservationDetails.movieName}\nSala: ${reservationDetails.roomName}\nFecha y Hora: ${reservationDetails.schedule}\nAsientos: ${reservationDetails.seats.join(', ')}`
                }
            }
        }
    };

    try {
        const result = await ses.sendEmail(emailParams).promise();
        return result;
    } catch (error) {
        throw error;
    }
};

export const sendCancellationEmail = async (toEmail: string, reservationDetails: { movieName: string, roomName: string, schedule: string, seats: string[] }) => {
    const emailParams = {
        Source: `Cine Reservas <${process.env.AWS_SES_EMAIL_FROM}>`,
        Destination: { ToAddresses: [toEmail] },
        Message: {
            Subject: { Data: `❌ Cancelación de Reserva - ${reservationDetails.movieName}` },
            Body: {
                Html: {
                    Data: `
                        <html>
                            <body style=\"font-family: Arial, sans-serif; color: #333;\">
                                <h2 style=\"color: #dc3545;\">Reserva Cancelada</h2>
                                <p>Hola,</p>
                                <p>Tu reserva ha sido cancelada. Aquí están los detalles:</p>
                                <ul>
                                    <li><strong>🎥 Película:</strong> ${reservationDetails.movieName}</li>
                                    <li><strong>🏢 Sala:</strong> ${reservationDetails.roomName}</li>
                                    <li><strong>📅 Fecha y Hora:</strong> ${reservationDetails.schedule}</li>
                                    <li><strong>🎫 Asientos:</strong> ${reservationDetails.seats.join(', ')}</li>
                                </ul>
                                <p>Esperamos verte pronto en otra ocasión. 🎬🍿</p>
                            </body>
                        </html>
                    `
                },
                Text: {
                    Data: `Tu reserva ha sido cancelada:\n\nPelícula: ${reservationDetails.movieName}\nSala: ${reservationDetails.roomName}\nFecha y Hora: ${reservationDetails.schedule}\nAsientos: ${reservationDetails.seats.join(', ')}`
                }
            }
        }
    };

    try {
        const result = await ses.sendEmail(emailParams).promise();
        return result;
    } catch (error) {
        throw error;
    }
};
