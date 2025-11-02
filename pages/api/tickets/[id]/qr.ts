import type { NextApiRequest, NextApiResponse } from 'next'
import { signPayload, getSignerAddress } from '@/lib/qr/signer'
import connectDB from '@/lib/mongodb'
import { Ticket } from '@/lib/models/ticket'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing ticket id' })
  }

  try {
    // owner may be passed; default to demo owner
    const owner = (req.query.owner as string) || '0xDemoOwner'

    // eventId, ticketCost and timestamp are optional query params.
    // If they are not provided, try to infer eventId from the ticket id
    // (we use a convention like `eventId_index`, e.g. `2_0`). Otherwise
    // fall back to safe defaults.
    let eventId = Number.parseInt((req.query.eventId as string) || '')
    let ticketCost = Number.parseFloat((req.query.ticketCost as string) || '')
    let timestamp = Number.parseInt((req.query.timestamp as string) || '')

    if (Number.isNaN(eventId)) {
      // try to parse from id like '2_0'
      const parts = id.split('_')
      const maybe = Number.parseInt(parts[0])
      if (!Number.isNaN(maybe)) eventId = maybe
    }
    if (Number.isNaN(ticketCost)) ticketCost = 0
    if (Number.isNaN(timestamp)) timestamp = Date.now()

    // Connect to MongoDB
    console.log('Connecting to MongoDB...')
    await connectDB()
    console.log('Connected to MongoDB')

    // Get or create ticket
    console.log('Finding ticket:', id)
    let ticket = await Ticket.findOne({ ticketId: id })
    if (!ticket) {
      console.log('Creating new ticket...')
      const nonce = Math.random().toString(36).slice(2) + Date.now().toString(36)

      const ticketData = {
        ticketId: id,
        eventId: eventId,
        owner: owner,
        ticketCost: ticketCost,
        timestamp: timestamp,
        nonce: nonce,
        isUsed: false
      }
      console.log('Ticket data:', ticketData)

      ticket = await Ticket.create(ticketData)
      console.log('Created ticket:', ticket)
    }

    // Compose payload
    const payload = {
      ticketId: ticket.ticketId,
      owner: ticket.owner, 
      issuedAt: ticket.timestamp,
      nonce: ticket.nonce,
      signer: getSignerAddress(),
    }
    const sig = await signPayload(payload)
    
    res.status(200).json({ payload, sig })
  } catch (error) {
    console.error('Error:', error)
    if (error instanceof Error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'An unknown error occurred' })
    }
  }
}
