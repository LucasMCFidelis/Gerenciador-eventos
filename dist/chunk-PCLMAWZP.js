import {
  removeWhitespace
} from "./chunk-XITV7NGF.js";

// src/schemas/schemaUserCadastre.ts
import Joi from "joi";
var schemaCadastre = Joi.object({
  firstName: Joi.string().custom(
    (value) => removeWhitespace(value)
  ).min(3).pattern(new RegExp("^[A-Za-z\xC0-\xD6\xD8-\xF6\xF8-\xFF\\s]+$")).required().messages({
    "any.required": "Nome \xE9 obrigat\xF3rio",
    "string.base": "Nome deve ser uma string",
    "string.empty": "Nome n\xE3o pode estar vazio",
    "string.min": "Nome deve possuir no m\xEDnimo 3 caracteres",
    "string.pattern.base": "Nome deve conter apenas caracteres alfab\xE9ticos, acentuados e espa\xE7os"
  }),
  lastName: Joi.string().custom(
    (value) => removeWhitespace(value)
  ).min(5).pattern(new RegExp("^[A-Za-z\xC0-\xD6\xD8-\xF6\xF8-\xFF\\s]+$")).required().messages({
    "any.required": "Sobrenome \xE9 obrigat\xF3rio",
    "string.base": "Sobrenome deve ser uma string",
    "string.empty": "Sobrenome n\xE3o pode estar vazio",
    "string.min": "Sobrenome deve possuir no m\xEDnimo 5 caracteres",
    "string.pattern.base": "Sobrenome deve conter apenas caracteres alfab\xE9ticos, acentuados e espa\xE7os"
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email \xE9 obrigat\xF3rio",
    "string.base": "Email deve ser uma string",
    "string.email": "Email deve ser um email v\xE1lido",
    "string.empty": "Email n\xE3o pode estar vazio"
  }),
  phoneNumber: Joi.string().trim().pattern(/^\+?[0-9]{10,15}$/).allow(null).optional().messages({
    "string.base": "Telefone deve ser uma string",
    "string.pattern.base": "Telefone deve come\xE7ar com (+) e conter entre 10 e 15 d\xEDgitos num\xE9ricos"
  })
});

export {
  schemaCadastre
};
