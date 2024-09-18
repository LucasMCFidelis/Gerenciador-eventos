import Joi from "joi"
import { removeEspacos } from "../utils/removeEspacos.ts"

export const schemaEvento = Joi.object({
    title: Joi.string().required().custom(
        (value) => removeEspacos(value)
    ).min(3).max(120).messages({
        'string.base': ('Titulo deve ser uma string'),
        'string.empty': ('Titulo não pode estar vazio'),
        'string.min': ('Titulo deve conter no mínimo 3 caracteres'),
        'string.max': ('Titulo deve conter no máximo 120 caracteres')
    }),
    endereco: Joi.object({
        rua: Joi.string().required().custom(
            (value) => removeEspacos(value)
        ).min(10).max(120).messages({
            'string.base': ('Rua deve ser uma string'),
            'string.empty': ('Rua não pode estar vazia'),
            'string.min': ('Rua deve conter no mínimo 10 caracteres'),
            'string.max': ('Rua deve conter no máximo 120 caracteres')
        }),
        numero: Joi.string().trim().max(8).pattern(new RegExp('^[a-zA-Z0-9\s]+$')).required().messages({
            'string.base': ('Número deve ser uma string'),
            'string.empty': ('Número não pode estar vazio'),
            'string.pattern.base': ('Número deve conter apenas caracteres alfanuméricos'),
            'string.max': ('Número deve conter no máximo 8 caracteres')
        }),
        bairro: Joi.string().required().custom(
            (value) => removeEspacos(value)
        ).min(5).max(20).messages({
            'string.base': ('Bairro deve ser uma string'),
            'string.empty': ('Bairro não pode estar vazio'),
            'string.min': ('Bairro deve conter no mínimo 5 caracteres'),
            'string.max': ('Bairro deve conter no máximo 20 caracteres')
        }),
        complemento: Joi.string().trim().optional().max(30).messages({
            'string.base': ('Complemento deve ser uma string'),
            'string.max': ('Complemento deve conter no máximo 30 caracteres')
        }),
    }).required(),
    data: Joi.string().trim().length(10).pattern(new RegExp('^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$')).required().messages({
        'string.base': ('Data deve ser uma string'),
        'string.empty': ('Data não pode estar vazia'),
        'string.length': ('Data deve conter 10 caracteres'),
        'string.pattern.base': ('Data deve estar no modelo (dd/mm/yyyy)')
    }),
    horario: Joi.string().trim().length(5).pattern(new RegExp('^([01][0-9]|2[0-3]):([0-5][0-9])$')).required().messages({
        'string.base': ('Horário deve ser uma string'),
        'string.empty': ('Horário não pode estar vazio'),
        'string.length': ('Horário deve conter 5 caracteres'),
        'string.pattern.base': ('Horário deve estar no modelo (hh:mm)')
    })
})