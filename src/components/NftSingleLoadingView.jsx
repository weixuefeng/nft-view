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

const NftSingleLoadingView = props => {
  return (
    <>
      <div className={'viewer layout-media-cover loader'}>
        <div className="wrapper">
          <header>
            <div className="collection">
              <div className="logo">
                <NewtonCoinIcon />
              </div>
              <div className="info">
                <div className="contract"></div>
              </div>
            </div>
          </header>

          <main>
            <div className="cover"></div>
          </main>
        </div>
      </div>
    </>
  )
}

export default NftSingleLoadingView
