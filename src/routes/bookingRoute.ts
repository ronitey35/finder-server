import express from 'express';
import {
  createBooking,
  getBookings,
  getUserBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} from '../controllers/booking.controllers';
import { authMiddleware } from '../middlewares/auth-middleware';
import { adminOnly } from '../middlewares/role-middleware';

const router = express.Router();

router.use(authMiddleware); // All routes require authentication

router.post('/create', createBooking); // Create booking
router.get('/', adminOnly, getBookings); // Get all bookings (admin-only)
router.get('/my-bookings', getUserBookings); // Get user's own bookings
router.get('/:id', getBookingById); // Get booking by ID
router.put('/:id', updateBooking); // Update booking
router.delete('/:id', deleteBooking); // Delete booking

export default router;
