import chalk from "chalk";
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

import { DATABASE, ERROR } from "../blueprint/chalk.js";

dotenv.config();

let db = null; //eslint-disable-line
const mongoClient = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
try {
  await mongoClient.connect();
  db = mongoClient.db(process.env.DATABASE);
  console.log(
    chalk.blue(
      `${DATABASE} Connected to database ${chalk.bold.blue(db.databaseName)}`
    )
  );
} catch (err) {
  console.log(chalk.red(`${ERROR} ${err}`));
}

export default db;
