import { Request, Response } from 'express';

export const logout = (req: Request, res: Response) => {
    res.json({ message: 'Logged out successfully' });
}; 