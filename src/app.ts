import express from 'express';
import userRouter from './routes/user.route';
import projectRouter from './routes/project.route';

const app = express();

app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/projects', projectRouter);

export default app;