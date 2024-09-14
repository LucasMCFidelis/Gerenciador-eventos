import { db } from "./createDatabase.js"
import { randomUUID } from "crypto"
import bcrypt from "bcrypt"
import { schemaCadastro } from "./schemas/schemaCadastro.js"
import { schemaSenhaUsuario } from "./schemas/schemaSenhaUsuario.js"
import { handleError } from "./utils/handleError.js"

async function getUserById(usuarioId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT id_usuario, nome, sobrenome, email FROM usuarios WHERE id_usuario = ?', [usuarioId], (error, row) => {
            if (error) {
                console.error(error.message)
                return reject(error)
            }
            resolve(row || null)
        })
    })
}

async function getUserByEmail(userEmail) {
    return new Promise((resolve, reject) => {
        db.get('SELECT id_usuario, email, senha FROM usuarios WHERE email = ?', [userEmail], (error, row) => {
            if (error) {
                console.error(error.message)
                return reject(error)
            }
            resolve(row || null)
        })
    })
}

async function hashPassword(password) {
    const saltHounds = 10
    return await bcrypt.hash(password, saltHounds)
}

async function comparePasswords(passwordProvided, passwordHash) {
    return await bcrypt.compare(passwordProvided, passwordHash)
}

async function updateUserPassword(userId, newPassword) {
    const newPasswordHash = await hashPassword(newPassword)
    return new Promise((resolve, reject) => {
        db.run(`
            UPDATE usuarios
            SET senha = ? 
            WHERE id_usuario = ?
        `, [newPasswordHash, userId], (error) => {
            if (error) return reject(error)
            resolve()
        })
    })
}

export async function usuarios(fastify, options) {
    fastify.get('/usuarios/id/:id', async (request, reply) => {
        try {
            const { id } = request.params
            if (!id) {
                return reply.status(400).send({ message: 'ID deve ser fornecido' })
            }

            const user = await getUserById(id)
            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado' })
            }

            return reply.status(200).send(user)
        } catch (error) {
            return handleError(error, reply)
        }
    })

    // ADICIONAR BLOQUEIO PARA EMAILS JÁ CADASTRADOS
    fastify.post('/usuarios', async (request, reply) => {
        try {
            const { nome, sobrenome, email, telefone, senha } = request.body
            await schemaCadastro.validateAsync({ nome, sobrenome, email, telefone })
            await schemaSenhaUsuario.validateAsync({ senha })
            const usuarioId = randomUUID()
            const senhaHash = await hashPassword(senha)

            await db.run('INSERT INTO usuarios (id_usuario, nome, sobrenome, email, telefone, senha) VALUES (?, ?, ?, ?, ?, ?)', [usuarioId, nome, sobrenome, email, telefone, senhaHash])
            return reply.status(200).send({
                nome,
                sobrenome,
                email,
                telefone
            })
        } catch (error) {
            return handleError(error, reply)
        }
    })

    fastify.put('/usuarios/id/:id', async (request, reply) => {
        try {
            const usuarioId = request.params.id
            const user = await getUserById(usuarioId)
            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado' })
            }

            const value = await schemaCadastro.validateAsync(request.body)
            const { nome, sobrenome, email, telefone } = value
            await new Promise((resolve, reject) => {
                db.run(`
                    UPDATE usuarios 
                    SET nome = ?, sobrenome = ?, email = ?, telefone = ?
                    WHERE id_usuario = ?
                    `, [nome, sobrenome, email, telefone, usuarioId], (error) => {
                    if (error) return reject(error)
                    resolve()
                })
            })
            return reply.status(200).send({ message: 'Usuário atualizado com sucesso' })
        } catch (error) {
            return handleError(error, reply)
        }
    })

    fastify.delete('/usuarios/id/:id', async (request, reply) => {
        try {
            const usuarioId = request.params.id
            const user = await getUserById(usuarioId)
            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado' })
            }
            await db.run('DELETE FROM usuarios WHERE id_usuario = ?', [usuarioId])
            reply.status(204).send()
        } catch (error) {
            return handleError(error, reply)
        }
    })

    // ADICIONAR VALIDAÇÃO POR CÓDIGO EM EMAIL OU ALGUMA OUTRA OPÇÃO
    fastify.patch('/usuarios/recuperacao/esqueci-senha', async (request, reply) => {
        try {
            const { email, novaSenha } = request.body
            const user = await getUserByEmail(email)

            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado' })
            }

            await schemaSenhaUsuario.validateAsync({ senha: novaSenha })
            await updateUserPassword(user.id_usuario, novaSenha)

            return reply.status(200).send({ message: 'Senha atualizada com sucesso' })
        } catch (error) {
            return handleError(error, reply)
        }
    })

    // ADICIONAR LOGICA DE CRIAÇÃO DE TOKENS PARA PRÓXIMAS AUTENTICAÇÕES 
    fastify.post('/usuarios/login', async (request, reply) => {
        try {
            const { email, senhaFornecida } = request.body
            console.log(email, senhaFornecida);
            

            const user = await getUserByEmail(email)
            console.log(user);
            
            if (!user) {
                return reply.status(401).send({ message: 'Credenciais inválidas' })
            }

            const passwordValid = await comparePasswords(senhaFornecida, user.senha)
            console.log(passwordValid);
            
            if (!passwordValid) {
                return reply.status(401).send({message: 'Credenciais inválidas'})
            }

            return reply.status(200).send({message: 'Login bem-sucedido', userId: user.id_usuario})

        } catch (error) {
            return reply.status(500).send({ message: 'Erro ao realizar login' })
        }
    })
}