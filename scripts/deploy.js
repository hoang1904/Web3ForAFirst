const { ethers } = require('hardhat')
const fs = require('fs')

async function deployContract() {
  let contract
  const servicePct = 5

  try {
    console.log('Deploying DappEventX with servicePct=', servicePct)
    contract = await ethers.deployContract('DappEventX', [servicePct])

    // ethers v6: contract.deploymentTransaction or contract.target
    if (contract.deploymentTransaction) {
      console.log('Deployment transaction hash:', contract.deploymentTransaction.hash)
    }

    // Wait for deployment to be mined
    await contract.waitForDeployment()

    console.log('Contracts deployed successfully at', contract.target || contract.address)
    return contract
  } catch (error) {
    console.error('Error deploying contracts:')
    // Print full error for debugging
    try {
      console.dir(error, { depth: null })
    } catch (e) {
      console.error(error)
    }

    // If the error contains a transaction hash, fetch the receipt
    try {
      const provider = ethers.provider
      const txHash = error?.transactionHash || error?.transaction?.hash || (error?.receipt && error.receipt.transactionHash)
      if (txHash && provider) {
        console.log('Fetching receipt for tx:', txHash)
        const receipt = await provider.getTransactionReceipt(txHash)
        console.log('Receipt:', receipt)
      }
    } catch (e) {
      console.error('Failed to fetch transaction receipt:', e)
    }

    throw error
  }
}

async function saveContractAddress(contract) {
  try {
    const address = JSON.stringify(
      {
        dappEventXContract: contract.target,
      },
      null,
      4
    )

    fs.writeFile('./contracts/contractAddress.json', address, 'utf8', (error) => {
      if (error) {
        console.error('Error saving contract address:', err)
      } else {
        console.log('Deployed contract address:', address)
      }
    })
  } catch (error) {
    console.error('Error saving contract address:', error)
    throw error
  }
}

async function main() {
  let contract

  try {
    contract = await deployContract()
    await saveContractAddress(contract)

    console.log('Contract deployment completed successfully.')
  } catch (error) {
    console.error('Unhandled error:', error)
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error)
  process.exitCode = 1
})
