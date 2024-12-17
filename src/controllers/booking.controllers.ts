import { eq } from 'drizzle-orm';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { handleAsync } from '../middlewares/handle-async';
import { bookings } from '../schemas/booking.schema';
import { users } from '../schemas/user.schema';
import { venues } from '../schemas/venue.schema';

// Create a new booking
export const createBooking = handleAsync(async (req: Request, res: Response) => {
  const { userId, venueId, bookingDate, startTime, endTime, status } = req.body;

  const userExists = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!userExists.length) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const venueExists = await db.select().from(venues).where(eq(venues.id, venueId)).limit(1);
  if (!venueExists.length) {
    res.status(404).json({ message: 'Venue not found' });
    return;
  }

  const newBooking = {
    id: uuidv4(),
    userId,
    venueId,
    bookingDate,
    startTime,
    endTime,
    status: status || 'pending'
  };

  await db.insert(bookings).values(newBooking);

  res.status(201).json({
    message: 'Booking created successfully',
    booking: newBooking
  });
});

// Get all bookings
export const getBookings = handleAsync(async (_req: Request, res: Response) => {
  const allBookings = await db.select().from(bookings);
  res.status(200).json({
    message: 'Bookings retrieved successfully',
    bookings: allBookings
  });
});

// Get bookings for a specific user
export const getUserBookings = handleAsync(async (req: Request, res: Response) => {
  const userBookings = await db.select().from(bookings).where(eq(bookings.userId, req.userId));

  res.status(200).json({
    message: 'User bookings retrieved successfully',
    bookings: userBookings
  });
});

// Get a booking by ID
export const getBookingById = handleAsync(async (req: Request, res: Response) => {
  const booking = await db.select().from(bookings).where(eq(bookings.id, req.params.id)).limit(1);

  if (!booking.length) {
    res.status(404).json({ message: 'Booking not found' });
    return;
  }

  res.status(200).json({
    message: 'Booking retrieved successfully',
    booking: booking[0]
  });
});

// Update booking status
export const updateBooking = handleAsync(async (req: Request, res: Response) => {
  const updatedBooking = await db
    .update(bookings)
    .set(req.body)
    .where(eq(bookings.id, req.params.id))
    .returning();

  if (!updatedBooking.length) {
    res.status(404).json({ message: 'Booking not found' });
    return;
  }

  res.status(200).json({
    message: 'Booking updated successfully',
    updatedBooking: updatedBooking[0]
  });
});

// Delete a booking
export const deleteBooking = handleAsync(async (req: Request, res: Response) => {
  const deletedBooking = await db
    .delete(bookings)
    .where(eq(bookings.id, req.params.id))
    .returning();

  if (!deletedBooking.length) {
    res.status(404).json({ message: 'Booking not found' });
    return;
  }

  res.status(200).json({
    message: 'Booking deleted successfully',
    deletedBooking: deletedBooking[0]
  });
});
