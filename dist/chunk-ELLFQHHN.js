import {
  removeWhitespace
} from "./chunk-XITV7NGF.js";

// src/schemas/schemaUserUpdate.ts
import Joi from "joi";
var schemaUserUpdate = Joi.object({
  firstName: Joi.string().custom(
    (value) => removeWhitespace(value)
  ).min(3).pattern(new RegExp("^[A-Za-z\xC0-\xD6\xD8-\xF6\xF8-\xFF\\s]+$")).optional().messages({
    "string.base": "Nome deve ser uma string",
    "string.empty": "Nome n\xE3o pode estar vazio",
    "string.min": "Nome deve possuir no m\xEDnimo 3 caracteres",
    "string.pattern.base": "Nome deve conter apenas caracteres alfab\xE9ticos, acentuados e espa\xE7os"
  }),
  lastName: Joi.string().custom(
    (value) => removeWhitespace(value)
  ).min(5).pattern(new RegExp("^[A-Za-z\xC0-\xD6\xD8-\xF6\xF8-\xFF\\s]+$")).optional().messages({
    "string.base": "Sobrenome deve ser uma string",
    "string.empty": "Sobrenome n\xE3o pode estar vazio",
    "string.min": "Sobrenome deve possuir no m\xEDnimo 5 caracteres",
    "string.pattern.base": "Sobrenome deve conter apenas caracteres alfab\xE9ticos, acentuados e espa\xE7os"
  }),
  email: Joi.string().email().optional().messages({
    "string.base": "Email deve ser uma string",
    "string.email": "Email deve ser um email v\xE1lido"
  }),
  phoneNumber: Joi.string().pattern(/^\+?[0-9]{10,15}$/).allow(null).optional().messages({
    "string.base": "Telefone deve ser uma string",
    "string.pattern.base": "Telefone deve come\xE7ar com (+) e conter entre 10 e 15 d\xEDgitos num\xE9ricos"
  })
});

export {
  schemaUserUpdate
};
