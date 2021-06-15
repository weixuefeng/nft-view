import { hexAddress2NewAddress } from 'helpers/newchain-util'

export function AddressFormat(address = '', size = '', convert = 'convert') {
  let displayAddress = address
  if (displayAddress === '0x0000000000000000000000000000000000000000') {
    return '0x0'
  }

  if (convert !== 'convert') {
    if (size === 'short') {
      displayAddress = displayAddress.substr(0, 6) + '···' + displayAddress.substr(-4)
    }
    return displayAddress
  }

  const CHAIN_ID = process.env.REACT_APP_NETWORK_CHAINID

  if (CHAIN_ID === '1002' || CHAIN_ID === '1007' || CHAIN_ID === '1012') {
    displayAddress = hexAddress2NewAddress(displayAddress, CHAIN_ID)
    if (size === 'short') {
      displayAddress = displayAddress.substr(0, 6) + '···' + displayAddress.substr(-4)
    }
    return displayAddress
  } else {
    if (size === 'short') {
      displayAddress = displayAddress.substr(0, 6) + '···' + displayAddress.substr(-4)
    }
    return displayAddress
  }
}

export function TokenIdFormat(id = '') {
  let displayId = id
  if (displayId.length > 8) {
    return '···' + displayId.substr(-8)
  }
  return displayId
}
