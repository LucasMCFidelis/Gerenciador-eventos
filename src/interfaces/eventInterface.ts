export interface Event {
    eventId: string
    title: string
    description?: string | null
    linkEvent?: string | null
    address: {
        street: string
        number: string
        neighborhood: string
        complement?: string | null
    }
    startDateTime: Date
    endDateTime?: Date | null
}