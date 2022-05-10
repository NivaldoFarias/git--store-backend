import chalk from "chalk";
import { db } from "./../server/mongoClient.js";
import { ERROR } from "../models/blueprint/chalk.js";

export async function getAll(_req, res) {
  try {
    const users = await db.collection("accounts").find().toArray();
    res.send(
      users.map((user) => {
        return {
          name: user.name,
        };
      })
    );
  } catch (err) {
    console.log(chalk.red(`${ERROR} ${err}`));
    res.status(500).send({
      message: "Internal error while getting users",
      detail: err,
    });
  }
}
