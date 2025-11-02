import type { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '@/lib/mongodb'
import { Ticket } from '@/lib/models/ticket'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'Missing event id' })

  try {
    await connectDB()

    const eventId = Number(id)
    if (Number.isNaN(eventId)) return res.status(400).json({ error: 'Invalid event id' })

    const result = await Ticket.deleteMany({ eventId })

    return res.status(200).json({ deletedCount: result.deletedCount })
  } catch (err) {
    console.error('delete-tickets error:', err)
    return res.status(500).json({ error: err instanceof Error ? err.message : 'unknown' })
  }
}
