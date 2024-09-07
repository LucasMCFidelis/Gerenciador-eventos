import Joi from "joi"

const validarApenasEspacos = (value, helpers, message) => {
    value = value.trim()
    if (value === '') {
        return helpers.message(message.toLowerCase())
    }
    return value
}

export const schemaCadastro = Joi.object({
    nome: Joi.string().custom(
        (value, helpers) => validarApenasEspacos(value, helpers, 'Nome não pode conter apenas espaços em branco')
    ).min(3).pattern(new RegExp('^[A-Za-zÀ-ÖØ-öø-ÿ\\s]+$')).required().messages({
        'string.base': 'Nome deve ser uma string',
        'string.empty': 'Nome não pode estar vazio',
        'string.min': 'Nome deve possuir no mínimo 3 caracteres',
        'string.pattern.base': 'Nome deve conter apenas caracteres alfabéticos, acentuados e espaços'
    }),
    sobrenome: Joi.string().custom(
        (value, helpers) => validarApenasEspacos(value, helpers, 'Sobrenome não pode conter apenas espaços em branco')
    ).min(5).pattern(new RegExp('^[A-Za-zÀ-ÖØ-öø-ÿ\\s]+$')).required().messages({
        'string.base': 'Sobrenome deve ser uma string',
        'string.empty': 'Sobrenome não pode estar vazio',
        'string.min': 'Sobrenome deve possuir no mínimo 5 caracteres',
        'string.pattern.base': 'Sobrenome deve conter apenas caracteres alfabéticos, acentuados e espaços'
    }),
    email: Joi.string().email().custom(
        (value, helpers) => validarApenasEspacos(value, helpers, 'Email não pode conter apenas espaços em branco')
    ).required().messages({
        'string.email': 'E-mail deve ser um email válido',
        'string.empty': 'E-mail não pode estar vazio'
    }),
    telefone: Joi.string().trim().pattern(new RegExp('^[0-9]*$')).allow('').optional().messages({
        'string.pattern.base': 'Telefone deve conter apenas números'
    })
})