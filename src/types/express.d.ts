import { Request as Req } from 'express';
import { Types } from 'mongoose';

declare module 'express' {
  interface Request extends Req {
    user: {
      kakaoId?: number;
      username?: string;
      profile_image?: string;
      userId?: Types.ObjectId;
    };
  }
}
