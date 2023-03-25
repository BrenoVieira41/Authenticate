export class IUser {
  id?: number;
  email?: string;
  password?: string;
  isComplet?: Boolean;
}

export class IToken {
  id?: number;
  token?: string;
  userId?: number;
  tokenValidate?: Date;
}

export interface IChengePassword {
  password: string;
  confirmPassword: string;
  token: string;
}

export interface IUpdateUser {
  password?: string;
  email?: string;
  isComplet?: Boolean;
}
