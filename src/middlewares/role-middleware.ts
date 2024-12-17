import type { Response, NextFunction } from 'express';
import type { RequestWithUser } from '../types/index';

// Middleware to allow only admins
export const adminOnly = (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

// Middleware to allow only vendors
export const vendorOnly = (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'vendor') {
    return res.status(403).json({ message: 'Access denied: Vendors only' });
  }
  next();
};

// Middleware to allow specific roles
export const allowRoles = (roles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
    }
    next();
  };
};
