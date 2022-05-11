import bcrypt from 'bcrypt';

import db from '../database/mongoClient.js';
import signUpSchema from '../models/signUpSchema.js';
import { ERROR } from '../blueprint/chalk.js';

export async function register(req, res) {
  const { body } = req; // body = user

  const typoValidation = signUpSchema.validate(body).error;

  if (typoValidation) {
    console.log(`${ERROR} Invalid input`);
    res.status(422).send({
      message: 'Invalid input',
      error: 'joi validation',
    });
    return;
  }

  try {
    const user = await db.collection('users').findOne({ email: body.email });

    if (user) {
      console.log(`${ERROR} Email already registered`);
      res.status(409).send({
        message: 'Email already registered',
        error: 'conflict',
      });
      return;
    }

    const cryptPass = bcrypt.hashSync(body.password, 10);

    delete body.confirm_password;
    await db.collection('users').insertOne({ ...body, password: cryptPass });

    res.sendStatus(201);
  } catch (e) {
    console.log(`${ERROR} Cannot connect to db`);
    res.sendStatus(500);
  }
}
