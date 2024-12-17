import express from 'express';
import {
  createVenue,
  getVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
  getVendorVenues
} from '../controllers/venue.controllers';
import { authMiddleware } from '../middlewares/auth-middleware';
import { adminOnly, vendorOnly } from '../middlewares/role-middleware';

const router = express.Router();

router.get('/', getVenues); // Public: Get all venues
router.get('/:id', getVenueById); // Public: Get venue by ID

router.use(authMiddleware); // All routes below require authentication

router.post('/create', vendorOnly, createVenue); // Vendor: Create venue
router.get('/my-venues', vendorOnly, getVendorVenues); // Vendor: Get their venues
router.put('/:id', adminOnly, updateVenue); // Admin: Update venue
router.delete('/:id', adminOnly, deleteVenue); // Admin: Delete venue

export default router;
