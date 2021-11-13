import { useQuery, QueryClient, QueryClientProvider } from 'react-query'
// import { ReactQueryDevtools } from 'react-query/devtools'
import { request, gql } from 'graphql-request'
import { Link } from 'react-router-dom'
import { AddressFormat, TokenIdFormat, ContractNameFormat, ContractSymbolFormat } from 'components/AddressFormat'
import { RelativeTime, DateTime } from 'components/DateTime'
import { ExternalLinkIcon, ArrowSmRightIcon } from '@heroicons/react/outline'
import NumberFormat from 'react-number-format'

const CHAIN_ID = process.env.REACT_APP_NETWORK_CHAINID
const EXPLORER_BASE_URL = process.env.REACT_APP_EXPLORER_URL
const endpoint = process.env.REACT_APP_API_ENDPOINT
const endpoint2 = process.env.REACT_APP_API_ENDPOINT_2
const queryClient = new QueryClient()
const zeroAddress = '0x0000000000000000000000000000000000000000'

function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="pb-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold leading-tight">NFT Viewer</h1>
            <h4>Network ChainID: {CHAIN_ID}</h4>
          </div>
        </header>
        <main>
          <Stats />

          <div className="max-w-7xl py-4 mx-auto sm:px-6 lg:px-8">
            <Transfers />
          </div>
        </main>
      </div>

      {/* <ReactQueryDevtools initialIsOpen /> */}
    </QueryClientProvider>
  )
}

export default Home

function useGetStats() {
  return useQuery(
    'Stats',
    async () => {
      const { stats } = await request(
        endpoint,
        gql`
          query {
            stats: alls {
              numTokens
              numOwners
              numTokenContracts
              numTransfers
            }
          }
        `
      )
      return stats
    },
    {
      refetchInterval: 3000
    }
  )
}

function useGetTransfers() {
  return useQuery(
    'Transfers',
    async () => {
      const { transfers } = await request(
        endpoint2,
        gql`
          query {
            transfers(orderBy: timestamp, orderDirection: desc, first: 300) {
              id
              from {
                id
              }
              to {
                id
              }
              token {
                tokenID
                registry {
                  id
                  name
                  symbol
                }
              }
              transaction {
                id
                blockNumber
                timestamp
              }
            }
          }
        `
      )
      return transfers
    },
    {
      refetchInterval: 3000
    }
  )
}

function Stats() {
  const { status, data, error, isFetching } = useGetStats()

  return (
    <div>
      {status === 'loading' ? (
        <div className="home-stats">
          <div className="wrapper">
            <div className="animate-pulse">
              <dl>
                <div>
                  <dt>TOKENS</dt>
                  <dd>-</dd>
                </div>
                <div>
                  <dt>CONTRACTS</dt>
                  <dd>-</dd>
                </div>
                <div>
                  <dt>HOLDERS</dt>
                  <dd>-</dd>
                </div>
                <div>
                  <dt>TRANSFERS</dt>
                  <dd>-</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          <div className="home-stats">
            <div className="wrapper">
              {isFetching ? <div className="loading-dot" /> : ''}
              {data.map((stats, index) => (
                <div key={index}>
                  <dl>
                    <div>
                      <dt>TOKENS</dt>
                      <dd>
                        <NumberFormat
                          value={stats.numTokens}
                          displayType={'text'}
                          thousandSeparator={true}
                          renderText={value => <>{value}</>}
                        />
                      </dd>
                    </div>
                    <div>
                      <dt>CONTRACTS</dt>
                      <dd>
                        <NumberFormat
                          value={stats.numTokenContracts}
                          displayType={'text'}
                          thousandSeparator={true}
                          renderText={value => <>{value}</>}
                        />
                      </dd>
                    </div>
                    <div>
                      <dt>HOLDERS</dt>
                      <dd>
                        <NumberFormat
                          value={stats.numOwners}
                          displayType={'text'}
                          thousandSeparator={true}
                          renderText={value => <>{value}</>}
                        />
                      </dd>
                    </div>
                    <div>
                      <dt>TRANSFERS</dt>
                      <dd>
                        <NumberFormat
                          value={stats.numTransfers}
                          displayType={'text'}
                          thousandSeparator={true}
                          renderText={value => <>{value}</>}
                        />
                      </dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Transfers() {
  const { status, data, error, isFetching } = useGetTransfers()

  return (
    <div>
      <header className="home-table">
        <h3 className="text-xl font-bold leading-tight">
          Transfers {isFetching ? <div className="loading-dot" /> : ''}
        </h3>
      </header>
      <h4>Latest 300 Transfers</h4>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th>Token Contract</th>
                    <th>TokenID</th>
                    <th className="text-right">
                      From <ArrowSmRightIcon className="ic" />
                    </th>
                    <th>To</th>
                    <th>Time</th>
                    <th>Txn Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {status === 'loading' ? (
                    <tr>
                      <td colSpan="6">Loading</td>
                    </tr>
                  ) : status === 'error' ? (
                    <span>Error: {error.message}</span>
                  ) : (
                    <>
                      {data.map((transfer, index) => (
                        <tr key={index}>
                          <td
                            title={
                              transfer.token.registry.name +
                              ' ' +
                              transfer.token.registry.symbol +
                              ' ' +
                              transfer.token.registry.id
                            }
                          >
                            {ContractNameFormat(transfer.token.registry.name)} (
                            {ContractSymbolFormat(transfer.token.registry.symbol)})
                          </td>
                          <td className="mono" title={transfer.token.tokenID}>
                            {transfer.to.id === zeroAddress ? (
                              TokenIdFormat(transfer.token.tokenID)
                            ) : (
                              <Link to={'/view/' + transfer.token.registry.id + '/' + transfer.token.tokenID}>
                                {TokenIdFormat(transfer.token.tokenID)}
                              </Link>
                            )}
                          </td>
                          <td title={transfer.from.id} className="mono text-right">
                            {AddressFormat(transfer.from.id, 'short')} <ArrowSmRightIcon className="ic" />
                          </td>
                          <td title={transfer.to.id} className="mono">
                            {AddressFormat(transfer.to.id, 'short')}
                          </td>
                          <td title={DateTime(transfer.transaction.timestamp * 1000)}>
                            {RelativeTime(transfer.transaction.timestamp * 1000)}
                          </td>
                          <td title={transfer.transaction.id + '(block:' + transfer.id + ')'} className="mono">
                            <a
                              href={EXPLORER_BASE_URL + 'tx/' + transfer.transaction.id}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                            >
                              {AddressFormat(transfer.transaction.id, 'short', 'raw')}
                            </a>
                            <ExternalLinkIcon className="ic" />
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
