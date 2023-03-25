declare namespace Express {
  export interface Request {
    user: import('../database/models/User').User;
  }
}
