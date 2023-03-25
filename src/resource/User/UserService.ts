import { hash, compare } from 'bcrypt';
import { subDays } from 'date-fns';
import { isEmail, isPassword } from 'user-validatior-for-npm';
import UserRepository from './UserRepository';
import { IChengePassword, IToken, IUser } from './UserInterface';
import { MailService } from '@sendgrid/mail';
import UtilsServer from '../utils/UtilsServer';

class UserSerivice {
  private readonly userRepository: UserRepository;
  private readonly sendGrid: MailService;

  constructor() {
    this.userRepository = new UserRepository();
    this.sendGrid = new MailService();
    this.sendGrid.setApiKey(process.env.SENDGRID_KEY);
  }

  public async createUser(email: string, password: string): Promise<IUser> {
    try {
      const secrectPassword = await hash(password, 8);
      if (!isEmail(email)) {
        throw new Error('E-mail inválido')
      }

      const emailExist: IUser = await this.userRepository.validateEmail(email);

      if (emailExist !== null) {
        throw new Error('E-mail já cadastrado');
      }

      if (!isPassword(password)) {
        throw new Error('Senha inválida');
      }

      let newUser: IUser = await this.userRepository.createUser({ email, password: secrectPassword });

      Reflect.deleteProperty(newUser, 'password');

      await this.userRepository.deleteAllTokensforUser(newUser.id);

      const newToken: IToken = await UtilsServer.createToken(newUser.id);
      await UtilsServer.sendEmail(
        'Confirmação de usuário',
        `Código de validação de usuário: (${newToken.token})`,
        newUser.email
      );

      return newUser;
    } catch (err) {
      throw new Error(err);
    }
  }

  public async finishUser(user: IUser | any, token: string) {
    const tokenValidate = subDays(new Date(), 1);
    const userToken = await this.userRepository.validateToken(user.id, token, tokenValidate);

    if (userToken === null) {
      throw new Error('Token inválido');
    }

    if (user.isComplet === true) {
      return;
    }

    await this.userRepository.completUser(user.id);
    await this.userRepository.deleteAllTokensforUser(user.id);
    return 'Usuário finalizado.';
  }

  public async passwordRequestChenge(user: IUser) {
    const title = 'troca de senha'

    if (user.isComplet !== true) {
      throw new Error('Cadastro incompleto.');
    }

    await this.userRepository.deleteAllTokensforUser(user.id);
    const newToken: IToken = await UtilsServer.createToken(user.id);

    await UtilsServer.sendEmail(
      title,
      `Código de validação para ${title}: (${newToken.token})`,
      user.email
    );

    return `Solicitação de senha`;
  }

  public async updatePassword(user: IUser, data: IChengePassword) {
    const { password, confirmPassword } = data;
    const tokenValidate = subDays(new Date(), 1);
    const userToken = await this.userRepository.validateToken(user.id, data.token, tokenValidate);

    if (user.isComplet !== true) {
      throw new Error('Cadastro incompleto.');
    }

    if (!isPassword(password)) {
      throw new Error('Senha inválida');
    }

    if (password !== confirmPassword) {
      throw new Error('Senhas não conferem');
    }

    if (userToken === null) {
      throw new Error('Código de segurança inválido');
    }

    await this.userRepository.deleteAllTokensforUser(user.id);
    const secrectPassword = await hash(password, 8);
    await this.userRepository.updateUser({password: secrectPassword }, user.id);
    return 'Senha alterada com sucesso';
  }
}

export default new UserSerivice();
