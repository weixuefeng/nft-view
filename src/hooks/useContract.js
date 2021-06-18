import { useActiveWeb3React } from './inject'
import { useMemo } from 'react'
import { getContract } from 'helpers/contractHelper'
import ERC721_ABI from 'constant/eip721.json'

function useContract(address, ABI, withSignerIfPossible = true) {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useERC721Contract(tokenAddress, withSignerIfPossible) {
  return useContract(tokenAddress, ERC721_ABI, withSignerIfPossible)
}
