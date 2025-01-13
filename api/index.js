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

const allowedOrigins = new Set(['https://m6blog.onrender.com']);

// Add local development origins dynamically
if (process.env.NODE_ENV === 'development') {
	const hostname = os.hostname();
	allowedOrigins.add(`http://${hostname}:5173`);
	allowedOrigins.add('http://localhost:5173');
}

const corsOptions = {
	origin: (origin, callback) => {
		console.log('Request Origin:', origin); // Log the origin for debugging
		console.log('Allowed Origins:', Array.from(allowedOrigins)); // Log allowed origins for clarity

		// Allow requests with no origin (e.g., mobile apps, Postman)
		if (!origin || allowedOrigins.has(origin)) {
			callback(null, true); // Allow the request
		} else {
			callback(new Error('Not allowed by CORS')); // Reject the request
		}
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only required HTTP methods
	credentials: true, // Enable cookies and credentials
	optionsSuccessStatus: 204 // Handle preflight requests gracefully
};

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
