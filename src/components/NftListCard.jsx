import { useEffect, useState } from 'react'
import { UriResolver, GetUriProtocol } from 'components/UriResolver'
import { getMetaData } from 'components/GetMetaData'
import { AddressFormat } from 'components/AddressFormat'
import { DateTime } from 'components/DateTime'
import { Link } from 'react-router-dom'

const CHAIN_ID = process.env.REACT_APP_NETWORK_CHAINID

const NftListCard = props => {
  const token = props.token
  const [tokenName, setTokenName] = useState(null)
  const [tokenImage, setTokenImage] = useState(null)

  const bgParam0 = token.mintBlock * (token.tokenID + 1)
  const bgParam1 = bgParam0.toString(16)
  const bgParam2 = (bgParam0 * bgParam0).toString(16)
  const bgParam3 = (bgParam0 * parseInt(token.minter)).toString(16)
  const bgParam4 = ((CHAIN_ID + 256) * (token.tokenID + 1)).toString(16)
  const bgStyle = {
    background:
      '#' +
      bgParam1.charAt(bgParam1.length - 1) +
      bgParam4.charAt(bgParam4.length - 1) +
      bgParam2.charAt(1) +
      token.contract.id.charAt(token.contract.id.length - 2) +
      bgParam3.charAt(13) +
      token.minter.charAt(token.minter.length - 2) +
      `2f`
  }

  useEffect(() => {
    if (!token) {
      return
    }
    const getTokenMetaData = async () => {
      if (GetUriProtocol(token.tokenURI) === 'http') {
        setTokenName('Blocked From Accessing Insecure HTTP NFT Content')
        setTokenImage('Blocked From Accessing Insecure HTTP NFT Content')
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
    }
    getTokenMetaData()
  }, [token])

  return (
    <li className="item" key={token.id}>
      <Link to={'/view/' + token.contract.id + '/' + token.tokenID}>
        <header>
          <div className="collection" style={bgStyle}>
            <div className="logo">{token.contract.symbol}</div>
            <div className="info">
              <div className="id">
                {token.contract.name} <span>{token.tokenID}</span>
              </div>
              <div className="addr">
                <span alt="{token.contract.id}">{AddressFormat(token.contract.id, 'short', 'raw')}</span>
              </div>
            </div>
          </div>
        </header>

        <main>
          <div className="cover">
            <div className="perfect_square">{tokenImage}</div>
          </div>
        </main>

        <div className="profile">
          <h3>{tokenName}</h3>
          <dl>
            <dd>
              <span className="font-mono">
                <p>Creator: {AddressFormat(token.minter, 'short')}</p>
                <p>{DateTime(token.mintTime * 1000)}</p>
                <p>Owner: {AddressFormat(token.owner.id, 'short')}</p>
              </span>
            </dd>
          </dl>
        </div>
      </Link>
    </li>
  )
}

export default NftListCard
