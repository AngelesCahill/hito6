import app from './app';
import sequelize from './configDb/connectionDb';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // Emitir el mensaje a todos los clientes
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

async function main() {
    try {
        // Sincronizar base de datos
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log('Database connected and synchronized');

        // Iniciar servidor
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
}

main(); 