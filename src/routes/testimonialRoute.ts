import express from 'express';
import {
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonial.controllers';
import { authMiddleware } from '../middlewares/auth-middleware';

const router = express.Router();

router.get('/', getTestimonials);           // Public: Get all testimonials

router.use(authMiddleware);                 // All routes below require authentication

router.post('/', addTestimonial);           // Add a testimonial
router.put('/:id', updateTestimonial);      // Update testimonial
router.delete('/:id', deleteTestimonial);   // Delete testimonial

export default router;
