# Sistema de Gestión de Reservas - API Backend

Este proyecto implementa una API RESTful para la gestión de reservas de un cine. Permite registrar películas, salas, reservar asientos y gestionar notificaciones por correo electrónico usando AWS SES.

## 📚 Funcionalidades

- Registro y gestión de películas.
- Registro y gestión de salas.
- Reserva de asientos con validación de disponibilidad.
- Listado de películas, salas y reservas.
- Notificaciones automáticas por correo electrónico al realizar o cancelar reservas.

## 🚀 Tecnologías Usadas

- Node.js con Express
- AWS DynamoDB para almacenamiento de datos
- AWS SES para envío de correos electrónicos

## 🔧 Requisitos

Para ejecutar este proyecto, necesitarás minimo node v20 o superior y configurar las siguientes variables de entorno creando en la raiz del proyecto el archivo .env:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_SES_EMAIL_FROM=tu_correo_origen
```

Asegúrate de reemplazar estos valores con tus credenciales reales de AWS.

## 🛠 Instalación

Clona el repositorio:

```bash
git clone https://github.com/camilobr89/reservation-management-api
cd reservation-management-api
```

Instala las dependencias:

```bash
npm install
```

Ejecuta la aplicación localmente:

```bash
npm run start
```
La aplicación correrá en http://localhost:3000

## 🌐 Documentación de la API

La documentación completa de la API está disponible en el siguiente enlace:

📖 [Documentación Swagger](https://studio-ws.apicur.io/sharing/7bff0727-f2c4-4057-a13b-685df14974a5)


## ✅ Pruebas y Validación

Utiliza herramientas como Postman o la interfaz Swagger proporcionada para probar los endpoints de la API.

## 📩 Notificaciones Email

Asegúrate de haber configurado AWS SES correctamente y verificado el correo electrónico especificado en `AWS_SES_EMAIL_FROM`.


