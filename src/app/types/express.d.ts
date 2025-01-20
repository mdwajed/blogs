import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user:
        | {
            id: string;
            isAdmin: boolean;
          }
        | JwtPayload;
    }
  }
}

export type BlogQuery = {
  $or?: {
    title?: { $regex: string; $options: string };
    content?: { $regex: string; $options: string };
  }[];
  author?: string;
};
