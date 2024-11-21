// src/utils/security/generateToken.ts
function generateToken(fastify, user) {
  return fastify.jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      roleName: user.roleName
    },
    { expiresIn: "1h" }
  );
}

export {
  generateToken
};
