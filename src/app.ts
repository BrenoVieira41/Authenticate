import express, { Router } from 'express';
import UserController from './resource/User/Routes';
import AuthController from './resource/Auth/Routes';

const app = express();

app.use(express.json());
app.use(UserController);
app.use(AuthController);

export { app };
