import { useEffect, useState } from 'react'
import { UriResolver, GetUriProtocol } from 'components/UriResolver'
import { getMetaData } from 'components/GetMetaData'
import { AddressFormat } from 'components/AddressFormat'
import { DateTime } from 'components/DateTime'
import { NewtonCoinIcon } from 'components/icons'
import { SearchIcon } from '@heroicons/react/outline'

const EXPLORER_BASE_URL = process.env.REACT_APP_EXPLORER_URL
const CHAIN_ID = process.env.REACT_APP_NETWORK_CHAINID

const NftSingle = props => {
  const token = props.token
  const [tokenName, setTokenName] = useState(null)
  const [tokenImage, setTokenImage] = useState(null)
  const [tokenDescription, setTokenDescription] = useState(null)
  const [layoutType, setLayoutType] = useState(null)
  const [layoutCount, setLayoutCount] = useState(0)

  useEffect(() => {
    if (!token) {
      return
    }

    const getTokenMetaData = async () => {
      if (GetUriProtocol(token.tokenURI) === 'http') {
        setTokenName('Blocked From Accessing Insecure HTTP NFT Content')
        setTokenImage('Blocked From Accessing Insecure HTTP NFT Content')
        setTokenDescription('Blocked From Accessing Insecure HTTP NFT Content')
        return
      }

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

    switch (layoutCount) {
      case 0:
        setLayoutType('layout-raw-address')
        break
      case 1:
        setLayoutType('layout-big-title')
        break
      case 4:
        setLayoutType('layout-media-cover')
        break
      default:
        // setLayoutType('layout-post')
        setLayoutType('layout-raw-address')
    }
  }, [token])

  return (
    <>
      <div className={'viewer ' + layoutType}>
        <div className="wrapper">
          <header>
            <div className="collection">
              <div className="logo">
                <NewtonCoinIcon />
              </div>
              <div className="info">
                <div className="contract">
                  {token.contract.name} <span>{token.tokenID}</span>
                </div>
                <div className="addr">
                  <span alt={token.contract.id}>{AddressFormat(token.contract.id)}</span>
                </div>
              </div>
            </div>
          </header>

          <section className="token-basic">
            <dl>
              <dt>Created On</dt>
              <dd>{DateTime(token.mintTime * 1000)}</dd>
            </dl>
            <dl>
              <dt>Created By</dt>
              <dd>{AddressFormat(token.minter)}</dd>
            </dl>
            <dl></dl>
            <dl>
              <dt>Current Holder</dt>
              <dd>{AddressFormat(token.owner.id)}</dd>
            </dl>
          </section>

          <main>
            <h1>{tokenName}</h1>

            <div className="cover">{tokenImage}</div>

            <div className="content">{tokenDescription}</div>
          </main>

          <section className="chain-data">
            <h4>Chain Info</h4>
            <dl>
              <dt>Contract Address</dt>
              <dd>{token.contract.id}</dd>
            </dl>
            <div>
              <dl>
                <dt>Token ID</dt>
                <dd>{token.tokenID}</dd>
              </dl>
              <dl>
                <dt>Created On Block</dt>
                <dd>{token.mintBlock}</dd>
              </dl>
            </div>
            <dl>
              <dt>Token URI</dt>
              <dd>{token.tokenURI}</dd>
            </dl>
          </section>

          <footer>
            <div hidden>
              <SearchIcon className="w-10 h-10" />
            </div>
            <a href={EXPLORER_BASE_URL + 'tokens/' + token.contract.id + '/instance/' + token.tokenID}>
              View In Explorer
            </a>
          </footer>
        </div>
      </div>
    </>
  )
}

export default NftSingle
