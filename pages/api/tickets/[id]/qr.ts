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

    // Connect to MongoDB
    console.log('Connecting to MongoDB...')
    await connectDB()
    console.log('Connected to MongoDB')

    // Get or create ticket
    console.log('Finding ticket:', id)
    let ticket = await Ticket.findOne({ ticketId: id })
    if (!ticket) {
      return  res.status(500).json({ error: 'Ticket not found' })
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
