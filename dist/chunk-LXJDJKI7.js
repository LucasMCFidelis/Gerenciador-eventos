// src/schemas/schemaUserPassword.ts
import Joi from "joi";
var schemaUserPassword = Joi.object({
  password: Joi.string().trim().pattern(new RegExp("^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$")).required().messages({
    "any.required": "Senha \xE9 obrigat\xF3ria",
    "string.base": "Senha deve ser uma string",
    "string.empty": "Senha n\xE3o pode estar vazia",
    "string.pattern.base": "Senha deve ter pelo menos 8 caracteres, incluir uma letra mai\xFAscula, um n\xFAmero e um caractere especial (!@#$&*)"
  })
});

export {
  schemaUserPassword
};
