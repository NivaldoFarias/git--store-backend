import joi from 'joi';

const PurchaseSchema = joi.object({
  items: joi
    .array()
    .items(joi.object({ id: joi.string(), volume: joi.number() }))
    .required(),
  amount: joi.number().required(),
});

export default PurchaseSchema;