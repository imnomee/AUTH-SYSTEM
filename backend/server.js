import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

app.get('/', (req, res) => {
    return res.send(`<h1>Hello from the other side</h1>`);
});

const port = process.env.PORT || 1770;
app.listen(port, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${port}`);
});
