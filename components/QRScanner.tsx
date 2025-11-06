'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'

import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { de } from '@faker-js/faker';

export default function ScanPage() {
  const [data, setData] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

const handleScan = (detectedCodes:IDetectedBarcode[]) => {
    console.log('Detected codes:', detectedCodes);
    // detectedCodes is an array of IDetectedBarcode objects
    detectedCodes.forEach(code => {
      console.log(`Format: ${code.format}, Value: ${code.rawValue}`);
    });
    setData(detectedCodes.length > 0 ? detectedCodes[0].rawValue : null);
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 bg-gray-50">
      <h1 className="text-xl font-semibold mb-4">📷 QR Code Scanner</h1>

      <div className="w-[320px] h-[320px] rounded-xl overflow-hidden shadow-lg">
       <Scanner
      onScan={handleScan}
      onError={error=>{
        console.log(error);
        
        setError(JSON.stringify(error));
      }}
    />
      </div>

      <div className="mt-6 text-center">
        {data ? (
          <p className="text-green-600 font-semibold break-all">
            ✅ Scanned: {data}
          </p>
        ) : (
          <p className="text-gray-500">Scan a QR code to begin</p>
        )}

        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
            <p className="font-semibold">Error:</p>
            </div>)}
      </div>
    </div>
  )
}
