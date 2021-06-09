import { useQuery, QueryClient, QueryClientProvider } from 'react-query'
// import { ReactQueryDevtools } from 'react-query/devtools'
import { request, gql } from 'graphql-request'
import NftListCard from 'components/NftListCard'
import { Helmet } from 'react-helmet-async'

const endpoint = process.env.REACT_APP_API_ENDPOINT
const queryClient = new QueryClient()

function AllNFTs() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tokens />
      {/* <ReactQueryDevtools initialIsOpen /> */}
    </QueryClientProvider>
  )
}

export default AllNFTs

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
            mintBlock
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
      <Helmet>
        <title>NFTs</title>
      </Helmet>
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
