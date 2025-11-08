import { ethers } from 'ethers'
import address from '@/contracts/contractAddress.json'
import abi from '@/artifacts/contracts/DappEventX.sol/DappEventX.json'
import { EventParams, EventStruct, TicketStruct } from '@/utils/type.dt'
import { globalActions } from '@/store/globalSlices'
import { store } from '@/store'

const toWei = (num: number) => ethers.parseEther(num.toString())
const fromWei = (num: number) => ethers.formatEther(num)

// IPFS Configuration
// const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY
// const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3YzJlM2ViYS0wZTA1LTRjMmMtOTVjMy1hOTNiMDEyNWRhMjYiLCJlbWFpbCI6ImtpZXRuZ3V5ZW41NjQwNDJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjAwZGEwNGNiZGE0OGFiN2UwY2Q5Iiwic2NvcGVkS2V5U2VjcmV0IjoiM2M0Y2QyN2Y0YzYxNzkwZGMzODBmNDk1NjRiY2IwN2NlZDBlZmRlZWIxY2VjZmIwZjQwZTdlMTllNWZiOTMyZCIsImV4cCI6MTc5MzEwOTgwNX0.IeJA0qLtscRYJozwRURzXSVuo--DcD_sJdnIBhBh-yc"
const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://pink-cautious-felidae-745.mypinata.cloud/' //do not push this
// console.log("PINATA_JWT", PINATA_JWT);
// console.log("IPFS_GATEWAY", IPFS_GATEWAY);
// console.log("IPFS_GATEWAY", process.env.IPFS_GATEWAY);

let ethereum: any
let tx: any

if (typeof window !== 'undefined') ethereum = (window as any).ethereum
const { setEvent, setTickets } = globalActions

const getEthereumContracts = async () => {
  const accounts = await ethereum?.request?.({ method: 'eth_accounts' })

  if (accounts?.length > 0) {
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    const contracts = new ethers.Contract(address.dappEventXContract, abi.abi, signer)

    return contracts
  } else {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    const wallet = ethers.Wallet.createRandom()
    const signer = wallet.connect(provider)
    const contracts = new ethers.Contract(address.dappEventXContract, abi.abi, signer)

    return contracts
  }
}

// IPFS Functions
const uploadToIPFS = async (metadata: {
  title: string
  description: string
  imageUrl: string
}): Promise<string> => {
  try {
    const data = JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: {
        name: `${metadata.title}-metadata.json`,
      },
    })

    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: data,
    })

    if (!response.ok) {
      throw new Error('Failed to upload to IPFS')
    }

    const result = await response.json()
    return `ipfs://${result.IpfsHash}`
  } catch (error) {
    console.error('Error uploading to IPFS:', error)
    throw error
  }
}

const uploadImageToIPFS = async (file: File): Promise<string> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const metadata = JSON.stringify({
      name: file.name,
    })
    formData.append('pinataMetadata', metadata)

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload image to IPFS')
    }

    const result = await response.json()
    return `ipfs://${result.IpfsHash}`
  } catch (error) {
    console.error('Error uploading image to IPFS:', error)
    throw error
  }
}

const fetchFromIPFS = async (ipfsHash: string): Promise<any> => {
  try {
    // Remove 'ipfs://' prefix if present
    const hash = ipfsHash.replace('ipfs://', '')
    const url = `${IPFS_GATEWAY}ipfs/${hash}`

    const response = await fetch(url)
    console.log({response});
    
    if (!response.ok) {
      throw new Error('Failed to fetch from IPFS')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching from IPFS:', error)
    // Return default metadata if fetch fails
    return {
      title: 'Untitled Event',
      description: 'No description available',
      imageUrl: '',
    }
  }
}

const createEvent = async (event: EventParams, imageFile?: File): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    // Upload image to IPFS if provided
    let imageUrl = event.imageUrl
    if (imageFile) {
      imageUrl = await uploadImageToIPFS(imageFile)
    }

    // Upload metadata to IPFS
    const metadataURI = await uploadToIPFS({
      title: event.title,
      description: event.description,
      imageUrl: imageUrl,
    })

    // Create event on blockchain with IPFS hash
    const contract = await getEthereumContracts()
    const ticketCostInWei = toWei(Number(event.ticketCost))
    console.log('Ticket cost in Wei:', ticketCostInWei.toString())
    tx = await contract.createEvent(
      metadataURI,
      event.capacity,
      ticketCostInWei,
      event.startsAt,
      event.endsAt
    )
    console.log('txHash:', tx.hash)
    const receipt = await tx.wait()
    console.log('status:', receipt.status, 'block:', receipt.blockNumber)

    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const updateEvent = async (event: EventParams, imageFile?: File): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    // Upload image to IPFS if provided
    let imageUrl = event.imageUrl
    if (imageFile) {
      imageUrl = await uploadImageToIPFS(imageFile)
    }

    // Upload updated metadata to IPFS
    const metadataURI = await uploadToIPFS({
      title: event.title,
      description: event.description,
      imageUrl: imageUrl,
    })

    // Update event on blockchain with new IPFS hash
    const contract = await getEthereumContracts()
    tx = await contract.updateEvent(
      event.id,
      metadataURI,
      event.capacity,
      toWei(Number(event.ticketCost)),
      event.startsAt,
      event.endsAt
    )
    await tx.wait()

    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const deleteEvent = async (eventId: number): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.deleteEvent(eventId)
    await tx.wait()

    // After successful on-chain deletion, remove tickets from our MongoDB
    try {
      // call our internal API to delete tickets for this event
      await fetch(`/api/events/${eventId}/delete-tickets`, { method: 'POST' })
    } catch (err) {
      console.error('Failed to delete tickets from DB after on-chain delete:', err)
    }

    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const payout = async (eventId: number): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.payout(eventId)
    await tx.wait()

    const eventData: EventStruct = await getEvent(eventId)
    store.dispatch(setEvent(eventData))

    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const buyTicket = async (event: EventStruct, tickets: number,address: `0x${string}` | undefined): Promise<void> => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()

    const ticketCostInWei = toWei(event.ticketCost)
    const totalCostInWei = ticketCostInWei * BigInt(tickets)

    const tx = await contract.buyTickets(event.id, tickets, { value: totalCostInWei })
    const receipt = await tx.wait()
    // Parse event logs'
console.log("🚧 RAW RECEIPT", receipt);
console.log("🚧 RECEIPT LOGS", receipt.logs);
const parsedLogs = receipt.logs
  .map((log: any) => {
    try {
      return contract.interface.parseLog(log);
    } catch {
      return null;
    }
  })
  .filter((log: any) => log && log.name === "TicketsBought");

if (parsedLogs.length > 0) {
  const ticketsEvent = parsedLogs[0];
  const ticketIds = ticketsEvent.args.ticketIds.map((id: bigint) => id.toString());

  console.log("🎫 Ticket IDs:", ticketIds);

  await Promise.all(
    ticketIds.map(async (ticketId: string) => {
      await createDbTicket(Number(ticketId), event.id, Number(event.ticketCost), address);
    })
  );
} else {
  console.warn("⚠️ No TicketsBought event found.");
}


    return Promise.resolve()
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

    async function createDbTicket(ticketId: number,eventId: number,eventCost: number,address: `0x${string}` | undefined) {
       try {
                const res = await fetch("/api/tickets/create", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    ticketId,
                    eventId: eventId,
                    ticketCost: eventCost,
                    owner: address,
                  })
                })
                if (!res.ok) {
                  const error = await res.json()
                  throw new Error(error.message || 'Failed to create ticket QR code')
                }
                const data = await res.json()
                console.log('Ticket created:', data)
              } catch (err) {
                console.error('Error creating ticket:', err)
              }
    }

const getEvents = async (): Promise<EventStruct[]> => {
  const contract = await getEthereumContracts()
  const events = await contract.getEvents()
  return structuredEvent(events)
}

const getMyEvents = async (): Promise<EventStruct[]> => {
  const contract = await getEthereumContracts()
  const events = await contract.getMyEvents()
  return structuredEvent(events)
}

const getEvent = async (eventId: number): Promise<EventStruct> => {
  const contract = await getEthereumContracts()
  const event = await contract.getSingleEvent(eventId)
  return (await structuredEvent([event]))[0]
}

const getTickets = async (eventId: number): Promise<TicketStruct[]> => {
  const contract = await getEthereumContracts()
  const tickets = await contract.getTickets(eventId)
  return structuredTicket(tickets)
}
const getMyTicket = async (eventId: number): Promise<TicketStruct[]> => {
  const contract = await getEthereumContracts()
  const tickets = await contract.getMyTicket(eventId)
  return structuredTicket(tickets)
}

const structuredEvent = async (events: EventStruct[]): Promise<EventStruct[]> => {
  // Fetch metadata from IPFS for all events
  const eventsWithMetadata = await Promise.all(
    events.map(async (event) => {
      let metadata = {
        title: 'Untitled Event',
        description: 'No description available',
        imageUrl: '',
      }
      console.log({event});
      
      // Fetch metadata from IPFS if metadataURI exists
      if (event.metadataURI) {
        try {
          metadata = await fetchFromIPFS(event.metadataURI)
        } catch (error) {
          console.error(`Error fetching metadata for event ${event.id}:`, error)
        }
      }
      console.log({metadata});
      let imageUrl = metadata.imageUrl.replace('ipfs://', '');
      return {
        id: Number(event.id),
        title: metadata.title,
        imageUrl: `${IPFS_GATEWAY}ipfs/${imageUrl}`,
        description: metadata.description,
        metadataURI: event.metadataURI,
        owner: event.owner,
        sales: Number(event.sales),
        ticketCost: parseFloat(fromWei(event.ticketCost)),
        capacity: Number(event.capacity),
        seats: Number(event.seats),
        startsAt: Number(event.startsAt),
        endsAt: Number(event.endsAt),
        timestamp: Number(event.timestamp),
        deleted: event.deleted,
        paidOut: event.paidOut,
        refunded: event.refunded,
        minted: event.minted,
      }
    })
  )

  return eventsWithMetadata.sort((a, b) => b.timestamp - a.timestamp)
}

const structuredTicket = (tickets: TicketStruct[]): TicketStruct[] =>
  tickets
    .map((ticket) => ({
      id: Number(ticket.id),
      eventId: Number(ticket.eventId),
      owner: ticket.owner,
      ticketCost: parseFloat(fromWei(ticket.ticketCost)),
      timestamp: Number(ticket.timestamp),
      refunded: ticket.refunded,
      minted: ticket.minted,
      checkedIn: ticket.checkedIn,
      checkedInAt: Number(ticket.checkedInAt),
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

export {
  getEvents,
  getMyEvents,
  getEvent,
  getTickets,
  createEvent,
  updateEvent,
  deleteEvent,
  buyTicket,
  payout,
  uploadImageToIPFS,
  uploadToIPFS,
  fetchFromIPFS,
}
