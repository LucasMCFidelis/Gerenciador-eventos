import Joi, { valid } from "joi"

const validarApenasEspacos = (value, helpers, message) => {
    value = value.trim()
    if (value === '') {
        return helpers.message(message.toLowerCase())
    }
    return value
}

export const schemaCadastro = Joi.object({
    nome: Joi.string().min(3).pattern(new RegExp('^[A-Za-zÀ-ÖØ-öø-ÿ\\s]+$')).required().custom(
        (value, helpers) => validarApenasEspacos(value, helpers, 'Nome não pode conter apenas espaços em branco')
    ).messages({
        'string.base': 'Nome deve ser uma string',
        'string.empty': 'Nome não pode estar vazio',
        'string.min': 'Nome deve possuir no mínimo 3 caracteres',
        'string.pattern.base': 'Nome deve conter apenas caracteres alfabéticos, acentuados e espaços'
    }),
    sobrenome: Joi.string().min(5).pattern(new RegExp('^[A-Za-zÀ-ÖØ-öø-ÿ\\s]+$')).required().custom(
        (value, helpers) => validarApenasEspacos(value, helpers, 'Sobrenome não pode conter apenas espaços em branco')
    ).messages({
        'string.base': 'Sobrenome deve ser uma string',
        'string.empty': 'Sobrenome não pode estar vazio',
        'string.min': 'Sobrenome deve possuir no mínimo 5 caracteres',
        'string.pattern.base': 'Sobrenome deve conter apenas caracteres alfabéticos, acentuados e espaços'
    }),
    email: Joi.string().email().required().custom(
        (value, helpers) => validarApenasEspacos(value, helpers, 'Email não pode conter apenas espaços em branco')
    ).messages({
        'string.email': 'E-mail deve ser um email válido',
        'string.empty': 'E-mail não pode estar vazio'
    }),
    telefone: Joi.string().pattern(new RegExp('^[0-9]*$')).allow('').optional().messages({
        'string.pattern.base': 'Telefone deve conter apenas números'
    }),
    senha: Joi.string().pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$')).required().messages({
        'string.empty': 'Senha não pode estar vazia',
        'string.pattern.base': 'Senha deve ter pelo menos 8 caracteres, incluir uma letra maiúscula, um número e um caractere especial (!@#$&*)',
    })
});