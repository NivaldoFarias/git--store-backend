import chalk from 'chalk';
import { stripHtml } from 'string-strip-html';

import db from '../database/mongoClient.js';
import SignUpSchema from '../models/signUpSchema.js';
import { ERROR } from '../blueprint/chalk.js';

export async function validateSignUpSchema(req, res, next) {
  const { password } = req.body; // body = user
  const name = stripHtml(req.body.name).result.trim();
  const email = stripHtml(req.body.email).result.trim();

  const validate = SignUpSchema.validate(
    {
      name,
      email,
      password,
    },
    { abortEarly: false }
  );
  console.log('teste');
  if (validate.error) {
    console.log(chalk.red(`${ERROR} Invalid input`));
    return res.status(422).send({
      message: 'Invalid input',
      details: `${validate.error.details.map((e) => e.message).join(', ')}`,
    });
  }
  res.locals.name = name;
  res.locals.email = email;
  res.locals.password = password;
  next();
}

export async function validateEmail(_req, res, next) {
  const { email } = res.locals;
  const user = await db.collection('accounts').findOne({ email });

  if (user) {
    console.log(chalk.red(`${ERROR} Email already registered`));
    return res.status(409).send({
      message: 'Email already registered',
      detail: 'Ensure that the email is unique',
    });
  }
  next();
}
