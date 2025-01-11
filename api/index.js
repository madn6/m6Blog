import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // To get the directory name in ES Modules
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import CommentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// Handle __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the Vite build directory (dist)
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for React Router
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use(express.json());
app.use(cookieParser());

// CORS settings (make sure the frontend domains are correctly set)
const corsOptions = {
	origin: [
		'https://m6blog.onrender.com', // Production
		'http://localhost:5173' // Local development
	],
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: true // Optional: Include credentials if necessary (e.g., cookies, Authorization header)
};

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

// Serve static assets (React app)
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route for React Router
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
	const statuscode = err.statusCode || 500;
	const message = err.message || 'Internal server error';
	res.status(statuscode).json({ success: false, statuscode, message });
});
