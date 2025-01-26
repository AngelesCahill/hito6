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
        const { title, description, image } = req.body;
        const userId = req.userId; // Viene del token

        if (!userId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }

        // Verificar que el usuario existe
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        console.log('Creating project with userId:', userId); // Para debug

        const newProject = await Project.create({ 
            title, 
            description, 
            image,
            userId: userId // Asegurarnos de que se asigna correctamente
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
        console.error('Error completo:', error); // Para debug
        if (error instanceof Error) {
            res.status(500).json({ 
                message: error.message,
                error: error // Incluir el error completo para debug
            });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};      

export const updateProject = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { title, description, image } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'Usuario no autenticado' });
            return;
        }

        // Validar formato UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            res.status(400).json({ 
                message: 'ID de proyecto inválido. Debe ser un UUID válido.',
                example: '123e4567-e89b-12d3-a456-426614174000'
            });
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

        await project.update({ 
            title, 
            description, 
            image
        });

        const updatedProject = await Project.findByPk(project.id, {
            include: [{
                model: User,
                attributes: ['id', 'name', 'email']
            }]
        });

        res.status(200).json(updatedProject);
    } catch (error: unknown) {
        console.error('Error updating project:', error);
        if (error instanceof Error) {
            res.status(500).json({ 
                message: error.message,
                error: error
            });
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