import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import chalk from 'chalk';

import purchaseSchema from '../models/purchaseSchema.js';
import { ERROR } from '../blueprint/chalk.js';
import db from '../database/mongoClient.js';

export async function requireToken(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '').trim();
  const secretKey = process.env.JWT_SECRET;
  try {
    const data = jwt.verify(token, secretKey);
    res.locals.data = data;
  } catch (e) {
    console.log(chalk.red(`${ERROR} Invalid token`));
    return res.status(401).send({
      message: 'Invalid token',
      detail: 'Ensure to provide a valid token',
    });
  }

  next();
}

export async function validatePurchase(req, res, next) {
  const { items, amount } = req.body;

  const validate = purchaseSchema.validate(
    {
      items,
      amount,
    },
    { abortEarly: false }
  );
  if (validate.error) {
    console.log(
      chalk.red(
        `${ERROR} ${validate.error.details.map((e) => e.message).join(', ')}`
      )
    );
    return res.status(422).send({
      message: 'Invalid input',
      details: `${validate.error.details.map((e) => e.message).join(', ')}`,
    });
  }
  res.locals.items = items;
  res.locals.amount = amount;
  next();
}

export async function isUserOnline(_req, res, next) {
  let session = null;
  const { data } = res.locals;

  try {
    session = await db
      .collection('sessions')
      .findOne({ _id: new ObjectId(data.session_id) });

    if (!session) {
      console.log(chalk.red(`${ERROR} Session closed/not found`));
      return res.status(401).send({
        message: 'Session closed/not found',
        detail: 'Ensure that the user is signed in',
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
  const { session } = res.locals;

  try {
    user = await db.collection('accounts').findOne({ _id: session.user_id });
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

export async function itemsExists(_req, res, next) {
  const { items } = res.locals;
  console.log(items);
  const products = await db
    .collection('products')
    .find({ _id: { $in: items.map((item) => new ObjectId(item.product_id)) } })
    .toArray();

  if (products.length !== items.length) {
    console.log(chalk.red(`${ERROR} Invalid item id`));
    return res.status(404).send({
      message: 'Invalid item id',
      detail: 'Ensure that the item id is valid',
    });
  }
  res.locals.products = products;
  next();
}

export async function areItemsInStock(_req, res, next) {
  const { items } = res.locals;
  const { products } = res.locals;
  const notInStock = [];
  console.log(items);

  for (let i = 0; i < items.length; i++) {
    if (products[i].inventory < items[i].volume) {
      notInStock.push(products[i].title);
    }
    items[i].title = products[i].title;
  }
  if (notInStock.length > 0) {
    console.log(chalk.red(`${ERROR} Item not in stock`));
    return res.status(422).send({
      message: 'Item not in stock',
      detail: `${notInStock.join(', ')}`,
    });
  }
  next();
}
