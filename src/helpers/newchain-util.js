import base58check from 'base58check'

// config chain ID
const NewChainDevNetId = 1002
const NewChainTestNetId = 1007
const NewChainMainNetId = 1012

const NewChainTestNetRpcUrl = 'https://rpc6.newchain.cloud.diynova.com'
const NewChainMainNetRpcUrl = 'https://cn.rpc.mainnet.diynova.com'

const NewChainTestNetExplorerUrl = 'https://explorer.testnet.newtonproject.org'
const NewChainMainNetExplorerUrl = 'https://explorer.newtonproject.org'

const PREFIX = 'NEW'

/**
 * get explorer url prefix
 * @param {string|number} chainId
 * @return {string}
 */
function getNewChainExplorerUrl(chainId) {
  chainId = parseInt(chainId)
  if (chainId === NewChainMainNetId) {
    return NewChainMainNetExplorerUrl
  }
  if (chainId === NewChainTestNetId) {
    return NewChainTestNetExplorerUrl
  }
  return NewChainMainNetExplorerUrl
}

/**
 * convert hex address to new address.
 * @param {string|undefined} hexAddress
 * @param {number} chainId
 */
function hexAddress2NewAddress(hexAddress, chainId) {
  if (hexAddress === undefined) {
    return ''
  }
  hexAddress = hexAddress.trim()
  if (typeof hexAddress === 'string' && hexAddress.startsWith(PREFIX)) {
    return hexAddress
  }
  if (hexAddress.startsWith('0x')) {
    hexAddress = hexAddress.slice(2)
  }
  if (hexAddress.length !== 40) {
    return ''
  }
  chainId = Number(chainId)
  let data = chainId.toString(16).slice(-8) + hexAddress
  if (data.length % 2 !== 0) {
    data = '0' + data
  }
  return PREFIX + base58check.encode(data)
}

/**
 * convert new address to hex address.
 * @param {string|undefined} newAddress
 * @return {string} hexAddress
 */
function newAddress2HexAddress(newAddress) {
  if (newAddress === undefined) {
    return ''
  }
  newAddress = newAddress.trim()
  if (typeof newAddress === 'string' && newAddress.startsWith(PREFIX) && newAddress.length === 39) {
    try {
      return '0x' + base58check.decode(newAddress.slice(3), 'hex').data.slice(4)
    } catch (e) {
      // console.error(e)
      return ''
    }
  } else {
    return newAddress
  }
}

/**
 * check address is valid NEW address head or not
 * @param {string|undefined} address
 * @returns {boolean}
 */
function isValidNewAddressHead(address) {
  if (address === undefined) {
    return false
  }
  const addressLengthIsLessThanFull = address.length < 39
  const addressIsPrefixWithNEW = address.startsWith(PREFIX)

  return addressLengthIsLessThanFull && addressIsPrefixWithNEW
}

/**
 * check address is valid NEW address or not
 * @param {string|undefined} address
 * @returns {boolean}
 */
function isValidNewAddress(address) {
  if (address === undefined) {
    return false
  }
  if (typeof address === 'string' && address.startsWith(PREFIX) && address.length === 39) {
    const hexAddress = newAddress2HexAddress(address)
    if (hexAddress.length === 42) {
      return true
    }
  }
  return false
}

/**
 * check address is valid HEX address or not
 * @param {string|undefined} address
 * @returns {boolean}
 */
function isValidHexAddress(address) {
  if (address === undefined) {
    return false
  }
  if (typeof address === 'string' && address.startsWith('0x') && address.length === 42) {
    return true
  }
  return false
}

// module.exports = { devChainId, testChainId, mainChainId, hexAddress2NewAddress, newAddress2HexAddress }
export {
  NewChainDevNetId,
  NewChainTestNetId,
  NewChainMainNetId,
  NewChainTestNetRpcUrl,
  NewChainMainNetRpcUrl,
  NewChainTestNetExplorerUrl,
  NewChainMainNetExplorerUrl,
  getNewChainExplorerUrl,
  hexAddress2NewAddress,
  newAddress2HexAddress,
  isValidNewAddressHead,
  isValidNewAddress,
  isValidHexAddress
}
