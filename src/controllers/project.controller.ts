import { Project } from "../models/schema.js";
import { User } from "../models/schema.js";
import { Request, Response } from 'express';

// Extender la interfaz Request
interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const getProjects = async (req: Request, res: Response): Promise<void> => {    
    try {
        const projects = await Project.findAll({
            include: [{
                model: User,
                attributes: ['id', 'name', 'email'] // Solo incluir estos campos del usuario
            }]
        });
        res.status(200).json(projects);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const findAllProjectsByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId; // Usar el ID del usuario autenticado
        const projects = await Project.findAll({ 
            where: { userId },
            include: [{
                model: User,
                attributes: ['id', 'name', 'email']
            }]
        });
        res.status(200).json(projects);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, img } = req.body;
        const userId = req.userId; // Usar el ID del usuario autenticado

        if (!userId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }

        const newProject = await Project.create({ 
            title, 
            description, 
            image: img,
            userId // Asignar el userId del token
        });

        // Cargar el proyecto con la información del usuario
        const projectWithUser = await Project.findByPk(newProject.id, {
            include: [{
                model: User,
                attributes: ['id', 'name', 'email']
            }]
        });

        res.status(201).json(projectWithUser);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};      

export const updateProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.userId; // Usar el ID del usuario autenticado
        const { title, description, img } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }

        // Verificar que el proyecto pertenezca al usuario
        const project = await Project.findOne({
            where: { 
                id,
                userId 
            }
        });

        if (!project) {
            res.status(404).json({ message: 'Proyecto no encontrado o no autorizado' });
            return;
        }

        // Actualizar el proyecto
        await project.update({ 
            title, 
            description, 
            image: img 
        });

        // Cargar el proyecto actualizado con la información del usuario
        const updatedProject = await Project.findByPk(project.id, {
            include: [{
                model: User,
                attributes: ['id', 'name', 'email']
            }]
        });

        res.status(200).json(updatedProject);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};      

export const deleteProject = async (req: Request, res: Response): Promise<void> => {  
    try {
        const { id } = req.params;
        const userId = req.userId; // Usar el ID del usuario autenticado

        if (!userId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }

        // Verificar que el proyecto pertenezca al usuario
        const project = await Project.findOne({
            where: { 
                id,
                userId 
            }
        });

        if (!project) {
            res.status(404).json({ message: 'Proyecto no encontrado o no autorizado' });
            return;
        }

        await project.destroy();
        res.status(200).json({ message: 'Proyecto eliminado correctamente' });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};