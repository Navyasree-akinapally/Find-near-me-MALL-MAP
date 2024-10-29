
import express, { json } from 'express';


import { connect, Schema, model } from 'mongoose';

import { hash } from 'bcryptjs';

import cors from 'cors';

const app = express();
app.use(json());
app.use(cors());

// MongoDB connection
connect('mongodb://localhost:27017/signupDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create User Schema
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = model('User', userSchema);

// Signup Route
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;

  // Hash the password before saving
  const hashedPassword = await hash(password, 10);

  try {
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Start server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
