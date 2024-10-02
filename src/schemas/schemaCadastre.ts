import Joi from "joi"
import { removeWhitespace } from "../utils/removeWhitespace.js"

export const schemaCadastre = Joi.object({
    firstName: Joi.string().custom(
        (value) => removeWhitespace(value)
    ).min(3).pattern(new RegExp('^[A-Za-zÀ-ÖØ-öø-ÿ\\s]+$')).required().messages({
        'string.base': 'Nome deve ser uma string',
        'string.empty': 'Nome não pode estar vazio',
        'string.min': 'Nome deve possuir no mínimo 3 caracteres',
        'string.pattern.base': 'Nome deve conter apenas caracteres alfabéticos, acentuados e espaços'
    }),
    lastName: Joi.string().custom(
        (value) => removeWhitespace(value)
    ).min(5).pattern(new RegExp('^[A-Za-zÀ-ÖØ-öø-ÿ\\s]+$')).required().messages({
        'string.base': 'Sobrenome deve ser uma string',
        'string.empty': 'Sobrenome não pode estar vazio',
        'string.min': 'Sobrenome deve possuir no mínimo 5 caracteres',
        'string.pattern.base': 'Sobrenome deve conter apenas caracteres alfabéticos, acentuados e espaços'
    }),
    email: Joi.string().email().required().messages({
        'string.base': 'Email deve ser uma string',
        'string.email': 'Email deve ser um email válido',
        'string.empty': 'Email não pode estar vazio'
    }),
    phoneNumber: Joi.string().pattern(/^\+?[0-9]{10,15}$/).allow(null).optional().messages({
        'string.base': 'Telefone deve ser uma string',
        'string.pattern.base': 'Telefone deve começar com "+" e conter entre 10 e 15 dígitos numéricos',
        'string.empty': 'Telefone não pode estar vazio'
    })
})