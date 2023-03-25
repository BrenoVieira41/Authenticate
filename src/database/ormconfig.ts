import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();

export const sequelize = new Sequelize(process.env.DATABASE, {define: { timestamps: false }});
