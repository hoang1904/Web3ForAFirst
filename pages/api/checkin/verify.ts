import type { NextApiRequest, NextApiResponse } from 'next'
import { checkinTicket, VerifiedTicket } from '../../../lib/checkin'
import { verifySignature } from '../../../lib/qr/signer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { payload, sig } = req.body

    // Validate request body
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Missing or invalid payload' 
      })
    }

    // Validate required fields
    const requiredFields = ['ticketId', 'owner', 'issuedAt', 'nonce', 'signer'] as const
    for (const field of requiredFields) {
      if (!(field in payload)) {
        return res.status(400).json({
          status: 'error',
          message: `Missing required field: ${field}`
        })
      }
    }

    // Type check the payload
    const verifiedTicket = payload as VerifiedTicket

    // If signature provided, verify it
    if (sig) {
      const isValid = verifySignature(payload, sig, verifiedTicket.signer)
      if (!isValid) {
        return res.status(403).json({ 
          status: 'error', 
          message: 'Invalid signature' 
        })
      }
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Signature is required'
      })
    }

    // Process check-in
    const result = await checkinTicket(verifiedTicket)

    // Return appropriate status code based on result
    switch (result.status) {
      case 'success':
        return res.status(200).json(result)
      case 'already_checked_in':
        return res.status(409).json(result) // Conflict
      case 'invalid_signature':
        return res.status(403).json(result) // Forbidden
      case 'not_found':
        return res.status(404).json(result) // Not Found
      default:
        return res.status(500).json({
          status: 'error',
          message: 'Unknown status'
        })
    }
  } catch (err) {
    console.error('Check-in verify error:', err)
    return res.status(500).json({ 
      status: 'error', 
      message: err instanceof Error ? err.message : 'Internal server error'
    })
  }
}