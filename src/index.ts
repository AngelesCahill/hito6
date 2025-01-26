import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { sequelize } from './config/connection.db';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const main = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({alter: true});
        console.log('Connection has been established successfully.');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {   
        console.error(error);
    }
};

main();