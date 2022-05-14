import joi from 'joi';

const SignInSchema = joi.object({
  email: joi.string().email(),
  password: joi
    .string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
});

export default SignInSchema;
