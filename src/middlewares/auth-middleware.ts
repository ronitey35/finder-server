import { eq } from 'drizzle-orm';
import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
// Drizzle ORM database instance
import { users } from '../schemas/user.schema';
import type { RequestWithUser } from '../types/index';

export const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  console.log('Authorization Header:', req.header('Authorization'));

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };
    req.user = decoded; // Attach decoded token payload to `req.user`

    // Check if the token is still valid in the database
    const user = await db.select().from(users).where(eq(users.id, decoded.id)).limit(1);

    if (!user.length || user[0].token !== token) {
      return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Token validation error:', err);
    res.status(401).json({ message: 'Unauthorized: Invalid token', error: err.message });
  }
};
