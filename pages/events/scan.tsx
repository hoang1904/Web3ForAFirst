import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'

// html5-qrcode uses window, so dynamic import inside useEffect
const ScanPage = () => {
  const elRef = useRef<HTMLDivElement | null>(null)
  const [status, setStatus] = useState<string>('idle')
  const [last, setLast] = useState<any>(null)
  const scannerRef = useRef<any>(null)
  // success handler shared by webcam and file-scan paths
  function qrCodeSuccessCallback(decodedText: string, decodedResult: any) {
    setStatus('scanned')
    try {
      const json = JSON.parse(decodeURIComponent(escape(atob(decodedText))))
      // expect { payload, sig }
      verifyWithServer(json.payload, json.sig)
    } catch (err) {
      // try decode as JSON directly
      try {
        const parsed = JSON.parse(decodedText)
        verifyWithServer(parsed.payload, parsed.sig)
      } catch (e) {
        console.error('Invalid QR format', e)
        setStatus('invalid_format')
      }
    }
  }

  async function verifyWithServer(payload: any, sig: string) {
    setStatus('verifying')
    try {
      const res = await fetch('/api/checkin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload, sig }),
      })
      const data = await res.json()
      setLast(data)
      setStatus(data.status || 'unknown')
    } catch (err) {
      console.error('verify error', err)
      setStatus('verify_error')
    }
  }

  useEffect(() => {
    let mounted = true
    async function init() {
      const { Html5Qrcode } = await import('html5-qrcode')
      if (!mounted) return
      if (!elRef.current) return
      const html5QrCode = new Html5Qrcode('reader')
      scannerRef.current = html5QrCode
      const config = { fps: 10, qrbox: 250 }

      try {
        await html5QrCode.start({ facingMode: 'environment' }, config, qrCodeSuccessCallback, (_err: any) => {
          console.warn('qr error', _err)
        })
      } catch (err) {
        console.error('Camera error', err)
        setStatus('camera_error')
      }
    }

    function stopScanner() {
      const s = scannerRef.current
      if (s) {
        s.stop().catch(() => {})
        scannerRef.current = null
      }
    }

    init()
    return () => {
      mounted = false
      stopScanner()
    }
  }, [])

  return (
    <div>
      <Head>
        <title>Event X | Scanner</title>
      </Head>

      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4">Ticket Scanner</h2>
        <div id="reader" ref={elRef} style={{ width: 320, height: 320 }} />
        <div className="mt-4">
          <label className="block mb-2 font-medium">Scan from image</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files && e.target.files[0]
              if (!file) return
              setStatus('scanning_file')
              try {
                // reuse html5-qrcode (already used for webcam) to scan an uploaded file
                const { Html5Qrcode } = await import('html5-qrcode')
                // Html5Qrcode provides a static helper to scan files (API differs by version)
                // try scanFileV2 then fallback to scanFile
                let scanned: string | null = null
                if (typeof (Html5Qrcode as any).scanFileV2 === 'function') {
                  scanned = await (Html5Qrcode as any).scanFileV2(file, true)
                } else if (typeof (Html5Qrcode as any).scanFile === 'function') {
                  scanned = await (Html5Qrcode as any).scanFile(file, true)
                } else {
                  throw new Error('html5-qrcode scanFile API not found')
                }

                if (scanned) {
                  qrCodeSuccessCallback(scanned, null)
                } else {
                  setStatus('no_qr_found')
                }
              } catch (err) {
                console.error('scan file error', err)
                setStatus('scan_file_error')
              }
            }}
          />
        </div>
        <div className="mt-4">
          <p>Status: {status}</p>
          <pre className="mt-2 bg-gray-100 p-3 rounded">{JSON.stringify(last, null, 2)}</pre>
        </div>
      </main>
    </div>
  )
}

export default ScanPage
