import { Ticket } from '@/lib/models/ticket'
import connectDB from '@/lib/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await connectDB()

    const { ticketId, eventId, owner, ticketCost } = req.body

    if (!ticketId || !eventId || !ticketCost ) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const existing = await Ticket.findOne({ ticketId })
    if (existing) {
      return res.status(409).json({ error: 'Ticket already exists' })
    }
     const nonce = Math.random().toString(36).slice(2) + Date.now().toString(36)

    const newTicket = await Ticket.create({
      ticketId,
      eventId,
      owner,
      ticketCost,
      timestamp: Date.now(),
      isUsed: false,
      nonce,
    })

    return res.status(201).json({ success: true, ticket: newTicket })
  } catch (err) {
    console.error('Error creating ticket:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
