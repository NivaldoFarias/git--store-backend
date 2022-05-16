import dotenv from 'dotenv';
import chalk from 'chalk';
import { ObjectId } from 'mongodb';

import db from '../database/mongoClient.js';
import { DATABASE, ERROR } from '../blueprint/chalk.js';

dotenv.config();

export async function getProducts(_req, res) {
  try {
    const products = await db.collection('products').find().toArray();
    res.status(200).send(products);
  } catch (err) {
    console.log(chalk.red(`${ERROR} ${err}`));
    res.status(500).send({
      message: 'Internal error while getting users',
      detail: err,
    });
  }
}

export async function purchase(_req, res) {
  const { items, amount, session } = res.locals;

  try {
    for (let i = 0; i < items.length; i++) {
      try {
        await db
          .collection('products')
          .updateOne(
            { _id: new ObjectId(items[i].product_id) },
            { $inc: { inventory: -items[i].volume } }
          );
      } catch (err) {
        console.log(chalk.red(`${ERROR} ${err}`));
        res.status(500).send({
          message: 'Internal error while updating products',
          detail: `${err}`,
        });
      }
    }

    await db
      .collection('accounts')
      .updateOne(
        { _id: new ObjectId(session.user_id) },
        { $push: { transactions: { items, amount, date: new Date() } } }
      );
    console.log(chalk.blue(`${DATABASE} user transactions updated`));
    res.sendStatus(200);
  } catch (err) {
    console.log(chalk.red(`${ERROR} ${err}`));
    res.status(500).send({
      message: 'Internal error while getting cart',
      detail: `${err}`,
    });
  }
}

export async function userOnline(req, res) {
  const { data } = res.locals;

  try {
    const session = await db
      .collection('sessions')
      .findOne({ _id: new ObjectId(data.session_id) });

    if (!session || !session.active) {
      console.log(chalk.red(`${ERROR} Invalid token`));
      return res.status(403).send({
        message: 'Invalid token',
        detail: 'Ensure to provide a valid token',
      });
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
  res.send();
}

