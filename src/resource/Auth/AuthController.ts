import { Request, Response } from 'express';
import AuthService from './AuthService';

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const userLogin = await AuthService.login(email, password);
      return res.status(200).send(userLogin);
    } catch (err) {
      console.error(err);
      return res.status(400).send(err.message);
    }
  }

  async emailChangeRequest(req: Request, res: Response): Promise<Response> {
    try {
      const { id, email } = req.body;
      const requestEmail = await AuthService.emailRequestChenge(id, email);
      return res.status(200).send(requestEmail);
    } catch(err) {
      console.log(err);
      return res.status(400).send('Falha ao requisitar troca de senha')
    }
  }

  async updateEmail(req: Request, res: Response): Promise<Response> {
    try {
      const { id, email } = req.body;
      const { token } = req.params;
      const requestEmail = await AuthService.updateEmail(id, email, token);
      return res.status(200).send(requestEmail);
    } catch(err) {
      console.log(err);
      return res.status(400).send('Falha ao troca de e-mail')
    }
  }
}

export default new AuthController();
