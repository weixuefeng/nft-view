import React from 'react'
import ReactDOM from 'react-dom'
import './theme/style.scss'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { NetworkContextName } from './constant/constant'
import getLibrary from 'helpers/getLibrary'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

// if ('ethereum' in window) {
//   ;(window.ethereum).autoRefreshOnNetworkChange = false
// }

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Web3ProviderNetwork getLibrary={getLibrary}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Web3ProviderNetwork>
  </Web3ReactProvider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
