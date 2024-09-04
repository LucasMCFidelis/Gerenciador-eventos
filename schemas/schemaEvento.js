import Joi from "joi"

const validarApenasEspacos = (value, helpers, message) => {
    value = value.trim()
    if (value === '') {
        return helpers.message(message.toLowerCase())
    }
    return value
}

export const schemaEvento = Joi.object({
    title: Joi.string().min(3).max(120).required().custom(
        (value, helpers) => validarApenasEspacos(value, helpers, 'Título não pode conter apenas espaços em branco')
    ).messages({
        'string.base': ('Titulo deve ser uma string').toLowerCase(),
        'string.empty': ('Titulo não pode estar vazio').toLowerCase(),
        'string.min': ('Titulo deve conter no mínimo 3 caracteres').toLowerCase(),
        'string.max': ('Titulo deve conter no máximo 120 caracteres').toLowerCase()

    }),
    endereco: Joi.object({
        rua: Joi.string().min(10).max(120).required().custom(
            (value, helpers) => validarApenasEspacos(value, helpers, 'Rua não pode conter apenas espaços em branco')
        ).messages({
            'string.base': ('Rua deve ser uma string').toLowerCase(),
            'string.empty': ('Rua não pode estar vazia').toLowerCase(),
            'string.min': ('Rua deve conter no mínimo 10 caracteres').toLowerCase(),
            'string.max': ('Rua deve conter no máximo 120 caracteres').toLowerCase()
        }),
        numero: Joi.string().max(8).pattern(new RegExp('^[a-zA-Z0-9\s]+$')).required().custom(
            (value, helpers) => validarApenasEspacos(value, helpers, 'Número não pode conter apenas espaços em branco')
        ).messages({
            'string.base': ('Número deve ser uma string').toLowerCase(),
            'string.empty': ('Número não pode estar vazio').toLowerCase(),
            'string.pattern.base': ('Número deve conter apenas caracteres alfanuméricos').toLowerCase(),
            'string.max': ('Número deve conter no máximo 8 caracteres').toLowerCase()
        }),
        bairro: Joi.string().min(5).max(20).required().custom(
            (value, helpers) => validarApenasEspacos(value, helpers, 'Bairro não pode conter apenas espaços em branco')
        ).messages({
            'string.base': ('Bairro deve ser uma string').toLowerCase(),
            'string.empty': ('Bairro não pode estar vazio').toLowerCase(),
            'string.min': ('Bairro deve conter no mínimo 5 caracteres').toLowerCase(),
            'string.max': ('Bairro deve conter no máximo 20 caracteres').toLowerCase()
        }),
        complemento: Joi.string().max(30).optional().custom(
            (value, helpers) => validarApenasEspacos(value, helpers, 'Complemento não pode conter apenas espaços em branco')
        ).messages({
            'string.base': ('Complemento deve ser uma string').toLowerCase(),
            'string.max': ('Complemento deve conter no máximo 30 caracteres').toLowerCase()
        }),
    }).required(),
    data: Joi.string().length(10).pattern(new RegExp('^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$')).required().messages({
        'string.base': ('Data deve ser uma string').toLowerCase(),
        'string.empty': ('Data não pode estar vazia').toLowerCase(),
        'string.length': ('Data deve conter 10 caracteres').toLowerCase(),
        'string.pattern.base': ('Data deve estar no modelo (dd/mm/yyyy)').toLowerCase()
    }),
    horario: Joi.string().length(5).pattern(new RegExp('^([01][0-9]|2[0-3]):([0-5][0-9])$')).required().messages({
        'string.base': ('Horário deve ser uma string').toLowerCase(),
        'string.empty': ('Horário não pode estar vazio').toLowerCase(),
        'string.length': ('Horário deve conter 5 caracteres').toLowerCase(),
        'string.pattern.base': ('Horário deve estar no modelo (hh:mm)').toLowerCase()
    })
});