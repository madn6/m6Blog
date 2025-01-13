import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import CommentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import os from 'os';

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(cookieParser());

/* -------------- cors -------------- */

// Dynamically determine the local hostname for development
const hostname = os.hostname();

// Define allowed origins
const allowedOrigins = ['https://m6blog.onrender.com'];

// Add localhost origins dynamically for development
if (process.env.NODE_ENV === 'development') {
	const hostname = os.hostname(); // Get local hostname
	allowedOrigins.push(`http://${hostname}:5173`, 'http://localhost:5173');
}

const corsOptions = {
	origin: (origin, callback) => {
		console.log('Request Origin:', origin); // Debug origin
		// Allow requests from allowed origins or no origin (e.g., mobile apps or Postman)
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true); // Allow request
		} else {
			callback(new Error('Not allowed by CORS')); // Reject request
		}
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE'], // Restrict to necessary HTTP methods
	credentials: true, // Allow cookies and credentials
	optionsSuccessStatus: 204 // For legacy browsers (some expect 204 for preflight)
};

// Export CORS middleware to be used in the main application
export const configureCORS = (app) => {
	app.use(cors(corsOptions));
};

/* -------------- cors end -------------- */

// Connect to MongoDB
async function connectToDatabase() {
	try {
		const mongoURI = process.env.MONGO_URI;
		await mongoose.connect(mongoURI);
		console.log('Connected to MongoDB');
	} catch (err) {
		console.error('Failed to connect to MongoDB', err);
		process.exit(1);
	}
}

// Start the server
async function startServer() {
	await connectToDatabase();
	const port = process.env.PORT || 3000;
	app.listen(port, () => {
		console.log(`Server is listening on port ${port}`);
	});
}
startServer();

// API routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', CommentRoutes);

// Serve static files for frontend
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// Catch-all route to serve index.html for all non-API requests
app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
});

// Health check route
app.get('/', (_req, res) => {
	res.status(200).json({
		success: true,
		message: 'Backend is running successfully',
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || 'development'
	});
});

// Error handler
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || 'Internal server error';
	res.status(statusCode).json({ success: false, statusCode, message });
});
