// Drizzle database instance
import { eq } from 'drizzle-orm';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { testimonials } from '../schemas/testimonials.schema';

// GET all testimonials
export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const allTestimonials = await db.select().from(testimonials);
    res.status(200).json(allTestimonials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// POST a new testimonial
export const addTestimonial = async (req: Request, res: Response) => {
  const { name, message, rating } = req.body;
  try {
    const newTestimonial = {
      id: uuidv4(),
      name,
      message,
      rating,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.insert(testimonials).values(newTestimonial);
    res.status(201).json(newTestimonial);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Bad Request' });
  }
};

// PUT update testimonial
export const updateTestimonial = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, message, rating } = req.body;

  try {
    const updatedTestimonial = await db
      .update(testimonials)
      .set({
        name,
        message,
        rating,
        updatedAt: new Date().toISOString()
      })
      .where(eq(testimonials.id, id))
      .returning();

    if (!updatedTestimonial.length) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.status(200).json(updatedTestimonial[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// DELETE testimonial
export const deleteTestimonial = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedTestimonial = await db
      .delete(testimonials)
      .where(eq(testimonials.id, id))
      .returning();

    if (!deletedTestimonial.length) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.status(200).json({ message: 'Testimonial deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
