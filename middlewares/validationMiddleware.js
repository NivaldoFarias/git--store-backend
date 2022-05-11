import db from '../database/mongoClient.js';
import signUpSchema from '../models/signUpSchema.js';
import { ERROR } from '../blueprint/chalk.js';

export async function validateSignUp(req, res, next) {
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

  delete body.confirm_password;
  res.locals.body = body;
  next();
}

export async function validateEmail(req, res, next) {
  const { body } = res.locals;
  console.log(body);
  const user = await db.collection('users').findOne({ email: body.email });

  if (user) {
    console.log(`${ERROR} Email already registered`);
    res.status(409).send({
      message: 'Email already registered',
      error: 'conflict',
    });
    return;
  }

  next();
}
