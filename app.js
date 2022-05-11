import express, { json } from 'express';
import cors from 'cors';
import chalk from 'chalk';
import dotenv from 'dotenv';

import router from './routes/index.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(json());
app.use(router);

app.get('/', (_req, res) => {
  res.send('Online');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    chalk.bold.yellow(`Server started on port ${chalk.bold.yellow(PORT)}`)
  );
});
