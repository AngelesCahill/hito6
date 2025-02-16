import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpError } from './httpErrors';

export interface AuthRequest extends Request {
    user?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            throw new HttpError('No token provided', 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new HttpError('Invalid token', 403));
        } else {
            next(error);
        }
    }
}; 