import { Address } from "./addressInterface.js"

export enum AccessibilityLevel {
    SEM_ACESSIBILIDADE = "SEM_ACESSIBILIDADE",
    ACESSIBILIDADE_BASICA = "ACESSIBILIDADE_BASICA",
    ACESSIBILIDADE_AUDITIVA = "ACESSIBILIDADE_AUDITIVA",
    ACESSIBILIDADE_VISUAL = "ACESSIBILIDADE_VISUAL",
    ACESSIBILIDADE_COMPLETA = "ACESSIBILIDADE_COMPLETA",
    NAO_INFORMADA = "NAO_INFORMADA"
}

export interface Event {
    eventId: string
    title: string
    description?: string | null
    linkEvent?: string | null
    address: Address
    startDateTime: Date
    endDateTime?: Date | null
    accessibilityLevel: AccessibilityLevel
}