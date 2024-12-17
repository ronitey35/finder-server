import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { users } from '../schemas/user.schema';

// Register User
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role, address } = req.body;

  try {
    console.log('Incoming Request:', req.body);

    // Check if the user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      address,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.insert(users).values(newUser);

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h'
      }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        address: newUser.address
      }
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login User
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user.length) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const currentUser = user[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, currentUser.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: currentUser.id, role: currentUser.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get User Details
export const getUserDetails = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };
    const user = await db.select().from(users).where(eq(users.id, decoded.id)).limit(1);

    if (!user.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userDetails } = user[0]; // Remove the password field before returning
    res.json(userDetails);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};
