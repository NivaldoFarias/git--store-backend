import chalk from "chalk";
import { stripHtml } from "string-strip-html";

import db from "../database/mongoClient.js";
import SignUpSchema from "../models/signUpSchema.js";
import { ERROR } from "../blueprint/chalk.js";

export async function validateSignUpSchema(req, res, next) {
  const { password, confirm_password } = req.body; // body = user
  const name = stripHtml(req.body.name).result.trim();
  const email = stripHtml(req.body.email).result.trim();

  const validate = SignUpSchema.validate(
    {
      name,
      email,
      password,
      confirm_password,
    },
    { abortEarly: false }
  );
  if (validate.error) {
    console.log(chalk.red(`${ERROR} Invalid input`));
    return res.status(422).send({
      message: "Invalid input",
      details: `${validate.error.details.map((e) => e.message).join(", ")}`,
    });
  }

  delete body.confirm_password;
  res.locals.body = body;
  next();
}

export async function validateEmail(_req, res, next) {
  const { body } = res.locals;
  const user = await db.collection("accounts").findOne({ email: body.email });

  if (user) {
    console.log(chalk.red(`${ERROR} Email already registered`));
    res.status(409).send({
      message: "Email already registered",
      detail: "Ensure that the email is unique",
    });
    return;
  }

  next();
}
