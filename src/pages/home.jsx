import { useQuery, QueryClient, QueryClientProvider } from 'react-query'
// import { ReactQueryDevtools } from 'react-query/devtools'
import { request, gql } from 'graphql-request'
import { Link } from 'react-router-dom'
import { AddressFormat } from 'components/AddressFormat'
import { RelativeTime, DateTime } from 'components/DateTime'
import { ExternalLinkIcon } from '@heroicons/react/outline'

const CHAIN_ID = process.env.REACT_APP_NETWORK_CHAINID
const EXPLORER_BASE_URL = process.env.REACT_APP_EXPLORER_URL
const endpoint = process.env.REACT_APP_API_ENDPOINT
const endpoint2 = process.env.REACT_APP_API_ENDPOINT_2
const queryClient = new QueryClient()

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
          <div className="home-stats">
            <div className="wrapper">
              <Stats />
            </div>
          </div>

          <div className="max-w-7xl py-4 mx-auto sm:px-6 lg:px-8">
            <header>
              <h3 className="text-xl font-bold leading-tight">Transfers</h3>
            </header>
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
            transfers(orderBy: timestamp, orderDirection: desc, first: 25) {
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
      refetchInterval: 1000
    }
  )
}

function Stats() {
  const { status, data, error, isFetching } = useGetStats()

  return (
    <div>
      {status === 'loading' ? (
        <div className="animate-pulse">
          <dl>
            <div>
              <dt>NFT TOKENS</dt>
              <dd>-</dd>
            </div>
            <div>
              <dt>NFT CONTRACTS</dt>
              <dd>-</dd>
            </div>
            <div>
              <dt>NFT HOLDERS</dt>
              <dd>-</dd>
            </div>
            <div>
              <dt>NFT TRANSFERS</dt>
              <dd>-</dd>
            </div>
          </dl>
        </div>
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          {data.map((stats, index) => (
            <div key={index}>
              <dl>
                <div>
                  <dt>NFT TOKENS {isFetching ? 'Updating...' : ''}</dt>
                  <dd>{stats.numTokens}</dd>
                </div>
                <div>
                  <dt>NFT CONTRACTS {isFetching ? 'Updating...' : ''}</dt>
                  <dd>{stats.numTokenContracts}</dd>
                </div>
                <div>
                  <dt>NFT HOLDERS {isFetching ? 'Updating...' : ''}</dt>
                  <dd>{stats.numOwners}</dd>
                </div>
                <div>
                  <dt>NFT TRANSFERS {isFetching ? 'Updating...' : ''}</dt>
                  <dd>{stats.numTransfers}</dd>
                </div>
              </dl>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

function Transfers() {
  const { status, data, error, isFetching } = useGetTransfers()

  return (
    <div>
      <h4>Latest Transfers {isFetching ? 'Updating...' : ''}</h4>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th>Token Contract</th>
                    <th>TokenID</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Time</th>
                    <th>Txn Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {status === 'loading' ? (
                    'Loading...'
                  ) : status === 'error' ? (
                    <span>Error: {error.message}</span>
                  ) : (
                    <>
                      {data.map((transfer, index) => (
                        <tr key={index}>
                          <td title={transfer.token.registry.id}>
                            {transfer.token.registry.name} ({transfer.token.registry.symbol})
                          </td>
                          <td className="mono">
                            <Link to={'/view/' + transfer.token.registry.id + '/' + transfer.token.tokenID}>
                              {transfer.token.tokenID}
                            </Link>
                          </td>
                          <td className="mono">{AddressFormat(transfer.from.id, 'short')}</td>
                          <td className="mono">{AddressFormat(transfer.to.id, 'short')}</td>
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
