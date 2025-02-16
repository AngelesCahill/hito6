import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { HttpError } from '../middlewares/httpErrors';
import { Op } from 'sequelize';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        next(new HttpError('Error getting users', 500));
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            throw new HttpError('User not found', 404);
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        console.log('Updating user:', { id, name, email }); // Debug

        const userToUpdate = await User.findByPk(id);
        console.log('Found user:', userToUpdate); // Debug

        if (!userToUpdate) {
            throw new HttpError(`User with id ${id} not found`, 404);
        }

        // Verificar si el email ya existe
        if (email) {
            const existingUser = await User.findOne({ 
                where: { 
                    email,
                    id: { [Op.ne]: id }
                } 
            });
            if (existingUser) {
                throw new HttpError('Email already in use', 400);
            }
        }

        await userToUpdate.update({ name, email });

        res.json({
            message: 'User updated successfully',
            user: {
                id: userToUpdate.id,
                name: userToUpdate.name,
                email: userToUpdate.email
            }
        });
    } catch (error) {
        console.error('Error updating user:', error); // Debug
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        
        if (!user) {
            throw new HttpError('User not found', 404);
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
}; 