import { ObjectId } from 'mongodb';
import chalk from 'chalk';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import db from '../database/mongoClient.js';
import SignInSchema from '../models/signIn.js';

import { ERROR } from '../blueprint/chalk.js';

export async function validateSignInSchema(req, res, next) {
  const { password } = req.body; // body = user
  const email = stripHtml(req.body.email).result.trim();

  const validate = SignInSchema.validate(
    { email, password },
    { abortEarly: false },
  );

  if (validate.error) {
    console.log(chalk.bold.red(`${ERROR} Invalid input`));
    res.status(400).send({
      message: 'Invalid input',
      details: `${validate.error.details.map((e) => e.message).join(', ')}`,
    });
    return;
  }

  res.locals.body = body;
  next();
}

export async function findUser(_req, res, next) {
  const { email } = res.locals.body;
  const user = await db.collection('accounts').findOne({ email });

  // checa se o usuario ja e cadastrado
  if (!user) {
    console.log(chalk.bold.red(`${ERROR} User not found`));
    res.status(404).send({
      message: 'User is not registered',
      detail: 'If user is already registered, ensure that the email is correct',
    });
    return;
  }
  res.locals.user = user;
  next();
}

export async function validatePassword(_req, res, next) {
  const { user } = res.locals;
  const { password } = res.locals.body;

  if (!bcrypt.compareSync(password, user.password)) {
    console.log(chalk.bold.red(`${ERROR} Wrong password`));
    res.status(401).send({
      message: 'Incorrect password',
      detail: 'Ensure that the password is correct',
    });
    return;
  }

  next();
}

export async function createToken(_req, res, next) {
  const sessionId = new ObjectId();
  const data = { session_id: sessionId };
  const secretKey = process.env.JWT_SECRET;
  const config = { expiresIn: 60 * 60 }; // uma hora em s
  const token = jwt.sign(data, secretKey, config);

  res.locals.sessionId = sessionId;
  res.locals.token = token;
  next();
}
