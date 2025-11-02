import connectDB from './mongodb'
import { Ticket, ITicket } from './models/ticket'

export type CheckinResult = 
  | { status: 'not_found'; message?: string }
  | { status: 'invalid_signature'; message?: string }
  | { status: 'already_checked_in'; message?: string; ticket?: ITicket }
  | { status: 'success'; ticket: ITicket }

export type VerifiedTicket = {
  ticketId: string
  owner: string
  issuedAt: number
  nonce: string
  signer: string
}

export async function checkinTicket(verifiedTicket: VerifiedTicket): Promise<CheckinResult> {
  // Connect to MongoDB
  await connectDB()

  // Validate input
  if (!verifiedTicket.ticketId) {
    return { status: 'not_found', message: 'Empty ticket ID' }
  }

  try {
    // Find ticket by ID
    const ticket = await Ticket.findOne({ ticketId: verifiedTicket.ticketId })
    if (!ticket) {
      return { status: 'not_found', message: 'Ticket not found' }
    }

    // Verify ticket ownership and nonce
    if (ticket.owner !== verifiedTicket.owner || ticket.nonce !== verifiedTicket.nonce) {
      return { status: 'invalid_signature', message: 'Invalid ticket signature' }
    }

    // Check if already used
    if (ticket.isUsed) {
      return { 
        status: 'already_checked_in',
        message: `Ticket was already used at ${new Date(ticket.usedAt!).toLocaleString()}`,
        ticket
      }
    }

    // Update ticket status
    ticket.isUsed = true
    ticket.usedAt = Date.now()
    await ticket.save()

    return { status: 'success', ticket }
  } catch (error) {
    console.error('Checkin error:', error)
    throw error // Let the API handler deal with the error
  }
}
