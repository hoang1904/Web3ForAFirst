import { Wallet, keccak256, toUtf8Bytes, getBytes, recoverAddress } from 'ethers'
import * as fs from 'fs'
import path from 'path'

// For demo: use a local private key (in production, use env or KMS)
const PRIVATE_KEY_PATH = path.join(process.cwd(), 'lib', 'qr', 'signer.key')

function getOrCreatePrivateKey() {
  try {
    if (fs.existsSync(PRIVATE_KEY_PATH)) {
      return fs.readFileSync(PRIVATE_KEY_PATH, 'utf8').trim()
    }
  } catch (e) {
    // ignore, maybe running in an environment without fs access
  }

  const wallet = Wallet.createRandom()
  try {
    fs.writeFileSync(PRIVATE_KEY_PATH, wallet.privateKey)
  } catch (e) {
    // ignore write errors in restricted envs
  }
  return wallet.privateKey
}

export const signer = new Wallet(getOrCreatePrivateKey())

export function getSignerAddress() {
  return signer.address
}

export async function signPayload(payload: any) {
  const hash = keccak256(toUtf8Bytes(JSON.stringify(payload)))
  // sign the digest (as bytes) to avoid EIP-191 prefix added by signMessage
  const sig = await signer.signMessage(getBytes(hash))
  return sig
}

export function verifySignature(payload: any, sig: string, expectedSigner: string) {
  const hash = keccak256(toUtf8Bytes(JSON.stringify(payload)))
  const recovered = recoverAddress(getBytes(hash), sig)
  return recovered.toLowerCase() === expectedSigner.toLowerCase()
}
