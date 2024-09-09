export const validarApenasEspacos = (value, helpers, message) => {
    value = value.trim()
    if (value === '') {
        return helpers.message(message)
    }
    return value
}