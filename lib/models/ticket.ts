import { Schema, model, models } from 'mongoose'

export interface ITicket {
  ticketId: string // eventId + ticketIndex 
  eventId: number
  owner: string
  ticketCost: number
  timestamp: number
  isUsed: boolean
  usedAt?: number
  nonce?: string // For QR code verification
}

const ticketSchema = new Schema<ITicket>({
  ticketId: {
    type: String,
    required: true,
    unique: true
  },
  eventId: {
    type: Number,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  ticketCost: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  usedAt: Number,
  nonce: String
})

export const Ticket = models.Ticket || model<ITicket>('Ticket', ticketSchema)