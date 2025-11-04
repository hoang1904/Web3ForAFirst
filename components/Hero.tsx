import Link from 'next/link'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ConnectBtn from './ConnectBtn' // giữ file bạn đã có
// Nếu muốn dùng next/image, import Image from 'next/image'

const Hero: React.FC = () => {
  const [cid, setCid] = useState('bafybeigdyrzt...') // demo CID

  // demo upload fake (thay bằng ipfs/http-client hoặc nft.storage)
  const fakeUpload = () => {
    const next = 'bafybeia' + Math.random().toString(36).slice(2, 9)
    setCid(next)
    navigator.clipboard?.writeText(next)
  }

  return (
    <main className="relative pt-28 pb-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-black text-white rounded-2xl shadow-xl overflow-hidden grid lg:grid-cols-12">
          {/* Left: text & actions */}
          <section className="lg:col-span-7 p-10 md:p-14">
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
            >
              Mang sự kiện tới
              <br />
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                Chợ Web3 IUH
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.08 }}
              className="mt-4 text-gray-200 max-w-2xl"
            >
              Chào mừng bạn đến với thị trường sự kiện Web3 — lưu trữ tài liệu trên IPFS và
              xác thực bằng smart contract để đảm bảo tính toàn vẹn và minh bạch.
            </motion.p>

            <div className="mt-6 flex flex-wrap gap-3 items-center">
              <Link
                href="/events/create"
                className="bg-transparent border border-orange-500 hover:bg-orange-600
                        py-2 px-6 text-orange-500 hover:text-white rounded-full
                        transition duration-300 ease-in-out px-5 py-3 shadow hover:opacity-95 transition"
              >
                Thêm sự kiện mới
              </Link>

              <button
                className="inline-flex items-center justify-center rounded-full bg-orange-500 text-white px-5 py-3 shadow hover:opacity-95 transition"
                onClick={() => window.scrollTo({ top: 700, behavior: 'smooth' })}
              >
                Khám phá sự kiện
              </button>

              {/* Connect button (từ file ConnectBtn của bạn) */}
              {/* <div className="ml-2">
                <ConnectBtn networks />
              </div> */}
            </div>

            {/* small cards */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/6 rounded-lg p-4 border border-white/10">
                <div className="text-xs text-gray-300">Wallet</div>
                <div className="mt-2 font-medium">Kết nối để xem địa chỉ</div>
                <div className="mt-3">
                  <span className="inline-block text-sm bg-white/6 px-3 py-1 rounded-full"><ConnectBtn/></span>
                </div>
              </div>

              <div className="bg-white/6 rounded-lg p-4 border border-white/10">
                <div className="text-xs text-gray-300">Last IPFS CID</div>
                <div className="mt-2 font-mono text-sm truncate">{cid}</div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => navigator.clipboard?.writeText(cid)} className="text-sm px-3 py-1 rounded-full border border-white/10">
                    Copy
                  </button>
                  <button onClick={fakeUpload} className="text-sm px-3 py-1 rounded-full bg-orange-500">
                    Upload demo
                  </button>
                </div>
              </div>

              <div className="bg-white/6 rounded-lg p-4 border border-white/10">
                <div className="text-xs text-gray-300">On-chain Stats</div>
                <div className="mt-2 text-2xl font-bold">128</div>
                <div className="text-sm text-gray-300">Events created</div>
              </div>
            </div>

            {/* How it works strip */}
            <div className="mt-6 bg-white/6 p-3 rounded-md flex items-center justify-between text-sm">
              <div>
                <strong>How it works:</strong>
                <div className="text-gray-300">Upload → IPFS(CID) → Smart Contract stores reference</div>
              </div>
              <div>
                <button className="px-3 py-1 rounded-full border border-white/10">Learn more</button>
              </div>
            </div>
          </section>

          {/* Right: illustration + IPFS network viz */}
          <aside className="lg:col-span-5 p-6 bg-gradient-to-tr from-black/10 to-transparent">
            <motion.div
              initial={{ scale: 0.98, opacity: 0.9 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="bg-gradient-to-br from-white/6 to-transparent rounded-xl p-4"
              style={{ backdropFilter: 'blur(6px)' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-300">Network Snapshot</div>
                  <div className="text-lg font-semibold">IPFS • Blockchain</div>
                </div>
                <div className="text-xs text-green-300">Live</div>
              </div>

              <div className="mt-4 w-full h-48">
                <IPFSNetwork cid={cid} />
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
                <div>Nodes online</div>
                <div className="font-medium">12</div>
              </div>
            </motion.div>

            {/* mini chart panel */}
            <div className="mt-6 bg-black rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-orange-300">Marketplace</div>
                  <div className="text-xl font-bold">Active Tickets</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">3.2k</div>
                  <div className="text-xs text-gray-400">this month</div>
                </div>
              </div>

              <div className="mt-3 h-28 flex items-end gap-2">
                {[60, 80, 40, 100, 70, 50].map((h, i) => (
                  <div key={i} className="flex-1">
                    <div style={{ height: `${h}%` }} className="w-full rounded-t-lg bg-orange-400/40"></div>
                    <div className="text-xs text-gray-400 text-center mt-1">{['Mon','Tue','Wed','Thu','Fri','Sat'][i]}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default Hero

/* ---------- helper component: IPFSNetwork ---------- */
function IPFSNetwork({ cid }: { cid: string }) {
  // Simple SVG network visualization (static + subtle animation)
  return (
    <svg viewBox="0 0 400 220" className="w-full h-full">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* connecting lines */}
      <g stroke="#94a3b8" strokeWidth="1" opacity="0.6">
        <line x1="50" y1="40" x2="200" y2="60" />
        <line x1="50" y1="160" x2="200" y2="140" />
        <line x1="350" y1="110" x2="200" y2="60" />
        <line x1="350" y1="110" x2="200" y2="140" />
      </g>

      {/* nodes */}
      {[
        { x: 50, y: 40 },
        { x: 50, y: 160 },
        { x: 200, y: 60 },
        { x: 200, y: 140 },
        { x: 350, y: 110 }
      ].map((n, idx) => (
        <g key={idx} transform={`translate(${n.x}, ${n.y})`}>
          <circle
            cx={0}
            cy={0}
            r={idx === 2 ? 14 : 8}
            style={{
              fill: idx === 2 ? '#fb923c' : '#0f172a',
              stroke: idx === 2 ? '#f97316' : '#94a3b8',
              strokeWidth: idx === 2 ? 3 : 1,
              filter: idx === 2 ? 'url(#glow)' : undefined,
              transformOrigin: 'center'
            }}
          />
          <text x={20} y={6} fontSize={10} fill="#cbd5e1">
            {idx === 2 ? `CID ${cid.slice(0, 8)}` : `node-${idx + 1}`}
          </text>
        </g>
      ))}
    </svg>
  )
}
