import sqlite3 from 'sqlite3'

export const db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (error) => {
    if (error) {
        console.error('Erro ao conectar ao banco de dados:', error.message)
        return
    }
    console.log('Conectado ao banco de dados.')
})

db.run(`
    CREATE TABLE IF NOT EXISTS eventos (
        id_evento TEXT,
        titulo VARCHAR(120) NOT NULL,
        rua VARCHAR(120) NOT NULL,
        numero VARCHAR(8) NOT NULL,
        bairro VARCHAR(20) NOT NULL,
        complemento VARCHAR(30),
        data_inicio CHAR(10) NOT NULL,
        horario CHAR(5) NOT NULL,
        CONSTRAINT pk_id_evento PRIMARY KEY (id_evento)
    )
`)
db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id_usuario TEXT,
        nome TEXT NOT NULL,
        sobrenome TEXT NOT NULL,
        email TEXT NOT NULL,
        telefone TEXT,
        senha TEXT NOT NULL,
        CONSTRAINT pk_id_usuario PRIMARY KEY (id_usuario),
        CONSTRAINT uk_email UNIQUE (email)
    )
`)
