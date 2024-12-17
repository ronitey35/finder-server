import { eq } from 'drizzle-orm';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
// Drizzle ORM database instance
import { venues } from '../schemas/venue.schema';

// Create a new venue
export const createVenue = async (req: Request, res: Response) => {
  const { name, location, availability, price, capacity, amenities } = req.body;
  const userId = req.user.id; // Assuming user authentication middleware adds `req.user`

  try {
    const newVenue = {
      id: uuidv4(),
      name,
      location,
      availability: availability ?? true, // Default to `true` if not provided
      price,
      capacity,
      amenities: JSON.stringify(amenities), // Store amenities as JSON string
      vendorId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.insert(venues).values(newVenue);

    res.status(201).json(newVenue);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

// Get all venues (public access)
export const getVenues = async (_req: Request, res: Response) => {
  try {
    const allVenues = await db.select().from(venues);
    res.json(allVenues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get a venue by ID (public access)
export const getVenueById = async (req: Request, res: Response) => {
  const venueId = req.params.id;

  try {
    const venue = await db.select().from(venues).where(eq(venues.id, venueId)).limit(1);
    if (!venue.length) return res.status(404).json({ message: 'Venue not found' });

    res.json(venue[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Update a venue (admin or vendor specific)
export const updateVenue = async (req: Request, res: Response) => {
  const venueId = req.params.id;
  const { name, location, availability, price, capacity, amenities } = req.body;

  try {
    const updatedVenue = await db
      .update(venues)
      .set({
        name,
        location,
        availability,
        price,
        capacity,
        amenities: JSON.stringify(amenities), // Update amenities as JSON string
        updatedAt: new Date().toISOString()
      })
      .where(eq(venues.id, venueId))
      .returning();

    if (!updatedVenue.length) return res.status(404).json({ message: 'Venue not found' });

    res.json(updatedVenue[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a venue (admin or vendor specific)
export const deleteVenue = async (req: Request, res: Response) => {
  const venueId = req.params.id;

  try {
    const venue = await db.select().from(venues).where(eq(venues.id, venueId)).limit(1);

    if (!venue.length) return res.status(404).json({ message: 'Venue not found' });

    // Check if user is authorized to delete
    const isAuthorized =
      req.user.role === 'admin' ||
      (req.user.role === 'vendor' && venue[0].vendorId === req.user.id);

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Unauthorized to delete this venue' });
    }

    await db.delete(venues).where(eq(venues.id, venueId));
    res.json({ message: 'Venue deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Get all venues for a specific vendor (protected, only for the vendor)
export const getVendorVenues = async (req: Request, res: Response) => {
  try {
    const vendorVenues = await db.select().from(venues).where(eq(venues.vendorId, req.user.id));
    res.json(vendorVenues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
