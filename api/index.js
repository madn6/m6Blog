import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser'

const app = express();

app.use(express.json());
app.use(cookieParser())

dotenv.config();


async function connnectToDatabase() {
	try {
		const mongoURI = process.env.MONGO_URI;
		await mongoose.connect(mongoURI);
		console.log('connected to mongodb');
	} catch (err) {
		console.error('failed to connect to mongo db', err);
		process.exit(1);
	}
}

async function startServer() {
	await connnectToDatabase();
	const port = process.env.PORT || 3000;
	app.listen(port, () => {
		console.log('server is listenning on 3000');
	});
}

startServer();

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
	const statuscode = err.statusCode || 500;
	const message = err.message || 'Internel server error';

	res.status(statuscode).json({
		success: false,
		statuscode,
		message
	});
});

