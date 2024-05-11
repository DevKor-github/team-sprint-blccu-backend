import { Request, Response } from 'express';

export interface IAuthUser {
  user?: {
    id: string;
  };
}

export interface IContext {
  req: Request & IAuthUser;
  res: Response;
}
