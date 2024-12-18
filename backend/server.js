import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

app.use('/api/auth', authRoutes);

const port = process.env.PORT || 1770;
app.listen(port, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${port}`);
});
