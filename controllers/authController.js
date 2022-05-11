import bcrypt from 'bcrypt';

import db from '../database/mongoClient.js';
import { ERROR } from '../blueprint/chalk.js';

export async function register(req, res) {
  const { body } = res.locals;
  const cryptPass = bcrypt.hashSync(body.password, 10);

  try {
    await db.collection('users').insertOne({ ...body, password: cryptPass });
    res.sendStatus(201);
  } catch (e) {
    console.log(`${ERROR} Cannot connect to db`);
    res.sendStatus(500);
  }
}
