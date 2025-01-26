import { User } from "../models/schema.js";
import { Project } from "../models/schema.js";
import { Request, Response } from 'express';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                message: error.message
            });
        } else {
            res.status(500).json({
                message: 'An unknown error occurred'
            });
        }
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (name && email && password) {
            const newUser = await User.create({ name, email, password });
            res.status(201).json(newUser);
        } else {
            res.status(400).json({
                message: 'Invalid data'
            });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                message: error.message
            });
        } else {
            res.status(500).json({
                message: 'An unknown error occurred'
            });
        }
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const user = await User.findByPk(id);
        if (user) {
            user.name = name;
            user.email = email;
            user.password = password;
            await user.save();
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (user) {
            await user.destroy();
            res.status(200).json({ message: 'Se ha eliminado el usuario con id ' + id });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};