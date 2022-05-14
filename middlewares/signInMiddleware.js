import { ObjectId } from 'mongodb';
import { stripHtml } from 'string-strip-html';
import chalk from 'chalk';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import db from './../database/mongoClient.js';
import SignInSchema from './../models/signInSchema.js';

import { ERROR } from './../blueprint/chalk.js';

export async function validateSignInSchema(req, res, next) {
  const password = req.body.password;
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

  res.locals.email = email;
  res.locals.password = password;
  next();
}

export async function findUser(_req, res, next) {
  let user = null;
  const { email } = res.locals;

  try {
    user = await db.collection('accounts').findOne({ email });

    if (!user) {
      console.log(chalk.bold.red(`${ERROR} User not found`));
      res.status(404).send({
        message: 'User is not registered',
        detail:
          'If user is already registered, ensure that the email is correct',
      });
      return;
    }
  } catch (err) {
    console.log(chalk.bold.red(`${ERROR} ${err}`));
    return res.status(500).send({
      message: 'Internal server error',
      detail: `${err}`,
    });
  }
  res.locals.user = user;
  next();
}

export async function validatePassword(_req, res, next) {
  const { user, password } = res.locals;

  if (!bcrypt.compareSync(password, user.password)) {
    console.log(chalk.bold.red(`${ERROR} Wrong password`));
    return res.status(401).send({
      message: 'Incorrect password',
      detail: 'Ensure that the password is correct',
    });
  }
  next();
}

export async function createToken(_req, res, next) {
  const sessionId = new ObjectId();
  const data = { session_id: sessionId };
  const secretKey = process.env.JWT_SECRET;
  const config = { expiresIn: 60 * 60 * 24 }; // one day in seconds
  const token = jwt.sign(data, secretKey, config);

  res.locals.sessionId = sessionId;
  res.locals.token = token;
  next();
}
