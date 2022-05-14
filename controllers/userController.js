import dotenv from 'dotenv';
import chalk from 'chalk';
import { ObjectId } from 'mongodb';

import db from './../database/mongoClient.js';
import { DATABASE, ERROR } from './../blueprint/chalk.js';

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

export async function getCart(_req, res) {
  const session = res.locals.session;

  console.log(session.cart.items);
  res.status(200).send(session.cart.items);
}

export async function purchase(_req, res) {
  // TODO Verificar a quantidade disponivel de um produto e impedir de adicionar caso acabe o estoque
  // TODO Criar funcao que desliga as sessoes ativas e caso a compra nao tenha sido efetuada, atualiza o estoque
  // body: { items: array de _ids dos produtos na collection products; amount: total pago }
  const data = res.locals.data;
  const items = res.locals.items;
  const amount = res.locals.amount;

  try {
    await db
      .collection('accounts')
      .updateOne(
        { _id: new ObjectId(data.session_id) },
        { $push: { history: { items, amount, date: new Date() } } },
      );
    console.log(`${DATABASE} user history updated`);
    res.statusStatus(200);
  } catch (err) {
    console.log(chalk.red(`${ERROR} ${err}`));
    res.status(500).send({
      message: 'Internal error while getting cart',
      detail: err,
    });
  }
}
