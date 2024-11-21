// src/schemas/schemaId.ts
import Joi from "joi";
var schemaId = Joi.object({
  id: Joi.string().uuid({ version: "uuidv4" }).required().messages({
    "string.base": "O ID deve ser um texto.",
    "string.empty": "O ID n\xE3o pode ser vazio.",
    "any.required": "O ID \xE9 obrigat\xF3rio.",
    "string.guid": "O ID deve estar no formato de UUID v4."
  })
});

export {
  schemaId
};
