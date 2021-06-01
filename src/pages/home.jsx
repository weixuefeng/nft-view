import { useQuery, QueryClient, QueryClientProvider } from 'react-query'
// import { ReactQueryDevtools } from 'react-query/devtools'
import { request, gql } from 'graphql-request'
import NftListCard from 'components/NftListCard'
import { Link } from 'react-router-dom'

const endpoint = process.env.REACT_APP_API_ENDPOINT
const queryClient = new QueryClient()

function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div class="py-10">
        <header>
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold leading-tight text-gray-900">NFT Explorer</h1>
          </div>
        </header>
        <main>
          <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <Stats />
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
  return useQuery('Stats', async () => {
    const { stats } = await request(
      endpoint,
      gql`
        query {
          stats: alls {
            numTokens
            numOwners
            numTokenContracts
          }
        }
      `
    )
    return stats
  })
}

function Tokens() {
  const { status, data, error, isFetching } = useGetTokens()

  return (
    <div>
      <h1>Tokens</h1>
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
      <h1>Stats</h1>
      {status === 'loading' ? (
        'Loading...'
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          {data.map((stats, index) => (
            <div>
              <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                  <dt class="text-sm font-medium text-gray-500 truncate">NFT TOKENS</dt>
                  <dd class="mt-1 text-3xl font-semibold text-gray-900">{stats.numTokens}</dd>
                </div>

                <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                  <dt class="text-sm font-medium text-gray-500 truncate">NFT CONTRACTS</dt>
                  <dd class="mt-1 text-3xl font-semibold text-gray-900">{stats.numTokenContracts}</dd>
                </div>

                <div class="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                  <dt class="text-sm font-medium text-gray-500 truncate">NFT HOLDERS</dt>
                  <dd class="mt-1 text-3xl font-semibold text-gray-900">{stats.numOwners}</dd>
                </div>
              </dl>
            </div>
          ))}

          {isFetching ? 'Background Updating...' : ''}
        </>
      )}
    </div>
  )
}
