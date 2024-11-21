import {
  hashPassword
} from "./chunk-LPPX337Y.js";
import {
  checkExistingUser
} from "./chunk-LJXII5C6.js";
import {
  handleError
} from "./chunk-ZOAOPETN.js";
import {
  prisma
} from "./chunk-KRHBA2SY.js";
import {
  schemaCadastre
} from "./chunk-PCLMAWZP.js";
import {
  schemaUserPassword
} from "./chunk-LXJDJKI7.js";

// src/http/users/createUserRoute.ts
async function createUserRoute(fastify) {
  fastify.post("/usuarios", async (request, reply) => {
    try {
      const { firstName, lastName, email, phoneNumber, password } = request.body;
      await schemaCadastre.concat(schemaUserPassword).validateAsync({
        firstName,
        lastName,
        email,
        phoneNumber,
        password
      });
      const emailCheckResponse = await checkExistingUser(email);
      if (emailCheckResponse.existingUser || emailCheckResponse.error) {
        return reply.status(emailCheckResponse.status).send({
          error: emailCheckResponse.error,
          message: emailCheckResponse.message
        });
      }
      const hashedPassword = await hashPassword(password);
      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          phoneNumber,
          password: hashedPassword
        }
      });
      return reply.status(201).send({
        userId: newUser.userId,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber
      });
    } catch (error) {
      return handleError(error, reply);
    }
  });
}

export {
  createUserRoute
};
