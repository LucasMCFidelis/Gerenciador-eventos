import { Address } from "./addressInterface.js"

export interface Event {
    eventId: string
    title: string
    description?: string | null
    linkEvent?: string | null
    address: Address
    startDateTime: Date
    endDateTime?: Date | null
}