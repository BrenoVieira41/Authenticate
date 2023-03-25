import { IToken } from '../User/UserInterface';
import UserRepository from '../User/UserRepository';
import { MailService } from '@sendgrid/mail';

class UtilsServer {
  private readonly sendGrid: MailService;

  constructor() {
    this.sendGrid = new MailService();
    this.sendGrid.setApiKey(process.env.SENDGRID_KEY);
  }


  public async createToken(userId: number) {
    const userRepository = new UserRepository();
    const token = Math.floor(Math.random() * 99999) + 10000;
    const newToken: IToken = await userRepository.createToken(
      { token: String(token), userId: userId, tokenValidate: new Date() }
    );
    return newToken;
  }

  public async sendEmail(title: string, message: string, to: string) {
    await this.sendGrid.send({
      from: process.env.SENDGRID_USER,
      to,
      subject: title,
      html: `
      <h1>${title}</h1>
      </br>
      <p>${message}<p></p>
      `
    });
  }
}

export default new UtilsServer();
