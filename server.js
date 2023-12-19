import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User';

dotenv.config();

const app = express();
const PORT = 4000;
mongoose.set('strictQuery', false);

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(cors({ credentials: true, origin: process.env.BASE_URL }));
app.use(express.json());

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userDoc = await User.create({ username, password: hashedPassword });
    res.json(userDoc);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    return res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (userDoc && bcrypt.compareSync(password, userDoc.password)) {
      res.json({ message: 'Login successful' });
    } else {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred' });
  }
});
app.get('/', (req, res) => {
  res.send('Authentication server is running!');
});
app.listen(PORT, () => {
  console.log(`Authentication server is running on port ${PORT}`);
});
