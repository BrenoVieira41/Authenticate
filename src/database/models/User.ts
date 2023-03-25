import { DataTypes } from 'sequelize';
import { sequelize } from '../ormconfig';

export const User = sequelize.define('users', {
    id: {
        type: DataTypes.NUMBER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isComplet: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
})
