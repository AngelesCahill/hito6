import { Request, Response, NextFunction } from 'express';
import Project from '../models/project.model';
import { HttpError } from '../middlewares/httpErrors';
import { AuthRequest } from '../middlewares/jsonwebtoken';
import multer from 'multer';
import path from 'path';

// Extender la interfaz AuthRequest para incluir el archivo
interface MulterRequest extends AuthRequest {
    file?: Express.Multer.File;
}

// Configurar multer para la carga de imágenes
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, 'public/uploads/');
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

export const upload = multer({ 
    storage: storage,
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('No es una imagen válida'));
        }
    }
});

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projects = await Project.findAll();
        res.json(projects);
    } catch (error) {
        next(error);
    }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const project = await Project.findByPk(id);

        if (!project) {
            throw new HttpError('Project not found', 404);
        }

        res.json(project);
    } catch (error) {
        next(error);
    }
};

export const createProject = async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
        const { title, description } = req.body;
        const userId = req.user?.id;
        const image = req.file?.filename;

        if (!userId) {
            throw new HttpError('User not authenticated', 401);
        }

        const project = await Project.create({
            title,
            description,
            image: image ? `/uploads/${image}` : null,
            userId
        });

        res.status(201).json(project);
    } catch (error) {
        next(error);
    }
};

export const updateProject = async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const userId = req.user?.id;
        const image = req.file?.filename;

        const project = await Project.findByPk(id);
        if (!project) {
            throw new HttpError('Project not found', 404);
        }

        if (project.userId !== userId) {
            throw new HttpError('Not authorized to update this project', 403);
        }

        await project.update({ 
            title, 
            description,
            image: image ? `/uploads/${image}` : project.image // Mantener la imagen anterior si no se sube una nueva
        });

        res.json({ 
            message: 'Project updated successfully',
            project
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const project = await Project.findByPk(id);
        if (!project) {
            throw new HttpError('Project not found', 404);
        }

        if (project.userId !== userId) {
            throw new HttpError('Not authorized to delete this project', 403);
        }

        await project.destroy();
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const getProjectsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        
        const projects = await Project.findAll({
            where: { userId: userId },
            attributes: ['id', 'title', 'description', 'image'],
            order: [['createdAt', 'DESC']]
        });

        res.json(projects);
    } catch (error) {
        console.error('Error getting user projects:', error);
        next(new HttpError('Error getting user projects', 500));
    }
}; 