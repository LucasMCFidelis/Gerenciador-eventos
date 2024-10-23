import { FastifyInstance } from "fastify";
import { schemaCadastre } from "../../schemas/schemaUserCadastre.js";
import { schemaUserPassword } from "../../schemas/schemaUserPassword.js";
import { checkExistingUser } from "../../utils/validators/checkExistingUser.js";
import { handleError } from "../../utils/handlers/handleError.js";
import { prisma } from "../../utils/db/prisma.js";
import { hashPassword } from "../../utils/security/hashPassword.js";
import { CadastreUser } from "../../interfaces/cadastreUserInterface.js";

export async function createUserRoute(fastify: FastifyInstance) {
    fastify.post('/usuarios', {
        schema: {
            description: 'Cadastro de um novo usuário.',
            tags: ['Usuários'],
            body: {
                type: 'object',
                required: ['firstName', 'lastName', 'email', 'password'], // Adicionando 'password'
                properties: {
                    firstName: {
                        type: 'string',
                        minLength: 3,
                        pattern: '^[A-Za-zÀ-ÖØ-öø-ÿ\\s]+$',
                        description: 'Primeiro nome do usuário. Deve conter apenas letras e espaços.',
                    },
                    lastName: {
                        type: 'string',
                        minLength: 5,
                        pattern: '^[A-Za-zÀ-ÖØ-öø-ÿ\\s]+$',
                        description: 'Sobrenome do usuário. Deve conter apenas letras e espaços.',
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        description: 'Endereço de email válido.',
                    },
                    phoneNumber: {
                        type: 'string',
                        pattern: '^\\+?[0-9]{10,15}$',
                        nullable: true,
                        description: 'Número de telefone. Deve começar com "+" e conter entre 10 e 15 dígitos.',
                    },
                    password: {
                        type: 'string',
                        minLength: 8,
                        description: 'Senha do usuário. Deve conter no mínimo 6 caracteres.',
                    }
                },
                examples: [
                    {
                        summary: 'Exemplo válido',
                        value: {
                            firstName: 'Lucas',
                            lastName: 'Fidelis',
                            email: 'lucas.fidelis@example.com',
                            phoneNumber: '+5511999998888',
                            password: 'senhaSecreta123$'
                        }
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
                            summary: 'Resposta bem-sucedida',
                            value: {
                                userId: '12345',
                                firstName: 'Lucas',
                                lastName: 'Fidelis',
                                email: 'lucas.fidelis@example.com'
                            }
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
                            summary: 'Erro de validação',
                            value: {
                                message: 'Nome deve possuir no mínimo 3 caracteres'
                            }
                        }
                    ]
                }
            }
        }
    }, async (request, reply) => {
        try {
            // Extrair dados fornecidos no corpo da requisição
            const { firstName, lastName, email, phoneNumber, password } = request.body as CadastreUser;

            // Validação dos dados com schemas
            await schemaCadastre.concat(schemaUserPassword).validateAsync({
                firstName,
                lastName,
                email,
                phoneNumber,
                password
            });

            // Verificação de usuário existente
            const { status, existingUser, message, error } = await checkExistingUser(email);
            if (existingUser || error) {
                return reply.status(status).send({ message });
            }

            // Criptografar a senha do usuário
            const hashedPassword = await hashPassword(password);

            // Criar o usuário no banco de dados
            const newUser = await prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    password: hashedPassword
                }
            });

            // Responder com os dados do usuário (sem retornar a senha)
            return reply.status(201).send({
                userId: newUser.userId,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
            });
        } catch (error) {
            // Tratamento de erros genéricos utilizando o handler global
            return handleError(error, reply);
        }
    });
}
