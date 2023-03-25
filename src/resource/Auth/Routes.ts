import { Router } from 'express';
import AuthController from './AuthController';

const routes = Router();

routes.post('/auth/login', AuthController.login);
routes.post('/auth/request/new-email', AuthController.emailChangeRequest);
routes.post('/auth/new-email/:token', AuthController.updateEmail);

export default routes;
