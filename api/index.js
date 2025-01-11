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

// Get the directory name (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());

// CORS settings (make sure the frontend domains are correctly set)
app.use(
	cors({
		origin: ['https://m6blog.onrender.com', 'https://m6blog-backend.onrender.com'],
		methods: ['GET', 'POST', 'PUT', 'DELETE']
	})
);

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
