import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { HttpError } from '../middlewares/httpErrors';

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new HttpError('Invalid credentials', 401);
        }

        // Verificar password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new HttpError('Invalid credentials', 401);
        }

        // Generar token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || '',
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login successful',
            token,
            name: user.name,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
}; 