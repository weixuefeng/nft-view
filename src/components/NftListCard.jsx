import { useEffect, useState } from 'react'
import { UriResolver } from 'components/UriResolver'
import { getMetaData } from 'components/GetMetaData'
import { AddressFormat } from 'components/AddressFormat'
import { DateTime } from 'components/DateTime'

const EXPLORER_BASE_URL = process.env.REACT_APP_EXPLORER_URL

const NftListCard = props => {
  const token = props.token
  const [tokenName, setTokenName] = useState(null)
  const [tokenImage, setTokenImage] = useState(null)

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
    }
    getTokenMetaData()
  }, [token])

  return (
    <li className="item" key={token.id}>
      <header>
        <div className="collection">
          <div className="logo">{token.contract.symbol}</div>
          <div className="info">
            <div className="id">
              {token.contract.name} <span>{token.tokenID}</span>
            </div>
            <div className="addr">
              <span alt="{token.contract.id}">
                <a href={EXPLORER_BASE_URL + 'tokens/' + token.contract.id}>{AddressFormat(token.contract.id)}</a>
              </span>
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
              <p>Creator: {AddressFormat(token.minter)}</p>
              <p>{DateTime(token.mintTime * 1000)}</p>
              <p>Owner: {AddressFormat(token.owner.id)}</p>
            </span>
          </dd>
        </dl>
      </div>
    </li>
  )
}

export default NftListCard
