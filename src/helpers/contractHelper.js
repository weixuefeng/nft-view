import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'

export function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return new Contract(address, ABI, getProviderOrSigner(library, account))
}

export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library
}

// account is not optional
export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked()
}
