import express from 'express';
import { registerUser, loginUser, getUserDetails } from '../controllers/user.controllers';
import { authMiddleware } from '../middlewares/auth-middleware';

const router = express.Router();

router.post('/register', registerUser); // Register new user
router.post('/login', loginUser); // Login user
router.get('/profile', authMiddleware, getUserDetails); // Get user profile (protected)

export default router;
