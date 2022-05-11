import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import db from '../database/mongoClient.js';
import { ERROR } from '../blueprint/chalk.js';

import SignUpSchema from '../models/signUpSchema.js';

dotenv.config();

// TODO data sanitization

export async function register(req, res) {
  const { body } = res.locals;
  const cryptPass = bcrypt.hashSync(body.password, 10);

  try {
    await db.collection('users').insertOne({ ...body, password: cryptPass });
    res.sendStatus(201);
  } catch (e) {
    console.log(`${ERROR} Cannot connect to db\n${e}`);
    res.sendStatus(500);
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  const typoValidation = SignUpSchema.validate({ email, password });

  if (typoValidation.error) {
    console.log(`${ERROR} Invalid input`);
    res.status(400).send({
      message: 'Invalid input',
      type: 'joi',
    });
    return;
  }

  try {
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

    // checa a senha
    if (!bcrypt.compareSync(password, user.password)) {
      console.log(`${ERROR} Wrong password`);
      res.status(401).send({
        message: 'Incorrect password',
        type: 'unauthorized',
      });
      return;
    }

    // encerra a sessao em outro dispositivo
    await db
      .collection('sessions')
      .deleteOne({ user_id: new ObjectId(user._id) });

    const sessionId = new ObjectId();
    const data = { session_id: sessionId };
    const secretKey = process.env.JWT_SECRET;
    const config = { expiresIn: 60 * 60 }; // uma hora em s
    const token = jwt.sign(data, secretKey, config);

    await db.collection('sessions').insertOne({
      token,
      _id: sessionId,
      user_id: user._id,
    });
    res.status(200).send(token);
  } catch (e) {
    console.log(`${ERROR} Cannot connect to db\n${e}`);
    res.sendStatus(500);
  }
}
