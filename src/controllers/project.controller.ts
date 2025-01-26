import { Project } from "../models/schema";
import { User } from "../models/schema";
import { Request, Response } from 'express';

// Extender la interfaz Request
interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const getProjects = async (req: Request, res: Response) => {    
    try {
        const projects = await Project.findAll();
        res.status(200).json(projects);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const findAllProjectsByUserId = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const projects = await Project.findAll({ where: { userId } });
        res.status(200).json(projects);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { title, description, img } = req.body;
        const userId = req.userId;

        console.log('Request body:', req.body);
        console.log('User ID from token:', userId);

        // Verificar que tenemos un userId válido
        if (!userId) {
            return res.status(401).json({ 
                message: 'No se ha proporcionado un token válido' 
            });
        }

        // crear el proyecto
        const newProject = await Project.create({ 
            title, 
            description, 
            image: img,
            userId: userId 
        });

        console.log('Created project:', newProject.toJSON());

        // Verificar que el proyecto se creó correctamente
        const savedProject = await Project.findByPk(newProject.id);
        console.log('Saved project:', savedProject ? savedProject.toJSON() : 'Not found');

        res.status(201).json(newProject);
    } catch (error: unknown) {
        console.error('Error creating project:', error);
        if (error instanceof Error) {
            res.status(500).json({ 
                message: error.message,
                error: error
            });
        } else {
            res.status(500).json({ 
                message: 'An unknown error occurred'
            });
        }
    }
};      

export const updateProject = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;  // ID del proyecto
        const userId = req.userId;   // ID del usuario del token
        const { title, description, img } = req.body;

        // Buscar el proyecto y verificar que pertenezca al usuario
        const project = await Project.findOne({
            where: { 
                id,
                userId 
            }
        });

        if (!project) {
            return res.status(404).json({ 
                message: 'Proyecto no encontrado o no pertenece al usuario' 
            });
        }

        // Actualizar el proyecto
        await project.update({ 
            title, 
            description, 
            image: img 
        });

        res.status(200).json(project);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};      

export const deleteProject = async (req: Request, res: Response) => {  
    try {
        const { id } = req.params;
        const project = await Project.findByPk(id);
        if (project) {
            await project.destroy();
            res.status(200).json({ message: 'Se ha eliminada el proyecto con id: ' + id });
        } else {
            res.status(404).json({ message: 'Proyecto no encontrado' });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
};