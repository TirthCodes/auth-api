import dotenv from 'dotenv';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import session from 'express-session'
import { PrismaClient } from '@prisma/client';       

dotenv.config()

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

const SECRET_KEY = process.env.SECRET_KEY;

app.get("/", (_req, res) => {
  res.send("Hello World!")
})

// JWT authentication middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No auth token' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

app.post("/signup", async (req, res) => {
	const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.post("/login", async (req, res, _next) => {
	const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Store the user ID in the session
    req.session.userId = user.id;

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: '24h'
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {

  // const { userId } = req.params.id;

  // Destroy the session and clear the user ID
  req.session.destroy();
  res.json({ message: 'Logout successful' });
});

// Protected endpoint with session
app.get('/protected-session', (req, res) => {
  // Retrieve the user ID from the session
  const userId = req.session.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  res.json({ message: 'Session protected endpoint accessed successfully' });
});

// Protected endpoint with JWT authentication
app.get('/protected-jwt', authenticateJWT, (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  res.json({ message: 'JWT protected endpoint accessed successfully' });
});


app.listen(port, () => { 
	console.log(`Server running on http://localhost:${port} 🚀`);
});