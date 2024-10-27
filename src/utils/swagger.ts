export const swaggerSchemaGetUser = {
  description: 'Retorna um usuário específico pelo ID.',
  tags: ['Usuários'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        description: 'ID do usuário a ser obtido.',
      },
    },
  },
  response: {
    200: {
      description: 'Usuário encontrado.',
      type: 'object',
      properties: {
        firstName: {
          description: 'Primeiro nome do usuário.'
        },
        lastName: {
          description: 'Sobrenome do usuário.'
        },
        email: {
          description: 'Email do usuário.'
        },
        phoneNumber: {
          description: 'Telefone do usuário, opcional para contato.'
        }
      },
      examples: [
        {
          firstName: 'Lucas',
          lastName: 'Fidelis',
          email: 'lucas.fidelis@example.com',
          phoneNumber: "+5511999998888"
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

export const swaggerSchemaUpdateUserRole = {
  description: 'Atualizar perissão de um usuário específico pelo ID.',
  tags: ['Usuários'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        description: 'ID do usuário a ser atualizada a permissão.',
      },
    },
  },
  response: {
    200: {
      description: 'Usuário deletado com sucesso.',
      type: 'object',
      properties: {
        message: { type: 'string' }
      },
      example: {
        message: "Permissão do usuário atualizada com sucesso"
      }
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
