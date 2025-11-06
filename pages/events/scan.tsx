import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import QRScanner from '@/components/QRScanner'

// html5-qrcode uses window, so dynamic import inside useEffect
// const ScanPage = () => {
//   const elRef = useRef<HTMLDivElement | null>(null)
//   const [status, setStatus] = useState<string>('idle')
//   const [last, setLast] = useState<any>(null)
//   const scannerRef = useRef<any>(null)

//   const [ticketId, setTicketId] = useState<string>('')
//   const [sig, setSig] = useState<string>('')

//   async function getTicket(){
//     try {
//         const res = await fetch(`/api/tickets/${ticketId}/qr`)
//           const data = await res.json()
//           console.log({data});
//         handleCheckin(data)
//     } catch (error) {
//       console.log(error);
      
//     }
//   }
//   async function handleCheckin(payload: any) {


//     setStatus('verifying')
//     try {
//       const res = await fetch('/api/checkin/verify', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       })
//       const data = await res.json()
//       setLast(data)
//       setStatus(data.status || 'unknown')
//     } catch (err) { 
//       console.error('verify error', err)
//       setStatus('verify_error')
//     }
//   }

//   // success handler shared by webcam and file-scan paths
//   function qrCodeSuccessCallback(decodedText: string, decodedResult: any) {
//     setStatus('scanned')
//     try {
//       const json = JSON.parse(decodeURIComponent(escape(atob(decodedText))))
//       // expect { payload, sig }
//       verifyWithServer(json.payload, json.sig)
//     } catch (err) {
//       // try decode as JSON directly
//       try {
//         const parsed = JSON.parse(decodedText)
//         verifyWithServer(parsed.payload, parsed.sig)
//       } catch (e) {
//         console.error('Invalid QR format', e)
//         setStatus('invalid_format')
//       }
//     }
//   }

//   async function verifyWithServer(payload: any, sig: string) {
//     setStatus('verifying')
//     try {
//       const res = await fetch('/api/checkin/verify', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ payload, sig }),
//       })
//       const data = await res.json()
//       setLast(data)
//       setStatus(data.status || 'unknown')
//     } catch (err) {
//       console.error('verify error', err)
//       setStatus('verify_error')
//     }
//   }

//   useEffect(() => {
//     // let mounted = true
//     // async function init() {
//     //   const { Html5Qrcode } = await import('html5-qrcode')
//     //   if (!mounted) return
//     //   if (!elRef.current) return
//     //   const html5QrCode = new Html5Qrcode('reader')
//     //   scannerRef.current = html5QrCode
//     //   const config = { fps: 10, qrbox: 250 }
//     //   try {
//     //     await html5QrCode.start({ facingMode: 'environment' }, config, qrCodeSuccessCallback, (_err: any) => {
//     //       console.warn('qr error', _err)
//     //     })
//     //   } catch (err) {
//     //     console.error('Camera error', err)
//     //     setStatus('camera_error')
//     //   }
//     // }
//     // function stopScanner() {
//     //   const s = scannerRef.current
//     //   if (s) {
//     //     s.stop().catch(() => {})
//     //     scannerRef.current = null
//     //   }
//     // }
//     // init()
//     // return () => {
//     //   mounted = false
//     //   stopScanner()
//     // }
//   }, [])

//   return (
//     <div>
//       <Head>
//         <title>Event X | Scanner</title>
//       </Head>

//       <main className="p-6">
//         <h2 className="text-xl font-semibold mb-4">Ticket Scanner</h2>
//         <div id="reader" ref={elRef} style={{ width: 320, height: 320 }} />
//         <div className="mt-4">
//           <label className="block mb-2 font-medium">Scan from image</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={async (e) => {
//               // const file = e.target.files && e.target.files[0]
//               // if (!file) return
//               // setStatus('scanning_file')
//               // try {
//               //   // reuse html5-qrcode (already used for webcam) to scan an uploaded file
//               //   const { Html5Qrcode } = await import('html5-qrcode')
//               //   // Html5Qrcode provides a static helper to scan files (API differs by version)
//               //   // try scanFileV2 then fallback to scanFile
//               //   let scanned: string | null = null
//               //   if (typeof (Html5Qrcode as any).scanFileV2 === 'function') {
//               //     scanned = await (Html5Qrcode as any).scanFileV2(file, true)
//               //   } else if (typeof (Html5Qrcode as any).scanFile === 'function') {
//               //     scanned = await (Html5Qrcode as any).scanFile(file, true)
//               //   } else {
//               //     throw new Error('html5-qrcode scanFile API not found')
//               //   }
//               //   if (scanned) {
//               //     qrCodeSuccessCallback(scanned, null)
//               //   } else {
//               //     setStatus('no_qr_found')
//               //   }
//               // } catch (err) {
//               //   console.error('scan file error', err)
//               //   setStatus('scan_file_error')
//               // }
//             }}
//           />
//         </div>
//         <div className="mt-4">
//           <p>Status: {status}</p>
//           <pre className="mt-2 bg-gray-100 p-3 rounded">{JSON.stringify(last, null, 2)}</pre>
//         </div>
//       </main>
//       <main className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow">
//         <h2 className="text-xl font-semibold mb-4">Manual Ticket Check-In</h2>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Ticket ID</label>
//             <input
//               type="text"
//               value={ticketId}
//               onChange={(e) => setTicketId(e.target.value)}
//               className="w-full rounded-lg border p-2"
//               placeholder="Enter ticket id"
//             />
//           </div>

//           {/* <div>
//             <label className="block text-sm font-medium mb-1">Signature</label>
//             <textarea
//               value={sig}
//               onChange={(e) => setSig(e.target.value)}
//               className="w-full rounded-lg border p-2"
//               placeholder="Paste signature here"
//               rows={3}
//             />
//           </div> */}

//           <button
//             onClick={getTicket}
//             className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Check-In
//           </button>

//           <div className="mt-4 text-sm">
//             <p>
//               Status:{' '}
//               <span
//                 className={`font-medium ${
//                   status === 'success'
//                     ? 'text-green-600'
//                     : status === 'error' || status === 'verify_error'
//                     ? 'text-red-600'
//                     : ''
//                 }`}
//               >
//                 {status}
//               </span>
//             </p>
//             <pre className="mt-2 bg-gray-100 p-3 rounded text-xs overflow-x-auto">
//               {JSON.stringify(last, null, 2)}
//             </pre>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

// export default ScanPage

const VerifyPage = () => {
  const [status, setStatus] = useState('idle')
  const [last, setLast] = useState<any>(null)
const [scanned, setScanned] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleScan = async (data: string) => {
    if (!data || loading) return
    setLoading(true)
    setScanned(data)
    console.log("scaned",data);
    

  }
  // helper to decode Base64 text from the QR
  const decodeBase64Json = (b64: string) => {
    try {
      const jsonStr = decodeURIComponent(escape(atob(b64)))
      return JSON.parse(jsonStr)
    } catch (err) {
      console.error('Base64 decode error', err)
      throw new Error('Invalid QR content')
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  setStatus('scanning')

  try {
    // Ensure client-side
    if (typeof window === 'undefined') {
      throw new Error('Client-side only')
    }

    const { Html5Qrcode } = await import('html5-qrcode')

    let scanned: string | null = null

    // --- Try scanFileV2 (latest versions) ---
    if (typeof (Html5Qrcode as any).scanFileV2 === 'function') {
      scanned = await (Html5Qrcode as any).scanFileV2(file, true)
    }

    // --- Fallback to older scanFile ---
    else if (typeof (Html5Qrcode as any).scanFile === 'function') {
      scanned = await (Html5Qrcode as any).scanFile(file, true)
    }

    // --- Manual fallback for all other cases ---
    else {
      const html5Qr = new Html5Qrcode('qr-temp')
      scanned = await html5Qr.scanFile(file, true)
      console.log({scanned});
      
      html5Qr.clear()
    }

    if (!scanned) {
      setStatus('no_qr_found')
      return
    }

    const decoded = decodeBase64Json(scanned)
    console.log({decoded});
    if (!decoded.payload || !decoded.sig) {
      setStatus('invalid_format')
      return
    }

    setStatus('verifying')
    const res = await fetch('/api/checkin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payload: decoded.payload,
        sig: decoded.sig,
      }),
    })

    const data = await res.json()
    setLast(data)
    setStatus(data.status || 'unknown')
  } catch (err) {
    console.error('verify error', err)
    setStatus('error')
  }
}


  return (
    <div className="p-6">
      <Head>
        <title>Event X | Verify Ticket</title>
      </Head>

      <h2 className="text-xl font-semibold mb-4">Verify Ticket QR</h2>

      <div className="border p-4 rounded-md bg-gray-50">
        <label className="block font-medium mb-2">Upload QR Code Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="block mb-4"
        />
        <p className="text-sm text-gray-600">
          Select a downloaded or printed QR code image to verify.
        </p>
      </div>
      <div id="qr-temp" style={{ display: 'none' }}></div>

  {!scanned ? (
        <>
          <h1 className="text-xl font-semibold mb-4">Scan your ticket QR</h1>
          <QRScanner />
        </>
      ) : (
        <div className="text-center">
          <p className="text-lg font-medium text-green-600">Scanned: {scanned}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => setScanned(null)}
          >
            Scan Again
          </button>
        </div>
      )}
      <div className="mt-6">
        <p className="font-medium">Status: {status}</p>
        <pre className="mt-2 bg-gray-100 p-3 rounded text-sm">
          {JSON.stringify(last, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default VerifyPage
