export const swaggerSchemaDeleteUser = {
  description: 'Deletar um usuário específico pelo ID.',
  tags: ['Usuários'],
  params: {
      type: 'object',
      required: ['id'],
      properties: {
          id: {
              type: 'string',
              description: 'ID do usuário a ser deletado.',
          },
      },
  },
  response: {
      204: {
          description: 'Usuário deletado com sucesso.',
      },
      400: {
          description: 'Requisição inválida.',
          type: 'object',
          properties: {
              message: { type: 'string' }
          },
          examples: [
              {
                  message: "O ID não pode ser vazio."
              },
              {
                  message: "O ID deve estar no formato de UUID v4."
              }
          ]
      },
      404: {
          description: 'Usuário não encontrado.',
          type: 'object',
          properties: {
              message: { type: 'string' }
          },
          examples: [
              {
                  message: "Usuário não encontrado."
              }
          ]
      }
  }
}
