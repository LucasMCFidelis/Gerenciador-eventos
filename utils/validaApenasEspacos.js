export const validarApenasEspacos = (value, helpers, field) => {
    value = value.trim()
    if (value === '') {
        return helpers.message(`${field} não pode conter apenas espaços em branco`)
    }
    return value
}