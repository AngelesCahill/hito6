import {Sequelize} from 'sequelize-typescript';
import { User, Project } from '../models/schema';

export const sequelize = new Sequelize('hito5', 'postgres', 'mao9684',{
    dialect: 'postgres',
    host: 'localhost',
    models: [User, Project]
});