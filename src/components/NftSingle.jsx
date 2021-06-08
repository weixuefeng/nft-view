import { useEffect, useState } from 'react'
import { UriResolver, GetUriProtocol } from 'components/UriResolver'
import { getMetaData } from 'components/GetMetaData'
import { AddressFormat } from 'components/AddressFormat'
import { DateTime } from 'components/DateTime'
import { NewtonCoinIcon } from 'components/icons'
import { SearchIcon } from '@heroicons/react/outline'

const EXPLORER_BASE_URL = process.env.REACT_APP_EXPLORER_URL
const CHAIN_ID = process.env.REACT_APP_NETWORK_CHAINID
let layoutNumber = 0

const NftSingle = props => {
  const token = props.token
  const [tokenName, setTokenName] = useState(null)
  const [tokenImage, setTokenImage] = useState(null)
  const [tokenDescription, setTokenDescription] = useState(null)
  const [layoutType, setLayoutType] = useState('layout-post')

  useEffect(() => {
    layoutNumber = 0
    if (!token) {
      return
    }

    const getTokenMetaData = async () => {
      if (GetUriProtocol(token.tokenURI) === 'http') {
        setTokenName('Blocked From Accessing Insecure HTTP NFT Content')
        setLayoutType('layout-raw-address')
        return
      }

      const tokenMetaData = await getMetaData(UriResolver(token.tokenURI))

      if (!tokenMetaData.name || tokenMetaData.name === '') {
        setTokenName('')
      } else {
        setTokenName(tokenMetaData.name)
        layoutNumber = layoutNumber + 1
      }

      if (!tokenMetaData.description || tokenMetaData.description === '') {
        setTokenDescription('')
      } else {
        setTokenDescription(
          tokenMetaData.description.split(/\n+|<br \/>+|<br\/>+|<br>+/).map((str, index) => <p key={index}>{str}</p>)
        )
        layoutNumber = layoutNumber + 2
      }

      if (!tokenMetaData.image || tokenMetaData.image === '') {
        setTokenImage('')
      } else {
        const imgUrl = UriResolver(tokenMetaData.image)
        setTokenImage(<img src={imgUrl} alt="" />)
        layoutNumber = layoutNumber + 4
      }

      switch (layoutNumber) {
        case 0:
          setLayoutType('layout-raw-address')
          setTokenName(CHAIN_ID + ':' + token.contract.id + '/' + token.tokenID)
          break
        case 1:
          setLayoutType('layout-big-title')
          break
        case 2:
          setLayoutType('layout-no-title')
          break
        case 4:
          setLayoutType('layout-media-cover')
          break
        default:
          setLayoutType('layout-post')
          break
      }
    }

    getTokenMetaData()
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
                  <span alt={token.contract.id}>{CHAIN_ID + ':'}<span className="mono">{AddressFormat(token.contract.id)}</span></span>
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
              <dd className='mono'>{AddressFormat(token.minter)}</dd>
            </dl>
            <dl></dl>
            <dl>
              <dt>Current Holder</dt>
              <dd className='mono'>{AddressFormat(token.owner.id)}</dd>
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
              <dd className='mono'>{token.contract.id}</dd>
            </dl>
            <div>
              <dl>
                <dt>Token Name</dt>
                <dd>{token.contract.name}</dd>
              </dl>
              <dl>
                <dt>Token Symbol</dt>
                <dd>{token.contract.symbol}</dd>
              </dl>
            </div>
            <div>
              <dl>
                <dt>Token ID</dt>
                <dd className='mono'>{token.tokenID}</dd>
              </dl>
              <dl>
                <dt>Created On Block</dt>
                <dd className='mono'>{token.mintBlock}</dd>
              </dl>
            </div>
            <dl>
              <dt>Token URI</dt>
              <dd className='mono'>{token.tokenURI}</dd>
            </dl>
          </section>

          <footer>
            <div>
              <a
                href={EXPLORER_BASE_URL + 'tokens/' + token.contract.id + '/instance/' + token.tokenID}
                className="button"
              >
                <SearchIcon />
                <p>View In Explorer</p>
              </a>
            </div>
          </footer>
        </div>
      </div>
    </>
  )
}

export default NftSingle
