import express from 'express';
import connectDB from './config/db.js';
import routes from './routes/api/meals.js';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(cors({ origin: true, credentials: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/meals', routes);

connectDB();

app.get('/', (req, res) => res.send('Hello world!'));

const port = 4000;

app.listen(port, () => console.log(`Server running on port ${port}`));
