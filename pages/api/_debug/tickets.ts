import type { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '@/lib/mongodb'
import { Ticket } from '@/lib/models/ticket'
import mongoose from 'mongoose'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB()

  const db = mongoose.connection.db
  const dbName = db ? db.databaseName : null
  const collections = db ? (await db.listCollections().toArray()).map((c) => c.name) : []

  const count = await Ticket.countDocuments()
    const items = await Ticket.find().limit(100).lean()

    res.status(200).json({
      dbName,
      connectedCollections: collections,
      ticketsCount: count,
      tickets: items,
    })
  } catch (err) {
    console.error('Debug tickets error:', err)
    res.status(500).json({ error: err instanceof Error ? err.message : 'unknown' })
  }
}
