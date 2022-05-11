import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import db from '../database/mongoClient.js';
import SignInSchema from '../models/signInSchema.js';

import { ERROR } from '../blueprint/chalk.js';

export async function validateSignInSchema(req, res, next) {
  const { body } = req;

  const typoValidation = SignInSchema.validate(body);

  if (typoValidation.error) {
    console.log(`${ERROR} Invalid input`);
    res.status(400).send({
      message: 'Invalid input',
      type: 'joi',
    });
    return;
  }

  res.locals.body = body;
  next();
}

export async function findUser(req, res, next) {
  const { email } = res.locals.body;
  const user = await db.collection('users').findOne({ email });

  // checa se o usuario ja e cadastrado
  if (!user) {
    console.log(`${ERROR} User not found`);
    res.status(404).send({
      message: 'User is not registered',
      type: 'not found',
    });
    return;
  }
  res.locals.user = user;
  next();
}

export async function validatePassword(req, res, next) {
  const { user } = res.locals;
  const { password } = res.locals.body;

  if (!bcrypt.compareSync(password, user.password)) {
    console.log(`${ERROR} Wrong password`);
    res.status(401).send({
      message: 'Incorrect password',
      type: 'unauthorized',
    });
    return;
  }

  next();
}

export async function createToken(req, res, next) {
  const sessionId = new ObjectId();
  const data = { session_id: sessionId };
  const secretKey = process.env.JWT_SECRET;
  const config = { expiresIn: 60 * 60 }; // uma hora em s
  const token = jwt.sign(data, secretKey, config);

  res.locals.sessionId = sessionId;
  res.locals.token = token;
  next();
}
