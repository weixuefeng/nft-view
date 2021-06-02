export function AddressFormat(address = '') {
  let displayAddress = address
  if (displayAddress === '0x0000000000000000000000000000000000000000') {
    return '0x0'
  }
  displayAddress = displayAddress.substr(0, 6) + '···' + displayAddress.substr(-4)
  return displayAddress
}
