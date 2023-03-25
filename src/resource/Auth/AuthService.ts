import { MailService } from '@sendgrid/mail';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IToken, IUser } from '../User/UserInterface';
import UserRepository from '../User/UserRepository';
import UtilsServer from '../utils/UtilsServer';
import { isEmail } from 'user-validatior-for-npm';
import { subDays } from 'date-fns';


class AuthService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async login(email: string, password: string): Promise<any> {
    try {
      const user: IUser = await this.userRepository.getUserByEmail(email);

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (user.isComplet === false) {
        throw new Error('Usuário ainda não pode efetuar login');
      }

      const isValidPassword = await compare(password, user.password);

      if (!isValidPassword) {
        throw new Error('Usuário ou senha estão inválidos')
      }

      Reflect.deleteProperty(user, 'password');
      const token = jwt.sign({ ...user }, process.env.JWT_SECRET);
      return { user, token };

    } catch (err) {
      throw new Error(err);
    }
  }

  public async emailRequestChenge(userId: number, email: string) {
    const id = userId ? Number(userId) : undefined;
    const validateUser = await this.userRepository.getUserById(id);

    if (validateUser === null) {
      throw new Error('Usuário não encontrado');
    }

    if (!isEmail(email)) {
      throw new Error('E-mail inválido');
    }

    const emailExist: IUser = await this.userRepository.validateEmail(email);

    if (emailExist !== null) {
      throw new Error('E-mail já cadastrado');
    }

    const title = 'Solicitação de troca de e-mail';

    await this.userRepository.deleteAllTokensforUser(id);
    const newToken: IToken = await UtilsServer.createToken(id);
    await UtilsServer.sendEmail(
      title,
      `Código de validação de ${title}: (${newToken.token})`,
      email
    );
    return `${title} enviada`;
  }

  public async updateEmail(userId: number, email: string, token: string) {
    const id = userId ? Number(userId) : undefined;
    const validateUser = await this.userRepository.getUserById(id);
    const tokenValidator = subDays(new Date(), 1);

    if (validateUser === null) {
      throw new Error('Usuário não encontrado');
    }

    const emailExist: IUser = await this.userRepository.validateEmail(email);

    if (emailExist !== null) {
      throw new Error('E-mail já utilizado');
    }

    if (!isEmail(email)) {
      throw new Error('E-mail inválido');
    }

    const validateToken = await this.userRepository.validateToken(id, token, tokenValidator);

    if (validateToken === null) {
      throw new Error('Token inválido');
    }

    const updateUser = await this.userRepository.updateUser({ email: email, isComplet: true }, userId);
    return 'Usuário alterado com sucesso';
  }

}

export default new AuthService();
