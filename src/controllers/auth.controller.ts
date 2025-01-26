import 'dotenv/config';
import { User } from "../models/schema.js";
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Definir interfaz para el payload del token
interface TokenPayload {
    id: string;
}

if (!process.env.SECRET_KEY) {
    throw new Error('SECRET_KEY must be defined in environment variables');
}

const secretKey = process.env.SECRET_KEY as string;

// Set para almacenar tokens invalidados
const invalidatedTokens = new Set<string>();

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ message: 'Usuario no registrado' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Password inválida' });
            return;
        }

        // Generar token con más información para debug
        const tokenPayload = { id: user.id };
        const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '1h' });
        
        // Enviar más información en la respuesta para debug
        res.status(200).json({ 
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'Email ya existe' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign({ id: newUser.id }, secretKey, { expiresIn: '1h' });
        res.status(201).json({ token });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            res.status(403).json({ message: 'No se ha proporcionado el token' });
            return;
        }

        if (!authHeader.startsWith('Bearer ')) {
            res.status(403).json({ message: 'Formato de token inválido' });
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(403).json({ message: 'No se ha proporcionado el token' });
            return;
        }

        // Verificar si el token está en la lista negra
        if (invalidatedTokens.has(token)) {
            res.status(401).json({ message: 'Token invalidado' });
            return;
        }

        try {
            const decoded = jwt.verify(token, secretKey) as TokenPayload;
            req.userId = decoded.id;
            next();
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                res.status(401).json({ message: 'Token inválido' });
            } else if (error instanceof jwt.TokenExpiredError) {
                res.status(401).json({ message: 'Token expirado' });
            } else {
                res.status(500).json({ message: 'Error al verificar el token' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Error en la autenticación' });
    }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            // Añadir el token a la lista negra
            invalidatedTokens.add(token);

            // Opcional: Limpiar tokens expirados de la lista negra
            setTimeout(() => {
                invalidatedTokens.delete(token);
            }, 3600000); // 1 hora
        }

        res.status(200).json({ 
            message: 'Logout exitoso',
            info: 'Token invalidado exitosamente'
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};
