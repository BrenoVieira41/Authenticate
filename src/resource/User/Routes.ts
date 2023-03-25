import { Router } from 'express';
import authMiddleware from '../Middleware/AuthMiddleware';
import UserController from './UserController'; './UserController';

const routes = Router();

routes.post('/user/create', UserController.createUser);
routes.post('/user/complet', authMiddleware, UserController.completUser);
routes.post('/user/request/update-password', authMiddleware, UserController.passwordChangeRequest);
routes.post('/user/update-password', authMiddleware, UserController.updatePassword);

export default routes;
