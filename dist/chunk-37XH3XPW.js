import {
  comparePasswords
} from "./chunk-SZ6BW6KZ.js";
import {
  generateToken
} from "./chunk-BKI6JQ6F.js";
import {
  getUserByEmail
} from "./chunk-6GABII7F.js";

// src/http/users/loginUserRoute.ts
async function loginUserRoute(fastify) {
  fastify.post("/usuarios/login", async (request, reply) => {
    try {
      const { email, passwordProvided } = request.body;
      const userResponse = await getUserByEmail(email);
      if (userResponse.error || !userResponse.data) {
        return reply.status(userResponse.status).send({
          error: userResponse.error,
          message: userResponse.message
        });
      }
      const passwordValid = await comparePasswords(passwordProvided, userResponse.data.password);
      if (!passwordValid) {
        const errorValue = "Erro de autentica\xE7\xE3o";
        return reply.status(401).send({
          error: errorValue,
          message: "Credenciais inv\xE1lidas"
        });
      }
      const user = {
        userId: userResponse.data.userId,
        email: userResponse.data.email,
        roleName: userResponse.data.role.roleName
      };
      const token = generateToken(
        fastify,
        user
      );
      return reply.status(200).send({ message: "Login bem-sucedido", userToken: token });
    } catch (error) {
      return reply.status(500).send({ message: "Erro ao realizar login" });
    }
  });
}

export {
  loginUserRoute
};
