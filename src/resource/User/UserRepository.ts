import { Token } from "../../database/models/Token";
import { User } from "../../database/models/User";
import { IToken, IUpdateUser, IUser } from "./UserInterface";
import { Op } from 'sequelize';

class UserRepository {

  public async createUser(data: IUser): Promise<IUser | any> {
    const newUser = await User.create({
      email: data.email, password: data.password
    });
    return newUser.dataValues;
  }

  public async createToken(data: IToken): Promise<IToken | any> {
    const newToken = await Token.create({
      token: data.token, userId: data.userId, TokenValidate: data.tokenValidate
    }, {returning: ['token', 'userId', 'tokenValidate'] });
    return newToken.dataValues;
  }

  public async validateEmail(email: string): Promise<IToken | any> {
    const validateEmail = await User.findOne({ where: { email }, attributes: ['id', 'email', 'isComplet'] });
    return validateEmail;
  }

  public async getUserByEmail(email: string): Promise<IToken | any> {
    const findUser = await User.findOne({ where: { email }, attributes: ['id', 'email', 'isComplet', 'password'] });
    return findUser.dataValues;
  }

  public async getUserById(id: number): Promise<IToken | any> {
    const findUser = await User.findOne({ where: { id }, attributes: ['id', 'email', 'isComplet'] });
    return findUser;
  }

  public async deleteAllTokensforUser(userId: number): Promise<any> {
    return Token.destroy({ where: { userId } });
  }

  public async validateToken(userId: number, token: string, validateDate: Date): Promise<IToken | any> {
    const findToken = await Token.findOne({ where: { userId, token, tokenValidate: { [Op.gt]: validateDate } } });
    return findToken;
  }

  public async completUser(userId: number): Promise<IUser | any> {
    const update = await User.update({ isComplet: true }, { where: { id: userId } });
    return update;
  }

  public async updateUser(data: IUpdateUser, userId: number) {
    const update = await User.update(data, { where: { id: userId } });
    return update;
  }
}

export default UserRepository;
