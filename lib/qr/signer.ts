import { Wallet, verifyMessage } from 'ethers'
import * as fs from 'fs'
import path from 'path'

const PRIVATE_KEY_PATH = path.join(process.cwd(), 'lib', 'qr', 'signer.key')

function getOrCreatePrivateKey() {
  if (process.env.SIGNER_KEY) return process.env.SIGNER_KEY.trim()

  try {
    if (fs.existsSync(PRIVATE_KEY_PATH)) {
      return fs.readFileSync(PRIVATE_KEY_PATH, 'utf8').trim()
    }
  } catch {}

  const wallet = Wallet.createRandom()
  try {
    fs.writeFileSync(PRIVATE_KEY_PATH, wallet.privateKey)
  } catch {}
  return wallet.privateKey
}

export const signer = new Wallet(getOrCreatePrivateKey())

export function getSignerAddress() {
  return signer.address
}

export async function signPayload(payload: any) {
  const message = JSON.stringify(payload)
  return await signer.signMessage(message)
}

export function verifySignature(payload: any, sig: string, expectedSigner: string) {
  const message = JSON.stringify(payload)
  const recovered = verifyMessage(message, sig)
  return recovered.toLowerCase() === expectedSigner.toLowerCase()
}
