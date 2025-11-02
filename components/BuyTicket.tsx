import { buyTicket } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { EventStruct, RootState } from '@/utils/type.dt'
import React, { FormEvent, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'

const BuyTicket: React.FC<{ event: EventStruct }> = ({ event }) => {
  const { ticketModal } = useSelector((states: RootState) => states.globalStates)
  const { setTicketModal } = globalActions

  const { address } = useAccount()
  const dispatch = useDispatch()

  const [tickets, setTickets] = useState<number | string>('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!address) return toast.warn('Connect wallet first')

    await toast.promise(
      new Promise(async (resolve, reject) => {
        buyTicket(event, Number(tickets))
          .then(async (tx) => {
            dispatch(setTicketModal('scale-0'))
            setTickets('')
            console.log(tx)

            // Get current number of seats as base for ticketId
            const baseTicketNumber = event.seats - Number(tickets)
            
            // Create QR code for each ticket purchased
            for (let i = 0; i < Number(tickets); i++) {
              const ticketId = `${event.id}_${baseTicketNumber + i}`
              try {
                const res = await fetch(`/api/tickets/${ticketId}/qr?` + new URLSearchParams({
                  owner: address,
                  eventId: event.id.toString(),
                  ticketCost: event.ticketCost.toString(),
                  timestamp: Date.now().toString()
                }))
                if (!res.ok) {
                  const error = await res.json()
                  throw new Error(error.message || 'Failed to create ticket QR code')
                }
                const data = await res.json()
                console.log('Ticket created:', data)
              } catch (err) {
                console.error('Error creating ticket:', err)
                toast.error('Failed to create ticket QR code')
              }
            }

            resolve(tx)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Ticket purchased successful 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
        bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${ticketModal}`}
    >
      <div className="bg-white text-black shadow-md shadow-orange-500 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Buy Tickets</p>
            <button
              className="border-0 bg-transparent focus:outline-none"
              onClick={() => dispatch(setTicketModal('scale-0'))}
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col justify-center items-start my-5">
            <div className="w-full bg-gray-200 rounded-xl p-2 mb-5">
              <div
                className="block w-full text-sm bg-transparent
                border-0 focus:outline-none focus:ring-0"
              >
                <input
                  className="block w-full text-sm bg-transparent
                  border-0 focus:outline-none focus:ring-0"
                  type="number"
                  step="1"
                  min="1"
                  name="tickets"
                  placeholder="Ticket e.g 3"
                  value={tickets}
                  onChange={(e) => setTickets(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-orange-500 p-2 rounded-full py-3 px-10
            text-white hover:bg-transparent border hover:text-orange-500
            hover:border-orange-500 duration-300 transition-all"
            >
              Buy Now
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BuyTicket
