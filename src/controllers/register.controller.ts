import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import user from '../models/user.model';
import { HttpError } from '../middlewares/httpErrors';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await user.findOne({ where: { email } });
        if (existingUser) {
            throw new HttpError('Email already registered', 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const newUser = await user.create({
            name,
            email,
            password: hashedPassword
        });

        // Generar token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            process.env.JWT_SECRET || '',
            { expiresIn: '1d' }
        );

        // Responder con el token y datos del usuario
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        next(error);
    }
}; 