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

const app = express();

app.use(express.json());
app.use(cookieParser());
const _dirname = path.resolve();

// CORS settings (make sure the frontend domains are correctly set)
const corsOptions = {
	origin: [
		'https://m6blog.onrender.com', // Production frontend URL
		'http://localhost:5173' // Local development URL
	],
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: true // Enable cookies to be sent
};

// Apply CORS middleware
app.use(cors(corsOptions));

dotenv.config();

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

async function startServer() {
	await connectToDatabase();
	const port = process.env.PORT || 3000;
	app.listen(port, () => {
		console.log(`Server is listening on ${port}`);
	});
}

startServer();

// API routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', CommentRoutes);

app.use(express.static(path.join(_dirname, '/client/dist')));
app.get('*', (req, res) => {
	res.sendFile(path.resolve(_dirname, 'client', 'dist', 'index.html'));
});

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
	const statuscode = err.statusCode || 500;
	const message = err.message || 'Internal server error';
	res.status(statuscode).json({ success: false, statuscode, message });
});
