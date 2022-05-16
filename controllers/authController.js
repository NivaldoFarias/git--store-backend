import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import chalk from 'chalk';

import db from '../database/mongoClient.js';
import { DATABASE, ERROR } from '../blueprint/chalk.js';

dotenv.config();

export async function signUp(_req, res) {
  const { name, email, password } = res.locals;
  const cryptPass = bcrypt.hashSync(password, 10);

  try {
    await db
      .collection('accounts')
      .insertOne({ name, email, password: cryptPass, transactions: [] });
    console.log(chalk.blue(`${DATABASE} - ${email} registered successfully`));
    res.sendStatus(201);
  } catch (err) {
    console.log(chalk.red(`${ERROR} ${err}`));
    return res.status(500).send({
      message: 'Internal server error while registering',
      detail: `${err}`,
    });
  }
}

export async function signIn(_req, res) {
  const { user, token, sessionId } = res.locals;

  try {
    await db
      .collection('sessions')
      .deleteOne({ user_id: new ObjectId(user._id) });

    await db.collection('sessions').insertOne({
      token,
      _id: sessionId,
      user_id: user._id,
      active: true,
    });
    console.log(
      chalk.blue(`${DATABASE} - ${user.email} signed in successfully`)
    );
    res.status(200).send(token);
  } catch (err) {
    console.log(chalk.red(`${ERROR} ${err}`));
    return res.status(500).send({
      message: 'Internal server error while signing in',
      detail: `${err}`,
    });
  }
}
