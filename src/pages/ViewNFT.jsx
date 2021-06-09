import { useParams } from 'react-router-dom'
import { useQuery, QueryClient, QueryClientProvider } from 'react-query'
import { request, gql } from 'graphql-request'
import NftSingle from 'components/NftSingle'
import NftSingleLoadingView from 'components/NftSingleLoadingView'

const endpoint = process.env.REACT_APP_API_ENDPOINT
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 0
    }
  }
})

function ViewNFT() {
  return (
    <QueryClientProvider client={queryClient}>
      <Token />
      {/* <ReactQueryDevtools initialIsOpen /> */}
    </QueryClientProvider>
  )
}

export default ViewNFT

function useGetSingle(tokenID = '') {
  return useQuery('SingleToken', async () => {
    const { token } = await request(
      endpoint,
      gql`
        query {
          token(id:"${tokenID.toString()}") {
            id
            tokenID
            mintTime
            mintBlock
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

    if (token === null) {
      return 'null'
    }

    return token
  })
}

function Token() {
  let { contract, id } = useParams()
  contract = contract === null ? '' : contract
  id = id === null ? '' : id
  const lookTokenID = contract.toLowerCase() + '-' + id

  const { status, data, error, isFetching } = useGetSingle(lookTokenID)

  return (
    <div>
      {status === 'loading' ? (
        <NftSingleLoadingView />
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : isFetching ? (
        <NftSingleLoadingView />
      ) : data === null || data.id === undefined ? (
        'does not exist...'
      ) : (
        <NftSingle token={data} />
      )}
    </div>
  )
}
