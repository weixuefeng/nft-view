import { useEffect, useState } from 'react'
import { UriResolver, GetUriProtocol } from 'components/UriResolver'
import { getMetaData } from 'components/GetMetaData'
import { AddressFormat, TokenIdFormat, ContractNameFormat } from 'components/AddressFormat'
import { DateTime } from 'components/DateTime'
import { NewtonCoinIcon } from 'components/icons'
import { SearchIcon, ShareIcon } from '@heroicons/react/outline'
import { Helmet } from 'react-helmet-async'
import { injected } from 'connectors'
import { useWeb3React } from '@web3-react/core'
import { hasShare, hasVibrate } from 'utils/hasHTML5API'

import Transfer721 from 'modals/Transfer721'
import ViewTransfers from 'modals/ViewTransfers'

const EXPLORER_BASE_URL = process.env.REACT_APP_EXPLORER_URL
const CHAIN_ID = process.env.REACT_APP_NETWORK_CHAINID
let layoutNumber = 0

const NftSingle = props => {
  const token = props.token
  const [tokenName, setTokenName] = useState(null)
  const [tokenImage, setTokenImage] = useState(null)
  const [tokenDescription, setTokenDescription] = useState(null)
  const [layoutType, setLayoutType] = useState('layout-post')
  const [pageTitle, setPageTitle] = useState('Loading: ' + token.contract.id + '-' + token.tokenID)

  const bgParam0 = token.mintBlock * (token.tokenID + 1)
  const bgParam1 = bgParam0.toString(16)
  const bgParam2 = (bgParam0 * bgParam0).toString(16)
  const bgParam3 = (bgParam0 * parseInt(token.minter)).toString(16)
  const bgParam4 = ((parseInt(CHAIN_ID) + 256) * (token.tokenID + 1)).toString(16)
  let bgStyle = {
    backgroundColor:
      '#' +
      bgParam1.charAt(bgParam1.length - 1) +
      bgParam4.charAt(bgParam4.length - 1) +
      bgParam2.charAt(1) +
      token.contract.id.charAt(token.contract.id.length - 2) +
      bgParam3.charAt(13) +
      token.minter.charAt(token.minter.length - 2)
  }

  function share() {
    if (!('share' in navigator)) {
      alert('Web Share API not supported.')
      return
    }

    navigator.share({
      title: pageTitle,
      text: pageTitle,
      url: window.location.href
    })
    // .then(() => console.log('Successful share'))
    // .catch(error => console.log('Error sharing:', error))
  }

  const [bgImgCover, setBgImgCover] = useState(bgStyle)

  useEffect(() => {
    layoutNumber = 0
    if (!token) {
      return
    }

    const getTokenMetaData = async () => {
      if (GetUriProtocol(token.tokenURI) === 'http') {
        setTokenName('Blocked From Accessing Insecure HTTP NFT Content')
        setPageTitle(token.contract.id + '-' + token.tokenID)
        setLayoutType('layout-raw-address')
        return
      }

      const tokenMetaData = await getMetaData(UriResolver(token.tokenURI))

      if (!tokenMetaData.name || tokenMetaData.name === '') {
        setTokenName('')
        setPageTitle(token.contract.name + ': #' + token.tokenID)
      } else {
        setTokenName(tokenMetaData.name)
        setPageTitle(tokenMetaData.name + ' (' + token.contract.name + ': #' + token.tokenID + ')')
        layoutNumber = layoutNumber + 1
      }

      if (!tokenMetaData.description || tokenMetaData.description === '') {
        setTokenDescription('')
      } else {
        setTokenDescription(
          <div className="content">
            {tokenMetaData.description.split(/\n+|<br \/>+|<br\/>+|<br>+/).map((str, index) => (
              <p key={index}>{str}</p>
            ))}
          </div>
        )
        layoutNumber = layoutNumber + 2
      }

      if (!tokenMetaData.image || tokenMetaData.image === '') {
        setTokenImage('')
      } else {
        const imgUrl = UriResolver(tokenMetaData.image)
        setTokenImage(
          <div className="cover">
            <img src={imgUrl} alt="" />
          </div>
        )

        setBgImgCover({
          backgroundImage: `url(${imgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        })

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

  const web3Context = useWeb3React()
  const { account, chainId, activate } = web3Context

  const connnectWallet = () => {
    activate(injected, error => {
      window.alert(error)
    })
  }

  // const disconnectWallet = () => {
  //   deactivate()
  //   // window.alert('disconnected')
  // }
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <div className={'viewer ' + layoutType}>
        <div className="wrapper" style={bgImgCover}>
          <div className="ol"></div>
          <div className="inner">
            <header>
              <div className="collection">
                <div className="logo">
                  <NewtonCoinIcon />
                </div>
                <div className="info">
                  <div className="contract">
                    {ContractNameFormat(token.contract.name)}{' '}
                    <span title={token.tokenID}>{TokenIdFormat(token.tokenID)}</span>
                  </div>
                  <div className="addr">
                    <span alt={token.contract.id}>
                      {CHAIN_ID + ':'}
                      <span className="mono">{AddressFormat(token.contract.id, 'short', 'raw')}</span>
                    </span>
                  </div>
                </div>
              </div>
            </header>

            <section className="token-basic">
              <dl>
                <dt>Creation Time</dt>
                <dd>{DateTime(token.mintTime * 1000)}</dd>
              </dl>
              <dl>
                <dt>Creator</dt>
                <dd className="mono">{AddressFormat(token.minter, 'short')}</dd>
              </dl>
              <dl></dl>
              <dl>
                <dt>Holder</dt>
                <dd className="mono">{AddressFormat(token.owner.id, 'short')}</dd>
              </dl>
            </section>

            <main>
              <h1>{tokenName}</h1>
              {tokenImage}
              {tokenDescription}
            </main>

            <section className="chain-data">
              <details>
                <summary onClick={() => hasVibrate() && navigator.vibrate(75)}>Chain Info</summary>
                <div>
                  <dl>
                    <dt>Contract Address</dt>
                    <dd className="mono">{token.contract.id}</dd>
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
                      <dd className="mono">{token.tokenID}</dd>
                    </dl>
                    <dl>
                      <dt>Created On Block</dt>
                      <dd className="mono">{token.mintBlock}</dd>
                    </dl>
                  </div>
                  <dl hidden={!!(!token.tokenURI || token.tokenURI === '')}>
                    <dt>Token URI</dt>
                    <dd className="mono">{token.tokenURI}</dd>
                  </dl>
                </div>
              </details>
            </section>
          </div>
        </div>
      </div>
      <div id="viewer-nav">
        <div>
          <a
            href={EXPLORER_BASE_URL + 'tokens/' + token.contract.id + '/instance/' + token.tokenID}
            className="button"
            target="_blank"
            rel="noreferrer"
          >
            <SearchIcon />
          </a>
        </div>
        <div>
          <ViewTransfers tokenID={token.id} />
        </div>
        <div hidden={!hasShare()}>
          <button onClick={() => share()} className="button">
            <ShareIcon />
          </button>
        </div>
      </div>
      <div className="flex-auto flex space-x-3">
        {
          !!(typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined') ? (
            !!account ? (
              ''
            ) : (
              // <button onClick={disconnectWallet} type="button" className="primary red">
              //   Disconnect<span hidden>{AddressFormat(account, 'short')}</span>
              // </button>
              <button onClick={connnectWallet} type="button" className="connect-wallet">
                Connect Wallet
              </button>
            )
          ) : (
            ''
          )
          // const provider = window['ethereum'] || window.web3.currentProvider
        }
      </div>
      {!!(account && account.toLowerCase() === token.owner.id && CHAIN_ID === chainId.toString()) && (
        <Transfer721 contractID={token.contract.id} tokenID={token.tokenID} />
      )}
    </>
  )
}

export default NftSingle
