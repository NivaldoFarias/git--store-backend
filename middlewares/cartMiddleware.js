import jwt from 'jsonwebtoken';
import chalk from 'chalk';

import db from '../database/mongoClient.js';
import { ERROR } from '../blueprint/chalk.js';

export async function requireToken(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '').trim();
  const secretKey = process.env.JWT_SECRET;
  const data = jwt.verify(token, secretKey);

  if (!data) {
    console.log(chalk.red(`${ERROR} Invalid token`));
    return res.status(401).send({
      message: 'Invalid token',
      detail: 'Ensure to provide a valid token',
    });
  }

  res.locals.data = data;
  next();
}

export async function isUserOnline(_req, res, next) {
  let session = null;
  const data = res.locals.data;

  try {
    session = await db
      .collection('sessions')
      .findOne({ _id: new ObjectId(data.session_id) });

    if (!session) {
      console.log(chalk.red(`${ERROR} Session closed/not found`));
      return res.status(401).send({
        message: 'Session closed/not found',
        detail: 'Ensure that the user is logged in',
      });
    }
  } catch (err) {
    console.log(chalk.red(`${ERROR} ${err}`));
    return res.status(500).send({
      message: 'Internal server error',
      detail: `${err}`,
    });
  }
  res.locals.session = session;
  next();
}

export async function userExists(_req, res, next) {
  let user = null;
  const session = res.locals.session;

  try {
    user = await db
      .collection('accounts')
      .findOne({ _id: new ObjectId(session.user_id) });

    if (!user) {
      return res.status(404).send({
        message: 'User not found',
        detail:
          'Ensure that the user is registered, or that the token belongs to a valid user',
      });
    }
  } catch (err) {
    console.log(chalk.red(`${ERROR} ${err}`));
    return res.status(500).send({
      message: 'Internal server error',
      detail: `${err}`,
    });
  }
  res.locals.user = user;
  next();
}
