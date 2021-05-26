import { useQuery, QueryClient, QueryClientProvider } from 'react-query'
// import { ReactQueryDevtools } from 'react-query/devtools'
import { request, gql } from 'graphql-request'
import NftListCard from 'components/NftListCard'

const endpoint = 'https://graph.newton.bio/subgraphs/name/testnet/nrc7v1'
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tokens />
      {/* <ReactQueryDevtools initialIsOpen /> */}
    </QueryClientProvider>
  )
}

export default App

function useGetTokens() {
  return useQuery('AllTokens', async () => {
    const { tokens } = await request(
      endpoint,
      gql`
        query {
          tokens(first: 1000, orderBy: mintTime, orderDirection: desc) {
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

function Tokens() {
  const { status, data, error, isFetching } = useGetTokens()

  return (
    <div>
      <h1>Tokens</h1>
      <div>
        {status === 'loading' ? (
          'Loading...'
        ) : status === 'error' ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            <ul className="list nft_card_list">
              {data.map((token, index) => (
                <NftListCard token={token} key={token.id + '_' + index} />
              ))}
            </ul>
            {isFetching ? 'Background Updating...' : ''}
          </>
        )}
      </div>
    </div>
  )
}
