import { table } from "console";
import { 
    Column, 
    IsUUID, 
    PrimaryKey, 
    Table,
    Default,
    Model,
    DataType,
    AllowNull,
    IsEmail,
    Unique,
    Length,
    HasMany,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";   

interface UserAttributes {      
    id?: string;      
    email: string;      
    name?: string;      
    password: string;      
}

@Table({
    tableName: 'users'
})
export class User extends Model<UserAttributes> {
    @PrimaryKey
    @IsUUID(4)
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @AllowNull(false)
    @IsEmail
    @Unique
    @Column(DataType.STRING)
    declare email: string;

    @AllowNull(false)
    @Length({min: 2, max: 50})
    @Column(DataType.STRING)
    declare name: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    declare password: string;

    @HasMany(() => Project)
    projects!: Project[];

}


interface ProjectAttributes {
    id?: string;
    title: string;
    description: string;
    image: string;
    userId: string;
}

@Table({
    tableName: 'projects'
})
export class Project extends Model<ProjectAttributes> {
    @PrimaryKey
    @IsUUID(4)
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare id: string;

    @AllowNull(false)
    @Length({min: 2, max: 50})
    @Column(DataType.STRING)
    declare title: string;

    @AllowNull(false)
    @Length({min: 2, max: 350})
    @Column(DataType.STRING)
    declare description: string;

    @AllowNull(false)
    @Column(DataType.DATE)
    declare image: string;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.UUID)
    userId!: string;

    @BelongsTo(() => User)
    arquitect!: User;
}