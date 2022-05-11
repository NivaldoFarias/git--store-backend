import joi from 'joi';

const SignUpSchema = joi
  .object({
    name: joi.string().min(1),
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    confirm_password: joi.ref('password'),
  })
  .with('confirm_password', 'password');

export default SignUpSchema;
