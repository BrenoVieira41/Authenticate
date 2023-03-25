import { Request, Response } from 'express';
import UserService from './UserService';

class UserController {
  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const newUser = await UserService.createUser(email, password);
      return res.status(200).send(newUser);
    } catch (err) {
      console.log(err);
      return res.status(400).send('Falha ao cadastrar usuário');
    }
  }

  async completUser(req: Request, res: Response): Promise<Response> {
    try {
      const { token } = req.body;
      const user = req.user;
      const updateUser = await UserService.finishUser(user, token);
      return res.status(200).send(updateUser);
    } catch (err) {
      console.log(err);
      return res.status(400).send('Falha ao completar usuário');
    }
  }

  async passwordChangeRequest(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user;
      const changeRequest = await UserService.passwordRequestChenge(user);
      return res.status(200).send(changeRequest);
    } catch(err) {
      console.log(err);
      return res.status(400).send('Falha ao requisitar troca de senha')
    }
  }

  async updatePassword(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user;
      const data = req.body;
      const updatePassowrd = await UserService.updatePassword(user, data);
      return res.status(200).send(updatePassowrd);
    } catch(err) {
      console.log(err);
      return res.status(400).send('Falha ao requisitar troca de senha')
    }
  }
}

export default new UserController();
