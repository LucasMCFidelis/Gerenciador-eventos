import Joi from "joi"

const validarApenasEspacos = (value, helpers, message) => {
    value = value.trim()
    if (value === '') {
        return helpers.message(message)
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
    email: Joi.string().email().required().messages({
        'string.base': 'Email deve ser uma string',
        'string.email': 'Email deve ser um email válido',
        'string.empty': 'Email não pode estar vazio'
    }),
    telefone: Joi.number().integer().min(1000000000).max(99999999999).allow(null).optional().messages({
        'number.base': 'Telefone deve ser um número',
        'number.integer': 'Telefone deve ser um número inteiro',
        'number.min': 'Telefone deve ter no mínimo 10 dígitos',
        'number.max': 'Telefone deve ter no máximo 11 dígitos'
    })
})