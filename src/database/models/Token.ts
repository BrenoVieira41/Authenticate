import { DataTypes } from 'sequelize';
import { sequelize } from '../ormconfig';
import { User } from './User';

export const Token = sequelize.define('tokens', {
    id: {
        type: DataTypes.NUMBER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true,
        unique: true
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,

      },
      userId: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      tokenValidate: {
        type: DataTypes.DATE,
        defaultValue: new Date()
      },
});

Token.belongsTo(User, {
    constraints: true,
    foreignKey: 'userId'
});
