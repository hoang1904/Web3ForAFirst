import { createEvent } from '@/services/blockchain'
import { EventParams } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'

const Page: NextPage = () => {
  const { address } = useAccount()
  const [event, setEvent] = useState<EventParams>({
    title: '',
    imageUrl: '',
    description: '',
    ticketCost: '',
    capacity: '',
    startsAt: '',
    endsAt: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

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

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      setImageFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!address) return toast.warn('Connect wallet first')

    if (!imageFile) {
      return toast.warn('Please upload an event image')
    }

    event.startsAt = new Date(event.startsAt).getTime()
    event.endsAt = new Date(event.endsAt).getTime()

    await toast.promise(
      new Promise(async (resolve, reject) => {
        createEvent(event, imageFile)
          .then((tx) => {
            console.log(tx)
            resetForm()
            resolve(tx)
          })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Event creation successful 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const resetForm = () => {
    setEvent({
      title: '',
      imageUrl: '',
      description: '',
      ticketCost: '',
      capacity: '',
      startsAt: '',
      endsAt: '',
    })
    setImageFile(null)
    setImagePreview('')
  }

  return (
    <div>
      <Head>
        <title>Event X | Create</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="lg:w-2/3 w-full mx-auto bg-white p-5 shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col text-black">
          <div className="flex flex-row justify-between items-center mb-5">
            <p className="font-semibold">Create Event</p>
          </div>

          {imagePreview && (
            <div className="flex flex-row justify-center items-center rounded-xl mb-5">
              <div className="shrink-0 rounded-xl overflow-hidden h-40 w-40 shadow-md">
                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

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

          <div
            className="flex flex-col sm:flex-row justify-between items-center w-full
           space-x-0 sm:space-x-2 space-y-5 sm:space-y-0 mt-5"
          >
            <div className="w-full bg-gray-200 rounded-xl p-2">
              <div
                className="block w-full text-sm bg-transparent
              border-0 focus:outline-none focus:ring-0"
              >
                <input
                  className="block w-full text-sm bg-transparent
                  border-0 focus:outline-none focus:ring-0"
                  type="number"
                  step={1}
                  min={1}
                  name="capacity"
                  placeholder="Capacity"
                  value={event.capacity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-xl p-2">
              <div
                className="block w-full text-sm bg-transparent
              border-0 focus:outline-none focus:ring-0"
              >
                <input
                  className="block w-full text-sm bg-transparent
                  border-0 focus:outline-none focus:ring-0"
                  type="number"
                  step="0.001"
                  min="0.001"
                  name="ticketCost"
                  placeholder="Ticket cost (ETH)"
                  value={event.ticketCost}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-200 rounded-xl mt-5 p-2">
            <input
              className="block w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          <div
            className="flex flex-col sm:flex-row justify-between items-center w-full
           space-x-0 sm:space-x-2 space-y-5 sm:space-y-0 mt-5"
          >
            <div className="w-full bg-gray-200 rounded-xl p-2">
              <div
                className="block w-full text-sm bg-transparent
              border-0 focus:outline-none focus:ring-0"
              >
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
            </div>

            <div className="w-full bg-gray-200 rounded-xl p-2">
              <div
                className="block w-full text-sm bg-transparent
              border-0 focus:outline-none focus:ring-0"
              >
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
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-200 rounded-xl mt-5 p-2">
            <textarea
              className="block w-full text-sm resize-none
              bg-transparent border-0 focus:outline-none focus:ring-0 h-20"
              name="description"
              placeholder="Description"
              value={event.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="mt-5">
            <button
              type="submit"
              className="bg-orange-500 p-2 rounded-full py-3 px-10
            text-white hover:bg-transparent border hover:text-orange-500
            hover:border-orange-500 duration-300 transition-all"
            >
              Submit
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Page
