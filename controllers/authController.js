import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import db from '../database/mongoClient.js';
import { ERROR } from '../blueprint/chalk.js';

dotenv.config();

// TODO data sanitization

export async function register(req, res) {
  const { body } = res.locals;
  const cryptPass = bcrypt.hashSync(body.password, 10);

  try {
    await db.collection('accounts').insertOne({ ...body, password: cryptPass });
    res.sendStatus(201);
  } catch (e) {
    console.log(`${ERROR} Cannot connect to db\n${e}`);
    res.sendStatus(500);
  }
}

export async function login(req, res) {
  const { user, token, sessionId } = res.locals;

  try {
    // encerra a sessao em outro dispositivo
    await db
      .collection('sessions')
      .deleteOne({ user_id: new ObjectId(user._id) });

    await db.collection('sessions').insertOne({
      token,
      _id: sessionId,
      user_id: user._id,
      cart: {
        status: 'pending',
        items: [],
      },
    });
    res.status(200).send(token);
  } catch (e) {
    console.log(`${ERROR} Cannot connect to db\n${e}`);
    res.sendStatus(500);
  }
}
