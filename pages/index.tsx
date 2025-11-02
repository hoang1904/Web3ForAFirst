import EventList from '@/components/EventList'
import Hero from '@/components/Hero'
import { getEvents } from '@/services/blockchain'
import { EventStruct } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Page: NextPage<{ eventsData: EventStruct[] }> = ({ eventsData }) => {
  const [end, setEnd] = useState<number>(6)
  const [count] = useState<number>(6)
  const [collection, setCollection] = useState<EventStruct[]>([])
  const router = useRouter()
  const searchQuery = typeof router.query.q === 'string' ? router.query.q.toLowerCase() : ''

  useEffect(() => {
    const filtered = searchQuery
      ? eventsData.filter(
          event =>
            event.title.toLowerCase().includes(searchQuery) ||
            event.description.toLowerCase().includes(searchQuery)
        )
      : eventsData

    setCollection(filtered.slice(0, end))
  }, [eventsData, end, searchQuery])

  return (
    <div>
      <Head>
        <title>Event X</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />
      {collection.length > 0 ? (
        <EventList events={collection} />
      ) : searchQuery ? (
        <div className="w-full text-center mt-8 text-gray-600">
          No events found for "{router.query.q}"
        </div>
      ) : null}

      <div className="mt-10 h-20 "></div>

      {!searchQuery && collection.length > 0 && eventsData.length > collection.length && (
        <div className="w-full flex justify-center items-center">
          <button
            className="bg-orange-500 shadow-md rounded-full py-3 px-4
        text-white duration-300 transition-all"
            onClick={() => setEnd(end + count)}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}

export default Page

export const getServerSideProps = async () => {
  const eventsData: EventStruct[] = await getEvents()
  return {
    props: { eventsData: JSON.parse(JSON.stringify(eventsData)) },
  }
}
