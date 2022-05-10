import chalk from "chalk";
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

export let db = null;
const DB_INFO = chalk.bold.blue("[Database]");
const ERROR = chalk.bold.red("[ERROR]");
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
      `${DB_INFO} Connected to database ${chalk.bold.blue(db.databaseName)}`
    )
  );
} catch (err) {
  console.log(chalk.red(`${ERROR} ${err}`));
}
