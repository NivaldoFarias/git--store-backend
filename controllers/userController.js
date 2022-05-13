import dotenv from 'dotenv';
import chalk from 'chalk';
import { ObjectId } from 'mongodb';

import db from '../database/mongoClient.js';
import { DATABASE, ERROR } from '../blueprint/chalk.js';

dotenv.config();

export async function getAll(_req, res) {
  try {
    const users = await db.collection('accounts').find().toArray();
    res.send(
      users.map((user) => ({
        name: user.name,
      })),
    );
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

export async function updateCart(req, res) {
  console.log('update cart');
  // TODO Verificar a quantidade disponivel de um produto e impedir de adicionar caso acabe o estoque
  // TODO Criar funcao que desliga as sessoes ativas e caso a compra nao tenha sido efetuada, atualiza o estoque
  const { body } = req; // title, image, price, _id, quantity
  const { cart } = res.locals.session;
  const data = res.locals.data;

  console.log(body);

  try {
    const productIndex = cart.items.findIndex(
      (element) => element._id === body._id,
    );
    console.log(productIndex);

    // checa se o produto ja esta no carrinho
    if (productIndex === -1) {
      await db
        .collection('sessions')
        .updateOne(
          { _id: new ObjectId(data.session_id) },
          { $push: { 'cart.items': body } },
        );
    } else {
      cart.items[productIndex].quantity += 1;
      await db
        .collection('sessions')
        .updateOne({ _id: new ObjectId(data.session_id) }, { $set: { cart } });
    }
    console.log(`${DATABASE} cart updated`);
    res.status(200).send(body);
  } catch (err) {
    console.log(chalk.red(`${ERROR} ${err}`));
    res.status(500).send({
      message: 'Internal error while getting cart',
      detail: err,
    });
  }
}
