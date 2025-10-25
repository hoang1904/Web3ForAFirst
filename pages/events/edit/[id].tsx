// import { getEvent, updateEvent } from '@/services/blockchain'
// import { generateEventData } from '@/utils/fakeData'
// import { timestampToDatetimeLocal } from '@/utils/helper'
// import { EventParams, EventStruct } from '@/utils/type.dt'
// import { GetServerSidePropsContext, NextPage } from 'next'
// import Head from 'next/head'
// import Link from 'next/link'
// import { ChangeEvent, FormEvent, useState } from 'react'
// import { toast } from 'react-toastify'
// import { useAccount } from 'wagmi'

// const Page: NextPage<{ eventData: EventStruct }> = ({ eventData }) => {
//   const { address } = useAccount()
//   const [event, setEvent] = useState<EventParams>({
//     ...eventData,
//     startsAt: timestampToDatetimeLocal(eventData.startsAt),
//     endsAt: timestampToDatetimeLocal(eventData.endsAt),
//   })

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setEvent((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }))
//   }

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault()
//     if (!address) return toast.warn('Connect wallet first')

//     event.startsAt = new Date(event.startsAt).getTime()
//     event.endsAt = new Date(event.endsAt).getTime()

//     await toast.promise(
//       new Promise(async (resolve, reject) => {
//         updateEvent(event)
//           .then((tx) => {
//             console.log(tx)
//             resolve(tx)
//           })
//           .catch((error) => reject(error))
//       }),
//       {
//         pending: 'Approve transaction...',
//         success: 'Event updated successful 👌',
//         error: 'Encountered error 🤯',
//       }
//     )
//   }

//   return (
//     <div>
//       <Head>
//         <title>Event X | Edit</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main className="lg:w-2/3 w-full mx-auto bg-white p-5 shadow-md">
//         <form onSubmit={handleSubmit} className="flex flex-col text-black">
//           <div className="flex flex-row justify-between items-center mb-5">
//             <p className="font-semibold">Edit Event</p>
//           </div>

//           {event.imageUrl && (
//             <div className="flex flex-row justify-center items-center rounded-xl">
//               <div className="shrink-0 rounded-xl overflow-hidden h-20 w-20 shadow-md">
//                 <img src={event.imageUrl} alt={event.title} className="h-full object-cover" />
//               </div>
//             </div>
//           )}

//           <div className="flex flex-row justify-between items-center bg-gray-200 rounded-xl mt-5 p-2">
//             <input
//               className="block w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
//               type="text"
//               name="title"
//               placeholder="Title"
//               value={event.title}
//               onChange={handleChange}
//             />
//           </div>

//           <div
//             className="flex flex-col sm:flex-row justify-between items-center w-full
//            space-x-0 sm:space-x-2 space-y-5 sm:space-y-0 mt-5"
//           >
//             <div className="w-full bg-gray-200 rounded-xl p-2">
//               <div
//                 className="block w-full text-sm bg-transparent
//               border-0 focus:outline-none focus:ring-0"
//               >
//                 <input
//                   className="block w-full text-sm bg-transparent
//                   border-0 focus:outline-none focus:ring-0"
//                   type="number"
//                   step={1}
//                   min={1}
//                   name="capacity"
//                   placeholder="Capacity"
//                   value={event.capacity}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="w-full bg-gray-200 rounded-xl p-2">
//               <div
//                 className="block w-full text-sm bg-transparent
//               border-0 focus:outline-none focus:ring-0"
//               >
//                 <input
//                   className="block w-full text-sm bg-transparent
//                   border-0 focus:outline-none focus:ring-0"
//                   type="number"
//                   step="0.01"
//                   min="0.01"
//                   name="ticketCost"
//                   placeholder="Ticket cost (ETH)"
//                   value={event.ticketCost}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-row justify-between items-center bg-gray-200 rounded-xl mt-5 p-2">
//             <input
//               className="block w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
//               type="url"
//               name="imageUrl"
//               placeholder="ImageURL"
//               pattern="https?://.+(\.(jpg|png|gif))?$"
//               value={event.imageUrl}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div
//             className="flex flex-col sm:flex-row justify-between items-center w-full
//            space-x-0 sm:space-x-2 space-y-5 sm:space-y-0 mt-5"
//           >
//             <div className="w-full bg-gray-200 rounded-xl p-2">
//               <div
//                 className="block w-full text-sm bg-transparent
//               border-0 focus:outline-none focus:ring-0"
//               >
//                 <input
//                   placeholder="Start Date"
//                   className="bg-transparent outline-none w-full placeholder-[#3D3857] text-sm border-none focus:outline-none focus:ring-0 py-0"
//                   name="startsAt"
//                   type="datetime-local"
//                   value={event.startsAt}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="w-full bg-gray-200 rounded-xl p-2">
//               <div
//                 className="block w-full text-sm bg-transparent
//               border-0 focus:outline-none focus:ring-0"
//               >
//                 <input
//                   placeholder="End Date"
//                   className="bg-transparent outline-none w-full placeholder-[#3D3857] text-sm border-none focus:outline-none focus:ring-0 py-0"
//                   name="endsAt"
//                   type="datetime-local"
//                   value={event.endsAt}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-row justify-between items-center bg-gray-200 rounded-xl mt-5 p-2">
//             <textarea
//               className="block w-full text-sm resize-none
//               bg-transparent border-0 focus:outline-none focus:ring-0 h-20"
//               name="description"
//               placeholder="Description"
//               value={event.description}
//               onChange={handleChange}
//               required
//             ></textarea>
//           </div>

//           <div className="flex space-x-2 mt-5">
//             <button
//               type="submit"
//               className="bg-orange-500 p-2 rounded-full py-3 px-10
//             text-white hover:bg-transparent border hover:text-orange-500
//             hover:border-orange-500 duration-300 transition-all"
//             >
//               Update
//             </button>

//             <Link
//               href={'/events/' + event.id}
//               type="button"
//               className="bg-transparent p-2 rounded-full py-3 px-5
//               text-black hover:bg-orange-500 hover:text-white
//               duration-300 transition-all flex justify-start items-center
//               space-x-2 border border-black hover:border-orange-500"
//             >
//               Back
//             </Link>
//           </div>
//         </form>
//       </main>
//     </div>
//   )
// }

// export default Page

// export const getServerSideProps = async (context: GetServerSidePropsContext) => {
//   const { id } = context.query
//   const eventData: EventStruct = await getEvent(Number(id))

//   return {
//     props: {
//       eventData: JSON.parse(JSON.stringify(eventData)),
//     },
//   }
// }

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { NextPage, GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import { useAccount } from 'wagmi'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { getEvent, updateEvent } from '@/services/blockchain'
import { EventStruct, EventParams } from '@/utils/type.dt'

interface ComponentProps {
  eventData: EventStruct
}

const UpdateEventPage: NextPage<ComponentProps> = ({ eventData }) => {
  const { address } = useAccount()
  const router = useRouter()

  const [event, setEvent] = useState<EventParams>({
    id: eventData.id,
    title: eventData.title,
    imageUrl: eventData.imageUrl,
    description: eventData.description,
    ticketCost: eventData.ticketCost.toString(),
    capacity: eventData.capacity.toString(),
    startsAt: '',
    endsAt: '',
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(eventData.imageUrl || '')
  const [keepExistingImage, setKeepExistingImage] = useState<boolean>(true)

  useEffect(() => {
    // Convert timestamps to datetime-local format
    if (eventData.startsAt) {
      const startDate = new Date(eventData.startsAt)
      setEvent((prev) => ({
        ...prev,
        startsAt: formatDateForInput(startDate),
      }))
    }

    if (eventData.endsAt) {
      const endDate = new Date(eventData.endsAt)
      setEvent((prev) => ({
        ...prev,
        endsAt: formatDateForInput(endDate),
      }))
    }
  }, [eventData])

  // Format date to datetime-local input format
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEvent((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      setImageFile(file)
      setKeepExistingImage(false)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(eventData.imageUrl || '')
    setKeepExistingImage(true)

    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!address) {
      return toast.warn('Connect wallet first')
    }

    if (address !== eventData.owner) {
      return toast.error('Only event owner can update this event')
    }

    // Validate dates
    const startTime = new Date(event.startsAt).getTime()
    const endTime = new Date(event.endsAt).getTime()

    if (startTime >= endTime) {
      return toast.error('End date must be after start date')
    }

    // Prepare event data
    const updatedEvent: EventParams = {
      ...event,
      startsAt: startTime,
      endsAt: endTime,
    }

    await toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          // Pass imageFile only if a new image was uploaded
          const tx = await updateEvent(
            updatedEvent,
            keepExistingImage ? undefined : imageFile || undefined
          )

          // Navigate back to event details page
          setTimeout(() => {
            router.push(`/events/${eventData.id}`)
          }, 1000)

          resolve(tx)
        } catch (error) {
          reject(error)
        }
      }),
      {
        pending: 'Updating event...',
        success: 'Event updated successfully 👌',
        error: 'Failed to update event 🤯',
      }
    )
  }

  return (
    <div>
      <Head>
        <title>Event X | Update {eventData.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="lg:w-2/3 w-full mx-auto bg-white p-5 shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col text-black">
          <div className="flex flex-row justify-between items-center mb-5">
            <p className="font-semibold text-xl">Update Event</p>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="flex flex-col justify-center items-center rounded-xl mb-5">
              <div className="shrink-0 rounded-xl overflow-hidden h-48 w-full shadow-md">
                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="h-full w-full object-cover"
                />
              </div>
              {!keepExistingImage && imageFile && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="mt-2 text-sm text-red-500 hover:text-red-700"
                >
                  Remove new image (keep existing)
                </button>
              )}
            </div>
          )}

          {/* Title */}
          <div className="flex flex-row justify-between items-center bg-gray-200 rounded-xl mt-5 p-2">
            <input
              className="block w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
              type="text"
              name="title"
              placeholder="Title"
              value={event.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Capacity and Ticket Cost */}
          <div
            className="flex flex-col sm:flex-row justify-between items-center w-full
           space-x-0 sm:space-x-2 space-y-5 sm:space-y-0 mt-5"
          >
            <div className="w-full bg-gray-200 rounded-xl p-2">
              <input
                className="block w-full text-sm bg-transparent
                border-0 focus:outline-none focus:ring-0"
                type="number"
                step={1}
                min={eventData.seats}
                name="capacity"
                placeholder="Capacity"
                value={event.capacity}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Current: {eventData.capacity} | Sold: {eventData.seats}
              </p>
            </div>

            <div className="w-full bg-gray-200 rounded-xl p-2">
              <input
                className="block w-full text-sm bg-transparent
                border-0 focus:outline-none focus:ring-0"
                type="number"
                step="0.01"
                min="0.01"
                name="ticketCost"
                placeholder="Ticket cost (ETH)"
                value={event.ticketCost}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="flex flex-col bg-gray-200 rounded-xl mt-5 p-2">
            <label className="text-xs text-gray-600 mb-1">
              {keepExistingImage ? 'Upload new image (optional)' : 'New image selected'}
            </label>
            <input
              className="block w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Start and End Dates */}
          <div
            className="flex flex-col sm:flex-row justify-between items-center w-full
           space-x-0 sm:space-x-2 space-y-5 sm:space-y-0 mt-5"
          >
            <div className="w-full bg-gray-200 rounded-xl p-2">
              <input
                placeholder="Start Date"
                className="bg-transparent outline-none w-full placeholder-[#3D3857] text-sm border-none focus:outline-none focus:ring-0 py-0"
                name="startsAt"
                type="datetime-local"
                value={event.startsAt}
                onChange={handleChange}
                required
              />
            </div>

            <div className="w-full bg-gray-200 rounded-xl p-2">
              <input
                placeholder="End Date"
                className="bg-transparent outline-none w-full placeholder-[#3D3857] text-sm border-none focus:outline-none focus:ring-0 py-0"
                name="endsAt"
                type="datetime-local"
                value={event.endsAt}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-row justify-between items-center bg-gray-200 rounded-xl mt-5 p-2">
            <textarea
              className="block w-full text-sm resize-none
              bg-transparent border-0 focus:outline-none focus:ring-0 h-24"
              name="description"
              placeholder="Description"
              value={event.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="mt-5 flex space-x-3">
            <button
              type="submit"
              className="bg-orange-500 p-2 rounded-full py-3 px-10
              text-white hover:bg-transparent border hover:text-orange-500
              hover:border-orange-500 duration-300 transition-all"
            >
              Update Event
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-500 p-2 rounded-full py-3 px-10
              text-white hover:bg-transparent border hover:text-gray-500
              hover:border-gray-500 duration-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default UpdateEventPage

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query

  try {
    const eventData: EventStruct = await getEvent(Number(id))

    return {
      props: {
        eventData: JSON.parse(JSON.stringify(eventData)),
      },
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}
