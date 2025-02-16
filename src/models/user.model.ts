import { Model, DataTypes } from 'sequelize';
import sequelize from '../configDb/connectionDb';

class user extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
}

user.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(350),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(350),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'user'
});

export default user; 