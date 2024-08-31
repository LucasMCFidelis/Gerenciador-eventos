import { randomUUID } from "node:crypto"

export class DatabaseMemory {
    #eventos = new Map()

    list() {
        return Array.from(this.#eventos.entries()).map((eventoArray) => {
            const id = eventoArray[0]
            const data = eventoArray[1]

            return {
                id,
                ...data
            }
        })
    }

    create(evento) {
        const eventoId = randomUUID()
        this.#eventos.set(eventoId, evento)
    }

    update(id, evento) {
        this.#eventos.set(id, evento)
    }

    delete(id) {
        this.#eventos.delete(id)
    }
}