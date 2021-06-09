import { useQuery, QueryClient, QueryClientProvider } from 'react-query'
// import { ReactQueryDevtools } from 'react-query/devtools'
import { request, gql } from 'graphql-request'
import NftListCard from 'components/NftListCard'
import { Link } from 'react-router-dom'
import { AddressFormat } from 'components/AddressFormat'
import { RelativeTime, DateTime } from 'components/DateTime'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import { Helmet } from 'react-helmet-async'

const EXPLORER_BASE_URL = process.env.REACT_APP_EXPLORER_URL
const endpoint = process.env.REACT_APP_API_ENDPOINT
const endpoint2 = process.env.REACT_APP_API_ENDPOINT_2
const queryClient = new QueryClient()

function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight">NFT Explorer</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <Stats />
            <Transfers />
            <Tokens />
          </div>
        </main>
      </div>

      {/* <ReactQueryDevtools initialIsOpen /> */}
    </QueryClientProvider>
  )
}

export default Home

function useGetTokens() {
  return useQuery('AllTokens', async () => {
    const { tokens } = await request(
      endpoint,
      gql`
        query {
          tokens(first: 12, orderBy: mintTime, orderDirection: desc) {
            id
            tokenID
            mintTime
            tokenURI
            minter
            owner {
              id
            }
            contract {
              id
              name
              symbol
            }
          }
        }
      `
    )
    return tokens
  })
}

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
            transfers(orderBy: timestamp, orderDirection: desc, first: 10) {
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

function Tokens() {
  const { status, data, error, isFetching } = useGetTokens()

  return (
    <div>
      <Helmet>
        <title>NFT Explorer</title>
      </Helmet>
      <h1>New Tokens</h1>
      <Link to="/all">View All NFTs</Link>
      <div>
        {status === 'loading' ? (
          'Loading...'
        ) : status === 'error' ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            <ul className="list nft_card_list">
              {data.map((token, index) => (
                <NftListCard token={token} key={token.id + '-' + index} />
              ))}
            </ul>
            {isFetching ? 'Background Updating...' : ''}
          </>
        )}
      </div>
    </div>
  )
}

function Stats() {
  const { status, data, error, isFetching } = useGetStats()

  return (
    <div>
      <h1>Stats {isFetching ? 'Updating...' : ''}</h1>
      {status === 'loading' ? (
        'Loading...'
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          {data.map((stats, index) => (
            <div key={index}>
              <dl className="mt-5 grid grid-cols-1 gap-5 grid-cols-2 sm:grid-cols-4">
                <div className="px-4 py-5 bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden sm:p-6">
                  <dt className="text-sm font-medium truncate">NFT TOKENS</dt>
                  <dd className="mt-1 text-3xl font-semibold">{stats.numTokens}</dd>
                </div>

                <div className="px-4 py-5 bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden sm:p-6">
                  <dt className="text-sm font-medium truncate">NFT CONTRACTS</dt>
                  <dd className="mt-1 text-3xl font-semibold">{stats.numTokenContracts}</dd>
                </div>

                <div className="px-4 py-5 bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden sm:p-6">
                  <dt className="text-sm font-medium truncate">NFT HOLDERS</dt>
                  <dd className="mt-1 text-3xl font-semibold">{stats.numOwners}</dd>
                </div>

                <div className="px-4 py-5 bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden sm:p-6">
                  <dt className="text-sm font-medium truncate">NFT TRANSFERS</dt>
                  <dd className="mt-1 text-3xl font-semibold">{stats.numTransfers}</dd>
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
      <h1>Latest Transfers {isFetching ? 'Updating...' : ''}</h1>

      {status === 'loading' ? (
        'Loading...'
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : (
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
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
