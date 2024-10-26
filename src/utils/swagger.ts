export const swaggerSchemaDeleteUser = {
  description: 'Deletar um usuário específico pelo ID.',
  tags: ['Usuários'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
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

export const swaggerSchemaCreateUser = {
  description: 'Cadastro de um novo usuário.',
  tags: ['Usuários'],
  body: {
    type: 'object',
    required: ['firstName', 'lastName', 'email', 'password'],
    properties: {
      firstName: {
        description: 'Primeiro nome do usuário. Deve conter apenas letras e espaços.',
      },
      lastName: {
        description: 'Sobrenome do usuário. Deve conter apenas letras e espaços.',
      },
      email: {
        description: 'Endereço de email válido.',
      },
      phoneNumber: {
        description: 'Número de telefone. Deve começar com "+" e conter entre 10 e 15 dígitos.',
      },
      password: {
        description: 'Senha do usuário. Deve conter no mínimo 6 caracteres.',
      }
    },
    examples: [
      {
        firstName: 'Lucas',
        lastName: 'Fidelis',
        email: 'lucas.fidelis@example.com',
        phoneNumber: '+5511999998888',
        password: 'senhaSecreta123$'
      }
    ]
  },
  response: {
    201: {
      description: 'Usuário cadastrado com sucesso.',
      type: 'object',
      properties: {
        userId: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        phoneNumber: { type: 'string' }
      },
      examples: [
        {
          userId: '12345',
          firstName: 'Lucas',
          lastName: 'Fidelis',
          email: 'lucas.fidelis@example.com'
        }
      ]
    },
    400: {
      description: 'Erro de validação.',
      type: 'object',
      properties: {
        message: { type: 'string' }
      },
      examples: [
        {
          message: 'Nome deve ser uma string'
        },
        {
          message: 'Nome deve possuir no mínimo 3 caracteres'
        },
      ]
    },
    409: {
      description: 'Conflito ao tentar deletar o usuário.',
      type: 'object',
      properties: {
        message: { type: 'string' }
      },
      examples: [
        {
          message: "Este e-mail já está cadastrado."
        }
      ]
    }
  }
}

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
