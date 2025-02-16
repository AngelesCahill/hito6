import { Model, DataTypes } from 'sequelize';
import sequelize from '../configDb/connectionDb';
import user from './user.model';

class project extends Model {
    public id!: number;
    public title!: string;
    public description!: string;
    public image!: string;
    public userId!: number;
}

project.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(250),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    image: {
        type: DataTypes.STRING(500),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'project'
});

// Relaciones
user.hasMany(project, {
    foreignKey: 'userId',
    as: 'projects'
});

project.belongsTo(user, {
    foreignKey: 'userId',
    as: 'user'
});

export default project; 