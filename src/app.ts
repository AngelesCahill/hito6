import express from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import { handleError } from './middlewares/httpErrors';

// Importar rutas
import loginRouter from './routes/login.route';
import registerRouter from './routes/register.route';
import logoutRouter from './routes/loginOut.route';
import userRouter from './routes/user.route';
import projectRouter from './routes/project.route';

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// Rutas API
app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);

// Ruta para el frontend (actualizada)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'home.html'));
});

// Manejador de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ error: message });
});

export default app; 