import { useEffect, useState } from 'react'
import { UriResolver } from 'components/UriResolver'
import { getMetaData } from 'components/GetMetaData'
import { AddressFormat } from 'components/AddressFormat'
import { DateTime } from 'components/DateTime'

const EXPLORER_BASE_URL = process.env.REACT_APP_EXPLORER_URL
const CHAIN_ID = process.env.REACT_APP_NETWORK_CHAINID

const NftSingle = props => {
  const token = props.token
  const [tokenName, setTokenName] = useState(null)
  const [tokenImage, setTokenImage] = useState(null)
  const [tokenDescription, setTokenDescription] = useState(null)

  useEffect(() => {
    if (!token) {
      return
    }
    const getTokenMetaData = async () => {
      const tokenMetaData = await getMetaData(UriResolver(token.tokenURI))

      if (!tokenMetaData.name || !tokenMetaData.image) {
        setTokenName('no name')
        setTokenImage('no image')
      } else {
        setTokenName(tokenMetaData.name)
        const imgUrl = UriResolver(tokenMetaData.image)
        setTokenImage(<img src={imgUrl} alt="" />)
      }
      if (!tokenMetaData.description) {
        setTokenDescription('no description')
      } else {
        setTokenDescription(tokenMetaData.description)
      }
    }
    getTokenMetaData()
  }, [token])

  return (
    <div>
      <header>
        <div>
          <div>{token.contract.symbol}</div>
          <div>
            <div>
              {token.contract.name} <span>{token.tokenID}</span>
            </div>
            <div>
              <span alt="{token.contract.id}">{AddressFormat(token.contract.id)}</span>
            </div>
          </div>
        </div>
      </header>

      <div>{tokenImage}</div>

      <div>
        <h3>{tokenName}</h3>
        <dl>
          <dd>
            <span className="font-mono">
              <p>{tokenDescription}</p>
              <p>Creator: {AddressFormat(token.minter)}</p>
              <p>Created On: {DateTime(token.mintTime * 1000)}</p>
              <p>Owner: {AddressFormat(token.owner.id)}</p>
            </span>
          </dd>
        </dl>
      </div>

      <div>
        <h1 className="font-bold">Chain Info</h1>
        <a href={EXPLORER_BASE_URL + 'tokens/' + token.contract.id + '/instance/' + token.tokenID}>View In Explorer</a>
        <p>Chain ID: {CHAIN_ID}</p>
        <p>Contract Address: {token.contract.id}</p>
        <p>Token ID: {token.tokenID}</p>
        <p>Created On Block: #{token.mintBlock}</p>
      </div>
    </div>
  )
}

export default NftSingle
