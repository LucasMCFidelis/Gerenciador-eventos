export function handleError(error, reply) {
    console.error(error.message)
    if (error.details) {
        return reply.status(400).send({
            error: 'Erro de validação',
            details: error.details.map(detail => (detail.message).toLowerCase())
        })
    } else {
        return reply.status(500).send({ message: 'Erro interno ao realizar operação' })
    }
}