import EventList from '@/components/EventList'
import { getMyEvents, getEvents, getTickets } from '@/services/blockchain'
import { EventStruct, TicketStruct } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { useAccount } from 'wagmi'
import Moment from 'react-moment'
import Identicon from 'react-identicons'
import { truncate } from '@/utils/helper'

const Page: NextPage = () => {
  const [end, setEnd] = useState<number>(6)
  const [count] = useState<number>(6)
  const [collection, setCollection] = useState<EventStruct[]>([])
  const [events, setEvents] = useState<EventStruct[]>([])
  const [myTickets, setMyTickets] = useState<(TicketStruct & { eventTitle?: string; eventImage?: string; eventOwner?: string; eventCreatedAt?: number })[]>([])
  const { address, isConnected } = useAccount()
  const [qrVisible, setQrVisible] = useState(false)
  const [qrValue, setQrValue] = useState('')
  const [qrLoading, setQrLoading] = useState(false)
  const [qrEventDetails, setQrEventDetails] = useState<any>(null)

  useEffect(() => {
    setCollection(events.slice(0, end))
  }, [events, end])

  useEffect(() => {
    // Only fetch "my events" when wallet is connected — otherwise hide/clear them
    if (!isConnected || !address) {
      setEvents([])
      setCollection([])
      return
    }

    const fetchData = async () => {
      try {
        const events = await getMyEvents()
        setEvents(events)
      } catch (error) {
        console.error('Error fetching my events:', error)
        setEvents([])
      }
    }

    fetchData()
  }, [isConnected, address])

  useEffect(() => {
    // fetch tickets owned by the connected address by scanning events
    if (!isConnected || !address) {
      setMyTickets([])
      return
    }

    const fetchMyTickets = async () => {
      try {
        const allEvents = await getEvents()

        // fetch tickets for every event in parallel
        const ticketsPerEvent = await Promise.all(
          allEvents.map(async (ev) => {
            const tickets = await getTickets(ev.id)
            return { ev, tickets }
          })
        )

  const owned: (TicketStruct & { eventTitle?: string; eventImage?: string; eventOwner?: string; eventCreatedAt?: number })[] = []

        ticketsPerEvent.forEach(({ ev, tickets }) => {
          tickets.forEach((t) => {
            if (t.owner?.toLowerCase() === address.toLowerCase()) {
              owned.push({
                ...t,
                eventTitle: ev.title,
                eventImage: ev.imageUrl,
                eventOwner: ev.owner,
                eventCreatedAt: ev.timestamp,
              })
            }
          })
        })

        setMyTickets(owned)
      } catch (error) {
        console.error('Error fetching my tickets:', error)
        setMyTickets([])
      }
    }

    fetchMyTickets()
  }, [isConnected, address])

  return (
    <>
      <div>
      <Head>
        <title>Event X | Personal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto px-4">
        <section className="mb-8">
          <main className="lg:w-2/3 w-full mx-auto">
            <h2 className="text-2xl font-semibold mb-4">My Tickets</h2>
          {!isConnected && (
            <p className="text-gray-500">Connect your wallet to see tickets you've purchased.</p>
          )}

          {isConnected && myTickets.length === 0 && (
            <p className="text-gray-500">You don't have any purchased tickets yet.</p>
          )}

          {isConnected && myTickets.length > 0 && (
            <div className="lg:w-2/2 w-full mx-auto">
              <div className="space-y-4">
                {myTickets.map((t, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow p-4 flex items-start gap-4">
                    <div className="w-28 h-28 flex-shrink-0 overflow-hidden rounded">
                      <img src={t.eventImage} alt={t.eventTitle} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{t.eventTitle}</h3>
                      <p className="text-sm text-gray-500">Ticket #{t.id + 1} • Event #{t.eventId}</p>
                      <p className="text-sm text-gray-500">Creator: {truncate({ text: t.eventOwner || '', startChars: 8, endChars: 6, maxLength: 24 })}</p>
                      {t.eventCreatedAt && (
                        <p className="text-sm text-gray-400">Created: <Moment format="YYYY-MM-DD HH:mm">{t.eventCreatedAt}</Moment></p>
                      )}
                      <div className="mt-3 flex items-center text-sm text-gray-600">
                        <Identicon size={18} string={t.owner} />
                        <span className="ml-2">{truncate({ text: t.owner, startChars: 6, endChars: 4, maxLength: 18 })}</span>
                      </div>
                    </div>

                    <div className="w-32 text-right flex-shrink-0">
                      <div className="text-sm text-gray-800 font-medium">{t.ticketCost.toFixed(4)} ETH</div>
                      <div className="text-xs text-gray-400"><Moment fromNow>{t.timestamp}</Moment></div>
                      <div className="mt-3">
                        {address && address.toLowerCase() === t.owner.toLowerCase() ? (
                          <button
                            onClick={async () => {
                              setQrLoading(true)
                              try {
                                const res = await fetch(`/api/tickets/${t.id}/qr?owner=${encodeURIComponent(t.owner)}`)
                                const data = await res.json()
                                const payload = { payload: data.payload, sig: data.sig, event: { id: t.eventId, title: t.eventTitle, ticketNumber: t.id + 1 } }
                                const txt = JSON.stringify(payload)
                                const b64 = typeof window !== 'undefined' ? window.btoa(unescape(encodeURIComponent(txt))) : Buffer.from(txt).toString('base64')
                                setQrValue(b64)
                                setQrEventDetails(payload.event)
                                setQrVisible(true)
                              } catch (err) {
                                console.error('QR fetch error', err)
                                alert('Không thể tạo QR')
                              } finally {
                                setQrLoading(false)
                              }
                            }}
                            className="bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600 transition text-sm"
                          >
                            {qrLoading ? 'Loading...' : 'Show QR'}
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400">QR hidden</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
            </main>
        </section>

        {isConnected && (
          <section>
            <main className="lg:w-2/3 w-full mx-auto">
              <h2 className="text-2xl font-semibold mb-4">My Events</h2>
            </main>
            <EventList events={collection} showTitle={false} />
          </section>
        )}
      </div>

      <div className="mt-10 h-20 "></div>

      {collection.length > 0 && events.length > collection.length && (
        <div className="w-full flex justify-center items-center">
          <button
            className="bg-orange-500 shadow-md rounded-full py-3 px-4
        text-white duration-300 transition-all"
            onClick={() => setEnd(end + count)}
          >
            {' '}
            Load More
          </button>
        </div>
      )}
    </div>

  {qrVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold">Ticket QR</h3>
                {qrEventDetails && <p className="text-sm text-gray-600">{qrEventDetails.title}</p>}
              </div>
              <button onClick={() => setQrVisible(false)} className="text-red-600">Close</button>
            </div>
            <div className="flex justify-center">
              <QRCode value={qrValue} size={220} />
            </div>
            {qrEventDetails && (
              <div className="mt-4 text-center">
                <div className="font-medium">{qrEventDetails.title}</div>
                <div className="text-sm text-gray-500">Ticket #{qrEventDetails.ticketNumber}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Page
