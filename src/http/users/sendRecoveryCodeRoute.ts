import { FastifyInstance } from "fastify";
import { sendRecoveryCode } from "../../utils/email/sendRecoveryCode.js";
import { getUserByEmail } from "../../utils/db/getUserByEmail.js";
import { handleError } from "../../utils/handlers/handleError.js";

export async function sendRecoveryCodeRoute(fastify: FastifyInstance) {
  fastify.post<{
    Body: {
        email: string
    }
  }>('/usuarios/recuperacao/enviar-codigo', async (request, reply) => {
    const { email } = request.body

    try {
      const userResponse = await getUserByEmail(email);
      const user = userResponse.data;

      if (!user || userResponse.error) {
        return reply.status(userResponse.status).send({ message: userResponse.message });
      }

      await sendRecoveryCode(email);
      return reply.status(200).send({ message: 'Código de recuperação enviado' });
    } catch (error) {
      return handleError(error, reply);
    }
  });
}
