import {
  removeWhitespace
} from "./chunk-XITV7NGF.js";
import {
  AccessibilityLevel
} from "./chunk-LYKEYNKQ.js";

// src/schemas/schemaEventCadastre.ts
import Joi from "joi";
var schemaEvent = Joi.object({
  title: Joi.string().required().custom(
    (value) => removeWhitespace(value)
  ).min(3).max(120).messages({
    "string.base": "T\xEDtulo deve ser uma string",
    "string.empty": "T\xEDtulo n\xE3o pode estar vazio",
    "string.min": "T\xEDtulo deve conter no m\xEDnimo 3 caracteres",
    "string.max": "T\xEDtulo deve conter no m\xE1ximo 120 caracteres"
  }),
  description: Joi.string().optional().custom(
    (value) => removeWhitespace(value)
  ).min(3).max(120).messages({
    "string.base": "Descri\xE7\xE3o deve ser uma string"
  }),
  linkEvent: Joi.string().uri().optional().messages({
    "string.base": "O link deve ser uma string",
    "string.uri": "O link deve ser uma URL v\xE1lida"
  }),
  address: Joi.object({
    street: Joi.string().required().custom(
      (value) => removeWhitespace(value)
    ).min(10).max(120).messages({
      "string.base": "Rua deve ser uma string",
      "string.empty": "Rua n\xE3o pode estar vazia",
      "string.min": "Rua deve conter no m\xEDnimo 10 caracteres",
      "string.max": "Rua deve conter no m\xE1ximo 120 caracteres"
    }),
    number: Joi.string().custom(
      (value) => removeWhitespace(value)
    ).max(8).pattern(new RegExp("^[a-zA-Z0-9\\s]+$")).required().messages({
      "string.base": "N\xFAmero deve ser uma string",
      "string.empty": "N\xFAmero n\xE3o pode estar vazio",
      "string.pattern.base": "N\xFAmero aceita apenas caracteres alfanum\xE9ricos",
      "string.max": "N\xFAmero deve conter no m\xE1ximo 8 caracteres"
    }),
    neighborhood: Joi.string().required().custom(
      (value) => removeWhitespace(value)
    ).min(5).max(20).messages({
      "string.base": "Bairro deve ser uma string",
      "string.empty": "Bairro n\xE3o pode estar vazio",
      "string.min": "Bairro deve conter no m\xEDnimo 5 caracteres",
      "string.max": "Bairro deve conter no m\xE1ximo 20 caracteres"
    }),
    complement: Joi.string().trim().optional().max(30).messages({
      "string.base": "Complemento deve ser uma string",
      "string.max": "Complemento deve conter no m\xE1ximo 30 caracteres"
    })
  }).required(),
  startDateTime: Joi.date().min("now").required().messages({
    "date.base": "Data de in\xEDcio deve ser v\xE1lida",
    "date.min": "Data de in\xEDcio n\xE3o pode ser anterior \xE0 data atual",
    "any.required": "Data de in\xEDcio \xE9 obrigat\xF3ria"
  }),
  endDateTime: Joi.date().greater(Joi.ref("startDateTime")).optional().messages({
    "date.base": "Data de t\xE9rmino deve ser v\xE1lida",
    "date.greater": "Data de t\xE9rmino n\xE3o pode ser menor que a data de in\xEDcio"
  }),
  accessibilityLevel: Joi.string().valid(...Object.values(AccessibilityLevel)).optional().messages({
    "any.only": "N\xEDvel de acessibilidade inv\xE1lido"
  })
});

export {
  schemaEvent
};
