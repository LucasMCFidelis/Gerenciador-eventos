import { FastifyInstance } from "fastify";
import { comparePasswords } from "../../utils/security/comparePasswords.js";
import { getUserByEmail } from "../../utils/db/getUserByEmail.js";
import { generateToken } from "../../utils/security/generateToken.js";

export async function loginUserRoute(fastify: FastifyInstance) {
    // ADICIONAR LOGICA DE CRIAÇÃO DE TOKENS PARA PRÓXIMAS AUTENTICAÇÕES 
    fastify.post('/usuarios/login', async (request, reply) => {
        try {
            // Extrair email e senha fornecida do corpo da requisição
            const { email, passwordProvided } = request.body as { email: string, passwordProvided: string }

            // Buscar o usuário no banco de dados pelo email
            const userResponse = await getUserByEmail(email)            

            // Se houve um erro na busca ou usuário não existe
            if (userResponse.error || !userResponse.data) {
                // Manter uma mensagem de erro padrão para casos onde `user` não é encontrado
                const errorMessage = userResponse.message || 'Credenciais inválidas'
                return reply.status(userResponse.error ? userResponse.status : 401).send({ message: errorMessage })
            }

            // Validar a senha fornecida com a armazenada no banco de dados
            const passwordValid = await comparePasswords(passwordProvided, userResponse.data.password)

            // Retornar erro de credenciais inválidas se a senha não for válida
            if (!passwordValid) {
                return reply.status(401).send({ message: 'Credenciais inválidas' })
            }

            const user = {
                userId: userResponse.data.userId,
                email: userResponse.data.email,
                roleName: userResponse.data.role.roleName
            }

            const token = generateToken(
                fastify,
                user
            )

            // Retorno de sucesso com token de autenticação do usuário
            return reply.status(200).send({ message: 'Login bem-sucedido', userToken: token })
        } catch (error) {
            // Capturar erros inesperados e retornar uma mensagem genérica
            return reply.status(500).send({ message: 'Erro ao realizar login' })
        }
    })
}