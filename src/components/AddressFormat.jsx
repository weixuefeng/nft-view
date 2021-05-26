export function AddressFormat(address = '') {
  let displayAddress = address
  displayAddress = displayAddress.substr(0, 6) + '···' + displayAddress.substr(-4)
  return displayAddress
}
