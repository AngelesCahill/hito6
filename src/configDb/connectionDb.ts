import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'codigoark',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'mao9684',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: true
    }
);

// Probar conexión
sequelize.authenticate()
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Unable to connect to the database:', err));

export default sequelize; 